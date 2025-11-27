# Rope Access Management Platform

## Overview

The Rope Access Management Platform is an enterprise-grade, mobile-first web application designed to centralize and optimize high-rise building maintenance operations for rope access companies. It integrates project management, workforce tracking, safety compliance, financial operations, and client communication into a single system. The platform aims to provide real-time visibility, granular permission controls, automated compliance tracking, and transparent client communication for multi-site operations, targeting company owners, operations managers, site supervisors, rope access technicians, building residents, and property managers.

## User Preferences

- Communication Style: Simple language with clear, concise explanations
- Development Approach: Iterative development with frequent feedback loops
- Interaction: Collaborative interaction requiring approval for major architectural changes
- Code Management: No code deletion without explicit permission

## System Architecture

The platform is built with a React 18 frontend using TypeScript and Wouter for routing, a Node.js Express.js backend, and a PostgreSQL database with Drizzle ORM. Styling is managed with Tailwind CSS and Shadcn UI, featuring a premium SaaS aesthetic with glass-morphism effects, refined shadows, and a mobile-first responsive strategy. Authentication is custom session-based, using secure cookie storage. Replit Object Storage is used for file storage.

**Key Features and Design Decisions:**

*   **Multi-Tenant Role-Based Access Control (RBAC):** Supports various roles with granular permissions for data access and actions.
*   **Project Management System:** Manages diverse job types with visual selection, detailed project attributes, and multiple progress tracking systems. Custom job types can be saved and reused.
*   **Workforce & Time Tracking:** Includes employee management (onboarding, certifications, rates, permissions), real-time clock-in/out with GPS, billable/non-billable hours, and payroll-ready reporting. Includes IRATA certification expiration tracking.
*   **IRATA Task Logging System:** Comprehensive work hours logging system for IRATA technicians to track specific rope access tasks performed during work sessions, supporting certification progression. Features include:
    - Task selection dialog after ending work sessions (IRATA technicians only)
    - 20+ canonical rope access task types (rope transfer, ascending, descending, rigging, deviation, rescue techniques, etc.)
    - Server-derived metadata (hours, dates, building info) from authoritative work session/project records
    - Security hardening: canonical task validation, unique constraints, work session ownership verification
    - "My Logged Hours" page (/my-logged-hours) with full history, filtering, and statistics
    - Dashboard navigation card for easy access
*   **Client Relationship Management (CRM):** Manages client and building records, offers autofill intelligence for project creation, and streamlines client-to-project workflows.
*   **Scheduling & Resource Allocation:** Features a dual-calendar system with color-coding, drag-and-drop assignment, and conflict detection.
*   **Safety & Compliance:** Digitizes harness inspections with professional PDF export, toolbox meeting documentation with digital signatures and PDF generation, FLHA (Field Level Hazard Assessment) forms, incident reports with comprehensive tracking, and gear inventory management with date of manufacture tracking. Incident reports include detailed incident classification, injured person tracking, root cause analysis, corrective actions, regulatory reporting, supervisor/management review, and digital signatures. All safety documents can be downloaded as professionally formatted PDFs with proper pagination, embedded signatures, and compliance-ready styling. When white-label branding is active, company name appears at the top of safety document PDFs (first page).
*   **Company Safety Rating (CSR):** Penalty-based rating system starting at 100%. Three components: Documentation (25% penalty if missing any of Certificate of Insurance, Health & Safety Manual, or Company Policy), Toolbox Meetings (25% max penalty based on work session coverage), and Harness Inspections (25% max penalty based on inspection completion). Toolbox meetings use a 7-day coverage window - a meeting covers work sessions within 7 days in either direction, allowing meetings to occur outside of work sessions and still count toward compliance. Property managers can view vendor CSR scores with detailed breakdowns.
*   **Resident Portal & Communication:** Provides a complaint management system with two-way communication, a photo gallery with unit-specific tagging, and notification badges. Features secure resident linking via unique company codes (residentCode). Separate property manager code system (propertyManagerCode) ensures property managers cannot use resident codes and vice versa, preventing unauthorized privilege escalation.
*   **Property Manager Interface:** Dedicated "My Vendors" dashboard for property managers that is completely separate from the employee dashboard. Property managers can link to multiple rope access companies using unique property manager codes, view vendor summaries (company name, contact info, active projects), and access read-only company information. Property managers are explicitly blocked from employee-only features and routes (/dashboard, project management, safety forms, payroll, etc.) through both frontend route guards and backend API permission checks. Interface accessible at /property-manager route with role-based authentication requiring property_manager role.
*   **White Label Branding System:** Subscription-gated feature ($49/month) allowing companies to customize the entire platform with custom logos and unlimited brand colors. When active, branding applies globally across all authenticated pages (login/register pages remain default) via CSS variables converted from hex to HSL format (--primary, --ring, --sidebar-primary, --chart-1, etc.). Colors update in real-time after saving via cache invalidation and page reload. Implements proper authentication checks to prevent branding on public pages, with automatic cleanup when branding changes or user logs out.
*   **Financial Controls & Quoting:** Enables quote generation with labor cost calculations and tax computation, protected by strict permission-based access to financial data.
*   **Subscription Management:** Fully integrated Stripe subscription system with four pricing tiers (Basic $79/2 projects/4 seats, Starter $299/5 projects/10 seats, Premium $499/9 projects/18 seats, Enterprise $899/unlimited) supporting USD and CAD currencies (same pricing for both). Features prorated subscription upgrades/downgrades using Stripe's native subscription update API - changes are immediate with automatic proration billing. License keys are automatically replaced with correct tier suffix during upgrades to prevent account lockouts. Includes prorated add-ons for additional seats ($19 for 2 seats) and extra projects ($49 per project). White label branding subscription ($49/month) available as optional add-on. All subscription management handled via in-app SubscriptionManagement component with Stripe integration. NO external marketplace integration - all purchases flow through Stripe webhooks.
*   **SuperUser Administration:** Offers a centralized dashboard for company oversight, license status monitoring, and detailed company views with analytics.
*   **Analytics & Reporting:** Provides insights into billable vs. non-billable hours, employee productivity, project labor costs, and real-time active worker tracking.
*   **Security Architecture:** Implements session-based authentication with secure HTTP-only cookies, multi-tenant data isolation, permission-based API response filtering, and robust API security. Includes an account provisioning API.
*   **UI/UX Standards:** Emphasizes obvious, prominent buttons with icons, clear visual feedback, mobile-first design, and accessibility.

## External Dependencies

*   **Database:** PostgreSQL
*   **Frontend Framework:** React 18
*   **Backend Framework:** Node.js with Express.js
*   **ORM:** Drizzle ORM
*   **Styling:** Tailwind CSS, Shadcn UI
*   **Icons:** Material Icons
*   **File Storage:** Replit Object Storage
*   **Mapping:** Leaflet (for GPS location visualization)
*   **Payment Processing:** Stripe (for subscription billing, seat purchases, and white label branding)