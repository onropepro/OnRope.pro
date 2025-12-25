import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useContext, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { BrandingContext } from "@/App";
import { DashboardSidebar, type NavGroup, type DashboardVariant, STAKEHOLDER_COLORS } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User } from "@/lib/permissions";

interface DashboardLayoutProps {
  children: ReactNode;
  variant?: DashboardVariant;
  customNavigationGroups?: NavGroup[];
  customBrandColor?: string;
  showDashboardLink?: boolean;
  dashboardLinkLabel?: string;
  headerContent?: React.ReactNode;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
  showHeader?: boolean;
  onLogout?: () => void;
}

interface BrandingSettings {
  logoUrl?: string | null;
  colors?: string[];
  companyName?: string;
  subscriptionActive?: boolean;
  pwaAppIconUrl?: string | null;
}

export function DashboardLayout({ 
  children,
  variant = "employer",
  customNavigationGroups,
  customBrandColor,
  showDashboardLink = true,
  dashboardLinkLabel,
  headerContent,
  onTabChange: externalTabChange,
  activeTab: externalActiveTab,
  showHeader = true,
  onLogout: externalOnLogout,
}: DashboardLayoutProps) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const brandingContext = useContext(BrandingContext);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/login");
    },
  });

  const handleLogout = () => {
    if (externalOnLogout) {
      externalOnLogout();
    } else {
      setShowLogoutDialog(true);
    }
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    logoutMutation.mutate();
  };

  // Correctly typed to match API response shape: { user: {...} }
  const { data: userData } = useQuery<{ user: User & { username?: string; companyId?: string } }>({
    queryKey: ["/api/user"],
  });
  const currentUser = userData?.user;
  
  // Get company ID for branding - company users use their own ID, employees use companyId
  const companyIdForBranding = currentUser?.role === 'company' 
    ? currentUser?.id 
    : currentUser?.companyId;

  // Fetch branding using the company endpoint pattern (matches Dashboard.tsx)
  const { data: brandingData } = useQuery<BrandingSettings | null>({
    queryKey: ["/api/company", companyIdForBranding, "branding"],
    queryFn: async () => {
      if (!companyIdForBranding) return null;
      const response = await fetch(`/api/company/${companyIdForBranding}/branding`);
      if (response.status === 404) return null;
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!companyIdForBranding,
  });

  const { data: employeesData } = useQuery<{ employees: any[] }>({
    queryKey: ["/api/employees"],
    enabled: !!currentUser,
  });
  const employees = employeesData?.employees;

  const { data: alertCounts } = useQuery<{
    expiringCerts?: number;
    overdueInspections?: number;
    pendingTimesheets?: number;
    unsignedDocs?: number;
    jobApplications?: number;
    quoteNotifications?: number;
  }>({
    queryKey: ["/api/dashboard-alerts"],
    enabled: !!currentUser,
  });

  const handleTabChange = (tab: string) => {
    if (tab === "home") {
      setLocation("/dashboard");
    } else if (tab === "projects") {
      setLocation("/dashboard?tab=projects");
    } else if (tab === "employees") {
      setLocation("/dashboard?tab=employees");
    } else if (tab === "complaints") {
      setLocation("/dashboard?tab=complaints");
    } else {
      setLocation("/dashboard");
    }
  };

  const getActiveTab = (): string => {
    if (location.startsWith("/dashboard")) {
      const params = new URLSearchParams(window.location.search);
      return params.get("tab") || "home";
    }
    if (location.startsWith("/projects")) return "projects";
    if (location.startsWith("/inventory")) return "inventory";
    if (location.startsWith("/payroll")) return "payroll";
    if (location.startsWith("/quotes")) return "quotes";
    if (location.startsWith("/schedule")) return "schedule";
    if (location.startsWith("/safety-forms")) return "safety-forms";
    if (location.startsWith("/documents")) return "documents";
    if (location.startsWith("/job-board")) return "job-board";
    if (location.startsWith("/non-billable")) return "timesheets";
    if (location.startsWith("/profile")) return "settings";
    if (location.startsWith("/help")) return "help";
    if (location.startsWith("/complaints")) return "complaints";
    return "home";
  };

  // White label is active if the API says subscriptionActive is true
  const whitelabelActive = !!brandingData?.subscriptionActive;

  // Use external handlers if provided, otherwise use internal defaults
  const resolvedActiveTab = externalActiveTab ?? getActiveTab();
  const resolvedTabChange = externalTabChange ?? handleTabChange;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar
        currentUser={currentUser}
        activeTab={resolvedActiveTab}
        onTabChange={resolvedTabChange}
        brandingLogoUrl={brandingData?.logoUrl}
        whitelabelBrandingActive={whitelabelActive}
        companyName={brandingData?.companyName || currentUser?.username}
        employeeCount={employees?.length || 0}
        alertCounts={alertCounts}
        variant={variant}
        customNavigationGroups={customNavigationGroups}
        customBrandColor={customBrandColor}
        showDashboardLink={showDashboardLink}
        dashboardLinkLabel={dashboardLinkLabel}
        headerContent={headerContent}
      />
      
      <main className="lg:pl-60 min-h-screen flex flex-col">
        {showHeader && variant === "employer" && (
          <DashboardHeader
            currentUser={currentUser as any}
            employees={employees || []}
            onNavigateToEmployees={() => resolvedTabChange("employees")}
            onLogout={handleLogout}
          />
        )}
        <div className="flex-1">
          {children}
        </div>
      </main>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.logoutDialog.title', 'Log Out')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.logoutDialog.description', 'Are you sure you want to log out? You will need to sign in again to access your dashboard.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-logout-cancel">
              {t('common.cancel', 'Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmLogout}
              data-testid="button-logout-confirm"
            >
              {t('dashboard.logoutDialog.confirm', 'Log Out')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Re-export types for convenience
export { type NavGroup, type NavItem, type DashboardVariant, STAKEHOLDER_COLORS } from "@/components/DashboardSidebar";
