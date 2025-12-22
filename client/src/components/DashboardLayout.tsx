import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useContext, ReactNode } from "react";
import { BrandingContext } from "@/App";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import type { User } from "@/lib/permissions";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface BrandingSettings {
  logoUrl?: string;
  primaryColor?: string;
  companyDisplayName?: string;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const brandingContext = useContext(BrandingContext);

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: branding } = useQuery<BrandingSettings>({
    queryKey: ["/api/branding"],
    enabled: !!currentUser,
  });

  const { data: employees } = useQuery<any[]>({
    queryKey: ["/api/employees"],
    enabled: !!currentUser,
  });

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

  const whitelabelActive = brandingContext?.brandingActive && !!branding?.primaryColor;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar
        currentUser={currentUser}
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
        brandingLogoUrl={branding?.logoUrl}
        whitelabelBrandingActive={whitelabelActive}
        companyName={branding?.companyDisplayName || currentUser?.username}
        employeeCount={employees?.length || 0}
        alertCounts={alertCounts}
      />
      
      <main className="lg:pl-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
