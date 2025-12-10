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
  // Updated: 2025-12-10 - New pricing model with single tier
  tiers: {
    usd: {
      basic: 'price_1SchE1BzDsOltscr7YZLP8q6',       // $99/mo - OnRopePro, unlimited projects
      starter: 'price_1SchE1BzDsOltscr7YZLP8q6',     // $99/mo - same as basic (legacy compatibility)
      premium: 'price_1SchE1BzDsOltscr7YZLP8q6',     // $99/mo - same as basic (legacy compatibility)
      enterprise: 'price_1SchE1BzDsOltscr7YZLP8q6',  // $99/mo - same as basic (legacy compatibility)
    },
    cad: {
      basic: 'price_1SchE1BzDsOltscr8GLwkiaW',       // $99 CAD/mo - OnRopePro, unlimited projects
      starter: 'price_1SchE1BzDsOltscr8GLwkiaW',     // $99 CAD/mo - same as basic (legacy compatibility)
      premium: 'price_1SchE1BzDsOltscr8GLwkiaW',     // $99 CAD/mo - same as basic (legacy compatibility)
      enterprise: 'price_1SchE1BzDsOltscr8GLwkiaW',  // $99 CAD/mo - same as basic (legacy compatibility)
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

// Tier configuration with limits and pricing (same price for both currencies)
// NEW PRICING MODEL: $99/month base + $34.95/seat, unlimited projects
export const TIER_CONFIG = {
  basic: {
    name: 'OnRopePro',
    priceUSD: 99,
    priceCAD: 99,  // Same price, Stripe handles currency
    maxProjects: -1, // unlimited
    maxSeats: 0,     // no included seats, add at $34.95/seat
    priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.basic,
    priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.basic,
  },
  starter: {
    name: 'OnRopePro',
    priceUSD: 99,
    priceCAD: 99,  // Same price, Stripe handles currency
    maxProjects: -1, // unlimited
    maxSeats: 0,     // no included seats
    priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.starter,
    priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.starter,
  },
  premium: {
    name: 'OnRopePro',
    priceUSD: 99,
    priceCAD: 99,  // Same price, Stripe handles currency
    maxProjects: -1, // unlimited
    maxSeats: 0,     // no included seats
    priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.premium,
    priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.premium,
  },
  enterprise: {
    name: 'OnRopePro',
    priceUSD: 99,
    priceCAD: 99,  // Same price, Stripe handles currency
    maxProjects: -1, // unlimited
    maxSeats: 0,     // no included seats
    priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.enterprise,
    priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.enterprise,
  },
} as const;

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
