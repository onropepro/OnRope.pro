# Client Relationship Management (CRM) - SSOT v1.0

**Version:** 1.0  
**Last Updated:** December 17, 2025  
**Status:** ✅ Single Source of Truth  
**Validated Against:** Tommy-Glenn conversation transcript (Dec 17, 2025), CRMGuide.tsx, Fireflies AI summary

---

## Document Purpose

This Single Source of Truth (SSOT) document contains the complete, validated specification for the Client Relationship Management module based on:
- Conversation transcript with Tommy (Technical Lead, IRATA L3), Lines 1-176
- Current implementation in CRMGuide.tsx (619 lines)
- Fireflies AI summary (10 problems solved)
- MODULE_DOCUMENTATION_SKELETON_FRAMEWORK requirements

**All features documented here are sourced from either:**
1. Actual conversation transcript (line numbers cited)
2. Implemented code (file paths referenced)
3. Validated customer conversations

**No theoretical features included.**

---

## Executive Summary

The Client Relationship Management module serves as the **central integration hub** connecting clients, buildings, projects, billing, and contact management. It eliminates repeated data entry, centralizes building specifications, and enables autofill intelligence that dramatically speeds project creation.

**Key Success Metrics:**
- One-time data entry for clients and buildings
- Automatic field population when creating projects
- Centralized building specs (floors, drops, parking) for operational planning
- Permission-controlled access to client records
- Foundation for future shared building database

**Core Value Proposition:** The subscription cost equals approximately one technician hour monthly ($34), but saves dozens of hours in administrative work.

**Validated Quote (Lines 157-160):**
> "The $99 a month... it's like hiring three people for one hour a month... We'll save like 20 hours per employee per month."

---

## The Golden Rule: Clients Carry Building Data

> **One Client = Multiple Buildings**

The client-building relationship is **hierarchical**. Each client stores:
- **Contact Information:** Name, phone, email, address
- **LMS Numbers:** Array of buildings with strata plans, addresses, and specs
- **Billing Details:** Separate billing address if different from service address

**Regional Terminology Note (Lines 22-26):**
Building IDs vary by region:
- Vancouver: LMS (Land Management System) and EMS
- Vancouver Island: VIS (Vancouver Island Strata)

OnRopePro uses "LMS" as the generic term for all strata/building identifiers.

**Validated Quote (Lines 25-26):**
> "All Vancouver Island properties are VIS. And then in Vancouver you have LMS and EMS."

---

## Key Features Summary

| Feature | Description |
|---------|-------------|
| 🏢 **Multi-Building Support** | One client can manage unlimited buildings with individual specifications |
| ⚡ **Autofill Intelligence** | Auto-populate project details (address, floors, drops) from client selection |
| 🔢 **LMS Tracking** | Strata plan numbers linked to buildings with full building specs |
| 📊 **Building Specifications** | Store floors, units, parking stalls, elevation drop counts permanently |
| 🔄 **Reverse Client Creation** | Create project first, system prompts to save as new client automatically |
| 🔒 **Permission Controls** | View-only and manage permissions for client record access |
| 🔍 **Search Functionality** | Find any record by client, building, address, or LMS number |
| 🔗 **Central Hub Integration** | Connects projects, billing, and contact management in one system |

---

## ✅ Problems Solved (Stakeholder-Segmented)

The CRM module solves different problems for different stakeholders. This section is organized by user type.

---

## 👔 For Rope Access Company Owners

### Problem 1: "I'm entering the same building information over and over again"

**The Pain:**
Every time you start a new project at the same building, you're manually re-entering floor counts, drop targets, addresses, and contact information. This wastes time, introduces errors, and creates inconsistent data across projects.

**Real Example:**
Strata Corp Ltd manages 3 buildings. Every year you do window cleaning at all three. Without centralized records, you're re-entering 25 floors, 4 elevation drop counts, parking stall info, and contact details for each building, for each project. That's potentially 36+ manual data entries per year for one client.

**The Solution:**
Enter client and building information once. When creating future projects, select the client from a dropdown and the system auto-populates all building specifications. One-time entry, permanent records.

**The Benefit:**
Eliminates repeated data entry entirely. Building specs entered in 2025 auto-populate in 2026 and beyond.

**Validated Quote (Lines 37):**
> "In 2025, you do building A... it saves all the details under your client. And then in 2026, you go back to that building. Now you just have to pick your client with the building associated with that client."

---

### Problem 2: "Our client information is scattered across Excel, texts, and paper"

**The Pain:**
Contact details live in one spreadsheet, building specs in another, billing addresses in emails, and drop counts in text messages. Finding information means digging through multiple systems. Information gets lost, outdated, or contradictory.

**Real Example:**
Property manager Jane Doe calls about building LMS-1234. You need her phone number, the building address, how many floors, and last year's drop targets. That information exists in 4 different places, and you're not sure which version is current.

**The Solution:**
All contact details, building specs, and related data organized in one digital space. Search by client name, building address, or LMS number to find everything instantly.

**The Benefit:**
No more digging through old files or photos. Every record accessible in seconds. Data stays consistent and current.

**Validated Quote (Lines 21):**
> "The CRM system provides centralized management of property managers', strata, company and building owners."

---

### Problem 3: "Manual data entry errors are costing us money and credibility"

**The Pain:**
Every time you manually type building specs, there's a chance of transposing numbers, misspelling addresses, or entering wrong floor counts. Errors mean wrong equipment, inaccurate quotes, and embarrassing mistakes in front of clients.

**Real Example:**
You type "15 floors" instead of "25 floors" for a new project. The crew shows up with short ropes. Half-day wasted, emergency equipment run, client questioning your professionalism.

**The Solution:**
Autofill intelligence eliminates manual entry. Building specs flow automatically from stored client records. The same verified data used for every project.

**The Benefit:**
Near-zero data entry errors. Consistent, accurate information across all projects.

---

### Problem 4: "Setting up new projects takes too long"

**The Pain:**
Creating a new project means manually entering: client name, contact info, building address, floor count, unit count, parking stalls, daily drop targets, and 4-elevation drop counts. Even for repeat clients, this takes 10-15 minutes of tedious typing.

**Real Example:**
You get 3 new contracts in one day. Entering all the details properly takes 45 minutes of pure admin work before you can even schedule crews.

**The Solution:**
Select client from dropdown. If client has multiple buildings, select building. System auto-populates: strata plan number, building name, building address, floor count, daily drop target, north/east/south/west drops, unit count, and parking stalls.

**The Benefit:**
Project creation in under 2 minutes instead of 15. Save hours weekly on administrative setup.

**Validated Quote (Lines 27):**
> "When creating a new project, select a client from your CRM to auto populate building details like strata plan number address, floor count, and daily drop target."

---

### Problem 5: "The system costs money but I'm not sure it's worth it"

**The Pain:**
Another software subscription. Another monthly bill. How do you know it actually saves money versus just being another expense?

**Real Example:**
You're paying $99/month for software. Is that worth it?

**The Solution:**
The subscription cost equals approximately one hour of Level 2 technician pay per seat. The system saves 20+ hours per employee per month in administrative work.

**The Benefit:**
Net positive ROI from day one. You're not paying for software, you're paying for time. And getting 20x return.

**Validated Quote (Lines 157-169):**
> "The price... $34... right on target for like a level two pay on building maintenance. One hour. And it pays... it's like hiring three people for one hour a month. And you need to do all this... Impossible."

---

## 📋 For Operations Managers & Supervisors

### Problem 6: "I need building specs for equipment planning but can't find them"

**The Pain:**
You're scheduling a crew for tomorrow. You need to know: How many floors? What rope lengths required? How many parking stalls available? This information exists somewhere, but where?

**Real Example:**
Building LMS-4567 is scheduled for Wednesday. The new technician asks what rope length to bring. You don't have that building's specs handy. You call the owner. They're in a meeting. The technician brings wrong equipment.

**The Solution:**
Building specifications (floors, drops, parking) stored permanently and accessible to anyone with view permissions. Floor count directly determines equipment requirements.

**The Benefit:**
Equipment planning based on accurate specs. Right gear, right building, every time.

**Validated Quote (Lines 139):**
> "It will be used for the project to know what kind of equipment you need to bring on site. You're not going to bring a 400 foot rope for a 10 story building."

---

### Problem 7: "Estimating job duration is guesswork"

**The Pain:**
How long will this building take? You're guessing based on memory. A 10-story building versus a 50-story building requires completely different time estimates, but without specs accessible, you're making assumptions.

**Real Example:**
You quote 3 days for "the downtown building." It's actually 50 floors, not the 30 you remembered. Job runs 2 days over. Profit margin destroyed.

**The Solution:**
Floor count and drop targets stored per building. Stories field determines how long drops take. Accurate data for accurate estimates.

**The Benefit:**
Data-driven scheduling and quoting. Historical accuracy for future planning.

**Validated Quote (Lines 135):**
> "Stories is used to count how long to determine how long a drop will take because it will be different on a 10 story building than in a 50 story building."

---

## 🏢 For Building Managers & Property Managers

### Problem 8: "Contractors never remember my building's details"

**The Pain:**
Every year it's the same questions: "How many floors?" "Where can we park?" "What's the address again?" You've told them 5 times. It feels unprofessional and wastes your time.

**Real Example:**
Your preferred window cleaning company calls before every annual service asking basic questions about your building. You manage 6 buildings. That's 6 calls asking the same things every year.

**The Solution:**
Your contractor stores all building details permanently. One conversation, permanent record. Never asked again.

**The Benefit:**
Professional service from contractors who remember your buildings. Less time answering repetitive questions.

---

### Problem 9: "I manage multiple buildings and contractors mix them up"

**The Pain:**
You're the property manager for Strata Corp Ltd. You have 3 buildings. Contractors confuse which specs belong to which building. Wrong quotes, wrong schedules, wrong everything.

**Real Example:**
Contractor quotes based on Building A specs but the project is actually Building C. Building C has 10 more floors. Scheduling chaos.

**The Solution:**
Each client record supports multiple buildings. LMS numbers uniquely identify each building. Selecting the specific building pulls only that building's specs.

**The Benefit:**
No more building confusion. Each property tracked separately under your client record.

**Validated Quote (Lines 37):**
> "One client can have multiple buildings."

---

## 👷 For Technicians

### Problem 10: "I show up to jobs without knowing what to expect"

**The Pain:**
You're assigned to a building you've never worked. No one told you how many floors, where to park, or what equipment you'll need. You're guessing or calling the office repeatedly.

**Real Example:**
You arrive at LMS-9999 for window cleaning. Is this a 15-floor or 40-floor building? Where's parking? How many drops expected today? You don't know because the information isn't accessible to you.

**The Solution:**
Building specs accessible through project details. Floor count, parking stalls, and drop targets visible for any assigned project.

**The Benefit:**
Arrive prepared. Know the building before you get there. Professional confidence.

---

## Core Module Features

### Client Data Structure

Each client record contains:

**Contact Information:**
| Field | Description |
|-------|-------------|
| First Name | Client's first name |
| Last Name | Client's last name |
| Email | Contact email address (added Dec 2025) |
| Phone Number | Primary phone |
| Company Name | Property management company or strata |
| Address | Primary business address |
| Billing Address | Separate billing address if different |

**Building Portfolio (LMS Numbers):**
Each LMS number represents a building the client manages.

| Field | Description |
|-------|-------------|
| Number/Strata Plan | Unique building identifier (LMS, EMS, VIS) |
| Building Name | Display name for the building |
| Address | Full street address |
| Stories | Total floor count |
| Units | Number of residential/commercial units |
| Parking Stalls | Parking stall count |
| Daily Drop Target | Expected drops per day |
| North/East/South/West Drops | Per-elevation drop counts |

**Validated Quote (Lines 133):**
> "For building fields: Number strata plan, LMS number, building name, Display name for the building address, Full street address, stories, Total floor count, units, number of residents, commercial units, parking stalls, parking stall count, Daily drop target..."

---

### Adding a New Client (Standard Workflow)

**Step 1: Enter Contact Details**
Add the client's name, company, phone number, email, and primary address.

**Step 2: Add LMS Numbers/Buildings**
Click "Add Building" for each property the client manages. Enter strata plan number, address, floor count, and building specifications.

**Step 3: Configure Drop Targets (Optional)**
For rope access buildings, enter daily drop targets and elevation-specific counts. These auto-populate when creating window cleaning projects.

**Step 4: Client Saved**
Client is now available for project creation. Select them when creating a new project to autofill building details.

---

### Adding a New Client (Reverse Workflow)

**CRITICAL FEATURE (Missing from current documentation):**

When creating a project for a brand new client:

1. Start creating a new project
2. Instead of selecting from existing clients, enter the new client's details directly
3. Enter building address, floor count, drop targets, etc.
4. Save the project
5. **System prompts:** "Do you want to save this as a new client?"
6. Click Yes to create both the project AND the client record in one action

**The Benefit:** No need to create the client separately. One workflow handles both.

**Validated Quote (Lines 31):**
> "when I create my project, there's a window that pops that says, do you want to save this as a new client? So I don't need to create the project and also add the client."

---

### Autofill Intelligence

**How Autofill Works:**
1. Create a new project
2. Select a client from the dropdown
3. If the client has LMS numbers configured, select a specific building
4. System automatically populates all fields

**Auto-Filled Fields:**
| Standard Fields | Rope Access Jobs |
|-----------------|------------------|
| Strata Plan Number | Daily Drop Target |
| Building Name | North/East/South/West Drops |
| Building Address | Unit Count |
| Floor Count | Parking Stalls |

---

### Permission Requirements

Access to CRM features requires specific permissions:

| Permission | Code | Capability |
|------------|------|------------|
| View Clients | `canViewClients` | Can view client list and details |
| Manage Clients | `canManageClients` | Can create, edit, and delete client records |

---

### Quick Reference: Building Fields

| Field | Purpose | Used For |
|-------|---------|----------|
| Strata Plan Number | Unique building identifier | Project creation, resident codes |
| Building Name | Display name | All project displays |
| Address | Physical location | Navigation, documentation |
| Stories | Floor count | **Drop duration calculation, equipment selection** |
| Daily Drop Target | Expected drops/day | Window cleaning projects, all elevation-based work |
| Elevation Drops | Per-side drop counts | Progress tracking |

**CORRECTION REQUIRED:** The current documentation lists "Dryer vent scheduling" as the use case for Stories. Per Tommy (Lines 135-139), the correct uses are:
- Determining how long a drop will take (10-story vs 50-story)
- Determining equipment requirements (rope length needed)
- Used for ALL elevation-based projects, not just dryer vents

---

## Module Integration Points

The CRM is the **central hub** connecting:

| Integrates With | How |
|-----------------|-----|
| **Project Management** | Client/building selection auto-populates project details |
| **Billing** | Billing address separate from service address per client |
| **Work Sessions** | Building specs (floors, drops) flow to daily work tracking |
| **Gear Inventory** | Floor count determines equipment requirements |
| **Quoting/Sales** | Building specs enable accurate quotes |
| **Resident Portal** | Client-building relationships enable resident access |

**Validated Quote (Lines 151-152):**
> "It connects project decks to the project. The billing managers' information to that project. It connects everybody... It's kind of like the glue that holds everything together."

---

## Static Building Data Concept

**Key Architectural Principle:**

Building specifications are **static**. They never change:
- Number of floors: Fixed
- Number of drops: Fixed
- Parking stalls: Fixed
- Elevation heights: Fixed

**What CAN change:**
- Property manager contact info
- Phone numbers for building access
- Billing arrangements

**Why This Matters:**
Once building data is entered, it's permanent. No re-entry needed for future projects. This creates the foundation for a valuable building database.

**Validated Quote (Lines 46-48):**
> "That building data doesn't change... drops, elevation, parking stalls, all of that is kind of static, right?... It's static, yeah."

---

## Future Potential (NOT Current Features)

**DO NOT document as current features. Included for strategic context only:**

- Shared building database across companies (Lines 49-53)
- Paid access ($19/month) to thousands of building details
- Data-driven quote estimation from historical building data

**Validated Quote (Lines 53):**
> "when the database is like freaking massive, then I guess we could give Access... Access thousands of building details. And then once we have this built, when we have this database of building, we can do so much. We can base quotes on a similar building."

---

## ROI Analysis

### Cost-Benefit Calculation

| Metric | Value |
|--------|-------|
| Subscription Cost (Starter) | $99/month |
| Equivalent Technician Hours | ~3 hours (at $34/hour L2 rate) |
| Time Saved | 20+ hours per employee per month |
| ROI Multiple | 6-7x return on investment |

**The Math:**
- Pay: 3 employee hours equivalent
- Save: 20+ employee hours
- Net Gain: 17+ hours of productive work per month

**Validated Quote (Lines 160-169):**
> "$99 a month. It's like hiring three people for one hour a month... We'll save like 20 hours per employee per month... You're making money with this."

---

## Gap Analysis: Current Documentation vs. Transcript

### 🔴 Critical Gaps (Must Fix)

| Gap | Current State | Required State | Source |
|-----|---------------|----------------|--------|
| Reverse client creation workflow | Not documented | Document the "save as new client" prompt after project creation | Lines 29-35 |
| Stories field usage | "Dryer vent scheduling" | "Drop duration calculation, equipment selection" | Lines 135-139 |
| Footer date/version | "December 3, 2024, Version 1.0" | "December 17, 2025, Version 2.0" | Lines 143-145 |
| Regional LMS terminology | Only mentions "LMS" | Add VIS (Vancouver Island), EMS variations | Lines 22-26 |

### 🟡 Moderate Gaps (Should Add)

| Gap | Current State | Required State | Source |
|-----|---------------|----------------|--------|
| ROI messaging | Not included | Add cost-efficiency card ($34 = 1 tech hour) | Lines 154-170 |
| Central hub positioning | Brief mention | Emphasize CRM as "glue" connecting all modules | Lines 150-153 |
| Search functionality | Not mentioned | Document ability to search by client/building/address | Fireflies summary |
| Operational planning use | Limited | Emphasize equipment/duration planning from building specs | Lines 135-139 |

### 🟢 Correct (No Changes Needed)

- Golden Rule: One Client = Multiple Buildings
- Client-building hierarchical relationship
- Contact Information fields
- LMS/Building portfolio concept
- Standard client addition workflow
- Autofill intelligence explanation
- Permission requirements
- Customer journey steps

---

## TSX Implementation Changes Required

### Priority 1: Fix Errors

```tsx
// Line 453: Fix Stories purpose
// BEFORE:
<td className="py-2">Dryer vent scheduling</td>
// AFTER:
<td className="py-2">Drop duration calculation, equipment selection</td>

// Line 611: Fix footer
// BEFORE:
<p><strong>Last updated:</strong> December 3, 2024 | <strong>Version:</strong> 1.0</p>
// AFTER:
<p><strong>Last updated:</strong> December 17, 2025 | <strong>Version:</strong> 2.0</p>

// Line 38: Update header date
// BEFORE:
lastUpdated="December 5, 2025"
// AFTER:
lastUpdated="December 17, 2025"
```

### Priority 2: Add Missing Features

Add new section after "Adding a New Client" for reverse workflow:

```tsx
{/* Streamlined Project + Client Creation */}
<Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950">
  <CardHeader className="pb-2">
    <CardTitle className="text-xl font-semibold flex items-center gap-2">
      <Zap className="w-5 h-5 text-emerald-600" />
      Streamlined: Create Project + Client Together
    </CardTitle>
  </CardHeader>
  <CardContent className="text-emerald-900 dark:text-emerald-100">
    <p className="text-sm">
      Creating a project for a brand new client? Enter the details directly in 
      the project form. After saving, the system prompts: "Save as new client?" 
      One click creates both the project AND the client record.
    </p>
  </CardContent>
</Card>
```

### Priority 3: Add ROI Messaging

Add cost-efficiency card:

```tsx
{/* Cost Efficiency */}
<Card className="border-green-200 bg-green-50 dark:bg-green-950">
  <CardHeader className="pb-2">
    <CardTitle className="text-xl font-semibold flex items-center gap-2">
      💰 Cost Efficiency
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold text-green-800 dark:text-green-200">
      $34/seat = 1 technician hour
    </p>
    <p className="text-sm text-green-700 dark:text-green-300 mt-2">
      Save 20+ hours monthly per employee. The system pays for itself 
      with your first project setup.
    </p>
  </CardContent>
</Card>
```

### Priority 4: Add Regional ID Note

In the intro paragraph, add:

```tsx
<p className="text-sm text-muted-foreground italic mt-2">
  Note: Building IDs vary by region (LMS/EMS in Vancouver, VIS on Vancouver 
  Island). OnRopePro uses "LMS" as a generic term for all strata/building 
  identifiers.
</p>
```

---

## Frequently Asked Questions

### "Can one client have multiple buildings?"

**Answer:** Yes. This is the core design. One client (property management company or strata) can have unlimited buildings, each with their own LMS number and specifications.

**Example:** Strata Corp Ltd manages 3 buildings: LMS-1234, LMS-5678, and LMS-9012. All three are stored under the single Strata Corp Ltd client record.

---

### "What happens if I create a project without selecting an existing client?"

**Answer:** The system prompts you to save the entered details as a new client after project creation. You don't need to create the client first.

**Source:** Lines 31

---

### "Is my building data shared with other companies?"

**Answer:** No. Currently, building data is private to your company. Each company maintains its own client/building database.

**Future Potential:** Shared building database may be offered as a premium feature.

---

### "What's the difference between LMS, EMS, and VIS?"

**Answer:** These are regional naming conventions for building identifiers:
- **LMS:** Land Management System (Vancouver)
- **EMS:** Also used in Vancouver area
- **VIS:** Vancouver Island Strata

OnRopePro accepts any format. The "LMS" label is generic.

---

### "Why store parking stall counts?"

**Answer:** Parking directly impacts operations. Crews need to know: Is there loading zone access? How many vehicles can park? This affects equipment delivery and crew logistics.

---

## Summary: Why CRM Is Different

Most CRM software treats "client management" as a contact database. OnRopePro recognizes that in rope access building maintenance, the CRM is the **operational foundation** connecting:

1. **Clients → Projects** → Auto-populate building specs when creating work
2. **Buildings → Equipment** → Floor count determines rope lengths needed
3. **Specs → Scheduling** → Drop targets drive duration estimates
4. **Contacts → Billing** → Separate service and billing addresses
5. **History → Quotes** → Past building data enables accurate future pricing
6. **Everything → Efficiency** → One-time entry, permanent records

**When you add a client, you're not just adding a contact. You're creating the foundation for every future project at every building they manage.**

---

## Document Metadata

**Version:** 1.0  
**Last Major Update:** December 17, 2025 - Initial SSOT creation from transcript validation  
**Word Count:** ~3,500  
**Maintenance Owner:** Glenn (strategic) + Tommy (technical)  
**Next Review:** After CRMGuide.tsx updates implemented

---

**END OF SINGLE SOURCE OF TRUTH DOCUMENT**
