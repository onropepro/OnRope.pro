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
*   **Changelog Page:** A visual development progress guide showing implemented features by category.
*   **Analytics & Reporting:** Provides insights into billable vs. non-billable hours, employee productivity, project labor costs, and real-time active worker tracking.
*   **Security Architecture:** Implements session-based authentication with secure HTTP-only cookies, multi-tenant data isolation, permission-based API response filtering, and robust API security.
*   **UI/UX Standards:** Emphasizes obvious, prominent buttons with icons, clear visual feedback, mobile-first design, and accessibility. The design includes specific typography choices (Apparat font family).

## UI Design Standards

*   **Dialog/Modal Width:** All major form dialogs and modals should use `max-w-4xl` for consistent sizing across the application. This provides ample space for forms, reduces scrolling, and maintains a professional appearance.
*   **Grid Layouts in Dialogs:** When displaying selectable options (like job types), use `grid-cols-4 sm:grid-cols-6` to maximize use of the wider dialog space.

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