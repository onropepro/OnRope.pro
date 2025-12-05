import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatLocalDate, formatLocalDateLong } from "@/lib/dateUtils";
import { Loader2, Building2, History, CheckCircle, Clock, AlertCircle, LogOut, Lock, Hash, ArrowLeft } from "lucide-react";

interface BuildingData {
  id: string;
  strataPlanNumber: string;
  buildingName: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  totalUnits: number | null;
  totalProjects: number;
  projectsCompleted: number;
  createdAt: string;
}

interface ProjectHistoryItem {
  id: string;
  jobType: string;
  customJobType: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  companyName: string;
  createdAt: string;
}

interface PortalData {
  building: BuildingData;
  projectHistory: ProjectHistoryItem[];
  stats: {
    totalProjects: number;
    completedProjects: number;
    activeProjects: number;
  };
}

export default function BuildingPortal() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [strataPlanNumber, setStrataPlanNumber] = useState("");
  const [password, setPassword] = useState("");

  const { 
    data: portalData, 
    isLoading: isLoadingPortal, 
    error: portalError,
    isError: hasPortalError,
    refetch: refetchPortal 
  } = useQuery<PortalData>({
    queryKey: ["/api/building/portal"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ strataPlanNumber, password }: { strataPlanNumber: string; password: string }) => {
      const response = await apiRequest("POST", "/api/building/login", { strataPlanNumber, password });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "Welcome to your building portal.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/building/portal"] });
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid strata plan number or password.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!strataPlanNumber.trim() || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both strata plan number and password.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ strataPlanNumber: strataPlanNumber.trim(), password });
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      queryClient.clear();
      setStrataPlanNumber("");
      setPassword("");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      refetchPortal();
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "active":
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const getJobTypeName = (project: ProjectHistoryItem) => {
    if (project.customJobType) return project.customJobType;
    const jobTypeNames: Record<string, string> = {
      window_cleaning: "Window Cleaning",
      facade_inspection: "Facade Inspection",
      painting: "Painting",
      caulking: "Caulking",
      pressure_washing: "Pressure Washing",
      building_maintenance: "Building Maintenance",
      gutter_cleaning: "Gutter Cleaning",
      light_replacement: "Light Replacement",
      signage_installation: "Signage Installation",
      other: "Other",
    };
    return jobTypeNames[project.jobType] || project.jobType;
  };

  const isAuthenticated = !hasPortalError && portalData;
  const needsLogin = hasPortalError || (!isLoadingPortal && !portalData);

  if (isLoadingPortal) {
    return (
      <div className="min-h-screen page-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading building portal...</p>
        </div>
      </div>
    );
  }

  if (needsLogin) {
    return (
      <div className="min-h-screen page-gradient flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mb-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Building Portal</CardTitle>
              <CardDescription>
                Access your building's maintenance history
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strataPlanNumber">Strata Plan Number</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="strataPlanNumber"
                    type="text"
                    placeholder="Enter your strata plan number"
                    value={strataPlanNumber}
                    onChange={(e) => setStrataPlanNumber(e.target.value)}
                    className="pl-10 h-12"
                    autoComplete="username"
                    data-testid="input-strata-number"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  You can enter with or without spaces (e.g., LMS1000 or LMS 1000)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    autoComplete="current-password"
                    data-testid="input-password"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Access Building Portal
                  </>
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Your strata plan number is your username. Contact your property manager if you need assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const building = portalData?.building;
  const projectHistory = portalData?.projectHistory || [];
  const stats = portalData?.stats;

  return (
    <div className="min-h-screen page-gradient p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {building?.buildingName || `Building ${building?.strataPlanNumber}`}
              </h1>
              <p className="text-muted-foreground">
                {building?.address ? `${building.address}, ${building.city || ""} ${building.province || ""}`.trim() : `Strata: ${building?.strataPlanNumber}`}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <History className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalProjects || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.completedProjects || 0}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.activeProjects || 0}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Maintenance History
            </CardTitle>
            <CardDescription>
              All maintenance projects performed at this building across all service providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Maintenance History</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  There are no recorded maintenance projects for this building yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {projectHistory.map((project, index) => (
                  <div key={project.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{getJobTypeName(project)}</span>
                          {getStatusBadge(project.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          by {project.companyName}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground md:text-right">
                        {project.startDate ? (
                          <>
                            <span>{formatLocalDate(project.startDate)}</span>
                            {project.endDate && project.startDate !== project.endDate && (
                              <span> - {formatLocalDate(project.endDate)}</span>
                            )}
                          </>
                        ) : (
                          <span>Created {formatLocalDate(project.createdAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Building Portal - Viewing maintenance history for {building?.strataPlanNumber}</p>
        </div>
      </div>
    </div>
  );
}
