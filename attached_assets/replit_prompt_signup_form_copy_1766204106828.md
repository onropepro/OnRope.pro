# Replit Prompt: Update Technician Sign-Up Form Copy

## Context
We're updating the technician registration form to reinforce our core value proposition. The target audience is urban rope access technicians (IRATA/SPRAT certified) who care about:
- Protecting their logged hours from being lost
- Reducing onboarding paperwork when switching jobs
- Building a portable professional identity
- Never guessing at logbook entries again

## Current vs Updated Copy

### LEFT PANEL

**Current Header:**
```
Create Your Profile
Join thousands of rope access technicians
```

**Updated Header:**
```
Your Urban Rope Access Work Passport
Your hours. Your proof. Forever.
```

**Current Steps (keep the same structure):**
```
1. Account Details
2. Certification  
3. Complete
```

**Current "WHAT YOU GET" section:**
```
- Portable professional profile
- Automatic work hour logging
- Never fill out onboarding forms again
- Free upgrade when you share
```

**Updated "WHAT YOU GET" section (two tiers):**

**FREE:**
```
✓ Your hours travel with you—every employer, every city
✓ Import your existing logbook via photo
✓ 10-second onboarding vs 60 minutes of paperwork
✓ Automatic logging when your employer joins
```

**PLUS (refer 1 tech to unlock):**
```
○ Certification expiry alerts
○ Multi-employer connections  
○ Job board access
○ Priority visibility
```

---

### RIGHT PANEL

**Current Badge:**
```
For IRATA & SPRAT Technicians
```

**Updated Badge:**
```
For IRATA & SPRAT Technicians
```
(Keep as-is - it's clear and functional)

**Current Main Headline:**
```
Create your free account
Takes 60 seconds. Free forever.
```

**Updated Main Headline:**
```
Create your free account
60 seconds to set up. Protected forever.
```

**Current Benefits (checkmarks):**
```
✓ Portable professional profile
✓ Automatic work hour logging
✓ Never fill out onboarding forms again
✓ Free upgrade when you share
```

**Updated Benefits - TWO SECTIONS:**

**Section 1: "FREE ACCOUNT"**
```
✓ Never lose hours when companies fold
✓ Import your logbook history via photo
✓ Skip onboarding paperwork at new jobs
✓ Automatic logging when employer joins
```

**Section 2: "UNLOCK PLUS FREE" (with referral prompt)**
```
Refer one tech to unlock:
○ Certification expiry alerts (60 & 30 day warnings)
○ Connect with multiple employers at once
○ Job board access
○ Priority profile visibility to employers
```

**Visual Treatment:**
- FREE section: Green checkmarks (current style), solid background
- PLUS section: Empty circles (○) or lock icons, slightly muted/grayed styling
- Small text under PLUS: "Refer one tech after signup → instant upgrade"

**Current Referral Code Section:**
```
Have a referral code? (optional)
[Enter referral code]
```

**Updated Referral Code Section:**
```
Got a referral code from a friend? (optional)
[Enter referral code]
```

**Current CTA Button:**
```
Get Started →
```

**Updated CTA Button:**
```
Create My Passport →
```

**Current Footer:**
```
Already have an account? Sign In
```

**Keep as-is** - functional and clear.

---

## Implementation Notes

1. **Left panel background** stays the same dark blue (#1E3A5F or similar)
2. **Two-tier visual hierarchy:**
   - FREE section: Green checkmarks, full opacity, white/light text
   - PLUS section: Empty circles or small lock icons, 60-70% opacity, slightly muted
   - Small label above PLUS items: "PLUS (refer 1 tech to unlock)" in lighter weight
3. **Right panel two-tier:**
   - FREE benefits: Current green checkmark cards (keep the card styling)
   - PLUS benefits: Same card styling but with empty circles and subtle gray background or border to show "locked" state
   - Divider or small header between sections: "UNLOCK WITH 1 REFERRAL:" or similar
4. **Step indicators** (1, 2, 3) stay the same - clear progression
5. **Referral code field** stays at bottom - it's well-placed

## Why These Changes Work

| Original Copy | Problem | Updated Copy | Psychology |
|--------------|---------|--------------|------------|
| "Join thousands of rope access technicians" | Generic, doesn't address their pain | "Your hours. Your proof. Forever." | Ownership + Loss prevention |
| "Portable professional profile" | Vague, corporate-sounding | "Your hours travel with you—every employer, every city" | Concrete benefit, mobility |
| "Automatic work hour logging" | Feature, not benefit | "Never lose hours when companies fold" | Loss aversion (strongest motivator) |
| "Never fill out onboarding forms again" | Good, but could be stronger | "Skip onboarding paperwork at every new job" | Action-oriented, specific |
| "Free upgrade when you share" | Unclear what they get | Two-tier visual showing exactly what PLUS unlocks | Endowment effect + clear value ladder |
| "Get Started" | Generic CTA | "Create My Passport" | Identity-based, ownership language |

## Why Two-Tier Structure Works

**Psychology at play:**

1. **Endowment Effect:** By showing PLUS benefits as "locked" items they could have, techs mentally take ownership before they even have it. They feel like they're missing out on something that's already theirs.

2. **Clear Value Ladder:** Removes ambiguity about what FREE vs PLUS includes. No confusion = higher conversion.

3. **Planted Seed:** The referral path is visible from moment one. They know exactly how to unlock more value before they even finish signing up.

4. **Loss Framing:** Empty circles (○) next to PLUS features create subtle "you don't have this yet" tension that green checkmarks resolve.

5. **Zero-Risk Upgrade Path:** "Refer one tech" feels achievable and free—not a paywall, just a social action.

## Additional Recommendation

Consider adding a single line of social proof below the benefits:

```
"I almost lost 187 hours when my company folded. Not anymore." — Tyler R., L2 IRATA
```

This creates immediate credibility and hits the loss aversion trigger hard.

---

## Summary of All Copy Changes

### Left Panel
- **Header:** "Your Urban Rope Access Work Passport" 
- **Subheader:** "Your hours. Your proof. Forever."
- **FREE benefits:** 4 items with checkmarks
- **PLUS benefits:** 4 items with empty circles + "refer 1 tech to unlock"

### Right Panel  
- **Subheadline:** "60 seconds to set up. Protected forever."
- **FREE section:** 4 checkmark benefits (green, active)
- **PLUS section:** 4 benefits with empty circles/locks (grayed, aspirational)
- **PLUS prompt:** "Refer one tech after signup → instant upgrade"
- **CTA button:** "Create My Passport →"

### Optional Addition
- **Testimonial line:** Add below benefits for social proof

---

## Code Location Hint
The sign-up form is likely in a component file like:
- `TechnicianSignUp.tsx`
- `CreateProfile.tsx`
- `RegistrationForm.tsx`
- Or within a `/auth` or `/onboarding` directory

Look for the strings "Create Your Profile" or "Join thousands" to find the right file.
