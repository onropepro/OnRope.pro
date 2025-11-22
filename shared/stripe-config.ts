/**
 * Stripe Product and Price Configuration
 * Generated: 2025-11-22
 * 
 * These price IDs correspond to products created in Stripe Dashboard
 * Supports both USD and CAD currencies
 * DO NOT modify these IDs - they are tied to actual Stripe products
 */

export const STRIPE_PRICE_IDS = {
  // Subscription Tiers (Recurring Monthly) - USD
  tiers: {
    usd: {
      basic: 'price_1SW7VXBzDsOltscr9WZ6NPBV',       // $79/mo - 2 projects, 4 seats
      starter: 'price_1SW7VXBzDsOltscrEUVBsWxP',     // $299/mo - 5 projects, 10 seats
      premium: 'price_1SW7VYBzDsOltscrtnes8hXS',     // $499/mo - 9 projects, 18 seats
      enterprise: 'price_1SW7VYBzDsOltscrIAUE5EyJ',  // $899/mo - Unlimited
    },
    cad: {
      basic: 'price_1SW7VXBzDsOltscrExhtYscJ',       // $107 CAD/mo - 2 projects, 4 seats
      starter: 'price_1SW7VXBzDsOltscr1kSadPRG',     // $404 CAD/mo - 5 projects, 10 seats
      premium: 'price_1SW7VYBzDsOltscrnMVcmbVN',     // $674 CAD/mo - 9 projects, 18 seats
      enterprise: 'price_1SW7VYBzDsOltscrzfWODg4L',  // $1214 CAD/mo - Unlimited
    },
  },
  
  // Add-ons - USD & CAD
  addons: {
    usd: {
      extra_seats: 'price_1SW7VZBzDsOltscrbwWEthqa',     // $19 one-time - 2 seats
      extra_project: 'price_1SW7VZBzDsOltscr2GWJYRai',   // $49 one-time - 1 project
      white_label: 'price_1SW7VaBzDsOltscr5DD1ciiO',     // $0.49/mo recurring
    },
    cad: {
      extra_seats: 'price_1SW7VZBzDsOltscrv1ZoRlfG',     // $26 CAD one-time - 2 seats
      extra_project: 'price_1SW7VaBzDsOltscrpZt2U150',   // $67 CAD one-time - 1 project
      white_label: 'price_1SW7VaBzDsOltscrkWa2c0FQ',     // $0.67 CAD/mo recurring
    },
  },
} as const;

// Tier configuration with limits and pricing in both currencies
export const TIER_CONFIG = {
  basic: {
    name: 'Basic',
    priceUSD: 79,
    priceCAD: 107,
    maxProjects: 2,
    maxSeats: 4,
    priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.basic,
    priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.basic,
  },
  starter: {
    name: 'Starter',
    priceUSD: 299,
    priceCAD: 404,
    maxProjects: 5,
    maxSeats: 10,
    priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.starter,
    priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.starter,
  },
  premium: {
    name: 'Premium',
    priceUSD: 499,
    priceCAD: 674,
    maxProjects: 9,
    maxSeats: 18,
    priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.premium,
    priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.premium,
  },
  enterprise: {
    name: 'Enterprise',
    priceUSD: 899,
    priceCAD: 1214,
    maxProjects: -1, // unlimited
    maxSeats: -1,    // unlimited
    priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.enterprise,
    priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.enterprise,
  },
} as const;

// Add-on configuration with pricing in both currencies
export const ADDON_CONFIG = {
  extra_seats: {
    name: 'Extra Seats (2)',
    priceUSD: 19,
    priceCAD: 26,
    seats: 2,
    priceIdUSD: STRIPE_PRICE_IDS.addons.usd.extra_seats,
    priceIdCAD: STRIPE_PRICE_IDS.addons.cad.extra_seats,
    type: 'one_time' as const,
  },
  extra_project: {
    name: 'Extra Project',
    priceUSD: 49,
    priceCAD: 67,
    projects: 1,
    priceIdUSD: STRIPE_PRICE_IDS.addons.usd.extra_project,
    priceIdCAD: STRIPE_PRICE_IDS.addons.cad.extra_project,
    type: 'one_time' as const,
  },
  white_label: {
    name: 'White Label Branding',
    priceUSD: 0.49,
    priceCAD: 0.67,
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
