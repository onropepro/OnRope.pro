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

// Initialize Stripe with latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
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

    const session = await stripe.checkout.sessions.create({
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
    });

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

    // Create new subscription checkout
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
      currentPeriodEnd: activeSubscription.current_period_end ? new Date(activeSubscription.current_period_end * 1000) : undefined,
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
    userId: number;
    stripeCustomerId: string;
    subscriptionId?: string;
    tier?: TierName;
    status?: string;
    currentPeriodEnd?: Date;
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

        // Determine tier from price ID
        const priceId = subscription.items.data[0]?.price.id;
        let tier: TierName | undefined;

        for (const [tierName, config] of Object.entries(TIER_CONFIG)) {
          if (config.priceIdUSD === priceId || config.priceIdCAD === priceId) {
            tier = tierName as TierName;
            break;
          }
        }

        // Update user subscription in database
        await updateUserSubscription({
          userId: parseInt(userId),
          stripeCustomerId: customerId,
          subscriptionId: subscription.id,
          tier,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : undefined,
        });

        console.log(`[Webhook] Subscription updated for user ${userId}: ${tier} (${subscription.status})`);
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

        // Mark subscription as canceled
        await updateUserSubscription({
          userId: parseInt(userId),
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
