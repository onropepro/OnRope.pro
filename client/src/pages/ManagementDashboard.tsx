import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLocation } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@shared/schema";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const projectSchema = z.object({
  strataPlanNumber: z.string().min(1, "Strata plan number is required"),
  buildingName: z.string().min(1, "Building name is required"),
  buildingAddress: z.string().optional(),
  jobType: z.enum(["window_cleaning", "dryer_vent_cleaning", "pressure_washing"]),
  totalDrops: z.string().min(1, "Total drops is required"),
  dailyDropTarget: z.string().min(1, "Daily drop target is required"),
  floorCount: z.string().min(1, "Floor count is required"),
  targetCompletionDate: z.string().optional(),
  ropeAccessPlan: z.any().optional(),
});

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["operations_manager", "supervisor", "rope_access_tech"]),
  techLevel: z.string().optional(),
}).refine((data) => {
  if (data.role === "rope_access_tech" && !data.techLevel) {
    return false;
  }
  return true;
}, {
  message: "IRATA level is required for rope access technicians",
  path: ["techLevel"],
});

const dropLogSchema = z.object({
  projectId: z.string().min(1, "Please select a project"),
  date: z.string().min(1, "Date is required"),
  dropsCompleted: z.string().min(1, "Number of drops is required"),
});

const endDaySchema = z.object({
  dropsCompleted: z.string().min(1, "Number of drops is required"),
  shortfallReason: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;
type EmployeeFormData = z.infer<typeof employeeSchema>;
type DropLogFormData = z.infer<typeof dropLogSchema>;
type EndDayFormData = z.infer<typeof endDaySchema>;

export default function ManagementDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [showDropDialog, setShowDropDialog] = useState(false);
  const [dropProject, setDropProject] = useState<any>(null);
  const [showStartDayDialog, setShowStartDayDialog] = useState(false);
  const [showEndDayDialog, setShowEndDayDialog] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [uploadedPlanFile, setUploadedPlanFile] = useState<File | null>(null);
  const [isUploadingPlan, setIsUploadingPlan] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch projects
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Fetch employees
  const { data: employeesData, isLoading: employeesLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  // Fetch today's drops for daily target
  const { data: myDropsData } = useQuery({
    queryKey: ["/api/my-drops-today"],
  });

  // Fetch current user to get company info
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  // Fetch company information
  const { data: companyData } = useQuery({
    queryKey: ["/api/companies", userData?.user?.companyId],
    enabled: !!userData?.user?.companyId,
  });

  const projects = projectsData?.projects || [];

  // Fetch all work sessions across all projects for pie chart
  const { data: allWorkSessionsData } = useQuery({
    queryKey: ["/api/all-work-sessions"],
    enabled: projects.length > 0,
  });
  const employees = employeesData?.employees || [];
  const todayDrops = myDropsData?.totalDropsToday || 0;
  const dailyTarget = projects[0]?.dailyDropTarget || 20;
  const companyName = companyData?.company?.companyName || "";

  // Calculate overall target met statistics across all projects
  const allWorkSessions = allWorkSessionsData?.sessions || [];
  const completedSessions = allWorkSessions.filter((s: any) => s.endTime !== null);
  const targetMetCount = completedSessions.filter((s: any) => s.dropsCompleted >= s.dailyDropTarget).length;
  const belowTargetCount = completedSessions.filter((s: any) => s.dropsCompleted < s.dailyDropTarget).length;
  
  const performancePieData = [
    { name: "Target Met", value: targetMetCount, color: "hsl(var(--primary))" },
    { name: "Below Target", value: belowTargetCount, color: "hsl(var(--destructive))" },
  ];

  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      strataPlanNumber: "",
      buildingName: "",
      buildingAddress: "",
      jobType: "window_cleaning",
      totalDrops: "",
      dailyDropTarget: "",
      floorCount: "",
      targetCompletionDate: "",
    },
  });

  const employeeForm = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "rope_access_tech",
      techLevel: "",
    },
  });

  const dropForm = useForm<DropLogFormData>({
    resolver: zodResolver(dropLogSchema),
    defaultValues: {
      projectId: "",
      date: new Date().toISOString().split('T')[0],
      dropsCompleted: "",
    },
  });

  const endDayForm = useForm<EndDayFormData>({
    resolver: zodResolver(endDaySchema),
    defaultValues: {
      dropsCompleted: "",
      shortfallReason: "",
    },
  });

  // Check for active session on component mount - only run once
  useEffect(() => {
    const checkActiveSession = async () => {
      if (projects.length > 0 && !activeSession) {
        try {
          // Check all projects for an active session
          for (const project of projects) {
            try {
              const response = await fetch(`/api/projects/${project.id}/my-work-sessions`, {
                credentials: "include",
                cache: "no-store", // Force fresh data
              });
              if (response.ok) {
                const data = await response.json();
                const active = data.sessions?.find((s: any) => !s.endTime);
                if (active) {
                  setActiveSession(active);
                  setSelectedProject(project);
                  return; // Found active session, stop searching
                }
              }
            } catch (fetchError) {
              // Continue to next project if this one fails
              continue;
            }
          }
        } catch (error) {
          console.error("Failed to check active session:", error);
        }
      }
    };
    checkActiveSession();
  }, [projects, activeSession]);

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData & { ropeAccessPlanUrl?: string | null }) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          totalDrops: parseInt(data.totalDrops),
          dailyDropTarget: parseInt(data.dailyDropTarget),
          floorCount: parseInt(data.floorCount),
          ropeAccessPlanUrl: data.ropeAccessPlanUrl || undefined,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create project");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setShowProjectDialog(false);
      projectForm.reset();
      setUploadedPlanFile(null);
      toast({ title: "Project created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create employee");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      setShowEmployeeDialog(false);
      employeeForm.reset();
      toast({
        title: "Employee created successfully",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onProjectSubmit = async (data: ProjectFormData) => {
    let ropeAccessPlanUrl = null;
    
    // Upload PDF if one was selected
    if (uploadedPlanFile) {
      setIsUploadingPlan(true);
      try {
        const formData = new FormData();
        formData.append('file', uploadedPlanFile);
        
        const uploadResponse = await fetch('/api/upload-rope-access-plan', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload fall protection plan');
        }
        
        const uploadResult = await uploadResponse.json();
        ropeAccessPlanUrl = uploadResult.url;
      } catch (error) {
        setIsUploadingPlan(false);
        toast({ 
          title: "Upload failed", 
          description: error instanceof Error ? error.message : "Failed to upload PDF", 
          variant: "destructive" 
        });
        return;
      }
      setIsUploadingPlan(false);
    }
    
    createProjectMutation.mutate({
      ...data,
      ropeAccessPlanUrl,
    });
    setUploadedPlanFile(null);
  };

  const onEmployeeSubmit = async (data: EmployeeFormData) => {
    createEmployeeMutation.mutate(data);
  };

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete employee");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      setEmployeeToDelete(null);
      toast({ title: "Employee deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const logDropsMutation = useMutation({
    mutationFn: async (data: DropLogFormData) => {
      const response = await fetch("/api/drops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: data.projectId,
          date: data.date,
          dropsCompleted: parseInt(data.dropsCompleted),
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to log drops");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-drops-today"] });
      dropForm.reset({
        projectId: "",
        date: new Date().toISOString().split('T')[0],
        dropsCompleted: "",
      });
      setShowDropDialog(false);
      setDropProject(null);
      toast({ title: "Drops logged successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const startDayMutation = useMutation({
    mutationFn: async (projectId: string) => {
      return apiRequest("POST", `/api/projects/${projectId}/work-sessions/start`, {});
    },
    onSuccess: (data) => {
      console.log("Start day response:", data);
      setActiveSession(data.session);
      setShowStartDayDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-drops-today"] });
      toast({ title: "Work session started", description: "Good luck today!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const endDayMutation = useMutation({
    mutationFn: async (data: EndDayFormData & { sessionId: string; projectId: string }) => {
      return apiRequest("PATCH", `/api/projects/${data.projectId}/work-sessions/${data.sessionId}/end`, {
        dropsCompleted: parseInt(data.dropsCompleted),
        shortfallReason: data.shortfallReason,
      });
    },
    onSuccess: () => {
      setActiveSession(null);
      setShowEndDayDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-drops-today"] });
      endDayForm.reset();
      toast({ title: "Work session ended", description: "Great work today!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setLocation("/");
    } catch (error) {
      toast({ title: "Error", description: "Failed to logout", variant: "destructive" });
    }
  };

  const handleStartDay = () => {
    if (projects.length > 0) {
      setSelectedProject(projects[0]);
      setShowStartDayDialog(true);
    }
  };

  const handleEndDay = () => {
    setShowEndDayDialog(true);
  };

  const confirmStartDay = () => {
    if (selectedProject) {
      startDayMutation.mutate(selectedProject.id);
    }
  };

  const onEndDaySubmit = async (data: EndDayFormData) => {
    if (!activeSession) {
      toast({ title: "Error", description: "No active work session found", variant: "destructive" });
      return;
    }
    
    const dropsCompleted = parseInt(data.dropsCompleted);
    
    // Validate shortfall reason is required when drops < target
    if (dropsCompleted < dailyTarget && !data.shortfallReason?.trim()) {
      endDayForm.setError("shortfallReason", {
        message: "Please explain why the daily target wasn't met"
      });
      return;
    }
    
    endDayMutation.mutate({
      ...data,
      sessionId: activeSession.id,
      projectId: activeSession.projectId,
    });
  };

  const selectedRole = employeeForm.watch("role");

  const filteredProjects = projects.filter((p: Project) => 
    p.strataPlanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.jobType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (projectsLoading || employeesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b border-card-border shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Management</h1>
            {companyName && (
              <p className="text-xs text-muted-foreground">{companyName}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-logout" onClick={handleLogout}>
            <span className="material-icons">logout</span>
          </Button>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="projects" data-testid="tab-projects">
              <span className="material-icons text-sm mr-2">apartment</span>
              Projects
            </TabsTrigger>
            <TabsTrigger value="performance" data-testid="tab-performance">
              <span className="material-icons text-sm mr-2">analytics</span>
              Performance
            </TabsTrigger>
            <TabsTrigger value="my-drops" data-testid="tab-my-drops">
              <span className="material-icons text-sm mr-2">checklist</span>
              My Drops
            </TabsTrigger>
            <TabsTrigger value="employees" data-testid="tab-employees">
              <span className="material-icons text-sm mr-2">people</span>
              Employees
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="space-y-4">
              {/* Search and Create */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    search
                  </span>
                  <Input
                    placeholder="Search by strata plan number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-10"
                    data-testid="input-search-projects"
                  />
                </div>
                <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
                  <DialogTrigger asChild>
                    <Button className="h-12 gap-2" data-testid="button-create-project">
                      <span className="material-icons">add</span>
                      <span className="hidden sm:inline">New Project</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                      <DialogDescription>Add a new building maintenance project</DialogDescription>
                    </DialogHeader>
                    <Form {...projectForm}>
                      <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-4">
                        <FormField
                          control={projectForm.control}
                          name="strataPlanNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Strata Plan Number</FormLabel>
                              <FormControl>
                                <Input placeholder="LMS2345" {...field} data-testid="input-strata-plan-number" className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="buildingName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Building Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Harbour View Towers" {...field} data-testid="input-building-name" className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="buildingAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Building Address (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St, Vancouver, BC" {...field} data-testid="input-building-address" className="h-12" />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Visible to all employees
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="jobType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12" data-testid="select-job-type">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="window_cleaning">Window Cleaning</SelectItem>
                                  <SelectItem value="dryer_vent_cleaning">Dryer Vent Cleaning</SelectItem>
                                  <SelectItem value="pressure_washing">Pressure Washing</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="floorCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Floor Count</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} data-testid="input-floor-count" className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="totalDrops"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Drops</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} data-testid="input-total-drops" className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="dailyDropTarget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Daily Drop Target</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} data-testid="input-daily-target" className="h-12" />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Visible to rope access techs
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="targetCompletionDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Completion Date (Optional)</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} data-testid="input-target-date" className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Fall Protection Plan (PDF)</label>
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.type !== 'application/pdf') {
                                  toast({ title: "Invalid file", description: "Please select a PDF file", variant: "destructive" });
                                  e.target.value = '';
                                  return;
                                }
                                setUploadedPlanFile(file);
                              }
                            }}
                            data-testid="input-rope-access-plan"
                            className="h-12"
                          />
                          {uploadedPlanFile && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="material-icons text-base">description</span>
                              <span>{uploadedPlanFile.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-auto"
                                onClick={() => setUploadedPlanFile(null)}
                              >
                                <span className="material-icons text-base">close</span>
                              </Button>
                            </div>
                          )}
                          <FormDescription className="text-xs">
                            Optional: Upload the rope access/fall protection plan PDF
                          </FormDescription>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full h-12" 
                          data-testid="button-submit-project"
                          disabled={isUploadingPlan}
                        >
                          {isUploadingPlan ? "Uploading..." : "Create Project"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Active Projects */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Active Projects</h3>
                <div className="space-y-2">
                  {filteredProjects.filter((p: Project) => p.status === "active").length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center text-muted-foreground">
                        <span className="material-icons text-4xl mb-2 opacity-50">apartment</span>
                        <div>No active projects yet</div>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredProjects.filter((p: Project) => p.status === "active").map((project: Project) => {
                      const completedDrops = project.completedDrops || 0;
                      const totalDrops = project.totalDrops || 0;
                      const progressPercent = totalDrops > 0 ? (completedDrops / totalDrops) * 100 : 0;

                      return (
                        <Card 
                          key={project.id} 
                          className="hover-elevate active-elevate-2 cursor-pointer" 
                          data-testid={`project-card-${project.id}`}
                          onClick={() => setLocation(`/projects/${project.id}`)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="font-bold">{project.strataPlanNumber}</div>
                                <div className="text-sm text-muted-foreground capitalize">{project.jobType.replace(/_/g, ' ')}</div>
                              </div>
                              <Badge variant="secondary">{project.floorCount} Floors</Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-bold">{Math.round(progressPercent)}%</span>
                              </div>
                              <Progress value={progressPercent} className="h-2" />
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{completedDrops} / {totalDrops} drops</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Completed Projects */}
              {filteredProjects.filter((p: Project) => p.status === "completed").length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Completed Projects</h3>
                    <div className="space-y-2">
                      {filteredProjects.filter((p: Project) => p.status === "completed").map((project: Project) => (
                        <Card 
                          key={project.id} 
                          className="opacity-75 hover-elevate active-elevate-2 cursor-pointer" 
                          data-testid={`completed-project-${project.id}`}
                          onClick={() => setLocation(`/projects/${project.id}`)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-bold">{project.strataPlanNumber}</div>
                                <div className="text-sm text-muted-foreground capitalize">{project.jobType.replace(/_/g, ' ')}</div>
                              </div>
                              <Badge variant="default" className="bg-status-closed">Completed</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="space-y-4">
              {completedSessions.length > 0 ? (
                <>
                  {/* Overall Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Overall Target Performance</CardTitle>
                      <CardDescription>Across all projects and work sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={performancePieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value, percent }) => 
                                value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : null
                              }
                              outerRadius={70}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {performancePieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-4 mt-2 w-full max-w-xs">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary" data-testid="performance-target-met">{targetMetCount}</div>
                            <div className="text-xs text-muted-foreground">Target Met</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-destructive" data-testid="performance-below-target">{belowTargetCount}</div>
                            <div className="text-xs text-muted-foreground">Below Target</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Per-Employee Performance */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Performance by Employee</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(() => {
                        // Group sessions by employee
                        const sessionsByEmployee = completedSessions.reduce((acc: any, session: any) => {
                          const employeeName = session.techName || 'Unknown';
                          if (!acc[employeeName]) {
                            acc[employeeName] = [];
                          }
                          acc[employeeName].push(session);
                          return acc;
                        }, {});

                        return Object.entries(sessionsByEmployee).map(([employeeName, sessions]: [string, any]) => {
                          const employeeTargetMet = sessions.filter((s: any) => s.dropsCompleted >= s.dailyDropTarget).length;
                          const employeeBelowTarget = sessions.filter((s: any) => s.dropsCompleted < s.dailyDropTarget).length;
                          
                          const employeePieData = [
                            { name: "Target Met", value: employeeTargetMet, color: "hsl(var(--primary))" },
                            { name: "Below Target", value: employeeBelowTarget, color: "hsl(var(--destructive))" },
                          ];

                          return (
                            <Card key={employeeName}>
                              <CardHeader>
                                <CardTitle className="text-base">{employeeName}</CardTitle>
                                <CardDescription className="text-xs">{sessions.length} work session{sessions.length !== 1 ? 's' : ''}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-col items-center">
                                  <ResponsiveContainer width="100%" height={180}>
                                    <PieChart>
                                      <Pie
                                        data={employeePieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value, percent }) => 
                                          value > 0 ? `${value} (${(percent * 100).toFixed(0)}%)` : null
                                        }
                                        outerRadius={50}
                                        fill="#8884d8"
                                        dataKey="value"
                                      >
                                        {employeePieData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                      </Pie>
                                      <Tooltip />
                                    </PieChart>
                                  </ResponsiveContainer>
                                  <div className="grid grid-cols-2 gap-2 mt-2 w-full text-center">
                                    <div>
                                      <div className="text-lg font-bold text-primary">{employeeTargetMet}</div>
                                      <div className="text-xs text-muted-foreground">Met</div>
                                    </div>
                                    <div>
                                      <div className="text-lg font-bold text-destructive">{employeeBelowTarget}</div>
                                      <div className="text-xs text-muted-foreground">Below</div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <span className="material-icons text-4xl mb-2 opacity-50">analytics</span>
                    <div>No completed work sessions yet</div>
                    <div className="text-sm mt-1">Performance data will appear after completing work sessions</div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-drops">
            <div className="space-y-4">
              {/* Start/End Day Section */}
              <div>
                {!activeSession ? (
                  <Button
                    onClick={handleStartDay}
                    className="w-full h-14 text-lg font-bold"
                    data-testid="button-start-day"
                    disabled={projects.length === 0}
                  >
                    <span className="material-icons mr-2">play_circle</span>
                    Start Day
                  </Button>
                ) : (
                  <Button
                    onClick={handleEndDay}
                    variant="destructive"
                    className="w-full h-14 text-lg font-bold"
                    data-testid="button-end-day"
                  >
                    <span className="material-icons mr-2">stop_circle</span>
                    End Day
                  </Button>
                )}
              </div>

              {/* Daily Progress Card */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Today's Progress</CardTitle>
                    <Badge variant="secondary" className="text-lg px-3">
                      {todayDrops} / {dailyTarget}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={(todayDrops / dailyTarget) * 100} className="h-3 mb-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Remaining today</span>
                    <span className="font-medium">{Math.max(0, dailyTarget - todayDrops)} drops</span>
                  </div>
                </CardContent>
              </Card>

              {/* Overall Target Performance Chart */}
              {completedSessions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Target Performance</CardTitle>
                    <CardDescription>Across all projects and work sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={performancePieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) => 
                              value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : null
                            }
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {performancePieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="grid grid-cols-2 gap-4 mt-2 w-full max-w-xs">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{targetMetCount}</div>
                          <div className="text-xs text-muted-foreground">Target Met</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-destructive">{belowTargetCount}</div>
                          <div className="text-xs text-muted-foreground">Below Target</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Projects List */}
              {projects.length === 0 ? (
                <Card className="text-center shadow-lg">
                  <CardContent className="pt-12 pb-8">
                    <span className="material-icons text-7xl text-muted-foreground mb-4">apartment</span>
                    <h3 className="text-xl font-bold mb-2">No Active Projects</h3>
                    <p className="text-muted-foreground">
                      No projects available for drop logging yet
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Projects</h3>
                    <span className="text-xs text-muted-foreground">{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
                  </div>
                  {projects.map((project: Project) => {
                    const progressPercentage = project.totalDrops > 0 
                      ? Math.round((project.completedDrops / project.totalDrops) * 100)
                      : 0;

                    return (
                      <Card key={project.id} className="hover-elevate">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base truncate" data-testid={`text-project-${project.id}`}>
                                {project.strataPlanNumber}
                              </CardTitle>
                              <CardDescription className="capitalize">
                                {project.jobType.replace(/_/g, ' ')}
                              </CardDescription>
                            </div>
                            <Button
                              size="sm"
                              className="gap-2 shrink-0"
                              onClick={() => {
                                setDropProject(project);
                                dropForm.setValue("projectId", project.id);
                                setShowDropDialog(true);
                              }}
                              data-testid={`button-log-drops-${project.id}`}
                            >
                              <span className="material-icons text-sm">add</span>
                              Log Drops
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{progressPercentage}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="material-icons text-sm text-muted-foreground">check_circle</span>
                              <div>
                                <div className="font-medium">{project.completedDrops}</div>
                                <div className="text-xs text-muted-foreground">Completed</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="material-icons text-sm text-muted-foreground">pending</span>
                              <div>
                                <div className="font-medium">{project.totalDrops - project.completedDrops}</div>
                                <div className="text-xs text-muted-foreground">Remaining</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Drop Logging Dialog */}
            <Dialog open={showDropDialog} onOpenChange={setShowDropDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Log Daily Drops</DialogTitle>
                  <DialogDescription>
                    Record completed drops for {dropProject?.strataPlanNumber || 'this project'}
                  </DialogDescription>
                </DialogHeader>
                <Form {...dropForm}>
                  <form onSubmit={dropForm.handleSubmit((data) => logDropsMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={dropForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-drop-date" className="h-12" />
                          </FormControl>
                          <FormDescription className="text-xs">
                            You can log drops for any past date
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={dropForm.control}
                      name="dropsCompleted"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Drops Completed</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              placeholder="Enter number of drops" 
                              {...field} 
                              data-testid="input-drops-completed" 
                              className="h-12" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowDropDialog(false);
                          setDropProject(null);
                          dropForm.reset();
                        }}
                        className="flex-1 h-12"
                        data-testid="button-cancel-drop"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 h-12"
                        disabled={logDropsMutation.isPending}
                        data-testid="button-submit-drop"
                      >
                        {logDropsMutation.isPending ? "Logging..." : "Log Drops"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="employees">
            <div className="space-y-4">
              {/* Create Employee Button */}
              <Dialog open={showEmployeeDialog} onOpenChange={setShowEmployeeDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full h-12 gap-2" data-testid="button-create-employee">
                    <span className="material-icons">person_add</span>
                    Add New Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Employee Account</DialogTitle>
                    <DialogDescription>
                      Enter login credentials for the new employee
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...employeeForm}>
                    <form onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)} className="space-y-4">
                      <FormField
                        control={employeeForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} data-testid="input-employee-name" className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={employeeForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="employee@company.com" {...field} data-testid="input-employee-email" className="h-12" />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Will be used as username
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={employeeForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temporary Password</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="Enter temporary password" {...field} data-testid="input-employee-password" className="h-12" />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Give this password to the employee
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={employeeForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12" data-testid="select-employee-role">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="operations_manager">Operations Manager</SelectItem>
                                <SelectItem value="supervisor">Supervisor</SelectItem>
                                <SelectItem value="rope_access_tech">Rope Access Technician</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {selectedRole === "rope_access_tech" && (
                        <FormField
                          control={employeeForm.control}
                          name="techLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>IRATA Level</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12" data-testid="select-tech-level">
                                    <SelectValue placeholder="Select IRATA level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Level 1">Level 1</SelectItem>
                                  <SelectItem value="Level 2">Level 2</SelectItem>
                                  <SelectItem value="Level 3">Level 3</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <Button type="submit" className="w-full h-12" data-testid="button-submit-employee">
                        Create Employee
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Employee List */}
              <div className="space-y-2">
                {employees.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      <span className="material-icons text-4xl mb-2 opacity-50">people</span>
                      <div>No employees yet</div>
                    </CardContent>
                  </Card>
                ) : (
                  employees.map((employee: any) => (
                    <Card key={employee.id} data-testid={`employee-card-${employee.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="font-medium">{employee.email}</div>
                            {employee.techLevel && (
                              <div className="text-xs text-muted-foreground mt-1">{employee.techLevel}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs capitalize">
                              {employee.role.replace(/_/g, ' ')}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEmployeeToDelete(employee.id)}
                              data-testid={`button-delete-employee-${employee.id}`}
                              className="h-9 w-9 text-destructive hover:text-destructive"
                            >
                              <span className="material-icons text-sm">delete</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Employee Confirmation Dialog */}
      <AlertDialog open={employeeToDelete !== null} onOpenChange={(open) => !open && setEmployeeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => employeeToDelete && deleteEmployeeMutation.mutate(employeeToDelete)}
              data-testid="button-confirm-delete"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Start Day Confirmation Dialog */}
      <AlertDialog open={showStartDayDialog} onOpenChange={setShowStartDayDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Your Work Day?</AlertDialogTitle>
            <AlertDialogDescription>
              This will begin tracking your work session for today. You can log drops throughout the day and end your session when finished.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-start-day">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStartDay}
              data-testid="button-confirm-start-day"
              disabled={startDayMutation.isPending}
            >
              {startDayMutation.isPending ? "Starting..." : "Start Day"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Day Dialog with Drop Count */}
      <Dialog open={showEndDayDialog} onOpenChange={setShowEndDayDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>End Your Work Day</DialogTitle>
            <DialogDescription>
              Enter the total number of drops you completed today.
            </DialogDescription>
          </DialogHeader>

          <Form {...endDayForm}>
            <form onSubmit={endDayForm.handleSubmit(onEndDaySubmit)} className="space-y-4">
              <FormField
                control={endDayForm.control}
                name="dropsCompleted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drops Completed Today</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        data-testid="input-end-day-drops"
                        className="h-14 text-3xl font-bold text-center"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {activeSession && 
                endDayForm.watch("dropsCompleted") !== "" && 
                parseInt(endDayForm.watch("dropsCompleted")) < dailyTarget && (
                <FormField
                  control={endDayForm.control}
                  name="shortfallReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shortfall Reason (Required)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain why the daily target wasn't met..."
                          {...field}
                          data-testid="input-shortfall-reason"
                          className="min-h-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => {
                    setShowEndDayDialog(false);
                    endDayForm.reset();
                  }}
                  data-testid="button-cancel-end-day"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="flex-1 h-12"
                  data-testid="button-confirm-end-day"
                  disabled={endDayMutation.isPending}
                >
                  <span className="material-icons mr-2">stop_circle</span>
                  {endDayMutation.isPending ? "Ending..." : "End Day"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
