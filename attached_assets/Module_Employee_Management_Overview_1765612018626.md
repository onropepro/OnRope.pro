# Module - Employee Management Overview

**Version:** 2.0 - Single Source of Truth  
**Last Updated:** December 12, 2025  
**Status:** ✅ Validated from Tommy/Glenn Conversation Transcript (December 12, 2025)  
**Purpose:** Authoritative reference for all Employee Management documentation, marketing, and development

---

## 📋 Document Purpose

This is THE definitive source of truth for OnRopePro's Employee Management module. All other materials (website pages, marketing copy, sales decks, support documentation) should derive from this document. Any discrepancies between this document and other materials indicate those materials need updating.

**Validated Sources:**
- Live TSX implementation (EmployeeManagementGuide.tsx)
- Conversation transcript with Tommy dated December 12, 2025
- Fireflies AI problem summary
- Industry requirements (IRATA/SPRAT certification standards)

---

## 🔑 Critical Writing Guidelines

**BEFORE writing any module documentation, you MUST:**

### 1. Review Design Guidelines
**MANDATORY:** Read the changelog section in `/instructions/design-guidelines.md` in the Replit project to ensure your writing follows current standards.

### 2. No Em-Dashes
**NEVER use em-dashes in any content.** They break TSX component rendering.

### 3. Writing Style Requirements
- **Active voice preferred:** "The system calculates payroll" not "Payroll is calculated by the system"
- **Present tense:** "The module tracks progress" not "The module will track progress"
- **Specific numbers:** "10-second onboarding" not "fast onboarding"
- **Conversational but professional:** Write like you're explaining to a colleague

---

## 🎯 The Golden Rule

> **Portable Identity = Zero Redundant Onboarding**

### The Core Principle

Every technician's IRATA or SPRAT certification number becomes their permanent, portable identity across the entire OnRopePro network. When they change employers, their complete professional history follows them instantly.

**The Formula:**
```
Onboarding Time = f(Account Exists?)
- New account: Standard data entry (5-10 minutes)
- Existing account: 10 seconds (enter IRATA number, accept, done)
```

**Why This Matters:** 

The rope access industry has exceptionally high turnover. Tommy described it as "insane" with most technicians changing employers multiple times per season. Traditional onboarding means emailing back and forth, chasing paperwork, manually entering the same information that the tech already gave their last three employers.

With OnRopePro, a tech's certifications, emergency contacts, bank information, and work history travel with them. One notification about an expiring certification can pay for the entire annual subscription.

**Validated Quote (Lines 169-171):**
> "Those technicians have this portable history, this portable. All of their experience, all their information just follows them all everywhere they go...Oh, here's my number. There's my last three years history, all my certifications, everything. Boom. Plug in done onboarding."

---

## ✅ Key Features Summary

**Quick overview of what makes this module powerful:**

| Feature | Description |
|---------|-------------|
| 🆔 **Portable Technician Identity** | IRATA/SPRAT number becomes unique identifier that follows techs between employers |
| ⚠️ **Certification Expiry Alerts** | 30-day warnings for IRATA, SPRAT, driver's license, and First Aid before expiration |
| 🔐 **Granular Permissions** | 14 roles with fully customizable permissions per individual (all start empty except Owner) |
| 📋 **Integrated Onboarding** | Safety document signing built into employee creation workflow |
| 💰 **Compensation Clarity** | Hourly vs piecework toggle with clear payroll integration |
| 🚗 **Driver Eligibility Tracking** | License expiration monitoring for vehicle assignments |
| 🔄 **10-Second Employee Import** | Existing tech accounts plug in instantly with all data |
| 🛡️ **Sensitive Data Encryption** | AES-256-GCM encryption for SIN/SSN and bank details |

---

## ⚠️ Critical Disclaimer

> ⚠️ **Important: Employment Law and Privacy Compliance**
>
> OnRopePro's Employee Management module helps track certifications and manage workforce data, but **OnRopePro is not a substitute for professional legal, HR, or accounting advice.** You are responsible for ensuring compliance with all applicable:
>
> - Federal and provincial/state labor laws (minimum wage, overtime, employment standards)
> - OSHA/WorkSafeBC safety regulations
> - Personal information protection laws (PIPEDA in Canada, state privacy laws in US)
> - Tax withholding and reporting requirements
> - Workers' compensation insurance requirements
>
> **Requirements vary by jurisdiction.** Consult with qualified professionals (attorneys, CPAs, HR consultants) to ensure your specific compliance needs are met.

---

## ✅ Problems Solved (Stakeholder-Segmented)

**The Employee Management module solves different problems for different stakeholders.** This section is organized by user type to help each stakeholder immediately identify the pain points most relevant to them.

---

## 💼 For Rope Access Company Owners

### Problem 1: "I didn't know his cert was expired until WorkSafeBC showed up"

**The Pain:**
You're running a busy season. Jobs are stacked, crews are deployed across multiple sites, and you're juggling a hundred things. Keeping track of when every technician's IRATA certification expires? It falls through the cracks. You assume your guys are handling their own renewals. Then WorkSafeBC arrives for a site inspection.

**Real Example:**
Tommy described a near-catastrophe: "We had a guy on rope one day and WorkSafeBC showed up and we called the guy that was on rope and were like, get off your rope and leave...Because the guy did not have his certification renewed." They caught it in time. If they hadn't, the entire job site would have been shut down.

**The Solution:**
OnRopePro monitors every certification with automated 30-day warning alerts. The system displays visual indicators (green/amber/red) so expiring certs are impossible to miss. You get notified before it becomes a crisis.

**The Benefit:**
One certification alert preventing a WorkSafeBC shutdown pays for your entire annual subscription. Beyond the direct cost, you avoid project delays, client relationship damage, and potential legal liability.

**Validated Quote (Lines 109-116):**
> "One notification could pay for the entire app...You get one notification that somebody's IRATA is up for renewal. They go and renew and WorkSafeBC stops by and hey, they've got a valid certificate, everything's great."

---

### Problem 2: "Onboarding takes hours of back-and-forth emails"

**The Pain:**
Every new hire means the same dance: email asking for their info, wait for response, chase the missing pieces, manually enter everything into your systems, email the safety documents, wait for signatures, follow up again. It takes hours per employee, and with the industry's high turnover, you're doing this constantly.

**Real Example:**
A typical owner's process: "He does the interview and then if he hires a guy, he sends them an email like, oh, welcome to the company...please fill out this and then send me your void check, blah, blah. And then he gets that email and enters it all and whatever."

**The Solution:**
Two pathways eliminate this chaos:
1. **Existing OnRopePro user:** Enter their IRATA number, they accept the connection, done. 10 seconds. Their emergency contacts, bank info, certifications, work history, everything is already there.
2. **New user:** They fill out their profile once on their own time. You just link them to your company.

**The Benefit:**
Reduce onboarding from hours to seconds. Eliminate 100% of email exchanges for employee data collection. Free up administrative time for actual business development.

**Validated Quote (Lines 156-161):**
> "10 seconds. Your employee is in your system. All you have to enter is their wage, but you have their emergency contact, you have their sin number, you have their bank information. There's no email, no text, nothing. You enter their license number, they accept, done."

---

### Problem 3: "We use 8 different apps and nothing talks to each other"

**The Pain:**
Your company has grown organically, adopting tools as needs arose. Now you've got Replicon for timesheets, PayWork for pay stubs, GeoTab for vehicle tracking, Bamboo HR for reviews, WorkHub and ISNetworld for certifications, OneDrive for documents, WhatsApp for job communication, and Excel for scheduling. Each system has its own login, its own quirks, and none of them share data.

**Real Example:**
Tommy's experience at Ambipar: "When you log in with Replicon, you have to enter the company, your username, then your password. And then they changed it to Ambipar. So now the app doesn't make the change. So every single time you log in, it goes back to Ridgeline. Now you have to enter Ambipar Response Canada Inc., your username. And then you log in. Then it asks you for a code..." He described navigating through multiple systems daily, with everyone hating the complexity.

**The Solution:**
OnRopePro consolidates employee management, time tracking, payroll prep, certification monitoring, safety compliance, and document management into one integrated platform. One login, one source of truth, one system that actually works together.

**The Benefit:**
Stop paying for 8 subscriptions that don't integrate. Eliminate the cognitive load of context-switching between systems. Reduce training time for new hires. Actually know where your data lives.

**Validated Quote (Lines 42-55):**
> "The apps, everybody hates that system or the million systems they have. It could be so much more simple. Like everything could be in either replicon or in PA work, but they have to make it in two."

---

### Problem 4: "My operations manager might be talking to competitors"

**The Pain:**
You've given your operations manager broad system access because they need it to do their job. But now you're suspicious they might be sharing information with another company. You need to protect your client lists, pricing, and strategic data, but you can't just fire them without proof, and you can't run operations without someone in that role.

**Real Example:**
Tommy described a real scenario: "You're suspecting that your manager is talking with another company. Okay. I need to protect all my information here. There you go. Now all you can do is clock in and clock out."

**The Solution:**
Granular permissions allow you to modify access in real-time without changing someone's job title. Every role starts with zero permissions (except Owner), and you configure exactly what each person can see and do. Remove financial access, hide client information, restrict to basic functions, all without a formal demotion.

**The Benefit:**
Protect sensitive business information while maintaining operational continuity. Respond to trust concerns immediately without HR complications. Document access changes for potential legal proceedings.

**Validated Quote (Lines 256-258):**
> "My operations manager started doing drugs and he's not all there and I want to remove all financial permission and I want to remove...I'm just going to put him as a rope tech for a little bit. I'm going to take all of like creating projects and all that out of it. He's still my operations manager."

---

### Problem 5: "One of my guys drove our truck for two months with an expired license"

**The Pain:**
You check driver's licenses when you hire someone. But what happens when that license expires six months later? You're not thinking about it. They're probably not either. And then they're driving your company vehicle without valid credentials, and you don't know until something goes wrong.

**Real Example:**
Tommy's story: "One of our guys from Mexico was on a visa here and his Mexico license expired. Nobody knew. And he drove the company vehicle for two months." If there had been an accident, the liability exposure would have been catastrophic.

**The Solution:**
OnRopePro tracks driver's license expiration dates alongside certifications. The same 30-day warning system that protects you from IRATA lapses protects you from license lapses. Visual indicators make expiring licenses visible before they become problems.

**The Benefit:**
Prevent one insurance claim denial or liability lawsuit and you've justified years of subscription costs. Protect your vehicles, your drivers, and your company from preventable legal exposure.

**Validated Quote (Lines 191-196):**
> "One notification can pay for the entire app. Guy's driving without his license. Crash is the company vehicle. Pretty big deal."

---

## 📋 For Operations Managers & Supervisors

### Problem 6: "I can't remember who's certified for what"

**The Pain:**
You're assigning crews to jobs and you need to know: Does this tech have their IRATA Level 2? Is their first aid current? Can they legally drive the company truck? You're trying to remember, or flipping through files, or texting people to ask.

**The Solution:**
Every employee's full certification profile is visible at a glance. IRATA level, expiration date, first aid status, driver's license, all in one place with clear visual indicators for current, expiring, or expired status.

**The Benefit:**
Make crew assignments confidently. Stop the mental gymnastics of tracking who can do what. Prevent accidentally sending unqualified techs to jobs.

---

### Problem 7: "I need to know who's available without calling everyone"

**The Pain:**
When you're scheduling a job, you're calling or texting each tech individually to check availability. It's time-consuming and frustrating for everyone.

**The Solution:**
Employee profiles integrate with the scheduling module. See who's already assigned, who's available, and who has the right certifications for the job type.

**The Benefit:**
Schedule in minutes instead of hours. Reduce interruption fatigue for your technicians. Make data-driven crew decisions.

---

## 👷 For Rope Access Technicians

### Problem 8: "Every new employer makes me fill out the same paperwork"

**The Pain:**
You've given your IRATA number, emergency contact, bank details, and SIN to every employer you've ever worked for. Each time you switch companies (which is often in this industry), you're starting from scratch. Same forms, same information, same tedious data entry.

**Real Example:**
Tommy noted: "The turnover of employees in rope access, building maintenance is insane. Like, in one season, you'll have...there's a lot that come, they find better pay somewhere else. Three weeks later, they're gone."

**The Solution:**
Create your OnRopePro profile once. Your information stays with you. When you join a new company, they enter your IRATA number, you accept the connection, and you're done. Your certifications, emergency contacts, bank info, work history, it all transfers instantly.

**The Benefit:**
Fill out paperwork once in your career instead of once per employer. Start working immediately instead of waiting for admin processing. Maintain a complete professional history that demonstrates your experience.

**Validated Quote (Lines 169-174):**
> "Those technicians have this portable history...All of their experience, all their information just follows them all everywhere they go...I work for three years and then I go to Alberta and I go to work for a company, Alberta. Oh, here's my number. There's my last three years history, all my certifications, everything. Boom. Plug in done onboarding."

---

### Problem 9: "I never know if my certifications are about to expire"

**The Pain:**
You're focused on the job, not calendar dates. Your IRATA cert expires, your first aid lapses, and suddenly you can't work until you get recertified. Lost income, scrambling to schedule training, maybe even losing your position to someone else.

**The Solution:**
OnRopePro tracks your certification dates and alerts you before expiration. You see your own status, so you can proactively renew instead of reactively scrambling.

**The Benefit:**
Never get caught off-guard by an expired cert. Maintain continuous work eligibility. Plan renewals on your schedule instead of emergency basis.

---

### Problem 10: "I can log in with my IRATA number OR my email"

**The Pain:**
Different systems require different login credentials. Remembering which username goes where is frustrating.

**The Solution:**
OnRopePro allows login with either your IRATA/SPRAT certification number or your email address. Your certification number becomes your universal identifier.

**The Benefit:**
One less password to remember. Login method that actually makes sense for rope access professionals.

**Validated Quote (Lines 207-211):**
> "If they have an IRATA number...that is their account number...they can sign in with their IRATA number and their email."

---

## 📅 Using Employee Management (Step-by-Step)

### Adding Employees: Two Pathways

OnRopePro supports two distinct workflows for adding employees, depending on whether the technician already has an OnRopePro account.

---

### Pathway A: Existing OnRopePro User (10-Second Onboarding)

**Step 1: Enter IRATA/SPRAT Number**
Enter the technician's certification number. The system searches for their existing account.

**Step 2: Send Connection Request**
Click to send a connection request. The technician receives a notification.

**Step 3: Technician Accepts**
The technician reviews and accepts the connection request from their account.

**Step 4: Configure Compensation Only**
Enter the hourly rate or piecework terms for this specific employment relationship. All other data (emergency contacts, bank info, certifications) transfers automatically.

**Step 5: Assign Required Safety Documents**
If your company has required safety documents (harness inspection acknowledgment, toolbox meeting participation), these are automatically queued for the new employee to sign.

**What Happens Automatically:**
✅ All personal information transfers from their existing profile  
✅ Certification data and expiration dates are already tracked  
✅ Emergency contact information is already complete  
✅ Bank/payment information is already on file  
✅ Work history from previous employers is preserved  
✅ Employee appears in scheduling and assignment lists

**Time Required:** 10 seconds (excluding technician acceptance)

---

### Pathway B: New OnRopePro User (Standard Onboarding)

**Step 1: Basic Information**
Enter employee name, email address, and phone number. The email will be used for login credentials.

**Step 2: Role Assignment**
Select from 14 available roles across management and field positions. Remember: all roles start with zero permissions except Company Owner. You'll configure specific permissions after creation.

**Available Roles:**

*Management Roles:*
- Company (full system access including billing)
- Owner/CEO (executive-level access)
- Operations Manager (day-to-day operations control)
- Human Resources (employee management focus)
- Accounting (financial data access)
- General Supervisor (multi-team oversight)
- Rope Access Supervisor (rope team oversight)
- Account Manager (client relationship focus)

*Worker Roles:*
- Rope Access Tech (primary field technician role)
- Supervisor (generic supervisor role)
- Manager (site or project manager)
- Ground Crew (ground-level support)
- Ground Crew Supervisor (ground team lead)
- Labourer (general labor support)

**Step 3: Certification Details**
Enter IRATA certification level (1, 2, or 3) and expiration date. Optionally add:
- SPRAT certification (alternative to IRATA)
- Driver's license number, province/state, and expiration
- First Aid certification type and expiration
- Years of rope access experience
- Rope access specialties

**Step 4: Compensation Setup**
Configure hourly rate for payroll calculations. Toggle between:
- **Hourly:** Standard hourly wage calculation
- **Piecework:** Payment based on completed units/drops

**Step 5: Safety Documents (If Applicable)**
New employees are automatically assigned any required company safety documents for signing. This happens as part of onboarding, not as a separate step.

**Step 6: Employee Created**
The employee receives login credentials via email and can access the system based on their assigned role. They appear in scheduling and assignment lists.

**Time Required:** 5-10 minutes (excluding employee account setup)

---

## 👤 Employee Profile Fields

Each employee profile contains comprehensive information for workforce management. This section documents all available fields from the employer's perspective.

### Personal Information
| Field | Required | Purpose |
|-------|----------|---------|
| Full name | Yes | Display and identification |
| Email address | Yes | Login credentials, notifications |
| Phone number | Yes | Contact and emergencies |
| Profile photo | No | Visual identification |
| Birthday | No | HR records, optional celebrations |
| Start date | Recommended | Employment tenure tracking |
| Home address | Recommended | Full address including street, city, province/state, country, postal/zip code |

### Certifications
| Field | Required | Purpose |
|-------|----------|---------|
| IRATA Level (1, 2, or 3) | Recommended | Certification compliance, work eligibility |
| IRATA license number | Recommended | Unique identifier, login credential |
| IRATA expiration date | Recommended | Expiry monitoring, compliance alerts |
| SPRAT certification | Optional | Alternative to IRATA for US-based techs |
| Driver's license number | Recommended | Vehicle assignment eligibility |
| Driver's license province/state | Recommended | Jurisdiction tracking |
| Driver's license expiration | Recommended | Expiry monitoring for vehicle assignment |
| First Aid certification type | Optional | Safety compliance |
| First Aid expiration | Optional | Expiry monitoring |
| Years of rope access experience | Optional | Crew assignment decisions |
| Rope access specialties | Optional | Skill-based assignment |

### Emergency Contact
| Field | Required | Purpose |
|-------|----------|---------|
| Contact name | Recommended | Emergency notification |
| Contact phone number | Recommended | Emergency communication |
| Relationship | Recommended | Context for emergency responders |

### Compensation
| Field | Required | Purpose |
|-------|----------|---------|
| Compensation type | Yes | Hourly vs piecework toggle |
| Hourly rate | Conditional | Required if hourly compensation |
| Annual salary amount | Conditional | Required if salaried |

### Sensitive Information (Encrypted)
| Field | Required | Purpose |
|-------|----------|---------|
| Social Insurance Number (Canada) / Social Security Number (US) | For payroll | Tax reporting, government compliance |
| Bank institution number | For payroll | Direct deposit setup |
| Bank transit number | For payroll | Direct deposit setup |
| Bank account number | For payroll | Direct deposit setup |
| Void cheque document | Optional | Banking verification |
| Special medical conditions | Optional | Safety/emergency awareness |

**Note:** All sensitive information is encrypted at rest using AES-256-GCM encryption.

---

## 🛡️ Role Hierarchy & Permissions

### The Permission Model

**Critical Understanding:** All roles (except Company Owner) start with **zero permissions**. When you create a role assignment, you must explicitly grant each permission the employee needs. This provides maximum flexibility but requires intentional configuration.

**The Golden Rule for Permissions:**
> Company Owner has all permissions, always. Everyone else has only what you explicitly grant.

**Validated Quote (Lines 219-220):**
> "Are there predefined role permissions for each of those?" ... "No, they're all empty when you open it. They're all empty. And you go through it and decide what you want to give."

### Available Permissions

| Permission | Description |
|------------|-------------|
| View Financial Data | Access to pricing, costs, profitability metrics |
| Manage Employees | Create, edit, deactivate employee records |
| View Performance | Access to productivity and work metrics |
| Manage Inventory | Assign, track, modify equipment records |
| View Safety Documents | Access to safety forms and compliance records |
| Access Payroll | View and process payroll calculations |
| Create Projects | Initiate new projects and jobs |
| View All Projects | See projects beyond directly assigned |
| Manage Scheduling | Create and modify job schedules |
| View Client Information | Access client contact and contract details |

### Why Granular Permissions Matter

**Real-World Scenario:**
Your operations manager has been with you for two years and has broad system access. You start suspecting they're in talks with a competitor. You can't prove anything yet, and you need them to keep running operations. What do you do?

With granular permissions, you can immediately restrict their access to sensitive information (client lists, pricing, financial data) while maintaining their ability to perform core operational tasks (scheduling, crew management, job assignments). No demotion, no HR complication, just adjusted access until you resolve the situation.

**Validated Quote (Lines 256-258):**
> "My operations manager started doing drugs and he's not all there and I want to remove all financial permission...He's still my operations manager...There you go. Now all you can do is clock in and clock out."

---

## 🔔 Certification Expiry Alert System

### How Alerts Work

The system monitors all tracked certifications (IRATA, SPRAT, driver's license, First Aid) and displays visual status indicators:

| Status | Time Remaining | Visual Indicator |
|--------|----------------|------------------|
| **Valid** | 60+ days | Green |
| **Warning** | 30-60 days | Amber |
| **Critical** | 1-30 days | Red (flashing) |
| **Expired** | 0 days | Red with "EXPIRED" badge |

### Alert Channels

- Dashboard visual indicators (always visible)
- Email notifications to employee and designated managers
- Mobile push notifications (if app installed)

### Why 30 Days?

IRATA recertification requires booking an assessment, which may have limited availability. 30 days provides adequate lead time for:
- Finding an available assessment slot
- Arranging travel if needed
- Completing any required pre-assessment training
- Processing paperwork post-assessment

**The Business Case:**

> "One notification could pay for the entire app."

**Validated Quote (Lines 113-120):**
> "We had a guy on rope one day and WorkSafeBC showed up and we called the guy that was on rope and were like, get off your rope and leave...Because the guy did not have his certification renewed."

---

## ⚙️ Administrative Actions

### Password Reset

Administrators can reset employee passwords when needed. A temporary password is generated and must be changed on first login.

**Access:** Owner/Manager Only

### Employee Termination

Terminated employees lose system access but their historical data (work sessions, safety forms, equipment assignments, payroll history) is preserved for compliance records.

**Access:** Owner/Manager Only

### Data Preservation Policy

When an employee is terminated, their account is deactivated but all associated records are preserved. This includes:
- Work sessions and time entries
- Safety form submissions and signatures
- Equipment assignments and return records
- Payroll history and payment records
- Project participation history

**Why Preserve Data?**
- Regulatory compliance (labor law record retention requirements)
- Audit trail maintenance
- Historical accuracy for client reporting
- Liability protection (proof of safety compliance, work performed)

---

## 💰 Quantified Business Impact

### Time Savings (Per New Hire)

| Activity | Before OnRopePro | With OnRopePro | Time Saved |
|----------|------------------|----------------|------------|
| **Email exchanges for info** | 30-60 min | 0 min | **30-60 min** |
| **Manual data entry** | 15-20 min | 10 sec (existing) / 5 min (new) | **10-19 min** |
| **Chasing missing documents** | 20-40 min | 0 min | **20-40 min** |
| **Safety document signing** | 15-30 min | Automatic | **15-30 min** |

**Total Per Hire:** 75-150 minutes saved

**Annual Value (assuming 15 hires/year at high turnover):**
- Conservative: 15 hires × 75 min = 18.75 hours × $50/hour = **$937**
- Realistic: 15 hires × 112 min = 28 hours × $75/hour = **$2,100**

### Risk Mitigation Value

| Risk Event | Potential Cost | Prevention Through |
|------------|----------------|-------------------|
| WorkSafeBC shutdown (expired cert) | $5,000-50,000+ | Certification alerts |
| OSHA violation (no valid certification) | Up to $156,259 per violation | Certification tracking |
| Vehicle accident (expired license) | $10,000-100,000+ | License expiry monitoring |
| Insurance claim denial | Full loss amount | Compliance documentation |

**One prevented incident pays for years of subscription.**

### Productivity Gains

- **Scheduling efficiency:** Crew assignment takes minutes instead of hours
- **Compliance confidence:** 100% visibility into certification status
- **Administrative reduction:** 80+ hours/month freed from manual tracking

---

## 🔗 Module Integration Points

Employee Management connects to multiple OnRopePro modules:

### 📅 Scheduling Module
**Integration:**
- Employees appear in scheduling assignment lists after creation
- Only employees with valid certifications can be assigned to jobs
- Availability and assignment conflicts are automatically tracked

**Business Value:**
- Prevent assigning unqualified techs to jobs
- See who's available at a glance
- Reduce scheduling conflicts

### 💰 Payroll Module
**Integration:**
- Compensation settings (hourly rate, piecework) feed directly into payroll calculations
- Time entries link to employee records
- Payment history maintained per employee

**Business Value:**
- Accurate payroll with no manual rate lookup
- Clear audit trail for all payments
- Compensation changes tracked with history

### 🛡️ Safety & Compliance Module
**Integration:**
- Safety document signing can be part of onboarding workflow
- Signed documents linked to employee profile
- Safety compliance visible on employee record

**Business Value:**
- Ensure all required documents signed before work begins
- Easy audit of who signed what and when
- Compliance status at a glance

**Validated Quote (Lines 162-167):**
> "Signing the document could be part of the onboarding system for the employee...So now the employers don't even have to worry now about if the employee signed the document because you have to in order to..."

### 📦 Inventory Module
**Integration:**
- Equipment can be assigned to specific employees
- Assignment history tracked per employee
- Return tracking when employee leaves

**Business Value:**
- Know who has what equipment
- Track equipment lifecycle per user
- Facilitate return process on termination

### 🚗 Vehicle Assignment
**Integration:**
- Driver's license tracking tied to vehicle assignment eligibility
- Expired licenses flag employees as ineligible for vehicle assignment

**Business Value:**
- Prevent unqualified drivers from using company vehicles
- Reduce liability exposure
- Automated eligibility checking

---

## 📖 Terminology & Naming

### Core Terms

**Portable Identity**
- **Definition:** An employee's professional profile that travels with them between employers, tied to their IRATA/SPRAT certification number
- **Example:** A tech who worked for Company A for 2 years joins Company B. Their full history, certifications, and profile transfer instantly.
- **Why it matters:** Eliminates redundant onboarding, creates industry-wide professional records

**Granular Permissions**
- **Definition:** Individual feature-level access controls assigned per employee, independent of their role title
- **Example:** An Operations Manager might have access to scheduling but not financial data
- **Why it matters:** Provides flexibility to match access to trust level and job requirements

**Connection Request**
- **Definition:** The process by which an employer links to an existing technician's OnRopePro account
- **Example:** Employer enters IRATA number, tech receives notification, accepts, connection established
- **Why it matters:** This is the 10-second onboarding path for existing users

### Industry Terms Explained

**IRATA (Industrial Rope Access Trade Association)**
- **Plain English:** The international certification body for rope access technicians
- **Technical Definition:** Global organization that sets standards and certifies rope access technicians at Levels 1, 2, and 3
- **OnRopePro Context:** IRATA number serves as unique identifier and optional login credential

**SPRAT (Society of Professional Rope Access Technicians)**
- **Plain English:** The North American equivalent to IRATA certification
- **Technical Definition:** US-based organization that certifies rope access technicians
- **OnRopePro Context:** SPRAT certification tracked alongside or as alternative to IRATA

**Piecework**
- **Plain English:** Getting paid per completed unit of work rather than per hour
- **Technical Definition:** Compensation calculated based on drops, windows, or other measurable units completed
- **OnRopePro Context:** Toggle between hourly and piecework in compensation settings

### Common Abbreviations

| Abbreviation | Full Term | Meaning |
|--------------|-----------|---------|
| SIN | Social Insurance Number | Canadian equivalent of SSN |
| SSN | Social Security Number | US tax identification number |
| L1/L2/L3 | Level 1/2/3 | IRATA certification levels |

---

## ❓ Frequently Asked Questions

### "Can technicians login with their IRATA number instead of email?"

**Answer:** Yes. Technicians can log in using either their IRATA/SPRAT certification number or their email address. The certification number serves as a unique identifier across the platform.

**Validated Quote (Lines 207-211):**
> "They can sign in with their IRATA number and their email."

---

### "What happens when I hire a tech who already has an OnRopePro account?"

**Answer:** Enter their IRATA/SPRAT number, send a connection request, and once they accept, their full profile transfers to your company. You only need to enter their compensation rate. All other information (emergency contacts, bank details, certifications, work history) is already complete.

**Time required:** 10 seconds (excluding their acceptance)

---

### "Are role permissions predefined or do I have to set them up?"

**Answer:** All roles except Company Owner start with zero permissions. You must explicitly grant each permission the employee needs. This provides maximum flexibility but requires intentional configuration.

**Why this approach:** It prevents accidental over-permission and allows you to precisely match access to job requirements and trust level.

**Validated Quote (Lines 219-220):**
> "No, they're all empty when you open it. They're all empty. And you go through it and decide what you want to give."

---

### "Does the system alert for driver's license expiration too?"

**Answer:** Yes. Driver's license expiration dates are tracked and included in the same alert system as IRATA/SPRAT certifications. Visual indicators and notifications function identically.

---

### "What happens to data when an employee is terminated?"

**Answer:** The employee loses system access immediately, but all their historical data is preserved. Work sessions, safety documents, equipment assignments, and payroll history remain in the system for compliance and audit purposes. This is a soft delete, not a hard delete.

---

### "Can I use this for employees who aren't rope access technicians?"

**Answer:** Yes. While the certification tracking is designed for rope access (IRATA/SPRAT), the module supports roles like Labourer, Ground Crew, and general support staff who may not have rope access certifications. Simply leave certification fields empty for non-certified staff.

---

## 🎓 Best Practices & Tips

### For Company Owners

**Do:**
- ✅ Set up certification alerts immediately after employee creation (don't assume you'll remember to check)
- ✅ Require safety document signing as part of onboarding workflow
- ✅ Review permission assignments quarterly (trust levels change)
- ✅ Track driver's licenses for anyone who might use company vehicles
- ✅ Use existing OnRopePro accounts when hiring (10-second onboarding)

**Don't:**
- ❌ Assume employees will self-report expiring certifications (they won't)
- ❌ Give blanket permissions based on role title alone (configure granularly)
- ❌ Skip driver's license tracking for vehicle-assigned employees
- ❌ Delete employee records when they leave (use termination instead)

### For Operations Managers

**Do:**
- ✅ Check certification status before crew assignment
- ✅ Use the scheduling integration for availability checks
- ✅ Report suspicious permission needs to company owner

**Don't:**
- ❌ Assign techs to jobs without verifying certification validity
- ❌ Ignore amber warning indicators (address before they turn red)

### For Technicians

**Do:**
- ✅ Keep your OnRopePro profile updated across all employers
- ✅ Respond promptly to connection requests from new employers
- ✅ Set personal reminders for certification renewal (in addition to system alerts)
- ✅ Use your IRATA number as login for simplicity

**Don't:**
- ❌ Create a new account for each employer (use your existing portable identity)
- ❌ Ignore expiration warnings (you can't work with expired certs)

---

## 📊 Quick Reference Tables

### Required vs Optional Fields

| Field | Required | Recommended | Optional |
|-------|----------|-------------|----------|
| Name | ✅ | | |
| Email | ✅ | | |
| Phone | ✅ | | |
| Role | ✅ | | |
| IRATA Level | | ✅ | |
| IRATA Expiration | | ✅ | |
| Driver's License | | ✅ | |
| Hourly Rate | | ✅ | |
| Emergency Contact | | ✅ | |
| Birthday | | | ✅ |
| Profile Photo | | | ✅ |
| First Aid Cert | | | ✅ |

### Certification Status Indicators

| Status | Color | Action Required |
|--------|-------|-----------------|
| Valid (60+ days) | Green | None |
| Warning (30-60 days) | Amber | Plan renewal |
| Critical (1-30 days) | Red | Immediate renewal |
| Expired | Red + Badge | Cannot work until renewed |

---

## 📚 Related Documentation

**For Company Owners:**
- Payroll & Time Tracking Guide: Compensation integration details
- Safety & Compliance Guide: Document signing workflow
- Scheduling Guide: Crew assignment and availability

**For Operations Managers:**
- Project Management Guide: Job assignment workflow
- Inventory Guide: Equipment assignment to employees

**For Technicians:**
- Technician Self-Registration Guide: Creating your portable profile
- Mobile App Guide: Accessing your profile on the go

---

## 📄 Summary: Why Employee Management Is Different

**Most workforce management software treats employees as employer-owned records.** OnRopePro recognizes that in rope access, technicians are highly mobile professionals whose careers span multiple employers. The platform creates portable professional identities that:

1. **Follow technicians** → Between employers, across provinces/states, throughout careers
2. **Eliminate redundancy** → Fill out paperwork once, not once per employer
3. **Maintain compliance** → Certifications tracked regardless of current employment
4. **Enable instant onboarding** → 10 seconds to add an existing OnRopePro user
5. **Protect employers** → Granular permissions, certification alerts, compliance documentation
6. **Build industry data** → Professional histories that demonstrate qualification and experience

**When you add an employee in OnRopePro, you're not just creating a personnel record. You're connecting to a professional identity that makes onboarding instant, compliance automatic, and workforce management actually manageable.**

---

## 📞 Support & Questions

**For Company Owners:**
- **Technical setup:** support@onrope.pro
- **Feature requests:** feedback@onrope.pro
- **Account/billing:** accounts@onrope.pro

**For Employees:**
- **Account access issues:** Contact your employer's OnRopePro administrator
- **Profile updates:** Self-service through Technician Portal
- **Certification questions:** support@onrope.pro

---

**Document Version:** 2.0  
**Last Major Update:** December 12, 2025 - Complete rewrite from validated transcript  
**Next Review:** After Tommy technical validation  
**Word Count:** ~4,800  
**Maintenance Owner:** Glenn (strategic) + Tommy (technical)

---

**END OF SINGLE SOURCE OF TRUTH DOCUMENT**
