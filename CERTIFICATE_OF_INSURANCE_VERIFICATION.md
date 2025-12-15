# Certificate of Insurance (COI) Verification Guide

## Overview

The Certificate of Insurance (COI) Verification feature automatically extracts and tracks policy expiration dates from uploaded insurance documents using AI-powered document analysis. This helps companies maintain valid insurance coverage and avoid compliance gaps.

---

## How It Works

### Automatic Extraction Flow

1. **Upload**: When a Certificate of Insurance PDF is uploaded through the Documents page
2. **AI Analysis**: The system sends the PDF to Gemini AI for analysis
3. **Date Extraction**: Gemini identifies and extracts the policy expiration date
4. **Storage**: The extracted date is saved to the database
5. **Display**: The expiry date appears with visual warnings when applicable

---

## Visual Indicators

### Expiry Status Badges

| Status | Badge Color | Text Color | Condition |
|--------|-------------|------------|-----------|
| **Expired** | Red (destructive) | Red | Policy expiry date is in the past |
| **Expiring Soon** | Red (destructive) | Red | Policy expires within 30 days |
| **Valid** | None | Normal (muted) | Policy is valid for more than 30 days |

### Display Format

Each Certificate of Insurance document shows:
- Document filename
- Uploaded by (user name)
- Expiry date with calendar icon
- Warning badge (if expired or expiring soon)

---

## Technical Implementation

### Database Schema

```typescript
// shared/schema.ts - company_documents table
insuranceExpiryDate: timestamp("insurance_expiry_date")
```

The `insuranceExpiryDate` field stores the extracted policy expiration date as a timestamp.

### Storage Functions

```typescript
// server/storage.ts

// Update document with extracted expiry date
async updateCompanyDocument(id: string, updates: { insuranceExpiryDate?: Date | null })

// Retrieve document for extraction
async getCompanyDocumentById(id: string)
```

### API Endpoints

#### Auto-Extraction (On Upload)
- **Trigger**: Automatically when `documentType === 'certificate_of_insurance'`
- **Process**:
  1. Fetch uploaded PDF from storage
  2. Convert to base64
  3. Send to Gemini AI for analysis
  4. Parse JSON response for expiry date
  5. Update document record with extracted date

#### Manual Extraction Endpoint
```
POST /api/company-documents/:id/extract-insurance-expiry
```
- **Authentication**: Required
- **Roles**: `operations_manager`, `company`
- **Response**:
  ```json
  {
    "success": true,
    "expiryDate": "2025-12-31T00:00:00.000Z",
    "confidence": "high",
    "document": { ... }
  }
  ```

### AI Integration

**Model**: Gemini 2.5 Flash (via OpenAI-compatible SDK)

**Prompt**:
```
Analyze this Certificate of Insurance PDF and extract the policy expiry date.
Look for fields like "Policy Expiry", "Expiration Date", "Policy Period To", "Coverage Ends", or similar.
Respond with ONLY a JSON object: {"expiryDate": "YYYY-MM-DD"} or {"expiryDate": null} if not found.
```

**Environment Variables**:
- `AI_INTEGRATIONS_GEMINI_API_KEY`
- `AI_INTEGRATIONS_GEMINI_BASE_URL`

### Frontend Logic

```typescript
// client/src/pages/Documents.tsx

// Extract expiry date from document
const expiryDate = doc.insuranceExpiryDate ? new Date(doc.insuranceExpiryDate) : null;

// Calculate 30-day warning threshold
const now = new Date();
const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

// Determine warning status
const isExpired = expiryDate ? expiryDate < now : false;
const isExpiringSoon = expiryDate ? (expiryDate >= now && expiryDate <= thirtyDaysFromNow) : false;
const showWarning = isExpired || isExpiringSoon;
```

**Styling**:
- Warning text: `text-red-600 dark:text-red-500`
- Warning badge: `variant="destructive"`

---

## User Guide

### Uploading a Certificate of Insurance

1. Navigate to **Documents** page
2. Select the **Certificate of Insurance** tab
3. Click **Upload Certificate**
4. Select your PDF file
5. Wait for upload and AI extraction to complete
6. The expiry date will automatically appear if detected

### Understanding Warnings

- **Red "EXPIRED" badge**: Your policy has expired. Upload a new certificate immediately.
- **Red "Expiring Soon" badge**: Your policy expires within 30 days. Plan to renew soon.
- **No badge**: Your policy is valid for more than 30 days.

### Troubleshooting

| Issue | Solution |
|-------|----------|
| No expiry date shown | The AI couldn't detect a date. Ensure the PDF is readable and contains clear expiry information. |
| Wrong date extracted | Use the manual re-extraction feature or upload a clearer document. |
| Upload fails | Check file is a valid PDF under the size limit. |

---

## Best Practices

1. **Upload clear PDFs**: Ensure your Certificate of Insurance is legible and not a low-quality scan
2. **Check after upload**: Verify the extracted expiry date is correct
3. **Act on warnings**: When you see "Expiring Soon", begin the renewal process
4. **Keep current**: Replace expired certificates promptly to maintain compliance

---

## Related Documentation

- [Safety & Compliance Guide](./client/src/pages/SafetyGuide.tsx)
- [Document Management Guide](./client/src/pages/DocumentManagementGuide.tsx)
- [Company Safety Rating (CSR)](./SCR.RATING.md)

---

## Changelog

| Date | Change |
|------|--------|
| December 13, 2025 | Initial release of AI-Powered Insurance Expiry Detection |
