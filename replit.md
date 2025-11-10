# Rope Access Management Platform

## Overview
The Rope Access Management Platform is a mobile-first web application designed to streamline high-rise building maintenance operations for rope access companies. It centralizes project management, real-time work tracking, safety compliance, and communication, replacing disparate tools with a unified system. The platform serves company owners, operations managers, supervisors, rope access technicians, and building residents, aiming to enhance efficiency, safety, and transparency in high-rise maintenance. Key capabilities include multi-job-type project management (e.g., 4-elevation, parkade, in-suite), real-time work session and hours tracking for payroll, visual progress tracking, daily drop logging, resident complaint management, and digital safety forms.

## User Preferences
I prefer simple language and clear, concise explanations. I want an iterative development approach where I can provide feedback frequently. Please ask before making any major architectural changes or deleting significant portions of code. I prefer a collaborative interaction style.

## System Architecture
The platform is built with a **mobile-first approach** and features a modern, premium aesthetic.

**UI/UX Decisions:**
- **Design System:** Material Design 3 aesthetic using Shadcn components.
- **Colors:** Premium Ocean Blue primary, sophisticated slate backgrounds, blue-tinted shadows, and deep navy for dark mode.
- **Visual Style:** Modern premium with glass-morphism effects, gradient accents, enhanced shadows, and a subtle dot pattern texture overlay.
- **Typography:** Roboto font family with Material Icons.
- **Interactivity:** 44px minimum touch targets and 0.75rem (12px) border radius.
- **Layout:** Single column layouts, bottom navigation, and full-width forms for mobile responsiveness.
- **Key Visual Component:** A signature "4-Elevation Building System" displays four buildings side-by-side (North, East, South, West) with independent, horizontal progress bars filling based on completed drops, dynamic floor counts, and percentage displays.

**Technical Implementations & Feature Specifications:**
- **Role-Based Access Control:** Multi-role user system (Company, Resident, Operations Manager, Supervisor, Rope Access Tech) with distinct permissions and dashboards.
- **Financial Permission Enforcement:** Comprehensive multi-tenant isolation with ZERO-ACCESS enforcement for employees without financial permissions. Backend permission-based filtering strips all financial data (pricing, hourly rates, estimated hours, labor costs) from API responses for unauthorized users. Frontend uses centralized permission helpers (`hasFinancialAccess`, `isManagement`, `hasPermission`) to conditionally render UI elements and disable queries. All financial routes (`/api/projects/:id`, `/api/projects/:id/work-sessions`, `/api/quotes`, `/api/quotes/:id`) check `currentUser.role === "company"` or `view_financial_data` permission before returning sensitive fields. Payroll page enforces page-level permission with redirect and query disabling (`enabled: canAccessPayroll`).
- **Project Management:** Creation and management of projects including strata plan numbers, floor counts, and PDF rope access plan uploads. Projects can be completed, edited, or deleted with cascade warnings.
- **Project Status Tracking:** Projects are categorized as 'active' or 'completed' with separate displays.
- **Employee Management:** Company-controlled onboarding, editing employee details (name, email, role, IRATA level).
- **Progress Tracking:** Visual progress via the 4-Elevation Building System. Daily drop logging by technicians includes historical entry, dynamic shortfall reason validation, and warnings for exceeding remaining work with an override option.
- **Complaint Management:** Residents submit feedback, and management tracks and responds with notes.
- **Photo Gallery:** Staff upload project photos from mobile devices, displayed in a 3-column responsive gallery.
- **Universal Profile Management:** Users manage personal information; company owners can delete their accounts with cascade warnings.
- **Authentication:** Custom Express.js authentication with session storage.

**System Design Choices:**
- **Frontend:** React + TypeScript with Wouter for routing.
- **Backend:** Express.js.
- **Database:** PostgreSQL with Drizzle ORM.
- **Styling:** Tailwind CSS.
- **API Endpoints:** Structured for managing users, projects, drop logs, complaints, and sessions, including photo uploads and user profiles.
- **Security:** `app.set('trust proxy', 1)` for session cookie persistence and ProtectedRoute component for role-based access control.

## External Dependencies
- **Replit Object Storage:** For storing PDF rope access plans and project photo galleries.
- **PostgreSQL:** Primary relational database.
- **Express.js:** Backend web application framework.
- **React:** Frontend library.
- **TypeScript:** Language for typed JavaScript.
- **Wouter:** Lightweight React router.
- **Drizzle ORM:** ORM for PostgreSQL interaction.
- **Shadcn:** UI component library.
- **Tailwind CSS:** Utility-first CSS framework.
- **Material Icons:** Icon library.