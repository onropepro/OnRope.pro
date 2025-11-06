# Rope Access Management Platform

## Overview
A mobile-first management platform for rope access building maintenance operations (window washing, dryer vent cleaning, pressure washing). The platform provides role-based access for Company accounts, Residents, Operations Managers, Supervisors, and Rope Access Technicians.

## Key Features
- **Visual Progress Tracking**: High-rise building visualization with lit windows showing completed drops
- **Drop Logging**: Technicians can log daily drops with historical entry capability
- **Complaint Management**: Residents can submit feedback; management can track and respond with notes
- **Project Management**: Create projects with strata plan numbers, floor counts, and rope access plans; delete projects with cascade warnings
- **Employee Management**: Company-controlled onboarding with role-based permissions
- **Project Photo Gallery**: All staff can upload photos from camera or library, displayed in 3-column gallery on project detail page

## Tech Stack
- **Frontend**: React + TypeScript with Wouter routing
- **Backend**: Express.js with custom authentication
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Replit Object Storage for PDF rope access plans and project photo galleries
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
- **projects**: Strata plan tracking with floor counts, drops, completion status, and imageUrls array for photo gallery
- **drop_logs**: Daily drop entries per project per tech with date flexibility
- **complaints**: Resident feedback with status tracking
- **complaint_notes**: Tech/management responses to complaints
- **sessions**: Express session storage

## Design System
- **Colors**: Blue primary (trust/professionalism), yellow warning for lit windows, orange for open complaints, green for closed
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

## Key Visual: 4-Elevation Building System
The signature component displays FOUR buildings side-by-side representing the 4 elevations (North, East, South, West):
- Each elevation has its own vertical building visualization with horizontal progress bars
- Dynamic floor count matching project specifications
- Each floor is a thin horizontal bar (16px height)
- **Horizontal progress fill**: Yellow bar fills from LEFT TO RIGHT on each floor
- **Independent progress tracking**: Each elevation shows its own completion percentage
- Progress formula per elevation: `Math.min(100, (completedDropsElevation / totalDropsElevation) × 100)`
- Overall progress: Sum of all completed drops / sum of all total drops
- Yellow fill width matches progress percentage (e.g., 16% = bar fills 16% from left edge)
- Floor numbers displayed on left side of each building
- Progress percentage and drop counts shown above each building
- Visualization displayed on: Resident Dashboard, Project Details, Management Dashboard, Work Session History

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
- Universal profile management for all users

**Recent Updates (Nov 6, 2025):**
- ✅ **Employee List Enhancement**: Displays employee names and IRATA levels instead of emails
- ✅ **Universal Profile Page**: All users (residents, staff, company) can update personal information and change passwords
  - Profile navigation button in all dashboard headers
  - Role-specific fields (company name, unit number, etc.)
  - Password change with verification
  - PATCH `/api/user/profile` and `/api/user/password` endpoints
- ✅ **Company Account Deletion**: Company owners can delete their entire account with cascade
  - DELETE `/api/user/account` endpoint (company role only)
  - Password verification required
  - Cascades to all employees, projects, work sessions, drop logs, and complaints via database constraints
  - Confirmation dialog with warnings
- ✅ **UI Improvements**: 
  - Mobile-responsive dropdown tabs on management dashboard
  - "View PDF" changed to "View Rope Access Plan" across UI
  - Project deletion restricted to company and operations_manager roles only
- ✅ **Project Photo Gallery**: Staff can now upload photos from camera or library to projects
  - POST `/api/projects/:id/images` endpoint with staff-only access (company, operations_manager, supervisor, rope_access_tech)
  - Mobile-first camera capture support with `capture="environment"` attribute
  - File picker for library selection
  - 3-column responsive gallery grid on ProjectDetail page
  - Images stored in Replit Object Storage with URLs in `imageUrls` array
  - Proper cache invalidation after uploads
  - 5MB file size limit with image/* mimetype validation

**Updates (Nov 5, 2025):**
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
- ✅ **Performance tab**: Moved "Overall Target Performance" pie chart to dedicated Performance tab in management dashboard
- ✅ **Per-employee performance charts**: Added individual pie charts for each technician showing Target Met vs Below Target sessions
- ✅ **Horizontal progress bar visualization**: Changed building from window-by-window lighting to continuous horizontal fill (left-to-right) on all floors
- ✅ **IRATA level validation**: Employee creation now requires IRATA level selection for rope access technicians (validation enforced with proper form control binding)
- ✅ **Progress percentage clamping**: Added Math.min(100, ...) to prevent visual overflow on data anomalies
- ✅ **Complaints tab**: Added dedicated Complaints tab to management dashboard showing all resident feedback across all projects with navigation to complaint details
- ✅ **Database reset**: All project data cleared from database while preserving user accounts (residents, techs, management)
- ✅ **4-Elevation System Complete**: Projects now track North/East/South/West drops independently with:
  - Create project form with 4 separate elevation input fields (2x2 grid)
  - End Day dialog with elevation dropdown selection
  - Backend storage and validation for elevation-specific drops
  - Building visualization showing 4 buildings side-by-side
  - Independent progress tracking per elevation
  - Fixed `||` to `??` in fallback logic to preserve zero values
  - GET `/api/projects/:id` returns all elevation-specific completed drops
- ✅ **Mobile-responsive tabs**: Management dashboard tabs now use horizontal scrolling on mobile (no more cramped/overlapping text)
- ✅ **Improved error handling**: Employee creation now shows clear "Email address is already in use" message for duplicate emails (defensive error checks for Postgres constraint violations)
- ✅ **CRITICAL FIX**: Added `app.set('trust proxy', 1)` to fix session cookies in production (sessions now persist correctly behind Replit's HTTPS proxy)
- ✅ Architect-approved and production-ready
