# Dashboard Documentation Series
**System**: OnRopePro - Rope Access Management Platform  
**Version**: 1.0  
**Last Updated**: December 25, 2024  
**Status**: ACTIVE

---

## Overview

This directory contains comprehensive documentation for all stakeholder-specific dashboards in the OnRopePro platform. The platform uses a unified architecture where:

1. **DashboardLayout** and **DashboardSidebar** are shared components
2. Each stakeholder type receives role-appropriate navigation and branding
3. Portable accounts connect users to multiple entities via connection codes
4. Permission-based visibility controls what each user can access

---

## Official Terminology

**CRITICAL**: Use consistent terminology across all documentation and UI:

| Term | Definition | Route Example |
|------|------------|---------------|
| **Passport** | Personal portable profile view for Technicians and Ground Crew. Contains profile, certifications, documents, job board, and employer connections. Branded with role-specific color. | `/technician-portal`, `/ground-crew-portal` |
| **Dashboard** | Company work dashboard accessed when connected to an employer. Uses employer's blue branding and navigation. Shows projects, safety forms, clock-in/out. | `/dashboard` |

### Technician Experience
- **Unlinked**: Passport only (rust-colored sidebar)
- **Linked**: Passport (personal) + Dashboard (employer's blue sidebar)

### Ground Crew Experience
- **Unlinked**: Passport only (green sidebar)
- **Linked**: Passport (personal) + Dashboard (employer's blue sidebar)

```
TERMINOLOGY REFERENCE:
┌─────────────────────────────────────────────────────────────────┐
│  PASSPORT (Personal)             │  DASHBOARD (Company)         │
│  ────────────────────            │  ──────────────────          │
│  /technician-portal              │  /dashboard                   │
│  /ground-crew-portal             │                               │
│                                  │                               │
│  Role-branded sidebar            │  Employer blue sidebar        │
│  Profile management              │  Company projects             │
│  Certifications & docs           │  Safety forms                 │
│  Job board                       │  Clock in/out                 │
│  Employer connections            │  Team schedule                │
│  PLUS features (Tech only)       │  Work session logging         │
└─────────────────────────────────────────────────────────────────┘
```

---

### The Golden Rule

```
One Account + Connection Codes = Universal Access
```

Users create a single portable account that connects to multiple entities:
- **Technicians** connect to employers via invitation codes
- **Residents** connect to vendors via Vendor Code + Strata/LMS number
- **Property Managers** connect to vendors via Vendor Code
- **Building Managers** connect to a single building at account creation

---

## Document Index

### Core Dashboard Documents

| Document | Stakeholder | Status | Description |
|----------|-------------|--------|-------------|
| [employer-dashboard-instructions-v1.0.md](./employer-dashboard-instructions-v1.0.md) | Company Owners, Staff | PRODUCTION-READY | Full company management dashboard with role-based access |
| [technician-passport-instructions-v1.0.md](./technician-passport-instructions-v1.0.md) | Rope Access Technicians | PRODUCTION-READY | Passport (personal) with linked/unlinked states, PLUS access tier |
| [resident-dashboard-instructions-v1.0.md](./resident-dashboard-instructions-v1.0.md) | Building Residents | PRODUCTION-READY | Feedback submission and project tracking |
| [ground-crew-passport-instructions-v1.0.md](./ground-crew-passport-instructions-v1.0.md) | Ground Crew Workers | PRODUCTION-READY | Passport (personal) - similar to technician but distinct role |
| [property-manager-dashboard-instructions-v1.0.md](./property-manager-dashboard-instructions-v1.0.md) | Property Managers | PRODUCTION-READY | Vendor oversight and building management |

**Note**: SuperUser dashboard documentation is out of scope for this series (internal platform management only).

### Shared Component Documents

| Document | Scope | Status | Description |
|----------|-------|--------|-------------|
| [shared-dashboard-components-v1.0.md](./shared-dashboard-components-v1.0.md) | Most Dashboards | PRODUCTION-READY | DashboardSidebar, DashboardLayout, stakeholder colors (Property Manager uses custom layout) |

---

## Stakeholder Brand Colors

Each stakeholder type has a distinct brand color used throughout their dashboard experience:

| Stakeholder | Brand Color | Hex Code | CSS Variable |
|-------------|-------------|----------|--------------|
| Employer | Blue | `#0B64A3` | `--brand-employer` |
| Technician | Rust | `#AB4521` | `--brand-technician` |
| Ground Crew | Forest Green | `#5D7B6F` | `--brand-ground-crew` |
| Property Manager | Sage | `#6E9075` | `--brand-pm` |
| Resident | Teal | `#86A59C` | `--brand-resident` |
| Building Manager | Taupe | `#B89685` | `--brand-bm` |
| Safety (SuperUser) | Deep Red | `#8B0000` | `--brand-safety` |

---

## Architecture Principles

### Sidebar Implementation

Most dashboards use the shared `DashboardSidebar` component:
- **Employer**: Uses `DashboardSidebar` with `variant="employer"` (default)
- **Technician**: Uses `DashboardSidebar` with `variant="technician"`
- **Ground Crew**: Uses `DashboardSidebar` with `variant="ground-crew"`
- **Resident**: Uses `DashboardSidebar` with `variant="resident"`

**Exception**: Property Manager does NOT use `DashboardSidebar` - it implements a custom header/navigation layout. Layout updates for Property Manager must be handled separately.

### DashboardSidebar Capabilities

When using `DashboardSidebar`:
- **Variant-based styling**: Pass `variant="employer"` or `variant="technician"` etc.
- **Custom navigation groups**: Pass `customNavigationGroups` for role-specific menus
- **Permission-based visibility**: Navigation items have `isVisible()` callbacks
- **User-customizable ordering**: Drag-and-drop reordering saved to `sidebar_preferences` table

### Passport vs Dashboard Pattern (Technician & Ground Crew)

**Critical**: Linked technicians and ground crew access **two separate experiences**:

| Experience | Route | Sidebar | Purpose |
|-----------|-------|---------|---------|
| **Passport** | `/technician-portal` or `/ground-crew-portal` | Role-specific color | Profile, certifications, job board |
| **Dashboard** | `/dashboard` | `variant="employer"` (blue) | Projects, clock-in/out, safety forms |

When linked, these workers switch between:
- Their **Passport** for personal profile management (role-branded)
- The company **Dashboard** for work tasks (employer blue sidebar)

See [technician-passport-instructions-v1.0.md](./technician-passport-instructions-v1.0.md) for detailed state documentation.

### Key Architectural Decisions

1. **Shared components when possible**: Use the unified sidebar/layout for most dashboards
2. **Permission checks at item level**: Each nav item checks user permissions via `isVisible()`
3. **Consistent header patterns**: Most dashboards share similar header elements (search, user profile, logout)
4. **Mobile-first with desktop sidebar**: Mobile uses bottom nav or full-screen menus
5. **Linked workers share employer navigation**: When accessing Work Dashboard, technicians/ground crew see employer's sidebar

---

## Dependencies

### Core Dependencies

- **Portable Accounts System**: See `/changelog/connections` and `ConnectionsGuide.tsx`
- **Session-based Authentication**: Custom auth, not third-party
- **Role-based Access Control**: Permissions defined in user roles and company settings

### Related Documentation

- `1. GUIDING_PRINCIPLES.md` - Core platform philosophy
- `2. INSTRUCTION_DOCUMENT_CREATION_GUIDE.md` - Documentation standards
- `work-session-management-instructions-v1.0.md` - Time tracking (employer dashboard)
- `safety-documentation-instructions-v1.0.md` - Safety compliance (employer dashboard)

---

## Quick Reference: Dashboard Entry Points

| Stakeholder | Route | File Location |
|-------------|-------|---------------|
| Employer | `/dashboard` | `client/src/pages/Dashboard.tsx` |
| Technician | `/technician-portal` | `client/src/pages/TechnicianPortal.tsx` |
| Ground Crew | `/ground-crew-portal` | `client/src/pages/GroundCrewPortal.tsx` |
| Resident | `/resident-dashboard` | `client/src/pages/ResidentDashboard.tsx` |
| Property Manager | `/property-manager` | `client/src/pages/PropertyManager.tsx` |
| SuperUser | `/superuser` | `client/src/pages/SuperUser.tsx` |

**Note**: Building Manager currently uses integrated features within Property Manager or other dashboards rather than a separate dedicated page.

---

## Version History

- **v1.0** (December 25, 2024): Initial documentation series creation
