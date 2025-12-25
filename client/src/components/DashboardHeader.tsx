import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { SubscriptionRenewalBadge } from "@/components/SubscriptionRenewalBadge";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { canManageEmployees, type User } from "@/lib/permissions";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  expiryDate?: string;
}

interface LicenseExpiryWarningBannerProps {
  employees: Employee[];
  onReviewClick: () => void;
}

function LicenseExpiryWarningBanner({ employees, onReviewClick }: LicenseExpiryWarningBannerProps) {
  const { t } = useTranslation();
  
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const expiringEmployees = employees.filter(emp => {
    if (!emp.expiryDate) return false;
    const expiry = new Date(emp.expiryDate);
    return expiry <= thirtyDaysFromNow && expiry > now;
  });
  
  const expiredEmployees = employees.filter(emp => {
    if (!emp.expiryDate) return false;
    const expiry = new Date(emp.expiryDate);
    return expiry <= now;
  });

  if (expiringEmployees.length === 0 && expiredEmployees.length === 0) {
    return null;
  }

  const totalCount = expiringEmployees.length + expiredEmployees.length;
  const isExpired = expiredEmployees.length > 0;

  return (
    <Badge 
      variant={isExpired ? "destructive" : "outline"}
      className="cursor-pointer hidden sm:inline-flex"
      onClick={onReviewClick}
      data-testid="badge-license-warning"
    >
      <span className="material-icons text-sm mr-1">warning</span>
      {totalCount} {t('dashboard.licenseIssues', 'license issues')}
    </Badge>
  );
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

function NotificationBell() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const { data: notificationsData, isLoading } = useQuery<{ notifications: NotificationItem[]; unreadCount: number }>({
    queryKey: ["/api/notifications"],
    refetchInterval: 30000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await apiRequest("PATCH", `/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", "/api/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const dismissMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await apiRequest("DELETE", `/api/notifications/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }

    if (notification.type === 'job_application' && notification.metadata?.employeeId) {
      setIsOpen(false);
      setLocation(`/dashboard?tab=employees`);
    } else if (notification.type === 'quote_notification') {
      setIsOpen(false);
      setLocation(`/quotes`);
    }
  };

  const unreadCount = notificationsData?.unreadCount ?? 0;
  const notifications = notificationsData?.notifications ?? [];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-600 dark:text-slate-300"
          data-testid="button-notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
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
              onClick={() => markAllAsReadMutation.mutate()}
              className="text-xs"
            >
              {t('notifications.markAllRead', 'Mark all read')}
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              {t('common.loading', 'Loading...')}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {t('notifications.empty', 'No notifications')}
            </div>
          ) : (
            notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${
                  !notification.isRead ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{notification.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 w-6 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissMutation.mutate(notification.id);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface DashboardHeaderProps {
  currentUser?: (User & { subscriptionEndDate?: string; subscriptionStatus?: string; fullName?: string; name?: string | null }) | null;
  employees?: Employee[];
  onNavigateToEmployees?: () => void;
  onLogout?: () => void;
}

export function DashboardHeader({ 
  currentUser, 
  employees = [],
  onNavigateToEmployees,
  onLogout 
}: DashboardHeaderProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-[100] h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-6">
      <div className="h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="hidden md:flex flex-1 max-w-xl">
            <DashboardSearch />
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {currentUser && (currentUser.role === 'company' || canManageEmployees(currentUser as User)) && employees.length > 0 && (
            <LicenseExpiryWarningBanner 
              employees={employees} 
              onReviewClick={() => onNavigateToEmployees?.() || setLocation("/dashboard?tab=employees")} 
            />
          )}
          
          {currentUser?.role === 'company' && (
            <SubscriptionRenewalBadge 
              subscriptionEndDate={currentUser.subscriptionEndDate} 
              subscriptionStatus={currentUser.subscriptionStatus}
            />
          )}
          
          <InstallPWAButton />
          
          {currentUser?.role === 'company' && (
            <NotificationBell />
          )}
          
          <LanguageDropdown />
          
          <Link 
            href="/profile" 
            className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover-elevate rounded-md py-1 pr-2"
            data-testid="link-user-profile"
          >
            <Avatar className="w-8 h-8 bg-[#0B64A3]">
              <AvatarFallback className="bg-[#0B64A3] text-white text-xs font-medium">
                {(currentUser?.fullName || currentUser?.name) ? (currentUser?.fullName || currentUser?.name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">{currentUser?.fullName || currentUser?.name || 'User'}</p>
              <p className="text-xs text-slate-400 leading-tight">{currentUser?.role === 'company' ? 'Admin' : currentUser?.role}</p>
            </div>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            data-testid="button-logout" 
            onClick={onLogout}
            className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="material-icons text-xl">logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
