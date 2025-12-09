# Replit Agent Prompt: Simplify Technician Signup Flow

## Overview

Restructure the technician registration flow to minimize friction. Current flow has 20 screens—reduce to 4 screens for account creation, then allow profile completion in-app after signup.

**Design Reference:** Use Flowbite user onboarding style: https://flowbite.com/blocks/marketing/user-onboarding/

**Brand Color:** `#0369A1` (replace Flowbite's blue with this)

---

## Current Problem

The current signup flow asks for too much information upfront:
- Name, certification, logbook hours, career start, first aid, address, email, phone, password, emergency contact, SIN, banking, driver's license, birthday, medical conditions

This causes abandonment. Most of these fields are only needed when the technician connects to an employer.

---

## New Signup Flow (4 Screens Maximum)

### Screen 1: Welcome
- Header: "Create your free account"
- Subtext: "Takes 60 seconds. Free forever."
- Show 3-4 key benefits as icons:
  - ✓ Portable professional profile
  - ✓ Automatic work hour logging
  - ✓ Never fill out onboarding forms again
  - ✓ Free upgrade when you share
- CTA Button: `Get Started →`
- Already have an account? [Sign In]

### Screen 2: Account Details (Single Screen)

**Progress indicator:** Step 1 of 3 — Personal Info

Collect on ONE screen:
```
First Name          Last Name
[___________]       [___________]

Email
[_________________________]

Phone
[_________________________]

Password
[_________________________]

Confirm Password
[_________________________]
```

- Show password requirements inline
- CTA: `Continue →`
- Back link

### Screen 3: Verify Your Certification

**Progress indicator:** Step 2 of 3 — Certification

**Header:** "Verify your certification"
**Subtext:** "Upload a photo of your card—we'll verify automatically"

```
Select your certification type:
┌─────────────────┐  ┌─────────────────┐
│  IRATA          │  │  SPRAT          │
└─────────────────┘  └─────────────────┘
┌─────────────────┐  ┌─────────────────┐
│  Both           │  │  Trainee        │
└─────────────────┘  └─────────────────┘

Upload Certification Card
┌─────────────────────────────────────┐
│                                     │
│     📷 Tap to upload photo          │
│     or drag and drop                │
│                                     │
└─────────────────────────────────────┘
Supported: JPG, PNG, PDF
```

**OCR Integration:**
- When image is uploaded, use Google Cloud Vision OCR (or similar) to extract:
  - License number
  - Level (1, 2, or 3)
  - Expiry date (if visible)
  - Name (for verification)
- If OCR succeeds: Auto-populate fields and show confirmation
- If OCR fails or is unclear: Show manual entry fallback:

```
IRATA Level & License Number
[Level ▼]  [License Number___________]

Expiry Date (Optional)
[____-____-____]
```

- CTA: `Create Account →`
- Back link

### Screen 4: Success + Referral Code

**Progress indicator:** Step 3 of 3 — Complete ✓

**Header:** "🎉 Welcome to OnRopePro!"
**Subtext:** "Your account is ready, [First Name]"

**Referral Code Section (PROMINENT):**
```
┌─────────────────────────────────────────┐
│                                         │
│  YOUR REFERRAL CODE                     │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │      DD2C8283A15D      [Copy]   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Share with 1 other tech →              │
│  You BOTH get free upgrade to Plus      │
│                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐       │
│  │  Text  │ │ Email  │ │ Copy   │       │
│  └────────┘ └────────┘ └────────┘       │
│                                         │
└─────────────────────────────────────────┘
```

**Plus Benefits Preview:**
```
PLUS includes:
✓ Unlimited employer connections
✓ Exportable work history PDF  
✓ 30-day certification expiry alerts
✓ Job board access
```

**CTAs:**
- Primary: `Go to My Profile →`
- Secondary link: "Complete profile later"

---

## Profile Completion (In-App, Post-Signup)

After signup, user lands on their profile/dashboard. Show a profile completion widget:

**Profile Completion Card:**
```
┌─────────────────────────────────────────┐
│  Complete Your Profile                  │
│  ████████░░░░░░░░░░░░░░  35%           │
│                                         │
│  Complete your profile to connect with  │
│  employers instantly                    │
│                                         │
│  [Continue Setup →]                     │
└─────────────────────────────────────────┘
```

**Profile Sections (All Optional, Editable Anytime):**

Move ALL of these to the profile page as separate sections/cards:

1. **Personal Information** (pre-filled from signup)
   - First Name
   - Last Name
   - Email
   - Phone
   - Address (Street, City, Province/State, Country, Postal Code)
   - Birthday

2. **Certification** (pre-filled from signup)
   - Certification Type (IRATA/SPRAT/Both/Trainee)
   - Level
   - License Number
   - Certification Card Photo
   - Expiry Date

3. **Experience**
   - Career Start Date
   - Total Logbook Hours

4. **First Aid Certification**
   - Type (Standard First Aid, CPR/AED, OFA Level 1, etc.)
   - Expiry Date
   - Certificate Upload

5. **Driver's License**
   - License Number
   - Expiry Date
   - License Photo
   - Driver's Abstract Upload

6. **Banking Information**
   - Transit Number
   - Institution Number
   - Account Number
   - Void Cheque Upload

7. **Emergency Contact**
   - Contact Name
   - Contact Phone
   - Relationship

8. **Additional Information**
   - SIN (Social Insurance Number)
   - Medical Conditions/Allergies

9. **Documents** (new section)
   - Resume Upload
   - Other Documents

10. **Referral & Plus Status**
    - Your Referral Code
    - Referrals Completed (X/1 for Plus)
    - Plus Status (Standard / Plus)
    - Share buttons

---

## Technical Requirements

### Database
- All existing fields remain in the database
- Add `profile_completion_percentage` calculated field
- Add `signup_completed_at` timestamp
- Add `profile_last_updated_at` timestamp

### OCR for Certification
- Integrate Google Cloud Vision API (or alternative)
- On image upload, attempt to extract:
  - Text containing license number pattern (e.g., "1/123456" or "2/789012")
  - Level indicator (1, 2, 3)
  - Expiry date
  - Name for verification
- Store OCR confidence score
- If confidence < 80%, show manual entry fields
- If confidence >= 80%, auto-populate and ask for confirmation

### Validation
- Email: Valid format, unique in database
- Phone: Valid format
- Password: Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number
- License Number: Format validation based on certification type

### Referral Code
- Generate unique alphanumeric code on account creation (12 characters)
- Store in user profile
- Track referral source when new user signs up with code
- Auto-upgrade BOTH users to Plus when referral completes

---

## Styling

**Use Flowbite onboarding component style:**
- Split layout on desktop (benefits on left, form on right)
- Progress steps at top
- Clean card-based form fields
- Prominent CTAs

**Replace Flowbite blue with brand color:**
- Primary: `#0369A1`
- Primary Hover: `#0284C7` (lighter)
- Primary Dark: `#075985` (darker)

**Progress Steps:**
```
●───────●───────○
1        2        3
Personal  Cert   Complete
```

**Form Field Styling:**
- Rounded corners
- Light gray border
- Focus state: Brand color border + subtle shadow
- Error state: Red border + error message below

---

## Success Metrics to Track

- Signup completion rate (started vs completed)
- Time to complete signup
- OCR success rate
- Profile completion percentage over time
- Referral code share rate
- Referral conversion rate

---

## Summary of Changes

| Current | New |
|---------|-----|
| 20 screens before account | 4 screens to account creation |
| All fields required upfront | Only name, email, phone, password, cert required |
| No OCR | OCR auto-fills certification details |
| Referral code buried | Referral code prominent on success screen |
| No profile completion tracking | Profile completion percentage shown |
| Fields not editable post-signup | All fields editable in profile anytime |

---

## File Locations to Modify

Based on typical OnRopePro structure:
- `/client/src/pages/TechnicianRegistration.tsx` — Main registration flow
- `/client/src/components/registration/` — Registration step components
- `/client/src/pages/TechnicianProfile.tsx` — Profile page (add completion sections)
- `/server/routes/auth.ts` — Registration endpoint
- `/server/routes/ocr.ts` — New OCR endpoint
- `/shared/schema.ts` — User schema updates

---

*End of Prompt*
