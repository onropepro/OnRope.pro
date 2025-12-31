import { Link, useLocation } from 'wouter';
import { 
  Home, 
  Building2, 
  HardHat, 
  Users, 
  ChevronLeft,
  Book,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';

interface HelpNavProps {
  currentSection?: 'home' | 'owner' | 'technician' | 'building-manager' | 'property-manager' | 'module' | 'getting-started' | 'search';
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
}

export default function HelpNav({ 
  currentSection = 'home', 
  showBackButton = false,
  backHref = '/help',
  backLabel,
}: HelpNavProps) {
  const [location] = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { 
      id: 'home', 
      label: t('helpNav.helpHome', 'Help Home'), 
      href: '/help', 
      icon: Home 
    },
    { 
      id: 'owner', 
      label: t('helpNav.companyOwners', 'Company Owners'), 
      href: '/help/for-company-owners', 
      icon: Building2 
    },
    { 
      id: 'technician', 
      label: t('helpNav.technicians', 'Technicians'), 
      href: '/help/for-technicians', 
      icon: HardHat 
    },
    { 
      id: 'building-manager', 
      label: t('helpNav.buildingManagers', 'Building Managers'), 
      href: '/help/for-building-managers', 
      icon: Building2 
    },
    { 
      id: 'property-manager', 
      label: t('helpNav.propertyManagers', 'Property Managers'), 
      href: '/help/for-property-managers', 
      icon: Users 
    },
  ];

  const defaultBackLabel = t('helpNav.backToHelp', 'Back to Help');

  return (
    <nav 
      className="border-b bg-card/50 sticky top-0 z-40 backdrop-blur-sm"
      aria-label="Help navigation"
      data-testid="nav-help"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <Link href={backHref}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  data-testid="button-help-back"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {backLabel || defaultBackLabel}
                </Button>
              </Link>
            )}
            
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = currentSection === item.id || 
                  (item.id === 'home' && location === '/help');
                
                return (
                  <Link key={item.id} href={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className={cn(
                        'flex items-center gap-1',
                        isActive && 'font-medium'
                      )}
                      data-testid={`nav-help-${item.id}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/help/getting-started">
              <Button 
                variant={currentSection === 'getting-started' ? 'secondary' : 'ghost'} 
                size="sm"
                className="flex items-center gap-1"
                data-testid="nav-help-getting-started"
              >
                <Book className="h-4 w-4" />
                <span className="hidden sm:inline">{t('helpNav.gettingStarted', 'Getting Started')}</span>
              </Button>
            </Link>
            <Link href="/help/search">
              <Button 
                variant={currentSection === 'search' ? 'secondary' : 'ghost'} 
                size="sm"
                className="flex items-center gap-1"
                data-testid="nav-help-search"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">{t('helpNav.search', 'Search')}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
