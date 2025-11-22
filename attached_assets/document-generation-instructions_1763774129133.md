# Document Generation System Instructions v1.0
**System**: Orange Shirt Society Licensing Portal  
**Purpose**: Ensure 100% accuracy in generating Certificates, License Agreements, and Receipts across all 8 license pathways  
**Version**: 1.0  
**Last Updated**: August 26, 2025  
**Status**: ACTIVE | PRODUCTION-READY ✅

## 1. Purpose and Goal

### Primary Objective
Standardize and ensure 100% accuracy in generating PDF documents (Certificates, License Agreements, Receipts) across all license pathways that require formal applications (8 of the 9 total pathways), maintaining consistent formatting, accurate data inclusion, and reliable delivery through the application lifecycle.

### Key Goals
- **Zero Document Errors**: Every generated document must contain 100% accurate information
- **Pathway Consistency**: All 8 license pathways must follow identical generation patterns and standards
- **Brand Compliance**: Every document must adhere to OSS brand guidelines and legal requirements
- **Data Integrity**: All amounts, dates, and personal information must match database records exactly
- **Reliable Delivery**: Generated documents must be attached to emails and accessible via admin dashboard
- **Audit Trail**: Every document generation must be logged for compliance and troubleshooting

## 2. System Architecture

### Document Generation Flow
```
┌─────────────────────────────────────────────────────────────┐
│                    Document Generation System                │
├─────────────────────────────────────────────────────────────┤
│ Trigger Event → Document Generator → PDF Creation → Storage │
│                          ↓                                   │
│              Email Attachment → Delivery → Logging           │
└─────────────────────────────────────────────────────────────┘
```

### Process Sequence
1. **Trigger Event** → Application approval, payment confirmation, or manual generation
2. **Data Retrieval** → Fetch application data from database with all relations
3. **Template Selection** → Choose correct template based on license type and pathway
4. **PDF Generation** → Use PDFKit to create document with proper formatting
5. **File Storage** → Save to `/public/certificates/` or `/public/receipts/` directory
6. **Path Recording** → Store relative path in database for future access
7. **Email Attachment** → Attach PDF to appropriate email notification
8. **Logging** → Record generation event in system logs and email_logs table
9. **Cleanup** → Remove temporary files if any were created

## 3. Critical Configuration Requirements

### ⚠️ CRITICAL: PDFKit Configuration
**Rule**: ALL document generation MUST use PDFKit with consistent configuration

**Required Implementation**:
```typescript
const doc = new PDFDocument({
  size: 'LETTER',  // Always use LETTER size for North American standard
  margins: {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
  },
  info: {
    Title: `[Document Type] - ${referenceNumber}`,
    Author: 'Orange Shirt Society',
    Subject: '[Specific document subject]',
    Keywords: 'license, orange shirt society, every child matters'
  }
});
```

**Why This Matters**:
- Consistent document sizing ensures proper printing
- Standard margins prevent content cutoff
- Metadata helps with document management and searchability

### ⚠️ CRITICAL: File Storage Pattern
**Rule**: NEVER store documents in volatile filesystem - use persistent directories

**Required Implementation**:
```typescript
// Certificates
const certificatesDir = path.join(process.cwd(), 'public', 'certificates');

// Receipts  
const receiptsDir = path.join(process.cwd(), 'public', 'receipts');

// Always create directory if it doesn't exist
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Use safe filenames with reference numbers
const safeReferenceNumber = referenceNumber?.replace(/[\/\\]/g, '-') || `OSS-${Date.now()}`;
const filename = `${documentType}-${safeReferenceNumber}-${Date.now()}.pdf`;
```

## 4. Dependency Impact & Invariants

### Non-negotiable Invariants
1. **Provincial Tax Calculation Accuracy**: Receipt tax breakdown MUST match payment calculation exactly with correct GST/HST type and rate
2. **Fee Consistency**: License fee on certificate/agreement MUST match receipt and payment
3. **Date Synchronization**: All dates MUST be consistent across certificate, agreement, and receipt
4. **Status Validation**: Documents only generate for appropriate status (approved, completed)
5. **GST Number Display**: GST #81574 2325 RT0001 MUST appear on all receipts (applies to both GST and HST)
6. **Disclaimer Requirement**: Receipts MUST include "This is not an official license agreement" warning

### Integration Dependencies
- **Payment System** → Receipt generation triggered by payment confirmation
- **Status System** → Certificate generation triggered by approval status
- **Email System** → All documents attached to corresponding emails
- **Admin System** → Documents accessible via admin dashboard
- **Object Storage** → Future migration path for cloud storage

## 5. Pre-Change System Impact Scan (Doc-specific)

**Before modifying document generation, verify:**
- [ ] All 8 license pathways tested with sample data (excluding Awareness which requires no documents)
- [ ] Provincial tax calculations and tax type (GST/HST) match across payment, receipt, and email
- [ ] Date formatting consistent (Month DD, YYYY format)
- [ ] Logo files exist and are accessible
- [ ] File permissions allow write access to public directories
- [ ] Email attachment size limits not exceeded (< 10MB total)
- [ ] Admin dashboard can retrieve and display generated documents
- [ ] Reference numbers properly sanitized for filenames

## 6. Document Type Specifications

### 6.1 Certificates

**Purpose**: Official license confirmation document  
**Trigger**: Application approval (status = 'approved')  
**Storage**: `/public/certificates/`  
**File Pattern**: `{referenceNumber}.pdf`

**Required Elements**:
- OSS Logo (centered, 60px height)
- "OFFICIAL LICENSE CERTIFICATE" header
- Organization/Individual name
- Reference number
- License type (formatted)
- Usage intent (formatted)
- Issue date (approval date)
- Expiry date (1 year from issue)
- QR code for verification
- Orange border (#EE7125)
- Watermark (5% opacity)

**Generation Functions by Pathway**:
```typescript
// Standard pathways (Personal, Small/Medium/Large Business, Non-Profit, Artist)
import { generateCertificate } from './utils/certificate-generator-new';

// Certified Reseller pathway
import { generateCertifiedResellerCertificate } from './utils/certified-reseller-certificate';

// Educational pathway uses standard generator
import { generateCertificate } from './utils/certificate-generator-new';
```

### 6.2 License Agreements

**Purpose**: Legal contract between OSS and licensee  
**Trigger**: Application approval OR preview during application  
**Storage**: `/public/certificates/` (confusingly named directory)  
**File Pattern**: `license_agreement_{referenceNumber}.pdf`

**Required Elements**:
- Agreement title (pathway-specific)
- Effective date
- Party information (OSS and Licensee)
- WHEREAS clauses
- License grant terms
- Territory restrictions
- Fee specifications
- Product listings (Schedule 2)
- Trademark list (Schedule 1)
- Signature blocks
- Notice addresses

**Generation Functions by Pathway**:

1. **Standard License** (Small/Medium/Large Business, Non-Profit):
```typescript
import { generateStandardLicenseAgreement } from './utils/standard-license-agreement';
```

2. **Certified Reseller**:
```typescript
import { generateExactCertifiedResellerAgreement } from './utils/certified-reseller-agreement-exact';
```

3. **Educational**:
```typescript
import { generateExactEducationalAgreement } from './utils/educational-agreement-exact';
```

4. **Personal/Artist** (use standard with modifications):
```typescript
import { generateStandardLicenseAgreement } from './utils/standard-license-agreement';
```

### 6.3 Receipts

**Purpose**: Payment confirmation document  
**Trigger**: Successful payment processing (webhook confirmation)  
**Storage**: `/public/receipts/`  
**File Pattern**: `receipt-{referenceNumber}-{timestamp}.pdf`

**Required Elements**:
- OSS Logo (100px width)
- "PAYMENT RECEIPT" header
- OSS contact information
- GST Registration Number: 81574 2325 RT0001 (for both GST and HST)
- Receipt number (reference number)
- Payment date
- Payment method
- Business/Organization details
- Fee breakdown:
  - Base fee (subtotal)
  - Discount (if applicable)
  - Tax amount with type (GST or HST) and rate
  - Total paid
- **MANDATORY WARNING**: "This is a receipt of payment. This is not an official license agreement."
- Footer text about tax records and provincial tax compliance

**Generation Functions by Pathway**:

1. **Standard Receipt** (most pathways):
```typescript
import { generateLicenseReceipt } from './utils/license-receipt';
```

2. **Certified Reseller Receipt**:
```typescript
import { generateCertifiedResellerReceipt } from './utils/certified-reseller-receipt';
```

3. **Educational Receipt** (uses standard):
```typescript
import { generateLicenseReceipt } from './utils/license-receipt';
```

## 7. Pathway-Specific Requirements

### Personal Use (`/apply/personal`)
- **Certificate**: Uses contact name instead of organization name
- **Agreement**: Simplified terms, no commercial clauses
- **Receipt**: Shows "Personal/Family Use" as license type

### Artist (`/apply/artist`)
- **Certificate**: Includes artist designation
- **Agreement**: Includes intellectual property clauses
- **Receipt**: Standard format with "Artist" license type

### Educational (`/apply/educational`)
- **Certificate**: Shows institution name and educational designation
- **Agreement**: Custom educational template with fundraising terms
- **Receipt**: Includes educational pathway information

### Small Business (`/small-business`)
- **Certificate**: Shows "Small Business (1-19 employees)"
- **Agreement**: Standard commercial template
- **Receipt**: Includes business size designation

### Medium Business (`/medium-business`)
- **Certificate**: Shows "Medium Business (20-199 employees)"
- **Agreement**: Standard commercial template
- **Receipt**: Includes business size designation

### Large Business (`/large-business`)
- **Certificate**: Shows "Large Corporation (200+ employees)"
- **Agreement**: Standard commercial template
- **Receipt**: Includes business size designation

### Non-Profit (`/non-profit`)
- **Certificate**: Shows "Non-Profit Organization"
- **Agreement**: Standard template with non-profit clauses
- **Receipt**: Includes non-profit designation

### Certified Reseller (`/certified-reseller`)
- **Certificate**: Custom certified reseller certificate
- **Agreement**: Specialized reseller agreement
- **Receipt**: Fixed $10 administrative fee

## 8. Data Formatting Standards

### Date Formatting
```typescript
// Always use this format for display
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}
// Output: "August 26, 2025"
```

### Amount Formatting
```typescript
// Always show 2 decimal places with CAD
function formatAmount(amount: number): string {
  return `$${amount.toFixed(2)} CAD`;
}
// Output: "$69.30 CAD"
```

### License Type Formatting
```typescript
import { formatLicenseTypeShort } from '@shared/business-size-constants';
// Use centralized formatting for consistency
```

### Tax Breakdown Format
```typescript
// Receipt must show:
Subtotal: $[base_amount]
Discount: -$[discount_amount] (CODE: [coupon_code])
[Tax Type] ([rate]%): $[tax_amount]  // Shows "GST (5%)" or "HST (13-15%)" based on province
Total: $[final_amount]
```

## 9. Error Handling Patterns

### Document Generation Failures
```typescript
try {
  const doc = new PDFDocument(config);
  // Generation logic
} catch (error) {
  console.error(`Failed to generate ${documentType} for ${referenceNumber}:`, error);
  // Log to database for admin visibility
  await storage.createSystemLog({
    type: 'document_generation_error',
    referenceNumber,
    error: error.message,
    timestamp: new Date()
  });
  // Don't block application flow - mark for manual review
  throw new Error(`Document generation failed - admin intervention required`);
}
```

### File System Errors
```typescript
// Always check directory exists before writing
if (!fs.existsSync(dir)) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (error) {
    console.error('Cannot create directory:', dir);
    throw new Error('File system not writable');
  }
}
```

## 10. Tests to Maintain

### Unit Tests
- Certificate generation for each license type
- Agreement generation with all product combinations
- Receipt generation with various provincial tax scenarios (GST vs HST)
- Date formatting consistency
- Amount calculation accuracy
- Reference number sanitization
- File path generation safety

### Integration Tests
- Full application → approval → certificate flow
- Payment → receipt → email attachment flow
- Agreement preview → final generation consistency
- Admin dashboard document retrieval
- Email delivery with attachments
- Status-based generation triggers

### Edge Cases
- Zero-amount receipts (100% coupon)
- International applications (no tax)
- Missing province (default to GST 5%)
- Missing logo files (graceful fallback)
- Long organization names (text wrapping)
- Special characters in reference numbers
- Maximum file size limits
- Concurrent document generation

## 11. Logging & Alerts (Doc-specific fields)

### Required Log Fields
```typescript
interface DocumentGenerationLog {
  documentType: 'certificate' | 'agreement' | 'receipt';
  referenceNumber: string;
  applicationId: number;
  generatedAt: Date;
  filePath: string;
  fileSize: number;
  generationTime: number; // milliseconds
  triggeredBy: 'approval' | 'payment' | 'manual' | 'regeneration';
  attachedToEmail?: boolean;
  error?: string;
}
```

### Alert Triggers
- Generation failure after 3 retries
- File size exceeds 5MB
- Missing required data fields
- Logo file not found
- Directory not writable
- Email attachment failure

## 12. Common Issues and Solutions

### Issue: "Certificate not generating after approval"
**Cause**: Status transition not triggering generation
**Solution**: Check status is exactly 'approved', not 'pending' or other
**Verification**: Check logs for generation attempt

### Issue: "Receipt shows wrong tax amount or tax type"
**Cause**: Frontend recalculation instead of using backend amount
**Solution**: Always use `application.calculatedFee` from database
**Verification**: Compare receipt to payment intent in Stripe

### Issue: "Agreement preview differs from final PDF"
**Cause**: Different templates or data sources
**Solution**: Ensure preview and final use same generation function
**Verification**: Side-by-side comparison of HTML and PDF

### Issue: "Documents not attached to emails"
**Cause**: File path resolution or size limits
**Solution**: Use absolute paths for attachments, check total size < 10MB
**Verification**: Check email_logs table for attachment records

## 13. Migration Considerations

### Future Object Storage Migration
```typescript
// Current: Local filesystem
const filePath = path.join(process.cwd(), 'public', 'certificates', filename);

// Future: Object Storage
const objectPath = await objectStorageService.uploadDocument(
  pdfBuffer,
  filename,
  'application/pdf'
);
```

### Backward Compatibility
- Maintain database columns for both local and cloud paths
- Implement fallback logic for retrieving documents
- Batch migrate existing documents
- Update email attachment logic to support both sources

## 14. Cross-links

### Related Documentation
- [File Upload Instructions](./file-upload-instructions.md) - For understanding file handling patterns
- [Payment Processing Instructions](./payment-processing-instructions.md) - For receipt generation triggers
- [Email Delivery Instructions](./email-delivery-instructions.md) - For attachment handling
- [Status Management Instructions](./status-management-instructions.md) - For certificate generation triggers
- [Tax System Instructions v3.0](./tax-system-instructions-v3.0.md) - For accurate provincial GST/HST receipt breakdowns

### System Dependencies
- **PDFKit**: Core PDF generation library
- **QRCode**: For certificate verification codes
- **SendGrid**: For email delivery with attachments
- **Express Static**: For serving generated documents
- **File System**: For local storage (temporary)

## 15. Production Checklist

Before deploying document generation changes:

- [ ] All 8 license pathways generate certificates correctly (Awareness pathway excluded - no documents needed)
- [ ] All applicable pathways generate agreements correctly
- [ ] All payment pathways generate receipts correctly
- [ ] Provincial tax calculations and tax type (GST/HST) match exactly across all documents
- [ ] GST registration number appears on all receipts (for both GST and HST)
- [ ] Disclaimer text present on receipts
- [ ] Dates formatted consistently
- [ ] Reference numbers safe for filenames
- [ ] Documents attached to emails successfully
- [ ] Admin can download all document types
- [ ] Error handling doesn't block user flow
- [ ] Logging captures all generation events
- [ ] File cleanup prevents disk space issues

## 16. Monitoring and Maintenance

### Daily Checks
- Document generation success rate > 99%
- Average generation time < 3 seconds
- No orphaned documents (generated but not linked)
- Email attachment success rate > 99%

### Weekly Maintenance
- Clean up documents older than 90 days (keep database references)
- Review generation error logs
- Verify storage space availability
- Check for unusual file sizes

### Monthly Audits
- Cross-reference generated documents with applications
- Verify all approved applications have certificates
- Confirm all completed payments have receipts
- Review document access logs for security

---

**Version History**:
- v1.0 (Aug 26, 2025): Initial comprehensive documentation covering all pathways and document types

**Next Review Date**: September 26, 2025

**Document Owner**: System Architecture Team

**Approval**: Verified against production system behavior and 100% pathway coverage