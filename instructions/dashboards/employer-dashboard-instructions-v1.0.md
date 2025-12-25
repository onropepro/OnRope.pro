# Employer Dashboard Instructions v1.0
**System**: OnRopePro - Rope Access Management Platform  
**Domain**: Company Operations & Management  
**Version**: 1.0  
**Last Updated**: December 25, 2024  
**Status**: PRODUCTION-READY  
**Safety Critical**: Indirect - Manages safety documentation and compliance tracking

---

## Purpose and Goal

### Primary Objective
The Employer Dashboard is the central command center for rope access company owners and their staff. It provides comprehensive management of projects, employees, clients, equipment, safety documentation, and financial operations. The dashboard uses role-based access control to show only the functionality each user is permitted to access.

### Key Goals
- **Operations Management**: Track projects, schedules, and work progress
- **Workforce Management**: Manage employees, certifications, and time tracking
- **Safety Compliance**: Maintain harness inspections, FLHA forms, toolbox meetings
- **Client Relations**: Manage clients, buildings, and resident feedback
- **Financial Oversight**: Quotes, invoices, and payroll (role-restricted)

### Core Business Value
- **Centralized Control**: All company operations in one place
- **Role-Based Access**: Employees see only what they're authorized to access
- **White-Label Branding**: Companies can customize with their logo and colors
- **Real-Time Visibility**: Live project progress and worker location tracking

---

## System Architecture

### Component Overview

```
+-------------------------------------------------------------------------+
|                      EMPLOYER DASHBOARD                                  |
+-------------------------------------------------------------------------+
|                                                                          |
|  +------------------+     +--------------------+     +----------------+  |
|  | DashboardSidebar |     | DashboardLayout    |     | Dashboard.tsx  |  |
|  | (variant=employer)|     | (wrapper)          |     | (~12K lines)   |  |
|  +------------------+     +--------------------+     +----------------+  |
|         |                         |                         |            |
|         v                         v                         v            |
|  +-------------------------------------------------------------------+  |
|  |                    NAVIGATION GROUPS                               |  |
|  |  Operations | Team | Equipment | Safety | Financial | Clients     |  |
|  +-------------------------------------------------------------------+  |
|         |                                                                |
|         v                                                                |
|  +-------------------------------------------------------------------+  |
|  |                    PERMISSION LAYER                                |  |
|  |  hasFinancialAccess | canManageEmployees | canAccessQuotes | ...  |  |
|  +-------------------------------------------------------------------+  |
|                                                                          |
+-------------------------------------------------------------------------+
```

### Navigation Groups

The sidebar organizes functionality into logical groups:

| Group | Items | Permission Check |
|-------|-------|------------------|
| **Operations** | Home, Projects, Schedule, Work Orders | Base access |
| **Team** | Employees, Time Tracking, Payroll | `canManageEmployees`, `hasFinancialAccess` |
| **Equipment** | Gear Inventory, Harness Register, Vehicles | Base access |
| **Safety** | Inspections, FLHA, Toolbox Meetings, Incidents | Base access |
| **Financial** | Quotes, Invoices, Payments | `hasFinancialAccess` |
| **Clients** | Clients, Buildings, Complaints | Base access |

### Integration Points

- **Upstream Systems**: 
  - User Authentication: Session-based auth provides company context
  - Subscription: License tier affects available features
  
- **Downstream Systems**:
  - Technician Portal: Links technicians to this company
  - Resident Portal: Receives feedback for company's buildings
  - Property Manager Interface: Read-only oversight
  
- **Parallel Systems**:
  - SuperUser Dashboard: Platform-wide administration
  - Help Center: Context-aware documentation

---

## Dependency Impact & Invariants

### Non-negotiable Invariants

#### 1. MULTI-TENANT ISOLATION (CRITICAL)
**Rule**: All data queries MUST filter by `companyId`

Every database query must include the authenticated user's company context:

```typescript
const projects = await db.query.projects.findMany({
  where: eq(projects.companyId, user.companyId)
});
```

- **Impact if violated**: Data leakage between companies
- **Enforcement mechanism**: All storage methods require companyId parameter

#### 2. ROLE-BASED PERMISSION CHECKS (CRITICAL)
**Rule**: Navigation items check permissions via `isVisible()` callback

```typescript
{
  id: "payroll",
  label: "Payroll",
  icon: DollarSign,
  isVisible: () => hasFinancialAccess,
}
```

- **Impact if violated**: Unauthorized access to sensitive data
- **Enforcement mechanism**: Both frontend visibility and backend API checks

#### 3. WHITE-LABEL BRANDING ISOLATION
**Rule**: Company branding only applies to that company's users

```typescript
const companyBranding = user.role === 'company' ? {
  logo: company.logo,
  primaryColor: company.primaryColor,
} : defaultBranding;
```

- **Impact if violated**: Branding confusion, trust issues
- **Enforcement mechanism**: Branding loaded from authenticated user's company

### System Dependencies

- **Work Sessions**: Time tracking integrates with payroll calculations
- **Safety Systems**: Harness inspections, FLHA forms tracked per project
- **Portable Accounts**: Technicians link via invitation system (see ConnectionsGuide)
- **Subscription**: License tier affects feature availability

---

## Technical Implementation

### Primary File
```
client/src/pages/Dashboard.tsx (~12,000+ lines)
```

### Key Permission Flags

```typescript
const hasFinancialAccess = user.role === 'company' || 
  (user.employeePermissions?.includes('financial_access'));

const canManageEmployees = user.role === 'company' || 
  (user.employeePermissions?.includes('manage_employees'));

const canAccessQuotes = user.role === 'company' || 
  (user.employeePermissions?.includes('quotes_access'));

const canViewSchedule = user.role === 'company' || 
  (user.employeePermissions?.includes('schedule_access'));
```

### Navigation Groups Definition

```typescript
const navigationGroups: NavGroup[] = [
  {
    id: "operations",
    label: "OPERATIONS",
    items: [
      { id: "home", label: "Home", icon: Home, isVisible: () => true },
      { id: "projects", label: "Projects", icon: Briefcase, isVisible: () => true },
      { id: "schedule", label: "Schedule", icon: Calendar, isVisible: () => canViewSchedule },
    ],
  },
  {
    id: "team",
    label: "TEAM",
    items: [
      { id: "employees", label: "Employees", icon: Users, isVisible: () => canManageEmployees },
      { id: "payroll", label: "Payroll", icon: DollarSign, isVisible: () => hasFinancialAccess },
    ],
  },
  // ... additional groups
];
```

### Tabs System

The dashboard uses a tab-based interface where each "page" is a tab:

```typescript
type TabType = 'home' | 'projects' | 'employees' | 'clients' | 'complaints' | 
  'schedule' | 'gear' | 'safety' | 'quotes' | 'payroll' | 'settings' | ...;

const [activeTab, setActiveTab] = useState<TabType>('home');
```

### Home Dashboard Customization

The home tab features draggable cards that users can reorder:

```typescript
const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([
  { id: 'projects-overview', title: 'Active Projects', visible: true },
  { id: 'team-status', title: 'Team Status', visible: true },
  { id: 'safety-alerts', title: 'Safety Alerts', visible: true },
  // ...
]);
```

Card order preferences are saved per-user.

---

## Multi-Tenant Considerations

### Data Isolation

- **Company Level**: All data filtered by `companyId`
- **Employee Level**: Employees access based on their `employeePermissions` array
- **Project Level**: Some data further filtered by assigned projects

### White-Label Branding

Companies can customize:
- Logo (uploaded to Object Storage)
- Primary brand color
- Company name display

```typescript
{company.logo && (
  <img src={company.logo} alt={company.companyName} className="h-8" />
)}
```

---

## User Experience

### Desktop Layout
- **Fixed sidebar** (left): 240px width, collapsible
- **Header bar** (top): Search, notifications, user profile
- **Main content area**: Tab-specific content

### Mobile Layout
- **Bottom navigation**: Key tabs as bottom bar icons
- **Hamburger menu**: Full navigation in slide-out drawer
- **Touch-optimized**: Larger touch targets, swipe gestures

### Common Workflows

1. **View Active Projects**
   - Navigate to Projects tab → See project cards with progress indicators
   
2. **Manage Employee Certifications**
   - Navigate to Employees tab → Select employee → View/update certifications
   
3. **Review Safety Documentation**
   - Navigate to Safety tab → View pending inspections, FLHA status

---

## Error Handling & Recovery

### Common Errors

| Error | Cause | User Message | Recovery Action |
|-------|-------|--------------|-----------------|
| Session Expired | Inactivity timeout | "Please log in again" | Redirect to login |
| Permission Denied | Accessing restricted tab | "You don't have access" | Hide nav item via `isVisible()` |
| Data Load Failed | API error | "Unable to load data" | Retry button, show cached if available |

### Graceful Degradation

- **No Internet**: Show cached dashboard data, queue actions for sync
- **Partial Permissions**: Show only accessible sections, hide others
- **API Timeout**: Retry with exponential backoff, show loading states

---

## Testing Requirements

### Permission Tests
```typescript
describe('Dashboard Permissions', () => {
  test('employees tab hidden for non-managers', () => {
    // Render dashboard with employee role without manage_employees permission
    // Assert employees tab is not visible
  });
  
  test('financial tabs hidden without financial_access', () => {
    // Render dashboard without financial_access permission
    // Assert payroll, quotes tabs are not visible
  });
});
```

### Multi-Tenant Tests
```typescript
describe('Data Isolation', () => {
  test('company A cannot see company B projects', () => {
    // Authenticate as company A
    // Attempt to fetch company B project
    // Assert 403 or empty result
  });
});
```

---

## Related Documentation

- [shared-dashboard-components-v1.0.md](./shared-dashboard-components-v1.0.md) - Sidebar and layout components
- [technician-dashboard-instructions-v1.0.md](./technician-dashboard-instructions-v1.0.md) - Technician portal that links to employers
- `work-session-management-instructions-v1.0.md` - Time tracking integration
- `safety-documentation-instructions-v1.0.md` - Safety compliance features

---

## Version History

- **v1.0** (December 25, 2024): Initial documentation
