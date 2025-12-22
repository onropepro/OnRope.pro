# Dashboard Card System Implementation

## What We're Building

A customizable dashboard where employers and employees can add, remove, and reorder widget cards. Users click a "Customize" button to enter edit mode, drag cards to reorder, click X to remove, and use an "Add Card" panel to add new ones.

See attached spec document (`dashboard_card_system_v2.md`) for complete details including card registry, API contracts, and component structure.

## Current State

The dashboard currently exists at `/client/src/pages/Dashboard.tsx` with hardcoded cards showing:
- Active Projects (count + list)
- Safety Rating (CSR score)
- Today's Schedule
- Certification Alerts

These need to become modular, permission-filtered, and user-configurable.

## Technical Stack

- React 18 + TypeScript
- Tailwind CSS
- Drizzle ORM + PostgreSQL
- React Query for data fetching
- Express API routes in `/server/routes.ts`
- Schema in `/shared/schema.ts`

## Implementation Order

### Phase 1: Database + API
1. Add `dashboard_preferences` table to schema (see spec for SQL)
2. Create three API endpoints:
   - `GET /api/dashboard/available-cards` - cards user can add (permission-filtered)
   - `GET /api/dashboard/layout` - user's saved card arrangement
   - `PUT /api/dashboard/layout` - save card arrangement

### Phase 2: Dashboard Infrastructure
1. Add `isEditMode` state to Dashboard
2. Add "Customize" button (gear icon) that toggles edit mode
3. Implement drag-and-drop using `@hello-pangea/dnd` (maintained fork of react-beautiful-dnd)
4. Create `AddCardPanel` component (dropdown grouped by category)
5. Add "Done" button that saves and exits edit mode

### Phase 3: Card Components
Create individual card components in `/client/src/components/dashboard/cards/`:
- Each card fetches its own data via React Query
- Each card has loading skeleton and error state
- Start with these 8 priority cards:
  1. `ActiveProjectsCard`
  2. `ActiveWorkersCard`
  3. `SafetyRatingCard`
  4. `TodayScheduleCard`
  5. `OvertimeAlertCard`
  6. `CertificationAlertsCard`
  7. `OutstandingQuotesCard`
  8. `ToolboxCoverageCard`

### Phase 4: Employee Dashboard
Apply same system to employee view with their limited card set.

## Key Technical Decisions

1. **Cards fetch data independently** - Use React Query with separate queryKey per card. One slow card shouldn't block others.

2. **Permission filtering happens server-side** - `/api/dashboard/available-cards` only returns cards the user has permission to see. No greyed-out or locked cards in UI.

3. **Position is array order** - When saving, card position is derived from array index. No explicit position field needed in PUT request.

4. **Real-time cards poll** - `ActiveWorkersCard` should refetch every 30 seconds. Static cards like `SafetyRatingCard` can cache longer.

5. **Default dashboard on first login** - If user has no saved preferences, show default set (see spec for defaults by role).

## Permission Mapping

Cards check these existing permission fields from user/employee records:
- `canAccessFinancials` - payroll, quotes, costs
- `viewProjects` - project list access  
- `viewWorkSessions` - time tracking access
- `viewSafetyDocuments` - safety forms access
- `viewSchedule` - calendar access
- `manageEmployees` - employee management
- `manageScheduling` - schedule editing
- `viewFeedback` - resident feedback access
- `viewPerformance` - analytics access

Four cards are always visible regardless of permissions: `time-my`, `sched-my`, `safe-csr`, `perf-my`

## File Structure to Create

```
/client/src/components/dashboard/
  DashboardGrid.tsx          # Grid container with drag-drop
  DashboardCard.tsx          # Card wrapper (drag handle, X button in edit mode)
  AddCardPanel.tsx           # "Add Card" dropdown
  CardSkeleton.tsx           # Loading placeholder
  CardError.tsx              # Error state with retry
  /cards/
    ActiveProjectsCard.tsx
    ActiveWorkersCard.tsx
    SafetyRatingCard.tsx
    TodayScheduleCard.tsx
    OvertimeAlertCard.tsx
    CertificationAlertsCard.tsx
    OutstandingQuotesCard.tsx
    ToolboxCoverageCard.tsx
    MyTimeCard.tsx
    MyScheduleCard.tsx
    MyPerformanceCard.tsx
```

## Notes

- Check existing Dashboard.tsx for current data fetching patterns to maintain consistency
- The existing CSR card and Certification Alerts card have working data sources - extract those into the new card components
- Mobile: cards stack single-column, edit mode should still work via long-press or explicit button
