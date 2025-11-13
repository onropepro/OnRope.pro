# Rope Access Management Platform

## Overview
The Rope Access Management Platform is a mobile-first web application designed to streamline high-rise building maintenance operations for rope access companies. It centralizes project management, real-time work tracking, safety compliance, and communication, replacing disparate tools with a unified system. The platform serves company owners, operations managers, supervisors, rope access technicians, and building residents, aiming to enhance efficiency, safety, and transparency in high-rise maintenance. Key capabilities include multi-job-type project management (e.g., 4-elevation, parkade, in-suite), real-time work session and hours tracking for payroll, visual progress tracking, daily drop logging, resident complaint management, and digital safety forms.

**Current Development Status**: Premium design system upgrade in progress - implementing professional SaaS aesthetic with refined Ocean Blue color palette, glass-morphism effects, premium shadows, and polished component library to match enterprise subscription pricing ($100s/month).

## User Preferences
I prefer simple language and clear, concise explanations. I want an iterative development approach where I can provide feedback frequently. Please ask before making any major architectural changes or deleting significant portions of code. I prefer a collaborative interaction style.

## System Architecture
The platform is built with a **mobile-first approach** and features a modern, premium aesthetic.

**UI/UX Decisions:**
- **Design System:** Premium SaaS aesthetic inspired by Linear, Notion, and Monday.com, built with Shadcn components.
- **Colors:** Ocean Blue primary (#0EA5E9 - 199 89% 48%), Cloud backgrounds (218 27% 98%), Emerald success (160 84% 39%), Rose destructive (347 77% 60%), Violet analytics (262 83% 58%), refined shadows with subtle blue tinting.
- **Visual Style:** Modern premium with glass-morphism effects (backdrop-blur-xl), gradient accents, refined shadows (0.75rem border radius), premium card treatments with subtle borders and enhanced depth.
- **Typography:** Inter font family (fallback to system fonts), Material Icons for UI elements.
- **Premium Components:** Reusable StatsCard and ProjectCard components with hover-elevate interactions, transition-premium animations, and shadow-premium treatments.
- **Utilities:** Glass morphism (.glass, .glass-dark), gradient backgrounds (.gradient-primary, .gradient-accent), premium shadows, smooth transitions.
- **Interactivity:** 44px minimum touch targets, 0.75rem (12px) refined border radius, hover-elevate and active-elevate-2 interactions.
- **Layout:** Single column layouts, bottom navigation, and full-width forms for mobile responsiveness.
- **Key Visual Component:** A signature "4-Elevation Building System" displays four buildings side-by-side (North, East, South, West) with independent, horizontal progress bars filling based on completed drops, dynamic floor counts, and percentage displays.

**Technical Implementations & Feature Specifications:**
- **Role-Based Access Control:** Multi-role user system (Company, Resident, Operations Manager, Supervisor, Rope Access Tech) with distinct permissions and dashboards.
- **License Key Verification & Read-Only Mode System:** Subscription-based license verification integrated with Overhaul Labs Marketplace API with comprehensive read-only mode enforcement. System features: (1) Auto re-verification on every login with graceful API failure handling that preserves existing status during outages, (2) Manual verification endpoint (POST `/api/verify-license`) with bypass mode for development, (3) Frontend verification gate that redirects unverified companies to `/license-verification` page with "Continue in Read-Only Mode" option, (4) Database fields (`licenseKey`, `licenseVerified`) with security enforcement stripping `licenseKey` from ALL API responses, (5) Bypass mode uses `licenseKey: "BYPASSED"` and persists across re-logins by skipping re-verification. **Read-Only Enforcement:** Global dual-layer protection blocks ALL mutations for unverified companies: (a) Backend global mutation guard middleware automatically blocks POST/PUT/PATCH/DELETE requests (with whitelist for auth endpoints) by checking company verification status for both company users and their employees, (b) Frontend disables all Create/Edit/Delete buttons when `isReadOnly()` returns true, (c) `/api/user` endpoint includes `companyLicenseVerified` field for employees so they inherit parent company's verification status, (d) Yellow alert banner on Dashboard shows verification status for users in read-only mode. Extensively tested with 100% pass rate covering security, multi-tenant isolation, employee bypass prevention, and complete end-to-end cycles.
- **Financial Permission Enforcement:** Comprehensive multi-tenant isolation with ZERO-ACCESS enforcement for employees without financial permissions. Backend permission-based filtering strips all financial data (pricing, hourly rates, estimated hours, labor costs) from API responses for unauthorized users. Frontend uses centralized permission helpers (`hasFinancialAccess`, `isManagement`, `hasPermission`) to conditionally render UI elements and disable queries. All financial routes (`/api/projects/:id`, `/api/projects/:id/work-sessions`, `/api/quotes`, `/api/quotes/:id`) check `currentUser.role === "company"` or `view_financial_data` permission before returning sensitive fields. Payroll page enforces page-level permission with redirect and query disabling (`enabled: canAccessPayroll`).
- **Job Schedule Permission System:** Permission-based access control for the Job Schedule feature using the `view_schedule` permission. The Schedule card on the Dashboard is hidden for users without permission, and the Schedule page shows an access denied message with a lock icon for unauthorized users. Company role always has access; other roles require explicit `view_schedule` permission in their permissions array.
- **Project Management:** Creation and management of projects including strata plan numbers, floor counts, and PDF rope access plan uploads. Projects can be completed, edited, or deleted with cascade warnings.
- **Project Status Tracking:** Projects are categorized as 'active' or 'completed' with separate displays.
- **Employee Management:** Company-controlled onboarding, editing employee details (name, email, role, IRATA level).
- **Progress Tracking:** Visual progress via the 4-Elevation Building System for traditional rope access jobs. Parkade projects display a visual grid of parking stalls that auto-scales based on total count. In-suite projects show simple percentage progress. Daily drop logging by technicians includes historical entry, dynamic shortfall reason validation, and warnings for exceeding remaining work with an override option.
- **Complaint Management:** Residents submit feedback, and management tracks and responds with notes. Notes can be marked as "visible to resident" for two-way communication.
- **Photo Gallery:** Staff upload project photos from mobile devices, displayed in a 3-column responsive gallery. Residents can view photos tagged for their unit number.
- **Notification Badge System:** Residents receive iPhone-style red notification badges on dashboard tabs: (1) "My Photos" tab shows count of new photos added since last view, (2) "Complaints" tab shows count of complaints with new worker responses since last view. Uses localStorage to track view times and auto-clears when tabs are opened.
- **Personal Gear Inventory:** All employees can view their assigned gear items via the "My Gear" tab within the Inventory page, showing equipment type, quantity, serial numbers, and service dates. The Inventory page uses tabs to provide both "My Gear" (read-only view for all employees) and "Manage Gear" (full CRUD operations for management). Financial data (item prices, total value) is conditionally displayed only for users with financial permissions.
- **Job Scheduling System:** Two-tab calendar interface with "Job Schedule" (grid view showing jobs with assigned employees filtered by date ranges) and "Employee Schedule" (timeline view with employees in left column as rows, showing assigned jobs). Features: (1) Day/Week/Month views on both calendars, (2) Drag-and-drop employee assignment to jobs, (3) Date range selection for employee assignments, (4) Auto-refresh after changes, (5) Permission-controlled access via `view_schedule` permission, (6) Color-coded job blocks, (7) Visual employee assignment indicators.
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

## Future Features (To-Do)
- **Employee Personal Timesheet View:** A dedicated page where employees can view their own work hours (billable + non-billable), current pay period dates, total hours for current pay period, and their hourly rate. This would be separate from the management Payroll page.