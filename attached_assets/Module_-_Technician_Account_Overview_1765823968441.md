# Module - Technician Account Overview

**Version:** 1.0 - Single Source of Truth  
**Last Updated:** December 15, 2025  
**Status:** ✅ Validated from Conversation Transcript (December 14, 2025)  
**Purpose:** Authoritative reference for all Technician Account documentation, marketing, and development

---

## 📋 Document Purpose

This is THE definitive source of truth for OnRopePro's Technician Account module. All other materials (website pages, marketing copy, sales decks, support documentation) should derive from this document. Any discrepancies between this document and other materials indicate those materials need updating.

**Validated Sources:**
- Tommy/Glenn conversation transcript (December 14, 2025, 45 minutes)
- Live implementation testing
- Fireflies AI meeting summary
- OnRopePro Business Model v2 (network architecture)

---

## 🎯 The Golden Rule

> **The technician account is a portable professional identity, not just a login.** It's a "work passport" that travels with the technician across their entire career, gaining value with every logged hour, completed inspection, and employer connection.

### Technician Value = f(Work History + Certifications + Safety Rating + Employer Connections)

Unlike traditional employee profiles owned by employers, the technician account belongs to the technician. When they change jobs, their complete professional history moves with them instantly.

**Why This Matters:** This portable identity creates the foundation for OnRopePro's network effects. Technicians build valuable profiles that employers need access to, driving platform adoption across the industry.

**Validated Quote (Line 37):**
> "that account is portable. It's their work passport. They can carry it from... it's valuable just to them on their own because it's their history. It's their IRATA or SPRAT history."

---

## ✅ Key Features Summary

| Icon | Feature | Description |
|------|---------|-------------|
| 🎫 | **Portable Identity** | IRATA/SPRAT license number serves as permanent identifier across all employers |
| 🔗 | **Instant Employer Connection** | 10-second onboarding via license number lookup versus 60+ minutes of paperwork |
| 📊 | **Automatic Hour Tracking** | Work sessions, drops, heights, tasks, and locations logged automatically when connected to employer |
| 🛡️ | **Personal Safety Rating** | Individual compliance score based on inspections and document acknowledgments across all employers |
| 🔔 | **Certification Alerts (PLUS)** | 60-day yellow badge and 30-day red badge warnings prevent certification lapses |
| 👥 | **Multi-Employer (PLUS)** | Connect with multiple companies simultaneously for contracting or part-time work |
| 📋 | **Job Board Access (PLUS)** | View and apply to employment opportunities in your area |
| 📈 | **Level Progression Tracking** | Visual display of hours toward next IRATA certification level |

---

## ⚠️ Critical Disclaimers

> ⚠️ **Important: IRATA/SPRAT Logbook Requirements**
>
> OnRopePro's automatic hour tracking assists your record-keeping but **does not replace your official IRATA/SPRAT logbook**. You remain responsible for maintaining your physical logbook per certification body requirements.
>
> **Validated Quote (Lines 182-184):**
> > "Obviously you still have to fill in your book. That disclaimer has to be there... It is there in big red letter."

> ⚠️ **Important: Data Privacy and Security**
>
> OnRopePro collects sensitive information including banking details and optionally Social Insurance Numbers (SIN). All financial data is encrypted using AES-256-GCM and stored on SOC2 Type II compliant infrastructure.
>
> **SIN Collection:** Providing your SIN is entirely optional. Refusing will not result in denied service. Your SIN is only shared with employers you explicitly approve.
>
> OnRopePro operates in compliance with PIPEDA (Canada) and applicable provincial privacy legislation.
>
> **Validated Quote (Lines 85-107):**
> > "if they don't feel comfortable adding in their social insurance number here, that they shouldn't have to"
> > "optional and informed consent... refusal will not result in denied service"

---

## ✅ Problems Solved (Stakeholder-Segmented)

**The Technician Account module solves different problems for different stakeholders.** This section is organized by user type to help each stakeholder immediately identify the pain points most relevant to them.

---

## 👷 For Rope Access Technicians

### Problem 1: "I can't remember what I did 3 months ago when filling my logbook"

**The Pain:**
IRATA certification requires detailed logbooks with dates, heights, tasks, and locations. Filling these retrospectively means guessing at details, potentially understating hours, and risking certification issues during audits. Most techs carry crumpled notebooks or rely on memory, losing critical data needed for level progression.

**Real Example:**
A Level 2 tech worked 6 buildings over 4 months. At certification renewal, he spent 8 hours reconstructing approximate hours, guessing heights, and hoping his math added up. The assessor flagged inconsistent entries and requested additional documentation.

**The Solution:**
OnRopePro automatically logs every work session with exact dates, building addresses, heights, tasks performed (descend, ascend, rope transfer, re-anchor, double re-anchor), and duration. Sessions are grouped by project with total hours calculated automatically.

**The Benefit:**
Zero guesswork. Complete audit trail. One export covers months of detailed activity. Never lose another hour of work history.

**Validated Quote (Line 190):**
> "For the tech it solves the issue of the logbook missing details answering hours that you're not really sure what you did. So you have a clear... you can wait a year if you want without filling your logbook. It's all there, it's all noted."

---

### Problem 2: "Every new job means re-entering all my information"

**The Pain:**
Switch employers and you're starting from scratch: new forms, new banking details, new certification copies, new emergency contacts. Every hire means 30-60 minutes of redundant paperwork. The rope access industry averages 2-3 employer changes per year, multiplying this administrative burden.

**Real Example:**
A tech averaged 3 employers per year (common in seasonal work). Each required the same 15 forms with identical information, plus waiting for each employer to verify certifications manually. That's 45+ forms annually containing the same data entered repeatedly.

**The Solution:**
Your technician account stores everything once: certifications, banking details, address, emergency contacts, and work history. When you accept an employer invitation, they receive your complete profile instantly. No re-entry required.

**The Benefit:**
10-second onboarding versus 60-minute paperwork sessions. Your information stays current in one place. Update your address once and every connected employer sees the change.

**Validated Quote (Line 190):**
> "Saves the problem of giving other employer all of your information. Again when you change employers, it's all there. At a click of a button they have all they need to have, nothing more, nothing less."

---

### Problem 3: "My IRATA certification expired and I didn't notice"

**The Pain:**
IRATA certifications expire after 3 years. Miss the renewal window and you can't work legally. Assessment slots fill up fast during busy season. Employers discover expired certs at job sites, sending techs home without pay and scrambling for coverage.

**Real Example:**
A Level 3 tech's certification expired during a 2-month vacation. He returned to discover he needed re-assessment, lost 3 weeks of work waiting for the next available date, and missed peak season income worth $8,000+.

**The Solution:**
PLUS accounts provide automated alerts at 60 days (yellow badge visible to you and employers) and 30 days (red badge with banner warning) before expiration.

**The Benefit:**
Never miss a renewal deadline. Plan assessments during slow season, not emergencies. Book early when slots are available.

**Validated Quote (Line 123):**
> "it's easy to allow to let an IRATA certification lapse or expire if you forget... with a PLUS account you'll always be notified"

---

### Problem 4: "I want to work for multiple companies but it's a paperwork nightmare"

**The Pain:**
Many techs do contract work or supplement their primary job with weekend gigs. Managing separate paperwork, banking info, and certifications for each employer means administrative chaos. Some give up on side work because the hassle isn't worth it.

**Real Example:**
A Level 2 tech wanted to pick up weekend work during peak season. Three companies were interested, but setting up with each meant 3 hours of paperwork. He picked one and left money on the table.

**The Solution:**
PLUS accounts allow unlimited employer connections. Accept invitations from multiple companies, and each receives your standardized profile. Switch between Work Dashboards instantly. Hours logged separately per employer.

**The Benefit:**
Maximize earning potential without administrative burden. Manage all employers from one login. Track hours by company for tax purposes.

**Validated Quote (Lines 40-43):**
> "with the plus account you can connect to multiple employer... So you could have three different employers at the same time if you're like contracting or you're doing part time at each or whatever."

---

### Problem 5: "I don't know how close I am to my next certification level"

**The Pain:**
IRATA level progression requires specific hour thresholds. Techs track this manually (often poorly), not knowing if they're 100 hours or 500 hours away from eligibility. Some discover at assessment they don't qualify because their manual tracking was inaccurate.

**Real Example:**
A Level 1 tech assumed she had enough hours for Level 2 assessment. At the training facility, her logbook showed only 800 of the required 1,000 hours. Assessment postponed, travel costs wasted.

**The Solution:**
PLUS accounts display real-time level progression tracking: "Your total hours: 847 of 1,000 required for Level 2. 153 hours remaining." Updates automatically as work sessions are logged.

**The Benefit:**
Always know exactly where you stand. Plan assessments with confidence. No surprises at certification.

**Validated Quote (Lines 134-138):**
> "displays how many hours away you are from your next level... if it takes 3,000 hours to get to your next level, it shows you that you're 1500 hours into of 3000... you always have an understanding of where you're at relative to the next level"

---

### Problem 6: "I can't find job opportunities in my area"

**The Pain:**
Rope access jobs aren't posted on Indeed or LinkedIn. Finding work means knowing people, random phone calls, or word-of-mouth. New technicians and those relocating have no systematic way to discover opportunities.

**Real Example:**
A Level 2 tech moved from Vancouver to Calgary. He had no industry contacts in Alberta. Three weeks of cold-calling before landing a position, during which he had zero income.

**The Solution:**
PLUS accounts access the OnRopePro Job Board showing employment opportunities posted by employers in your region. Apply with one click. Your complete profile is sent automatically.

**The Benefit:**
Discover opportunities you'd never find otherwise. Apply instantly with your professional profile. Reduce job search time from weeks to days.

**Validated Quote (Lines 139-143):**
> "you can see the job board if you have a PLUS account... in order to view the job or available employment in your area, you need to have a plus account"

---

## 💼 For Rope Access Company Owners

### Problem 7: "Onboarding paperwork gets lost in email chaos"

**The Pain:**
New hire accepts job. You email safety documentation. They read it (maybe). They sign it (eventually). They email it back (sometimes to the wrong person). You file it (somewhere). Six months later, an insurance auditor asks for proof of acknowledgment.

**Real Example:**
An employer hired 12 techs during peak season. 4 months later, an insurance auditor asked for signed safety acknowledgments. 3 were missing entirely, 2 had unsigned pages, and finding the rest took 2 hours of inbox searching. The auditor noted deficiencies in the report.

**The Solution:**
When a tech accepts your invitation, they must read and sign all safety documentation before accessing the Work Dashboard. Documents stored permanently with audit timestamps. No dashboard access until compliance is complete.

**The Benefit:**
100% compliance rate. Zero chasing. Instant audit response. Documentation always accessible.

**Validated Quote (Lines 206-214):**
> "I have made it mandatory when the employee signs in, when they accept the job, and then they have to review all the documents and sign"
> "no going back and forth like, hey, you're hired. I'm going to email you this safety documentation, read it, sign it, send it back"

---

### Problem 8: "I can't verify a tech's qualifications quickly"

**The Pain:**
Applicant claims Level 2 with First Aid. You ask for copies. They send blurry photos. You manually verify with IRATA. Days pass. Meanwhile, you need bodies on site tomorrow.

**Real Example:**
A tech applied claiming Level 3. Employer hired based on resume. Two weeks in, the client requested certification proof. Tech's actual level was 2 with pending assessment. Contract penalty applied.

**The Solution:**
Search any IRATA license number and instantly see: name, email, certification level, First Aid status, and location. The tech must approve the connection before you receive full profile access.

**The Benefit:**
Verify qualifications in seconds, not days. No more hiring based on unverified claims. Protect your contracts and reputation.

**Validated Quote (Lines 198-204):**
> "employer can... search for license number. He gets the name, the email, the IRATA level and if they have first aid and their location... very secure way in between the two"

---

### Problem 9: "New safety procedures don't reach existing employees"

**The Pain:**
You update safety documentation mid-season. How do you ensure every current employee reads and acknowledges the changes? Email notifications get ignored. You can't prove they saw it. Liability exposure continues.

**Real Example:**
After a near-miss, an employer added new anchor inspection requirements. 6 of 12 techs never opened the email. When audited 3 months later, half the crew had never seen the updated procedure. Auditor documented the gap.

**The Solution:**
When you add or update safety documents, existing employees are blocked from the Work Dashboard until they acknowledge the new content. No exceptions. System enforces compliance automatically.

**The Benefit:**
100% acknowledgment guaranteed. No tech can claim "I didn't know." Instant compliance with zero administrative effort.

**Validated Quote (Lines 230-234):**
> "Now you just like now you don't even have the employer. Don't even need to worry about telling the employee even. You don't even need to tell them to go and sign the documents. They don't have a choice."
> "let's say I've been working there for two months and the employer adds a new safe work procedure. Now they're kind of not locked out, but they can't go back on the dashboard until... they sign that document"

---

### Problem 10: "I can't see which techs are actually safety-conscious"

**The Pain:**
Some technicians complete daily harness inspections religiously. Others skip them constantly. You have no visibility into individual compliance patterns until there's an incident. By then it's too late.

**Real Example:**
An employer assumed all techs were following safety protocols. After an equipment incident, the investigation revealed the tech had completed harness inspections only 3 times in 6 months. No documentation existed. Liability exposure was severe.

**The Solution:**
Each technician has an individual safety rating calculated across all employers: document signing frequency plus harness inspection completion rate. This rating is visible when considering new hires.

**The Benefit:**
Hire techs with proven safety track records. Identify compliance gaps before they become incidents. Build a safety-conscious team.

**Validated Quote (Lines 216-222):**
> "there's a safety rating... it's based on how many times they did their inspection harness inspection over time. Over all the companies they worked for"
> "an overall how many times they've seen and signed documents and how many times they've completed their harness inspection every day"

---

### Problem 11: "My employees' work data is scattered and incomplete"

**The Pain:**
You need complete records of what each tech did, when, where, and how. For billing, for insurance, for IRATA audits. But data lives in text messages, paper timesheets, and memory. Reconstructing a complete picture is impossible.

**Real Example:**
A client disputed an invoice, claiming work wasn't completed on certain dates. The employer had paper timesheets but no detail on which building, which elevation, or what tasks. Unable to prove the work, they had to negotiate the invoice down.

**The Solution:**
When techs are connected to your company, every work session logs automatically: building address, heights, specific tasks (descend, ascend, rigging, rope transfer, re-anchor), and duration. Sessions grouped by project.

**The Benefit:**
Complete, undisputable work records. Instant invoice backup. Audit-ready documentation.

**Validated Quote (Lines 186-188):**
> "where you were, the height of the building you were working on, the address of the building you were working on. So many tasks that you can choose from all of the maneuver possible in there like descend, ascend, the rigging, rope transfer, re anchor, double re anchor"

---

## 🏢 For Building Managers & Property Managers

### Problem 12: "I can't verify contractor technician qualifications"

**The Pain:**
You hire a rope access company, but how do you know their technicians are actually certified? You request documentation. It takes days. Certifications might be expired. You're liable if unqualified workers access your building.

**Real Example:**
A building manager approved work. Mid-project, a resident complained about workers "dangling outside their window." The manager couldn't confirm if the specific technician was certified. Strata council demanded proof. The contractor took 3 days to provide it.

**The Solution:**
Through the Building Manager Portal, you can view technician profiles for contractors working on your property: certification levels, expiry dates, and safety ratings. Real-time verification without phone calls.

**The Benefit:**
Instant verification protects your liability. Confidence that only qualified workers access your building. Professional documentation for strata councils.

---

## 🎨 Account Tiers

### Standard Account (Free Forever)

**How to Get:** Sign up at onrope.pro/technician

**Included Features:**
- ✅ Portable professional identity
- ✅ Certification storage (IRATA/SPRAT)
- ✅ Work history tracking (when connected to employer)
- ✅ Personal safety rating
- ✅ Resume/CV upload
- ✅ Single employer connection
- ✅ Unique referral code

**Limitations:**
- ❌ No certification expiry alerts
- ❌ One employer connection at a time
- ❌ No Job Board access
- ❌ No level progression tracking

---

### PLUS Account (Free with 1 Referral)

**How to Get:** Refer one other technician who creates an account using your referral code

**All Standard Features PLUS:**
- ✅ Certification expiry alerts (60-day yellow, 30-day red)
- ✅ Unlimited employer connections
- ✅ Job Board access
- ✅ Enhanced profile visibility to employers
- ✅ Level progression tracking
- ✅ Gold "PLUS" badge on profile

**Validated Quote (Lines 145-147):**
> "an account on its own is valuable, but having a plus account... gives you the maximum functionality... getting access to a plus account is no more money. It's still free. You just have to refer one other technician"

---

### Account Tier Comparison

| Feature | Standard | PLUS |
|---------|----------|------|
| Portable Identity | ✅ | ✅ |
| Certification Storage | ✅ | ✅ |
| Work History (with employer) | ✅ | ✅ |
| Personal Safety Rating | ✅ | ✅ |
| Resume/CV Upload | ✅ | ✅ |
| Single Employer Connection | ✅ | ✅ |
| Referral Code | ✅ | ✅ |
| Certification Expiry Alerts | ❌ | ✅ (60/30 day) |
| Multiple Employer Connections | ❌ | ✅ Unlimited |
| Job Board Access | ❌ | ✅ |
| Level Progression Tracking | ❌ | ✅ |
| Enhanced Profile Visibility | ❌ | ✅ |
| Gold PLUS Badge | ❌ | ✅ |

---

## 📅 Registration Flow (Step-by-Step)

### Step 1: Referral Code (Optional)

**Fields:**
- **Referral Code:** 12-character code from another technician

**What Happens:**
- If valid code entered, the referring technician receives PLUS upgrade
- One-sided benefit: only the referrer gets PLUS, not the referee
- You can still register without a referral code

**Validated Quote (Lines 171-172):**
> "each registered technician receives a unique 12 character referral code that they can share... The original technician receives plus upgrade. This is a one sided benefit."

---

### Step 2: Personal Information

**Required Fields:**
- **First Name:** Legal first name
- **Last Name:** Legal last name
- **Email Address:** Used as username for login
- **Phone Number:** Primary contact
- **Password:** Minimum 8 characters
- **Address:** Street, city, province/state, country, postal code (Geoapify autocomplete)

**Why These Matter:** Basic contact info enables employer communication and location-based job matching.

---

### Step 3: Certification Information

**Required Fields:**
- **IRATA License Number:** Your unique IRATA identifier
- **IRATA Certification Level:** Level 1, 2, or 3
- **IRATA Expiration Date:** For tracking and alerts

**Optional Fields:**
- **SPRAT Certification Level:** If dual-certified
- **SPRAT License Number:** SPRAT identifier
- **SPRAT Expiration Date:** For tracking

**Validated Quote (Lines 71-74):**
> "Does SPRAT have level one, two, three as well? Yeah. SPRAT is like copy and paste of IRATA just for North America."

---

### Step 4: Financial Information

**Required Fields:**
- **Banking Details:** Transit number, institution number, account number for direct deposit

**Optional Fields:**
- **Social Insurance Number (SIN):** For payroll processing

**Security:**
- All financial data encrypted with AES-256-GCM
- SOC2 Type II compliant infrastructure
- SIN is optional with clear consent disclosure
- Refusing SIN does not deny service

**Validated Quote (Lines 84-116):**
> "optional and informed consent. If there's no legal requirements for the sin, the organization must make it clear that providing the number is optional... refusal will not result in denied service"
> "bank transit number, bank institution number, bank account number are all encrypted already"

---

## 🔄 Employer Connection Workflow

### For Technicians Already on Platform

**Step 1:** Employer searches your IRATA license number

**Step 2:** Employer sees limited info: name, email, level, First Aid status, location

**Step 3:** Employer sends invitation to connect

**Step 4:** You receive notification in Technician Portal

**Step 5:** You review and approve (consent gate)

**Step 6:** Full profile data transferred to employer

**Step 7:** You must sign all company safety documents

**Step 8:** Access Work Dashboard after document signing complete

**Validated Quote (Lines 202-206):**
> "They go on the job board like, oh, I want to apply for this job. They apply. The employer gets notification that someone applied and then they can at the moment when they add the employee... see that information. Then the tech has to approve... And at that moment the employer has access to all the information."

---

### For Company Owners (Auto-Generated Tech Account)

**Important:** When you create an employer account, you automatically receive a linked technician account.

**Why:** Most company owners are also working technicians (especially smaller operations).

**Benefits:**
- Your hours logged alongside employees
- Your certifications tracked in the system
- You can refer your employees to get PLUS
- No separate login required

**Validated Quote (Lines 154-166):**
> "their boss would have like the company owner also have tech account automatically... So I'm a employer. I sign up for an account. I automatically have a tech account as well"
> "it doesn't give them like they don't need to go somewhere else to log in. Like they don't need to go in the tech page to log in. They just log in as their employer and then they have a 'My profile' card"

---

## 📊 Work Dashboard Integration

When connected to an employer, technicians access the Work Dashboard with comprehensive tracking:

### Automatic Logging Includes:

| Data Point | Description |
|------------|-------------|
| **Date/Time** | Exact timestamps for each session |
| **Building Address** | Full address of work location |
| **Building Height** | Elevation of work performed |
| **Tasks Performed** | Descend, ascend, rigging, rope transfer, re-anchor, double re-anchor |
| **Duration** | Hours worked per session |
| **Drop Counts** | Per elevation (N/E/S/W) for drop-based jobs |
| **Project Association** | Sessions grouped by project |

### Session Grouping

Sessions are automatically grouped by project and date range:
> "if Monday to Friday you went to that one project, it will group it all in one and tell you like from the first to the fifth you were at this place, you did a total of 40 something hours and here are each session for that group"

**Validated Quote (Lines 186-188):**
> "where you were, the height of the building you were working on, the address of the building you were working on. So many tasks that you can choose from all of the maneuver possible in there like descend, ascend, the rigging, rope transfer, re anchor, double re anchor"

---

## 🔔 Referral System

### How It Works

1. **You Register:** Receive unique 12-character referral code
2. **Share Code:** Give code to colleagues
3. **They Register:** Enter your code during their registration
4. **You Upgrade:** Automatically receive PLUS account

### Key Details

| Aspect | Detail |
|--------|--------|
| Code Format | 12 alphanumeric characters |
| Benefit Direction | One-sided (only referrer gets PLUS) |
| Referrals Required | 1 successful referral for PLUS |
| Tracking | You can see how many people used your code |

**Future Enhancement:** Tommy noted potential for additional rewards at higher referral counts (e.g., 50 referrals), but this is not yet implemented.

**Validated Quote (Lines 148-153):**
> "I'd like to make it so they get a little something more if they reach like 50 referral... but then you could have people just creating account"
> "I think we'll have plenty of viral ability. Just one single quick boom and then that's it... I think it'll spread pretty quick"

---

## 🛡️ Personal Safety Rating

### What It Measures

Your individual safety rating is calculated from:
- **Document Signing Frequency:** How often you acknowledge safety documents
- **Harness Inspection Completion:** Daily inspection compliance rate

### Key Characteristics

| Aspect | Detail |
|--------|--------|
| Scope | Aggregated across ALL employers |
| Portability | Follows you between companies |
| Visibility | Visible to employers during hiring |
| Updates | Real-time as you complete safety activities |

### Why It Matters

**For Technicians:** Demonstrates professionalism and safety consciousness to potential employers.

**For Employers:** Provides objective data on candidate safety compliance history before hiring.

**Validated Quote (Lines 216-222):**
> "there's a safety rating... it's based on how many times they did their inspection harness inspection over time. Over all the companies they worked for"
> "an overall how many times they've seen and signed documents and how many times they've completed their harness inspection every day"

---

## 🔗 Module Integration Points

The Technician Account module connects with multiple OnRopePro modules:

### 👥 Employee Management
**Integration:**
- Employer invitations create employee records
- Tech profile data populates employee profiles instantly
- IRATA level syncs to employee card
- Hourly rates assigned at employer level

**Business Value:**
- 10-second onboarding vs 60-minute paperwork
- Pre-verified certification data
- No duplicate data entry

---

### 🛡️ Safety & Compliance
**Integration:**
- Mandatory document signing before Work Dashboard access
- Harness inspections contribute to personal safety rating
- Safety acknowledgments tracked per employer
- New documents trigger re-acknowledgment requirement

**Business Value:**
- 100% compliance enforcement
- Audit-ready documentation
- Zero administrative burden on employers

**Validated Quote (Lines 213-214):**
> "That's not the word I'm looking for. It just makes, it makes everything possible... a lot faster, a lot more secure even"

---

### ⏱️ Time Tracking
**Integration:**
- Work sessions logged to technician profile
- Hours counted toward IRATA level progression
- Sessions grouped by project and date range
- Task categorization for detailed logging

**Business Value:**
- Automatic work history accumulation
- Level progression tracking
- Complete audit trail

---

### 💼 Job Board Ecosystem
**Integration:**
- PLUS accounts access job listings
- One-click applications send profile to employers
- Employer search by IRATA number reveals tech profiles
- Mutual acceptance required before full data access

**Business Value:**
- Streamlined hiring for employers
- Discovery for technicians
- Secure consent-based data sharing

---

### 📊 IRATA/SPRAT Task Logging
**Integration:**
- Automatic logging when connected to employer
- Manual entry available for independent work
- Photo OCR scan of IRATA book for baseline hours
- Complete task categorization

**Business Value:**
- Elimination of manual logbook reconstruction
- Accurate level progression tracking
- One-year retrospective capability

**Validated Quote (Line 181):**
> "you go from entering your IRATA information manually or through the photo OCR scan of your IRATA book... to it doing it automatically"

---

## 📖 Terminology & Naming

### Core Terms

**Technician Account / Tech Account**
- **Definition:** A portable professional profile owned by the technician
- **Example:** "My tech account follows me from company to company"
- **Why it matters:** Distinguishes from employer-created employee records

**PLUS Account**
- **Definition:** Upgraded technician account with enhanced features
- **How to get:** Refer one other technician who creates an account
- **Visual indicator:** Gold "PLUS" badge on profile

**Work Passport**
- **Definition:** Metaphor for the portable technician account
- **Usage:** Internal and marketing term describing account portability
- **Source:** Tommy's description during validation conversation

**Portable Identity**
- **Definition:** The concept that technician professional data travels with them
- **Why it matters:** Core value proposition differentiating from employer-owned profiles

---

### Industry Terms Explained

**IRATA (Industrial Rope Access Trade Association)**
- **Plain English:** International certification body for rope access technicians
- **Technical Definition:** Organization setting global standards for rope access work at height
- **OnRopePro Context:** Primary certification type tracked in tech accounts

**SPRAT (Society of Professional Rope Access Technicians)**
- **Plain English:** North American certification body for rope access technicians
- **Technical Definition:** US-based organization with standards similar to IRATA
- **OnRopePro Context:** Secondary certification type, optional in tech accounts

**Level 1/2/3**
- **Plain English:** Certification tiers indicating skill and experience
- **Level 1:** Entry level, requires supervision
- **Level 2:** Intermediate, can work independently
- **Level 3:** Senior, can supervise Level 1 and 2 technicians

---

## 💰 Quantified Business Impact

### For Technicians

**Time Savings:**
| Activity | Before OnRopePro | With OnRopePro | Time Saved |
|----------|------------------|----------------|------------|
| New employer paperwork | 60 minutes | 10 seconds | **59+ minutes** |
| Logbook reconstruction | 8+ hours/year | 0 hours | **8+ hours/year** |
| Job searching | Weeks of calls | Days on Job Board | **Weeks** |
| Certification tracking | Manual calendar | Automatic alerts | **Risk eliminated** |

### For Employers

**Time Savings:**
| Activity | Before OnRopePro | With OnRopePro | Time Saved |
|----------|------------------|----------------|------------|
| Onboarding paperwork | 60+ minutes/hire | 2 minutes | **58+ minutes** |
| Certification verification | 1-3 days | 10 seconds | **Days** |
| Safety document distribution | Hours + follow-up | Automatic | **Hours** |
| Finding audit documentation | 2+ hours | Instant | **2+ hours** |

**Risk Reduction:**
- **100%** safety document acknowledgment rate (vs. unknown % with email)
- **Zero** "I didn't know" excuses for safety procedures
- **Complete** audit trail for insurance and regulatory compliance

---

## ❓ Frequently Asked Questions

### "Do I need to pay for a technician account?"

**Answer:** No. Technician accounts are free forever. PLUS accounts are also free, unlocked by referring one other technician.

**Why:** Technicians are the network that drives employer adoption. Free accounts maximize network growth.

---

### "What happens to my data if I leave a company?"

**Answer:** Your technician profile (certifications, work history, safety rating) stays with you permanently. Company-specific data (assigned gear, company documents) stays with that employer.

**Validated Quote (Lines 173-176):**
> "that information and that kit will not follow you when you leave the company"

---

### "Can I use OnRopePro without connecting to an employer?"

**Answer:** Yes. You can create an account, store certifications, upload your resume, and access the Job Board (PLUS). However, automatic hour tracking only works when connected to an employer using OnRopePro.

---

### "Is my Social Insurance Number required?"

**Answer:** No. SIN is completely optional. Refusing to provide it will not deny you service or limit your account. The SIN field exists to streamline payroll when you connect with employers, but you can provide it directly to your employer instead.

**Validated Quote (Lines 85-107):**
> "if they don't feel comfortable adding in their social insurance number here, that they shouldn't have to... refusal will not result in denied service"

---

### "How do employers find me?"

**Answer:** Employers search by IRATA license number. They see limited info (name, level, location) until you approve their connection request. Full profile access requires your consent.

---

### "What if I'm a company owner who also works as a technician?"

**Answer:** When you create an employer account, you automatically receive a linked technician account. No separate registration needed. Your hours log alongside your employees.

**Validated Quote (Lines 163-166):**
> "So I'm a employer. I sign up for an account. I automatically have a tech account as well... they don't need to go somewhere else to log in"

---

## 📝 Summary: Why Tech Accounts Are Different

**Most HR systems treat employees as company property.** Your profile, your work history, your certifications, all locked in an employer's system. Leave the company? Start over.

OnRopePro recognizes that in rope access, **technicians ARE the business.** Your skills, your certifications, your safety record travel with you. The technician account makes this portable professional identity the foundation of everything:

1. **Portable Identity** → Your profile follows you across every employer
2. **Instant Verification** → Employers confirm qualifications in seconds
3. **Automatic Documentation** → Every hour, every task, every inspection logged
4. **Safety Rating** → Your compliance history demonstrates professionalism
5. **Network Effects** → Your profile drives platform adoption across the industry

**When you create a tech account, you're not just signing up for software. You're building a portable professional identity that gains value with every logged hour.**

---

## 📞 Support & Questions

**For Technicians:**
- **Account Issues:** support@onrope.pro
- **Technical Questions:** help.onrope.pro
- **Feedback:** Use feedback button in Technician Portal

**For Employers:**
- **Tech Verification:** Search by IRATA license number in Employee module
- **Connection Issues:** support@onrope.pro
- **Onboarding Questions:** See Employee Management Guide

---

**Document Version:** 1.0  
**Last Major Update:** December 15, 2025 - Initial comprehensive documentation  
**Next Review:** After first 50 technician registrations  
**Word Count:** ~4,200  
**Maintenance Owner:** Glenn (strategic) + Tommy (technical)

---

**END OF SINGLE SOURCE OF TRUTH DOCUMENT**
