# OnRope.pro - Codebase Overview

## What is OnRope.pro?

OnRope.pro is a **comprehensive, enterprise-grade SaaS platform** designed specifically for the **rope access and high-rise building maintenance industry**. It's a mobile-first web application that streamlines project management, workforce tracking, safety compliance, financial operations, and resident communication for rope access companies.

---

## Who is it For?

### Primary Users

| User Type | Description |
|-----------|-------------|
| **Rope Access Companies** | From small operations to enterprise-scale organizations managing technicians and projects |
| **Operations Managers** | Managing daily operations, projects, and safety compliance |
| **Rope Access Technicians** | Field workers tracking work sessions, certifications, and hours |
| **Supervisors & Managers** | Project oversight and employee management |
| **Property Managers** | Building owners viewing vendor performance and work history |
| **Residents** | Strata building occupants with complaint management and work visibility |
| **Platform Administrators** | Platform-wide oversight and company management |

### Employee Roles Supported

- Owner/CEO
- Human Resources
- Accounting
- Operations Manager
- General Supervisor
- Rope Access Supervisor
- Account Manager
- Supervisor
- Rope Access Technician
- Manager
- Ground Crew
- Ground Crew Supervisor
- Labourer

---

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **Tailwind CSS** with custom design system
- **shadcn/ui** component library (Radix UI primitives)
- **React Hook Form** with Zod validation
- **TanStack React Query** for server state management
- **Additional**: Lucide icons, Recharts, Leaflet (mapping), FullCalendar, jsPDF, Framer Motion

### Backend
- **Node.js** with Express.js (TypeScript)
- **Drizzle ORM** for database interaction
- **Passport.js** for authentication
- **WebSockets** for real-time updates

### Database
- **PostgreSQL** (hosted on Neon - serverless)
- **30+ tables** supporting complex multi-tenant architecture

### External Services
- **Stripe** - Subscription management (4 pricing tiers, USD/CAD)
- **Geoapify** - Address autocomplete and geocoding
- **Google Gemini AI** - Logbook image scanning
- **Resend** - Email service
- **Google Cloud Storage** - File/document storage

---

## Project Structure

```
/home/user/OnRope.pro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # 80+ page components
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   ├── i18n/          # Internationalization (EN/FR)
│   │   └── App.tsx        # Main routing
│   └── index.html
├── server/                 # Express backend
│   ├── routes.ts          # API endpoint definitions (17,000+ lines)
│   ├── index.ts           # Server setup
│   ├── db.ts              # Database connection
│   ├── stripe-service.ts  # Payment integration
│   ├── objectStorage.ts   # File storage service
│   ├── encryption.ts      # Data encryption
│   └── websocket-hub.ts   # Real-time updates
├── shared/                 # Shared code
│   ├── schema.ts          # Drizzle ORM schema (2,500+ lines)
│   ├── jobTypes.ts        # Job type configurations
│   └── stripe-config.ts   # Subscription tiers
├── db/                     # Database migrations
└── migrations/             # Drizzle migration files
```

---

## Core Features & Functionality

### 1. Multi-Tenant Architecture
- Complete data isolation between companies
- Multiple user roles with granular permissions
- Company-level configuration (branding, pay periods, custom job types)

### 2. Project Management

**5 Job Categories with Distinct Progress Tracking:**

| Category | Specialized Job Types |
|----------|----------------------|
| **Building Maintenance** | Window cleaning, dryer vents, building wash, gutter cleaning, painting, caulking, inspection |
| **NDT (Non-Destructive Testing)** | Ultrasonic, magnetic particle, dye penetrant, radiographic, eddy current, thermographic, and more |
| **Rock Scaling** | Loose rock removal, bolting, mesh installation, shotcrete, and more |
| **Wind Turbine** | Blade inspection/repair, leading edge, lightning protection, and more |
| **Oil & Gas** | Tank operations, pipeline, refinery, offshore, confined space, and more |

**Progress Tracking Types:**
- **Drops** - Elevation-based work (per building facade: North, East, South, West)
- **Hours** - Standard time tracking
- **Suites** - Per-unit residential work
- **Stalls** - Parking/parkade work
- **Floors** - Floor-based progress

### 3. Work Session Management
- GPS check-in/out with location tracking
- Elevation-specific drop tracking per facade
- Multi-project daily support
- Time tracking (regular, overtime, double-time hours)
- Non-billable work sessions (training, errands)
- Shortfall reporting and explanations

### 4. Employee & Technician Management
- **IRATA & SPRAT Certification Tracking**
  - Automated verification via web scraping
  - Screenshot verification upload
  - Expiration monitoring and alerts
  - Logbook hours baseline tracking
- First Aid certification tracking
- Driver's license tracking with expiry
- Emergency contact and medical information
- Bank information for payroll
- Profile photos and resume uploads
- **Rope Access Specialties** - technicians select expertise areas

### 5. Technician Job Board & Marketplace
- Companies post employment opportunities
- Technicians opt-in for employer visibility
- Profile visibility with skills and certifications
- Job applications system
- Referral system with unique codes
- **Technician PLUS Access** - premium tier with enhanced features

### 6. Safety & Compliance

| Form Type | Purpose |
|-----------|---------|
| **Daily Harness Inspections** | Pre-work PPE/equipment inspection with category checklists |
| **FLHA Forms** | Field Level Hazard Assessments for rope access operations |
| **Toolbox Meetings** | Safety briefings with topic checklists and digital signatures |
| **Incident Reports** | Comprehensive incident documentation with root cause analysis |
| **Method Statements** | IRATA-compliant Safe Work Method Statements |

**Equipment Categories Tracked:**
- Harness & seat systems
- Work positioning & backup ropes
- Descenders, Ascenders
- Backup devices & fall arrest
- Connectors & carabiners
- Anchors & rigging hardware
- Helmet & head protection
- Edge & rope protection
- Rescue kits

### 7. Gear & Equipment Inventory
- Equipment database with categories
- Serial number tracking for individual items
- Daily inspection tracking
- Maintenance schedules
- Equipment damage history and retirement tracking
- Employee gear assignments
- Self-kit management for technicians

### 8. Payroll & Financial Management

**Payroll Configuration:**
- Configurable pay periods (semi-monthly, weekly, bi-weekly, monthly, custom)
- Overtime thresholds (daily/weekly/none)
- Double-time thresholds
- Multiple pay day support

**Features:**
- Automatic overtime/double-time calculations
- Timesheet generation from work sessions
- Invoice generation with work summaries
- Expense tracking
- Peace work support (drop-based pricing)

### 9. Quotes & Estimating
- Multi-service quote builder
- CRM pipeline tracking (draft → sent → in-review → accepted → rejected → completed)
- Service pricing with location and elevation types
- PDF generation for professional quotes
- Quote analytics and conversion tracking

### 10. Resident Portal & Communication
- Strata-linked resident accounts via unique codes
- Complaint/maintenance request system
- Two-way communication with management
- Work history viewing
- Photo galleries
- Building progress visualization

### 11. Property Manager Interface
- Multi-vendor management ("My Vendors" dashboard)
- Company Safety Rating (CSR) viewing
- Building portfolio management
- Service history tracking
- Anchor inspection certificate uploads

### 12. Scheduling
- Full calendar integration (FullCalendar)
- Drag-and-drop scheduling
- Job assignments with time windows
- Employee time off tracking
- Multi-resource timeline view
- Recurring job support

### 13. Analytics & Reporting
- Billable vs. non-billable hours analysis
- Employee productivity metrics
- Project labor costs
- Active worker tracking
- IRATA hours logging with task categorization
- Customizable dashboards with rearrangeable metric cards

### 14. Document Management
- Company policy storage
- Document review system with sign-off tracking
- E-signature capture
- PDF generation for reports and forms
- Audit trails
- Cloud storage integration

### 15. White-Label Branding
- Custom logo upload
- Brand colors configuration (primary, secondary, tertiary, quaternary)
- Dynamic CSS theming throughout platform
- Subscription-gated feature

### 16. Internationalization
- English and French support
- Language preference per user
- Localized date formatting
- Currency localization (USD/CAD)

---

## Subscription Tiers

| Tier | Projects | Seats | Features |
|------|----------|-------|----------|
| **Basic** | 1 | 1 | Core features |
| **Starter** | 3 | 3 | Core + additional capacity |
| **Premium** | 10 | 10 | Full features |
| **Enterprise** | Unlimited | Unlimited | All features + priority support |

**Add-ons:**
- Additional seats
- Additional projects
- White-label branding

---

## Security & Compliance

### Authentication & Authorization
- Session-based authentication with Passport.js
- Secure HTTP-only cookies
- Role-based access control (RBAC)
- Permission-based API filtering
- Account suspension capability
- Rate limiting on sensitive operations

### Data Protection
- AES-256-GCM encryption for sensitive data (SIN, bank info, medical conditions)
- Multi-tenant data isolation
- Secure API endpoints
- Environment-based secrets management

### Safety Compliance
- IRATA standards support
- Mandatory daily inspections
- Digital signatures for documents
- Complete audit trails
- Incident tracking and analysis

---

## Key Page Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **Dashboard** | Main company operations view | `client/src/pages/Dashboard.tsx` |
| **TechnicianPortal** | Technician work interface | `client/src/pages/TechnicianPortal.tsx` |
| **ProjectDetail** | Project management | `client/src/pages/ProjectDetail.tsx` |
| **Schedule** | Calendar scheduling | `client/src/pages/Schedule.tsx` |
| **Payroll** | Payroll management | `client/src/pages/Payroll.tsx` |
| **Quotes** | Quote generation | `client/src/pages/Quotes.tsx` |
| **GearInventory** | Equipment management | `client/src/pages/GearInventory.tsx` |
| **HoursAnalytics** | Work analytics | `client/src/pages/HoursAnalytics.tsx` |
| **SafetyForms** | Safety form hub | `client/src/pages/SafetyForms.tsx` |
| **PropertyManager** | PM dashboard | `client/src/pages/PropertyManager.tsx` |
| **ResidentDashboard** | Resident portal | `client/src/pages/ResidentDashboard.tsx` |
| **SuperUser** | Platform administration | `client/src/pages/SuperUser.tsx` |

---

## Database Schema Overview

**Core Tables (30+):**
- `users` - Multi-role user system with 80+ fields
- `buildings` - Global building database
- `projects` - Project management with elevation tracking
- `workSessions` - Daily work tracking with GPS
- `nonBillableWorkSessions` - Training/errand hours
- `dropLogs` - Elevation-specific progress
- `gearItems` - Equipment database
- `gearAssignments` - Equipment allocation
- `gearSerialNumbers` - Serial number tracking
- `harnessInspections` - Daily safety checks
- `toolboxMeetings` - Safety meetings
- `flhaForms` - Hazard assessments
- `incidentReports` - Incident tracking
- `methodStatements` - Work planning docs
- `complaints` - Resident requests
- `quotes` - Quote generation
- `quoteServices` - Quote line items
- `payPeriodConfig` - Payroll configuration
- `payPeriods` - Pay period tracking
- `jobPostings` - Job board listings
- `jobApplications` - Job applications
- `notifications` - User notifications
- `companyDocuments` - Document storage

---

## Summary

**OnRope.pro** is a sophisticated, production-ready SaaS platform that combines:

- **Enterprise Features**: Multi-tenancy, subscriptions, white-labeling, comprehensive analytics
- **Industry-Specific Tools**: Elevation-based progress tracking, IRATA/SPRAT certification management, safety compliance forms
- **Marketplace Functionality**: Technician job board, company-to-technician recruitment
- **Modern Architecture**: React 18, TypeScript, PostgreSQL, real-time updates via WebSockets

The platform serves as a complete business management solution for rope access companies, handling everything from daily work tracking to payroll, safety compliance, and customer communication.
