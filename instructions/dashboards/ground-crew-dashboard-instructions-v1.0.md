# Ground Crew Dashboard (Portal) Instructions v1.0
**System**: OnRopePro - Rope Access Management Platform  
**Domain**: Ground Crew Personal Portal & Employment  
**Version**: 1.0  
**Last Updated**: December 25, 2024  
**Status**: PRODUCTION-READY  
**Safety Critical**: Indirect - Tracks employment and personal safety documents

---

## Purpose and Goal

### Primary Objective
The Ground Crew Portal is the personal dashboard for ground-based support workers who assist rope access technicians. Similar to the Technician Portal but with role-specific features, it manages profile information, employer connections, work history, and document uploads. Ground crew members work alongside technicians but do not perform rope access work themselves.

### Key Goals
- **Profile Management**: Personal information, emergency contacts, payroll details
- **Employment Connections**: Link to employers via team invitations
- **Document Storage**: Upload licenses, first aid certificates, void cheques
- **Job Discovery**: Browse ground crew job board

### Core Business Value
- **Portable Account**: One account works across all employers
- **Document Centralization**: All work documents in one place
- **Employer Flexibility**: Connect to multiple employers with portable account
- **Role-Specific Features**: Tailored for ground crew needs (no certification tracking)

---

## System Architecture

### Component Overview

```
+-------------------------------------------------------------------------+
|                      GROUND CREW PORTAL                                  |
+-------------------------------------------------------------------------+
|                                                                          |
|  +------------------+     +--------------------+     +------------------+|
|  | DashboardSidebar |     | GroundCrewPortal   |     | Portal State     ||
|  | (variant=gc)     |     | (~2K lines)        |     | (Linked/Unlinked)||
|  +------------------+     +--------------------+     +------------------+|
|         |                         |                         |            |
|         v                         v                         v            |
|  +-------------------------------------------------------------------+  |
|  |                    NAVIGATION GROUPS                               |  |
|  |  Dashboard Link | Navigation | Employment | Resources              |  |
|  +-------------------------------------------------------------------+  |
|                                                                          |
+-------------------------------------------------------------------------+
```

### Portal States & Dashboard Experiences

**SAME PATTERN AS TECHNICIAN**: Ground crew can access **two completely separate dashboards** when linked:

| Experience | Route | Component | Sidebar Variant | Brand Color |
|------------|-------|-----------|-----------------|-------------|
| Personal Portal | `/ground-crew-portal` | `GroundCrewPortal.tsx` | `variant="ground-crew"` | Forest Green `#5D7B6F` |
| Work Dashboard | `/dashboard` | `Dashboard.tsx` via `DashboardLayout` | `variant="employer"` | Blue `#0B64A3` |

**Unlinked**: Personal Portal only (green sidebar)  
**Linked**: Both Personal Portal (green) AND Work Dashboard (blue employer sidebar)

### Comparison: Ground Crew vs Technician

| Feature | Ground Crew | Technician |
|---------|-------------|------------|
| Portal File | `GroundCrewPortal.tsx` (~2K lines) | `TechnicianPortal.tsx` (~6.4K lines) |
| Brand Color | Forest Green `#5D7B6F` | Rust `#AB4521` |
| IRATA/SPRAT Certification | No | Yes |
| Rope Access Hours Logging | No | Yes |
| Safety Rating (PSR) | No | Yes |
| Job Board | `/ground-crew-job-board` | `/technician-job-board` |
| PLUS Access Tier | No | Yes (referral system) |
| Visibility Settings | No | Yes |
| Work Dashboard Access | Yes (when linked) | Yes (when linked) |

### Integration Points

- **Upstream Systems**: 
  - Portable Accounts: Same architecture as technician
  - Team Invitations: Same invitation workflow
  
- **Downstream Systems**:
  - Employer Dashboard: Linked ground crew appear in team
  - Job Board: Ground crew-specific listings

---

## Dependency Impact & Invariants

### Non-negotiable Invariants

#### 1. PORTABLE ACCOUNT ARCHITECTURE
**Rule**: Ground crew accounts follow same portable account pattern as technicians

```typescript
// Ground crew maintains personal data independent of employer
users.role = 'ground_crew'  // or 'ground_crew_supervisor'
users.companyId             // Current employer (nullable)
```

- **Impact if violated**: Employment history lost on job change
- **Enforcement mechanism**: Personal data on user record, not employer-controlled

#### 2. ROLE-BASED FEATURE VISIBILITY
**Rule**: Ground crew does not see technician-specific features

Ground crew portal excludes:
- IRATA/SPRAT certification tracking
- Rope access hours logging
- Safety Rating (PSR)
- Practice quizzes
- Visibility settings (employer search)

- **Impact if violated**: Confusion, incorrect data collection
- **Enforcement mechanism**: Separate portal with different navigation groups

---

## Technical Implementation

### Primary File
```
client/src/pages/GroundCrewPortal.tsx (~2,070 lines)
```

### Navigation Groups

```typescript
const groundCrewNavGroups: NavGroup[] = [
  {
    id: "dashboard",
    label: "",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", isVisible: () => true },
    ],
  },
  {
    id: "main",
    label: "NAVIGATION",
    items: [
      { id: "home", label: "Home", icon: Home, onClick: () => setActiveTab('home'), isVisible: () => true },
      { id: "profile", label: "Profile", icon: User, onClick: () => setActiveTab('profile'), isVisible: () => true },
      { id: "more", label: "More", icon: MoreHorizontal, onClick: () => setActiveTab('more'), isVisible: () => true },
    ],
  },
  {
    id: "employment",
    label: "EMPLOYMENT",
    items: [
      { id: "job-board", label: "Job Board", icon: Briefcase, href: "/ground-crew-job-board", isVisible: () => true },
      { id: "invitations", label: "Team Invitations", icon: Mail, badge: pendingInvitations.length, badgeType: "alert", isVisible: () => true },
    ],
  },
  {
    id: "resources",
    label: "RESOURCES",
    items: [
      { id: "help", label: "Help Center", icon: Shield, href: "/help", isVisible: () => true },
    ],
  },
];
```

### Tabs System

```typescript
type TabType = 'home' | 'profile' | 'invitations' | 'more';

const [activeTab, setActiveTab] = useState<TabType>('home');
```

### Profile Fields

Ground crew profiles include:
- Personal information (name, email, phone, birthday)
- Address details
- Emergency contact
- Payroll information (SIN, bank details)
- Driver's license
- Medical conditions
- First aid certification
- Uploaded documents (license photos, void cheque, driver abstract)

### Multilingual Support

Same as Technician Portal: English, French, Spanish

---

## User Experience

### Desktop Layout
- **Fixed sidebar** (left): Ground crew-branded (#5D7B6F) using `DashboardSidebar` with `variant="ground-crew"`
- **Header bar** (top): `DashboardSearch` component (visible on md+ screens), `LanguageDropdown`, profile button, logout
- **Main content area**: Tab-specific content (`home`, `profile`, `invitations`, `more`)

### Common Workflows

1. **Accept Team Invitation**
   - Receive invitation → Navigate to Invitations tab → Accept/Decline → Linked to employer
   
2. **Update Profile**
   - Profile tab → Edit Profile → Update personal/payroll/document info → Save
   
3. **Upload Documents**
   - Profile tab → Documents section → Upload license/abstract/void cheque

---

## Testing Requirements

### Role Tests
```typescript
describe('Ground Crew Portal', () => {
  test('ground_crew role can access portal', () => {
    // Authenticate as ground_crew role
    // Assert portal loads correctly
  });
  
  test('technician-specific features not visible', () => {
    // Render ground crew portal
    // Assert no IRATA certification UI
    // Assert no hours logging UI
  });
});
```

---

## Related Documentation

- [shared-dashboard-components-v1.0.md](./shared-dashboard-components-v1.0.md) - Sidebar and layout components
- [technician-dashboard-instructions-v1.0.md](./technician-dashboard-instructions-v1.0.md) - Similar portal for technicians
- [employer-dashboard-instructions-v1.0.md](./employer-dashboard-instructions-v1.0.md) - Employer dashboard ground crew links to
- `ConnectionsGuide.tsx` - Portable accounts architecture

---

## Version History

- **v1.0** (December 25, 2024): Initial documentation
