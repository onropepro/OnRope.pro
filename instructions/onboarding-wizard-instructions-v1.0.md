# Onboarding Wizard Instructions v1.0
**System**: Rope Access Management System  
**Domain**: User Experience / First Impressions  
**Version**: 1.0  
**Last Updated**: January 1, 2026  
**Status**: PRODUCTION-READY  
**Safety Critical**: No (but trust-critical - first impression determines user retention)

---

## Purpose and Goal

### Primary Objective
Reduce decision paralysis for new users by guiding them through the essential first steps of system setup using real, existing functionality. The onboarding wizard teaches users how the software works by having them actually use it - not through tutorials or documentation.

### Key Goals
- **First Impression Excellence**: Zero tolerance for errors. Any bug during onboarding instantly destroys trust.
- **Decision Paralysis Reduction**: Break overwhelming system setup into digestible, sequential steps.
- **Learning by Doing**: Each step uses existing system functions (add client, add employee, add project).
- **Confidence Building**: Users complete onboarding knowing exactly how to perform core operations.
- **Skip-Friendly**: Users who prefer self-exploration can skip at any point without penalty.

### Success Criteria
1. User completes onboarding without encountering any errors
2. User understands how to add clients, employees, and projects
3. User feels confident navigating the system independently
4. Onboarding can be skipped without affecting account functionality

---

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ONBOARDING WIZARD FLOW                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────┐   ┌─────────┐   ┌────────┐   ┌──────────┐   ┌────────┐│
│  │ Welcome │ → │ Company │ → │ Client │ → │ Employee │ → │Project ││
│  └─────────┘   └─────────┘   └────────┘   └──────────┘   └────────┘│
│       │             │             │             │             │     │
│       ↓             ↓             ↓             ↓             ↓     │
│   Overview    PATCH /api/   POST /api/   POST /api/    POST /api/  │
│   of steps    company/      clients     employees or   projects    │
│               profile                   technicians/               │
│                                         :id/link                   │
│                                                                     │
│  ┌──────────┐                                                      │
│  │ Complete │ ← POST /api/onboarding/complete                      │
│  └──────────┘                                                      │
│                                                                     │
│  [Skip Available at Any Step] → POST /api/onboarding/skip          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow
1. **Input Stage**: User enters data in step-specific forms
2. **Validation Stage**: Zod schema validates form data client-side
3. **Submission Stage**: React Query mutation sends to API
4. **API Processing**: Server validates, processes, and persists
5. **Success Stage**: Cache invalidated, step advances
6. **Error Stage**: Toast notification, form state preserved

### Component Location
- **Primary Component**: `client/src/components/OnboardingWizard.tsx`
- **API Routes**: `server/routes.ts` (see specific endpoints below)
- **Schemas**: Defined inline in OnboardingWizard.tsx, matches `shared/schema.ts`

### Integration Points
- **Upstream Systems**: 
  - Authentication (user must be logged in with valid session)
  - Stripe Checkout (payment must complete before onboarding begins)
  - User record (hasCompletedOnboarding flag)
- **Downstream Systems**:
  - Clients table (creates first client record)
  - Users table (creates employee or links technician)
  - Projects table (creates first project)
  - technicianEmployerConnections table (for PLUS technician linking)
- **Parallel Systems**:
  - Dashboard (waits for onboarding completion flag)
  - Subscription management (not dependent on onboarding)

---

## Step-by-Step Implementation

### Step 1: Welcome
**Purpose**: Introduce user to onboarding, set expectations, provide skip option

**UI Elements**:
- Overview cards showing upcoming steps
- "Get Started" button → advances to Company step
- "I'll explore on my own" button → calls skip mutation

**No API calls** - purely informational

**Test IDs**:
- `button-start-onboarding`
- `button-skip-onboarding`

---

### Step 2: Company Profile
**Purpose**: Confirm/update company name and timezone

**Validation Schema**:
```typescript
const companySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  timezone: z.string().min(1, "Please select a timezone"),
});
```

**API Endpoint**: `PATCH /api/company/profile`

**Request Body**:
```json
{
  "companyName": "Acme Rope Access Ltd.",
  "timezone": "America/Vancouver"
}
```

**Success Flow**:
1. Mutation succeeds
2. Invalidate `/api/user` cache
3. Advance to Client step

**Error Flow**:
1. Display destructive toast: "Failed to update company info"
2. Stay on current step
3. Form state preserved for retry

**Test IDs**:
- `input-company-name`
- `select-timezone`
- `button-save-company`

---

### Step 3: Add First Client
**Purpose**: Teach user how to add a client (property manager/building owner)

**Validation Schema**:
```typescript
const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});
```

**API Endpoint**: `POST /api/clients`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "company": "ABC Property Management",
  "email": "john@example.com"
}
```

**Critical State Management**:
```typescript
// Store created client ID for project step
setCreatedClientId(data.id);
```

**Success Flow**:
1. Mutation succeeds, receives client ID
2. Store `createdClientId` in component state
3. Invalidate `/api/clients` cache
4. Advance to Employee step

**Error Flow**:
1. Display destructive toast: "Failed to create client"
2. Stay on current step
3. Form values preserved

**Skip Behavior**:
- User can skip this step
- `createdClientId` remains null
- Project step will be constrained (see Step 5)

**Form Reset Pattern**:
```typescript
useEffect(() => {
  if (currentStep === "client") {
    clientForm.reset({
      firstName: "",
      lastName: "",
      company: "",
      phoneNumber: "",
      email: "",
    });
  }
}, [currentStep]);
```

**Test IDs**:
- `input-client-first-name`
- `input-client-last-name`
- `input-client-company`
- `input-client-email`
- `button-save-client`
- `button-skip-client`

---

### Step 4: Add First Team Member
**Purpose**: Teach user how to add employees (most complex step with 3 sub-modes)

**Sub-Mode Architecture**:
```typescript
type EmployeeMode = "select" | "search" | "create";
type SearchType = "irata" | "sprat" | "email";
```

#### Mode A: Select (Initial View)
Shows two options:
1. **Search for Existing** → switches to "search" mode
2. **Create New Account** → switches to "create" mode

#### Mode B: Search Existing Technician
**Purpose**: Find and link technicians who already have platform accounts

**API Endpoint**: `GET /api/technicians/search`

**Query Parameters**:
- `searchType`: "irata" | "sprat" | "email"
- `searchValue`: license number or email

**Response**:
```json
{
  "found": true,
  "technician": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "irataLevel": 3,
    "hasPlusAccess": false,
    "isAlreadyLinked": false
  }
}
```

**Link Technician Flow**:
**API Endpoint**: `POST /api/technicians/:id/link`

**Request Body**:
```json
{
  "hourlyRate": 0,
  "isSalary": false
}
```

**CRITICAL: Two Linking Paths**

1. **Unlinked Technician** (no `companyId`):
   - Sets technician's `companyId` directly on users table
   - Becomes primary employer

2. **PLUS Technician** (already has `companyId` + `hasPlusAccess`):
   - Creates record in `technicianEmployerConnections` table
   - Allows multi-employer linking

```typescript
// Server-side logic (routes.ts)
if (technician.companyId) {
  if (!technician.hasPlusAccess) {
    return res.status(400).json({ 
      message: "This technician needs PLUS to connect with multiple employers." 
    });
  }
  // Insert into technicianEmployerConnections
  await db.insert(technicianEmployerConnections).values({
    technicianId,
    companyId,
    isPrimary: false,
    status: "active",
  });
} else {
  // Set as primary company
  await storage.updateUser(technicianId, { companyId });
}
```

#### Mode C: Create New Account
**Purpose**: Create a new employee account with temporary password

**Validation Schema**:
```typescript
const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  role: z.enum(["supervisor", "rope_access_tech", "ground_crew"]),
});
```

**API Endpoint**: `POST /api/employees`

**Request Body**:
```json
{
  "name": "John Technician",
  "email": "john@company.com",
  "role": "rope_access_tech",
  "isTempPassword": true
}
```

**Error Handling - Duplicate Email**:
```typescript
onError: (error: any) => {
  const message = error?.message || "Failed to create employee";
  if (message.includes("email") || message.includes("already")) {
    toast({
      description: "An account with this email already exists. Try searching instead.",
      variant: "destructive",
    });
    setEmployeeMode("select"); // Reset to mode selection
  }
}
```

**State Reset on Step Entry**:
```typescript
useEffect(() => {
  if (currentStep === "employee") {
    setEmployeeMode("select");
    setSearchType("email");
    setSearchValue("");
    setFoundTechnician(null);
    setSearchMessage(null);
  }
}, [currentStep]);
```

**Test IDs**:
- `button-search-existing`
- `button-create-new`
- `input-technician-search`
- `button-search-technician`
- `button-link-technician`
- `input-employee-name`
- `input-employee-email`
- `select-employee-role`
- `button-save-employee`

---

### Step 5: Create First Project
**Purpose**: Teach user how to create a project

**Validation Schema**:
```typescript
const projectSchema = z.object({
  strataPlanNumber: z.string().optional(),
  buildingAddress: z.string().min(1, "Building address is required"),
  jobType: z.string().min(1, "Please select a job type"),
});
```

**API Endpoint**: `POST /api/projects`

**Request Body**:
```json
{
  "strataPlanNumber": "LMS 1234",
  "buildingAddress": "123 Main Street, Vancouver BC",
  "jobType": "window_cleaning",
  "clientId": "created-client-uuid",
  "jobCategory": "building_maintenance"
}
```

**CRITICAL: Client Dependency**
```typescript
const canCreateProject = !!createdClientId;
```

If user skipped client step (`canCreateProject` is false):
- Project creation form is **NOT shown**
- Alternative UI displayed with message: "Projects require a client"
- "Finish Setup" button offered instead → calls `completeOnboardingMutation`
- User can create projects later from dashboard after adding a client

If client was created (`canCreateProject` is true):
- Project form displayed normally
- `clientId` is passed to API from stored `createdClientId`

**Success Flow** (when project is created):
1. Mutation succeeds
2. Invalidate `/api/projects` cache
3. Automatically trigger `completeOnboardingMutation`

**Test IDs**:
- `input-strata-number`
- `input-building-address`
- `select-job-type`
- `button-save-project`

---

### Step 6: Complete
**Purpose**: Celebrate success, transition to main dashboard

**API Endpoints**:
- `POST /api/onboarding/complete` - Sets `hasCompletedOnboarding: true`
- `POST /api/onboarding/skip` - Same effect, different user intent

**Success Actions**:
1. Invalidate `/api/user` cache
2. Display completion confirmation
3. "Go to Dashboard" button closes wizard
4. User flag updated to prevent wizard re-appearing

---

## Dependency Impact & Invariants

### Non-Negotiable Invariants

1. **First Impression Reliability**
   - Zero tolerance for errors during onboarding
   - All API calls must have proper error handling
   - Toast notifications must be descriptive and actionable

2. **Form State Preservation**
   - On error, form values MUST NOT be cleared
   - User should be able to retry without re-entering data

3. **Skip Compatibility**
   - Skipping must not break any system functionality
   - All features must work for users who skipped onboarding

4. **Multi-Employer Linking Integrity**
   - Standard technicians: single `companyId` on users table
   - PLUS technicians: `technicianEmployerConnections` table
   - Never confuse these two patterns

### System Dependencies
- **Authentication**: User must be logged in with valid session
- **Company Record**: User's company must exist before onboarding
- **Subscription**: Not required - onboarding works on all tiers
- **Multi-tenant**: All data created scoped to user's company

---

## Safety & Compliance

### Safety-Critical Elements
This feature is **not safety-critical** in the traditional rope access sense. However, it is **trust-critical**:

| Element | Why It Matters | Failure Mode | Mitigation |
|---------|---------------|--------------|------------|
| Error-free experience | First impression determines user retention | User encounters bug, loses trust | Comprehensive error handling, form state preservation |
| Data persistence | User's first data must save reliably | Data lost, user must re-enter | Proper API validation, database transactions |
| Skip functionality | User choice respected | Skip fails, user trapped | Multiple skip points, POST /api/onboarding/skip |

### Compliance Requirements
- **Onboarding flag**: `hasCompletedOnboarding` stored on user record
- **Audit trail**: Standard database logging applies to all created records
- **No safety documentation**: This wizard does not create any safety-critical documents

---

## Field Worker Experience

### Desktop/Web Focus
The onboarding wizard is designed for **desktop/web browser experience**, not mobile field use:

- **When Used**: Immediately after payment/registration, typically at office
- **Device**: Desktop or laptop browser (not optimized for gloves/field conditions)
- **Network**: Assumes stable internet connection
- **Touch**: Not optimized for touch - uses standard form inputs

### Mobile Considerations (Future)
If onboarding is adapted for mobile:
1. Increase touch target sizes
2. Simplify forms (fewer fields per step)
3. Add offline queue for data submission
4. Test with network interruptions

---

## Technical Implementation Patterns

### Accessibility Requirements (CRITICAL)

Radix Dialog components REQUIRE hidden accessibility elements to prevent focus trap interference with form inputs:

```tsx
<Dialog open={open}>
  <DialogContent>
    <DialogHeader>
      <VisuallyHidden>
        <DialogTitle>Onboarding Wizard</DialogTitle>
        <DialogDescription>
          Step-by-step guide to set up your account
        </DialogDescription>
      </VisuallyHidden>
      {/* Visible content */}
    </DialogHeader>
  </DialogContent>
</Dialog>
```

**Why This Matters**:
- Without VisuallyHidden title/description, Radix focus management can interfere with form input focus
- Users may be unable to type in text fields
- This was a critical bug fix - do not remove

### Form State Management

**Pattern: Reset on Step Entry**
```typescript
useEffect(() => {
  if (currentStep === "client") {
    clientForm.reset({ /* default values */ });
  }
}, [currentStep]);
```

**Why**: Prevents browser autofill contamination between steps

**Pattern: Stable Form Attributes**
```tsx
// WRONG - breaks React reconciliation
<Input name={`company-${Math.random()}`} />

// CORRECT - stable name attribute
<Input 
  autoComplete="off" 
  data-1p-ignore="true" 
  data-lpignore="true" 
/>
```

### React Query Integration

**Mutation with Cache Invalidation**:
```typescript
const createClientMutation = useMutation({
  mutationFn: async (data) => {
    const response = await apiRequest("POST", "/api/clients", data);
    return response.json();
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
    setCreatedClientId(data.id);
    setCurrentStep("employee");
  },
  onError: () => {
    toast({ variant: "destructive", description: "Error message" });
  },
});
```

### Progress Tracking
```typescript
const STEPS: Step[] = ["welcome", "company", "client", "employee", "project", "complete"];
const stepIndex = STEPS.indexOf(currentStep);
const progress = (stepIndex / (STEPS.length - 1)) * 100;
```

---

## Multi-Tenant Considerations

### Data Isolation
- All created records (clients, employees, projects) automatically inherit user's `companyId`
- No cross-company access possible during onboarding
- Each employer account has isolated onboarding experience

### Query Patterns
All API endpoints enforce company scoping:
```typescript
// Server-side - routes.ts
const clients = await storage.getClientsByCompany(req.user.companyId);
```

---

## Error Handling & Recovery

### Common Errors

| Error | Cause | User Message | Recovery Action |
|-------|-------|--------------|-----------------|
| Company update fails | Network/server issue | "Failed to update company info" | Retry, stay on step |
| Client creation fails | Validation/server issue | "Failed to create client" | Retry, form preserved |
| Duplicate email | Employee already exists | "Account with this email exists. Try searching." | Switch to search mode |
| Technician link fails (no PLUS) | Tech already linked, no PLUS access | "Technician needs PLUS for multiple employers" | Search for different tech |
| Project creation fails | Server/validation issue | "Failed to create project" | Retry, form preserved |

### Graceful Degradation
- **Network Timeout**: Toast error, preserve form state
- **Session Expired**: Redirect to login (handled by auth middleware)
- **Invalid Form Data**: Client-side Zod validation catches before submit

---

## Testing Requirements

### Happy Path Test Matrix

| Test | Steps | Expected Outcome |
|------|-------|------------------|
| Complete full flow | Welcome → Company → Client → Employee (create) → Project → Complete | User flag updated, dashboard accessible |
| Skip entire onboarding | Welcome → "I'll explore on my own" | User flag updated, dashboard accessible |
| Skip individual steps | Complete some, skip others | Each completed step persists data |
| Search and link technician | Employee step → Search → Find → Link | Technician connected to company |
| Create new employee | Employee step → Create → Submit | New user created with temp password |

### Error Scenario Tests

| Test | Trigger | Expected Behavior |
|------|---------|-------------------|
| Duplicate email on create | Enter existing email | Toast + reset to mode selection |
| Link non-PLUS multi-employer | Try to link already-employed tech | 400 error, descriptive message |
| Invalid form submission | Submit with required fields empty | Client-side validation prevents submit |
| Network failure | Disconnect during mutation | Error toast, form state preserved |

### Accessibility Tests
- Tab navigation through all form fields
- Screen reader announces step progress
- Focus management on step transitions
- Form errors announced to assistive tech

---

## Role-Specific Onboarding Deltas

### Adapting for Other Account Types

This employer onboarding serves as the canonical template. When building onboarding for other roles, use this delta checklist:

#### Technician Onboarding
| Step | Keep/Modify/Remove | Changes |
|------|-------------------|---------|
| Welcome | Modify | Different step preview (certifications, profile) |
| Company | Remove | Technicians don't own companies |
| Profile | Add | Name, phone, certifications (IRATA/SPRAT) |
| Certifications | Add | License numbers, levels, expiry dates |
| Employer Link | Add | Search for employer by code |
| Complete | Keep | Same completion pattern |

#### Property Manager Onboarding
| Step | Keep/Modify/Remove | Changes |
|------|-------------------|---------|
| Welcome | Modify | PM-specific value proposition |
| Profile | Add | Name, contact info |
| Link Vendors | Add | Enter propertyManagerCode from companies |
| Buildings | Add | Add strata numbers for data access |
| Complete | Keep | Same completion pattern |

#### Resident Onboarding
| Step | Keep/Modify/Remove | Changes |
|------|-------------------|---------|
| Welcome | Modify | Resident-specific messaging |
| Profile | Add | Name, unit number |
| Link Building | Add | Enter residentCode from project |
| Complete | Keep | Same completion pattern |

#### Building Manager Onboarding
| Step | Keep/Modify/Remove | Changes |
|------|-------------------|---------|
| Welcome | Modify | Building manager messaging |
| Profile | Add | Name, buildings managed |
| Link Companies | Add | Connect to rope access companies |
| Complete | Keep | Same completion pattern |

### Reusable Patterns Across All Roles
1. Step-based navigation with progress indicator
2. Zod schema validation per step
3. React Query mutations with cache invalidation
4. Toast-based error/success feedback
5. Skip option at any point
6. Form reset on step entry
7. Accessibility patterns (VisuallyHidden)

---

## Monitoring & Maintenance

### Key Metrics
- **Completion Rate**: % of users who complete full onboarding (target: >80%)
- **Skip Rate**: % who skip entirely (monitor for UX issues)
- **Step Drop-off**: Which step has highest abandonment
- **Error Rate**: API errors during onboarding (target: <1%)
- **Time to Complete**: Average minutes to finish (target: <5 min)

### Alerting Thresholds
- Error rate >5% → Immediate investigation
- Completion rate <50% → UX review needed
- Average time >10 minutes → Simplification needed

### Regular Maintenance
- **Weekly**: Review error logs for onboarding endpoints
- **Monthly**: Analyze completion/skip metrics
- **Quarterly**: User feedback review for UX improvements

---

## Troubleshooting Guide

### Issue: User Cannot Type in Form Fields
**Symptoms**: Clicking in input doesn't allow typing, focus seems trapped
**Diagnosis**:
1. Check if VisuallyHidden DialogTitle/Description present
2. Verify no dynamic `name` attributes on inputs
3. Check for z-index issues with overlays

**Solution**:
```tsx
<DialogHeader>
  <VisuallyHidden>
    <DialogTitle>Title</DialogTitle>
    <DialogDescription>Description</DialogDescription>
  </VisuallyHidden>
</DialogHeader>
```

### Issue: Technician Link Returns 500
**Symptoms**: "Internal server error" when linking technician
**Diagnosis**:
1. Check server logs for specific error
2. Verify technicianEmployerConnections table exists
3. Check if technician has `hasPlusAccess` flag

**Solution**: Ensure PLUS technician linking uses correct table:
```typescript
await db.insert(technicianEmployerConnections).values({ ... });
```

### Issue: Form Submits with Wrong Values
**Symptoms**: Submitted data doesn't match what user entered
**Diagnosis**:
1. Check for browser autofill interference
2. Verify form reset on step entry
3. Check for controlled/uncontrolled input mixing

**Solution**: Reset form state when entering step:
```typescript
useEffect(() => {
  if (currentStep === "client") {
    clientForm.reset({ ...defaultValues });
  }
}, [currentStep]);
```

### Issue: Skip Button Doesn't Close Wizard
**Symptoms**: Clicking skip shows loading but nothing happens
**Diagnosis**:
1. Check skipOnboardingMutation success handler
2. Verify `/api/onboarding/skip` endpoint exists
3. Check for unhandled promise rejections

**Solution**: Ensure mutation calls `onClose()`:
```typescript
const skipOnboardingMutation = useMutation({
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    onClose();
  },
});
```

---

## Related Documentation
- `1. GUIDING_PRINCIPLES.md` - "It Just Works" principle
- `2. INSTRUCTION_DOCUMENT_CREATION_GUIDE.md` - Template for this document
- `3. DEPENDENCY-AWARENESS-INSTRUCTIONS.md` - System integration considerations
- `employee-management-instructions.md` - Full employee creation details
- `client-management-instructions.md` - Client CRM integration

---

## Version History
- **v1.0** (January 1, 2026): Initial comprehensive documentation
  - Documented 6-step employer onboarding flow
  - Captured all API endpoints and validation schemas
  - Documented accessibility patterns (VisuallyHidden fix)
  - Created role-specific delta checklist for future onboarding implementations
  - Added testing matrix and troubleshooting guide
