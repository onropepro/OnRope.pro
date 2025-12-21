# Client Relationship Management (CRM)

The CRM system provides centralized management of your clients - property managers, strata companies, and building owners. Each client can have multiple buildings (identified by LMS numbers) that they manage. Access the CRM from the Clients section in your dashboard.

## What You Can Do

- **Store Client Information** - Keep all contact details, addresses, and billing information in one place
- **Manage Multiple Buildings** - Link any number of buildings to a single client record
- **Auto-Fill Project Details** - Select a client when creating projects to automatically populate building information
- **Track Building Specifications** - Store floor counts, drop targets, parking stalls, and unit counts permanently

## The Golden Rule: Clients Carry Building Data

The client-building relationship is hierarchical. One client can manage multiple buildings. Each client record stores:

- **Contact Information** - Name, phone, email, address
- **LMS Numbers** - Array of buildings with strata plans, addresses, and specifications
- **Billing Details** - Separate billing address if different from service address

When creating a new project, select a client from your CRM to auto-populate building details like strata plan number, address, floor count, and daily drop targets.

## Problems Solved for Company Owners

The CRM eliminates common pain points for rope access company owners:

- **Repeated Data Entry Eliminated** - Building specs auto-fill into new projects from client LMS records. One-time entry, permanent records.
- **Scattered Information Centralized** - All contact details, building specs, and related data organized in one digital space instead of Excel, texts, and paper.
- **Data Entry Errors Prevented** - Autofill intelligence eliminates manual entry errors. No more transposing floor counts or misspelling addresses.
- **Faster Project Setup** - Project creation in under 2 minutes instead of 15. Select client, select building, all fields auto-populate.
- **Clear ROI** - System pays for itself with 20+ hours saved monthly per employee.

## Problems Solved for Operations Managers

- **Building Specs for Equipment Planning** - Floor count and parking stalls accessible to anyone with view permissions. Right gear, right building, every time.
- **Accurate Job Duration Estimates** - Floor count and drop targets stored per building help determine how long jobs take.

## Client Data Structure

### Contact Information

Primary contact details for the client relationship:

- First Name, Last Name
- Company Name
- Phone Number
- Email Address
- Address and Billing Address

### LMS Numbers (Building Portfolio)

Each LMS number represents a building the client manages. Store detailed building specs for autofill:

- **Strata Plan Number** - Unique building identifier (LMS, EMS, VIS depending on region)
- **Building Name** - Display name for the building
- **Address** - Full street address
- **Stories** - Total floor count
- **Units** - Number of residential or commercial units
- **Parking Stalls** - Parkade stall count
- **Daily Drop Target** - Expected drops per day for window cleaning
- **Elevation Drops** - Drop counts for North, East, South, and West sides

## Adding a New Client

Follow these steps to add a new client:

- **Step 1: Enter Contact Details** - Add the client's name, company, phone number, and primary address.
- **Step 2: Add LMS Numbers / Buildings** - Click "Add Building" to add each property the client manages. Enter strata plan number, address, floor count, and building specifications.
- **Step 3: Configure Drop Targets (Optional)** - For rope access buildings, enter daily drop targets and elevation-specific counts. These auto-populate when creating window cleaning projects.
- **Step 4: Client Saved** - Client is now available for project creation. Select them when creating a new project to auto-fill building details.

### Streamlined: Create Project and Client Together

Creating a project for a brand new client? No need to add the client first. Enter the details directly in the project form. After saving, the system prompts "Save as new client?" One click creates both the project and the client record.

## Autofill Intelligence

When creating a new project, select a client from the dropdown. If the client has LMS numbers configured, you can then select a specific building. The system automatically populates:

**Auto-Filled Fields:**
- Strata Plan Number
- Building Name
- Building Address
- Floor Count

**For Rope Access Jobs:**
- Daily Drop Target
- North/East/South/West Drops
- Unit Count
- Parking Stalls

## Permission Requirements

Access to CRM features requires specific permissions:

- **View Clients** - Can view client list and details
- **Manage Clients** - Can create, edit, and delete client records

## Quick Reference: Building Fields

- **Strata Plan Number** - Unique building identifier, used for project creation and resident codes
- **Building Name** - Display name, used in all project displays
- **Address** - Physical location, used for navigation and documentation
- **Stories** - Floor count, used for drop duration calculation and equipment selection
- **Daily Drop Target** - Expected drops per day, used for window cleaning projects
- **Elevation Drops** - Per-side drop counts, used for progress tracking

## Central Hub Integration

The CRM is the glue that holds everything together. It connects all operational modules:

- **Project Management** - Client/building selection auto-populates project details
- **Billing** - Separate service and billing addresses per client
- **Work Sessions** - Building specs flow to daily work tracking
- **Gear Inventory** - Floor count determines equipment requirements
- **Quoting/Sales** - Building specs enable accurate quotes
- **Resident Portal** - Client-building relationships enable resident access

## Static Building Data

Building specifications are static - they never change once entered. Fixed data includes:

- Number of floors
- Number of drops per elevation
- Parking stalls count
- Unit counts

Contact information like property manager details and phone numbers can be updated as needed. Once building data is entered, it's permanent. No re-entry needed for future projects.

## Cost Efficiency

The CRM provides clear return on investment:

- Monthly cost equals approximately 3 hours at L2 technician pay
- Monthly time savings exceed 20 hours per employee
- Returns 6-7x the investment
- System pays for itself with your first project setup

## Frequently Asked Questions

### What is an LMS number?

LMS stands for Land Management System, the strata plan identifier used in Vancouver. Other regions use EMS or VIS. OnRopePro uses "LMS" as a generic term for all strata and building identifiers regardless of your region.

### Can one client have multiple buildings?

Yes. Each client record can store unlimited LMS numbers, each representing a different building with its own specifications.

### What happens when I select a client during project creation?

The system shows you all buildings associated with that client. When you select a specific building, all stored specifications automatically fill into the project form.

### Do I need to create a client before creating a project?

No. You can enter client and building details directly in the project form. After saving, the system offers to save the information as a new client record.

### Who can access client information?

Users with "View Clients" permission can see client details. Users with "Manage Clients" permission can create, edit, and delete client records.

### What if building information changes?

Core building specifications like floor count and number of drops are permanent - buildings don't grow new floors. Contact information and billing details can be updated at any time.
