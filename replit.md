# Rope Access Management Platform

## Overview
A mobile-first management platform for rope access building maintenance operations (window washing, dryer vent cleaning, pressure washing). The platform provides role-based access for Company accounts, Residents, Operations Managers, Supervisors, and Rope Access Technicians.

## Key Features
- **Visual Progress Tracking**: High-rise building visualization with lit windows showing completed drops
- **Drop Logging**: Technicians can log daily drops with historical entry capability
- **Complaint Management**: Residents can submit feedback; management can track and respond with notes
- **Project Management**: Create projects with strata plan numbers, floor counts, and rope access plans; delete projects with cascade warnings
- **Employee Management**: Company-controlled onboarding with role-based permissions

## Tech Stack
- **Frontend**: React + TypeScript with Wouter routing
- **Backend**: Express.js with custom authentication
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Replit Object Storage for PDF rope access plans
- **UI**: Shadcn components with Material Design 3 aesthetic
- **Styling**: Tailwind CSS with Roboto font family

## User Roles
1. **Company**: Manages projects and employees, no email login
2. **Resident**: Views progress, submits complaints, email login
3. **Operations Manager**: Full project oversight, employee management
4. **Supervisor**: Project monitoring, complaint resolution
5. **Rope Access Tech**: Daily drop logging, complaint viewing with tech level tracking

## Routes
- `/` - Login page
- `/register` - Registration (Resident/Company tabs)
- `/resident` - Resident dashboard with building visualization and complaint submission
- `/tech` - Technician dashboard with drop logging and complaint viewing
- `/management` - Company/Manager dashboard with project and employee management
- `/projects/:id` - Project detail page with building visualization, stats, and delete capability
- `/projects/:id/work-sessions` - Work session history with tech names
- `/complaints/:id` - Complaint detail with notes (tech/management access)

## Database Schema
- **users**: Multi-role with custom fields (company name, resident info, tech levels)
- **projects**: Strata plan tracking with floor counts, drops, and completion status
- **drop_logs**: Daily drop entries per project per tech with date flexibility
- **complaints**: Resident feedback with status tracking
- **complaint_notes**: Tech/management responses to complaints
- **sessions**: Express session storage

## Design System
- **Colors**: Blue primary (trust/professionalism), orange for open complaints, green for closed
- **Typography**: Roboto font family throughout, Material Icons
- **Touch Targets**: 44px minimum, 48px comfortable (h-12 buttons/inputs)
- **Spacing**: Consistent with Tailwind's 4-unit scale (p-4, gap-4, mb-4)
- **Mobile-First**: Single column layouts, bottom navigation, full-width forms

## Development Status
- ✅ Phase 1: Frontend components and routing complete
- ✅ Phase 2: Backend API integration complete
- ✅ Phase 3: Authentication middleware complete
- ✅ Phase 4: PDF upload for rope access plans complete with Replit Object Storage
- ✅ All critical bugs fixed (session detection, End Day UX, drop calculations, button states)
- ✅ Building name field added to projects
- ✅ Work session history page with tech names (/projects/:id/work-sessions)
- ✅ General messaging for residents (companyId-based routing, projectId nullable)
- ✅ Residents can submit messages even with no active projects
- ✅ Project deletion feature with confirmation dialog and cascade warnings
- 🚀 **Production-ready platform with complete feature set**

## Key Visual: High-Rise Building
The signature component displays a vertical building with:
- Dynamic floor count matching project specifications
- 4 windows per floor
- Lit windows (yellow glow) indicating completed floors based on drop progress
- Floor numbers on left side
- Progress percentage and drop counts above building
- Centered visualization on resident dashboard

## Current State
**Full-stack application ready for production use:**
- Complete authentication system with role-based access control
- PostgreSQL database with Drizzle ORM
- Work session tracking with Start Day/End Day functionality
- Daily drop logging with historical entry support and dynamic shortfall reason validation
- Building visualization showing completed floors (lit windows)
- Resident complaint management with internal notes
- PDF rope access plan uploads using Replit Object Storage
- Fully mobile-responsive with Material Design 3 aesthetic

**Recent Updates (Nov 5, 2025):**
- ✅ Fixed critical session detection bug (now checks ALL projects with async/await)
- ✅ Improved End Day UX (shortfall reason only appears when drops < target)
- ✅ Implemented proper object storage with @google-cloud/storage
- ✅ Fixed all button state transitions and NaN displays
- ✅ Added project deletion with confirmation dialog (warns about cascade deletion of work sessions, drop logs, complaints)
- ✅ Converted project details to dedicated page at /projects/:id (no longer a dialog)
- ✅ **Fixed building progress calculation bug**: `getProjectProgress()` now aggregates drops from BOTH drop_logs AND work_sessions (where endTime IS NOT NULL)
- ✅ **Fixed pie chart visibility**: Corrected API endpoint method name from `getWorkSessionsForProject()` to `getWorkSessionsByProject()`
- ✅ **Fixed project detail page**: Added completedDrops calculation to `/api/projects/:id` endpoint
- ✅ **Added cache-control headers**: Prevents stale data in UI (no-store, no-cache headers on project endpoints)
- ✅ Architect-approved and production-ready
