# Replit Prompt: Building Manager & Property Manager Account Clarification

## Current State (Already Built)

### Building Manager (BM) Account
- **Status:** ✅ Built
- **Login:** Strata plan number + password
- **Scope:** Single building access
- **Features:**
  - View maintenance history for their building
  - Upload anchor inspection documents
  - View vendor certificate of insurance (COI)
  - View company safety rating
  - View project progress for active jobs
- **Revenue:** FREE FOREVER — will never have a premium tier

### Property Manager (PM) Account
- **Status:** ✅ Built
- **Login:** Strata plan number + password (same method as BM)
- **Scope:** Multiple buildings (sees all buildings under vendors they use)
- **Features:**
  - All BM features
  - View multiple buildings across their vendor relationships
  - See all projects across their portfolio
- **Revenue:** FREE now — Premium tier planned for future

## Key Distinction

| Attribute | Building Manager (BM) | Property Manager (PM) |
|-----------|----------------------|----------------------|
| **Status** | ✅ Built | ✅ Built |
| **Scope** | 1 building | Multiple buildings |
| **Premium tier** | NO — free forever | YES — future ($49/bldg/mo) |

## Outstanding Issue

**Authentication hardening needed:** The current strata # + password system needs securing so users can only access buildings they legitimately manage.

## Future: PM Premium Account

- **Trigger:** Launch after hitting tipping point (150+ PM accounts, 50%+ monthly engagement)
- **Pricing:** $49/building/month
- **Features:** TBD — not yet determined

## Questions for Tommy

1. For authentication hardening — what's your preferred approach?
   - Option A: PM/BM must be invited by the employer who created the building
   - Option B: PM/BM claims building + verification code sent to building address
   - Option C: PM/BM requests access, employer approves
   - Option D: Other approach?

2. How do we currently distinguish between a BM (single building) and PM (multiple buildings) in the system? Is it automatic based on how many buildings they access, or is there a flag?

3. Any database changes needed to support PM Premium tier when we're ready to launch it?
