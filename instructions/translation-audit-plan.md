# Translation Audit Plan

## Executive Summary

This document provides a comprehensive audit of translation coverage across the OnRopePro application. The platform supports three languages: English (EN), French (FR), and Spanish (ES).

---

## Current State Analysis

### Translation Key Statistics

| Locale | Total Keys | Status |
|--------|------------|--------|
| English (EN) | 6,742 | Source of truth |
| French (FR) | 8,486 | 228 keys missing from EN |
| Spanish (ES) | 8,312 | 347 keys missing from EN |

**Note:** FR and ES have more total keys than EN, indicating orphaned/duplicate keys that should be cleaned up.

---

## Issues Identified

### 1. Missing Translation Keys

#### French (228 keys missing)

| Section | Missing Keys | Priority |
|---------|-------------|----------|
| `modules.*` | 225 keys | HIGH |
| `home.*` | 2 keys | MEDIUM |
| `propertyManager.*` | 1 key | LOW |

**Specific Missing Areas in French:**
- `modules.scheduling.stakeholders.*` - Full stakeholder section
- `modules.inventory.*` - Inventory module
- `modules.projects.*` - Project management module
- `propertyManager.projectDetails.loading`

#### Spanish (347 keys missing)

| Section | Missing Keys | Priority |
|---------|-------------|----------|
| `modules.*` | 345 keys | HIGH |
| `home.*` | 2 keys | MEDIUM |

**Specific Missing Areas in Spanish:**
- `modules.scheduling.stakeholders.*` - Full stakeholder section
- `modules.inventory.*` - Inventory module
- `modules.projects.*` - Project management module
- `modules.safety.*` - Safety compliance module

---

### 2. Pages Without Translation System (Hardcoded Strings)

The following **10 pages** do not use the translation system at all:

| Page | Account Type | Priority |
|------|--------------|----------|
| `ConnectionsGuide.tsx` | Employer | LOW (Help docs) |
| `CRMLanding.tsx` | Public | MEDIUM |
| `DashboardCustomizationGuide.tsx` | Employer | LOW (Help docs) |
| `Employer.tsx` | Employer | HIGH |
| `Pricing.tsx` | Public | HIGH |
| `PropertyManagerQuoteDetail.tsx` | Property Manager | MEDIUM |
| `PSRGuide.tsx` | Employer | LOW (Help docs) |
| `ResetPassword.tsx` | All | HIGH |
| `SuperUserStaffAccounts.tsx` | SuperUser | MEDIUM |
| `TechnicianJobBoardLanding.tsx` | Public | MEDIUM |

---

### 3. Components Without Translation System

**27 components** do not use translations:

| Component | Usage Context | Priority |
|-----------|---------------|----------|
| `ActiveSessionBadge.tsx` | Employer Dashboard | MEDIUM |
| `AddressAutocomplete.tsx` | Forms | LOW (minimal text) |
| `ChangelogGuideLayout.tsx` | Changelog | LOW |
| `ChangelogLayout.tsx` | Changelog | LOW |
| `ClientExcelImport.tsx` | Employer | MEDIUM |
| `CSRBadge.tsx` | Dashboard | LOW |
| `DashboardLayout.tsx` | Layout | LOW |
| `DocumentUploader.tsx` | All users | HIGH |
| `EmbeddedCheckout.tsx` | Payments | MEDIUM |
| `EmployerDocumentRequests.tsx` | Employer | MEDIUM |
| `ErrorBoundary.tsx` | All | LOW |
| `HighRiseBuilding.tsx` | Visualization | LOW (no text) |
| `InstallPWAButton.tsx` | All | MEDIUM |
| `ParkadeView.tsx` | Visualization | LOW (no text) |
| `ProtectedRoute.tsx` | Auth | LOW (no visible text) |
| `PurchaseSeatsDialog.tsx` | Employer | HIGH |
| `RegistrationEmbeddedCheckout.tsx` | Registration | MEDIUM |
| `RemoveSeatsDialog.tsx` | Employer | HIGH |
| `ResidentSlidingSignup.tsx` | Resident | HIGH |
| `SessionDetailsDialog.tsx` | Employer | MEDIUM |
| `SignInModal.tsx` | All | HIGH |
| `SiteFooter.tsx` | All | MEDIUM |
| `StatsCard.tsx` | Dashboard | LOW |
| `SubscriptionManagement.tsx` | Employer | HIGH |
| `SubscriptionRenewalBadge.tsx` | Employer | MEDIUM |
| `SuperUserLayout.tsx` | SuperUser | LOW |
| `VerticalBuildingProgress.tsx` | Visualization | LOW (no text) |

---

### 4. Inline Translation Objects (Not Using Locale Files)

Several pages define translations inline rather than using the centralized locale files. These work for multi-language but are harder to maintain:

| Page | Current Pattern | Recommendation |
|------|-----------------|----------------|
| `TechnicianPortal.tsx` | Inline `translations` object | Move to locale files |
| `GroundCrewPortal.tsx` | Inline `translations` object | Move to locale files |
| `TechnicianJobBoard.tsx` | Inline `translations` object | Move to locale files |
| `TechnicianApplications.tsx` | Inline `translations` object | Move to locale files |
| `TechnicianLoggedHours.tsx` | Inline `translations` object | Move to locale files |
| `TechnicianResume.tsx` | Inline `translations` object | Move to locale files |
| `VisibleTechniciansBrowser.tsx` | Inline `translations` object | Move to locale files |

---

### 5. Hardcoded Strings in Translated Pages

Even pages that use translations have some hardcoded English strings:

**Common Issues:**
- Guide/documentation pages with hardcoded navigation labels ("Dashboard", "Projects", "Employees", etc.)
- Form validation messages
- Error messages
- Button labels in some dialogs
- Quotes.tsx has `"Edit"` and `"Configure"` hardcoded
- SuperUserJobBoard.tsx has `"Deleting..."` and `"Delete"` hardcoded

---

## Remediation Plan by Priority

### Phase 1: Critical (User-Facing Public Pages)

**Priority: HIGH | Effort: 2-3 days**

1. **Add translations to high-priority pages:**
   - `Pricing.tsx`
   - `ResetPassword.tsx`
   - `Employer.tsx`

2. **Add translations to critical components:**
   - `SignInModal.tsx`
   - `DocumentUploader.tsx`
   - `PurchaseSeatsDialog.tsx`
   - `RemoveSeatsDialog.tsx`
   - `SubscriptionManagement.tsx`
   - `ResidentSlidingSignup.tsx`

3. **Fill missing locale keys:**
   - Add 228 missing French keys
   - Add 347 missing Spanish keys

---

### Phase 2: User Portals (Account-Specific Pages)

**Priority: MEDIUM | Effort: 3-4 days**

1. **Property Manager Portal:**
   - `PropertyManagerQuoteDetail.tsx`

2. **SuperUser/Admin:**
   - `SuperUserStaffAccounts.tsx`

3. **Landing Pages:**
   - `CRMLanding.tsx`
   - `TechnicianJobBoardLanding.tsx`

4. **Components:**
   - `ActiveSessionBadge.tsx`
   - `ClientExcelImport.tsx`
   - `EmbeddedCheckout.tsx`
   - `EmployerDocumentRequests.tsx`
   - `InstallPWAButton.tsx`
   - `RegistrationEmbeddedCheckout.tsx`
   - `SessionDetailsDialog.tsx`
   - `SiteFooter.tsx`
   - `SubscriptionRenewalBadge.tsx`

---

### Phase 3: Help Documentation & Guides

**Priority: LOW | Effort: 2-3 days**

1. **Guide Pages:**
   - `ConnectionsGuide.tsx`
   - `DashboardCustomizationGuide.tsx`
   - `PSRGuide.tsx`

2. **Refactor inline translations to locale files:**
   - All pages using inline `translations` objects

---

### Phase 4: Cleanup & Maintenance

**Priority: LOW | Effort: 1-2 days**

1. **Remove orphaned keys from FR/ES files:**
   - ~1,972 extra keys in French
   - ~1,917 extra keys in Spanish

2. **Audit hardcoded strings in guide pages:**
   - Navigation labels
   - UI element names in documentation

---

## Account Type Coverage Matrix

| Account Type | Pages Needing Translation | Components Needing Translation |
|--------------|--------------------------|-------------------------------|
| **Public/Unauthenticated** | Pricing.tsx, CRMLanding.tsx, TechnicianJobBoardLanding.tsx | SignInModal.tsx, SiteFooter.tsx |
| **Employer** | Employer.tsx | DocumentUploader.tsx, PurchaseSeatsDialog.tsx, RemoveSeatsDialog.tsx, SubscriptionManagement.tsx, ClientExcelImport.tsx, EmployerDocumentRequests.tsx, SessionDetailsDialog.tsx |
| **Technician** | (Uses inline translations - move to locale files) | InstallPWAButton.tsx |
| **Ground Crew** | (Uses inline translations - move to locale files) | InstallPWAButton.tsx |
| **Resident** | - | ResidentSlidingSignup.tsx |
| **Property Manager** | PropertyManagerQuoteDetail.tsx | - |
| **Building Manager** | - | - |
| **SuperUser** | SuperUserStaffAccounts.tsx | - |
| **All Users** | ResetPassword.tsx | DocumentUploader.tsx, InstallPWAButton.tsx |

---

## Implementation Guidelines

### Adding Translations to a Page

1. Import the translation hook:
```typescript
import { useLanguage } from "@/hooks/use-language";
```

2. Get the translation function:
```typescript
const { t } = useLanguage();
```

3. Replace hardcoded strings:
```typescript
// Before
<Button>Save</Button>

// After
<Button>{t("common.save")}</Button>
```

4. Add keys to all three locale files:
- `client/src/i18n/locales/en.json`
- `client/src/i18n/locales/fr.json`
- `client/src/i18n/locales/es.json`

### Adding Translations to a Component

Same pattern as pages, but consider:
- Components may receive translated strings as props from parent pages
- Keep translation keys organized by feature/component section

---

## Summary

| Category | Count | Status |
|----------|-------|--------|
| Pages without translations | 10 | Needs work |
| Components without translations | 27 | Needs work |
| Keys missing in French | 228 | Needs work |
| Keys missing in Spanish | 347 | Needs work |
| Orphaned keys in FR/ES | ~3,889 | Cleanup needed |
| Pages with inline translations | 7 | Should migrate |

**Estimated Total Effort:** 8-12 days for full remediation

---

## Next Steps

1. Approve this audit plan
2. Prioritize which phases to tackle first
3. Begin implementation with Phase 1 (Critical)
4. Test in all three languages after each phase
