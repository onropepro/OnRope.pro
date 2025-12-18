# Module - Resident Portal Overview

**Version:** 1.0 - Single Source of Truth  
**Last Updated:** December 17, 2025  
**Status:** ✅ Validated from Tommy/Glenn Conversation Transcript (Dec 17, 2025)  
**Purpose:** Authoritative reference for all Resident Portal documentation, marketing, and development

---

## 📋 Document Purpose

This is THE definitive source of truth for OnRopePro's Resident Portal module. All other materials (website pages, marketing copy, sales decks, support documentation) should derive from this document. Any discrepancies between this document and other materials indicate those materials need updating.

**Validated Sources:**
- Primary: Tommy/Glenn conversation transcript dated December 17, 2025
- Secondary: Fireflies AI problem statements
- Technical: ResidentPortalGuide.tsx implementation review

---

## 🎯 The Golden Rule

> **Vendor Code + Strata/LMS Number = Resident Access**

### How Account Linking Actually Works

Residents connect to the system through a **two-part identification system**:

1. **Strata Plan/LMS Number** (entered at account creation): Links the resident to their specific building
2. **Vendor Code** (entered after account creation): Links the resident to the service provider doing maintenance on their building

**Critical Clarification:** There is ONE vendor code per company, used for the entire existence of their account. All residents across all buildings serviced by that company use the SAME code. The Strata/LMS number is what differentiates which building's projects they see.

**Why This Matters:** This architecture creates portable resident accounts. A resident who moves from Toronto to Chicago can keep their same OnRopePro account, simply updating their Strata/LMS number and entering the new vendor's code. This drives viral adoption as residents expect their new buildings to have the same system.

**Validated Quote (Lines 31-39):**
> "It's not a building code. It's a... The company [links] to the service provider... So I guess in there you could call it a vendor code."

---

## ✅ Key Features Summary

**Quick overview of what makes this module powerful:**

<table>
<tr>
<td width="50%">

### 🔑 Vendor Code Linking
One code per company links all residents to their service provider. Combined with Strata/LMS number, residents see only their building's projects.

</td>
<td width="50%">

### 💬 Two-Way Feedback System
Residents submit issues with photos. Staff respond with internal notes (private) or visible replies (resident sees). Complete audit trail.

</td>
</tr>
<tr>
<td width="50%">

### 📸 Photo Evidence Upload
Residents attach photos directly to feedback submissions, eliminating back-and-forth emails requesting documentation.

</td>
<td width="50%">

### ⏱️ Viewed Timestamp Visibility
Residents see exactly when their feedback was first viewed by the company, creating accountability and eliminating "I didn't see it" excuses.

</td>
</tr>
<tr>
<td width="50%">

### 📊 Progress Tracking
Residents view real-time project progress including which elevation/side of the building is being worked on, reducing "are you done yet?" calls.

</td>
<td width="50%">

### 🔒 Internal Notes System
Staff coordinate privately without exposing sensitive discussions to residents. Clear toggle prevents accidental visibility.

</td>
</tr>
<tr>
<td width="50%">

### 🌍 Portable Accounts
Residents keep their account when moving buildings or cities. Update Strata number, enter new vendor code, done.

</td>
<td width="50%">

### 📈 Resolution Time Metrics
Property managers see vendor performance data including average response and resolution times for vendor evaluation.

</td>
</tr>
</table>

---

## ⚠️ Critical Clarifications (What This Module Does NOT Do)

Based on validation conversations, the following features do NOT exist and should never be documented:

| Feature | Status | Notes |
|---------|--------|-------|
| Photo Gallery (before/after from technicians) | ❌ Does Not Exist | Residents can only upload photos with their feedback, NOT view technician photos |
| Resident Reopen Closed Feedback | ❌ Does Not Exist | Only company staff can reopen closed feedback |
| Direct Link Method (/link?code=) | ❌ Removed | Only profile page method for linking exists |
| Building-Specific Codes | ❌ Incorrect | One vendor code per company, not per building |

**Validated Quote (Lines 155-160):**
> Tommy: "Resident cannot reopen."
> Glenn: "Residents cannot reopen. No."

---

## ✅ Problems Solved (Stakeholder-Segmented)

The Resident Portal module solves different problems for different stakeholders. This section is organized by user type to help each stakeholder immediately identify the pain points most relevant to them.

---

## 🏠 For Building Residents

### Problem 1: "My complaints go into a black hole"

**The Pain:**
Residents submit feedback via phone or email and have no idea if anyone received it, read it, or plans to address it. They call repeatedly asking for updates, get frustrated, and eventually give up or escalate to strata councils and social media.

**Real Example:**
A resident in unit 1247 emails about streaks on her window. A week later, she has no response. She calls the building manager, who calls the vendor, who says they never received the email. Now three people are involved in tracking down one complaint that may or may not have been sent.

**The Solution:**
Every feedback submission is logged with a timestamp. Residents see a "Viewed" status with the exact date and time when the company first opened their feedback. They can track status changes from New to Viewed to Closed.

**The Benefit:**
Complete transparency into feedback status. Residents know their issue was received and when it was seen, eliminating uncertainty and repeated follow-up calls.

**Validated Quote (Lines 72-78):**
> Tommy: "The customer sees the day and time... when the complaint was viewed by the company."
> Glenn: "There's a timestamp of when it was viewed."
> Tommy: "So there's no like, oh, I didn't see your complaint. Sorry. No you did."

---

### Problem 2: "I have to explain my issue three times"

**The Pain:**
Residents describe their problem over the phone, then repeat it to the property manager, then again to the vendor. Details get lost. "Can you send a photo?" adds another round of communication. Simple issues become multi-day email threads.

**Real Example:**
A resident reports a water stain. The vendor asks for a photo. The resident sends it, but to the wrong email. The vendor never receives it. A week later, a technician arrives and says "nobody told me about a water stain, I'm here for the balcony glass."

**The Solution:**
Residents submit feedback once with a description and optional photo attachment. The form auto-fills their name, unit number, and phone from their account. Everything is captured in one submission.

**The Benefit:**
One submission captures everything. No repeated explanations, no lost photos, no miscommunication about which unit or what problem.

**Validated Quote (Lines 143-144):**
> Tommy: "Now the resident is filling the complaints and there's a button there. Add photo. There's not even a question. Do that, do that. Remove that one email 1,000 times per year."

---

### Problem 3: "I don't know when they'll be on my side of the building"

**The Pain:**
Residents see crews working on the building but have no idea if their unit has been done, is scheduled for today, or won't be reached for another week. They call to ask "when will you do my window?" only to learn the crew already finished their side.

**Real Example:**
A resident on the north side calls to complain their window wasn't cleaned. The crew hasn't reached the north side yet, but the resident didn't know that. They've now wasted everyone's time with a premature complaint.

**The Solution:**
Residents view real-time project progress showing which elevation/side of the building is currently being worked on and overall completion percentage.

**The Benefit:**
Residents self-serve status information. They can see their side hasn't been touched yet, eliminating premature complaints and reducing inbound calls.

**Validated Quote (Lines 121-123):**
> Tommy: "Because you get a lot of... on my window, we're not done. And then you call them back. We're like, yeah, we haven't been on the north side yet. Oh, okay."

---

## 🏢 For Property Managers

### Problem 4: "I'm the middleman for every complaint"

**The Pain:**
When residents have issues with maintenance work, they call the property manager. The property manager must then contact the vendor, relay the complaint, wait for a response, and communicate back to the resident. This back-and-forth consumes hours per building.

**Real Example:**
During a 40-story window washing project, a property manager receives 30+ calls about streaks, missed windows, and scheduling questions. Each call requires follow-up with the vendor, then follow-up with the resident. The property manager spends more time managing complaints than managing the property.

**The Solution:**
Residents communicate directly with the vendor through the portal. Property managers can view all feedback and communications for oversight without being in the middle of every exchange.

**The Benefit:**
Property managers are removed from the communication loop while maintaining complete visibility. They oversee vendor performance without fielding every call.

**Validated Quote (Lines 86-88):**
> Tommy: "A huge, huge weight off of their back. Because it's one of their main things when these projects happen. It's like man, the amount of phone calls and emails I would get from property managers, you know about resident complaints. Oh my God."

---

### Problem 5: "I can't evaluate vendor responsiveness"

**The Pain:**
Property managers have no objective data on how quickly vendors respond to resident concerns. When contract renewal comes, they rely on gut feel and resident complaints rather than actual performance metrics.

**Real Example:**
A property manager is deciding between renewing with their current vendor or switching. Both claim great customer service, but the property manager has no data to compare response times, resolution rates, or communication quality.

**The Solution:**
The system calculates average response time and resolution time for each vendor. Property managers see this data alongside the Company Safety Rating when evaluating vendors.

**The Benefit:**
Objective performance metrics for vendor evaluation. Property managers make data-driven decisions about vendor relationships.

**Validated Quote (Lines 182-188):**
> Tommy: "The resolution time is the program calculating how long it took for them to solve, to close a complaint... And makes an average of this and that is what's displayed for the property manager."
> Glenn: "If I'm looking at a potential vendor... do I also see their feedback response time?"
> Tommy: "Yeah. That's so awesome."

---

### Problem 6: "I have no visibility when residents escalate"

**The Pain:**
A resident goes back and forth with a vendor about an issue. Eventually they escalate to the property manager, who has no context on what's been discussed, what's been tried, or what the vendor's position is.

**Real Example:**
A resident insists their window wasn't cleaned. The vendor insists it was. The resident escalates to the property manager, who must piece together the story from both sides. Without documentation, it becomes "he said, she said."

**The Solution:**
Property managers can view the complete feedback history including all messages between resident and vendor, timestamps, and status changes. They see the full context without having to reconstruct it.

**The Benefit:**
When escalations occur, property managers have complete documented history to make informed decisions about resolution.

**Validated Quote (Lines 173-174):**
> Glenn: "I think that being able to view gives the property manager the power. Like it gives them oversight, knowledge, gives them... But they don't necessarily need to do anything about it."

---

## 💼 For Rope Access Company Owners

### Problem 7: "Deficiency visits cost me a half-day for one window"

**The Pain:**
A complaint comes in a week after the job is done. Now you need to send someone back. The technician packs up from their current site, the supervisor drives them to the complaint building, they set up ropes for one window, clean it, pack up, and get driven back. A 10-minute fix becomes a half-day labor cost.

**Real Example:**
A complaint about one dirty window on the 30th floor requires: packing equipment at current job, loading van, driving to complaint building, going up 30 floors, rigging ropes, descending to window, cleaning window, ascending, derigging, packing, driving back. 4-6 hours of labor for one window.

**The Solution:**
Complaints come in while crews are still on-site. A supervisor sees the feedback, dispatches a technician who's already rigged and working on that building to check the window. If it's outside dirt, they flip their rope and clean it. Problem solved in minutes.

**The Benefit:**
Real-time complaint resolution while crews are on-site eliminates costly return visits. One prevented return visit per month easily pays for the entire system.

**Validated Quote (Lines 125-129):**
> Tommy: "You need the guy to pack up his kit... Now you're paying two guys... It's a 10, 5, 5, 10 minute job that takes half a day because... you could have done when you were still on site."

---

### Problem 8: "I'm drowning in complaint phone calls"

**The Pain:**
During busy season, the operations manager's phone rings constantly with resident complaints. Each call interrupts their work, requires documentation, and needs follow-up. The mental load of tracking dozens of open issues across multiple buildings is overwhelming.

**Real Example:**
Tommy describes using a notebook to manually track complaints, sometimes writing on his hand while driving. A Google Form helped but required manually sorting 30 submissions from 5 different buildings, then calling each resident individually to schedule resolution.

**The Solution:**
All feedback is automatically organized by building and project. Notification badges show pending items. No phone calls to receive complaints, no manual sorting, no paper tracking.

**The Benefit:**
Operations managers reclaim hours previously spent managing complaint intake. The mental load of tracking open issues is eliminated by the system.

**Validated Quote (Lines 110-113):**
> Tommy: "Holy were people ever using that... I would have like 30 submission. But the problem with that is like it was 30 submission from five different buildings. So now I had to open them one by one."

---

### Problem 9: "We look unprofessional compared to our competitors"

**The Pain:**
When a property manager deals with Vendor A (no system) versus Vendor B (OnRopePro), the difference is stark. Vendor A requires the property manager to coordinate complaints. Vendor B handles everything automatically with complete transparency.

**Real Example:**
A property manager is comparing two bids for next year's contract. Both prices are similar. But Vendor B shows them their CSR rating, average resolution time, and demonstrates the resident portal. The property manager sees a system that removes work from their plate.

**The Solution:**
White-labeled resident portal with your company branding demonstrates professionalism. Resolution time metrics prove your responsiveness. The system itself becomes a competitive differentiator.

**The Benefit:**
Win contracts by demonstrating operational excellence. Property managers choose vendors who make their lives easier.

**Validated Quote (Lines 128-134):**
> Glenn: "Think about like the professional, the level of professionalism between the vendor and the property management company... hey, we have a system that completely deals with all feedback. You're out of the loop. You don't even need to worry about it."

---

## 📋 For Operations Managers & Supervisors

### Problem 10: "I can't coordinate deficiency visits efficiently"

**The Pain:**
Complaints trickle in over days after a job completes. The operations manager must accumulate them, sort by building, schedule return visits, and coordinate technician availability. It's a constant background task that never ends.

**Real Example:**
Five complaints come in for Building A on Monday, three more on Wednesday, two on Friday. Do you send someone Monday and again Friday? Wait until Friday to batch them? Each approach has tradeoffs that require mental energy to optimize.

**The Solution:**
All complaints for each building are visible in one place. The operations manager sees which buildings have open issues and can make informed decisions about when to schedule return visits.

**The Benefit:**
Batch deficiency visits efficiently by seeing all open issues per building in one view.

---

### Problem 11: "I can't prove we did the work"

**The Pain:**
A resident claims their window was never cleaned. The technician says they did it. Without documentation, it's impossible to prove either way. The default is often to just redo the work to keep the customer happy.

**Real Example:**
A resident complains about a dirty window. You send someone back. They report the dirt is on the inside. The resident disputes this. Without photo evidence or documented communication, you have no proof of your position.

**The Solution:**
Residents attach photos to their complaints. Staff responses are timestamped. Internal notes document investigation findings. The complete interaction history provides evidence for disputes.

**The Benefit:**
Documented evidence resolves disputes definitively. No more redoing work you've already completed correctly.

**Validated Quote (Lines 147-148):**
> Tommy: "And then the technician doing a poor job is the rarest of all... Bird, you wash the window and then the very next day there's a bird that comes by with diarrhea and then just messed up five floors of windows."

---

## 👷 For Rope Access Technicians

### Problem 12: "I find out about complaints a week after I've left the building"

**The Pain:**
Technicians work a building for several days, then move to the next job. A week later, they're told to go back because of complaints. They've mentally moved on and now must context-switch back to a building they thought was complete.

**Real Example:**
A technician finishes the west elevation on Tuesday. On Friday, a complaint comes in about the west side. The technician is now at a different building. They must return to the original building, remember the work context, and address the issue.

**The Solution:**
Technicians see complaints in real-time while still on-site. They can address issues same-day while the work context is fresh and equipment is deployed.

**The Benefit:**
Immediate feedback allows immediate resolution. Technicians maintain their work rhythm without surprise return visits.

**Validated Quote (Lines 121-125):**
> Tommy: "Now every day, every single technicians are going on the project to clock in, they will be able to see that complaint. So now Jeff could be sitting at his desk in the morning, look at all the complaints and be like, oh, guys are still in the building working."

---

### Problem 13: "I get blamed for things outside my control"

**The Pain:**
A resident complains about a dirty window. The technician knows they cleaned it perfectly, but the resident on the floor above watered their plants and dripped onto the window. Without a way to document this, the technician looks incompetent.

**Real Example:**
Party on the 35th floor. Someone vomits off the balcony. It lands on windows below. By the time complaints come in, the technician has no way to explain what happened.

**The Solution:**
Internal notes allow staff to document investigation findings (e.g., "dirt on inside," "water from balcony above") without exposing sensitive details to residents. The audit trail shows what was investigated.

**The Benefit:**
Technicians can document context that explains issues, protecting their professional reputation.

**Validated Quote (Lines 147-148):**
> Tommy: "The guy on the 30th floor puked down. It was in everybody's window on their balcony window."

---

## 🏗️ For Building Managers

### Problem 14: "Residents constantly ask me about project status"

**The Pain:**
During maintenance projects, residents approach the building manager asking when their side will be done, if they need to close their windows, and why there are streaks on Unit 1503's window. The building manager becomes an information relay point.

**Real Example:**
Every time a building manager walks through the lobby during window washing, residents stop them with questions. The building manager doesn't know the crew's schedule and must contact the vendor to get answers.

**The Solution:**
Direct residents to create an account and enter the vendor code from the notice in the elevator. They can self-serve all project status information.

**The Benefit:**
Building managers redirect questions to the system instead of answering them personally. Reduced interruptions and on-the-ground workload.

**Validated Quote (Lines 135):**
> Tommy: "Just tell your resident to download and create an account on RO and then give them the code. And then you're, you just reduced your email and phone call load."

---

## 🌐 Portable Accounts: The Network Effect

### How Resident Account Portability Creates Viral Adoption

**The Mechanism:**
When a resident moves to a new building, they keep their OnRopePro account. They simply update their Strata/LMS number and enter the new vendor's code. If the new building's vendor doesn't use OnRopePro, the resident notices the gap.

**The Cascade Effect:**
1. Resident moves to new building
2. New building doesn't have OnRopePro
3. Resident asks property manager "why don't we have that system?"
4. Resident mentions it to strata council
5. Strata council mentions it during vendor evaluation
6. Vendor adopts OnRopePro to win/retain contract

**Why This Matters for Market Penetration:**
Residents become unpaid salespeople. Every satisfied user who moves buildings creates demand at their new location. Vendors face adoption pressure from multiple directions.

**Validated Quote (Lines 60-66):**
> Tommy: "That would be good for us too, because a lot of people move. Right. There's a lot of renters... 'We need to see this. Whatever company is doing the window washing, we need to see this.' So Strata manager, make them have this app."
> Glenn: "You're going to be on OnRope Pro. No matter what, you're getting it from every side."

---

## 📝 Terminology & Naming

| Term | Definition | Usage Notes |
|------|------------|-------------|
| **Vendor Code** | The unique code for a rope access company that residents enter to link to that service provider | One code per company, used permanently. NOT building-specific. |
| **Strata Plan Number / LMS Number** | The legal identifier for a residential building (Canada) | Entered at account creation. Links resident to their specific building. |
| **HOA Number** | The equivalent identifier in the United States | Used instead of Strata/LMS in US markets. |
| **Feedback** | The term for resident-submitted issues or complaints | Preferred over "complaint" in UI. |
| **Internal Note** | Staff-only comments not visible to residents | Default for all staff responses until toggle is changed. |
| **Visible Reply** | Staff responses that residents can see | Requires explicit toggle/checkbox to enable. |
| **Viewed Status** | Indicates feedback has been opened by company staff | Includes timestamp visible to resident. |
| **5 Business Days** | The window for submitting feedback after project completion | Standard complaint submission period. |

---

## 📅 Resident Account Creation (Step-by-Step)

### Step 1: Create Account

**Required Fields:**
- **Full Name:** For identification in feedback submissions
- **Email:** Login credential and notification delivery
- **Phone Number:** Contact for urgent issues (auto-fills in feedback)
- **Strata Plan/LMS Number:** Links account to their building
- **Unit Number:** Identifies their specific unit within the building
- **Password:** Account security

**Optional Fields:**
- **Parking Stall Number:** For buildings with assigned parking

**What Happens After Creation:**
The resident has an account but cannot see any projects yet. Their dashboard is empty until they link to a vendor.

---

### Step 2: Link to Vendor

**How Residents Get the Code:**
- Posted on notice in elevator during projects
- Provided by building manager
- Provided by property manager
- Included in project communications

**Linking Method:**
1. Navigate to Profile page
2. Enter vendor code in "Link to Company" field
3. Click "Update Profile"

**What Happens After Linking:**
If the vendor has an active project at the resident's building (matching Strata/LMS number), the resident can now view project progress and submit feedback.

---

### Step 3: View Projects & Submit Feedback

**Available to Linked Residents:**
- View project progress (elevation, percentage complete, scheduled dates)
- Submit feedback with description and optional photo
- Track feedback status (New, Viewed, Closed)
- See when feedback was viewed by company
- Communicate through visible replies

**Not Available to Residents:**
- View other residents' feedback
- View internal staff notes
- Reopen closed feedback
- Close feedback

---

## 🔄 Feedback Lifecycle

### Stage 1: New
**Status:** Feedback just submitted  
**What Happens:**
- Timestamp recorded
- Notification badge appears in company dashboard
- Feedback visible in project's Resident Feedback section

**Resident View:**
- Can see their submission
- Status shows "New"

---

### Stage 2: Viewed
**Status:** Company staff has opened the feedback  
**What Happens:**
- "Viewed" timestamp recorded (visible to resident)
- Status changes from New to Viewed
- Staff can begin responding

**Resident View:**
- Sees exact date/time feedback was first viewed
- Knows someone has seen their issue

---

### Stage 3: In Progress (Communication)
**Status:** Active conversation between staff and resident  
**What Happens:**
- Staff add internal notes (investigation, coordination)
- Staff add visible replies (resident communication)
- Resident can reply to visible messages
- Conversation continues until resolution

**Two Types of Staff Responses:**
1. **Internal Notes:** Private, staff-only. Default for all responses.
2. **Visible Replies:** Resident can see. Requires explicit toggle (yellow/red checkbox).

---

### Stage 4: Closed
**Status:** Issue resolved  
**What Happens:**
- Staff marks feedback as Closed
- Resolution timestamp recorded
- Contributes to company's average resolution time metric

**Resident View:**
- Sees Closed status
- Can view all previous visible replies
- Cannot reopen or add new messages

**If Issue Persists:**
Resident must contact property manager or building manager directly. Only company staff can reopen closed feedback.

---

## 👥 Access Permissions Matrix

| Action | Resident | Company Staff | Property Manager |
|--------|----------|---------------|------------------|
| Submit feedback | ✅ Own only | ❌ | ❌ |
| View feedback | ✅ Own only | ✅ All | ✅ All (read-only) |
| Add internal notes | ❌ | ✅ | ❌ |
| Add visible replies | ❌ | ✅ | ❌ |
| Reply to messages | ✅ Own only | ✅ | ❌ |
| Change status | ❌ | ✅ | ❌ |
| Close feedback | ❌ | ✅ | ❌ |
| Reopen feedback | ❌ | ✅ | ❌ |
| View internal notes | ❌ | ✅ | ❌ |
| View message history | ✅ Own only | ✅ All | ✅ All |
| See viewed timestamp | ✅ | ✅ | ✅ |
| See resolution metrics | ❌ | ✅ | ✅ |

---

## 💰 Quantified Business Impact

### Direct Cost Savings

**Eliminated Return Visits:**
- Average cost of deficiency return visit: $200-400 (half-day labor + travel)
- Real-time feedback prevents 2-5 return visits per month
- **Monthly savings: $400-2,000**
- **Annual savings: $4,800-24,000**

**Reduced Phone Time:**
- Average time per complaint phone call: 10-15 minutes
- Average complaints per busy month: 50-100
- Time saved: 8-25 hours per month
- **Value at $50/hour: $400-1,250/month**

### Indirect Business Value

**Contract Retention:**
Property managers choose vendors who reduce their workload. The Resident Portal demonstrably removes property managers from the complaint loop, making renewal conversations easier.

**Competitive Differentiation:**
During bid presentations, demonstrating the resident portal and resolution time metrics separates your company from competitors who manage complaints via phone and email.

**Professional Reputation:**
Transparent, documented complaint handling builds trust with property managers and strata councils. This reputation travels through industry networks.

---

## 🔗 Module Integration Points

### Project Management Module
- Feedback tied to specific projects
- Project progress visible to residents
- Completion percentage displayed

### Company Safety Rating (CSR) Module
- Resolution time metrics factor into overall rating
- Property managers see CSR and feedback metrics together
- Creates incentive for responsive complaint handling

### Property Manager Portal Module
- Property managers view feedback from their vendor dashboard
- Resolution time metrics displayed alongside safety ratings
- Complete oversight without communication burden

### White-Label Branding Module
- Resident portal displays company branding when active
- Notices and communications show company identity
- Professional appearance for resident interactions

### Employee Management Module
- Staff assigned to respond to feedback
- Performance could be tracked by response quality (future)

---

## 📊 Quick Reference Tables

### Feedback Status Badges

| Badge | Meaning | Who Sets It | Resident Sees |
|-------|---------|-------------|---------------|
| New | Just submitted | System (automatic) | ✅ |
| Viewed | Staff opened it | System (automatic) | ✅ (with timestamp) |
| Closed | Issue resolved | Staff (manual) | ✅ |

### Notification Badges

| Badge Location | What It Shows | Who Sees It |
|----------------|---------------|-------------|
| Project Feedback Section | Count of New feedback items | Company Staff |
| Individual Feedback | Current status | Company Staff, Resident (own) |

### Resident Journey Summary

| Step | Action | Result |
|------|--------|--------|
| 1 | Create account | Empty dashboard |
| 2 | Enter vendor code | See active projects |
| 3 | View progress | Track work status |
| 4 | Submit feedback | Report issues with photos |
| 5 | Track status | See viewed/closed timestamps |

---

## 🎓 Best Practices & Tips

### For Company Staff

**Do:**
- ✅ Check feedback dashboard daily during active projects
- ✅ Use internal notes for investigation and coordination
- ✅ Respond to feedback within 24 hours (visible reply)
- ✅ Include specific resolution details when closing
- ✅ Document evidence findings (inside dirt, external causes) in internal notes

**Don't:**
- ❌ Leave feedback in "New" status for more than 24 hours
- ❌ Accidentally send internal discussions as visible replies (check the toggle)
- ❌ Close feedback without communicating resolution to resident
- ❌ Argue with residents in visible replies (keep professional)
- ❌ Ignore feedback assuming resident will give up

### For Property Managers

**Do:**
- ✅ Share vendor code with residents proactively
- ✅ Direct resident complaints to the portal instead of relaying them
- ✅ Review resolution time metrics when evaluating vendors
- ✅ Check feedback history when residents escalate issues

**Don't:**
- ❌ Insert yourself into every communication (let system handle it)
- ❌ Share vendor codes before projects begin (residents see empty dashboard)

### For Residents

**Do:**
- ✅ Include photos with every feedback submission
- ✅ Be specific about location (unit, which window, which balcony)
- ✅ Check project progress before submitting "not done yet" complaints
- ✅ Allow 5 business days for response before escalating

**Don't:**
- ❌ Submit feedback for work not yet complete (check progress first)
- ❌ Create multiple submissions for the same issue
- ❌ Expect immediate resolution for non-urgent issues

---

## ❓ Frequently Asked Questions

### "Can residents see other residents' complaints?"

**Answer:** No. Residents can only view and interact with their own feedback submissions. Staff see all feedback for their company's projects.

**Why:** Privacy protection. Residents shouldn't see their neighbors' issues or personal details.

---

### "What if a resident is never satisfied and keeps complaining?"

**Answer:** Once staff closes feedback, residents cannot reopen it. If the resident believes the issue persists, they must contact their property manager or building manager directly.

**Why:** This prevents endless back-and-forth on resolved issues while ensuring residents have an escalation path through building management.

**Validated Quote (Lines 159):**
> Tommy: "I just thought of so many things that happened in the past where you'd explain to the client that the dirt is on the inside and they just don't want to hear it."

---

### "Can property managers respond to resident feedback?"

**Answer:** No. Property managers can view all feedback and communication history but cannot respond. Only company staff can communicate with residents through the system.

**Why:** This keeps property managers informed without requiring their involvement. The goal is to remove them from the communication loop, not add them to it.

---

### "What happens when a resident moves to a different building?"

**Answer:** They update their Strata/LMS number in their profile and enter the new vendor's code. Their account is fully portable. If the new building's vendor uses OnRopePro, they'll see that vendor's projects. If not, their dashboard will be empty until they link to a vendor.

**Why:** Portable accounts create network effects and reduce friction for resident adoption.

---

### "How does the 5 business day window work?"

**Answer:** Residents have 5 business days after project completion to submit feedback. This allows time for residents to notice issues while limiting the complaint window to a reasonable period.

**Why:** Balances resident needs with operational efficiency. Issues reported months later are likely not related to the original work.

---

### "What's the difference between internal notes and visible replies?"

**Answer:** Internal notes are private (staff only) and are used for coordination, investigation findings, and sensitive discussions. Visible replies are seen by the resident and are used for acknowledgment, status updates, and resolution communication. Staff must explicitly toggle a checkbox (yellow/red indicator) to make a reply visible.

**Why:** Staff need space to coordinate and document findings without exposing every detail to residents. The explicit toggle prevents accidental visibility.

---

## 📌 Summary: Why Resident Portal Is Different

**Most complaint management is either non-existent or completely manual.** OnRopePro's Resident Portal recognizes that in building maintenance, feedback is the **accountability bridge** connecting:

1. **Residents** → Direct communication channel with service provider
2. **Vendors** → Real-time awareness of issues while crews are on-site
3. **Property Managers** → Oversight without communication burden
4. **Building Managers** → Redirect tool for resident questions
5. **Technicians** → Immediate feedback for immediate resolution
6. **Network Growth** → Portable accounts create viral adoption pressure

**When you enable the Resident Portal, you're not just collecting complaints. You're creating a documented accountability system that saves money, wins contracts, and builds your professional reputation.**

---

## 📞 Support & Questions

**For Company Owners:**
- **Setup Questions:** Contact OnRopePro support
- **Code Distribution:** Generate and share your vendor code from company settings
- **Staff Training:** Distribute this documentation to operations team

**For Property Managers:**
- **Vendor Code:** Request from your building maintenance vendor
- **Resident Questions:** Direct them to create accounts and enter the code
- **Performance Metrics:** Available in your Property Manager Portal

**For Residents:**
- **Account Issues:** Contact your building manager for the vendor code
- **Feedback Status:** Check your portal, visible replies include updates
- **Escalation:** Contact your property manager if feedback is closed but issue persists

---

**Document Version:** 1.0  
**Last Major Update:** December 17, 2025, Initial SSOT creation from validated conversation transcript  
**Next Review:** After TSX implementation updates  
**Word Count:** ~4,500  
**Maintenance Owner:** Glenn (strategic) + Tommy (technical)

---

**END OF SINGLE SOURCE OF TRUTH DOCUMENT**
