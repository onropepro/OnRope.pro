# Rope Access Management Platform

## Overview
A mobile-first management platform designed for rope access building maintenance operations (e.g., window washing, dryer vent cleaning, pressure washing). The platform provides role-based access for various stakeholders including Company accounts, Residents, Operations Managers, Supervisors, and Rope Access Technicians. Its purpose is to streamline project management, employee oversight, visual progress tracking, and resident communication, aiming for a production-ready solution that enhances efficiency and transparency in building maintenance.

## User Preferences
I prefer simple language and clear, concise explanations. I want an iterative development approach where I can provide feedback frequently. Please ask before making any major architectural changes or deleting significant portions of code. I prefer a collaborative interaction style.

## System Architecture
The platform is built with a **mobile-first approach** and features a modern, premium aesthetic.

**UI/UX Decisions:**
- **Design System:** Material Design 3 aesthetic using Shadcn components.
- **Colors:** Premium Ocean Blue primary (217 91% 60%), sophisticated slate backgrounds, blue-tinted shadows for depth. Dark mode enhanced with deep navy backgrounds.
- **Visual Style:** Modern premium with glass-morphism effects, gradient accents, enhanced shadows. Subtle dot pattern texture overlay on the body.
- **Typography:** Roboto font family throughout, Material Icons.
- **Interactivity:** 44px minimum touch targets (48px comfortable), 0.75rem (12px) border radius.
- **Layout:** Single column layouts, bottom navigation, full-width forms for mobile responsiveness.
- **Key Visual Component:** A signature "4-Elevation Building System" displays four buildings side-by-side (North, East, South, West). Each elevation shows independent, horizontal progress bars filling from left-to-right based on completed drops, with dynamic floor counts and percentage displays.

**Technical Implementations & Feature Specifications:**
- **Role-Based Access Control:** Multi-role user system (Company, Resident, Operations Manager, Supervisor, Rope Access Tech) with distinct permissions and dashboards.
- **Project Management:** Create and manage projects including strata plan numbers, floor counts, and rope access plans (PDF upload). Supports project completion (marks as completed, removes from active list) and deletion with cascade warnings. Company owners can complete, edit, or delete projects from centralized actions card at bottom of project detail page.
- **Project Status Tracking:** Projects have status field (active/completed). Active projects shown by default; completed projects displayed separately. Backend filters projects by status for clean separation.
- **Employee Management:** Company-controlled onboarding, editing employee details (name, email, role, IRATA level).
- **Progress Tracking:** Visual progress through the 4-Elevation Building System. Daily drop logging by technicians with historical entry, dynamic shortfall reason validation, and warning when entered drops exceed remaining per elevation (allows override).
- **Complaint Management:** Residents can submit feedback; management can track and respond with notes.
- **Photo Gallery:** Staff can upload photos to projects from camera or library, displayed in a 3-column responsive gallery.
- **Universal Profile Management:** All users can update personal information and change passwords. Company owners can delete their entire account with cascade.
- **Authentication:** Custom Express.js authentication with session storage.

**System Design Choices:**
- **Frontend:** React + TypeScript with Wouter for routing.
- **Backend:** Express.js.
- **Database:** PostgreSQL with Drizzle ORM.
- **Styling:** Tailwind CSS.
- **API Endpoints:** Structured for managing users, projects, drop logs, complaints, and sessions. Includes endpoints for photo uploads and user profile management.
- **Security:** `app.set('trust proxy', 1)` for session cookie persistence behind Replit's HTTPS proxy. ProtectedRoute component for robust role-based access control.

## External Dependencies
- **Replit Object Storage:** Used for storing PDF rope access plans and project photo galleries.
- **PostgreSQL:** Relational database for all application data.
- **Express.js:** Backend web application framework.
- **React:** Frontend library.
- **TypeScript:** Typed superset of JavaScript.
- **Wouter:** Lightweight React router.
- **Drizzle ORM:** ORM for PostgreSQL.
- **Shadcn:** UI component library.
- **Tailwind CSS:** Utility-first CSS framework.
- **Material Icons:** Icon library.
- **@google-cloud/storage:** (Implicitly for object storage, though Replit's is a managed service)