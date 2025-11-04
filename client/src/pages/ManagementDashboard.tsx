import { useState } from "react";
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

const projectSchema = z.object({
  strataPlanNumber: z.string().min(1, "Strata plan number is required"),
  jobType: z.enum(["window_cleaning", "dryer_vent_cleaning", "pressure_washing"]),
  totalDrops: z.string().min(1, "Total drops is required"),
  dailyDropTarget: z.string().min(1, "Daily drop target is required"),
  floorCount: z.string().min(1, "Floor count is required"),
});

const employeeSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["operations_manager", "supervisor", "rope_access_tech"]),
  techLevel: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;
type EmployeeFormData = z.infer<typeof employeeSchema>;

export default function ManagementDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const mockProjects = [
    { id: "1", strataPlanNumber: "LMS2345", jobType: "Window Cleaning", status: "active", totalDrops: 240, completedDrops: 156, floorCount: 24 },
    { id: "2", strataPlanNumber: "LMS6789", jobType: "Pressure Washing", status: "active", totalDrops: 120, completedDrops: 45, floorCount: 12 },
    { id: "3", strataPlanNumber: "LMS1111", jobType: "Dryer Vent Cleaning", status: "completed", totalDrops: 80, completedDrops: 80, floorCount: 8 },
  ];

  const mockEmployees = [
    { id: "1", email: "john@company.com", role: "operations_manager", name: "John Manager" },
    { id: "2", email: "jane@company.com", role: "supervisor", name: "Jane Supervisor" },
    { id: "3", email: "tech1@company.com", role: "rope_access_tech", techLevel: "Level 2", name: "Tech Smith" },
  ];

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
      role: "rope_access_tech",
      techLevel: "",
    },
  });

  const onProjectSubmit = async (data: ProjectFormData) => {
    console.log("Create project:", data);
    setShowProjectDialog(false);
    projectForm.reset();
  };

  const onEmployeeSubmit = async (data: EmployeeFormData) => {
    console.log("Create employee:", data);
    setShowEmployeeDialog(false);
    employeeForm.reset();
  };

  const selectedRole = employeeForm.watch("role");

  const filteredProjects = mockProjects.filter(p => 
    p.strataPlanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.jobType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b border-card-border shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold">Management</h1>
          <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-menu">
            <span className="material-icons">menu</span>
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
                  {filteredProjects.filter(p => p.status === "active").map((project) => (
                    <Card key={project.id} className="hover-elevate active-elevate-2 cursor-pointer" data-testid={`project-card-${project.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-bold">{project.strataPlanNumber}</div>
                            <div className="text-sm text-muted-foreground">{project.jobType.replace('_', ' ')}</div>
                          </div>
                          <Badge variant="secondary">{project.floorCount} Floors</Badge>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{Math.round((project.completedDrops / project.totalDrops) * 100)}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${(project.completedDrops / project.totalDrops) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {project.completedDrops} / {project.totalDrops} drops
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Completed Projects */}
              {filteredProjects.filter(p => p.status === "completed").length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Completed Projects</h3>
                    <div className="space-y-2">
                      {filteredProjects.filter(p => p.status === "completed").map((project) => (
                        <Card key={project.id} className="opacity-75" data-testid={`completed-project-${project.id}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-bold">{project.strataPlanNumber}</div>
                                <div className="text-sm text-muted-foreground">{project.jobType.replace('_', ' ')}</div>
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
                      A temporary password will be sent to their email
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
                {mockEmployees.map((employee) => (
                  <Card key={employee.id} data-testid={`employee-card-${employee.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                          {employee.techLevel && (
                            <div className="text-xs text-muted-foreground mt-1">{employee.techLevel}</div>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {employee.role.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
