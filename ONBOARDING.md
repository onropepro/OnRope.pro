# Employee Onboarding Document Signing System

## GOLDEN RULES - MANDATORY FOR ALL DEVELOPMENT

### Rule 1: Complete Testing Before Proceeding
**Every step MUST be tested and working 100% before moving to the next step. No exceptions.**

Before proceeding to the next step of the build, the following must be verified:
- Backend code reviewed and working
- Frontend code reviewed and working
- Database schema correct and all tables created and available
- Routes tested and functional
- No LSP errors
- API wording correct
- API calls returning correct data
- Every endpoint tested

This rule applies between EACH step of the build. No exception will be acceptable.

### Rule 2: Stay Within Scope
- Do NOT wander away doing things that were not asked
- Do NOT freelance or add extra features
- Do NOT assume - ask if unclear
- Do NOT touch code that does not need to be touched
- Do NOT add functions that were not asked to be added
- Do NOT alter any other function or feature of the app unless approved by the user

---

## Overview

When a company invites a technician and the technician accepts the invitation, they are taken to an **Onboarding Document Signing Page** before they can access the main technician portal.

This page displays all company documents that require viewing and signing:
- Health & Safety Manual
- Company Policy
- Safe Work Procedures (all active templates)
- Safe Work Practices (all active templates)

---

## User Flow

### Step 1: Company Sends Invitation
- Company invites technician via email
- Technician receives invite with link to accept

### Step 2: Technician Accepts Invitation
- Technician clicks link and accepts the invite
- Instead of going directly to the technician portal, they are redirected to the **Onboarding Documents Page**

### Step 3: Onboarding Documents Page
The page displays:
- Company name and welcome message
- List of all documents requiring signature
- Status indicator for each document (Pending / Signed)
- View & Sign button for each pending document

### Step 4: Document Viewing and Signing
For each document:
1. Technician clicks "View & Sign" button
2. Document opens in a modal or full-page view
3. Technician reads/reviews the document
4. Technician provides digital signature
5. Document is marked as signed
6. Progress updates in real-time

### Step 5: Completion
- Once ALL documents are signed, a "Continue to Portal" button appears
- Technician clicks to proceed to their main technician portal
- User record is updated to mark onboarding as complete

---

## Technical Requirements

### Database Schema Updates
- Add `onboardingComplete` boolean field to users table (default false)
- Track which connection the onboarding is for (technicians can work for multiple companies)
- Use existing `document_review_signatures` table for signature records

### New API Endpoints
1. `GET /api/onboarding/documents` - Get all documents requiring signature for current user
2. `POST /api/onboarding/sign/:documentId` - Sign a specific document
3. `GET /api/onboarding/status` - Check if all documents are signed
4. `POST /api/onboarding/complete` - Mark onboarding as complete

### Frontend Components
1. **OnboardingPage** - Main page showing all documents
2. **DocumentCard** - Card for each document with status and action button
3. **DocumentViewer** - Modal/page for viewing document content
4. **SignatureCapture** - Component for capturing digital signature

### Integration Points
- Uses existing `document_review_signatures` table
- Triggers CSR point updates when documents are signed
- Updates company documents portal in real-time
- Respects grace period rules per SCR.RATING.md

---

## Business Logic

### Document Requirements
- All uploaded company documents of these types are required:
  - health_safety_manual
  - company_policy
  - safe_work_procedure
  - safe_work_practice

### Signing Process
1. When technician signs a document:
   - Create/update record in `document_review_signatures`
   - Set `signedAt` timestamp
   - Store signature data URL
2. CSR points are automatically recalculated
3. Company dashboard updates to show new signature

### Completion Criteria
- **ALL documents for the specific company MUST be signed before granting access to company work portal**
- Technician cannot bypass this step - they must complete all signatures
- Technician can have incomplete onboarding for one company while complete for another
- Store completion status per company-technician connection
- If tech tries to access company portal without completing onboarding, redirect back to onboarding page

---

## Edge Cases to Handle
- Company has no documents uploaded yet → Allow immediate completion with message
- New document added after technician completes onboarding → Technician still has access (grace period applies per SCR.RATING.md)
- Technician already signed documents before this feature → Mark as complete if all current docs signed
- Document is deleted while technician is signing → Handle gracefully, refresh list
- Technician works for multiple companies → Separate onboarding per company connection
- **Partial completion (tech closes app mid-signing)** → When technician returns:
  - Signed documents remain signed (stored in database)
  - Unsigned documents still show as pending
  - Progress indicator shows current status (e.g., "3 of 6 documents signed")
  - Tech can continue signing remaining documents
  - No need to re-sign previously signed documents

---

## Testing Strategy
Test each scenario:
1. New technician with all documents pending
2. Existing technician with some documents already signed
3. Company with no documents uploaded
4. Multiple documents (5+ safe work procedures)
5. Signature capture and storage
6. CSR point updates after signing
7. Redirect after all documents signed
8. Multi-company technician flows
