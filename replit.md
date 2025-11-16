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

*   **Multi-Tenant Role-Based Access Control (RBAC):** Supports various roles (Company, Operations Manager, Supervisor, Rope Access Tech, Resident, SuperUser) with granular permissions for data access and actions.
*   **Project Management System:** Manages diverse job types (e.g., Window Cleaning, Pressure Washing, Painting, Inspection) with visual selection, detailed project attributes, and multiple progress tracking systems (e.g., 4-Elevation, Parkade Grid, In-Suite Progress, Daily Drop Logging).
*   **Workforce & Time Tracking:** Includes employee management (onboarding, certifications, rates, permissions), real-time clock-in/out with GPS, billable/non-billable hours, and payroll-ready reporting.
*   **Client Relationship Management (CRM):** Manages client and building records, offers autofill intelligence for project creation, and streamlines client-to-project workflows.
*   **Scheduling & Resource Allocation:** Features a dual-calendar system (Job Schedule and Employee Schedule views) with color-coding, drag-and-drop assignment, and conflict detection.
*   **Safety & Compliance:** Digitizes harness inspections, toolbox meeting documentation, and gear inventory management.
*   **Resident Portal & Communication:** Provides a complaint management system with two-way communication and a photo gallery with unit-specific tagging and notification badges.
*   **Financial Controls & Quoting:** Enables quote generation with labor cost calculations and tax computation, protected by strict permission-based access to financial data.
*   **License Verification & Subscription Management:** Integrates with an external API for license key verification, enforces a read-only mode for unverified companies, and ensures secure data handling.
*   **SuperUser Administration:** Offers a centralized dashboard for company oversight, license status monitoring, and detailed company views with analytics.
*   **Analytics & Reporting:** Provides insights into billable vs. non-billable hours, employee productivity, project labor costs, and real-time active worker tracking.
*   **Security Architecture:** Implements session-based authentication with secure HTTP-only cookies, multi-tenant data isolation, permission-based API response filtering, and robust API security.
*   **UI/UX Standards:** Emphasizes obvious, prominent buttons with icons, clear visual feedback, mobile-first design, and accessibility (44px minimum touch targets, high contrast, keyboard navigation).

## External Dependencies

*   **Database:** PostgreSQL
*   **Frontend Framework:** React 18
*   **Backend Framework:** Node.js with Express.js
*   **ORM:** Drizzle ORM
*   **Styling:** Tailwind CSS, Shadcn UI
*   **Icons:** Material Icons
*   **File Storage:** Replit Object Storage
*   **Mapping:** Leaflet (for GPS location visualization)
*   **License Verification:** Overhaul Labs Marketplace API (for license key management)

## Recent Changes

**November 16, 2025** - Subscription Renewal Date Tracking

*   Implemented 30-day subscription model with automatic renewal date tracking
*   Added `subscriptionRenewalDate` field to database schema for company accounts
*   **Automatic Initialization:** Both `/api/provision-account` and `/api/register` endpoints automatically set renewal date to 30 days from account creation
*   **Profile Display:** Subscription tab now shows renewal date with countdown (e.g., "X days until renewal", "Renews tomorrow", "Renews today")
*   **Date Formatting:** Displays in readable format (e.g., "Dec 16, 2025") with helpful context
*   **Backend API:** License key now included in `/api/user` response for company users to view in subscription settings
*   Provides clear visibility into subscription lifecycle for both company owners and administrators

**November 16, 2025** - Tier-Based Employee Seat and Project Limits Implementation

*   Implemented tier-based permission system for employee seats and active projects
*   Tier detection based on license key suffix (e.g., `-1` for Tier 1, `-2` for Tier 2, `-3` for Tier 3)
*   **Tier 1 Limits:** Maximum 2 employee seats and 5 active projects
*   **Tier 2 Limits:** Maximum 10 employee seats and 20 active projects
*   **Tier 3 Limits:** Unlimited employee seats and projects
*   **Employee Seat Management:**
    *   Seat counting excludes company owner and residents (only counts actual employees)
    *   Real-time seat usage display in employee management section showing "X of Y seats used"
    *   Disabled "Add Employee" button when seat limit is reached with clear messaging
    *   Warning banner displays when at seat limit with upgrade/buy seats placeholder buttons
    *   Backend API endpoints (`/api/employees` and `/api/employees/all`) now return `seatInfo` object with tier, limits, and usage data
    *   Frontend dynamically adjusts UI based on tier status and seat availability
    *   Tier badge color-coded (destructive red when at limit, secondary when within limit)
    *   Added seat usage display to company Profile page showing tier, seats used, and seats remaining
    *   Added seat usage display to SuperUser's Company Detail page for monitoring customer seat usage
    *   Created `/api/superuser/companies/:id/employees` endpoint for SuperUser to view company seat info
*   **Project Limit Management:**
    *   Backend API endpoint (`/api/projects`) now returns `projectInfo` object with tier, limits, and usage data
    *   Real-time project usage display in projects section showing "X of Y projects used"
    *   Disabled "New Project" button when project limit is reached with clear messaging
    *   Warning banner displays when at project limit with upgrade/buy project slots placeholder buttons
    *   Frontend dynamically adjusts UI based on project tier status and availability
*   Upgrade and purchase functionality stubbed for future implementation

**November 15, 2025** - Resident Code System Implementation

*   Implemented secure resident linking system with unique 10-character company codes
*   Codes generated automatically on first login for company users using cryptographically secure randomness (crypto.randomBytes)
*   Database-level UNIQUE constraint ensures no duplicate codes
*   ~50 bits of entropy (1 trillion+ combinations) prevents brute-force attacks
*   Character set excludes confusing characters (0, O, 1, I) for improved usability
*   Resident code displayed prominently in company dashboard header and resident portal
*   Editable in company profile page with validation and uniqueness checking
*   Input normalization (uppercase, trimming) ensures consistent format
*   Graceful error handling prevents login interruption if code generation fails
*   **Code Validation:** Residents store the code they used to link (`linkedResidentCode`)
*   **Auto-Unlinking:** If company changes their code, residents are automatically unlinked and must re-enter the new code
*   **Security:** Prevents residents from seeing projects after company changes their code

**November 15, 2025** - Account Provisioning API Implementation

*   Implemented `/api/provision-account` endpoint for automated customer onboarding from external sales platforms
*   Secured endpoint with API key authentication using `PROVISIONING_API_KEY` environment variable
*   Whitelisted provisioning endpoint from authentication middleware to allow external access
*   Fixed critical bug where passwords were being double-hashed during provisioning, causing login failures
*   Generated temporary passwords follow format: `Temp{8-random-chars}!`
*   Automatically creates company account, verifies license key, and configures default payroll settings
*   Comprehensive API documentation provided in `PROVISIONING_API.md`
*   Test script available at `test-provisioning-api.sh` for validation