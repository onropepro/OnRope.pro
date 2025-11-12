# Marketing Website Build Instructions
## Rope Access Management Platform

---

## Project Setup
Create a new Replit project for a **static marketing website** using HTML, CSS, and JavaScript. This will be a separate project from the main application.

### Technology Stack
- **HTML5** for structure
- **CSS3** with Tailwind CSS for styling
- **Vanilla JavaScript** for interactions
- **Responsive design** - mobile-first approach
- Use a **Static Deployment** when publishing

### Design Direction
Create a **modern, premium, professional SaaS marketing website** with:
- **Color Scheme**: Ocean Blue primary (#1976D2), sophisticated slate backgrounds, clean white/light grays
- **Typography**: Modern sans-serif font (Roboto or Inter)
- **Style**: Clean, professional, with subtle animations
- **Mobile-first**: Must look perfect on phones, tablets, and desktops
- **Visual Elements**: High-quality mockups/screenshots, gradient accents, modern card layouts

---

## Website Structure & Content

### 1. Hero Section (Above the Fold)
**Headline**: "Streamline Your High-Rise Building Maintenance Operations"  
**Subheadline**: "The all-in-one platform for rope access companies to manage projects, track work, ensure safety compliance, and communicate with residents."

**CTA Buttons**:
- "Request a Demo" (primary button)
- "Learn More" (secondary button - scroll to features)

**Hero Image**: Mockup of the platform on mobile device showing the 4-elevation building system or dashboard

---

### 2. Problem/Solution Section
**Title**: "One Platform. Complete Control."

**Problems Solved**:
- ❌ Using spreadsheets and disconnected tools
- ❌ No real-time progress visibility
- ❌ Manual payroll calculations
- ❌ Resident complaints scattered across emails
- ❌ Safety documentation on paper

**Solution**: Centralized platform replacing all these tools with a unified, mobile-first system designed specifically for rope access companies.

---

### 3. Comprehensive Features Section
**Title**: "Everything You Need to Run Your Rope Access Business"

Display features in organized sections with detailed explanations:

#### 🏢 Multi-Job-Type Project Management
**What it does**: Manage all types of high-rise maintenance projects from a single platform.

**Key Features**:
- **Traditional 4-Elevation Rope Access Jobs**: Visualize work across North, East, South, and West building faces with independent progress tracking for each elevation
- **Parkade Pressure Cleaning**: Visual grid layout showing parking stalls with auto-scaling based on total count, track missed stalls with visual indicators
- **In-Suite Dryer Vent Cleaning**: Track completed floors and suites with percentage-based progress
- **Ground Window Cleaning**: Manage ground-level window cleaning projects
- **General Pressure Washing**: Track general maintenance and cleaning work
- **Strata Plan Organization**: Organize projects by strata plan number for multi-building management
- **PDF Rope Access Plan Uploads**: Upload and store detailed rope access plans for each project
- **Active and Completed Project Tracking**: Separate views for ongoing and finished projects
- **Floor Counts and Building Specifications**: Define building parameters and work scope

#### 👥 Complete Employee Management System
**What it does**: Comprehensive employee onboarding, tracking, and management with role-based access control.

**Key Features**:
- **Role-Based Access Control**: Five distinct roles with customized permissions
  - Company Owner: Full system access and business oversight
  - Operations Manager: Project coordination and resource management
  - Supervisor: Daily work oversight and team coordination
  - Rope Access Technician: Mobile-friendly work tracking
  - Ground Crew: Ground-level work management
- **IRATA Certification Tracking**: Record IRATA levels (1, 2, or 3) with license numbers, issue dates, and expiration dates with automated alerts
- **Driver's License Management**: Upload and store multiple driver's license documents (photos, abstracts, related documents) with secure private storage
- **Emergency Contact Information**: Store emergency contact names and phone numbers for each employee
- **Personal Details**: Track start dates, birthdays, home addresses, and phone numbers
- **Customizable Permissions**: Granular permission system for viewing/creating/editing employees, projects, financial data, and more
- **Employee Termination Tracking**: Record termination dates, reasons, and notes with ability to reactivate employees
- **Detailed Employee Cards**: View comprehensive employee information including contact details, employment history, certifications, and uploaded documents before editing

#### ⏱️ Real-Time Work Tracking & Intelligent Payroll
**What it does**: Track every minute of work with real-time session management and automated payroll calculations.

**Key Features**:
- **Live Work Session Tracking**: Clock in and out with timestamp recording
- **Billable and Non-Billable Hours**: Separate tracking for client-billable work and internal tasks
- **Manual Work Session Entry**: Add historical work sessions with full edit and delete capabilities
- **Configurable Overtime Rules**: Set custom overtime thresholds and multipliers (e.g., 1.5x after 8 hours, 2x after 10 hours)
- **Automated Labor Cost Calculations**: Real-time calculation of regular hours, overtime hours, and total labor costs
- **Pay Period Management**: Configure weekly or bi-weekly pay periods
- **Export-Ready Payroll Reports**: Generate detailed reports for payroll processing
- **Job-Type Specific Tracking**: Different tracking methods for rope access, parkade, and in-suite jobs
- **Performance Analytics**: View employee productivity metrics and work history
- **Hours Analytics Dashboard**: Comprehensive analytics showing total hours, top performers, overtime trends, and more

#### 📊 Visual Progress Tracking & Analytics
**What it does**: Innovative visualization systems that make project progress instantly clear.

**Key Features**:
- **Signature 4-Elevation Building System**: Unique visual representation showing four building faces (North, East, South, West) side-by-side with independent horizontal progress bars, dynamic floor counts, and real-time percentage displays
- **Parkade Grid Visualization**: Auto-scaling grid layout showing all parking stalls with color-coded status (completed, missed, remaining)
- **In-Suite Progress Tracking**: Simple percentage-based progress for floor-by-floor or suite-by-suite work
- **Daily Drop Logging**: Technicians log completed drops each day with support for historical entry
- **Dynamic Shortfall Reason Tracking**: When daily targets aren't met, record specific reasons (weather, equipment issues, safety concerns, etc.)
- **Remaining Work Warnings**: System alerts when logged drops exceed remaining work with override option
- **Performance Metrics Dashboard**: View session counts, hours worked, and drops completed by job type
- **Target vs. Actual Analysis**: Compare daily targets (drops per day, stalls per day, floors per day) against actual completion rates
- **Progress Percentage Calculations**: Automatic calculation of completion percentages across all elevations and job types

#### 💬 Resident Communication Portal
**What it does**: Streamline communication with building residents through a dedicated portal.

**Key Features**:
- **Complaint Submission System**: Residents submit feedback and concerns through an easy-to-use form
- **Unit Number Association**: Automatically link complaints to specific units or parking stalls
- **Two-Way Communication**: Management responds with notes that can be marked as "visible to resident"
- **Complaint Status Tracking**: Open and resolved status management
- **Photo Attachments**: Residents can attach photos to complaints
- **Worker Response System**: Staff can add internal notes and resident-visible responses
- **Notification Badge System**: iPhone-style red notification badges on resident dashboard tabs
  - "My Photos" tab shows count of new photos added since last view
  - "Complaints" tab shows count of complaints with new worker responses
- **Building Organization**: Complaints grouped by strata plan number and building
- **Complete Audit Trail**: Full history of all complaints, responses, and status changes

#### 📸 Professional Photo Management
**What it does**: Capture, organize, and share project photos with automatic unit tagging.

**Key Features**:
- **Mobile Photo Uploads**: Upload photos directly from mobile devices at the job site
- **Camera Integration**: Take photos with device camera and upload instantly
- **3-Column Responsive Gallery**: Beautiful grid layout that adapts to any screen size
- **Unit Number Tagging**: Tag photos with specific unit or parking stall numbers
- **Project Organization**: Photos automatically organized by project
- **Resident Access Control**: Residents can only view photos tagged for their unit
- **Multiple Photo Upload**: Upload multiple photos at once
- **Image Preview**: View full-size images in gallery format
- **Date Tracking**: Automatic timestamp for when photos were uploaded
- **Worker Attribution**: Track which employee uploaded each photo
- **Notification System**: Residents get notified when new photos are added to their unit

#### 🛡️ Safety & Compliance Management
**What it does**: Digital safety documentation and compliance tracking to meet industry standards.

**Key Features**:
- **Digital Harness Inspection Forms**: Daily harness safety inspection records with detailed checklists
- **Inspector Information**: Record inspector name, inspection date, and harness details
- **Manufacturer Tracking**: Track harness manufacturer and equipment specifications
- **Lanyard Type Documentation**: Record specific lanyard types and configurations
- **Toolbox Meeting Records**: Document safety meetings with attendees, topics, and dates
- **Custom Safety Topics**: Add custom discussion topics for meetings
- **Attendee Tracking**: Record all meeting participants
- **Conducted By Tracking**: Document who led each safety meeting
- **Complete Inspection History**: View all past inspections and meetings
- **Safety Dashboard**: Central location for all safety-related documentation
- **Compliance Audit Trail**: Complete record for regulatory compliance and audits

#### 💰 Multi-Service Quoting System
**What it does**: Create professional, detailed quotes for single or multiple services.

**Key Features**:
- **Multi-Service Quotes**: Include multiple services (rope access, parkade cleaning, dryer vent cleaning, etc.) in a single quote
- **Service-Specific Details**: Customize details for each service type
- **Photo Attachments**: Attach reference photos to quotes
- **Client Information**: Store client name, building details, and contact information
- **Pricing Breakdown**: Detailed pricing for each service
- **PDF Export**: Generate professional PDF quotes for client delivery
- **Quote Status Tracking**: Track sent, accepted, and rejected quotes
- **Quote History**: View all past quotes by strata plan or client
- **Notes and Comments**: Add internal notes to quotes
- **Service Descriptions**: Detailed descriptions for each quoted service

#### 🧰 Personal Gear Inventory Management
**What it does**: Track equipment assigned to each employee with detailed service history.

**Key Features**:
- **Equipment Assignment**: Assign specific gear items to individual employees
- **My Gear View**: Every employee can view their assigned equipment
- **Equipment Types**: Track various equipment categories (harnesses, ropes, carabiners, helmets, etc.)
- **Quantity Tracking**: Monitor how many of each item are assigned
- **Serial Number Management**: Record serial numbers for individual tracking
- **Service Date Tracking**: Track last service date and next service due date
- **Management Dashboard**: Full CRUD operations for company owners and managers
- **Financial Data**: Item prices and total values visible to users with financial permissions
- **Inventory Reports**: View complete equipment inventory across all employees
- **Equipment History**: Track equipment assignments over time
- **Permission-Based Access**: Employees see their gear, management sees everything

#### 🔐 Enterprise Security & Subscription Management
**What it does**: Robust security with subscription-based license verification and multi-tenant isolation.

**Key Features**:
- **License Key Verification**: Integration with Overhaul Labs Marketplace API for subscription management
- **Auto Re-Verification**: Automatic license verification on every login
- **Graceful Failure Handling**: System preserves status during API outages
- **Read-Only Mode**: Unverified companies get read-only access to all data
- **Global Mutation Guard**: Backend middleware blocks all mutations (POST/PUT/PATCH/DELETE) for unverified companies
- **Frontend Enforcement**: All Create/Edit/Delete buttons disabled in read-only mode
- **Multi-Tenant Isolation**: Complete data isolation between different companies
- **Permission-Based Data Filtering**: Backend automatically filters sensitive data based on user permissions
- **Financial Data Protection**: Zero-access enforcement for employees without financial permissions
- **Secure Document Storage**: Private object storage for sensitive documents with authenticated access
- **Session Management**: Secure session handling with cookie persistence
- **Role-Based Access Control**: Granular permissions for every feature and data type
- **Bypass Mode**: Development mode for testing without active subscription
- **Verification Status Banner**: Clear visual indicator when in read-only mode

#### 📱 Universal Profile Management
**What it does**: Allow all users to manage their personal information and account settings.

**Key Features**:
- **Personal Information**: Update name, email, phone number, and address
- **Password Management**: Change password securely
- **Emergency Contacts**: Update emergency contact information
- **License Information**: View and update driver's license and IRATA certification details
- **Company Owners**: Account deletion with cascade warnings
- **Employees**: View assigned projects and work history
- **Residents**: Manage unit number and contact preferences
- **Profile Visibility**: Control what information is visible to others
- **Data Export**: Download personal data for records

---

### 4. Who It's For Section
**Title**: "Built for Every Role in Your Organization"

Display in card format with icons:

**👔 Company Owners**
- Complete business oversight and financial control
- Employee management and hiring workflows
- License and compliance management
- Multi-project coordination across buildings
- Financial reporting and labor cost analysis
- Subscription and account management

**👨‍💼 Operations Managers**
- Project planning and coordination
- Resource allocation and scheduling
- Performance monitoring and analytics
- Multi-project oversight dashboard
- Employee assignment management
- Client communication and quoting

**👷 Supervisors**
- Daily work oversight and coordination
- Drop logging and progress tracking
- Team performance monitoring
- Work session verification
- Safety compliance checks
- Progress reporting to management

**🧗 Rope Access Technicians**
- Mobile-friendly daily drop entry
- Work session clock in/out
- Safety form submission
- View assigned projects and schedules
- Personal gear inventory access
- Real-time progress visibility

**🏘️ Building Residents**
- View project photos for their specific unit
- Submit and track maintenance complaints
- Receive updates and staff responses
- Notification badges for new updates
- Two-way communication with management
- Transparent progress visibility

---

### 5. Technology & Platform Section
**Title**: "Modern Technology. Mobile-First Design."

**Built with Enterprise-Grade Technology**:
- ✅ **Mobile-Optimized** - Works perfectly on phones, tablets, and desktop computers
- ✅ **Real-Time Updates** - See changes instantly across all devices without refreshing
- ✅ **Secure Cloud Storage** - Your data is encrypted, backed up, and protected
- ✅ **No Installation Required** - Access from any web browser, anywhere
- ✅ **Material Design 3** - Beautiful, intuitive interface following Google's design standards
- ✅ **Modern Tech Stack** - Built with React, TypeScript, PostgreSQL, and Express.js
- ✅ **Object Storage Integration** - Secure file storage for documents and photos
- ✅ **Session Persistence** - Stay logged in across sessions
- ✅ **Automatic Backups** - Your data is continuously backed up
- ✅ **Cross-Device Sync** - Start on mobile, finish on desktop seamlessly

---

### 6. Benefits Section
**Title**: "Transform Your Operations"

**💰 Save Time & Money**
- Eliminate manual data entry and spreadsheets
- Reduce administrative overhead by 70%
- Automated payroll calculations save hours weekly
- Streamlined communication reduces phone calls and emails
- Faster project completion through better coordination
- Reduce errors and rework

**📈 Increase Efficiency**
- Real-time project visibility for instant decision-making
- Mobile access means technicians log drops immediately
- Centralized communication eliminates information silos
- Automated notifications keep everyone informed
- Quick access to all project information
- Reduced coordination time between teams

**✅ Ensure Compliance**
- Digital safety records replace paper forms
- Automatic IRATA certification expiration tracking
- Complete audit trail for regulatory compliance
- Harness inspection history at your fingertips
- Toolbox meeting documentation
- Easy report generation for audits

**😊 Improve Customer Satisfaction**
- Transparent progress updates build trust
- Quick response to resident complaints
- Professional photo sharing shows work quality
- Clear communication reduces complaints
- Residents feel involved and informed
- Professional appearance enhances reputation

**🎯 Better Decision Making**
- Performance metrics show who's most productive
- Identify bottlenecks and inefficiencies
- Track labor costs against project budgets
- Spot trends in work completion rates
- Data-driven resource allocation
- Historical data informs future project planning

---

### 7. Screenshots/Demo Section
**Title**: "See the Platform in Action"

Include screenshots or mockups showing:
1. **Dashboard Overview**: Main dashboard with active projects and quick stats
2. **4-Elevation Building Visualization**: Unique visual showing all four building faces with progress bars
3. **Mobile Drop Logging**: Mobile interface for logging daily drops
4. **Employee Management Cards**: Detailed employee information cards with all data visible
5. **Parkade Grid**: Visual parking stall grid with completion status
6. **Payroll Reports**: Sample payroll report showing hours and costs
7. **Resident Portal**: Resident view with complaint submission and photo gallery
8. **Photo Gallery**: Responsive 3-column photo gallery
9. **Work Session Tracking**: Active work session with timer
10. **Safety Forms**: Digital harness inspection form

Create mockups showing the premium Material Design 3 aesthetic with ocean blue accents.

---

### 8. FAQ Section
**Title**: "Frequently Asked Questions"

**Q: Do I need to install any software?**  
A: No! The platform is entirely web-based. Access it from any device with a web browser - phones, tablets, laptops, or desktop computers. Nothing to download or install.

**Q: Is my data secure?**  
A: Absolutely. We use enterprise-grade security including encrypted data storage, secure authentication, multi-tenant isolation, and automatic backups. Your data is protected and only accessible by your authorized users.

**Q: Can I access it from my phone?**  
A: Yes! The platform is designed mobile-first specifically for rope access workers who need to log drops and track work from their phones on job sites. It works beautifully on any screen size.

**Q: What happens if I lose internet connection?**  
A: The platform requires an internet connection to sync data. However, you can access it as soon as you're back online, and all your data will be waiting for you.

**Q: How do I get started?**  
A: Contact us to set up your company account. We'll help you configure your organization, add your first employees, and create your first project. Training and support are included.

**Q: Can I customize permissions for different employees?**  
A: Yes! The platform has a granular permission system. You can control exactly what each employee can view, create, edit, or delete. Common roles like Operations Manager, Supervisor, and Technician come with preset permissions, but you can customize everything.

**Q: How does the subscription model work?**  
A: The platform uses license key verification. Unverified accounts get read-only access to all data, while verified accounts have full access to create and edit. Contact us for licensing details.

**Q: Can residents access the platform?**  
A: Yes! Residents get their own portal where they can view photos of their unit, submit complaints, and communicate with your team. They only see information relevant to their specific unit or parking stall.

**Q: Do you provide training?**  
A: Yes! We provide comprehensive onboarding and training to help you get started. The interface is intuitive and follows familiar design patterns, so most users adapt quickly.

**Q: Can I export my data?**  
A: Yes! You can export payroll reports, work session data, and other information for your records or external processing.

---

### 9. Call-to-Action Section
**Title**: "Ready to Modernize Your Rope Access Operations?"

**Primary CTA**: "Request a Demo"  
**Secondary CTA**: "Contact Us for More Information"

Include a contact form with fields:
- Name
- Company Name
- Email
- Phone Number
- Number of Employees
- Message/Questions

---

### 10. Footer
- **Product**: Features, Who It's For, Platform Benefits
- **Company**: About, Contact, Support
- **Legal**: Privacy Policy, Terms of Service, Security
- **Contact**: Email address, Phone number (if applicable)
- **Social Media**: Links to social media profiles (if applicable)
- © 2025 Rope Access Management Platform. All rights reserved.

---

## Technical Requirements

### 1. Responsive Design
- Mobile-first approach (320px and up)
- Tablet optimization (768px and up)
- Desktop optimization (1024px and up)
- Large screen support (1920px and up)
- Touch-friendly buttons (minimum 44px tap targets)

### 2. Performance
- Fast loading times (under 3 seconds)
- Optimize all images (WebP format when possible)
- Lazy loading for images below the fold
- Minified CSS and JavaScript
- Efficient code structure

### 3. SEO Optimization
**Page Title**: "Rope Access Management Platform - Complete Solution for High-Rise Maintenance"

**Meta Description**: "Complete project management platform for rope access companies. Track work in real-time, manage employees, ensure safety compliance, and communicate with residents. Mobile-first design built specifically for high-rise building maintenance operations."

**Structured Data**: Implement schema.org markup for better search visibility

**Heading Hierarchy**:
- Single H1: Main page headline
- H2: Major sections (Features, Benefits, etc.)
- H3: Subsections within features
- Proper semantic HTML throughout

**Alt Text**: Descriptive alt text for all images

**URL Structure**: Clean, descriptive URLs

### 4. Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader friendly
- Proper ARIA labels
- Color contrast ratios meet standards
- Focus indicators on interactive elements

### 5. Interactive Elements
- **Smooth Scroll**: Smooth scrolling to sections when clicking navigation
- **Scroll Animations**: Subtle fade-in animations as sections come into view
- **Hover Effects**: Professional hover effects on buttons and cards
- **Form Validation**: Client-side validation for contact forms
- **Loading States**: Visual feedback for form submissions

### 6. Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Design Inspiration & Style Guide

### Visual Style
Look at modern SaaS marketing sites for inspiration:
- **Linear.app** - Clean, minimal, beautiful animations
- **Notion.so** - Clear value proposition, great feature sections
- **Asana.com** - Professional, organized content
- **Monday.com** - Colorful but professional, clear benefits

### Key Design Principles
1. **Plenty of White Space**: Don't cram content together
2. **Clear Visual Hierarchy**: Most important information stands out
3. **Professional Photography**: Use high-quality mockups and screenshots
4. **Consistent Spacing**: Use a spacing scale (8px, 16px, 24px, 32px, 48px, 64px)
5. **Limited Color Palette**: Ocean blue primary, grays for backgrounds, white for cards
6. **Modern Typography**: Clear, readable fonts with proper sizing
7. **Subtle Animations**: Enhance but don't distract
8. **Mobile-First**: Design for mobile, enhance for desktop

### Color Palette
- **Primary Blue**: #1976D2 (Ocean Blue)
- **Dark Blue**: #0D47A1 (for dark mode and accents)
- **Light Blue**: #42A5F5 (for highlights)
- **Background Light**: #F5F5F5
- **Background White**: #FFFFFF
- **Text Dark**: #212121
- **Text Medium**: #757575
- **Text Light**: #BDBDBD

### Typography Scale
- **H1 (Hero)**: 48px - 64px (mobile: 32px - 40px)
- **H2 (Sections)**: 36px - 48px (mobile: 28px - 32px)
- **H3 (Subsections)**: 24px - 32px (mobile: 20px - 24px)
- **Body**: 16px - 18px
- **Small**: 14px

---

## Deployment Instructions

### Publishing on Replit

1. **Prepare Your Files**:
   - Ensure all HTML, CSS, and JS files are in the root directory
   - Optimize all images
   - Test responsiveness and functionality

2. **Open Publishing Tool**:
   - In Replit, click "All tools" in the left sidebar
   - Select "Publishing"

3. **Configure Static Deployment**:
   - Select "Static" deployment type
   - Click "Set up your published app"
   - Choose a subdomain (e.g., `rope-access-platform`)
   - Set public directory to `/` (root)
   - Build command: leave empty (not needed for static HTML)
   - No deployment secrets needed

4. **Publish**:
   - Click "Publish" button
   - Wait for deployment to complete
   - Your site will be live at `https://[subdomain].replit.app`

5. **Test Your Site**:
   - Visit the published URL
   - Test on mobile device
   - Check all links and forms
   - Verify responsive design

6. **Custom Domain (Optional)**:
   - In deployment settings, click "Link a domain"
   - Enter your custom domain
   - Add provided A and TXT records to your domain registrar
   - Wait for DNS propagation (up to 48 hours)

---

## Final Checklist Before Launch

### Content
- [ ] All feature descriptions are accurate and complete
- [ ] No spelling or grammar errors
- [ ] All links work correctly
- [ ] Contact form is functional
- [ ] FAQ answers are helpful and complete

### Design
- [ ] Looks great on mobile (320px - 480px)
- [ ] Looks great on tablet (768px - 1024px)
- [ ] Looks great on desktop (1280px+)
- [ ] All images load properly
- [ ] Animations are smooth and subtle
- [ ] Color contrast meets accessibility standards

### Technical
- [ ] Page loads in under 3 seconds
- [ ] All images are optimized
- [ ] Meta tags are properly set
- [ ] Alt text on all images
- [ ] Heading hierarchy is correct
- [ ] Forms have validation
- [ ] Site works in all major browsers

### SEO
- [ ] Unique page title set
- [ ] Meta description is compelling
- [ ] Proper heading structure (H1, H2, H3)
- [ ] Images have descriptive alt text
- [ ] Clean URL structure
- [ ] Schema markup implemented (optional but recommended)

---

## Additional Notes

- **Premium Feel**: This is enterprise software for professional rope access companies. The website should feel polished, trustworthy, and professional.
- **Real Features**: Use actual feature descriptions from the platform, not generic placeholder text. Be specific about what the platform does.
- **Trust Signals**: Emphasize security, reliability, mobile-first design, and modern technology throughout the site.
- **Mobile Priority**: Rope access workers are on phones at job sites. The mobile experience must be exceptional.
- **Clear Value**: Every section should clearly communicate the value and benefits to the user.
- **Scannable Content**: Use bullet points, short paragraphs, clear headings, and visual breaks. Users should be able to scan and understand quickly.

---

## Support

For questions or clarifications about any features described in this document, refer to the main application at the Replit URL or contact the platform owner.

---

**This document contains everything needed to build a comprehensive, professional marketing website for the Rope Access Management Platform. Copy all instructions and provide them to your web developer or design agent.**
