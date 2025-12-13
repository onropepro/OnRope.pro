import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { Shield, Lock, Briefcase, Gauge, Clock, ClipboardCheck } from "lucide-react";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

interface PublicHeaderProps {
  activeNav?: "employer" | "technician" | "property-manager" | "resident" | "building-manager" | "modules";
  onSignInClick?: () => void;
}

export function PublicHeader({ activeNav, onSignInClick }: PublicHeaderProps) {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const [landingLanguage, setLandingLanguage] = useState<'en' | 'fr'>(() => {
    return (i18n.language?.startsWith('fr') ? 'fr' : 'en');
  });
  const modulesMenuRef = useRef<HTMLDivElement>(null);

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
    };
    
    if (showModulesMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showModulesMenu]);

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
          
          {/* Navigation - Right Aligned */}
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
                <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-xl p-4 w-[480px] z-50">
                  <div className="grid grid-cols-2 gap-3">
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
                  </div>
                </div>
              )}
            </div>
            
            {/* Other nav items (excluding employer since it's handled above) */}
            {navItems.filter(item => item.id !== "employer").map((item) => (
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
    </header>
  );
}
