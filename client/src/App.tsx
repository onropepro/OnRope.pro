import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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
import NotFound from "@/pages/not-found";
import ProtectedRoute from "@/components/ProtectedRoute";
import { EMPLOYEE_ROLES } from "@/lib/permissions";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white text-center py-0.5 text-[10px] font-medium leading-tight">
          Free Beta Access - Subscription Service Coming Soon - Do Not Distribute
        </div>
        <div className="pt-4">
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
