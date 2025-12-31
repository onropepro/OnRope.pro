# PDF Export System Instructions v1.0
**System**: Rope Access Management System
**Domain**: Documents & Exports
**Version**: 1.0
**Last Updated**: December 31, 2024
**Status**: ACTIVE
**Safety Critical**: No - PDF exports are informational outputs, not safety-control systems

---

## Purpose and Goal

### Primary Objective
Provide a unified PDF export system that generates professional, branded documents for all stakeholders in the rope access management platform. This ensures consistent branding, legal compliance, and professional presentation across all exported documentation.

### Key Goals
- **Safety**: Export accurate safety documentation (harness inspections, FLHA forms, incident reports) that field workers and compliance officers can rely on
- **Efficiency**: Centralized design function eliminates redundant code and speeds up development of new PDF exports
- **Compliance**: Include proper legal text, timestamps, and audit trails required for regulatory documentation
- **Accuracy**: Ensure PDF exports match on-screen data exactly with timezone-aware timestamps
- **Usability**: Support multi-language exports and proper locale formatting for international teams

---

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PDF Export Request                           │
│                  (User clicks export button)                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Individual Export Handler                        │
│         (e.g., QuotePDF, HarnessInspectionPDF, PayrollPDF)         │
│                                                                     │
│  - Gathers data from database                                       │
│  - Prepares content-specific layout                                 │
│  - Passes to centralized design function                            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│               Centralized PDF Design Function                       │
│                  (client/src/lib/pdfBranding.ts)                    │
│                                                                     │
│  - Loads company branding (logo, colors)                            │
│  - Applies consistent header/footer                                 │
│  - Handles page numbers, legal text                                 │
│  - Applies typography from design_guidelines.md                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Final PDF Output                               │
│              (A4 format, branded, page-numbered)                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Input Stage**: User triggers export from UI (button click, menu selection)
2. **Data Gathering Stage**: Export handler queries database for relevant records
3. **Branding Stage**: Centralized function loads company branding configuration
4. **Rendering Stage**: PDF generated with consistent styling, headers, footers
5. **Output Stage**: PDF downloaded to user's device or opened in new tab

### Integration Points

- **Upstream Systems**: 
  - Company settings (branding, logo, white-label status)
  - User preferences (language, timezone)
  - Document data (inspections, quotes, payroll records)
  
- **Downstream Systems**: 
  - Browser download API
  - Print services
  - Email attachments (future)
  
- **Parallel Systems**: 
  - i18n translation system for multi-language support
  - Object storage for logo retrieval

---

## Dependency Impact & Invariants

### Non-negotiable Invariants

1. **Centralized Design Function**: All PDFs MUST use the centralized design function
   - Impact if violated: Inconsistent branding, maintenance nightmare
   - Enforcement mechanism: Code review, design function as required import

2. **A4 Paper Size**: All PDFs MUST use A4 format (210mm x 297mm)
   - Impact if violated: Printing issues, unprofessional appearance
   - Enforcement mechanism: Hardcoded in centralized function

3. **White-Label Respect**: PDFs MUST show company branding when white-label is active
   - Impact if violated: Contract violation, customer dissatisfaction
   - Enforcement mechanism: Branding check in centralized function

4. **Timezone Accuracy**: All timestamps MUST use user/project timezone
   - Impact if violated: Incorrect audit trails, compliance issues
   - Enforcement mechanism: date-fns-tz utilities required

### System Dependencies

- **Company Settings**: Branding logo, colors, white-label status
- **User Settings**: Language preference, timezone
- **Design Guidelines**: Typography, colors, spacing from design_guidelines.md
- **i18n System**: Translation keys for all static text

---

## Technical Implementation

### Database Schema

```typescript
// Relevant company branding fields (from companies table)
whitelabelBrandingActive: boolean("whitelabel_branding_active").default(false),
brandingLogoUrl: text("branding_logo_url"),
brandingPrimaryColor: varchar("branding_primary_color", { length: 7 }),
brandingSecondaryColor: varchar("branding_secondary_color", { length: 7 }),
```

### Core Files

| File | Purpose |
|------|---------|
| `client/src/lib/pdfBranding.ts` | Centralized branding utility |
| `design_guidelines.md` | Typography and color standards |
| `client/src/i18n/locales/*.json` | Translation files |

### Critical Functions

```typescript
// client/src/lib/pdfBranding.ts

interface BrandingConfig {
  companyId: number;
  whitelabelActive: boolean;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  companyName: string;
}

interface BrandingResult {
  headerLogo: string; // Base64 or URL
  headerText: string;
  primaryColor: string;
  footerText: string;
}

// Get brand colors for PDF
export function getBrandColors(config: BrandingConfig): BrandingResult;

// Load company logo as base64 for PDF embedding
export async function loadLogoAsBase64(logoUrl: string): Promise<string>;
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/projects/:projectId/rope-access-plan/pdf` | GET | Rope access plan audit PDF |
| `/api/quotes/:id/pdf` | GET | Quote PDF with branding |
| `/api/document-request-files/:id/download` | GET | Document request file download |
| `/api/superuser/tasks/:taskId/attachments/:attachmentId/download` | GET | Task attachment download |
| `/api/company-documents/:id/download` | GET | Company document download |

---

## Design Rules

### 1. Centralized PDF Design Function

All PDFs must call a single centralized design function that handles layout and styling:

```
Individual PDF Export → Centralized PDF Design Function → Final PDF Output
```

Do NOT implement PDF styling/headers individually in each export.

### 2. Header Branding Rules

| Company Status | Header Design |
|----------------|---------------|
| **White-label branding active** | Company logo + company name |
| **No white-label branding** | Default OnRopePro header |

The centralized PDF design function must:
1. Check if company has `whitelabelBrandingActive = true`
2. If yes, load and display company's `brandingLogoUrl` and `companyName`
3. If no, display default OnRopePro branding

### 3. Paper Size

All PDFs must use **A4 paper size** (210mm x 297mm / 8.27" x 11.69").

### 4. Page Numbers

All multi-page PDFs must include page numbers:
- Format: "Page X of Y"
- Position: Bottom center or bottom right
- Font size: 9pt (smaller than body text)
- Start from page 1

### 5. Typography

Follow standards from `design_guidelines.md`:
- Use Outfit font family
- Follow font size hierarchy (Display → H1 → H2 → H3 → Body → Caption)
- Maintain consistent line spacing
- Embed fonts for consistent rendering

### 6. Document Footer

Every PDF page must include:
- Company name (white-label name or "OnRopePro")
- Document generation date/time (timezone-aware)
- Page numbers

```
[Company Name]                    Generated: [Date/Time]                    Page X of Y
```

### 7. Legal Text

All PDFs must include on final page or footer:
- Confidentiality notice (when applicable)
- Copyright statement with current year
- Document disclaimer

```
This document is confidential and intended for the recipient only.
© [Year] [Company Name]. Generated by OnRopePro.
```

### 8. Multi-Language Support

PDFs must respect user's language preference:
- All static text translated via i18n system
- Supported languages: English (en), French (fr), Spanish (es)
- Date/time formatting follows locale conventions
- Number formatting follows locale conventions

---

## Multi-Tenant Considerations

### Data Isolation

- **Company Level**: Each PDF only includes data from the requesting user's company
- **Employee Level**: Role-based access determines which PDFs a user can export
- **Branding Level**: Each company's branding settings are isolated

### Query Patterns

```typescript
// Always filter by companyId when fetching PDF data
const records = await db.query.inspections.findMany({
  where: eq(inspections.companyId, user.companyId)
});

// Never expose cross-company data in PDFs
```

### Branding Isolation

```typescript
// Load branding for specific company only
const branding = await getCompanyBranding(user.companyId);
```

---

## Safety & Compliance

### Safety-Critical Documents

While PDF generation itself is not safety-critical, many exported documents ARE safety-critical:

| Document Type | Criticality | Requirements |
|---------------|-------------|--------------|
| Harness Inspections | High | Accurate dates, technician signatures |
| FLHA Forms | High | Complete hazard assessments |
| Incident Reports | High | Accurate timestamps, details |
| Rope Access Plans | High | Current procedures, signatures |

### Regulatory Requirements

- **IRATA/SPRAT Compliance**: Inspection PDFs must include all required fields
- **OSHA Requirements**: Safety documentation must be complete and dated
- **Audit Trail**: All PDFs include generation timestamp and user info

### Failure Modes

| Failure | Impact | Mitigation |
|---------|--------|------------|
| Missing branding | Unprofessional appearance | Fallback to OnRopePro default |
| Wrong timezone | Incorrect audit trail | Use date-fns-tz with explicit zones |
| Missing translations | Broken text display | Fallback to English |
| Logo load failure | Missing header image | Text-only fallback header |

---

## Field Worker Experience

### Mobile Considerations

- PDFs should be readable on mobile devices
- Touch-friendly download buttons
- Consider file size for slow connections

### Offline Mode

- PDF exports require internet connection (server-side generation)
- Downloaded PDFs work offline once saved to device

### Common Workflows

1. **Export Inspection Record**:
   - Navigate to Documents page
   - Select inspection record
   - Click export/download button
   - PDF downloads to device

2. **Export Payroll Summary**:
   - Navigate to Payroll page
   - Select date range
   - Click export button
   - PDF/CSV downloads

---

## Error Handling & Recovery

### Common Errors

| Error | Cause | User Message | Recovery Action |
|-------|-------|--------------|-----------------|
| Logo load failed | Invalid URL or network issue | "Using default branding" | Show OnRopePro logo |
| Translation missing | Key not in locale file | Shows English fallback | Add missing translation |
| Large document timeout | Too many records | "Export is taking longer than usual" | Paginate or filter results |
| Font embed failed | Font file unavailable | Uses system font | Ensure Outfit font bundled |

### Graceful Degradation

- **No company logo**: Show company name text only
- **No branding colors**: Use default OnRopePro colors
- **Translation missing**: Fall back to English text
- **Network slow**: Show loading indicator, allow cancel

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

### Resident Users

#### Resident Dashboard (`/resident`)
| Export Type | Description |
|-------------|-------------|
| Work Notice PDF | Download work notices for elevator posting |

### Property Manager Users

#### Property Manager Portal (`/property-manager`)
| Export Type | Description |
|-------------|-------------|
| Rope Access Plan | View/Download rope access plan documents |
| Anchor Inspection Certificate | View/Download anchor inspection documents |

### Building Manager Users

#### Building Portal (`/building-portal`)
| Export Type | Description |
|-------------|-------------|
| Work Notice PDF | Download notices for elevator posting |

### SuperUser / Staff Accounts

#### SuperUser Tasks (`/superuser/tasks`)
| Export Type | Description |
|-------------|-------------|
| Task Attachments | Download attached files (PDF, images, docs) |

### Summary by User Type

| User Type | PDF Export Count |
|-----------|------------------|
| Employer/Admin | 16+ types |
| Technician | 3 types |
| Ground Crew | 0 types |
| Resident | 1 type |
| Property Manager | 2-3 types |
| Building Manager | 1 type |
| SuperUser | 1 type |

---

## Testing Requirements

### Unit Tests

```typescript
describe('PDF Branding', () => {
  test('should return company branding when white-label active', () => {
    const config = { whitelabelActive: true, companyName: 'Acme Rope' };
    const result = getBrandColors(config);
    expect(result.headerText).toBe('Acme Rope');
  });

  test('should return OnRopePro branding when white-label inactive', () => {
    const config = { whitelabelActive: false, companyName: 'Acme Rope' };
    const result = getBrandColors(config);
    expect(result.headerText).toBe('OnRopePro');
  });
});
```

### Integration Tests

- **Multi-tenant isolation**: Verify PDFs only contain requesting company's data
- **Branding application**: Verify correct logo/colors appear based on settings
- **Timezone accuracy**: Verify timestamps match expected timezone

### Manual Testing Checklist

- [ ] Export PDF with white-label branding active
- [ ] Export PDF with white-label branding inactive
- [ ] Export multi-page PDF and verify page numbers
- [ ] Export in each supported language (en, fr, es)
- [ ] Print PDF and verify A4 sizing
- [ ] Export on mobile device
- [ ] Export with slow network connection

---

## Monitoring & Maintenance

### Key Metrics

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| PDF generation time | < 5 seconds | User experience |
| Export success rate | > 99% | Reliability |
| Branding load success | > 99.5% | Professional appearance |

### Regular Maintenance

- **Daily**: Monitor error logs for failed exports
- **Weekly**: Review export usage patterns
- **Monthly**: Audit branding consistency across PDF types

---

## Troubleshooting Guide

### Issue: PDF shows OnRopePro branding instead of company branding

**Symptoms**: Customer reports their logo not appearing on PDFs

**Diagnosis Steps**:
1. Check company settings for `whitelabelBrandingActive` status
2. Verify `brandingLogoUrl` is set and accessible
3. Test logo URL in browser

**Solution**: Ensure company has active subscription and logo uploaded

**Prevention**: Validate branding settings when subscription activated

---

### Issue: Timestamps showing wrong time

**Symptoms**: PDF generation time doesn't match user's local time

**Diagnosis Steps**:
1. Check user's timezone preference
2. Verify project timezone setting
3. Review date formatting code

**Solution**: Use date-fns-tz with explicit timezone:
```typescript
import { formatInTimeZone } from 'date-fns-tz';
const formatted = formatInTimeZone(date, timezone, 'PPpp');
```

**Prevention**: Always use timezone-aware formatting functions

---

### Issue: PDF export timing out

**Symptoms**: Large exports fail or take too long

**Diagnosis Steps**:
1. Check number of records being exported
2. Review server logs for timeout errors
3. Check for large embedded images

**Solution**: Implement pagination or date range filtering

**Prevention**: Set reasonable limits on bulk exports

---

## Implementation Checklist

- [ ] Audit all existing PDF exports to ensure they use centralized design function
- [ ] Verify white-label branding displays correctly on all PDFs
- [ ] Ensure fallback to default OnRopePro branding when white-label is inactive
- [ ] Confirm all PDFs use A4 paper size
- [ ] Implement page numbers on all multi-page PDFs
- [ ] Verify typography follows design_guidelines.md standards
- [ ] Add consistent document footer to all PDFs
- [ ] Include legal text on all PDFs
- [ ] Implement multi-language support for all PDF text content
- [ ] Test date/time formatting respects user timezone and locale
- [ ] Test PDF exports across all user account types
- [ ] Verify PDF renders correctly when printed

---

## Related Documentation

- `design_guidelines.md` - Typography, colors, visual standards
- `2. INSTRUCTION_DOCUMENT_CREATION_GUIDE.md` - Document template standards
- `branding-subscription-instructions.md` - White-label branding system

---

## Version History

- **v1.0** (December 31, 2024): Initial release - restructured from pdf-design-plan.md to follow instruction document standards
