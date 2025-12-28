# Portal Refactoring: Comprehensive Dependency Analysis

**Version**: 1.0  
**Created**: December 28, 2024  
**Purpose**: Complete mapping of all dependencies that Unified Inline Conditional Rendering will impact  
**Status**: PRE-REFACTORING AUDIT  

---

## 1. Executive Summary

This document provides a complete inventory of all systems, APIs, components, and data flows that will be impacted by refactoring TechnicianPortal.tsx and GroundCrewPortal.tsx from dual-tree to unified inline conditional rendering.

**Files in Scope:**
- `client/src/pages/TechnicianPortal.tsx` (6,778 lines)
- `client/src/pages/GroundCrewPortal.tsx` (2,420 lines)

**Risk Level**: MEDIUM-HIGH due to the number of dependencies

---

## 2. API Endpoint Inventory

### 2.1 TechnicianPortal API Endpoints

| Endpoint | Method | Purpose | Request Payload | Response | Critical? |
|----------|--------|---------|-----------------|----------|-----------|
| `/api/user` | GET | Fetch user profile | - | `{ user: UserPublic }` | YES |
| `/api/technician/profile` | PATCH | Update profile | ProfileFormData | `{ user: UserPublic }` | YES |
| `/api/technician/expiration-date` | PATCH | Update cert expiry | `{ type, date }` | `{ user: UserPublic }` | YES |
| `/api/technician/experience-date` | PATCH | Update experience start | `{ date }` | `{ user: UserPublic }` | YES |
| `/api/technician/leave-company` | POST | Leave employer | - | `{ success }` | YES |
| `/api/technician/upload-document` | POST | Upload docs (multipart) | FormData | `{ url, ... }` | YES |
| `/api/technician/document` | DELETE | Delete document | `{ documentType, documentUrl }` | `{ success }` | YES |
| `/api/technician/visibility` | PATCH | Toggle job board visibility | `{ visible }` | `{ user }` | NO |
| `/api/technician/specialties` | POST | Update specialties | `{ specialties }` | `{ user }` | NO |
| `/api/technicians/me/document-requests` | GET | Fetch document requests | - | `{ requests }` | NO |
| `/api/my-invitations` | GET | Team invitations | - | `{ invitations }` | YES |
| `/api/invitations/:id/accept` | POST | Accept invitation | - | `{ success }` | YES |
| `/api/invitations/:id/decline` | POST | Decline invitation | - | `{ success }` | YES |
| `/api/my-irata-task-logs` | GET | Logged hours | - | `{ logs }` | NO |
| `/api/my-historical-hours` | GET | Historical hours | - | `{ historicalHours }` | NO |
| `/api/my-referral-count` | GET | Referral count | - | `{ count }` | NO |
| `/api/my-referrals` | GET | Referral list | - | `{ referrals }` | NO |
| `/api/my-performance-metrics` | GET | Performance data | - | `{ metrics }` | NO |
| `/api/companies/:id` | GET | Company details | - | `{ company }` | NO |
| `/api/my-feedback` | GET | Resident feedback | - | `{ feedback }` | NO |
| `/api/my-feedback/:id/mark-read` | POST | Mark feedback read | - | `{ success }` | NO |
| `/api/my-feedback/:id/reply` | POST | Reply to feedback | `{ reply }` | `{ feedback }` | NO |
| `/api/my-employer-connections` | GET | Employer connections | - | `{ connections }` | NO |
| `/api/user/generate-referral-code` | POST | Generate referral | - | `{ code }` | NO |
| `/api/user/redeem-referral-code` | POST | Redeem referral | `{ referralCode }` | `{ success }` | NO |
| `/api/user/certifications` | GET/POST | User certifications | varies | `{ certifications }` | NO |
| `/api/user/certifications/:id` | DELETE | Delete certification | - | `{ success }` | NO |
| `/api/verify-irata-screenshot` | POST | Verify IRATA | FormData | `{ verification }` | NO |
| `/api/verify-sprat-screenshot` | POST | Verify SPRAT | FormData | `{ verification }` | NO |
| `/api/ocr/drivers-license` | POST | OCR license | FormData | `{ data }` | NO |
| `/api/ocr/void-cheque` | POST | OCR cheque | FormData | `{ data }` | NO |
| `/api/feature-requests` | POST | Submit feature req | `{ title, description }` | `{ success }` | NO |
| `/api/logout` | POST | Logout | - | - | YES |

### 2.2 GroundCrewPortal API Endpoints

| Endpoint | Method | Purpose | Request Payload | Critical? |
|----------|--------|---------|-----------------|-----------|
| `/api/user` | GET | Fetch user profile | - | YES |
| `/api/user/profile` | PATCH | Update profile | ProfileFormData | YES |
| `/api/invitations/:id/accept` | POST | Accept invitation | - | YES |
| `/api/invitations/:id/decline` | POST | Decline invitation | - | YES |
| `/api/technician/leave-company` | POST | Leave employer | - | YES |
| `/api/ground-crew/upload-document` | POST | Upload docs | FormData | YES |
| `/api/ground-crew/document` | DELETE | Delete document | `{ documentType, documentUrl }` | YES |
| `/api/ocr/drivers-license` | POST | OCR license | FormData | NO |
| `/api/ocr/void-cheque` | POST | OCR cheque | FormData | NO |
| `/api/logout` | POST | Logout | - | YES |

---

## 3. React Query Cache Keys

### 3.1 TechnicianPortal Query Keys

| Query Key | Invalidated By | Notes |
|-----------|----------------|-------|
| `["/api/user"]` | Profile update, invitation accept/decline, leave company, referral redeem, document upload/delete, specialties update, visibility toggle | CORE - Most mutations invalidate this |
| `["/api/technicians/me/document-requests"]` | Document request updates | Employer document requests |
| `["/api/my-invitations"]` | Accept/decline invitation | Pending team invitations |
| `["/api/my-irata-task-logs"]` | None in portal | Read-only in portal |
| `["/api/my-historical-hours"]` | None in portal | Read-only in portal |
| `["/api/my-referral-count"]` | None in portal | Read-only in portal |
| `["/api/my-referrals"]` | None in portal | Read-only in portal |
| `["/api/my-performance-metrics"]` | None in portal | Read-only in portal |
| `["/api/companies", user?.companyId]` | None in portal | Conditional - only if user has companyId |
| `["/api/my-feedback"]` | None in portal | Read-only in portal |
| `["/api/my-employer-connections"]` | None in portal | Read-only in portal |
| `['/api/user/certifications']` | Certification upload/delete | User-uploaded certs |

### 3.2 GroundCrewPortal Query Keys

| Query Key | Invalidated By | Notes |
|-----------|----------------|-------|
| `["/api/user"]` | Profile update, invitation accept/decline, leave company, document delete | CORE |
| `["/api/my-invitations"]` | Accept/decline invitation | Pending team invitations |
| `["/api/companies", user?.companyId]` | None in portal | Conditional |

---

## 4. Form Field → Database Column Mapping

### 4.1 TechnicianPortal Form Schema (31 fields)

| Form Field | Database Column | Type | Required? | Validation |
|------------|-----------------|------|-----------|------------|
| `name` | `users.name` | varchar | YES | min 1 char |
| `email` | `users.email` | varchar | YES | email format |
| `employeePhoneNumber` | `users.employee_phone_number` | varchar | YES | phone regex |
| `smsNotificationsEnabled` | `users.sms_notifications_enabled` | boolean | NO | - |
| `employeeStreetAddress` | `users.employee_street_address` | text | NO | - |
| `employeeCity` | `users.employee_city` | varchar | NO | - |
| `employeeProvinceState` | `users.employee_province_state` | varchar | NO | - |
| `employeeCountry` | `users.employee_country` | varchar | NO | - |
| `employeePostalCode` | `users.employee_postal_code` | varchar | NO | - |
| `emergencyContactName` | `users.emergency_contact_name` | varchar | YES | min 1 char |
| `emergencyContactPhone` | `users.emergency_contact_phone` | varchar | YES | phone regex |
| `emergencyContactRelationship` | `users.emergency_contact_relationship` | varchar | NO | - |
| `socialInsuranceNumber` | `users.social_insurance_number` | varchar | NO | - |
| `bankTransitNumber` | `users.bank_transit_number` | varchar | NO | - |
| `bankInstitutionNumber` | `users.bank_institution_number` | varchar | NO | - |
| `bankAccountNumber` | `users.bank_account_number` | varchar | NO | - |
| `driversLicenseNumber` | `users.drivers_license_number` | varchar | NO | - |
| `driversLicenseIssuedDate` | `users.drivers_license_issued_date` | date | NO | - |
| `driversLicenseExpiry` | `users.drivers_license_expiry` | date | NO | - |
| `birthday` | `users.birthday` | date | NO | - |
| `specialMedicalConditions` | `users.special_medical_conditions` | text | NO | - |
| `firstAidType` | `users.first_aid_type` | varchar | NO | - |
| `firstAidExpiry` | `users.first_aid_expiry` | date | NO | - |
| `irataBaselineHours` | `users.irata_baseline_hours` | numeric | NO | - |
| `ropeAccessStartDate` | `users.rope_access_start_date` | date | NO | - |
| `ropeAccessSpecialties` | `users.rope_access_specialties` | text[] | NO | array of strings |

### 4.2 GroundCrewPortal Form Schema (22 fields)

| Form Field | Database Column | Type | Required? |
|------------|-----------------|------|-----------|
| `name` | `users.name` | varchar | YES |
| `email` | `users.email` | varchar | YES |
| `employeePhoneNumber` | `users.employee_phone_number` | varchar | YES |
| `smsNotificationsEnabled` | `users.sms_notifications_enabled` | boolean | NO |
| `birthday` | `users.birthday` | date | NO |
| `employeeStreetAddress` | `users.employee_street_address` | text | NO |
| `employeeCity` | `users.employee_city` | varchar | NO |
| `employeeProvinceState` | `users.employee_province_state` | varchar | NO |
| `employeeCountry` | `users.employee_country` | varchar | NO |
| `employeePostalCode` | `users.employee_postal_code` | varchar | NO |
| `emergencyContactName` | `users.emergency_contact_name` | varchar | YES |
| `emergencyContactPhone` | `users.emergency_contact_phone` | varchar | YES |
| `emergencyContactRelationship` | `users.emergency_contact_relationship` | varchar | NO |
| `socialInsuranceNumber` | `users.social_insurance_number` | varchar | NO |
| `bankTransitNumber` | `users.bank_transit_number` | varchar | NO |
| `bankInstitutionNumber` | `users.bank_institution_number` | varchar | NO |
| `bankAccountNumber` | `users.bank_account_number` | varchar | NO |
| `driversLicenseNumber` | `users.drivers_license_number` | varchar | NO |
| `driversLicenseIssuedDate` | `users.drivers_license_issued_date` | date | NO |
| `driversLicenseExpiry` | `users.drivers_license_expiry` | date | NO |
| `specialMedicalConditions` | `users.special_medical_conditions` | text | NO |
| `firstAidType` | `users.first_aid_type` | varchar | NO |
| `firstAidExpiry` | `users.first_aid_expiry` | date | NO |

---

## 5. Shared Component Dependencies

### 5.1 Components Used by TechnicianPortal

| Component | Import Path | Purpose | Interface Contract |
|-----------|-------------|---------|-------------------|
| `DashboardSidebar` | `@/components/DashboardSidebar` | Navigation sidebar | `{ variant, navGroups, user }` |
| `TechnicianDocumentRequests` | `@/components/TechnicianDocumentRequests` | Document request workflow | Uses internal queries |
| `AddressAutocomplete` | `@/components/AddressAutocomplete` | Address input with Geoapify | `{ onAddressSelect, value, onChange }` |
| `LanguageDropdown` | `@/components/LanguageDropdown` | i18n language selector | `{}` |
| `DashboardSearch` | `@/components/dashboard/DashboardSearch` | Global search | `{}` |
| `CertificationsManager` | Internal to TechnicianPortal | Manage user certs | `{ t }` |

### 5.2 Components Used by GroundCrewPortal

| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `DashboardSidebar` | `@/components/DashboardSidebar` | Navigation sidebar |
| `AddressAutocomplete` | `@/components/AddressAutocomplete` | Address input |
| `CertificationsManager` | Copied in GroundCrewPortal | Manage user certs |

### 5.3 UI Components (from Shadcn)

Both portals use these extensively:
- `Button`, `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`
- `Form`, `FormControl`, `FormField`, `FormItem`, `FormLabel`, `FormMessage`
- `Input`, `Textarea`, `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`
- `Badge`, `Avatar`, `AvatarFallback`, `AvatarImage`
- `Accordion`, `AccordionContent`, `AccordionItem`, `AccordionTrigger`
- `Tooltip`, `TooltipContent`, `TooltipTrigger`
- `Switch`, `Separator`, `Label`
- `Dialog`, `AlertDialog` (various sub-components)

---

## 6. Translation Key Inventory

### 6.1 TechnicianPortal Translation Keys

**Total keys**: ~280+ unique translation keys across 3 languages (EN/ES/FR)
**Usage count**: 536 references to `t.` in the file

**Key Categories:**
| Category | Example Keys | Count (approx) |
|----------|--------------|----------------|
| Labels | `fullName`, `email`, `phoneNumber`, `birthday` | 45 |
| Buttons/Actions | `saveChanges`, `cancel`, `editProfile`, `signOut` | 35 |
| Section Headers | `personalInfo`, `certifications`, `payrollInfo` | 15 |
| Validation Errors | `errorNameRequired`, `errorInvalidEmail`, `errorPhoneRequired` | 8 |
| Status Messages | `profileUpdated`, `changesSaved`, `uploadFailed` | 25 |
| Tooltips/Help | `addressPayrollInfo`, `verificationExplanation` | 20 |
| Relationship Options | `relationshipOptions.mother`, `relationshipOptions.father`, etc. | 12 |
| IRATA/SPRAT | `verifyLicenseValidity`, `irataVerified`, `spratVerified` | 30 |
| Job Board | `jobBoard`, `browseJobs`, `yourReferralCode` | 15 |
| Hours Logging | `totalHoursLogged`, `workSessions`, `previousHours` | 25 |
| Employer/Invitations | `teamInvitations`, `acceptInvitation`, `declineInvitation` | 20 |
| Documents | `uploadDocument`, `voidCheque`, `licensePhoto` | 20 |
| Misc | Various other keys | 30+ |

### 6.2 GroundCrewPortal Translation Keys

**Total keys**: ~180+ unique translation keys across 3 languages (EN/ES/FR)

**Shared with TechnicianPortal**: ~120 keys (similar structure but fewer features)

### 6.3 Translation Parity Issues (Known)

From Technical Debt documentation:
- Missing keys: `ocrSuccess`, `ocrFieldsAutofilled`, `ocrBankFieldsAutofilled`
- Form field name mismatches in some locales

---

## 7. Helper Functions & Utilities

### 7.1 Internal Helpers (TechnicianPortal)

| Function | Purpose | Used In |
|----------|---------|---------|
| `formatPhoneNumber(phone)` | Format as (xxx) xxx-xxxx | View mode display |
| `maskSensitiveData(value)` | Mask all but last 4 chars | SIN, bank account display |
| `maskBankAccount(transit, institution, account)` | Composite bank masking | View mode |
| `InfoItem({ label, value, icon })` | Consistent info display | View mode sections |
| `createProfileSchema(t)` | Generate Zod schema with i18n | Form validation |
| `parseLocalDate(dateStr)` | Parse date for forms | Date fields |
| `formatLocalDate(dateStr)` | Format date for display | Date display |
| `formatDateTime(dateStr)` | Full datetime format | Timestamps |

### 7.2 Shared Utilities Used

| Utility | Import Path | Purpose |
|---------|-------------|---------|
| `queryClient` | `@/lib/queryClient` | Cache management |
| `apiRequest` | `@/lib/queryClient` | API calls |
| `formatLocalDate` | `@/lib/dateUtils` | Date formatting |
| `formatDateTime` | `@/lib/dateUtils` | Datetime formatting |
| `parseLocalDate` | `@/lib/dateUtils` | Date parsing |
| `getTechnicianNavGroups` | `@/lib/technicianNavigation` | Sidebar navigation |
| `JOB_TYPES`, `JOB_CATEGORIES` | `@shared/jobTypes` | Job type constants |

---

## 8. State Management

### 8.1 Local State (TechnicianPortal)

| State Variable | Type | Purpose |
|----------------|------|---------|
| `isEditing` | boolean | Toggle view/edit mode |
| `language` | 'en' \| 'fr' \| 'es' | Current language |
| `activeTab` | string | Current tab |
| `showInvitationDialog` | boolean | Dialog visibility |
| `showLeaveDialog` | boolean | Dialog visibility |
| `showLoggedHoursModal` | boolean | Modal visibility |
| `showReferralDialog` | boolean | Dialog visibility |
| `showFeatureRequestDialog` | boolean | Dialog visibility |
| `showDeleteDocConfirmDialog` | boolean | Dialog visibility |
| `documentToDelete` | object \| null | Document pending deletion |
| `uploadingDocType` | string \| null | Current upload type |
| `showMedicalConditionsWarning` | boolean | Privacy warning |
| `irataVerificationResult` | object \| null | IRATA verify result |
| `spratVerificationResult` | object \| null | SPRAT verify result |
| `addCertDialogOpen` | boolean | Cert dialog visibility |
| `selectedCategoryJobType` | string | Selected specialty category |
| `selectedSpecialtyJobType` | string | Selected specialty type |

### 8.2 Local State (GroundCrewPortal)

| State Variable | Type | Purpose |
|----------------|------|---------|
| `isEditing` | boolean | Toggle view/edit mode |
| `language` | 'en' \| 'fr' \| 'es' | Current language |
| `activeTab` | 'home' \| 'profile' \| 'invitations' \| 'more' | Current tab |
| `showInvitationDialog` | boolean | Dialog visibility |
| `showLeaveDialog` | boolean | Dialog visibility |
| `showDeleteDocConfirmDialog` | boolean | Dialog visibility |
| `documentToDelete` | object \| null | Document pending deletion |
| `uploadingDocType` | string \| null | Current upload type |

---

## 9. External System Dependencies

### 9.1 Third-Party Services

| Service | Purpose | Affected Features |
|---------|---------|-------------------|
| Geoapify | Address autocomplete | Address fields |
| IRATA Portal | License verification | IRATA verification workflow |
| SPRAT Portal | License verification | SPRAT verification workflow |
| Replit Object Storage | Document storage | All document uploads |

### 9.2 Backend Dependencies

| System | Purpose | Impact if Broken |
|--------|---------|------------------|
| PostgreSQL | Data persistence | Complete data loss |
| Session Auth | User authentication | Access denied |
| Multer | File uploads | Document upload fails |
| OCR Service (Gemini) | License/cheque OCR | Auto-fill fails |

---

## 10. Cross-Portal Shared Patterns

### 10.1 Code Patterns Shared Between Portals

| Pattern | TechnicianPortal | GroundCrewPortal | Notes |
|---------|------------------|------------------|-------|
| Profile form schema | Lines 1409-1440 | Lines 654-682 | Similar but Tech has more fields |
| Phone formatting | Lines 1398-1407 | Lines 646-652 | Identical |
| Mask sensitive data | Lines 1445-1452 | Lines 687-693 | Identical |
| InfoItem component | Lines 6748-6778 | Inline | Should be extracted |
| Document upload flow | Lines 2440-2580 | Lines 1000-1130 | Similar pattern |
| Invitation handling | Lines 2089-2130 | Lines 893-920 | Nearly identical |

### 10.2 Refactoring Considerations

**If extracted to shared components:**
- `InfoItem` → Extract to `@/components/profile/InfoItem.tsx`
- `formatPhoneNumber` → Extract to `@/lib/formatters.ts`
- `maskSensitiveData` → Extract to `@/lib/formatters.ts`
- Profile form schema → Extract common fields to `@shared/profileSchema.ts`

---

## 11. Impact Assessment Matrix

### 11.1 High-Risk Changes (Must Not Break)

| Area | Why Critical | Test Method |
|------|--------------|-------------|
| Profile save | User data persistence | Submit form, verify database |
| Document upload | Required for employment | Upload file, verify storage |
| Invitation accept/decline | Company linking | Accept, verify companyId set |
| Leave company | Employment termination | Leave, verify companyId null |
| Translation support | User experience | Test all 3 languages |
| Form validation | Data integrity | Submit invalid data, verify errors |

### 11.2 Medium-Risk Changes

| Area | Impact | Mitigation |
|------|--------|------------|
| Tab navigation | UX confusion | Visual regression testing |
| Date formatting | Display issues | Compare before/after |
| Masking functions | Data exposure | Security review |
| Query cache | Stale data | Test invalidation chains |

### 11.3 Low-Risk Changes

| Area | Impact |
|------|--------|
| Specialty selection | Minor feature |
| Referral code | Optional feature |
| Feature requests | Admin feature |
| Performance metrics | Read-only display |

---

## 12. Pre-Refactoring Checklist

Before starting any refactoring work:

- [ ] Create database backup
- [ ] Screenshot all tabs in view mode (EN/ES/FR)
- [ ] Screenshot all tabs in edit mode (EN/ES/FR)
- [ ] Document current API payloads (use browser DevTools)
- [ ] List all form field default values
- [ ] Note any existing LSP errors to distinguish from new ones
- [ ] Create feature flag for gradual rollout
- [ ] Set up rollback procedure

---

## 13. Recommended Refactoring Order

Based on dependency analysis, refactor in this order to minimize risk:

1. **Extract shared utilities first** (formatters, InfoItem) - Zero risk
2. **Create EditableField component** - No integration changes
3. **Refactor Driver tab** (TechnicianPortal) - Fewest dependencies
4. **Refactor Personal Information tab** - Most common, well-understood
5. **Refactor Payroll tab** - Sensitive data, needs careful testing
6. **Refactor Certifications tab** - Complex, many sub-features
7. **Refactor Documents tab** - Most complex, file uploads
8. **Apply same pattern to GroundCrewPortal** - Simpler, lessons learned

---

## 14. Success Criteria

The refactoring is complete when:

1. All form fields appear in both view and edit modes
2. All API calls function identically (same payloads)
3. All query cache invalidations work correctly
4. All 3 languages display correctly
5. All document uploads work
6. All date fields format correctly
7. Zero new LSP errors introduced
8. File size reduced by at least 30%
9. No user-reported regressions for 1 week after deployment

---

## 15. References

- `instructions/portal-dual-tree-refactor-v1.0.md` - Problem analysis and plan
- `instructions/1. GUIDING_PRINCIPLES.md` - Development philosophy
- `instructions/3. DEPENDENCY-AWARENESS-INSTRUCTIONS.md` - Dependency guidelines
- `shared/schema.ts` - Database schema (lines 58-180 for users table)
- `server/routes.ts` - API endpoint implementations

---

**Document Status**: COMPLETE - Ready for refactoring phase
**Next Step**: Review with stakeholder, then begin Phase 1 (Extract shared utilities)
