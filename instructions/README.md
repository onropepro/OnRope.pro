# Rope Access Management System

A comprehensive multi-tenant management platform for rope access companies that facilitates work session tracking, employee management, gear inventory, safety documentation, and resident communication. The platform provides enterprise-grade tools for managing rope access operations with complete audit trails and safety compliance.

## Project Overview

This application provides:

- **Multi-tenant architecture** supporting companies with employees across multiple roles (Rope Access Techs, Supervisors, Managers, Ground Crew)
- **Work session tracking** with GPS location, elevation-specific drops, and time management for accurate payroll
- **Project management** for window cleaning, dryer vent cleaning, building wash, and custom job types
- **Gear inventory system** with daily inspection tracking and maintenance schedules
- **Safety documentation** including FLHA forms, toolbox meetings, and harness inspections
- **Resident portal** for complaints, work history, and communication with management companies
- **Timesheet & payroll** with configurable pay periods, overtime calculations, and detailed reporting
- **Document generation** for inspection reports, safety certificates, and compliance documentation
- **Real-time dashboards** for operations managers to track daily progress and safety metrics
- **Payment processing** through Stripe for resident services and management company billing
- **Object storage integration** for inspection PDFs, photos, and safety documentation
- **Employee management** with IRATA certifications, driver's license tracking, and emergency contacts
- **White-label branding** for companies to customize resident-facing portals

## Technology Stack

- **Frontend**: React.js with TypeScript, Tailwind CSS, shadcn/ui components, Wouter routing
- **Backend**: Express.js, Node.js with TypeScript ES modules  
- **Database**: PostgreSQL with Drizzle ORM (Neon serverless)
- **Authentication**: Passport.js with session management and role-based access control
- **Payment Processing**: Stripe integration (future implementation)
- **File Storage**: Replit Object Storage for PDFs, images, and documents
- **PDF Generation**: jsPDF for inspection reports and safety documentation
- **Real-time Features**: WebSockets for live work session updates
- **Maps Integration**: Leaflet for GPS tracking and project locations
- **Calendar**: FullCalendar for scheduling and project timelines
- **Data Visualization**: Recharts for analytics and reporting

## Multi-Tenant Architecture

The system supports a hierarchical structure:

### Company Level
- **License Management**: Subscription-based licensing with seat limits
- **Branding**: White-label options for resident portals
- **Document Storage**: Company policies and safety manuals
- **Pay Configuration**: Customizable pay periods and overtime rules

### Employee Roles
- **Operations Manager**: Full system access, all reports and configuration
- **Manager**: Project management, employee management, reporting
- **Supervisor**: Work session oversight, safety documentation
- **Rope Access Tech**: Work session tracking, gear inspections, drops logging
- **Ground Crew**: Limited access for support operations
- **Ground Crew Supervisor**: Ground operations management

### Resident Access
- **Strata-linked Accounts**: Residents link to companies via unique codes
- **Complaint Management**: Submit and track maintenance requests
- **Work History**: View completed work on their units
- **Communication**: Direct messaging with property managers

## Core Features

### Work Session Management
- **GPS Check-in/out**: Location verification at session start/end
- **Elevation Tracking**: Separate drop counts for North, East, South, West elevations
- **Time Tracking**: Automatic calculation of regular, overtime, and double-time hours
- **Shortfall Reporting**: Required explanations when daily targets aren't met
- **Multi-project Support**: Employees can work across multiple projects daily

### Gear & Safety Management
- **Daily Inspections**: Mandatory pre-work harness and equipment checks
- **Digital Forms**: FLHA, toolbox meetings with signature capture
- **Equipment Database**: Track harnesses, lanyards, descenders, rescue kits
- **Maintenance Schedules**: Automated reminders for gear servicing
- **Incident Reporting**: Comprehensive incident tracking and analysis

### Project Management
- **Job Types**: Window cleaning, dryer vent, building wash, parkade cleaning, custom
- **Progress Tracking**: Daily drops vs. targets with visual indicators
- **Document Storage**: Rope access plans, building photos, safety docs
- **Employee Assignment**: Assign teams to projects with role requirements
- **Timeline Management**: Start/end dates with completion forecasting

### Financial Management
- **Timesheet Generation**: Automated from work sessions
- **Pay Period Processing**: Semi-monthly, weekly, bi-weekly, monthly, custom
- **Overtime Calculations**: Configurable thresholds and multipliers
- **Invoice Generation**: Client billing with detailed work summaries
- **Expense Tracking**: Equipment purchases, maintenance costs

## Getting Started

### Prerequisites

- Node.js (v20+)
- PostgreSQL database (Neon)
- Replit account (for deployment)

### Installation

1. The repository is already cloned in your Replit environment

2. Install dependencies (already complete):
   ```
   npm install
   ```

3. Environment variables are configured:
   ```
   DATABASE_URL=postgresql://[configured]
   PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT
   ```

4. Database schema is deployed:
   ```
   npm run db:push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Development Scripts

- `npm run dev` - Start development server (Express + Vite)
- `npm run build` - Build production application
- `npm run db:push` - Sync database schema changes
- `npm run db:push --force` - Force sync schema (use carefully)

## Database Schema

### Core Tables
- **users** - Multi-role user system (companies, employees, residents)
- **projects** - Job management with progress tracking
- **workSessions** - Daily work tracking with GPS and drops
- **gearInventory** - Equipment database with maintenance tracking
- **harnessInspections** - Daily safety inspection records
- **complaints** - Resident maintenance requests
- **timesheets** - Generated payroll records
- **flhaForms** - Field level hazard assessments
- **toolboxMeetings** - Safety meeting documentation
- **projectPhotos** - Before/after documentation

### Supporting Tables
- **clients** - Property managers and building owners
- **dropLogs** - Elevation-specific progress tracking
- **customJobTypes** - Company-specific job categories
- **payPeriods** - Configured pay period instances
- **companyDocuments** - Policy and manual storage
- **projectTasks** - Detailed task breakdowns
- **gearMaintenanceLogs** - Service history

## Security & Compliance

### Data Protection
- **Role-based Access**: Granular permissions per employee role
- **Multi-tenant Isolation**: Complete data separation between companies
- **Session Security**: Secure session management with timeouts
- **Password Policies**: Temporary passwords for new employees

### Safety Compliance
- **IRATA Standards**: Support for IRATA certification tracking
- **Daily Inspections**: Mandatory equipment checks before work
- **Digital Signatures**: Legal compliance for safety documents
- **Audit Trail**: Complete history of all safety-critical actions

### Financial Compliance
- **Payment Security**: PCI compliance through Stripe
- **Invoice Records**: Immutable billing history
- **Time Tracking**: Legally compliant timesheet generation

## Deployment

### Production Deployment
- Application runs on Replit infrastructure
- PostgreSQL hosted on Neon (serverless)
- Object Storage via Replit/Google Cloud Storage
- Automatic SSL and domain management

### Environment Configuration
- Development database auto-configured
- Production database created on publish
- Environment variables managed by Replit
- Secrets stored securely

## Documentation Standards

### Instruction Documents
All system documentation follows strict standards:
- **Versioning**: Semantic versioning (vX.X)
- **Status Tracking**: ACTIVE | DRAFT | DEPRECATED | PRODUCTION-READY ✅
- **Dependency Mapping**: System-wide impact analysis
- **Testing Requirements**: Comprehensive test coverage

### Document Categories
1. **Foundation Documents**: Core principles and standards (numbered, all caps)
2. **System Instructions**: Feature-specific documentation (kebab-case, versioned)
3. **Testing Guides**: Pathway and scenario testing
4. **Reference Documents**: Quick lookup guides

## Support & Maintenance

### Monitoring
- **System Health**: Real-time performance metrics
- **Error Tracking**: Comprehensive error logging
- **Usage Analytics**: User behavior and feature adoption
- **Safety Metrics**: Compliance and incident tracking

### Backup & Recovery
- **Database Backups**: Automated daily backups
- **Document Archive**: Version history for all uploads
- **Audit Logs**: Complete activity history
- **Disaster Recovery**: Documented recovery procedures

## Future Enhancements

### Planned Features
- **Mobile App**: Native iOS/Android for field workers
- **Offline Mode**: Work session caching for poor connectivity
- **AI Integration**: Predictive maintenance and risk assessment
- **IoT Sensors**: Equipment usage tracking
- **Advanced Analytics**: ML-powered insights and forecasting

### Integration Roadmap
- **Accounting Software**: QuickBooks, Xero integration
- **Weather APIs**: Automated weather-based scheduling
- **Building Management**: BMS integration for access control
- **Insurance Platforms**: Direct claim submission

## License

This project is proprietary software. All rights reserved.

## Acknowledgments

This comprehensive rope access management system is designed to support the critical work of rope access professionals who maintain and service buildings across North America. The system prioritizes safety, compliance, and operational efficiency to ensure "It Just Works" for every user, every time.

Built with a focus on reliability, safety, and scalability to support the growth of rope access companies from small operations to enterprise-scale organizations.