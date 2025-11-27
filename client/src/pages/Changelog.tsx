import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
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
  ExternalLink
} from "lucide-react";

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
    description: "Digital safety forms with signatures and PDF export",
    features: [
      "Harness Inspection Forms with detailed equipment checks",
      "Toolbox Meeting documentation with attendee signatures",
      "FLHA (Field Level Hazard Assessment) forms",
      "Incident Report forms with comprehensive tracking",
      "Method Statement documentation",
      "Digital signature capture for all safety documents",
      "Professional PDF generation with embedded signatures",
      "7-day coverage window for toolbox meeting compliance",
      "Date of manufacture tracking for gear"
    ],
    status: "complete"
  },
  {
    title: "Company Safety Rating (CSR)",
    icon: Star,
    iconColor: "text-amber-600 dark:text-amber-400",
    description: "Penalty-based safety compliance scoring system",
    features: [
      "Starts at 100% with proportional penalties for non-compliance",
      "Documentation component: Certificate of Insurance, Health & Safety Manual, Company Policy",
      "Toolbox Meeting compliance with 7-day bidirectional coverage window",
      "Harness Inspection completion tracking",
      "Detailed CSR breakdown visible to property managers",
      "Real-time compliance status indicators"
    ],
    status: "complete"
  },
  {
    title: "Document Management",
    icon: FileText,
    iconColor: "text-teal-600 dark:text-teal-400",
    description: "Centralized document storage with role-based access",
    features: [
      "Health & Safety Manual uploads",
      "Company Policy document management",
      "Certificate of Insurance (restricted to owners/managers)",
      "Role-based visibility for sensitive documents",
      "Document upload with file type validation",
      "Bulk export of date-ranged documents as ZIP files",
      "Timezone-aware date filtering for exports",
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
    description: "Equipment tracking with maintenance and assignment management",
    features: [
      "Comprehensive gear inventory management",
      "Equipment assignment to employees",
      "Date of manufacture tracking",
      "Service history and maintenance schedules",
      "My Gear view for individual technicians",
      "Equipment status tracking"
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
    title: "Quoting System",
    icon: FileText,
    iconColor: "text-pink-600 dark:text-pink-400",
    description: "Quote generation with labor cost calculations",
    features: [
      "Quote creation with itemized services",
      "Labor cost calculations",
      "Tax computation (GST/HST)",
      "Quote status tracking (draft, sent, approved, rejected)",
      "Permission-based access to financial data",
      "Quote to project conversion"
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
      "Four pricing tiers: Basic, Starter, Premium, Enterprise",
      "Mandatory 30-day free trial for all new subscriptions",
      "USD and CAD currency support",
      "Prorated upgrades and downgrades",
      "Additional seat purchases ($19 for 2 seats)",
      "Extra project add-ons ($49 per project)",
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
    title: "SuperUser Administration",
    icon: Settings,
    iconColor: "text-gray-600 dark:text-gray-400",
    description: "Platform-wide administrative oversight",
    features: [
      "Centralized company oversight dashboard",
      "License status monitoring across all companies",
      "Detailed company analytics and metrics",
      "User and subscription management",
      "System-wide reporting capabilities"
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
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
              </div>
            </CardContent>
          </Card>
        </div>

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
