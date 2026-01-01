# Building Manager Dashboard Instructions v1.0
**System**: OnRopePro - Rope Access Management Platform  
**Domain**: Building Portal & Project Visibility  
**Version**: 1.0  
**Last Updated**: January 1, 2026  
**Status**: PRODUCTION-READY  
**Safety Critical**: No - Building information management, not direct safety operations

---

## Overview

The Building Portal (`/building-portal`) provides building managers with a dedicated interface to view project progress, update building information, and access service history. Unlike other stakeholder dashboards, building manager accounts are **automatically created** when a company owner creates a project for a new building.

---

## Account Creation Flow

### Automatic Account Provisioning

Building manager accounts are created automatically through the following flow:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     BUILDING ACCOUNT AUTO-CREATION                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. COMPANY OWNER creates a new project                                     │
│     └── Enters building details including Strata Plan Number               │
│         └── Building does NOT exist in database                            │
│                                                                             │
│  2. SYSTEM automatically creates:                                           │
│     └── New building record                                                │
│     └── Building manager account with:                                     │
│         ├── Login: Strata Plan Number (e.g., "BCS1234")                   │
│         └── Temporary Password: Strata Plan Number (same as login)        │
│                                                                             │
│  3. BUILDING MANAGER first login:                                           │
│     └── Enters strata number + strata number as password                   │
│     └── SEES PASSWORD CHANGE WARNING                                       │
│         └── "Your password has not been changed. Please update it."        │
│                                                                             │
│  4. After password change:                                                  │
│     └── Full access to Building Portal features                            │
│     └── Password warning no longer displayed                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Login Credentials

| Field | Initial Value | Notes |
|-------|--------------|-------|
| **Login** | Strata Plan Number | e.g., "BCS1234", "LMS5678" |
| **Password** | Strata Plan Number | Same as login - TEMPORARY |

### Password Change Tracking

The system tracks whether the password has been changed via `passwordChangedAt`:

```typescript
interface BuildingData {
  id: string;
  strataPlanNumber: string;
  passwordChangedAt: string | null; // null = never changed (show warning)
  // ... other fields
}
```

**Warning Display Logic**: If `passwordChangedAt` is `null`, display a prominent warning banner advising the building manager to change their password for security.

---

## Portal Features

### 1. Dashboard View

After authentication, building managers see:

- **Building Overview**: Name, address, strata number, total units
- **Project Statistics**: Total projects, completed, active
- **Password Change Warning** (if applicable)

### 2. Active Project Progress

Building managers can view real-time progress of ongoing projects:

| Progress Type | Display |
|---------------|---------|
| **Drops** | North/South/East/West completion percentages |
| **Suites** | Completed vs total suites |
| **Stalls** | Completed vs total stalls (parking structures) |
| **Hours** | Logged hours vs estimated hours |

Each active project displays:
- Job type and status
- Vendor company name and contact info
- Scheduled dates
- Resident feedback code
- Visual progress bar

### 3. Building Instructions Management

Building managers can update information that is displayed within projects:

```typescript
interface BuildingInstructions {
  buildingAccess: string;        // How to access the building
  keysAndFob: string;           // Key/fob pickup location
  keysReturnPolicy: string;     // Return instructions
  roofAccess: string;           // Roof access details
  specialRequests: string;      // Any special requirements
  buildingManagerName: string;  // Contact name
  buildingManagerPhone: string; // Contact phone
  conciergeNames: string;       // Concierge staff names
  conciergePhone: string;       // Concierge phone
  conciergeHours: string;       // Concierge availability
  maintenanceName: string;      // Maintenance contact
  maintenancePhone: string;     // Maintenance phone
  councilMemberUnits: string;   // Strata council unit numbers
  tradeParkingInstructions: string; // Parking for workers
  tradeParkingSpots: string;    // Number of spots available
  tradeWashroomLocation: string; // Washroom location for workers
}
```

**Integration with Projects**: When a company creates a project for this building, these instructions are automatically available to the project team.

### 4. Project History

Complete history of all projects at the building:
- Job type and custom job type
- Status (completed, in-progress, cancelled)
- Start and end dates
- Vendor company name
- Creation date

### 5. Work Notices

View work notices published for the building:
- Title and content
- Work date range
- Associated project details
- Download as PDF

---

## Technical Implementation

### Primary File
```
client/src/pages/BuildingPortal.tsx (~1,627 lines)
```

### Route
```
/building-portal
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/building/portal` | GET | Fetch portal data (building info, projects, stats) |
| `/api/building/login` | POST | Authenticate building manager |
| `/api/building/change-password` | POST | Change password |
| `/api/buildings/:id/instructions` | GET | Fetch building instructions |
| `/api/buildings/:id/instructions` | PUT | Update building instructions |

### Authentication Flow

```typescript
// Login mutation
const loginMutation = useMutation({
  mutationFn: async (data: { strataPlanNumber: string; password: string }) => {
    const response = await apiRequest("POST", "/api/building/login", data);
    return response.json();
  },
  onSuccess: () => {
    refetchPortal(); // Load portal data after successful login
  }
});
```

### State Management

The portal uses React Query for data fetching:

```typescript
const { data: portalData, isLoading, error, refetch } = useQuery<PortalData>({
  queryKey: ["/api/building/portal"],
  retry: false,
  refetchOnWindowFocus: false,
});
```

---

## User Interface

### Layout

The Building Portal uses a **standalone layout** (no sidebar) with:
- Header with building name and logout button
- Card-based content sections
- Responsive design for mobile access

### Key UI Components

| Component | Purpose |
|-----------|---------|
| Login Card | Strata number + password form |
| Password Warning Banner | Alerts when password hasn't been changed |
| Building Info Card | Displays building details |
| Active Projects Section | Shows ongoing work with progress |
| Project History Table | Lists all past projects |
| Instructions Dialog | Edit building instructions form |
| Change Password Dialog | Update password form |

### Visual Design

- **Brand Color**: #B89685 (Taupe) - matches `building-manager` variant in DashboardSidebar
- **No sidebar**: Standalone page design
- **Card-based layout**: Information organized in distinct cards

---

## Security Considerations

### Password Security

1. **Initial Password Warning**: Prominent banner when password equals strata number
2. **Password Validation**: New password must differ from current
3. **Session Management**: Session-based authentication

### Data Access

Building managers can only:
- View projects associated with their building
- Edit building instructions for their building
- View work notices for their building

They **cannot**:
- Access other buildings
- Modify project details
- View financial information
- Access worker personal data

---

## Related Documentation

- [shared-dashboard-components-v1.0.md](./shared-dashboard-components-v1.0.md) - Shared UI components
- [employer-dashboard-instructions-v1.0.md](./employer-dashboard-instructions-v1.0.md) - Company owner creates buildings/projects
- [resident-dashboard-instructions-v1.0.md](./resident-dashboard-instructions-v1.0.md) - Resident feedback for same buildings

---

## Version History

- **v1.0** (January 1, 2026): Initial documentation - Building Portal with auto-account creation flow, project progress visibility, and building instructions management
