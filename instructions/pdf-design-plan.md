# PDF Design Plan

This document outlines the PDF export architecture, design standards, and complete inventory of all PDF exports across the OnRopePro platform.

---

## Design Rules

### 1. Centralized PDF Design Function

All PDFs must call a single centralized design function that handles layout and styling. This ensures:
- Consistent design across all PDF exports
- Easy maintenance (change once, applies everywhere)
- Reduced code duplication

**Architecture:**
```
Individual PDF Export → Centralized PDF Design Function → Final PDF Output
```

Do NOT implement PDF styling/headers individually in each export. All styling logic must flow through the centralized function.

### 2. Header Branding Rules

All PDFs must have a consistent header based on company branding status:

| Company Status | Header Design |
|----------------|---------------|
| **White-label branding active** | Company logo + company name in header |
| **No white-label branding** | Default OnRopePro header |

The centralized PDF design function must:
1. Check if the company has `whitelabelBrandingActive = true`
2. If yes, load and display the company's `brandingLogoUrl` and `companyName`
3. If no, display the default OnRopePro branding

### 3. Follow Design Guidelines

All PDFs must follow the visual standards defined in `design_guidelines.md`:
- Use consistent spacing (small, medium, large levels)
- Follow color hierarchy for text
- Maintain consistent typography
- Apply proper contrast between elements
- Use the company's branding colors when white-label is active

### 4. Existing PDF Branding Utility

The centralized PDF branding utility exists at:
```
client/src/lib/pdfBranding.ts
```

This file contains:
- `getBrandColors()` - Extract brand colors from company settings
- `loadLogoAsBase64()` - Load company logo for PDF embedding
- `BrandingConfig` interface - Company branding configuration
- `BrandingResult` interface - Standardized branding output

---

## Complete PDF Export Inventory

### Employer / Company Admin Users

#### Documents Page (`/documents`)
| Export Type | Description |
|-------------|-------------|
| Harness Inspections PDF | Individual or bulk export with date range ZIP |
| Toolbox Meetings PDF | Individual or bulk export with date range ZIP |
| FLHA Forms PDF | Individual or bulk export with date range ZIP |
| Incident Reports PDF | Individual or bulk export with date range ZIP |
| Method Statements PDF | Individual or bulk export with date range ZIP |
| Damage Reports PDF | Export damage report documentation |
| COI Documents PDF | Download uploaded Certificate of Insurance files |
| Document Compliance Report PDF | Signature compliance summary with timestamps |
| Health & Safety Documents | Download uploaded company H&S documents |
| Policy Documents | Download uploaded company policies |
| Custom Safe Work Procedures | Download uploaded SWP documents |

#### Quotes Page (`/quotes`)
| Export Type | Description |
|-------------|-------------|
| Quote PDF | Professional branded quote with line items, photos |

#### Payroll Page (`/payroll`)
| Export Type | Description |
|-------------|-------------|
| Payroll PDF | Timesheet/payroll summary report |
| Payroll CSV | CSV export for payroll software integration |

#### Project Detail Page (`/projects/:id`)
| Export Type | Description |
|-------------|-------------|
| Rope Access Plan Audit PDF | Project-specific audit documentation with signatures |
| Project Documents | Download attached project documents |

#### Inventory Page (`/inventory`)
| Export Type | Description |
|-------------|-------------|
| Damage Report PDF | Equipment damage report documentation |

#### Dashboard (`/dashboard`)
| Export Type | Description |
|-------------|-------------|
| Fall Protection Plan PDF | View/download uploaded rope access plans |
| Anchor Inspection Certificate PDF | View/download uploaded anchor certs |

#### Document Requests (Employer side)
| Export Type | Description |
|-------------|-------------|
| Requested Document Files | Download files technicians uploaded in response to requests |

---

### Technician Users

#### Technician Portal (`/technician-portal`)
| Export Type | Description |
|-------------|-------------|
| Requested Document Files | Download files from document request system |

#### Logged Hours Page (`/technician-logged-hours`)
| Export Type | Description |
|-------------|-------------|
| IRATA/SPRAT Hours PDF | Filtered work history with date range |

#### Personal Safety Documents (`/personal-safety-documents`)
| Export Type | Description |
|-------------|-------------|
| Personal Harness Inspection PDF | Individual personal equipment inspection records |

#### Resume Page (`/technician-resume`)
| Export Type | Description |
|-------------|-------------|
| Resume/CV documents | View uploaded resume files (PDF viewing, not generation) |

---

### Ground Crew Users

#### Ground Crew Portal (`/ground-crew-portal`)
| Export Type | Description |
|-------------|-------------|
| *(No PDF exports currently)* | Ground crew portal has no PDF export functionality |

---

### Resident Users

#### Resident Dashboard (`/resident`)
| Export Type | Description |
|-------------|-------------|
| Work Notice PDF | Download work notices for elevator posting |

---

### Property Manager Users

#### Property Manager Portal (`/property-manager`)
| Export Type | Description |
|-------------|-------------|
| Rope Access Plan | View/Download rope access plan documents |
| Anchor Inspection Certificate | View/Download anchor inspection documents |
| Quote documents | View quotes (HTML view) |

---

### Building Manager Users

#### Building Portal (`/building-portal`)
| Export Type | Description |
|-------------|-------------|
| Work Notice PDF | Download notices for elevator posting |

---

### SuperUser / Staff Accounts

#### SuperUser Tasks (`/superuser/tasks`)
| Export Type | Description |
|-------------|-------------|
| Task Attachments | Download attached files (PDF, images, docs) |

---

## Server-Side PDF Generation Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/projects/:projectId/rope-access-plan/pdf` | Generates rope access plan audit PDF |
| `/api/quotes/:id/pdf` | Generates quote PDF with branding |
| `/api/document-request-files/:id/download` | Downloads uploaded document request files |
| `/api/superuser/tasks/:taskId/attachments/:attachmentId/download` | Downloads task attachments |
| `/api/company-documents/:id/download` | Downloads company uploaded documents |

---

## Summary by User Type

| User Type | PDF Export Locations |
|-----------|---------------------|
| Employer/Admin | 16+ different export types |
| Technician | 3 export types |
| Ground Crew | 0 export types |
| Resident | 1 export type |
| Property Manager | 2-3 download/view options |
| Building Manager | 1 export type |
| SuperUser | 1 export type |

---

## Implementation Checklist

- [ ] Audit all existing PDF exports to ensure they use centralized design function
- [ ] Verify white-label branding displays correctly on all PDFs
- [ ] Ensure fallback to default OnRopePro branding when white-label is inactive
- [ ] Confirm all PDFs follow design_guidelines.md standards
- [ ] Test PDF exports across all user account types

---

*Last updated: December 31, 2025*
