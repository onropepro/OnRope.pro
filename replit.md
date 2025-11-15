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

**November 15, 2025** - Resident Code System Implementation

*   Implemented secure resident linking system with unique 10-character company codes
*   Codes generated automatically on first login for company users using cryptographically secure randomness (crypto.randomBytes)
*   Database-level UNIQUE constraint ensures no duplicate codes
*   ~50 bits of entropy (1 trillion+ combinations) prevents brute-force attacks
*   Character set excludes confusing characters (0, O, 1, I) for improved usability
*   Resident code displayed prominently in company dashboard header
*   Editable in company profile page with validation and uniqueness checking
*   Input normalization (uppercase, trimming) ensures consistent format
*   Graceful error handling prevents login interruption if code generation fails

**November 15, 2025** - Account Provisioning API Implementation

*   Implemented `/api/provision-account` endpoint for automated customer onboarding from external sales platforms
*   Secured endpoint with API key authentication using `PROVISIONING_API_KEY` environment variable
*   Whitelisted provisioning endpoint from authentication middleware to allow external access
*   Fixed critical bug where passwords were being double-hashed during provisioning, causing login failures
*   Generated temporary passwords follow format: `Temp{8-random-chars}!`
*   Automatically creates company account, verifies license key, and configures default payroll settings
*   Comprehensive API documentation provided in `PROVISIONING_API.md`
*   Test script available at `test-provisioning-api.sh` for validation