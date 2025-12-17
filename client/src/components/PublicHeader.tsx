import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { Shield, Lock, Briefcase, Gauge, Clock, ClipboardCheck, FileText, Users, Menu, X, ChevronDown, IdCard, HardHat, Search, Package, Calendar, DollarSign, Calculator } from "lucide-react";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

interface PublicHeaderProps {
  activeNav?: "employer" | "technician" | "property-manager" | "resident" | "building-manager" | "modules";
  onSignInClick?: () => void;
}

export function PublicHeader({ activeNav, onSignInClick }: PublicHeaderProps) {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const [showTechnicianMenu, setShowTechnicianMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileModulesExpanded, setMobileModulesExpanded] = useState(false);
  const [mobileTechnicianExpanded, setMobileTechnicianExpanded] = useState(false);
  const [landingLanguage, setLandingLanguage] = useState<'en' | 'fr'>(() => {
    return (i18n.language?.startsWith('fr') ? 'fr' : 'en');
  });
  const modulesMenuRef = useRef<HTMLDivElement>(null);
  const technicianMenuRef = useRef<HTMLDivElement>(null);

  const toggleLandingLanguage = () => {
    const newLang = landingLanguage === 'en' ? 'fr' : 'en';
    setLandingLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modulesMenuRef.current && !modulesMenuRef.current.contains(e.target as Node)) {
        setShowModulesMenu(false);
      }
      if (technicianMenuRef.current && !technicianMenuRef.current.contains(e.target as Node)) {
        setShowTechnicianMenu(false);
      }
    };
    
    if (showModulesMenu || showTechnicianMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showModulesMenu, showTechnicianMenu]);

  const navItems = [
    { id: "employer", label: "Employer", href: "/employer" },
    { id: "technician", label: "Technician", href: "/technician-login" },
    { id: "property-manager", label: "Property Manager", href: "/property-manager" },
    { id: "resident", label: "Resident", href: "/link" },
    { id: "building-manager", label: "Building Manager", href: "/building-portal" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="bg-muted/50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-end gap-3">
          <InstallPWAButton />
          <Button 
            variant="ghost"
            size="sm"
            onClick={toggleLandingLanguage}
            data-testid="button-language-toggle"
          >
            {landingLanguage === 'en' ? 'FR' : 'EN'}
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            onClick={onSignInClick || (() => setLocation("/login"))}
            data-testid="button-sign-in-header"
          >
            {t('login.header.signIn', 'Sign In')}
          </Button>
          <Button 
            size="sm"
            onClick={() => setLocation("/pricing")}
            className="bg-action-600 hover:bg-action-500"
            data-testid="button-get-started-header"
          >
            {t('login.header.getStarted', 'Get Started')}
          </Button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border">
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
              onMouseEnter={() => setShowModulesMenu(true)}
              onMouseLeave={() => setShowModulesMenu(false)}
            >
              <Button
                variant={activeNav === "employer" || activeNav === "modules" ? "default" : "ghost"}
                className="text-sm font-medium"
                onClick={() => setLocation("/employer")}
                data-testid="nav-employer"
              >
                Employer
              </Button>
              {showModulesMenu && (
                <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-xl shadow-xl p-4 w-[960px] z-50">
                  <div className="flex gap-3">
                    {/* Column 1: Safety & Operations (4 items, Document Management at bottom) */}
                    <div className="flex-1 flex flex-col gap-2">
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/safety-compliance");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-safety-compliance"
                      >
                        <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Shield className="w-5 h-5 text-sky-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Safety & Compliance</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Harness inspections, toolbox meetings, audit-ready exports</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/project-management");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-project-management"
                      >
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Briefcase className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Project Management</div>
                          <div className="text-xs text-muted-foreground mt-0.5">4-elevation tracking, real-time dashboards, crew scheduling</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/work-session-time-tracking");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-work-session-time-tracking"
                      >
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Work Session & Time Tracking</div>
                          <div className="text-xs text-muted-foreground mt-0.5">GPS clock-in, drop tracking, automatic payroll aggregation</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/document-management");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-document-management"
                      >
                        <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Document Management</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Digital signatures, immutable audit trails, compliance reporting</div>
                        </div>
                      </button>
                    </div>
                    {/* Column 2: Access & People (4 items) */}
                    <div className="flex-1 flex flex-col gap-2">
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/user-access-authentication");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-user-access"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Lock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">User Access & Authentication</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Granular permissions, role-based access, audit trails</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/company-safety-rating");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-company-safety-rating"
                      >
                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Gauge className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Company Safety Rating</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Penalty-based compliance scoring, real-time safety posture</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/irata-sprat-task-logging");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-irata-task-logging"
                      >
                        <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <ClipboardCheck className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">IRATA/SPRAT Task Logging</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Same-day hour logging, OCR import, career-portable records</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/employee-management");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-employee-management"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Employee Management</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Portable identities, certification tracking, permissions</div>
                        </div>
                      </button>
                    </div>
                    {/* Column 3: Resources & Scheduling (4 items) */}
                    <div className="flex-1 flex flex-col gap-2">
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/technician-passport");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-technician-passport"
                      >
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <IdCard className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Technician Passport</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Portable work history, certifications, career-long records</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/employer-job-board");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-employer-job-board"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Search className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Job Board Ecosystem</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Talent browser, unlimited postings, direct offers</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/gear-inventory");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-gear-inventory"
                      >
                        <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Package className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Gear Inventory Management</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Equipment tracking, assignments, service life</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/scheduling-calendar");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-scheduling-calendar"
                      >
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Calendar className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Scheduling & Calendar</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Conflict detection, dual calendars, time-off management</div>
                        </div>
                      </button>
                    </div>
                    {/* Column 4: Financial & Sales (2 items) */}
                    <div className="flex-1 flex flex-col gap-2">
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/payroll-financial");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-payroll-financial"
                      >
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Payroll & Financial</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Automated timesheets, overtime calculation, payroll exports</div>
                        </div>
                      </button>
                      <button
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                        onClick={() => {
                          setLocation("/modules/quoting-sales-pipeline");
                          setShowModulesMenu(false);
                        }}
                        data-testid="nav-quoting-sales-pipeline"
                      >
                        <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Calculator className="w-5 h-5 text-rose-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Quoting & Sales Pipeline</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Service-specific quotes, financial privacy, visual pipeline</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Technician with Modules Dropdown */}
            <div 
              className="relative flex items-center" 
              ref={technicianMenuRef}
              onMouseEnter={() => setShowTechnicianMenu(true)}
              onMouseLeave={() => setShowTechnicianMenu(false)}
            >
              <Button
                variant={activeNav === "technician" ? "default" : "ghost"}
                className="text-sm font-medium"
                onClick={() => setLocation("/technician-login")}
                data-testid="nav-technician"
              >
                Technician
              </Button>
              {showTechnicianMenu && (
                <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-xl p-4 w-[320px] z-50">
                  <div className="space-y-3">
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
                        <div className="font-semibold text-sm">Job Board Ecosystem</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Browse jobs, apply instantly, control profile visibility</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Other nav items (excluding employer and technician since they're handled above) */}
            {navItems.filter(item => item.id !== "employer" && item.id !== "technician").map((item) => (
              <Button
                key={item.id}
                variant={activeNav === item.id ? "default" : "ghost"}
                className="text-sm font-medium"
                onClick={() => setLocation(item.href)}
                data-testid={`nav-${item.id}`}
              >
                {item.label}
              </Button>
            ))}
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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                  activeNav === "employer" || activeNav === "modules" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover-elevate"
                }`}
                onClick={() => setMobileModulesExpanded(!mobileModulesExpanded)}
                data-testid="nav-mobile-employer"
              >
                <span>Employer</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileModulesExpanded ? "rotate-180" : ""}`} />
              </button>
              
              {mobileModulesExpanded && (
                <div className="mt-2 ml-4 space-y-1">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/safety-compliance");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-safety-compliance"
                  >
                    <Shield className="w-5 h-5 text-sky-600" />
                    <span className="text-sm">Safety & Compliance</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/user-access-authentication");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-user-access"
                  >
                    <Lock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">User Access & Authentication</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/project-management");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-project-management"
                  >
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm">Project Management</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/company-safety-rating");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-company-safety-rating"
                  >
                    <Gauge className="w-5 h-5 text-orange-600" />
                    <span className="text-sm">Company Safety Rating</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/work-session-time-tracking");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-work-session"
                  >
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-sm">Work Session & Time Tracking</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/irata-sprat-task-logging");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-irata-logging"
                  >
                    <ClipboardCheck className="w-5 h-5 text-cyan-600" />
                    <span className="text-sm">IRATA/SPRAT Task Logging</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/document-management");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-document-management"
                  >
                    <FileText className="w-5 h-5 text-violet-600" />
                    <span className="text-sm">Document Management</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/employee-management");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-employee-management"
                  >
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Employee Management</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/technician-passport");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-technician-passport"
                  >
                    <IdCard className="w-5 h-5 text-amber-600" />
                    <span className="text-sm">Technician Passport</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/employer-job-board");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-employer-job-board"
                  >
                    <Search className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Job Board Ecosystem</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/gear-inventory");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-gear-inventory"
                  >
                    <Package className="w-5 h-5 text-teal-600" />
                    <span className="text-sm">Gear Inventory Management</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/scheduling-calendar");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-scheduling-calendar"
                  >
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm">Scheduling & Calendar</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/payroll-financial");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-payroll-financial"
                  >
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm">Payroll & Financial</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/quoting-sales-pipeline");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-quoting-sales-pipeline"
                  >
                    <Calculator className="w-5 h-5 text-rose-600" />
                    <span className="text-sm">Quoting & Sales Pipeline</span>
                  </button>
                </div>
              )}
            </div>

            {/* Technician with expandable modules */}
            <div>
              <button
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                  activeNav === "technician" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover-elevate"
                }`}
                onClick={() => setMobileTechnicianExpanded(!mobileTechnicianExpanded)}
                data-testid="nav-mobile-technician"
              >
                <span>Technician</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileTechnicianExpanded ? "rotate-180" : ""}`} />
              </button>
              
              {mobileTechnicianExpanded && (
                <div className="mt-2 ml-4 space-y-1">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover-elevate"
                    onClick={() => {
                      setLocation("/modules/technician-job-board");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="nav-mobile-technician-job-board"
                  >
                    <Search className="w-5 h-5 text-amber-600" />
                    <span className="text-sm">Job Board Ecosystem</span>
                  </button>
                </div>
              )}
            </div>

            {/* Other nav items */}
            {navItems.filter(item => item.id !== "employer" && item.id !== "technician").map((item) => (
              <button
                key={item.id}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                  activeNav === item.id 
                    ? "bg-primary text-primary-foreground" 
                    : "hover-elevate"
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
          </nav>
        </div>
      )}
    </header>
  );
}
