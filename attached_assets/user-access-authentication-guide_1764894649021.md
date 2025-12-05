# User Access & Authentication Guide

**Last Updated:** December 4, 2025  
**Version:** 2.0  
**Status:** ✅ Updated with Flexible Permission System

---

## 👥 User Access Overview

OnRopePro implements a sophisticated role-based access control system with **company-scoped multi-tenant architecture**. Each company's data remains completely isolated, and users can only access information relevant to their assigned company and role permissions.

The platform supports three distinct user categories with **granular, customizable permissions** to accommodate diverse organizational structures across the rope access industry.

---

## 📋 The Golden Rule: Role + Permissions = Access

```
Access = Base Role (Organizational Structure) + Granular Permissions (Actual Capabilities)
```

**Key Principles:**

- **Each user has exactly one base role** (Company Owner, Operations Manager, Supervisor, Technician, etc.)
- **Base roles provide organizational structure** — they suggest typical access patterns but do NOT determine permissions
- **Permissions are CUSTOMIZED per employee** by the company owner, regardless of role title
- **Permissions define what users can actually DO** with the data they can access

**Important:** While base roles suggest typical access patterns, actual permissions are granted individually. A "Technician" in one company may have project creation rights while in another they may not. An "Operations Manager" may have financial access in one company but not in another.

**Example:**
```
Base Role: Operations Manager
    ↓
Company A Configuration:
✅ Financial permissions
✅ Create projects
❌ Inventory management

Company B Configuration:
❌ Financial permissions  
❌ Create projects
✅ Inventory management
✅ Employee management

Same role title → Completely different capabilities
```

---

## ✅ Problems Solved

- **Rigid Access Systems:** Flexible permissions adapt to any company's organizational structure
- **Data Leakage:** Complete multi-tenant isolation ensures companies only see their own data
- **Credential Insecurity:** Bcrypt password hashing with industry-standard security
- **Session Vulnerabilities:** Server-side sessions with HTTPS-only cookies and CSRF protection
- **External Transparency:** Building managers and residents access only their building's data

---

## 🏢 Three User Categories

Users fall into one of three distinct categories with different authentication and data access patterns:

### 📊 Company Accounts

**Who:** Company owners and staff employees (operations managers, supervisors, technicians, administrative staff)

**Authentication:**
- Email-based username
- Password authentication
- Company-scoped access

**Characteristics:**
- Full internal system access based on assigned permissions
- Can view/manage projects, employees, work sessions, inventory
- Access spans all company projects and buildings
- Role and permission configuration controlled by company owner

---

### 🏘️ Employee Accounts

**Who:** Field technicians, supervisors, managers, specialized roles (HR, accounting, inventory)

**Authentication:**  
- Created by company owner
- Assigned base role from predefined or custom options
- Individual granular permission assignment

**Characteristics:**
- Access determined by company owner's permission grants
- Same role title can have different permissions across companies
- Can be reassigned roles or have permissions modified at any time
- Permissions are NOT inherited from role — they're explicitly assigned

---

### 🌐 External Accounts

**Who:** Building residents, property managers, building-level accounts

**Authentication:**
- Unique company linking codes
- Building-specific or unit-specific access codes
- Limited to relevant building data only

**Characteristics:**
- Read-only or limited write access (feedback submission, document upload)
- Cannot access other buildings or company-wide data
- Automatic access transfer when residents/managers change (building-level accounts)

---

## 👔 Employee Roles & Flexible Permissions

### Base Roles Available

Company owners select from predefined base roles OR create custom roles for specialized positions. **Base roles organize your team structure but do NOT dictate permissions.**

**Standard Predefined Roles:**

**Executive/Management:**
- **Company Owner** (ultimate administrative control)
- **Operations Manager** (day-to-day operations coordination)
- **Account Manager** (client relationship management)

**Administrative:**
- **Human Resources** (employee onboarding, benefits, compliance)
- **Accounting** (financial management, invoicing, payroll)

**Field Leadership:**
- **General Supervisor** (multi-trade oversight)
- **Rope Access Supervisor** (rope access team leadership)
- **Rope Access Manager** (rope access operations management)
- **Ground Crew Supervisor** (ground operations leadership)

**Field Workers:**
- **Rope Access Technician** (certified rope access work)
- **Ground Crew** (ground-level support and operations)
- **Laborer** (general labor and support tasks)

**Custom Roles:**

For specialized organizational needs, company owners can create custom role titles not in the standard list.

**Examples of Custom Roles:**
- Inventory Manager
- Safety Officer
- Quality Control Inspector
- Training Coordinator
- Client Services Representative
- Estimator/Bidding Specialist

**Important:** Custom roles function identically to standard roles — they receive granular permission assignments and serve primarily for organizational clarity.

---

### How Permission Assignment Works

```
1. Company Owner creates new employee account
    ↓
2. Selects base role (e.g., "Operations Manager" or "Inventory Manager")
    ↓
3. Assigns granular permissions across all categories:
    • Financial Permissions
    • Project Management
    • Employee Management
    • Inventory Control
    • Feedback Management
    • Safety Compliance
    • Document Access
    • Reporting & Analytics
    ↓
4. Employee receives unique access profile (role + custom permissions)
    ↓
5. Permissions can be modified at any time by company owner
```

**Real-World Example:**

```
Scenario: Growing company promotes field technician to supervisor role

Before:
• Role: Rope Access Technician
• Permissions: Clock in/out, log drops, upload photos, submit inspections

After Promotion:
• Role: Supervisor (base role changed)
• New Permissions Added:
  ✅ Create projects
  ✅ Assign employees to projects  
  ✅ Review and approve feedback responses
  ❌ Financial data (owner keeps this restricted)
  ❌ Employee hourly rates (owner keeps this restricted)
  
Result: Same person, new role, custom permission set matching their responsibilities
```

---

## 🔐 Granular Permissions

Beyond base roles, the platform offers **granular permission categories** allowing company owners to configure exact access rights for each employee.

⚠️ **IMPORTANT:** Permissions are NOT determined by role alone.

- Company owners select base roles for organizational clarity
- Then assign granular permissions individually per employee
- Same role can have different permissions across companies  
- Permissions can be modified at any time

**Permission Categories:**

### 💰 Financial Permissions

Control access to sensitive cost and rate information:

- **View Financial Data:** See labor costs, project budgets, hourly rates
- **View Employee Rates:** Access specific technician hourly wage information
- **Edit Pricing:** Modify quote values, project estimates, billing rates
- **Access Payroll Reports:** View aggregated payroll summaries and exports

**Example Configuration:**
- Operations Manager A: ✅ All financial permissions
- Operations Manager B: ❌ All financial permissions (owner handles finances)

---

### 📋 Project Management Permissions

Control project lifecycle and coordination:

- **Create Projects:** Set up new building maintenance projects
- **Edit Projects:** Modify project details, targets, completion dates
- **Delete Projects:** Remove projects from system (with data cascade warnings)
- **Mark Complete:** Finalize projects and move to archive
- **View All Projects:** Access company-wide project portfolio
- **Assign Employees:** Allocate technicians to specific projects

**Example Configuration:**
- Supervisor A: ✅ Create, Edit, Assign (but ❌ Delete)
- Supervisor B: ✅ View, Assign only (❌ Create, Edit, Delete)

---

### 👥 Employee Management Permissions

Control team administration and sensitive data:

- **Create Employees:** Onboard new team members
- **Edit Employees:** Modify roles, rates, permissions
- **Deactivate Employees:** Remove access for departed staff
- **View All Employees:** Access full employee directory
- **Assign Roles:** Change employee base roles
- **Manage Permissions:** Grant/revoke granular permissions

**Example Configuration:**
- HR Manager: ✅ All employee permissions except "Assign Roles" (owner-only)
- General Supervisor: ✅ View All Employees only (no editing)

---

### 📦 Inventory Permissions

Control equipment and asset management:

- **View Inventory:** Access equipment lists and tracking
- **Add Inventory:** Create new equipment records
- **Edit Inventory:** Update equipment details, status, assignments
- **Delete Inventory:** Remove equipment from system
- **Assign Equipment:** Allocate gear to specific technicians or projects
- **Track Inspections:** Access safety inspection histories

**Example Configuration:**
- Dedicated Inventory Manager (custom role): ✅ All inventory permissions
- Field Technician: ✅ View and Track Inspections only

---

### 💬 Feedback Management Permissions

Control resident and client communication:

- **View Feedback:** Access submitted feedback from residents
- **Respond to Feedback:** Add public responses visible to residents
- **Add Internal Notes:** Private team coordination comments
- **Close Feedback:** Mark issues resolved
- **Delete Feedback:** Remove feedback entries (rare, owner-level)
- **View Feedback Analytics:** Access response time metrics and trends

**Example Configuration:**
- Customer Service Rep (custom role): ✅ View, Respond, Close (but ❌ Delete)
- Field Supervisor: ✅ View, Add Internal Notes only

---

### 🛡️ Safety & Compliance Permissions

Control documentation and regulatory oversight:

- **Submit Inspections:** Complete daily harness/equipment checks
- **View Inspections:** Access inspection history
- **Approve Inspections:** Supervisor review and sign-off
- **Create Toolbox Meetings:** Document safety briefings
- **View Safety Documents:** Access uploaded PDFs, certificates, plans
- **Manage Compliance:** Oversight of company-wide safety program

**Example Configuration:**
- Safety Officer (custom role): ✅ All safety permissions + compliance oversight
- Technician: ✅ Submit Inspections only (cannot view others' records)

---

### 📄 Document Permissions

Control file uploads and access:

- **Upload Documents:** Add PDFs, photos, certificates to projects
- **View Documents:** Access project-specific or company-wide files
- **Delete Documents:** Remove files from system
- **Download Documents:** Export files for offline use

---

### 📊 Reporting & Analytics Permissions

Control business intelligence access:

- **View Analytics Dashboard:** Access performance metrics, productivity data
- **Export Reports:** Generate CSV/PDF summaries
- **View Historical Data:** Access past project archives
- **Financial Reporting:** View revenue, cost, profitability analyses

---

### ⚠️ Permission Assignment Warning

**Employees given access to specific company data can view/modify information based on assigned permissions. Permissions should reflect actual job responsibilities and trust levels.**

**Best Practice:** Grant minimum necessary permissions. You can always add more later.

**Common Configuration Errors:**
- ❌ Giving all supervisors financial access (only those managing budgets need it)
- ❌ Restricting project creation to owners only (supervisors often need this)
- ❌ Giving technicians access to all employee data (privacy concern)

---

## 🌐 External User Roles

### 🏠 Resident

**Purpose:** Building occupants monitoring work progress and submitting feedback

**Authentication Method:**
- Self-registration with company-provided access code
- Unit-specific access codes (e.g., "BLD2024-U207")
- Each unit has permanent access code

**How It Works:**
1. Company creates project for building
2. Company generates and distributes unit access codes
3. Resident visits portal and registers with their unit's code
4. System creates resident account tied to that unit
5. When resident moves out, new resident uses same code
6. Previous resident's account automatically deactivated

**Error Prevention:**
- Double-entry confirmation required for unit numbers
- "Enter unit number: ___"
- "Confirm unit number: ___"
- Account only created if both entries match

**What They Can Do:**
- ✅ View their building's active projects
- ✅ See real-time work progress (4-elevation visual system)
- ✅ Access project photo galleries showing completed work
- ✅ Submit feedback with photos and descriptions
- ✅ Track feedback status (open/closed/in-progress)
- ✅ View public responses from management
- ✅ See project schedules and expected completion dates

**What They Cannot Do:**
- ❌ View other buildings or company-wide data
- ❌ Access internal notes or private coordination
- ❌ See labor costs, employee rates, or financial data
- ❌ Modify projects or work records
- ❌ View other residents' feedback or contact information

**Data Isolation:**
- Residents ONLY see projects for their specific building
- Privacy by design — no cross-building visibility
- Automatic unit reassignment when residents change

---

### 🏢 Property Manager / Building Manager

**Purpose:** Building management personnel and property management companies overseeing maintenance contracts

**Authentication Method:**
- **Building-level accounts** (NOT individual manager accounts)
- Each building receives one account with credentials
- Property management company controls password

**Why Building-Level Accounts?**

Building managers change frequently (turnover, reassignments, company changes). Rather than create and delete individual manager accounts:

✅ **Each building gets ONE permanent account**
✅ **Current manager uses those credentials**  
✅ **When manager changes: Property manager simply updates password**
✅ **No account deletion/recreation needed**
✅ **Access automatically transfers to new manager**

**Access Management:**
- Property management company (company-level) controls building account passwords
- Can revoke/restore access during manager transitions
- No action required from rope access company
- Zero administrative burden for natural turnover

**What They Can Do:**
- ✅ View all projects for their assigned building(s)
- ✅ Monitor real-time work progress and completion status
- ✅ Access project photo documentation
- ✅ Review resident feedback submitted for their building
- ✅ Track work schedules and expected completion dates
- ✅ Download compliance reports and safety documentation
- 🔄 Upload building documents (planned feature)
- 🔄 Submit work orders or service requests (planned feature)

**What They Cannot Do:**
- ❌ View financial data (labor costs, rates, budgets)
- ❌ Access employee information or internal coordination
- ❌ Modify project details or work records
- ❌ See other buildings managed by the same rope access company
- ❌ Access internal feedback notes or private coordination

**Data Isolation:**
- Building managers only see projects for their specific building(s)
- Multiple buildings can be assigned to same property manager account
- Complete separation from internal company operations

---

## 🔄 Authentication Flow

### 🟠 Company Registration

**When:** New rope access company signs up for OnRopePro

**Steps:**
1. User navigates to registration page
2. Enters company details (name, email, initial password)
3. Selects company role: "Company Owner"
4. System creates new company record in database
5. Creates first user account with ultimate permissions
6. User receives confirmation and can log in

**Result:** New company tenant created with isolated data space

---

### 🔵 Employee Onboarding

**When:** Company owner adds new staff member

**Steps:**
1. Company owner navigates to employee management
2. Clicks "Create New Employee"
3. Enters employee details:
   - Full name
   - Email address (becomes username)
   - Temporary password
   - IRATA level (if applicable)
   - Hourly rate (if applicable)
4. Selects base role from dropdown (standard or custom)
5. Assigns granular permissions across all categories
6. Saves — new employee can immediately log in
7. Employee changes password on first login (recommended)

**Note:** No email verification required. Company owner is trusted to onboard legitimate employees.

---

### 🟢 Resident/PM Linking

**When:** Building resident or property manager needs access to building data

**Steps:**
1. User registers as Resident or Property Manager
2. Receives linking code from company (via email, posted notice, or QR code)
3. Enters code on linking page during registration
4. System validates code and links user to specific building or unit

**Code Types:**
- **Resident codes:** Unit-specific (e.g., "BLD2024-U207" for Unit 207)
- **Building manager codes:** Building-level (e.g., "BLDMGR-TOWER1")

**Access Activation:**
- Resident: Immediate access to their building's projects
- Building Manager: Access to assigned building(s) only

---

## 🔒 Security Architecture

### Session Management

- **Server-side sessions** for all authenticated users
- **HTTP-only secure cookies** prevent XSS attacks on session tokens
- **Automatic session expiration** after 30 days inactivity
- **Secure cookie attributes:** httpOnly, secure (HTTPS), sameSite

---

### Password Security

- **Bcrypt password hashing** with salt rounds for maximum security
- **No plain-text password storage** anywhere in system
- **Configurable password complexity requirements** (upcoming)
- **Password change capability** for all user types

---

### Request Security

**1. CSRF (Cross-Site Request Forgery) Protection:**

**What It Prevents:** Malicious websites making authenticated requests on behalf of logged-in users

**How It Works:**
- Token-based validation for all state-changing requests (POST, PUT, DELETE)
- Unique token per session embedded in forms
- Server validates token before processing request
- Invalid token = Request rejected (403 Forbidden)

**User Impact:** None — protection works invisibly in background

**Protects Against:** Unauthorized actions via forged requests from malicious sites

---

**2. Brute Force Attack Prevention (Rate Limiting):**

**What It Prevents:** Automated password guessing attacks trying thousands of login combinations

**How It Works:**
- Limits login attempts to 10-15 per minute per IP address
- Tracks failed login attempts
- Temporary IP blocking after threshold exceeded
- Automatic unblock after cooldown period

**User Impact:** Minimal — legitimate users rarely exceed 2-3 login attempts

**Protects Against:** Automated bots attempting to crack passwords

---

**3. SQL Injection Prevention:**

**What It Prevents:** Attackers inserting malicious SQL commands into database queries

**How It Works:**
- All queries use parameterized statements via Drizzle ORM
- No raw SQL string concatenation
- User input never directly inserted into queries
- Automatic escaping of special characters

**Protects Against:** Database manipulation, data theft, unauthorized access

---

**4. HTTPS Encryption:**

**What It Prevents:** Interception of data transmitted between client and server

**How It Works:**
- All traffic encrypted using TLS/SSL certificates
- Passwords, session tokens, sensitive data encrypted in transit
- Man-in-the-middle attack protection

**User Impact:** Green padlock in browser address bar

---

### Data Isolation

- **Company-scoped data access:** Every API request filtered by company ID
- **Residents only see their building:** Automatic filtering by strata plan number
- **Building managers see assigned buildings only:** Permission-based building access
- **Role-based API response filtering:** Responses contain only data user has permission to see

---

### Audit Trails

**What's Logged:**
- Employee permission changes
- Role reassignments
- Project deletions
- Financial data access
- Sensitive configuration changes

**Retention:** All audit logs retained indefinitely for compliance and security investigations

**Access:** Company owners and system administrators only

---

## 📊 Quick Reference: Who Can Do What

⚠️ **IMPORTANT DISCLAIMER:**

**The permissions shown in this table are EXAMPLES ONLY representing typical configurations.**

Actual capabilities vary by company based on custom permission assignments by the company owner. The same role title may have completely different access rights in different companies.

**Company owners configure permissions individually per employee based on job responsibilities, trust levels, and organizational needs.**

---

| Action | Company Owner | Ops Manager* | Supervisor* | Technician* | Resident | Building Mgr |
|--------|:-------------:|:------------:|:-----------:|:-----------:|:--------:|:------------:|
| **Projects** |
| Create Project | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Edit Project | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| View Projects | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| Delete Project | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Mark Complete | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **Work Sessions** |
| Clock In/Out | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Own Sessions | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View All Sessions | ✅ | ⚠️ | ⚠️ | ❌ | ❌ | ❌ |
| Edit Sessions | ✅ | ⚠️ | ⚠️ | ❌ | ❌ | ❌ |
| **Employees** |
| Create Employees | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Edit Employees | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| View Employees | ✅ | ⚠️ | ⚠️ | ❌ | ❌ | ❌ |
| Assign Roles | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Financial** |
| View Labor Costs | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| View Hourly Rates | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Edit Rates | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Payroll Reports | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| **Feedback** |
| Submit Feedback | ❌ | ❌ | ❌ | ❌ | ✅ | ⚠️ |
| View Feedback | ✅ | ✅ | ⚠️ | ❌ | ⚠️ | ✅ |
| Respond to Feedback | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Close Feedback | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **Safety** |
| Submit Inspections | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Inspections | ✅ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ |
| Create Toolbox Mtg | ✅ | ✅ | ✅ | ⚠️ | ❌ | ❌ |
| **Inventory** |
| View Inventory | ✅ | ⚠️ | ⚠️ | ⚠️ | ❌ | ❌ |
| Add Equipment | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Assign Equipment | ✅ | ⚠️ | ⚠️ | ❌ | ❌ | ❌ |

**Legend:**
- ✅ **Typically Granted** — Most companies give this permission to this role
- ⚠️ **Variable** — Some companies grant this, others don't (depends on configuration)
- ❌ **Rarely Granted** — Most companies restrict this from this role
- \* **Customizable** — Actual permissions set by company owner per employee

**Remember:** This table shows *typical* configurations, not requirements. Your company's actual permission structure may differ entirely.

---

## 📈 Upcoming Features

### Feedback Response Time Tracking

**Status:** 🔄 In Development  
**Target Release:** Q1 2026

**Planned Metrics:**
- ⏱️ Time from submission to first view by staff
- ⏱️ Time from submission to first response  
- ⏱️ Time from submission to closure
- 📊 Average response time per project/building
- 📋 Response time SLA tracking and alerts

**Use Cases:**
- **Internal Performance KPIs:** Track team responsiveness
- **Client Reporting:** Show building managers how quickly issues are addressed
- **Employee Performance Reviews:** Objective metrics for evaluations
- **Contract SLA Compliance:** Verify response times meet contractual obligations
- **Benchmarking:** Compare performance across projects, buildings, or time periods

**Planned Dashboard Visualizations:**
- Average response time (company-wide)
- Response time by building
- Response time by responding employee
- Trend analysis (improving/declining responsiveness)
- SLA compliance percentage

---

### Building Manager Document Upload

**Status:** 🔄 Planning Phase  
**Target Release:** Q2 2026

**Planned Capabilities:**
- Building managers upload building-specific documents
- Certificate of Insurance (COI) management
- Building access instructions
- Maintenance schedules and requirements
- Special instructions or restrictions

**Access Control:**
- Property manager oversight and approval workflows
- Document expiry tracking and renewal notifications
- Automatic alerts when documents expire

---

### Custom Permission Templates

**Status:** 💭 Concept Phase  
**Target Release:** TBD

**Planned Feature:**
- Save common permission configurations as templates
- Quick-apply templates when creating similar roles
- Share templates across projects or companies (opt-in)
- Example templates: "Field Supervisor," "Office Admin," "Safety Officer"

**Benefit:** Speeds up employee onboarding with consistent permission sets

---

## 📝 Terminology & Naming

### "Feedback" vs "Complaints"

**Platform Terminology:** "Feedback"

**Rationale:**
- ✅ Encompasses both positive and negative input
- ✅ Maintains professional, non-confrontational tone
- ✅ Encourages resident engagement with the system
- ✅ Opens door for positive comments ("Your crew did an amazing job!")
- ❌ "Complaints" has 100% negative connotation
- ❌ Residents hesitate to submit positive feedback via "Complaint" button

**Implementation:**
- UI Labels: "Submit Feedback," "View Feedback," "Feedback Management"
- Database: Internal table names may still reference "complaints" for backwards compatibility
- Documentation: All user-facing materials use "feedback"

---

## 🔧 Technical Implementation Notes

### Multi-Tenant Architecture

**Database Structure:**
- Every data table includes `company_id` foreign key
- All queries automatically filtered by authenticated user's company
- PostgreSQL row-level security policies enforce data isolation
- Zero possibility of cross-company data leakage

**Session Context:**
- User authentication establishes session with company context
- Every API request includes company scope validation
- Middleware automatically filters results to company-scoped data

---

### Permission Check Flow

```
1. User makes API request (e.g., "GET /api/projects")
    ↓
2. Authentication middleware validates session
    ↓
3. System retrieves user's company_id, role, and permissions
    ↓
4. Permission middleware checks: Does user have required permission?
    ↓
5a. YES → Query database with company_id filter → Return authorized data
5b. NO → Return 403 Forbidden (Access Denied)
    ↓
6. Response filtered to only include data user has permission to see
```

**Performance Optimization:**
- Permissions cached per session (not queried on every request)
- Database indexes on company_id and role columns
- Efficient JOIN queries minimize database roundtrips

---

### Audit Trail Implementation

**What Gets Logged:**
```javascript
{
  timestamp: "2025-12-04T16:08:07Z",
  user_id: 123,
  company_id: 456,
  action: "PERMISSION_CHANGE",
  target_user_id: 789,
  old_permissions: ["view_projects", "clock_in"],
  new_permissions: ["view_projects", "clock_in", "create_projects"],
  ip_address: "192.168.1.100",
  user_agent: "Mozilla/5.0..."
}
```

**Storage:** Separate audit_logs table with no foreign key cascade (logs survive deletions)

**Retention:** Indefinite (required for compliance investigations)

---

## 🆘 Support & Questions

**For Company Owners:**
- **Permission Setup Questions:** Contact support@onrope.pro
- **Best Practices:** Review permission configuration examples in knowledge base
- **Security Concerns:** security@onrope.pro (24-hour response)

**For Employees:**
- **Access Issues:** Contact your company owner
- **Permission Requests:** Speak with your supervisor or company owner
- **Technical Problems:** support@onrope.pro

**For Building Managers/Residents:**
- **Account Access:** Contact your property manager or rope access company
- **Technical Issues:** Contact the rope access company managing your building

---

## 📚 Related Documentation

- [Employee Management Guide](#) — Detailed onboarding and role assignment procedures
- [Resident Portal Guide](#) — How residents register and use the portal
- [Building Manager Guide](#) — Property manager account setup and capabilities
- [Security Best Practices](#) — Recommendations for password policies and access control
- [API Authentication Documentation](#) — For developers integrating with OnRopePro

---

**Document Version:** 2.0  
**Last Major Update:** December 4, 2025  
**Next Review:** March 2026 (post-launch feedback integration)

---

