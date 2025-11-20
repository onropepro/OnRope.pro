# Marketplace Integration Guide - White Label Branding

This document provides complete integration specifications for the marketplace platform to enable white label branding subscription purchases for Rope Access Management Platform.

## Overview

The Rope Access Management Platform integrates with the marketplace for $0.49/month white label branding subscriptions. The marketplace handles:
- Payment processing (Stripe)
- Subscription billing
- Renewal management
- Cancellation handling

The platform handles:
- Branding activation/deactivation
- Logo and color customization
- Feature access control

## Integration Flow

```
User clicks "Subscribe" → Platform calls Marketplace Purchase API → 
Marketplace processes payment → Marketplace calls Platform Activation Webhook →
Platform activates branding → User gets access to branding controls
```

## 1. Purchase API Endpoint (Marketplace Receives)

**What the platform will call when a user wants to purchase branding:**

### Endpoint
```
POST https://marketplace.replit.app/api/purchase/branding
```

### Authentication
```
Headers:
  Content-Type: application/json
  x-api-key: <PURCHASE_API_KEY>
```

### Request Body
```json
{
  "email": "company@example.com",
  "licenseKey": "UNIQUE-LICENSE-KEY-123"
}
```

### Expected Response (Success)
```json
{
  "success": true,
  "message": "Branding subscription activated successfully"
}
```

### Expected Response (Error)
```json
{
  "error": "Payment processing failed"
}
```

**Status Codes:**
- `200` - Success (branding activated immediately)
- `400` - Invalid request (missing fields)
- `402` - Payment required (card declined, etc.)
- `500` - Internal error

### Implementation Notes
After successful payment processing, the marketplace MUST immediately call the platform's activation webhook (see below) to activate the branding subscription.

---

## 2. Activation/Deactivation Webhook (Marketplace Calls)

**What the marketplace must call after purchase OR cancellation:**

### Endpoint
```
POST https://<platform-domain>/api/purchase/activate-branding
```

### Authentication
```
Headers:
  Content-Type: application/json
  x-api-key: <PURCHASE_API_KEY>
```

⚠️ **IMPORTANT:** Use the same `PURCHASE_API_KEY` that was used to authenticate the purchase request.

### Request Body (Activation)
```json
{
  "email": "company@example.com",
  "licenseKey": "UNIQUE-LICENSE-KEY-123",
  "brandingActive": true
}
```

### Request Body (Deactivation)
```json
{
  "email": "company@example.com",
  "licenseKey": "UNIQUE-LICENSE-KEY-123",
  "brandingActive": false
}
```

### Expected Response (Success)
```json
{
  "success": true,
  "message": "Branding updated successfully",
  "email": "company@example.com",
  "brandingActive": true
}
```

### Error Responses

**401 Unauthorized** - Invalid or missing API key
```json
{
  "message": "Unauthorized"
}
```

**400 Bad Request** - Missing required fields
```json
{
  "message": "Email, license key, and brandingActive are required"
}
```

**400 Bad Request** - Email doesn't match license key
```json
{
  "message": "Email does not match license key"
}
```

**404 Not Found** - Invalid license key or not a company account
```json
{
  "message": "No company account found with this license key"
}
```

---

## 3. Complete Integration Workflow

### Purchase Flow
1. **User initiates purchase** on platform
2. **Platform calls marketplace purchase API:**
   ```
   POST https://marketplace.replit.app/api/purchase/branding
   {
     "email": "company@example.com",
     "licenseKey": "UNIQUE-LICENSE-KEY-123"
   }
   ```
3. **Marketplace processes payment** via Stripe
4. **Marketplace calls platform activation webhook:**
   ```
   POST https://<platform-domain>/api/purchase/activate-branding
   {
     "email": "company@example.com",
     "licenseKey": "UNIQUE-LICENSE-KEY-123",
     "brandingActive": true
   }
   ```
5. **Platform activates branding** and returns success
6. **User gets access** to branding customization controls

### Cancellation Flow
1. **User cancels subscription** on marketplace
2. **Marketplace calls platform activation webhook:**
   ```
   POST https://<platform-domain>/api/purchase/activate-branding
   {
     "email": "company@example.com",
     "licenseKey": "UNIQUE-LICENSE-KEY-123",
     "brandingActive": false
   }
   ```
3. **Platform deactivates branding** and hides customization controls
4. **User loses access** to branding features

### Renewal Flow
- If renewal succeeds: No action needed (branding stays active)
- If renewal fails: Call activation webhook with `brandingActive: false`

---

## 4. Testing Guide

### Test Case 1: Successful Activation
```bash
curl -X POST https://<platform-domain>/api/purchase/activate-branding \
  -H "Content-Type: application/json" \
  -H "x-api-key: <PURCHASE_API_KEY>" \
  -d '{
    "email": "test@test.com",
    "licenseKey": "UNIQUE-TEST-BRANDING-KEY",
    "brandingActive": true
  }'

# Expected: 200 OK with {"success":true,"message":"Branding updated successfully",...}
```

### Test Case 2: Successful Deactivation
```bash
curl -X POST https://<platform-domain>/api/purchase/activate-branding \
  -H "Content-Type: application/json" \
  -H "x-api-key: <PURCHASE_API_KEY>" \
  -d '{
    "email": "test@test.com",
    "licenseKey": "UNIQUE-TEST-BRANDING-KEY",
    "brandingActive": false
  }'

# Expected: 200 OK with {"success":true,"message":"Branding updated successfully","brandingActive":false}
```

### Test Case 3: Invalid API Key
```bash
curl -X POST https://<platform-domain>/api/purchase/activate-branding \
  -H "Content-Type: application/json" \
  -H "x-api-key: INVALID" \
  -d '{
    "email": "test@test.com",
    "licenseKey": "UNIQUE-TEST-BRANDING-KEY",
    "brandingActive": true
  }'

# Expected: 401 Unauthorized
```

### Test Case 4: Missing Field
```bash
curl -X POST https://<platform-domain>/api/purchase/activate-branding \
  -H "Content-Type: application/json" \
  -H "x-api-key: <PURCHASE_API_KEY>" \
  -d '{
    "email": "test@test.com",
    "brandingActive": true
  }'

# Expected: 400 Bad Request - "Email, license key, and brandingActive are required"
```

### Test Case 5: Email Mismatch
```bash
curl -X POST https://<platform-domain>/api/purchase/activate-branding \
  -H "Content-Type: application/json" \
  -H "x-api-key: <PURCHASE_API_KEY>" \
  -d '{
    "email": "wrong@email.com",
    "licenseKey": "UNIQUE-TEST-BRANDING-KEY",
    "brandingActive": true
  }'

# Expected: 400 Bad Request - "Email does not match license key"
```

### Test Case 6: Invalid License Key
```bash
curl -X POST https://<platform-domain>/api/purchase/activate-branding \
  -H "Content-Type: application/json" \
  -H "x-api-key: <PURCHASE_API_KEY>" \
  -d '{
    "email": "test@test.com",
    "licenseKey": "INVALID-KEY",
    "brandingActive": true
  }'

# Expected: 404 Not Found - "No company account found with this license key"
```

---

## 5. Security Requirements

### API Key Management
- The `PURCHASE_API_KEY` is a shared secret between marketplace and platform
- Store securely in environment variables
- Rotate periodically
- Never expose in client-side code or logs

### Request Validation
- Platform validates ALL fields are present
- Platform validates email matches license key owner
- Platform validates license key exists and belongs to company account
- Platform rejects requests with invalid API key

### Idempotency
- Webhook calls are idempotent
- Calling activation with `brandingActive: true` when already active is safe
- Calling deactivation with `brandingActive: false` when already inactive is safe
- Always returns 200 OK for valid requests regardless of state change

---

## 6. Error Handling

### Retry Logic (Marketplace Side)
If webhook call fails:
- Retry with exponential backoff: 1s, 2s, 4s, 8s, 16s
- Maximum 5 retry attempts
- Log all failures for manual review
- Alert on critical failures (authentication errors)

### Timeout
- Set webhook request timeout to 30 seconds
- Platform typically responds within 500ms

### Monitoring
Monitor these metrics:
- Webhook success rate (should be >99%)
- Response time (should be <1s)
- 401 errors (indicates API key mismatch)
- 404 errors (indicates data sync issue)

---

## 7. Data Synchronization

### Required Data
Marketplace needs to track:
- `email`: Company email address
- `licenseKey`: Unique license key for company
- `brandingActive`: Current subscription status (boolean)
- `subscriptionId`: Stripe subscription ID
- `nextBillingDate`: When next charge occurs

### State Transitions
```
NOT_SUBSCRIBED → [Purchase] → ACTIVE
ACTIVE → [Cancel] → INACTIVE
ACTIVE → [Payment Failed] → INACTIVE
INACTIVE → [Re-subscribe] → ACTIVE
```

Always call the activation webhook when state changes from:
- NOT_SUBSCRIBED → ACTIVE: `brandingActive: true`
- ACTIVE → INACTIVE: `brandingActive: false`
- INACTIVE → ACTIVE: `brandingActive: true`

---

## 8. Production Checklist

Before going live, verify:

- [ ] `PURCHASE_API_KEY` is configured on both sides
- [ ] Webhook endpoint URL is correct for production
- [ ] All 6 test cases pass successfully
- [ ] Retry logic is implemented
- [ ] Monitoring/alerting is configured
- [ ] Error logging captures all failures
- [ ] Webhook timeouts are set appropriately
- [ ] Payment processing handles edge cases
- [ ] Subscription renewal triggers correct webhook calls
- [ ] Cancellation flow deactivates branding immediately

---

## 9. Support & Troubleshooting

### Common Issues

**"Unauthorized" errors:**
- Verify `PURCHASE_API_KEY` matches on both sides
- Check `x-api-key` header is being sent
- Ensure API key doesn't have trailing spaces

**"Email does not match license key":**
- Verify the email in your database matches what the license key resolves to
- Check for case sensitivity issues
- Confirm license key hasn't been reassigned

**"No company account found":**
- Verify license key exists in platform database
- Confirm user role is "company" (not employee/resident)
- Check for typos in license key

### Contact
For integration support, contact the platform development team with:
- Request/response logs
- Timestamp of failure
- Email and license key involved
- Error message received

---

## 10. Example Marketplace Implementation (Node.js)

```javascript
const PLATFORM_API_KEY = process.env.PURCHASE_API_KEY;
const PLATFORM_WEBHOOK_URL = process.env.PLATFORM_WEBHOOK_URL;

/**
 * Call platform webhook to activate/deactivate branding
 */
async function updatePlatformBranding(email, licenseKey, brandingActive) {
  const maxRetries = 5;
  const baseDelay = 1000; // 1 second
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(`${PLATFORM_WEBHOOK_URL}/api/purchase/activate-branding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': PLATFORM_API_KEY,
        },
        body: JSON.stringify({
          email,
          licenseKey,
          brandingActive,
        }),
        timeout: 30000, // 30 second timeout
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Platform webhook failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      
      const result = await response.json();
      console.log(`✓ Branding ${brandingActive ? 'activated' : 'deactivated'} for ${email}`);
      return result;
      
    } catch (error) {
      console.error(`Attempt ${attempt + 1}/${maxRetries} failed:`, error.message);
      
      // Don't retry on authentication errors
      if (error.message.includes('401')) {
        throw new Error('Invalid API key - check PURCHASE_API_KEY configuration');
      }
      
      // Exponential backoff
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw new Error(`Failed to update platform branding after ${maxRetries} attempts`);
      }
    }
  }
}

/**
 * Handle successful payment
 */
async function onBrandingPurchaseSuccess(email, licenseKey, stripeSubscriptionId) {
  try {
    // Activate branding on platform
    await updatePlatformBranding(email, licenseKey, true);
    
    // Update your database
    await db.subscriptions.create({
      email,
      licenseKey,
      type: 'branding',
      stripeSubscriptionId,
      status: 'active',
      price: 0.49,
    });
    
  } catch (error) {
    console.error('Failed to activate branding:', error);
    // Alert your team for manual intervention
    await alertTeam('Branding activation failed', { email, licenseKey, error: error.message });
  }
}

/**
 * Handle subscription cancellation
 */
async function onBrandingCancellation(email, licenseKey) {
  try {
    // Deactivate branding on platform
    await updatePlatformBranding(email, licenseKey, false);
    
    // Update your database
    await db.subscriptions.update({
      where: { email, licenseKey, type: 'branding' },
      data: { status: 'cancelled' },
    });
    
  } catch (error) {
    console.error('Failed to deactivate branding:', error);
    await alertTeam('Branding deactivation failed', { email, licenseKey, error: error.message });
  }
}

/**
 * Handle payment failure (renewal failed)
 */
async function onPaymentFailed(email, licenseKey) {
  try {
    // Deactivate branding on platform
    await updatePlatformBranding(email, licenseKey, false);
    
    // Update your database
    await db.subscriptions.update({
      where: { email, licenseKey, type: 'branding' },
      data: { status: 'payment_failed' },
    });
    
  } catch (error) {
    console.error('Failed to deactivate branding after payment failure:', error);
    await alertTeam('Branding deactivation failed', { email, licenseKey, error: error.message });
  }
}
```

---

## Summary

**Marketplace responsibilities:**
1. Process $0.49/month payments via Stripe
2. Call platform activation webhook with `brandingActive: true` after successful purchase
3. Call platform activation webhook with `brandingActive: false` after cancellation or payment failure
4. Implement retry logic for webhook calls
5. Monitor webhook success rate

**Platform responsibilities:**
1. Provide purchase initiation endpoint
2. Validate webhook authentication
3. Update branding subscription status in database
4. Show/hide branding controls based on subscription status
5. Apply branding customizations when active

**Critical success factors:**
- Webhook must be called IMMEDIATELY after payment success
- Webhook must use correct API key
- Email and license key must match exactly
- Deactivation must happen immediately on cancellation

This integration enables seamless white label branding subscription management with instant activation and deactivation.
