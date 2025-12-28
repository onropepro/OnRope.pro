# Portal Refactoring: Production-Grade Implementation Guide

**Version**: 2.0  
**Created**: December 28, 2024  
**Status**: CRITICAL PRODUCTION REFACTOR  
**Review Required**: Yes - Stakeholder sign-off before each phase  

---

## 1. FIRST PRINCIPLES: PROBLEM DEFINITION

### 1.1 What Are We Solving?

**The Core Problem**: TechnicianPortal.tsx (6,777 lines) and GroundCrewPortal.tsx (2,419 lines) use a **dual JSX tree architecture** where view mode and edit mode are implemented as completely separate code branches.

**Why This Is Dangerous**:
1. Fields added to edit mode may be forgotten in view mode (and vice versa)
2. Separation of 1000+ lines between matching sections
3. No compile-time or runtime enforcement of parity
4. Silent failures - bugs only discovered when users report missing data

**Recent Incident**: Medical Conditions field was in edit mode on Personal Information tab, but appeared on Certifications tab in view mode.

### 1.2 Current Architecture (DUAL-TREE)

```
Line 3954:  {isEditing ? (
              <Form {...form}>
                {/* EDIT MODE - Personal Tab: Lines 3958-4207 */}
                {/* EDIT MODE - Payroll Tab:  Lines 4210-4273 */}
                {/* EDIT MODE - Driver Tab:   Lines 4276-4324 */}
                {/* EDIT MODE - Certs Tab:    Lines 4327-4394 */}
                {/* EDIT MODE - Docs Tab:     Lines 4397-4401 */}
              </Form>
            ) : (
              <>
                {/* VIEW MODE - Personal Tab: Lines 4407-4460 (~450 lines gap) */}
                {/* VIEW MODE - Certs Tab:    Lines 4463-5270 (~1000 lines gap) */}
                {/* VIEW MODE - Personal 2:   Lines 5273-5287 */}
                {/* VIEW MODE - Payroll Tab:  Lines 5290-5330 (~1000 lines gap) */}
                {/* VIEW MODE - Driver Tab:   Lines 5333-5484 (~1000 lines gap) */}
                {/* VIEW MODE - Payroll 2:    Lines 5487-5587 */}
                {/* VIEW MODE - Certs Tab:    Lines 5590-5713 */}
                {/* VIEW MODE - Docs Tab:     Lines 5716-5731 (~1300 lines gap) */}
              </>
            )}
```

### 1.3 Target Architecture (UNIFIED INLINE)

```tsx
<TabsContent value="personal">
  <EditableField
    isEditing={isEditing}
    name="email"
    label={t.email}
    value={user.email}
    control={form.control}
    icon={<Mail />}
  />
  {/* One component = guaranteed parity */}
</TabsContent>
```

---

## 2. MEASURABLE SUCCESS CRITERIA

### 2.1 Quantified Baselines (CURRENT STATE - Verified December 28, 2024)

| Metric | Current Value | Measurement Method | Verified By |
|--------|---------------|-------------------|-------------|
| TechnicianPortal.tsx lines | 6,777 | `wc -l` | CLI |
| GroundCrewPortal.tsx lines | 2,419 | `wc -l` | CLI |
| Total portal lines | 9,196 | `wc -l` | CLI |
| `isEditing ?` conditionals | 7 (Tech), 3 (GC) | `grep -c "isEditing \?"` | CLI |
| FormField components | 24 (Tech), 24 (GC) | `grep -c "FormField"` | CLI |
| InfoItem usages | 16 (Tech), varies (GC) | `grep -c "InfoItem"` | CLI |
| Dual TabsContent blocks | 14 (Tech) | `grep -c "TabsContent"` | CLI |
| LSP errors (pre-existing) | **7 (Tech), 0 (GC)** | LSP diagnostics | LSP Tool |
| Translation keys | ~280 (Tech), ~180 (GC) | Manual count | Code review |

**Pre-Existing LSP Errors (TechnicianPortal.tsx)**:
| Line | Error Type | Description |
|------|------------|-------------|
| 2510 | Missing translation | `t.ocrSuccess` does not exist |
| 2511 | Missing translation | `t.ocrFieldsAutofilled` does not exist |
| 2557 | Missing translation | `t.ocrSuccess` does not exist |
| 2558 | Missing translation | `t.ocrBankFieldsAutofilled` does not exist |
| 4417 | Type mismatch | `Type 'Element' is not assignable to type 'string'` |
| 5800 | Missing translation | `t.loading` does not exist (should be `t.uploading`) |
| 6465 | Missing property | `certifications` on line 6465 |

**Note**: These 7 pre-existing errors MUST be fixed during refactoring. Post-refactor target is 0 errors.

### 2.2 Historical Defect & Velocity Baselines

**Historical Field Synchronization Bugs** (Q4 2024):
| Date | Issue | Severity | Resolution Time |
|------|-------|----------|-----------------|
| Dec 2024 | Medical Conditions in wrong tab (view mode) | Medium | 2 hours |
| Dec 2024 | SMS toggle missing from view mode | Low | Not yet fixed |
| Ongoing | Emergency contact 1000+ line gap | Risk | N/A (no bug yet) |
| Ongoing | 7 LSP errors from translation mismatches | Medium | Documented |

**Current Defect Rate**: ~1-2 field sync issues per month  
**Target Defect Rate**: 0 field sync issues (90% reduction = 0 issues)  
**Measurement Method**: GitHub issues tagged `portal-sync-bug`  
**Measurement Owner**: Development Team Lead  
**Tracking Cadence**: Weekly review during standup  

**Current Development Velocity** (Q4 2024):
| Task Type | Current Time | Notes |
|-----------|--------------|-------|
| Add new field to portal | 2-4 hours | Must update 2 locations |
| Fix field sync bug | 1-2 hours | Finding matching code is hard |
| Add translation key | 30-60 min | Must add to 3 languages x 2 trees |

**Target Development Velocity**:
| Task Type | Target Time | Improvement |
|-----------|-------------|-------------|
| Add new field | 30-60 min | Single EditableField component |
| Fix field sync bug | N/A | No sync bugs possible |
| Add translation key | 15-30 min | Single location per field |

**Measurement Method**: Time tracking on similar tasks (before/after comparison)  
**Measurement Owner**: Developer completing task  
**Tracking Cadence**: Per-task logging for first 4 weeks post-refactor  

### 2.3 Target Metrics (POST-REFACTOR)

| Metric | Target Value | Acceptance Threshold | Verification Artifact |
|--------|--------------|---------------------|----------------------|
| TechnicianPortal.tsx lines | ≤3,400 (50% reduction) | 4,000 max | `wc -l` output |
| GroundCrewPortal.tsx lines | ≤1,200 (50% reduction) | 1,500 max | `wc -l` output |
| `isEditing ?` conditionals | 0-2 (inside EditableField) | 3 max | `grep` output |
| Dual TabsContent blocks | 0 (all unified) | 0 required | Code review |
| LSP errors | 0 | 0 required | LSP diagnostics screenshot |
| Field sync bugs | 0 | 0 required | 30-day defect log |
| Translation parity | 100% | 100% required | `npm run check:translations` output |

### 2.4 Operational Metrics (PRODUCTION)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Error rate post-deploy | <0.1% | Server logs |
| User-reported field bugs | 0 | Support tickets |
| API payload changes | 0 | Contract tests |
| Uptime during rollout | 99.9% | Monitoring |

---

## 3. COMPLETE FIELD MAPPING

### 3.1 TechnicianPortal: Personal Information Tab

| Field Name | Form Schema | Database Column | Edit Mode Line | View Mode Line | Gap |
|------------|-------------|-----------------|----------------|----------------|-----|
| name | `name` | `users.name` | 3965-3976 | (header) | N/A |
| email | `email` | `users.email` | 3978-3989 | 4415 | 426 |
| employeePhoneNumber | `employeePhoneNumber` | `users.employee_phone_number` | 3991-4003 | 4416 | 413 |
| smsNotificationsEnabled | `smsNotificationsEnabled` | `users.sms_notifications_enabled` | 4004-4026 | (not shown view) | MISSING |
| birthday | `birthday` | `users.birthday` | 4027-4039 | 4417 | 378 |
| employeeStreetAddress | `employeeStreetAddress` | `users.employee_street_address` | 4059-4083 | 4437-4442 | 354 |
| employeeCity | `employeeCity` | `users.employee_city` | 4085-4097 | 4440 | 343 |
| employeeProvinceState | `employeeProvinceState` | `users.employee_province_state` | 4098-4110 | 4440 | 330 |
| employeeCountry | `employeeCountry` | `users.employee_country` | 4111-4123 | 4441 | 318 |
| employeePostalCode | `employeePostalCode` | `users.employee_postal_code` | 4124-4136 | 4440 | 304 |
| emergencyContactName | `emergencyContactName` | `users.emergency_contact_name` | 4148-4159 | 5281 | 1122 |
| emergencyContactPhone | `emergencyContactPhone` | `users.emergency_contact_phone` | 4161-4172 | 5282 | 1110 |
| emergencyContactRelationship | `emergencyContactRelationship` | `users.emergency_contact_relationship` | 4174-4204 | 5283 | 1079 |

**GAPS IDENTIFIED**:
- `smsNotificationsEnabled`: Shown in edit mode, NOT shown in view mode
- Emergency contact fields: 1000+ line gap between edit and view

### 3.2 TechnicianPortal: Payroll Tab

| Field Name | Form Schema | Database Column | Edit Mode Line | View Mode Line | Gap |
|------------|-------------|-----------------|----------------|----------------|-----|
| socialInsuranceNumber | `socialInsuranceNumber` | `users.social_insurance_number` | 4217-4228 | 5298 | 1070 |
| bankTransitNumber | `bankTransitNumber` | `users.bank_transit_number` | 4232-4243 | 5301 | 1058 |
| bankInstitutionNumber | `bankInstitutionNumber` | `users.bank_institution_number` | 4245-4256 | 5302 | 1046 |
| bankAccountNumber | `bankAccountNumber` | `users.bank_account_number` | 4258-4269 | 5303 | 1034 |

### 3.3 TechnicianPortal: Driver Tab

| Field Name | Form Schema | Database Column | Edit Mode Line | View Mode Line | Gap |
|------------|-------------|-----------------|----------------|----------------|-----|
| driversLicenseNumber | `driversLicenseNumber` | `users.drivers_license_number` | 4283-4294 | 5343 | 1049 |
| driversLicenseIssuedDate | `driversLicenseIssuedDate` | `users.drivers_license_issued_date` | 4296-4307 | 5346 | 1039 |
| driversLicenseExpiry | `driversLicenseExpiry` | `users.drivers_license_expiry` | 4309-4320 | 5352 | 1032 |

### 3.4 TechnicianPortal: Certifications Tab

| Field Name | Form Schema | Database Column | Edit Mode Line | View Mode Line | Gap |
|------------|-------------|-----------------|----------------|----------------|-----|
| irataBaselineHours | `irataBaselineHours` | `users.irata_baseline_hours` | 4333-4347 | 4612 | 265 |
| ropeAccessStartDate | `ropeAccessStartDate` | `users.rope_access_start_date` | 4350-4372 | (complex view) | - |
| specialMedicalConditions | `specialMedicalConditions` | `users.special_medical_conditions` | 4375-4392 | 4447-4456 | 55 |
| firstAidType | `firstAidType` | `users.first_aid_type` | (separate UI) | 5156 | - |
| firstAidExpiry | `firstAidExpiry` | `users.first_aid_expiry` | (separate UI) | 5157 | - |
| ropeAccessSpecialties | `ropeAccessSpecialties` | `users.rope_access_specialties` | 5600-5680 | 5590-5713 | inline |

### 3.5 GroundCrewPortal Field Mapping

| Field Name | Shared with Tech? | Notes |
|------------|-------------------|-------|
| name | YES | Identical |
| email | YES | Identical |
| employeePhoneNumber | YES | Identical |
| smsNotificationsEnabled | YES | Identical |
| birthday | YES | Identical |
| employeeStreetAddress | YES | Identical |
| employeeCity | YES | Identical |
| employeeProvinceState | YES | Identical |
| employeeCountry | YES | Identical |
| employeePostalCode | YES | Identical |
| emergencyContactName | YES | Identical |
| emergencyContactPhone | YES | Identical |
| emergencyContactRelationship | YES | Identical |
| socialInsuranceNumber | YES | Identical |
| bankTransitNumber | YES | Identical |
| bankInstitutionNumber | YES | Identical |
| bankAccountNumber | YES | Identical |
| driversLicenseNumber | YES | Identical |
| driversLicenseIssuedDate | YES | Identical |
| driversLicenseExpiry | YES | Identical |
| specialMedicalConditions | YES | Identical |
| firstAidType | YES | Identical |
| firstAidExpiry | YES | Identical |

**MISSING from GroundCrewPortal** (Tech-only fields):
- irataBaselineHours, irataLevel, irataLicenseNumber, irataExpirationDate, irataIssuedDate
- spratLevel, spratLicenseNumber, spratExpirationDate, spratIssuedDate
- ropeAccessStartDate, ropeAccessSpecialties
- technicianReferralCode, isPlusMember

---

## 4. EDGE CASES & SPECIAL HANDLING

### 4.1 Translation Fallback Behavior

| Scenario | Current Behavior | Required Behavior |
|----------|------------------|-------------------|
| Missing translation key | Crashes or shows key | Show English fallback |
| Empty string translation | Shows empty | Show English fallback |
| Nested object key (relationshipOptions) | Works | Must preserve structure |
| Dynamic key interpolation | `{count}` works | Must preserve |

**Implementation**:
```typescript
const getTranslation = (key: string, fallback: string): string => {
  return t[key] ?? translations.en[key] ?? fallback;
};
```

### 4.2 Date Field Edge Cases

| Scenario | Current Behavior | Required Behavior |
|----------|------------------|-------------------|
| null date | Shows "N/A" or empty | Show `t.notProvided` |
| Invalid date string | Crashes | Show `t.notProvided` |
| Timezone handling | Uses local | Use project timezone |
| Date input format | HTML date input | Maintain existing |

### 4.3 Masked Data Display

| Field | Masking Rule | Example |
|-------|--------------|---------|
| socialInsuranceNumber | Show last 4 | `xxx-xxx-1234` |
| bankAccountNumber | Show last 4 | `xxxxxxxx5678` |
| bankTransitNumber | Show last 4 | `x2345` |
| bankInstitutionNumber | Show all (short) | `001` |

### 4.4 Conditional Field Display

| Field | Condition for Display | Both Modes? |
|-------|----------------------|-------------|
| specialMedicalConditions | Only if has value | YES |
| irataVerifiedAt badge | Only if verified | VIEW only |
| SMS notifications toggle | Always | EDIT only currently - MUST ADD to view |
| Compensation display | Only if linked to company | VIEW only |

### 4.5 Document Upload Edge Cases

| Scenario | Current Behavior | Required Behavior |
|----------|------------------|-------------------|
| Upload in progress | Shows loader | Maintain |
| Upload failure | Toast error | Maintain + retry button |
| OCR auto-fill | Fills form fields | Preserve exact field mappings |
| Delete confirmation | Shows dialog | Maintain |
| Multiple documents | Array handling | Preserve order |

---

## 5. ROLLBACK PROCEDURES

### 5.1 Rollback Triggers

| Trigger | Threshold | Action |
|---------|-----------|--------|
| API error rate increase | >1% | Immediate rollback |
| User-reported data loss | >0 | Immediate rollback |
| Form submission failures | >0.5% | Immediate rollback |
| Translation missing | >0 visible | Rollback + hotfix |

### 5.2 Rollback Steps

```bash
# 1. Identify the problematic commit
git log --oneline -10

# 2. Revert to last known good state
git revert <commit-hash>

# 3. Verify no data corruption
SELECT COUNT(*) FROM users WHERE role IN ('rope_access_tech', 'ground_crew');

# 4. Restart application
npm run dev

# 5. Verify user access
# Test login and profile view for 3 test accounts
```

### 5.3 Data Recovery

If data corruption occurs:
1. Replit provides automatic checkpoint rollback
2. Database backup available in Neon dashboard
3. Object storage files are immutable (documents safe)

---

## 6. FEATURE FLAG STRATEGY

### 6.1 Implementation

```typescript
// server/featureFlags.ts
export const FEATURE_FLAGS = {
  UNIFIED_PROFILE_COMPONENTS: {
    enabled: false,
    rolloutPercentage: 0, // 0-100
    allowlist: ['test@example.com'], // Always enabled for these users
  }
};

// Usage in TechnicianPortal.tsx
const useNewProfileComponents = useMemo(() => {
  if (FEATURE_FLAGS.UNIFIED_PROFILE_COMPONENTS.allowlist.includes(user?.email)) {
    return true;
  }
  if (!FEATURE_FLAGS.UNIFIED_PROFILE_COMPONENTS.enabled) {
    return false;
  }
  // Percentage rollout based on user ID hash
  return hashCode(user?.id) % 100 < FEATURE_FLAGS.UNIFIED_PROFILE_COMPONENTS.rolloutPercentage;
}, [user]);
```

### 6.2 Rollout Schedule

| Phase | Flag State | Duration | Criteria to Advance |
|-------|------------|----------|---------------------|
| Development | allowlist only | 1-2 days | All tests pass |
| Internal QA | 10% rollout | 2-3 days | Zero errors |
| Limited Production | 25% rollout | 3-5 days | Zero user complaints |
| Wider Production | 50% rollout | 3-5 days | Zero regressions |
| Full Production | 100% rollout | - | Stable for 7 days |
| Cleanup | Remove flag | - | Remove old code |

---

## 7. COMPREHENSIVE TEST MATRIX

### 7.1 Functional Tests (Manual)

| Test Case | Steps | Expected Result | Priority |
|-----------|-------|-----------------|----------|
| View profile (EN) | Login → Portal → View all tabs | All fields display correctly | P0 |
| View profile (ES) | Change language → View all tabs | All text in Spanish | P0 |
| View profile (FR) | Change language → View all tabs | All text in French | P0 |
| Edit profile | Click Edit → Modify name → Save | Name updates in DB | P0 |
| Cancel edit | Click Edit → Modify → Cancel | No changes saved | P0 |
| Validation error | Clear required field → Save | Error message shows | P0 |
| Phone format | Enter invalid phone → Blur | Validation error shows | P1 |
| Address autocomplete | Type address → Select | All address fields fill | P1 |
| Emergency contact | Update all 3 fields → Save | All fields persist | P0 |
| Bank info masked | View payroll tab | Last 4 digits visible | P0 |
| SIN masked | View payroll tab | Last 4 digits visible | P0 |
| Document upload | Upload PDF → Wait | File appears in list | P0 |
| Document delete | Click delete → Confirm | File removed | P0 |
| OCR driver license | Upload license image | Fields auto-fill | P1 |
| OCR void cheque | Upload cheque image | Bank fields auto-fill | P1 |
| IRATA verification | Upload screenshot | Verification badge shows | P1 |
| Leave company | Click leave → Confirm | Company ID cleared | P0 |
| Accept invitation | Click accept | Company ID set | P0 |
| Decline invitation | Click decline | Invitation removed | P1 |

### 7.2 API Contract Tests

| Endpoint | Method | Test | Expected |
|----------|--------|------|----------|
| `/api/technician/profile` | PATCH | Send all fields | 200 + updated user |
| `/api/technician/profile` | PATCH | Send partial fields | 200 + only those updated |
| `/api/technician/profile` | PATCH | Invalid phone format | 400 + error message |
| `/api/technician/expiration-date` | PATCH | Valid date | 200 + date updated |
| `/api/technician/document` | DELETE | Valid doc | 200 + doc removed |
| `/api/technician/upload-document` | POST | Valid PDF | 200 + URL returned |

### 7.3 Regression Tests

| Test | Description | Automated? |
|------|-------------|------------|
| Form payload shape | Compare before/after JSON | YES - snapshot |
| Query cache invalidation | All keys invalidated correctly | YES - mock |
| Translation completeness | All keys exist in all languages | YES - script |
| TypeScript compilation | Zero errors | YES - tsc |
| LSP diagnostics | Zero errors | YES - CI check |

---

## 8. IMPLEMENTATION PHASES

### Phase 1: Foundation (Days 1-2)

**Objective**: Create reusable components without touching existing code.

**Deliverables**:
1. `client/src/components/profile/EditableField.tsx`
2. `client/src/components/profile/EditableSection.tsx`
3. `client/src/components/profile/EditableSelect.tsx`
4. `client/src/components/profile/EditableSwitch.tsx`
5. `client/src/components/profile/EditableTextarea.tsx`
6. `client/src/components/profile/EditableDateField.tsx`
7. `client/src/components/profile/EditableAddressField.tsx`
8. `client/src/components/profile/index.ts` (barrel export)
9. Unit tests for each component

**Exit Criteria**:
| Criteria | Evidence Required | Sign-off |
|----------|-------------------|----------|
| All components render correctly | Screenshot of Storybook/test page | Dev |
| TypeScript strict mode passes | `tsc --noEmit` output (0 errors) | CI |
| No dependencies on portal code | Import analysis | Dev |
| Supports all field types | Test coverage report | Dev |

**Required Artifacts**:
- [ ] `/tests/profile/` directory with unit tests
- [ ] LSP diagnostics: 0 errors in new components

### Phase 2: Driver Tab (Day 3)

**Objective**: Refactor simplest tab first to validate approach.

**Deliverables**:
1. Replace dual-tree in Driver tab with EditableField components
2. Verify view mode displays correctly
3. Verify edit mode works correctly
4. Verify form submission unchanged

**Exit Criteria**:
| Criteria | Evidence Required | Sign-off |
|----------|-------------------|----------|
| Line count reduced by 50%+ | `wc -l` before/after | Dev |
| All 3 driver fields work | Manual test in EN/ES/FR | QA |
| API payload unchanged | JSON diff (before/after) | Dev |
| All 3 languages correct | Screenshots | QA |

**Required Artifacts**:
- [ ] Before/after screenshots (view mode, edit mode) x 3 languages
- [ ] API payload snapshot comparison
- [ ] LSP diagnostics: 0 new errors

### Phase 3: Personal Information Tab (Days 4-5)

**Objective**: Refactor most-used tab with careful attention to detail.

**Deliverables**:
1. Replace dual-tree for all Personal Information fields
2. Add SMS notifications toggle to VIEW mode (currently missing!)
3. Ensure address autocomplete integration works
4. Verify emergency contact fields

**Exit Criteria**:
| Criteria | Evidence Required | Sign-off |
|----------|-------------------|----------|
| Line count reduced by 50%+ | `wc -l` before/after | Dev |
| All 13 fields work both modes | Checklist per field | QA |
| Address autocomplete works | Video/GIF of flow | QA |
| Emergency contact correct | Manual test | QA |
| SMS toggle in view mode | Screenshot | QA |

**Required Artifacts**:
- [ ] Field-by-field checklist (13 fields x 2 modes x 3 languages)
- [ ] API payload snapshot comparison
- [ ] LSP diagnostics: 0 new errors

### Phase 4: Payroll Tab (Day 6)

**Objective**: Refactor sensitive financial information fields.

**Deliverables**:
1. Replace dual-tree for all Payroll fields
2. Ensure masking works correctly in view mode
3. Verify OCR auto-fill still works
4. Test void cheque upload flow

**Exit Criteria**:
| Criteria | Evidence Required | Sign-off |
|----------|-------------------|----------|
| Line count reduced by 50%+ | `wc -l` before/after | Dev |
| All 4 banking fields masked | Screenshot showing `xxxx1234` | QA |
| All 4 banking fields editable | Manual save test | QA |
| OCR auto-fill works | Video/GIF of upload flow | QA |

**Required Artifacts**:
- [ ] Masking verification screenshot
- [ ] OCR flow recording
- [ ] API payload snapshot comparison

### Phase 5: Certifications Tab (Days 7-8)

**Objective**: Refactor most complex tab with many sub-features.

**Deliverables**:
1. Replace dual-tree for certification fields
2. Preserve IRATA/SPRAT verification workflows
3. Preserve specialty selection logic
4. Preserve baseline hours editing

**Exit Criteria**:
| Criteria | Evidence Required | Sign-off |
|----------|-------------------|----------|
| Line count reduced by 40%+ | `wc -l` before/after | Dev |
| IRATA verification works | Test with screenshot upload | QA |
| SPRAT verification works | Test with screenshot upload | QA |
| Specialty add/remove works | Video/GIF | QA |
| Medical conditions correct tab | Screenshot | QA |

**Required Artifacts**:
- [ ] IRATA/SPRAT verification test recordings
- [ ] Specialty selection test recording
- [ ] Medical conditions placement verification

### Phase 6: Documents Tab (Day 9)

**Objective**: Refactor file upload/management tab.

**Deliverables**:
1. Preserve existing upload functionality
2. Preserve delete confirmation flow
3. Maintain existing document display

**Exit Criteria**:
| Criteria | Evidence Required | Sign-off |
|----------|-------------------|----------|
| All doc types uploadable | Test each type | QA |
| All doc types deletable | Test each type | QA |
| Preview/download works | Manual test | QA |

**Required Artifacts**:
- [ ] Upload/delete test for each document type
- [ ] Object storage verification

### Phase 7: GroundCrewPortal (Days 10-11)

**Objective**: Apply same pattern to simpler portal.

**Deliverables**:
1. Replace dual-tree in GroundCrewPortal
2. Reuse components from TechnicianPortal

**Exit Criteria**:
| Criteria | Evidence Required | Sign-off |
|----------|-------------------|----------|
| Line count ≤1,200 | `wc -l` output | Dev |
| All shared fields work | Checklist per field | QA |
| All 3 languages work | Screenshots | QA |
| API payload unchanged | JSON diff | Dev |

**Required Artifacts**:
- [ ] Before/after line count
- [ ] Field-by-field checklist (22 fields x 2 modes x 3 languages)
- [ ] LSP diagnostics: 0 errors

### Phase 8: Hardening (Day 12)

**Objective**: Add safeguards and documentation.

**Deliverables**:
1. Translation completeness check script (`npm run check:translations`)
2. API contract snapshot tests (`npm run test:contracts`)
3. Updated documentation (replit.md, instructions/)
4. Feature flag removal (if 100% stable for 48 hours)

**Exit Criteria**:
| Criteria | Evidence Required | Sign-off |
|----------|-------------------|----------|
| All tests pass | CI pipeline green | CI |
| Zero LSP errors | LSP diagnostics screenshot | Dev |
| Translation check passes | `npm run check:translations` output | CI |
| API contracts pass | `npm run test:contracts` output | CI |
| Documentation updated | PR review | Tech Lead |
| 30-day defect log empty | GitHub issues search | QA |

**Required Artifacts**:
- [ ] CI pipeline logs (all green)
- [ ] Translation check script output
- [ ] API contract test output
- [ ] Updated replit.md with refactoring notes
- [ ] Stakeholder sign-off document

### Phase 9: KPI Validation (Days 13-14)

**Objective**: Validate that business KPIs are met.

**Exit Criteria**:
| KPI | Baseline | Target | Measurement Method | Status |
|-----|----------|--------|-------------------|--------|
| Field sync bugs | 1-2/month | 0/month | 30-day defect log | Pending |
| New field dev time | 2-4 hours | 30-60 min | Time tracking on next feature | Pending |
| Code lines | 9,196 | ≤4,600 | `wc -l` | Pending |
| LSP errors | 7 | 0 | LSP diagnostics | Pending |
| Translation parity | Incomplete | 100% | `npm run check:translations` | Pending |

**Required Artifacts**:
- [ ] KPI comparison report (before/after)
- [ ] Time tracking data for 2+ new field additions
- [ ] 30-day defect log (must be empty)
- [ ] Final stakeholder approval

---

## 9. OPERATIONAL SAFEGUARDS

### 9.1 Pre-Deployment Checklist

- [ ] Database backup created
- [ ] Feature flag configured for gradual rollout
- [ ] Monitoring dashboards updated
- [ ] Alert thresholds set
- [ ] Rollback procedure tested
- [ ] Support team briefed
- [ ] Stakeholder approval obtained

### 9.2 Post-Deployment Monitoring

| Metric | Normal Range | Alert Threshold | Critical Threshold | Action |
|--------|--------------|-----------------|-------------------|--------|
| API response time (p95) | <200ms | >500ms | >1000ms | Investigate / Rollback |
| Error rate (4xx/5xx) | <0.1% | >0.5% | >1% | Investigate / Rollback |
| Form submission success | >99.5% | <99% | <98% | Investigate / Rollback |
| User session duration | Baseline | >20% drop | >40% drop | Investigate / Rollback |
| Profile save failures | 0 | >0 per hour | >3 per hour | Rollback immediately |
| Translation missing errors | 0 | >0 | >0 | Hotfix required |

**Alert Configuration**:
- **PagerDuty/Slack**: Profile save failures, Translation errors → Immediate
- **Email**: Error rate >0.5% → Within 15 minutes
- **Dashboard**: All metrics → Real-time visualization

**Measurement Owner**: Development Team Lead
**Verification Method**: Server logs + Replit monitoring dashboard

### 9.3 Automated Validation (99.9% Uptime Guarantee)

| Validation | Frequency | Pass Criteria | Failure Action |
|------------|-----------|---------------|----------------|
| Health check endpoint | Every 30s | 200 response | Alert + auto-restart |
| Form field parity check | On deploy | All fields present | Block deploy |
| Translation completeness | On build | All keys in all languages | Block build |
| TypeScript compilation | On build | 0 errors | Block build |
| API contract test | On deploy | All payloads match | Block deploy |

**Automation Scripts Required**:
```bash
# Translation completeness check
npm run check:translations  # Must pass before deploy

# Form field parity check
npm run check:field-parity  # Compares schema to rendered fields

# API contract snapshot
npm run test:contracts      # Compares payload snapshots
```

### 9.3 Stakeholder Communication

| Phase | Communication | Audience |
|-------|--------------|----------|
| Before Phase 1 | Refactor plan review | Tech lead |
| After Phase 2 | Demo of new pattern | Tech lead |
| Before Phase 7 | Full functionality demo | Product owner |
| After Phase 8 | Release notes | All stakeholders |

---

## 10. ANTI-PATTERNS TO AVOID

### 10.1 During Refactoring

| Anti-Pattern | Why Bad | Correct Approach |
|--------------|---------|------------------|
| Adding fields to old dual-tree | Increases debt | Use new components only |
| Changing API payloads | Breaks backend | Exact payload preservation |
| Skipping translations | User confusion | All 3 languages required |
| Large commits | Hard to rollback | One tab per commit |
| Skipping tests | Hidden regressions | Test after each phase |

### 10.2 In New Components

| Anti-Pattern | Why Bad | Correct Approach |
|--------------|---------|------------------|
| Separate view/edit components | Recreates problem | Single EditableField |
| Using `any` types | Loses type safety | Strict types required |
| Hardcoded strings | Breaks i18n | Always use `t.key` |
| Inline styles | Inconsistent UI | Use Tailwind classes |

---

## 11. APPROVAL GATES

### 11.1 Phase Completion Approval

Each phase requires:
1. All exit criteria met (checkboxes)
2. Screenshot comparison (before/after)
3. API payload diff (should be empty)
4. LSP diagnostics (zero errors)
5. Manual QA in all 3 languages

### 11.2 Production Deployment Approval

Final deployment requires:
1. All phases complete
2. Feature flag at 100% for 48 hours minimum
3. Zero user-reported issues
4. Stakeholder sign-off
5. Rollback procedure verified

---

## 12. REFERENCES

| Document | Purpose |
|----------|---------|
| `instructions/portal-dependency-analysis-v1.0.md` | API/Query inventory |
| `instructions/1. GUIDING_PRINCIPLES.md` | Development philosophy |
| `instructions/3. DEPENDENCY-AWARENESS-INSTRUCTIONS.md` | System dependencies |
| `shared/schema.ts` lines 58-180 | User database schema |
| `server/routes.ts` | API implementations |

---

**Document Status**: COMPREHENSIVE - Ready for stakeholder review  
**Estimated Total Effort**: 12 development days  
**Risk Level**: MEDIUM (with safeguards) → LOW (after Phase 2 validation)  
**Proceed Only With**: Explicit stakeholder approval per phase
