# Seat Purchase API Integration Guide

This document describes the API endpoints for purchasing additional employee seats from your Stripe-integrated website.

## Overview

The Rope Access Pro platform now supports purchasing additional employee seats that extend beyond the base tier limits. These seats are purchased in increments of **2 seats** and are added to the customer's existing subscription.

## Authentication

All purchase API endpoints require an API key for authentication. Include the key in the request header:

```
x-api-key: YOUR_PURCHASE_API_KEY
```

Contact the platform administrator to obtain the `PURCHASE_API_KEY`.

## Seat Limits by Tier

| Tier | Base Seats | Notes |
|------|-----------|-------|
| 0 | 0 seats | No license/unverified |
| 1 | 2 seats | Starter tier |
| 2 | 10 seats | Professional tier |
| 3 | Unlimited | Enterprise tier (cannot purchase additional) |
| 4 | Unlimited | Test tier (cannot purchase additional) |

**Additional seats** can only be purchased for Tier 1 and Tier 2 customers. Each purchase adds **2 seats** to their total limit.

---

## API Endpoints

### 1. Verify Account

**Endpoint:** `POST /api/purchase/verify-account`

**Purpose:** Check if a customer account exists before processing a purchase. Prevents duplicate account creation and retrieves current seat information.

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "x-api-key": "YOUR_PURCHASE_API_KEY"
}
```

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

**Success Response (Account Exists):**
```json
{
  "exists": true,
  "companyId": "uuid-here",
  "companyName": "Example Rope Access Ltd",
  "email": "customer@example.com",
  "tier": 1,
  "currentSeats": 4,
  "baseSeatLimit": 2,
  "additionalSeats": 2,
  "licenseVerified": true
}
```

**Response (Account Not Found):**
```json
{
  "exists": false,
  "message": "No company account found with this email"
}
```

**Error Responses:**
- `400`: Missing email field
- `401`: Invalid or missing API key
- `500`: Server error

---

### 2. Update Seats

**Endpoint:** `POST /api/purchase/update-seats`

**Purpose:** Add purchased seats to an existing customer account. Call this endpoint **after** successful Stripe payment.

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "x-api-key": "YOUR_PURCHASE_API_KEY"
}
```

**Request Body:**
```json
{
  "email": "customer@example.com",
  "additionalSeats": 2
}
```

**Success Response:**
```json
{
  "success": true,
  "companyId": "uuid-here",
  "companyName": "Example Rope Access Ltd",
  "email": "customer@example.com",
  "tier": 1,
  "seatsAdded": 2,
  "newLimits": {
    "baseSeatLimit": 2,
    "additionalSeats": 4,
    "totalSeats": 6
  },
  "message": "Successfully added 2 seats to Example Rope Access Ltd"
}
```

**Error Responses:**
- `400`: Missing or invalid fields (email, additionalSeats)
- `401`: Invalid or missing API key
- `404`: No company account found with provided email
- `500`: Server error

---

## Recommended Purchase Flow

### Stripe Integration with Pro-Rated Billing

```javascript
// Example: Customer purchases 2 additional seats on your website

// STEP 1: Verify account exists
const verifyResponse = await fetch('https://rope-access-pro.replit.app/api/purchase/verify-account', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.PURCHASE_API_KEY
  },
  body: JSON.stringify({ email: customerEmail })
});

const accountData = await verifyResponse.json();

if (!accountData.exists) {
  // Account doesn't exist - redirect to main signup
  return redirectToSignup();
}

// STEP 2: Process Stripe payment with pro-rated billing
// Use Stripe's subscription items API to add seats to their existing subscription
const subscription = await stripe.subscriptions.retrieve(accountData.stripeSubscriptionId);

// Add subscription item for 2 seats (Stripe handles pro-rating automatically)
await stripe.subscriptionItems.create({
  subscription: subscription.id,
  price: 'price_for_2_seats', // Your Stripe price ID
  quantity: 1,
  proration_behavior: 'create_prorations' // Pro-rate for remaining billing period
});

// STEP 3: After successful Stripe payment, update seat count in Rope Access Pro
const updateResponse = await fetch('https://rope-access-pro.replit.app/api/purchase/update-seats', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.PURCHASE_API_KEY
  },
  body: JSON.stringify({
    email: customerEmail,
    additionalSeats: 2
  })
});

const updateResult = await updateResponse.json();

if (updateResult.success) {
  console.log(`Seats updated! New total: ${updateResult.newLimits.totalSeats}`);
}
```

---

## Stripe Best Practices

### Consolidated Billing
- **All subscription items share the same billing date** - When you add seats mid-cycle, Stripe automatically:
  - Pro-rates the charge for the remaining billing period
  - Adds the pro-rated amount to the next invoice
  - Keeps the original billing date unchanged

### Preventing Duplicate Subscriptions
- **Always call `/api/purchase/verify-account` first** to check if an account exists
- If `exists: true`, add seats to their existing subscription
- If `exists: false`, create a new account using the `/api/provision-account` endpoint

### Sample Stripe Setup
```javascript
// Product: "Additional Employee Seats (2-pack)"
// Price: Recurring, monthly
// Amount: $20/month (example)
// Billing: Pro-rated

const additionalSeatProduct = await stripe.products.create({
  name: 'Additional Employee Seats (2-pack)',
  description: 'Add 2 more employee seats to your Rope Access Pro subscription'
});

const additionalSeatPrice = await stripe.prices.create({
  product: additionalSeatProduct.id,
  currency: 'usd',
  unit_amount: 2000, // $20.00
  recurring: {
    interval: 'month'
  }
});
```

---

## Testing

Use a test account to verify the flow:

1. **Verify non-existent account:**
```bash
curl -X POST https://rope-access-pro.replit.app/api/purchase/verify-account \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"email": "nonexistent@example.com"}'
```

2. **Verify existing account:**
```bash
curl -X POST https://rope-access-pro.replit.app/api/purchase/verify-account \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"email": "existing@example.com"}'
```

3. **Add 2 seats to account:**
```bash
curl -X POST https://rope-access-pro.replit.app/api/purchase/update-seats \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "email": "existing@example.com",
    "additionalSeats": 2
  }'
```

---

## Security Considerations

1. **API Key Protection**
   - Store the `PURCHASE_API_KEY` securely in environment variables
   - Never expose the key in client-side code
   - Only call these endpoints from your server

2. **Webhook Verification**
   - Consider implementing Stripe webhooks to handle payment failures
   - Verify webhook signatures to prevent spoofing

3. **Error Handling**
   - Always handle API errors gracefully
   - Log failures for debugging
   - Show user-friendly error messages

---

## Support

For API access, technical questions, or issues:
- Contact: Platform Administrator
- API Key Request: Required for integration

---

## Changelog

**November 17, 2025**
- Initial release of Seat Purchase API
- Added `/api/purchase/verify-account` endpoint
- Added `/api/purchase/update-seats` endpoint
- Support for 2-seat purchase increments
