import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import ResidentDashboard from "@/pages/ResidentDashboard";
import Dashboard from "@/pages/Dashboard";
import ComplaintDetail from "@/pages/ComplaintDetail";
import WorkSessionHistory from "@/pages/WorkSessionHistory";
import ProjectDetail from "@/pages/ProjectDetail";
import Profile from "@/pages/Profile";
import HarnessInspectionForm from "@/pages/HarnessInspectionForm";
import ToolboxMeetingForm from "@/pages/ToolboxMeetingForm";
import Payroll from "@/pages/Payroll";
import Quotes from "@/pages/Quotes";
import ActiveWorkers from "@/pages/ActiveWorkers";
import NonBillableHours from "@/pages/NonBillableHours";
import Inventory from "@/pages/Inventory";
import HoursAnalytics from "@/pages/HoursAnalytics";
import Schedule from "@/pages/Schedule";
import LicenseVerification from "@/pages/LicenseVerification";
import SuperUser from "@/pages/SuperUser";
import AllCompanies from "@/pages/AllCompanies";
import CompanyDetail from "@/pages/CompanyDetail";
import ResidentsManagement from "@/pages/ResidentsManagement";
import Documents from "@/pages/Documents";
import ResidentLink from "@/pages/ResidentLink";
import NotFound from "@/pages/not-found";
import ProtectedRoute from "@/components/ProtectedRoute";
import { EMPLOYEE_ROLES } from "@/lib/permissions";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/link" component={ResidentLink} />
      <Route path="/superuser">
        <ProtectedRoute allowedRoles={["superuser"]}>
          <SuperUser />
        </ProtectedRoute>
      </Route>
      <Route path="/superuser/companies/:id">
        <ProtectedRoute allowedRoles={["superuser"]}>
          <CompanyDetail />
        </ProtectedRoute>
      </Route>
      <Route path="/superuser/companies">
        <ProtectedRoute allowedRoles={["superuser"]}>
          <AllCompanies />
        </ProtectedRoute>
      </Route>
      <Route path="/license-verification">
        <ProtectedRoute allowedRoles={["company"]}>
          <LicenseVerification />
        </ProtectedRoute>
      </Route>
      <Route path="/resident">
        <ProtectedRoute allowedRoles={["resident"]}>
          <ResidentDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute allowedRoles={EMPLOYEE_ROLES}>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/complaints/:id">
        <ProtectedRoute allowedRoles={["company", "operations_manager", "supervisor", "rope_access_tech", "resident"]}>
          <ComplaintDetail />
        </ProtectedRoute>
      </Route>
      <Route path="/projects/:id/work-sessions">
        <ProtectedRoute allowedRoles={["company", "operations_manager", "supervisor", "rope_access_tech"]}>
          <WorkSessionHistory />
        </ProtectedRoute>
      </Route>
      <Route path="/projects/:id">
        <ProtectedRoute>
          <ProjectDetail />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      <Route path="/harness-inspection">
        <ProtectedRoute allowedRoles={["rope_access_tech", "supervisor", "operations_manager", "company"]}>
          <HarnessInspectionForm />
        </ProtectedRoute>
      </Route>
      <Route path="/toolbox-meeting">
        <ProtectedRoute allowedRoles={["rope_access_tech", "supervisor", "operations_manager", "company"]}>
          <ToolboxMeetingForm />
        </ProtectedRoute>
      </Route>
      <Route path="/payroll">
        <ProtectedRoute allowedRoles={["company", "operations_manager", "supervisor"]}>
          <Payroll />
        </ProtectedRoute>
      </Route>
      <Route path="/quotes">
        <ProtectedRoute allowedRoles={["company", "operations_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"]}>
          <Quotes />
        </ProtectedRoute>
      </Route>
      <Route path="/active-workers">
        <ProtectedRoute allowedRoles={["company", "operations_manager", "supervisor"]}>
          <ActiveWorkers />
        </ProtectedRoute>
      </Route>
      <Route path="/non-billable-hours">
        <ProtectedRoute allowedRoles={EMPLOYEE_ROLES}>
          <NonBillableHours />
        </ProtectedRoute>
      </Route>
      <Route path="/inventory">
        <ProtectedRoute allowedRoles={EMPLOYEE_ROLES}>
          <Inventory />
        </ProtectedRoute>
      </Route>
      <Route path="/hours-analytics">
        <ProtectedRoute allowedRoles={["company", "operations_manager", "supervisor"]}>
          <HoursAnalytics />
        </ProtectedRoute>
      </Route>
      <Route path="/schedule">
        <ProtectedRoute allowedRoles={["company", "operations_manager", "supervisor"]}>
          <Schedule />
        </ProtectedRoute>
      </Route>
      <Route path="/residents">
        <ProtectedRoute allowedRoles={["company", "operations_manager", "supervisor"]}>
          <ResidentsManagement />
        </ProtectedRoute>
      </Route>
      <Route path="/documents">
        <ProtectedRoute allowedRoles={EMPLOYEE_ROLES}>
          <Documents />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

// White Label Branding Provider
function BrandingProvider({ children }: { children: React.ReactNode }) {
  // Fetch current user
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  // Fetch company branding for white label support
  const { data: brandingData } = useQuery({
    queryKey: ["/api/company", userData?.user?.companyId, "branding"],
    queryFn: async () => {
      if (!userData?.user?.companyId) return null;
      const response = await fetch(`/api/company/${userData.user.companyId}/branding`);
      
      // 404 means no branding configured - that's okay
      if (response.status === 404) return null;
      
      // Other non-OK responses are actual errors
      if (!response.ok) {
        throw new Error(`Failed to fetch branding: ${response.status}`);
      }
      
      return response.json();
    },
    enabled: !!userData?.user?.companyId && userData?.user?.role !== 'resident' && userData?.user?.role !== 'superuser',
    retry: 1, // Only retry once for branding fetch
  });

  const branding = brandingData || {};
  const brandColors = (branding.subscriptionActive && branding.colors) ? branding.colors : [];
  const primaryBrandColor = brandColors[0] || null;

  // Inject brand color CSS variable when active
  useEffect(() => {
    if (primaryBrandColor) {
      document.documentElement.style.setProperty('--brand-primary', primaryBrandColor);
    } else {
      document.documentElement.style.removeProperty('--brand-primary');
    }

    return () => {
      document.documentElement.style.removeProperty('--brand-primary');
    };
  }, [primaryBrandColor]);

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrandingProvider>
          <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white text-center py-0.5 text-[10px] font-medium leading-tight">
            Free Beta Access - Subscription Service Coming Soon - Do Not Distribute
          </div>
          <div className="pt-4">
            <Router />
          </div>
          <Toaster />
        </BrandingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
