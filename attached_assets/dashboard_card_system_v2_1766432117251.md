# OnRopePro: Dashboard Card System - Implementation Spec

**Version:** 2.0  
**Date:** December 22, 2025  
**Status:** Ready for Development

---

## Overview

Customizable card-based dashboard. Users add, remove, and reorder widgets via edit mode directly on the dashboard. Permission-filtered: users only see cards they have access to.

---

## UX Flow

### Normal State
- Dashboard displays user's saved card layout
- Subtle gear icon (⚙️) top-right labeled "Customize"

### Edit Mode (triggered by gear icon)
1. Cards show drag handles (⠿) and X buttons
2. "+ Add Card" button appears at bottom of dashboard
3. User can:
   - **Drag** cards to reorder
   - **Click X** to remove a card
   - **Click "+ Add Card"** to open selector
4. "Done" button saves and exits

### Add Card Panel
Dropdown/modal grouped by navigation categories:

```
┌─────────────────────────────┐
│ Add Card                  X │
├─────────────────────────────┤
│ OPERATIONS                  │
│   ○ Active Workers          │
│   ○ Not Clocked In          │
│   ● Active Projects ✓       │
│   ○ Today's Hours           │
│                             │
│ FINANCIAL                   │
│   ○ Pay Period Summary      │
│   ○ Overtime Alert          │
│   ○ Outstanding Quotes      │
│                             │
│ SAFETY                      │
│   ● Safety Rating ✓         │
│   ○ Harness Status          │
│   ○ Toolbox Coverage        │
│   ○ Expiring Certs          │
│                             │
│ SCHEDULING                  │
│   ● Today's Schedule ✓      │
│   ○ Time-Off Requests       │
│   ○ My Schedule             │
└─────────────────────────────┘
```

- ✓ = already on dashboard (disabled, can't add twice)
- Cards user lacks permission for simply don't appear
- Click card → adds to bottom of dashboard → panel closes

---

## Card Registry

### OPERATIONS

| Card ID | Name | Description | Permission |
|---------|------|-------------|------------|
| `proj-active` | Active Projects | List with progress % | `viewProjects` |
| `proj-overdue` | Overdue Projects | Past due date | `viewProjects` |
| `time-active` | Active Workers | Who's clocked in now | `viewWorkSessions` |
| `time-notclocked` | Not Clocked In | Scheduled but not started | `manageEmployees` |
| `time-today` | Today's Hours | Company-wide total | `viewWorkSessions` |
| `time-my` | My Time Today | Current user's status | *Always* |

### FINANCIAL

| Card ID | Name | Description | Permission |
|---------|------|-------------|------------|
| `pay-period` | Pay Period Summary | Dates, hours, cost | `canAccessFinancials` |
| `pay-overtime` | Overtime Alert | Approaching/exceeding OT | `canAccessFinancials` |
| `pay-pending` | Pending Approvals | Timesheets to approve | `canAccessFinancials` |
| `quote-pending` | Outstanding Quotes | Awaiting response | `canAccessFinancials` |
| `quote-pipeline` | Sales Pipeline | Counts by stage | `canAccessFinancials` |
| `quote-value` | Pipeline Value | Total $ pending | `canAccessFinancials` |

### SAFETY

| Card ID | Name | Description | Permission |
|---------|------|-------------|------------|
| `safe-csr` | Safety Rating | CSR score + trend | *Always* |
| `safe-harness` | Harness Status | Due/overdue today | `viewSafetyDocuments` |
| `safe-toolbox` | Toolbox Coverage | Missing 7-day meeting | `viewSafetyDocuments` |
| `safe-certs` | Expiring Certs | Within 60 days | `viewSafetyDocuments` |

### SCHEDULING

| Card ID | Name | Description | Permission |
|---------|------|-------------|------------|
| `sched-today` | Today's Schedule | Jobs + crew | `viewSchedule` |
| `sched-week` | Week at a Glance | 7-day mini view | `viewSchedule` |
| `sched-timeoff` | Time-Off Requests | Pending approvals | `manageScheduling` |
| `sched-my` | My Schedule | User's assignments | *Always* |

### TEAM

| Card ID | Name | Description | Permission |
|---------|------|-------------|------------|
| `emp-certs` | Certification Alerts | Expiring IRATA/SPRAT | `manageEmployees` |
| `emp-seats` | Subscription Seats | Used vs available | `manageEmployees` |

### FEEDBACK

| Card ID | Name | Description | Permission |
|---------|------|-------------|------------|
| `feed-new` | New Feedback | Unread count | `viewFeedback` |
| `feed-open` | Open Issues | Not yet closed | `viewFeedback` |

### PERFORMANCE

| Card ID | Name | Description | Permission |
|---------|------|-------------|------------|
| `perf-target` | Target Achievement | % of targets hit | `viewPerformance` |
| `perf-my` | My Performance | User's stats | *Always* |

---

## Default Dashboards

### Employer (Company Owner) - First Login

| Position | Card |
|----------|------|
| 1 | Active Projects |
| 2 | Safety Rating |
| 3 | Today's Schedule |
| 4 | Active Workers |
| 5 | Certification Alerts |

### Employee (Bound to Employer) - First Login

| Position | Card |
|----------|------|
| 1 | My Time Today |
| 2 | My Schedule |
| 3 | Safety Rating |
| 4 | My Performance |

---

## Database Schema

```sql
CREATE TABLE dashboard_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id VARCHAR(50) NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

CREATE INDEX idx_dashboard_user ON dashboard_preferences(user_id);
```

---

## API Endpoints

### GET `/api/dashboard/available-cards`
Returns cards current user can add (filtered by permissions)

**Response:**
```json
{
  "cards": [
    { "id": "proj-active", "name": "Active Projects", "category": "OPERATIONS" },
    { "id": "time-active", "name": "Active Workers", "category": "OPERATIONS" },
    { "id": "safe-csr", "name": "Safety Rating", "category": "SAFETY" }
  ]
}
```

### GET `/api/dashboard/layout`
Returns user's current dashboard layout

**Response:**
```json
{
  "cards": [
    { "id": "proj-active", "position": 1 },
    { "id": "safe-csr", "position": 2 },
    { "id": "sched-today", "position": 3 }
  ]
}
```

### PUT `/api/dashboard/layout`
Save user's dashboard layout

**Request:**
```json
{
  "cards": ["proj-active", "safe-csr", "time-active", "sched-today"]
}
```
Position derived from array order.

### GET `/api/dashboard/card/:cardId`
Fetch data for specific card

**Response:**
```json
{
  "cardId": "time-active",
  "data": {
    "count": 7,
    "workers": [
      { "name": "Sarah Johnson", "project": "Tower Plaza", "since": "08:45" },
      { "name": "Tommy Paquette", "project": "Gateway", "since": "09:00" }
    ]
  }
}
```

---

## Component Structure

```
/components/dashboard/
  DashboardPage.tsx        # Main container, edit mode state
  DashboardGrid.tsx        # Card layout grid
  DashboardCard.tsx        # Card wrapper (handles drag, X button)
  AddCardPanel.tsx         # Dropdown selector
  /cards/
    ActiveProjectsCard.tsx
    ActiveWorkersCard.tsx
    SafetyRatingCard.tsx
    TodayScheduleCard.tsx
    ... (one file per card)
```

### Card Component Pattern

```tsx
// cards/ActiveWorkersCard.tsx
export function ActiveWorkersCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-card', 'time-active'],
    queryFn: () => fetch('/api/dashboard/card/time-active').then(r => r.json()),
    refetchInterval: 30000  // Real-time: refresh every 30s
  });

  if (isLoading) return <CardSkeleton />;
  if (error) return <CardError onRetry={refetch} />;

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <Users className="icon" />
        <span>Active Workers</span>
        <span className="count">{data.count}</span>
      </div>
      <div className="card-body">
        {data.workers.map(w => (
          <div key={w.name} className="worker-row">
            <span>{w.name}</span>
            <span className="project">{w.project}</span>
            <span className="time">{w.since}</span>
          </div>
        ))}
      </div>
      <Link to="/timesheets" className="card-footer">View all →</Link>
    </div>
  );
}
```

---

## Grid Layout

4-column CSS grid, responsive:

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (max-width: 1024px) {
  .dashboard-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}
```

All cards span 1 column (uniform sizing for MVP).

---

## Edit Mode State

```tsx
// DashboardPage.tsx
const [isEditMode, setIsEditMode] = useState(false);
const [cards, setCards] = useState<string[]>([]);  // Card IDs in order

// On drag end
const handleDragEnd = (result: DropResult) => {
  if (!result.destination) return;
  const reordered = Array.from(cards);
  const [removed] = reordered.splice(result.source.index, 1);
  reordered.splice(result.destination.index, 0, removed);
  setCards(reordered);
};

// On remove
const handleRemove = (cardId: string) => {
  setCards(cards.filter(c => c !== cardId));
};

// On add
const handleAdd = (cardId: string) => {
  setCards([...cards, cardId]);
};

// On done
const handleDone = async () => {
  await fetch('/api/dashboard/layout', {
    method: 'PUT',
    body: JSON.stringify({ cards })
  });
  setIsEditMode(false);
};
```

---

## Implementation Phases

### Phase 1: Core Infrastructure (3-4 days)
- [ ] Database table
- [ ] API endpoints (3)
- [ ] DashboardPage with edit mode toggle
- [ ] DashboardGrid with drag-drop (react-beautiful-dnd)
- [ ] AddCardPanel component

### Phase 2: Priority Cards (4-5 days)
- [ ] ActiveProjectsCard
- [ ] ActiveWorkersCard
- [ ] SafetyRatingCard
- [ ] TodayScheduleCard
- [ ] OvertimeAlertCard
- [ ] CertificationAlertsCard
- [ ] OutstandingQuotesCard
- [ ] ToolboxCoverageCard

### Phase 3: Remaining Cards (3-4 days)
- [ ] All "My" cards (time, schedule, performance)
- [ ] Remaining cards from registry

### Phase 4: Polish (1-2 days)
- [ ] Loading skeletons
- [ ] Error states per card
- [ ] Mobile drag behavior
- [ ] Empty state (no cards)

**Total estimate: 2-3 weeks**

---

## Notes

- **No card size toggle** for MVP - one size per card
- **Cards without permission don't appear** - no greyed/locked states
- **Auto-save on Done** - single API call
- **Independent card loading** - one slow card doesn't block others
- **Refresh intervals vary by card** - real-time cards poll, static cards cache

---

**Total Cards:** 24  
**Priority Cards for MVP:** 8  
**Always-visible Cards:** 4 (`time-my`, `sched-my`, `safe-csr`, `perf-my`)
