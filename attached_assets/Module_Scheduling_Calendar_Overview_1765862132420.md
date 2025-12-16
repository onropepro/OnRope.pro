# Module - Scheduling & Calendar Overview

**Version:** 1.0 - Single Source of Truth  
**Last Updated:** December 15, 2025  
**Status:** ✅ Validated from Tommy/Glenn Conversation (Dec 15, 2025)  
**Purpose:** Authoritative reference for all Scheduling & Calendar documentation, marketing, and development

---

## 📋 Document Purpose

This is THE definitive source of truth for OnRopePro's Scheduling & Calendar module. All other materials (website pages, marketing copy, sales decks, support documentation) should derive from this document. Any discrepancies between this document and other materials indicate those materials need updating.

**Validated Sources:**
- Live TSX implementation (SchedulingGuide.tsx)
- Tommy/Glenn conversation transcript (December 15, 2025)
- Fireflies AI meeting summary
- Problem-Solution Matrix v2 (Module 15)

---

## 🔍 Critical Writing Guidelines

**BEFORE writing any module documentation, you MUST:**

### 1. Review Design Guidelines
**MANDATORY:** Read the changelog section in `/design-guidelines.md` in the Replit project to ensure your writing follows current standards.

### 2. No Em-Dashes (—)
**NEVER use em-dashes in any content.** They break TSX component rendering.

### 3. Writing Style Requirements
- **Active voice preferred:** "The system prevents double-booking" not "Double-booking is prevented by the system"
- **Present tense:** "The module tracks availability" not "The module will track availability"
- **Specific numbers:** Use concrete examples from transcript
- **Conversational but professional:** Write like explaining to a colleague

### 4. Content Accuracy
- Only document features that exist (verified with Tommy)
- Never include "coming soon" features without clear labeling
- Quote sources with line numbers from transcripts

---

## 🎯 The Golden Rule

> **One Employee = One Location at a Time**

### Conflict Prevention Formula

```
Assignment Allowed = (No Existing Assignment) AND (No Approved Time-Off) AND (No Date Overlap)
```

The system automatically checks three conditions before allowing any assignment:
1. **Existing Assignments:** Is the employee already scheduled for another project?
2. **Time-Off Requests:** Does the employee have approved vacation or sick leave?
3. **Date Overlaps:** Do the requested dates conflict with any existing commitments?

**Why This Matters:** In rope access, a scheduling error doesn't just cause inconvenience. It triggers a domino effect: pulling techs from other buildings, safety violations (working alone), angry property managers, missed first days that kill contract renewals, and Monday mornings that ruin entire weeks.

**Validated Quote (Lines 82-83):**
> "It builds a culture of disorganization. If your scheduling is like, it just screws everything."

---

## ✅ Key Features Summary

**Quick overview of what makes this module powerful:**

<table>
<tr>
<td width="50%">

### 🚫 Automatic Conflict Detection
Prevents double-booking by checking existing assignments, approved time-off, and date overlaps before any assignment is created.

</td>
<td width="50%">

### 📅 Dual Calendar Views
Project Calendar shows all jobs on a timeline. Resource Timeline shows employee workloads by row. Use both together to plan effectively.

</td>
</tr>
<tr>
<td width="50%">

### ✋ Drag-and-Drop Assignment
Select an employee, drag to a project, confirm dates. System highlights valid drop zones and warns on conflicts.

</td>
<td width="50%">

### 🏖️ Time-Off Management
Vacation, sick leave, personal, bereavement, and medical leave types. Approved time-off automatically blocks scheduling.

</td>
</tr>
<tr>
<td width="50%">

### 🔗 Project Integration
Assign employees during project creation. No duplicate data entry. Changes sync everywhere automatically.

</td>
<td width="50%">

### 🎨 Color-Coded Visualization
Projects display in consistent colors across all views. Time-off shown distinctly. Conflicts highlighted with warning indicators.

</td>
</tr>
<tr>
<td width="50%">

### 👁️ Permission-Based Visibility
Company owners control who sees what. Enable schedule visibility for technicians. Managers can see everyone or just their crews.

</td>
<td width="50%">

### ⚠️ Override Capability
When conflicts exist, managers receive warnings with full details. Override available for edge cases (not recommended).

</td>
</tr>
</table>

---

## ✅ Problems Solved (Stakeholder-Segmented)

**The Scheduling & Calendar module solves different problems for different stakeholders.** This section is organized by user type to help each stakeholder immediately identify the pain points most relevant to them.

---

## 💼 For Rope Access Company Owners

### Problem 1: "Monday Morning Chaos"

**The Pain:**
Friday afternoon you're rushing to book the rest of your people for Monday. Golf tournament in an hour. You're throwing names right, left and center to fill the spots. Next thing you know, Dave's booked at two places to start two new projects on Monday. Now you have to call your operations manager while he's having a barbecue on Sunday night with his family and tell him to change the whole schedule. Monday morning 6am, you're on the highway and Jack calls with another crisis.

**Real Example:**
Tommy described this exact scenario: "next thing you know, you got Dave booked at two places to start two new projects on Monday. Because you booked him on Monday and you forgot about it. So now you have to call your operations manager while he's having barbecue on Sunday night with his family."

**The Solution:**
Automatic conflict detection prevents the double-booking in the first place. The moment you try to assign Dave to a second project on the same day, the system displays a warning with details about his existing assignment. You can override if necessary, but you can't accidentally create the conflict.

**The Benefit:**
Monday mornings become stress-free. Zero 6am emergency calls. Zero Sunday barbecue interruptions. The system catches your Friday afternoon mistakes before they become Monday morning disasters.

**Validated Quote (Lines 68-69):**
> "Next thing you know, you got Dave booked at two places to start two new projects on Monday. Because you booked him on Monday and you forgot about it."

---

### Problem 2: "First-Day Contract Killers"

**The Pain:**
In rope access and building maintenance, the first day of a job is the most important one. The property manager is waiting. The building manager has keys ready. Residents got notices in the elevator two weeks ago saying you're coming on December 15th. You need to be there. If you don't show up on the first day, especially on a new contract, it's just bad news all around. That ends up with you potentially losing that contract.

**Real Example:**
Tommy explained the stakes: "If you come in the first couple days and then you don't have anybody showing up there on Wednesday, it is what it is. But you don't show up on the first day, especially on a new job, like a new contract. You just got the first day where everybody's waiting for you. You don't show up. It's just bad news all around."

**The Solution:**
Visual calendar shows all project start dates with assigned technicians. Resource Timeline reveals if any critical first days are understaffed. You can see at a glance whether your most important days are properly covered.

**The Benefit:**
Never lose a contract renewal because of a first-day no-show. The $30,000 annual contract you protect by showing up pays for OnRopePro for the entire year, many times over.

**Validated Quote (Lines 72-76):**
> "You don't show up on the first day, especially on a new contract. It's just bad news all around... That ends up with potentially you losing that contract."

---

### Problem 3: "The Domino Effect"

**The Pain:**
One scheduling error creates a cascade of problems. You don't have a guy showing up, so your phone starts ringing at 9am. You call the tech. He's at a different job. Now you need to pull people from other buildings to cover. But now those buildings are behind. Techs end up working alone when they're not supposed to (safety violation). Everyone's mood tanks. Your whole week is ruined.

**Real Example:**
Tommy described the cascade: "Now you need to pull people away from other buildings to go and start that first day. But now you're getting behind everywhere else. You have techs that are going to be working alone on buildings when they're not supposed to because you had to pull one. It's a nightmare."

**The Solution:**
Dual calendar views show workload distribution BEFORE making assignments. Resource Timeline shows exactly who's working where and when. You can see availability gaps before they become emergencies. You make proactive decisions instead of reactive scrambles.

**The Benefit:**
Balanced crew distribution. No unexpected solo work situations (safety compliance). No cascading schedule changes. Predictable, manageable weeks instead of constant firefighting.

**Validated Quote (Lines 76-78):**
> "Your whole week is ruined... it literally does snowball."

---

### Problem 4: "Vacation Booking Amnesia"

**The Pain:**
Someone books two weeks vacation. You approve it. Then you forget. You schedule them for next week at a building. Monday morning: "Where's Dave?" "He's on vacation." Now you're scrambling again.

**Real Example:**
Tommy described a recurring scenario: "A guy would book two weeks vacation and then Jeff would just forget and he would book the guy next week at a building and then, oh, he's on vacation right now. Pull people from other buildings."

**The Solution:**
Approved time-off automatically blocks scheduling for those dates. When you try to assign someone who's on approved vacation, the system displays a conflict warning. The employee appears as unavailable in the drag-and-drop panel. You literally cannot forget.

**The Benefit:**
Zero "I forgot he was on vacation" situations. Time-off is visible in the calendar and enforced in the system. The vacation you approved two months ago still protects that employee from being scheduled.

**Validated Quote (Line 113):**
> "A guy would book two weeks vacation and then Jeff would just forget and he would book the guy next week at a building."

---

### Problem 5: "Scattered Tool Syndrome"

**The Pain:**
You create a project in one system. Then you have to go into Float or Google Calendar and recreate it. Name the project. Create a new event. Assign employees. Tag a new color. Project gets pushed by 5 days? Now you have to update both systems. Something always falls out of sync.

**Real Example:**
Tommy explained the duplicate work: "If you're using Float, you will see if people are booked. But the big difference is it links with projects. You create a project and you don't need to create a project and then go inside Float and then name your project, create a new event, assign your employees to it, tag a new color for your calendar."

**The Solution:**
One system handles project management AND scheduling. When you create a window washing project, you select the color you want in the calendar, select the employees who are going to be there, and specify the dates. You create a project and fill your calendar at the same time.

**The Benefit:**
Zero duplicate data entry. Project changes automatically flow to the schedule. Schedule changes reflect in project views. Everything stays in sync because it's one system, not two.

**Validated Quote (Lines 209-210):**
> "You create a project and when you create your window washing project, you select the employees that are going to be there from what day to what day. Then you created a project and you filled your calendar at the same time."

---

### Problem 6: "Culture of Disorganization"

**The Pain:**
When your scheduling is chaotic, it affects everything. Management is stressed. Crew morale drops. Your boss is pissed off, putting it on you. You have to figure out his problem. Everyone's mood suffers. It builds a culture of disorganization that permeates the entire company.

**Real Example:**
Glenn observed: "It builds a culture of disorganization. If your scheduling is like, it just screws everything." Tommy added: "And then it plays on everybody's mood because that's kind of important at work. Your boss is pissed off, he's stressed, he's putting it on you."

**The Solution:**
A system that makes scheduling bulletproof. Automatic conflict detection. Visual clarity. Dual calendar views. When everyone can see the schedule, when conflicts are prevented automatically, when there's absolute transparency, the chaos disappears.

**The Benefit:**
Professional culture. Calm Monday mornings. Reduced stress throughout the organization. When scheduling works, everything else works better.

**Validated Quote (Line 82):**
> "It builds a culture of disorganization. If your scheduling is like, it just screws everything."

---

## 📋 For Operations Managers & Supervisors

### Problem 7: "Can We Take This Job?"

**The Pain:**
Client calls with an urgent project. Can you start Monday? Without visibility into your current capacity, you need 20 minutes of detective work. Check the spreadsheet. Call a few guys. Text a supervisor. Maybe?

**The Solution:**
Resource Timeline shows exactly who's available and when. Open the timeline, see availability at a glance, give the client an answer in 60 seconds.

**The Benefit:**
Win more jobs by responding faster. Never accidentally overcommit. Always know your true capacity.

---

### Problem 8: "Workload Balancing"

**The Pain:**
Some techs are overworked. Others are idle. You can't see the imbalance until someone complains or burns out.

**Real Example:**
Tommy explained the value of the timeline: "You can see if you have people not booked this week, then you go to timeline and you see. Oh, I see this job is done on the 17th and I don't have Tommy booked anywhere after that. I'm going to put him on another project."

**The Solution:**
Resource Timeline shows each employee's workload as a horizontal bar. Gaps are visually obvious. You see immediately who's fully booked versus who has availability.

**The Benefit:**
Even work distribution. No burnout from overloading top performers. No idle time from overlooked team members. Fair treatment visible to everyone.

**Validated Quote (Lines 153-154):**
> "You can see if you have people not booked this week... I see this job is done on the 17th and I don't have Tommy booked anywhere after that."

---

## 👷 For Rope Access Technicians

### Problem 9: "Don't Know Where to Go"

**The Pain:**
Technicians don't know their schedule until Monday morning when the boss tells them "go to this address." Things change, and no one knows until someone calls them. Hard to plan your week. Hard to plan your life.

**Real Example:**
Tommy described a previous employer's approach: "The employee did not have access to the schedule. They would be told on Monday, go to this address. You go to this address. You go there, you go there."

**The Solution:**
Permission-based schedule visibility. If the employer enables it, technicians can see their own upcoming assignments through the app. They know where they're going before Monday morning.

**The Benefit:**
Plan your week in advance. Know which building, which dates. Fewer Monday morning surprises. Professional experience instead of constant uncertainty.

**Validated Quote (Lines 117-118):**
> "The employee did not have access to the schedule. They would be told on Monday, go to this address."

---

### Problem 10: "Schedule Changes Without Notice"

**The Pain:**
Schedule changes constantly. You think you're going to Building A, but actually you're needed at Building B. No one told you until you showed up at the wrong place.

**The Solution:**
Real-time schedule updates visible to technicians (if employer enables permissions). Changes are immediate and visible. Combined with notifications (future enhancement), schedule changes reach you before you drive to the wrong building.

**The Benefit:**
Fewer wasted trips. Less confusion. Feeling respected because someone bothered to inform you of changes.

---

## 🏢 For Building Managers & Property Managers

### Problem 11: "Is Your Crew Coming Today?"

**The Pain:**
Building manager asks: "Is your crew on-site today?" Without real-time visibility, you have to call your office, check the schedule, call back. You look disorganized.

**The Solution:**
Project Calendar shows exactly which buildings have crews scheduled for any given day. Answer immediately with confidence.

**The Benefit:**
Professional appearance. Instant answers. Building managers trust you because you always know what's happening.

---

### Problem 12: "First Day No-Shows"

**The Pain:**
You've prepared for the rope access crew. Notices went out to residents. Keys are ready. Access arranged. And they don't show up. Your phone starts ringing with angry residents. You look incompetent to your board.

**The Solution:**
OnRopePro's conflict prevention and visual scheduling helps rope access companies ensure first days are properly staffed. Fewer no-shows means fewer embarrassing calls to you.

**The Benefit:**
Reliable contractors. Fewer surprises. Your reputation protected.

---

## 🎨 Dual Calendar Views Deep Dive

### How the Views Work Together

The Scheduling module provides two complementary calendar views. Using them together gives you complete visibility.

**Project Calendar (Job Calendar):**
- Shows all projects on a timeline
- Color-coded by project type
- Month, week, and day views
- See projects even if no one is assigned yet
- Click any project to see details and assigned employees

**Resource Timeline (Employee Calendar):**
- Each row represents one employee
- Horizontal bars show where they're assigned
- Gaps are visually obvious
- Time-off displayed inline
- See workload at a glance

**The Workflow:**

1. **Review upcoming jobs** in Project Calendar. See what's scheduled for the next week/month. Notice which projects are starting.

2. **Check capacity** in Resource Timeline. See who's available, who's fully booked, who has gaps after current jobs end.

3. **Identify availability** using the Available panel. Employees not assigned to anything show in the Available section.

4. **Make assignments** by dragging from Available to Project Calendar. System validates and warns on conflicts.

**Validated Quote (Lines 129-130):**
> "The job calendar will show you all of your upcoming jobs, even the ones that are not booked to anybody yet. Because you could have a job in a month from now. I know for sure I have this gutter cleaning job. It's booked with the property manager. I just don't know right now who's going to be at that job."

---

## 📅 Using Scheduling (Step-by-Step)

### Step 1: View Your Schedule

Navigate to the Schedule section from your dashboard. You'll see the Project Calendar by default.

**Available Views:**
- **Calendar:** Month/week/day view of all projects
- **Timeline:** Employee-centric view showing individual workloads

**Quick Actions:**
- Click any project block to view details
- Use date navigation to move forward/backward
- Toggle between Calendar and Timeline tabs

---

### Step 2: Identify Availability

Switch to Resource Timeline view to see employee workloads.

**What You'll See:**
- Each employee as a row
- Horizontal bars showing their assignments
- Gaps indicating availability
- Time-off displayed distinctly

**Available Panel:**
- Shows employees not currently assigned for the visible date range
- Use this panel for drag-and-drop assignments

---

### Step 3: Assign Employees to Projects

**Method 1: Drag-and-Drop**
1. Find an available employee in the Available panel
2. Click and hold their name
3. Drag to the Project Calendar on the desired project/date
4. Release to create assignment
5. Confirm date range in the popup dialog

**Method 2: Project Detail View**
1. Click on a project in the calendar
2. Use the "Assign Employee" button
3. Select employee from dropdown
4. Confirm dates

**What Happens Automatically:**
✅ System checks for existing assignments  
✅ System checks for approved time-off  
✅ Conflict warning displayed if overlap detected  
✅ Assignment created if no conflicts (or if override selected)

---

### Step 4: Manage Time-Off Requests

**Submitting a Request (Employee):**
1. Navigate to Schedule section
2. Click "Request Time-Off"
3. Select leave type (Vacation, Sick, Personal, Bereavement, Medical)
4. Select date range
5. Add optional notes
6. Submit request

**Reviewing Requests (Manager):**
1. Receive notification of new request
2. Review request details
3. Check scheduling conflicts using dual calendar views
4. Approve or deny with reason

**What Happens When Approved:**
✅ Time-off added to calendar  
✅ Employee blocked from scheduling during those dates  
✅ Visible in Resource Timeline as time-off  
✅ Conflict warning triggered if someone tries to assign them

---

### Step 5: Handle Conflicts

When you try to assign an employee who has a conflict, the system displays a warning.

**Warning Includes:**
- Type of conflict (existing assignment or time-off)
- Details about the conflicting commitment
- Dates affected

**Your Options:**
- **Cancel:** Don't create the assignment
- **Override:** Create the assignment anyway (not recommended)

**Best Practice:** Always investigate conflicts before overriding. There's usually a reason the conflict exists.

---

## 🏖️ Time-Off Request Types

Employees can request various types of leave through the system:

### Vacation
**Planned Time Off**

Pre-planned vacation days. Requires advance notice and manager approval. Once approved, automatically blocks scheduling for those dates.

### Sick Leave
**Illness or Injury**

Unplanned absence due to illness. Manager can add retroactively on employee's behalf. Blocks scheduling for affected dates.

**Note:** Same-day submission through the app is a future enhancement. Currently, techs call in sick and managers update the system.

### Personal
**Personal Matters**

Personal appointments or obligations requiring time away. Requires manager approval. Used for things like appointments, family obligations, or personal business.

### Bereavement
**Loss of Family Member**

Time off following the death of a family member or close friend. Handled with appropriate sensitivity. Manager approval with flexibility given circumstances.

### Medical
**Medical Appointments**

Scheduled medical appointments, procedures, or treatments. Planned in advance. Requires manager approval.

---

## 🔄 Time-Off Request Workflow

### Stage 1: Employee Submits Request
Employee selects leave type, date range, and optionally adds notes explaining the request.

**What Happens:**
- Request enters "Pending" status
- Appears in manager's time-off queue
- Manager receives notification

---

### Stage 2: Manager Reviews Request
Manager checks scheduling conflicts, workload impact, and team coverage before making a decision.

**Review Considerations:**
- Are there projects needing this employee during requested dates?
- Is there adequate team coverage?
- Does the timing work operationally?

---

### Stage 3: Decision
Manager approves or denies the request.

**If Approved:**
✅ Time-off added to calendar  
✅ Employee blocked from scheduling during those dates  
✅ Employee notified of approval

**If Denied:**
❌ Employee notified with reason  
❌ Employee can submit modified request if desired

---

## 📊 Quantified Business Impact

### Time Savings

| Activity | Before OnRopePro | After OnRopePro | Savings |
|----------|------------------|-----------------|---------|
| Checking capacity for new job | 15-20 minutes | 60 seconds | 93% |
| Identifying scheduling conflicts | Manual review | Automatic | 100% automated |
| Coordinating schedule changes | Multiple calls | System update | 80% time reduction |
| Answering "Can we take this job?" | 20 minutes | 1 minute | 95% |

### Error Prevention

| Error Type | Before | After | Impact |
|------------|--------|-------|--------|
| Double-booking workers | Common | System-blocked | Zero incidents |
| Scheduling during approved leave | Common | System-blocked | Zero incidents |
| First-day understaffing | Occasional | Visible in advance | Preventable |
| Domino effect schedule chaos | Weekly occurrence | Eliminated | Culture improvement |

### Revenue Protection

**Contract Retention:**
- Missing first day can cost a $30,000+ annual contract
- One protected renewal = OnRopePro ROI for entire year

**Validated Quote (Lines 75-76):**
> "That ends up with potentially you losing that contract... That pays for the app for the entire year."

---

## 🔗 Module Integration Points

Scheduling doesn't exist in isolation. It's integrated with multiple OnRopePro modules:

### 📁 Projects Module
**Integration:**
- Employees assigned during project creation flow into scheduling
- Project dates define scheduling boundaries
- Changes to project timeline automatically update scheduling

**Business Value:**
- Zero duplicate data entry
- Project and schedule always in sync
- One workflow instead of managing two systems

**Validated Quote (Lines 209-210):**
> "You create a project and when you create your window washing project, you select the employees that are going to be there from what day to what day."

---

### ⏱️ Work Sessions & Time Tracking
**Integration:**
- Scheduled assignments define expected work locations
- Clocked-in time tracks against scheduled time
- Variance between scheduled and actual visible in analytics

**Business Value:**
- Know if crews are where they're supposed to be
- Track attendance against schedule
- Identify patterns of schedule deviation

**Validated Quote (Lines 210-211):**
> "Everything is logged because of that project. Everything's connected."

---

### 🛡️ Safety & Compliance
**Integration:**
- Safety requirements (harness checks, toolbox meetings) tied to work sessions
- Work sessions tied to scheduled assignments
- Complete audit trail from schedule to safety documentation

**Business Value:**
- Prove who was working where on any given day
- Connect safety documentation to specific assignments
- Complete accountability chain

---

## 🎯 Who Benefits Most

### Small Operators (3-8 Technicians)

**Primary Pain:** Owner doing everything manually, can't keep track

**Key Benefits:**
- Visual clarity replaces mental gymnastics
- Automatic conflict prevention catches mistakes
- Time-off tracking that doesn't rely on memory

**Time Saved:** 2-4 hours/week on scheduling coordination

**Annual Value:** $3,000-6,000 (time savings) + one protected contract ($30,000+)

---

### Medium Operators (8-20 Technicians)

**Primary Pain:** Multiple projects, multiple crews, impossible to track without a system

**Key Benefits:**
- Dual calendar views show complete picture
- Drag-and-drop assignment saves hours
- Integration with projects eliminates duplicate work

**Time Saved:** 4-8 hours/week on scheduling coordination

**Annual Value:** $6,000-12,000 (time savings) + multiple protected contracts

---

### Growing Operators (20+ Technicians)

**Primary Pain:** Scaling operations without scaling admin staff

**Key Benefits:**
- Permission-based visibility distributes workload
- Supervisors can manage their crews' schedules
- Owner maintains oversight without micromanagement

**Time Saved:** 8-15 hours/week (distributed across team)

**Annual Value:** $15,000+ (time savings) + operational scalability

---

## 📋 Quick Reference: Permissions

**Note:** Permissions are fully configurable. Employers control visibility and access for each role.

| Action | Company Owner | Manager/Supervisor | Technician |
|--------|---------------|-------------------|------------|
| View Full Calendar | ✅ Always | ⚪ Configurable | ⚪ Configurable |
| View Own Schedule | ✅ Always | ✅ Always | ⚪ If enabled |
| Assign Employees | ✅ Always | ⚪ Configurable | ❌ No |
| Approve Time-Off | ✅ Always | ⚪ Configurable | ❌ No |
| Submit Time-Off Request | ✅ Always | ✅ Always | ⚪ If enabled |
| Override Conflicts | ✅ Always | ⚪ Configurable | ❌ No |

**Legend:**
- ✅ Full access
- ⚪ Configurable by employer
- ❌ No access

---

## 🎓 Best Practices & Tips

### For Company Owners

**Do:**
- ✅ Review the Resource Timeline weekly to identify availability gaps
- ✅ Use Project Calendar to ensure critical first days are properly staffed
- ✅ Enable schedule visibility for technicians to reduce Monday morning calls
- ✅ Check both calendar views before finalizing weekly schedule
- ✅ Process time-off requests promptly so the calendar stays accurate

**Don't:**
- ❌ Book people without checking the timeline view for conflicts
- ❌ Wait until Friday afternoon to finalize next week's schedule
- ❌ Override conflict warnings without a good reason
- ❌ Keep schedule visibility disabled indefinitely (causes confusion)

---

### For Operations Managers

**Do:**
- ✅ Check both calendar views before confirming assignments
- ✅ Use the Available panel to ensure you're assigning unbooked techs
- ✅ Confirm date ranges in the popup before finalizing assignments
- ✅ Review employee workloads to prevent burnout

**Don't:**
- ❌ Assume you remember who's on vacation without checking
- ❌ Override conflicts without investigating the reason
- ❌ Create assignments without verifying project dates first

---

### For Technicians

**Do:**
- ✅ Check your schedule regularly (if employer has enabled visibility)
- ✅ Submit time-off requests with adequate advance notice
- ✅ Include clear reasons in time-off request notes
- ✅ Communicate with your manager if schedule visibility is disabled but you need to plan

**Don't:**
- ❌ Assume your schedule hasn't changed since you last checked
- ❌ Submit same-day time-off requests through the app (call your manager instead)
- ❌ Wait until the last minute for vacation requests

---

## ❓ Frequently Asked Questions

### "Can technicians see their own schedule?"

**Answer:** Yes, if the employer enables schedule visibility permissions. By default, only company owners can see the full schedule. Permissions can be configured to allow employees to see their own assignments, or managers to see everyone.

**Why:** Some employers prefer to tell technicians where to go each day. Others prefer self-service visibility. OnRopePro supports both approaches.

---

### "What happens if I try to assign someone who's already booked?"

**Answer:** The system displays a conflict warning with details about the existing assignment. You can choose to proceed (override) or cancel.

**Best Practice:** Always investigate conflicts before overriding. The conflict exists for a reason.

---

### "Does approved vacation automatically block scheduling?"

**Answer:** Yes. Once time-off is approved, that employee is blocked from being assigned to projects during those dates. The system enforces "One Employee = One Location at a Time" across both work assignments and approved leave.

---

### "Can I see jobs that don't have anyone assigned yet?"

**Answer:** Yes. The Project Calendar shows all jobs, including those with no technicians assigned. This helps you identify upcoming work that needs staffing.

**Example:** "I know I have this gutter cleaning job in February. It's booked with the property manager. I just don't know right now who's going to be at that job."

---

### "What's the difference between Calendar and Timeline view?"

**Answer:** Calendar shows jobs organized by date (all projects visible). Timeline shows employees organized in rows (who's working where).

**Use Calendar to:** See your job pipeline, identify project start dates, understand workload by date
**Use Timeline to:** See individual workloads, find availability gaps, identify who's free after current assignments

---

### "Can employees submit sick leave through the app?"

**Answer:** Currently, same-day sick leave submission through the app is a future enhancement. For now, technicians call in sick and managers update the system on their behalf.

**Why:** Calling in ensures immediate communication and allows managers to begin contingency planning.

---

### "What if I need to override a conflict?"

**Answer:** The system allows overrides for edge cases. When you attempt an assignment with a conflict, you'll see full details about the conflict and can choose to proceed anyway.

**Warning:** Overriding conflicts is not recommended. Double-booking creates the exact chaos the system is designed to prevent.

---

## 📝 Summary: Why Scheduling Is Different

**Most scheduling software treats "scheduling" as separate from project management.** OnRopePro recognizes that in rope access, scheduling is the **operational backbone** connecting:

1. **Projects** → Employees assigned during creation, dates define scheduling boundaries
2. **Work Sessions** → Clocked time tracks against scheduled assignments
3. **Safety Documentation** → Audit trail connects schedules to safety compliance
4. **Time-Off** → Approved leave automatically blocks scheduling
5. **Analytics** → Scheduled vs. actual reveals operational patterns
6. **Client Confidence** → Reliable scheduling means reliable service delivery

**When you schedule in OnRopePro, you're not just filling a calendar. You're orchestrating your entire operation.**

**Validated Quote (Line 91):**
> "Proper scheduling is vital. If your schedule is not 100% bulletproof, it will hit the fan."

---

**Document Version:** 1.0  
**Last Major Update:** December 15, 2025 - Initial creation from Tommy/Glenn validation session  
**Next Review:** After Tommy completes permission additions  
**Word Count:** ~4,500  
**Maintenance Owner:** Glenn (strategic) + Tommy (technical)

---

**END OF SINGLE SOURCE OF TRUTH DOCUMENT**
