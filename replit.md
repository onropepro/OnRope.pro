# Rope Access Management Platform

## Overview

The Rope Access Management Platform is an enterprise-grade, mobile-first web application designed to centralize and optimize high-rise building maintenance operations for rope access companies. It integrates project management, workforce tracking, safety compliance, financial operations, and client communication. The platform provides real-time visibility, granular permission controls, automated compliance tracking, and transparent client communication for multi-site operations, targeting various stakeholders including company owners, operations managers, and technicians.

## User Preferences

- Communication Style: Simple language with clear, concise explanations
- Development Approach: Iterative development with frequent feedback loops
- Interaction: Collaborative interaction requiring approval for major architectural changes
- Code Management: No code deletion without explicit permission

## System Architecture

The platform is built with a React 18 frontend using TypeScript and Wouter for routing, a Node.js Express.js backend, and a PostgreSQL database with Drizzle ORM. Styling is managed with Tailwind CSS and Shadcn UI, featuring a premium SaaS aesthetic with glass-morphism effects, refined shadows, and a mobile-first responsive strategy. Authentication is custom session-based, using secure cookie storage.

**Key Features and Design Decisions:**

*   **Multi-Tenant Role-Based Access Control (RBAC):** Supports various roles with granular permissions.
*   **Project Management System:** Manages diverse job types with visual selection and multiple progress tracking systems.
*   **Workforce & Time Tracking:** Includes employee management, real-time clock-in/out with GPS, billable/non-billable hours, and payroll-ready reporting. Includes IRATA certification expiration tracking and compensation type toggles.
*   **Technician Self-Registration:** Comprehensive multi-step registration wizard collecting: name, certification (IRATA/SPRAT with split level/number format), address (street, city, province, country, postal code), email, phone, password, emergency contact, SIN (optional), bank info (transit, institution, account numbers) with void cheque upload, driver's license with expiry and abstract upload, birthday, and medical conditions. Includes clear privacy notice explaining data is used only by employer for HR/payroll/driving privileges and is never shared externally.
*   **IRATA Task Logging System:** Comprehensive work hours logging system for IRATA technicians to track specific rope access tasks for certification progression.
*   **Client Relationship Management (CRM):** Manages client and building records, offers autofill intelligence, and streamlines client-to-project workflows.
*   **Scheduling & Resource Allocation:** Features a dual-calendar system with color-coding, drag-and-drop assignment, and conflict detection.
*   **Safety & Compliance:** Digitizes harness inspections, toolbox meeting documentation, FLHA forms, incident reports, and gear inventory management. Includes digital signatures and professional PDF export for all safety documents. Incident reports feature detailed classification, tracking, analysis, and digital signatures.
*   **Document Review & Signature System:** Employees review and digitally sign company documents with audit trails, supporting compliance and CSR calculation.
*   **Company Safety Rating (CSR):** A penalty-based rating system for compliance tracking, viewable by property managers with detailed breakdowns.
*   **Resident Portal & Communication:** Provides a complaint management system with two-way communication, photo galleries, and notification badges, secured by unique resident codes.
*   **Property Manager Interface:** A dedicated "My Vendors" dashboard for property managers to view vendor summaries and access read-only company information, with strict role-based access controls.
*   **White Label Branding System:** A subscription-gated feature allowing companies to customize the platform with custom logos and unlimited brand colors via CSS variables.
*   **Financial Controls & Quoting:** Enables quote generation with labor cost calculations and tax computation, protected by strict permission-based access.
*   **Subscription Management:** Fully integrated Stripe subscription system with four pricing tiers and add-ons, supporting USD and CAD currencies, with prorated upgrades/downgrades.
*   **SuperUser Administration:** Centralized dashboard for company oversight, license status monitoring, and a "View as Company" impersonation mode for superusers.
*   **Global Building Database:** SuperUser-managed centralized database of all buildings across all companies. Buildings are auto-created when projects are created with strata plan numbers. Each building has login credentials (strata number = username, password defaults to strata number) for a building portal that shows cross-company maintenance history.
*   **Building Manager (BM) Account:** Built and FREE FOREVER. Single-building scope - the BM lives at the building and handles day-to-day maintenance. Features: service history, anchor docs, vendor COI, safety rating, project progress. Login via strata plan number + password.
*   **Property Manager (PM) Account:** Built and currently FREE. Multi-building portfolio scope - a PM may manage 50+ properties with different BMs at each building. These are fundamentally different roles than BMs. PM Premium tier planned ($49/bldg/mo) after hitting tipping point (150+ PM accounts, 50%+ monthly engagement). PM Premium features TBD based on usage patterns. No database changes for PM Premium until requirements are defined.
*   **Goals & KPIs Dashboard:** SuperUser section with 7 tipping points: (1) Tech Premium Launch, (2) PM Premium Launch, (3) PM Premium Feature Definition, (4) US West Coast Launch, (5) US East Coast Expansion, (6) Unlimited Tier Push, (7) Transaction Fees. Visual progress tracking with charts and detailed sub-pages.
*   **Changelog Page:** A visual development progress guide showing implemented features by category.
*   **Analytics & Reporting:** Provides insights into billable vs. non-billable hours, employee productivity, project labor costs, and real-time active worker tracking.
*   **Security Architecture:** Implements session-based authentication with secure HTTP-only cookies, multi-tenant data isolation, permission-based API response filtering, and robust API security.
*   **UI/UX Standards:** Emphasizes obvious, prominent buttons with icons, clear visual feedback, mobile-first design, and accessibility. The design includes specific typography choices (Apparat font family).

## UI Design Standards

*   **Dialog/Modal Width:** All major form dialogs and modals should use `max-w-4xl` for consistent sizing across the application. This provides ample space for forms, reduces scrolling, and maintains a professional appearance.
*   **Grid Layouts in Dialogs:** When displaying selectable options (like job types), use `grid-cols-4 sm:grid-cols-6` to maximize use of the wider dialog space.

## Mandatory Date/Time Handling (CRITICAL)

**All date/time operations MUST use timezone-safe utilities from `client/src/lib/dateUtils.ts`.**

This is essential for accurate payroll, scheduling, performance tracking, and financial calculations.

### NEVER USE:
```typescript
// WRONG - causes off-by-one-day bugs in timezones west of UTC
new Date("2025-01-15").toLocaleDateString()  // Bug: Shows Jan 14!
```

### ALWAYS USE:
```typescript
import { formatLocalDate, formatLocalDateLong, formatDateTime, formatTimestampDate, parseLocalDate, toLocalDateString } from "@/lib/dateUtils";

// Display dates in UI:
formatLocalDate("2025-01-15")       // "1/15/2025" - short format
formatLocalDateLong("2025-01-15")   // "Wednesday, January 15, 2025" - full format
formatDateTime(timestampValue)       // "Jan 15, 2025, 2:30 PM" - timestamps with time

// Parse dates correctly:
parseLocalDate("2025-01-15")        // Returns Date at LOCAL midnight
toLocalDateString(date)             // Returns "2025-01-15" in local timezone

// For PDF filename dates:
formatLocalDate(date).replace(/\//g, '-')  // "1-15-2025"
```

### Why This Matters:
- `new Date("2025-01-15")` parses as midnight UTC
- In Pacific timezone (UTC-8), this shows as Jan 14 at 4pm
- Results in wrong dates on payroll, schedules, quotes, and safety documents

### File Location: `client/src/lib/dateUtils.ts`
Contains all timezone-safe parsing and formatting utilities.

## External Dependencies

*   **Database:** PostgreSQL
*   **Frontend Framework:** React 18
*   **Backend Framework:** Node.js with Express.js
*   **ORM:** Drizzle ORM
*   **Styling:** Tailwind CSS, Shadcn UI
*   **Icons:** Material Icons
*   **File Storage:** Replit Object Storage
*   **Mapping:** Leaflet
*   **Payment Processing:** Stripe

## Security Considerations

### Sensitive Data Storage (Implemented)
The following employee fields are encrypted at rest using AES-256-GCM:
- Social Insurance Number (SIN)
- Bank transit, institution, and account numbers
- Driver's license number
- Special medical conditions

**Implementation:** Field-level encryption is implemented in `server/encryption.ts` using AES-256-GCM with:
- Random IV per encryption operation
- Authentication tag for integrity verification
- Key management via `ENCRYPTION_KEY` environment variable (32-byte hex string)
- Backward compatibility: Unencrypted legacy data is returned as-is during decryption

**Storage Integration:** All user CRUD operations in `server/storage.ts` automatically encrypt/decrypt sensitive fields via `encryptSensitiveFields()` and `decryptSensitiveFields()` helpers.

**Privacy Commitment:** All sensitive employee data is securely stored, limited to authorized employer staff only, and never sold or shared outside your company without consent or legal requirement. Information is used for HR purposes including payroll processing, certification compliance, driving eligibility verification, and emergency contact procedures.

### Technician Account Protection (CRITICAL)
**Employers have absolutely NO permission under any circumstances to delete a technician's account.** When an employer removes a technician from their team:
- The technician is **unlinked** from the company (companyId set to null)
- The technician's account remains intact in the system
- The technician can still log in to their Technician Portal
- The technician can be invited by other companies
- All personal data, certifications, and credentials are preserved

This protection exists because technician accounts are self-registered and belong to the technician, not the employer. Employers can only manage the employment relationship, not the technician's identity in the system.

## Known Limitations

### IRATA License Verification (Manual Only)
IRATA's verification portal (techconnect.irata.org) uses a complex single-spa/SystemJS framework with invisible reCAPTCHA v3 that blocks during SPA bootstrap. After extensive testing with multiple approaches (grecaptcha shims, Object.defineProperty interception, 2Captcha token injection), automated verification is not feasible because:
1. The SPA framework requires full grecaptcha runtime internals to mount
2. Any grecaptcha shim prevents the framework from receiving required score events
3. Network interception cannot bypass server-side reCAPTCHA v3 validation

**Current Solution:** The system returns `requiresManualVerification: true` immediately, directing users to verify licenses manually at techconnect.irata.org/check-certificate.

**Technical Debt:** If IRATA provides a public API in the future, the automated verification code is preserved in `verifyIrataLicenseAutomated()` for reactivation.

## Founder Resources

*   **2Captcha** - CAPTCHA solving API (configured but not currently used for IRATA due to SPA limitations)
    *   URL: https://2captcha.com/
    *   Login: Use Google account for API access