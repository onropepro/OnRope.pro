import { useEffect, createContext, ReactNode, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePermissionSync } from "@/hooks/use-permission-sync";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AuthPortalProvider } from "@/contexts/AuthPortalContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Pages
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import GetLicense from "@/pages/GetLicense";
import CompleteRegistration from "@/pages/CompleteRegistration";
import ResidentDashboard from "@/pages/ResidentDashboard";
import Dashboard from "@/pages/Dashboard";
import ComplaintDetail from "@/pages/ComplaintDetail";
import WorkSessionHistory from "@/pages/WorkSessionHistory";
import ProjectDetail from "@/pages/ProjectDetail";
import Profile from "@/pages/Profile";
import ManageSubscription from "@/pages/ManageSubscription";
import HarnessInspectionForm from "@/pages/HarnessInspectionForm";
import SafetyForms from "@/pages/SafetyForms";
import ToolboxMeetingForm from "@/pages/ToolboxMeetingForm";
import FlhaForm from "@/pages/FlhaForm";
import IncidentReportForm from "@/pages/IncidentReportForm";
import MethodStatementForm from "@/pages/MethodStatementForm";
import Payroll from "@/pages/Payroll";
import Quotes from "@/pages/Quotes";
import ActiveWorkers from "@/pages/ActiveWorkers";
import NonBillableHours from "@/pages/NonBillableHours";
import Inventory from "@/pages/Inventory";
import HoursAnalytics from "@/pages/HoursAnalytics";
import ScheduleRouter from "@/pages/ScheduleRouter";
import Weather from "@/pages/Weather";
import SuperUser from "@/pages/SuperUser";
import AllCompanies from "@/pages/AllCompanies";
import CompanyDetail from "@/pages/CompanyDetail";
import ViewAsCompany from "@/pages/ViewAsCompany";
import SuperUserFeatureRequests from "@/pages/SuperUserFeatureRequests";
import SuperUserMetrics from "@/pages/SuperUserMetrics";
import SuperUserGoalsOverview from "@/pages/SuperUserGoalsOverview";
import FounderResources from "@/pages/FounderResources";
import BuildingPortal from "@/pages/BuildingPortal";
import SuperUserBuildings from "@/pages/SuperUserBuildings";
import SuperUserTechnicians from "@/pages/SuperUserTechnicians";
import SuperUserTasks from "@/pages/SuperUserTasks";
import SuperUserJobBoard from "@/pages/SuperUserJobBoard";
import SuperUserFutureIdeas from "@/pages/SuperUserFutureIdeas";
import SuperUserStaffAccounts from "@/pages/SuperUserStaffAccounts";
import ResidentsManagement from "@/pages/ResidentsManagement";
import Documents from "@/pages/Documents";
import ResidentLink from "@/pages/ResidentLink";
import PropertyManagerSettings from "@/pages/PropertyManagerSettings";
import PropertyManager from "@/pages/PropertyManager";
import PropertyManagerQuoteDetail from "@/pages/PropertyManagerQuoteDetail";
import MyLoggedHours from "@/pages/MyLoggedHours";
import Changelog from "@/pages/Changelog";
import InventoryGuide from "@/pages/InventoryGuide";
import SafetyGuide from "@/pages/SafetyGuide";
import ConnectionsGuide from "@/pages/ConnectionsGuide";
import UserAccessGuide from "@/pages/UserAccessGuide";
import ProjectsGuide from "@/pages/ProjectsGuide";
import TimeTrackingGuide from "@/pages/TimeTrackingGuide";
import IRATALoggingGuide from "@/pages/IRATALoggingGuide";
import DocumentManagementGuide from "@/pages/DocumentManagementGuide";
import EmployeeManagementGuide from "@/pages/EmployeeManagementGuide";
import SchedulingGuide from "@/pages/SchedulingGuide";
import QuotingGuide from "@/pages/QuotingGuide";
import CRMGuide from "@/pages/CRMGuide";
import ResidentPortalGuide from "@/pages/ResidentPortalGuide";
import BrandingGuide from "@/pages/BrandingGuide";
import PlatformAdminGuide from "@/pages/PlatformAdminGuide";
import AnalyticsGuide from "@/pages/AnalyticsGuide";
import LanguageGuide from "@/pages/LanguageGuide";
import GPSGuide from "@/pages/GPSGuide";
import PropertyManagerGuide from "@/pages/PropertyManagerGuide";
import CSRGuide from "@/pages/CSRGuide";
import PSRGuide from "@/pages/PSRGuide";
import TechnicianRegistrationGuide from "@/pages/TechnicianRegistrationGuide";
import HomePage from "@/pages/HomePage";
import PayrollGuide from "@/pages/PayrollGuide";
import MobileDesignGuide from "@/pages/MobileDesignGuide";
import SafetyComplianceLanding from "@/pages/SafetyComplianceLanding";
import SafetyLanding from "@/pages/SafetyLanding";
import UserAccessLanding from "@/pages/UserAccessLanding";
import ProjectManagementLanding from "@/pages/ProjectManagementLanding";
import CSRLanding from "@/pages/CSRLanding";
import WorkSessionLanding from "@/pages/WorkSessionLanding";
import IRATATaskLoggingLanding from "@/pages/IRATATaskLoggingLanding";
import DocumentManagementLanding from "@/pages/DocumentManagementLanding";
import EmployeeManagementLanding from "@/pages/EmployeeManagementLanding";
import TechnicianPassportLanding from "@/pages/TechnicianPassportLanding";
import TechnicianJobBoardLanding from "@/pages/TechnicianJobBoardLanding";
import EmployerJobBoardLanding from "@/pages/EmployerJobBoardLanding";
import GearInventoryLanding from "@/pages/GearInventoryLanding";
import SchedulingCalendarLanding from "@/pages/SchedulingCalendarLanding";
import PayrollFinancialLanding from "@/pages/PayrollFinancialLanding";
import QuotingSalesLanding from "@/pages/QuotingSalesLanding";
import WhiteLabelBrandingLanding from "@/pages/WhiteLabelBrandingLanding";
import ResidentPortalLanding from "@/pages/ResidentPortalLanding";
import CRMLanding from "@/pages/CRMLanding";
import ResidentLanding from "@/pages/ResidentLanding";
import ResetPassword from "@/pages/ResetPassword";
import PropertyManagerLanding from "@/pages/PropertyManagerLanding";
import PropertyManagerInterfaceLanding from "@/pages/PropertyManagerInterfaceLanding";
import CSRPropertyManagerLanding from "@/pages/CSRPropertyManagerLanding";
import TechnicianLanding from "@/pages/TechnicianLanding";
import GroundCrewLanding from "@/pages/GroundCrewLanding";
import JobBoardGuide from "@/pages/JobBoardGuide";
import Pricing from "@/pages/Pricing";
import ROICalculator from "@/pages/ROICalculator";
import HelpCenter from "@/pages/help/HelpCenter";
import HelpSearch from "@/pages/help/HelpSearch";
import HelpArticle from "@/pages/help/HelpArticle";
import GettingStarted from "@/pages/help/GettingStarted";
import HelpROICalculator from "@/pages/help/tools/ROICalculator";
import FeatureFinder from "@/pages/help/FeatureFinder";
import ForCompanyOwners from "@/pages/help/stakeholders/ForCompanyOwners";
import ForTechnicians from "@/pages/help/stakeholders/ForTechnicians";
import ForBuildingManagers from "@/pages/help/stakeholders/ForBuildingManagers";
import ForPropertyManagers from "@/pages/help/stakeholders/ForPropertyManagers";
import ForResidents from "@/pages/help/stakeholders/ForResidents";
import TechnicianPortal from "@/pages/TechnicianPortal";
import GroundCrewPortal from "@/pages/GroundCrewPortal";
import Employer from "@/pages/Employer";
import TechnicianLoggedHours from "@/pages/TechnicianLoggedHours";
import PersonalSafetyDocuments from "@/pages/PersonalSafetyDocuments";
import TechnicianJobBoard from "@/pages/TechnicianJobBoard";
import GroundCrewJobBoard from "@/pages/GroundCrewJobBoard";
import TechnicianPracticeQuizzes from "@/pages/TechnicianPracticeQuizzes";
import TechnicianPSR from "@/pages/TechnicianPSR";
import CompanyJobBoard from "@/pages/CompanyJobBoard";
import VisibleTechniciansBrowser from "@/pages/VisibleTechniciansBrowser";
import NotFound from "@/pages/not-found";
import ProtectedRoute from "@/components/ProtectedRoute";
import { EMPLOYEE_ROLES } from "@/lib/permissions";

interface WithDashboardLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

function WithDashboardLayout({ children, allowedRoles }: WithDashboardLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

import { SiteFooter } from "@/components/SiteFooter";

function Router() {
  const [location] = useLocation();
  
  useEffect(() => {
    console.log("🛣️ Router: Current location changed to:", location);
    // Scroll to top when navigating to a new page
    window.scrollTo(0, 0);
  }, [location]);
  
  // Public routes that should show the footer
  const publicRoutes = [
    "/",
    "/register",
    "/login",
    "/employer",
    "/resident",
    "/reset-password",
    "/property-manager",
    "/technician",
    "/ground-crew",
    "/pricing",
    "/get-license",
    "/complete-registration",
    "/link",
    "/safety",
    "/help",
    "/roi-calculator",
    "/changelog"
  ];

  const showFooter = publicRoutes.some(route => 
    location === route || 
    location.startsWith("/modules/") || 
    location.startsWith("/help/") ||
    location.startsWith("/changelog/")
  );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/employer" component={Employer} />
          <Route path="/resident" component={ResidentLanding} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/property-manager" component={PropertyManagerLanding} />
          <Route path="/property-manager/company-safety-rating" component={CSRPropertyManagerLanding} />
          <Route path="/technician" component={TechnicianLanding} />
          <Route path="/ground-crew" component={GroundCrewLanding} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/get-license" component={GetLicense} />
          <Route path="/complete-registration" component={CompleteRegistration} />
          <Route path="/link" component={ResidentLink} />
          <Route path="/superuser">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <SuperUser />
            </ProtectedRoute>
          </Route>
          <Route path="/superuser/companies/:id">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <CompanyDetail />
            </ProtectedRoute>
          </Route>
          <Route path="/superuser/view-as/:companyId">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <ViewAsCompany />
            </ProtectedRoute>
          </Route>
          <Route path="/superuser/feature-requests">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <SuperUserFeatureRequests />
            </ProtectedRoute>
          </Route>
          <Route path="/superuser/metrics">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <SuperUserMetrics />
            </ProtectedRoute>
          </Route>
          <Route path="/superuser/goals">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <SuperUserGoalsOverview />
            </ProtectedRoute>
          </Route>
          <Route path="/superuser/companies">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <AllCompanies />
            </ProtectedRoute>
          </Route>
          <Route path="/superuser/founder-resources">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <FounderResources />
            </ProtectedRoute>
          </Route>
          <Route path="/superuser/technicians">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <SuperUserTechnicians />
            </ProtectedRoute>
          </Route>
          <Route path="/superuser/buildings">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <SuperUserBuildings />
            </ProtectedRoute>
          </Route>
          <Route path="/superuser/tasks">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <SuperUserTasks />
            </ProtectedRoute>
          </Route>
          <Route path="/superuser/job-board">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <SuperUserJobBoard />
            </ProtectedRoute>
          </Route>
          <Route path="/superuser/future-ideas">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <SuperUserFutureIdeas />
            </ProtectedRoute>
          </Route>
          <Route path="/superuser/staff-accounts">
            <ProtectedRoute allowedRoles={["superuser", "staff"]}>
              <SuperUserStaffAccounts />
            </ProtectedRoute>
          </Route>
          <Route path="/building-portal" component={BuildingPortal} />
          <Route path="/technician-portal">
            <ProtectedRoute allowedRoles={EMPLOYEE_ROLES}>
              <TechnicianPortal />
            </ProtectedRoute>
          </Route>
          <Route path="/ground-crew-portal">
            <ProtectedRoute allowedRoles={["ground_crew", "ground_crew_supervisor"]}>
              <GroundCrewPortal />
            </ProtectedRoute>
          </Route>
          <Route path="/technician-logged-hours">
            <ProtectedRoute allowedRoles={EMPLOYEE_ROLES}>
              <TechnicianLoggedHours />
            </ProtectedRoute>
          </Route>
          <Route path="/technician-job-board">
            <ProtectedRoute allowedRoles={EMPLOYEE_ROLES}>
              <TechnicianJobBoard />
            </ProtectedRoute>
          </Route>
          <Route path="/ground-crew-job-board">
            <ProtectedRoute allowedRoles={["ground_crew", "ground_crew_supervisor"]}>
              <GroundCrewJobBoard />
            </ProtectedRoute>
          </Route>
          <Route path="/personal-safety-documents">
            <ProtectedRoute allowedRoles={EMPLOYEE_ROLES}>
              <PersonalSafetyDocuments />
            </ProtectedRoute>
          </Route>
          <Route path="/technician-practice-quizzes">
            <ProtectedRoute allowedRoles={EMPLOYEE_ROLES}>
              <TechnicianPracticeQuizzes />
            </ProtectedRoute>
          </Route>
          <Route path="/technician-psr">
            <ProtectedRoute allowedRoles={EMPLOYEE_ROLES}>
              <TechnicianPSR />
            </ProtectedRoute>
          </Route>
          <Route path="/resident-dashboard">
            <ProtectedRoute allowedRoles={["resident"]}>
              <ResidentDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/property-manager">
            <ProtectedRoute allowedRoles={["property_manager"]}>
              <PropertyManager />
            </ProtectedRoute>
          </Route>
          <Route path="/property-manager/quotes/:quoteId">
            <ProtectedRoute allowedRoles={["property_manager"]}>
              <PropertyManagerQuoteDetail />
            </ProtectedRoute>
          </Route>
          <Route path="/pm-dashboard">
            <ProtectedRoute allowedRoles={["property_manager"]}>
              <PropertyManager />
            </ProtectedRoute>
          </Route>
          <Route path="/dashboard">
            <WithDashboardLayout allowedRoles={EMPLOYEE_ROLES}>
              <Dashboard />
            </WithDashboardLayout>
          </Route>
          <Route path="/job-board">
            <WithDashboardLayout allowedRoles={["company"]}>
              <CompanyJobBoard />
            </WithDashboardLayout>
          </Route>
          <Route path="/talent-browser">
            <WithDashboardLayout allowedRoles={["company", "superuser"]}>
              <VisibleTechniciansBrowser />
            </WithDashboardLayout>
          </Route>
          <Route path="/complaints/:id">
            <WithDashboardLayout allowedRoles={["company", "operations_manager", "supervisor", "rope_access_tech", "resident"]}>
              <ComplaintDetail />
            </WithDashboardLayout>
          </Route>
          <Route path="/projects/:id/work-sessions">
            <WithDashboardLayout allowedRoles={["company", "operations_manager", "supervisor", "rope_access_tech"]}>
              <WorkSessionHistory />
            </WithDashboardLayout>
          </Route>
          <Route path="/projects/:id">
            <WithDashboardLayout allowedRoles={EMPLOYEE_ROLES}>
              <ProjectDetail />
            </WithDashboardLayout>
          </Route>
          <Route path="/profile">
            <WithDashboardLayout allowedRoles={EMPLOYEE_ROLES}>
              <Profile />
            </WithDashboardLayout>
          </Route>
          <Route path="/property-manager-settings">
            <ProtectedRoute allowedRoles={["property_manager"]}>
              <PropertyManagerSettings />
            </ProtectedRoute>
          </Route>
          <Route path="/manage-subscription">
            <ProtectedRoute allowedRoles={EMPLOYEE_ROLES}>
              <ManageSubscription />
            </ProtectedRoute>
          </Route>
          <Route path="/harness-inspection">
            <ProtectedRoute allowedRoles={["rope_access_tech", "supervisor", "operations_manager", "company"]}>
              <HarnessInspectionForm />
            </ProtectedRoute>
          </Route>
          <Route path="/safety-forms">
            <WithDashboardLayout allowedRoles={EMPLOYEE_ROLES}>
              <SafetyForms />
            </WithDashboardLayout>
          </Route>
          <Route path="/toolbox-meeting">
            <ProtectedRoute allowedRoles={["rope_access_tech", "supervisor", "operations_manager", "company"]}>
              <ToolboxMeetingForm />
            </ProtectedRoute>
          </Route>
          <Route path="/flha-form">
            <ProtectedRoute allowedRoles={["rope_access_tech", "supervisor", "operations_manager", "company"]}>
              <FlhaForm />
            </ProtectedRoute>
          </Route>
          <Route path="/incident-report">
            <ProtectedRoute allowedRoles={["operations_manager", "general_supervisor", "rope_access_supervisor", "supervisor", "company"]}>
              <IncidentReportForm />
            </ProtectedRoute>
          </Route>
          <Route path="/method-statement">
            <ProtectedRoute allowedRoles={["rope_access_tech", "general_supervisor", "rope_access_supervisor", "supervisor", "operations_manager", "company"]}>
              <MethodStatementForm />
            </ProtectedRoute>
          </Route>
          <Route path="/payroll">
            <WithDashboardLayout allowedRoles={["company", "operations_manager", "supervisor"]}>
              <Payroll />
            </WithDashboardLayout>
          </Route>
          <Route path="/quotes">
            <WithDashboardLayout allowedRoles={["company", "operations_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"]}>
              <Quotes />
            </WithDashboardLayout>
          </Route>
          <Route path="/active-workers">
            <WithDashboardLayout allowedRoles={["company", "operations_manager", "supervisor"]}>
              <ActiveWorkers />
            </WithDashboardLayout>
          </Route>
          <Route path="/non-billable-hours">
            <WithDashboardLayout allowedRoles={EMPLOYEE_ROLES}>
              <NonBillableHours />
            </WithDashboardLayout>
          </Route>
          <Route path="/inventory">
            <WithDashboardLayout allowedRoles={EMPLOYEE_ROLES}>
              <Inventory />
            </WithDashboardLayout>
          </Route>
          <Route path="/hours-analytics">
            <WithDashboardLayout allowedRoles={["company", "operations_manager", "supervisor"]}>
              <HoursAnalytics />
            </WithDashboardLayout>
          </Route>
          <Route path="/schedule">
            <WithDashboardLayout allowedRoles={EMPLOYEE_ROLES}>
              <ScheduleRouter />
            </WithDashboardLayout>
          </Route>
          <Route path="/weather">
            <WithDashboardLayout allowedRoles={EMPLOYEE_ROLES}>
              <Weather />
            </WithDashboardLayout>
          </Route>
          <Route path="/residents">
            <WithDashboardLayout allowedRoles={["company", "operations_manager", "supervisor"]}>
              <ResidentsManagement />
            </WithDashboardLayout>
          </Route>
          <Route path="/documents">
            <WithDashboardLayout allowedRoles={EMPLOYEE_ROLES}>
              <Documents />
            </WithDashboardLayout>
          </Route>
          <Route path="/my-logged-hours">
            <WithDashboardLayout allowedRoles={EMPLOYEE_ROLES}>
              <MyLoggedHours />
            </WithDashboardLayout>
          </Route>
          <Route path="/changelog" component={Changelog} />
          <Route path="/changelog/authentication" component={UserAccessGuide} />
          <Route path="/changelog/project-management" component={ProjectsGuide} />
          <Route path="/changelog/inventory" component={InventoryGuide} />
          <Route path="/changelog/safety" component={SafetyGuide} />
          <Route path="/safety" component={SafetyLanding} />
          <Route path="/modules/safety-compliance" component={SafetyComplianceLanding} />
          <Route path="/modules/user-access-authentication" component={UserAccessLanding} />
          <Route path="/modules/project-management" component={ProjectManagementLanding} />
          <Route path="/modules/work-session-time-tracking" component={WorkSessionLanding} />
          <Route path="/modules/company-safety-rating" component={CSRLanding} />
          <Route path="/modules/irata-sprat-task-logging" component={IRATATaskLoggingLanding} />
          <Route path="/modules/document-management" component={DocumentManagementLanding} />
          <Route path="/modules/employee-management" component={EmployeeManagementLanding} />
          <Route path="/modules/technician-passport" component={TechnicianPassportLanding} />
          <Route path="/modules/technician-job-board" component={TechnicianJobBoardLanding} />
          <Route path="/modules/employer-job-board" component={EmployerJobBoardLanding} />
          <Route path="/modules/gear-inventory" component={GearInventoryLanding} />
          <Route path="/modules/scheduling-calendar" component={SchedulingCalendarLanding} />
          <Route path="/modules/payroll-financial" component={PayrollFinancialLanding} />
          <Route path="/modules/quoting-sales-pipeline" component={QuotingSalesLanding} />
          <Route path="/modules/white-label-branding" component={WhiteLabelBrandingLanding} />
          <Route path="/modules/resident-portal" component={ResidentPortalLanding} />
          <Route path="/modules/property-manager-interface" component={PropertyManagerInterfaceLanding} />
          <Route path="/modules/client-relationship-management" component={CRMLanding} />
          <Route path="/changelog/user-access" component={UserAccessGuide} />
          <Route path="/changelog/projects" component={ProjectsGuide} />
          <Route path="/changelog/time-tracking" component={TimeTrackingGuide} />
          <Route path="/changelog/irata-logging" component={IRATALoggingGuide} />
          <Route path="/changelog/documents" component={DocumentManagementGuide} />
          <Route path="/changelog/employees" component={EmployeeManagementGuide} />
          <Route path="/changelog/scheduling" component={SchedulingGuide} />
          <Route path="/changelog/quoting" component={QuotingGuide} />
          <Route path="/changelog/crm" component={CRMGuide} />
          <Route path="/changelog/resident-portal" component={ResidentPortalGuide} />
          <Route path="/changelog/branding" component={BrandingGuide} />
          <Route path="/changelog/platform-admin" component={PlatformAdminGuide} />
          <Route path="/changelog/analytics" component={AnalyticsGuide} />
          <Route path="/changelog/language" component={LanguageGuide} />
          <Route path="/changelog/gps" component={GPSGuide} />
          <Route path="/changelog/property-manager" component={PropertyManagerGuide} />
          <Route path="/changelog/csr" component={CSRGuide} />
          <Route path="/changelog/psr" component={PSRGuide} />
          <Route path="/changelog/technician-registration" component={TechnicianRegistrationGuide} />
          <Route path="/changelog/payroll" component={PayrollGuide} />
          <Route path="/changelog/mobile-design" component={MobileDesignGuide} />
          <Route path="/changelog/job-board" component={JobBoardGuide} />
          <Route path="/changelog/connections" component={ConnectionsGuide} />
          <Route path="/changelog/pricing" component={Pricing} />
          <Route path="/roi-calculator" component={ROICalculator} />
          <Route path="/help" component={HelpCenter} />
          <Route path="/help/search" component={HelpSearch} />
          <Route path="/help/modules/:slug" component={HelpArticle} />
          <Route path="/help/getting-started" component={GettingStarted} />
          <Route path="/help/tools/roi-calculator" component={HelpROICalculator} />
          <Route path="/help/tools/feature-finder" component={FeatureFinder} />
          <Route path="/help/for-company-owners" component={ForCompanyOwners} />
          <Route path="/help/for-technicians" component={ForTechnicians} />
          <Route path="/help/for-building-managers" component={ForBuildingManagers} />
          <Route path="/help/for-property-managers" component={ForPropertyManagers} />
          <Route path="/help/for-residents" component={ForResidents} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {showFooter && <SiteFooter />}
    </div>
  );
}

// Branding Context - share brand colors with all components
interface BrandingContextType {
  brandColors: string[];
  brandingActive: boolean;
}

export const BrandingContext = createContext<BrandingContextType>({
  brandColors: [],
  brandingActive: false,
});

// Separate component for permission sync to ensure stable React hooks
function PermissionSyncManager({ isAuthenticated }: { isAuthenticated: boolean }) {
  usePermissionSync(isAuthenticated);
  return null;
}

// White Label Branding Provider
function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  // Fetch current user
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });
  
  // NEVER apply branding on login/register/license pages
  const isPublicPage = location === '/' || location === '/login' || location === '/register' || location === '/link' || location === '/get-license' || location === '/complete-registration' || location.startsWith('/complete-registration?');
  
  // Only apply branding if user is authenticated AND not on public pages
  const isAuthenticated = !!userData?.user && !isPublicPage;

  // Determine company ID to fetch branding for
  // For company users: use their own ID
  // For employees: use their companyId
  const companyIdForBranding = userData?.user?.role === 'company' 
    ? userData.user.id 
    : userData?.user?.companyId;

  // Fetch company branding for white label support
  const { data: brandingData } = useQuery({
    queryKey: ["/api/company", companyIdForBranding, "branding"],
    queryFn: async () => {
      if (!companyIdForBranding) return null;
      
      const response = await fetch(`/api/company/${companyIdForBranding}/branding`);
      
      // 404 means no branding configured - that's okay
      if (response.status === 404) return null;
      
      // Other non-OK responses are actual errors
      if (!response.ok) {
        throw new Error(`Failed to fetch branding: ${response.status}`);
      }
      
      return response.json();
    },
    // Enable branding for all users EXCEPT superuser and property_manager (property managers link to multiple vendors)
    enabled: isAuthenticated && !!companyIdForBranding && userData?.user?.role !== 'superuser' && userData?.user?.role !== 'property_manager',
    retry: 1, // Only retry once for branding fetch
  });

  const branding = brandingData || {};
  const brandColors = (branding.subscriptionActive && branding.colors) ? branding.colors : [];
  const primaryBrandColor = brandColors[0] || null;
  const secondaryBrandColor = brandColors[1] || null;
  const tertiaryBrandColor = brandColors[2] || null;
  const quaternaryBrandColor = brandColors[3] || null;

  // Convert hex color to HSL format required by Tailwind
  const hexToHSL = (hex: string): string => {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    // Return in "H S% L%" format (no hsl() wrapper, Tailwind adds that)
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  // Create light tint version of a color (for backgrounds)
  const createLightTint = (hex: string, lightness: number = 96): string => {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    
    if (max !== min) {
      const d = max - min;
      const l = (max + min) / 2;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    // Return very light tint - keep hue, reduce saturation, high lightness
    return `${Math.round(h * 360)} ${Math.round(s * 40)}% ${lightness}%`;
  };

  // Get readable foreground color for a background
  const getReadableForeground = (hex: string): string => {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    
    if (max !== min) {
      const d = max - min;
      const l = (max + min) / 2;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    // Return dark version of same hue for readable text on light tint
    return `${Math.round(h * 360)} ${Math.round(s * 70)}% 25%`;
  };

  // List of all brand CSS variables for cleanup
  const brandCssVars = [
    '--brand-primary', '--brand-primary-tint', '--brand-primary-text',
    '--brand-secondary', '--brand-secondary-hsl', '--brand-secondary-tint', '--brand-secondary-text',
    '--brand-tertiary', '--brand-tertiary-hsl', '--brand-tertiary-tint', '--brand-tertiary-text',
    '--brand-quaternary', '--brand-quaternary-hsl', '--brand-quaternary-tint', '--brand-quaternary-text',
    '--primary', '--primary-foreground', '--ring',
    '--sidebar-primary', '--sidebar-primary-foreground', '--sidebar-ring',
    '--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5',
    '--card', '--card-foreground', '--sidebar', '--muted'
  ];

  // Inject brand colors globally - ONLY when user is authenticated
  useEffect(() => {
    if (isAuthenticated && primaryBrandColor) {
      // Convert hex to HSL format for Tailwind
      const hslColor = hexToHSL(primaryBrandColor);
      
      // Override ALL brand color variables across entire platform
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', primaryBrandColor);
      root.style.setProperty('--brand-primary-tint', createLightTint(primaryBrandColor, 97));
      root.style.setProperty('--brand-primary-text', getReadableForeground(primaryBrandColor));
      root.style.setProperty('--primary', hslColor);
      root.style.setProperty('--ring', hslColor);
      root.style.setProperty('--sidebar-primary', hslColor);
      root.style.setProperty('--sidebar-ring', hslColor);
      root.style.setProperty('--chart-1', hslColor);
      
      // Create a subtle tinted card background
      root.style.setProperty('--card', createLightTint(primaryBrandColor, 99));
      root.style.setProperty('--sidebar', createLightTint(primaryBrandColor, 98));
      root.style.setProperty('--muted', createLightTint(primaryBrandColor, 96));
      
      // Apply secondary brand color (for gradients, accents)
      if (secondaryBrandColor) {
        const hslSecondary = hexToHSL(secondaryBrandColor);
        document.documentElement.style.setProperty('--brand-secondary', secondaryBrandColor);
        document.documentElement.style.setProperty('--brand-secondary-hsl', hslSecondary);
        document.documentElement.style.setProperty('--brand-secondary-tint', createLightTint(secondaryBrandColor, 96));
        document.documentElement.style.setProperty('--brand-secondary-text', getReadableForeground(secondaryBrandColor));
        document.documentElement.style.setProperty('--chart-2', hslSecondary);
      } else {
        document.documentElement.style.removeProperty('--brand-secondary');
        document.documentElement.style.removeProperty('--brand-secondary-hsl');
        document.documentElement.style.removeProperty('--brand-secondary-tint');
        document.documentElement.style.removeProperty('--brand-secondary-text');
      }
      
      // Apply tertiary brand color (for additional accents)
      if (tertiaryBrandColor) {
        const hslTertiary = hexToHSL(tertiaryBrandColor);
        document.documentElement.style.setProperty('--brand-tertiary', tertiaryBrandColor);
        document.documentElement.style.setProperty('--brand-tertiary-hsl', hslTertiary);
        document.documentElement.style.setProperty('--brand-tertiary-tint', createLightTint(tertiaryBrandColor, 96));
        document.documentElement.style.setProperty('--brand-tertiary-text', getReadableForeground(tertiaryBrandColor));
        document.documentElement.style.setProperty('--chart-3', hslTertiary);
      } else {
        document.documentElement.style.removeProperty('--brand-tertiary');
        document.documentElement.style.removeProperty('--brand-tertiary-hsl');
        document.documentElement.style.removeProperty('--brand-tertiary-tint');
        document.documentElement.style.removeProperty('--brand-tertiary-text');
      }
      
      // Apply quaternary brand color
      if (quaternaryBrandColor) {
        const hslQuaternary = hexToHSL(quaternaryBrandColor);
        document.documentElement.style.setProperty('--brand-quaternary', quaternaryBrandColor);
        document.documentElement.style.setProperty('--brand-quaternary-hsl', hslQuaternary);
        document.documentElement.style.setProperty('--brand-quaternary-tint', createLightTint(quaternaryBrandColor, 96));
        document.documentElement.style.setProperty('--brand-quaternary-text', getReadableForeground(quaternaryBrandColor));
        document.documentElement.style.setProperty('--chart-4', hslQuaternary);
      } else {
        document.documentElement.style.removeProperty('--brand-quaternary');
        document.documentElement.style.removeProperty('--brand-quaternary-hsl');
        document.documentElement.style.removeProperty('--brand-quaternary-tint');
        document.documentElement.style.removeProperty('--brand-quaternary-text');
      }
      
      // Use fifth color if available, otherwise create complementary
      const fifthColor = brandColors[4];
      if (fifthColor) {
        document.documentElement.style.setProperty('--chart-5', hexToHSL(fifthColor));
      }
      
      // Calculate contrasting foreground color (white for dark colors, dark for light colors)
      const l = parseInt(hslColor.split(' ')[2]);
      const foreground = l < 50 ? '0 0% 100%' : '240 10% 3.9%';
      document.documentElement.style.setProperty('--primary-foreground', foreground);
      document.documentElement.style.setProperty('--sidebar-primary-foreground', foreground);
    } else {
      // Remove overrides when branding is inactive
      brandCssVars.forEach(v => document.documentElement.style.removeProperty(v));
    }

    return () => {
      brandCssVars.forEach(v => document.documentElement.style.removeProperty(v));
    };
  }, [isAuthenticated, primaryBrandColor, secondaryBrandColor, tertiaryBrandColor, quaternaryBrandColor, brandColors, location]);

  // Provide brand colors via context so components can access them reliably
  const contextValue: BrandingContextType = {
    brandColors: brandColors,
    brandingActive: isAuthenticated && brandColors.length > 0,
  };

  return (
    <BrandingContext.Provider value={contextValue}>
      <PermissionSyncManager isAuthenticated={isAuthenticated} />
      {children}
    </BrandingContext.Provider>
  );
}

function GlobalRefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries();
      window.location.reload();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="fixed top-2 right-16 z-[9999]"
      data-testid="button-global-refresh"
      aria-label="Refresh page"
      title="Refresh page"
    >
      <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
    </Button>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <AuthPortalProvider>
            <BrandingProvider>
              <Router />
              <Toaster />
            </BrandingProvider>
          </AuthPortalProvider>
        </ErrorBoundary>
        <GlobalRefreshButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
