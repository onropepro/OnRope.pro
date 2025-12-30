# Permission System Instructions v1.0
**System**: Rope Access Management System  
**Domain**: Access Control & Authorization  
**Version**: 1.0  
**Last Updated**: December 26, 2024  
**Status**: PRODUCTION-READY  
**Safety Critical**: Yes - Controls access to safety documentation and compliance features

## Purpose and Goal

### Primary Objective
The permission system provides granular access control for all platform functionality, ensuring employees only see and interact with features appropriate for their role and responsibilities. This is critical for protecting sensitive financial data, restricting access to safety-critical documentation, maintaining multi-tenant data isolation, and supporting hierarchical organizational structures.

### Key Goals
- **Safety**: Limit who can view/modify safety documents, incident reports, and compliance data
- **Efficiency**: Auto-grant related permissions (e.g., quote access includes client visibility)
- **Compliance**: Audit trail through permission-based access logging
- **Accuracy**: Consistent permission checks across frontend and backend
- **Usability**: Clear permission categories that map to real job responsibilities

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PERMISSION SYSTEM FLOW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │  DATABASE   │───▶│   SESSION   │───▶│  FRONTEND   │───▶│     UI      │  │
│  │  STORAGE    │    │   LAYER     │    │   CHECKS    │    │  RENDERING  │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│        │                  │                  │                  │           │
│  users.permissions   req.session        permissions.ts    Conditional      │
│  text[] array       .permissions        utility funcs     components       │
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │
│  │   BACKEND   │───▶│  WEBSOCKET  │───▶│  REAL-TIME  │                     │
│  │ ENFORCEMENT │    │    SYNC     │    │   UPDATES   │                     │
│  └─────────────┘    └─────────────┘    └─────────────┘                     │
│        │                  │                  │                              │
│  requireAuth()      permissions:updated   usePermissionSync               │
│  requireRole()      user:terminated       queryClient.invalidate          │
│  canManage*()       employer:suspended                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow
1. **Input Stage**: Permissions assigned via employee add/edit form or invitation
2. **Validation Stage**: Permission array validated before database storage
3. **Processing Stage**: Session populated with permissions on login
4. **Storage Stage**: Permissions stored as `text[]` in users table
5. **Output Stage**: UI conditionally renders based on permission checks

### Integration Points
- **Upstream Systems**: User authentication (session creation populates permissions)
- **Downstream Systems**: Every feature module checks permissions before rendering/executing
- **Parallel Systems**: WebSocket hub for real-time permission sync across browser tabs

## Dependency Impact & Invariants

### Non-Negotiable Invariants
1. **Company role bypasses all permission checks**
   - Impact if violated: Company owners locked out of their own features
   - Enforcement mechanism: `isCompanyOwner()` check always comes first

2. **Superuser has platform-wide access**
   - Impact if violated: Platform administration blocked
   - Enforcement mechanism: Superuser routes protected by session checks (`req.session.userId === 'superuser'`) in individual route handlers, NOT by `requireRole()` middleware. Superuser bypasses company-scoped checks.

3. **Permissions stored as text array**
   - Impact if violated: Migration failures, data corruption
   - Enforcement mechanism: Drizzle schema enforces `text().array()`

4. **Session permissions sync with database**
   - Impact if violated: Stale permissions until re-login
   - Enforcement mechanism: WebSocket notifications trigger query invalidation

5. **Multi-tenant isolation absolute**
   - Impact if violated: Cross-company data leakage (critical security breach)
   - Enforcement mechanism: All queries filter by `companyId`

### System Dependencies
| Dependent System | How Permissions Affect It |
|------------------|---------------------------|
| **Work Sessions** | `view_work_sessions`, `manage_work_sessions` control visibility/editing |
| **Safety Systems** | `view_safety_documents`, `view_csr`, `view_sensitive_documents` gate access |
| **Payroll** | `view_financial_data` required to see payroll data |
| **Multi-tenant** | Permissions scoped to company; cannot grant cross-company access |
| **Projects** | `view_projects`, `edit_projects` control project access |
| **Employees** | `view_employees`, `edit_employees` control team management |
| **Quotes/CRM** | Quote permissions cascade to `view_clients` |
| **Scheduling** | `view_full_schedule` vs `view_own_schedule` determine scope |
| **Inventory** | `manage_inventory`, `assign_gear` control gear management |

## Technical Implementation

### Database Schema

```typescript
// shared/schema.ts - Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: text("role").notNull(),
  permissions: text("permissions").array().default(sql`ARRAY[]::text[]`),
  // ... other fields
});

// Staff accounts have separate permissions
export const staffAccounts = pgTable("staff_accounts", {
  id: serial("id").primaryKey(),
  permissions: text("permissions").array().notNull().default([]),
  // ... other fields
});
```

### API Endpoints
- `GET /api/user` - Returns current user with permissions array
- `POST /api/employees` - Creates employee with permissions
- `PATCH /api/employees/:id` - Updates employee permissions
- `POST /api/team-invitations` - Creates invitation with permissions

### Critical Functions

**Backend Middleware (server/routes.ts)**
```typescript
// Line 96: Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized - Please log in" });
  }
  next();
}

// Line 115: Role-based middleware
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.session.role)) {
      return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }
    next();
  };
}

// Line 151: Permission helper
function canViewSafetyDocuments(user: any): boolean {
  if (!user) return false;
  if (user.role === 'company') return true;
  const permissions = normalizePermissions(user.permissions);
  return permissions.includes('view_safety_documents');
}

// Line 171: Client management helper
function canManageClients(user: any): boolean {
  if (!user) return false;
  if (user.role === 'company') return true;
  const permissions = normalizePermissions(user.permissions);
  return permissions.includes('manage_clients');
}
```

**Frontend Utilities (client/src/lib/permissions.ts)**
```typescript
// Core permission check - company role always returns true
export function hasPermission(user: User | null | undefined, permission: string): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  return checkPermission(user, permission);
}

// Financial access check
export function hasFinancialAccess(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  if (user.viewFinancialData === true) return true;
  return checkPermission(user, 'view_financial_data');
}

// Safety documents access
export function canViewSafetyDocuments(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  return checkPermission(user, 'view_safety_documents');
}
```

## Role System

### Role Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                        ROLE HIERARCHY                            │
├─────────────────────────────────────────────────────────────────┤
│  SUPERUSER (Platform Admin) - Full platform access              │
│  COMPANY (Company Owner) - Full company access, bypasses checks │
│                                                                  │
│  MANAGEMENT_ROLES (Elevated privileges):                        │
│    owner_ceo, operations_manager, human_resources, accounting,  │
│    account_manager, general_supervisor, rope_access_supervisor  │
│                                                                  │
│  WORKER_ROLES (Field workers):                                  │
│    manager, rope_access_tech, ground_crew_supervisor,           │
│    ground_crew, supervisor, labourer                            │
│                                                                  │
│  SPECIAL ROLES (External stakeholders):                         │
│    resident, property_manager, building_manager                 │
│                                                                  │
│  INTERNAL ROLES:                                                 │
│    staff (13 granular permissions for platform administration)  │
└─────────────────────────────────────────────────────────────────┘
```

### Role Constants

```typescript
// client/src/lib/permissions.ts
export const MANAGEMENT_ROLES = [
  'superuser', 'company', 'owner_ceo', 'human_resources', 'accounting',
  'operations_manager', 'general_supervisor', 'rope_access_supervisor', 'account_manager'
];

export const WORKER_ROLES = [
  'rope_access_tech', 'manager', 'ground_crew', 'ground_crew_supervisor',
  'labourer', 'supervisor'
];

export const EMPLOYEE_ROLES = [...MANAGEMENT_ROLES, ...WORKER_ROLES];
```

## Complete Permission Reference

### UI-Exposed Permissions (PERMISSION_CATEGORIES in Dashboard.tsx)

#### 1. Projects Category
| Permission ID | Translation Key | UI Label | Description |
|---------------|-----------------|----------|-------------|
| `view_projects` | dashboard.permissions.viewProjects | View Projects | View active projects list |
| `view_past_projects` | dashboard.permissions.viewPastProjects | View Past Projects | View completed/deleted projects |
| `create_projects` | dashboard.permissions.createProjects | Create Projects | Create new projects |
| `edit_projects` | dashboard.permissions.editProjects | Edit Projects | Modify project details |
| `delete_projects` | dashboard.permissions.deleteProjects | Delete Projects | Soft-delete projects |
| `log_drops` | dashboard.permissions.logDrops | Log Drops | Log drop counts per elevation |

#### 2. Employees Category
| Permission ID | Translation Key | UI Label | Description |
|---------------|-----------------|----------|-------------|
| `view_employees` | dashboard.permissions.viewEmployees | View Employees | View employee list and details |
| `create_employees` | dashboard.permissions.createEmployees | Create Employees | Add new employees |
| `edit_employees` | dashboard.permissions.editEmployees | Edit Employees | Modify employee details/permissions |
| `delete_employees` | dashboard.permissions.deleteEmployees | Delete Employees | Deactivate employees |

#### 3. Clients Category
| Permission ID | Translation Key | UI Label | Description |
|---------------|-----------------|----------|-------------|
| `view_clients` | dashboard.permissions.viewClients | View Clients | View client/building list |
| `manage_clients` | dashboard.permissions.manageClients | Manage Clients | Create/edit/delete clients |

#### 4. Quotes Category
| Permission ID | Translation Key | UI Label | Description |
|---------------|-----------------|----------|-------------|
| `view_quotes` | dashboard.permissions.viewQuotes | View Quotes | View quote list |
| `create_quotes` | dashboard.permissions.createQuotes | Create Quotes | Create new quotes |
| `edit_quotes` | dashboard.permissions.editQuotes | Edit Quotes | Modify existing quotes |
| `delete_quotes` | dashboard.permissions.deleteQuotes | Delete Quotes | Delete quotes |
| `view_quote_financials` | dashboard.permissions.viewQuoteFinancials | View Quote Financials | View quote pricing/totals |

#### 5. Safety & Compliance Category
| Permission ID | Translation Key | UI Label | Description |
|---------------|-----------------|----------|-------------|
| `view_csr` | dashboard.permissions.viewCsr | View CSR | View Company Safety Rating |

#### 6. Documents Category
| Permission ID | Translation Key | UI Label | Description |
|---------------|-----------------|----------|-------------|
| `view_sensitive_documents` | dashboard.permissions.viewSensitiveDocuments | View Sensitive Documents | View incident reports, COI, damage reports |

#### 7. Inventory & Gear Category
| Permission ID | Translation Key | UI Label | Description |
|---------------|-----------------|----------|-------------|
| `view_inventory` | dashboard.permissions.viewInventory | View Inventory | View gear inventory |
| `manage_inventory` | dashboard.permissions.manageInventory | Manage Inventory | Add/edit/delete gear items |
| `assign_gear` | dashboard.permissions.assignGear | Assign Gear | Assign gear to employees |
| `view_gear_assignments` | dashboard.permissions.viewGearAssignments | View Gear Assignments | View team gear assignments |

#### 8. Work Sessions Category
| Permission ID | Translation Key | UI Label | Description |
|---------------|-----------------|----------|-------------|
| `view_work_sessions` | dashboard.permissions.viewWorkSessions | View Work Sessions | View work session data |
| `manage_work_sessions` | dashboard.permissions.manageWorkSessions | Manage Work Sessions | Edit/close work sessions |
| `view_work_history` | dashboard.permissions.viewWorkHistory | View Work History | View historical session data |
| `view_active_workers` | dashboard.permissions.viewActiveWorkers | View Active Workers | View currently clocked-in workers |

#### 9. Feedback Category
| Permission ID | Translation Key | UI Label | Description |
|---------------|-----------------|----------|-------------|
| `view_complaints` | dashboard.permissions.viewFeedback | View Feedback | View resident feedback |
| `manage_complaints` | dashboard.permissions.manageFeedback | Manage Feedback | Respond to/resolve feedback |

#### 10. Schedule Category
| Permission ID | Translation Key | UI Label | Description |
|---------------|-----------------|----------|-------------|
| `view_full_schedule` | dashboard.permissions.viewFullSchedule | View Full Schedule | View all employee schedules |
| `view_own_schedule` | dashboard.permissions.viewOwnSchedule | View Own Schedule | View only own schedule |
| `edit_schedule` | dashboard.permissions.editSchedule | Edit Schedule | Create/modify schedule entries |

#### 11. Analytics & Financial Category
| Permission ID | Translation Key | UI Label | Description |
|---------------|-----------------|----------|-------------|
| `view_analytics` | dashboard.permissions.viewAnalytics | View Analytics | View performance analytics |
| `view_financial_data` | dashboard.permissions.viewFinancialData | View Financial Data | View payroll and financial data |

### Backend-Only Permissions (Not in UI but enforced server-side)

| Permission ID | Enforced In | Description |
|---------------|-------------|-------------|
| `view_safety_documents` | server/routes.ts line 155, permissions.ts | Access to safety documentation (FLHA, incident reports, etc.) |

### Permission ID Aliases & Naming Discrepancies

**CRITICAL**: The following inconsistencies exist between frontend UI and backend enforcement. These represent technical debt that should be reconciled in a future refactor.

#### Feedback Permission Mismatch (CONFIRMED BUG)
| Layer | Permission ID Used | Location | Code Reference |
|-------|-------------------|----------|----------------|
| UI Display | `view_complaints` | Dashboard.tsx line 223 | `{ id: "view_complaints", labelKey: "dashboard.permissions.viewFeedback" }` |
| Database Storage | `view_complaints` | users.permissions array | Saved via employee add/edit form |
| Backend Enforcement | `view_feedback` | server/routes.ts line 4961 | `user.permissions?.includes('view_feedback')` |

**Impact**: When an admin grants "View Feedback" permission via the employee form, the ID `view_complaints` is stored in the database. However, the complaints endpoint at line 4961 checks for `view_feedback`. **This means the permission does NOT work.**

**Remediation Steps** (choose one):
1. **Fix backend (recommended)**: Change line 4961 in server/routes.ts from `'view_feedback'` to `'view_complaints'`
2. **Fix frontend**: Change Dashboard.tsx line 223 from `"view_complaints"` to `"view_feedback"`

#### Employee Management Helper Pattern
| Location | Function | Permission Checked |
|----------|----------|-------------------|
| Frontend (permissions.ts line 134) | `canManageEmployees()` | `view_employees` |
| Backend (routes.ts) | Inline checks | `view_employees` (no helper) |

**Note**: There is NO backend `canManageEmployees()` helper function. Backend routes use inline permission checks like:
```typescript
const hasPermission = user.role === 'company' || user.permissions?.includes('view_employees');
```

#### Superuser Enforcement Pattern
Superuser access is NOT enforced via `requireRole()` middleware. Two patterns are used:

**Pattern 1: Direct session check** (for user-specific routes)
```typescript
// server/routes.ts line 5002
if (req.session.userId === 'superuser') {
  return res.json({ id: 'superuser', ... });
}
```

**Pattern 2: `isSuperuserOrHasPermission()` helper** (line 855-859, for staff-accessible routes)
```typescript
const isSuperuserOrHasPermission = (req: Request, permission: string): boolean => {
  if (req.session.userId === 'superuser') return true;
  if (req.session.role === 'staff' && req.session.staffPermissions?.includes(permission)) return true;
  return false;
};
```

**Routes using `isSuperuserOrHasPermission`**:
| Permission | Routes (line numbers) |
|------------|----------------------|
| `view_companies` | 6695, 6744, 6766, 6870, 6918 |
| `manage_staff_accounts` | 7070, 7091, 7113, 7168, 7206 |
| `view_founder_resources` | 7239, 7257 |
| `view_tasks` | 8943, 8961, 8988, 9041, 9061, 9119, 9158 |

**How it works**: If `req.session.userId === 'superuser'`, access is granted immediately. Otherwise, it checks if the user is a `staff` account with the required permission in `staffPermissions`.

**Important**: When adding new permissions or modifying checks, ensure consistency between:
1. `PERMISSION_CATEGORIES` in Dashboard.tsx (UI display)
2. Helper functions in `client/src/lib/permissions.ts` (frontend checks)  
3. Inline permission checks in route handlers (backend enforcement)
4. The actual permission ID stored in the database

### Staff Account Permissions (staffAccounts table)

| Permission ID | Description |
|---------------|-------------|
| `view_dashboard` | Access SuperUser dashboard |
| `view_companies` | View company list |
| `view_technicians` | View technician directory |
| `view_buildings` | View global buildings |
| `view_job_board` | View platform job board |
| `view_tasks` | View internal tasks |
| `view_feature_requests` | View feature requests |
| `view_future_ideas` | View future ideas |
| `view_metrics` | View platform metrics |
| `view_goals` | View company goals |
| `view_changelog` | View changelog |
| `view_founder_resources` | View founder resources |
| `manage_staff_accounts` | Manage other staff accounts |

## Permission Cascading Rules

### Quote → Client Dependency

When any quote permission is granted, `view_clients` is automatically added. When all quote permissions are removed, `view_clients` is automatically removed.

**Implementation (Dashboard.tsx lines 260-289)**:
```typescript
const QUOTE_PERMISSIONS = [
  'view_quotes', 'create_quotes', 'edit_quotes', 
  'delete_quotes', 'view_quote_financials'
];

const handlePermissionChange = (
  currentPermissions: string[],
  permissionId: string,
  checked: boolean
): string[] => {
  let newPermissions = checked
    ? [...currentPermissions, permissionId]
    : currentPermissions.filter((p) => p !== permissionId);

  // Enable view_clients when any quote permission is added
  if (checked && QUOTE_PERMISSIONS.includes(permissionId)) {
    if (!newPermissions.includes('view_clients')) {
      newPermissions = [...newPermissions, 'view_clients'];
    }
  }

  // Remove view_clients when all quote permissions are removed
  if (!checked && QUOTE_PERMISSIONS.includes(permissionId)) {
    const hasRemainingQuotePermissions = newPermissions.some(
      (p) => QUOTE_PERMISSIONS.includes(p)
    );
    if (!hasRemainingQuotePermissions) {
      newPermissions = newPermissions.filter((p) => p !== 'view_clients');
    }
  }

  return newPermissions;
};
```

**Applied In**:
- Add Employee form checkbox handler
- Edit Employee form checkbox handler  
- Team Invitation form checkbox handler

## Multi-Tenant Considerations

### Data Isolation
- **Company Level**: All employee permissions scoped to parent company; cannot grant cross-company access
- **Employee Level**: Employees only see data matching their permission set within their company
- **Resident Level**: Residents can only access their linked company's complaint system

### Query Patterns
```typescript
// All permission-gated queries MUST filter by companyId
const employees = await db.query.users.findMany({
  where: and(
    eq(users.companyId, currentUser.companyId),
    // Additional permission-based filters
  )
});
```

### Cross-Tenant Prohibition
- Permissions NEVER allow cross-company access
- `companyId` filter is mandatory on all queries
- Property managers access multiple companies via separate linking table, not permissions

## Safety & Compliance

### Safety-Critical Elements
| Element | Why It's Safety-Critical | Failure Mode | Mitigation |
|---------|--------------------------|--------------|------------|
| `view_safety_documents` | Controls access to FLHA, incident reports | Unauthorized access to sensitive safety data | Backend enforcement + frontend hide |
| `view_csr` | Controls Company Safety Rating visibility | CSR data leak to unauthorized employees | Role-based check + explicit permission |
| `view_sensitive_documents` | Gates incident reports, damage reports | Confidential safety incidents exposed | Double-check on frontend and backend |

### Regulatory Requirements
- **Audit Trail**: All permission changes logged in database (implicit via user update timestamps)
- **Role Separation**: Enforces principle of least privilege for safety documentation
- **Property Manager Read-Only**: External stakeholders cannot modify safety records

## Field Worker Experience

### Mobile Considerations
- **Touch Targets**: Permission checkboxes in employee forms are minimum 44x44px
- **Offline Mode**: Permissions cached in session; changes require connectivity
- **Data Sync**: Permission updates trigger immediate WebSocket notification

### Common Workflows
1. **Supervisor grants technician project access**: Open Employees → Edit → Toggle `view_projects` → Save
2. **Grant quote access**: Toggle any quote permission → `view_clients` auto-selected
3. **Remove all quote access**: Untoggle last quote permission → `view_clients` auto-removed

## Error Handling & Recovery

### Common Errors
| Error | Cause | User Message | Recovery Action |
|-------|-------|--------------|-----------------|
| 401 Unauthorized | Session expired or not logged in | "Please log in" | Redirect to login |
| 403 Forbidden | Missing required permission | "Insufficient permissions" | Contact admin for access |
| Permission not taking effect | WebSocket sync failed | N/A | Refresh page or re-login |

### Graceful Degradation
- **WebSocket Disconnected**: Manual page refresh still works; auto-reconnect after 5 seconds
- **Stale Session**: User sees feature but backend blocks; toast explains access revoked
- **Database Unavailable**: Cached permissions in session remain valid until expiry

## Testing Requirements

### Unit Tests
```typescript
describe('Permission Checks', () => {
  test('company role bypasses all permission checks', () => {
    const companyUser = { role: 'company', permissions: [] };
    expect(hasPermission(companyUser, 'any_permission')).toBe(true);
  });

  test('employee requires explicit permission', () => {
    const employee = { role: 'rope_access_tech', permissions: ['view_projects'] };
    expect(hasPermission(employee, 'view_projects')).toBe(true);
    expect(hasPermission(employee, 'edit_projects')).toBe(false);
  });

  test('quote permission cascades to view_clients', () => {
    const result = handlePermissionChange([], 'view_quotes', true);
    expect(result).toContain('view_clients');
  });
});
```

### Integration Tests
- **Multi-tenant isolation**: Verify employee from Company A cannot access Company B data
- **Role permissions**: Test all role types against all permission checks
- **Cascading rules**: Verify quote→client cascade in all three forms

### Field Testing
- **Permission sync latency**: Measure WebSocket delivery time (target <1 second)
- **Offline behavior**: Verify cached permissions work without network
- **UI consistency**: Confirm hidden elements match backend 403 responses

## Monitoring & Maintenance

### Key Metrics
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| WebSocket permission sync latency | <1 second | >3 seconds |
| 403 error rate | <1% of requests | >5% (potential permission misconfiguration) |
| Session expiry failures | <0.1% | >1% (session store issues) |

### Regular Maintenance
- **Daily**: Monitor 403 error logs for permission issues
- **Weekly**: Audit staff account permissions
- **Monthly**: Review permission distribution across employee roles

## Troubleshooting Guide

### Issue: Permission Not Taking Effect

**Symptoms**: User reports they should have access but can't see feature

**Diagnosis Steps**:
1. Check user's permissions in database:
   ```sql
   SELECT permissions FROM users WHERE id = 'user-id';
   ```
2. Verify session contains updated permissions (may require logout/login)
3. Check WebSocket connection status in browser console
4. Verify frontend is checking correct permission ID

**Solution**:
```typescript
// Force refresh user data
queryClient.invalidateQueries({ queryKey: ['/api/user'] });
```

**Prevention**: Ensure WebSocket hook is mounted in App.tsx

### Issue: Company Owner Blocked from Feature

**Symptoms**: User with `role = 'company'` cannot access something

**Diagnosis Steps**:
1. This should NEVER happen - company role bypasses all checks
2. Look for code that checks specific permission without checking role first
3. Review the permission check function for bugs

**Solution**: Ensure all permission checks follow this pattern:
```typescript
if (isCompanyOwner(user)) return true;  // Always first
return checkPermission(user, 'specific_permission');
```

### Issue: Permission Cascading Not Working

**Symptoms**: Granting quote permission doesn't auto-grant view_clients

**Diagnosis Steps**:
1. Verify `handlePermissionChange` is being called in the form handler
2. Check that QUOTE_PERMISSIONS array contains the permission being toggled
3. Ensure form uses the helper function, not direct state update

**Solution**: All permission toggles must use:
```typescript
const newPermissions = handlePermissionChange(currentPermissions, permId, checked);
```

### Issue: Backend Allows, Frontend Blocks (or vice versa)

**Symptoms**: Inconsistent behavior between API and UI

**Diagnosis Steps**:
1. Compare permission check in frontend vs backend
2. Verify both use same permission ID (e.g., `view_complaints` vs `view_feedback`)
3. Check if backend has additional role-based checks

**Solution**: Standardize permission IDs across frontend and backend; document any aliases

## Related Documentation
- `1. GUIDING_PRINCIPLES.md` - Core philosophy on access control (Section 1.3)
- `3. DEPENDENCY-AWARENESS-INSTRUCTIONS.md` - System integration points (Section 4)
- `instructions/dashboards/employer-dashboard-instructions-v1.0.md` - Dashboard permission usage
- `instructions/unified-login-system-instructions-v1.0.md` - Authentication flow

## Version History
- **v1.0** (December 26, 2024): Initial comprehensive documentation
  - Documented all 34 UI-exposed permissions across 11 categories
  - Documented 3 backend-only permissions (view_safety_documents, manage_employees, view_feedback)
  - Documented 13 staff account permissions
  - Added complete role hierarchy and constants
  - Documented permission cascading (quote→client)
  - Added frontend utility functions with line numbers
  - Added backend enforcement helpers with line numbers
  - Included multi-tenant considerations
  - Added safety & compliance section
  - Included field worker experience patterns
  - Added error handling and recovery procedures
  - Defined testing requirements
  - Added monitoring and maintenance guidelines
  - Created comprehensive troubleshooting guide
