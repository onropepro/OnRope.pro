/**
 * Stripe Product and Price Configuration
 * Updated: 2025-12-30
 * 
 * PRICING MODEL:
 * - Base Plan: $99/month or $990/year (17% discount)
 * - Seats: $34.95/month or $349/year per seat
 * - Volume Seats (30+): $29.95/month or $299/year per seat
 * - White Label: $49/month or $490/year
 * 
 * Supports USD and CAD currencies
 * Environment: SANDBOX (recreate in Live before production launch)
 * 
 * DO NOT modify price IDs - they are tied to actual Stripe products
 */

// =============================================================================
// BILLING FREQUENCY TYPES
// =============================================================================

export type BillingFrequency = 'monthly' | 'annual';
export type Currency = 'usd' | 'cad';

// =============================================================================
// STRIPE PRICE IDS - SANDBOX ENVIRONMENT
// =============================================================================

export const STRIPE_PRICE_IDS = {
  // Base Plan Prices
  base: {
    monthly: {
      usd: 'price_1SchE1BzDsOltscr7YZLP8q6',   // $99/month
      cad: 'price_1SchE1BzDsOltscr8GLwkiaW',   // $99 CAD/month
    },
    annual: {
      usd: 'price_1SjsVoBzDsOltscrFPuQwdwn',   // $990/year (17% discount)
      cad: 'price_1SjsVCBzDsOltscrGRiHGOqb',   // $990 CAD/year
    },
  },

  // Standard Seat Prices ($34.95/month, $349/year)
  seats: {
    monthly: {
      usd: 'price_1SjsjeBzDsOltscrrefIWg0L',   // $34.95/month
      cad: 'price_1SjsjNBzDsOltscrc2VyMNDk',   // $34.95 CAD/month
    },
    annual: {
      usd: 'price_1SjsbmBzDsOltscrNHuuEyhS',   // $349/year
      cad: 'price_1SjsWdBzDsOltscrtl5ieKWu',   // $349 CAD/year
    },
  },

  // Volume Seat Prices - 30+ employees ($29.95/month, $299/year)
  volumeSeats: {
    monthly: {
      usd: 'price_1SjsdkBzDsOltscrd8W8RbC9',   // $29.95/month
      cad: 'price_1SjsZaBzDsOltscrLpjYd2sh',   // $29.95 CAD/month
    },
    annual: {
      usd: 'price_1SjsfVBzDsOltscrZQzKvVB9',   // $299/year
      cad: 'price_1Sjsf6BzDsOltscrdCGyJmdI',   // $299 CAD/year
    },
  },

  // White Label Branding Add-on
  whiteLabel: {
    monthly: {
      usd: 'price_1SjskEBzDsOltscrVBKx7yD3',   // $49/month
      cad: 'price_1Sjsk0BzDsOltscrLoc6OA9l',   // $49 CAD/month
    },
    annual: {
      usd: 'price_1SjscWBzDsOltscrpBHrAPXY',   // $490/year
      cad: 'price_1SjsXlBzDsOltscrv3o85Wpg',   // $490 CAD/year
    },
  },

  // LEGACY: Keep for backward compatibility with existing subscriptions
  // All legacy tier names map to the same base plan
  tiers: {
    usd: {
      onropepro: 'price_1SchE1BzDsOltscr7YZLP8q6',
      basic: 'price_1SchE1BzDsOltscr7YZLP8q6',
      starter: 'price_1SchE1BzDsOltscr7YZLP8q6',
      premium: 'price_1SchE1BzDsOltscr7YZLP8q6',
      enterprise: 'price_1SchE1BzDsOltscr7YZLP8q6',
    },
    cad: {
      onropepro: 'price_1SchE1BzDsOltscr8GLwkiaW',
      basic: 'price_1SchE1BzDsOltscr8GLwkiaW',
      starter: 'price_1SchE1BzDsOltscr8GLwkiaW',
      premium: 'price_1SchE1BzDsOltscr8GLwkiaW',
      enterprise: 'price_1SchE1BzDsOltscr8GLwkiaW',
    },
  },

  // LEGACY: Keep for backward compatibility
  addons: {
    usd: {
      extra_seats: 'price_1SchmLBzDsOltscrBFnvcvjF',
      white_label: 'price_1SWCTnBzDsOltscrD2qcZ47m',
    },
    cad: {
      extra_seats: 'price_1SchmLBzDsOltscr8RBwsJwM',
      white_label: 'price_1SZG7KBzDsOltscrs9vnr0v2',
    },
  },
} as const;

// =============================================================================
// PRICING CONFIGURATION
// =============================================================================

export const PLAN_DISPLAY_NAME = 'OnRopePro';

// Volume discount threshold
export const VOLUME_DISCOUNT_THRESHOLD = 30;

// Pricing amounts (same for USD and CAD)
export const PRICING = {
  base: {
    monthly: 99,
    annual: 990,       // 17% discount from $1,188
  },
  seat: {
    monthly: 34.95,
    annual: 349,       // 17% discount from $419.40
  },
  volumeSeat: {
    monthly: 29.95,    // For 30+ employees
    annual: 299,       // 17% discount from $359.40
  },
  whiteLabel: {
    monthly: 49,
    annual: 490,       // 17% discount from $588
  },
} as const;

// Annual discount percentage for display
export const ANNUAL_DISCOUNT_PERCENT = 17;

// Trial duration in days
export const TRIAL_PERIOD_DAYS = 30;

// =============================================================================
// LEGACY TIER CONFIG (for backward compatibility)
// =============================================================================

const BASE_TIER_CONFIG = {
  name: PLAN_DISPLAY_NAME,
  priceUSD: 99,
  priceCAD: 99,
  maxProjects: -1,
  maxSeats: 0,
  priceIdUSD: STRIPE_PRICE_IDS.tiers.usd.basic,
  priceIdCAD: STRIPE_PRICE_IDS.tiers.cad.basic,
};

export const TIER_CONFIG = {
  onropepro: { ...BASE_TIER_CONFIG },
  basic: { ...BASE_TIER_CONFIG },
  starter: { ...BASE_TIER_CONFIG },
  premium: { ...BASE_TIER_CONFIG },
  enterprise: { ...BASE_TIER_CONFIG },
} as const;

// =============================================================================
// LEGACY ADDON CONFIG (for backward compatibility)
// =============================================================================

export const ADDON_CONFIG = {
  extra_seats: {
    name: 'Additional Seat',
    priceUSD: 34.95,
    priceCAD: 34.95,
    seats: 1,
    priceIdUSD: STRIPE_PRICE_IDS.addons.usd.extra_seats,
    priceIdCAD: STRIPE_PRICE_IDS.addons.cad.extra_seats,
    type: 'recurring' as const,
  },
  white_label: {
    name: 'White Label Branding',
    priceUSD: 49,
    priceCAD: 49,
    priceIdUSD: STRIPE_PRICE_IDS.addons.usd.white_label,
    priceIdCAD: STRIPE_PRICE_IDS.addons.cad.white_label,
    type: 'recurring' as const,
  },
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get base plan price ID for given frequency and currency
 */
export function getBasePriceId(
  frequency: BillingFrequency = 'monthly',
  currency: Currency = 'usd'
): string {
  return STRIPE_PRICE_IDS.base[frequency][currency];
}

/**
 * Get seat price ID based on employee count, frequency, and currency
 * Applies volume discount for 30+ employees
 */
export function getSeatPriceId(
  employeeCount: number,
  frequency: BillingFrequency = 'monthly',
  currency: Currency = 'usd'
): string {
  const isVolume = employeeCount >= VOLUME_DISCOUNT_THRESHOLD;
  const priceGroup = isVolume ? STRIPE_PRICE_IDS.volumeSeats : STRIPE_PRICE_IDS.seats;
  return priceGroup[frequency][currency];
}

/**
 * Get seat price amount based on employee count and frequency
 */
export function getSeatPrice(
  employeeCount: number,
  frequency: BillingFrequency = 'monthly'
): number {
  const isVolume = employeeCount >= VOLUME_DISCOUNT_THRESHOLD;
  const pricing = isVolume ? PRICING.volumeSeat : PRICING.seat;
  return pricing[frequency];
}

/**
 * Get white label price ID for given frequency and currency
 */
export function getWhiteLabelPriceId(
  frequency: BillingFrequency = 'monthly',
  currency: Currency = 'usd'
): string {
  return STRIPE_PRICE_IDS.whiteLabel[frequency][currency];
}

/**
 * Detect currency from billing country
 * Canada = CAD, everything else = USD
 */
export function detectCurrencyFromCountry(countryCode: string): Currency {
  return countryCode.toUpperCase() === 'CA' ? 'cad' : 'usd';
}

/**
 * Calculate annual savings compared to monthly
 */
export function calculateAnnualSavings(monthlyPrice: number): number {
  const yearlyIfMonthly = monthlyPrice * 12;
  const annualPrice = Math.round(yearlyIfMonthly * (1 - ANNUAL_DISCOUNT_PERCENT / 100));
  return yearlyIfMonthly - annualPrice;
}

/**
 * Format price for display with currency symbol
 */
export function formatPrice(amount: number, currency: Currency = 'usd'): string {
  const symbol = currency === 'cad' ? 'CA$' : '$';
  return `${symbol}${amount.toFixed(2).replace(/\.00$/, '')}`;
}

/**
 * Get display string for billing frequency
 */
export function getBillingFrequencyLabel(frequency: BillingFrequency): string {
  return frequency === 'annual' ? '/year' : '/month';
}

// Normalize any tier name to display name (for backward compatibility)
export function getTierDisplayName(tier: string | null | undefined): string {
  return PLAN_DISPLAY_NAME;
}

// LEGACY: Get price ID based on currency (for backward compatibility)
export function getPriceId(
  tier: TierName,
  currency: Currency = 'usd'
): string {
  return STRIPE_PRICE_IDS.tiers[currency][tier];
}

// LEGACY: Get addon price ID (for backward compatibility)
export function getAddonPriceId(
  addon: AddonName,
  currency: Currency = 'usd'
): string {
  return STRIPE_PRICE_IDS.addons[currency][addon];
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type TierName = keyof typeof TIER_CONFIG;
export type AddonName = keyof typeof ADDON_CONFIG;
