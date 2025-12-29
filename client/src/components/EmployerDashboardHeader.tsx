import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { SubscriptionRenewalBadge } from "@/components/SubscriptionRenewalBadge";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { apiRequest } from "@/lib/queryClient";
import { formatTimestampDateShort } from "@/lib/dateUtils";
import { canManageEmployees } from "@/lib/permissions";
import { trackLogout } from "@/lib/analytics";

function getRoleDisplayName(role: string | undefined): string {
  if (!role) return '';
  const roleMap: Record<string, string> = {
    company: 'Admin',
    rope_access_tech: 'Technician',
    ground_crew: 'Ground Crew',
    ground_crew_supervisor: 'Ground Crew Supervisor',
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
  return roleMap[role] || role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

interface EmployerDashboardHeaderProps {
  currentUser?: any;
  employees?: any[];
  onNavigateToEmployees?: () => void;
  onBackClick?: () => void;
  onMobileMenuClick?: () => void;
  showSearch?: boolean;
  showNotifications?: boolean;
  showLanguageDropdown?: boolean;
  showProfile?: boolean;
  showLogout?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  actionButtons?: React.ReactNode;
  logoUrl?: string;
  isLoading?: boolean;
}

function NotificationBell() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: countData } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/unread-count"],
    refetchInterval: 30000,
  });

  const { data: notificationsData, isLoading } = useQuery<{ notifications: any[] }>({
    queryKey: ["/api/notifications"],
    enabled: isOpen,
  });

  const markReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return apiRequest("PATCH", `/api/notifications/${notificationId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", "/api/notifications/read-all", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const unreadCount = countData?.count || 0;
  const notifications = notificationsData?.notifications || [];

  const getNotificationMessage = (notification: any) => {
    if (notification.type === "job_offer_refused") {
      const payload = notification.payload as any;
      return t('notifications.jobOfferRefused', '{{name}} declined your offer for {{job}}', {
        name: payload?.technicianName || 'A technician',
        job: payload?.jobTitle || 'a position',
      });
    }
    return t('notifications.genericNotification', 'New notification');
  };

  const getNotificationIcon = (type: string) => {
    if (type === "job_offer_refused") return "person_off";
    return "notifications";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          data-testid="button-notifications"
        >
          <span className="material-icons text-xl sm:text-2xl">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-semibold">{t('notifications.title', 'Notifications')}</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              data-testid="button-mark-all-read"
            >
              {t('notifications.markAllRead', 'Mark all read')}
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              {t('common.loading', 'Loading...')}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <span className="material-icons text-4xl text-muted-foreground mb-2">notifications_none</span>
              <p className="text-muted-foreground text-sm">
                {t('notifications.noNotifications', 'No notifications')}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className={`p-3 hover-elevate cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
                  onClick={() => {
                    if (!notification.isRead) {
                      markReadMutation.mutate(notification.id);
                    }
                  }}
                  data-testid={`notification-${notification.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${!notification.isRead ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                      <span className="material-icons text-sm">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? 'font-medium' : 'text-muted-foreground'}`}>
                        {getNotificationMessage(notification)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.createdAt && formatTimestampDateShort(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
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


export function EmployerDashboardHeader({
  currentUser,
  employees = [],
  onNavigateToEmployees,
  onBackClick,
  onMobileMenuClick,
  showSearch = true,
  showNotifications = true,
  showLanguageDropdown = true,
  showProfile = true,
  showLogout = true,
  pageTitle,
  pageDescription,
  actionButtons,
  logoUrl,
  isLoading = false,
}: EmployerDashboardHeaderProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    try {
      trackLogout();
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      // Redirect employers to main landing page
      window.location.href = '/';
    } catch (error) {
      window.location.href = '/';
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

  return (
    <>
      <header className="sticky top-0 z-[100] h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-6">
        <div className="h-full flex items-center justify-between gap-4">
          {/* Left Side: Mobile menu + Back button (if provided) + Page Title + Search */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Mobile sidebar toggle - only visible on mobile when callback is provided */}
            {onMobileMenuClick && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileMenuClick}
                className="lg:hidden text-slate-600 dark:text-slate-300"
                data-testid="button-sidebar-toggle"
              >
                <span className="material-icons">menu</span>
              </Button>
            )}
            {/* Back button - only shown if onBackClick is explicitly provided */}
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
            
            {/* Page Title - shown independently of back button */}
            {pageTitle && (
              <div className="flex-shrink-0">
                <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
                {pageDescription && (
                  <p className="text-sm text-muted-foreground">{pageDescription}</p>
                )}
              </div>
            )}
            
            {/* Search - shown when showSearch is true and there's space */}
            {showSearch && (
              <div className="hidden md:flex flex-1 max-w-xl">
                <DashboardSearch />
              </div>
            )}
          </div>
          
          {/* Center: Action Buttons (if provided) */}
          {actionButtons && (
            <div className="flex items-center gap-2">
              {actionButtons}
            </div>
          )}
          
          {/* Right Side: Actions Group */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* License Expiry Warning */}
            {currentUser && (currentUser.role === 'company' || canManageEmployees(currentUser)) && employees.length > 0 && (
              <LicenseExpiryWarningBanner employees={employees} onReviewClick={handleNavigateToEmployees} />
            )}
            
            {/* Trial Badge - Company owners only */}
            {currentUser?.role === 'company' && (
              <SubscriptionRenewalBadge 
                subscriptionEndDate={currentUser.subscriptionEndDate} 
                subscriptionStatus={currentUser.subscriptionStatus}
              />
            )}
            
            {/* Install App Button */}
            <InstallPWAButton />
            
            
            {/* Notification Bell - Company owners only */}
            {showNotifications && currentUser?.role === 'company' && (
              <NotificationBell />
            )}
            
            {/* Language Selector */}
            {showLanguageDropdown && (
              <LanguageDropdown />
            )}
            
            {/* User Profile - Clickable to go to Settings */}
            {showProfile && (
              isLoading ? (
                <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 py-1 pr-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                  <div className="hidden lg:block space-y-1">
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  </div>
                </div>
              ) : currentUser ? (
                <Link 
                  href="/profile" 
                  className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover-elevate rounded-md py-1 pr-2"
                  data-testid="link-user-profile"
                >
                  <Avatar className="w-8 h-8 bg-[#0B64A3]">
                    <AvatarImage src={currentUser?.photoUrl || undefined} alt={currentUser?.fullName || 'User'} />
                    <AvatarFallback className="bg-[#0B64A3] text-white text-xs font-medium">
                      {currentUser?.fullName ? currentUser.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">{currentUser?.fullName || 'User'}</p>
                    <p className="text-xs text-slate-400 leading-tight">{getRoleDisplayName(currentUser?.role)}</p>
                  </div>
                </Link>
              ) : null
            )}
            
            {/* Logout Button - Only show when currentUser exists */}
            {showLogout && currentUser && (
              <Button variant="ghost" size="icon" data-testid="button-logout" onClick={() => setShowLogoutDialog(true)} className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="material-icons text-xl">logout</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
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
