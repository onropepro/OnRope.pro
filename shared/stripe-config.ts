/**
 * Stripe Product and Price Configuration
 * Generated: 2025-11-22
 * 
 * These price IDs correspond to products created in Stripe Dashboard
 * Supports both USD and CAD currencies
 * DO NOT modify these IDs - they are tied to actual Stripe products
 */

export const STRIPE_PRICE_IDS = {
  // Subscription Tiers (Recurring Monthly) - Single OnRopePro plan at $99/month
  // All tier names point to the same price ID for backward compatibility
  tiers: {
    usd: {
      onropepro: 'price_1SchE1BzDsOltscr7YZLP8q6',   // $99/mo - OnRopePro, unlimited projects
      basic: 'price_1SchE1BzDsOltscr7YZLP8q6',       // Legacy alias
      starter: 'price_1SchE1BzDsOltscr7YZLP8q6',     // Legacy alias
      premium: 'price_1SchE1BzDsOltscr7YZLP8q6',     // Legacy alias
      enterprise: 'price_1SchE1BzDsOltscr7YZLP8q6',  // Legacy alias
    },
    cad: {
      onropepro: 'price_1SchE1BzDsOltscr8GLwkiaW',   // $99 CAD/mo - OnRopePro, unlimited projects
      basic: 'price_1SchE1BzDsOltscr8GLwkiaW',       // Legacy alias
      starter: 'price_1SchE1BzDsOltscr8GLwkiaW',     // Legacy alias
      premium: 'price_1SchE1BzDsOltscr8GLwkiaW',     // Legacy alias
      enterprise: 'price_1SchE1BzDsOltscr8GLwkiaW',  // Legacy alias
    },
  },
  
  // Add-ons - Same price, different currency
  // All add-ons are RECURRING to work with subscription system
  // NOTE: extra_project removed - new pricing model has unlimited projects
  // Updated: 2025-12-10 - New seat prices at $34.95/month
  addons: {
    usd: {
      extra_seats: 'price_1SchmLBzDsOltscrBFnvcvjF',     // $34.95/mo recurring - 1 seat ✓
      white_label: 'price_1SWCTnBzDsOltscrD2qcZ47m',     // $49/mo recurring ✓
    },
    cad: {
      extra_seats: 'price_1SchmLBzDsOltscr8RBwsJwM',     // $34.95 CAD/mo recurring - 1 seat ✓
      white_label: 'price_1SZG7KBzDsOltscrs9vnr0v2',     // $49 CAD/mo recurring ✓
    },
  },
} as const;

// Single plan display name - use this everywhere in the UI
export const PLAN_DISPLAY_NAME = 'OnRopePro';

// Tier configuration with limits and pricing (same price for both currencies)
// SINGLE PLAN MODEL: $99/month base + $34.95/seat, unlimited projects
// All legacy tier names (basic, starter, premium, enterprise) map to the same plan
const BASE_TIER_CONFIG = {
  name: PLAN_DISPLAY_NAME,
  priceUSD: 99,
  priceCAD: 99,
  maxProjects: -1, // unlimited
  maxSeats: 0,     // no included seats, add at $34.95/seat
  priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.basic,
  priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.basic,
};

// All tiers are identical - legacy names kept for backward compatibility with existing database values
export const TIER_CONFIG = {
  onropepro: { ...BASE_TIER_CONFIG },
  basic: { ...BASE_TIER_CONFIG },
  starter: { ...BASE_TIER_CONFIG },
  premium: { ...BASE_TIER_CONFIG },
  enterprise: { ...BASE_TIER_CONFIG },
} as const;

// Helper to normalize any tier name to display name
export function getTierDisplayName(tier: string | null | undefined): string {
  return PLAN_DISPLAY_NAME;
}

// Add-on configuration with pricing (same price for both currencies)
// NOTE: All add-ons are RECURRING to work with subscription system
// NEW PRICING: $34.95/seat (1 seat per add-on), no project add-ons
export const ADDON_CONFIG = {
  extra_seats: {
    name: 'Additional Seat',
    priceUSD: 34.95,
    priceCAD: 34.95,  // Same price, Stripe handles currency
    seats: 1,
    priceIdUSD: STRIPE_PRICE_IDS.addons.usd.extra_seats,
    priceIdCAD: STRIPE_PRICE_IDS.addons.cad.extra_seats,
    type: 'recurring' as const,
  },
  white_label: {
    name: 'White Label Branding',
    priceUSD: 49,
    priceCAD: 49,  // Same price, Stripe handles currency
    priceIdUSD: STRIPE_PRICE_IDS.addons.usd.white_label,
    priceIdCAD: STRIPE_PRICE_IDS.addons.cad.white_label,
    type: 'recurring' as const,
  },
} as const;

// Helper function to get price ID based on currency
export function getPriceId(
  tier: TierName, 
  currency: 'usd' | 'cad' = 'usd'
): string {
  return STRIPE_PRICE_IDS.tiers[currency][tier];
}

export function getAddonPriceId(
  addon: AddonName,
  currency: 'usd' | 'cad' = 'usd'
): string {
  return STRIPE_PRICE_IDS.addons[currency][addon];
}

// Type exports
export type TierName = keyof typeof TIER_CONFIG;
export type AddonName = keyof typeof ADDON_CONFIG;
export type Currency = 'usd' | 'cad';
