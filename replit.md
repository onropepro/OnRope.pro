# Rope Access Management Platform

## Overview
The Rope Access Management Platform is an enterprise-grade, mobile-first web application designed to centralize and optimize high-rise building maintenance operations for rope access companies. It aims to streamline project management, workforce tracking, safety compliance, financial operations, and client communication. The platform provides real-time visibility, granular permission controls, automated compliance tracking, and transparent client communication for multi-site operations, targeting company owners, operations managers, and technicians.

## User Preferences
- Communication Style: Simple language with clear, concise explanations
- Development Approach: Iterative development with frequent feedback loops
- Interaction: Collaborative interaction requiring approval for major architectural changes
- Code Management: No code deletion without explicit permission
- Documentation Accuracy: Systematic audit of all safety & compliance guide documentation to match codebase implementation (source of truth)

## Documentation Verification Status
User is systematically auditing all safety & compliance guide documentation for accuracy against codebase:

**Completed Audits:**
- ✅ **IRATALoggingGuide.tsx** - FIXED: Updated to reflect all 20 canonical IRATA_TASK_TYPES from schema.ts (removed 9 invented types, added 8 missing types)
- ✅ **FLHA Forms** - VERIFIED: Fully implemented in code (database table, backend routes, frontend form, documentation accurate)

**In Progress / Pending:**
- ⚠️ **7-Day Toolbox Meeting Coverage Window** (SafetyGuide.tsx, lines 233-278) - NOT IMPLEMENTED: Will update later with correct implementation details when toolbox meeting coverage logic is finalized.

**Removed Sections:**
- ✂️ **SafetyGuide.tsx "Bi-Directional 7-Day Coverage"** (former Important Technical Notes section) - Removed invented documentation about 7-day coverage with no code implementation. Will re-add when feature is implemented.
- ✂️ **SafetyGuide.tsx Example Scenario** - Updated "8:00 AM: Toolbox Meeting" result to accurately reflect implementation instead of referencing unimplemented 7-day coverage.

## System Architecture
The platform is built with a React 18 frontend (TypeScript, Wouter for routing), a Node.js Express.js backend, and a PostgreSQL database with Drizzle ORM. Styling uses Tailwind CSS and Shadcn UI, featuring a premium SaaS aesthetic with glass-morphism effects, refined shadows, and a mobile-first responsive strategy. Authentication is custom session-based with secure cookie storage.

**Key Features and Design Decisions:**
*   **Multi-Tenant Role-Based Access Control (RBAC):** Supports various roles with granular permissions.
*   **Project Management System:** Manages diverse job types with visual selection and multiple progress tracking systems.
*   **Workforce & Time Tracking:** Includes employee management, real-time clock-in/out with GPS, billable/non-billable hours, payroll-ready reporting, and IRATA certification expiration tracking. Features valid shortfall reasons system for when technicians end sessions below daily target - valid reasons (weather, site access issues, building malfunctions, safety concerns, etc.) don't impact performance scores but are tracked separately in analytics.
*   **Technician Self-Registration:** Comprehensive multi-step registration collecting personal, certification, contact, financial, and driving information, with strict privacy notices. Includes experience tracking.
*   **Technician Referral System:** Unique 12-character referral codes for technicians to refer others, tracking referred users and displaying referral counts.
*   **Technician PLUS Access:** A premium tier offering certification expiry alerts (60-day yellow badge, 30-day red badge with banner), unlimited employer connections, enhanced IRATA task logging, exportable work history, and profile visibility. PLUS members display a gold "PRO" badge next to their name (visible in both Technician Portal and Dashboard employee cards). Uses `hasPlusAccess` field in users schema. Currently all features are displayed (gating will be added later).
*   **Resume/CV Upload:** Technicians can upload and preview multiple resume/CV documents.
*   **IRATA Task Logging System:** Comprehensive work hours logging for IRATA technicians to track tasks for certification progression.
*   **Client Relationship Management (CRM):** Manages client and building records with autofill intelligence and streamlines client-to-project workflows.
*   **Scheduling & Resource Allocation:** Dual-calendar system with color-coding, drag-and-drop assignment, and conflict detection.
*   **Safety & Compliance:** Digitizes harness inspections, toolbox meeting documentation, FLHA forms, incident reports, gear inventory management, digital signatures, and professional PDF export. Includes detailed incident report classification and tracking. Certificate of Insurance uploads feature AI-powered expiry date extraction using Gemini, with automatic red badge/text warnings for expired or soon-to-expire (within 30 days) policies.
*   **Smart Gear Inventory System:** When adding gear to inventory, users can select from a pre-populated list of industry-standard equipment (starting with descenders). Selecting "Other" allows adding custom gear that gets permanently saved to a shared database (`equipment_catalog` table) for all companies to use. Pre-populated descenders include popular models from Petzl (I'D S, I'D L, RIG, Maestro), CMC (Clutch, MPD), Rock Exotica (Totem, Akimbo), Skylotec (Deus, Sirius), ISC, Kong, and more.
*   **Document Review & Signature System:** Employees review and digitally sign company documents with audit trails.
*   **Company Safety Rating (CSR):** A penalty-based compliance rating system viewable by property managers.
*   **Resident Portal & Communication:** Complaint management with two-way communication, photo galleries, and notifications, secured by unique resident codes.
*   **Property Manager Interface:** A dedicated "My Vendors" dashboard for property managers to view vendor summaries and read-only company information.
*   **White Label Branding System:** Subscription-gated feature for customizing the platform with custom logos and brand colors.
*   **Financial Controls & Quoting:** Quote generation with labor cost calculations and tax computation, protected by permissions.
*   **Subscription Management:** Integrated Stripe subscription system with four pricing tiers and add-ons, supporting USD and CAD.
*   **SuperUser Administration:** Centralized dashboard for company oversight, license status monitoring, and a "View as Company" impersonation mode.
*   **Global Building Database:** SuperUser-managed central database of all buildings, auto-created from projects, with cross-company maintenance history and map-based search (Leaflet, Geoapify).
*   **Address Autocomplete:** Geoapify-powered address autocomplete for accurate geocoding in project creation.
*   **Building Manager (BM) Account:** Free, single-building scope with features like service history, anchor docs, vendor COI, safety rating, and project progress.
*   **Property Manager (PM) Account:** Currently free, multi-building portfolio scope, with a planned PM Premium tier.
*   **Goals & KPIs Dashboard:** SuperUser section tracking tipping points for growth and feature rollout.
*   **Analytics & Reporting:** Insights into billable vs. non-billable hours, employee productivity, project labor costs, and real-time active worker tracking.
*   **Job Board System (In Progress):** Companies and SuperUsers can post employment opportunities. Technicians can browse jobs and opt-in to make their profile visible to employers. Visible profile includes: resume, safety rating, name, years of experience, IRATA/SPRAT cert numbers, photo, and rope access specialties. Schema: `job_postings` table with company_id, title, description, requirements, location, job_type, employment_type, salary range, required certifications, status. Users table has `isVisibleToEmployers`, `visibilityEnabledAt`, and `ropeAccessSpecialties` fields.
*   **Building Maintenance Focus:** Platform exclusively supports building maintenance services with 10 specialized job types: Window Cleaning, Exterior Dryer Vent Cleaning, Building Wash/Pressure Washing, General Pressure Washing, Gutter Cleaning, In-Suite Dryer Vent Cleaning, Parkade Pressure Cleaning, Ground Window Cleaning, Painting, and Inspection. Each job type has category-specific progress tracking (drops/hours/suites/stalls). Companies can also create custom job types.
*   **Security Architecture:** Session-based authentication with secure HTTP-only cookies, multi-tenant data isolation, permission-based API response filtering, and robust API security. Sensitive employee data (SIN, bank details, driver's license, medical conditions) is encrypted at rest using AES-256-GCM.
*   **UI/UX Standards:** Emphasizes obvious, prominent buttons with icons, clear visual feedback, mobile-first design, and accessibility, using `max-w-4xl` for dialogs and `grid-cols-4 sm:grid-cols-6` for options.
*   **Mandatory Date/Time Handling:** All date/time operations MUST use timezone-safe utilities from `client/src/lib/dateUtils.ts` to prevent off-by-one-day bugs and ensure accuracy for payroll, scheduling, and financial calculations.

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