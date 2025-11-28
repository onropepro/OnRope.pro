import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { wsHub } from "./websocket-hub";
import { insertUserSchema, insertClientSchema, insertProjectSchema, insertDropLogSchema, insertComplaintSchema, insertComplaintNoteSchema, insertJobCommentSchema, insertHarnessInspectionSchema, insertToolboxMeetingSchema, insertFlhaFormSchema, insertIncidentReportSchema, insertMethodStatementSchema, insertPayPeriodConfigSchema, insertQuoteSchema, insertQuoteServiceSchema, insertGearItemSchema, insertGearAssignmentSchema, insertGearSerialNumberSchema, insertScheduledJobSchema, insertJobAssignmentSchema, updatePropertyManagerAccountSchema, normalizeStrataPlan, type InsertGearItem, type InsertGearAssignment, type InsertGearSerialNumber, type Project, gearAssignments, gearSerialNumbers, gearItems, jobAssignments, workSessions, nonBillableWorkSessions, licenseKeys, users, propertyManagerCompanyLinks, IRATA_TASK_TYPES } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcrypt";
import multer from "multer";
import { ObjectStorageService } from "./objectStorage";
import * as stripeService from "./stripe-service";
import Stripe from "stripe";
import { type TierName, type Currency, TIER_CONFIG, ADDON_CONFIG } from "../shared/stripe-config";
import { checkSubscriptionLimits } from "./subscription-middleware";
import { getTodayString, toLocalDateString, parseLocalDate, getStartOfWeek, getEndOfWeek } from "./dateUtils";

// Initialize Stripe for direct API calls
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' as any,
});

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized - Please log in" });
  }
  next();
}

// Role-based access middleware
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId || !req.session.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (!roles.includes(req.session.role)) {
      return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }
    
    next();
  };
}

// Helper function to check if user can view safety documents
function canViewSafetyDocuments(user: any): boolean {
  if (!user) return false;
  
  // Company role always has access
  if (user.role === 'company') return true;
  
  // All other roles need explicit permission
  return user.permissions?.includes('view_safety_documents') || false;
}

// Helper function to check if user can view Company Safety Rating (CSR)
function canViewCSR(user: any): boolean {
  if (!user) return false;
  
  // Company role always has access
  if (user.role === 'company') return true;
  
  // All other roles need explicit permission
  return user.permissions?.includes('view_csr') || false;
}

// ============================================================================
// INVENTORY PERMISSION HELPERS
// ============================================================================

// Helper function to check if user can view inventory
function canViewInventory(user: any): boolean {
  if (!user) return false;
  if (user.role === 'company') return true;
  return user.permissions?.includes('view_inventory') || false;
}

// Helper function to check if user can manage inventory (add/edit/delete)
function canManageInventory(user: any): boolean {
  if (!user) return false;
  if (user.role === 'company') return true;
  return user.permissions?.includes('manage_inventory') || false;
}

// Helper function to check if user can assign gear to employees
function canAssignGear(user: any): boolean {
  if (!user) return false;
  if (user.role === 'company') return true;
  return user.permissions?.includes('assign_gear') || false;
}

// Helper function to check if user can view all gear assignments
function canViewGearAssignments(user: any): boolean {
  if (!user) return false;
  if (user.role === 'company') return true;
  return user.permissions?.includes('view_gear_assignments') || false;
}

// Overtime calculation utility
interface OvertimeBreakdown {
  regularHours: number;
  overtimeHours: number;
  doubleTimeHours: number;
  totalHours: number;
}

async function calculateOvertimeHours(
  companyId: string,
  employeeId: string,
  workDate: Date,
  startTime: Date,
  endTime: Date
): Promise<OvertimeBreakdown> {
  // Calculate total hours for this session
  const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  
  // Get payroll configuration for the company
  const payrollConfig = await storage.getPayPeriodConfig(companyId);
  
  // If no config exists, all hours are regular (no overtime)
  if (!payrollConfig) {
    console.log(`[OVERTIME CALC] No payroll config found for company ${companyId}. All hours are regular.`);
    return {
      regularHours: parseFloat(totalHours.toFixed(2)),
      overtimeHours: 0,
      doubleTimeHours: 0,
      totalHours: parseFloat(totalHours.toFixed(2))
    };
  }
  
  const overtimeThreshold = parseFloat(payrollConfig.overtimeHoursThreshold || '8');
  const doubleTimeThreshold = parseFloat(payrollConfig.doubleTimeHoursThreshold || '12');
  const overtimeTrigger = payrollConfig.overtimeTriggerType || 'daily';
  const doubleTimeTrigger = payrollConfig.doubleTimeTriggerType || 'daily';
  
  // If overtime is disabled (set to "none"), all hours are regular
  if (overtimeTrigger === 'none') {
    console.log(`[OVERTIME CALC] Overtime disabled for company ${companyId}. All hours are regular.`);
    return {
      regularHours: parseFloat(totalHours.toFixed(2)),
      overtimeHours: 0,
      doubleTimeHours: 0,
      totalHours: parseFloat(totalHours.toFixed(2))
    };
  }
  
  let applicableHours = totalHours;
  
  // If weekly triggers are used, calculate total hours for the week
  if (overtimeTrigger === 'weekly' || doubleTimeTrigger === 'weekly') {
    const workDateObj = new Date(workDate);
    const dayOfWeek = workDateObj.getDay();
    const startOfWeek = new Date(workDateObj);
    startOfWeek.setDate(workDateObj.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Get all sessions for this employee across all projects (we'll filter by date manually)
    // Note: getWorkSessionsByEmployee only takes employeeId and projectId
    // For weekly overtime calc, we need all sessions regardless of project
    const allSessions = await db.select().from(workSessions)
      .where(eq(workSessions.employeeId, employeeId));
    
    // Filter sessions to this week's date range
    const weekSessions = allSessions.filter(session => {
      const sessionDate = new Date(session.workDate);
      return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
    });
    
    // Calculate existing hours this week
    let existingHours = 0;
    for (const session of weekSessions) {
      if (session.endTime && session.id !== 'CURRENT') {
        const sessionHours = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60);
        existingHours += sessionHours;
      }
    }
    
    applicableHours = existingHours + totalHours;
  }
  
  let regularHours = 0;
  let overtimeHours = 0;
  let doubleTimeHours = 0;
  
  // Calculate breakdown based on thresholds
  if (applicableHours <= overtimeThreshold) {
    // All regular time
    regularHours = totalHours;
  } else if (doubleTimeTrigger === 'none' || applicableHours <= doubleTimeThreshold) {
    // Mix of regular and overtime (no double time or not reached double time threshold)
    const hoursIntoOvertime = applicableHours - overtimeThreshold;
    if (totalHours <= hoursIntoOvertime) {
      // This entire session is overtime
      overtimeHours = totalHours;
    } else {
      // Part regular, part overtime
      regularHours = totalHours - hoursIntoOvertime;
      overtimeHours = hoursIntoOvertime;
    }
  } else {
    // Mix of regular, overtime, and double time
    const hoursIntoDoubleTime = applicableHours - doubleTimeThreshold;
    const overtimeRange = doubleTimeThreshold - overtimeThreshold;
    
    if (totalHours <= hoursIntoDoubleTime) {
      // This entire session is double time
      doubleTimeHours = totalHours;
    } else if (applicableHours - totalHours >= doubleTimeThreshold) {
      // This session starts after double time threshold
      doubleTimeHours = totalHours;
    } else if (applicableHours - totalHours >= overtimeThreshold) {
      // This session starts in overtime range
      const hoursBeforeDoubleTime = doubleTimeThreshold - (applicableHours - totalHours);
      overtimeHours = hoursBeforeDoubleTime;
      doubleTimeHours = totalHours - hoursBeforeDoubleTime;
    } else {
      // This session spans all three categories
      const regularPortion = overtimeThreshold - (applicableHours - totalHours);
      regularHours = regularPortion > 0 ? regularPortion : 0;
      
      const remainingAfterRegular = totalHours - regularHours;
      if (remainingAfterRegular <= overtimeRange) {
        overtimeHours = remainingAfterRegular;
      } else {
        overtimeHours = overtimeRange;
        doubleTimeHours = remainingAfterRegular - overtimeRange;
      }
    }
  }
  
  const result = {
    regularHours: parseFloat(regularHours.toFixed(2)),
    overtimeHours: parseFloat(overtimeHours.toFixed(2)),
    doubleTimeHours: parseFloat(doubleTimeHours.toFixed(2)),
    totalHours: parseFloat(totalHours.toFixed(2))
  };
  
  console.log(`[OVERTIME CALC] Employee ${employeeId}, Date ${workDate.toISOString().split('T')[0]}`);
  console.log(`[OVERTIME CALC] Session: ${totalHours.toFixed(2)}h total`);
  console.log(`[OVERTIME CALC] Thresholds: OT=${overtimeThreshold}h (${overtimeTrigger}), DT=${doubleTimeThreshold}h (${doubleTimeTrigger})`);
  console.log(`[OVERTIME CALC] Breakdown: Regular=${result.regularHours}h, OT=${result.overtimeHours}h, DT=${result.doubleTimeHours}h`);
  
  return result;
}

// Generate unique 10-character resident code using cryptographically secure randomness
// Provides ~50 bits of entropy (32^10 ≈ 2^50) to resist brute-force attacks
async function generateResidentCode(): Promise<string> {
  const crypto = await import('crypto');
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing characters like 0, O, 1, I
  const codeLength = 10;
  const maxAttempts = 10; // Prevent infinite loops in case of database issues
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Generate 10-character code using crypto.randomBytes for security
    const randomBytes = crypto.randomBytes(codeLength);
    let code = '';
    
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = randomBytes[i] % characters.length;
      code += characters.charAt(randomIndex);
    }
    
    // Check if code already exists
    const existing = await storage.getUserByResidentCode(code);
    if (!existing) {
      return code;
    }
  }
  
  throw new Error('Failed to generate unique resident code after maximum attempts');
}

async function generatePropertyManagerCode(): Promise<string> {
  const crypto = await import('crypto');
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing characters like 0, O, 1, I
  const codeLength = 10;
  const maxAttempts = 10; // Prevent infinite loops in case of database issues
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Generate 10-character code using crypto.randomBytes for security
    const randomBytes = crypto.randomBytes(codeLength);
    let code = '';
    
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = randomBytes[i] % characters.length;
      code += characters.charAt(randomIndex);
    }
    
    // Check if code already exists
    const existing = await storage.getUserByPropertyManagerCode(code);
    if (!existing) {
      return code;
    }
  }
  
  // If we couldn't generate a unique code after max attempts, throw error
  throw new Error('Unable to generate unique resident code. Please try again.');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== AUTH ROUTES ====================
  
  // Registration endpoint
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const { confirmPassword, ...userData } = req.body;
      
      console.log('[Register] Received data:', JSON.stringify(userData, null, 2));
      
      // Convert empty strings to null for numeric fields
      if (userData.hourlyRate === '' || userData.hourlyRate === undefined) {
        userData.hourlyRate = null;
      }
      
      // Validate input
      const validatedData = insertUserSchema.parse(userData);
      
      // Check if user already exists
      if (validatedData.email && typeof validatedData.email === 'string') {
        const existingUser = await storage.getUserByEmail(validatedData.email);
        if (existingUser) {
          return res.status(400).json({ message: "Email already registered" });
        }
      }
      
      if (validatedData.companyName && typeof validatedData.companyName === 'string') {
        const existingCompany = await storage.getUserByCompanyName(validatedData.companyName);
        if (existingCompany) {
          return res.status(400).json({ message: "Company name already taken" });
        }
      }
      
      let user;
      
      // For property managers: use a transaction to create user AND company link atomically
      if (validatedData.role === 'property_manager' && req.body.companyCode) {
        // Validate property manager code BEFORE starting transaction
        const company = await storage.getUserByPropertyManagerCode(req.body.companyCode);
        if (!company || company.role !== 'company') {
          return res.status(400).json({ message: "Invalid property manager code. Please check with the rope access company and try again." });
        }
        
        // Hash password before transaction (CRITICAL for security)
        const hashedPassword = await bcrypt.hash(validatedData.passwordHash, 10);
        
        // Atomic transaction: create user AND link to company
        try {
          user = await db.transaction(async (tx) => {
            // Create user with hashed password
            const [newUser] = await tx.insert(users).values({
              ...validatedData,
              passwordHash: hashedPassword,
            }).returning();
            
            // Create company link
            await tx.insert(propertyManagerCompanyLinks).values({
              propertyManagerId: newUser.id,
              companyCode: req.body.companyCode,
              companyId: company.id,
            });
            
            return newUser;
          });
        } catch (error) {
          console.error('Error creating property manager account:', error);
          // Check for PostgreSQL unique constraint violation (code 23505)
          if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
            return res.status(400).json({ message: "You are already linked to this company." });
          }
          return res.status(500).json({ message: "Failed to create account. Please try again." });
        }
      } else {
        // For non-property-managers, create user normally
        user = await storage.createUser(validatedData);
      }
      
      // If this is a company user, create default payroll config and generate periods
      if (user.role === 'company') {
        try {
          // Create default semi-monthly payroll config (1st and 15th)
          await storage.createPayPeriodConfig({
            companyId: user.id,
            periodType: 'semi-monthly',
            firstPayDay: 1,
            secondPayDay: 15,
          });
          
          // Generate initial 6 pay periods
          await storage.generatePayPeriods(user.id, 6);
        } catch (error) {
          console.error('Error creating default payroll config:', error);
          // Don't fail registration if payroll setup fails
        }
      }
      
      // Create session
      req.session.userId = user.id;
      req.session.role = user.role;
      
      // Save session before responding (critical for production)
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      // Return user without password
      const { passwordHash, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('[Register] Validation errors:', JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Registration with license (for new customers after Stripe checkout)
  app.post("/api/register-with-license", async (req: Request, res: Response) => {
    try {
      const { 
        companyName, 
        email, 
        password, 
        licenseKey, 
        stripeCustomerId, 
        stripeSubscriptionId, 
        tier 
      } = req.body;

      console.log('[Register-License] Creating account with license:', { companyName, email, licenseKey });

      // Validation
      if (!companyName || !email || !password || !licenseKey) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // CRITICAL SECURITY: Use database transaction with row-level locking to prevent race conditions
      // ALL database operations must happen within this transaction
      const result = await db.transaction(async (tx) => {
        // Lock the license row with SELECT FOR UPDATE to prevent concurrent access
        const validLicense = await tx.execute(
          sql`SELECT * FROM ${licenseKeys} WHERE ${licenseKeys.licenseKey} = ${licenseKey} FOR UPDATE`
        );

        if (!validLicense.rows || validLicense.rows.length === 0) {
          console.error('[Register-License] Invalid license key:', licenseKey);
          throw new Error("Invalid license key");
        }

        const license = validLicense.rows[0] as any;

        // Check if license has already been used (while holding the lock)
        if (license.used === true) {
          console.error('[Register-License] License key already used:', licenseKey);
          throw new Error("License key has already been used");
        }

        // Verify the tier and Stripe IDs match the license record
        if (license.tier !== tier) {
          console.error('[Register-License] Tier mismatch:', { provided: tier, expected: license.tier });
          throw new Error("License tier does not match");
        }

        if (license.stripe_customer_id !== stripeCustomerId || 
            license.stripe_subscription_id !== stripeSubscriptionId) {
          console.error('[Register-License] Stripe ID mismatch');
          throw new Error("Stripe information does not match license");
        }

        // Check if user already exists (using transaction client)
        const existingUserByEmail = await tx.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (existingUserByEmail) {
          throw new Error("Email already registered");
        }

        const existingUserByCompanyName = await tx.query.users.findFirst({
          where: eq(users.companyName, companyName),
        });

        if (existingUserByCompanyName) {
          throw new Error("Company name already taken");
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Get tier configuration
        const tierConfig = TIER_CONFIG[license.tier as TierName];

        // Create user with subscription data (using transaction client)
        const [user] = await tx.insert(users).values({
          companyName,
          email,
          passwordHash,
          role: 'company',
          stripeCustomerId: license.stripe_customer_id,
          stripeSubscriptionId: license.stripe_subscription_id,
          subscriptionTier: license.tier,
          subscriptionStatus: 'trialing',
          licenseKey: licenseKey, // Store license key in users table
        }).returning();

        if (!user) {
          throw new Error("Failed to create user");
        }

        console.log('[Register-License] User created:', user.id);

        // Mark license key as used (within the same transaction)
        await tx.update(licenseKeys)
          .set({ 
            used: true, 
            usedByUserId: user.id,
            usedAt: new Date(),
          })
          .where(eq(licenseKeys.licenseKey, licenseKey));
        
        console.log('[Register-License] License key marked as used:', licenseKey);

        return user;
      });

      // Create default payroll config (outside transaction - not critical if it fails)
      try {
        await storage.createPayPeriodConfig({
          companyId: result.id,
          periodType: 'semi-monthly',
          firstPayDay: 1,
          secondPayDay: 15,
        });
        await storage.generatePayPeriods(result.id, 6);
        console.log('[Register-License] Payroll config created');
      } catch (error) {
        console.error('[Register-License] Payroll setup error:', error);
        // Don't fail registration
      }

      // Create session
      req.session.userId = result.id;
      req.session.role = result.role;

      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      console.log('[Register-License] Registration complete for:', email);

      // Return user without password
      const { passwordHash: _, ...userWithoutPassword } = result;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      console.error('[Register-License] Error:', error);
      // Check for specific error messages from transaction
      const message = error.message || "Registration failed";
      res.status(400).json({ message });
    }
  });

  // Login endpoint
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { identifier, password } = req.body;
      
      if (!identifier || !password) {
        return res.status(400).json({ message: "Identifier and password are required" });
      }
      
      // SUPERUSER CHECK - Short-circuit before database lookup
      const superuserUsername = process.env.SUPERUSER_USERNAME || 'SuperUser';
      const superuserPasswordHash = process.env.SUPERUSER_PASSWORD_HASH;
      
      if (identifier === superuserUsername && superuserPasswordHash) {
        const isValidSuperuserPassword = await bcrypt.compare(password, superuserPasswordHash);
        
        if (isValidSuperuserPassword) {
          // Create superuser session
          req.session.userId = 'superuser';
          req.session.role = 'superuser';
          
          await new Promise<void>((resolve, reject) => {
            req.session.save((err) => {
              if (err) reject(err);
              else resolve();
            });
          });
          
          // Return superuser payload
          return res.json({
            user: {
              id: 'superuser',
              name: 'Super User',
              email: 'superuser@system',
              role: 'superuser',
              companyName: 'System Admin',
            }
          });
        }
      }
      
      // Try to find user by email or company name
      let user = await storage.getUserByEmail(identifier);
      
      if (!user) {
        user = await storage.getUserByCompanyName(identifier);
      }
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isValidPassword = await storage.verifyPassword(password, user.passwordHash);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check if user has been terminated
      if (user.terminatedDate) {
        return res.status(403).json({ message: "Your employment has been terminated. Please contact your administrator for more information." });
      }
      
      // GENERATE CODES ON FIRST LOGIN (company role only)
      if (user.role === 'company') {
        const updates: any = {};
        
        // Generate resident code if missing
        if (!user.residentCode) {
          try {
            console.log('[Login] Generating resident code for company on first login...');
            const residentCode = await generateResidentCode();
            updates.residentCode = residentCode;
            console.log(`[Login] Resident code generated: ${residentCode}`);
          } catch (error) {
            console.error('[Login] Failed to generate resident code:', error);
          }
        }
        
        // Generate property manager code if missing
        if (!user.propertyManagerCode) {
          try {
            console.log('[Login] Generating property manager code for company on first login...');
            const propertyManagerCode = await generatePropertyManagerCode();
            updates.propertyManagerCode = propertyManagerCode;
            console.log(`[Login] Property manager code generated: ${propertyManagerCode}`);
          } catch (error) {
            console.error('[Login] Failed to generate property manager code:', error);
          }
        }
        
        // Update user if any codes were generated
        if (Object.keys(updates).length > 0) {
          await storage.updateUser(user.id, updates);
          // Refetch user from database to ensure codes are persisted
          const updatedUser = await storage.getUserById(user.id);
          if (updatedUser) {
            user = updatedUser;
          }
        }
      }
      
      // Create session
      req.session.userId = user.id;
      req.session.role = user.role;
      
      // Save session before responding (critical for production)
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      // Return user without sensitive fields (passwordHash and licenseKey)
      const { passwordHash,  ...userWithoutSensitiveData } = user;
      res.json({ user: userWithoutSensitiveData });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Logout endpoint
  app.post("/api/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // Link resident account to company using resident code
  app.post("/api/link-resident-code", requireAuth, async (req: Request, res: Response) => {
    try {
      const { residentCode } = req.body;
      
      if (!residentCode || typeof residentCode !== 'string') {
        return res.status(400).json({ message: "Resident code is required" });
      }
      
      const normalizedCode = residentCode.trim().toUpperCase();
      
      if (normalizedCode.length !== 10) {
        return res.status(400).json({ message: "Invalid code format" });
      }
      
      // Find company with this resident code
      const company = await storage.getUserByResidentCode(normalizedCode);
      
      if (!company) {
        return res.status(404).json({ message: "Invalid code - no company found with this code" });
      }
      
      // Update resident's companyId
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (currentUser.role !== 'resident') {
        return res.status(403).json({ message: "Only residents can link using a company code" });
      }
      
      console.log(`[link-resident-code] Resident ${currentUser.email} linking to company ${company.companyName} (${company.id})`);
      console.log(`[link-resident-code] Previous companyId: ${currentUser.companyId}`);
      
      // Save BOTH the companyId AND the code they used to link
      await storage.updateUser(currentUser.id, { 
        companyId: company.id,
        linkedResidentCode: normalizedCode // Store the code for future validation
      });
      
      // Verify the update
      const updatedUser = await storage.getUserById(currentUser.id);
      console.log(`[link-resident-code] New companyId: ${updatedUser?.companyId}, linkedCode: ${updatedUser?.linkedResidentCode}`);
      
      res.json({ 
        message: "Account linked successfully", 
        companyName: company.companyName 
      });
    } catch (error) {
      console.error("Link resident code error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // OLD LICENSE VERIFICATION ENDPOINT REMOVED - Now using Stripe subscriptions
  // See /api/stripe/* endpoints for subscription management
  
  // =====================================================================
  // STRIPE SUBSCRIPTION MANAGEMENT ENDPOINTS
  // Following "It Just Works" principle - zero-failure tolerance
  // =====================================================================
  
  /**
   * Upgrade/downgrade existing subscription with proration
   * POST /api/stripe/upgrade-subscription
   */
  app.post("/api/stripe/upgrade-subscription", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== 'company') {
        return res.status(403).json({ message: "Only company accounts can upgrade subscriptions" });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription found" });
      }

      const { tier } = req.body;

      if (!tier || !['basic', 'starter', 'premium', 'enterprise'].includes(tier)) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }

      // Check if user is already on this tier
      if (user.subscriptionTier === tier) {
        return res.status(400).json({ message: "You are already on this tier" });
      }

      // Get current subscription to determine currency
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      // Use Stripe's subscription currency (authoritative source)
      const currency = subscription.currency.toLowerCase() as 'usd' | 'cad';
      
      // Validate currency is supported
      if (currency !== 'usd' && currency !== 'cad') {
        return res.status(400).json({ 
          message: `Unsupported currency: ${currency}. Only USD and CAD are supported.` 
        });
      }

      // Get new price ID
      const tierConfig = TIER_CONFIG[tier as TierName];
      const newPriceId = currency === 'usd' ? tierConfig.priceIdUSD : tierConfig.priceIdCAD;

      console.log(`[Stripe] Upgrading subscription ${user.stripeSubscriptionId} from ${user.subscriptionTier} to ${tier}`);

      // Update subscription with proration
      const updatedSubscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: 'create_prorations', // Automatically calculate and charge/credit difference
      });

      // Generate new license key with correct tier suffix
      const oldLicenseKey = user.licenseKey!;
      const tierSuffix: Record<string, string> = { basic: '1', starter: '2', premium: '3', enterprise: '4' };
      const newLicenseKey = oldLicenseKey.substring(0, oldLicenseKey.lastIndexOf('-') + 1) + tierSuffix[tier];

      console.log(`[License] Replacing license key: ${oldLicenseKey} → ${newLicenseKey}`);

      // Update license key in database (create new entry)
      await db.insert(licenseKeys).values({
        licenseKey: newLicenseKey,
        stripeSessionId: `upgrade-${Date.now()}`, // Unique identifier for upgrade
        stripeCustomerId: user.stripeCustomerId!,
        stripeSubscriptionId: user.stripeSubscriptionId,
        tier: tier,
        currency: currency,
        used: true,
        usedByUserId: user.id,
        usedAt: new Date(),
      });

      // Update user with new tier and license key
      await storage.updateUser(user.id, {
        tier: tier as any,
        licenseKey: newLicenseKey,
      });

      console.log(`[Stripe] Subscription upgraded successfully. New tier: ${tier}`);
      res.json({
        success: true,
        message: "Subscription upgraded successfully",
        newTier: tier,
        newLicenseKey: newLicenseKey,
        proratedAmount: updatedSubscription.latest_invoice,
      });
    } catch (error: any) {
      console.error('[Stripe] Upgrade subscription error:', error);
      res.status(500).json({ message: error.message || "Failed to upgrade subscription" });
    }
  });

  /**
   * Add extra seats to subscription
   * POST /api/stripe/add-seats
   */
  app.post("/api/stripe/add-seats", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== 'company') {
        return res.status(403).json({ message: "Only company accounts can purchase add-ons" });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription found" });
      }

      // Get current subscription to determine currency
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      // Use Stripe's subscription currency (authoritative source)
      const currency = subscription.currency.toLowerCase() as 'usd' | 'cad';
      
      // Validate currency is supported
      if (currency !== 'usd' && currency !== 'cad') {
        return res.status(400).json({ 
          message: `Unsupported currency: ${currency}. Only USD and CAD are supported.` 
        });
      }

      // Get extra seats price ID
      const addonConfig = ADDON_CONFIG.extra_seats;
      const addonPriceId = currency === 'usd' ? addonConfig.priceIdUSD : addonConfig.priceIdCAD;

      console.log(`[Stripe] Adding extra seats to subscription ${user.stripeSubscriptionId}`);

      // Check if extra seats already exists on subscription
      const existingItem = subscription.items.data.find(item => item.price.id === addonPriceId);

      let newQuantity: number;
      if (existingItem) {
        // Update quantity of existing subscription item
        console.log(`[Stripe] Extra seats already on subscription. Updating quantity from ${existingItem.quantity} to ${(existingItem.quantity || 1) + 1}`);
        const updatedItem = await stripe.subscriptionItems.update(existingItem.id, {
          quantity: (existingItem.quantity || 1) + 1,
          proration_behavior: 'create_prorations',
        });
        newQuantity = updatedItem.quantity || 1;
      } else {
        // Create new subscription item with quantity 1
        console.log(`[Stripe] Adding extra seats as new subscription item`);
        const newItem = await stripe.subscriptionItems.create({
          subscription: user.stripeSubscriptionId,
          price: addonPriceId,
          quantity: 1,
          proration_behavior: 'create_prorations',
        });
        newQuantity = newItem.quantity || 1;
      }

      // Update user's additional seats count in database with authoritative Stripe quantity
      await storage.updateUser(user.id, {
        additionalSeatsCount: newQuantity,
      });

      console.log(`[Stripe] Extra seats added successfully. Additional packs: ${newQuantity}, Total extra seats: ${newQuantity * addonConfig.seats}`);
      res.json({
        success: true,
        message: "Extra seats added successfully",
        additionalPacks: newQuantity,
        totalExtraSeats: newQuantity * addonConfig.seats,
      });
    } catch (error: any) {
      console.error('[Stripe] Add seats error:', error);
      res.status(500).json({ message: error.message || "Failed to add extra seats" });
    }
  });

  /**
   * Add extra project to subscription
   * POST /api/stripe/add-project
   */
  app.post("/api/stripe/add-project", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== 'company') {
        return res.status(403).json({ message: "Only company accounts can purchase add-ons" });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription found" });
      }

      // Get current subscription to determine currency
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      // Use Stripe's subscription currency (authoritative source)
      const currency = subscription.currency.toLowerCase() as 'usd' | 'cad';
      
      // Validate currency is supported
      if (currency !== 'usd' && currency !== 'cad') {
        return res.status(400).json({ 
          message: `Unsupported currency: ${currency}. Only USD and CAD are supported.` 
        });
      }

      // Get extra project price ID
      const addonConfig = ADDON_CONFIG.extra_project;
      const addonPriceId = currency === 'usd' ? addonConfig.priceIdUSD : addonConfig.priceIdCAD;

      console.log(`[Stripe] Adding extra project to subscription ${user.stripeSubscriptionId}`);

      // Check if extra project already exists on subscription
      const existingItem = subscription.items.data.find(item => item.price.id === addonPriceId);

      let newQuantity: number;
      if (existingItem) {
        // Update quantity of existing subscription item
        console.log(`[Stripe] Extra project already on subscription. Updating quantity from ${existingItem.quantity} to ${(existingItem.quantity || 1) + 1}`);
        const updatedItem = await stripe.subscriptionItems.update(existingItem.id, {
          quantity: (existingItem.quantity || 1) + 1,
          proration_behavior: 'create_prorations',
        });
        newQuantity = updatedItem.quantity || 1;
      } else {
        // Create new subscription item with quantity 1
        console.log(`[Stripe] Adding extra project as new subscription item`);
        const newItem = await stripe.subscriptionItems.create({
          subscription: user.stripeSubscriptionId,
          price: addonPriceId,
          quantity: 1,
          proration_behavior: 'create_prorations',
        });
        newQuantity = newItem.quantity || 1;
      }

      // Update user's additional projects count in database with authoritative Stripe quantity
      await storage.updateUser(user.id, {
        additionalProjectsCount: newQuantity,
      });

      console.log(`[Stripe] Extra project added successfully. Additional projects: ${newQuantity}`);
      res.json({
        success: true,
        message: "Extra project added successfully",
        additionalProjects: newQuantity,
      });
    } catch (error: any) {
      console.error('[Stripe] Add project error:', error);
      res.status(500).json({ message: error.message || "Failed to add extra project" });
    }
  });

  /**
   * Add white label branding to subscription
   * POST /api/stripe/add-branding
   */
  app.post("/api/stripe/add-branding", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== 'company') {
        return res.status(403).json({ message: "Only company accounts can purchase add-ons" });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription found" });
      }

      // Check if user is on Starter tier or above (Basic cannot have white label)
      if (user.subscriptionTier === 'basic') {
        return res.status(400).json({ message: "White label branding is only available for Starter tier and above" });
      }

      // Get current subscription to determine currency
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      // Use Stripe's subscription currency (authoritative source)
      const currency = subscription.currency.toLowerCase() as 'usd' | 'cad';
      
      // Validate currency is supported
      if (currency !== 'usd' && currency !== 'cad') {
        return res.status(400).json({ 
          message: `Unsupported currency: ${currency}. Only USD and CAD are supported.` 
        });
      }

      // Get white label price ID
      const addonConfig = ADDON_CONFIG.white_label;
      const addonPriceId = currency === 'usd' ? addonConfig.priceIdUSD : addonConfig.priceIdCAD;

      console.log(`[Stripe] Adding white label branding to subscription ${user.stripeSubscriptionId}`);

      // Check if white label branding is already on the subscription
      // Paginate through all subscription items to find white label
      let hasWhiteLabel = false;
      let startingAfter: string | undefined = undefined;
      
      do {
        const itemsPage = await stripe.subscriptionItems.list({
          subscription: user.stripeSubscriptionId,
          limit: 100,
          ...(startingAfter && { starting_after: startingAfter }),
        });
        
        hasWhiteLabel = itemsPage.data.some(item => item.price.id === addonPriceId);
        
        if (hasWhiteLabel || !itemsPage.has_more) break;
        
        startingAfter = itemsPage.data[itemsPage.data.length - 1]?.id;
      } while (true);

      if (!hasWhiteLabel) {
        // Add white label branding to subscription
        await stripe.subscriptionItems.create({
          subscription: user.stripeSubscriptionId,
          price: addonPriceId,
          proration_behavior: 'create_prorations',
        });
      }

      // Update user to enable white label in database
      await storage.updateUser(user.id, {
        whitelabelBrandingActive: true,
      });

      console.log(`[Stripe] White label branding ${hasWhiteLabel ? 'already active' : 'added successfully'}`);
      res.json({
        success: true,
        message: "White label branding unlocked successfully",
        whiteLabelEnabled: true,
      });
    } catch (error: any) {
      console.error('[Stripe] Add branding error:', error);
      res.status(500).json({ message: error.message || "Failed to add white label branding" });
    }
  });

  /**
   * Get subscription details including add-ons
   * GET /api/subscription/details
   */
  app.get("/api/subscription/details", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(404).json({ message: "No active subscription found" });
      }

      // Get subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      const currentPriceId = subscription.items.data[0]?.price.id;
      
      // Determine currency
      let currency: 'usd' | 'cad' = 'usd';
      for (const [, config] of Object.entries(TIER_CONFIG)) {
        if (config.priceIdUSD === currentPriceId) {
          currency = 'usd';
          break;
        } else if (config.priceIdCAD === currentPriceId) {
          currency = 'cad';
          break;
        }
      }

      res.json({
        tier: user.subscriptionTier,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        whitelabelBrandingActive: user.whitelabelBrandingActive || false,
        additionalSeatsCount: user.additionalSeatsCount || 0,
        additionalProjectsCount: user.additionalProjectsCount || 0,
        currency,
      });
    } catch (error: any) {
      console.error('[Stripe] Get subscription details error:', error);
      res.status(500).json({ message: error.message || "Failed to fetch subscription details" });
    }
  });

  /**
   * Cancel white label branding add-on
   * POST /api/stripe/cancel-whitelabel
   */
  app.post("/api/stripe/cancel-whitelabel", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription found" });
      }

      if (!user.whitelabelBrandingActive) {
        return res.status(400).json({ message: "White label branding is not active" });
      }

      // Get current subscription to determine currency
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      const currentPriceId = subscription.items.data[0]?.price.id;
      
      // Determine currency
      let currency: 'usd' | 'cad' = 'usd';
      for (const [, config] of Object.entries(TIER_CONFIG)) {
        if (config.priceIdUSD === currentPriceId) {
          currency = 'usd';
          break;
        } else if (config.priceIdCAD === currentPriceId) {
          currency = 'cad';
          break;
        }
      }

      // Get white label price ID
      const addonConfig = ADDON_CONFIG.white_label;
      const addonPriceId = currency === 'usd' ? addonConfig.priceIdUSD : addonConfig.priceIdCAD;

      console.log(`[Stripe] Cancelling white label branding from subscription ${user.stripeSubscriptionId}`);

      // Find and remove the white label subscription item
      let itemToRemove: string | null = null;
      let startingAfter: string | undefined = undefined;
      
      do {
        const itemsPage = await stripe.subscriptionItems.list({
          subscription: user.stripeSubscriptionId,
          limit: 100,
          ...(startingAfter && { starting_after: startingAfter }),
        });
        
        const whitelabelItem = itemsPage.data.find(item => item.price.id === addonPriceId);
        if (whitelabelItem) {
          itemToRemove = whitelabelItem.id;
          break;
        }
        
        if (!itemsPage.has_more) break;
        
        startingAfter = itemsPage.data[itemsPage.data.length - 1]?.id;
      } while (true);

      if (itemToRemove) {
        // Remove the subscription item (will take effect at period end)
        await stripe.subscriptionItems.del(itemToRemove, {
          proration_behavior: 'none', // No proration on cancellation
        });
      }

      // Update user to disable white label in database
      await storage.updateUser(user.id, {
        whitelabelBrandingActive: false,
      });

      console.log(`[Stripe] White label branding cancelled successfully`);
      res.json({
        success: true,
        message: "White label branding will be cancelled at the end of your billing period",
      });
    } catch (error: any) {
      console.error('[Stripe] Cancel white label error:', error);
      res.status(500).json({ message: error.message || "Failed to cancel white label branding" });
    }
  });

  /**
   * Remove one extra seat pack from subscription
   * POST /api/stripe/remove-addon-seats
   */
  app.post("/api/stripe/remove-addon-seats", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription found" });
      }

      if ((user.additionalSeatsCount || 0) === 0) {
        return res.status(400).json({ message: "No extra seat packs to remove" });
      }

      // Get current subscription to determine currency
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      const currency = subscription.currency.toLowerCase() as 'usd' | 'cad';

      // Get extra seats price ID
      const addonConfig = ADDON_CONFIG.extra_seats;
      const addonPriceId = currency === 'usd' ? addonConfig.priceIdUSD : addonConfig.priceIdCAD;

      console.log(`[Stripe] Removing one extra seat pack from subscription ${user.stripeSubscriptionId}`);

      // Find the subscription item for extra seats
      const existingItem = subscription.items.data.find(item => item.price.id === addonPriceId);

      if (!existingItem) {
        return res.status(404).json({ message: "Extra seats subscription item not found" });
      }

      let newQuantity = 0;
      const currentQuantity = existingItem.quantity || 1;

      if (currentQuantity > 1) {
        // Decrement quantity by 1
        console.log(`[Stripe] Reducing seat packs from ${currentQuantity} to ${currentQuantity - 1}`);
        const updatedItem = await stripe.subscriptionItems.update(existingItem.id, {
          quantity: currentQuantity - 1,
          proration_behavior: 'create_prorations',
        });
        newQuantity = updatedItem.quantity || 0;
      } else {
        // Remove the subscription item entirely
        console.log(`[Stripe] Removing last seat pack`);
        await stripe.subscriptionItems.del(existingItem.id, {
          proration_behavior: 'create_prorations',
        });
        newQuantity = 0;
      }

      // Update database with new quantity
      await storage.updateUser(user.id, {
        additionalSeatsCount: newQuantity,
      });

      console.log(`[Stripe] Extra seat pack removed successfully. Remaining packs: ${newQuantity}`);
      res.json({
        success: true,
        message: "Extra seat pack removed successfully",
        remainingPacks: newQuantity,
        totalExtraSeats: newQuantity * addonConfig.seats,
      });
    } catch (error: any) {
      console.error('[Stripe] Remove seat pack error:', error);
      res.status(500).json({ message: error.message || "Failed to remove extra seat pack" });
    }
  });

  /**
   * Remove one extra project from subscription
   * POST /api/stripe/remove-addon-projects
   */
  app.post("/api/stripe/remove-addon-projects", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription found" });
      }

      if ((user.additionalProjectsCount || 0) === 0) {
        return res.status(400).json({ message: "No extra projects to remove" });
      }

      // Get current subscription to determine currency
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      const currency = subscription.currency.toLowerCase() as 'usd' | 'cad';

      // Get extra project price ID
      const addonConfig = ADDON_CONFIG.extra_project;
      const addonPriceId = currency === 'usd' ? addonConfig.priceIdUSD : addonConfig.priceIdCAD;

      console.log(`[Stripe] Removing one extra project from subscription ${user.stripeSubscriptionId}`);

      // Find the subscription item for extra projects
      const existingItem = subscription.items.data.find(item => item.price.id === addonPriceId);

      if (!existingItem) {
        return res.status(404).json({ message: "Extra projects subscription item not found" });
      }

      let newQuantity = 0;
      const currentQuantity = existingItem.quantity || 1;

      if (currentQuantity > 1) {
        // Decrement quantity by 1
        console.log(`[Stripe] Reducing extra projects from ${currentQuantity} to ${currentQuantity - 1}`);
        const updatedItem = await stripe.subscriptionItems.update(existingItem.id, {
          quantity: currentQuantity - 1,
          proration_behavior: 'create_prorations',
        });
        newQuantity = updatedItem.quantity || 0;
      } else {
        // Remove the subscription item entirely
        console.log(`[Stripe] Removing last extra project`);
        await stripe.subscriptionItems.del(existingItem.id, {
          proration_behavior: 'create_prorations',
        });
        newQuantity = 0;
      }

      // Update database with new quantity
      await storage.updateUser(user.id, {
        additionalProjectsCount: newQuantity,
      });

      console.log(`[Stripe] Extra project removed successfully. Remaining projects: ${newQuantity}`);
      res.json({
        success: true,
        message: "Extra project removed successfully",
        remainingProjects: newQuantity,
      });
    } catch (error: any) {
      console.error('[Stripe] Remove extra project error:', error);
      res.status(500).json({ message: error.message || "Failed to remove extra project" });
    }
  });

  /**
   * Create Stripe checkout session for subscription purchase
   * POST /api/stripe/create-checkout-session
   */
  app.post("/api/stripe/create-checkout-session", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== 'company') {
        return res.status(403).json({ message: "Only company accounts can purchase subscriptions" });
      }

      const { tier, currency = 'usd' } = req.body;

      if (!tier || !['basic', 'starter', 'premium', 'enterprise'].includes(tier)) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }

      if (!['usd', 'cad'].includes(currency)) {
        return res.status(400).json({ message: "Invalid currency. Must be 'usd' or 'cad'" });
      }

      // Get or create Stripe customer
      const customerId = await stripeService.getOrCreateCustomer(user);

      // Update user with customer ID if new
      if (customerId !== user.stripeCustomerId) {
        await storage.updateUser(user.id, { stripeCustomerId: customerId });
      }

      // Get price ID for selected tier and currency
      const tierConfig = TIER_CONFIG[tier as TierName];
      const priceId = currency === 'usd' ? tierConfig.priceIdUSD : tierConfig.priceIdCAD;

      // Construct base URL from request (works in both dev and production)
      const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`;

      // Create checkout session
      const session = await stripeService.createCheckoutSession({
        customerId,
        priceId,
        mode: 'subscription',
        successUrl: `${baseUrl}/profile?subscription=success`,
        cancelUrl: `${baseUrl}/profile?subscription=canceled`,
        metadata: {
          userId: user.id.toString(),
          tier,
          currency,
        },
      });

      console.log(`[Stripe] Checkout session created for user ${user.id}: ${session.id}`);
      res.json({ url: session.url });
    } catch (error: any) {
      console.error('[Stripe] Create checkout session error:', error);
      res.status(500).json({ message: error.message || "Failed to create checkout session" });
    }
  });

  /**
   * Create Stripe checkout session for NEW customers (license purchase)
   * POST /api/stripe/create-license-checkout
   * No authentication required - this is for new customers
   */
  app.post("/api/stripe/create-license-checkout", async (req: Request, res: Response) => {
    try {
      const { tier, currency = 'usd' } = req.body;

      if (!tier || !['basic', 'starter', 'premium', 'enterprise'].includes(tier)) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }

      if (!['usd', 'cad'].includes(currency)) {
        return res.status(400).json({ message: "Invalid currency. Must be 'usd' or 'cad'" });
      }

      // Get price ID for selected tier and currency
      const tierConfig = TIER_CONFIG[tier as TierName];
      const priceId = currency === 'usd' ? tierConfig.priceIdUSD : tierConfig.priceIdCAD;

      // Construct base URL from request (works in both dev and production)
      const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`;

      // Create checkout session (customer created automatically for subscription mode)
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/complete-registration?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/get-license?canceled=true`,
        metadata: {
          tier,
          currency,
          newCustomer: 'true', // Flag to indicate this is a new customer purchase
        },
        subscription_data: {
          trial_period_days: 30, // 1-month free trial
          metadata: {
            tier,
            currency,
          },
        },
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
      });

      console.log(`[Stripe] License checkout session created: ${session.id}`);
      res.json({ sessionUrl: session.url });
    } catch (error: any) {
      console.error('[Stripe] Create license checkout error:', error);
      res.status(500).json({ message: error.message || "Failed to create checkout session" });
    }
  });

  /**
   * Retrieve checkout session and generate license key
   * GET /api/stripe/checkout-session/:sessionId
   * Used by complete-registration page to get license details
   */
  app.get("/api/stripe/checkout-session/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      console.log(`[Stripe] Retrieving checkout session: ${sessionId}`);

      // Check if we already generated a license key for this session
      const existingLicense = await db.query.licenseKeys.findFirst({
        where: eq(licenseKeys.stripeSessionId, sessionId),
      });

      if (existingLicense) {
        console.log(`[Stripe] Found existing license for session ${sessionId}: ${existingLicense.licenseKey}`);
        // Return existing license key
        const tierConfig = TIER_CONFIG[existingLicense.tier as TierName];
        const subscription = await stripe.subscriptions.retrieve(existingLicense.stripeSubscriptionId);
        
        return res.json({
          licenseKey: existingLicense.licenseKey,
          tier: existingLicense.tier,
          tierName: tierConfig.name,
          currency: existingLicense.currency,
          maxProjects: tierConfig.maxProjects,
          maxSeats: tierConfig.maxSeats,
          stripeCustomerId: existingLicense.stripeCustomerId,
          stripeSubscriptionId: existingLicense.stripeSubscriptionId,
          trialEnd: subscription.trial_end,
        });
      }

      console.log(`[Stripe] No existing license found, retrieving session from Stripe...`);

      // Retrieve the session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription', 'customer'],
      });

      console.log(`[Stripe] Session retrieved: status=${session.status}, customer=${session.customer ? 'present' : 'missing'}`);

      if (!session) {
        console.error(`[Stripe] Session ${sessionId} not found in Stripe`);
        return res.status(404).json({ message: "Session not found in Stripe. Please verify you're using the correct Stripe account (test or live mode)." });
      }

      // Verify session is completed
      if (session.status !== 'complete') {
        console.error(`[Stripe] Session ${sessionId} status is ${session.status}, expected 'complete'`);
        return res.status(400).json({ message: `Checkout session not completed. Current status: ${session.status}` });
      }

      // Get tier from metadata
      const tier = session.metadata?.tier;
      const currency = session.metadata?.currency || 'usd';

      if (!tier) {
        console.error(`[Stripe] Session ${sessionId} missing tier metadata`);
        return res.status(400).json({ message: "Missing tier information in session metadata" });
      }

      // Get customer and subscription IDs
      const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
      const subscription = session.subscription as Stripe.Subscription;
      const stripeSubscriptionId = typeof subscription === 'string' ? subscription : subscription?.id;

      if (!stripeCustomerId || !stripeSubscriptionId) {
        console.error(`[Stripe] Session ${sessionId} missing customer or subscription data`);
        return res.status(400).json({ message: "Missing customer or subscription data" });
      }

      // Generate license key with tier suffix
      // Format: COMPANY-XXXXX-XXXXX-XXXXX-[TIER]
      // -1 = Basic, -2 = Starter, -3 = Premium, -4 = Enterprise
      const tierSuffix = tier === 'basic' ? '1' : tier === 'starter' ? '2' : tier === 'premium' ? '3' : '4';
      const licenseKey = `COMPANY-${generateRandomSegment()}-${generateRandomSegment()}-${generateRandomSegment()}-${tierSuffix}`;

      // Store license key in database
      await db.insert(licenseKeys).values({
        licenseKey,
        stripeSessionId: sessionId,
        stripeCustomerId,
        stripeSubscriptionId,
        tier,
        currency,
        used: false,
      });

      console.log(`[License] Generated and stored license key: ${licenseKey} for session ${sessionId}`);

      const tierConfig = TIER_CONFIG[tier as TierName];

      res.json({
        licenseKey,
        tier,
        tierName: tierConfig.name,
        currency,
        maxProjects: tierConfig.maxProjects,
        maxSeats: tierConfig.maxSeats,
        stripeCustomerId,
        stripeSubscriptionId,
        trialEnd: subscription && typeof subscription !== 'string' ? subscription.trial_end : null,
      });
    } catch (error: any) {
      console.error('[Stripe] Get checkout session error:', error);
      console.error('[Stripe] Error details:', {
        message: error.message,
        type: error.type,
        code: error.code,
        statusCode: error.statusCode,
      });
      
      // Provide more helpful error messages
      let userMessage = "Failed to retrieve session";
      if (error.type === 'StripeInvalidRequestError') {
        userMessage = "Invalid session ID or session not found in Stripe. Please verify your Stripe account settings.";
      } else if (error.code === 'resource_missing') {
        userMessage = "Session not found. The checkout session may have expired or you're using different Stripe accounts between environments.";
      }
      
      res.status(500).json({ 
        message: userMessage,
        details: error.message 
      });
    }
  });

  // Helper function to generate random license key segment
  function generateRandomSegment(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar-looking characters
    let segment = '';
    for (let i = 0; i < 5; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return segment;
  }

  /**
   * Stripe webhook handler
   * POST /api/stripe/webhook
   * Processes subscription lifecycle events
   */
  app.post("/api/stripe/webhook", async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      console.error('[Stripe Webhook] Missing signature');
      return res.status(400).send('Missing signature');
    }

    try {
      // Construct event from webhook payload
      const event = stripeService.constructWebhookEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );

      // Handle the event with database update callback
      await stripeService.handleWebhookEvent(event, async (params) => {
        await storage.updateUser(params.userId.toString(), {
          stripeCustomerId: params.stripeCustomerId,
          stripeSubscriptionId: params.subscriptionId,
          subscriptionTier: params.tier,
          subscriptionStatus: params.status,
          subscriptionEndDate: params.currentPeriodEnd,
          whitelabelBrandingActive: params.whitelabelBrandingActive,
        });
      });

      res.json({ received: true });
    } catch (error: any) {
      console.error('[Stripe Webhook] Error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  /**
   * Get subscription status for current user
   * GET /api/stripe/subscription-status
   */
  app.get("/api/stripe/subscription-status", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== 'company') {
        return res.status(403).json({ message: "Only company accounts have subscriptions" });
      }

      if (!user.stripeCustomerId) {
        return res.json({
          hasActiveSubscription: false,
          message: "No subscription found",
        });
      }

      // Get subscription status from Stripe
      const status = await stripeService.getSubscriptionStatus(user.stripeCustomerId);

      res.json(status);
    } catch (error: any) {
      console.error('[Stripe] Get subscription status error:', error);
      res.status(500).json({ message: error.message || "Failed to retrieve subscription status" });
    }
  });

  /**
   * Cancel subscription (at period end)
   * POST /api/stripe/cancel-subscription
   */
  app.post("/api/stripe/cancel-subscription", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== 'company') {
        return res.status(403).json({ message: "Only company accounts can manage subscriptions" });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription to cancel" });
      }

      // Cancel subscription at period end
      await stripeService.cancelSubscription(user.stripeSubscriptionId);

      console.log(`[Stripe] Subscription canceled for user ${user.id}`);
      res.json({ 
        message: "Subscription will be canceled at the end of the current billing period",
        success: true 
      });
    } catch (error: any) {
      console.error('[Stripe] Cancel subscription error:', error);
      res.status(500).json({ message: error.message || "Failed to cancel subscription" });
    }
  });

  /**
   * Reactivate a subscription scheduled for cancellation
   * POST /api/stripe/reactivate-subscription
   */
  app.post("/api/stripe/reactivate-subscription", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== 'company') {
        return res.status(403).json({ message: "Only company accounts can manage subscriptions" });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No subscription to reactivate" });
      }

      // Reactivate subscription
      await stripeService.reactivateSubscription(user.stripeSubscriptionId);

      console.log(`[Stripe] Subscription reactivated for user ${user.id}`);
      res.json({ 
        message: "Subscription reactivated successfully",
        success: true 
      });
    } catch (error: any) {
      console.error('[Stripe] Reactivate subscription error:', error);
      res.status(500).json({ message: error.message || "Failed to reactivate subscription" });
    }
  });
  
  // =====================================================================
  // END STRIPE ENDPOINTS
  // =====================================================================
  
  // Get current user
  app.get("/api/user", requireAuth, async (req: Request, res: Response) => {
    try {
      // Handle SuperUser session
      if (req.session.userId === 'superuser') {
        return res.json({
          user: {
            id: 'superuser',
            name: 'Super User',
            email: 'superuser@system',
            role: 'superuser',
            companyName: 'System Admin',
          }
        });
      }
      
      let user = await storage.getUserById(req.session.userId!);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Auto-renew subscription if renewal date has passed (company users only)
      // ONLY renew if license is still verified
      if (user.role === 'company' && user.subscriptionRenewalDate && user.licenseVerified === true) {
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison
          const renewalDate = new Date(user.subscriptionRenewalDate);
          renewalDate.setHours(0, 0, 0, 0);
          
          // If renewal date has passed, extend by 30 days (only if license is verified)
          if (renewalDate <= today) {
            const newRenewalDate = new Date(renewalDate);
            newRenewalDate.setDate(newRenewalDate.getDate() + 30);
            const subscriptionRenewalDate = newRenewalDate.toISOString().split('T')[0];
            
            await storage.updateUser(user.id, { subscriptionRenewalDate });
            console.log(`[/api/user] Subscription auto-renewed for ${user.email}. New renewal date: ${subscriptionRenewalDate}`);
            
            // Refetch user to get the updated renewal date
            user = await storage.getUserById(user.id) || user;
          }
        } catch (error) {
          console.error('[/api/user] Failed to auto-renew subscription:', error);
          // Continue without renewal - user can still access the system
        }
      } else if (user.role === 'company' && user.subscriptionRenewalDate && user.licenseVerified !== true) {
        // License is not verified - do not auto-renew
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const renewalDate = new Date(user.subscriptionRenewalDate);
        renewalDate.setHours(0, 0, 0, 0);
        
        if (renewalDate <= today) {
          console.warn(`[/api/user] Subscription expired for ${user.email} - license not verified, skipping auto-renewal`);
        }
      }
      
      // Auto-generate codes if company doesn't have them
      if (user.role === 'company') {
        const updates: any = {};
        
        // Generate resident code if missing
        if (!user.residentCode) {
          try {
            console.log('[/api/user] Company missing resident code, generating...');
            const residentCode = await generateResidentCode();
            updates.residentCode = residentCode;
            console.log(`[/api/user] Resident code generated: ${residentCode}`);
          } catch (error) {
            console.error('[/api/user] Failed to generate resident code:', error);
          }
        }
        
        // Generate property manager code if missing
        if (!user.propertyManagerCode) {
          try {
            console.log('[/api/user] Company missing property manager code, generating...');
            const propertyManagerCode = await generatePropertyManagerCode();
            updates.propertyManagerCode = propertyManagerCode;
            console.log(`[/api/user] Property manager code generated: ${propertyManagerCode}`);
          } catch (error) {
            console.error('[/api/user] Failed to generate property manager code:', error);
          }
        }
        
        // Update user if any codes were generated
        if (Object.keys(updates).length > 0) {
          await storage.updateUser(user.id, updates);
          // Refetch user to get the updated codes
          user = await storage.getUserById(user.id) || user;
        }
      }
      
      // Check if user has been terminated - destroy session if so
      if (user.terminatedDate) {
        req.session.destroy(() => {});
        return res.status(403).json({ message: "Your employment has been terminated. Please contact your administrator for more information." });
      }
      
      // For employees: include parent company's license verification status AND resident code
      let companyLicenseVerified: boolean | undefined = undefined;
      let companyResidentCode: string | undefined = undefined;
      if (user.role !== 'company' && user.role !== 'resident' && user.companyId) {
        try {
          const parentCompany = await storage.getUserById(user.companyId);
          if (parentCompany) {
            companyLicenseVerified = parentCompany.licenseVerified;
            companyResidentCode = parentCompany.residentCode || undefined;
          } else {
            console.warn(`[/api/user] Parent company not found for employee ${user.id}, companyId: ${user.companyId}`);
          }
        } catch (parentError) {
          console.error(`[/api/user] Error fetching parent company for employee ${user.id}:`, parentError);
          // Continue without parent company verification status
        }
      }
      
      // Strip sensitive fields (passwordHash)
      // Include licenseKey for company users so they can view it in their subscription page
      const { passwordHash, ...userWithoutPassword } = user;
      
      // Disable caching to ensure fresh data
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      
      res.json({ 
        user: {
          ...userWithoutPassword,
          ...(companyLicenseVerified !== undefined && { companyLicenseVerified }),
          ...(companyResidentCode && { residentCode: companyResidentCode })
        }
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Property Manager: Get all company links
  app.get("/api/property-manager/company-links", requireAuth, requireRole("property_manager"), async (req: Request, res: Response) => {
    try {
      const links = await storage.getPropertyManagerCompanyLinks(req.session.userId!);
      
      // Fetch company details for each link
      const linksWithCompanyDetails = await Promise.all(
        links.map(async (link) => {
          const company = await storage.getUserById(link.companyId);
          return {
            ...link,
            companyName: company?.companyName || 'Unknown Company',
          };
        })
      );
      
      res.json({ links: linksWithCompanyDetails });
    } catch (error) {
      console.error("Get property manager company links error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Property Manager: Add new company link
  app.post("/api/property-manager/company-links", requireAuth, requireRole("property_manager"), async (req: Request, res: Response) => {
    try {
      const { companyCode } = req.body;
      
      if (!companyCode || typeof companyCode !== 'string' || companyCode.length !== 10) {
        return res.status(400).json({ message: "Invalid company code format. Must be 10 characters." });
      }
      
      // Validate property manager code exists
      const company = await storage.getUserByPropertyManagerCode(companyCode);
      if (!company || company.role !== 'company') {
        return res.status(400).json({ message: "Invalid property manager code. Please check with the rope access company." });
      }
      
      // Check if link already exists
      const existingLinks = await storage.getPropertyManagerCompanyLinks(req.session.userId!);
      if (existingLinks.some(link => link.companyCode === companyCode)) {
        return res.status(400).json({ message: "You are already linked to this company." });
      }
      
      // Create the link
      const link = await storage.addPropertyManagerCompanyLink({
        propertyManagerId: req.session.userId!,
        companyCode,
        companyId: company.id,
      });
      
      res.json({ 
        link: {
          ...link,
          companyName: company.companyName,
        }
      });
    } catch (error) {
      console.error("Add property manager company link error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Property Manager: Remove company link
  app.delete("/api/property-manager/company-links/:id", requireAuth, requireRole("property_manager"), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      await storage.removePropertyManagerCompanyLink(id, req.session.userId!);
      
      res.json({ message: "Company link removed successfully" });
    } catch (error) {
      console.error("Remove property manager company link error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Property Manager: Get vendor summaries (My Vendors interface)
  app.get("/api/property-managers/me/vendors", requireAuth, requireRole("property_manager"), async (req: Request, res: Response) => {
    try {
      const vendorSummaries = await storage.getPropertyManagerVendorSummaries(req.session.userId!);
      res.json({ vendors: vendorSummaries });
    } catch (error) {
      console.error("Get property manager vendor summaries error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Property Manager: Add new vendor using company code
  app.post("/api/property-managers/vendors", requireAuth, requireRole("property_manager"), async (req: Request, res: Response) => {
    try {
      const { companyCode } = req.body;
      
      if (!companyCode || typeof companyCode !== 'string' || companyCode.length !== 10) {
        return res.status(400).json({ message: "Invalid company code format. Must be 10 characters." });
      }
      
      const link = await storage.addPropertyManagerVendor(req.session.userId!, companyCode);
      
      const vendorSummaries = await storage.getPropertyManagerVendorSummaries(req.session.userId!);
      const addedVendor = vendorSummaries.find(v => v.id === link.companyId);
      
      res.json({ 
        link,
        vendor: addedVendor,
        message: "Vendor added successfully"
      });
    } catch (error: any) {
      console.error("Add property manager vendor error:", error);
      if (error.message?.includes('Invalid company code')) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message?.includes('already linked')) {
        return res.status(400).json({ message: "You are already linked to this company." });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Property Manager: Update strata number for a vendor link
  app.patch("/api/property-managers/vendors/:linkId", requireAuth, requireRole("property_manager"), async (req: Request, res: Response) => {
    try {
      const { linkId } = req.params;
      const { strataNumber } = req.body;
      const propertyManagerId = req.session.userId!;
      
      // Verify the link belongs to this property manager
      const links = await storage.getPropertyManagerCompanyLinks(propertyManagerId);
      const ownedLink = links.find(link => link.id === linkId);
      
      if (!ownedLink) {
        return res.status(403).json({ message: "Unauthorized: This vendor link does not belong to you" });
      }
      
      // Validate strata number (required, 1-100 chars)
      if (!strataNumber || typeof strataNumber !== 'string' || strataNumber.trim() === '') {
        return res.status(400).json({ message: "Strata number is required and cannot be empty." });
      }
      
      if (strataNumber.length > 100) {
        return res.status(400).json({ message: "Strata number cannot exceed 100 characters." });
      }
      
      // Normalize strata number before saving (uppercase, no whitespace)
      const normalizeStrata = (strata: string): string => {
        return strata.toUpperCase().replace(/\s+/g, '');
      };
      
      const normalizedStrata = normalizeStrata(strataNumber);
      const updatedLink = await storage.updatePropertyManagerStrataNumber(linkId, normalizedStrata);
      
      res.json({ 
        link: updatedLink,
        message: "Strata number updated successfully"
      });
    } catch (error: any) {
      console.error("Update strata number error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Property Manager: Remove a vendor link
  app.delete("/api/property-managers/vendors/:linkId", requireAuth, requireRole("property_manager"), async (req: Request, res: Response) => {
    try {
      const { linkId } = req.params;
      const propertyManagerId = req.session.userId!;
      
      // Verify the link belongs to this property manager
      const links = await storage.getPropertyManagerCompanyLinks(propertyManagerId);
      const ownedLink = links.find(link => link.id === linkId);
      
      if (!ownedLink) {
        return res.status(403).json({ message: "Unauthorized: This vendor link does not belong to you" });
      }
      
      // Remove the link
      await storage.removePropertyManagerCompanyLink(linkId, propertyManagerId);
      
      res.json({ 
        message: "Vendor removed successfully"
      });
    } catch (error: any) {
      console.error("Remove vendor link error:", error);
      res.status(500).json({ message: "Failed to remove vendor. Please try again." });
    }
  });

  // Property Manager: Get projects filtered by company and strata number
  app.get("/api/property-managers/vendors/:linkId/projects", requireAuth, requireRole("property_manager"), async (req: Request, res: Response) => {
    try {
      const { linkId } = req.params;
      const propertyManagerId = req.session.userId!;
      
      // Verify the link belongs to this property manager
      const links = await storage.getPropertyManagerCompanyLinks(propertyManagerId);
      const ownedLink = links.find(link => link.id === linkId);
      
      if (!ownedLink) {
        return res.status(403).json({ message: "Unauthorized: This vendor link does not belong to you" });
      }
      
      // Require strata number to be set before fetching projects
      if (!ownedLink.strataNumber) {
        return res.status(400).json({ message: "Strata number required. Please set your strata/building number first." });
      }
      
      // Get filtered projects using companyId and normalized strata number
      const projects = await storage.getPropertyManagerFilteredProjects(
        ownedLink.companyId, 
        ownedLink.strataNumber
      );
      
      res.json({ projects });
    } catch (error: any) {
      console.error("Get filtered projects error:", error);
      if (error.message?.includes('not found')) {
        return res.status(404).json({ message: "Vendor link not found" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Property Manager: Get project details with complaints and documents
  app.get("/api/property-managers/vendors/:linkId/projects/:projectId", requireAuth, requireRole("property_manager"), async (req: Request, res: Response) => {
    try {
      const { linkId, projectId } = req.params;
      const propertyManagerId = req.session.userId!;
      
      // Verify the link belongs to this property manager
      const links = await storage.getPropertyManagerCompanyLinks(propertyManagerId);
      const ownedLink = links.find(link => link.id === linkId);
      
      if (!ownedLink) {
        return res.status(403).json({ message: "Unauthorized: This vendor link does not belong to you" });
      }
      
      // SECURITY: Require strata number to prevent cross-building data leaks
      if (!ownedLink.strataNumber) {
        return res.status(400).json({ message: "Strata number required. Please set your strata/building number first." });
      }
      
      // Get project details with complaints - enforces strata filtering
      const details = await storage.getPropertyManagerProjectDetails(
        projectId, 
        ownedLink.companyId,
        ownedLink.strataNumber // Pass normalized strata for dual-filter security
      );
      
      res.json(details);
    } catch (error: any) {
      console.error("Get project details error:", error);
      if (error.message?.includes('not found') || error.message?.includes('access denied')) {
        return res.status(404).json({ message: error.message });
      }
      if (error.message?.includes('Strata number required')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Property Manager: Update account settings
  app.patch("/api/property-managers/me/account", requireAuth, requireRole("property_manager"), async (req: Request, res: Response) => {
    try {
      const propertyManagerId = req.session.userId!;
      
      // Validate request body using Zod schema
      const validationResult = updatePropertyManagerAccountSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }
      
      const { name, email, currentPassword, newPassword } = validationResult.data;
      
      // Get current property manager data
      const currentUser = await storage.getUserById(propertyManagerId);
      if (!currentUser) {
        return res.status(404).json({ message: "Property manager not found" });
      }
      
      // Handle password change if requested
      if (newPassword) {
        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword!, currentUser.passwordHash);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Current password is incorrect" });
        }
        
        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await storage.updateUserPassword(propertyManagerId, hashedPassword);
      }
      
      // Update email if changed
      if (email && email !== currentUser.email) {
        // Check if email is already in use by another user
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== propertyManagerId) {
          return res.status(400).json({ message: "Email address is already in use" });
        }
        
        await storage.updateUserEmail(propertyManagerId, email);
      }
      
      // Update name if changed
      if (name && name !== currentUser.name) {
        await storage.updateUserName(propertyManagerId, name);
      }
      
      res.json({ message: "Account settings updated successfully" });
    } catch (error) {
      console.error("Update property manager account error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // SuperUser: Get all companies
  app.get("/api/superuser/companies", requireAuth, async (req: Request, res: Response) => {
    try {
      // Only allow superuser to access this endpoint
      if (req.session.userId !== 'superuser') {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      // Fetch all users with company role
      const companies = await storage.getAllCompanies();
      
      // Return companies without sensitive password hashes
      const companiesWithoutPasswords = companies.map(company => {
        const { passwordHash,  ...companyData } = company;
        return companyData;
      });

      res.json({ companies: companiesWithoutPasswords });
    } catch (error) {
      console.error("Get all companies error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // SuperUser: Get single company by ID
  app.get("/api/superuser/companies/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      // Only allow superuser to access this endpoint
      if (req.session.userId !== 'superuser') {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const company = await storage.getUserById(req.params.id);
      
      if (!company || company.role !== 'company') {
        return res.status(404).json({ message: "Company not found" });
      }

      // Return company without sensitive password hash
      const { passwordHash,  ...companyData } = company;
      res.json({ company: companyData });
    } catch (error) {
      console.error("Get company error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get employee data for a specific company (SuperUser only)
  app.get("/api/superuser/companies/:id/employees", requireAuth, async (req: Request, res: Response) => {
    try {
      // Only allow superuser to access this endpoint
      if (req.session.userId !== 'superuser') {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const companyId = req.params.id;
      const company = await storage.getUserById(companyId);
      
      if (!company || company.role !== 'company') {
        return res.status(404).json({ message: "Company not found" });
      }

      // Get all employees for this company (including terminated)
      const employees = await storage.getAllEmployees(companyId);
      
      // Calculate seat usage using new subscription system
      const limitsCheck = await checkSubscriptionLimits(companyId);
      const activeEmployeeCount = employees.filter(emp => !emp.terminatedDate).length;
      const tier = company.subscriptionTier || 'none';
      const additionalSeats = company.additionalSeatsCountCount || 0;
      const baseSeatLimit = limitsCheck.limits.maxSeats - additionalSeats;
      const seatLimit = limitsCheck.limits.maxSeats;
      
      res.json({ 
        seatInfo: {
          tier,
          seatLimit,
          baseSeatLimit,
          additionalSeats,
          seatsUsed: activeEmployeeCount,
          seatsAvailable: seatLimit === -1 ? -1 : Math.max(0, seatLimit - activeEmployeeCount),
          atSeatLimit: seatLimit > 0 && activeEmployeeCount >= seatLimit
        }
      });
    } catch (error) {
      console.error("Get company employees error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // SuperUser: Gift a free company account
  app.post("/api/superuser/gift-company", requireAuth, async (req: Request, res: Response) => {
    try {
      // Only allow superuser to access this endpoint
      if (req.session.userId !== 'superuser') {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { companyName, email, password, tier, licenseKey } = req.body;

      console.log('[Gift-Company] Creating gifted account:', { companyName, email, tier, licenseKey });

      // Validation
      if (!companyName || !email || !password || !tier || !licenseKey) {
        return res.status(400).json({ message: "Missing required fields: companyName, email, password, tier, licenseKey" });
      }

      // Validate tier
      const validTiers = ['basic', 'starter', 'premium', 'enterprise'];
      if (!validTiers.includes(tier)) {
        return res.status(400).json({ message: "Invalid tier. Must be one of: basic, starter, premium, enterprise" });
      }

      // Validate license key format (GIFT-XXXXX-XXXXX-XXXXX-[1-4])
      const expectedTierSuffix = tier === 'basic' ? '1' : tier === 'starter' ? '2' : tier === 'premium' ? '3' : '4';
      const licenseKeyPattern = new RegExp(`^GIFT-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-${expectedTierSuffix}$`);
      if (!licenseKeyPattern.test(licenseKey)) {
        return res.status(400).json({ message: "Invalid license key format or tier mismatch" });
      }

      // Get tier configuration
      const tierConfig = TIER_CONFIG[tier as TierName];

      // Use the provided license key from frontend
      const giftLicenseKey = licenseKey;
      const timestamp = Date.now();

      // Hash password before transaction
      const passwordHash = await bcrypt.hash(password, 10);

      // Use transaction for atomic user and license creation
      const result = await db.transaction(async (tx) => {
        // Check if user already exists (within transaction)
        const existingUserByEmail = await tx.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (existingUserByEmail) {
          throw new Error("Email already registered");
        }

        const existingUserByCompanyName = await tx.query.users.findFirst({
          where: eq(users.companyName, companyName),
        });

        if (existingUserByCompanyName) {
          throw new Error("Company name already taken");
        }

        // Create user with subscription data (active status since it's a gift)
        const [user] = await tx.insert(users).values({
          companyName,
          email,
          passwordHash,
          role: 'company',
          stripeCustomerId: `gift_${timestamp}`, // Placeholder for gift accounts
          stripeSubscriptionId: `gift_sub_${timestamp}`, // Placeholder for gift accounts
          subscriptionTier: tier,
          subscriptionStatus: 'active', // Gift accounts are immediately active
          licenseKey: giftLicenseKey,
        }).returning();

        if (!user) {
          throw new Error("Failed to create user");
        }

        console.log('[Gift-Company] User created:', user.id);

        // Store gift license key in database (within same transaction)
        await tx.insert(licenseKeys).values({
          licenseKey: giftLicenseKey,
          stripeSessionId: `gift_session_${timestamp}`, // Placeholder for gift
          stripeCustomerId: `gift_${timestamp}`,
          stripeSubscriptionId: `gift_sub_${timestamp}`,
          tier,
          currency: 'usd',
          used: true,
          usedByUserId: user.id,
          usedAt: new Date(),
        });

        console.log('[Gift-Company] Gift license key created:', giftLicenseKey);

        return user;
      });

      // Create default payroll config (outside transaction - not critical)
      try {
        await storage.createPayPeriodConfig({
          companyId: result.id,
          periodType: 'semi-monthly',
          firstPayDay: 1,
          secondPayDay: 15,
        });
        await storage.generatePayPeriods(result.id, 6);
        console.log('[Gift-Company] Payroll config created');
      } catch (error) {
        console.error('[Gift-Company] Payroll setup error:', error);
        // Don't fail if payroll setup fails - account is already created
      }

      console.log('[Gift-Company] Gifted account created successfully:', email);

      // Return user without password
      const { passwordHash: _, ...userWithoutPassword } = result;
      res.json({ 
        success: true, 
        message: `Company "${companyName}" created with ${tierConfig.name} tier access`,
        user: userWithoutPassword,
        licenseKey: giftLicenseKey,
        tier: tierConfig.name,
        maxProjects: tierConfig.maxProjects,
        maxSeats: tierConfig.maxSeats,
      });
    } catch (error: any) {
      console.error('[Gift-Company] Error:', error);
      const message = error.message || "Failed to create gifted company account";
      res.status(400).json({ message });
    }
  });

  // SuperUser: Gift add-ons to an existing company
  app.post("/api/superuser/companies/:id/gift-addons", requireAuth, async (req: Request, res: Response) => {
    try {
      // Only allow superuser to access this endpoint
      if (req.session.userId !== 'superuser') {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const companyId = req.params.id;
      const { extraSeats, extraProjects, whiteLabel } = req.body;

      console.log('[Gift-Addons] Gifting add-ons to company:', { companyId, extraSeats, extraProjects, whiteLabel });

      // Validate inputs - ensure non-negative integers
      const parsedSeats = parseInt(extraSeats) || 0;
      const parsedProjects = parseInt(extraProjects) || 0;
      const parsedWhiteLabel = whiteLabel === true;

      if (parsedSeats < 0 || parsedProjects < 0) {
        return res.status(400).json({ message: "Add-on counts cannot be negative" });
      }

      if (parsedSeats === 0 && parsedProjects === 0 && !parsedWhiteLabel) {
        return res.status(400).json({ message: "Please select at least one add-on to gift" });
      }

      // Fetch the company
      const company = await storage.getUserById(companyId);
      if (!company || company.role !== 'company') {
        return res.status(404).json({ message: "Company not found" });
      }

      // Build update object with validated values
      const updates: any = {};
      
      if (parsedSeats > 0) {
        // Each seat pack is 2 seats
        updates.additionalSeatsCount = (company.additionalSeatsCount || 0) + (parsedSeats * 2);
      }
      
      if (parsedProjects > 0) {
        updates.additionalProjectsCount = (company.additionalProjectsCount || 0) + parsedProjects;
      }
      
      if (parsedWhiteLabel && !company.whitelabelBrandingActive) {
        updates.whitelabelBrandingActive = true;
      }

      // Check if there's anything to update
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No new add-ons to gift (white label may already be active)" });
      }

      // Update the company in database
      await db.update(users)
        .set(updates)
        .where(eq(users.id, companyId));

      // Fetch updated company to confirm changes
      const updatedCompany = await storage.getUserById(companyId);

      console.log('[Gift-Addons] Add-ons gifted successfully:', updates);

      // Build descriptive message
      const giftedItems: string[] = [];
      if (parsedSeats > 0) giftedItems.push(`${parsedSeats * 2} seats`);
      if (parsedProjects > 0) giftedItems.push(`${parsedProjects} projects`);
      if (parsedWhiteLabel && !company.whitelabelBrandingActive) giftedItems.push('white-label branding');

      res.json({
        success: true,
        message: `Successfully gifted ${giftedItems.join(', ')} to ${company.companyName}`,
        company: {
          id: updatedCompany?.id,
          companyName: updatedCompany?.companyName,
          additionalSeatsCount: updatedCompany?.additionalSeatsCount,
          additionalProjectsCount: updatedCompany?.additionalProjectsCount,
          whitelabelBrandingActive: updatedCompany?.whitelabelBrandingActive,
        },
        gifted: {
          seats: parsedSeats * 2,
          projects: parsedProjects,
          whiteLabel: parsedWhiteLabel && !company.whitelabelBrandingActive,
        },
      });
    } catch (error: any) {
      console.error('[Gift-Addons] Error:', error);
      res.status(500).json({ message: error.message || "Failed to gift add-ons" });
    }
  });

  // Update user profile
  app.patch("/api/user/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updates: any = {};
      
      // Allow updating name for all users
      if (req.body.name !== undefined) {
        updates.name = req.body.name;
      }
      
      // Allow updating email for non-company users
      if (req.body.email !== undefined && user.role !== "company") {
        // Check if email is already in use by another user
        const existingUser = await storage.getUserByEmail(req.body.email);
        if (existingUser && existingUser.id !== user.id) {
          return res.status(400).json({ message: "Email address is already in use" });
        }
        updates.email = req.body.email;
      }
      
      // Role-specific updates
      if (user.role === "resident") {
        if (req.body.unitNumber !== undefined) {
          updates.unitNumber = req.body.unitNumber;
        }
      }
      
      if (user.role === "company") {
        if (req.body.companyName !== undefined) {
          updates.companyName = req.body.companyName;
        }
        if (req.body.residentCode !== undefined) {
          // Validate resident code format (10 characters, alphanumeric)
          const code = req.body.residentCode.trim().toUpperCase();
          if (code.length === 0) {
            // Allow clearing the code
            updates.residentCode = null;
          } else if (code.length !== 10) {
            return res.status(400).json({ message: "Resident code must be exactly 10 characters" });
          } else if (!/^[A-Z0-9]+$/.test(code)) {
            return res.status(400).json({ message: "Resident code can only contain letters and numbers" });
          } else {
            // Check if code is already in use by another company
            const existingCompany = await storage.getUserByResidentCode(code);
            if (existingCompany && existingCompany.id !== user.id) {
              return res.status(400).json({ message: "This resident code is already in use by another company" });
            }
            updates.residentCode = code;
          }
        }
        // Company profile fields
        if (req.body.streetAddress !== undefined) {
          updates.streetAddress = req.body.streetAddress || null;
        }
        if (req.body.province !== undefined) {
          updates.province = req.body.province || null;
        }
        if (req.body.country !== undefined) {
          updates.country = req.body.country || null;
        }
        if (req.body.zipCode !== undefined) {
          updates.zipCode = req.body.zipCode || null;
        }
        if (req.body.employeePhoneNumber !== undefined) {
          updates.employeePhoneNumber = req.body.employeePhoneNumber || null;
        }
        if (req.body.hourlyRate !== undefined) {
          // Convert empty string to null, otherwise parse as number
          updates.hourlyRate = req.body.hourlyRate === '' ? null : req.body.hourlyRate;
        }
      }
      
      await storage.updateUser(user.id, updates);
      const updatedUser = await storage.getUserById(user.id);
      
      const { passwordHash, ...userWithoutPassword } = updatedUser!;
      res.json({ user: userWithoutPassword, message: "Profile updated successfully" });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Change password
  app.patch("/api/user/password", requireAuth, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new passwords are required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Hash and update new password
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(user.id, { passwordHash, isTempPassword: false });
      
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete company account (company role only)
  app.delete("/api/user/account", requireAuth, requireRole("company"), async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: "Password is required to delete account" });
      }
      
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify password
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(400).json({ message: "Incorrect password" });
      }
      
      // Delete user (cascades to all employees, projects, work sessions, drop logs, complaints)
      await storage.deleteUser(user.id);
      
      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
      });
      
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Delete account error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get company information by ID
  app.get("/api/companies/:companyId", requireAuth, async (req: Request, res: Response) => {
    try {
      const company = await storage.getUserById(req.params.companyId);
      
      if (!company || company.role !== "company") {
        return res.status(404).json({ message: "Company not found" });
      }

      // Return only public company information
      res.json({ 
        company: {
          id: company.id,
          companyName: company.companyName,
          residentCode: company.residentCode,
        }
      });
    } catch (error) {
      console.error("Get company error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ==================== EMPLOYEE ROUTES ====================
  
  // Create employee (Company/Operations Manager only)
  app.post("/api/employees", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get company ID (company themselves or the employee's company)
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const { 
        name, email, password, role, techLevel, hourlyRate, permissions,
        startDate, birthday, driversLicenseNumber, driversLicenseProvince, driversLicenseDocuments,
        homeAddress, employeePhoneNumber, emergencyContactName, emergencyContactPhone,
        specialMedicalConditions, irataLevel, irataLicenseNumber, irataIssuedDate, irataExpirationDate
      } = req.body;
      
      if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      
      // Create employee account linked to company
      // Storage will hash the password
      const employee = await storage.createUser({
        name,
        email,
        role,
        techLevel: role === "rope_access_tech" ? techLevel : null,
        hourlyRate: hourlyRate ? hourlyRate : null,
        permissions: permissions || [],
        companyId, // Link employee to this company
        passwordHash: password, // Storage will hash this
        startDate: startDate || null,
        birthday: birthday || null,
        driversLicenseNumber: driversLicenseNumber || null,
        driversLicenseProvince: driversLicenseProvince || null,
        driversLicenseDocuments: driversLicenseDocuments || [],
        homeAddress: homeAddress || null,
        employeePhoneNumber: employeePhoneNumber || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        specialMedicalConditions: specialMedicalConditions || null,
        irataLevel: irataLevel || null,
        irataLicenseNumber: irataLicenseNumber || null,
        irataIssuedDate: irataIssuedDate || null,
        irataExpirationDate: irataExpirationDate || null,
      });
      
      const { passwordHash: _, ...employeeWithoutPassword } = employee;
      res.json({ employee: employeeWithoutPassword });
    } catch (error: any) {
      console.error("Create employee error:", error);
      
      // Check for duplicate email (Postgres unique constraint violation)
      if (error && typeof error === 'object' && error.code === '23505' && error.constraint?.includes('email')) {
        return res.status(409).json({ message: "Email address is already in use" });
      }
      
      res.status(500).json({ message: "Failed to create employee" });
    }
  });
  
  // Update employee
  app.patch("/api/employees/:id", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Get the employee to verify they belong to this company
      const employee = await storage.getUserById(req.params.id);
      
      // Allow if: employee belongs to company OR user is editing themselves
      const isOwnProfile = req.params.id === currentUser.id;
      const belongsToCompany = employee?.companyId === companyId;
      
      if (!employee || (!belongsToCompany && !isOwnProfile)) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { 
        name, email, role, techLevel, hourlyRate, permissions,
        startDate, birthday, driversLicenseNumber, driversLicenseProvince, driversLicenseDocuments,
        homeAddress, employeePhoneNumber, emergencyContactName, emergencyContactPhone,
        specialMedicalConditions, irataLevel, irataLicenseNumber, irataIssuedDate, 
        irataExpirationDate, terminatedDate, terminationReason, terminationNotes
      } = req.body;
      
      // Check if permissions or role changed, or if employee is being terminated
      const permissionsChanged = JSON.stringify(permissions || []) !== JSON.stringify(employee.permissions || []);
      const roleChanged = role !== undefined && role !== employee.role;
      const isBeingTerminated = terminatedDate !== undefined && terminatedDate !== null && !employee.terminatedDate;
      
      // Update employee
      const updatedEmployee = await storage.updateUser(req.params.id, {
        name,
        email,
        role,
        techLevel: role === "rope_access_tech" ? techLevel : null,
        hourlyRate: hourlyRate ? hourlyRate : null,
        permissions: permissions || [],
        startDate: startDate !== undefined ? (startDate || null) : undefined,
        birthday: birthday !== undefined ? (birthday || null) : undefined,
        driversLicenseNumber: driversLicenseNumber !== undefined ? (driversLicenseNumber || null) : undefined,
        driversLicenseProvince: driversLicenseProvince !== undefined ? (driversLicenseProvince || null) : undefined,
        driversLicenseDocuments: driversLicenseDocuments !== undefined ? (driversLicenseDocuments || []) : undefined,
        homeAddress: homeAddress !== undefined ? (homeAddress || null) : undefined,
        employeePhoneNumber: employeePhoneNumber !== undefined ? (employeePhoneNumber || null) : undefined,
        emergencyContactName: emergencyContactName !== undefined ? (emergencyContactName || null) : undefined,
        emergencyContactPhone: emergencyContactPhone !== undefined ? (emergencyContactPhone || null) : undefined,
        specialMedicalConditions: specialMedicalConditions !== undefined ? (specialMedicalConditions || null) : undefined,
        irataLevel: irataLevel !== undefined ? (irataLevel || null) : undefined,
        irataLicenseNumber: irataLicenseNumber !== undefined ? (irataLicenseNumber || null) : undefined,
        irataIssuedDate: irataIssuedDate !== undefined ? (irataIssuedDate || null) : undefined,
        irataExpirationDate: irataExpirationDate !== undefined ? (irataExpirationDate || null) : undefined,
        terminatedDate: terminatedDate !== undefined ? (terminatedDate || null) : undefined,
        terminationReason: terminationReason !== undefined ? (terminationReason || null) : undefined,
        terminationNotes: terminationNotes !== undefined ? (terminationNotes || null) : undefined,
      });
      
      // Send real-time notifications for permission/role changes or termination
      if (isBeingTerminated) {
        // User is being terminated - invalidate their session and notify
        await wsHub.terminateUser(req.params.id);
      } else if (permissionsChanged || roleChanged) {
        // Permissions or role changed - notify user to refresh their session
        await wsHub.updateUserPermissions(req.params.id);
      }
      
      const { passwordHash: _, ...employeeWithoutPassword } = updatedEmployee;
      res.json({ employee: employeeWithoutPassword });
    } catch (error: any) {
      console.error("Update employee error:", error);
      
      // Check for duplicate email (Postgres unique constraint violation)
      if (error && typeof error === 'object' && error.code === '23505' && error.constraint?.includes('email')) {
        return res.status(409).json({ message: "Email address is already in use" });
      }
      
      res.status(500).json({ message: "Failed to update employee" });
    }
  });
  
  // Reactivate employee
  app.post("/api/employees/:id/reactivate", requireAuth, requireRole("company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Get the employee to verify they belong to this company
      const employee = await storage.getUserById(req.params.id);
      
      if (!employee || employee.companyId !== companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Reactivate employee by clearing termination fields
      const updatedEmployee = await storage.updateUser(req.params.id, {
        terminatedDate: null,
        terminationReason: null,
        terminationNotes: null,
      });
      
      const { passwordHash: _, ...employeeWithoutPassword } = updatedEmployee;
      res.json({ employee: employeeWithoutPassword });
    } catch (error) {
      console.error("Reactivate employee error:", error);
      res.status(500).json({ message: "Failed to reactivate employee" });
    }
  });
  
  // Change employee password (company owner only)
  app.patch("/api/employees/:id/change-password", requireAuth, requireRole("company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Get the employee to verify they belong to this company
      const employee = await storage.getUserById(req.params.id);
      
      if (!employee || employee.companyId !== companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Prevent changing other company owners' passwords
      if (employee.role === "company" && employee.id !== currentUser.id) {
        return res.status(403).json({ message: "Cannot change another company owner's password" });
      }
      
      const { newPassword } = req.body;
      
      // Validate password
      if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
      
      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 10);
      
      // Update employee password
      await storage.updateUser(req.params.id, {
        passwordHash,
      });
      
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  
  // Delete employee
  app.delete("/api/employees/:id", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Get the employee to verify they belong to this company
      const employee = await storage.getUserById(req.params.id);
      
      if (!employee || employee.companyId !== companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteUser(req.params.id);
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error("Delete employee error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all employees
  // Get all employees including terminated (company only)
  app.get("/api/employees/all", requireAuth, requireRole("company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get all employees for this company (including terminated)
      const employees = await storage.getAllEmployees(currentUser.id);
      
      // Get the company owner as well (currentUser is the company owner)
      const companyOwner = currentUser;
      
      // Combine company owner and employees
      const allUsers = [companyOwner, ...employees];
      
      // Remove passwords from response
      const employeesWithoutPasswords = allUsers.map(emp => {
        const { passwordHash, ...empWithoutPassword } = emp;
        return empWithoutPassword;
      });
      
      // Calculate seat usage using new subscription system
      const activeEmployeeCount = employees.filter(emp => !emp.terminatedDate).length;
      const limitsCheck = await checkSubscriptionLimits(currentUser.id);
      const tier = companyOwner.subscriptionTier || 'none';
      const additionalSeats = companyOwner.additionalSeatsCount || 0;
      const seatLimit = limitsCheck.limits.maxSeats;
      const baseSeatLimit = seatLimit - additionalSeats;
      
      res.json({ 
        employees: employeesWithoutPasswords,
        seatInfo: {
          tier,
          seatLimit,
          baseSeatLimit,
          additionalSeats,
          seatsUsed: activeEmployeeCount,
          seatsAvailable: seatLimit === -1 ? -1 : Math.max(0, seatLimit - activeEmployeeCount),
          atSeatLimit: seatLimit > 0 && activeEmployeeCount >= seatLimit
        }
      });
    } catch (error) {
      console.error("Get all employees error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get active employees (excludes terminated) - for general use
  app.get("/api/employees", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor", "rope_access_tech"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get company ID (company themselves or the employee's company)
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Get employees for this company only
      const employees = await storage.getAllEmployees(companyId);
      
      // Get the company owner as well
      const companyOwner = await storage.getUserById(companyId);
      
      // Combine employees and company owner
      const allUsers = companyOwner ? [companyOwner, ...employees] : employees;
      
      // Filter out terminated employees and remove passwords from response
      const activeEmployees = allUsers
        .filter(emp => !emp.terminatedDate)
        .map(emp => {
          const { passwordHash, ...empWithoutPassword } = emp;
          return empWithoutPassword;
        });
      
      // Calculate seat usage using new subscription system
      const employeeCount = employees.filter(emp => !emp.terminatedDate).length;
      const limitsCheck = await checkSubscriptionLimits(companyId);
      const tier = companyOwner?.subscriptionTier || 'none';
      const additionalSeats = companyOwner?.additionalSeatsCount || 0;
      const seatLimit = limitsCheck.limits.maxSeats;
      const baseSeatLimit = seatLimit - additionalSeats;
      
      res.json({ 
        employees: activeEmployees,
        seatInfo: {
          tier,
          seatLimit,
          baseSeatLimit,
          additionalSeats,
          seatsUsed: employeeCount,
          seatsAvailable: seatLimit === -1 ? -1 : Math.max(0, seatLimit - employeeCount),
          atSeatLimit: seatLimit > 0 && employeeCount >= seatLimit
        }
      });
    } catch (error) {
      console.error("Get employees error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ==================== PROJECT ROUTES ====================
  
  // Upload rope access plan PDF
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'));
      }
    }
  });
  
  // Upload images (photos)
  const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // Upload employee documents (images or PDFs)
  const documentUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only image or PDF files are allowed'));
      }
    }
  });

  // Property Manager: Upload anchor inspection document
  app.post("/api/property-managers/vendors/:linkId/projects/:projectId/anchor-inspection", requireAuth, requireRole("property_manager"), documentUpload.single('document'), async (req: Request, res: Response) => {
    try {
      const { linkId, projectId } = req.params;
      const propertyManagerId = req.session.userId!;
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Verify the link belongs to this property manager
      const links = await storage.getPropertyManagerCompanyLinks(propertyManagerId);
      const ownedLink = links.find(link => link.id === linkId);
      
      if (!ownedLink) {
        return res.status(403).json({ message: "Unauthorized: This vendor link does not belong to you" });
      }
      
      // SECURITY: Require strata number to prevent cross-building data leaks
      if (!ownedLink.strataNumber) {
        return res.status(400).json({ message: "Strata number required. Please set your strata/building number first." });
      }
      
      // Get project to verify access and get company info
      const projectDetails = await storage.getPropertyManagerProjectDetails(
        projectId, 
        ownedLink.companyId,
        ownedLink.strataNumber
      );
      
      // Upload file to object storage
      const objectStorageService = new ObjectStorageService();
      const fileUrl = await objectStorageService.uploadPublicFile(
        req.file.originalname,
        req.file.buffer,
        req.file.mimetype
      );
      
      // Get property manager info for uploaded by name
      const propertyManager = await storage.getUserById(propertyManagerId);
      const uploadedByName = propertyManager?.name || 
                             `${propertyManager?.firstName} ${propertyManager?.lastName}`.trim() || 
                             'Property Manager';
      
      // Create company document with equipment_inspection type
      await storage.createCompanyDocument({
        companyId: ownedLink.companyId,
        documentType: 'equipment_inspection',
        fileName: req.file.originalname,
        fileUrl,
        uploadedById: propertyManagerId,
        uploadedByName,
        projectId,
      });
      
      // Also update the project's anchorInspectionCertificateUrl field
      await storage.updateProject(projectId, {
        anchorInspectionCertificateUrl: fileUrl,
      });
      
      res.json({ 
        message: "Anchor inspection document uploaded successfully",
        fileUrl 
      });
    } catch (error: any) {
      console.error("Upload anchor inspection document error:", error);
      if (error.message?.includes('not found') || error.message?.includes('access denied')) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to upload document. Please try again." });
    }
  });

  // Upload employee document (driver's license, abstract, etc.)
  app.post("/api/upload-employee-document", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), documentUpload.single('document'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const extension = req.file.mimetype === 'application/pdf' ? 'pdf' : req.file.mimetype.split('/')[1];
      const filename = `employee-document-${timestamp}.${extension}`;

      // Upload to public object storage (same as resident portal and quotes)
      const objectStorageService = new ObjectStorageService();
      const url = await objectStorageService.uploadPublicFile(
        filename,
        req.file.buffer,
        req.file.mimetype
      );

      res.json({ url });
    } catch (error) {
      console.error("Employee document upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload document";
      res.status(500).json({ message: `Upload failed: ${errorMessage}` });
    }
  });
  
  // ==================== COMPANY BRANDING ROUTES ====================
  
  // Upload company logo for white label branding
  app.post("/api/company/branding/logo", requireAuth, requireRole("company"), imageUpload.single('logo'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser || currentUser.role !== "company") {
        return res.status(403).json({ message: "Access denied" });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const extension = req.file.mimetype.split('/')[1];
      const filename = `company-logo-${currentUser.id}-${timestamp}.${extension}`;

      // Upload to public object storage (so residents can see it)
      const objectStorageService = new ObjectStorageService();
      const url = await objectStorageService.uploadPublicFile(
        filename,
        req.file.buffer,
        req.file.mimetype
      );

      // Update company's branding logo URL
      await storage.updateUser(currentUser.id, {
        brandingLogoUrl: url
      });

      res.json({ url });
    } catch (error) {
      console.error("Logo upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload logo";
      res.status(500).json({ message: `Upload failed: ${errorMessage}` });
    }
  });
  
  // Update company branding colors
  app.patch("/api/company/branding", requireAuth, requireRole("company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser || currentUser.role !== "company") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { colors } = req.body;

      // Validate that colors is an array
      if (!Array.isArray(colors)) {
        return res.status(400).json({ message: "Colors must be an array" });
      }

      // Validate hex color format for each color
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      for (const color of colors) {
        if (color && !hexColorRegex.test(color)) {
          return res.status(400).json({ message: `Invalid color format: ${color}` });
        }
      }

      // Update branding colors
      await storage.updateUser(currentUser.id, {
        brandingColors: colors
      });

      res.json({ message: "Branding updated successfully" });
    } catch (error) {
      console.error("Branding update error:", error);
      res.status(500).json({ message: "Failed to update branding" });
    }
  });
  
  // Get company branding (public endpoint for residents)
  app.get("/api/company/:companyId/branding", async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      
      const company = await storage.getUserById(companyId);
      
      if (!company || company.role !== "company") {
        return res.status(404).json({ message: "Company not found" });
      }

      // Return branding info (public, safe to expose)
      // Only return branding details if subscription is active
      res.json({
        logoUrl: company.whitelabelBrandingActive ? company.brandingLogoUrl : null,
        colors: company.whitelabelBrandingActive ? (company.brandingColors || []) : [],
        companyName: company.companyName,
        subscriptionActive: company.whitelabelBrandingActive || false,
      });
    } catch (error) {
      console.error("Error fetching company branding:", error);
      res.status(500).json({ message: "Failed to fetch branding" });
    }
  });
  
  // ==================== RESIDENTS ROUTES ====================
  
  // Get all residents for the company
  app.get("/api/residents", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get all residents associated with this company's projects
      const residents = await storage.getResidentsByCompany(companyId);
      
      // Get all clients to find building names
      const clients = await storage.getClientsByCompany(companyId);
      
      // Create a map of strata plan number to building name
      const strataPlanToBuilding = new Map<string, string>();
      clients.forEach(client => {
        if (client.lmsNumbers && Array.isArray(client.lmsNumbers)) {
          client.lmsNumbers.forEach((lms: any) => {
            if (lms.number && lms.buildingName) {
              strataPlanToBuilding.set(lms.number, lms.buildingName);
            }
          });
        }
      });
      
      // Return residents without sensitive data, with building names
      const safeResidents = residents.map(resident => ({
        id: resident.id,
        name: resident.name,
        email: resident.email,
        phone: resident.phoneNumber,
        unit: resident.unitNumber,
        parkingStall: resident.parkingStallNumber,
        strataPlan: resident.strataPlanNumber,
        buildingName: resident.strataPlanNumber ? strataPlanToBuilding.get(resident.strataPlanNumber) : undefined,
        buildingId: resident.strataPlanNumber, // Keep for backwards compatibility
        companyId: companyId,
      }));
      
      res.json(safeResidents);
    } catch (error) {
      console.error("Error fetching residents:", error);
      res.status(500).json({ message: "Failed to fetch residents" });
    }
  });
  
  // ==================== CLIENT ROUTES ====================
  
  // Get all clients for the company
  app.get("/api/clients", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      let clients: any[] = [];
      
      if (currentUser.role === "property_manager") {
        // Property managers can see clients from all linked companies
        const links = await storage.getPropertyManagerCompanyLinks(currentUser.id);
        const allClients = await Promise.all(
          links.map(link => storage.getClientsByCompany(link.companyId))
        );
        clients = allClients.flat();
      } else {
        // Company users and employees see their own company's clients
        const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
        
        if (!companyId) {
          return res.status(403).json({ message: "Access denied" });
        }
        
        clients = await storage.getClientsByCompany(companyId);
      }
      
      res.json({ clients });
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });
  
  // Get single client by ID
  app.get("/api/clients/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const client = await storage.getClientById(req.params.id);
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      // Verify access
      if (currentUser.role === "property_manager") {
        // Property managers can access clients from linked companies
        const links = await storage.getPropertyManagerCompanyLinks(currentUser.id);
        const linkedCompanyIds = links.map(link => link.companyId);
        
        if (!linkedCompanyIds.includes(client.companyId)) {
          return res.status(403).json({ message: "Access denied" });
        }
      } else {
        // Company users and employees can only access their own company's clients
        const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
        
        if (client.companyId !== companyId) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      res.json(client);
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });
  
  // Create new client
  app.post("/api/clients", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const validatedData = insertClientSchema.parse(req.body);
      
      const newClient = await storage.createClient({
        ...validatedData,
        companyId,
      });
      
      res.json(newClient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating client:", error);
      res.status(500).json({ message: "Failed to create client" });
    }
  });
  
  // Update client
  app.patch("/api/clients/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const client = await storage.getClientById(req.params.id);
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (client.companyId !== companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updates = insertClientSchema.partial().parse(req.body);
      const updatedClient = await storage.updateClient(req.params.id, updates);
      
      res.json(updatedClient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating client:", error);
      res.status(500).json({ message: "Failed to update client" });
    }
  });
  
  // Delete client
  app.delete("/api/clients/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const client = await storage.getClientById(req.params.id);
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (client.companyId !== companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteClient(req.params.id);
      res.json({ message: "Client deleted successfully" });
    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).json({ message: "Failed to delete client" });
    }
  });
  
  app.post("/api/upload-rope-access-plan", requireAuth, requireRole("company", "operations_manager", "rope_access_tech"), upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `rope-access-plan-${timestamp}.pdf`;
      
      // Upload to object storage
      const objectStorageService = new ObjectStorageService();
      const url = await objectStorageService.uploadPublicFile(
        filename,
        req.file.buffer,
        'application/pdf'
      );
      
      res.json({ url });
    } catch (error) {
      console.error("File upload error details:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
      res.status(500).json({ message: `Upload failed: ${errorMessage}` });
    }
  });
  
  // Update project's rope access plan
  app.patch("/api/projects/:id/rope-access-plan", requireAuth, requireRole("company", "operations_manager", "rope_access_tech"), upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const projectId = req.params.id;
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the project to verify access
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Verify user has access to this project (same company)
      const userCompanyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (project.companyId !== userCompanyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `rope-access-plan-${timestamp}.pdf`;
      
      // Upload to object storage
      const objectStorageService = new ObjectStorageService();
      const url = await objectStorageService.uploadPublicFile(
        filename,
        req.file.buffer,
        'application/pdf'
      );
      
      // Add to documents array (keep all uploaded PDFs)
      const currentDocuments = project.documentUrls || [];
      const updatedDocuments = [...currentDocuments, url];
      
      // Update project with new PDF URL and add to documents array
      const updatedProject = await storage.updateProject(projectId, { 
        ropeAccessPlanUrl: url,
        documentUrls: updatedDocuments
      });
      
      res.json({ project: updatedProject, url });
    } catch (error) {
      console.error("File upload error details:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
      res.status(500).json({ message: `Upload failed: ${errorMessage}` });
    }
  });
  
  // Upload anchor inspection certificate
  app.post("/api/upload-anchor-certificate", requireAuth, requireRole("company", "operations_manager", "rope_access_tech"), upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `anchor-inspection-certificate-${timestamp}.pdf`;
      
      // Upload to object storage
      const objectStorageService = new ObjectStorageService();
      const url = await objectStorageService.uploadPublicFile(
        filename,
        req.file.buffer,
        'application/pdf'
      );
      
      res.json({ url });
    } catch (error) {
      console.error("Anchor certificate upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
      res.status(500).json({ message: `Upload failed: ${errorMessage}` });
    }
  });
  
  // Update project's anchor inspection certificate
  app.patch("/api/projects/:id/anchor-certificate", requireAuth, requireRole("company", "operations_manager", "rope_access_tech"), upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const projectId = req.params.id;
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the project to verify access
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Verify user has access to this project (same company)
      const userCompanyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (project.companyId !== userCompanyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `anchor-inspection-certificate-${timestamp}.pdf`;
      
      // Upload to object storage
      const objectStorageService = new ObjectStorageService();
      const url = await objectStorageService.uploadPublicFile(
        filename,
        req.file.buffer,
        'application/pdf'
      );
      
      // Update project with new certificate URL
      const updatedProject = await storage.updateProject(projectId, { 
        anchorInspectionCertificateUrl: url
      });
      
      res.json({ project: updatedProject, url });
    } catch (error) {
      console.error("Anchor certificate upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
      res.status(500).json({ message: `Upload failed: ${errorMessage}` });
    }
  });
  
  // Upload image to project with optional unit number and comment
  app.post("/api/projects/:id/images", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), imageUpload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const projectId = req.params.id;
      const { unitNumber, comment, isMissedUnit, missedUnitNumber, isMissedStall, missedStallNumber } = req.body;
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the project to verify access
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Verify user has access to this project (same company) and determine companyId
      const userCompanyId = currentUser.role === "company" ? currentUser.id : (currentUser.companyId ?? project.companyId);
      if (project.companyId !== userCompanyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Validate missed unit fields
      const isMissed = isMissedUnit === 'true' || isMissedUnit === true;
      if (isMissed) {
        // Only allow missed unit marking for in-suite dryer vent projects
        if (project.jobType !== 'in_suite_dryer_vent_cleaning') {
          return res.status(400).json({ message: "Missed units can only be marked for in-suite dryer vent cleaning projects" });
        }
        
        // Require unit number when marking as missed
        if (!missedUnitNumber || missedUnitNumber.trim() === '') {
          return res.status(400).json({ message: "Unit number is required when marking a photo as a missed unit" });
        }
      }
      
      // Validate missed stall fields
      const isMissedStallBool = isMissedStall === 'true' || isMissedStall === true;
      if (isMissedStallBool) {
        // Only allow missed stall marking for parkade projects
        if (project.jobType !== 'parkade_pressure_cleaning') {
          return res.status(400).json({ message: "Missed stalls can only be marked for parkade pressure cleaning projects" });
        }
        
        // Require stall number when marking as missed
        if (!missedStallNumber || missedStallNumber.trim() === '') {
          return res.status(400).json({ message: "Stall number is required when marking a photo as a missed stall" });
        }
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const ext = req.file.mimetype.split('/')[1];
      const filename = `project-image-${projectId}-${timestamp}.${ext}`;
      
      // Upload to object storage
      const objectStorageService = new ObjectStorageService();
      const url = await objectStorageService.uploadPublicFile(
        filename,
        req.file.buffer,
        req.file.mimetype
      );
      
      // Create photo record in database with optional unit number and comment
      const photo = await storage.createProjectPhoto({
        projectId,
        companyId: userCompanyId,
        uploadedBy: currentUser.id,
        imageUrl: url,
        unitNumber: unitNumber || null,
        comment: comment || null,
        isMissedUnit: isMissed,
        missedUnitNumber: isMissed ? missedUnitNumber : null,
        isMissedStall: isMissedStallBool,
        missedStallNumber: isMissedStallBool ? missedStallNumber : null,
      });
      
      res.json({ photo, url });
    } catch (error) {
      console.error("Image upload error details:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
      res.status(500).json({ message: `Upload failed: ${errorMessage}` });
    }
  });

  // Get photos for a project
  app.get("/api/projects/:id/photos", requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = req.params.id;
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the project to verify access
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Verify user has access to this project
      const userCompanyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      const userStrataPlan = currentUser.role === "resident" ? currentUser.strataPlanNumber : null;
      
      if (currentUser.role === "resident") {
        // Residents can only see photos for projects matching their strata plan
        if (project.strataPlanNumber !== userStrataPlan) {
          return res.status(403).json({ message: "Access denied" });
        }
      } else {
        // Staff must be from same company
        if (project.companyId !== userCompanyId) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      let photos = await storage.getProjectPhotos(projectId);
      console.log(`[PHOTOS DEBUG] Fetched ${photos.length} photos for project ${projectId}`);
      console.log(`[PHOTOS DEBUG] First photo:`, photos[0]);
      
      // Filter photos for residents to only show their unit
      if (currentUser.role === "resident" && currentUser.unitNumber) {
        photos = photos.filter(photo => photo.unitNumber === currentUser.unitNumber);
      }
      
      res.json({ photos });
    } catch (error) {
      console.error("Get photos error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get photos";
      res.status(500).json({ message: errorMessage });
    }
  });

  // Get photos for resident's unit or parking stall
  app.get("/api/my-unit-photos", requireAuth, requireRole("resident"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser || !currentUser.strataPlanNumber) {
        return res.status(400).json({ message: "Strata plan number not found" });
      }
      
      // Get photos by unit number OR parking stall number and strata plan number (works across all companies)
      // Match on either unitNumber or parkingStallNumber fields
      const unitNumber = currentUser.unitNumber || '';
      const parkingStallNumber = currentUser.parkingStallNumber || '';
      
      const photos = await storage.getPhotosByUnitAndStrataPlan(
        unitNumber, 
        currentUser.strataPlanNumber,
        parkingStallNumber
      );
      
      res.json({ photos });
    } catch (error) {
      console.error("Get unit photos error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get unit photos";
      res.status(500).json({ message: errorMessage });
    }
  });
  
  // Serve public files from object storage
  app.get("/public-objects/:filePath(*)", async (req: Request, res: Response) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve private documents (authenticated users only)
  app.get("/api/private-documents/:fileName(*)", requireAuth, async (req: Request, res: Response) => {
    const fileName = req.params.fileName;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.getPrivateFile(fileName);
      if (!file) {
        return res.status(404).json({ error: "Document not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error retrieving private document:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Get custom job types for a company
  app.get("/api/custom-job-types", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get company ID (company themselves or the employee's company)
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const customJobTypes = await storage.getCustomJobTypesByCompany(companyId);
      res.json({ customJobTypes });
    } catch (error) {
      console.error("Get custom job types error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Delete a custom job type
  app.delete("/api/custom-job-types/:id", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      await storage.deleteCustomJobType(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete custom job type error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create project
  app.post("/api/projects", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get company ID (company themselves or the employee's company)
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Job types that don't use drop-based tracking
      const nonDropJobTypes = ['in_suite_dryer_vent_cleaning', 'parkade_pressure_cleaning', 'ground_window_cleaning', 'general_pressure_washing'];
      const isNonDropJob = nonDropJobTypes.includes(req.body.jobType);
      
      const projectData = insertProjectSchema.parse({
        ...req.body,
        strataPlanNumber: normalizeStrataPlan(req.body.strataPlanNumber),
        companyId,
        targetCompletionDate: req.body.targetCompletionDate || null,
        // Default dailyDropTarget to 0 for non-drop job types
        dailyDropTarget: isNonDropJob ? 0 : req.body.dailyDropTarget,
      });
      
      const project = await storage.createProject(projectData);
      
      // If this is a custom job type, save it to the company's custom job types list (if not already exists)
      if (project.jobType === "other" && project.customJobType) {
        const existingCustomJobType = await storage.getCustomJobTypeByName(companyId, project.customJobType);
        if (!existingCustomJobType) {
          await storage.createCustomJobType({
            companyId,
            jobTypeName: project.customJobType,
          });
        }
      }
      
      // Automatically create a scheduled job for this project if start/end dates are provided
      if (project.startDate && project.endDate) {
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        
        // Create job title based on building name or strata plan number
        const jobTitle = project.buildingName || (project.strataPlanNumber ? `${normalizeStrataPlan(project.strataPlanNumber)} - ${project.jobType.replace(/_/g, ' ')}` : project.jobType.replace(/_/g, ' '));
        
        const job = await storage.createScheduledJob({
          companyId,
          projectId: project.id,
          title: jobTitle,
          description: `Auto-scheduled from project creation`,
          jobType: project.jobType,
          customJobType: project.customJobType,
          startDate,
          endDate,
          status: "upcoming",
          location: project.buildingAddress || null,
          color: project.calendarColor || "#3b82f6",
          estimatedHours: project.estimatedHours || null,
          actualHours: null,
          notes: null,
          createdBy: currentUser.id,
        });
        
        // Assign employees to the job if any were selected
        if (project.assignedEmployees && project.assignedEmployees.length > 0) {
          await storage.replaceJobAssignments(job.id, project.assignedEmployees, currentUser.id);
        }
      }
      
      res.json({ project });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update project
  app.patch("/api/projects/:id", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { id } = req.params;
      
      // Get existing project to verify ownership
      const existingProject = await storage.getProjectById(id);
      if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Verify access
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (existingProject.companyId !== companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Build update object with all allowed fields
      const allowedUpdates: any = {
        buildingName: req.body.buildingName,
        buildingAddress: req.body.buildingAddress,
        strataPlanNumber: req.body.strataPlanNumber,
        jobType: req.body.jobType,
        targetCompletionDate: req.body.targetCompletionDate || null,
        estimatedHours: req.body.estimatedHours,
        startDate: req.body.startDate || null,
        endDate: req.body.endDate || null,
      };
      
      // Add job-type specific fields
      if (req.body.totalDropsNorth !== undefined) allowedUpdates.totalDropsNorth = req.body.totalDropsNorth;
      if (req.body.totalDropsEast !== undefined) allowedUpdates.totalDropsEast = req.body.totalDropsEast;
      if (req.body.totalDropsSouth !== undefined) allowedUpdates.totalDropsSouth = req.body.totalDropsSouth;
      if (req.body.totalDropsWest !== undefined) allowedUpdates.totalDropsWest = req.body.totalDropsWest;
      if (req.body.dailyDropTarget !== undefined) allowedUpdates.dailyDropTarget = req.body.dailyDropTarget;
      if (req.body.totalFloors !== undefined) allowedUpdates.totalFloors = req.body.totalFloors;
      if (req.body.floorsPerDay !== undefined) allowedUpdates.floorsPerDay = req.body.floorsPerDay;
      if (req.body.totalStalls !== undefined) allowedUpdates.totalStalls = req.body.totalStalls;
      if (req.body.stallsPerDay !== undefined) allowedUpdates.stallsPerDay = req.body.stallsPerDay;
      
      const updatedProject = await storage.updateProject(id, allowedUpdates);
      res.json({ project: updatedProject });
    } catch (error) {
      console.error("Update project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all projects (filtered by role)
  app.get("/api/projects", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get status filter from query params (return all projects if not specified)
      const statusFilter = req.query.status as string | undefined;
      
      let projects: Project[];
      
      if (currentUser.role === "company") {
        // Return only THIS company's projects, filtered by status (all if not specified)
        projects = await storage.getProjectsByCompany(currentUser.id, statusFilter);
      } else if (currentUser.role === "operations_manager" || currentUser.role === "supervisor" || currentUser.role === "general_supervisor" || currentUser.role === "rope_access_supervisor" || currentUser.role === "rope_access_tech") {
        // Return projects for their company, filtered by status (all if not specified)
        const companyId = currentUser.companyId;
        if (companyId) {
          projects = await storage.getProjectsByCompany(companyId, statusFilter);
        } else {
          projects = [];
        }
      } else if (currentUser.role === "resident") {
        // Return projects matching resident's company AND strata plan
        if (currentUser.companyId && currentUser.linkedResidentCode) {
          // Resident has linked - but first verify their code still matches
          const company = await storage.getUserById(currentUser.companyId);
          
          if (company && company.residentCode === currentUser.linkedResidentCode) {
            // Code still matches - show company's projects at this strata plan
            const allCompanyProjects = await storage.getProjectsByCompany(currentUser.companyId, statusFilter);
            projects = allCompanyProjects.filter(p => p.strataPlanNumber === currentUser.strataPlanNumber);
          } else {
            // Code has changed - unlink the resident (treat as not linked)
            console.log(`[/api/projects] Resident ${currentUser.email} code mismatch - unlinking`);
            await storage.updateUser(currentUser.id, { 
              companyId: null,
              linkedResidentCode: null
            });
            projects = []; // No projects - they need to re-link
          }
        } else {
          // Resident hasn't linked - no projects
          projects = [];
        }
      } else if (currentUser.role === "property_manager") {
        // Return projects from all linked companies
        projects = await storage.getProjectsForPropertyManager(currentUser.id, statusFilter);
      } else {
        projects = [];
      }
      
      // Add completedDrops, totalDrops, and totalHoursWorked to each project
      const projectsWithProgress = await Promise.all(
        projects.map(async (project) => {
          const { total } = await storage.getProjectProgress(project.id);
          const totalDrops = (project.totalDropsNorth ?? 0) + 
                            (project.totalDropsEast ?? 0) + 
                            (project.totalDropsSouth ?? 0) + 
                            (project.totalDropsWest ?? 0);
          
          // Calculate total hours worked from work sessions (for hours-based tracking)
          const workSessions = await storage.getWorkSessionsByProject(project.id);
          const completedSessions = workSessions.filter(s => s.endTime);
          const totalHoursWorked = completedSessions.reduce((sum, session) => {
            if (session.startTime && session.endTime) {
              const hours = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60);
              return sum + hours;
            }
            return sum;
          }, 0);
          
          // Get the latest manual completion percentage for hours-based projects
          const latestCompletionPercentage = completedSessions.length > 0
            ? completedSessions
                .filter(s => s.manualCompletionPercentage !== null && s.manualCompletionPercentage !== undefined)
                .sort((a, b) => new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime())[0]
                ?.manualCompletionPercentage || null
            : null;
          
          return {
            ...project,
            completedDrops: total,
            totalDrops,
            totalHoursWorked,
            latestCompletionPercentage,
          };
        })
      );
      
      // Calculate project usage using new subscription system (company users only)
      let projectInfo = null;
      if (currentUser.role === "company") {
        const limitsCheck = await checkSubscriptionLimits(currentUser.id);
        const tier = currentUser.subscriptionTier || 'none';
        const additionalProjects = currentUser.additionalProjectsCount || 0;
        const projectLimit = limitsCheck.limits.maxProjects;
        const baseProjectLimit = projectLimit - additionalProjects;
        // Only count non-completed projects toward the limit
        const projectsUsed = projectsWithProgress.filter(p => p.status !== "completed").length;
        const projectsAvailable = projectLimit === -1 ? -1 : Math.max(0, projectLimit - projectsUsed);
        const atProjectLimit = projectLimit > 0 && projectsUsed >= projectLimit;
        
        projectInfo = {
          tier,
          projectLimit,
          baseProjectLimit,
          additionalProjects,
          projectsUsed,
          projectsAvailable,
          atProjectLimit
        };
      }
      
      // Disable caching to ensure fresh data
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.json({ 
        projects: projectsWithProgress,
        projectInfo
      });
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get single project
  app.get("/api/projects/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before returning project
      const hasAccess = await storage.verifyProjectAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const project = await storage.getProjectById(req.params.id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.role === "operations_manager" || 
                                    currentUser.role === "supervisor" || currentUser.role === "general_supervisor" || currentUser.role === "rope_access_supervisor" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      // Check if user can view safety documents (rope access plans)
      const canViewSafetyDocs = canViewSafetyDocuments(currentUser);
      
      // Fetch company's resident code
      let companyResidentCode: string | null = null;
      try {
        const company = await storage.getUserById(project.companyId);
        if (company && company.residentCode) {
          companyResidentCode = company.residentCode;
        }
      } catch (error) {
        console.error('[/api/projects/:id] Failed to fetch company resident code:', error);
      }
      
      // Add completed drops (total and per-elevation) to the project
      const { north, east, south, west, total } = await storage.getProjectProgress(project.id);
      const projectWithProgress = {
        ...project,
        completedDrops: total,
        completedDropsNorth: north,
        completedDropsEast: east,
        completedDropsSouth: south,
        completedDropsWest: west,
        companyResidentCode, // Include company's resident code for all staff
      };
      
      // Filter sensitive data based on permissions
      let filteredProject = { ...projectWithProgress };
      
      // Filter financial data if user doesn't have financial permissions
      if (!canViewFinancialData) {
        filteredProject.estimatedHours = null;
      }
      
      // Filter rope access plan if user doesn't have safety document permissions
      if (!canViewSafetyDocs) {
        filteredProject.ropeAccessPlanUrl = null;
      }
      
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.json({ project: filteredProject });
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get residents for a project
  app.get("/api/projects/:id/residents", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only company and management roles can view residents
      if (!["company", "operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor"].includes(currentUser.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Verify access to this project
      const hasAccess = await storage.verifyProjectAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const project = await storage.getProjectById(req.params.id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Get all residents with matching strata plan number
      const residents = project.strataPlanNumber 
        ? await storage.getResidentsByStrataPlan(project.strataPlanNumber)
        : [];
      
      // Return residents without sensitive data
      const residentsData = residents.map(resident => ({
        id: resident.id,
        email: resident.email,
        name: resident.name,
        unitNumber: resident.unitNumber,
        phoneNumber: resident.phoneNumber,
        strataPlanNumber: resident.strataPlanNumber,
      }));
      
      res.json({ residents: residentsData });
    } catch (error) {
      console.error("Get project residents error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update project status
  app.patch("/api/projects/:id/status", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before updating
      const hasAccess = await storage.verifyProjectAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { status } = req.body;
      
      if (!["active", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const project = await storage.updateProjectStatus(req.params.id, status);
      res.json({ project });
    } catch (error) {
      console.error("Update project status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Delete project
  app.delete("/api/projects/:id", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before deleting
      const hasAccess = await storage.verifyProjectAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteProject(req.params.id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Delete project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get deleted projects
  app.get("/api/projects/deleted/list", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const deletedProjects = await storage.getDeletedProjects(companyId);
      res.json({ projects: deletedProjects });
    } catch (error) {
      console.error("Get deleted projects error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Restore deleted project
  app.post("/api/projects/:id/restore", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const hasAccess = await storage.verifyProjectAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const restoredProject = await storage.restoreProject(req.params.id);
      res.json({ project: restoredProject });
    } catch (error) {
      console.error("Restore project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get project progress
  app.get("/api/projects/:id/progress", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before returning progress
      const hasAccess = await storage.verifyProjectAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const project = await storage.getProjectById(req.params.id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const { north, east, south, west, total } = await storage.getProjectProgress(req.params.id);
      const totalDrops = (project.totalDropsNorth ?? 0) + 
                        (project.totalDropsEast ?? 0) + 
                        (project.totalDropsSouth ?? 0) + 
                        (project.totalDropsWest ?? 0);
      
      // For in-suite dryer vent cleaning, use floorCount as total units instead of totalDrops
      const isInSuite = project.jobType === 'in_suite_dryer_vent_cleaning';
      const isParkade = project.jobType === 'parkade_pressure_cleaning';
      
      const totalUnits = isInSuite 
        ? (project.floorCount ?? 0) 
        : isParkade 
        ? (project.floorCount ?? 0)  // For parkade, floorCount stores total stalls
        : totalDrops;
      const progressPercentage = totalUnits > 0 ? (total / totalUnits) * 100 : 0;
      
      res.json({
        completedDrops: total,
        completedDropsNorth: north,
        completedDropsEast: east,
        completedDropsSouth: south,
        completedDropsWest: west,
        totalDrops: isInSuite ? (project.floorCount ?? 0) : isParkade ? (project.floorCount ?? 0) : totalDrops,
        totalDropsNorth: project.totalDropsNorth ?? 0,
        totalDropsEast: project.totalDropsEast ?? 0,
        totalDropsSouth: project.totalDropsSouth ?? 0,
        totalDropsWest: project.totalDropsWest ?? 0,
        totalStalls: isParkade ? (project.floorCount ?? 0) : undefined,
        completedStalls: isParkade ? total : undefined,
        progressPercentage: Math.round(progressPercentage),
      });
    } catch (error) {
      console.error("Get project progress error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ==================== DROP LOG ROUTES ====================
  
  // Create or update drop log - allow all employee roles to log drops
  app.post("/api/drops", requireAuth, requireRole("rope_access_tech", "operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const dropData = insertDropLogSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      
      // Verify tech has access to this project before logging drops
      const hasAccess = await storage.verifyProjectAccess(
        dropData.projectId,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied - you cannot log drops for this project" });
      }
      
      // Check if drop log already exists for this project/user/date
      const existingLog = await storage.getDropLogByProjectAndDate(
        dropData.projectId,
        dropData.userId,
        dropData.date
      );
      
      let dropLog;
      if (existingLog) {
        // Update existing log with directional drops (method expects 5 args: id + 4 numbers)
        dropLog = await storage.updateDropLog(
          existingLog.id,
          dropData.dropsCompletedNorth || 0,
          dropData.dropsCompletedEast || 0,
          dropData.dropsCompletedSouth || 0,
          dropData.dropsCompletedWest || 0
        );
      } else {
        // Create new log
        dropLog = await storage.createDropLog(dropData);
      }
      
      res.json({ dropLog });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create drop log error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get drop logs for a project
  app.get("/api/projects/:projectId/drops", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before returning drops
      const hasAccess = await storage.verifyProjectAccess(
        req.params.projectId,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const drops = await storage.getDropLogsByProject(req.params.projectId);
      res.json({ drops });
    } catch (error) {
      console.error("Get drop logs error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get current user's drops for today (for daily target tracking)
  app.get("/api/my-drops-today", requireAuth, async (req: Request, res: Response) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const dropLogs = await storage.getDropLogsByUserAndDate(req.session.userId!, today);
      
      // Sum up all directional drops
      const totalDropsToday = dropLogs.reduce((sum, log) => {
        return sum + (log.dropsCompletedNorth || 0) + (log.dropsCompletedEast || 0) + 
               (log.dropsCompletedSouth || 0) + (log.dropsCompletedWest || 0);
      }, 0);
      
      res.json({ 
        totalDropsToday,
        dropLogs 
      });
    } catch (error) {
      console.error("Get today's drops error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ==================== WORK SESSION ROUTES ====================
  
  // Start a work session
  app.post("/api/projects/:projectId/work-sessions/start", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { projectId } = req.params;
      const { startLatitude, startLongitude, workDate } = req.body;
      
      // Verify employee has access to this project
      const hasAccess = await storage.verifyProjectAccess(
        projectId,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied - you cannot work on this project" });
      }
      
      // Check if there's already an active session for this employee on this project
      const activeSession = await storage.getActiveWorkSession(currentUser.id, projectId);
      
      if (activeSession) {
        return res.status(400).json({ message: "You already have an active work session for this project" });
      }
      
      // Get project to access company ID
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Create new work session
      const now = new Date();
      // Use client's local date if provided, otherwise fall back to server date
      const sessionDate = workDate || now.toISOString().split('T')[0];
      const session = await storage.startWorkSession({
        projectId,
        employeeId: currentUser.id,
        companyId: project.companyId,
        workDate: sessionDate, // Use client's local date
        startTime: now,
        startLatitude: startLatitude || null,
        startLongitude: startLongitude || null,
      });
      
      res.json({ session });
    } catch (error) {
      console.error("Start work session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // End a work session
  app.patch("/api/projects/:projectId/work-sessions/:sessionId/end", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { sessionId } = req.params;
      const { dropsCompletedNorth, dropsCompletedEast, dropsCompletedSouth, dropsCompletedWest, shortfallReason, endLatitude, endLongitude, manualCompletionPercentage } = req.body;
      
      // Get the session to verify ownership
      const activeSession = await storage.getActiveWorkSession(currentUser.id, req.params.projectId);
      
      if (!activeSession || activeSession.id !== sessionId) {
        return res.status(403).json({ message: "Access denied - not your active session" });
      }
      
      // Get project to check daily target
      const project = await storage.getProjectById(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Validate manual completion percentage for hours-based job types
      const isHoursBased = project.jobType === "general_pressure_washing" || project.jobType === "ground_window_cleaning";
      let validatedPercentage: number | undefined = undefined;
      
      if (isHoursBased) {
        // Manual completion percentage is REQUIRED for hours-based job types
        if (manualCompletionPercentage === undefined || manualCompletionPercentage === null) {
          return res.status(400).json({ message: "Completion percentage is required for this job type" });
        }
        
        // Only accept string or number types
        if (typeof manualCompletionPercentage !== 'string' && typeof manualCompletionPercentage !== 'number') {
          return res.status(400).json({ message: "Completion percentage must be a number" });
        }
        
        // Strict validation: reject malformed numeric strings
        let percentageValue: number;
        if (typeof manualCompletionPercentage === 'string') {
          const trimmed = manualCompletionPercentage.trim();
          // Reject empty or whitespace-only strings
          if (trimmed.length === 0) {
            return res.status(400).json({ message: "Completion percentage cannot be empty" });
          }
          // Strict regex: only allow decimal numbers (blocks hex like 0x10, binary, etc.)
          if (!/^\d+(\.\d+)?$/.test(trimmed)) {
            return res.status(400).json({ message: "Completion percentage must be a valid decimal number" });
          }
          percentageValue = Number(trimmed);
          // Explicit NaN check after conversion (defensive)
          if (isNaN(percentageValue)) {
            return res.status(400).json({ message: "Completion percentage must be a valid number" });
          }
        } else {
          percentageValue = manualCompletionPercentage;
          // Check for NaN in numeric inputs
          if (isNaN(percentageValue)) {
            return res.status(400).json({ message: "Completion percentage must be a valid number" });
          }
        }
        
        // Range validation
        if (percentageValue < 0 || percentageValue > 100) {
          return res.status(400).json({ message: "Completion percentage must be between 0 and 100" });
        }
        
        validatedPercentage = percentageValue;
      }
      
      // Validate elevation drops (ensure they are numbers and non-negative)
      const north = typeof dropsCompletedNorth === 'number' ? dropsCompletedNorth : 0;
      const east = typeof dropsCompletedEast === 'number' ? dropsCompletedEast : 0;
      const south = typeof dropsCompletedSouth === 'number' ? dropsCompletedSouth : 0;
      const west = typeof dropsCompletedWest === 'number' ? dropsCompletedWest : 0;
      
      if (north < 0 || east < 0 || south < 0 || west < 0) {
        return res.status(400).json({ message: "Invalid drops completed value" });
      }
      
      const totalDropsCompleted = north + east + south + west;
      
      // If drops < target, require shortfall reason (only if dailyDropTarget is set)
      if (project.dailyDropTarget && totalDropsCompleted < project.dailyDropTarget && (!shortfallReason || shortfallReason.trim() === '')) {
        return res.status(400).json({ message: "Shortfall reason is required when drops completed is less than the daily target" });
      }
      
      // Calculate overtime breakdown
      const now = new Date();
      const overtimeBreakdown = await calculateOvertimeHours(
        project.companyId,
        currentUser.id,
        new Date(activeSession.workDate),
        new Date(activeSession.startTime),
        now
      );
      
      // Prepare manual completion percentage (rounded to integer for hours-based jobs)
      // Use the validatedPercentage from earlier validation
      const completionPercentage = validatedPercentage !== undefined ? Math.round(validatedPercentage) : undefined;
      
      // End the session with elevation-specific drops and overtime hours
      const session = await storage.endWorkSession(
        sessionId,
        north,
        east,
        south,
        west,
        (project.dailyDropTarget && totalDropsCompleted < project.dailyDropTarget) ? shortfallReason : undefined,
        endLatitude || null,
        endLongitude || null,
        overtimeBreakdown.regularHours,
        overtimeBreakdown.overtimeHours,
        overtimeBreakdown.doubleTimeHours,
        completionPercentage
      );
      
      res.json({ session });
    } catch (error) {
      console.error("End work session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Edit/update existing work session (requires financial permission)
  app.patch("/api/work-sessions/:sessionId", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // CRITICAL SECURITY: Check financial permission before allowing edits
      const hasFinancialPermission = currentUser.role === "company" || 
                                     currentUser.viewFinancialData === true ||
                                     currentUser.role === "operations_manager" || 
                                     currentUser.role === "supervisor" || 
                                     currentUser.role === "general_supervisor" || 
                                     currentUser.role === "rope_access_supervisor" || 
                                     currentUser.permissions?.includes("view_financial_data");
      
      if (!hasFinancialPermission) {
        return res.status(403).json({ message: "Access denied - financial permission required to edit work sessions" });
      }
      
      const { sessionId } = req.params;
      const { startTime, endTime, dropsCompletedNorth, dropsCompletedEast, dropsCompletedSouth, dropsCompletedWest, manualCompletionPercentage, isBillable } = req.body;
      
      // CRITICAL SECURITY: Get company ID and fetch session with company-scoped query
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(403).json({ message: "Unable to determine company" });
      }
      
      // Company-scoped query ensures session belongs to requester's company
      const existingSession = await storage.getWorkSessionForCompany(sessionId, companyId);
      if (!existingSession) {
        // Either session doesn't exist OR it belongs to another company (intentionally ambiguous for security)
        return res.status(404).json({ message: "Work session not found" });
      }
      
      // Get project to check job type for validation (company ownership already verified)
      const project = await storage.getProjectById(existingSession.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Prepare updates object
      const updates: any = {};
      
      // Handle time updates and recalculate overtime if both times provided
      if (startTime !== undefined) {
        updates.startTime = new Date(startTime);
      }
      if (endTime !== undefined) {
        updates.endTime = endTime ? new Date(endTime) : null;
      }
      
      // Recalculate overtime hours if both start and end times are available
      if ((updates.startTime || existingSession.startTime) && (updates.endTime || existingSession.endTime)) {
        const finalStartTime = updates.startTime || new Date(existingSession.startTime);
        const finalEndTime = updates.endTime || new Date(existingSession.endTime);
        
        const overtimeBreakdown = await calculateOvertimeHours(
          project.companyId,
          existingSession.employeeId,
          finalStartTime,
          finalStartTime,
          finalEndTime
        );
        
        updates.regularHours = overtimeBreakdown.regularHours.toString();
        updates.overtimeHours = overtimeBreakdown.overtimeHours.toString();
        updates.doubleTimeHours = overtimeBreakdown.doubleTimeHours.toString();
      }
      
      // Handle drops completed for elevation-based projects
      if (dropsCompletedNorth !== undefined) updates.dropsCompletedNorth = parseInt(dropsCompletedNorth);
      if (dropsCompletedEast !== undefined) updates.dropsCompletedEast = parseInt(dropsCompletedEast);
      if (dropsCompletedSouth !== undefined) updates.dropsCompletedSouth = parseInt(dropsCompletedSouth);
      if (dropsCompletedWest !== undefined) updates.dropsCompletedWest = parseInt(dropsCompletedWest);
      
      // Handle manual completion percentage for hours-based projects
      const isHoursBased = project.jobType === "general_pressure_washing" || project.jobType === "ground_window_cleaning";
      if (isHoursBased && manualCompletionPercentage !== undefined) {
        const percentage = parseInt(manualCompletionPercentage);
        if (percentage < 0 || percentage > 100) {
          return res.status(400).json({ message: "Completion percentage must be between 0 and 100" });
        }
        updates.manualCompletionPercentage = percentage;
      }
      
      // Handle billable status
      if (isBillable !== undefined) {
        updates.isBillable = isBillable;
      }
      
      // Update the session
      const updatedSession = await storage.updateWorkSession(sessionId, updates);
      
      res.json({ session: updatedSession });
    } catch (error) {
      console.error("Update work session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get work sessions for a project (management and tech view)
  app.get("/api/projects/:projectId/work-sessions", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor", "rope_access_tech"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get company ID
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Verify access to project
      const hasAccess = await storage.verifyProjectAccess(
        req.params.projectId,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.role === "operations_manager" || 
                                    currentUser.role === "supervisor" || currentUser.role === "general_supervisor" || currentUser.role === "rope_access_supervisor" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      const sessions = await storage.getWorkSessionsByProject(req.params.projectId, companyId);
      
      // Filter financial data if user doesn't have financial permissions
      const filteredSessions = canViewFinancialData ? sessions : sessions.map(session => ({
        ...session,
        techHourlyRate: null,
      }));
      
      res.json({ sessions: filteredSessions });
    } catch (error) {
      console.error("Get work sessions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all work sessions across all company projects
  app.get("/api/all-work-sessions", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Determine company ID
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.role === "operations_manager" || 
                                    currentUser.role === "supervisor" || currentUser.role === "general_supervisor" || currentUser.role === "rope_access_supervisor" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      // Get all projects for the company
      const projects = await storage.getProjectsByCompany(companyId);
      
      // Collect all work sessions across all projects with their project's daily target
      const allSessions = [];
      for (const project of projects) {
        const projectSessions = await storage.getWorkSessionsByProject(project.id, companyId);
        
        // Determine the correct target field based on job type
        let dailyTarget = project.dailyDropTarget || 0;
        if (project.jobType === 'parkade_pressure_cleaning') {
          dailyTarget = project.stallsPerDay || 0;
        } else if (project.jobType === 'in_suite_dryer_vent_cleaning') {
          dailyTarget = project.floorsPerDay || project.suitesPerDay || 0;
        }
        
        // Add dailyDropTarget and calculate total dropsCompleted from elevation fields
        // Also enrich with employee name by fetching user
        const sessionsWithTarget = await Promise.all(projectSessions.map(async (session) => {
          // Fetch employee name from users table
          const employee = await storage.getUserById(session.employeeId);
          
          return {
            ...session,
            employeeName: employee?.name || null, // Add employeeName for GPS legend
            dailyDropTarget: dailyTarget,
            projectName: project.buildingName, // Add project name for map popups
            dropsCompleted: (session.dropsCompletedNorth || 0) + 
                           (session.dropsCompletedEast || 0) + 
                           (session.dropsCompletedSouth || 0) + 
                           (session.dropsCompletedWest || 0),
          };
        }));
        allSessions.push(...sessionsWithTarget);
      }
      
      // Filter financial data if user doesn't have financial permissions
      const filteredSessions = canViewFinancialData ? allSessions : allSessions.map(session => ({
        ...session,
        techHourlyRate: null,
      }));
      
      res.json({ sessions: filteredSessions });
    } catch (error) {
      console.error("Failed to fetch all work sessions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Generate sample work sessions for testing
  app.post("/api/projects/:projectId/generate-sample-sessions", requireAuth, requireRole("company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const projectId = req.params.projectId;
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Verify project belongs to current company
      if (project.companyId !== currentUser.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get employees for this company
      const employees = await storage.getAllEmployees(currentUser.id);
      const techs = employees.filter(e => e.role === 'rope_access_tech' && !e.terminatedDate);
      
      if (techs.length === 0) {
        return res.status(400).json({ message: "No active technicians found. Please create employees first." });
      }
      
      const generatedSessions = [];
      const now = new Date();
      
      // Generate sessions spanning 3 years (2023, 2024, 2025)
      for (let year = 2023; year <= 2025; year++) {
        // For each year, generate sessions across different months
        const monthsToGenerate = year === 2025 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [0, 2, 4, 6, 8, 10]; // More in current year
        
        for (const month of monthsToGenerate) {
          // Generate 3-8 sessions per month
          const sessionsThisMonth = Math.floor(Math.random() * 6) + 3;
          
          for (let i = 0; i < sessionsThisMonth; i++) {
            // Random day in the month
            const day = Math.floor(Math.random() * 28) + 1;
            const workDate = new Date(year, month, day);
            
            // Skip future dates
            if (workDate > now) continue;
            
            // Random tech
            const tech = techs[Math.floor(Math.random() * techs.length)];
            
            // Random start time (6 AM to 10 AM)
            const startHour = Math.floor(Math.random() * 4) + 6;
            const startMinute = Math.random() > 0.5 ? 0 : 30;
            const startTime = new Date(year, month, day, startHour, startMinute, 0);
            
            // Work duration (6-10 hours)
            const workHours = Math.floor(Math.random() * 5) + 6;
            const endTime = new Date(startTime.getTime() + workHours * 60 * 60 * 1000);
            
            // Random drops completed per elevation
            const dailyTarget = project.dailyDropTarget || 20;
            const totalTarget = dailyTarget;
            
            // 70% chance of meeting target
            const meetTarget = Math.random() < 0.7;
            const totalDrops = meetTarget 
              ? totalTarget + Math.floor(Math.random() * 5) 
              : Math.floor(totalTarget * (0.6 + Math.random() * 0.3));
            
            // Distribute drops across elevations
            const dropsNorth = Math.floor(totalDrops * 0.3);
            const dropsEast = Math.floor(totalDrops * 0.25);
            const dropsSouth = Math.floor(totalDrops * 0.25);
            const dropsWest = totalDrops - dropsNorth - dropsEast - dropsSouth;
            
            const shortfallReason = !meetTarget ? [
              "Weather conditions",
              "Equipment issues",
              "Building access delays",
              "Staff shortage",
              "Client requested changes"
            ][Math.floor(Math.random() * 5)] : null;
            
            // Insert directly into database (id is auto-generated, don't specify it)
            await db.insert(workSessions).values({
              employeeId: tech.id,
              projectId: projectId,
              companyId: project.companyId,
              workDate: workDate.toISOString().split('T')[0],
              startTime: new Date(startTime),
              endTime: new Date(endTime),
              dropsCompletedNorth: dropsNorth,
              dropsCompletedEast: dropsEast,
              dropsCompletedSouth: dropsSouth,
              dropsCompletedWest: dropsWest,
              regularHours: workHours.toString(),
              overtimeHours: '0',
              doubleTimeHours: '0',
              shortfallReason: shortfallReason,
              startLatitude: null,
              startLongitude: null,
              endLatitude: null,
              endLongitude: null,
            });
            
            generatedSessions.push({
              workDate: workDate.toISOString().split('T')[0],
              techName: tech.name,
              totalDrops: dropsNorth + dropsEast + dropsSouth + dropsWest,
            });
          }
        }
      }
      
      res.json({ 
        message: `Generated ${generatedSessions.length} sample work sessions`,
        count: generatedSessions.length,
        sessions: generatedSessions.slice(0, 10) // Return first 10 as preview
      });
    } catch (error) {
      console.error("Generate sample sessions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get active workers (sessions without end time) - Management only
  app.get("/api/active-workers", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Determine company ID
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.role === "operations_manager" || 
                                    currentUser.role === "supervisor" || currentUser.role === "general_supervisor" || currentUser.role === "rope_access_supervisor" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      // Get all projects for the company
      const projects = await storage.getProjectsByCompany(companyId);
      
      // Collect all active work sessions (no end time)
      const activeSessions = [];
      for (const project of projects) {
        const projectSessions = await storage.getWorkSessionsByProject(project.id, companyId);
        // Filter for active sessions and add project info
        const activeProjectSessions = projectSessions
          .filter(session => !session.endTime)
          .map(session => ({
            ...session,
            projectName: project.buildingName,
            strataPlanNumber: project.strataPlanNumber,
            jobType: project.jobType,
          }));
        activeSessions.push(...activeProjectSessions);
      }
      
      // Sort by start time (oldest first)
      activeSessions.sort((a, b) => {
        const aTime = a.startTime ? new Date(a.startTime).getTime() : 0;
        const bTime = b.startTime ? new Date(b.startTime).getTime() : 0;
        return aTime - bTime;
      });
      
      // Filter financial data if user doesn't have financial permissions
      const filteredSessions = canViewFinancialData ? activeSessions : activeSessions.map(session => ({
        ...session,
        techHourlyRate: null,
      }));
      
      res.json({ sessions: filteredSessions });
    } catch (error) {
      console.error("Failed to fetch active workers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get employee's own work sessions for a project
  app.get("/api/projects/:projectId/my-work-sessions", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access to project
      const hasAccess = await storage.verifyProjectAccess(
        req.params.projectId,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const sessions = await storage.getWorkSessionsByEmployee(currentUser.id, req.params.projectId);
      res.json({ sessions });
    } catch (error) {
      console.error("Get my work sessions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ==================== NON-BILLABLE WORK SESSION ROUTES ====================
  
  // Start a non-billable work session
  app.post("/api/non-billable-sessions", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if employee already has an active non-billable session
      const activeSession = await storage.getActiveNonBillableSession(currentUser.id);
      if (activeSession) {
        return res.status(400).json({ message: "You already have an active non-billable session" });
      }
      
      // Use client's local date if provided, otherwise fall back to server date
      const now = new Date();
      const sessionDate = req.body.workDate || now.toISOString().split('T')[0];
      
      console.log("Creating non-billable session with data:", {
        employeeId: currentUser.id,
        companyId: currentUser.companyId || currentUser.id,
        workDate: sessionDate,
        startTime: now,
        endTime: null,
        description: req.body.description,
      });
      
      const session = await storage.createNonBillableWorkSession({
        employeeId: currentUser.id,
        companyId: currentUser.companyId || currentUser.id,
        workDate: sessionDate,
        startTime: now,
        endTime: null,
        description: req.body.description,
      });
      
      console.log("Session created successfully:", session);
      res.json({ session });
    } catch (error) {
      console.error("Start non-billable session error:", error);
      console.error("Error stack:", (error as Error).stack);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // End a non-billable work session
  app.patch("/api/non-billable-sessions/:sessionId/end", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const session = await storage.getNonBillableSessionById(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Verify ownership
      if (session.employeeId !== currentUser.id) {
        return res.status(403).json({ message: "You can only end your own sessions" });
      }
      
      if (session.endTime) {
        return res.status(400).json({ message: "Session already ended" });
      }
      
      // Calculate overtime breakdown for non-billable session
      const now = new Date();
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      const overtimeBreakdown = await calculateOvertimeHours(
        companyId!,
        currentUser.id,
        new Date(session.workDate),
        new Date(session.startTime),
        now
      );
      
      const updatedSession = await storage.endNonBillableWorkSession(
        req.params.sessionId,
        overtimeBreakdown.regularHours,
        overtimeBreakdown.overtimeHours,
        overtimeBreakdown.doubleTimeHours
      );
      res.json({ session: updatedSession });
    } catch (error) {
      console.error("End non-billable session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get active non-billable session for current user
  app.get("/api/non-billable-sessions/active", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const session = await storage.getActiveNonBillableSession(currentUser.id);
      res.json({ session: session || null });
    } catch (error) {
      console.error("Get active non-billable session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all non-billable sessions for company (management only)
  app.get("/api/non-billable-sessions", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      const sessions = await storage.getAllNonBillableSessions(companyId!);
      res.json({ sessions });
    } catch (error) {
      console.error("Get non-billable sessions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get non-billable sessions by employee (management only)
  app.get("/api/non-billable-sessions/employee/:employeeId", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const sessions = await storage.getNonBillableSessionsByEmployee(req.params.employeeId);
      res.json({ sessions });
    } catch (error) {
      console.error("Get non-billable sessions by employee error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ==================== IRATA TASK LOG ROUTES ====================
  
  // Valid IRATA task IDs derived from canonical schema definition
  const VALID_IRATA_TASK_IDS = IRATA_TASK_TYPES.map(t => t.id);
  
  // Create IRATA task log (when ending a work session)
  app.post("/api/irata-task-logs", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { workSessionId, tasksPerformed, notes } = req.body;
      
      // Validate required fields
      if (!workSessionId || !tasksPerformed || tasksPerformed.length === 0) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Validate workSessionId exists and belongs to the current user
      const workSession = await storage.getWorkSessionById(workSessionId);
      if (!workSession) {
        return res.status(400).json({ message: "Work session not found" });
      }
      
      if (workSession.employeeId !== currentUser.id) {
        return res.status(403).json({ message: "You can only log tasks for your own work sessions" });
      }
      
      // Ensure work session is completed (has endTime)
      if (!workSession.endTime) {
        return res.status(400).json({ message: "Cannot log tasks for an incomplete work session" });
      }
      
      // Check for duplicate log for this work session
      const existingLog = await storage.getIrataTaskLogByWorkSession(workSessionId);
      if (existingLog) {
        return res.status(400).json({ message: "IRATA tasks have already been logged for this work session" });
      }
      
      // Validate tasksPerformed is an array of strings
      if (!Array.isArray(tasksPerformed) || tasksPerformed.length === 0) {
        return res.status(400).json({ message: "Tasks performed must be a non-empty array" });
      }
      
      // Validate all entries are strings
      if (tasksPerformed.some(t => typeof t !== 'string')) {
        return res.status(400).json({ message: "All task IDs must be strings" });
      }
      
      // Canonicalize: filter to valid task IDs only, ensure uniqueness
      const canonicalTasks = [...new Set(
        tasksPerformed
          .filter((t: string) => VALID_IRATA_TASK_IDS.includes(t))
      )];
      
      // Reject if no valid tasks remain after canonicalization
      if (canonicalTasks.length === 0) {
        return res.status(400).json({ message: "At least one valid IRATA task must be selected" });
      }
      
      // Report invalid task IDs that were filtered out
      const invalidTasks = tasksPerformed.filter((t: string) => !VALID_IRATA_TASK_IDS.includes(t));
      if (invalidTasks.length > 0) {
        return res.status(400).json({ message: `Invalid task IDs: ${invalidTasks.join(', ')}` });
      }
      
      // Compute hoursWorked and workDate from the authoritative work session data
      const sessionStart = new Date(workSession.startTime);
      const sessionEnd = new Date(workSession.endTime);
      const hoursWorked = ((sessionEnd.getTime() - sessionStart.getTime()) / (1000 * 60 * 60)).toFixed(2);
      const workDate = sessionStart.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Get project info from the work session's project (authoritative source)
      const project = await storage.getProjectById(workSession.projectId);
      const derivedBuildingName = project?.buildingName || null;
      const derivedBuildingAddress = project?.buildingAddress || null;
      
      // Get company ID from work session (authoritative source)
      const companyId = workSession.companyId;
      
      try {
        const log = await storage.createIrataTaskLog({
          workSessionId,
          employeeId: currentUser.id,
          companyId,
          projectId: workSession.projectId,
          buildingName: derivedBuildingName,
          buildingAddress: derivedBuildingAddress,
          tasksPerformed: canonicalTasks,
          workDate,
          hoursWorked,
          notes: typeof notes === 'string' ? notes : null,
        });
        
        res.json({ log });
      } catch (dbError: any) {
        // Handle unique constraint violation (duplicate insert race condition)
        if (dbError.code === '23505') {
          return res.status(400).json({ message: "IRATA tasks have already been logged for this work session" });
        }
        throw dbError;
      }
    } catch (error) {
      console.error("Create IRATA task log error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get my IRATA task logs (employee's own logs)
  app.get("/api/my-irata-task-logs", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const logs = await storage.getIrataTaskLogsByEmployee(currentUser.id);
      res.json({ logs });
    } catch (error) {
      console.error("Get my IRATA task logs error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all IRATA task logs for company (management only)
  app.get("/api/irata-task-logs", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const logs = await storage.getIrataTaskLogsByCompany(companyId);
      res.json({ logs });
    } catch (error) {
      console.error("Get IRATA task logs error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get IRATA task logs by employee ID (management only)
  app.get("/api/irata-task-logs/employee/:employeeId", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const logs = await storage.getIrataTaskLogsByEmployee(req.params.employeeId);
      res.json({ logs });
    } catch (error) {
      console.error("Get IRATA task logs by employee error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get IRATA task log by work session ID
  app.get("/api/irata-task-logs/work-session/:workSessionId", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const log = await storage.getIrataTaskLogByWorkSession(req.params.workSessionId);
      res.json({ log: log || null });
    } catch (error) {
      console.error("Get IRATA task log by work session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update IRATA task log
  app.patch("/api/irata-task-logs/:logId", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify ownership
      const existingLog = await storage.getIrataTaskLogById(req.params.logId);
      if (!existingLog || existingLog.employeeId !== currentUser.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { tasksPerformed, notes } = req.body;
      
      const log = await storage.updateIrataTaskLog(req.params.logId, {
        tasksPerformed: tasksPerformed || existingLog.tasksPerformed,
        notes: notes !== undefined ? notes : existingLog.notes,
      });
      
      res.json({ log });
    } catch (error) {
      console.error("Update IRATA task log error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Delete IRATA task log
  app.delete("/api/irata-task-logs/:logId", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify ownership or management role
      const existingLog = await storage.getIrataTaskLogById(req.params.logId);
      if (!existingLog) {
        return res.status(404).json({ message: "Log not found" });
      }
      
      const isManagement = ["company", "owner_ceo", "operations_manager", "supervisor"].includes(currentUser.role);
      if (existingLog.employeeId !== currentUser.id && !isManagement) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteIrataTaskLog(req.params.logId);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete IRATA task log error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update my IRATA baseline hours (for logbook)
  const baselineHoursSchema = z.object({
    baselineHours: z.number().min(0, "Hours must be non-negative").max(100000, "Hours seems unreasonably high"),
  });
  
  app.patch("/api/my-irata-baseline-hours", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const parseResult = baselineHoursSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: parseResult.error.flatten().fieldErrors 
        });
      }
      
      const { baselineHours } = parseResult.data;
      
      await storage.updateUser(currentUser.id, {
        irataBaselineHours: baselineHours.toString(),
      });
      
      const updatedUser = await storage.getUserById(currentUser.id);
      const { passwordHash, ...userWithoutPassword } = updatedUser!;
      
      res.json({ 
        success: true, 
        user: userWithoutPassword,
        message: "Baseline hours updated successfully" 
      });
    } catch (error) {
      console.error("Update IRATA baseline hours error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ==================== COMPLAINT ROUTES ====================
  
  // Create complaint (with optional photo upload)
  app.post("/api/complaints", requireAuth, imageUpload.single('photo'), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      let companyId = req.body.companyId;
      
      // Resolve companyId before validation
      if (!companyId) {
        // If projectId is provided, get company from project
        if (req.body.projectId) {
          const project = await storage.getProjectById(req.body.projectId);
          if (project) {
            companyId = project.companyId;
          }
        }
        // For residents without projectId, find company from their strataPlanNumber
        else if (currentUser?.role === "resident" && currentUser.strataPlanNumber) {
          const projects = await storage.getAllProjectsByStrataPlan(currentUser.strataPlanNumber);
          if (projects.length > 0) {
            companyId = projects[0].companyId;
          } else {
            return res.status(400).json({ 
              message: "No company found for your building. Please contact support." 
            });
          }
        }
      }
      
      // Handle photo upload if provided
      let photoUrl = null;
      if (req.file) {
        const objectStorageService = new ObjectStorageService();
        const timestamp = Date.now();
        const filename = `complaints/${companyId}/${timestamp}-${req.file.originalname}`;
        photoUrl = await objectStorageService.uploadPublicFile(
          filename,
          req.file.buffer,
          req.file.mimetype
        );
      }
      
      // Now validate with companyId resolved
      const complaintData = insertComplaintSchema.parse({
        ...req.body,
        companyId,
        photoUrl,
        residentId: currentUser?.role === "resident" ? currentUser.id : null,
      });
      
      const complaint = await storage.createComplaint(complaintData);
      res.json({ complaint });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create complaint error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all complaints (filtered by role) - for management dashboard
  app.get("/api/complaints", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      let complaints;
      
      if (currentUser.role === "resident") {
        // Residents only see complaints they submitted
        complaints = await storage.getComplaintsForResident(currentUser.id);
      } else if (currentUser.role === "company") {
        // Company sees all complaints for their projects
        complaints = await storage.getComplaintsForCompany(currentUser.id);
      } else if (currentUser.role === "operations_manager" || currentUser.role === "supervisor" || currentUser.role === "general_supervisor" || currentUser.role === "rope_access_supervisor" || currentUser.role === "rope_access_tech") {
        // Staff sees complaints for their company's projects
        const companyId = currentUser.companyId;
        if (companyId) {
          complaints = await storage.getComplaintsForCompany(companyId);
        } else {
          complaints = [];
        }
      } else {
        complaints = [];
      }
      
      res.json({ complaints });
    } catch (error) {
      console.error("Get complaints error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get complaints for a specific project
  app.get("/api/projects/:id/complaints", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const projectId = req.params.id;
      
      // Verify user has access to this project
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check access based on role
      if (currentUser.role === "company") {
        if (project.companyId !== currentUser.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      } else if (currentUser.role === "operations_manager" || currentUser.role === "supervisor" || currentUser.role === "general_supervisor" || currentUser.role === "rope_access_supervisor" || currentUser.role === "rope_access_tech") {
        if (project.companyId !== currentUser.companyId) {
          return res.status(403).json({ message: "Access denied" });
        }
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get complaints for this project
      const complaints = await storage.getComplaintsByProject(projectId);
      
      res.json({ complaints });
    } catch (error) {
      console.error("Get project complaints error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get single complaint
  app.get("/api/complaints/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before returning complaint
      const hasAccess = await storage.verifyComplaintAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const complaint = await storage.getComplaintById(req.params.id);
      
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      
      // Mark as viewed when staff access it (not residents)
      if (currentUser.role !== "resident") {
        await storage.markComplaintAsViewed(req.params.id);
      }
      
      res.json({ complaint });
    } catch (error) {
      console.error("Get complaint error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get complaint notes (staff only, residents cannot see notes)
  app.get("/api/complaints/:id/notes", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before returning notes
      const hasAccess = await storage.verifyComplaintAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const allNotes = await storage.getNotesByComplaint(req.params.id);
      
      // Residents can only see notes marked as visible to residents
      // Staff can see all notes
      const notes = currentUser.role === "resident" 
        ? allNotes.filter(note => note.visibleToResident) 
        : allNotes;
      
      res.json({ notes });
    } catch (error) {
      console.error("Get complaint notes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update complaint status (staff can close, residents can reopen)
  app.patch("/api/complaints/:id/status", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before updating
      const hasAccess = await storage.verifyComplaintAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { status } = req.body;
      
      if (!["open", "closed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      // Residents can only reopen (change from closed to open)
      // Staff can change to any status
      if (currentUser.role === "resident" && status === "closed") {
        return res.status(403).json({ message: "Residents cannot close complaints" });
      }
      
      const complaint = await storage.updateComplaintStatus(req.params.id, status);
      res.json({ complaint });
    } catch (error) {
      console.error("Update complaint status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Add complaint note (staff only)
  app.post("/api/complaints/:complaintId/notes", requireAuth, requireRole("rope_access_tech", "general_supervisor", "rope_access_supervisor", "supervisor", "operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before adding note
      const hasAccess = await storage.verifyComplaintAccess(
        req.params.complaintId,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const noteData = insertComplaintNoteSchema.parse({
        complaintId: req.params.complaintId,
        userId: req.session.userId,
        note: req.body.note,
        visibleToResident: req.body.visibleToResident || false,
      });
      
      const noteWithUserName = {
        ...noteData,
        userName: currentUser.name || currentUser.email || "Staff",
      };
      
      const note = await storage.createComplaintNote(noteWithUserName);
      res.json({ note });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create complaint note error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Add resident reply to complaint
  app.post("/api/complaints/:complaintId/resident-reply", requireAuth, requireRole("resident"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify the complaint belongs to this resident
      const hasAccess = await storage.verifyComplaintAccess(
        req.params.complaintId,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied - You can only reply to your own complaints" });
      }
      
      const noteData = insertComplaintNoteSchema.parse({
        complaintId: req.params.complaintId,
        userId: req.session.userId,
        note: req.body.note,
        visibleToResident: true, // Resident replies are always visible to residents
      });
      
      const noteWithUserName = {
        ...noteData,
        userName: currentUser.name || currentUser.unitNumber || "Resident",
      };
      
      const note = await storage.createComplaintNote(noteWithUserName);
      res.json({ note });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create resident reply error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Gear items routes
  app.get("/api/gear-items", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check inventory view permission
      if (!canViewInventory(currentUser)) {
        return res.status(403).json({ message: "Access denied - Insufficient inventory permissions" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Storage now returns items with serialEntries already attached
      const items = await storage.getGearItemsByCompany(companyId);
      
      // Get ALL assignments for this company to calculate assigned quantities
      const allAssignments = await db.select()
        .from(gearAssignments)
        .where(eq(gearAssignments.companyId, companyId));
      
      // Calculate assigned quantity for each item
      const assignedByItem = new Map<string, number>();
      for (const assignment of allAssignments) {
        const current = assignedByItem.get(assignment.gearItemId) || 0;
        assignedByItem.set(assignment.gearItemId, current + (assignment.quantity || 0));
      }
      
      // Filter out financial data if user doesn't have permission
      const hasFinancialPermission = currentUser.role === "company" || 
        (currentUser.permissions && currentUser.permissions.includes("view_financial_data"));
      
      const filteredItems = items.map(item => {
        const assignedQuantity = assignedByItem.get(item.id) || 0;
        if (!hasFinancialPermission) {
          const { itemPrice, ...rest } = item;
          return { ...rest, assignedQuantity };
        }
        return { ...item, assignedQuantity };
      });
      
      res.json({ items: filteredItems });
    } catch (error) {
      console.error("Get gear items error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/gear-items", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check inventory manage permission
      if (!canManageInventory(currentUser)) {
        return res.status(403).json({ message: "Access denied - Insufficient inventory permissions" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Clean empty strings to undefined/null for optional fields
      const cleanedBody = {
        equipmentType: req.body.equipmentType || null,
        brand: req.body.brand || null,
        model: req.body.model || null,
        itemPrice: req.body.itemPrice || null,
        assignedTo: req.body.assignedTo?.trim() || "Not in use",
        notes: req.body.notes || null,
        quantity: req.body.quantity || 1,
        serialNumbers: req.body.serialNumbers || null,
        dateInService: req.body.dateInService || null,
        dateOutOfService: req.body.dateOutOfService || null,
        inService: req.body.inService !== undefined ? req.body.inService : true,
      };
      
      const itemData = insertGearItemSchema.parse({
        ...cleanedBody,
        companyId,
        employeeId: req.session.userId,
      });
      
      // Use storage method with serialEntries support
      const serialEntries = req.body.serialEntries || [];
      const item = await storage.createGearItem(itemData, serialEntries);
      console.log("Created gear item:", item.id);
      
      // If assignment info is provided, create the assignment
      if (req.body.assignEmployeeId && req.body.assignQuantity) {
        console.log("Assignment info provided - employeeId:", req.body.assignEmployeeId, "quantity:", req.body.assignQuantity);
        const assignQuantity = parseInt(req.body.assignQuantity);
        if (assignQuantity > 0 && assignQuantity <= (item.quantity || 0)) {
          console.log("Creating assignment...");
          const assignment = await storage.createGearAssignment({
            gearItemId: item.id,
            companyId,
            employeeId: req.body.assignEmployeeId,
            quantity: assignQuantity,
          });
          console.log("Assignment created:", assignment);
        } else {
          console.log("Assignment validation failed - quantity:", assignQuantity, "item quantity:", item.quantity);
        }
      } else {
        console.log("No assignment info provided");
      }
      
      res.json({ item });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create gear item error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/gear-items/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check inventory manage permission
      if (!canManageInventory(currentUser)) {
        return res.status(403).json({ message: "Access denied - Insufficient inventory permissions" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Clean empty strings to null for optional fields
      const cleanedBody: Partial<InsertGearItem> = {};
      if (req.body.equipmentType !== undefined) cleanedBody.equipmentType = req.body.equipmentType || null;
      if (req.body.brand !== undefined) cleanedBody.brand = req.body.brand || null;
      if (req.body.model !== undefined) cleanedBody.model = req.body.model || null;
      if (req.body.itemPrice !== undefined) cleanedBody.itemPrice = req.body.itemPrice || null;
      if (req.body.assignedTo !== undefined) cleanedBody.assignedTo = req.body.assignedTo?.trim() || "Not in use";
      if (req.body.notes !== undefined) cleanedBody.notes = req.body.notes || null;
      if (req.body.quantity !== undefined) cleanedBody.quantity = req.body.quantity;
      if (req.body.serialNumbers !== undefined) cleanedBody.serialNumbers = req.body.serialNumbers || null;
      if (req.body.dateInService !== undefined) cleanedBody.dateInService = req.body.dateInService || null;
      if (req.body.dateOutOfService !== undefined) cleanedBody.dateOutOfService = req.body.dateOutOfService || null;
      if (req.body.inService !== undefined) cleanedBody.inService = req.body.inService;
      
      const item = await storage.updateGearItem(req.params.id, cleanedBody);
      res.json({ item });
    } catch (error) {
      console.error("Update gear item error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/gear-items/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check inventory manage permission
      if (!canManageInventory(currentUser)) {
        return res.status(403).json({ message: "Access denied - Insufficient inventory permissions" });
      }
      
      await storage.deleteGearItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete gear item error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Gear assignments routes
  
  // Get all gear assignments (for My Gear view)
  app.get("/api/gear-assignments", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Everyone can see their own gear assignments
      // But viewing ALL assignments requires view_gear_assignments permission
      let assignments;
      if (canViewGearAssignments(currentUser)) {
        // User has permission to view all gear assignments
        assignments = await db.select()
          .from(gearAssignments)
          .where(eq(gearAssignments.companyId, companyId));
      } else {
        // Only show user's own gear assignments
        assignments = await db.select()
          .from(gearAssignments)
          .where(eq(gearAssignments.employeeId, currentUser.id));
      }
      
      res.json({ assignments });
    } catch (error) {
      console.error("Get all gear assignments error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create a gear assignment
  app.post("/api/gear-assignments", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check assign gear permission
      if (!canAssignGear(currentUser)) {
        return res.status(403).json({ message: "Access denied - Insufficient permissions to assign gear" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      console.log("Creating gear assignment:", req.body);
      
      const assignment = await storage.createGearAssignment({
        gearItemId: req.body.gearItemId,
        companyId,
        employeeId: req.body.employeeId,
        quantity: parseInt(req.body.quantity),
        serialNumber: req.body.serialNumber || undefined,
        dateOfManufacture: req.body.dateOfManufacture || undefined,
        dateInService: req.body.dateInService || undefined,
      });
      
      console.log("Assignment created successfully:", assignment);
      
      res.json({ assignment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create gear assignment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/gear-items/:id/assignments", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check inventory view permission (needed to see gear item assignments)
      if (!canViewInventory(currentUser)) {
        return res.status(403).json({ message: "Access denied - Insufficient inventory permissions" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const assignments = await db.select()
        .from(gearAssignments)
        .where(eq(gearAssignments.gearItemId, req.params.id));
      
      res.json({ assignments });
    } catch (error) {
      console.error("Get gear assignments error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/gear-items/:id/assignments", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check assign gear permission
      if (!canAssignGear(currentUser)) {
        return res.status(403).json({ message: "Access denied - Insufficient permissions to assign gear" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const assignmentData = insertGearAssignmentSchema.parse({
        gearItemId: req.params.id,
        companyId,
        employeeId: req.body.employeeId,
        quantity: req.body.quantity,
      });
      
      const [assignment] = await db.insert(gearAssignments)
        .values(assignmentData)
        .returning();
      
      res.json({ assignment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create gear assignment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Self-assign gear - allows any employee to assign gear to themselves
  app.post("/api/gear-assignments/self", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Verify the gear item belongs to the same company
      const gearItem = await db.select().from(gearItems).where(eq(gearItems.id, req.body.gearItemId)).limit(1);
      
      if (!gearItem.length || gearItem[0].companyId !== companyId) {
        return res.status(404).json({ message: "Gear item not found" });
      }
      
      // Create assignment to self
      const assignment = await storage.createGearAssignment({
        gearItemId: req.body.gearItemId,
        companyId,
        employeeId: currentUser.id, // Always assign to self
        quantity: parseInt(req.body.quantity) || 1,
        serialNumber: req.body.serialNumber || undefined,
        dateOfManufacture: req.body.dateOfManufacture || undefined,
        dateInService: req.body.dateInService || undefined,
      });
      
      res.json({ assignment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Self-assign gear error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Remove self-assigned gear
  app.delete("/api/gear-assignments/self/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify the assignment belongs to the current user
      const assignment = await db.select().from(gearAssignments).where(eq(gearAssignments.id, req.params.id)).limit(1);
      
      if (!assignment.length) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      if (assignment[0].employeeId !== currentUser.id) {
        return res.status(403).json({ message: "You can only remove your own gear assignments" });
      }
      
      await storage.deleteGearAssignment(req.params.id);
      
      res.json({ message: "Gear assignment removed" });
    } catch (error) {
      console.error("Remove self-assigned gear error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update your own gear assignment details
  app.patch("/api/gear-assignments/self/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify the assignment belongs to the current user
      const existingAssignment = await db.select().from(gearAssignments).where(eq(gearAssignments.id, req.params.id)).limit(1);
      
      if (!existingAssignment.length) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      if (existingAssignment[0].employeeId !== currentUser.id) {
        return res.status(403).json({ message: "You can only edit your own gear assignments" });
      }
      
      // Update the assignment
      const updates: any = { updatedAt: new Date() };
      if (req.body.serialNumber !== undefined) updates.serialNumber = req.body.serialNumber || null;
      if (req.body.dateOfManufacture !== undefined) updates.dateOfManufacture = req.body.dateOfManufacture || null;
      if (req.body.dateInService !== undefined) updates.dateInService = req.body.dateInService || null;
      
      const [assignment] = await db.update(gearAssignments)
        .set(updates)
        .where(eq(gearAssignments.id, req.params.id))
        .returning();
      
      res.json({ assignment });
    } catch (error) {
      console.error("Update self-assigned gear error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/gear-assignments/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check assign gear permission (needed to edit assignments)
      if (!canAssignGear(currentUser)) {
        return res.status(403).json({ message: "Access denied - Insufficient permissions to manage gear assignments" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const updates: Partial<InsertGearAssignment> = {};
      if (req.body.employeeId !== undefined) updates.employeeId = req.body.employeeId;
      if (req.body.quantity !== undefined) updates.quantity = req.body.quantity;
      if (req.body.serialNumber !== undefined) updates.serialNumber = req.body.serialNumber;
      if (req.body.dateOfManufacture !== undefined) updates.dateOfManufacture = req.body.dateOfManufacture || null;
      if (req.body.dateInService !== undefined) updates.dateInService = req.body.dateInService || null;
      
      const [assignment] = await db.update(gearAssignments)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(gearAssignments.id, req.params.id))
        .returning();
      
      res.json({ assignment });
    } catch (error) {
      console.error("Update gear assignment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/gear-assignments/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check assign gear permission (needed to delete assignments)
      if (!canAssignGear(currentUser)) {
        return res.status(403).json({ message: "Access denied - Insufficient permissions to manage gear assignments" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      await db.delete(gearAssignments)
        .where(eq(gearAssignments.id, req.params.id));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete gear assignment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Gear serial numbers routes - per-item serial number tracking with dates
  app.get("/api/gear-items/:id/serial-numbers", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check inventory view permission
      if (!canViewInventory(currentUser)) {
        return res.status(403).json({ message: "Access denied - Insufficient inventory permissions" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Get all serial numbers for this gear item
      const serialNumbers = await db.select()
        .from(gearSerialNumbers)
        .where(eq(gearSerialNumbers.gearItemId, req.params.id));
      
      // Get all assignments for this gear item to determine which serial numbers are taken
      const itemAssignments = await db.select()
        .from(gearAssignments)
        .where(eq(gearAssignments.gearItemId, req.params.id));
      
      // Create a set of assigned serial numbers
      const assignedSerialNumbers = new Set(
        itemAssignments
          .map(a => a.serialNumber)
          .filter((sn): sn is string => sn !== null && sn !== undefined)
      );
      
      // Add isAssigned flag to each serial number
      const serialNumbersWithStatus = serialNumbers.map(sn => ({
        ...sn,
        isAssigned: assignedSerialNumbers.has(sn.serialNumber),
      }));
      
      res.json({ serialNumbers: serialNumbersWithStatus, assignedSerialNumbers: Array.from(assignedSerialNumbers) });
    } catch (error) {
      console.error("Get gear serial numbers error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/gear-items/:id/serial-numbers", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check manage inventory permission
      if (!canManageInventory(currentUser)) {
        return res.status(403).json({ message: "Access denied - Insufficient inventory permissions" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const serialData = insertGearSerialNumberSchema.parse({
        gearItemId: req.params.id,
        companyId,
        serialNumber: req.body.serialNumber,
        dateOfManufacture: req.body.dateOfManufacture || undefined,
        dateInService: req.body.dateInService || undefined,
      });
      
      const [serialNumber] = await db.insert(gearSerialNumbers)
        .values(serialData)
        .returning();
      
      res.json({ serialNumber });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create gear serial number error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/gear-serial-numbers/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check manage inventory permission
      if (!canManageInventory(currentUser)) {
        return res.status(403).json({ message: "Access denied - Insufficient inventory permissions" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      await db.delete(gearSerialNumbers)
        .where(eq(gearSerialNumbers.id, req.params.id));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete gear serial number error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Harness inspection routes
  app.post("/api/harness-inspections", requireAuth, requireRole("rope_access_tech", "general_supervisor", "rope_access_supervisor", "supervisor", "operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Convert empty strings to undefined for optional fields
      const cleanedBody = {
        ...req.body,
        dateInService: req.body.dateInService || undefined,
        projectId: (req.body.projectId === "none" || !req.body.projectId) ? undefined : req.body.projectId,
      };
      
      const inspectionData = insertHarnessInspectionSchema.parse({
        ...cleanedBody,
        companyId,
        workerId: req.session.userId,
      });
      
      const inspection = await storage.createHarnessInspection(inspectionData);
      res.json({ inspection });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create harness inspection error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/harness-inspections", requireAuth, requireRole("operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const inspections = await storage.getHarnessInspectionsByCompany(companyId);
      res.json({ inspections });
    } catch (error) {
      console.error("Get harness inspections error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/my-harness-inspections", requireAuth, requireRole("rope_access_tech"), async (req: Request, res: Response) => {
    try {
      const inspections = await storage.getHarnessInspectionsByWorker(req.session.userId!);
      res.json({ inspections });
    } catch (error) {
      console.error("Get my harness inspections error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/harness-inspections/:id", requireAuth, requireRole("operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteHarnessInspection(id);
      res.json({ message: "Harness inspection deleted successfully" });
    } catch (error) {
      console.error("Delete harness inspection error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Toolbox meeting routes
  app.post("/api/toolbox-meetings", requireAuth, requireRole("rope_access_tech", "general_supervisor", "rope_access_supervisor", "supervisor", "operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Validate that all attendees have signed (using IDs for reliable matching)
      const { attendeeIds, signatures } = req.body;
      if (attendeeIds && Array.isArray(attendeeIds) && attendeeIds.length > 0) {
        // Validate signature content - ensure each signature has non-empty data
        const validSignatures = (signatures || []).filter((sig: any) => 
          sig && sig.employeeId && sig.signatureDataUrl && sig.signatureDataUrl.length > 0
        );
        const signatureEmployeeIds = validSignatures.map((sig: any) => sig.employeeId);
        const unsignedAttendeeIds = attendeeIds.filter((id: string) => !signatureEmployeeIds.includes(id));
        
        if (unsignedAttendeeIds.length > 0) {
          // Get names from storage for accurate error message (don't trust client-provided names)
          const unsignedNames: string[] = [];
          for (const id of unsignedAttendeeIds) {
            const employee = await storage.getUserById(id);
            unsignedNames.push(employee?.name || `Employee ${id}`);
          }
          return res.status(400).json({ 
            message: `All attendees must sign. Missing signatures from: ${unsignedNames.join(", ")}` 
          });
        }
      }
      
      const meetingData = insertToolboxMeetingSchema.parse({
        ...req.body,
        companyId,
        conductedBy: req.session.userId,
      });
      
      const meeting = await storage.createToolboxMeeting(meetingData);
      res.json({ meeting });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create toolbox meeting error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/toolbox-meetings", requireAuth, requireRole("operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const meetings = await storage.getToolboxMeetingsByCompany(companyId);
      res.json({ meetings });
    } catch (error) {
      console.error("Get toolbox meetings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/projects/:projectId/toolbox-meetings", requireAuth, async (req: Request, res: Response) => {
    try {
      const meetings = await storage.getToolboxMeetingsByProject(req.params.projectId);
      res.json({ meetings });
    } catch (error) {
      console.error("Get project toolbox meetings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/toolbox-meetings/:id", requireAuth, requireRole("operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteToolboxMeeting(id);
      res.json({ message: "Toolbox meeting deleted successfully" });
    } catch (error) {
      console.error("Delete toolbox meeting error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Company Safety Rating (CSR) endpoint - combines all safety metrics
  // NEW LOGIC: Start at 100%, only deduct for non-compliance
  // - Documentation: -25% if either Health & Safety Manual or Company Policy is missing
  // - Toolbox Meetings: Deduct proportionally if meetings are missed (only when there are work sessions)
  // - Harness Inspections: Deduct proportionally if inspections are missed (only when required)
  // - Project Completion: Bonus metric - doesn't penalize new companies
  app.get("/api/company-safety-rating", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has permission to view CSR
      if (!canViewCSR(currentUser)) {
        return res.status(403).json({ message: "Forbidden - Insufficient permissions to view CSR" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // 1. Documentation Safety Rating (Health & Safety Manual + Company Policy + Certificate of Insurance)
      // -25% penalty if any required document is missing
      const companyDocuments = await storage.getCompanyDocuments(companyId);
      const hasHealthSafety = companyDocuments.some((doc: any) => doc.documentType === 'health_safety_manual');
      const hasCompanyPolicy = companyDocuments.some((doc: any) => doc.documentType === 'company_policy');
      const hasInsurance = companyDocuments.some((doc: any) => doc.documentType === 'certificate_of_insurance');
      const documentationRating = (hasHealthSafety && hasCompanyPolicy && hasInsurance) ? 100 : 0;
      const documentationPenalty = documentationRating === 100 ? 0 : 25;
      
      // 2. Toolbox Meeting Compliance (with 7-day coverage window)
      // A toolbox meeting covers its project for 7 days forward from the meeting date
      // Meetings can occur outside of work sessions and still provide coverage
      const TOOLBOX_COVERAGE_DAYS = 7;
      
      const projects = await storage.getProjectsByCompany(companyId);
      const meetings = await storage.getToolboxMeetingsByCompany(companyId);
      
      // Get all work sessions across projects
      const allWorkSessions: any[] = [];
      for (const project of projects) {
        const projectSessions = await storage.getWorkSessionsByProject(project.id, companyId);
        allWorkSessions.push(...projectSessions);
      }
      
      // Build meeting coverage map: for each project, store meeting dates
      const projectMeetingDates: Map<string, Date[]> = new Map();
      const otherMeetingDates: Date[] = [];
      
      meetings.forEach((meeting: any) => {
        if (meeting.meetingDate) {
          const meetingDate = new Date(meeting.meetingDate);
          if (meeting.projectId === 'other') {
            otherMeetingDates.push(meetingDate);
          } else if (meeting.projectId) {
            if (!projectMeetingDates.has(meeting.projectId)) {
              projectMeetingDates.set(meeting.projectId, []);
            }
            projectMeetingDates.get(meeting.projectId)!.push(meetingDate);
          }
        }
      });
      
      // Helper function to check if a work date is covered by a meeting within the coverage window
      const isDateCovered = (projectId: string, workDateStr: string): boolean => {
        const workDate = new Date(workDateStr);
        
        // Check project-specific meetings
        const projectMeetings = projectMeetingDates.get(projectId) || [];
        for (const meetingDate of projectMeetings) {
          const daysDiff = Math.abs(Math.floor((workDate.getTime() - meetingDate.getTime()) / (1000 * 60 * 60 * 24)));
          // Meeting covers work if within 7 days in either direction
          if (daysDiff <= TOOLBOX_COVERAGE_DAYS) {
            return true;
          }
        }
        
        // Check "other" meetings (cover all projects)
        for (const meetingDate of otherMeetingDates) {
          const daysDiff = Math.abs(Math.floor((workDate.getTime() - meetingDate.getTime()) / (1000 * 60 * 60 * 24)));
          if (daysDiff <= TOOLBOX_COVERAGE_DAYS) {
            return true;
          }
        }
        
        return false;
      };
      
      // Calculate toolbox meeting compliance using coverage window
      const workSessionDays = new Set<string>();
      allWorkSessions.forEach((session: any) => {
        if (session.projectId && session.workDate) {
          workSessionDays.add(`${session.projectId}|${session.workDate}`);
        }
      });
      
      let toolboxDaysWithMeeting = 0;
      let toolboxTotalDays = 0;
      workSessionDays.forEach((dayKey) => {
        toolboxTotalDays++;
        const [projectId, workDate] = dayKey.split('|');
        if (isDateCovered(projectId, workDate)) {
          toolboxDaysWithMeeting++;
        }
      });
      
      // If no work sessions but have meetings, give full credit
      // If no work sessions and no meetings, also full credit (nothing to comply with)
      const toolboxMeetingRating = toolboxTotalDays > 0 
        ? Math.round((toolboxDaysWithMeeting / toolboxTotalDays) * 100) 
        : 100;
      // Penalty is proportional to missed coverage (max 25%)
      const toolboxPenalty = toolboxTotalDays > 0 
        ? Math.round(((toolboxTotalDays - toolboxDaysWithMeeting) / toolboxTotalDays) * 25)
        : 0;
      
      // 3. Daily Harness Inspection Rating (last 30 days)
      const harnessInspections = await storage.getHarnessInspectionsByCompany(companyId);
      const today = new Date();
      
      // Helper function to normalize date to YYYY-MM-DD string format
      const normalizeDateToString = (date: any): string => {
        if (!date) return '';
        // If it's already a string in YYYY-MM-DD format, return it
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        }
        // If it's a Date object or string that needs conversion
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };
      
      let harnessRequiredInspections = 0;
      let harnessCompletedInspections = 0;
      
      // Check each day in the last 30 days
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        
        // Find workers with sessions on this day
        const workersWithSessions = new Set<string>();
        allWorkSessions.forEach((session: any) => {
          if (session.employeeId && session.workDate === dateStr) {
            workersWithSessions.add(session.employeeId);
          }
        });
        
        // Check if each worker has an inspection
        workersWithSessions.forEach((workerId) => {
          const inspection = harnessInspections.find((insp: any) =>
            insp.workerId === workerId && normalizeDateToString(insp.inspectionDate) === dateStr
          );
          
          if (!inspection || inspection.overallStatus !== "not_applicable") {
            harnessRequiredInspections++;
            if (inspection && inspection.overallStatus !== "not_applicable") {
              harnessCompletedInspections++;
            }
          }
        });
      }
      
      // If no required inspections, 100% compliance
      const harnessInspectionRating = harnessRequiredInspections > 0 
        ? Math.round((harnessCompletedInspections / harnessRequiredInspections) * 100) 
        : 100;
      // Penalty is proportional to missed inspections (max 25%)
      const harnessPenalty = harnessRequiredInspections > 0 
        ? Math.round(((harnessRequiredInspections - harnessCompletedInspections) / harnessRequiredInspections) * 25)
        : 0;
      
      // 4. Project Completion Rate (average progress of all active/completed projects)
      // This is a bonus metric - new companies with no projects get 100%
      let totalProjectProgress = 0;
      let projectCount = 0;
      
      for (const project of projects) {
        if (project.status === 'deleted') continue;
        
        projectCount++;
        const projectSessions = allWorkSessions.filter((s: any) => s.projectId === project.id && s.endTime);
        
        // If project is marked completed, count as 100%
        if (project.status === 'completed') {
          totalProjectProgress += 100;
          continue;
        }
        
        // Calculate progress based on job type
        if (project.jobType === 'general_pressure_washing' || project.jobType === 'ground_window_cleaning') {
          // Hours-based: use manualCompletionPercentage
          const sessionsWithPercentage = projectSessions.filter((s: any) => 
            s.manualCompletionPercentage !== null && s.manualCompletionPercentage !== undefined
          );
          if (sessionsWithPercentage.length > 0) {
            const sortedSessions = [...sessionsWithPercentage].sort((a: any, b: any) => 
              new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
            );
            totalProjectProgress += sortedSessions[0].manualCompletionPercentage || 0;
          }
        } else if (project.jobType === 'in_suite_dryer_vent_cleaning') {
          // Suite-based
          const completedSuites = projectSessions.reduce((sum: number, s: any) => 
            sum + (s.suitesCompleted || 0), 0);
          const totalSuites = (project.floorCount || 1) * (project.suitesPerDay || 1);
          totalProjectProgress += totalSuites > 0 ? Math.min(100, (completedSuites / totalSuites) * 100) : 0;
        } else if (project.jobType === 'parkade_pressure_cleaning') {
          // Stall-based
          const completedStalls = projectSessions.reduce((sum: number, s: any) => 
            sum + (s.stallsCompleted || 0), 0);
          const totalStalls = project.totalStalls || project.floorCount || 1;
          totalProjectProgress += totalStalls > 0 ? Math.min(100, (completedStalls / totalStalls) * 100) : 0;
        } else {
          // Drop-based
          const totalDrops = (project.totalDropsNorth || 0) + (project.totalDropsEast || 0) + 
                            (project.totalDropsSouth || 0) + (project.totalDropsWest || 0);
          const completedDrops = projectSessions.reduce((sum: number, s: any) => 
            sum + (s.dropsCompletedNorth || 0) + (s.dropsCompletedEast || 0) + 
                  (s.dropsCompletedSouth || 0) + (s.dropsCompletedWest || 0), 0);
          totalProjectProgress += totalDrops > 0 ? Math.min(100, (completedDrops / totalDrops) * 100) : 0;
        }
      }
      
      // Project completion - no penalty for new companies with no projects
      // For companies with projects, this reflects their overall project health
      const projectCompletionRating = projectCount > 0 ? Math.round(totalProjectProgress / projectCount) : 100;
      // No penalty from projects - this is informational only
      const projectPenalty = 0;
      
      // 5. Document Review Compliance Rating
      // Tracks employee acknowledgment of safety documents (H&S Manual, Company Policy, Safe Work Procedures)
      // Calculate based on TOTAL REQUIRED signatures = employees × required documents
      const documentReviews = await storage.getDocumentReviewSignaturesByCompany(companyId);
      const companyEmployees = await storage.getAllEmployees(companyId);
      
      // Required document types that employees must sign
      const requiredDocTypes = ['health_safety_manual', 'company_policy', 'safe_work_procedure'];
      const requiredDocs = companyDocuments.filter((doc: any) => 
        requiredDocTypes.includes(doc.documentType)
      );
      
      // Total required = number of employees × number of required documents
      const totalEmployees = companyEmployees.length;
      const totalRequiredDocs = requiredDocs.length;
      const totalRequiredSignatures = totalEmployees * totalRequiredDocs;
      
      // Count actual signed reviews
      const signedReviews = documentReviews.filter((r: any) => r.signedAt).length;
      const pendingReviews = totalRequiredSignatures - signedReviews;
      
      // If no required documents or no employees, 100% compliance (nothing to comply with)
      // Otherwise, calculate based on signed vs total required
      const documentReviewRating = totalRequiredSignatures > 0 
        ? Math.round((signedReviews / totalRequiredSignatures) * 100) 
        : 100;
      const documentReviewPenalty = totalRequiredSignatures > 0 
        ? Math.round(((totalRequiredSignatures - signedReviews) / totalRequiredSignatures) * 5)
        : 0;
      
      // Calculate overall CSR: Start at 100%, subtract penalties
      // Max penalty is 80% (25% docs, 25% toolbox, 25% harness, 5% document reviews)
      // Project completion is shown but doesn't penalize
      const totalPenalty = documentationPenalty + toolboxPenalty + harnessPenalty + documentReviewPenalty + projectPenalty;
      const overallCSR = Math.max(0, 100 - totalPenalty);
      
      res.json({
        overallCSR,
        breakdown: {
          documentationRating,
          toolboxMeetingRating,
          harnessInspectionRating,
          documentReviewRating,
          projectCompletionRating
        },
        details: {
          hasHealthSafety,
          hasCompanyPolicy,
          toolboxDaysWithMeeting,
          toolboxTotalDays,
          harnessCompletedInspections,
          harnessRequiredInspections,
          documentReviewsSigned: signedReviews,
          documentReviewsPending: pendingReviews,
          documentReviewsTotal: totalRequiredSignatures,
          documentReviewsTotalEmployees: totalEmployees,
          documentReviewsTotalDocs: totalRequiredDocs,
          projectCount,
          totalProjectProgress: projectCount > 0 ? Math.round(totalProjectProgress / projectCount) : 100
        }
      });
    } catch (error) {
      console.error("Get company safety rating error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Property Manager: Get CSR for a linked vendor company
  app.get("/api/property-managers/vendors/:linkId/csr", requireAuth, requireRole("property_manager"), async (req: Request, res: Response) => {
    try {
      const { linkId } = req.params;
      const propertyManagerId = req.session.userId!;
      
      // Verify the link belongs to this property manager
      const links = await storage.getPropertyManagerCompanyLinks(propertyManagerId);
      const ownedLink = links.find(link => link.id === linkId);
      
      if (!ownedLink) {
        return res.status(403).json({ message: "Unauthorized: This vendor link does not belong to you" });
      }
      
      const companyId = ownedLink.companyId;
      
      // 1. Documentation Safety Rating (Health & Safety Manual + Company Policy + Certificate of Insurance)
      const companyDocuments = await storage.getCompanyDocuments(companyId);
      const hasHealthSafety = companyDocuments.some((doc: any) => doc.documentType === 'health_safety_manual');
      const hasCompanyPolicy = companyDocuments.some((doc: any) => doc.documentType === 'company_policy');
      const hasInsurance = companyDocuments.some((doc: any) => doc.documentType === 'certificate_of_insurance');
      const documentationRating = (hasHealthSafety && hasCompanyPolicy && hasInsurance) ? 100 : 0;
      const documentationPenalty = documentationRating === 100 ? 0 : 25;
      
      // 2. Toolbox Meeting Compliance (with 7-day coverage window)
      // A toolbox meeting covers its project for 7 days forward from the meeting date
      // Meetings can occur outside of work sessions and still provide coverage
      const TOOLBOX_COVERAGE_DAYS = 7;
      
      const projects = await storage.getProjectsByCompany(companyId);
      const meetings = await storage.getToolboxMeetingsByCompany(companyId);
      
      const allWorkSessions: any[] = [];
      for (const project of projects) {
        const projectSessions = await storage.getWorkSessionsByProject(project.id, companyId);
        allWorkSessions.push(...projectSessions);
      }
      
      // Build meeting coverage map: for each project, store meeting dates
      const projectMeetingDates: Map<string, Date[]> = new Map();
      const otherMeetingDates: Date[] = [];
      
      meetings.forEach((meeting: any) => {
        if (meeting.meetingDate) {
          const meetingDate = new Date(meeting.meetingDate);
          if (meeting.projectId === 'other') {
            otherMeetingDates.push(meetingDate);
          } else if (meeting.projectId) {
            if (!projectMeetingDates.has(meeting.projectId)) {
              projectMeetingDates.set(meeting.projectId, []);
            }
            projectMeetingDates.get(meeting.projectId)!.push(meetingDate);
          }
        }
      });
      
      // Helper function to check if a work date is covered by a meeting within the coverage window
      const isDateCovered = (projectId: string, workDateStr: string): boolean => {
        const workDate = new Date(workDateStr);
        
        // Check project-specific meetings
        const projectMeetings = projectMeetingDates.get(projectId) || [];
        for (const meetingDate of projectMeetings) {
          const daysDiff = Math.abs(Math.floor((workDate.getTime() - meetingDate.getTime()) / (1000 * 60 * 60 * 24)));
          // Meeting covers work if within 7 days in either direction
          if (daysDiff <= TOOLBOX_COVERAGE_DAYS) {
            return true;
          }
        }
        
        // Check "other" meetings (cover all projects)
        for (const meetingDate of otherMeetingDates) {
          const daysDiff = Math.abs(Math.floor((workDate.getTime() - meetingDate.getTime()) / (1000 * 60 * 60 * 24)));
          if (daysDiff <= TOOLBOX_COVERAGE_DAYS) {
            return true;
          }
        }
        
        return false;
      };
      
      // Calculate toolbox meeting compliance using coverage window
      const workSessionDays = new Set<string>();
      allWorkSessions.forEach((session: any) => {
        if (session.projectId && session.workDate) {
          workSessionDays.add(`${session.projectId}|${session.workDate}`);
        }
      });
      
      let toolboxDaysWithMeeting = 0;
      let toolboxTotalDays = 0;
      workSessionDays.forEach((dayKey) => {
        toolboxTotalDays++;
        const [projectId, workDate] = dayKey.split('|');
        if (isDateCovered(projectId, workDate)) {
          toolboxDaysWithMeeting++;
        }
      });
      
      const toolboxMeetingRating = toolboxTotalDays > 0 
        ? Math.round((toolboxDaysWithMeeting / toolboxTotalDays) * 100) 
        : 100;
      const toolboxPenalty = toolboxTotalDays > 0 
        ? Math.round(((toolboxTotalDays - toolboxDaysWithMeeting) / toolboxTotalDays) * 25)
        : 0;
      
      // 3. Daily Harness Inspection Rating (last 30 days)
      const harnessInspections = await storage.getHarnessInspectionsByCompany(companyId);
      const today = new Date();
      
      // Helper function to normalize date to YYYY-MM-DD string format
      const normalizeDateToString = (date: any): string => {
        if (!date) return '';
        // If it's already a string in YYYY-MM-DD format, return it
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        }
        // If it's a Date object or string that needs conversion
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };
      
      let harnessRequiredInspections = 0;
      let harnessCompletedInspections = 0;
      
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        
        const workersWithSessions = new Set<string>();
        allWorkSessions.forEach((session: any) => {
          if (session.employeeId && session.workDate === dateStr) {
            workersWithSessions.add(session.employeeId);
          }
        });
        
        workersWithSessions.forEach((workerId) => {
          const inspection = harnessInspections.find((insp: any) =>
            insp.workerId === workerId && normalizeDateToString(insp.inspectionDate) === dateStr
          );
          
          if (!inspection || inspection.overallStatus !== "not_applicable") {
            harnessRequiredInspections++;
            if (inspection && inspection.overallStatus !== "not_applicable") {
              harnessCompletedInspections++;
            }
          }
        });
      }
      
      const harnessInspectionRating = harnessRequiredInspections > 0 
        ? Math.round((harnessCompletedInspections / harnessRequiredInspections) * 100) 
        : 100;
      const harnessPenalty = harnessRequiredInspections > 0 
        ? Math.round(((harnessRequiredInspections - harnessCompletedInspections) / harnessRequiredInspections) * 25)
        : 0;
      
      // 6. Document Review Compliance Rating
      // Calculate based on TOTAL REQUIRED signatures = employees × required documents
      const documentReviews = await storage.getDocumentReviewSignaturesByCompany(companyId);
      const companyEmployees = await storage.getAllEmployees(companyId);
      
      // Required document types that employees must sign
      const requiredDocTypes = ['health_safety_manual', 'company_policy', 'safe_work_procedure'];
      const requiredDocs = companyDocuments.filter((doc: any) => 
        requiredDocTypes.includes(doc.documentType)
      );
      
      const totalEmployees = companyEmployees.length;
      const totalRequiredDocs = requiredDocs.length;
      const totalRequiredSignatures = totalEmployees * totalRequiredDocs;
      const signedReviews = documentReviews.filter((r: any) => r.signedAt).length;
      
      const documentReviewRating = totalRequiredSignatures > 0 
        ? Math.round((signedReviews / totalRequiredSignatures) * 100) 
        : 100;
      const documentReviewPenalty = totalRequiredSignatures > 0 
        ? Math.round(((totalRequiredSignatures - signedReviews) / totalRequiredSignatures) * 5)
        : 0;
      
      // Calculate overall CSR
      const totalPenalty = documentationPenalty + toolboxPenalty + harnessPenalty + documentReviewPenalty;
      const overallCSR = Math.max(0, 100 - totalPenalty);
      
      res.json({
        overallCSR,
        breakdown: {
          documentationRating,
          toolboxMeetingRating,
          harnessInspectionRating,
          documentReviewRating
        }
      });
    } catch (error) {
      console.error("Get vendor CSR error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Property Manager: Get vendor company documents (for viewing Certificate of Insurance, etc.)
  app.get("/api/property-managers/vendors/:linkId/documents", requireAuth, requireRole("property_manager"), async (req: Request, res: Response) => {
    try {
      const { linkId } = req.params;
      const { documentType } = req.query;
      const propertyManagerId = req.session.userId!;
      
      // Verify the link belongs to this property manager
      const links = await storage.getPropertyManagerCompanyLinks(propertyManagerId);
      const ownedLink = links.find(link => link.id === linkId);
      
      if (!ownedLink) {
        return res.status(403).json({ message: "Unauthorized: This vendor link does not belong to you" });
      }
      
      const companyId = ownedLink.companyId;
      
      // Get company documents - filter by type if specified
      let documents;
      if (documentType && typeof documentType === 'string') {
        documents = await storage.getCompanyDocumentsByType(companyId, documentType);
      } else {
        documents = await storage.getCompanyDocuments(companyId);
      }
      
      // Property managers can only see certain document types
      const allowedTypes = ['certificate_of_insurance', 'health_safety_manual', 'company_policy'];
      const filteredDocuments = documents.filter((doc: any) => allowedTypes.includes(doc.documentType));
      
      res.json({ documents: filteredDocuments });
    } catch (error) {
      console.error("Get vendor documents error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // FLHA form routes
  app.post("/api/flha-forms", requireAuth, requireRole("rope_access_tech", "general_supervisor", "rope_access_supervisor", "supervisor", "operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const flhaData = insertFlhaFormSchema.parse({
        ...req.body,
        companyId,
      });
      
      const flha = await storage.createFlhaForm(flhaData);
      res.json({ flha });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create FLHA form error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/flha-forms", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has permission to view safety documents
      if (!canViewSafetyDocuments(currentUser)) {
        return res.status(403).json({ message: "Forbidden - You don't have permission to view FLHA records" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const flhaForms = await storage.getFlhaFormsByCompany(companyId);
      res.json({ flhaForms });
    } catch (error) {
      console.error("Get FLHA forms error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/projects/:projectId/flha-forms", requireAuth, async (req: Request, res: Response) => {
    try {
      const flhaForms = await storage.getFlhaFormsByProject(req.params.projectId);
      res.json({ flhaForms });
    } catch (error) {
      console.error("Get project FLHA forms error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/flha-forms/:id", requireAuth, requireRole("operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteFlhaForm(id);
      res.json({ message: "FLHA form deleted successfully" });
    } catch (error) {
      console.error("Delete FLHA form error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Incident report routes
  app.post("/api/incident-reports", requireAuth, requireRole("rope_access_tech", "general_supervisor", "rope_access_supervisor", "supervisor", "operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const reportData = insertIncidentReportSchema.parse({
        ...req.body,
        companyId,
        reportedById: req.session.userId,
      });
      
      const report = await storage.createIncidentReport(reportData);
      res.json({ report });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create incident report error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/incident-reports", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has permission to view safety documents
      if (!canViewSafetyDocuments(currentUser)) {
        return res.status(403).json({ message: "Forbidden - You don't have permission to view incident reports" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const reports = await storage.getIncidentReportsByCompany(companyId);
      res.json({ reports });
    } catch (error) {
      console.error("Get incident reports error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/incident-reports/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const report = await storage.getIncidentReportById(id);
      
      if (!report) {
        return res.status(404).json({ message: "Incident report not found" });
      }
      
      res.json({ report });
    } catch (error) {
      console.error("Get incident report error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/incident-reports/:id", requireAuth, requireRole("operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Verify the incident report belongs to this company
      const existingReport = await storage.getIncidentReportById(id);
      if (!existingReport) {
        return res.status(404).json({ message: "Incident report not found" });
      }
      
      if (existingReport.companyId !== companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Merge server-derived companyId to prevent tampering
      const payload = { ...req.body, companyId };
      const report = await storage.updateIncidentReport(id, payload);
      res.json({ report });
    } catch (error) {
      console.error("Update incident report error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/incident-reports/:id", requireAuth, requireRole("operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Verify the incident report belongs to this company
      const existingReport = await storage.getIncidentReportById(id);
      if (!existingReport) {
        return res.status(404).json({ message: "Incident report not found" });
      }
      
      if (existingReport.companyId !== companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteIncidentReport(id);
      res.json({ message: "Incident report deleted successfully" });
    } catch (error) {
      console.error("Delete incident report error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== METHOD STATEMENT ROUTES ====================

  // Create method statement
  app.post("/api/method-statements", requireAuth, requireRole("rope_access_tech", "general_supervisor", "rope_access_supervisor", "supervisor", "operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Sanitize empty strings to null for optional fields (especially dates)
      const sanitizedBody = { ...req.body };
      const optionalFields = ['reviewDate', 'approvalDate', 'projectId', 'location', 'workDuration', 'rescuePlan', 'emergencyContacts', 'weatherRestrictions', 'workingHeightRange', 'accessMethod', 'irataLevelRequired', 'communicationMethod', 'signalProtocol', 'reviewedByName', 'approvedByName'];
      for (const field of optionalFields) {
        if (sanitizedBody[field] === '' || sanitizedBody[field] === 'none') {
          sanitizedBody[field] = null;
        }
      }
      
      const statementData = insertMethodStatementSchema.parse({
        ...sanitizedBody,
        companyId,
        preparedById: req.session.userId,
      });
      
      const statement = await storage.createMethodStatement(statementData);
      res.json({ statement });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create method statement error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all method statements for company
  app.get("/api/method-statements", requireAuth, requireRole("rope_access_tech", "operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const statements = await storage.getMethodStatementsByCompany(companyId);
      res.json({ statements });
    } catch (error) {
      console.error("Get method statements error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get method statements for specific project
  app.get("/api/projects/:projectId/method-statements", requireAuth, async (req: Request, res: Response) => {
    try {
      const statements = await storage.getMethodStatementsByProject(req.params.projectId);
      res.json({ statements });
    } catch (error) {
      console.error("Get project method statements error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get specific method statement
  app.get("/api/method-statements/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const statement = await storage.getMethodStatementById(req.params.id);
      if (!statement) {
        return res.status(404).json({ message: "Method statement not found" });
      }
      res.json({ statement });
    } catch (error) {
      console.error("Get method statement error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update method statement
  app.patch("/api/method-statements/:id", requireAuth, requireRole("operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Verify the method statement belongs to this company
      const existingStatement = await storage.getMethodStatementById(id);
      if (!existingStatement) {
        return res.status(404).json({ message: "Method statement not found" });
      }
      
      if (existingStatement.companyId !== companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Merge server-derived companyId to prevent tampering
      const payload = { ...req.body, companyId };
      const statement = await storage.updateMethodStatement(id, payload);
      res.json({ statement });
    } catch (error) {
      console.error("Update method statement error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete method statement
  app.delete("/api/method-statements/:id", requireAuth, requireRole("operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Verify the method statement belongs to this company
      const existingStatement = await storage.getMethodStatementById(id);
      if (!existingStatement) {
        return res.status(404).json({ message: "Method statement not found" });
      }
      
      if (existingStatement.companyId !== companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteMethodStatement(id);
      res.json({ message: "Method statement deleted successfully" });
    } catch (error) {
      console.error("Delete method statement error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== DOCUMENT REVIEW SIGNATURES ROUTES ====================

  // Get current employee's document review requirements (pending and signed)
  app.get("/api/document-reviews/my", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the company ID
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (companyId) {
        // Auto-enroll: Check for required documents that the employee hasn't been enrolled for yet
        const requiredDocTypes = ['health_safety_manual', 'company_policy', 'safe_work_procedure'];
        const existingReviews = await storage.getDocumentReviewSignaturesByEmployee(currentUser.id);
        const existingDocIds = new Set(existingReviews.map(r => r.documentId).filter(Boolean));
        
        // Get all required company documents
        for (const docType of requiredDocTypes) {
          const docs = await storage.getCompanyDocumentsByType(companyId, docType);
          for (const doc of docs) {
            // If employee doesn't have a review for this document, create one
            if (!existingDocIds.has(doc.id)) {
              try {
                await storage.enrollEmployeeInDocumentReviews(companyId, currentUser.id, [{
                  type: docType,
                  id: doc.id,
                  name: doc.fileName,
                  fileUrl: doc.fileUrl,
                }]);
              } catch (enrollErr) {
                // Ignore duplicate errors - another request may have created it
                console.log(`Auto-enroll skipped for ${doc.fileName}: ${enrollErr}`);
              }
            }
          }
        }
      }
      
      // Now fetch all reviews (including newly created ones)
      const reviews = await storage.getDocumentReviewSignaturesByEmployee(currentUser.id);
      res.json({ reviews });
    } catch (error) {
      console.error("Get my document reviews error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all document review signatures for company (admin view)
  app.get("/api/document-reviews", requireAuth, requireRole("operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const reviews = await storage.getDocumentReviewSignaturesByCompany(companyId);
      res.json({ reviews });
    } catch (error) {
      console.error("Get company document reviews error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Enroll an employee in document reviews (creates pending review entries)
  app.post("/api/document-reviews/enroll/:employeeId", requireAuth, requireRole("operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const { employeeId } = req.params;
      const { documents } = req.body; // Array of { type, id?, name, version?, fileUrl? }
      
      // Validate documents array
      if (!Array.isArray(documents) || documents.length === 0) {
        return res.status(400).json({ message: "Documents array is required" });
      }
      
      const validDocTypes = ['health_safety_manual', 'company_policy', 'method_statement'];
      for (const doc of documents) {
        if (!doc.type || !validDocTypes.includes(doc.type)) {
          return res.status(400).json({ message: `Invalid document type: ${doc.type}` });
        }
        if (!doc.name || typeof doc.name !== 'string') {
          return res.status(400).json({ message: "Document name is required" });
        }
      }
      
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Verify the employee belongs to this company
      const employee = await storage.getUserById(employeeId);
      if (!employee || employee.companyId !== companyId) {
        return res.status(403).json({ message: "Employee not found or access denied" });
      }
      
      // Resolve document references and validate fileUrls
      const resolvedDocuments: { type: string; id?: string; name: string; version?: string; fileUrl?: string }[] = [];
      
      for (const doc of documents) {
        let fileUrl = doc.fileUrl;
        
        // For health_safety_manual and company_policy, resolve from company documents
        if ((doc.type === 'health_safety_manual' || doc.type === 'company_policy') && !fileUrl) {
          const companyDocs = await storage.getCompanyDocumentsByType(companyId, doc.type);
          if (companyDocs.length > 0) {
            fileUrl = companyDocs[0].fileUrl;
          }
        }
        
        // For method_statement, resolve from method statements table
        if (doc.type === 'method_statement' && doc.id && !fileUrl) {
          const methodStatement = await storage.getMethodStatementById(doc.id);
          if (methodStatement && methodStatement.companyId === companyId) {
            // Method statements don't have file URLs since they're rendered in-app
            // But we can still validate the reference exists
            fileUrl = null; // Method statements are viewed in-app, not via file URL
          } else {
            return res.status(404).json({ message: `Method statement not found: ${doc.id}` });
          }
        }
        
        // Require fileUrl for health_safety_manual and company_policy
        if ((doc.type === 'health_safety_manual' || doc.type === 'company_policy') && !fileUrl) {
          return res.status(400).json({ message: `No ${doc.type.replace(/_/g, ' ')} document uploaded. Please upload the document first.` });
        }
        
        resolvedDocuments.push({
          type: doc.type,
          id: doc.id,
          name: doc.name,
          version: doc.version,
          fileUrl,
        });
      }
      
      const reviews = await storage.enrollEmployeeInDocumentReviews(companyId, employeeId, resolvedDocuments);
      res.json({ reviews });
    } catch (error) {
      console.error("Enroll employee in document reviews error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Mark document as viewed
  app.post("/api/document-reviews/:id/view", requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the review record directly by ID
      const review = await storage.getDocumentReviewSignatureById(id);
      
      if (!review) {
        return res.status(404).json({ message: "Document review not found" });
      }
      
      // Verify ownership - employee can only view their own reviews
      if (review.employeeId !== currentUser.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Only update if not already viewed
      if (!review.viewedAt) {
        const updated = await storage.updateDocumentReviewSignature(id, { viewedAt: new Date() });
        return res.json({ review: updated });
      }
      
      res.json({ review });
    } catch (error) {
      console.error("Mark document viewed error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Sign a document (requires it to be viewed first)
  app.post("/api/document-reviews/:id/sign", requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { signatureDataUrl } = req.body;
      
      if (!signatureDataUrl || typeof signatureDataUrl !== 'string') {
        return res.status(400).json({ message: "Valid signature data URL is required" });
      }
      
      // Validate signature data URL format (base64 data URL)
      if (!signatureDataUrl.startsWith('data:image/')) {
        return res.status(400).json({ message: "Invalid signature format" });
      }
      
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the review record directly by ID
      const review = await storage.getDocumentReviewSignatureById(id);
      
      if (!review) {
        return res.status(404).json({ message: "Document review not found" });
      }
      
      // Verify ownership - employee can only sign their own reviews
      if (review.employeeId !== currentUser.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Ensure document was viewed before signing
      if (!review.viewedAt) {
        return res.status(400).json({ message: "Document must be viewed before signing" });
      }
      
      // Prevent re-signing already signed documents
      if (review.signedAt) {
        return res.status(400).json({ message: "Document has already been signed" });
      }
      
      const updated = await storage.signDocument(id, signatureDataUrl);
      res.json({ review: updated });
    } catch (error) {
      console.error("Sign document error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete a document review requirement (admin only)
  app.delete("/api/document-reviews/:id", requireAuth, requireRole("operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Get the review record directly by ID
      const review = await storage.getDocumentReviewSignatureById(id);
      
      if (!review) {
        return res.status(404).json({ message: "Document review not found" });
      }
      
      // Verify company ownership
      if (review.companyId !== companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteDocumentReviewSignature(id);
      res.json({ message: "Document review deleted successfully" });
    } catch (error) {
      console.error("Delete document review error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Bulk enroll all employees in required document reviews (when a new document is uploaded)
  app.post("/api/document-reviews/enroll-all", requireAuth, requireRole("operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const { documents } = req.body; // Array of { type, id?, name, version?, fileUrl? }
      
      // Validate documents array
      if (!Array.isArray(documents) || documents.length === 0) {
        return res.status(400).json({ message: "Documents array is required" });
      }
      
      const validDocTypes = ['health_safety_manual', 'company_policy', 'method_statement'];
      for (const doc of documents) {
        if (!doc.type || !validDocTypes.includes(doc.type)) {
          return res.status(400).json({ message: `Invalid document type: ${doc.type}` });
        }
        if (!doc.name || typeof doc.name !== 'string') {
          return res.status(400).json({ message: "Document name is required" });
        }
      }
      
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Resolve document references and validate fileUrls
      const resolvedDocuments: { type: string; id?: string; name: string; version?: string; fileUrl?: string }[] = [];
      
      for (const doc of documents) {
        let fileUrl = doc.fileUrl;
        
        // For health_safety_manual and company_policy, resolve from company documents
        if ((doc.type === 'health_safety_manual' || doc.type === 'company_policy') && !fileUrl) {
          const companyDocs = await storage.getCompanyDocumentsByType(companyId, doc.type);
          if (companyDocs.length > 0) {
            fileUrl = companyDocs[0].fileUrl;
          }
        }
        
        // For method_statement, resolve from method statements table
        if (doc.type === 'method_statement' && doc.id && !fileUrl) {
          const methodStatement = await storage.getMethodStatementById(doc.id);
          if (methodStatement && methodStatement.companyId === companyId) {
            fileUrl = null; // Method statements are viewed in-app
          } else {
            return res.status(404).json({ message: `Method statement not found: ${doc.id}` });
          }
        }
        
        // Require fileUrl for health_safety_manual and company_policy
        if ((doc.type === 'health_safety_manual' || doc.type === 'company_policy') && !fileUrl) {
          return res.status(400).json({ message: `No ${doc.type.replace(/_/g, ' ')} document uploaded. Please upload the document first.` });
        }
        
        resolvedDocuments.push({
          type: doc.type,
          id: doc.id,
          name: doc.name,
          version: doc.version,
          fileUrl,
        });
      }
      
      // Get all employees for this company
      const employees = await storage.getAllEmployees(companyId);
      const results: any[] = [];
      
      for (const employee of employees) {
        const reviews = await storage.enrollEmployeeInDocumentReviews(companyId, employee.id, resolvedDocuments);
        results.push({ employeeId: employee.id, employeeName: employee.name, reviews });
      }
      
      res.json({ enrollments: results });
    } catch (error) {
      console.error("Bulk enroll employees error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Document Signature Compliance Report - get all employees and their document signature status
  app.get("/api/document-reviews/compliance-report", requireAuth, requireRole("operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Get company info for header
      let companyName = "Company";
      if (currentUser.role === "company") {
        companyName = currentUser.companyName || currentUser.name || "Company";
      } else {
        const company = await storage.getUserById(companyId);
        if (company) {
          companyName = company.companyName || company.name || "Company";
        }
      }
      
      // Get all employees
      const employees = await storage.getAllEmployees(companyId);
      
      // Get all company documents
      const companyDocuments = await storage.getCompanyDocuments(companyId);
      
      // Filter to required document types
      const requiredDocTypes = ['health_safety_manual', 'company_policy', 'safe_work_procedure'];
      const requiredDocs = companyDocuments.filter((doc: any) => 
        requiredDocTypes.includes(doc.documentType)
      );
      
      // Get all document reviews
      const allReviews = await storage.getDocumentReviewSignaturesByCompany(companyId);
      
      // Build compliance matrix
      const employeeCompliance = employees.map((employee: any) => {
        const employeeReviews = allReviews.filter((r: any) => r.employeeId === employee.id);
        
        const documentStatus = requiredDocs.map((doc: any) => {
          const review = employeeReviews.find((r: any) => r.documentId === doc.id);
          
          return {
            documentId: doc.id,
            documentName: doc.fileName || doc.documentType,
            documentType: doc.documentType,
            status: review?.signedAt ? 'signed' : (review?.viewedAt ? 'viewed' : 'pending'),
            viewedAt: review?.viewedAt || null,
            signedAt: review?.signedAt || null,
          };
        });
        
        const signedCount = documentStatus.filter(d => d.status === 'signed').length;
        const totalCount = documentStatus.length;
        
        return {
          employeeId: employee.id,
          employeeName: employee.name || employee.email || 'Unknown',
          email: employee.email,
          documents: documentStatus,
          signedCount,
          totalCount,
          compliancePercent: totalCount > 0 ? Math.round((signedCount / totalCount) * 100) : 100,
        };
      });
      
      // Summary stats
      const totalSignatures = employees.length * requiredDocs.length;
      const completedSignatures = employeeCompliance.reduce((sum, e) => sum + e.signedCount, 0);
      const overallCompliancePercent = totalSignatures > 0 
        ? Math.round((completedSignatures / totalSignatures) * 100) 
        : 100;
      
      res.json({
        companyName,
        generatedAt: new Date().toISOString(),
        summary: {
          totalEmployees: employees.length,
          totalDocuments: requiredDocs.length,
          totalSignaturesRequired: totalSignatures,
          completedSignatures,
          pendingSignatures: totalSignatures - completedSignatures,
          overallCompliancePercent,
        },
        documents: requiredDocs.map((doc: any) => ({
          id: doc.id,
          name: doc.fileName || doc.documentType,
          type: doc.documentType,
        })),
        employees: employeeCompliance,
      });
    } catch (error) {
      console.error("Get compliance report error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== COMPANY DOCUMENTS ROUTES ====================

  // Upload company document (Health & Safety Manual or Company Policy)
  app.post("/api/company-documents", requireAuth, requireRole("operations_manager", "company"), upload.single('document'), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { documentType, jobType, customJobType } = req.body;
      
      if (!documentType || !['health_safety_manual', 'company_policy', 'certificate_of_insurance', 'method_statement', 'safe_work_procedure'].includes(documentType)) {
        return res.status(400).json({ message: "Invalid document type" });
      }

      // For method_statement, require jobType
      if (documentType === 'method_statement' && !jobType) {
        return res.status(400).json({ message: "Job type is required for method statement documents" });
      }

      // Upload file to object storage
      const objectStorageService = new ObjectStorageService();
      const timestamp = Date.now();
      const filename = `company-documents/${documentType}-${timestamp}-${req.file.originalname}`;
      const fileUrl = await objectStorageService.uploadPublicFile(
        filename,
        req.file.buffer,
        req.file.mimetype
      );

      // Save to database
      const document = await storage.createCompanyDocument({
        companyId,
        documentType,
        fileName: req.file.originalname,
        fileUrl,
        uploadedById: currentUser.id,
        uploadedByName: currentUser.name || currentUser.email || "Unknown User",
        ...(documentType === 'method_statement' && { jobType, customJobType }),
      });

      // Auto-enroll all employees for Health & Safety Manual, Company Policy, and Safe Work Procedure documents
      if (documentType === 'health_safety_manual' || documentType === 'company_policy' || documentType === 'safe_work_procedure') {
        try {
          const employees = await storage.getAllEmployees(companyId);
          const docToEnroll = [{
            type: documentType,
            id: document.id,
            name: req.file.originalname,
            fileUrl,
          }];
          
          for (const employee of employees) {
            await storage.enrollEmployeeInDocumentReviews(companyId, employee.id, docToEnroll);
          }
          console.log(`Auto-enrolled ${employees.length} employees for document: ${req.file.originalname}`);
        } catch (enrollError) {
          console.error("Auto-enrollment error (non-fatal):", enrollError);
          // Continue - document was still uploaded successfully
        }
      }

      res.json({ document });
    } catch (error) {
      console.error("Upload company document error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all company documents
  app.get("/api/company-documents", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const documents = await storage.getCompanyDocuments(companyId);
      res.json({ documents });
    } catch (error) {
      console.error("Get company documents error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete company document
  app.delete("/api/company-documents/:id", requireAuth, requireRole("operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteCompanyDocument(id);
      
      // Also delete any associated document review signatures
      await storage.deleteDocumentReviewsByDocumentId(id);
      
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Delete company document error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Initialize template safe work procedures for a company
  app.post("/api/company-documents/init-templates", requireAuth, requireRole("operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }

      const { templates } = req.body;
      
      if (!templates || !Array.isArray(templates)) {
        return res.status(400).json({ message: "Templates array is required" });
      }

      const createdDocs: any[] = [];
      const employees = await storage.getAllEmployees(companyId);

      for (const template of templates) {
        // Check if template already exists for this company
        const existing = await storage.getCompanyDocumentByTemplateId(companyId, template.templateId);
        
        if (!existing) {
          // Create the template document
          const document = await storage.createCompanyDocument({
            companyId,
            documentType: 'safe_work_procedure',
            fileName: template.title,
            fileUrl: '', // Template procedures are generated on-demand, no file URL
            uploadedById: currentUser.id,
            uploadedByName: 'System Template',
            isTemplate: true,
            templateId: template.templateId,
            description: template.description,
            jobType: template.jobType,
          });

          createdDocs.push(document);

          // Auto-enroll all employees for this template
          const docToEnroll = [{
            type: 'safe_work_procedure',
            id: document.id,
            name: template.title,
            fileUrl: '',
          }];
          
          for (const employee of employees) {
            await storage.enrollEmployeeInDocumentReviews(companyId, employee.id, docToEnroll);
          }
        }
      }

      res.json({ 
        message: `Initialized ${createdDocs.length} template procedures`,
        documents: createdDocs,
        enrolledEmployees: employees.length
      });
    } catch (error) {
      console.error("Initialize template procedures error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== JOB COMMENTS ROUTES ====================
  
  // Create job comment
  app.post("/api/projects/:projectId/comments", requireAuth, requireRole("rope_access_tech", "general_supervisor", "rope_access_supervisor", "supervisor", "operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const commentData = insertJobCommentSchema.parse({
        projectId: req.params.projectId,
        companyId,
        userId: currentUser.id,
        userName: currentUser.name || currentUser.email || "Unknown User",
        comment: req.body.comment,
      });
      
      const comment = await storage.createJobComment(commentData);
      res.json({ comment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create job comment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get job comments for a project
  app.get("/api/projects/:projectId/comments", requireAuth, async (req: Request, res: Response) => {
    try {
      const comments = await storage.getJobCommentsByProject(req.params.projectId);
      res.json({ comments });
    } catch (error) {
      console.error("Get job comments error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== PAYROLL / PAY PERIOD ROUTES ====================
  
  // Get or create pay period configuration
  app.get("/api/payroll/config", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const config = await storage.getPayPeriodConfig(companyId);
      res.json({ config });
    } catch (error) {
      console.error("Get pay period config error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create or update pay period configuration
  app.post("/api/payroll/config", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      console.log("Payroll config request body:", JSON.stringify(req.body, null, 2));
      
      const configData = insertPayPeriodConfigSchema.parse({
        ...req.body,
        companyId,
      });
      
      const config = await storage.upsertPayPeriodConfig(configData);
      res.json({ config });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Payroll config validation error:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create/update pay period config error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Manually add work session (for when employees forget to clock in)
  app.post("/api/payroll/add-work-session", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }

      // Check if user has financial permissions
      const hasFinancialAccess = currentUser.role === "company" || currentUser.permissions?.includes("view_financial_data");
      if (!hasFinancialAccess) {
        return res.status(403).json({ message: "You don't have permission to add work sessions" });
      }

      const { employeeId, projectId, workDate, startTime, endTime, dropsCompletedNorth, dropsCompletedEast, dropsCompletedSouth, dropsCompletedWest, shortfallReason } = req.body;

      // Validate required fields
      if (!employeeId || !projectId || !workDate || !startTime || !endTime) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Verify employee belongs to company (or IS the company owner)
      const employee = await storage.getUserById(employeeId);
      if (!employee || (employee.companyId !== companyId && employee.id !== companyId)) {
        return res.status(400).json({ message: "Invalid employee" });
      }

      // Verify project belongs to company
      const project = await storage.getProjectById(projectId);
      if (!project || project.companyId !== companyId) {
        return res.status(400).json({ message: "Invalid project" });
      }

      // Validate drops
      const north = typeof dropsCompletedNorth === 'number' ? dropsCompletedNorth : 0;
      const east = typeof dropsCompletedEast === 'number' ? dropsCompletedEast : 0;
      const south = typeof dropsCompletedSouth === 'number' ? dropsCompletedSouth : 0;
      const west = typeof dropsCompletedWest === 'number' ? dropsCompletedWest : 0;

      if (north < 0 || east < 0 || south < 0 || west < 0) {
        return res.status(400).json({ message: "Invalid drops completed value" });
      }

      const totalDropsCompleted = north + east + south + west;

      // Calculate overtime breakdown for manual session
      const overtimeBreakdown = await calculateOvertimeHours(
        companyId,
        employeeId,
        new Date(workDate),
        new Date(startTime),
        new Date(endTime)
      );

      // Create complete work session with overtime hours using direct DB insert
      const result = await db.insert(workSessions).values({
        projectId,
        employeeId,
        companyId,
        workDate,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        dropsCompletedNorth: north,
        dropsCompletedEast: east,
        dropsCompletedSouth: south,
        dropsCompletedWest: west,
        shortfallReason: (project.dailyDropTarget && totalDropsCompleted < project.dailyDropTarget) ? shortfallReason : undefined,
        regularHours: overtimeBreakdown.regularHours.toString(),
        overtimeHours: overtimeBreakdown.overtimeHours.toString(),
        doubleTimeHours: overtimeBreakdown.doubleTimeHours.toString(),
      }).returning();
      const session = result[0];

      res.json({ session });
    } catch (error) {
      console.error("Add work session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Manually add non-billable work session
  app.post("/api/payroll/add-non-billable-session", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }

      // Check if user has financial permissions
      const hasFinancialAccess = currentUser.role === "company" || currentUser.permissions?.includes("view_financial_data");
      if (!hasFinancialAccess) {
        return res.status(403).json({ message: "You don't have permission to add work sessions" });
      }

      const { employeeId, workDate, startTime, endTime, description } = req.body;

      // Validate required fields
      if (!employeeId || !workDate || !startTime || !endTime || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Verify employee belongs to company (or IS the company owner)
      const employee = await storage.getUserById(employeeId);
      if (!employee || (employee.companyId !== companyId && employee.id !== companyId)) {
        return res.status(400).json({ message: "Invalid employee" });
      }

      // Calculate overtime breakdown for manual non-billable session
      const overtimeBreakdown = await calculateOvertimeHours(
        companyId,
        employeeId,
        new Date(workDate),
        new Date(startTime),
        new Date(endTime)
      );

      // Create complete non-billable work session with overtime hours using direct DB insert
      const result = await db.insert(nonBillableWorkSessions).values({
        employeeId,
        companyId,
        workDate,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
        regularHours: overtimeBreakdown.regularHours.toString(),
        overtimeHours: overtimeBreakdown.overtimeHours.toString(),
        doubleTimeHours: overtimeBreakdown.doubleTimeHours.toString(),
      }).returning();
      const session = result[0];

      res.json({ session });
    } catch (error) {
      console.error("Add non-billable session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update billable work session
  app.patch("/api/payroll/work-sessions/:id", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }

      // Check if user has financial permissions
      const hasFinancialAccess = currentUser.role === "company" || currentUser.permissions?.includes("view_financial_data");
      if (!hasFinancialAccess) {
        return res.status(403).json({ message: "You don't have permission to update work sessions" });
      }

      const { workDate, startTime, endTime, dropsCompletedNorth, dropsCompletedEast, dropsCompletedSouth, dropsCompletedWest, shortfallReason } = req.body;

      const updatedSession = await storage.updateWorkSession(req.params.id, {
        workDate,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        dropsCompletedNorth: dropsCompletedNorth || 0,
        dropsCompletedEast: dropsCompletedEast || 0,
        dropsCompletedSouth: dropsCompletedSouth || 0,
        dropsCompletedWest: dropsCompletedWest || 0,
        shortfallReason,
      });

      res.json({ session: updatedSession });
    } catch (error) {
      console.error("Update work session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete billable work session
  app.delete("/api/payroll/work-sessions/:id", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }

      // Check if user has financial permissions
      const hasFinancialAccess = currentUser.role === "company" || currentUser.permissions?.includes("view_financial_data");
      if (!hasFinancialAccess) {
        return res.status(403).json({ message: "You don't have permission to delete work sessions" });
      }

      await storage.deleteWorkSession(req.params.id);

      res.json({ message: "Work session deleted successfully" });
    } catch (error) {
      console.error("Delete work session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update non-billable work session
  app.patch("/api/payroll/non-billable-sessions/:id", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }

      // Check if user has financial permissions
      const hasFinancialAccess = currentUser.role === "company" || currentUser.permissions?.includes("view_financial_data");
      if (!hasFinancialAccess) {
        return res.status(403).json({ message: "You don't have permission to update work sessions" });
      }

      const { workDate, startTime, endTime, description } = req.body;

      const updatedSession = await storage.updateNonBillableWorkSession(req.params.id, {
        workDate,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
      });

      res.json({ session: updatedSession });
    } catch (error) {
      console.error("Update non-billable session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete non-billable work session
  app.delete("/api/payroll/non-billable-sessions/:id", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }

      // Check if user has financial permissions
      const hasFinancialAccess = currentUser.role === "company" || currentUser.permissions?.includes("view_financial_data");
      if (!hasFinancialAccess) {
        return res.status(403).json({ message: "You don't have permission to delete work sessions" });
      }

      await storage.deleteNonBillableWorkSession(req.params.id);

      res.json({ message: "Non-billable work session deleted successfully" });
    } catch (error) {
      console.error("Delete non-billable session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Generate pay periods
  app.post("/api/payroll/generate-periods", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const numberOfPeriods = req.body.numberOfPeriods || 6;
      const clearExisting = req.body.clearExisting || false;
      
      // Clear existing pay periods if requested (typically when changing configuration)
      if (clearExisting) {
        await storage.deleteAllPayPeriodsForCompany(companyId);
      }
      
      const periods = await storage.generatePayPeriods(companyId, numberOfPeriods);
      res.json({ periods });
    } catch (error) {
      console.error("Generate pay periods error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all pay periods for company
  app.get("/api/payroll/periods", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const periods = await storage.getPayPeriodsByCompany(companyId);
      res.json({ periods });
    } catch (error) {
      console.error("Get pay periods error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get current pay period
  app.get("/api/payroll/current-period", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const period = await storage.getCurrentPayPeriod(companyId);
      res.json({ period });
    } catch (error) {
      console.error("Get current pay period error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get employee hours for a specific pay period
  app.get("/api/payroll/periods/:periodId/hours", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const period = await storage.getPayPeriodById(req.params.periodId);
      
      if (!period) {
        return res.status(404).json({ message: "Pay period not found" });
      }
      
      if (period.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const hoursSummary = await storage.getEmployeeHoursForPayPeriod(companyId, period.startDate, period.endDate);
      res.json({ hoursSummary, period });
    } catch (error) {
      console.error("Get employee hours error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get employee hours for date range
  app.get("/api/payroll/hours", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }
      
      const hoursSummary = await storage.getEmployeeHoursForPayPeriod(companyId, startDate as string, endDate as string);
      res.json({ hoursSummary });
    } catch (error) {
      console.error("Get employee hours error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== QUOTE ROUTES ====================
  
  // Create new quote with services (atomic transaction) - All employees can create quotes
  app.post("/api/quotes", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), async (req: Request, res: Response) => {
    let createdQuoteId: string | null = null;
    
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const { services, ...quoteFields } = req.body;
      
      // Validate that at least one service is provided
      if (!services || !Array.isArray(services) || services.length === 0) {
        return res.status(400).json({ message: "At least one service is required for a quote" });
      }
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      // Determine initial status based on user role
      // Workers create drafts, management creates open quotes
      const isWorker = ["rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"].includes(currentUser.role);
      const initialStatus = isWorker ? "draft" : "open";
      
      const quoteData = insertQuoteSchema.parse({
        ...quoteFields,
        companyId,
        createdBy: currentUser.id,
        status: initialStatus,
      });
      
      // Create the quote
      const quote = await storage.createQuote(quoteData);
      createdQuoteId = quote.id;
      
      // Create all services - if any fail, rollback the quote
      try {
        for (const serviceData of services) {
          // Strip pricing fields if user doesn't have financial permissions
          const processedServiceData = canViewFinancialData 
            ? serviceData 
            : {
                ...serviceData,
                pricePerHour: undefined,
                pricePerStall: undefined,
                dryerVentPricePerUnit: undefined,
                totalHours: undefined,
                totalCost: undefined,
              };
          
          const service = insertQuoteServiceSchema.parse({
            ...processedServiceData,
            quoteId: quote.id,
          });
          await storage.createQuoteService(service);
        }
      } catch (serviceError) {
        // Rollback: delete the quote if service creation failed
        await storage.deleteQuote(quote.id);
        throw new Error(`Failed to create services: ${serviceError instanceof Error ? serviceError.message : 'Unknown error'}`);
      }
      
      // Get the complete quote with services
      const quoteWithServices = await storage.getQuoteById(quote.id);
      res.json({ quote: quoteWithServices });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create quote error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
    }
  });

  // Get all quotes for company - All employees can view
  app.get("/api/quotes", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      const status = req.query.status as string | undefined;
      let quotes = await storage.getQuotesByCompany(companyId, status);
      
      // Workers can only see quotes they created
      const isWorker = ["rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"].includes(currentUser.role);
      if (isWorker) {
        quotes = quotes.filter(quote => quote.createdBy === currentUser.id);
      }
      
      // Filter pricing data if user doesn't have financial permissions
      const filteredQuotes = canViewFinancialData ? quotes : quotes.map(quote => ({
        ...quote,
        services: quote.services.map(service => ({
          ...service,
          pricePerHour: null,
          pricePerStall: null,
          dryerVentPricePerUnit: null,
          totalHours: null,
          totalCost: null,
        })),
      }));
      
      res.json({ quotes: filteredQuotes });
    } catch (error) {
      console.error("Get quotes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get quote by ID - All employees can view
  app.get("/api/quotes/:id", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Workers can only view quotes they created
      const isWorker = ["rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"].includes(currentUser.role);
      if (isWorker && quote.createdBy !== currentUser.id) {
        return res.status(403).json({ message: "You can only view quotes you created" });
      }
      
      // Filter pricing data if user doesn't have financial permissions
      const filteredQuote = canViewFinancialData ? quote : {
        ...quote,
        services: quote.services.map(service => ({
          ...service,
          pricePerHour: null,
          pricePerStall: null,
          dryerVentPricePerUnit: null,
          totalHours: null,
          totalCost: null,
        })),
      };
      
      res.json({ quote: filteredQuote });
    } catch (error) {
      console.error("Get quote error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update quote - Management and workers with edit_quotes permission
  app.patch("/api/quotes/:id", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has edit permissions
      // Management can edit any quote, workers can edit their own quotes
      const isManagement = ["company", "operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor"].includes(currentUser.role);
      const hasEditPermission = currentUser.permissions?.includes("edit_quotes");
      const isWorker = ["rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"].includes(currentUser.role);
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Workers can only edit quotes they created
      if (isWorker && quote.createdBy !== currentUser.id) {
        return res.status(403).json({ message: "You can only edit quotes you created" });
      }
      
      // Non-management without edit permission cannot edit
      if (!isManagement && !hasEditPermission && !isWorker) {
        return res.status(403).json({ message: "Forbidden - You don't have permission to edit quotes" });
      }
      
      const { services, ...quoteFields } = req.body;
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      // If services are provided, update the whole quote with services
      if (services && Array.isArray(services)) {
        // Process services to strip pricing fields if user doesn't have financial permissions
        const processedServices = services.map(serviceData => {
          const processedServiceData = canViewFinancialData 
            ? serviceData 
            : {
                ...serviceData,
                pricePerHour: undefined,
                pricePerStall: undefined,
                dryerVentPricePerUnit: undefined,
                totalHours: undefined,
                totalCost: undefined,
              };
          
          return insertQuoteServiceSchema.parse({
            ...processedServiceData,
            quoteId: quote.id,
          });
        });
        
        const updatedQuote = await storage.updateQuoteWithServices(
          req.params.id, 
          quoteFields,
          processedServices
        );
        
        // Filter pricing data from response if user doesn't have financial permissions
        const filteredQuote = canViewFinancialData ? updatedQuote : {
          ...updatedQuote,
          services: updatedQuote.services.map(service => ({
            ...service,
            pricePerHour: null,
            pricePerStall: null,
            dryerVentPricePerUnit: null,
            totalHours: null,
            totalCost: null,
          })),
        };
        
        res.json({ quote: filteredQuote });
      } else {
        // If no services, just update quote metadata
        const updatedQuote = await storage.updateQuote(req.params.id, quoteFields);
        res.json({ quote: updatedQuote });
      }
    } catch (error) {
      console.error("Update quote error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete quote
  app.delete("/api/quotes/:id", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteQuote(req.params.id);
      res.json({ message: "Quote deleted successfully" });
    } catch (error) {
      console.error("Delete quote error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update quote status - Flexible endpoint for status transitions
  app.patch("/api/quotes/:id/status", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), async (req: Request, res: Response) => {
    try {
      const statusSchema = z.object({
        status: z.enum(["draft", "submitted", "open", "approved", "rejected"]),
      });
      
      const { status } = statusSchema.parse(req.body);
      
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const isManagement = ["company", "operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor"].includes(currentUser.role);
      const isWorker = ["rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"].includes(currentUser.role);
      
      // Permission checks based on role and transition
      if (status === "submitted") {
        // Workers can only submit their own drafts
        if (isWorker && quote.createdBy !== currentUser.id) {
          return res.status(403).json({ message: "You can only submit quotes you created" });
        }
        // Only draft quotes can be submitted
        if (quote.status !== "draft") {
          return res.status(400).json({ message: "Only draft quotes can be submitted" });
        }
      } else if (status === "open" || status === "approved" || status === "rejected") {
        // Only management can change to these statuses
        if (!isManagement) {
          return res.status(403).json({ message: "Only management can approve, reject, or open quotes" });
        }
      }
      
      const updatedQuote = await storage.updateQuote(req.params.id, { status });
      
      res.json({ quote: updatedQuote, message: `Quote status updated to ${status}` });
    } catch (error) {
      console.error("Update quote status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Upload quote photo(s) - All employees can upload photos - supports multiple files
  app.post("/api/quotes/:id/photo", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), imageUpload.array("photos", 10), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No photo files uploaded" });
      }
      
      // Upload all photos
      const objectStorageService = new ObjectStorageService();
      const uploadPromises = files.map(async (file) => {
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(7);
        const filename = `quotes/${companyId}/${timestamp}-${randomSuffix}-${file.originalname}`;
        return await objectStorageService.uploadPublicFile(
          filename,
          file.buffer,
          file.mimetype
        );
      });
      
      const newPhotoUrls = await Promise.all(uploadPromises);
      
      // Append new photos to existing photos
      const existingPhotoUrls = quote.photoUrls || [];
      const updatedPhotoUrls = [...existingPhotoUrls, ...newPhotoUrls];
      
      const updatedQuote = await storage.updateQuote(req.params.id, { photoUrls: updatedPhotoUrls });
      
      res.json({ quote: updatedQuote, photoUrls: newPhotoUrls });
    } catch (error) {
      console.error("Upload quote photo error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete quote photo
  app.delete("/api/quotes/:id/photo", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const quote = await storage.getQuoteById(req.params.id);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const { photoUrl } = req.body;
      if (!photoUrl) {
        return res.status(400).json({ message: "Photo URL is required" });
      }
      
      // Remove the photo from the array
      const currentPhotoUrls = quote.photoUrls || [];
      const updatedPhotoUrls = currentPhotoUrls.filter(url => url !== photoUrl);
      
      const updatedQuote = await storage.updateQuote(req.params.id, { photoUrls: updatedPhotoUrls });
      
      res.json({ quote: updatedQuote, message: "Photo deleted successfully" });
    } catch (error) {
      console.error("Delete quote photo error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== QUOTE SERVICE ROUTES ====================

  // Add service to existing quote
  app.post("/api/quotes/:id/services", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const serviceData = insertQuoteServiceSchema.parse({
        ...req.body,
        quoteId: req.params.id,
      });
      
      const service = await storage.createQuoteService(serviceData);
      res.json({ service });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create quote service error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete quote service
  app.delete("/api/quotes/:id/services/:serviceId", requireAuth, requireRole("company", "owner_ceo", "human_resources", "accounting", "operations_manager", "general_supervisor", "rope_access_supervisor", "account_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteQuoteService(req.params.serviceId);
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error("Delete quote service error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== SCHEDULING ROUTES ====================

  // Get all scheduled jobs for the company
  app.get("/api/schedule", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const jobs = await storage.getScheduledJobsByCompany(companyId);
      
      // DEBUG: Log what we're returning for Dryer vent job
      const dryerJob = jobs.find(j => j.title?.includes("Dryer"));
      if (dryerJob) {
        console.log("=== SERVER DEBUG: Dryer vent job ===");
        console.log("Title:", dryerJob.title);
        console.log("Start:", dryerJob.startDate, "End:", dryerJob.endDate);
        console.log("employeeAssignments count:", dryerJob.employeeAssignments?.length);
        console.log("employeeAssignments:", JSON.stringify(dryerJob.employeeAssignments, null, 2));
      }
      
      res.json({ jobs });
    } catch (error) {
      console.error("Get scheduled jobs error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get scheduled jobs assigned to current employee
  app.get("/api/schedule/my-jobs", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only employees should call this endpoint
      if (currentUser.role === "company" || currentUser.role === "resident") {
        return res.status(400).json({ message: "Invalid endpoint for this role" });
      }
      
      const jobs = await storage.getScheduledJobsByEmployee(currentUser.id);
      res.json({ jobs });
    } catch (error) {
      console.error("Get employee scheduled jobs error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new scheduled job
  app.post("/api/schedule", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const { employeeIds, ...jobFields } = req.body;
      
      const jobData = insertScheduledJobSchema.parse({
        ...jobFields,
        companyId,
        createdBy: currentUser.id,
      });
      
      const job = await storage.createScheduledJob(jobData);
      
      // Assign employees if provided
      if (employeeIds && Array.isArray(employeeIds) && employeeIds.length > 0) {
        await storage.replaceJobAssignments(job.id, employeeIds, currentUser.id);
      }
      
      // Return job with assignments
      const jobWithAssignments = await storage.getScheduledJobWithAssignments(job.id);
      res.json({ job: jobWithAssignments });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create scheduled job error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update scheduled job
  app.put("/api/schedule/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const job = await storage.getScheduledJobById(req.params.id);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      if (job.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const { employeeIds, ...jobFields } = req.body;
      
      const updateData = insertScheduledJobSchema.partial().parse(jobFields);
      const updatedJob = await storage.updateScheduledJob(req.params.id, updateData);
      
      // Update employee assignments if provided
      if (employeeIds !== undefined && Array.isArray(employeeIds)) {
        await storage.replaceJobAssignments(req.params.id, employeeIds, currentUser.id);
      }
      
      // Return job with assignments
      const jobWithAssignments = await storage.getScheduledJobWithAssignments(req.params.id);
      res.json({ job: jobWithAssignments });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Update scheduled job error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete scheduled job
  app.delete("/api/schedule/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const job = await storage.getScheduledJobById(req.params.id);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      if (job.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteScheduledJob(req.params.id);
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      console.error("Delete scheduled job error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Assign employees to a job
  app.post("/api/schedule/:id/assign", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const job = await storage.getScheduledJobById(req.params.id);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      if (job.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const { employeeIds } = req.body;
      
      if (!Array.isArray(employeeIds)) {
        return res.status(400).json({ message: "employeeIds must be an array" });
      }
      
      // Check for double-booking conflicts
      const conflicts = await storage.checkEmployeeConflicts(employeeIds, job.startDate, job.endDate, req.params.id);
      
      if (conflicts.length > 0) {
        return res.status(409).json({ 
          message: "Schedule conflict detected",
          conflicts: conflicts.map(c => ({
            employeeId: c.employeeId,
            employeeName: c.employeeName,
            conflictingJob: c.conflictingJobTitle,
          }))
        });
      }
      
      // Remove existing assignments and add new ones
      await storage.replaceJobAssignments(req.params.id, employeeIds, currentUser.id);
      
      const updatedJob = await storage.getScheduledJobWithAssignments(req.params.id);
      res.json({ job: updatedJob });
    } catch (error) {
      console.error("Assign employees error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get assignments for a specific job
  app.get("/api/schedule/:id/assignments", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const job = await storage.getScheduledJobById(req.params.id);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      if (job.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const assignments = await storage.getJobAssignments(req.params.id);
      res.json({ assignments });
    } catch (error) {
      console.error("Get job assignments error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create or update individual assignment with date range
  app.post("/api/schedule/:jobId/assign-employee", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const job = await storage.getScheduledJobById(req.params.jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      if (job.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const { employeeId, startDate, endDate } = req.body;
      
      console.log("[ASSIGN EMPLOYEE] Received request body:", req.body);
      console.log("[ASSIGN EMPLOYEE] employeeId:", employeeId);
      console.log("[ASSIGN EMPLOYEE] startDate:", startDate);
      console.log("[ASSIGN EMPLOYEE] endDate:", endDate);
      
      if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required" });
      }
      
      // Parse dates properly - handle empty strings
      const parsedStartDate = startDate && startDate.trim() !== '' ? new Date(startDate) : null;
      const parsedEndDate = endDate && endDate.trim() !== '' ? new Date(endDate) : null;
      
      console.log("[ASSIGN EMPLOYEE] Parsed startDate:", parsedStartDate);
      console.log("[ASSIGN EMPLOYEE] Parsed endDate:", parsedEndDate);
      
      // Check if assignment already exists
      const existingAssignments = await storage.getJobAssignments(req.params.jobId);
      const existingAssignment = existingAssignments.find(a => a.employeeId === employeeId);
      
      if (existingAssignment) {
        // Update existing assignment
        console.log("[ASSIGN EMPLOYEE] Updating existing assignment:", existingAssignment.id);
        await db.update(jobAssignments)
          .set({
            startDate: parsedStartDate,
            endDate: parsedEndDate,
          })
          .where(eq(jobAssignments.id, existingAssignment.id));
      } else {
        // Create new assignment
        console.log("[ASSIGN EMPLOYEE] Creating new assignment");
        await storage.createJobAssignment({
          jobId: req.params.jobId,
          employeeId,
          startDate: parsedStartDate as any,
          endDate: parsedEndDate as any,
          assignedBy: currentUser.id,
        });
      }
      
      const updatedJob = await storage.getScheduledJobWithAssignments(req.params.jobId);
      res.json({ job: updatedJob });
    } catch (error) {
      console.error("Assign employee error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete specific assignment
  app.delete("/api/schedule/:jobId/assignments/:assignmentId", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const job = await storage.getScheduledJobById(req.params.jobId);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      if (job.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteJobAssignment(req.params.assignmentId);
      
      const updatedJob = await storage.getScheduledJobWithAssignments(req.params.jobId);
      res.json({ job: updatedJob });
    } catch (error) {
      console.error("Delete assignment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== EMPLOYEE TIME OFF ROUTES ====================

  // Get employee time off entries
  app.get("/api/employee-time-off", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      
      const timeOffEntries = await storage.getEmployeeTimeOffByCompany(companyId, startDate, endDate);
      res.json({ timeOff: timeOffEntries });
    } catch (error) {
      console.error("Get employee time off error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create employee time off entry
  app.post("/api/employee-time-off", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only management roles can create time off entries
      const managementRoles = ["company", "owner_ceo", "operations_manager", "supervisor"];
      if (!managementRoles.includes(currentUser.role)) {
        return res.status(403).json({ message: "Only management can schedule time off" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const { employeeId, date, timeOffType, notes } = req.body;
      
      if (!employeeId || !date || !timeOffType) {
        return res.status(400).json({ message: "employeeId, date, and timeOffType are required" });
      }
      
      // Verify the employee belongs to this company
      const employee = await storage.getUserById(employeeId);
      if (!employee || (employee.companyId !== companyId && employee.id !== companyId)) {
        return res.status(403).json({ message: "Employee not found or not in your company" });
      }
      
      const timeOff = await storage.createEmployeeTimeOff({
        companyId,
        employeeId,
        date,
        timeOffType,
        notes: notes || null,
        createdBy: currentUser.id,
      });
      
      res.json({ timeOff });
    } catch (error) {
      console.error("Create employee time off error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete employee time off entry
  app.delete("/api/employee-time-off/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only management roles can delete time off entries
      const managementRoles = ["company", "owner_ceo", "operations_manager", "supervisor"];
      if (!managementRoles.includes(currentUser.role)) {
        return res.status(403).json({ message: "Only management can delete time off" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const timeOff = await storage.getEmployeeTimeOffById(req.params.id);
      if (!timeOff) {
        return res.status(404).json({ message: "Time off entry not found" });
      }
      
      if (timeOff.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteEmployeeTimeOff(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete employee time off error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user preferences
  app.get("/api/user-preferences", requireAuth, async (req: Request, res: Response) => {
    try {
      const preferences = await storage.getUserPreferences(req.session.userId!);
      res.json({ preferences });
    } catch (error) {
      console.error("Get user preferences error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user preferences
  app.post("/api/user-preferences", requireAuth, async (req: Request, res: Response) => {
    try {
      const { dashboardCardOrder, hoursAnalyticsCardOrder } = req.body;
      
      const preferences = await storage.updateUserPreferences(req.session.userId!, {
        dashboardCardOrder,
        hoursAnalyticsCardOrder,
      });
      
      res.json({ preferences });
    } catch (error) {
      console.error("Update user preferences error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
