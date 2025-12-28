/**
 * Subscription Tier Enforcement Middleware
 * 
 * Following "It Just Works" principle - Safety-first development
 * Enforces subscription limits with grace period support
 * 
 * Key Features:
 * - Multi-tenant isolation (always check companyId)
 * - Grace period logic (48 hours after cancellation)
 * - Fail-safe defaults (allow access if uncertain)
 * - Comprehensive logging for audit trail
 */

import type { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { TIER_CONFIG, type TierName } from '../shared/stripe-config';

/**
 * Check if user has exceeded their subscription limits
 * Returns { exceeded: boolean, limits: object, usage: object }
 */
export async function checkSubscriptionLimits(userId: string): Promise<{
  exceeded: boolean;
  limits: {
    maxProjects: number;
    maxSeats: number;
  };
  usage: {
    currentProjects: number;
    currentEmployees: number;
  };
  withinGracePeriod?: boolean;
  gracePeriodEndsAt?: Date;
  isTrialing?: boolean;
}> {
  try {
    const user = await storage.getUserById(userId);
    if (!user || user.role !== 'company') {
      // Non-company users have no limits
      return {
        exceeded: false,
        limits: { maxProjects: -1, maxSeats: -1 },
        usage: { currentProjects: 0, currentEmployees: 0 },
      };
    }

    // Determine tier limits
    const tier = user.subscriptionTier as TierName | null;
    let maxProjects = 0;
    let maxSeats = 0;

    // Check if company is in trial period - unlimited seats during trial
    // Still count actual usage for accurate telemetry/dashboards
    const isTrialing = user.subscriptionStatus === 'trialing';
    if (isTrialing) {
      console.log(`[Subscription] Company ${user.id} is in trial period - unlimited seats allowed`);
      // Continue to count usage below, but limits will be unlimited
    }

    if (tier && TIER_CONFIG[tier]) {
      const tierConfig = TIER_CONFIG[tier];
      const baseLimits = {
        projects: tierConfig.maxProjects as number,
        seats: tierConfig.maxSeats as number,
      };
      
      // Add purchased add-ons and gifted seats to base limits
            const paidSeats = user.additionalSeatsCount || 0;
      const giftedSeats = user.giftedSeatsCount || 0;
      const totalAdditionalSeats = paidSeats + giftedSeats;
      
      // Calculate total limits (handle unlimited tier)
      maxProjects = baseLimits.projects === -1 
        ? -1 
        : baseLimits.projects; // Projects now unlimited in new model
      
      maxSeats = baseLimits.seats === -1 
        ? -1 
        : baseLimits.seats + totalAdditionalSeats;
      
      console.log(`[Subscription] Company ${user.id} limits - Base: ${baseLimits.projects}p/${baseLimits.seats}s, Add-ons: +${paidSeats}paid+${giftedSeats}gifted seats, Total: ${maxProjects}p/${maxSeats}s`);
    } else if (user.subscriptionStatus === 'canceled' && user.subscriptionEndDate) {
      // Grace period check - 48 hours after subscription end
      const endDate = new Date(user.subscriptionEndDate);
      const gracePeriodEnd = new Date(endDate.getTime() + (48 * 60 * 60 * 1000)); // 48 hours
      const now = new Date();

      if (now < gracePeriodEnd) {
        // Still within grace period - allow previous tier limits
        console.log(`[Subscription] Company ${user.id} in grace period until ${gracePeriodEnd.toISOString()}`);
        return {
          exceeded: false,
          limits: { maxProjects: -1, maxSeats: -1 }, // Allow everything during grace period
          usage: { currentProjects: 0, currentEmployees: 0 },
          withinGracePeriod: true,
          gracePeriodEndsAt: gracePeriodEnd,
        };
      } else {
        // Grace period expired - read-only mode
        console.warn(`[Subscription] Company ${user.id} grace period expired. Read-only mode.`);
        maxProjects = 0;
        maxSeats = 0;
      }
    } else {
      // No active subscription and not in grace period
      // FAIL-SAFE: Allow minimal access for emergency situations
      console.warn(`[Subscription] Company ${user.id} has no active subscription. Allowing minimal access.`);
      maxProjects = 1; // Allow at least 1 project
      maxSeats = 2; // Allow at least 2 seats (owner + 1)
    }

    // Count current usage (multi-tenant safe)
    const employees = await storage.getAllEmployees(user.id);
    const projects = await storage.getProjectsByCompany(user.id);

    const currentEmployees = employees.length;
    const currentProjects = projects.length;

    // If trialing, override limits to unlimited but keep usage counts accurate
    if (isTrialing) {
      return {
        exceeded: false,
        limits: { maxProjects: -1, maxSeats: -1 }, // Unlimited during trial
        usage: { currentProjects, currentEmployees }, // Accurate counts for telemetry
        isTrialing: true,
      };
    }

    // Check if limits exceeded
    const projectsExceeded = maxProjects !== -1 && currentProjects >= maxProjects;
    const seatsExceeded = maxSeats !== -1 && currentEmployees >= maxSeats;

    return {
      exceeded: projectsExceeded || seatsExceeded,
      limits: { maxProjects, maxSeats },
      usage: { currentProjects, currentEmployees },
    };
  } catch (error) {
    console.error('[Subscription] Error checking limits:', error);
    // FAIL-SAFE: On error, allow access (don't block operations)
    return {
      exceeded: false,
      limits: { maxProjects: -1, maxSeats: -1 },
      usage: { currentProjects: 0, currentEmployees: 0 },
    };
  }
}

/**
 * Middleware: Block creation of new employees if limit exceeded
 * Use on: POST /api/employees, POST /api/register (for employee creation)
 */
export async function requireSeatsWithinLimit(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await storage.getUserById(req.session.userId);
    if (!user || user.role !== 'company') {
      return next(); // Not a company, no limits apply
    }

    const check = await checkSubscriptionLimits(user.id);

    // If within grace period, always allow
    if (check.withinGracePeriod) {
      console.log(`[Subscription] Allowing employee creation during grace period`);
      return next();
    }

    // Check if seat limit would be exceeded
    if (check.limits.maxSeats !== -1 && check.usage.currentEmployees >= check.limits.maxSeats) {
      console.warn(`[Subscription] Seat limit exceeded for company ${user.id}: ${check.usage.currentEmployees}/${check.limits.maxSeats}`);
      return res.status(403).json({
        message: `Employee seat limit reached (${check.limits.maxSeats}). Please upgrade your subscription or purchase additional seats.`,
        exceeded: true,
        limits: check.limits,
        usage: check.usage,
      });
    }

    next();
  } catch (error) {
    console.error('[Subscription] Error in requireSeatsWithinLimit:', error);
    // FAIL-SAFE: Allow on error
    next();
  }
}

/**
 * Middleware: Block ALL mutations if subscription expired (read-only mode)
 * Use on: All POST/PUT/DELETE endpoints after grace period
 * 
 * NOTE: This should be used AFTER requireAuth middleware
 */
export async function requireActiveSubscription(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await storage.getUserById(req.session.userId);
    if (!user || user.role !== 'company') {
      return next(); // Not a company, no restrictions
    }

    // Check if subscription is active or in grace period
    const tier = user.subscriptionTier;
    const status = user.subscriptionStatus;

    // Active subscription
    if (tier && status === 'active') {
      return next();
    }

    // Check grace period
    if (status === 'canceled' && user.subscriptionEndDate) {
      const endDate = new Date(user.subscriptionEndDate);
      const gracePeriodEnd = new Date(endDate.getTime() + (48 * 60 * 60 * 1000)); // 48 hours
      const now = new Date();

      if (now < gracePeriodEnd) {
        // Still within grace period
        console.log(`[Subscription] Company ${user.id} in grace period - allowing mutation`);
        return next();
      } else {
        // Grace period expired - READ-ONLY MODE
        console.warn(`[Subscription] Company ${user.id} subscription expired. Read-only mode enforced.`);
        return res.status(403).json({
          message: 'Your subscription has expired. Please renew to continue making changes.',
          readOnlyMode: true,
          gracePeriodEnded: true,
          gracePeriodEndedAt: gracePeriodEnd.toISOString(),
        });
      }
    }

    // No subscription at all
    // FAIL-SAFE: For new companies, allow 7 days grace period from account creation
    if (user.createdAt) {
      const accountAge = Date.now() - new Date(user.createdAt).getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (accountAge < sevenDays) {
        console.log(`[Subscription] New company ${user.id} within 7-day trial period`);
        return next();
      }
    }

    // No subscription and past trial period
    console.warn(`[Subscription] Company ${user.id} has no subscription. Blocking mutations.`);
    return res.status(403).json({
      message: 'No active subscription found. Please subscribe to continue using the platform.',
      requiresSubscription: true,
    });
  } catch (error) {
    console.error('[Subscription] Error in requireActiveSubscription:', error);
    // FAIL-SAFE: Allow on error (critical for safety-related operations)
    next();
  }
}

export { TIER_CONFIG };
