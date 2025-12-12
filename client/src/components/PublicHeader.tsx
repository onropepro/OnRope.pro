import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { Shield, Lock, Briefcase } from "lucide-react";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

interface PublicHeaderProps {
  activeNav?: 'employer' | 'technician' | 'property-manager' | 'resident' | 'building-manager' | 'modules' | null;
}

export function PublicHeader({ activeNav = null }: PublicHeaderProps) {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [landingLanguage, setLandingLanguage] = useState<'en' | 'fr'>('en');
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const modulesMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLandingLang = localStorage.getItem('landingPageLang') as 'en' | 'fr' | null;
    const lang = savedLandingLang || 'en';
    setLandingLanguage(lang);
    i18n.changeLanguage(lang);
  }, [i18n]);

  const toggleLandingLanguage = () => {
    const newLang = landingLanguage === 'en' ? 'fr' : 'en';
    setLandingLanguage(newLang);
    localStorage.setItem('landingPageLang', newLang);
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

  return (
    <>
      <div className="bg-muted/50 border-b px-6 md:px-8 py-2">
        <div className="flex items-center justify-end gap-3">
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
            onClick={() => setLocation("/login?open=" + Date.now())}
            data-testid="button-sign-in-header"
          >
            {t('login.header.signIn', 'Sign In')}
          </Button>
          <Button 
            size="sm"
            onClick={() => setLocation("/pricing")}
            className="bg-action-600 hover:bg-action-500 focus:ring-4 focus:ring-action-500/50"
            data-testid="button-get-started-header"
          >
            {t('login.header.getStarted', 'Get Started')}
          </Button>
        </div>
      </div>

      <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center">
          <img 
            src={onRopeProLogo} 
            alt="OnRopePro" 
            className="h-16 object-contain cursor-pointer" 
            onClick={() => setLocation("/")} 
            data-testid="logo-home"
          />
        </div>
        
        <nav className="hidden lg:flex items-center gap-1">
          <Button
            variant={activeNav === 'employer' ? 'default' : 'ghost'}
            className="text-sm font-medium"
            onClick={() => setLocation("/employer")}
            data-testid="nav-employer"
          >
            Employer
          </Button>
          <Button
            variant={activeNav === 'technician' ? 'default' : 'ghost'}
            className="text-sm font-medium"
            onClick={() => setLocation("/technician-login")}
            data-testid="nav-technician"
          >
            Technician
          </Button>
          <Button
            variant={activeNav === 'property-manager' ? 'default' : 'ghost'}
            className="text-sm font-medium"
            onClick={() => setLocation("/changelog/property-manager")}
            data-testid="nav-property-manager"
          >
            Property Manager
          </Button>
          <Button
            variant={activeNav === 'resident' ? 'default' : 'ghost'}
            className="text-sm font-medium"
            onClick={() => setLocation("/changelog/resident-portal")}
            data-testid="nav-resident"
          >
            Resident
          </Button>
          <Button
            variant={activeNav === 'building-manager' ? 'default' : 'ghost'}
            className="text-sm font-medium"
            onClick={() => setLocation("/building-portal")}
            data-testid="nav-building-manager"
          >
            Building Manager
          </Button>
          <div 
            className="relative flex items-center" 
            ref={modulesMenuRef}
            onMouseEnter={() => setShowModulesMenu(true)}
            onMouseLeave={() => setShowModulesMenu(false)}
          >
            <Button
              variant={activeNav === 'modules' ? 'default' : 'ghost'}
              className="text-sm font-medium"
              onClick={() => setShowModulesMenu(!showModulesMenu)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowModulesMenu(false);
                }
              }}
              aria-expanded={showModulesMenu}
              aria-haspopup="menu"
              data-testid="nav-modules"
            >
              Modules
            </Button>
            {showModulesMenu && (
              <div 
                className="absolute top-full right-0 mt-1 bg-background border rounded-xl shadow-xl p-4 w-[480px] z-50"
                role="menu"
                aria-label="Modules menu"
              >
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group"
                    onClick={() => {
                      setLocation("/modules/safety-compliance");
                      setShowModulesMenu(false);
                    }}
                    data-testid="nav-safety-compliance"
                  >
                    <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Safety & Compliance</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Inspections, toolbox meetings, incident tracking</div>
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
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">User Access & Authentication</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Role-based permissions, secure login, audit trails</div>
                    </div>
                  </button>
                  <button
                    className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors text-left group col-span-2"
                    onClick={() => {
                      setLocation("/modules/project-management");
                      setShowModulesMenu(false);
                    }}
                    data-testid="nav-project-management"
                  >
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Project Management</div>
                      <div className="text-xs text-muted-foreground mt-0.5">4-elevation tracking, real-time dashboards, crew scheduling</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
