import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
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
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLocation } from "wouter";
import type { Project } from "@shared/schema";

const projectSchema = z.object({
  strataPlanNumber: z.string().min(1, "Strata plan number is required"),
  jobType: z.enum(["window_cleaning", "dryer_vent_cleaning", "pressure_washing"]),
  totalDrops: z.string().min(1, "Total drops is required"),
  dailyDropTarget: z.string().min(1, "Daily drop target is required"),
  floorCount: z.string().min(1, "Floor count is required"),
});

const employeeSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["operations_manager", "supervisor", "rope_access_tech"]),
  techLevel: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;
type EmployeeFormData = z.infer<typeof employeeSchema>;

export default function ManagementDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetailDialog, setShowProjectDetailDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
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

  const projects = projectsData?.projects || [];
  const employees = employeesData?.employees || [];

  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      strataPlanNumber: "",
      jobType: "window_cleaning",
      totalDrops: "",
      dailyDropTarget: "",
      floorCount: "",
    },
  });

  const employeeForm = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "rope_access_tech",
      techLevel: "",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          totalDrops: parseInt(data.totalDrops),
          dailyDropTarget: parseInt(data.dailyDropTarget),
          floorCount: parseInt(data.floorCount),
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
    createProjectMutation.mutate(data);
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
          <h1 className="text-lg font-bold">Management</h1>
          <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-logout" onClick={handleLogout}>
            <span className="material-icons">logout</span>
          </Button>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="projects" data-testid="tab-projects">
              <span className="material-icons text-sm mr-2">apartment</span>
              Projects
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

                        <Button type="submit" className="w-full h-12" data-testid="button-submit-project">
                          Create Project
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
                      const progressPercent = (completedDrops / project.totalDrops) * 100;

                      return (
                        <Card 
                          key={project.id} 
                          className="hover-elevate active-elevate-2 cursor-pointer" 
                          data-testid={`project-card-${project.id}`}
                          onClick={() => {
                            setSelectedProject(project);
                            setShowProjectDetailDialog(true);
                          }}
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
                                <span>{completedDrops} / {project.totalDrops} drops</span>
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
                        <Card key={project.id} className="opacity-75" data-testid={`completed-project-${project.id}`}>
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
                              <FormLabel>Tech Level</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12" data-testid="select-tech-level">
                                    <SelectValue placeholder="Select level" />
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

      {/* Project Detail Dialog */}
      <Dialog open={showProjectDetailDialog} onOpenChange={setShowProjectDetailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              {selectedProject && (
                <>{selectedProject.strataPlanNumber} - {selectedProject.jobType.replace(/_/g, ' ')}</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Floors</div>
                  <div className="font-bold">{selectedProject.floorCount}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Daily Target</div>
                  <div className="font-bold">{selectedProject.dailyDropTarget} drops</div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-bold">
                    {Math.round(((selectedProject.completedDrops || 0) / selectedProject.totalDrops) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={((selectedProject.completedDrops || 0) / selectedProject.totalDrops) * 100} 
                  className="h-3 mb-2" 
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{selectedProject.completedDrops || 0} / {selectedProject.totalDrops} drops completed</span>
                  <span className="font-medium">{selectedProject.totalDrops - (selectedProject.completedDrops || 0)} remaining</span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Status</div>
                  <Badge variant={selectedProject.status === "active" ? "default" : "secondary"} className="capitalize">
                    {selectedProject.status}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowProjectDetailDialog(false)}
                  className="h-10"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
    </div>
  );
}
