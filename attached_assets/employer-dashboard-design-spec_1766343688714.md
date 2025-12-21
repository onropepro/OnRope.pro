# Employer Dashboard Redesign Specification

## Overview

Redesign the employer Dashboard from a card-grid module launcher into a professional operations command center. The goal is to match the UX quality of Linear, Notion, or Airbnb's host dashboard - interfaces that surface what matters and make daily workflows effortless.

**Reference**: I've attached a source file (employer-dashboard-source.tsx) showing one implementation. Use it as a design reference, not code to copy. Adapt the patterns to our existing component library and architecture.

---

## Core Layout Structure

### Replace the current layout with a sidebar + main content pattern:

```
┌─────────────────────────────────────────────────────────────────┐
│ [SIDEBAR 240px]  │  [MAIN CONTENT - flexible width]            │
│                  │                                              │
│ Logo             │  [Top Header Bar - sticky]                  │
│ Company Selector │  ┌─────────────────────────────────────────┐│
│ ───────────────  │  │ Search         CSR Badge │ Bell │ User ││
│ Dashboard (active)│  └─────────────────────────────────────────┘│
│ ───────────────  │                                              │
│ OPERATIONS       │  [License Warning Banner - if applicable]   │
│   Projects       │                                              │
│   Schedule       │  [Page Title + Date]                        │
│   Timesheets  8  │                                              │
│ ───────────────  │  [ATTENTION REQUIRED - 4 alert cards]       │
│ TEAM             │  ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│   Employees   3  │  │    │ │    │ │    │ │    │               │
│   Certs          │  └────┘ └────┘ └────┘ └────┘               │
│   Job Board      │                                              │
│ ───────────────  │  [METRICS ROW - 4 cards]                    │
│ EQUIPMENT        │  ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│   Inventory      │  └────┘ └────┘ └────┘ └────┘               │
│   Inspections 12 │                                              │
│   Gear Mgmt      │  [MAIN GRID - 7 cols | 5 cols]              │
│ ───────────────  │  ┌───────────────────┐ ┌─────────────┐      │
│ SAFETY           │  │ Active Projects   │ │ Today's     │      │
│   Safety Forms 4 │  │ (list view)       │ │ Schedule    │      │
│   Documents      │  │                   │ ├─────────────┤      │
│   Training       │  │                   │ │ Cert Alerts │      │
│ ───────────────  │  └───────────────────┘ └─────────────┘      │
│ FINANCIAL        │                                              │
│   Payroll        │  [QUICK ACTIONS - button row]               │
│   Quotes & CRM   │                                              │
│   Reports        │                                              │
│ ───────────────  │                                              │
│ COMMUNICATION    │                                              │
│   Property Mgrs  │                                              │
│   Residents      │                                              │
│   Feedback    2  │                                              │
│ ───────────────  │                                              │
│ Settings         │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```

---

## Sidebar Specifications

### Dimensions & Styling
- Width: 240px (w-60)
- Background: white
- Border: right border, slate-200/80
- Position: fixed, full height
- Z-index: 20

### Logo Section (h-14)
- OnRopePro logo (small icon + text)
- Icon: 28x28px, rounded-md, bg-[#0B64A3], white "OR" text
- Font: 15px, font-semibold, text-slate-800

### Company Selector
- Clickable row showing current company
- Company initials in 28x28 rounded square
- Company name (14px, font-medium) + employee count (11px, text-slate-400)
- Chevron right icon on hover
- Bottom border separator

### Navigation Structure
Group modules into these categories (in order):
1. **Operations**: Projects, Schedule, Timesheets
2. **Team**: Employees, Certifications, Job Board
3. **Equipment**: Inventory, Inspections, Gear Management
4. **Safety**: Safety Forms, Documents, Training
5. **Financial**: Payroll, Quotes & CRM, Reports
6. **Communication**: Property Managers, Residents, Feedback

### Navigation Item Styling
- Section headers: 10px, uppercase, font-semibold, text-slate-400, tracking-wider
- Nav items: 13px, text-slate-500
- Hover: bg-slate-50, text-slate-700
- Active (non-dashboard): bg-slate-100, text-slate-900, font-medium
- Dashboard active: bg-[#0B64A3], text-white, shadow-sm

### Badge System
- Alert badges (rose-500 background, white text): For items needing urgent attention
- Info badges (slate-200 background, slate-600 text): For counts
- Size: min-width 18px, height 18px, 10px font, font-semibold

### Settings
- At bottom, separated by top border
- Same styling as nav items

---

## Top Header Bar

### Dimensions & Styling
- Height: 56px (h-14)
- Background: white
- Border: bottom border, slate-200/80
- Position: sticky top-0
- Z-index: 10
- Padding: px-6

### Left Side: Global Search
- Search input with icon
- Width: 320px (w-80)
- Height: 36px (h-9)
- Placeholder: "Search projects, employees, equipment..."
- Background: slate-50
- Border: slate-200
- Focus: ring-2 ring-[#0B64A3]/20, border-[#0B64A3]

### Right Side (flex items-center gap-3)
1. **CSR Score Badge**
   - Clickable button
   - Background: emerald-50, hover emerald-100
   - Shield icon (14px, emerald-600)
   - Score: 13px font-semibold, emerald-700
   - "CSR" label: 11px, emerald-600
   - **Tooltip on hover** showing breakdown:
     - Documentation: XX%
     - Toolbox Meetings: XX%
     - Inspections: XX%
     - Each with progress bar
     - "View CSR Details" link at bottom

2. **Notifications Bell**
   - Icon button, 18px bell icon
   - Red dot indicator if unread (2x2 rounded-full, bg-rose-500)

3. **User Section** (border-left separator)
   - Avatar: 32px circle, bg-[#0B64A3], white initials
   - Name: 14px font-medium
   - Role: 11px text-slate-400

---

## Main Content Area

### Container
- Margin-left: 240px (ml-60) to account for sidebar
- Padding: 24px (p-6)

### License Warning Banner (conditional)
Only show if license needs verification:
- Background: amber-50
- Border: amber-200
- Border-radius: lg
- Layout: flex justify-between items-center
- Left: Warning icon in circle + text
- Right: "Verify License" button (amber-600 background)
- Margin-bottom: 20px

### Page Header
- Title: "Dashboard" - 20px (text-xl), font-semibold
- Subtitle: Current date - 14px, text-slate-500
- Right side: "Quick Add" button (outline variant)
- Margin-bottom: 24px

---

## Attention Required Section

### Purpose
Surface the 4 most critical items needing immediate action. These replace the need to hunt through multiple modules.

### Layout
- 4-column grid, gap-3
- Section header: "ATTENTION REQUIRED" - 12px, uppercase, font-semibold, text-slate-500, tracking-wider

### Alert Card Structure
```
┌─────────────────────────────┐
│ [Icon]              [Count] │  <- Icon in colored square, count large
│ Title                       │  <- 14px font-medium
│ Description                 │  <- 12px text-slate-500
│ Action →                    │  <- 12px font-medium, colored, hover underline
└─────────────────────────────┘
```

### Alert Types & Colors
- **Critical** (rose): Expiring Certifications, Overdue Inspections
  - Border: border-rose-200, hover border-rose-300
  - Icon background: bg-rose-100
  - Icon/count/action: text-rose-600

- **Warning** (amber): Pending Timesheets, Unsigned Documents
  - Border: border-amber-200, hover border-amber-300
  - Icon background: bg-amber-100
  - Icon/count/action: text-amber-600

### Interaction
- Entire card is clickable
- Hover: shadow-md transition
- Click: Navigate to relevant module/action

### Data Sources
Connect each alert to real data:
1. Expiring Certifications: employees with certs expiring within 30 days
2. Overdue Inspections: equipment past inspection due date
3. Pending Timesheets: work sessions awaiting approval
4. Unsigned Documents: safety forms without signatures

---

## Metrics Row

### Layout
- 4-column grid, gap-3
- Margin-bottom: 24px

### Metric Card Structure
```
┌─────────────────────────────┐
│ Label                       │  <- 12px text-slate-500
│ Value                 +X%   │  <- Value: 24px font-semibold; Change: 12px with arrow
│ vs comparison               │  <- 11px text-slate-400
└─────────────────────────────┘
```

### Styling
- Background: white
- Border: slate-200
- Border-radius: lg
- Padding: 16px

### Change Indicators
- Positive: text-emerald-600, ArrowUpRight icon
- Negative: text-rose-600, ArrowDownRight icon

### Metrics to Display
1. Active Projects (count)
2. Team Utilization (percentage)
3. Revenue MTD (currency)
4. Safety Rating (percentage) - CSR score

---

## Main Grid Section

### Layout
- 12-column grid, gap-5
- Left column (col-span-7): Active Projects
- Right column (col-span-5): Schedule + Cert Alerts

### Active Projects Card

**Header**
- Title: "Active Projects" - 14px font-semibold
- Right: "View all" ghost button

**Project Row Structure**
```
┌─────────────────────────────────────────────────────────────┐
│ ● Project Name                                    [→ hover] │
│   Client Name              👥 4   Due Dec 28   ████░░ 68%  │
└─────────────────────────────────────────────────────────────┘
```

- Status dot: emerald-500 (active), slate-300 (scheduled)
- Project name: 14px font-medium
- Client: 12px text-slate-500
- Team count: Users icon + number
- Due date: 12px text-slate-400
- Progress: Progress bar (for active) or "Scheduled" badge (for scheduled)
- Hover: bg-slate-50, show external link icon

### Today's Schedule Card

**Header**
- Title: "Today's Schedule" - 14px font-semibold
- Right: "Full calendar" ghost button

**Schedule Row Structure**
```
┌─────────────────────────────────────────────┐
│ 07:00   Task Name                           │
│         Project Name                        │
│         [MC] [SW] <- team avatars           │
└─────────────────────────────────────────────┘
```

- Time: 12px font-medium text-slate-400, fixed width
- Task: 14px font-medium
- Project: 12px text-slate-500
- Team: Stacked circular avatars with initials

### Certification Alerts Card

**Header**
- Title: "Certification Alerts" - 14px font-semibold
- Right: "View all" ghost button

**Alert Row Structure**
```
┌─────────────────────────────────────────────┐
│ [MC]  Marcus Chen                   25d left│
│       IRATA L2 expires Jan 15               │
└─────────────────────────────────────────────┘
```

- Avatar: 32px circle with initials
- Avatar color: rose-100/rose-700 if ≤10 days, amber-100/amber-700 if >10 days
- Name: 14px font-medium
- Issue: 12px text-slate-500
- Badge: "Xd left" with matching color scheme

---

## Quick Actions Section

### Layout
- Top border separator
- Margin-top: 24px, padding-top: 20px
- Section header: "QUICK ACTIONS" - same style as Attention Required

### Buttons (outline variant, size sm)
- Add Employee
- Review Timesheets
- Run Inspection
- Create Quote
- New Project

Each with appropriate icon (Plus, Clock, Shield, FileText, FolderKanban)

---

## Color System Summary

### Brand Colors
- Primary: #0B64A3 (Ocean Blue)
- Background: #F8FAFC (Cloud)
- Cards: white

### Status Colors
- Critical: rose-500/600
- Warning: amber-500/600
- Success: emerald-500/600
- Info: slate shades

### Text Colors
- Primary: text-slate-900 or text-slate-800
- Secondary: text-slate-500
- Muted: text-slate-400
- Labels: text-slate-500

---

## Typography

- Page title: text-xl (20px) font-semibold
- Section headers: text-xs (12px) uppercase font-semibold tracking-wider
- Card headers: text-sm (14px) font-semibold
- Body text: text-sm (14px)
- Small text: text-xs (12px)
- Tiny labels: text-[11px]

---

## Interaction Patterns

### Hover States
- Cards: shadow-md transition
- List rows: bg-slate-50
- Buttons: Standard Shadcn hover behavior
- Links: underline on hover

### Transitions
- All: transition-all or transition-colors
- Duration: default (150-200ms)

### Focus States
- Inputs: ring-2 ring-[#0B64A3]/20
- Buttons: Standard Shadcn focus behavior

---

## Responsive Considerations

For now, optimize for desktop (1280px+). The sidebar navigation pattern works well for the employer use case where most work happens at a desk.

Mobile adaptation can be a future iteration with:
- Collapsible sidebar
- Stacked grid layouts
- Bottom navigation bar

---

## Data Integration Notes

All displayed data should come from your existing API endpoints. Key queries needed:

1. **Alert counts**: 
   - GET /api/employees/expiring-certifications?days=30
   - GET /api/inventory/inspections/overdue
   - GET /api/work-sessions/pending-approval
   - GET /api/safety-documents/unsigned

2. **Metrics**:
   - Active project count
   - Team utilization calculation
   - Revenue MTD
   - CSR score

3. **Lists**:
   - Active/scheduled projects (limit 4)
   - Today's schedule items
   - Employees with expiring certs (limit 3)

Use React Query with appropriate cache times. Show skeleton loaders while loading, not spinners.

---

## Implementation Order

1. Create sidebar navigation component
2. Refactor main layout to sidebar + content pattern
3. Add top header bar with search and user section
4. Implement CSR tooltip
5. Build alert cards section
6. Add metrics row
7. Create projects list component
8. Create schedule component
9. Create cert alerts component
10. Add quick actions row
11. Connect all data sources
12. Polish transitions and hover states

---

## Testing Checklist

- [ ] Sidebar navigation works (all routes)
- [ ] Active states highlight correctly
- [ ] Alert badges show real counts
- [ ] CSR tooltip displays breakdown
- [ ] License banner shows/hides correctly
- [ ] Alert cards link to correct modules
- [ ] Projects list shows real data
- [ ] Schedule shows today's items
- [ ] All hover states work
- [ ] No console errors
- [ ] Accessible via keyboard
