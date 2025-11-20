# TIER UPGRADE FIX - What the Marketplace Must Return

## 🔴 THE PROBLEM

When users upgrade tiers (e.g., Tier 1 → Tier 2):
1. Marketplace generates NEW license key (ABC123-1 → ABC123-2)
2. User returns to the app
3. App still has OLD license key (ABC123-1) in database
4. User gets LOCKED OUT because old key is invalid

## ✅ THE SOLUTION

The app ALREADY has automatic tier upgrade detection built-in. When the user returns from the marketplace, the app calls your `/api/verify-license` endpoint to check the license status.

**Your marketplace MUST return the NEW license key in the verification response.**

---

## 📋 WHAT THE MARKETPLACE MUST DO

### Endpoint: `/api/verify-license`

**When Called:** 
- Every time a user logs in
- Every time they return from the marketplace
- Every time they manually verify their license

**Request:**
```json
POST /api/verify-license

Headers:
  Content-Type: application/json
  x-api-key: YOUR_LICENSE_VERIFICATION_API_KEY

Body:
{
  "licenseKey": "ABC123-1",
  "email": "user@company.com"
}
```

**What You Must Return (After Tier Upgrade):**

```json
{
  "isValid": true,
  "additionalSeats": 0,
  "additionalProjects": 0,
  "newLicenseKey": "ABC123-2"
}
```

**CRITICAL FIELDS:**

- `isValid` - MUST be `true` (the new key is valid)
- `newLicenseKey` - The NEW license key with updated tier suffix
- `additionalSeats` - Total additional seats purchased (0 if none)
- `additionalProjects` - Total additional projects purchased (0 if none)

---

## 🔧 HOW IT WORKS

1. User upgrades from Tier 1 to Tier 2 in marketplace
2. Marketplace generates new license key: `ABC123-2`
3. User returns to app
4. App calls `/api/verify-license` with OLD key: `ABC123-1`
5. **Marketplace checks:** "This user now has ABC123-2, not ABC123-1"
6. **Marketplace returns:**
   ```json
   {
     "isValid": true,
     "newLicenseKey": "ABC123-2",
     "additionalSeats": 0,
     "additionalProjects": 0
   }
   ```
7. App sees `newLicenseKey` and automatically updates the database
8. User stays logged in with new tier - NO LOCKOUT ✅

---

## ⚠️ WHAT'S BREAKING NOW

The marketplace is probably returning this when called with the old key:

```json
{
  "isValid": false
}
```

**This locks the user out!** Instead, you need to:

1. **Detect that the old key belongs to a user who upgraded**
2. **Return the NEW license key in the response**
3. **Mark isValid: true** (because the new key is valid)

---

## 📝 IMPLEMENTATION GUIDE FOR MARKETPLACE

### In Your `/api/verify-license` Endpoint:

```javascript
// When you receive a license key to verify
app.post('/api/verify-license', (req, res) => {
  const { licenseKey, email } = req.body;
  
  // Look up the user by email
  const user = findUserByEmail(email);
  
  if (!user) {
    return res.json({ isValid: false });
  }
  
  // Check if the license key matches their CURRENT key
  if (user.currentLicenseKey === licenseKey) {
    // Key matches - return normal response
    return res.json({
      isValid: true,
      additionalSeats: user.additionalSeats || 0,
      additionalProjects: user.additionalProjects || 0
    });
  }
  
  // Key doesn't match - check if it's their OLD key (before upgrade)
  // Extract base (ABC123) and tier (-1, -2, etc)
  const requestedBase = licenseKey.split('-')[0];
  const currentBase = user.currentLicenseKey.split('-')[0];
  
  if (requestedBase === currentBase) {
    // Same base but different tier = tier upgrade happened!
    // Return the NEW license key
    return res.json({
      isValid: true,
      newLicenseKey: user.currentLicenseKey,  // THIS IS CRITICAL!
      additionalSeats: user.additionalSeats || 0,
      additionalProjects: user.additionalProjects || 0
    });
  }
  
  // Completely different key
  return res.json({ isValid: false });
});
```

---

## 🎯 QUICK CHECKLIST

- [ ] When user upgrades tier, store the NEW license key in your database
- [ ] When `/api/verify-license` is called with OLD key, detect the upgrade
- [ ] Return `newLicenseKey` field with the current (new) license key
- [ ] Set `isValid: true` (the new key is valid)
- [ ] Include current `additionalSeats` and `additionalProjects` values

---

## 🧪 TEST IT

### Test Case: User Upgrades from Tier 1 to Tier 2

**Setup:**
- User originally has: `ABC123-1`
- They upgrade to Tier 2
- New key generated: `ABC123-2`

**Test:**
```bash
# App calls verify-license with OLD key
curl -X POST https://your-marketplace.com/api/verify-license \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "licenseKey": "ABC123-1",
    "email": "user@company.com"
  }'
```

**Expected Response:**
```json
{
  "isValid": true,
  "newLicenseKey": "ABC123-2",
  "additionalSeats": 0,
  "additionalProjects": 0
}
```

**Result:** User's license key gets automatically updated in the app database, NO LOCKOUT! ✅

---

## 🆘 SUMMARY

**The app doesn't need a webhook.** It already handles tier upgrades automatically through the verification endpoint. You just need to return the new license key when the app calls `/api/verify-license` with an old key.

**Single change needed:** When `/api/verify-license` receives an old license key (from before tier upgrade), return the NEW license key in the `newLicenseKey` field.

That's it. This will fix the lockout issue.
