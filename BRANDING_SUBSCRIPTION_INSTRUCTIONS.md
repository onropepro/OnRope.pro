# White Label Branding Subscription Integration

## Overview
This document provides instructions for the marketplace agent to handle the white label branding subscription feature.

## Pricing
- **Monthly Subscription Cost:** $0.49/month
- **Product Name:** White Label Branding
- **Description:** Allows companies to customize the resident portal with their logo and brand colors

## API Endpoints

### 1. Purchase Initiation (Called by RAM Platform)
**Endpoint:** `POST /api/purchase/branding`

**Request Headers:**
```
Content-Type: application/json
x-api-key: <PURCHASE_API_KEY>
```

**Request Body:**
```json
{
  "email": "customer@example.com",
  "companyName": "Example Company",
  "returnUrl": "https://ram-platform.replit.app/profile"
}
```

**Response:**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

**What the Marketplace Agent Must Do:**
1. Receive the branding subscription purchase request
2. Create a Stripe Checkout Session for $0.49/month recurring subscription
3. Set up the subscription with the customer's email
4. Return the Stripe checkout URL
5. After successful payment, call the activation endpoint (below)

---

### 2. Activate Branding Subscription (Called by Marketplace After Payment)
**Endpoint:** `POST /api/purchase/activate-branding`

**Request Headers:**
```
Content-Type: application/json
x-api-key: <PURCHASE_API_KEY>
```

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "companyId": "uuid-here",
  "companyName": "Example Company",
  "email": "customer@example.com",
  "brandingActive": true,
  "message": "Branding subscription activated for Example Company"
}
```

**What Happens:**
- The RAM platform sets `brandingSubscriptionActive = true` for the company
- Branding features (logo upload, color customization) become available immediately
- Resident portal displays company's custom branding

---

## Important Notes

### API Key Authentication
- All requests must include the `x-api-key` header with value `PURCHASE_API_KEY`
- This is the same API key used for seat and project purchases
- The RAM platform validates this key before processing requests

### Flow Summary
1. **User clicks "Subscribe for $0.49/month" button** in Profile > Branding tab
2. **RAM platform calls** `POST /api/purchase/branding` → marketplace
3. **Marketplace creates** Stripe checkout session
4. **Marketplace returns** checkout URL to RAM platform
5. **RAM platform redirects** user to Stripe checkout
6. **User completes payment** on Stripe
7. **Stripe webhook fires** → marketplace receives payment confirmation
8. **Marketplace calls** `POST /api/purchase/activate-branding` → RAM platform
9. **RAM platform activates** branding subscription
10. **User is redirected** back to profile page with branding enabled

### Subscription Management
- Subscription is **monthly recurring** at $0.49/month
- User can cancel anytime via the marketplace cancellation flow
- When cancelled, `brandingSubscriptionActive` should be set to `false` via an API call
- Branding features become unavailable immediately upon cancellation
- Logo and colors are preserved in the database but not displayed to residents

### Testing
- Price: **$0.49/month**
- Test cards work in Stripe test mode
- Verify activation endpoint is called after successful payment
- Verify branding appears in resident portal immediately after activation

### Error Handling
- If email doesn't match an existing company account, return 404
- If API key is invalid, return 401
- If activation fails, retry mechanism should be in place
- Log all errors for debugging

## Questions?
Contact the development team if you need clarification on any endpoints or flows.
