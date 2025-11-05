import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const dropLogSchema = z.object({
  projectId: z.string().min(1, "Please select a project"),
  date: z.string().min(1, "Date is required"),
  dropsCompleted: z.string().min(1, "Number of drops is required"),
});

const endDaySchema = z.object({
  elevation: z.enum(["north", "east", "south", "west"], { required_error: "Please select an elevation" }),
  dropsCompleted: z.string().min(1, "Number of drops is required"),
  shortfallReason: z.string().optional(),
});

type DropLogFormData = z.infer<typeof dropLogSchema>;
type EndDayFormData = z.infer<typeof endDaySchema>;

export default function TechDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showStartDayDialog, setShowStartDayDialog] = useState(false);
  const [showEndDayDialog, setShowEndDayDialog] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
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
  const complaints = complaintsData?.complaints || [];
  const companyName = companyData?.company?.companyName || "";
  
  // Calculate daily progress
  useEffect(() => {
    if (myDropsData?.totalDropsToday) {
      setTodayDrops(myDropsData.totalDropsToday);
    }
  }, [myDropsData]);

  // Get daily target from first project or default to 20
  const dailyTarget = projects[0]?.dailyDropTarget || 20;
  const remainingDrops = Math.max(0, dailyTarget - todayDrops);

  const endDayForm = useForm<EndDayFormData>({
    resolver: zodResolver(endDaySchema),
    defaultValues: {
      elevation: "north",
      dropsCompleted: "",
      shortfallReason: "",
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
      const dropsCompleted = parseInt(data.dropsCompleted);
      
      // Map elevation to the correct field
      const elevationFields = {
        dropsCompletedNorth: data.elevation === "north" ? dropsCompleted : 0,
        dropsCompletedEast: data.elevation === "east" ? dropsCompleted : 0,
        dropsCompletedSouth: data.elevation === "south" ? dropsCompleted : 0,
        dropsCompletedWest: data.elevation === "west" ? dropsCompleted : 0,
      };
      
      return apiRequest("PATCH", `/api/projects/${data.projectId}/work-sessions/${data.sessionId}/end`, {
        ...elevationFields,
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
    if (activeSession) {
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
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Daily Target */}
      <header className="sticky top-0 z-[100] bg-primary text-primary-foreground shadow-md">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-icons text-2xl">construction</span>
            <div>
              {companyName && (
                <div className="text-xs opacity-75 mb-0.5">{companyName}</div>
              )}
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
        {/* Start/End Day Section */}
        <div className="mb-4">
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
                  const totalDrops = project.totalDrops || 0;
                  const progressPercent = totalDrops > 0 ? (completedDrops / totalDrops) * 100 : 0;
                  const remainingProjectDrops = totalDrops - completedDrops;

                  return (
                    <Card
                      key={project.id}
                      className="hover-elevate cursor-pointer"
                      onClick={() => setLocation(`/projects/${project.id}`)}
                      data-testid={`project-card-${project.id}`}
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

                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs text-muted-foreground">
                            Daily Target: {project.dailyDropTarget} drops
                          </div>
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
                name="elevation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Building Elevation</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12" data-testid="select-elevation">
                          <SelectValue placeholder="Select elevation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="north" data-testid="option-north">North</SelectItem>
                        <SelectItem value="east" data-testid="option-east">East</SelectItem>
                        <SelectItem value="south" data-testid="option-south">South</SelectItem>
                        <SelectItem value="west" data-testid="option-west">West</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
