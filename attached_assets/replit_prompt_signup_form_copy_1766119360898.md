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

**Updated "WHAT YOU GET" section:**
```
- Your hours travel with you—every employer, every city
- Import your existing logbook via photo
- 10-second onboarding vs 60 minutes of paperwork
- Automatic logging when your employer joins
- Free PLUS upgrade when you refer a tech
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

**Updated Benefits (checkmarks):**
```
✓ Never lose hours when companies fold
✓ Import your logbook history via photo
✓ Skip onboarding paperwork at every new job
✓ Refer one tech → unlock PLUS free
```

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
2. **Checkmark icons** stay green - they're working well
3. **"WHAT YOU GET" label** can stay as-is or change to "INCLUDED FREE:"
4. **Step indicators** (1, 2, 3) stay the same - clear progression

## Why These Changes Work

| Original Copy | Problem | Updated Copy | Psychology |
|--------------|---------|--------------|------------|
| "Join thousands of rope access technicians" | Generic, doesn't address their pain | "Your hours. Your proof. Forever." | Ownership + Loss prevention |
| "Portable professional profile" | Vague, corporate-sounding | "Your hours travel with you—every employer, every city" | Concrete benefit, mobility |
| "Automatic work hour logging" | Feature, not benefit | "Never lose hours when companies fold" | Loss aversion (strongest motivator) |
| "Never fill out onboarding forms again" | Good, but could be stronger | "Skip onboarding paperwork at every new job" | Action-oriented, specific |
| "Free upgrade when you share" | Unclear what they get | "Refer one tech → unlock PLUS free" | Clear mechanism, clear reward |
| "Get Started" | Generic CTA | "Create My Passport" | Identity-based, ownership language |

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
- **Benefits list:** Updated to 5 items (see above)

### Right Panel  
- **Subheadline:** "60 seconds to set up. Protected forever."
- **4 checkmark benefits:** Updated (see above)
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
