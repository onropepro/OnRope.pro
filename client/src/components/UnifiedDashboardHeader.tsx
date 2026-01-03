import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { SubscriptionRenewalBadge } from "@/components/SubscriptionRenewalBadge";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { NotificationBell } from "@/components/NotificationBell";
import { PlatformNotificationBell } from "@/components/PlatformNotificationBell";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { canManageEmployees } from "@/lib/permissions";
import { trackLogout } from "@/lib/analytics";
import { Menu, MoreVertical, LogOut, Crown, RefreshCw } from "lucide-react";

export type HeaderVariant = 'employer' | 'technician' | 'ground-crew' | 'resident' | 'property-manager' | 'building-manager' | 'superuser' | 'csr';

const AVATAR_COLORS: Record<HeaderVariant, string> = {
  employer: '#0B64A3',
  technician: '#5C7A84',
  'ground-crew': '#5D7B6F',
  resident: '#86A59C',
  'property-manager': '#6E9075',
  'building-manager': '#B89685',
  superuser: '#6B21A8',
  csr: '#0B64A3',
};

export function isValidVariant(variant: string): variant is HeaderVariant {
  return ['employer', 'technician', 'ground-crew', 'resident', 'property-manager', 'building-manager', 'superuser', 'csr'].includes(variant);
}

export function getSafeVariant(variant: string | undefined): HeaderVariant {
  if (!variant) return 'employer';
  return isValidVariant(variant) ? variant : 'employer';
}

// Role key mapping for translations - used by getRoleDisplayName
const roleKeys: Record<string, string> = {
  company: 'admin',
  rope_access_tech: 'technician',
  ground_crew: 'groundCrew',
  ground_crew_supervisor: 'groundCrewSupervisor',
  operations_manager: 'operationsManager',
  office_admin: 'officeAdmin',
  safety_officer: 'safetyOfficer',
  project_manager: 'projectManager',
  estimator: 'estimator',
  accountant: 'accountant',
  foreman: 'foreman',
  supervisor: 'supervisor',
  superuser: 'superUser',
  staff: 'staff',
  resident: 'resident',
  property_manager: 'propertyManager',
  building_manager: 'buildingManager',
};

const roleDefaults: Record<string, string> = {
  company: 'Admin',
  rope_access_tech: 'Technician',
  ground_crew: 'Support Staff',
  ground_crew_supervisor: 'Support Staff Supervisor',
  operations_manager: 'Operations Manager',
  office_admin: 'Office Admin',
  safety_officer: 'Safety Officer',
  project_manager: 'Project Manager',
  estimator: 'Estimator',
  accountant: 'Accountant',
  foreman: 'Foreman',
  supervisor: 'Supervisor',
  superuser: 'Super User',
  staff: 'Staff',
  resident: 'Resident',
  property_manager: 'Property Manager',
  building_manager: 'Building Manager',
};

// Hook-friendly version of getRoleDisplayName
function useRoleDisplayName() {
  const { t } = useTranslation();
  return (role: string | undefined): string => {
    if (!role) return '';
    const key = roleKeys[role];
    if (key) {
      return t(`roles.${key}`, roleDefaults[role] || role);
    }
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
}

function LicenseExpiryWarningBanner({ employees, onReviewClick }: { employees: any[]; onReviewClick: () => void }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const expiringLicenses = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const results: { employee: any; licenseType: string; expiryDate: string; daysRemaining: number }[] = [];
    
    employees.forEach((emp: any) => {
      if (emp.terminatedDate || emp.suspendedAt || emp.connectionStatus === 'suspended') return;
      
      if (emp.irataExpirationDate) {
        const expiryDate = new Date(emp.irataExpirationDate);
        expiryDate.setHours(0, 0, 0, 0);
        if (expiryDate <= thirtyDaysFromNow && expiryDate >= today) {
          const daysRemaining = Math.round((expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
          results.push({
            employee: emp,
            licenseType: 'IRATA Certification',
            expiryDate: emp.irataExpirationDate,
            daysRemaining
          });
        }
      }
      
      if (emp.spratExpirationDate) {
        const expiryDate = new Date(emp.spratExpirationDate);
        expiryDate.setHours(0, 0, 0, 0);
        if (expiryDate <= thirtyDaysFromNow && expiryDate >= today) {
          const daysRemaining = Math.round((expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
          results.push({
            employee: emp,
            licenseType: 'SPRAT Certification',
            expiryDate: emp.spratExpirationDate,
            daysRemaining
          });
        }
      }
      
      if (emp.driversLicenseExpiry) {
        const expiryDate = new Date(emp.driversLicenseExpiry);
        expiryDate.setHours(0, 0, 0, 0);
        if (expiryDate <= thirtyDaysFromNow && expiryDate >= today) {
          const daysRemaining = Math.round((expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
          results.push({
            employee: emp,
            licenseType: "Driver's License",
            expiryDate: emp.driversLicenseExpiry,
            daysRemaining
          });
        }
      }
    });
    
    return results.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [employees]);
  
  if (expiringLicenses.length === 0) return null;
  
  const uniqueEmployeeCount = new Set(expiringLicenses.map(l => l.employee.id)).size;
  
  return (
    <Popover open={isExpanded} onOpenChange={setIsExpanded}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 h-8 px-2 gap-1"
          data-testid="button-license-expiry-warning"
        >
          <span className="material-icons text-base">warning</span>
          <span className="hidden sm:inline text-xs font-medium">{t('dashboard.licenseExpiry.shortTitle', 'Licenses')}</span>
          <Badge variant="destructive" className="h-4 min-w-[16px] px-1 text-[10px]">
            {uniqueEmployeeCount}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b bg-red-50 dark:bg-red-950/40">
          <h4 className="font-semibold text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
            <span className="material-icons text-base">warning</span>
            {t('dashboard.licenseExpiry.title', 'License Expiration Warning')}
          </h4>
          <p className="text-red-600 dark:text-red-400 text-xs mt-1">
            {t('dashboard.licenseExpiry.description', '{{count}} employee(s) have licenses expiring within 30 days', { count: uniqueEmployeeCount })}
          </p>
        </div>
        <ScrollArea className="max-h-[250px]">
          <div className="p-2 space-y-1">
            {expiringLicenses.map((item, index) => (
              <div 
                key={`${item.employee.id}-${item.licenseType}-${index}`}
                className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-muted/50"
                data-testid={`expiry-item-${item.employee.id}-${index}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{item.employee.name}</div>
                  <div className="text-xs text-muted-foreground">{item.licenseType}</div>
                </div>
                <Badge variant="destructive" className="text-[10px] ml-2 flex-shrink-0">
                  {item.daysRemaining === 0 
                    ? t('dashboard.licenseExpiry.expiresToday', 'Today')
                    : item.daysRemaining === 1
                      ? t('dashboard.licenseExpiry.expiresTomorrow', '1 day')
                      : t('dashboard.licenseExpiry.expiresInDays', '{{days}} days', { days: item.daysRemaining })}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t">
          <Button
            onClick={() => {
              setIsExpanded(false);
              onReviewClick();
            }}
            size="sm"
            className="w-full bg-red-600 hover:bg-red-700 text-white h-8"
            data-testid="button-review-licenses"
          >
            <span className="material-icons text-sm mr-1">people</span>
            {t('dashboard.licenseExpiry.reviewLicenses', 'Review Employees')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export interface UnifiedDashboardHeaderProps {
  variant: HeaderVariant;
  currentUser?: any;
  employees?: any[];
  onNavigateToEmployees?: () => void;
  onBackClick?: () => void;
  onMobileMenuClick?: () => void;
  customMenuTrigger?: React.ReactNode;
  showSearch?: boolean;
  showNotifications?: boolean;
  showLanguageDropdown?: boolean;
  showInstallPWA?: boolean;
  showProfile?: boolean;
  showLogout?: boolean;
  useInlineActions?: boolean;
  onProfileClick?: () => void;
  onLogout?: () => void;
  pageTitle?: string;
  pageDescription?: string;
  actionButtons?: React.ReactNode;
  logoUrl?: string;
  isLoading?: boolean;
  profileHref?: string;
  brandingLogoUrl?: string;
  brandingColor?: string;
  brandingCompanyName?: string;
}

export function UnifiedDashboardHeader({
  variant,
  currentUser,
  employees = [],
  onNavigateToEmployees,
  onBackClick,
  onMobileMenuClick,
  customMenuTrigger,
  showSearch = true,
  showNotifications = true,
  showLanguageDropdown = true,
  showInstallPWA = true,
  showProfile = true,
  showLogout = true,
  useInlineActions,
  onProfileClick: customProfileClick,
  onLogout: customLogout,
  pageTitle,
  pageDescription,
  actionButtons,
  logoUrl,
  isLoading = false,
  profileHref,
  brandingLogoUrl,
  brandingColor,
  brandingCompanyName,
}: UnifiedDashboardHeaderProps) {
  const { t } = useTranslation();
  const getRoleDisplayName = useRoleDisplayName();
  const [, setLocation] = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const safeVariant: HeaderVariant = isValidVariant(variant) ? variant : 'employer';
  const isEmployer = safeVariant === 'employer' || safeVariant === 'csr';
  const isSuperUser = safeVariant === 'superuser';
  const isTechnician = safeVariant === 'technician';
  const isGroundCrew = safeVariant === 'ground-crew';
  const isResident = safeVariant === 'resident';
  const hasBranding = !!(brandingLogoUrl || brandingCompanyName);

  const avatarColor = brandingColor || AVATAR_COLORS[safeVariant] || AVATAR_COLORS.employer;

  const handleLogout = async () => {
    try {
      trackLogout();
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      queryClient.clear();
      setLocation('/');
    } catch (error) {
      setLocation('/');
    }
  };

  const handleNavigateToEmployees = () => {
    if (onNavigateToEmployees) {
      onNavigateToEmployees();
    } else {
      setLocation("/dashboard?tab=employees");
    }
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      setLocation("/dashboard");
    }
  };

  const handleProfileClick = () => {
    if (profileHref) {
      setLocation(profileHref);
      return;
    }
    if (currentUser?.role === 'property_manager') {
      setLocation("/property-manager-dashboard");
    } else if (currentUser?.role === 'resident') {
      setLocation("/resident-dashboard");
    } else if (currentUser?.role === 'building_manager') {
      setLocation("/building-manager-dashboard");
    } else if (currentUser?.role === 'ground_crew') {
      setLocation("/ground-crew-portal?tab=profile");
    } else if (currentUser?.role === 'company') {
      setLocation("/profile");
    } else {
      setLocation("/technician-portal?tab=profile");
    }
  };

  const userName = currentUser?.fullName || currentUser?.name || 'User';
  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const showLicenseWarnings = isEmployer && currentUser && (currentUser.role === 'company' || canManageEmployees(currentUser)) && employees.length > 0;
  const showSubscriptionBadge = isEmployer && currentUser?.role === 'company';
  const showPlusBadge = isTechnician && currentUser?.role === 'rope_access_tech' && currentUser?.hasPlusAccess;
  const useDropdownProfile = useInlineActions === undefined 
    ? (!isEmployer && !isSuperUser) 
    : !useInlineActions;
  const useIconOnlyLanguage = true;
  
  const resolvedProfileClick = customProfileClick || handleProfileClick;
  const resolvedLogout = customLogout || handleLogout;

  const headerBorderStyle = hasBranding && brandingColor 
    ? { borderColor: `${brandingColor}20` } 
    : undefined;

  return (
    <>
      <header 
        className="sticky top-0 z-[100] h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-6"
        style={headerBorderStyle}
      >
        <div className="h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {customMenuTrigger ? (
              customMenuTrigger
            ) : onMobileMenuClick ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileMenuClick}
                className="lg:hidden text-slate-600 dark:text-slate-300"
                data-testid="button-sidebar-toggle"
              >
                <Menu className="h-5 w-5" />
              </Button>
            ) : null}
            
            {hasBranding && (
              <div className="flex items-center gap-3">
                {brandingLogoUrl ? (
                  <img 
                    src={brandingLogoUrl} 
                    alt={brandingCompanyName || t('common.companyLogo', 'Company logo')} 
                    className="w-8 h-8 object-contain"
                    data-testid="img-company-logo"
                  />
                ) : (
                  <span className="material-icons text-2xl" style={{ color: avatarColor }}>apartment</span>
                )}
                <h1 
                  className="text-xl font-semibold"
                  style={{ color: brandingColor || avatarColor }}
                >
                  {brandingCompanyName || t('common.portal', 'Portal')}
                </h1>
              </div>
            )}
            
            {onBackClick && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackClick}
                data-testid="button-back-dashboard"
              >
                <span className="material-icons">arrow_back</span>
              </Button>
            )}
            
            {pageTitle && !hasBranding && (
              <div className="flex-shrink-0">
                <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
                {pageDescription && (
                  <p className="text-sm text-muted-foreground">{pageDescription}</p>
                )}
              </div>
            )}
            
            {showSearch && !hasBranding && (
              <div className="hidden md:flex flex-1 max-w-xl">
                <DashboardSearch />
              </div>
            )}
          </div>
          
          {actionButtons && (
            <div className="flex items-center gap-2">
              {actionButtons}
            </div>
          )}
          
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {showLicenseWarnings && (
              <LicenseExpiryWarningBanner employees={employees} onReviewClick={handleNavigateToEmployees} />
            )}
            
            {showSubscriptionBadge && (
              <SubscriptionRenewalBadge 
                subscriptionEndDate={currentUser.subscriptionEndDate} 
                subscriptionStatus={currentUser.subscriptionStatus}
              />
            )}
            
            {showPlusBadge && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="default" 
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs px-2 py-0.5 font-bold border-0 cursor-help" 
                    data-testid="badge-plus"
                  >
                    <Crown className="w-3 h-3 mr-1 fill-current" />
                    {t("technician.proBadge", "PLUS")}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("technician.proBadgeTooltip", "You have PLUS access through referrals")}</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {showInstallPWA && <InstallPWAButton />}
            
            {isSuperUser && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.location.reload()}
                data-testid="button-refresh-page"
                title="Refresh page"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            
            {showNotifications && !isSuperUser && (
              <>
                <PlatformNotificationBell />
                <NotificationBell />
              </>
            )}
            
            {showLanguageDropdown && (
              <LanguageDropdown iconOnly={useIconOnlyLanguage} />
            )}
            
            {useDropdownProfile && showProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600 dark:text-slate-300"
                    data-testid="button-utility-menu"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem 
                    onClick={resolvedProfileClick}
                    className="flex items-center gap-2 cursor-pointer"
                    data-testid="menu-item-profile"
                  >
                    <Avatar className="w-6 h-6" style={{ backgroundColor: avatarColor }}>
                      <AvatarImage src={currentUser?.photoUrl || undefined} />
                      <AvatarFallback style={{ backgroundColor: avatarColor }} className="text-white text-xs font-medium">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{userName}</span>
                      <span className="text-xs text-muted-foreground">{t("technician.profile", "Profile")}</span>
                    </div>
                  </DropdownMenuItem>
                  
                  {showLogout && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setShowLogoutDialog(true)}
                        className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                        data-testid="menu-item-logout"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t("common.logout", "Log out")}</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {!useDropdownProfile && showProfile && (
              isLoading ? (
                <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 py-1 pr-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                  <div className="hidden lg:block space-y-1">
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  </div>
                </div>
              ) : currentUser ? (
                isSuperUser ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="material-icons text-base">person</span>
                    <span className="hidden sm:inline">{currentUser?.email || userName}</span>
                  </div>
                ) : customProfileClick ? (
                  <button
                    type="button"
                    onClick={customProfileClick}
                    className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover-elevate rounded-md py-1 pr-2"
                    data-testid="button-user-profile"
                  >
                    <Avatar className="w-8 h-8" style={{ backgroundColor: avatarColor }}>
                      <AvatarImage src={currentUser?.photoUrl || undefined} alt={userName} />
                      <AvatarFallback style={{ backgroundColor: avatarColor }} className="text-white text-xs font-medium">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">{userName}</p>
                      <p className="text-xs text-slate-400 leading-tight">{getRoleDisplayName(currentUser?.role)}</p>
                    </div>
                  </button>
                ) : (
                  <Link 
                    href={profileHref || "/profile"}
                    className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover-elevate rounded-md py-1 pr-2"
                    data-testid="link-user-profile"
                  >
                    <Avatar className="w-8 h-8" style={{ backgroundColor: avatarColor }}>
                      <AvatarImage src={currentUser?.photoUrl || undefined} alt={userName} />
                      <AvatarFallback style={{ backgroundColor: avatarColor }} className="text-white text-xs font-medium">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">{userName}</p>
                      <p className="text-xs text-slate-400 leading-tight">{getRoleDisplayName(currentUser?.role)}</p>
                    </div>
                  </Link>
                )
              ) : null
            )}
            
            {!useDropdownProfile && showLogout && currentUser && !isSuperUser && (
              <Button 
                variant="ghost" 
                size="icon" 
                data-testid="button-logout" 
                onClick={resolvedLogout} 
                className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span className="material-icons text-xl">logout</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.logout.title', 'Confirm Logout')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.logout.description', 'Are you sure you want to log out? Any unsaved changes will be lost.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              {t('dashboard.logout.confirm', 'Log Out')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
