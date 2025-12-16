# Job Board Ecosystem - Complete Content for Replit

**Version:** 2.0  
**Last Updated:** December 15, 2025  
**Status:** Ready for TSX Implementation  
**Source:** Conversation Transcript (Tommy/Glenn - December 15, 2025, Lines 56-260) + Fireflies AI Notes

---

## Quick Reference: What Changed from v1.0

| Section | Change Type | Details |
|---------|-------------|---------|
| Introduction | REWRITE | Added closed-garden value prop, Indeed comparison |
| Problems Solved | NEW | 8 problems across 4 stakeholders |
| Candidate Browser | UPDATE | Added expected pay rate, search filters |
| Direct Job Offers | NEW | Send offers from Talent Browser |
| Profile Visibility | UPDATE | Added expected pay rate field |
| Why It's Different | NEW | Competitive positioning section |
| Integration Points | NEW | Module connections |

---

## Section 1: Introduction (REWRITE)

**Current:**
> The Job Board Ecosystem connects rope access technicians with employment opportunities across the platform. Companies and SuperUsers can post jobs, while technicians can browse listings, apply directly, and make their profiles visible to potential employers.

**New:**
> Stop posting on Indeed, Craigslist, and Facebook hoping qualified rope techs see your job. OnRopePro's Job Board is a closed ecosystem exclusively for rope access building maintenance. Every employer is verified. Every technician is relevant. No $22 per-application fees. No filtering through 50 resumes to find 2 actual rope techs. No spam.

---

## Section 2: Problems Solved (NEW SECTION)

*Add this section BEFORE "For Employers"*

### Section Header
**Icon:** AlertTriangle or Target  
**Title:** Problems Solved

### For Employers

**Problem 1: "I Post on Indeed and Get 50 Applicants, But Only 2 Are Actual Rope Access Techs"**

You post on Indeed, LinkedIn, Craigslist, and Facebook. You get flooded with applications from people who have never touched a rope system. Shop laborers, general construction workers, people who "are interested in learning." Hours wasted filtering irrelevant resumes.

OnRopePro's Job Board is a closed ecosystem. Every technician on the platform is in rope access building maintenance. Every employer is verified. When you post a job, 100% of applicants are relevant.

**Problem 2: "Indeed Keeps Charging Me Even When I'm Not Hiring"**

Indeed charges $22 per application if you don't respond within 2 days. A single job posting can cost $300+ in "engagement fees" before you've hired anyone. Someone has to log in daily, open every application, decline or respond. Miss a few days? That's $22 times every unopened application.

OnRopePro's Job Board is included in your subscription. Post unlimited jobs. Receive unlimited applications. No per-application fees. No surprise charges.

**Problem 3: "I Found a Good Tech But They Want Way More Than I Can Pay"**

You spend an hour interviewing a candidate, checking references, preparing an offer, only to discover their salary expectations are $20/hour above your budget. Complete waste of time for both parties.

Technicians set their expected pay rate in their profile. When you browse talent, you see what they're looking for before you reach out. If someone won't work under $60/hour and your budget is $45, you know immediately.

### For Technicians

**Problem 4: "I Want to Find a Rope Access Job But Indeed Shows Me Pipe Fitter and Welder Jobs"**

You search "rope access" on Indeed and get results for offshore oil rigs, industrial access in Alberta, and random construction gigs. You spend 30 minutes scrolling through irrelevant listings to find 2-3 that might be building maintenance.

OnRopePro's Job Board is exclusively for rope access building maintenance. Every job posted is relevant. Filter by job type, location, and certifications. No oil rigs. No pipe fitting. Just building maintenance.

**Problem 5: "I Don't Want Every Company to See My Profile"**

You're currently employed but casually looking. You don't want your current employer to know you're browsing jobs. Or you simply value your privacy.

Profile visibility is opt-in. Toggle it on when actively looking. Toggle it off when you're not. Control exactly which fields employers see.

---

## Section 3: For Employers - Candidate Browser (UPDATE)

**Current list:**
- View resume/CV documents
- Safety rating scores
- Years of experience
- IRATA/SPRAT certification details
- Profile photo and contact info
- Rope access specialties

**New list (add these items):**
- View resume/CV documents
- Safety rating scores
- Years of experience
- IRATA/SPRAT certification details
- Profile photo and contact info
- Rope access specialties
- **Expected pay rate** *(NEW)*
- **Search by location and name** *(NEW)*

---

## Section 4: Direct Job Offers (NEW CARD - For Employers)

*Add as new card after Candidate Browser*

**Icon:** Send or Mail  
**Title:** Send Job Offers

**Content:**
Send offers directly to technicians from the Talent Browser:

- Select a technician from search results
- Link offer to an active job posting
- Technician receives in-portal notification
- Accept or decline response returned to you

No email chains. No phone tag. Direct connection to qualified candidates.

---

## Section 5: For Technicians - Profile Visibility Toggle (UPDATE)

**Current "When Visible, Employers See" list:**
- Resume/CV documents
- Safety rating
- Name and photo
- Years of experience
- IRATA/SPRAT certification numbers and levels
- Rope access specialties

**New list (add this item):**
- Resume/CV documents
- Safety rating
- Name and photo
- Years of experience
- IRATA/SPRAT certification numbers and levels
- Rope access specialties
- **Expected pay rate** *(NEW)*

---

## Section 6: For Technicians - Job Offer Notifications (NEW CARD)

*Add after Profile Visibility Toggle*

**Icon:** Bell or Inbox  
**Title:** Job Offer Notifications

**Content:**
Receive offers directly from employers:

- Notification appears in your tech portal
- View job details and company information
- Accept or decline with one tap
- No need to check external email

Employers find you. You decide.

---

## Section 7: Why It's Different (NEW SECTION)

*Add before Access Requirements*

**Icon:** Shield or CheckCircle  
**Title:** Why It's Different

**Content as comparison cards (2x3 grid):**

| OnRopePro | Indeed/Craigslist |
|-----------|-------------------|
| Closed ecosystem | Open to everyone |
| Verified employers | Anyone can post |
| 100% relevant applicants | 2-5% relevant applicants |
| Flat monthly pricing | $22+ per application |
| Safety ratings visible | No verification |
| Industry-specific filters | Generic filters |

**Alternative format (bullet list):**

Unlike Indeed, LinkedIn, or Craigslist:
- Closed ecosystem: Only rope access building maintenance
- Verified participants: Real companies, qualified technicians
- No per-application fees: Flat monthly subscription
- Safety-verified candidates: Individual Safety Rating visible
- Industry-specific filters: IRATA/SPRAT levels, specialties, experience

---

## Section 8: Integration Points (NEW SECTION)

*Add before Access Requirements*

**Icon:** Link or Puzzle  
**Title:** Connected Modules

**Content:**
The Job Board connects with other OnRopePro modules:

**Employee Management**
Technician profiles, certifications, and work history flow directly into job applications.

**Safety & Compliance**
Individual Safety Rating (ISR) displays on talent profiles, helping employers assess candidates.

**Document Management**
Resume/CV documents stored once, attached to every application automatically.

**Onboarding**
Hired technicians already on the platform? 10-second setup. Enter salary and permissions. Done.

---

## Section 9: Access Requirements (UPDATE)

**Current:**
> Job posting requires Company Owner or Operations Manager role. All technicians can browse jobs and manage their profile visibility.

**New (expanded):**

| Role | Post Jobs | Browse Talent | Apply to Jobs | Send Offers |
|------|-----------|---------------|---------------|-------------|
| Company Owner | Yes | Yes | No | Yes |
| Operations Manager | Yes | Yes | No | Yes |
| Supervisor | No | View only | No | No |
| Technician | No | No | Yes | No |
| SuperUser | Yes | Yes | No | Yes |

---

## Validated Quotes (For Reference)

Use these for marketing materials or additional documentation:

**On closed ecosystem value (Lines 127-129):**
> "If you type rope access on Indeed, you can't really type rope access window washing Vancouver... but now with this place, that's all you're gonna find."

**On Indeed fees (Lines 139-149):**
> "Indeed has a weird way of making you pay... if you don't do anything after two days, you're being billed... it's $22 every time."

**On expected pay rate (Lines 114-116):**
> "The tech are also putting in their profile what they want for money... when the employer goes to look up for talent... this guy won't work under 60 bucks an hour. He can be like, yeah, no."

**On profile visibility control (Lines 85-87):**
> "The technician can go in there... toggle the switch on and they decide what they want the employer to see."

**On organic growth (Lines 240-244):**
> "I think we should just... let it happen organically... because we shit talk Indeed a lot too."

---

## TSX Implementation Notes

### New Icons Needed
```javascript
import { 
  // Existing
  Briefcase, Building2, HardHat, Eye, FileText, Award, Search, Send,
  CheckCircle2, Clock, MessageSquare, XCircle, Star, Info, Users,
  // New
  AlertTriangle, // or Target for Problems Solved
  Bell, // for Job Offer Notifications
  Link, // or Puzzle for Integration Points
  Shield, // or CheckCircle for Why It's Different
  DollarSign // for Expected Pay Rate emphasis
} from "lucide-react";
```

### Section Order (Updated)
1. Introduction (rewritten)
2. **Problems Solved** (NEW)
3. For Employers
   - Posting Jobs
   - Job Types & Employment
   - Candidate Browser (updated)
   - **Send Job Offers** (NEW)
4. For Technicians
   - Browsing Jobs
   - Applying to Jobs
   - Profile Visibility Toggle (updated)
   - **Job Offer Notifications** (NEW)
5. Application Status Tracking
6. **Why It's Different** (NEW)
7. **Connected Modules** (NEW)
8. SuperUser Management
9. Access Requirements (updated with table)

### Styling Notes
- No em-dashes anywhere
- Use commas, periods, or parentheses for clause separation
- Active voice throughout
- Present tense for all features

---

## Completion Checklist

Before implementing in TSX:

- [ ] All Problems Solved content validated from transcript
- [ ] Expected pay rate confirmed as implemented feature
- [ ] Direct job offers confirmed as implemented feature  
- [ ] ISR display in Talent Browser confirmed (check with Tommy)
- [ ] No em-dashes in any text
- [ ] Active voice used throughout
- [ ] Present tense for all features
- [ ] Version updated to 2.0
- [ ] lastUpdated changed to December 15, 2025

---

## Questions for Tommy Before Implementation

1. **ISR in Talent Browser:** Is Individual Safety Rating currently displayed in the Talent Browser? (Discussed at lines 156-176 but marked as "should it?")

2. **Expected Pay Rate Field:** Confirm this is a visible field when profile visibility is enabled.

3. **Direct Job Offer Flow:** Confirm the offer must be linked to an active job posting before sending.

4. **Document Request:** Is the "employer can request specific document from technician" feature part of Job Board or Document Management module? (Lines 187, 219-223)

---

**Document Ready for Replit Upload**

Copy sections directly into JobBoardGuide.tsx following the TSX patterns established in the current file. Use the section order and content above to build the updated component.
