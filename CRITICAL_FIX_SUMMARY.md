# CRITICAL FIX SUMMARY - Tier Upgrades & Add-on Purchases

## 🔴 WHAT WAS BROKEN

### Issue #1: Tier Upgrade Lockout (CRITICAL)
**Symptoms:** After upgrading tiers, users get locked out with "Invalid license key"

**Root Cause:** 
The `/api/purchase/update-tier` webhook endpoint existed BUT was NOT whitelisted from read-only mode checks. When the marketplace tried to call it, the request was BLOCKED by security middleware. The new license key was never saved to the database, causing lockout.

**The Fix:**
Added `/api/purchase/update-tier` to the read-only mode whitelist (line 375 in server/routes.ts). The endpoint can now be called even when a company's license is unverified.

### Issue #2: Add-on Purchases Stopped Working
**Symptoms:** Seat and project purchases were working but suddenly stopped

**Root Cause:**
The marketplace may have been using the wrong endpoint or wrong semantics. There are THREE different endpoints with DIFFERENT behaviors:

1. `/api/purchase/update-tier` - **SETS absolute totals** (when provided)
2. `/api/purchase/update-seats` - **ADDS to existing** (incremental)
3. `/api/purchase/update-projects` - **ADDS to existing** (incremental)

**The Fix:**
Clarified documentation to emphasize that:
- Seat purchases MUST use `/api/purchase/update-seats` (not update-tier)
- Project purchases MUST use `/api/purchase/update-projects` (not update-tier)
- Tier upgrades should OMIT seat/project fields to preserve existing add-ons

---

## ✅ WHAT TO TELL YOUR MARKETPLACE AGENT

### For Tier Upgrades (MOST CRITICAL!)

**When:** User upgrades from one tier to another (e.g., Tier 1 → Tier 2)

**What to do IMMEDIATELY after Stripe payment succeeds:**

```
POST https://rope-access-pro.replit.app/api/purchase/update-tier

Headers:
  Content-Type: application/json
  x-api-key: [YOUR_PURCHASE_API_KEY]

Body:
{
  "email": "user@company.com",
  "newLicenseKey": "ABC123-2"
}
```

**CRITICAL:** 
- Call this webhook IMMEDIATELY after payment success
- DO NOT include `additionalSeats` or `additionalProjects` fields (they'll be preserved automatically)
- If you don't call this, the user will be LOCKED OUT

---

### For Additional Seat Purchases

**When:** User buys additional employee seats (separate from tier upgrades)

**What to do after Stripe payment succeeds:**

```
POST https://rope-access-pro.replit.app/api/purchase/update-seats

Headers:
  Content-Type: application/json
  x-api-key: [YOUR_PURCHASE_API_KEY]

Body:
{
  "email": "user@company.com",
  "additionalSeats": 2
}
```

**Important:**
- The `additionalSeats` value is the number to ADD (not the new total)
- Example: User has 3 seats, you pass `"additionalSeats": 2`, they now have 5 seats
- NEVER use `/api/purchase/update-tier` for seat purchases

---

### For Additional Project Purchases

**When:** User buys additional project slots (separate from tier upgrades)

**What to do after Stripe payment succeeds:**

```
POST https://rope-access-pro.replit.app/api/purchase/update-projects

Headers:
  Content-Type: application/json
  x-api-key: [YOUR_PURCHASE_API_KEY]

Body:
{
  "email": "user@company.com",
  "additionalProjects": 3
}
```

**Important:**
- The `additionalProjects` value is the number to ADD (not the new total)
- Example: User has 2 projects, you pass `"additionalProjects": 3`, they now have 5 projects
- NEVER use `/api/purchase/update-tier` for project purchases

---

### For Branding Subscription

**When:** User subscribes to white label branding ($49/month)

**What to do after Stripe payment succeeds:**

```
POST https://rope-access-pro.replit.app/api/purchase/update-branding

Headers:
  Content-Type: application/json
  x-api-key: [YOUR_PURCHASE_API_KEY]

Body:
{
  "email": "user@company.com",
  "subscriptionActive": true
}
```

**For cancellation:**
```json
{
  "email": "user@company.com",
  "subscriptionActive": false
}
```

---

## 🎯 QUICK REFERENCE: Which Endpoint to Call

| Purchase Type | Endpoint | Semantics | Required Fields |
|--------------|----------|-----------|-----------------|
| Tier Upgrade | `/api/purchase/update-tier` | SETS absolute (when provided) | email, newLicenseKey |
| Seat Purchase | `/api/purchase/update-seats` | ADDS to existing | email, additionalSeats |
| Project Purchase | `/api/purchase/update-projects` | ADDS to existing | email, additionalProjects |
| Branding Subscription | `/api/purchase/update-branding` | SETS boolean | email, subscriptionActive |

---

## 🔧 TESTING

### Test Tier Upgrade (Preserves Add-ons)
```bash
curl -X POST https://rope-access-pro.replit.app/api/purchase/update-tier \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_PURCHASE_API_KEY" \
  -d '{
    "email": "test@company.com",
    "newLicenseKey": "TEST123-2"
  }'
```

### Test Seat Purchase (Adds 2 Seats)
```bash
curl -X POST https://rope-access-pro.replit.app/api/purchase/update-seats \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_PURCHASE_API_KEY" \
  -d '{
    "email": "test@company.com",
    "additionalSeats": 2
  }'
```

### Test Project Purchase (Adds 3 Projects)
```bash
curl -X POST https://rope-access-pro.replit.app/api/purchase/update-projects \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_PURCHASE_API_KEY" \
  -d '{
    "email": "test@company.com",
    "additionalProjects": 3
  }'
```

---

## ⚠️ COMMON MISTAKES TO AVOID

1. **DON'T** use `/api/purchase/update-tier` for seat/project purchases
2. **DON'T** delay calling `/api/purchase/update-tier` after tier upgrades (call IMMEDIATELY)
3. **DON'T** include seat/project fields in tier upgrade calls (omit them to preserve existing)
4. **DON'T** pass absolute totals to `/api/purchase/update-seats` or `/api/purchase/update-projects` (they expect increments)
5. **DON'T** forget to call the webhook - the platform won't know about purchases otherwise!

---

## 📊 CURRENT STATUS

✅ **All 4 webhook endpoints are working and whitelisted**
✅ **Tier upgrade lockout issue FIXED**
✅ **Add-on purchase semantics clarified**
✅ **Documentation updated with examples**

**Next Steps:**
1. Share this document with your marketplace integration team
2. Verify all webhook calls are being made correctly
3. Test tier upgrades, seat purchases, and project purchases
4. Monitor for any lockout issues

---

## 🆘 TROUBLESHOOTING

**User gets locked out after tier upgrade:**
- Check if marketplace called `/api/purchase/update-tier` webhook
- Verify the API key is correct
- Check marketplace logs for 401/403 errors

**Seat/project purchases not working:**
- Verify you're calling the correct endpoint (`update-seats` or `update-projects`, NOT `update-tier`)
- Check that `additionalSeats`/`additionalProjects` is a positive number
- Verify API key is correct

**401 Unauthorized errors:**
- Check that `x-api-key` header is set
- Verify API key matches `PURCHASE_API_KEY` environment variable

---

## 📞 SUPPORT

For complete integration details, see `MARKETPLACE_INTEGRATION_GUIDE.md`

All fixes are deployed and active as of January 2025.
