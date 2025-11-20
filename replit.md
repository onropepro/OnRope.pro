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
*   **Client Relationship Management (CRM):** Manages client and building records, offers autofill intelligence for project creation, and streamlines client-to-project workflows.
*   **Scheduling & Resource Allocation:** Features a dual-calendar system with color-coding, drag-and-drop assignment, and conflict detection.
*   **Safety & Compliance:** Digitizes harness inspections with professional PDF export, toolbox meeting documentation with digital signatures and PDF generation, and gear inventory management with date of manufacture tracking. All safety documents can be downloaded as professionally formatted PDFs with proper pagination, embedded signatures, and compliance-ready styling.
*   **Resident Portal & Communication:** Provides a complaint management system with two-way communication, a photo gallery with unit-specific tagging, and notification badges. Features secure resident linking via unique company codes.
*   **White Label Branding System:** Subscription-gated feature ($0.49/month) allowing companies to customize the entire platform with custom logos and unlimited brand colors. When active, branding applies globally across all authenticated pages (login/register pages remain default) via CSS variables converted from hex to HSL format (--primary, --ring, --sidebar-primary, --chart-1, etc.). Colors update in real-time after saving via cache invalidation and page reload. Implements proper authentication checks to prevent branding on public pages, with automatic cleanup when branding changes or user logs out.
*   **Financial Controls & Quoting:** Enables quote generation with labor cost calculations and tax computation, protected by strict permission-based access to financial data.
*   **License Verification & Subscription Management:** Integrates with an external API for license key verification, enforces a read-only mode for unverified companies, and manages 30-day subscription renewals, seat purchasing, and white label branding subscription ($0.49/month). Marketplace integration allows instant activation/deactivation of branding via webhook API.
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
*   **License Verification:** Overhaul Labs Marketplace API (for license key management)