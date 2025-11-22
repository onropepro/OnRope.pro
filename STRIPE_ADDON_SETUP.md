# Stripe Add-on Price Setup Guide

## Issue
The current Extra Seats and Extra Projects add-ons are configured as **one-time purchases** in Stripe, but they need to be **recurring monthly subscriptions** to work with your subscription system.

## Solution Steps

### 1. Create Recurring Prices in Stripe Dashboard

#### For Extra Team Seats (USD)
1. Log into [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Find or create the product "Extra Team Seats" (or similar)
3. Click **"Add another price"**
4. Configure the new price:
   - **Price**: `$19.00`
   - **Billing period**: `Monthly`
   - **Currency**: `USD`
   - **Price description**: "Extra Team Seats - 2 seats per pack, $19/month"
5. Click **"Add price"**
6. **Copy the price ID** - it will look like `price_xxxxxxxxxxxxx`

#### For Extra Team Seats (CAD)
1. Find the same product "Extra Team Seats"
2. Click **"Add another price"**
3. Configure:
   - **Price**: `$19.00`
   - **Billing period**: `Monthly`
   - **Currency**: `CAD`
   - **Price description**: "Extra Team Seats - 2 seats per pack, $19 CAD/month"
4. Click **"Add price"**
5. **Copy the price ID**

#### For Extra Project (USD)
1. Find or create the product "Extra Project" (or similar)
2. Click **"Add another price"**
3. Configure:
   - **Price**: `$49.00`
   - **Billing period**: `Monthly`
   - **Currency**: `USD`
   - **Price description**: "Extra Project - 1 additional active project, $49/month"
4. Click **"Add price"**
5. **Copy the price ID**

#### For Extra Project (CAD)
1. Find the same product "Extra Project"
2. Click **"Add another price"**
3. Configure:
   - **Price**: `$49.00`
   - **Billing period**: `Monthly`
   - **Currency**: `CAD`
   - **Price description**: "Extra Project - 1 additional active project, $49 CAD/month"
4. Click **"Add price"**
5. **Copy the price ID**

### 2. Update Price IDs in Code

Once you have all 4 new price IDs, update `shared/stripe-config.ts`:

```typescript
addons: {
  usd: {
    extra_seats: 'price_XXXXXXXXXXXXXXXX',     // Replace with new USD recurring price ID
    extra_project: 'price_XXXXXXXXXXXXXXXX',   // Replace with new USD recurring price ID
    white_label: 'price_1SWCTnBzDsOltscrD2qcZ47m',     // Keep as-is ✓
  },
  cad: {
    extra_seats: 'price_XXXXXXXXXXXXXXXX',     // Replace with new CAD recurring price ID
    extra_project: 'price_XXXXXXXXXXXXXXXX',   // Replace with new CAD recurring price ID
    white_label: 'price_1SWCToBzDsOltscrRljmQTLz',     // Keep as-is ✓
  },
},
```

### 3. Test the Add-ons

After updating the price IDs:

1. Restart your application
2. Navigate to **Manage Subscription** page
3. Try purchasing:
   - Extra Team Seats ($19/month per pack)
   - Extra Project ($49/month per project)
4. Verify in Stripe Dashboard that the add-on was added to the subscription
5. Verify the webhook updates your database correctly

## Expected Behavior

✅ **Before**: Clicking "Add Seats" or "Add Project" showed error:
```
500: {"message":"The price specified is set to `type=one_time` but this field only accepts prices with `type=recurring`."}
```

✅ **After**: Add-ons are successfully added to subscription as recurring charges, and limits are immediately updated.

## Current Prices (for reference)

| Add-on | Price USD | Price CAD | Type | Notes |
|--------|-----------|-----------|------|-------|
| White Label Branding | $49/month | $49 CAD/month | Recurring | ✅ Already working |
| Extra Team Seats | $19/month | $19 CAD/month | Recurring | ⚠️ Needs new price |
| Extra Project | $49/month | $49 CAD/month | Recurring | ⚠️ Needs new price |

## Old Price IDs (for archival purposes)

These one-time price IDs are deprecated:
- USD Extra Seats: `price_1SW7VZBzDsOltscrbwWEthqa`
- CAD Extra Seats: `price_1SW7VZBzDsOltscrv1ZoRlfG`
- USD Extra Project: `price_1SW7VZBzDsOltscr2GWJYRai`
- CAD Extra Project: `price_1SW7VaBzDsOltscrpZt2U150`

You can archive these in Stripe once the new recurring prices are set up.

---

**Need Help?** If you encounter issues, check:
1. The price ID is correct (starts with `price_`)
2. The price type is "Recurring" with "Monthly" billing
3. The currency matches (USD vs CAD)
4. The workflow has been restarted after updating the config
