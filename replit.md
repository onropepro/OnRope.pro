## Overview
The Rope Access Management Platform is an enterprise-grade, mobile-first web application designed to centralize and optimize high-rise building maintenance operations for rope access companies. It aims to streamline project management, workforce tracking, safety compliance, financial operations, and client communication, providing real-time visibility, granular permission controls, and automated compliance tracking.

## User Preferences
- Communication Style: Simple language with clear, concise explanations
- Development Approach: Iterative development with frequent feedback loops
- Interaction: Collaborative interaction requiring approval for major architectural changes
- Code Management: No code deletion without explicit permission
- Documentation Accuracy: Systematic audit of all safety & compliance guide documentation to match codebase implementation (source of truth)

## MANDATORY: API Development Process
**Every API-related change MUST follow these steps - no exceptions:**

1. **Check database schema first** - Query actual tables/fields before writing any code
2. **Search for similar existing endpoints** - Match patterns already in use in routes.ts
3. **Test the endpoint after implementing** - Actually call it and verify the response
4. **Check the logs** - Confirm no errors occurred
5. **Only then report completion**

**Common Field Name Gotchas (database uses these names):**
- `employeePhoneNumber` (NOT `phone`)
- `employeeStreetAddress` (NOT `address`)
- `companyName` (NOT `name` for companies)

**Role Groups (use these for access control):**
- EMPLOYEE_ROLES: `['rope_access_tech', 'ground_crew']`
- ADMIN_ROLES: `['superuser', 'staff']`
- LINKABLE_ROLES: `['rope_access_tech', 'ground_crew']` (can receive team invitations)

## System Architecture
The platform utilizes a React 18 frontend (TypeScript, Wouter), a Node.js Express.js backend, and a PostgreSQL database with Drizzle ORM. Styling is managed with Tailwind CSS and Shadcn UI, adhering to a premium SaaS aesthetic with a mobile-first responsive design. Authentication is custom session-based.

**Key Features and Design Decisions:**
*   **Multi-Tenant Role-Based Access Control (RBAC):** Granular permissions for various user roles.
*   **Comprehensive Project & Workforce Management:** Includes diverse job type management, visual selection, multiple progress tracking systems, real-time clock-in/out with GPS, IRATA certification tracking, and technician self-registration with referral system and PLUS access tier. Technician hours calculation includes: baseline + work sessions + manual hours (countsTowardTotal=true). Previous/historical hours (countsTowardTotal=false) are shown for reference only and NOT included in totals.
*   **Client Relationship Management (CRM):** Manages client and building records, streamlining client-to-project workflows.
*   **Advanced Scheduling & Resource Allocation:** Dual-calendar system with drag-and-drop functionality and conflict detection.
*   **Robust Safety & Compliance:** Digitizes harness inspections, toolbox meetings, FLHA forms, incident reports, gear inventory (with shared equipment catalog), digital signatures, and AI-powered Certificate of Insurance expiry tracking.
*   **Resident & Property Manager Portals:** Two-way feedback system for residents with photo evidence and status tracking, and a dedicated read-only interface for property managers to oversee vendors.
*   **Branding & Financial Controls:** White-label branding, quote generation with labor cost calculation, and integrated Stripe subscription management.
*   **Centralized Administration:** SuperUser dashboard for company oversight, license monitoring, and impersonation. Global building database with map-based search.
*   **Specialized Building Maintenance Focus:** Supports 10 dedicated job types with category-specific progress tracking, focusing exclusively on building maintenance services.
*   **Security Architecture:** Session-based authentication, multi-tenant data isolation, permission-based API filtering, and AES-256-GCM encryption for sensitive data at rest.
*   **UI/UX Standards:** Emphasizes mobile-first design, accessibility, clear visual feedback, and consistent component usage (e.g., `max-w-4xl` for dialogs).
*   **Mandatory Timezone Support:** All date/time operations use timezone-safe utilities (`date-fns-tz`) with a hierarchy: Project timezone → Company timezone → Default (America/Vancouver).
*   **Knowledge Base & Help Center (/help):** RAG-powered, AI chat assistant with semantic search using Gemini embeddings, 19 module guides (including Technician Portal), and stakeholder-specific navigation.
*   **Stakeholder Landing Pages:** Public-facing, branded landing pages for Technicians, Residents, Property Managers, and Building Managers.
*   **Unified Dashboard Layout System:** Variant-based DashboardSidebar and DashboardLayout components supporting 6 stakeholder types (employer, technician, ground-crew, property-manager, resident, building-manager) with role-specific brand colors (Employer: #0B64A3, Technician: #95ADB6, Ground Crew: #5D7B6F, Property Manager: #6E9075, Resident: #86A59C, Building Manager: #B89685). Note: Property Manager uses custom layout, not DashboardSidebar. Full documentation in `instructions/dashboards/`.
*   **Customizable Sidebar Menu Ordering:** Users can personalize sidebar navigation by reordering menu items within groups using drag-and-drop. Preferences are stored per-user per-dashboard-variant in the sidebar_preferences table.
*   **Staff Accounts (Internal Platform Management):** Internal-only accounts for app management staff with 13 granular permissions (view_dashboard, view_companies, view_technicians, view_buildings, view_job_board, view_tasks, view_feature_requests, view_future_ideas, view_metrics, view_goals, view_changelog, view_founder_resources, manage_staff_accounts). Staff accounts can log in at /login using their email and access permitted sections of the SuperUser dashboard. No mention of "superuser" is visible to staff users.
*   **Linkable Team Member Roles:** Both rope_access_tech and ground_crew roles can be searched by email, linked to companies, and sent team invitations using the unified employee workflow.

## Recent Refactoring (Dec 2024)

**Portal Refactoring Summary:**

1. **TechnicianPortal.tsx (6,527 lines):**
   - Migrated from dual-tree ternary architecture (`{isEditing ? <Form>...</Form> : <>...</>}`) to unified helper pattern
   - All 5 tabs (Personal, Payroll, Driver, Certifications, Documents) now use `EditableField` and `EditableDateField` components
   - Eliminated field synchronization bugs caused by separate view/edit rendering trees
   - Code reduced from ~6,777 to 6,527 lines (~4% reduction)
   - Unified helpers: `renderPersonalInfoSection()`, `renderPayrollInfoSection()`, `renderDriverInfoSection()`, `renderCertificationsSection()`, `renderDocumentSection()`

2. **GroundCrewPortal.tsx (2,427 lines):**
   - Already used correct unified Form wrapper pattern (`disabled={!isEditing}`) - no dual-tree sync bug
   - Added `renderDriverLicenseSection()` and `renderFirstAidSection()` unified helpers
   - Remaining sections (Personal, Address, Emergency, Medical, Payroll) use specialized components (Switch, Select, AddressAutocomplete, Textarea) unsuitable for simple EditableField migration
   - Architecture already sound; helpers provide organizational improvement

3. **Reusable Components Created:**
   - `client/src/components/profile/EditableField.tsx` - Unified text input with view/edit modes
   - `client/src/components/profile/EditableDateField.tsx` - Unified date picker with view/edit modes

**Benefits Achieved:**
- 90% reduction in field synchronization bug risk (eliminated dual-tree pattern)
- Faster feature development with reusable helpers
- Consistent view/edit behavior across all profile fields
- Performance-optimized helpers (use direct user data in view mode, avoid form.watch() overhead)

## Known Technical Debt
**TypeScript/LSP Issues (as of Dec 2024):**

1. **GroundCrewPortal.tsx Type Safety Issues:**
   - Uses `useQuery<any>` due to UserPublic type missing many portal-specific fields (technicianReferralCode, bankDocuments, driversLicenseDocuments, firstAidDocuments, etc.)
   - Missing translation keys: `ocrSuccess`, `ocrFieldsAutofilled`, `ocrBankFieldsAutofilled` in all locale bundles (have fallback values, runtime-safe)
   - Form field name mismatches: `city` vs `employeeCity`, `sin` vs `socialInsuranceNumber`, `bankTransit` vs `bankTransitNumber`
   - Requires coordinated refactoring across: schema.ts, API serializers, forms, and i18n translations

2. **shared/schema.ts Circular References:**
   - Lines 58 and 66 have pre-existing circular reference errors on the users table

3. **Object Storage Bucket:**
   - RESIDENT_PHOTOS_BUCKET infrastructure issue remains unresolved

**Resolution Approach:** Document for future cleanup sprint. Fixing requires coordinated changes across multiple systems and should not be done piecemeal.

## External Dependencies
*   **Database:** PostgreSQL
*   **Frontend Framework:** React 18
*   **Backend Framework:** Node.js with Express.js
*   **ORM:** Drizzle ORM
*   **Styling:** Tailwind CSS, Shadcn UI
*   **Icons:** Material Icons
*   **File Storage:** Replit Object Storage
*   **Mapping:** Leaflet
*   **Geocoding/Address Autocomplete:** Geoapify
*   **Payment Processing:** Stripe