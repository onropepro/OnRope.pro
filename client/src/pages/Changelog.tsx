import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
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
  Activity
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

const servicesData: ServiceItem[] = [
  { 
    name: "Window Cleaning", 
    description: "Rope access high-rise window cleaning with directional drop tracking",
    icon: "window",
    trackingType: "Drop-based (N/E/S/W)"
  },
  { 
    name: "Exterior Dryer Vent Cleaning", 
    description: "High-rise exterior dryer vent cleaning and maintenance",
    icon: "air",
    trackingType: "Drop-based (N/E/S/W)"
  },
  { 
    name: "Building Wash / Pressure Washing", 
    description: "Building exterior cleaning and pressure washing services",
    icon: "water_drop",
    trackingType: "Drop-based (N/E/S/W)"
  },
  { 
    name: "General Pressure Washing", 
    description: "Ground-level and general pressure washing services",
    icon: "cleaning_services",
    trackingType: "Hours-based"
  },
  { 
    name: "Gutter Cleaning", 
    description: "Gutter cleaning, maintenance, and debris removal",
    icon: "home_repair_service",
    trackingType: "Hours-based"
  },
  { 
    name: "In-Suite Dryer Vent Cleaning", 
    description: "Individual unit dryer vent cleaning with unit tracking",
    icon: "meeting_room",
    trackingType: "Unit-based"
  },
  { 
    name: "Parkade Pressure Cleaning", 
    description: "Parking structure pressure washing with stall tracking",
    icon: "local_parking",
    trackingType: "Stall-based"
  },
  { 
    name: "Ground Window Cleaning", 
    description: "Ground-level and low-rise window cleaning",
    icon: "storefront",
    trackingType: "Hours-based"
  },
  { 
    name: "Painting", 
    description: "Rope access painting and coating services",
    icon: "format_paint",
    trackingType: "Hours-based"
  },
  { 
    name: "Inspection", 
    description: "Building facade inspection and assessment",
    icon: "fact_check",
    trackingType: "Hours-based"
  },
  { 
    name: "Custom Services", 
    description: "Create and save custom job types for your company",
    icon: "more_horiz",
    trackingType: "Configurable"
  },
];

const pagesData: PageCategory[] = [
  {
    category: "Public Pages",
    icon: Globe,
    iconColor: "text-green-600 dark:text-green-400",
    pages: [
      { name: "Login", path: "/login", description: "User authentication", roles: ["Public"] },
      { name: "Register", path: "/register", description: "New company registration", roles: ["Public"] },
      { name: "Get License", path: "/get-license", description: "Subscription pricing", roles: ["Public"] },
      { name: "Resident/PM Linking", path: "/link", description: "Link account with company code", roles: ["Public"] },
      { name: "Changelog", path: "/changelog", description: "Platform feature overview", roles: ["Public"] },
      { name: "Pricing", path: "/changelog/pricing", description: "Subscription tiers and add-ons", roles: ["Public"] },
      { name: "Safety Guide", path: "/changelog/safety", description: "Safety & compliance documentation guide", roles: ["Public"] },
      { name: "Inventory Guide", path: "/changelog/inventory", description: "Equipment tracking guide", roles: ["Public"] },
      { name: "User Access Guide", path: "/changelog/user-access", description: "Roles, permissions, and authentication", roles: ["Public"] },
      { name: "Projects Guide", path: "/changelog/projects", description: "Project management and job types", roles: ["Public"] },
      { name: "Time Tracking Guide", path: "/changelog/time-tracking", description: "Work sessions and clock in/out", roles: ["Public"] },
    ]
  },
  {
    category: "Employee Dashboard & Core",
    icon: LayoutDashboard,
    iconColor: "text-blue-600 dark:text-blue-400",
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
    iconColor: "text-red-600 dark:text-red-400",
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
    iconColor: "text-orange-600 dark:text-orange-400",
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
    iconColor: "text-emerald-600 dark:text-emerald-400",
    pages: [
      { name: "Payroll", path: "/payroll", description: "Timesheet and payroll management", roles: ["Company", "Ops Manager", "Supervisor"] },
      { name: "Quotes", path: "/quotes", description: "Quote generation with labor costs", roles: ["Company", "Ops Manager", "Supervisor", "Technician"] },
    ]
  },
  {
    category: "Equipment & Inventory",
    icon: Package,
    iconColor: "text-purple-600 dark:text-purple-400",
    pages: [
      { name: "Inventory", path: "/inventory", description: "Gear and equipment tracking", roles: ["All Employees"] },
    ]
  },
  {
    category: "Resident Portal",
    icon: Home,
    iconColor: "text-cyan-600 dark:text-cyan-400",
    pages: [
      { name: "Resident Dashboard", path: "/resident", description: "Resident complaint and photo access", roles: ["Resident"] },
    ]
  },
  {
    category: "Property Manager Portal",
    icon: Building2,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    pages: [
      { name: "My Vendors", path: "/property-manager", description: "Vendor management dashboard", roles: ["Property Manager"] },
      { name: "PM Settings", path: "/property-manager/settings", description: "Property manager account settings", roles: ["Property Manager"] },
    ]
  },
  {
    category: "Communication",
    icon: MessageSquare,
    iconColor: "text-pink-600 dark:text-pink-400",
    pages: [
      { name: "Residents Management", path: "/residents", description: "Resident complaint management", roles: ["Company", "Ops Manager", "Supervisor"] },
      { name: "Complaint Detail", path: "/complaints/:id", description: "Individual complaint view", roles: ["Company", "Ops Manager", "Supervisor", "Resident"] },
    ]
  },
  {
    category: "Administration",
    icon: Settings,
    iconColor: "text-gray-600 dark:text-gray-400",
    pages: [
      { name: "SuperUser Dashboard", path: "/superuser", description: "Platform administration", roles: ["SuperUser"] },
      { name: "All Companies", path: "/superuser/companies", description: "Company oversight", roles: ["SuperUser"] },
      { name: "Company Detail", path: "/superuser/companies/:id", description: "Individual company analytics", roles: ["SuperUser"] },
    ]
  },
];

const changelogData: ChangelogSection[] = [
  {
    title: "Authentication & User Management",
    icon: Lock,
    iconColor: "text-blue-600 dark:text-blue-400",
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
    iconColor: "text-indigo-600 dark:text-indigo-400",
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
    iconColor: "text-emerald-600 dark:text-emerald-400",
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
    iconColor: "text-purple-600 dark:text-purple-400",
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
    iconColor: "text-red-600 dark:text-red-400",
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
    iconColor: "text-teal-600 dark:text-teal-400",
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
    iconColor: "text-cyan-600 dark:text-cyan-400",
    description: "Complete workforce administration with certification tracking",
    features: [
      "Employee profile management with contact details",
      "IRATA certification level and expiration tracking",
      "Driver's license management",
      "Emergency contact information",
      "Hourly rate configuration",
      "Role and permission assignment",
      "Employee termination procedures",
      "Password reset by administrators"
    ],
    status: "complete"
  },
  {
    title: "Scheduling & Time-Off Management",
    icon: Calendar,
    iconColor: "text-orange-600 dark:text-orange-400",
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
    iconColor: "text-green-600 dark:text-green-400",
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
    iconColor: "text-pink-600 dark:text-pink-400",
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
    description: "Building resident communication and complaint management",
    features: [
      "Secure resident registration with company code linking",
      "Complaint submission with photo attachments",
      "Two-way communication on complaints",
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
    iconColor: "text-gray-600 dark:text-gray-400",
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
    iconColor: "text-blue-600 dark:text-blue-400",
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
    iconColor: "text-indigo-600 dark:text-indigo-400",
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
    iconColor: "text-red-600 dark:text-red-400",
    description: "Location tracking for work sessions and projects",
    features: [
      "GPS capture on clock in/out",
      "Location visualization with Leaflet maps",
      "Project location mapping",
      "Building address geocoding"
    ],
    status: "complete"
  }
];

function getStatusBadge(status: "complete" | "in-progress" | "planned") {
  switch (status) {
    case "complete":
      return <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">Complete</Badge>;
    case "in-progress":
      return <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20">In Progress</Badge>;
    case "planned":
      return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20">Planned</Badge>;
  }
}

export default function Changelog() {
  const [, navigate] = useLocation();
  
  const completedCount = changelogData.filter(s => s.status === "complete").length;
  const totalFeatures = changelogData.reduce((acc, section) => acc + section.features.length, 0);

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BackButton size="icon" />
            <MainMenuButton size="icon" />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">Platform Changelog</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Development progress and feature overview
              </p>
            </div>
          </div>
          
          <Card className="bg-gradient-to-br from-primary/5 via-primary/2 to-transparent">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{completedCount}</div>
                    <div className="text-sm text-muted-foreground">Sections Complete</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalFeatures}</div>
                    <div className="text-sm text-muted-foreground">Features Implemented</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{pagesData.reduce((acc, cat) => acc + cat.pages.length, 0)}</div>
                    <div className="text-sm text-muted-foreground">Pages & Views</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{servicesData.length}</div>
                    <div className="text-sm text-muted-foreground">Service Types</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                <History className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Recent Changes</CardTitle>
                <CardDescription>
                  Latest platform updates and improvements (November 2025)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {recentChangesData.map((change, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/30"
                >
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-lg ${
                      change.type === 'feature' 
                        ? 'bg-emerald-500/10 ring-1 ring-emerald-500/20' 
                        : change.type === 'improvement'
                        ? 'bg-blue-500/10 ring-1 ring-blue-500/20'
                        : 'bg-orange-500/10 ring-1 ring-orange-500/20'
                    }`}>
                      {change.type === 'feature' ? (
                        <Zap className={`h-4 w-4 text-emerald-600 dark:text-emerald-400`} />
                      ) : change.type === 'improvement' ? (
                        <TrendingUp className={`h-4 w-4 text-blue-600 dark:text-blue-400`} />
                      ) : (
                        <Wrench className={`h-4 w-4 text-orange-600 dark:text-orange-400`} />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm">{change.title}</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          change.type === 'feature' 
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' 
                            : change.type === 'improvement'
                            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
                            : 'bg-orange-500/10 text-orange-700 dark:text-orange-300'
                        }`}
                      >
                        {change.type === 'feature' ? 'New Feature' : change.type === 'improvement' ? 'Improvement' : 'Fix'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{change.description}</p>
                    <p className="text-xs text-muted-foreground/70">{change.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
                <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Services Managed</CardTitle>
                <CardDescription>
                  {servicesData.length} service types available for project management
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-2">
              {servicesData.map((service, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <div className="p-2 rounded-lg bg-background ring-1 ring-border/50 flex-shrink-0">
                    <span className="material-icons text-lg text-muted-foreground">{service.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{service.name}</span>
                      <Badge variant="secondary" className="text-xs">{service.trackingType}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <FolderOpen className="h-5 w-5 text-primary" />
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
                      <h3 className="font-semibold text-sm">{category.category}</h3>
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
                                  <span className="font-medium text-sm">{page.name}</span>
                                  <code className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                    {page.path}
                                  </code>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
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

        <h2 className="text-xl font-bold mb-4">Feature Changelog</h2>

        <div className="space-y-4">
          {changelogData.map((section, index) => {
            const Icon = section.icon;
            const isInventorySection = section.title === "Gear & Equipment Inventory";
            const isSafetySection = section.title === "Safety & Compliance Documentation" || section.title === "Company Safety Rating (CSR)";
            const isUserAccessSection = section.title === "Authentication & User Management";
            const isProjectsSection = section.title === "Project Management System";
            const isTimeTrackingSection = section.title === "Work Session & Time Tracking";
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
                      </div>
                      <CardDescription className="mt-1">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="grid gap-2 text-sm">
                    {section.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 bg-gradient-to-br from-muted/50 to-transparent">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Rope Access Management Platform</h3>
              <p className="text-sm text-muted-foreground mb-4">
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
      </div>
    </div>
  );
}
