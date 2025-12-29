import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { 
  Shield, 
  Users, 
  Building2, 
  Calendar, 
  FileText, 
  Clock, 
  CreditCard,
  Palette,
  MapPin,
  ClipboardCheck,
  HardHat,
  Wrench,
  AlertTriangle,
  BarChart3,
  UserCheck,
  Download,
  Lock,
  Smartphone,
  Globe,
  Zap,
  CheckCircle2,
  Star,
  Package,
  MessageSquare,
  Home,
  Settings,
  LayoutDashboard,
  FolderOpen,
  Receipt,
  Timer,
  CalendarDays,
  ChevronRight,
  ExternalLink,
  History,
  Languages,
  TrendingUp,
  Activity,
  Code,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ChangelogSection = {
  title: string;
  icon: any;
  iconColor: string;
  description: string;
  features: string[];
  status: "complete" | "in-progress" | "planned";
};

type PageLink = {
  name: string;
  path: string;
  description: string;
  roles: string[];
};

type PageCategory = {
  category: string;
  icon: any;
  iconColor: string;
  pages: PageLink[];
};

type ServiceItem = {
  name: string;
  description: string;
  icon: string;
  trackingType: string;
};

type RecentChange = {
  date: string;
  title: string;
  description: string;
  type: "feature" | "improvement" | "fix";
};

const recentChangesData: RecentChange[] = [
  {
    date: "December 29, 2025",
    title: "Enhanced Client Import with CSV Support",
    description: "Client import now supports both Excel (.xlsx, .xls) and CSV file formats. Added flexible column detection with case-insensitive matching, auto-splitting combined 'Name' columns into first/last name fields, and all import fields are now optional for partial data uploads. Quote page features searchable client selector with type-to-filter functionality and auto-fills Property Manager recipient when client is selected",
    type: "feature"
  },
  {
    date: "December 21, 2025",
    title: "Server-Side Quiz Translation System",
    description: "Implemented full multilingual support for certification and safety quizzes. French and Spanish translations for 6 quizzes (IRATA Level 1 A/B, SWP Window Cleaning, FLHA Assessment, Harness Inspection) served via API with automatic English fallback. Server-side architecture keeps client bundles lean while supporting 420+ translated questions",
    type: "feature"
  },
  {
    date: "December 20, 2025",
    title: "Employer Registration Modal Enhancement",
    description: "Registration modal added to all 18 module landing pages for seamless sign-up flow. Float software added to scheduling calendar replacements. Standardized 'Try Free Trial' buttons now open sign-in modal instead of navigating away from page",
    type: "improvement"
  },
  {
    date: "December 19, 2025",
    title: "Company Profile Page Redesign",
    description: "Profile page reorganized into distinct information and action columns for improved visual hierarchy. Better separation of company details, contact information, and action buttons. Enhanced mobile responsiveness with full-width grid layouts",
    type: "improvement"
  },
  {
    date: "December 18, 2025",
    title: "Visual Rating Tiers for CSR",
    description: "Color-coded rating tier visualization added to Company Safety Rating display. Rating levels now show distinct visual bands (Excellent/Good/Needs Improvement/Poor) with matching colors. Help article table support added with proper markdown rendering",
    type: "improvement"
  },
  {
    date: "December 17, 2025",
    title: "Module Landing Page Icons",
    description: "Custom branded logos added for Deputy and When I Work integrations across scheduling and project management modules. Icon styling updated with proper filters (brightness-0 invert opacity-60) for consistent appearance. Added Notebook and Phone Notes to project management software list",
    type: "improvement"
  },
  {
    date: "December 16, 2025",
    title: "JobBoardGuide Design System Compliance",
    description: "Complete rewrite of Job Board feature guide to comply with Changelog Pages Design System. Added proper section ordering (Introduction, Golden Rule, Key Features, Problems Solved), Accordion component with Expand/Collapse All toggle, four-part problem structure (The Pain, Real Example, Solution, Benefit), and stakeholder color coding (Employers=Blue, Technicians=Orange, Building Managers=Violet)",
    type: "improvement"
  },
  {
    date: "December 13, 2025",
    title: "AI-Powered Insurance Expiry Detection",
    description: "Certificate of Insurance uploads now feature automatic expiry date extraction using Gemini AI. The system analyzes uploaded PDF documents and extracts policy expiration dates. Expired policies display a red 'EXPIRED' badge, and policies expiring within 30 days show a red 'Expiring Soon' warning. Helps companies maintain valid insurance coverage and avoid compliance gaps",
    type: "feature"
  },
  {
    date: "December 13, 2025",
    title: "CSR Percentage-Based Rating System",
    description: "Company Safety Rating (CSR) now displays as a percentage (0-100%) instead of raw points, making ratings fair across companies of all sizes. Features color-coded labels: Green (90-100% Excellent), Yellow (70-89% Good), Orange (50-69% Needs Improvement), Red (Below 50% Poor). CSR history now tracks percentage changes with detailed breakdowns. Property managers see consistent percentage ratings for all vendors",
    type: "improvement"
  },
  {
    date: "December 11, 2025",
    title: "Security: Replaced Vulnerable PDF Library",
    description: "Replaced html-pdf-node with Playwright for PDF generation to address critical CVE in lodash.pick@4.4.0 dependency. Quote PDF export and email functionality now uses a more secure and modern approach",
    type: "fix"
  },
  {
    date: "December 10, 2025",
    title: "Feature Guide Navigation Sidebar",
    description: "All 18 changelog feature guides now include a persistent left navigation sidebar for easy browsing between guides. Removed redundant Back and Main Menu buttons. Improved text readability with proper 16px body text sizing across all guide pages",
    type: "improvement"
  },
  {
    date: "December 9, 2025",
    title: "Platform Focus: Building Maintenance",
    description: "Refocused platform exclusively on building maintenance services to maintain product clarity and target market precision. Removed experimental NDT, Rock Scaling, Wind Turbine, and Oil Field categories. Platform now features 10 specialized building maintenance job types plus custom services",
    type: "improvement"
  },
  {
    date: "December 9, 2025",
    title: "Changelog Accuracy Update",
    description: "Comprehensive changelog update: Added Technician Portal, Building Manager Portal, and Landing Pages categories. Expanded SuperUser Administration to 11 pages. Added Technician Self-Registration section with referral system and PLUS access tier. Updated Employee Management with team invitation workflow and multi-employer connections",
    type: "improvement"
  },
  {
    date: "December 9, 2025",
    title: "Job Board System",
    description: "Complete job board ecosystem: Companies and SuperUsers can post employment opportunities with salary ranges, required certifications, and job types. Technicians can browse job listings, apply directly, and toggle profile visibility to employers. Visible profiles show resume, safety rating, name, experience, certification numbers, and photo. Includes application tracking and employer candidate browser",
    type: "feature"
  },
  {
    date: "December 9, 2025",
    title: "Design System Compliance",
    description: "Full design system compliance across all landing pages (TechnicianLogin, Login, Employer). Replaced hardcoded colors with semantic tokens (action-500, rust-500, neutral-100, navy-900), added dark mode support to all tinted sections, and implemented focus rings on action buttons for accessibility",
    type: "improvement"
  },
  {
    date: "December 9, 2025",
    title: "Employer Landing Page",
    description: "New dedicated /employer landing page with centered navigation header featuring 5 persona links (Employer, Technician, Property Manager, Resident, Building Manager). Full design system compliance with proper color tokens and dark mode support",
    type: "feature"
  },
  {
    date: "December 9, 2025",
    title: "Technician Landing Page Updates",
    description: "Added IRATA expiry problem to feature scroller, changed 'Most Popular' badge to 'This One Is Better' for Plus tier, reordered Plus features to prioritize certification expiry alerts. Updated referral messaging to correctly state one-sided benefit (referrer only gets Plus)",
    type: "improvement"
  },
  {
    date: "December 9, 2025",
    title: "Navigation Header Redesign",
    description: "Centered navigation header with absolute positioning for consistent persona-based navigation across landing pages. Fixed Resident nav routing from /resident-link to /link",
    type: "improvement"
  },
  {
    date: "December 8, 2025",
    title: "Document Upload UX Improvements",
    description: "Moved upload buttons into their respective sections (Driver's License, Banking Documents, First Aid, Certifications) for better organization. Buttons now show contextual text - 'Upload' when no document exists, 'Add More' or 'Replace' when documents already uploaded. Fixed upload button getting stuck in 'Uploading...' state when file dialog is cancelled",
    type: "improvement"
  },
  {
    date: "December 8, 2025",
    title: "My Logged Hours for Technicians",
    description: "Technicians can now view all their logged work hours from the Technician Portal. The new 'My Logged Hours' page shows work sessions grouped by building with total hours, tasks performed, and dates. Includes bilingual support (EN/FR)",
    type: "feature"
  },
  {
    date: "December 8, 2025",
    title: "Previous Work Experience Entry",
    description: "Technicians can record prior rope access work experience in their personal logbook. Enter date ranges, hours worked, building name/address/height, select from 19 IRATA task types, and add notes. These entries are stored separately and clearly marked as 'not counted in certification totals'",
    type: "feature"
  },
  {
    date: "December 8, 2025",
    title: "Dual-Portal Navigation",
    description: "Improved navigation flow: Linked technicians (with active company) now land on the Work Dashboard after login with easy access to their Technician Portal via 'My Profile' card. Unlinked or terminated technicians go directly to Technician Portal with a 'Go to Work Dashboard' card for navigation",
    type: "improvement"
  },
  {
    date: "December 6, 2025",
    title: "Address Autocomplete",
    description: "Smart address lookup in technician registration - start typing your address and get real-time suggestions from Geoapify. Selecting a suggestion auto-fills street, city, province, country, and postal code. Full bilingual support (EN/FR)",
    type: "feature"
  },
  {
    date: "December 6, 2025",
    title: "Technician Account Protection",
    description: "Critical security fix: Employers can no longer permanently delete technician accounts. When removing an employee from their team, the technician is only unlinked (companyId set to null) - their account remains intact, they can still log in to their portal, and can be invited by other companies",
    type: "fix"
  },
  {
    date: "December 6, 2025",
    title: "Owner Notification System",
    description: "Bidirectional invitation notifications complete: When a technician accepts an invitation, the company owner now sees a celebration dialog on their Dashboard showing the new team member's name, email, and certifications with a 'Next' button to acknowledge",
    type: "feature"
  },
  {
    date: "December 6, 2025",
    title: "Team Invitation System",
    description: "Complete invitation-based workflow for adding technicians to your team. Search for self-registered technicians by IRATA license, SPRAT license, or email. Send invitations that appear in the technician's portal with accept/decline options. Full bilingual support (EN/FR)",
    type: "feature"
  },
  {
    date: "December 6, 2025",
    title: "AI License Verification",
    description: "IRATA and SPRAT license verification using Gemini AI screenshot analysis. Technicians upload a screenshot from the official verification portal, and AI validates their license number, level, and expiration date against their registered credentials",
    type: "feature"
  },
  {
    date: "December 6, 2025",
    title: "Bilingual Technician Portal",
    description: "Complete French/English language support in the Technician Portal with language toggle in header, translated UI elements, form validation messages, and persistent language preference",
    type: "feature"
  },
  {
    date: "December 5, 2025",
    title: "Resident Unit Conflict Detection",
    description: "New resident registration now detects when a unit is already linked to another account. Shows confirmation dialog explaining the takeover scenario, with atomic database transactions ensuring safe unit transfers between residents",
    type: "feature"
  },
  {
    date: "December 5, 2025",
    title: "Quote-to-Project Conversion",
    description: "Convert accepted quotes directly into projects with prefilled details. Navigate from Quotes page to Dashboard with project creation form auto-populated with quote data",
    type: "feature"
  },
  {
    date: "December 5, 2025",
    title: "Feedback Resolution Time Metrics",
    description: "Company owners now see average resolution time badge in Dashboard feedback section, showing how quickly the team resolves resident feedback",
    type: "improvement"
  },
  {
    date: "December 4, 2025",
    title: "Founder Resources Section",
    description: "Added private Founder Resources page for Tommy & Glenn in SuperUser dashboard with development tools links, launch strategy roadmap, sales strategy planning, and important notes",
    type: "feature"
  },
  {
    date: "December 4, 2025",
    title: "Security Hardening Audit",
    description: "Major security improvements: mandatory SESSION_SECRET environment variable, rate limiting on all auth endpoints (login 10/15min, registration 5/hour, password changes 5/15min), password complexity requirements (8+ chars with uppercase, lowercase, number), account enumeration prevention with generic error messages, and comprehensive employee role access control",
    type: "improvement"
  },
  {
    date: "December 4, 2025",
    title: "Second Code Audit & Bug Fixes",
    description: "Fixed 5 additional bugs: work session clock-in/out timezone handling for accurate payroll, delete account dialog flow keeping password visible on failure, password change form security clearing fields on error, property manager code generation error message typo, and toolbox meeting attendees schema simplification",
    type: "fix"
  },
  {
    date: "December 4, 2025",
    title: "Comprehensive Code Audit & Bug Fixes",
    description: "Fixed 7 bugs including: IRATA license expiration timezone parsing, inventory compliance rating date handling, PDF filename timezone issues, quote service hours data loss on edit, debug console logs removal, bulk export graceful error handling with partial success support, and quote pipeline data integrity logging",
    type: "fix"
  },
  {
    date: "December 4, 2025",
    title: "Quote Client & Property Autofill",
    description: "Quick fill building information from saved client properties when creating quotes - select a client to autofill manager details, then pick from their saved properties to populate building name, strata plan, address, and floor count",
    type: "feature"
  },
  {
    date: "December 4, 2025",
    title: "Quote History Audit Trail",
    description: "Full transactional history tracking for quotes with collapsible timeline showing creation events and pipeline stage changes with timestamps",
    type: "feature"
  },
  {
    date: "December 3, 2025",
    title: "Knowledge Base Expansion",
    description: "Added 5 comprehensive V3.0 documentation guides: Platform Administration, Analytics & Reporting, Multi-Language Support, GPS & Location Services, and Property Manager Interface",
    type: "feature"
  },
  {
    date: "November 30, 2025",
    title: "Platform Metrics Dashboard",
    description: "Added comprehensive metrics tracking for super users including MRR, customer churn, LTV, and resubscription monitoring",
    type: "feature"
  },
  {
    date: "November 29, 2025",
    title: "Quote Email System",
    description: "Send quotes directly to customers as professional PDF attachments via email",
    type: "feature"
  },
  {
    date: "November 28, 2025",
    title: "Sales Pipeline & CRM Analytics",
    description: "Added Kanban-style pipeline view for quote management with drag-and-drop stage transitions and analytics dashboard showing win rates, revenue tracking, and stage breakdowns",
    type: "feature"
  },
  {
    date: "November 27, 2025",
    title: "Navigation Improvements",
    description: "Standardized back button and main menu button components across all pages for consistent navigation experience",
    type: "improvement"
  },
  {
    date: "November 25, 2025",
    title: "Multi-Language Support",
    description: "Full French translation added with language toggle, user preference settings, and localized date/time formatting",
    type: "feature"
  },
  {
    date: "November 22, 2025",
    title: "Personal Kit Selection",
    description: "Link harness inspections to technician's assigned personal equipment kit for better tracking",
    type: "feature"
  },
  {
    date: "November 20, 2025",
    title: "Feature Request System",
    description: "Company owners can submit feature requests and ideas, with super user management dashboard",
    type: "feature"
  },
  {
    date: "November 18, 2025",
    title: "Safe Work Practices",
    description: "New document type with 10 daily safety topics, employee acknowledgment and sign-off tracking",
    type: "feature"
  },
  {
    date: "November 15, 2025",
    title: "Document Compliance Reports",
    description: "Download employee signature compliance reports and improved tracking for all document types",
    type: "improvement"
  },
  {
    date: "November 12, 2025",
    title: "Equipment Damage Reporting",
    description: "Report damage linked to specific inventory items by serial number with PDF generation",
    type: "feature"
  },
  {
    date: "November 10, 2025",
    title: "Hours Logging Prompt",
    description: "Automatic prompt asking technicians if they want to log IRATA hours after ending work sessions",
    type: "improvement"
  },
  {
    date: "November 8, 2025",
    title: "Subscription Add-ons",
    description: "Purchase additional seats and project add-ons directly from subscription management page",
    type: "feature"
  }
];

type ServiceCategory = {
  category: string;
  description: string;
  services: ServiceItem[];
};

const servicesData: ServiceCategory[] = [
  {
    category: "Building Maintenance",
    description: "High-rise building cleaning and maintenance services",
    services: [
      { name: "Window Cleaning", description: "Rope access high-rise window cleaning with directional drop tracking", icon: "window", trackingType: "Drop-based (N/E/S/W)" },
      { name: "Exterior Dryer Vent Cleaning", description: "High-rise exterior dryer vent cleaning and maintenance", icon: "air", trackingType: "Drop-based (N/E/S/W)" },
      { name: "Building Wash / Pressure Washing", description: "Building exterior cleaning and pressure washing services", icon: "water_drop", trackingType: "Drop-based (N/E/S/W)" },
      { name: "General Pressure Washing", description: "Ground-level and general pressure washing services", icon: "cleaning_services", trackingType: "Hours-based" },
      { name: "Gutter Cleaning", description: "Gutter cleaning, maintenance, and debris removal", icon: "home_repair_service", trackingType: "Hours-based" },
      { name: "In-Suite Dryer Vent Cleaning", description: "Individual unit dryer vent cleaning with unit tracking", icon: "meeting_room", trackingType: "Unit-based" },
      { name: "Parkade Pressure Cleaning", description: "Parking structure pressure washing with stall tracking", icon: "local_parking", trackingType: "Stall-based" },
      { name: "Ground Window Cleaning", description: "Ground-level and low-rise window cleaning", icon: "storefront", trackingType: "Hours-based" },
      { name: "Painting", description: "Rope access painting and coating services", icon: "format_paint", trackingType: "Hours-based" },
      { name: "Inspection", description: "Building facade inspection and assessment", icon: "fact_check", trackingType: "Hours-based" },
    ]
  },
  {
    category: "Custom Services",
    description: "Create and save custom job types for your company",
    services: [
      { name: "Custom Job Types", description: "Define your own specialized services with configurable tracking", icon: "more_horiz", trackingType: "Configurable" },
    ]
  }
];

const pagesData: PageCategory[] = [
  {
    category: "Landing Pages",
    icon: Globe,
    iconColor: "text-action-600 dark:text-action-400",
    pages: [
      { name: "Technician Landing", path: "/technician", description: "Technician signup and PLUS upgrade page", roles: ["Public"] },
      { name: "Employer Landing", path: "/employer", description: "Employer/company information page", roles: ["Public"] },
      { name: "Login", path: "/login", description: "User authentication", roles: ["Public"] },
      { name: "Get License", path: "/get-license", description: "Subscription pricing", roles: ["Public"] },
      { name: "Resident/PM Linking", path: "/link", description: "Link account with company code", roles: ["Public"] },
    ]
  },
  {
    category: "Documentation & Guides",
    icon: FileText,
    iconColor: "text-success-600",
    pages: [
      { name: "Changelog", path: "/changelog", description: "Platform feature overview", roles: ["Public"] },
      { name: "Pricing", path: "/changelog/pricing", description: "Subscription tiers and add-ons", roles: ["Public"] },
      { name: "Safety Guide", path: "/changelog/safety", description: "Safety & compliance documentation guide", roles: ["Public"] },
      { name: "Inventory Guide", path: "/changelog/inventory", description: "Equipment tracking guide", roles: ["Public"] },
      { name: "User Access Guide", path: "/changelog/user-access", description: "Roles, permissions, and authentication", roles: ["Public"] },
      { name: "Projects Guide", path: "/changelog/projects", description: "Project management and job types", roles: ["Public"] },
      { name: "Time Tracking Guide", path: "/changelog/time-tracking", description: "Work sessions and clock in/out", roles: ["Public"] },
      { name: "IRATA Logging Guide", path: "/changelog/irata-logging", description: "Task logging for certification progression", roles: ["Public"] },
      { name: "Document Management Guide", path: "/changelog/documents", description: "Document storage and compliance tracking", roles: ["Public"] },
      { name: "Employee Management Guide", path: "/changelog/employees", description: "Workforce administration and certifications", roles: ["Public"] },
      { name: "Scheduling Guide", path: "/changelog/scheduling", description: "Calendar and time-off management", roles: ["Public"] },
      { name: "Quoting Guide", path: "/changelog/quoting", description: "Sales pipeline and quote creation", roles: ["Public"] },
      { name: "CRM Guide", path: "/changelog/crm", description: "Client relationship management", roles: ["Public"] },
      { name: "Resident Portal Guide", path: "/changelog/resident-portal", description: "Resident communication and feedback", roles: ["Public"] },
      { name: "Branding Guide", path: "/changelog/branding", description: "White-label customization", roles: ["Public"] },
      { name: "Platform Administration Guide", path: "/changelog/platform-admin", description: "SuperUser management and metrics", roles: ["Public"] },
      { name: "Analytics & Reporting Guide", path: "/changelog/analytics", description: "Business intelligence and reports", roles: ["Public"] },
      { name: "Multi-Language Guide", path: "/changelog/language", description: "Internationalization and localization", roles: ["Public"] },
      { name: "GPS & Location Guide", path: "/changelog/gps", description: "Location tracking and verification", roles: ["Public"] },
      { name: "Property Manager Guide", path: "/changelog/property-manager", description: "Vendor management interface", roles: ["Public"] },
      { name: "CSR Guide", path: "/changelog/csr", description: "Company Safety Rating system", roles: ["Public"] },
      { name: "Technician Registration Guide", path: "/changelog/technician-registration", description: "Self-registration workflow", roles: ["Public"] },
      { name: "Payroll Guide", path: "/changelog/payroll", description: "Timesheet and payroll processing", roles: ["Public"] },
      { name: "Mobile Design Guide", path: "/changelog/mobile-design", description: "Mobile-first design patterns", roles: ["Public"] },
      { name: "Job Board Guide", path: "/changelog/job-board", description: "Employment marketplace ecosystem", roles: ["Public"] },
      { name: "Portable Accounts & Connections", path: "/changelog/connections", description: "Account binding and network effects", roles: ["Public"] },
    ]
  },
  {
    category: "Module Landing Pages",
    icon: Globe,
    iconColor: "text-action-600 dark:text-action-400",
    pages: [
      { name: "Safety Compliance", path: "/modules/safety-compliance", description: "Safety documentation module overview", roles: ["Public"] },
      { name: "User Access & Auth", path: "/modules/user-access-authentication", description: "Authentication module overview", roles: ["Public"] },
      { name: "Project Management", path: "/modules/project-management", description: "Project tracking module overview", roles: ["Public"] },
      { name: "Work Session Tracking", path: "/modules/work-session-time-tracking", description: "Time tracking module overview", roles: ["Public"] },
      { name: "Company Safety Rating", path: "/modules/company-safety-rating", description: "CSR module overview", roles: ["Public"] },
      { name: "IRATA Task Logging", path: "/modules/irata-sprat-task-logging", description: "Certification hours logging overview", roles: ["Public"] },
      { name: "Document Management", path: "/modules/document-management", description: "Document storage module overview", roles: ["Public"] },
      { name: "Employee Management", path: "/modules/employee-management", description: "Workforce admin module overview", roles: ["Public"] },
      { name: "Technician Passport", path: "/modules/technician-passport", description: "Technician profile and PLUS tier overview", roles: ["Public"] },
      { name: "Technician Job Board", path: "/modules/technician-job-board", description: "Job browser, applications, and profile visibility", roles: ["Public"] },
      { name: "Employer Job Board", path: "/modules/employer-job-board", description: "Talent browser, unlimited postings, direct offers", roles: ["Public"] },
      { name: "Gear Inventory", path: "/modules/gear-inventory", description: "Equipment tracking and compliance module overview", roles: ["Public"] },
      { name: "Scheduling & Calendar", path: "/modules/scheduling-calendar", description: "Team scheduling and time-off management overview", roles: ["Public"] },
      { name: "Payroll & Financial", path: "/modules/payroll-financial", description: "Payroll processing and financial reporting overview", roles: ["Public"] },
      { name: "Quoting & Sales Pipeline", path: "/modules/quoting-sales-pipeline", description: "Quote generation and sales CRM overview", roles: ["Public"] },
      { name: "White-Label Branding", path: "/modules/white-label-branding", description: "Custom branding and logo customization overview", roles: ["Public"] },
      { name: "Resident Portal", path: "/modules/resident-portal", description: "Resident feedback and communication overview", roles: ["Public"] },
      { name: "Property Manager Interface", path: "/modules/property-manager-interface", description: "Vendor management and portfolio overview", roles: ["Public"] },
      { name: "Client Relationship Management", path: "/modules/client-relationship-management", description: "Client and building database overview", roles: ["Public"] },
    ]
  },
  {
    category: "Technician Portal",
    icon: HardHat,
    iconColor: "text-warning-600",
    pages: [
      { name: "Technician Dashboard", path: "/technician", description: "Personal technician portal with profile and certifications", roles: ["Technician"] },
      { name: "My Profile", path: "/technician/profile", description: "Personal information, certifications, and documents", roles: ["Technician"] },
      { name: "My Logged Hours", path: "/technician/hours", description: "IRATA task logging history and statistics", roles: ["Technician"] },
      { name: "My Gear", path: "/technician/gear", description: "Personal equipment assignments", roles: ["Technician"] },
      { name: "My Employers", path: "/technician/employers", description: "Connected companies and PLUS multi-employer management", roles: ["Technician"] },
      { name: "Pending Invitations", path: "/technician/invitations", description: "Team invitations from companies", roles: ["Technician"] },
      { name: "Personal Safety Docs", path: "/personal-safety-documents", description: "View personal safety documentation", roles: ["Technician"] },
      { name: "Technician Registration", path: "/technician", description: "Technician signup and PLUS upgrade page", roles: ["Public"] },
    ]
  },
  {
    category: "Building Manager Portal",
    icon: Building2,
    iconColor: "text-violet-600 dark:text-violet-400",
    pages: [
      { name: "Building Dashboard", path: "/building-portal", description: "Single-building management dashboard", roles: ["Building Manager"] },
      { name: "Service History", path: "/building-portal/history", description: "Maintenance and service records", roles: ["Building Manager"] },
      { name: "Anchor Documents", path: "/building-portal/anchors", description: "Anchor inspection and certification docs", roles: ["Building Manager"] },
      { name: "Vendor COI", path: "/building-portal/coi", description: "Vendor certificates of insurance", roles: ["Building Manager"] },
      { name: "Safety Rating", path: "/building-portal/safety", description: "Vendor CSR scores and breakdowns", roles: ["Building Manager"] },
    ]
  },
  {
    category: "Employee Dashboard & Core",
    icon: LayoutDashboard,
    iconColor: "text-action-600 dark:text-action-400",
    pages: [
      { name: "Dashboard", path: "/dashboard", description: "Main employee dashboard with project cards", roles: ["Company", "Ops Manager", "Supervisor", "Technician"] },
      { name: "Projects", path: "/projects", description: "Project management and creation", roles: ["Company", "Ops Manager", "Supervisor"] },
      { name: "Employees", path: "/employees", description: "Employee management and onboarding", roles: ["Company", "Ops Manager", "Supervisor"] },
      { name: "Clients", path: "/clients", description: "Client and building management", roles: ["Company", "Ops Manager", "Supervisor"] },
      { name: "Settings", path: "/settings", description: "Account settings and preferences", roles: ["All Employees"] },
    ]
  },
  {
    category: "Safety & Compliance",
    icon: Shield,
    iconColor: "text-rust-600 dark:text-rust-500",
    pages: [
      { name: "Harness Inspection", path: "/harness-inspection", description: "Digital harness inspection forms", roles: ["All Employees"] },
      { name: "Toolbox Meeting", path: "/toolbox-meeting", description: "Safety meeting documentation", roles: ["All Employees"] },
      { name: "FLHA Form", path: "/flha", description: "Field Level Hazard Assessment", roles: ["All Employees"] },
      { name: "Incident Report", path: "/incident-report", description: "Incident documentation and tracking", roles: ["All Employees"] },
      { name: "Method Statement", path: "/method-statement", description: "Work method documentation", roles: ["All Employees"] },
      { name: "Documents", path: "/documents", description: "Company documents and bulk export", roles: ["All Employees"] },
    ]
  },
  {
    category: "Time & Scheduling",
    icon: Clock,
    iconColor: "text-warning-600",
    pages: [
      { name: "Schedule", path: "/schedule", description: "Calendar and employee scheduling", roles: ["Company", "Ops Manager", "Supervisor"] },
      { name: "Active Workers", path: "/active-workers", description: "Real-time worker tracking", roles: ["Company", "Ops Manager", "Supervisor"] },
      { name: "My Logged Hours", path: "/my-logged-hours", description: "IRATA task logging history", roles: ["IRATA Technicians"] },
      { name: "Non-Billable Hours", path: "/non-billable-hours", description: "Non-billable time entries", roles: ["All Employees"] },
      { name: "Hours Analytics", path: "/hours-analytics", description: "Billable vs non-billable insights", roles: ["Company", "Ops Manager", "Supervisor"] },
    ]
  },
  {
    category: "Financial & Payroll",
    icon: CreditCard,
    iconColor: "text-success-600",
    pages: [
      { name: "Payroll", path: "/payroll", description: "Timesheet and payroll management", roles: ["Company", "Ops Manager", "Supervisor"] },
      { name: "Quotes", path: "/quotes", description: "Quote generation with labor costs", roles: ["Company", "Ops Manager", "Supervisor", "Technician"] },
    ]
  },
  {
    category: "Equipment & Inventory",
    icon: Package,
    iconColor: "text-action-500 dark:text-action-400",
    pages: [
      { name: "Inventory", path: "/inventory", description: "Gear and equipment tracking", roles: ["All Employees"] },
    ]
  },
  {
    category: "Resident Portal",
    icon: Home,
    iconColor: "text-action-600 dark:text-action-400",
    pages: [
      { name: "Resident Dashboard", path: "/resident", description: "Resident feedback and photo access", roles: ["Resident"] },
    ]
  },
  {
    category: "Property Manager Portal",
    icon: Building2,
    iconColor: "text-action-600 dark:text-action-400",
    pages: [
      { name: "My Vendors", path: "/property-manager", description: "Vendor management dashboard", roles: ["Property Manager"] },
      { name: "PM Settings", path: "/property-manager/settings", description: "Property manager account settings", roles: ["Property Manager"] },
    ]
  },
  {
    category: "Job Board",
    icon: Briefcase,
    iconColor: "text-success-600",
    pages: [
      { name: "Technician Job Board", path: "/technician-job-board", description: "Browse jobs and manage visibility", roles: ["Technician"] },
      { name: "Company Job Board", path: "/company-job-board", description: "Post jobs and browse candidates", roles: ["Company", "Ops Manager"] },
      { name: "Visible Technicians", path: "/visible-technicians", description: "Browse technicians visible to employers", roles: ["Company", "Ops Manager"] },
      { name: "SuperUser Job Board", path: "/superuser/job-board", description: "Platform-wide job management", roles: ["SuperUser"] },
    ]
  },
  {
    category: "Communication",
    icon: MessageSquare,
    iconColor: "text-action-500 dark:text-action-400",
    pages: [
      { name: "Residents Management", path: "/residents", description: "Resident feedback management", roles: ["Company", "Ops Manager", "Supervisor"] },
      { name: "Feedback Detail", path: "/complaints/:id", description: "Individual feedback view", roles: ["Company", "Ops Manager", "Supervisor", "Resident"] },
    ]
  },
  {
    category: "SuperUser Administration",
    icon: Settings,
    iconColor: "text-neutral-400",
    pages: [
      { name: "SuperUser Dashboard", path: "/superuser", description: "Platform administration hub", roles: ["SuperUser"] },
      { name: "All Companies", path: "/superuser/companies", description: "Company oversight and management", roles: ["SuperUser"] },
      { name: "Company Detail", path: "/superuser/companies/:id", description: "Individual company analytics", roles: ["SuperUser"] },
      { name: "All Technicians", path: "/superuser/technicians", description: "Platform-wide technician management", roles: ["SuperUser"] },
      { name: "Goals & KPIs", path: "/superuser/goals", description: "Year 1 operational metrics tracking", roles: ["SuperUser"] },
      { name: "Platform Metrics", path: "/superuser/metrics", description: "MRR, churn, LTV, and revenue analytics", roles: ["SuperUser"] },
      { name: "Task Management", path: "/superuser/tasks", description: "Internal project management with comments", roles: ["SuperUser"] },
      { name: "Feature Requests", path: "/superuser/feature-requests", description: "Customer feature requests and messaging", roles: ["SuperUser"] },
      { name: "Global Buildings", path: "/superuser/buildings", description: "Central database of all buildings", roles: ["SuperUser"] },
      { name: "Founder Resources", path: "/superuser/founder-resources", description: "Private development tools and roadmap", roles: ["SuperUser"] },
      { name: "View as Company", path: "/superuser/view-as/:id", description: "Impersonation mode for support", roles: ["SuperUser"] },
      { name: "Future Ideas", path: "/superuser/future-ideas", description: "Backlog of planned features", roles: ["SuperUser"] },
    ]
  },
  {
    category: "Tools & Utilities",
    icon: Zap,
    iconColor: "text-amber-600 dark:text-amber-400",
    pages: [
      { name: "ROI Calculator", path: "/roi-calculator", description: "Calculate platform return on investment", roles: ["Public"] },
    ]
  },
];

const changelogData: ChangelogSection[] = [
  {
    title: "Authentication & User Management",
    icon: Lock,
    iconColor: "text-action-600 dark:text-action-400",
    description: "Secure multi-tenant authentication with role-based access control",
    features: [
      "Session-based authentication with secure HTTP-only cookies",
      "Multi-role support: Company Owner, Operations Manager, Supervisor, Rope Access Tech, Ground Crew",
      "Separate registration flows for Companies, Employees, Residents, and Property Managers",
      "Unique resident codes and property manager codes for secure account linking",
      "Password change and account deletion capabilities",
      "Employee onboarding with automatic credential generation"
    ],
    status: "complete"
  },
  {
    title: "Project Management System",
    icon: Building2,
    iconColor: "text-action-600 dark:text-action-400",
    description: "Comprehensive project tracking for rope access operations",
    features: [
      "Multiple job types: Window Cleaning, Dryer Vent, Building Wash, Parkade Cleaning, and more",
      "Custom job type creation and saving for reuse",
      "Visual job type selector with icons",
      "Directional drop tracking (North, East, South, West)",
      "Daily drop targets and progress visualization",
      "Project timeline management with start/end dates",
      "Calendar color coding for visual identification",
      "Employee assignment to projects",
      "Project-specific document uploads"
    ],
    status: "complete"
  },
  {
    title: "Work Session & Time Tracking",
    icon: Clock,
    iconColor: "text-success-600",
    description: "Real-time workforce tracking with GPS and elevation logging",
    features: [
      "Clock in/out with real-time GPS location capture",
      "Elevation-specific drop logging per work session",
      "Automatic hours calculation",
      "Break time tracking",
      "Billable vs non-billable hours categorization",
      "Work session history with filtering",
      "Active workers dashboard for real-time monitoring",
      "Timezone-aware time display across the entire application"
    ],
    status: "complete"
  },
  {
    title: "IRATA Task Logging System",
    icon: ClipboardCheck,
    iconColor: "text-action-500 dark:text-action-400",
    description: "Comprehensive work hours logging for IRATA certification progression",
    features: [
      "Task selection dialog after ending work sessions (IRATA technicians only)",
      "20+ canonical rope access task types including rope transfer, ascending, descending, rigging, deviation, rescue techniques",
      "Server-derived metadata from authoritative work session and project records",
      "Security hardening with canonical task validation and ownership verification",
      "My Logged Hours page with full history, filtering, and statistics",
      "Pre-existing logbook hours entry for baseline tracking",
      "Automatic accumulation of new session hours with baseline"
    ],
    status: "complete"
  },
  {
    title: "Safety & Compliance Documentation",
    icon: Shield,
    iconColor: "text-rust-600 dark:text-rust-500",
    description: "Digital safety forms with signatures, personal kit integration, and PDF export",
    features: [
      "Harness Inspection Forms with personal kit selection",
      "Link inspections to technician's assigned equipment by serial number",
      "Toolbox Meeting documentation with attendee signatures",
      "FLHA (Field Level Hazard Assessment) forms",
      "Incident Report forms with comprehensive tracking",
      "Method Statement documentation",
      "Quick access safety form buttons on project pages",
      "Digital signature capture for all safety documents",
      "Professional PDF generation with embedded signatures",
      "7-day coverage window for toolbox meeting compliance",
      "Cross-project harness inspection tracking",
      "Date of manufacture tracking for gear"
    ],
    status: "complete"
  },
  {
    title: "Company Safety Rating (CSR)",
    icon: Star,
    iconColor: "text-amber-600 dark:text-amber-400",
    description: "Penalty-based safety compliance scoring system starting at 100%",
    features: [
      "Starts at 100% with proportional penalties (max 80% total penalty)",
      "Documentation penalty (25%): Missing Certificate of Insurance, Health & Safety Manual, or Company Policy",
      "Toolbox Meeting penalty (25% max): Based on work session coverage ratio",
      "Harness Inspection penalty (25% max): Based on inspection completion rate",
      "Document Review penalty (5% max): Unsigned acknowledgments for H&S Manual, Company Policy, Safe Work Procedures, and Safe Work Practices",
      "Project Completion tracking (informational only, no penalty)",
      "7-day bidirectional coverage window for toolbox meetings",
      "Detailed CSR breakdown visible to property managers",
      "Real-time compliance status indicators on dashboard",
      "Color-coded progress bars for each compliance component"
    ],
    status: "complete"
  },
  {
    title: "Document Management",
    icon: FileText,
    iconColor: "text-success-600",
    description: "Centralized document storage with compliance tracking and role-based access",
    features: [
      "Health & Safety Manual uploads with employee acknowledgment",
      "Company Policy document management with signature tracking",
      "Certificate of Insurance (restricted to owners/managers)",
      "Safe Work Procedures templates library (10 templates with PDF generation)",
      "Safe Work Practices library (10 daily safety topics with acknowledgment and sign-off)",
      "Equipment Inspections tracking with compliance status",
      "Damage Reports with specific equipment serial number linking",
      "Employee signature compliance reports with download capability",
      "Clean dropdown navigation between document types",
      "Collapsible document review sections for better organization",
      "Role-based visibility for sensitive documents",
      "Document upload with file type validation",
      "Bulk export of date-ranged documents as ZIP files",
      "Professional PDF generation for all safety records"
    ],
    status: "complete"
  },
  {
    title: "Employee Management",
    icon: Users,
    iconColor: "text-action-600 dark:text-action-400",
    description: "Complete workforce administration with team invitations and certification tracking",
    features: [
      "Employee profile management with contact details",
      "IRATA and SPRAT certification level and expiration tracking",
      "Team invitation system: Search technicians by license or email, send invitations",
      "Technician accepts/declines invitations from their portal",
      "Owner notification when technicians accept invitations",
      "Multi-employer connections for PLUS technicians",
      "AI license verification using Gemini screenshot analysis",
      "Driver's license management with document uploads",
      "Emergency contact information",
      "Hourly rate configuration",
      "Role and permission assignment",
      "Employee termination (unlinks technician, preserves their account)",
      "Password reset by administrators"
    ],
    status: "complete"
  },
  {
    title: "Technician Self-Registration",
    icon: HardHat,
    iconColor: "text-warning-600",
    description: "Streamlined 4-screen registration with referral system and PLUS access tier",
    features: [
      "Simplified 4-screen registration flow (down from 20 screens)",
      "Personal info: Name, email, password, phone",
      "Certification info: IRATA/SPRAT level, license number, expiration",
      "Contact info: Address with Geoapify autocomplete",
      "Financial info: SIN (encrypted), banking details for payroll",
      "Referral code system: 12-character unique codes for technicians",
      "One-sided referral benefit: Code sharer gets PLUS upgrade",
      "Technician PLUS access tier with premium features",
      "PLUS badge displayed next to technician names",
      "Certification expiry alerts: 60-day yellow, 30-day red badges",
      "Unlimited employer connections for PLUS members",
      "Resume/CV document uploads with preview",
      "Profile visibility toggle for Job Board",
      "Bilingual support (English/French) throughout"
    ],
    status: "complete"
  },
  {
    title: "Scheduling & Time-Off Management",
    icon: Calendar,
    iconColor: "text-warning-600",
    description: "Dual-calendar system with comprehensive leave management",
    features: [
      "Project calendar with drag-and-drop assignment",
      "Employee schedule view with conflict detection",
      "Time-off request submission by employees",
      "Multiple leave types: Vacation, Sick Leave, Personal, Bereavement, Medical",
      "Date range selection for leave requests",
      "Manager approval workflow for time-off",
      "Calendar color coding by project",
      "Resource timeline view"
    ],
    status: "complete"
  },
  {
    title: "Gear & Equipment Inventory",
    icon: Wrench,
    iconColor: "text-slate-600 dark:text-slate-400",
    description: "Equipment tracking with serial numbers, damage reporting, and personal kit management",
    features: [
      "Comprehensive gear inventory management with category organization",
      "Serial number tracking for individual equipment units",
      "Personal equipment kit assignment to technicians",
      "Equipment damage reporting linked to specific serial numbers",
      "Damage report PDF generation with equipment details and photos",
      "Equipment retirement workflow for damaged or expired gear",
      "Date of manufacture and expiration tracking",
      "Service history and maintenance schedules",
      "My Gear view for individual technicians",
      "Integration with harness inspection forms",
      "Equipment status tracking and compliance indicators"
    ],
    status: "complete"
  },
  {
    title: "Payroll & Financial",
    icon: CreditCard,
    iconColor: "text-success-600",
    description: "Timesheet generation and payroll processing",
    features: [
      "Configurable pay periods (weekly, bi-weekly, semi-monthly, monthly)",
      "Automatic timesheet generation from work sessions",
      "Overtime calculation with configurable thresholds",
      "Billable vs non-billable hour tracking",
      "Timesheet approval workflow",
      "Export capabilities for payroll processing",
      "Hours analytics dashboard"
    ],
    status: "complete"
  },
  {
    title: "Quoting & Sales Pipeline",
    icon: TrendingUp,
    iconColor: "text-action-500 dark:text-action-400",
    description: "Complete CRM with quote generation, pipeline tracking, and analytics",
    features: [
      "Quote creation with itemized services and labor cost calculations",
      "Kanban-style pipeline view with drag-and-drop stage transitions",
      "Pipeline stages: Draft, Sent, Negotiating, Won, Lost",
      "Email quotes directly to customers as professional PDF attachments",
      "CRM analytics dashboard with win rates and revenue tracking",
      "Stage breakdown charts and time-range filtering (week/month/year/all)",
      "Tax computation (GST/HST) with automatic calculations",
      "Quote to project conversion workflow",
      "Permission-based access to financial data"
    ],
    status: "complete"
  },
  {
    title: "Client Relationship Management",
    icon: Building2,
    iconColor: "text-violet-600 dark:text-violet-400",
    description: "Client and building record management",
    features: [
      "Client profile creation and management",
      "Building information with LMS numbers",
      "Multi-building support per client",
      "Autofill intelligence for project creation",
      "Client contact information management",
      "Building-specific details (floors, units, parking stalls)"
    ],
    status: "complete"
  },
  {
    title: "Resident Portal",
    icon: Home,
    iconColor: "text-rose-600 dark:text-rose-400",
    description: "Building resident communication and feedback management",
    features: [
      "Secure resident registration with company code linking",
      "Feedback submission with photo attachments",
      "Two-way communication on feedback",
      "Work history visibility for resident units",
      "Photo gallery with unit-specific tagging",
      "Notification badges for new updates",
      "Project progress visibility"
    ],
    status: "complete"
  },
  {
    title: "Property Manager Interface",
    icon: UserCheck,
    iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
    description: "Dedicated vendor management dashboard for property managers",
    features: [
      "Separate dashboard from employee interface",
      "Link to multiple rope access companies via property manager codes",
      "Vendor summary view with company details and active projects",
      "Read-only access to vendor safety documents",
      "CSR score visibility with detailed breakdowns",
      "Project status monitoring",
      "Strata number configuration",
      "Anchor inspection document uploads"
    ],
    status: "complete"
  },
  {
    title: "Subscription & Billing",
    icon: CreditCard,
    iconColor: "text-yellow-600 dark:text-yellow-400",
    description: "Stripe-integrated subscription management",
    features: [
      "Four pricing tiers: Basic ($79), Starter ($299), Premium ($499), Enterprise ($899)",
      "Mandatory 30-day free trial for all new subscriptions",
      "USD pricing with automatic currency conversion via customer's bank",
      "Prorated upgrades and downgrades with immediate billing adjustment",
      "Additional seat purchases ($19 for 2 seats)",
      "Extra project add-ons ($49 per project)",
      "White-label branding add-on ($49/month)",
      "Automatic license key management during tier changes",
      "Subscription status monitoring"
    ],
    status: "complete"
  },
  {
    title: "White-Label Branding",
    icon: Palette,
    iconColor: "text-sky-600 dark:text-sky-400",
    description: "Full platform customization with company branding",
    features: [
      "Subscription-gated feature ($49/month)",
      "Custom company logo upload",
      "Unlimited brand color selection",
      "Global CSS variable application for consistent theming",
      "Real-time color preview and updates",
      "Branding applied across all authenticated pages",
      "Company name on safety document PDFs",
      "Automatic cleanup when branding disabled"
    ],
    status: "complete"
  },
  {
    title: "Platform Administration & Metrics",
    icon: Activity,
    iconColor: "text-neutral-400",
    description: "Comprehensive platform oversight with revenue tracking and customer health monitoring",
    features: [
      "Centralized company oversight dashboard",
      "Platform metrics dashboard with MRR, ARR, and revenue tracking",
      "Customer churn monitoring and resubscription tracking",
      "Lifetime value (LTV) and customer acquisition cost (CAC) analytics",
      "License status monitoring across all companies",
      "Feature request management system with status tracking",
      "User and subscription management tools",
      "Detailed company analytics and activity metrics",
      "System-wide reporting capabilities",
      "Revenue trend visualization and forecasting"
    ],
    status: "complete"
  },
  {
    title: "Analytics & Reporting",
    icon: BarChart3,
    iconColor: "text-lime-600 dark:text-lime-400",
    description: "Comprehensive operational insights and metrics",
    features: [
      "Billable vs non-billable hours analysis",
      "Employee productivity metrics",
      "Project labor cost tracking",
      "Real-time active worker monitoring",
      "Hours analytics with date range filtering",
      "Project progress visualization"
    ],
    status: "complete"
  },
  {
    title: "Multi-Language Support",
    icon: Languages,
    iconColor: "text-action-600 dark:text-action-400",
    description: "Internationalization with full French translation and user language preferences",
    features: [
      "Complete French translation of all interface elements",
      "Language toggle accessible from login and settings pages",
      "User language preference saved to profile settings",
      "Localized date and time formatting based on language",
      "FullCalendar localization for schedule views",
      "Form validation messages in selected language",
      "Safety form translations including equipment categories",
      "Email notifications in user's preferred language",
      "Browser language auto-detection for new users"
    ],
    status: "complete"
  },
  {
    title: "Mobile-First Design",
    icon: Smartphone,
    iconColor: "text-action-600 dark:text-action-400",
    description: "Optimized for field worker mobile usage",
    features: [
      "Responsive design across all pages",
      "Touch-friendly interface elements",
      "Mobile-optimized forms and dialogs",
      "Swipe-friendly navigation",
      "Compact mobile views with expandable details",
      "Bottom navigation for key actions"
    ],
    status: "complete"
  },
  {
    title: "GPS & Location Services",
    icon: MapPin,
    iconColor: "text-rust-600 dark:text-rust-500",
    description: "Location tracking for work sessions and projects",
    features: [
      "GPS capture on clock in/out",
      "Location visualization with Leaflet maps",
      "Project location mapping",
      "Building address geocoding"
    ],
    status: "complete"
  },
  {
    title: "Job Board Ecosystem",
    icon: Briefcase,
    iconColor: "text-success-600",
    description: "Connect technicians with employment opportunities across the platform",
    features: [
      "Company and SuperUser job posting with salary ranges and requirements",
      "Multiple job types: Full-time, Part-time, Contract, Seasonal, Project-based",
      "Required certifications specification (IRATA Level 1/2/3, SPRAT, etc.)",
      "Technician job browsing with filter and search capabilities",
      "Profile visibility toggle to make technician profiles discoverable by employers",
      "Visible profiles display resume, safety rating, name, experience, and certifications",
      "Direct job application submission with application tracking",
      "Employer candidate browser to review visible technician profiles",
      "SuperUser job board management for platform-wide oversight",
      "Application status tracking: Pending, Reviewed, Contacted, Rejected"
    ],
    status: "complete"
  }
];

function getStatusBadge(status: "complete" | "in-progress" | "planned") {
  switch (status) {
    case "complete":
      return <Badge className="bg-success-100 text-success-600 dark:bg-success-600/20 border-success-600/20">Complete</Badge>;
    case "in-progress":
      return <Badge className="bg-warning-100 text-warning-600 dark:bg-warning-600/20 border-warning-600/20">In Progress</Badge>;
    case "planned":
      return <Badge className="bg-action-600/10 text-action-600 dark:bg-action-600/20 dark:text-action-400 border-action-600/20">Planned</Badge>;
  }
}

export default function Changelog() {
  const completedCount = changelogData.filter(s => s.status === "complete").length;
  const totalFeatures = changelogData.reduce((acc, section) => acc + section.features.length, 0);

  return (
    <ChangelogGuideLayout 
      title="Platform Changelog"
      version="1.0"
      lastUpdated="December 16, 2025"
    >
      <div className="space-y-8">
        <div className="text-lg text-muted-foreground">
          <p>Development progress and feature overview</p>
        </div>
          
          <Card className="bg-gradient-to-br from-neutral-100 via-neutral-50 to-transparent dark:from-navy-900 dark:via-navy-950 dark:to-transparent">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success-100 dark:bg-success-600/20 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-success-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{completedCount}</div>
                    <div className="text-sm text-muted-foreground">Sections Complete</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-action-600/10 dark:bg-action-600/20 rounded-lg">
                    <Zap className="h-5 w-5 text-action-600 dark:text-action-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalFeatures}</div>
                    <div className="text-sm text-muted-foreground">Features Implemented</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-action-500/10 dark:bg-action-500/20 rounded-lg">
                    <Package className="h-5 w-5 text-action-500 dark:text-action-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{pagesData.reduce((acc, cat) => acc + cat.pages.length, 0)}</div>
                    <div className="text-sm text-muted-foreground">Pages & Views</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning-100 dark:bg-warning-600/20 rounded-lg">
                    <Wrench className="h-5 w-5 text-warning-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{servicesData.reduce((acc, cat) => acc + cat.services.length, 0)}</div>
                    <div className="text-sm text-muted-foreground">Service Types</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-action-400/10 dark:bg-action-400/20 rounded-lg">
                    <Code className="h-5 w-5 text-action-600 dark:text-action-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">202,872</div>
                    <div className="text-sm text-muted-foreground">Lines of Code</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-6">Module / Feature Changelog</h2>

        <div className="space-y-4">
          {changelogData.map((section, index) => {
            const Icon = section.icon;
            const isInventorySection = section.title === "Gear & Equipment Inventory";
            const isSafetySection = section.title === "Safety & Compliance Documentation" || section.title === "Company Safety Rating (CSR)";
            const isUserAccessSection = section.title === "Authentication & User Management";
            const isProjectsSection = section.title === "Project Management System";
            const isTimeTrackingSection = section.title === "Work Session & Time Tracking";
            const isIRATASection = section.title === "IRATA Task Logging System";
            const isDocumentSection = section.title === "Document Management";
            const isEmployeeSection = section.title === "Employee Management";
            const isSchedulingSection = section.title === "Scheduling & Time-Off Management";
            const isQuotingSection = section.title === "Quoting & Sales Pipeline";
            const isCRMSection = section.title === "Client Relationship Management";
            const isResidentPortalSection = section.title === "Resident Portal";
            const isBrandingSection = section.title === "White-Label Branding";
            const isPlatformAdminSection = section.title === "Platform Administration & Metrics";
            const isAnalyticsSection = section.title === "Analytics & Reporting";
            const isLanguageSection = section.title === "Multi-Language Support";
            const isGPSSection = section.title === "GPS & Location Services";
            const isPropertyManagerSection = section.title === "Property Manager Interface";
            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl bg-muted/50 ring-1 ring-border/50`}>
                      <Icon className={`h-5 w-5 ${section.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        {getStatusBadge(section.status)}
                        {isInventorySection && (
                          <Link href="/changelog/inventory">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-inventory-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isSafetySection && (
                          <Link href="/changelog/safety">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-safety-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isUserAccessSection && (
                          <Link href="/changelog/user-access">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-user-access-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isProjectsSection && (
                          <Link href="/changelog/projects">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-projects-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isTimeTrackingSection && (
                          <Link href="/changelog/time-tracking">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-time-tracking-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isIRATASection && (
                          <Link href="/changelog/irata-logging">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-irata-logging-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isDocumentSection && (
                          <Link href="/changelog/documents">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-documents-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isEmployeeSection && (
                          <Link href="/changelog/employees">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-employees-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isSchedulingSection && (
                          <Link href="/changelog/scheduling">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-scheduling-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isQuotingSection && (
                          <Link href="/changelog/quoting">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-quoting-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isCRMSection && (
                          <Link href="/changelog/crm">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-crm-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isResidentPortalSection && (
                          <Link href="/changelog/resident-portal">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-resident-portal-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isBrandingSection && (
                          <Link href="/changelog/branding">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-branding-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isPlatformAdminSection && (
                          <Link href="/changelog/platform-admin">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-platform-admin-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isAnalyticsSection && (
                          <Link href="/changelog/analytics">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-analytics-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isLanguageSection && (
                          <Link href="/changelog/language">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-language-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isGPSSection && (
                          <Link href="/changelog/gps">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-gps-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {isPropertyManagerSection && (
                          <Link href="/changelog/property-manager">
                            <Button variant="outline" size="sm" className="text-xs" data-testid="link-property-manager-guide">
                              View Guide
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                      </div>
                      <CardDescription className="mt-1">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="grid gap-2.5 text-base">
                    {section.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success-600 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-action-600/10 dark:bg-action-600/20 ring-1 ring-action-600/20">
                <FolderOpen className="h-5 w-5 text-action-600 dark:text-action-400" />
              </div>
              <div>
                <CardTitle className="text-xl">All Pages & Views</CardTitle>
                <CardDescription>
                  {pagesData.reduce((acc, cat) => acc + cat.pages.length, 0)} pages organized by category
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              {pagesData.map((category, catIndex) => {
                const CatIcon = category.icon;
                return (
                  <div key={catIndex}>
                    <div className="flex items-center gap-2 mb-3">
                      <CatIcon className={`h-4 w-4 ${category.iconColor}`} />
                      <h3 className="font-semibold text-base">{category.category}</h3>
                      <Badge variant="secondary" className="text-xs">{category.pages.length}</Badge>
                    </div>
                    <div className="grid gap-2">
                      {category.pages.map((page, pageIndex) => {
                        const isLinkable = !page.path.includes(':');
                        return (
                          <div 
                            key={pageIndex}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover-elevate"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-base">{page.name}</span>
                                  <code className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                    {page.path}
                                  </code>
                                </div>
                                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                                  {page.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                              <div className="hidden sm:flex flex-wrap gap-1 justify-end max-w-[200px]">
                                {page.roles.slice(0, 2).map((role, roleIndex) => (
                                  <Badge key={roleIndex} variant="outline" className="text-xs">
                                    {role}
                                  </Badge>
                                ))}
                                {page.roles.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{page.roles.length - 2}
                                  </Badge>
                                )}
                              </div>
                              {isLinkable && (
                                <Link href={page.path}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`link-page-${page.path.replace(/\//g, '-')}`}>
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {catIndex < pagesData.length - 1 && <Separator className="mt-4" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-warning-100 dark:bg-warning-600/20 ring-1 ring-warning-600/20">
                <History className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Recent Changes</CardTitle>
                <CardDescription>
                  Latest platform updates and improvements (December 2025)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {recentChangesData.map((change, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-base text-foreground">{change.title}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        change.type === 'feature' 
                          ? 'bg-success-100 text-success-600 dark:bg-success-600/20' 
                          : change.type === 'improvement'
                          ? 'bg-action-600/10 text-action-600 dark:bg-action-600/20 dark:text-action-400'
                          : 'bg-warning-100 text-warning-600 dark:bg-warning-600/20'
                      }`}
                    >
                      {change.type === 'feature' ? 'New Feature' : change.type === 'improvement' ? 'Improvement' : 'Fix'}
                    </Badge>
                  </div>
                  <p className="text-base text-muted-foreground mt-2.5 mb-2.5">{change.description}</p>
                  <p className="text-xs text-muted-foreground/70">{change.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 bg-gradient-to-br from-neutral-100 to-transparent dark:from-navy-900 dark:to-transparent">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Rope Access Management Platform</h3>
              <p className="text-base text-muted-foreground mb-4">
                Enterprise-grade, mobile-first web application for high-rise building maintenance operations
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline">React 18</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Node.js</Badge>
                <Badge variant="outline">PostgreSQL</Badge>
                <Badge variant="outline">Drizzle ORM</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
                <Badge variant="outline">Shadcn UI</Badge>
                <Badge variant="outline">Stripe</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
    </ChangelogGuideLayout>
  );
}
