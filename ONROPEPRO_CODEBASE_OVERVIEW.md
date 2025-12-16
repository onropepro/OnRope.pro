# OnRopePro: Comprehensive Codebase Analysis

## Document Purpose

This document provides a complete technical and functional overview of the OnRopePro platform, intended to serve as foundational training material for AI agents working with this codebase. It covers architecture, modules, data models, user roles, module interactions, and page structures.

### Implementation Status Note

This document describes the **full system design** based on the database schema (`shared/schema.ts`), API routes (`server/routes.ts`), and marketing pages. When working with this codebase, be aware that:

- **Schema-defined features**: Tables and fields in `shared/schema.ts` represent the data model. Most have corresponding API routes in `server/routes.ts` and are functional.
- **Landing/Guide pages**: Files like `*Landing.tsx` and `*Guide.tsx` are marketing/documentation pages that describe module capabilities. These are static content pages, not the operational UI for those features.
- **Operational pages**: The actual functional UI lives in pages like `Dashboard.tsx`, `ProjectDetail.tsx`, `SafetyForms.tsx`, `Schedule.tsx`, `Payroll.tsx`, `GearInventory.tsx`, etc.
- **Feature parity**: Not all documented features may have full UI implementation. Always verify by checking the corresponding page component and API routes.

When implementing new features, cross-reference:
1. Schema definition in `shared/schema.ts`
2. API routes in `server/routes.ts`
3. Operational UI pages in `client/src/pages/`

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Target Users and Stakeholders](#target-users-and-stakeholders)
3. [Technical Architecture](#technical-architecture)
4. [User Roles and Permissions](#user-roles-and-permissions)
5. [Core Modules](#core-modules)
6. [Module Interactions and Data Flow](#module-interactions-and-data-flow)
7. [Page Structure: Landing Pages vs Guide Pages](#page-structure-landing-pages-vs-guide-pages)
8. [Database Schema Overview](#database-schema-overview)
9. [External Integrations](#external-integrations)
10. [Development Conventions](#development-conventions)
11. [Key Design Patterns](#key-design-patterns)

---

## Platform Overview

### What is OnRopePro?

OnRopePro is an enterprise-grade, mobile-first SaaS platform designed specifically for **rope access companies** that perform high-rise building maintenance services. The platform centralizes and optimizes:

- Project management for building maintenance jobs
- Workforce tracking and time logging
- Safety compliance documentation
- Financial operations (quoting, payroll, subscriptions)
- Client and stakeholder communication
- Equipment inventory management

### Industry Context: Rope Access

Rope access is an industrial trade where certified technicians use ropes, harnesses, and specialized equipment to perform work at height on buildings, structures, and infrastructure. Common services include:

- **Window Cleaning** - High-rise window washing using drops (vertical descents)
- **Building Wash/Pressure Washing** - Exterior facade cleaning
- **Dryer Vent Cleaning** - Commercial building vent maintenance
- **Inspections** - Structural and anchor point inspections
- **Painting** - Exterior painting at height
- **Gutter Cleaning** - Roof gutter maintenance

Technicians hold certifications from bodies like **IRATA** (Industrial Rope Access Trade Association) or **SPRAT** (Society of Professional Rope Access Technicians), with levels 1-3 indicating experience and capability.

### Key Terminology

| Term | Definition |
|------|------------|
| **Drop** | A single vertical descent down a building face. Projects track drops per elevation (N/E/S/W). |
| **Elevation** | One face of a building (North, East, South, West). Progress is tracked per elevation. |
| **Strata Plan Number** | Canadian building identification number, used as unique building identifier. |
| **Toolbox Meeting** | Pre-work safety briefing held at job sites. |
| **FLHA** | Field Level Hazard Assessment - pre-work hazard identification form. |
| **Harness Inspection** | Daily pre-work equipment safety check. |
| **Peace Work** | Payment model where technicians are paid per drop rather than hourly. |
| **CSR** | Company Safety Rating - penalty-based compliance score visible to clients. |

---

## Target Users and Stakeholders

OnRopePro serves multiple distinct user groups, each with different access levels and needs:

### Primary Users

1. **Company Owners** (role: `company`)
   - Full platform access
   - Manage employees, projects, clients, finances
   - Configure company settings, subscriptions, branding
   - View all analytics and reports

2. **Operations Managers** (role: `operations_manager`)
   - Manage day-to-day operations
   - Assign employees to projects
   - Approve time-off requests
   - View scheduling and workforce data

3. **Supervisors** (role: `supervisor`)
   - Oversee specific crews or projects
   - Access safety documentation
   - View assigned project details

4. **Rope Access Technicians** (role: `rope_access_tech`)
   - Clock in/out of work sessions
   - Log drops completed and IRATA tasks
   - Submit safety forms (harness inspections, FLHAs)
   - View personal schedule and certifications
   - Access Technician Portal for independent profile management

5. **Ground Crew** (role: `ground_crew`)
   - Support personnel not performing rope work
   - Time tracking without drop logging

6. **Manager** (role: `manager`)
   - Mid-level management role
   - Access based on assigned permissions
   - Can be granted view/manage access to projects, employees, schedules

7. **Ground Crew Supervisor** (role: `ground_crew_supervisor`)
   - Oversees ground crew personnel
   - Time tracking and crew coordination
   - Access to ground-level work assignments

### Secondary Users (External Stakeholders)

8. **Building Managers** (role: `building` - separate login via strata number)
   - View service history for their building
   - Manage building access instructions
   - View anchor documentation and safety records

9. **Property Managers** (role: `property_manager`)
   - Multi-building portfolio view
   - Link to multiple rope access companies via codes
   - View vendor safety ratings and project progress

10. **Residents** (role: `resident`)
   - Link to buildings via resident codes
   - Submit complaints/feedback
   - View project notices and photo galleries

### Administrative

11. **SuperUser** (special role, not in users table)
   - Platform-wide administration
   - Manage all companies and buildings
   - View global metrics (MRR, customer health)
   - Manage job board, feature requests, tasks
   - "View as Company" impersonation mode

---

## Technical Architecture

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Wouter (routing), TanStack Query v5 |
| **Styling** | Tailwind CSS, Shadcn UI, custom glass-morphism effects |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (Neon-backed via Replit) |
| **ORM** | Drizzle ORM with drizzle-zod for validation |
| **Authentication** | Custom session-based with secure HTTP-only cookies |
| **File Storage** | Replit Object Storage |
| **Payment Processing** | Stripe (subscriptions, add-ons, license keys) |
| **Mapping** | Leaflet with Geoapify geocoding |
| **AI Integration** | Google Gemini (COI expiry date extraction) |

### Directory Structure

```
/
├── client/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # Shadcn UI primitives
│   │   │   ├── PublicHeader.tsx # Marketing site header with mega menus
│   │   │   └── ChangelogGuideLayout.tsx # Documentation page wrapper
│   │   ├── pages/               # Route-based page components
│   │   │   ├── *Landing.tsx     # Module marketing/landing pages
│   │   │   ├── *Guide.tsx       # Feature documentation/changelog pages
│   │   │   ├── Dashboard.tsx    # Main company dashboard
│   │   │   └── TechnicianPortal.tsx # Technician self-service portal
│   │   ├── lib/                 # Utilities (queryClient, dateUtils)
│   │   └── hooks/               # Custom React hooks
│   └── index.html
├── server/
│   ├── routes.ts                # All API endpoints
│   ├── storage.ts               # Database operations interface
│   ├── vite.ts                  # Vite dev server setup
│   └── timezoneUtils.ts         # Timezone handling utilities
├── shared/
│   └── schema.ts                # Drizzle schema + Zod validation
└── design_guidelines.md         # UI/UX design specifications
```

### Multi-Tenant Architecture

The platform uses a multi-tenant model where:

- Each company is a top-level tenant
- Employees belong to a company via `companyId` foreign key
- Projects, clients, equipment are scoped to companies
- API routes enforce tenant isolation via session checks
- SuperUser can access all tenants for administration

### Timezone Handling

Critical for payroll accuracy, the platform implements full timezone support:

- Companies set timezone in profile (default: `America/Vancouver`)
- Projects can override company timezone
- Hierarchy: Project timezone → Company timezone → Default
- Key utilities: `getProjectTimezone()`, `getZonedDayBounds()`, `sessionOverlapsDay()`
- All date operations use timezone-safe utilities to prevent off-by-one-day bugs

---

## User Roles and Permissions

### Role Hierarchy

```
SuperUser (platform admin)
    └── Company (company owner)
            ├── Operations Manager
            ├── Supervisor
            ├── Manager
            ├── Rope Access Tech
            ├── Ground Crew
            └── Ground Crew Supervisor
```

### Permission System

Employees have granular permissions stored as an array in the `permissions` field:

| Permission | Description |
|------------|-------------|
| `view_all_projects` | See all company projects |
| `manage_projects` | Create/edit/delete projects |
| `manage_employees` | Add/edit employees |
| `view_financial` | See costs, rates, quotes |
| `view_safety_documents` | Access safety documentation |
| `view_analytics` | Access analytics dashboards |
| `view_schedule` | See scheduling calendar |
| `manage_schedule` | Create/edit assignments |
| `approve_time_off` | Approve/deny time-off requests |

### External User Access

| User Type | Access Method |
|-----------|---------------|
| Building Managers | Login via strata plan number + password |
| Property Managers | Register account, link via company's `propertyManagerCode` |
| Residents | Register account, link via company's `residentCode` |

---

## Core Modules

### 1. Project Management

**Purpose:** Create and manage building maintenance jobs from quote to completion.

**Key Tables:** `projects`, `projectAssignments`, `dropLogs`

**Features:**
- 10 specialized job types (window cleaning, dryer vent, building wash, etc.)
- Custom job types supported
- Progress tracking by elevation (N/E/S/W drops)
- Multiple progress tracking methods (drops, hours, suites, stalls)
- Document uploads (rope access plans, anchor certificates)
- Status workflow: scheduled → in_progress → completed
- Resident notice generation and photo galleries

**Data Model:**
```
projects
├── companyId → users (company)
├── buildingName, strataPlanNumber, buildingAddress
├── jobType (window_cleaning | dryer_vent_cleaning | building_wash | ...)
├── totalDropsNorth/East/South/West (target drops)
├── dropsAdjustmentNorth/East/South/West (corrections)
├── dailyDropTarget
├── startDate, endDate, status
├── ropeAccessPlanUrl, anchorInspectionCertificateUrl
└── timezone (optional override)
```

### 2. Work Session Tracking (Time & Attendance)

**Purpose:** Real-time clock-in/out with GPS, drop logging, and payroll calculation.

**Key Tables:** `workSessions`, `dropLogs`, `irataTaskLogs`

**Features:**
- GPS-tracked clock in/out
- Drop counts per elevation per session
- Automatic overtime/double-time calculation
- Shortfall reason tracking (when targets not met)
- Valid shortfall reasons don't impact performance scores
- Peace work payment calculation (pay = drops × rate)
- Labor cost tracking for project analytics

**Clock-In/Out Flow:**
1. Technician selects project
2. System captures GPS coordinates
3. Session starts with `startTime`
4. During session: log drops per elevation
5. Clock out: capture end GPS, prompt for IRATA task logging
6. System calculates regular/overtime/double-time hours

**Shortfall Reasons:**
When drops < daily target, technicians must provide a reason. Valid reasons include:
- Weather (high wind, rain, snow, lightning)
- Site access issues (exclusion zone occupied, roof occupied)
- Building malfunctions (elevator down, power outage)
- Safety concerns, equipment failure, client requested stop

### 3. IRATA Task Logging

**Purpose:** Track specific rope access tasks for IRATA certification logbook compliance.

**Key Tables:** `irataTaskLogs`

**Features:**
- 20 canonical task types (rope transfer, ascending, descending, rigging, rescue, etc.)
- Linked to work sessions
- Building height captured for logbook
- Hours worked per task
- Exportable for certification applications

**Task Types:**
- Rope Transfer, Re-Anchor, Ascending, Descending
- Rigging, Deviation, Aid Climbing, Edge Transition
- Knot Passing, Rope to Rope Transfer, Mid-Rope Changeover
- Rescue Technique, Hauling, Lowering, Tensioned Rope Work
- Horizontal Traverse, Window Cleaning, Building Inspection
- Maintenance Work, Other

### 4. Safety & Compliance

**Purpose:** Digitize all safety documentation with professional PDF export.

**Key Tables:** `toolboxMeetings`, `harnessInspections`, `flhaForms`, `incidentReports`

#### 4.1 Toolbox Meetings
- Daily pre-work safety briefings
- 20 standard safety topics (fall protection, anchor points, PPE, etc.)
- Attendee tracking
- Digital signatures
- PDF generation and storage

#### 4.2 Harness Inspections
- Daily pre-work equipment checks
- Structured equipment findings (JSONB)
- Pass/fail status
- Personal vs company inspections
- Linked to optional project

#### 4.3 FLHA Forms (Field Level Hazard Assessment)
- Pre-work hazard identification
- 12 rope-access-specific hazards
- 10 control measures
- Risk level before/after controls
- Digital signatures
- PDF export

#### 4.4 Incident Reports
- Comprehensive incident documentation
- Classification: injury, near miss, property damage, equipment failure
- Severity levels: minor → fatal
- Affected person details
- Root cause analysis
- Corrective actions
- Witness statements
- Photo attachments
- Supervisor and management reviews

### 5. Scheduling & Calendar

**Purpose:** Visual crew scheduling with conflict prevention.

**Key Tables:** `projects`, `projectAssignments`, `timeOffRequests`

**Features:**
- Dual calendar system (Project view + Resource Timeline)
- Drag-and-drop assignment
- Automatic conflict detection
- Time-off integration (10 leave types)
- Permission-based schedule visibility

**Conflict Detection:**
Before any assignment, system checks:
- Existing project assignments
- Approved time-off
- Date overlaps

### 6. Employee Management

**Purpose:** Manage workforce profiles, certifications, and compensation.

**Key Tables:** `users`, `employeeInvitations`

**Features:**
- Employee profiles with photos
- Certification tracking (IRATA, SPRAT, First Aid)
- Expiration alerts (60-day yellow, 30-day red badges)
- Hourly rate or salary compensation
- Permission assignment
- Suspension/termination handling
- Email invitations with temp passwords

### 7. Equipment Inventory

**Purpose:** Track gear assignments, inspections, and damage.

**Key Tables:** `gearItems`, `gearSerialNumbers`, `equipmentDamageReports`, `equipmentCatalog`

**Features:**
- Per-employee gear inventory
- Serial number tracking
- In-service/out-of-service status
- Damage reporting workflow
- Shared equipment catalog (pre-populated + custom items)
- Pre-populated descender models (Petzl, CMC, Rock Exotica, etc.)

### 8. Client Relationship Management (CRM)

**Purpose:** Manage clients and buildings with quote-to-project workflows.

**Key Tables:** `clients`, `buildings`, `buildingInstructions`

**Features:**
- Client contact management
- Building database with autofill
- Global building database (SuperUser managed)
- Building access instructions
- Service history tracking
- Map-based building search

### 9. Quoting System

**Purpose:** Generate service quotes with labor cost calculations.

**Key Tables:** `quotes`, `quoteServices`

**Features:**
- Multi-service quotes
- Service-specific pricing (drops, hours, stalls, suites)
- Pipeline stage tracking (draft → submitted → review → won/lost)
- Photo attachments
- Tax computation
- PDF export

### 10. Financial Operations

**Purpose:** Payroll configuration, subscription management, billing.

**Key Tables:** `payPeriodConfig`, `payPeriods`, `licenseKeys`

#### Payroll
- Configurable pay periods (weekly, bi-weekly, semi-monthly, monthly)
- Overtime/double-time multipliers
- Daily or weekly overtime triggers
- Pay period generation

#### Subscriptions (Stripe Integration)
- Four tiers: Basic, Starter, Premium, Enterprise
- USD and CAD pricing
- Seat-based pricing with add-ons
- 30-day free trial
- License key generation
- White-label branding add-on

### 11. Technician Portal

**Purpose:** Independent technician profile and career management.

**Key Tables:** `users`, `resumeDocuments`, `irataTaskLogs`

**Features:**
- Self-registration with multi-step form
- Personal profile management
- Certification tracking
- Resume/CV uploads (multiple)
- Work history export
- Referral system (12-character codes)
- Job board access

### 12. Technician PLUS Access

**Purpose:** Premium tier for enhanced technician features.

**Field:** `users.hasPlusAccess`

**Features:**
- Certification expiry alerts (60-day yellow, 30-day red badges)
- Banner notifications for expiring certs
- Unlimited employer connections
- Enhanced IRATA task logging
- Exportable work history
- Profile visibility boost
- Gold "PRO" badge display

### 13. Job Board

**Purpose:** Connect technicians with employment opportunities.

**Key Tables:** `jobPostings`, `jobApplications`

**Features:**
- Company and platform-wide job postings
- Required certification filtering
- Location-based search
- Application status tracking
- Employer notes on applications
- Technician visibility opt-in (`isVisibleToEmployers`)

**Visible Profile Includes:**
- Resume, safety rating, name
- Years of experience
- IRATA/SPRAT cert numbers
- Photo, rope access specialties

### 14. Resident Portal

**Purpose:** Enable resident communication and complaint management.

**Key Tables:** `complaints`, `projectImages`

**Features:**
- Resident registration via company code
- Complaint submission
- Two-way communication
- Photo gallery viewing
- Project progress visibility
- Notification system

### 15. Building Manager Portal

**Purpose:** Building-specific access for property staff.

**Key Tables:** `buildings`, `buildingInstructions`

**Features:**
- Login via strata number
- Service history viewing
- Access instructions management
- Anchor documentation
- Vendor COI (Certificate of Insurance) viewing
- Company safety rating display

### 16. Property Manager Interface

**Purpose:** Multi-building portfolio management.

**Key Tables:** `propertyManagerCompanyLinks`

**Features:**
- Link to multiple rope access vendors
- "My Vendors" dashboard
- Read-only company information
- Safety rating comparison
- Project progress visibility

### 17. Company Safety Rating (CSR)

**Purpose:** Penalty-based compliance scoring visible to clients.

**Key Tables:** `csrRatingHistory`

**Features:**
- Starts at 100, decreases with violations
- Tracks: documentation gaps, toolbox meetings, harness inspections
- Delta tracking with categories
- Historical trend visualization
- Viewable by property managers

### 18. SuperUser Administration

**Purpose:** Platform-wide management and analytics.

**Key Pages:** `SuperUser.tsx`, `SuperUserMetrics.tsx`, `SuperUserBuildings.tsx`

**Features:**
- All companies dashboard
- License status monitoring
- MRR tracking and snapshots
- Customer health scores
- Churn event tracking
- "View as Company" impersonation
- Global building database
- Platform job board management
- Feature request tracking
- Goals and KPIs dashboard

---

## Module Interactions and Data Flow

### Project Lifecycle

```
Quote → Client → Project → Assignments → Work Sessions → Payroll
         ↓
     Building (auto-created if new strata number)
```

### Safety Documentation Flow

```
Project Created
    ↓
Daily: Toolbox Meeting → Attendees sign
    ↓
Before Work: FLHA Form → Hazards identified → Controls applied
    ↓
Before Work: Harness Inspection → Equipment checked
    ↓
Work Session: Clock in → Log drops → Clock out
    ↓
If Incident: Incident Report → Investigation → Corrective actions
    ↓
End of Project: All documents accessible for audits
```

### Time Tracking to Payroll

```
Work Session (clock in/out)
    ↓
Hours calculated (regular, OT, double-time)
    ↓
Pay Period Configuration applied
    ↓
Pay Period generated with totals
    ↓
Export for payroll processing
```

### Technician Registration Flow

```
Technician visits /technician/register
    ↓
Multi-step form: Personal → Certifications → Contact → Financial → Driving
    ↓
Account created (no company affiliation)
    ↓
Company sends invitation (or tech is visible on job board)
    ↓
Tech accepts → linked to company with employee role
    ↓
Can work on projects, clock in, log tasks
```

### Subscription Flow

```
User visits pricing page
    ↓
Selects tier → Stripe checkout
    ↓
License key generated with tier/currency
    ↓
User completes registration with license key
    ↓
Account activated with subscription tier
    ↓
Can add seats, projects, branding add-ons
```

---

## Page Structure: Landing Pages vs Guide Pages

The codebase contains two types of marketing/documentation pages:

### Landing Pages (*Landing.tsx)

**Purpose:** Module marketing pages targeting potential customers. Focus on problems solved and benefits.

**Structure:**
1. Hero section with gradient background
2. Badge identifying the module
3. Headline with emotional hook
4. Subtitle explaining the solution
5. CTA buttons (Start Trial, Contact)
6. Wave separator with floating stats card
7. Problem Statement section
8. What This Module Does section
9. Who Benefits section (stakeholder cards)
10. Key Features grid
11. Problems Solved accordion (with validated user quotes)
12. FAQ section
13. Final CTA

**Stakeholder Card Colors:**
- Company Owners: blue, Briefcase icon
- Operations Managers: sky, UserCog icon
- Technicians: amber, HardHat icon
- Building Managers: violet, Building2 icon
- Property Managers: emerald, Users icon

**Current Landing Pages:**
- `CSRLanding.tsx` - Company Safety Rating
- `DocumentManagementLanding.tsx` - Document Management
- `EmployeeManagementLanding.tsx` - Employee Management
- `EmployerJobBoardLanding.tsx` - Employer Job Board
- `GearInventoryLanding.tsx` - Equipment Inventory
- `IRATATaskLoggingLanding.tsx` - IRATA Task Logging
- `ProjectManagementLanding.tsx` - Project Management
- `SafetyComplianceLanding.tsx` - Safety & Compliance
- `SchedulingCalendarLanding.tsx` - Scheduling & Calendar
- `TechnicianJobBoardLanding.tsx` - Technician Job Board
- `TechnicianPassportLanding.tsx` - Technician Passport
- `WorkSessionLanding.tsx` - Work Session Tracking

### Guide Pages (*Guide.tsx)

**Purpose:** Internal documentation/changelog pages for existing users. Uses `ChangelogGuideLayout` wrapper.

**Structure:**
1. ChangelogGuideLayout wrapper with title/subtitle
2. Accordion-based sections
3. Problems Solved with validated user interview quotes
4. Implementation details
5. Technical specifications
6. Related features links

**Current Guide Pages:**
- `AnalyticsGuide.tsx` - Analytics features
- `BrandingGuide.tsx` - White-label branding
- `CRMGuide.tsx` - Client management
- `CSRGuide.tsx` - Company Safety Rating details
- `DocumentManagementGuide.tsx` - Document system
- `EmployeeManagementGuide.tsx` - Employee management
- `GPSGuide.tsx` - GPS tracking
- `InventoryGuide.tsx` - Equipment inventory
- `IRATALoggingGuide.tsx` - IRATA task logging details
- `JobBoardGuide.tsx` - Job board features
- `LanguageGuide.tsx` - i18n/localization
- `MobileDesignGuide.tsx` - Mobile responsiveness
- `PayrollGuide.tsx` - Payroll configuration
- `PlatformAdminGuide.tsx` - SuperUser features
- `ProjectsGuide.tsx` - Project management
- `PropertyManagerGuide.tsx` - Property manager features
- `QuotingGuide.tsx` - Quote generation
- `ResidentPortalGuide.tsx` - Resident features
- `SafetyGuide.tsx` - Safety compliance
- `SchedulingGuide.tsx` - Scheduling features
- `TechnicianRegistrationGuide.tsx` - Technician registration
- `TimeTrackingGuide.tsx` - Time tracking

---

## Database Schema Overview

### Core Tables

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `users` | All users (companies, employees, residents, etc.) | Self-referencing via `companyId` |
| `projects` | Building maintenance jobs | → `users` (company) |
| `workSessions` | Clock in/out records | → `projects`, → `users` (employee) |
| `clients` | Client contact records | → `users` (company) |
| `buildings` | Global building database | Standalone, linked via strata number |

### Safety Tables

| Table | Purpose |
|-------|---------|
| `toolboxMeetings` | Daily safety briefings |
| `harnessInspections` | Equipment inspections |
| `flhaForms` | Hazard assessments |
| `incidentReports` | Incident documentation |
| `csrRatingHistory` | Safety rating changes |

### Equipment Tables

| Table | Purpose |
|-------|---------|
| `gearItems` | Inventory items (quantity-based) |
| `gearSerialNumbers` | Individual item serial tracking |
| `equipmentDamageReports` | Damage documentation |
| `equipmentCatalog` | Shared equipment database |

### Financial Tables

| Table | Purpose |
|-------|---------|
| `quotes` | Service quotes |
| `quoteServices` | Individual services in quotes |
| `payPeriodConfig` | Company payroll settings |
| `payPeriods` | Generated pay periods |
| `licenseKeys` | Subscription license keys |

### Job Board Tables

| Table | Purpose |
|-------|---------|
| `jobPostings` | Employment opportunities |
| `jobApplications` | Technician applications |

### SuperUser Tables

| Table | Purpose |
|-------|---------|
| `mrrSnapshots` | Daily revenue metrics |
| `customerHealthScores` | Churn risk assessment |
| `churnEvents` | Cancellation records |
| `superuserTasks` | Admin task tracking |
| `featureRequests` | Feature request management |

---

## External Integrations

### Stripe
- Subscription billing
- Checkout sessions
- Webhook handling
- Price IDs per tier/currency
- Add-on management (seats, projects, branding)

### Replit Object Storage
- Document uploads (PDFs)
- Image uploads (project photos, logos)
- Resume/CV storage
- Safety form PDFs

### Geoapify
- Address autocomplete
- Geocoding for building coordinates
- Map-based building search

### Google Gemini
- AI-powered COI expiry date extraction
- Automatic date parsing from uploaded insurance documents

### Leaflet
- Interactive map displays
- Building location visualization
- Geographic filtering

---

## Development Conventions

This section documents mandatory conventions for AI agents and developers working in this codebase.

### data-testid Requirements

All interactive elements MUST have `data-testid` attributes for testing:

```jsx
// Interactive elements: {action}-{target}
<Button data-testid="button-submit">Submit</Button>
<Input data-testid="input-email" />
<Link data-testid="link-profile" />

// Display elements: {type}-{content}
<span data-testid="text-username">{user.name}</span>
<Badge data-testid="status-payment">{status}</Badge>

// Dynamic elements: {type}-{description}-{id}
<Card data-testid={`card-product-${productId}`} />
<tr data-testid={`row-user-${index}`} />
```

### design_guidelines.md Compliance

The `design_guidelines.md` file in the repository root contains strict UI/UX rules. Key requirements:

1. **Never use emojis** - Not in UI, not in test data, never
2. **Minimum font size** - Body text must be `text-base` (16px) or larger, never `text-sm` for paragraphs
3. **No em-dashes** - Use regular dashes or rephrase content
4. **Paragraph splitting** - Multi-sentence descriptions should be split into separate `<p>` tags
5. **Button sizing** - Never manually set height/padding on `<Button>` components, use size variants
6. **Hover states** - Never implement custom hover states on `<Button>` or `<Badge>`, use built-in elevation utilities

### Frontend Technology Requirements

| Requirement | Pattern |
|-------------|---------|
| **Routing** | Use `wouter` - `Link` component, `useLocation` hook |
| **Forms** | Use `react-hook-form` with Shadcn's `Form` component |
| **Data fetching** | Use `@tanstack/react-query` v5 (object form only) |
| **Mutations** | Use `apiRequest` from `@lib/queryClient`, invalidate cache after |
| **Icons** | Use `lucide-react` for actions, `react-icons/si` for company logos |
| **Components** | Use Shadcn UI from `@/components/ui/` |

### Query Pattern

```typescript
// Correct - object form, no queryFn (uses default fetcher)
const { data, isLoading } = useQuery({
  queryKey: ['/api/projects', projectId],
});

// Mutations with cache invalidation
const mutation = useMutation({
  mutationFn: async (data) => apiRequest('/api/projects', { method: 'POST', body: data }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/projects'] }),
});
```

### Stakeholder Color Palette

When creating stakeholder-specific UI elements, use these consistent color mappings:

| Stakeholder | Color | Icon |
|-------------|-------|------|
| Company Owners | `blue-*` | `Briefcase` |
| Operations Managers | `sky-*` | `UserCog` |
| Technicians | `amber-*` | `HardHat` |
| Building Managers | `violet-*` | `Building2` |
| Property Managers | `emerald-*` | `Users` |

### Landing Page Structure (canonical pattern)

Landing pages follow the structure in `UserAccessLanding.tsx`:

1. Hero section with gradient background (`bg-[#0B64A3]`)
2. Badge identifying the module
3. Headline with emotional hook
4. `text-blue-100` emphasis line
5. Subtitle paragraphs (separate `<p>` tags, not `<br/>`)
6. CTA buttons with `data-testid`
7. Wave separator (`z-10`) with floating stats card (`-mt-20 z-20`)
8. Content sections with `max-w-4xl mx-auto` or `max-w-5xl mx-auto`

### Guide Page Structure (ChangelogGuideLayout)

Guide pages use the `ChangelogGuideLayout` wrapper component with accordion sections:

```jsx
<ChangelogGuideLayout title="Feature Name" subtitle="Description">
  <Accordion type="multiple">
    <AccordionItem value="section-1" data-testid="accordion-section-1">
      <AccordionTrigger className="text-left font-medium">
        Section Title
      </AccordionTrigger>
      <AccordionContent>
        {/* Content with Pain → Real Example → Solution → Benefit structure */}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</ChangelogGuideLayout>
```

### Problems Solved Accordion Pattern

Problems Solved sections use a labeled structure with validated user quotes:

```jsx
<AccordionContent className="space-y-4 text-muted-foreground pb-4">
  <p>
    <span className="font-medium text-foreground">The Pain:</span> Description of the problem.
  </p>
  <p className="italic bg-muted p-3 rounded-lg">
    <span className="font-medium text-foreground">Real Example:</span> Specific scenario with quote.
  </p>
  <p>
    <span className="font-medium text-foreground">Solution:</span> How OnRopePro solves it.
  </p>
  <p className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg">
    <span className="font-medium text-foreground">Benefit:</span> Business outcome.
  </p>
</AccordionContent>
```

### File Organization

- Pages go in `client/src/pages/`
- Reusable components go in `client/src/components/`
- Shadcn UI primitives are in `client/src/components/ui/`
- Shared types/schema in `shared/schema.ts`
- API routes in `server/routes.ts`
- Utilities in `client/src/lib/`

### Timezone Handling (MANDATORY)

All date/time operations MUST use timezone-safe utilities:

```typescript
// Server-side utilities in server/timezoneUtils.ts
import { getProjectTimezone, getZonedDayBounds, sessionOverlapsDay } from '../timezoneUtils';

// Client-side utilities in client/src/lib/timezoneUtils.ts and dateUtils.ts
import { formatInTimezone } from '@/lib/timezoneUtils';
```

Never use raw `new Date()` for business logic involving payroll, scheduling, or financial calculations.

---

## Key Design Patterns

### Design Guidelines (design_guidelines.md)

The codebase follows strict UI/UX patterns documented in `design_guidelines.md`:

1. **No Emojis** - Never use emoji in UI or test data
2. **Minimum text-base** - Body text never smaller than 16px
3. **Stakeholder Color Coding** - Consistent colors per user type
4. **Accordion Patterns** - Problems Solved sections use labeled structure:
   - Pain: The problem
   - Real Example: Specific scenario
   - Solution: How OnRopePro solves it
   - Benefit: Business outcome
5. **data-testid Attributes** - All interactive elements have test IDs
6. **Dark Mode Support** - Full light/dark theme support
7. **Mobile-First** - Responsive design with mobile priority

### Validated Quotes

Landing pages and Guide pages include user interview quotes from actual stakeholders (Tommy, Glenn, etc.). These quotes are curated and validated against real user interviews to ensure authenticity.

### Module Documentation Pattern

Each module has:
1. **Landing Page** - Marketing/sales focused
2. **Guide Page** - Technical documentation
3. **Schema definitions** - `shared/schema.ts`
4. **API routes** - `server/routes.ts`
5. **Frontend pages** - `client/src/pages/`

### Permission Checking

All sensitive routes include permission checks:
```typescript
// Example pattern
if (!user.permissions.includes('view_financial')) {
  return res.status(403).json({ message: "Forbidden" });
}
```

### Multi-Tenant Data Isolation

All queries include company scoping:
```typescript
// Example pattern
const projects = await db.select()
  .from(projects)
  .where(eq(projects.companyId, req.session.companyId));
```

---

## Conclusion

OnRopePro is a comprehensive, vertically-integrated SaaS platform purpose-built for the rope access industry. It connects company owners, operations staff, technicians, and external stakeholders (building managers, property managers, residents) through role-specific interfaces.

The platform's value proposition centers on:
1. **Eliminating scheduling chaos** - Conflict detection, visual calendars
2. **Automating safety compliance** - Digital forms, PDF export, audit trails
3. **Enabling workforce management** - Certifications, time tracking, payroll
4. **Improving client relationships** - Portals, communication, transparency
5. **Providing business intelligence** - Analytics, CSR, financial tracking

The modular architecture allows each component to be developed, documented, and marketed independently while sharing a unified data model and authentication system.
