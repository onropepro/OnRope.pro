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
| [technician-dashboard-instructions-v1.0.md](./technician-dashboard-instructions-v1.0.md) | Rope Access Technicians | PRODUCTION-READY | Personal portal with linked/unlinked states, PLUS access tier |
| [resident-dashboard-instructions-v1.0.md](./resident-dashboard-instructions-v1.0.md) | Building Residents | PRODUCTION-READY | Feedback submission and project tracking |

### Shared Component Documents

| Document | Scope | Status | Description |
|----------|-------|--------|-------------|
| [shared-dashboard-components-v1.0.md](./shared-dashboard-components-v1.0.md) | All Dashboards | PRODUCTION-READY | DashboardSidebar, DashboardLayout, stakeholder colors, customization patterns |

---

## Stakeholder Brand Colors

Each stakeholder type has a distinct brand color used throughout their dashboard experience:

| Stakeholder | Brand Color | Hex Code | CSS Variable |
|-------------|-------------|----------|--------------|
| Employer | Blue | `#0B64A3` | `--brand-employer` |
| Technician | Rust | `#AB4521` | `--brand-technician` |
| Property Manager | Sage | `#6E9075` | `--brand-pm` |
| Resident | Teal | `#86A59C` | `--brand-resident` |
| Building Manager | Taupe | `#B89685` | `--brand-bm` |
| Safety (SuperUser) | Deep Red | `#8B0000` | `--brand-safety` |

---

## Architecture Principles

### Unified Sidebar Component

All dashboards use `DashboardSidebar` with these capabilities:
- **Variant-based styling**: Pass `variant="employer"` or `variant="technician"` etc.
- **Custom navigation groups**: Pass `customNavigationGroups` for role-specific menus
- **Permission-based visibility**: Navigation items have `isVisible()` callbacks
- **User-customizable ordering**: Drag-and-drop reordering saved to `sidebar_preferences` table

### Key Architectural Decisions

1. **Shared components > Custom rebuilds**: Use the unified sidebar/layout instead of rebuilding per dashboard
2. **Permission checks at item level**: Each nav item checks user permissions via `isVisible()`
3. **Consistent header structure**: All dashboards share similar header patterns (search, user profile, logout)
4. **Mobile-first with desktop sidebar**: Mobile uses bottom nav or full-screen menus

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
| Resident | `/resident-dashboard` | `client/src/pages/ResidentDashboard.tsx` |
| Property Manager | `/property-manager-dashboard` | `client/src/pages/PropertyManagerDashboard.tsx` |
| Building Manager | `/building-manager-dashboard` | `client/src/pages/BuildingManagerDashboard.tsx` |
| SuperUser | `/superuser-dashboard` | `client/src/pages/SuperUserDashboard.tsx` |

---

## Version History

- **v1.0** (December 25, 2024): Initial documentation series creation
