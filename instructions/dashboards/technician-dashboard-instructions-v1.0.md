# Technician Dashboard (Portal) Instructions v1.0
**System**: OnRopePro - Rope Access Management Platform  
**Domain**: Technician Personal Portal & Employment  
**Version**: 1.0  
**Last Updated**: December 25, 2024  
**Status**: PRODUCTION-READY  
**Safety Critical**: Indirect - Tracks certifications and safety documentation

---

## Purpose and Goal

### Primary Objective
The Technician Portal is the personal dashboard for rope access technicians. It manages their profile, certifications, employer connections, work history, and safety documents. The portal supports two distinct states based on employment status, enabling technicians to maintain a portable account that follows them across employers.

### Key Goals
- **Profile Management**: Personal information, certifications, emergency contacts
- **Employment Connections**: Link to employers via invitation codes, manage multiple connections
- **Work History Tracking**: Log hours, track certification progress
- **Safety Documentation**: Personal harness inspections, safety records
- **Job Discovery**: Browse job board, manage profile visibility to employers

### Core Business Value
- **Portable Account**: One account works across all employers
- **Certification Tracking**: Automated expiry alerts and verification
- **PLUS Access Tier**: Referral system unlocks advanced features
- **Network Effect**: More employers = more value for technicians

---

## System Architecture

### Component Overview

```
+-------------------------------------------------------------------------+
|                      TECHNICIAN PORTAL                                   |
+-------------------------------------------------------------------------+
|                                                                          |
|  +------------------+     +--------------------+     +------------------+|
|  | DashboardSidebar |     | TechnicianPortal   |     | Portal State     ||
|  | (variant=tech)   |     | (~6.4K lines)      |     | (Linked/Unlinked)||
|  +------------------+     +--------------------+     +------------------+|
|         |                         |                         |            |
|         v                         v                         v            |
|  +-------------------------------------------------------------------+  |
|  |                    NAVIGATION GROUPS                               |  |
|  |  Navigation | Employment | Logging | Safety                        |  |
|  +-------------------------------------------------------------------+  |
|         |                                                                |
|         v                                                                |
|  +-------------------------------------------------------------------+  |
|  |                    STATE-BASED FEATURES                            |  |
|  |  UNLINKED: Job Board, Invitations    |  LINKED: Work Dashboard    |  |
|  |  PLUS: Multi-employer connections     |  Access to employer tools  |  |
|  +-------------------------------------------------------------------+  |
|                                                                          |
+-------------------------------------------------------------------------+
```

### Portal States & Dashboard Experiences

**CRITICAL ARCHITECTURE DISTINCTION**: Technicians can access **two completely separate dashboards** with different layouts and navigation:

| Experience | Route | Component | Sidebar Variant | Brand Color |
|------------|-------|-----------|-----------------|-------------|
| Personal Portal | `/technician-portal` | `TechnicianPortal.tsx` | `variant="technician"` | Rust `#AB4521` |
| Work Dashboard | `/dashboard` | `Dashboard.tsx` via `DashboardLayout` | `variant="employer"` | Blue `#0B64A3` |

#### 1. UNLINKED State
When `user.companyId` is null or `user.terminatedDate` is set:
- **Personal Portal Only**: Uses `TechnicianPortal.tsx` with technician-branded sidebar
- **Job Board Access**: Browse available positions
- **Profile Visibility**: Control discoverability by employers
- **Invitations**: Receive and respond to team invitations
- **Self-Service Profile**: Manage certifications and documents
- **"Go to Work Dashboard" button**: Disabled (no employer connection)

#### 2. LINKED State
When `user.companyId` is set and no termination:

**Two Dashboard Access Points:**

1. **Personal Portal** (`/technician-portal`):
   - Still uses `TechnicianPortal.tsx` with rust-colored technician sidebar
   - Manages personal profile, certifications, visibility settings
   - PLUS features, referral tracking, employer connections

2. **Work Dashboard** (`/dashboard`):
   - Navigates to `Dashboard.tsx` wrapped in `DashboardLayout`
   - Uses **employer's blue sidebar** (`variant="employer"`)
   - Access to employer's projects, safety forms, clock-in/out
   - Technician sees same navigation as employer's other staff
   - Button: "Go to Work Dashboard" on Personal Portal home tab

```
LINKED TECHNICIAN HAS TWO EXPERIENCES:
┌─────────────────────────────────────────────────────────────────┐
│  /technician-portal (Personal)     │  /dashboard (Work)        │
│  ─────────────────────────────     │  ──────────────────       │
│  TechnicianPortal.tsx              │  Dashboard.tsx             │
│  variant="technician"              │  variant="employer"        │
│  Brand: #AB4521 (Rust)             │  Brand: #0B64A3 (Blue)     │
│                                    │                            │
│  Personal profile management       │  Employer's projects       │
│  Certifications & documents        │  Safety forms              │
│  Job board browsing                │  Clock in/out              │
│  Employer connections              │  Team schedule             │
│  PLUS features                     │  Work session logging      │
└─────────────────────────────────────────────────────────────────┘
```

### PLUS Access Tier

Unlocked via referral system (`user.hasPlusAccess === true`):
- **Multi-Employer Connections**: Link to multiple companies
- **Advanced Logging**: Detailed task-level hour tracking
- **Export Features**: PDF/CSV work history exports
- **60-Day Certification Alerts**: Early expiry warnings
- **Enhanced Visibility**: Profile featured in employer searches

### Integration Points

- **Upstream Systems**: 
  - Portable Accounts: See `ConnectionsGuide.tsx`
  - Referral System: Tracks who referred whom
  
- **Downstream Systems**:
  - Employer Dashboard: Linked technicians appear in team
  - Job Board: Profile visible when opted-in
  
- **Parallel Systems**:
  - IRATA/SPRAT Verification: Screenshot-based cert validation
  - Personal Safety Docs: Individual harness inspections

---

## Dependency Impact & Invariants

### Non-negotiable Invariants

#### 1. PORTABLE ACCOUNT ARCHITECTURE (CRITICAL)
**Rule**: One technician account can connect to multiple employers (with PLUS access)

The technician's identity and work history persist independent of any employer:

```typescript
// Technician maintains personal data regardless of employer
users.irataNumber       // Personal certification
users.irataExpiry       // Personal expiry date  
users.ropeAccessStartDate // Career start

// Employer relationship is a connection, not ownership
users.companyId         // Current primary employer (nullable)
users.hasPlusAccess     // Can connect to multiple employers
```

- **Impact if violated**: Work history lost on employer change
- **Enforcement mechanism**: Personal data stored on user record, not employer-controlled

#### 2. LINKED VS UNLINKED STATE DETERMINATION
**Rule**: State determined by `companyId` presence and `terminatedDate` absence

```typescript
const isLinked = user.companyId && !user.terminatedDate;
const canReceiveInvitations = !user.companyId || !!user.terminatedDate || user.hasPlusAccess;
```

- **Impact if violated**: Incorrect feature access
- **Enforcement mechanism**: State checked before rendering state-specific features

#### 3. PLUS ACCESS UNLOCKING
**Rule**: PLUS access granted when referred technician completes verification

```typescript
// When a referred technician becomes verified:
// 1. Find the referrer via referralCode
// 2. Set referrer.hasPlusAccess = true
```

- **Impact if violated**: Referral incentive system fails
- **Enforcement mechanism**: Automatic grant on referral verification

#### 4. CERTIFICATION VERIFICATION INTEGRITY
**Rule**: AI-verified certifications marked with verification metadata

```typescript
users.irataVerifiedAt   // When AI verification completed
users.irataVerifiedData // Extracted verification data (JSON)
```

- **Impact if violated**: Unverified certs appear verified
- **Enforcement mechanism**: Verification timestamps required for verified status

### System Dependencies

- **Portable Accounts**: Core dependency - see `ConnectionsGuide.tsx`
- **Employer Dashboard**: Linked state provides access to employer tools
- **Job Board**: Visibility settings control discoverability
- **Safety Systems**: Personal harness inspections separate from employer safety

---

## Technical Implementation

### Primary File
```
client/src/pages/TechnicianPortal.tsx (~6,400 lines)
```

### State Determination

```typescript
// Linked state: Has employer and not terminated
const isLinked = user.companyId && !user.terminatedDate;

// "Go to Work Dashboard" button enabled when linked
<Button
  disabled={!user.companyId || !!user.terminatedDate}
  onClick={() => setLocation('/dashboard')}
>
  {t.goToWorkDashboard}
</Button>
```

### Navigation Groups

```typescript
const technicianNavGroups: NavGroup[] = [
  {
    id: "main",
    label: "NAVIGATION",
    items: [
      { id: "home", label: "Home", icon: Home, isVisible: () => true },
      { id: "profile", label: "Profile", icon: User, isVisible: () => true },
      { id: "more", label: "More", icon: MoreHorizontal, badge: unreadCount, isVisible: () => true },
    ],
  },
  {
    id: "employment",
    label: "EMPLOYMENT",
    items: [
      { id: "job-board", label: "Job Board", icon: Briefcase, href: "/technician-job-board" },
      { id: "visibility", label: "My Visibility", icon: Eye, onClick: () => setActiveTab('visibility') },
      { id: "invitations", label: "Team Invitations", icon: Mail, badge: pendingInvitations.length },
    ],
  },
  {
    id: "logging",
    label: "LOGGING",
    items: [
      { id: "logged-hours", label: "Logged Hours", icon: Clock, href: "/technician-logged-hours" },
    ],
  },
  {
    id: "safety",
    label: "SAFETY",
    items: [
      { id: "personal-safety-docs", label: "Personal Safety Docs", icon: Shield, href: "/personal-safety-documents" },
      { id: "psr", label: "Safety Rating (PSR)", icon: Award, href: "/technician-psr" },
      { id: "practice-quizzes", label: "Practice Quizzes", icon: GraduationCap, href: "/technician-practice-quizzes" },
    ],
  },
];
```

### Tabs System

```typescript
type TabType = 'home' | 'profile' | 'visibility' | 'invitations' | 'more';

const [activeTab, setActiveTab] = useState<TabType>('home');
```

### Multilingual Support

The portal supports English, French, and Spanish:

```typescript
const [language, setLanguage] = useState<'en' | 'es' | 'fr'>('en');

const translations = {
  en: { tabHome: "Home", tabProfile: "Profile", ... },
  es: { tabHome: "Inicio", tabProfile: "Perfil", ... },
  fr: { tabHome: "Accueil", tabProfile: "Profil", ... },
};
```

### Employer Connections Query

```typescript
// Fetch invitations for unlinked, terminated, or PLUS technicians
const { data: invitationsData } = useQuery({
  queryKey: ["/api/my-invitations"],
  enabled: !!user && user.role === 'rope_access_tech' && 
    (!user.companyId || !!user.terminatedDate || !!user.hasPlusAccess),
});
```

### PLUS Access Multi-Employer Selection

For PLUS technicians with multiple employers:

```typescript
// When PLUS user has multiple connections, show employer selector
{user.hasPlusAccess && employerConnections.length > 1 && (
  <Select
    value={selectedEmployerId}
    onValueChange={setSelectedEmployerId}
  >
    {employerConnections.map(conn => (
      <SelectItem value={conn.companyId}>{conn.companyName}</SelectItem>
    ))}
  </Select>
)}

// Navigate to employer's dashboard with context
setLocation(`/dashboard?employerId=${selectedEmployerId}`);
```

---

## Multi-Tenant Considerations

### Data Isolation

- **Personal Data**: Stored on user record, portable across employers
- **Employer-Specific Data**: Work sessions, project assignments filtered by companyId
- **Shared Data**: Certifications visible to all connected employers

### Employment Relationship Model

```typescript
// Technician-to-Employer is a connection, not ownership
users.companyId        // Primary/current employer
employments            // Historical employment records
team_invitations       // Pending connection requests
```

---

## User Experience

### Desktop Layout
- **Fixed sidebar** (left): Technician-branded (#AB4521)
- **Header bar** (top): Search, PLUS badge, language selector
- **Main content area**: Tab-specific content

### Mobile Layout
- **Bottom navigation**: Key tabs as bottom bar icons
- **Profile accessible**: Via header avatar
- **Touch-optimized**: Large buttons for field use

### Common Workflows

1. **Accept Team Invitation**
   - Receive invitation → Navigate to Invitations tab → Accept/Decline
   
2. **Update Certification**
   - Profile tab → Certifications section → Upload verification screenshot
   - AI extracts expiry date from IRATA/SPRAT verification portal screenshot
   
3. **Access Employer Dashboard**
   - Must be in LINKED state → Click "Go to Work Dashboard"
   
4. **Refer Another Technician**
   - More tab → Copy referral code → Share with colleague
   - When they verify, PLUS access unlocked

---

## Error Handling & Recovery

### Common Errors

| Error | Cause | User Message | Recovery Action |
|-------|-------|--------------|-----------------|
| Cannot Go to Dashboard | Unlinked or terminated | Button disabled | Connect to employer first |
| Invitation Expired | Employer revoked | "Invitation no longer valid" | Request new invitation |
| Verification Failed | AI couldn't read screenshot | "Unable to verify" | Retry with clearer screenshot |

### State Transitions

| From | To | Trigger | Effect |
|------|-----|---------|--------|
| Unlinked | Linked | Accept invitation | companyId set, dashboard access granted |
| Linked | Unlinked | Termination | terminatedDate set, dashboard access revoked |
| Basic | PLUS | Referral verified | hasPlusAccess = true, multi-employer enabled |

---

## Testing Requirements

### State Tests
```typescript
describe('Portal States', () => {
  test('unlinked technician cannot access work dashboard', () => {
    // Render with user.companyId = null
    // Assert "Go to Work Dashboard" button is disabled
  });
  
  test('linked technician can access work dashboard', () => {
    // Render with user.companyId set
    // Assert button is enabled and navigates to /dashboard
  });
  
  test('PLUS technician can select between employers', () => {
    // Render with hasPlusAccess and multiple employerConnections
    // Assert employer selector is visible
  });
});
```

### Invitation Tests
```typescript
describe('Team Invitations', () => {
  test('pending invitations show badge count', () => {
    // Mock 3 pending invitations
    // Assert badge shows "3" on Invitations nav item
  });
  
  test('accepting invitation updates companyId', () => {
    // Accept invitation
    // Assert user.companyId updated
    // Assert portal transitions to linked state
  });
});
```

---

## Related Documentation

- [shared-dashboard-components-v1.0.md](./shared-dashboard-components-v1.0.md) - Sidebar and layout components
- [employer-dashboard-instructions-v1.0.md](./employer-dashboard-instructions-v1.0.md) - Employer dashboard that technicians access when linked
- `ConnectionsGuide.tsx` - Portable accounts architecture (route: `/changelog/connections`)
- `1. GUIDING_PRINCIPLES.md` - Core platform philosophy

---

## Version History

- **v1.0** (December 25, 2024): Initial documentation
