import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const dropLogSchema = z.object({
  projectId: z.string().min(1, "Please select a project"),
  date: z.string().min(1, "Date is required"),
  dropsCompleted: z.string().min(1, "Number of drops is required"),
});

type DropLogFormData = z.infer<typeof dropLogSchema>;

export default function TechDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showDropDialog, setShowDropDialog] = useState(false);
  const [todayDrops, setTodayDrops] = useState(0);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch projects
  const { data: projectsData } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Fetch complaints
  const { data: complaintsData } = useQuery({
    queryKey: ["/api/complaints"],
  });

  // Fetch today's drops for daily target
  const { data: myDropsData } = useQuery({
    queryKey: ["/api/my-drops-today"],
  });

  const projects = projectsData?.projects || [];
  const complaints = complaintsData?.complaints || [];
  
  // Calculate daily progress
  useEffect(() => {
    if (myDropsData?.totalDropsToday) {
      setTodayDrops(myDropsData.totalDropsToday);
    }
  }, [myDropsData]);

  // Get daily target from first project or default to 20
  const dailyTarget = projects[0]?.dailyDropTarget || 20;
  const remainingDrops = Math.max(0, dailyTarget - todayDrops);

  const form = useForm<DropLogFormData>({
    resolver: zodResolver(dropLogSchema),
    defaultValues: {
      projectId: "",
      date: new Date().toISOString().split('T')[0],
      dropsCompleted: "",
    },
  });

  // Auto-fill project when dialog opens
  useEffect(() => {
    if (selectedProject) {
      form.setValue("projectId", selectedProject.id);
    }
  }, [selectedProject, form]);

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
      form.reset({
        projectId: "",
        date: new Date().toISOString().split('T')[0],
        dropsCompleted: "",
      });
      setShowDropDialog(false);
      setSelectedProject(null);
      toast({ title: "Drops logged successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = async (data: DropLogFormData) => {
    logDropsMutation.mutate(data);
  };

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

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setShowDropDialog(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Daily Target */}
      <header className="sticky top-0 z-[100] bg-primary text-primary-foreground shadow-md">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-icons text-2xl">construction</span>
            <div>
              <div className="text-xs opacity-90">Remaining Today</div>
              <div className="text-lg font-bold">{remainingDrops} / {dailyTarget} Drops</div>
              <Progress value={(todayDrops / dailyTarget) * 100} className="h-1 mt-1 w-32" />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-primary-foreground min-w-11 min-h-11" data-testid="button-logout" onClick={handleLogout}>
            <span className="material-icons">logout</span>
          </Button>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="projects" data-testid="tab-projects">
              <span className="material-icons text-sm mr-2">apartment</span>
              Projects
            </TabsTrigger>
            <TabsTrigger value="complaints" data-testid="tab-complaints">
              <span className="material-icons text-sm mr-2">feedback</span>
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="space-y-4">
              {projects.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <span className="material-icons text-4xl mb-2 opacity-50">apartment</span>
                    <div>No projects available</div>
                  </CardContent>
                </Card>
              ) : (
                projects.map((project: any) => {
                  const completedDrops = project.completedDrops || 0;
                  const progressPercent = (completedDrops / project.totalDrops) * 100;
                  const remainingProjectDrops = project.totalDrops - completedDrops;

                  return (
                    <Card
                      key={project.id}
                      className="hover-elevate active-elevate-2 cursor-pointer"
                      data-testid={`project-card-${project.id}`}
                      onClick={() => handleProjectClick(project)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-bold text-base">{project.strataPlanNumber}</div>
                            <div className="text-sm text-muted-foreground capitalize mt-1">
                              {project.jobType.replace(/_/g, ' ')}
                            </div>
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
                            <span className="font-medium">{remainingProjectDrops} remaining</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Daily Target: {project.dailyDropTarget} drops
                          </div>
                          <Button size="sm" variant="default" onClick={(e) => {
                            e.stopPropagation();
                            handleProjectClick(project);
                          }}>
                            <span className="material-icons text-sm mr-1">add_circle</span>
                            Add Drops
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="complaints">
            <div className="space-y-4">
              {complaints.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <span className="material-icons text-4xl mb-2 opacity-50">feedback</span>
                    <div>No feedback yet</div>
                  </CardContent>
                </Card>
              ) : (
                complaints.map((complaint: any) => (
                  <Card
                    key={complaint.id}
                    className="hover-elevate active-elevate-2 cursor-pointer"
                    data-testid={`complaint-card-${complaint.id}`}
                    onClick={() => window.location.href = `/complaints/${complaint.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{complaint.residentName}</div>
                          <div className="text-xs text-muted-foreground">Unit {complaint.unitNumber}</div>
                        </div>
                        <Badge variant={complaint.status === "open" ? "default" : "secondary"} className="text-xs">
                          {complaint.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {complaint.message}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Drop Logging Dialog */}
      <Dialog open={showDropDialog} onOpenChange={setShowDropDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Drops</DialogTitle>
            <DialogDescription>
              {selectedProject && (
                <>Record drops for {selectedProject.strataPlanNumber}</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="mb-4">
              <HighRiseBuilding
                floors={selectedProject.floorCount}
                completedDrops={selectedProject.completedDrops || 0}
                totalDrops={selectedProject.totalDrops}
                className="mb-4"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold">{selectedProject.dailyDropTarget}</div>
                  <div className="text-xs text-muted-foreground mt-1">Daily Target</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold">
                    {selectedProject.completedDrops && selectedProject.completedDrops > 0 
                      ? Math.ceil((selectedProject.totalDrops - selectedProject.completedDrops) / selectedProject.dailyDropTarget) 
                      : "N/A"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Days Remaining</div>
                </div>
              </div>
              <Separator className="my-4" />
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-date" className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dropsCompleted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drops Completed</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        placeholder="0" 
                        {...field} 
                        data-testid="input-drops" 
                        className="h-12 text-2xl font-bold text-center" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => {
                    setShowDropDialog(false);
                    setSelectedProject(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-12" 
                  data-testid="button-submit-drops"
                  disabled={logDropsMutation.isPending}
                >
                  <span className="material-icons mr-2">check_circle</span>
                  {logDropsMutation.isPending ? "Logging..." : "Log Drops"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
