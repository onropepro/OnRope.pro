# Property Manager Dashboard Instructions v1.0
**System**: OnRopePro - Rope Access Management Platform  
**Domain**: Property Management & Vendor Oversight  
**Version**: 1.0  
**Last Updated**: December 25, 2024  
**Status**: PRODUCTION-READY  
**Safety Critical**: No - Vendor oversight, not direct safety operations

---

## Purpose and Goal

### Primary Objective
The Property Manager Dashboard provides property managers with a centralized view of their vendor relationships, building portfolios, project progress, and service quotes. Property managers connect to multiple vendors using vendor codes, creating a network that allows oversight of all building maintenance activities from a single portable account.

### Key Goals
- **Vendor Oversight**: Track multiple vendor relationships and performance
- **Building Portfolio**: Manage buildings with map-based visualization
- **Quote Management**: Review and track service quotes from vendors
- **Project Tracking**: Monitor project progress across all buildings
- **CSR Ratings**: View vendor Corporate Social Responsibility ratings

### Core Business Value
- **Portable Account**: One account connects to multiple vendors
- **Multi-Vendor View**: Compare performance across service providers
- **Centralized Quotes**: All quotes in one place for easy comparison
- **Building Map**: Geographic view of entire portfolio

---

## System Architecture

### Component Overview

**Note**: Unlike Technician and Ground Crew portals, the Property Manager page does NOT use the shared `DashboardSidebar` component. It implements its own custom header/navigation layout.

```
+-------------------------------------------------------------------------+
|                    PROPERTY MANAGER DASHBOARD                            |
+-------------------------------------------------------------------------+
|                                                                          |
|  +------------------+     +--------------------+     +------------------+|
|  | Custom Header    |     | PropertyManager    |     | Vendor Links     ||
|  | (no sidebar)     |     | (~2.8K lines)      |     | (multi-vendor)   ||
|  +------------------+     +--------------------+     +------------------+|
|         |                         |                         |            |
|         v                         v                         v            |
|  +-------------------------------------------------------------------+  |
|  |                    MAIN SECTIONS                                   |  |
|  |  Vendors | Buildings | Quotes | Projects | Settings               |  |
|  +-------------------------------------------------------------------+  |
|                                                                          |
+-------------------------------------------------------------------------+
```

This divergence from the unified dashboard pattern means Property Manager layout updates must be handled separately.

### Connection Model

Property managers connect to vendors using Vendor Codes:

```
Property Manager Account
        │
        ├── Vendor A (linked via Vendor Code)
        │       └── Buildings managed
        │       └── Active projects
        │       └── Quotes received
        │
        ├── Vendor B (linked via Vendor Code)
        │       └── Buildings managed
        │       └── Active projects
        │       └── Quotes received
        │
        └── Vendor C (linked via Vendor Code)
```

### Integration Points

- **Upstream Systems**: 
  - Portable Accounts: Connects via Vendor Code
  - Companies: Vendors provide property manager access
  
- **Downstream Systems**:
  - Quote Viewing: Read-only access to vendor quotes
  - Project Progress: View project status and timeline
  
- **Parallel Systems**:
  - Resident Portal: Residents also connect to vendors
  - Building Manager: Single-building focused view

---

## Dependency Impact & Invariants

### Non-negotiable Invariants

#### 1. VENDOR CODE CONNECTION
**Rule**: Property managers connect to vendors using the company's `propertyManagerCode`

```typescript
// Connection process:
// 1. PM enters Vendor Code
// 2. System validates code against companies.propertyManagerCode
// 3. Creates pm_vendor_links record
// 4. PM gains read access to vendor's buildings they manage
```

- **Impact if violated**: Unauthorized access to vendor data
- **Enforcement mechanism**: Code validation before link creation

#### 2. READ-ONLY ACCESS
**Rule**: Property managers have read-only access to vendor operations

Property managers can:
- View projects and progress
- View quotes (cannot modify)
- View building information
- View CSR ratings

Property managers cannot:
- Create or edit projects
- Accept/reject quotes (vendors do this)
- Modify building records
- Access financial data

- **Impact if violated**: Unauthorized modifications to vendor data
- **Enforcement mechanism**: API endpoints filter by role

---

## Technical Implementation

### Primary File
```
client/src/pages/PropertyManager.tsx (~2,795 lines)
```

### Key Data Types

```typescript
type VendorSummary = {
  linkId: string;
  id: string;
  companyName: string;
  email: string;
  phone: string | null;
  logo: string | null;
  activeProjectsCount: number;
  residentCode: string | null;
  propertyManagerCode: string | null;
  strataNumber: string | null;
  whitelabelBrandingActive: boolean;
  brandingColors: string | null;
  csrRating: number | null;
  csrLabel: string | null;
  csrColor: string | null;
};

type PropertyManagerQuote = {
  id: string;
  quoteNumber: string | null;
  buildingName: string;
  strataPlanNumber: string;
  buildingAddress: string;
  status: string;
  pipelineStage: string;
  createdAt: string;
  companyName: string;
  grandTotal: number;
  serviceCount: number;
};
```

### Main Sections

1. **Vendors Section**: List of connected vendors with CSR ratings
2. **Buildings Section**: Map-based portfolio view with building cards
3. **Quotes Section**: All quotes received from vendors
4. **Projects Section**: Active projects across all vendors
5. **Settings Section**: Profile and account management

### API Endpoints

- `GET /api/property-managers/me/vendors` - Connected vendors list
- `GET /api/property-managers/me/buildings` - Buildings across vendors
- `GET /api/property-managers/me/quotes` - Quotes from all vendors
- `GET /api/property-managers/me/projects` - Active projects
- `PATCH /api/property-managers/me` - Update profile

### Brand Color

Property Manager uses Sage: `#6E9075`

---

## User Experience

### Layout Structure
- **Header**: Logo, navigation, profile dropdown
- **Main Content**: Section-based layout (not tab-based sidebar like employer)
- **Map Integration**: Leaflet-based building portfolio map

### Common Workflows

1. **Connect to New Vendor**
   - Settings/Profile → Enter Vendor Code → Validate → Link created
   
2. **Review Quote**
   - Quotes section → Select quote → View details → Track status
   
3. **Monitor Project Progress**
   - Projects section → View active projects → See timeline and progress

4. **View Building Portfolio**
   - Buildings section → Map view → Click building for details

---

## Testing Requirements

### Connection Tests
```typescript
describe('Property Manager Vendor Connection', () => {
  test('valid vendor code creates link', () => {
    // Enter valid vendor code
    // Assert link created successfully
  });
  
  test('invalid vendor code rejected', () => {
    // Enter invalid vendor code
    // Assert error message shown
  });
});
```

### Read-Only Tests
```typescript
describe('Property Manager Access', () => {
  test('cannot modify vendor projects', () => {
    // Attempt to edit project
    // Assert permission denied
  });
  
  test('can view quotes but not accept', () => {
    // View quote detail
    // Assert no accept/reject buttons
  });
});
```

---

## Related Documentation

- [shared-dashboard-components-v1.0.md](./shared-dashboard-components-v1.0.md) - Stakeholder colors and patterns
- [resident-dashboard-instructions-v1.0.md](./resident-dashboard-instructions-v1.0.md) - Similar connection model (Vendor Code + Strata)
- `ConnectionsGuide.tsx` - Portable accounts and vendor connections

---

## Version History

- **v1.0** (December 25, 2024): Initial documentation
