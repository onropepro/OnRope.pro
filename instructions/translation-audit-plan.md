# Comprehensive Translation Audit Plan

## Executive Summary

This document provides a **deep audit** of translation coverage across the entire OnRopePro application. The platform supports three languages: English (EN), French (FR), and Spanish (ES).

**Total Files Audited:** 276 files (134 pages + 142 components)

---

## Current State Analysis

### Translation Key Statistics

| Locale | Total Keys | Status |
|--------|------------|--------|
| English (EN) | 6,742 | Source of truth |
| French (FR) | 8,486 | 228 keys missing from EN |
| Spanish (ES) | 8,312 | 347 keys missing from EN |

### Missing Keys by Section

**French (228 keys missing):**
| Section | Missing Keys |
|---------|-------------|
| `modules.*` | 225 keys (scheduling stakeholders, inventory, projects) |
| `home.*` | 2 keys |
| `propertyManager.*` | 1 key |

**Spanish (347 keys missing):**
| Section | Missing Keys |
|---------|-------------|
| `modules.*` | 345 keys (scheduling stakeholders, inventory, safety) |
| `home.*` | 2 keys |

---

## COMPLETE FILE AUDIT

### Category 1: Pages Without ANY Translation System (21 pages)

These pages have **zero translation infrastructure** - all text is hardcoded English:

#### Main Application Pages (10)
| Page | Account Type | User Impact | Priority |
|------|--------------|-------------|----------|
| `Pricing.tsx` | Public | HIGH - Sales conversion | CRITICAL |
| `ResetPassword.tsx` | All Users | HIGH - Account recovery | CRITICAL |
| `Employer.tsx` | Employer | HIGH - Core functionality | CRITICAL |
| `CRMLanding.tsx` | Public | MEDIUM - Marketing | HIGH |
| `TechnicianJobBoardLanding.tsx` | Public | MEDIUM - Marketing | HIGH |
| `PropertyManagerQuoteDetail.tsx` | Property Manager | MEDIUM - Core feature | HIGH |
| `SuperUserStaffAccounts.tsx` | SuperUser | LOW - Internal only | MEDIUM |
| `ConnectionsGuide.tsx` | Help | LOW - Documentation | LOW |
| `DashboardCustomizationGuide.tsx` | Help | LOW - Documentation | LOW |
| `PSRGuide.tsx` | Help | LOW - Documentation | LOW |

#### Help Center Pages (11)
| Page | User Impact | Priority |
|------|-------------|----------|
| `help/HelpCenter.tsx` | HIGH - Main help hub | HIGH |
| `help/HelpArticle.tsx` | HIGH - Article display | HIGH |
| `help/HelpSearch.tsx` | MEDIUM - Search | MEDIUM |
| `help/FeatureFinder.tsx` | MEDIUM - Discovery | MEDIUM |
| `help/GettingStarted.tsx` | HIGH - Onboarding | HIGH |
| `help/tools/ROICalculator.tsx` | MEDIUM - Sales tool | MEDIUM |
| `help/stakeholders/ForTechnicians.tsx` | HIGH - User-facing | HIGH |
| `help/stakeholders/ForResidents.tsx` | HIGH - User-facing | HIGH |
| `help/stakeholders/ForPropertyManagers.tsx` | HIGH - User-facing | HIGH |
| `help/stakeholders/ForBuildingManagers.tsx` | HIGH - User-facing | HIGH |
| `help/stakeholders/ForCompanyOwners.tsx` | HIGH - User-facing | HIGH |

---

### Category 2: Components Without Translation System (75 components)

#### Dashboard Cards (21 cards) - ALL NEED TRANSLATIONS
| Component | Content Type | Priority |
|-----------|-------------|----------|
| `ActiveWorkersCard.tsx` | Dynamic data labels | HIGH |
| `CertificationAlertsCard.tsx` | Alert messages | HIGH |
| `ExpiringCertsCard.tsx` | Warning text | HIGH |
| `HarnessStatusCard.tsx` | Status labels | HIGH |
| `MyPerformanceCard.tsx` | Performance metrics | HIGH |
| `MyScheduleCard.tsx` | Schedule labels | HIGH |
| `NewFeedbackCard.tsx` | Notification text | MEDIUM |
| `NotClockedInCard.tsx` | Status message | HIGH |
| `OutstandingQuotesCard.tsx` | Business metrics | MEDIUM |
| `OverdueProjectsCard.tsx` | Alert messages | HIGH |
| `OvertimeAlertCard.tsx` | Warning text | HIGH |
| `PayPeriodCard.tsx` | Payroll labels | HIGH |
| `PendingApprovalsCard.tsx` | Action items | MEDIUM |
| `PlaceholderCard.tsx` | Placeholder text | LOW |
| `TodayScheduleCard.tsx` | Schedule text | HIGH |
| `ToolboxCoverageCard.tsx` | Safety metrics | HIGH |
| `SafetyRatingCard.tsx` | Safety labels | HIGH |
| `TodaysHoursCard.tsx` | Time tracking | HIGH |
| `WeekAtGlanceCard.tsx` | Weekly summary | MEDIUM |
| `MyTimeCard.tsx` | Time display | HIGH |
| `ActiveProjectsCard.tsx` | Project info | HIGH |

#### Dashboard Infrastructure (5 components)
| Component | Priority |
|-----------|----------|
| `CardSkeleton.tsx` | LOW (no visible text) |
| `DashboardSearch.tsx` | HIGH (search placeholder) |
| `cardRegistry.tsx` | MEDIUM (card names) |
| `DashboardCard.tsx` | MEDIUM (wrapper labels) |
| `DashboardGrid.tsx` | LOW |

#### Profile Components (7 components) - ALL NEED TRANSLATIONS
| Component | Content Type | Priority |
|-----------|-------------|----------|
| `EditableAddressField.tsx` | Form labels | HIGH |
| `EditableDateField.tsx` | Date labels | HIGH |
| `EditableField.tsx` | Field labels | HIGH |
| `EditableSelect.tsx` | Select options | HIGH |
| `EditableSwitch.tsx` | Toggle labels | HIGH |
| `EditableTextarea.tsx` | Text labels | HIGH |
| `ProfilePhotoUploader.tsx` | Upload text | HIGH |

#### Help Components (5 components)
| Component | Priority |
|-----------|----------|
| `HelpBreadcrumb.tsx` | HIGH |
| `HelpNav.tsx` | HIGH |
| `HelpSearchBar.tsx` | HIGH |
| `HelpArticleCard.tsx` | HIGH |
| `HelpChatWidget.tsx` | HIGH |

#### Core UI Components (27 components)
| Component | Priority | Notes |
|-----------|----------|-------|
| `DocumentUploader.tsx` | CRITICAL | Used across all account types |
| `SignInModal.tsx` | CRITICAL | Authentication flow |
| `SubscriptionManagement.tsx` | CRITICAL | Payment flow |
| `PurchaseSeatsDialog.tsx` | CRITICAL | Payment flow |
| `RemoveSeatsDialog.tsx` | CRITICAL | Payment flow |
| `ResidentSlidingSignup.tsx` | CRITICAL | Registration flow |
| `SiteFooter.tsx` | HIGH | Present on all pages |
| `InstallPWAButton.tsx` | HIGH | Mobile experience |
| `ActiveSessionBadge.tsx` | HIGH | Status indicator |
| `ClientExcelImport.tsx` | MEDIUM | Import feature |
| `EmbeddedCheckout.tsx` | MEDIUM | Checkout flow |
| `EmployerDocumentRequests.tsx` | MEDIUM | Document requests |
| `SessionDetailsDialog.tsx` | MEDIUM | Session info |
| `SubscriptionRenewalBadge.tsx` | MEDIUM | Renewal notice |
| `RegistrationEmbeddedCheckout.tsx` | MEDIUM | Registration |
| `ErrorBoundary.tsx` | LOW | Error fallback |
| `ProtectedRoute.tsx` | LOW | No visible text |
| `DashboardLayout.tsx` | LOW | Layout wrapper |
| `SuperUserLayout.tsx` | LOW | Layout wrapper |
| `ChangelogLayout.tsx` | LOW | Layout |
| `ChangelogGuideLayout.tsx` | LOW | Layout |
| `CSRBadge.tsx` | LOW | Badge display |
| `StatsCard.tsx` | LOW | Generic stats |
| `AddressAutocomplete.tsx` | LOW | Minimal text |
| `HighRiseBuilding.tsx` | LOW | Visual only |
| `ParkadeView.tsx` | LOW | Visual only |
| `VerticalBuildingProgress.tsx` | LOW | Visual only |

---

### Category 3: Pages With Mixed Translations (Partial Coverage)

These pages HAVE translation hooks but contain **significant hardcoded English strings**:

#### Landing & Marketing Pages (Hardcoded String Count)
| Page | Hardcoded Strings | Priority |
|------|-------------------|----------|
| `ProjectManagementLanding.tsx` | 37 | HIGH |
| `UserAccessLanding.tsx` | 36 | HIGH |
| `WorkSessionLanding.tsx` | 36 | HIGH |
| `ProjectsGuide.tsx` | 35 | MEDIUM |
| `CSRGuide.tsx` | 35 | MEDIUM |
| `ResidentPortalGuide.tsx` | 33 | MEDIUM |
| `InventoryGuide.tsx` | 32 | MEDIUM |
| `TimeTrackingGuide.tsx` | 30 | MEDIUM |
| `CSRLanding.tsx` | 29 | HIGH |
| `EmployeeManagementLanding.tsx` | 29 | HIGH |
| `TechnicianRegistrationGuide.tsx` | 27 | MEDIUM |
| `SchedulingGuide.tsx` | 25 | MEDIUM |
| `SchedulingCalendarLanding.tsx` | 25 | HIGH |
| `SafetyComplianceLanding.tsx` | 25 | HIGH |
| `IRATATaskLoggingLanding.tsx` | 24 | MEDIUM |
| `PropertyManagerGuide.tsx` | 20 | MEDIUM |
| `QuotingSalesLanding.tsx` | 19 | HIGH |
| `SafetyGuide.tsx` | 19 | MEDIUM |
| `PayrollGuide.tsx` | 19 | MEDIUM |
| `EmployerJobBoardLanding.tsx` | 19 | HIGH |
| `DocumentManagementGuide.tsx` | 18 | MEDIUM |
| `EmployeeManagementGuide.tsx` | 18 | MEDIUM |
| `IRATALoggingGuide.tsx` | 18 | MEDIUM |
| `JobBoardGuide.tsx` | 17 | MEDIUM |
| `GearInventoryLanding.tsx` | 17 | MEDIUM |
| `UserAccessGuide.tsx` | 17 | MEDIUM |
| `BrandingGuide.tsx` | 15 | MEDIUM |
| `QuotingGuide.tsx` | 14 | MEDIUM |
| `PayrollFinancialLanding.tsx` | 14 | MEDIUM |
| `WhiteLabelBrandingLanding.tsx` | 12 | MEDIUM |

---

### Category 4: Pages Using Inline Translations (Should Migrate to Locale Files)

These pages have their own `translations` object instead of using centralized locale files:

| Page | Account Type | Migration Effort |
|------|--------------|------------------|
| `TechnicianPortal.tsx` | Technician | HIGH (large file) |
| `GroundCrewPortal.tsx` | Ground Crew | HIGH (large file) |
| `TechnicianJobBoard.tsx` | Technician | MEDIUM |
| `TechnicianApplications.tsx` | Technician | MEDIUM |
| `TechnicianLoggedHours.tsx` | Technician | MEDIUM |
| `TechnicianResume.tsx` | Technician | LOW |
| `VisibleTechniciansBrowser.tsx` | Employer | MEDIUM |

---

### Category 5: Hardcoded Toast/Alert Messages (18 pages)

These pages have hardcoded `toast()` calls with English titles/descriptions:

| Page | Approximate Issues |
|------|-------------------|
| `Dashboard.tsx` | 5+ hardcoded toasts |
| `Documents.tsx` | 15+ hardcoded toasts |
| `Profile.tsx` | 12+ hardcoded toasts |
| `Quotes.tsx` | 3+ hardcoded toasts |
| `Schedule.tsx` | 2+ hardcoded toasts |
| `ManageSubscription.tsx` | 5+ hardcoded toasts |
| `CompanyDetail.tsx` | 2+ hardcoded toasts |
| `CompleteRegistration.tsx` | 2+ hardcoded toasts |
| `FounderResources.tsx` | 3+ hardcoded toasts |
| `GroundCrewJobBoard.tsx` | 1+ hardcoded toasts |
| `GroundCrewPortal.tsx` | 4+ hardcoded toasts |
| `SuperUserFeatureRequests.tsx` | 1+ hardcoded toasts |
| `SuperUserStaffAccounts.tsx` | 2+ hardcoded toasts |
| `SuperUserTasks.tsx` | 2+ hardcoded toasts |
| `SuperUserTechnicians.tsx` | 1+ hardcoded toasts |
| `SuperUser.tsx` | 1+ hardcoded toasts |
| `TechnicianLoggedHours.tsx` | 2+ hardcoded toasts |
| `TechnicianPortal.tsx` | 3+ hardcoded toasts |

---

### Category 6: Hardcoded Placeholders & Form Labels

Many pages have hardcoded `placeholder=""` and form labels:

**BuildingPortal.tsx** - 20+ hardcoded placeholders:
- "Enter your strata or job number"
- "Enter your password"
- "Start typing to search..."
- "e.g., John Smith"
- "e.g., (604) 555-1234"
- And many more...

**Dashboard.tsx** - 10+ hardcoded placeholders in forms

**Changelog.tsx** - Entire changelog is hardcoded English (70+ entries)

---

## ACCOUNT TYPE BREAKDOWN

### Employer Account
| Category | Files Affected |
|----------|----------------|
| No translations | `Employer.tsx` |
| Partial translations | `Dashboard.tsx`, `Documents.tsx`, `Profile.tsx`, `Quotes.tsx`, `Schedule.tsx`, `Inventory.tsx`, `Payroll.tsx` |
| Missing components | `DocumentUploader.tsx`, `PurchaseSeatsDialog.tsx`, `RemoveSeatsDialog.tsx`, `SubscriptionManagement.tsx`, `ClientExcelImport.tsx`, `EmployerDocumentRequests.tsx`, `SessionDetailsDialog.tsx` |
| Dashboard cards | ALL 21 cards need translations |

### Technician Account
| Category | Files Affected |
|----------|----------------|
| Inline translations (not centralized) | `TechnicianPortal.tsx`, `TechnicianJobBoard.tsx`, `TechnicianApplications.tsx`, `TechnicianLoggedHours.tsx`, `TechnicianResume.tsx` |
| No translations | `TechnicianJobBoardLanding.tsx` |
| Missing components | `InstallPWAButton.tsx` |

### Ground Crew Account
| Category | Files Affected |
|----------|----------------|
| Inline translations (not centralized) | `GroundCrewPortal.tsx`, `GroundCrewJobBoard.tsx` |
| Missing components | `InstallPWAButton.tsx` |

### Resident Account
| Category | Files Affected |
|----------|----------------|
| Partial translations | `ResidentDashboard.tsx`, `ResidentLanding.tsx` |
| Missing components | `ResidentSlidingSignup.tsx` |
| No translations | `help/stakeholders/ForResidents.tsx` |

### Property Manager Account
| Category | Files Affected |
|----------|----------------|
| No translations | `PropertyManagerQuoteDetail.tsx` |
| Partial translations | `PropertyManager.tsx`, `PropertyManagerSettings.tsx` |
| No translations | `help/stakeholders/ForPropertyManagers.tsx` |

### Building Manager Account
| Category | Files Affected |
|----------|----------------|
| Partial translations | `BuildingPortal.tsx` (20+ hardcoded placeholders) |
| No translations | `help/stakeholders/ForBuildingManagers.tsx` |

### SuperUser Account
| Category | Files Affected |
|----------|----------------|
| No translations | `SuperUserStaffAccounts.tsx` |
| Partial translations | `SuperUser.tsx`, `SuperUserBuildings.tsx`, `SuperUserMetrics.tsx`, `SuperUserTechnicians.tsx`, `SuperUserJobBoard.tsx`, `SuperUserTasks.tsx`, `SuperUserFeatureRequests.tsx`, `SuperUserFutureIdeas.tsx`, `SuperUserGoalsOverview.tsx` |

### Public/Unauthenticated
| Category | Files Affected |
|----------|----------------|
| No translations | `Pricing.tsx`, `ResetPassword.tsx`, `CRMLanding.tsx`, `TechnicianJobBoardLanding.tsx` |
| Partial translations | `Login.tsx`, `Register.tsx`, `TechnicianLogin.tsx`, `HomePage.tsx` |
| Missing components | `SignInModal.tsx`, `SiteFooter.tsx` |
| Help Center | ALL 11 help pages need translations |

---

## REMEDIATION PHASES

### Phase 1: Authentication & Critical User Flows (3-4 days)
**Impact: All users**

1. **SignInModal.tsx** - Used for login everywhere
2. **ResetPassword.tsx** - Account recovery
3. **Pricing.tsx** - Sales conversion
4. **DocumentUploader.tsx** - Used across all account types
5. **SubscriptionManagement.tsx** - Payment flow
6. **PurchaseSeatsDialog.tsx** - Payment
7. **RemoveSeatsDialog.tsx** - Payment
8. **ResidentSlidingSignup.tsx** - Resident registration
9. Add 228 missing French keys
10. Add 347 missing Spanish keys

### Phase 2: Dashboard Cards (2-3 days)
**Impact: All authenticated users**

All 21 dashboard cards need translations:
- ActiveWorkersCard, CertificationAlertsCard, ExpiringCertsCard, HarnessStatusCard, MyPerformanceCard, MyScheduleCard, NewFeedbackCard, NotClockedInCard, OutstandingQuotesCard, OverdueProjectsCard, OvertimeAlertCard, PayPeriodCard, PendingApprovalsCard, TodayScheduleCard, ToolboxCoverageCard, SafetyRatingCard, TodaysHoursCard, WeekAtGlanceCard, MyTimeCard, ActiveProjectsCard
- Plus: DashboardSearch.tsx, cardRegistry.tsx, DashboardCard.tsx

### Phase 3: Core Feature Pages (4-5 days)
**Impact: Employer, Technician, Property Manager**

1. **Employer.tsx** - Core employer page
2. **PropertyManagerQuoteDetail.tsx** - Quote viewing
3. **SuperUserStaffAccounts.tsx** - Staff management
4. Profile components (7 files)
5. Fix hardcoded toasts in major pages:
   - Dashboard.tsx, Documents.tsx, Profile.tsx, Quotes.tsx, Schedule.tsx

### Phase 4: Migrate Inline Translations (3-4 days)
**Impact: Technician, Ground Crew, Employer**

Move inline `translations` objects to centralized locale files:
1. TechnicianPortal.tsx (largest)
2. GroundCrewPortal.tsx (large)
3. TechnicianJobBoard.tsx
4. TechnicianApplications.tsx
5. TechnicianLoggedHours.tsx
6. TechnicianResume.tsx
7. VisibleTechniciansBrowser.tsx

### Phase 5: Help Center & Documentation (3-4 days)
**Impact: All users seeking help**

1. Help Center infrastructure (5 components)
2. HelpCenter.tsx, HelpArticle.tsx, HelpSearch.tsx
3. GettingStarted.tsx, FeatureFinder.tsx
4. ROICalculator.tsx
5. All 5 stakeholder pages (ForTechnicians, ForResidents, etc.)

### Phase 6: Landing Pages & Marketing (4-5 days)
**Impact: Potential customers**

Fix hardcoded strings in all 30+ landing/guide pages:
- CRMLanding.tsx, TechnicianJobBoardLanding.tsx (no translations)
- All other landing pages with 10+ hardcoded strings

### Phase 7: Form Placeholders & Minor Components (2-3 days)

1. BuildingPortal.tsx - 20+ hardcoded placeholders
2. Dashboard.tsx - 10+ hardcoded placeholders
3. All remaining components with minimal text
4. Changelog.tsx - 70+ changelog entries (consider if needed)

### Phase 8: Cleanup (1-2 days)

1. Remove ~1,972 orphaned keys from French
2. Remove ~1,917 orphaned keys from Spanish
3. Audit for any remaining hardcoded strings
4. Test all three languages end-to-end

---

## SUMMARY STATISTICS

| Category | Count |
|----------|-------|
| Pages without any translations | 21 |
| Components without translations | 75 |
| Pages with partial translations (10+ hardcoded) | 30+ |
| Pages with inline translations (need migration) | 7 |
| Pages with hardcoded toast messages | 18 |
| Dashboard cards needing translations | 21 |
| Profile components needing translations | 7 |
| Help components needing translations | 5 |
| Missing French locale keys | 228 |
| Missing Spanish locale keys | 347 |
| Orphaned French keys | ~1,972 |
| Orphaned Spanish keys | ~1,917 |

**Total Estimated Effort: 22-30 days for complete remediation**

---

## PRIORITY ORDER FOR IMMEDIATE ACTION

1. **CRITICAL (Week 1):** SignInModal, ResetPassword, Pricing, DocumentUploader, Subscription dialogs
2. **HIGH (Week 2):** All 21 dashboard cards, core missing locale keys
3. **HIGH (Week 3):** Employer.tsx, Profile components, PropertyManagerQuoteDetail
4. **MEDIUM (Week 4):** Help Center, stakeholder pages, inline translation migration
5. **MEDIUM (Week 5):** Landing pages, toast messages
6. **LOW (Week 6):** Form placeholders, cleanup, orphaned keys
