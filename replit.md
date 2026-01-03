## Overview
The Rope Access Management Platform is an enterprise-grade, mobile-first web application designed to centralize and optimize high-rise building maintenance operations for rope access companies. It aims to streamline project management, workforce tracking, safety compliance, financial operations, and client communication, providing real-time visibility, granular permission controls, and automated compliance tracking. The platform's business vision is to become the leading solution for rope access companies, enhancing operational efficiency and ensuring safety compliance across the industry.

## User Preferences
- Communication Style: Simple language with clear, concise explanations
- Development Approach: Iterative development with frequent feedback loops
- Interaction: Collaborative interaction requiring approval for major architectural changes
- Code Management: No code deletion without explicit permission
- Documentation Accuracy: Systematic audit of all safety & compliance guide documentation to match codebase implementation (source of truth)

## System Architecture
The platform utilizes a React 18 frontend (TypeScript, Wouter), a Node.js Express.js backend, and a PostgreSQL database with Drizzle ORM. Styling is managed with Tailwind CSS and Shadcn UI, adhering to a premium SaaS aesthetic with a mobile-first responsive design. Authentication is custom session-based.

**Key Features and Design Decisions:**
*   **Multi-Tenant Role-Based Access Control (RBAC):** Granular permissions for various user roles.
*   **Comprehensive Project & Workforce Management:** Includes diverse job type management, multiple progress tracking systems, real-time clock-in/out with GPS, IRATA certification tracking, and technician self-registration.
*   **Client Relationship Management (CRM):** Manages client and building records, streamlining client-to-project workflows.
*   **Advanced Scheduling & Resource Allocation:** Dual-calendar system with drag-and-drop functionality and conflict detection.
*   **Robust Safety & Compliance:** Digitizes harness inspections, toolbox meetings, FLHA forms, incident reports, gear inventory, digital signatures, and AI-powered Certificate of Insurance expiry tracking.
*   **Resident & Property Manager Portals:** Two-way feedback system for residents and a read-only interface for property managers.
*   **Branding & Financial Controls:** White-label branding, quote generation with labor cost calculation, and integrated Stripe subscription management.
*   **Centralized Administration:** SuperUser dashboard for company oversight, license monitoring, and impersonation. Global building database with map-based search.
*   **Specialized Building Maintenance Focus:** Supports 10 dedicated job types with category-specific progress tracking.
*   **Security Architecture:** Session-based authentication, multi-tenant data isolation, permission-based API filtering, and AES-256-GCM encryption for sensitive data at rest.
*   **UI/UX Standards:** Emphasizes mobile-first design, accessibility, clear visual feedback, and consistent component usage.
*   **Mandatory Timezone Support:** All date/time operations use timezone-safe utilities (`date-fns-tz`) with a hierarchy: Project timezone → Company timezone → Default (America/Vancouver).
*   **Knowledge Base & Help Center (/help):** RAG-powered, AI chat assistant with semantic search using Gemini embeddings, 19 module guides, and stakeholder-specific navigation.
*   **Stakeholder Landing Pages:** Public-facing, branded landing pages for Technicians, Residents, Property Managers, and Building Managers.
*   **Unified Dashboard Layout System:** Variant-based DashboardSidebar and DashboardLayout components supporting 6 stakeholder types with role-specific brand colors.
*   **Unified Dashboard Header:** UnifiedDashboardHeader.tsx is the single source of truth for dashboard headers, supporting 8 role variants (employer, technician, ground-crew, resident, property-manager, building-manager, superuser, csr). Uses runtime type validation via getSafeVariant(). TechnicianPortal and GroundCrewPortal use useInlineActions with custom handlers for tab-based navigation. ResidentDashboard and PropertyManagerDashboard are intentional exceptions with custom headers showing project/vendor context.
*   **Customizable Sidebar Menu Ordering:** Users can personalize sidebar navigation by reordering menu items.
*   **Staff Accounts (Internal Platform Management):** Internal-only accounts for app management staff with granular permissions.
*   **Linkable Team Member Roles:** Rope access tech and ground crew roles can be searched by email, linked to companies, and sent team invitations.
*   **API Development Process:** All API changes must follow a strict process: database schema check, endpoint pattern matching, post-implementation testing, and log verification. Common field name gotchas and role groups for access control are specified.

## UI Patterns

### "Help Me Get Started" Guided Tour Pattern
When adding guided tours to dialogs or forms, follow this exact implementation pattern for consistency:

**Button Design:**
```tsx
<Button 
  variant="outline" 
  size="sm"
  onClick={() => setTourActive(true)}
  className="mt-3 gap-2"
  data-testid="button-help-get-started-[feature-name]"
>
  <span className="material-icons text-base">help_outline</span>
  {t('common.helpMeGetStarted', 'Help me get started')}
</Button>
```

**Placement:**
- Place the button AFTER `<DialogDescription>` but OUTSIDE `<DialogHeader>` (inside a wrapper div)
- The `<GuidedFormTour>` component renders inline immediately after the button
- Never use icon-only "?" buttons - always include full text

**Reference Implementation:** See project creation dialog in `Dashboard.tsx` (line ~3929)

**Tour Component:**
```tsx
<GuidedFormTour
  steps={tourSteps}
  isActive={isTourActive}
  onClose={() => setTourActive(false)}
  containerRef={dialogRef}
/>
```

**Tour Steps:**
- Even simple steps need comprehensive help - not all users are familiar with the UI
- Source tour content from actual documentation files in `server/help-content/modules/`
- Each step should have: `fieldSelector`, `title`, `explanation`, and `appContext`

### User Name Field Standardization Pattern
**ALL user name inputs use separate firstName and lastName fields.** This is a universal pattern for all user roles.

**Universal Name Fields:**
- `firstName` and `lastName` are separate database columns and form fields
- Legacy `name` field is maintained for backward compatibility: `${firstName} ${lastName}`
- Database: `first_name`, `last_name` (snake_case) maps to `firstName`, `lastName` (camelCase) in TypeScript

**Affected Components:**
- TechnicianPortal.tsx, GroundCrewPortal.tsx (profile forms)
- Register.tsx (technician and resident registration)
- Dashboard.tsx (employee invite forms)
- Profile.tsx (user profile editing)
- OnboardingWizard.tsx (employee creation during onboarding)
- GroundCrewRegistration.tsx (ground crew self-registration)

**Implementation Pattern:**
```tsx
// Schema definition
const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  // ... other fields
});

// Form default values
const form = useForm({
  defaultValues: {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  }
});

// Submission - combine for legacy 'name' field
const name = `${data.firstName} ${data.lastName}`.trim();
```

### Address Input Standardization Pattern
**ALL address inputs use Geoapify autocomplete with structured fields.** This is a universal pattern with no exceptions.

**Universal Structured Address Fields:**
- Street address, city, province/state, country, postal code
- Street address extracted as `houseNumber + street` (NOT full formatted address)
- Autofill populates all structured fields from Geoapify selection
- For building/business addresses: also captures latitude/longitude for map display

**Database Field Naming Conventions:**
- Employees/Technicians: `employeeStreetAddress`, `employeeCity`, `employeeProvinceState`, `employeeCountry`, `employeePostalCode`
- Clients: `address`, `city`, `provinceState`, `country`, `postalCode`, `billingAddress`, `billingCity`, `billingProvinceState`, `billingCountry`, `billingPostalCode`
- Buildings: `buildingAddress`, `city`, `province`, `country`, `postalCode`, `latitude`, `longitude`

**Reference Implementations:**
- Employee forms: TechnicianPortal.tsx, GroundCrewPortal.tsx, Dashboard.tsx employee form
- Client forms: Dashboard.tsx client creation/edit forms
- Building forms: PropertyManager.tsx building address form
- Registration: GroundCrewRegistration.tsx

**Implementation Pattern:**
```tsx
// Universal address pattern - extract street, populate all structured fields
onSelect={(address) => {
  const streetAddress = address.houseNumber 
    ? `${address.houseNumber} ${address.street || ''}`.trim()
    : address.street || address.formatted;
  field.onChange(streetAddress);
  form.setValue('city', address.city || '');
  form.setValue('provinceState', address.state || '');
  form.setValue('country', address.country || '');
  form.setValue('postalCode', address.postcode || '');
  // For building addresses, also capture coordinates:
  // form.setValue('latitude', address.latitude);
  // form.setValue('longitude', address.longitude);
}}
```

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
*   **Date/Time Utilities:** `date-fns-tz`
*   **AI Embeddings:** Gemini