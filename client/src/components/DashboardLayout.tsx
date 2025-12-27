import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useContext, ReactNode } from "react";
import { BrandingContext } from "@/App";
import { DashboardSidebar, type NavGroup, type DashboardVariant, STAKEHOLDER_COLORS } from "@/components/DashboardSidebar";
import { EmployerDashboardHeader } from "@/components/EmployerDashboardHeader";
import { useHeaderConfig, HeaderConfigProvider } from "@/contexts/HeaderConfigContext";
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
}

interface BrandingSettings {
  logoUrl?: string | null;
  colors?: string[];
  companyName?: string;
  subscriptionActive?: boolean;
  pwaAppIconUrl?: string | null;
}

function DashboardLayoutInner({ 
  children,
  variant = "employer",
  customNavigationGroups,
  customBrandColor,
  showDashboardLink = true,
  dashboardLinkLabel,
  headerContent,
  onTabChange: externalTabChange,
  activeTab: externalActiveTab,
}: DashboardLayoutProps) {
  const { config: headerConfig } = useHeaderConfig();
  const [location, setLocation] = useLocation();
  const brandingContext = useContext(BrandingContext);

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
        {variant === "employer" && (
          <EmployerDashboardHeader
            currentUser={currentUser}
            employees={employees}
            logoUrl={brandingData?.logoUrl || undefined}
            pageTitle={headerConfig?.pageTitle}
            pageDescription={headerConfig?.pageDescription}
            actionButtons={headerConfig?.actionButtons}
            onBackClick={headerConfig?.onBackClick || undefined}
            showSearch={headerConfig?.showSearch ?? true}
            showNotifications={headerConfig?.showNotifications ?? true}
            showLanguageDropdown={headerConfig?.showLanguageDropdown ?? true}
            showProfile={headerConfig?.showProfile ?? true}
            showLogout={headerConfig?.showLogout ?? true}
          />
        )}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <HeaderConfigProvider>
      <DashboardLayoutInner {...props} />
    </HeaderConfigProvider>
  );
}

// Re-export types for convenience
export { type NavGroup, type NavItem, type DashboardVariant, STAKEHOLDER_COLORS } from "@/components/DashboardSidebar";
export { useSetHeaderConfig } from "@/contexts/HeaderConfigContext";
export type { HeaderConfig } from "@/contexts/HeaderConfigContext";
