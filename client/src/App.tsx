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
import NotFound from "@/pages/not-found";

function Router() {
  // This will be enhanced with authentication logic in the integration phase
  // For now, routes are accessible for development
  
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/resident" component={ResidentDashboard} />
      <Route path="/tech" component={TechDashboard} />
      <Route path="/management" component={ManagementDashboard} />
      <Route path="/complaints/:id" component={ComplaintDetail} />
      <Route path="/projects/:id/work-sessions" component={WorkSessionHistory} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/profile" component={Profile} />
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
