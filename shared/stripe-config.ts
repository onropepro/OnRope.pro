/**
 * Stripe Product and Price Configuration
 * Generated: 2025-11-22
 * 
 * These price IDs correspond to products created in Stripe Dashboard
 * Supports both USD and CAD currencies
 * DO NOT modify these IDs - they are tied to actual Stripe products
 */

export const STRIPE_PRICE_IDS = {
  // Subscription Tiers (Recurring Monthly) - Same price, different currency
  tiers: {
    usd: {
      basic: 'price_1SW7VXBzDsOltscr9WZ6NPBV',       // $79/mo - 2 projects, 4 seats
      starter: 'price_1SW7VXBzDsOltscrEUVBsWxP',     // $299/mo - 5 projects, 10 seats
      premium: 'price_1SW7VYBzDsOltscrtnes8hXS',     // $499/mo - 9 projects, 18 seats
      enterprise: 'price_1SW7VYBzDsOltscrIAUE5EyJ',  // $899/mo - Unlimited
    },
    cad: {
      basic: 'price_1SW7VXBzDsOltscrExhtYscJ',       // $79 CAD/mo - 2 projects, 4 seats
      starter: 'price_1SW7VXBzDsOltscr1kSadPRG',     // $299 CAD/mo - 5 projects, 10 seats
      premium: 'price_1SW7VYBzDsOltscrnMVcmbVN',     // $499 CAD/mo - 9 projects, 18 seats
      enterprise: 'price_1SW7VYBzDsOltscrzfWODg4L',  // $899 CAD/mo - Unlimited
    },
  },
  
  // Add-ons - Same price, different currency
  // All add-ons are RECURRING to work with subscription system
  addons: {
    usd: {
      extra_seats: 'price_1SWDH4BzDsOltscrMxt5u3ij',     // $19/mo recurring - 2 seats ✓
      extra_project: 'price_1SWDH5BzDsOltscrmWT8Bfuw',   // $49/mo recurring - 1 project ✓
      white_label: 'price_1SWCTnBzDsOltscrD2qcZ47m',     // $49/mo recurring ✓
    },
    cad: {
      extra_seats: 'price_1SWDH5BzDsOltscrT9ip4d8u',     // $19 CAD/mo recurring - 2 seats ✓
      extra_project: 'price_1SWDH5BzDsOltscrEyPZV89W',   // $49 CAD/mo recurring - 1 project ✓
      white_label: 'price_1SWCToBzDsOltscrRljmQTLz',     // $49 CAD/mo recurring ✓
    },
  },
} as const;

// Tier configuration with limits and pricing (same price for both currencies)
export const TIER_CONFIG = {
  basic: {
    name: 'Basic',
    priceUSD: 79,
    priceCAD: 79,  // Same price, Stripe handles currency
    maxProjects: 2,
    maxSeats: 4,
    priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.basic,
    priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.basic,
  },
  starter: {
    name: 'Starter',
    priceUSD: 299,
    priceCAD: 299,  // Same price, Stripe handles currency
    maxProjects: 5,
    maxSeats: 10,
    priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.starter,
    priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.starter,
  },
  premium: {
    name: 'Premium',
    priceUSD: 499,
    priceCAD: 499,  // Same price, Stripe handles currency
    maxProjects: 9,
    maxSeats: 18,
    priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.premium,
    priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.premium,
  },
  enterprise: {
    name: 'Enterprise',
    priceUSD: 899,
    priceCAD: 899,  // Same price, Stripe handles currency
    maxProjects: -1, // unlimited
    maxSeats: -1,    // unlimited
    priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.enterprise,
    priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.enterprise,
  },
} as const;

// Add-on configuration with pricing (same price for both currencies)
// NOTE: All add-ons are RECURRING to work with subscription system
export const ADDON_CONFIG = {
  extra_seats: {
    name: 'Extra Seats (2)',
    priceUSD: 19,
    priceCAD: 19,  // Same price, Stripe handles currency
    seats: 2,
    priceIdUSD: STRIPE_PRICE_IDS.addons.usd.extra_seats,
    priceIdCAD: STRIPE_PRICE_IDS.addons.cad.extra_seats,
    type: 'recurring' as const,  // Changed from one_time - requires new Stripe price
  },
  extra_project: {
    name: 'Extra Project',
    priceUSD: 49,
    priceCAD: 49,  // Same price, Stripe handles currency
    projects: 1,
    priceIdUSD: STRIPE_PRICE_IDS.addons.usd.extra_project,
    priceIdCAD: STRIPE_PRICE_IDS.addons.cad.extra_project,
    type: 'recurring' as const,  // Changed from one_time - requires new Stripe price
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
