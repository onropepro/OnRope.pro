/**
 * Stripe Service Layer
 * 
 * Handles all Stripe integrations with zero-failure tolerance
 * Following "It Just Works" principle - 100% reliability required
 * 
 * Key Features:
 * - Customer creation with metadata
 * - Checkout session creation for subscriptions/add-ons
 * - Webhook event handling
 * - Subscription lifecycle management
 * - Multi-currency support (USD/CAD)
 * - Comprehensive error handling and logging
 */

import Stripe from 'stripe';
import type { User } from '../shared/schema';
import { STRIPE_PRICE_IDS, TIER_CONFIG, ADDON_CONFIG, type TierName, type AddonName, type Currency } from '../shared/stripe-config';
import { storage } from './storage';

// Initialize Stripe with latest API version
// Using type assertion because Stripe types default to latest version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' as any,
});

/**
 * Get or create Stripe customer for a company user
 * CRITICAL: Must maintain multi-tenant isolation
 */
export async function getOrCreateCustomer(user: User): Promise<string> {
  try {
    // If customer already exists, return it
    if (user.stripeCustomerId) {
      console.log(`[Stripe] Using existing customer: ${user.stripeCustomerId}`);
      return user.stripeCustomerId;
    }

    // Create new Stripe customer with company metadata
    console.log(`[Stripe] Creating new customer for company: ${user.companyName}`);
    const customer = await stripe.customers.create({
      email: user.email || undefined,
      name: user.companyName || user.email || `User ${user.id}`,
      metadata: {
        userId: user.id.toString(),
        companyId: user.id.toString(), // For multi-tenant tracking
        role: user.role,
      },
    });

    console.log(`[Stripe] Customer created: ${customer.id}`);
    return customer.id;
  } catch (error) {
    console.error('[Stripe] Failed to get/create customer:', error);
    throw new Error('Failed to initialize payment account. Please try again.');
  }
}

/**
 * Create checkout session for subscription purchase
 * Supports both tier subscriptions and add-on purchases
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  mode: 'subscription' | 'payment'; // subscription for tiers, payment for one-time add-ons
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  try {
    console.log(`[Stripe] Creating checkout session:`, {
      customerId: params.customerId,
      priceId: params.priceId,
      mode: params.mode,
    });

    const sessionConfig: any = {
      customer: params.customerId,
      mode: params.mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata || {},
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    };

    // Add 1-month free trial for subscription mode
    if (params.mode === 'subscription') {
      sessionConfig.subscription_data = {
        trial_period_days: 30, // 1-month free trial
        metadata: params.metadata || {},
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log(`[Stripe] Checkout session created: ${session.id}`);
    return session;
  } catch (error) {
    console.error('[Stripe] Failed to create checkout session:', error);
    throw new Error('Failed to create payment session. Please try again.');
  }
}

/**
 * Create checkout session for subscription upgrade/downgrade
 * Handles proration automatically
 */
export async function createSubscriptionChangeSession(params: {
  customerId: string;
  currentSubscriptionId: string;
  newPriceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> {
  try {
    console.log(`[Stripe] Creating subscription change session:`, {
      customerId: params.customerId,
      subscriptionId: params.currentSubscriptionId,
      newPriceId: params.newPriceId,
    });

    // Cancel existing subscription at period end
    await stripe.subscriptions.update(params.currentSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Create new subscription checkout with 1-month free trial
    const session = await stripe.checkout.sessions.create({
      customer: params.customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.newPriceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      subscription_data: {
        trial_period_days: 30, // 1-month free trial
        metadata: {
          upgrade_from: params.currentSubscriptionId,
        },
      },
    });

    console.log(`[Stripe] Subscription change session created: ${session.id}`);
    return session;
  } catch (error) {
    console.error('[Stripe] Failed to create subscription change session:', error);
    throw new Error('Failed to process subscription change. Please try again.');
  }
}

/**
 * Get current subscription status for a customer
 */
export async function getSubscriptionStatus(customerId: string): Promise<{
  hasActiveSubscription: boolean;
  subscriptionId?: string;
  currentTier?: TierName;
  status?: Stripe.Subscription.Status;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}> {
  try {
    // Get all subscriptions for customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 10,
    });

    // Find active subscription
    const activeSubscription = subscriptions.data.find(
      (sub) => sub.status === 'active' || sub.status === 'trialing'
    );

    if (!activeSubscription) {
      return { hasActiveSubscription: false };
    }

    // Determine tier from price ID
    const priceId = activeSubscription.items.data[0]?.price.id;
    let currentTier: TierName | undefined;

    for (const [tier, config] of Object.entries(TIER_CONFIG)) {
      if (config.priceIdUSD === priceId || config.priceIdCAD === priceId) {
        currentTier = tier as TierName;
        break;
      }
    }

    return {
      hasActiveSubscription: true,
      subscriptionId: activeSubscription.id,
      currentTier,
      status: activeSubscription.status,
      currentPeriodEnd: (activeSubscription as any).current_period_end ? new Date((activeSubscription as any).current_period_end * 1000) : undefined,
      cancelAtPeriodEnd: activeSubscription.cancel_at_period_end || false,
    };
  } catch (error) {
    console.error('[Stripe] Failed to get subscription status:', error);
    throw new Error('Failed to retrieve subscription status.');
  }
}

/**
 * Cancel subscription (at period end)
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  try {
    console.log(`[Stripe] Canceling subscription: ${subscriptionId}`);
    
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    console.log(`[Stripe] Subscription will cancel at period end: ${subscriptionId}`);
  } catch (error) {
    console.error('[Stripe] Failed to cancel subscription:', error);
    throw new Error('Failed to cancel subscription. Please try again.');
  }
}

/**
 * Immediately cancel subscription (no grace period)
 * WARNING: Only use for fraud/abuse cases
 */
export async function cancelSubscriptionImmediately(subscriptionId: string): Promise<void> {
  try {
    console.log(`[Stripe] Immediately canceling subscription: ${subscriptionId}`);
    
    await stripe.subscriptions.cancel(subscriptionId);

    console.log(`[Stripe] Subscription canceled immediately: ${subscriptionId}`);
  } catch (error) {
    console.error('[Stripe] Failed to immediately cancel subscription:', error);
    throw new Error('Failed to cancel subscription immediately.');
  }
}

/**
 * Reactivate a subscription scheduled for cancellation
 */
export async function reactivateSubscription(subscriptionId: string): Promise<void> {
  try {
    console.log(`[Stripe] Reactivating subscription: ${subscriptionId}`);
    
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    console.log(`[Stripe] Subscription reactivated: ${subscriptionId}`);
  } catch (error) {
    console.error('[Stripe] Failed to reactivate subscription:', error);
    throw new Error('Failed to reactivate subscription. Please try again.');
  }
}

/**
 * Handle Stripe webhook events
 * CRITICAL: Must be reliable - processes subscription lifecycle events
 */
export async function handleWebhookEvent(
  event: Stripe.Event,
  updateUserSubscription: (params: {
    userId: string;
    stripeCustomerId: string;
    subscriptionId?: string;
    tier?: TierName;
    status?: string;
    currentPeriodEnd?: Date;
    whitelabelBrandingActive?: boolean;
  }) => Promise<void>
): Promise<void> {
  console.log(`[Stripe Webhook] Processing event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[Webhook] Checkout completed for customer: ${session.customer}`);
        
        // If this was a subscription purchase, the subscription.created event will handle it
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string' 
          ? subscription.customer 
          : subscription.customer.id;

        // Get customer to find userId from metadata
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) {
          console.warn(`[Webhook] Customer deleted: ${customerId}`);
          return;
        }

        const userId = customer.metadata?.userId;
        if (!userId) {
          console.warn(`[Webhook] No userId in customer metadata: ${customerId}`);
          return;
        }

        // Check all subscription items to determine tier and add-ons
        let tier: TierName | undefined;
        let whitelabelBrandingActive = false;

        for (const item of subscription.items.data) {
          const priceId = item.price.id;
          
          // Check if this is a tier price
          for (const [tierName, config] of Object.entries(TIER_CONFIG)) {
            if (config.priceIdUSD === priceId || config.priceIdCAD === priceId) {
              tier = tierName as TierName;
              break;
            }
          }
          
          // Check if this is white label branding add-on
          if (priceId === ADDON_CONFIG.white_label.priceIdUSD || 
              priceId === ADDON_CONFIG.white_label.priceIdCAD) {
            whitelabelBrandingActive = true;
            console.log(`[Webhook] White label branding detected for user ${userId}`);
          }
        }

        // Check if this is a win-back (customer who previously churned and is resubscribing)
        if (event.type === 'customer.subscription.created') {
          try {
            const hasChurned = await storage.hasActiveChurnEvent(userId);
            if (hasChurned) {
              await storage.recordWinBack(userId);
              console.log(`[Webhook] Win-back recorded for user ${userId}`);
            }
          } catch (winBackError) {
            console.error(`[Webhook] Failed to check/record win-back:`, winBackError);
            // Don't fail the webhook if win-back recording fails
          }
        }

        // Check if subscription transitioned from trialing to active and has pending white label
        if (event.type === 'customer.subscription.updated' && subscription.status === 'active') {
          try {
            const user = await storage.getUserById(userId);
            if (user?.whitelabelPendingBilling && !whitelabelBrandingActive) {
              console.log(`[Webhook] Trial ended - adding pending white label branding to subscription for user ${userId}`);
              
              // Determine currency from subscription
              const currency = subscription.currency.toLowerCase() as 'usd' | 'cad';
              const addonPriceId = currency === 'usd' 
                ? ADDON_CONFIG.white_label.priceIdUSD 
                : ADDON_CONFIG.white_label.priceIdCAD;
              
              // Add white label to Stripe subscription
              await stripe.subscriptionItems.create({
                subscription: subscription.id,
                price: addonPriceId,
                proration_behavior: 'create_prorations',
              });
              
              // Clear the pending flag and ensure branding stays active
              await storage.updateUser(userId, {
                whitelabelPendingBilling: false,
              });
              
              whitelabelBrandingActive = true;
              console.log(`[Webhook] White label branding added to subscription for user ${userId} after trial ended`);
            }
          } catch (pendingError) {
            console.error(`[Webhook] Failed to add pending white label branding:`, pendingError);
            // Don't fail the webhook if this fails
          }
        }

        // Update user subscription in database
        await updateUserSubscription({
          userId: userId,
          stripeCustomerId: customerId,
          subscriptionId: subscription.id,
          tier,
          status: subscription.status,
          currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : undefined,
          whitelabelBrandingActive,
        });

        console.log(`[Webhook] Subscription updated for user ${userId}: ${tier} (${subscription.status}), white label: ${whitelabelBrandingActive}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string' 
          ? subscription.customer 
          : subscription.customer.id;

        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) return;

        const userId = customer.metadata?.userId;
        if (!userId) return;

        // Get the user's current subscription info before cancellation for churn tracking
        const user = await storage.getUserById(userId);
        let finalMrr = 0;
        let tier: string | undefined;
        
        if (user?.licenseKey) {
          // Parse tier from license key: format is COMPANY-XXXXX-XXXXX-XXXXX-N
          const segments = user.licenseKey.split('-');
          const lastSegment = segments[segments.length - 1];
          const tierNumber = lastSegment.charAt(0);
          
          const tierMap: Record<string, { name: string; price: number }> = {
            '1': { name: 'basic', price: 79 },
            '2': { name: 'starter', price: 299 },
            '3': { name: 'premium', price: 499 },
            '4': { name: 'enterprise', price: 899 },
          };
          
          const tierInfo = tierMap[tierNumber] || tierMap['1'];
          tier = tierInfo.name;
          finalMrr = tierInfo.price;
          
          // Add add-on revenue
          if (user.additionalSeatsCount) finalMrr += user.additionalSeatsCount * 19;
                    if (user.whitelabelBrandingActive) finalMrr += 49;
        }

        // Record churn event for metrics tracking
        try {
          await storage.recordChurnEvent({
            companyId: userId,
            finalMrr,
            tier,
            reason: 'unknown', // Could be enhanced to capture cancellation reason
            notes: `Subscription ${subscription.id} deleted via Stripe webhook`,
          });
          console.log(`[Webhook] Churn event recorded for user ${userId}`);
        } catch (churnError) {
          console.error(`[Webhook] Failed to record churn event:`, churnError);
          // Don't fail the webhook if churn recording fails
        }

        // Mark subscription as canceled
        await updateUserSubscription({
          userId: userId,
          stripeCustomerId: customerId,
          subscriptionId: undefined,
          tier: undefined,
          status: 'canceled',
          currentPeriodEnd: undefined,
        });

        console.log(`[Webhook] Subscription deleted for user ${userId}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(`[Webhook] Payment failed for customer: ${invoice.customer}`);
        
        // TODO: Send notification to user about payment failure
        // TODO: Consider grace period before access restriction
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Webhook] Payment succeeded for customer: ${invoice.customer}`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`[Stripe Webhook] Error processing ${event.type}:`, error);
    throw error; // Let webhook handler retry
  }
}

/**
 * Construct webhook event from request
 * Verifies webhook signature for security
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('[Stripe] Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
}

export { stripe };
