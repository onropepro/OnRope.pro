import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { Shield, Lock, Briefcase, Gauge, Clock, ClipboardCheck, FileText, Users, Menu, X, ChevronDown, IdCard, HardHat, Search, Package, Calendar, DollarSign, Calculator, Palette, HelpCircle, MessageSquare, Globe, BookOpen, Settings, HeartPulse, Wallet } from "lucide-react";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

interface PublicHeaderProps {
  activeNav?: "employer" | "technician" | "property-manager" | "resident" | "building-manager" | "ground-crew" | "modules";
  onSignInClick?: () => void;
  stakeholderColor?: string;
}

// Stakeholder color constants - must match hero gradient colors
const STAKEHOLDER_COLORS = {
  technician: "#2874A6",
  "property-manager": "#6E9075", 
  resident: "#86A59C",
  "building-manager": "#B89685", // Warm Taupe per design guidelines
  "ground-crew": "#5D7B6F",
  employer: "#0B64A3", // Ocean Blue for employer - matches hero gradients
  safety: "#193A63", // Navy Blue for safety manifesto page
} as const;

// Colors that require dark text for WCAG accessibility (lighter backgrounds)
// These have insufficient contrast with white text (< 4.5:1 ratio)
const LIGHT_BACKGROUND_COLORS: string[] = [
  STAKEHOLDER_COLORS.resident,      // #86A59C - Mint Green
  STAKEHOLDER_COLORS["property-manager"], // #6E9075 - Sage Green  
  STAKEHOLDER_COLORS["building-manager"], // #B89685 - Warm Taupe
];

// Helper to determine if color needs dark foreground text
const needsDarkText = (color: string): boolean => {
  return LIGHT_BACKGROUND_COLORS.includes(color);
};

export function PublicHeader({ activeNav, onSignInClick, stakeholderColor: propStakeholderColor }: PublicHeaderProps) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { openLogin } = useAuthPortal();
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const [showTechnicianMenu, setShowTechnicianMenu] = useState(false);
  const [showPropertyManagerMenu, setShowPropertyManagerMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileModulesExpanded, setMobileModulesExpanded] = useState(false);
  const [mobileTechnicianExpanded, setMobileTechnicianExpanded] = useState(false);
  const [mobilePropertyManagerExpanded, setMobilePropertyManagerExpanded] = useState(false);
  const modulesMenuRef = useRef<HTMLDivElement>(null);
  const technicianMenuRef = useRef<HTMLDivElement>(null);
  const propertyManagerMenuRef = useRef<HTMLDivElement>(null);
  
  // Determine stakeholder color based on current path
  // This color is used for BOTH the hero gradient AND the top utility bar
  const getStakeholderColor = (): string => {
    if (propStakeholderColor) return propStakeholderColor;
    const path = location.toLowerCase();
    // Safety manifesto page uses Navy Blue
    if (path === '/safety') {
      return STAKEHOLDER_COLORS.safety;
    }
    // Homepage uses employer Ocean Blue
    if (path === '/') {
      return STAKEHOLDER_COLORS.employer;
    }
    // Technician job board module uses technician rust color to match its hero
    if (path === '/modules/technician-job-board') {
      return STAKEHOLDER_COLORS.technician;
    }
    // Other /modules/ pages and /employer use employer blue
    if (path.startsWith('/modules/') || path.startsWith('/employer')) {
      return STAKEHOLDER_COLORS.employer;
    }
    // Help pages follow stakeholder color logic based on their audience
    if (path.startsWith('/help/for-technicians') || path.startsWith('/help/technician')) {
      return STAKEHOLDER_COLORS.technician;
    }
    if (path.startsWith('/help/for-employers') || path.startsWith('/help/employer')) {
      return STAKEHOLDER_COLORS.employer;
    }
    if (path.startsWith('/help/for-property-managers') || path.startsWith('/help/property-manager')) {
      return STAKEHOLDER_COLORS["property-manager"];
    }
    if (path.startsWith('/help/for-residents') || path.startsWith('/help/resident')) {
      return STAKEHOLDER_COLORS.resident;
    }
    if (path.startsWith('/help/for-building-managers') || path.startsWith('/help/building-manager')) {
      return STAKEHOLDER_COLORS["building-manager"];
    }
    // Standard technician paths
    if (path.startsWith('/technician')) {
      return STAKEHOLDER_COLORS.technician;
    }
    // Ground crew paths
    if (path.startsWith('/ground-crew')) {
      return STAKEHOLDER_COLORS["ground-crew"];
    }
    if (path.startsWith('/property-manager')) {
      return STAKEHOLDER_COLORS["property-manager"];
    }
    if (path.startsWith('/resident')) {
      return STAKEHOLDER_COLORS.resident;
    }
    if (path.startsWith('/building-portal') || path.startsWith('/building-manager')) {
      return STAKEHOLDER_COLORS["building-manager"];
    }
    // Default to employer Ocean Blue
    return STAKEHOLDER_COLORS.employer;
  };
  
  const stakeholderColor = getStakeholderColor();
  const useDarkText = false;
  const textColorClass = "text-white";
  const hoverBgClass = "hover:bg-white/10";
  const borderColorClass = "border-white/10";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modulesMenuRef.current && !modulesMenuRef.current.contains(e.target as Node)) {
        setShowModulesMenu(false);
      }
      if (technicianMenuRef.current && !technicianMenuRef.current.contains(e.target as Node)) {
        setShowTechnicianMenu(false);
      }
      if (propertyManagerMenuRef.current && !propertyManagerMenuRef.current.contains(e.target as Node)) {
        setShowPropertyManagerMenu(false);
      }
    };
    
    if (showModulesMenu || showTechnicianMenu || showPropertyManagerMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showModulesMenu, showTechnicianMenu, showPropertyManagerMenu]);

  const navItems = [
    { id: "employer", label: t('navigation.employer', 'Employer'), href: "/employer" },
    { id: "technician", label: t('navigation.technician', 'Rope Access Technician / Ground Crew'), href: "/technician" },
    { id: "property-manager", label: t('navigation.propertyManager', 'Property Manager'), href: "/property-manager" },
    { id: "resident", label: t('navigation.resident', 'Resident'), href: "/resident" },
    { id: "building-manager", label: t('navigation.buildingManager', 'Building Manager'), href: "/building-portal" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top Utility Bar - matches hero gradient color per page */}
      <div 
        className={`border-b ${borderColorClass}`}
        style={{ backgroundColor: stakeholderColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex justify-start sm:justify-end overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2 w-max">
            <Button 
              variant="ghost"
              size="sm"
              className={`${textColorClass} ${hoverBgClass}`}
              onClick={() => setLocation("/safety")}
              data-testid="button-safety-manifesto-header"
            >
              Our Safety Manifesto
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              className={`hidden sm:inline-flex ${textColorClass} ${hoverBgClass}`}
              onClick={() => setLocation("/pricing")}
              data-testid="link-pricing-header"
            >
              {t('login.header.pricing', 'Pricing')}
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/help")}
              className={`hidden sm:inline-flex ${textColorClass} ${hoverBgClass}`}
              data-testid="button-help-header"
            >
              {t('navigation.help', 'Help')}
            </Button>
            <InstallPWAButton stakeholderColor={stakeholderColor} useDarkText={useDarkText} />
            <LanguageDropdown 
              variant="ghost" 
              size="sm" 
              stakeholderColor={stakeholderColor}
              useDarkText={useDarkText}
            />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Always white/background */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo - Left */}
          <div className="flex items-center shrink-0">
            <Link href="/">
              <img 
                src={onRopeProLogo} 
                alt="OnRopePro" 
                className="h-12 object-contain cursor-pointer" 
                data-testid="img-logo"
              />
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>

            {/* Navigation - Right Aligned (Desktop) */}
          <nav className="hidden lg:flex items-center justify-end gap-1 flex-1">
            {/* Employer with Modules Dropdown */}
            <div 
              className="relative flex items-center" 
              ref={modulesMenuRef}
              onMouseEnter={() => {
                setShowModulesMenu(true);
                setShowTechnicianMenu(false);
              }}
              onMouseLeave={() => setShowModulesMenu(false)}
            >
              <Button
                variant="ghost"
                className={`text-sm font-medium gap-1 ${activeNav === "employer" || activeNav === "modules" ? "text-primary" : ""}`}
                onClick={() => setLocation("/employer")}
                data-testid="nav-employer"
              >
                {t('navigation.employer', 'Employer')}
                <ChevronDown className="w-3 h-3" />
              </Button>
              {showModulesMenu && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 pointer-events-none"
                >
                  <div 
                    className="bg-card border border-border rounded-xl shadow-xl p-5 w-[1100px] max-w-[calc(100vw-2rem)] pointer-events-auto"
                    onMouseEnter={() => setShowModulesMenu(true)}
                    onMouseLeave={() => setShowModulesMenu(false)}
                  >
                  <div className="flex gap-4">
                    {/* Column 1: Operations (5 items) */}
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2 px-3 py-2 mb-1" data-testid="menu-category-operations">
                        <Settings className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm text-foreground">Operations</span>
                      </div>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/project-management");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-project-management"
                      >
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Briefcase className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.projectManagement.title', 'Project Management')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">4-elevation tracking, dashboards</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/work-session-time-tracking");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-work-session-time-tracking"
                      >
                        <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Clock className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.workSession.title', 'Work Session & Time Tracking')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">GPS clock-in, drop tracking</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/scheduling-calendar");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-scheduling-calendar"
                      >
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.scheduling.title', 'Scheduling & Calendar')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Conflict detection, time-off</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/gear-inventory");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-gear-inventory"
                      >
                        <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Package className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.gearInventory.title', 'Gear Inventory Management')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Equipment tracking, service life</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/white-label-branding");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-white-label-branding"
                      >
                        <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Palette className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.whiteLabel.title', 'White-Label Branding')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Custom logo, colors, brand</div>
                        </div>
                      </button>
                    </div>

                    {/* Column 2: Safety (4 items) */}
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2 px-3 py-2 mb-1" data-testid="menu-category-safety">
                        <HeartPulse className="w-4 h-4 text-red-600" />
                        <span className="font-semibold text-sm text-foreground">Safety</span>
                      </div>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/safety-compliance");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-safety-compliance"
                      >
                        <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Shield className="w-4 h-4 text-sky-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.safetyCompliance.title', 'Safety & Compliance')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Inspections, toolbox meetings</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/company-safety-rating");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-company-safety-rating"
                      >
                        <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Gauge className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.csr.title', 'Company Safety Rating')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Compliance scoring, safety posture</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/irata-sprat-task-logging");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-irata-task-logging"
                      >
                        <div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <ClipboardCheck className="w-4 h-4 text-cyan-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.irataLogging.title', 'IRATA/SPRAT Task Logging')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Task logging, OCR import</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/document-management");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-document-management"
                      >
                        <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <FileText className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.documentManagement.title', 'Document Management')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Digital signatures, audit trails</div>
                        </div>
                      </button>
                    </div>

                    {/* Column 3: Team (4 items) */}
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2 px-3 py-2 mb-1" data-testid="menu-category-team">
                        <Users className="w-4 h-4 text-violet-600" />
                        <span className="font-semibold text-sm text-foreground">Team</span>
                      </div>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/employee-management");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-employee-management"
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.employeeManagement.title', 'Employee Management')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Certifications, permissions</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/technician-passport");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-technician-passport"
                      >
                        <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <IdCard className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.technicianPassport.title', 'Technician Passport')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Portable work history, records</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/employer-job-board");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-employer-job-board"
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Search className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.employerJobBoard.title', 'Job Board Ecosystem')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Talent browser, job postings</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/user-access-authentication");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-user-access"
                      >
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.userAccess.title', 'User Access & Authentication')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Permissions, role-based access</div>
                        </div>
                      </button>
                    </div>

                    {/* Column 4: Financial & Sales (3 items) */}
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2 px-3 py-2 mb-1" data-testid="menu-category-financial-sales">
                        <Wallet className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-sm text-foreground">Financial & Sales</span>
                      </div>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/payroll-financial");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-payroll-financial"
                      >
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.payroll.title', 'Payroll & Financial')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Timesheets, overtime, exports</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/quoting-sales-pipeline");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-quoting-sales-pipeline"
                      >
                        <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Calculator className="w-4 h-4 text-rose-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.quoting.title', 'Quoting & Sales Pipeline')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Service quotes, visual pipeline</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/client-relationship-management");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-client-relationship-management"
                      >
                        <div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Users className="w-4 h-4 text-cyan-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Client Relationship Management</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Client portfolios, building specs</div>
                        </div>
                      </button>
                    </div>

                    {/* Column 5: Communication (2 items) */}
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2 px-3 py-2 mb-1" data-testid="menu-category-communication">
                        <MessageSquare className="w-4 h-4 text-rose-600" />
                        <span className="font-semibold text-sm text-foreground">Communication</span>
                      </div>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/resident-portal");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-resident-portal"
                      >
                        <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <MessageSquare className="w-4 h-4 text-rose-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t('navigation.modules.residentPortal.title', 'Resident Portal')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Real-time feedback, photos</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-2.5 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/property-manager-interface");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-property-manager-interface"
                      >
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Globe className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Property Manager Interface</div>
                          <div className="text-xs text-muted-foreground mt-0.5">CSR visibility, due diligence</div>
                        </div>
                      </button>
                    </div>
                  </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Technician with Modules Dropdown */}
            <div 
              className="relative flex items-center" 
              ref={technicianMenuRef}
              onMouseEnter={() => {
                setShowTechnicianMenu(true);
                setShowModulesMenu(false);
              }}
              onMouseLeave={() => setShowTechnicianMenu(false)}
            >
              <Button
                variant="ghost"
                className={`text-sm font-medium gap-1 ${activeNav === "technician" ? "text-primary" : ""}`}
                onClick={() => setLocation("/technician")}
                data-testid="nav-technician"
              >
                <span className="flex flex-col items-center leading-tight">
                  <span>Rope Access Technician</span>
                  <span className="text-xs text-muted-foreground font-normal">& Ground Crew</span>
                </span>
                <ChevronDown className="w-3 h-3" />
              </Button>
              {showTechnicianMenu && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="bg-card border border-border rounded-xl shadow-xl p-4 w-[320px]">
                    <div className="space-y-3">
                    <button
                      className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group w-full"
                      onClick={() => {
                        setLocation("/technician");
                        setShowTechnicianMenu(false);
                      }}
                      data-testid="nav-technician-passport"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <BookOpen className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{t('navigation.modules.passportLogbook.title', 'Passport & Log Book')}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{t('navigation.modules.passportLogbook.description', 'Your portable work history, certifications, and career tracking')}</div>
                      </div>
                    </button>
                    <button
                      className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group w-full"
                      onClick={() => {
                        setLocation("/modules/technician-job-board");
                        setShowTechnicianMenu(false);
                      }}
                      data-testid="nav-technician-job-board"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Search className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{t('navigation.modules.technicianJobBoard.title', 'Job Board Ecosystem')}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{t('navigation.modules.technicianJobBoard.description', 'Browse jobs, apply instantly, control profile visibility')}</div>
                      </div>
                    </button>
                    
                    <div className="border-t pt-3 mt-2">
                      <div className="text-xs font-medium text-muted-foreground mb-2 px-1">{t('navigation.supportRoles', 'Support Roles')}</div>
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group w-full"
                        onClick={() => {
                          setLocation("/ground-crew");
                          setShowTechnicianMenu(false);
                        }}
                        data-testid="nav-ground-crew"
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" style={{ backgroundColor: "#5D7B6F20" }}>
                          <HardHat className="w-5 h-5" style={{ color: "#5D7B6F" }} />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{t('navigation.modules.groundCrew.title', 'Ground Crew')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{t('navigation.modules.groundCrew.description', 'Support techs from the ground, no heights required')}</div>
                        </div>
                      </button>
                    </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Property Manager with dropdown */}
            <div 
              className="relative flex items-center" 
              ref={propertyManagerMenuRef}
              onMouseEnter={() => {
                setShowPropertyManagerMenu(true);
                setShowModulesMenu(false);
                setShowTechnicianMenu(false);
              }}
              onMouseLeave={() => setShowPropertyManagerMenu(false)}
            >
              <Button
                variant="ghost"
                className={`text-sm font-medium gap-1 ${activeNav === "property-manager" ? "text-primary" : ""}`}
                onClick={() => setLocation("/property-manager")}
                data-testid="nav-property-manager"
              >
                {t('navigation.propertyManager', 'Property Manager')}
                <ChevronDown className="w-3 h-3" />
              </Button>
              {showPropertyManagerMenu && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="bg-card border border-border rounded-xl shadow-xl p-4 w-[340px]">
                    <div className="space-y-3">
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group w-full"
                        onClick={() => {
                          setLocation("/property-manager");
                          setShowPropertyManagerMenu(false);
                        }}
                        data-testid="nav-pm-overview"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#6E9075]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Globe className="w-5 h-5 text-[#6E9075]" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{t('navigation.modules.pmOverview.title', 'Property Manager Overview')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{t('navigation.modules.pmOverview.description', 'See how OnRopePro helps property managers')}</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group w-full"
                        onClick={() => {
                          setLocation("/property-manager/company-safety-rating");
                          setShowPropertyManagerMenu(false);
                        }}
                        data-testid="nav-pm-csr"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#6E9075]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Gauge className="w-5 h-5 text-[#6E9075]" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{t('navigation.modules.pmCSR.title', 'Company Safety Rating')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{t('navigation.modules.pmCSR.description', 'Portfolio-wide vendor safety compliance tracking')}</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Other nav items (excluding employer, technician, and property-manager since they're handled above) */}
            {navItems.filter(item => item.id !== "employer" && item.id !== "technician" && item.id !== "property-manager").map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`text-sm font-medium ${activeNav === item.id ? "text-primary" : ""}`}
                onClick={() => setLocation(item.href)}
                onMouseEnter={() => {
                  setShowModulesMenu(false);
                  setShowTechnicianMenu(false);
                  setShowPropertyManagerMenu(false);
                }}
                data-testid={`nav-${item.id}`}
              >
                {item.label}
              </Button>
            ))}

            {/* Sign In - Button Style */}
            <div className="pl-2">
              <Button
                variant="default"
                size="sm"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-primary-border min-h-8 rounded-md text-xs font-semibold shadow-sm px-6 hover:bg-[#963b1c] text-white bg-[#193A63]"
                onClick={onSignInClick || openLogin}
                data-testid="nav-sign-in"
              >
                {t('login.header.signIn', 'Sign In')}
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {/* Employer with expandable modules */}
            <div>
              <button
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-medium transition-colors hover-elevate ${
                  activeNav === "employer" || activeNav === "modules" 
                    ? "text-primary" 
                    : ""
                }`}
                onClick={() => setMobileModulesExpanded(!mobileModulesExpanded)}
                data-testid="nav-mobile-employer"
              >
                <span>{t('navigation.employer', 'Employer')}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileModulesExpanded ? "rotate-180" : ""}`} />
              </button>
              
              {mobileModulesExpanded && (
                <div className="mt-2 ml-4 space-y-3">
                  {/* Operations */}
                  <div>
                    <div className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-blue-600 uppercase tracking-wide" data-testid="mobile-menu-category-operations">
                      <Settings className="w-3.5 h-3.5" />
                      Operations
                    </div>
                    <div className="space-y-0.5">
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/project-management"); setMobileMenuOpen(false); }} data-testid="nav-mobile-project-management">
                        <Briefcase className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm">Project Management</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/work-session-time-tracking"); setMobileMenuOpen(false); }} data-testid="nav-mobile-work-session">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="text-sm">Work Session & Time Tracking</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/scheduling-calendar"); setMobileMenuOpen(false); }} data-testid="nav-mobile-scheduling-calendar">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm">Scheduling & Calendar</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/gear-inventory"); setMobileMenuOpen(false); }} data-testid="nav-mobile-gear-inventory">
                        <Package className="w-4 h-4 text-teal-600" />
                        <span className="text-sm">Gear Inventory Management</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/white-label-branding"); setMobileMenuOpen(false); }} data-testid="nav-mobile-white-label-branding">
                        <Palette className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">White-Label Branding</span>
                      </button>
                    </div>
                  </div>

                  {/* Safety */}
                  <div>
                    <div className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-red-600 uppercase tracking-wide" data-testid="mobile-menu-category-safety">
                      <HeartPulse className="w-3.5 h-3.5" />
                      Safety
                    </div>
                    <div className="space-y-0.5">
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/safety-compliance"); setMobileMenuOpen(false); }} data-testid="nav-mobile-safety-compliance">
                        <Shield className="w-4 h-4 text-sky-600" />
                        <span className="text-sm">Safety & Compliance</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/company-safety-rating"); setMobileMenuOpen(false); }} data-testid="nav-mobile-company-safety-rating">
                        <Gauge className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Company Safety Rating</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/irata-sprat-task-logging"); setMobileMenuOpen(false); }} data-testid="nav-mobile-irata-logging">
                        <ClipboardCheck className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm">IRATA/SPRAT Task Logging</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/document-management"); setMobileMenuOpen(false); }} data-testid="nav-mobile-document-management">
                        <FileText className="w-4 h-4 text-violet-600" />
                        <span className="text-sm">Document Management</span>
                      </button>
                    </div>
                  </div>

                  {/* Team */}
                  <div>
                    <div className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-violet-600 uppercase tracking-wide" data-testid="mobile-menu-category-team">
                      <Users className="w-3.5 h-3.5" />
                      Team
                    </div>
                    <div className="space-y-0.5">
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/employee-management"); setMobileMenuOpen(false); }} data-testid="nav-mobile-employee-management">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Employee Management</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/technician-passport"); setMobileMenuOpen(false); }} data-testid="nav-mobile-technician-passport">
                        <IdCard className="w-4 h-4 text-amber-600" />
                        <span className="text-sm">Technician Passport</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/employer-job-board"); setMobileMenuOpen(false); }} data-testid="nav-mobile-employer-job-board">
                        <Search className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Job Board Ecosystem</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/user-access-authentication"); setMobileMenuOpen(false); }} data-testid="nav-mobile-user-access">
                        <Lock className="w-4 h-4 text-slate-600" />
                        <span className="text-sm">User Access & Authentication</span>
                      </button>
                    </div>
                  </div>

                  {/* Financial */}
                  <div>
                    <div className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-emerald-600 uppercase tracking-wide" data-testid="mobile-menu-category-financial-sales">
                      <Wallet className="w-3.5 h-3.5" />
                      Financial & Sales
                    </div>
                    <div className="space-y-0.5">
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/payroll-financial"); setMobileMenuOpen(false); }} data-testid="nav-mobile-payroll-financial">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm">Payroll & Financial</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/quoting-sales-pipeline"); setMobileMenuOpen(false); }} data-testid="nav-mobile-quoting-sales-pipeline">
                        <Calculator className="w-4 h-4 text-rose-600" />
                        <span className="text-sm">Quoting & Sales Pipeline</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/client-relationship-management"); setMobileMenuOpen(false); }} data-testid="nav-mobile-crm">
                        <Users className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm">Client Relationship Management</span>
                      </button>
                    </div>
                  </div>

                  {/* Communication */}
                  <div>
                    <div className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-rose-600 uppercase tracking-wide" data-testid="mobile-menu-category-communication">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Communication
                    </div>
                    <div className="space-y-0.5">
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/resident-portal"); setMobileMenuOpen(false); }} data-testid="nav-mobile-resident-portal">
                        <MessageSquare className="w-4 h-4 text-rose-600" />
                        <span className="text-sm">Resident Portal</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover-elevate" onClick={() => { setLocation("/modules/property-manager-interface"); setMobileMenuOpen(false); }} data-testid="nav-mobile-property-manager-interface">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm">Property Manager Interface</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Technician with expandable modules */}
            <div>
              <button
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-medium transition-colors hover-elevate ${
                  activeNav === "technician" 
                    ? "text-primary" 
                    : ""
                }`}
                onClick={() => setMobileTechnicianExpanded(!mobileTechnicianExpanded)}
                data-testid="nav-mobile-technician"
              >
                <span>{t('navigation.technician', 'Rope Access Technician / Ground Crew')}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileTechnicianExpanded ? "rotate-180" : ""}`} />
              </button>
              
              {mobileTechnicianExpanded && (
                <div className="mt-2 ml-4 space-y-1">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/technician");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-technician-passport"
                  >
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    <span className="text-sm">{t('navigation.modules.passportLogbook.title', 'Passport & Log Book')}</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/technician-job-board");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-technician-job-board"
                  >
                    <Search className="w-5 h-5 text-amber-600" />
                    <span className="text-sm">{t('navigation.modules.technicianJobBoard.title', 'Job Board Ecosystem')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Property Manager with expandable modules */}
            <div>
              <button
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-medium transition-colors hover-elevate ${
                  activeNav === "property-manager" 
                    ? "text-primary" 
                    : ""
                }`}
                onClick={() => setMobilePropertyManagerExpanded(!mobilePropertyManagerExpanded)}
                data-testid="nav-mobile-property-manager"
              >
                <span>{t('navigation.propertyManager', 'Property Manager')}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${mobilePropertyManagerExpanded ? "rotate-180" : ""}`} />
              </button>
              
              {mobilePropertyManagerExpanded && (
                <div className="mt-2 ml-4 space-y-1">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/property-manager");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-pm-overview"
                  >
                    <Globe className="w-5 h-5 text-[#6E9075]" />
                    <span className="text-sm">{t('navigation.modules.pmOverview.title', 'Property Manager Overview')}</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/property-manager/company-safety-rating");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-pm-csr"
                  >
                    <Gauge className="w-5 h-5 text-[#6E9075]" />
                    <span className="text-sm">{t('navigation.modules.pmCSR.title', 'Company Safety Rating')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Other nav items */}
            {navItems.filter(item => item.id !== "employer" && item.id !== "technician" && item.id !== "property-manager").map((item) => (
              <button
                key={item.id}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors hover-elevate ${
                  activeNav === item.id 
                    ? "text-primary" 
                    : ""
                }`}
                onClick={() => {
                  setLocation(item.href);
                  setMobileMenuOpen(false);
                }}
                data-testid={`nav-mobile-${item.id}`}
              >
                {item.label}
              </button>
            ))}

            {/* Sign In Button - Mobile */}
            <div className="pt-4 mt-4 border-t border-border">
              <Button
                variant="default"
                className="w-full font-semibold text-white bg-[#193A63] hover:bg-[#0d2340]"
                onClick={() => {
                  if (onSignInClick) {
                    onSignInClick();
                  } else {
                    openLogin();
                  }
                  setMobileMenuOpen(false);
                }}
                data-testid="nav-mobile-sign-in"
              >
                {t('login.header.signIn', 'Sign In')}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
