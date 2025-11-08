import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import ResidentDashboard from "@/pages/ResidentDashboard";
import TechDashboard from "@/pages/TechDashboard";
import ManagementDashboard from "@/pages/ManagementDashboard";
import ComplaintDetail from "@/pages/ComplaintDetail";
import WorkSessionHistory from "@/pages/WorkSessionHistory";
import ProjectDetail from "@/pages/ProjectDetail";
import Profile from "@/pages/Profile";
import HarnessInspectionForm from "@/pages/HarnessInspectionForm";
import NotFound from "@/pages/not-found";
import ProtectedRoute from "@/components/ProtectedRoute";

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
      <Route path="/tech">
        <ProtectedRoute allowedRoles={["rope_access_tech"]}>
          <TechDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/management">
        <ProtectedRoute allowedRoles={["company", "operations_manager", "supervisor"]}>
          <ManagementDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/complaints/:id">
        <ProtectedRoute allowedRoles={["company", "operations_manager", "supervisor", "rope_access_tech"]}>
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
