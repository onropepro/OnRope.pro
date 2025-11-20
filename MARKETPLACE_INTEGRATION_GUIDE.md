# Marketplace Integration Guide

This guide explains how the RAM platform integrates with the external marketplace for **all purchase types**: tier upgrades, seat purchases, project purchases, and branding subscriptions.

## ⚠️ CRITICAL: Tier Upgrade Lockout Issue - FIXED

**THE PROBLEM (BEFORE FIX):**
When users upgraded tiers, marketplace generated a new license key (e.g., ABC123-1 → ABC123-2) but there was NO webhook to save it to the platform database. Users got LOCKED OUT because their old license key no longer worked.

**THE SOLUTION (NOW IMPLEMENTED):**
New `/api/purchase/update-tier` webhook endpoint! Marketplace MUST call this immediately after tier upgrade payments to prevent lockout.

---

## Overview

The RAM platform exposes four webhook endpoints that the marketplace **MUST** call after successful payments:

| Purchase Type | Webhook Endpoint | Critical? |
|--------------|-----------------|-----------|
| **Tier Upgrade** | `/api/purchase/update-tier` | ⚠️ **YES** - Prevents lockout! |
| **Additional Seats** | `/api/purchase/update-seats` | Yes |
| **Additional Projects** | `/api/purchase/update-projects` | Yes |
| **Branding Subscription** | `/api/purchase/update-branding` | Yes |

## API Authentication

All webhook endpoints require API key authentication:

**Header:** `x-api-key: YOUR_PURCHASE_API_KEY`

The API key is stored in the `PURCHASE_API_KEY` environment secret.

---

## 1. Tier Upgrades (NEW - CRITICAL!)

### ⚠️ When to Call

**User upgrades from one subscription tier to another** (e.g., Tier 1 → Tier 2)

### ⚠️ What Happens

- Marketplace generates **new license key** with updated tier suffix
- Example: `ABC123-1` (Tier 1) → `ABC123-2` (Tier 2)
- The new license key **MUST** be saved to platform **IMMEDIATELY**

### ⚠️ Critical: Prevent Lockout!

If you don't call this webhook immediately after tier upgrade payment:
1. User's database still has old license key (ABC123-1)
2. Marketplace considers old key invalid
3. User gets **LOCKED OUT** of their account
4. User must manually verify license to regain access

**Solution:** Call `/api/purchase/update-tier` webhook IMMEDIATELY after payment success!

### Webhook Endpoint

```
POST /api/purchase/update-tier
```

### Request Headers
```
Content-Type: application/json
x-api-key: YOUR_PURCHASE_API_KEY
```

### Request Body (Minimal - Preserves Existing Add-ons)
```json
{
  "email": "company@example.com",
  "newLicenseKey": "ABC123-2"
}
```

### Request Body (With Add-on Updates)
```json
{
  "email": "company@example.com",
  "newLicenseKey": "ABC123-2",
  "additionalSeats": 5,
  "additionalProjects": 3,
  "licenseVerified": true
}
```

### Required Fields
- `email` - Company email address
- `newLicenseKey` - The new license key with updated tier suffix

### Optional Fields
- `additionalSeats` - **ABSOLUTE TOTAL** of additional seats to set (must be > 0 to update, omit to preserve existing)
- `additionalProjects` - **ABSOLUTE TOTAL** of additional projects to set (must be > 0 to update, omit to preserve existing)
- `licenseVerified` - Whether license should be marked verified (default: true)

### ⚠️ CRITICAL: Add-on Field Behavior
- **OMIT the field** to keep existing purchased seats/projects (recommended for simple tier upgrades)
- **Provide positive number (> 0)** to update the absolute total (e.g., `"additionalSeats": 5` sets total to 5)
- **DO NOT pass 0** - it will be ignored and existing values will be preserved
- **Example:** User has 3 additional seats, you pass `"additionalSeats": 5` → user now has 5 additional seats (not 8!)

### Success Response (200 OK)
```json
{
  "success": true,
  "companyId": "uuid-here",
  "companyName": "Example Company",
  "email": "company@example.com",
  "oldLicenseKey": "ABC123-1",
  "newLicenseKey": "ABC123-2",
  "oldTier": 1,
  "newTier": 2,
  "newLimits": {
    "baseSeatLimit": 10,
    "additionalSeats": 3,
    "totalSeats": 13,
    "baseProjectLimit": 5,
    "additionalProjects": 2,
    "totalProjects": 7
  },
  "message": "Successfully upgraded Example Company from Tier 1 to Tier 2"
}
```
**Note:** The `additionalSeats` and `additionalProjects` in the response show the preserved values from before the tier upgrade (user had 3 additional seats and 2 additional projects).

### Error Responses

**400 Bad Request** - Missing required fields
```json
{
  "message": "Email and newLicenseKey are required"
}
```

**401 Unauthorized** - Invalid API key
```json
{
  "message": "Unauthorized"
}
```

**404 Not Found** - Company doesn't exist
```json
{
  "message": "No company account found with this email"
}
```

### Workflow

1. ✅ User completes tier upgrade payment in marketplace
2. ✅ Marketplace generates new license key (ABC123-2)
3. ⚠️ **IMMEDIATELY** call `/api/purchase/update-tier` webhook:
   ```json
   {
     "email": "user@company.com",
     "newLicenseKey": "ABC123-2"
   }
   ```
   (Note: Omit `additionalSeats` and `additionalProjects` to preserve existing purchased add-ons)
4. ✅ Platform saves new license key and preserves existing add-ons
5. ✅ User stays logged in with upgraded tier access

---

## 2. Additional Seat Purchases

### When to Call

**User buys additional employee seats** (on top of their tier base limit)

### What Happens

Additional seats counter is **incremented** (not replaced)

### Webhook Endpoint

```
POST /api/purchase/update-seats
```

### Request Headers
```
Content-Type: application/json
x-api-key: YOUR_PURCHASE_API_KEY
```

### Request Body
```json
{
  "email": "company@example.com",
  "additionalSeats": 2
}
```

### Required Fields
- `email` - Company email address
- `additionalSeats` - Number of seats to **ADD** (incremental, not total)

### Success Response (200 OK)
```json
{
  "success": true,
  "companyId": "uuid-here",
  "companyName": "Example Company",
  "email": "company@example.com",
  "tier": 1,
  "seatsAdded": 2,
  "newLimits": {
    "baseSeatLimit": 4,
    "additionalSeats": 2,
    "totalSeats": 6
  },
  "message": "Successfully added 2 seats to Example Company"
}
```

### Example: User Already Has 2 Additional Seats, Buys 3 More

**Before:**
- Base limit: 4 (Tier 1)
- Additional seats: 2
- Total: 6 seats

**Call webhook with:**
```json
{
  "email": "company@example.com",
  "additionalSeats": 3
}
```

**After:**
- Base limit: 4 (Tier 1)
- Additional seats: 5 (2 + 3)
- Total: 9 seats

---

## 3. Additional Project Purchases

### When to Call

**User buys additional project slots** (on top of their tier base limit)

### What Happens

Additional projects counter is **incremented** (not replaced)

### Webhook Endpoint

```
POST /api/purchase/update-projects
```

### Request Headers
```
Content-Type: application/json
x-api-key: YOUR_PURCHASE_API_KEY
```

### Request Body
```json
{
  "email": "company@example.com",
  "additionalProjects": 3
}
```

### Required Fields
- `email` - Company email address
- `additionalProjects` - Number of projects to **ADD** (incremental, not total)

### Success Response (200 OK)
```json
{
  "success": true,
  "companyId": "uuid-here",
  "companyName": "Example Company",
  "email": "company@example.com",
  "tier": 1,
  "projectsAdded": 3,
  "newLimits": {
    "baseProjectLimit": 2,
    "additionalProjects": 3,
    "totalProjects": 5
  },
  "message": "Successfully added 3 projects to Example Company"
}
```

---

## 4. Branding Subscription ($0.49/month)

### When to Call

- **Activation**: User subscribes to white label branding
- **Deactivation**: User cancels subscription or payment fails

### What Happens

Branding subscription flag is toggled (boolean)

### Webhook Endpoint

```
POST /api/purchase/update-branding
```

### Request Headers
```
Content-Type: application/json
x-api-key: YOUR_PURCHASE_API_KEY
```

### Request Body (Activation)
```json
{
  "email": "company@example.com",
  "brandingActive": true
}
```

### Request Body (Deactivation)
```json
{
  "email": "company@example.com",
  "brandingActive": false
}
```

### Required Fields
- `email` - Company email address
- `brandingActive` - Boolean (true = activate, false = deactivate)

### Success Response (200 OK)
```json
{
  "success": true,
  "companyId": "uuid-here",
  "companyName": "Example Company",
  "email": "company@example.com",
  "brandingActive": true,
  "message": "Branding subscription activated for Example Company"
}
```

---

## Verification Endpoint (Read-Only)

Before initiating any purchase, verify the account exists:

### Endpoint
```
POST /api/purchase/verify-account
```

### Request Body
```json
{
  "email": "company@example.com"
}
```

### Response (Account Exists)
```json
{
  "exists": true,
  "companyId": "uuid-here",
  "companyName": "Example Company",
  "email": "company@example.com",
  "tier": 1,
  "licenseKey": "ABC123-1",
  "currentLimits": {
    "baseSeatLimit": 4,
    "additionalSeats": 0,
    "totalSeats": 4,
    "baseProjectLimit": 2,
    "additionalProjects": 0,
    "totalProjects": 2
  }
}
```

### Response (Account Doesn't Exist)
```json
{
  "exists": false,
  "message": "No company account found with this email"
}
```

---

## Complete Workflow Examples

### Tier Upgrade Workflow (CRITICAL!)

```
1. User clicks "Upgrade to Tier 2"
2. Marketplace processes payment via Stripe
3. Payment succeeds
4. Marketplace generates new license key: ABC123-2
5. ⚠️ IMMEDIATELY call /api/purchase/update-tier:
   {
     "email": "user@company.com",
     "newLicenseKey": "ABC123-2"
   }
   (Omit additionalSeats/additionalProjects to preserve existing purchased add-ons)
6. Platform saves new license key and preserves existing add-ons
7. User stays logged in, upgraded tier active, keeps all purchased add-ons
```

### Seat Purchase Workflow

```
1. User clicks "Buy 2 More Seats"
2. Marketplace processes payment
3. Payment succeeds
4. Call /api/purchase/update-seats:
   {
     "email": "user@company.com",
     "additionalSeats": 2
   }
5. Platform increments additional seats counter
6. User gets access to hire 2 more employees
```

### Project Purchase Workflow

```
1. User clicks "Buy 3 More Projects"
2. Marketplace processes payment
3. Payment succeeds
4. Call /api/purchase/update-projects:
   {
     "email": "user@company.com",
     "additionalProjects": 3
   }
5. Platform increments additional projects counter
6. User can create 3 more active projects
```

### Branding Subscription Workflow

```
Activation:
1. User clicks "Subscribe to Branding"
2. Marketplace processes $0.49 payment
3. Payment succeeds
4. Call /api/purchase/update-branding:
   {
     "email": "user@company.com",
     "brandingActive": true
   }
5. Platform activates branding
6. User can upload logo and customize colors

Deactivation:
1. User cancels subscription OR payment fails
2. Call /api/purchase/update-branding:
   {
     "email": "user@company.com",
     "brandingActive": false
   }
3. Platform deactivates branding
4. Logo and colors revert to defaults
```

---

## Testing Guide

### Test Tier Upgrade Webhook (Preserves Existing Add-ons)
```bash
curl -X POST https://rope-access-pro.replit.app/api/purchase/update-tier \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_PURCHASE_API_KEY" \
  -d '{
    "email": "test@example.com",
    "newLicenseKey": "TEST123-2"
  }'
```

### Test Tier Upgrade Webhook (Updates Add-ons)
```bash
curl -X POST https://rope-access-pro.replit.app/api/purchase/update-tier \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_PURCHASE_API_KEY" \
  -d '{
    "email": "test@example.com",
    "newLicenseKey": "TEST123-2",
    "additionalSeats": 5,
    "additionalProjects": 3
  }'
```

### Test Seat Purchase Webhook
```bash
curl -X POST https://rope-access-pro.replit.app/api/purchase/update-seats \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_PURCHASE_API_KEY" \
  -d '{
    "email": "test@example.com",
    "additionalSeats": 2
  }'
```

### Test Project Purchase Webhook
```bash
curl -X POST https://rope-access-pro.replit.app/api/purchase/update-projects \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_PURCHASE_API_KEY" \
  -d '{
    "email": "test@example.com",
    "additionalProjects": 3
  }'
```

### Test Branding Activation Webhook
```bash
curl -X POST https://rope-access-pro.replit.app/api/purchase/update-branding \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_PURCHASE_API_KEY" \
  -d '{
    "email": "test@example.com",
    "brandingActive": true
  }'
```

---

## Error Handling

### Retry Logic (Marketplace Side)

If webhook call fails:
1. Retry with exponential backoff: 1s, 2s, 4s, 8s, 16s
2. Maximum 5 retry attempts
3. Log all failures for manual review
4. Alert on critical failures (401 authentication errors)

### Webhook Timeout

- Set timeout to 30 seconds
- Platform typically responds within 500ms

### Common Errors

**401 Unauthorized:**
- Verify `PURCHASE_API_KEY` matches on both sides
- Check `x-api-key` header is being sent correctly

**404 Not Found:**
- Company account doesn't exist
- Verify email is correct

**400 Bad Request:**
- Missing required fields
- Check request payload structure

---

## Summary Checklist for Marketplace Agent

### After Tier Upgrade Payment Success:
- [ ] Generate new license key with updated tier suffix
- [ ] ⚠️ **IMMEDIATELY** call `/api/purchase/update-tier` webhook
- [ ] Include `email`, `newLicenseKey` in payload
- [ ] Wait for 200 OK response
- [ ] Log success/failure

### After Seat Purchase Payment Success:
- [ ] Call `/api/purchase/update-seats` webhook
- [ ] Include `email`, `additionalSeats` (incremental amount)
- [ ] Wait for 200 OK response
- [ ] Log success/failure

### After Project Purchase Payment Success:
- [ ] Call `/api/purchase/update-projects` webhook
- [ ] Include `email`, `additionalProjects` (incremental amount)
- [ ] Wait for 200 OK response
- [ ] Log success/failure

### After Branding Subscription Success/Cancellation:
- [ ] Call `/api/purchase/update-branding` webhook
- [ ] Include `email`, `brandingActive` (true/false)
- [ ] Wait for 200 OK response
- [ ] Log success/failure

### Error Handling:
- [ ] Implement retry logic with exponential backoff
- [ ] Set 30-second timeout on webhook calls
- [ ] Log all failures for manual review
- [ ] Alert team on repeated failures

---

## Critical Success Factors

1. ⚠️ **Tier upgrades:** Call webhook IMMEDIATELY to prevent lockout
2. **Seats/Projects:** Use incremental amounts (not totals)
3. **Branding:** Toggle boolean flag (true/false)
4. **API Key:** Must match on both sides
5. **Retry Logic:** Implement for all webhook calls
6. **Monitoring:** Track success rates and response times

**This integration ensures seamless purchase management with instant activation and prevents user lockout issues.**
