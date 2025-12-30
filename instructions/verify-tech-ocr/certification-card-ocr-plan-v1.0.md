# OCR Certification Card Validation Plan

**Version:** 1.0  
**Created:** December 29, 2024  
**Status:** Planned (Not Implemented)

---

## Overview

Add intelligent OCR scanning to the certification card upload in **Step 2 (Certification)** of technician registration. When a user uploads their IRATA or SPRAT certification card photo, the system will extract key information, auto-fill form fields, and validate the data.

---

## Goals

1. **Extract** license number, level, technician name, and expiry date from card images
2. **Auto-fill** form fields with extracted data (if fields are empty)
3. **Validate** extracted data matches user-entered values (if already filled)
4. **Provide feedback** on validation success, warnings, or failures
5. **Reduce friction** in registration while ensuring data accuracy

---

## User Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Certification                                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User selects certification type (IRATA/SPRAT/Both)       │
│                                                              │
│  2. User enters level and license number (optional first)    │
│                                                              │
│  3. User uploads certification card photo                    │
│     └─> System shows "Analyzing card..." loading state       │
│                                                              │
│  4. OCR extracts: Name, License Number, Level, Expiry        │
│                                                              │
│  5. Results handling:                                        │
│     ├─> If fields empty: Auto-fill with extracted values     │
│     ├─> If fields match: Show green checkmark confirmation   │
│     └─> If mismatch: Show warning, let user choose           │
│                                                              │
│  6. User clicks "Create Account" to proceed                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### Components

| Component | File | Description |
|-----------|------|-------------|
| **Gemini Function** | `server/gemini.ts` | New `analyzeCertificationCard()` function |
| **API Endpoint** | `server/routes.ts` | New `/api/ocr/certification-card` endpoint |
| **Frontend Hook** | `TechnicianRegistration.tsx` | OCR trigger on file upload |
| **UI Feedback** | `TechnicianRegistration.tsx` | Success/warning/error states |

### Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────>│   Express    │────>│   Gemini AI  │
│  (Upload)    │     │   Endpoint   │     │   Vision     │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Show Result │<────│  Parse JSON  │<────│  Analyze     │
│  Auto-fill   │     │  Response    │     │  Card Image  │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## API Specification

### Endpoint

```
POST /api/ocr/certification-card
Content-Type: multipart/form-data
```

**Note:** This endpoint does NOT require authentication since it's used during registration before the user has an account.

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | File | Yes | Card photo (JPG, PNG, PDF) |
| `certificationType` | String | Yes | `"irata"`, `"sprat"`, or `"both"` |

### Response Structure

```typescript
interface CertificationCardOCRResult {
  success: boolean;
  certificationType: "irata" | "sprat" | "unknown";
  data: {
    technicianName: string | null;
    licenseNumber: string | null;
    level: number | null;  // 1, 2, or 3
    expiryDate: string | null;  // YYYY-MM-DD format
    isExpired: boolean;
  };
  confidence: "high" | "medium" | "low";
  rawText: string | null;
  error: string | null;
}
```

### Response Examples

**Successful Extraction (High Confidence):**
```json
{
  "success": true,
  "certificationType": "irata",
  "data": {
    "technicianName": "John Smith",
    "licenseNumber": "12345678",
    "level": 2,
    "expiryDate": "2025-06-15",
    "isExpired": false
  },
  "confidence": "high",
  "rawText": "IRATA International...",
  "error": null
}
```

**Low Confidence Extraction:**
```json
{
  "success": true,
  "certificationType": "irata",
  "data": {
    "technicianName": "J. Smith",
    "licenseNumber": "1234???8",
    "level": 2,
    "expiryDate": null,
    "isExpired": false
  },
  "confidence": "low",
  "rawText": "...",
  "error": "Some fields could not be clearly read"
}
```

**Failed Extraction:**
```json
{
  "success": false,
  "certificationType": "unknown",
  "data": {
    "technicianName": null,
    "licenseNumber": null,
    "level": null,
    "expiryDate": null,
    "isExpired": false
  },
  "confidence": "low",
  "rawText": null,
  "error": "This does not appear to be a valid certification card"
}
```

---

## Validation Failure Handling

| Scenario | Confidence | UI Treatment | Can Proceed? |
|----------|------------|--------------|--------------|
| **Clear extraction** | High | Green checkmarks on auto-filled fields | Yes |
| **Partial extraction** | Medium | Amber warning: "Please verify details" | Yes |
| **Poor image quality** | Low | Error: "Upload a clearer photo" | Yes (manual entry) |
| **Wrong document** | N/A | Error: "Not a certification card" | Yes (manual entry) |
| **Name mismatch** | Any | Amber: "Name doesn't match account" | Yes |
| **Level mismatch** | Any | Show both values, let user choose | Yes |
| **Expired cert** | Any | Amber warning about expiry | Yes |

### UI States

```
┌─────────────────────────────────────────────────────────────┐
│  SUCCESS STATE (High Confidence)                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ✓ Card verified successfully                          │   │
│  │   License: 12345678 | Level 2 | Expires: Jun 2025     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  WARNING STATE (Medium/Low Confidence)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ⚠ We extracted some details - please verify below     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Level: [2 ▼]  (extracted)                                  │
│  License Number: [12345678] (extracted - verify)            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ERROR STATE (Unreadable)                                    │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ✗ Could not read card - please enter details manually │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Level: [Select ▼]                                          │
│  License Number: [____________]                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Dependencies

### Already Available

| Dependency | Status | Usage |
|------------|--------|-------|
| Gemini AI Integration | Configured | Vision API for image analysis |
| Multer | Installed | File upload handling |
| Existing OCR patterns | Available | `analyzeIrataScreenshot()`, `analyzeSpratScreenshot()` |
| Framer Motion | Installed | Loading animations |

### No New Dependencies Required

The implementation leverages existing infrastructure.

---

## Gemini Function Design

### Function Signature

```typescript
export interface CertificationCardResult {
  isValid: boolean;
  certificationType: "irata" | "sprat" | "unknown";
  technicianName: string | null;
  licenseNumber: string | null;
  level: number | null;
  expiryDate: string | null;
  isExpired: boolean;
  confidence: "high" | "medium" | "low";
  rawText: string | null;
  error: string | null;
}

export async function analyzeCertificationCard(
  imageBase64: string,
  mimeType: string,
  expectedType: "irata" | "sprat" | "both"
): Promise<CertificationCardResult>
```

### Prompt Strategy

The Gemini prompt should:

1. Identify if image is an IRATA or SPRAT card (or neither)
2. Extract structured data from common card layouts
3. Handle various card versions/designs
4. Return confidence level based on extraction clarity
5. Check expiry date against current date

---

## Implementation Task List

| # | Task | File(s) | Effort |
|---|------|---------|--------|
| 1 | Add `analyzeCertificationCard()` function | `server/gemini.ts` | Medium |
| 2 | Create `/api/ocr/certification-card` endpoint | `server/routes.ts` | Small |
| 3 | Add OCR state management to registration | `TechnicianRegistration.tsx` | Medium |
| 4 | Integrate OCR call on file upload | `TechnicianRegistration.tsx` | Medium |
| 5 | Add validation UI feedback components | `TechnicianRegistration.tsx` | Medium |
| 6 | Add i18n translation keys | `locales/*.json` | Small |
| 7 | Test with sample card images | Manual testing | Medium |

---

## Security Considerations

1. **Rate Limiting:** Add rate limiting to prevent abuse of the OCR endpoint
2. **File Validation:** Validate file type and size before processing
3. **No Storage:** Card images are processed in memory only, not stored
4. **Timeout:** Set reasonable timeout for Gemini API calls (30s max)

---

## Future Enhancements

1. **Real-time verification:** Cross-check license number with IRATA/SPRAT databases
2. **Duplicate detection:** Flag if license number already exists in system
3. **Multi-card support:** Handle cases where user uploads both IRATA and SPRAT cards
4. **Batch processing:** Allow uploading multiple cards at once for "Both" certification type

---

## References

- Existing OCR implementation: `server/gemini.ts` (lines 183-365)
- Existing OCR routes: `server/routes.ts` (lines 11857-12105)
- Registration component: `client/src/components/TechnicianRegistration.tsx`
- Gemini integration: Already configured via Replit integrations
