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
  dropsCompletedNorth: z.string().default("0"),
  dropsCompletedEast: z.string().default("0"),
  dropsCompletedSouth: z.string().default("0"),
  dropsCompletedWest: z.string().default("0"),
  shortfallReason: z.string().optional(),
});

type DropLogFormData = z.infer<typeof dropLogSchema>;
type EndDayFormData = z.infer<typeof endDaySchema>;

export default function TechDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showStartDayDialog, setShowStartDayDialog] = useState(false);
  const [showEndDayDialog, setShowEndDayDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showExceedsWarningDialog, setShowExceedsWarningDialog] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [todayDrops, setTodayDrops] = useState(0);
  const [uploadingPdfForProject, setUploadingPdfForProject] = useState<string | null>(null);
  const [pendingEndDayData, setPendingEndDayData] = useState<EndDayFormData | null>(null);
  const [exceedsWarnings, setExceedsWarnings] = useState<string[]>([]);
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

  // Fetch all photos to check for missed units
  const inSuiteDryerVentProjects = (projectsData?.projects || []).filter(
    (p: any) => p.jobType === 'in_suite_dryer_vent_cleaning' && p.status === 'active'
  );
  
  const { data: allPhotosData } = useQuery({
    queryKey: ["/api/all-project-photos", inSuiteDryerVentProjects.map((p: any) => p.id)],
    enabled: inSuiteDryerVentProjects.length > 0,
    queryFn: async () => {
      const photosPromises = inSuiteDryerVentProjects.map(async (project: any) => {
        const data = await apiRequest("GET", `/api/projects/${project.id}/photos`);
        return (data.photos || []).map((photo: any) => ({ 
          ...photo, 
          projectId: project.id, 
          projectStrataPlanNumber: project.strataPlanNumber 
        }));
      });
      const results = await Promise.all(photosPromises);
      return results.flat();
    }
  });

  const projects = projectsData?.projects || [];
  const complaints = complaintsData?.complaints || [];
  const allPhotos = allPhotosData || [];
  const missedUnitPhotos = allPhotos.filter((photo: any) => photo.isMissedUnit);
  const companyName = companyData?.company?.companyName || "";
  
  // Calculate daily progress
  useEffect(() => {
    if (myDropsData?.totalDropsToday) {
      setTodayDrops(myDropsData.totalDropsToday);
    }
  }, [myDropsData]);

  // Get daily target from active session's project or default to 20
  const dailyTarget = (activeSession && selectedProject) ? selectedProject.dailyDropTarget : (projects[0]?.dailyDropTarget || 20);
  const remainingDrops = Math.max(0, dailyTarget - todayDrops);

  const endDayForm = useForm<EndDayFormData>({
    resolver: zodResolver(endDaySchema),
    defaultValues: {
      dropsCompletedNorth: "",
      dropsCompletedEast: "",
      dropsCompletedSouth: "",
      dropsCompletedWest: "",
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
      const dropsCompletedNorth = parseInt(data.dropsCompletedNorth) || 0;
      const dropsCompletedEast = parseInt(data.dropsCompletedEast) || 0;
      const dropsCompletedSouth = parseInt(data.dropsCompletedSouth) || 0;
      const dropsCompletedWest = parseInt(data.dropsCompletedWest) || 0;
      
      return apiRequest("PATCH", `/api/projects/${data.projectId}/work-sessions/${data.sessionId}/end`, {
        dropsCompletedNorth,
        dropsCompletedEast,
        dropsCompletedSouth,
        dropsCompletedWest,
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

  const confirmLogout = async () => {
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

  const handleStartDay = (project?: any) => {
    if (project) {
      setSelectedProject(project);
    } else if (projects.length > 0) {
      setSelectedProject(projects[0]);
    }
    setShowStartDayDialog(true);
  };

  const handleEndDay = () => {
    setShowEndDayDialog(true);
  };

  const handlePdfUpload = async (projectId: string, file: File) => {
    setUploadingPdfForProject(projectId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`/api/projects/${projectId}/rope-access-plan`, {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload PDF');
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "PDF uploaded successfully" });
    } catch (error) {
      toast({ 
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "Failed to upload PDF", 
        variant: "destructive" 
      });
    } finally {
      setUploadingPdfForProject(null);
    }
  };

  const confirmStartDay = () => {
    if (selectedProject) {
      startDayMutation.mutate(selectedProject.id);
    }
  };

  const onEndDaySubmit = async (data: EndDayFormData) => {
    if (activeSession && selectedProject) {
      const totalDrops = (
        parseInt(data.dropsCompletedNorth) || 0) +
        (parseInt(data.dropsCompletedEast) || 0) +
        (parseInt(data.dropsCompletedSouth) || 0) +
        (parseInt(data.dropsCompletedWest) || 0
      );
      
      // Validate shortfall reason is required when drops < target
      if (totalDrops < dailyTarget && !data.shortfallReason?.trim()) {
        endDayForm.setError("shortfallReason", {
          message: "Please explain why the daily target wasn't met"
        });
        return;
      }
      
      // Check if any entered drops exceed remaining drops per elevation
      const warnings: string[] = [];
      const dropsNorth = parseInt(data.dropsCompletedNorth) || 0;
      const dropsEast = parseInt(data.dropsCompletedEast) || 0;
      const dropsSouth = parseInt(data.dropsCompletedSouth) || 0;
      const dropsWest = parseInt(data.dropsCompletedWest) || 0;
      
      const remainingNorth = (selectedProject.totalDropsNorth || 0) - (selectedProject.completedDropsNorth || 0);
      const remainingEast = (selectedProject.totalDropsEast || 0) - (selectedProject.completedDropsEast || 0);
      const remainingSouth = (selectedProject.totalDropsSouth || 0) - (selectedProject.completedDropsSouth || 0);
      const remainingWest = (selectedProject.totalDropsWest || 0) - (selectedProject.completedDropsWest || 0);
      
      if (dropsNorth > remainingNorth) {
        warnings.push(`North: ${dropsNorth} drops entered, but only ${remainingNorth} remaining`);
      }
      if (dropsEast > remainingEast) {
        warnings.push(`East: ${dropsEast} drops entered, but only ${remainingEast} remaining`);
      }
      if (dropsSouth > remainingSouth) {
        warnings.push(`South: ${dropsSouth} drops entered, but only ${remainingSouth} remaining`);
      }
      if (dropsWest > remainingWest) {
        warnings.push(`West: ${dropsWest} drops entered, but only ${remainingWest} remaining`);
      }
      
      // If there are warnings, show the warning dialog
      if (warnings.length > 0) {
        setPendingEndDayData(data);
        setExceedsWarnings(warnings);
        setShowExceedsWarningDialog(true);
        return;
      }
      
      // No warnings, proceed with ending the day
      endDayMutation.mutate({
        ...data,
        sessionId: activeSession.id,
        projectId: activeSession.projectId,
      });
    }
  };
  
  const proceedWithEndDay = () => {
    if (pendingEndDayData && activeSession) {
      setShowExceedsWarningDialog(false);
      endDayMutation.mutate({
        ...pendingEndDayData,
        sessionId: activeSession.id,
        projectId: activeSession.projectId,
      });
      setPendingEndDayData(null);
      setExceedsWarnings([]);
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-primary-foreground min-w-11 min-h-11" data-testid="button-profile" onClick={() => setLocation("/profile")}>
              <span className="material-icons">person</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground min-w-11 min-h-11" data-testid="button-logout" onClick={() => setShowLogoutDialog(true)}>
              <span className="material-icons">logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Safety Inspection Section */}
        <div className="mb-4">
          <Button
            onClick={() => setLocation("/harness-inspection")}
            variant="outline"
            className="w-full h-12 mb-2 border-primary/20 hover-elevate"
            data-testid="button-harness-inspection"
          >
            <span className="material-icons mr-2">verified_user</span>
            Daily Harness Inspection
          </Button>
          <Button
            onClick={() => setLocation("/quotes")}
            variant="outline"
            className="w-full h-12 border-primary/20 hover-elevate"
            data-testid="button-quotes"
          >
            <span className="material-icons mr-2">description</span>
            Quotes
          </Button>
        </div>

        {/* Start/End Day Section */}
        <div className="mb-4">
          {!activeSession ? (
            <Button
              onClick={() => handleStartDay()}
              className="w-full h-14 text-lg font-bold"
              data-testid="button-start-day"
              disabled={projects.length === 0}
            >
              <span className="material-icons mr-2">play_circle</span>
              Start Day
            </Button>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={handleEndDay}
                variant="destructive"
                className="w-full h-14 text-lg font-bold"
                data-testid="button-end-day"
              >
                <span className="material-icons mr-2">stop_circle</span>
                End Day
              </Button>
              {selectedProject && (
                <div className="text-center text-xs text-muted-foreground">
                  Active on: {selectedProject.strataPlanNumber}
                </div>
              )}
            </div>
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
              {/* Missed Units Summary - Only show if there are missed units */}
              {missedUnitPhotos.length > 0 && (
                <Card className="border-2 border-orange-400 bg-orange-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="material-icons text-orange-600">warning</span>
                        Missed Units Require Attention
                      </CardTitle>
                      <Badge variant="destructive" data-testid="badge-missed-units-count">
                        {missedUnitPhotos.length}
                      </Badge>
                    </div>
                    <CardDescription>
                      Units that were missed during the initial sweep
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {missedUnitPhotos.map((photo: any) => (
                        <div
                          key={photo.id}
                          onClick={() => setLocation(`/projects/${photo.projectId}`)}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 hover-elevate cursor-pointer"
                          data-testid={`missed-unit-item-${photo.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={photo.imageUrl}
                              alt={`Missed unit ${photo.missedUnitNumber}`}
                              className="w-12 h-12 rounded object-cover border border-orange-300"
                            />
                            <div>
                              <div className="font-medium text-sm">Unit {photo.missedUnitNumber}</div>
                              <div className="text-xs text-muted-foreground">{photo.projectStrataPlanNumber}</div>
                            </div>
                          </div>
                          <span className="material-icons text-muted-foreground">chevron_right</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
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
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-base">{project.strataPlanNumber}</div>
                              {activeSession?.projectId === project.id && (
                                <Badge variant="default" className="text-xs">Active</Badge>
                              )}
                            </div>
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

                        <div className="mt-3 pt-3 border-t space-y-2">
                          <div className="text-xs text-muted-foreground">
                            Daily Target: {project.dailyDropTarget} drops
                          </div>
                          {project.ropeAccessPlanUrl ? (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(project.ropeAccessPlanUrl, '_blank');
                                }}
                                data-testid={`button-view-pdf-${project.id}`}
                              >
                                <span className="material-icons text-sm mr-2">description</span>
                                View Rope Access Plan
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  document.getElementById(`pdf-upload-${project.id}`)?.click();
                                }}
                                disabled={uploadingPdfForProject === project.id}
                                data-testid={`button-replace-pdf-${project.id}`}
                              >
                                <span className="material-icons text-sm mr-2">upload</span>
                                {uploadingPdfForProject === project.id ? "..." : "Replace"}
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById(`pdf-upload-${project.id}`)?.click();
                              }}
                              disabled={uploadingPdfForProject === project.id}
                              data-testid={`button-upload-pdf-${project.id}`}
                            >
                              <span className="material-icons text-sm mr-2">upload</span>
                              {uploadingPdfForProject === project.id ? "Uploading..." : "Upload Fall Protection Plan (PDF)"}
                            </Button>
                          )}
                          <input
                            id={`pdf-upload-${project.id}`}
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              const file = e.target.files?.[0];
                              if (file) {
                                handlePdfUpload(project.id, file);
                                e.target.value = '';
                              }
                            }}
                          />
                          
                          {/* Start Day button for this specific project */}
                          {!activeSession && (
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartDay(project);
                              }}
                              data-testid={`button-start-day-${project.id}`}
                            >
                              <span className="material-icons text-sm mr-2">play_circle</span>
                              Start Day on This Project
                            </Button>
                          )}
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
              <div className="space-y-3">
                <label className="text-sm font-medium">Drops Completed by Elevation</label>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={endDayForm.control}
                    name="dropsCompletedNorth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>North</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            data-testid="input-drops-north"
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={endDayForm.control}
                    name="dropsCompletedEast"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>East</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            data-testid="input-drops-east"
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={endDayForm.control}
                    name="dropsCompletedSouth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>South</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            data-testid="input-drops-south"
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={endDayForm.control}
                    name="dropsCompletedWest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>West</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            data-testid="input-drops-west"
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {activeSession && (() => {
                const totalDrops = (
                  parseInt(endDayForm.watch("dropsCompletedNorth") || "0") +
                  parseInt(endDayForm.watch("dropsCompletedEast") || "0") +
                  parseInt(endDayForm.watch("dropsCompletedSouth") || "0") +
                  parseInt(endDayForm.watch("dropsCompletedWest") || "0")
                );
                return totalDrops > 0 && totalDrops < dailyTarget ? (
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
                ) : null;
              })()}

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

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-logout">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} data-testid="button-confirm-logout">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exceeds Remaining Warning Dialog */}
      <AlertDialog open={showExceedsWarningDialog} onOpenChange={setShowExceedsWarningDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-warning">
              <span className="material-icons">warning</span>
              Drops Exceed Remaining
            </AlertDialogTitle>
            <AlertDialogDescription>
              The number of drops you entered exceeds what's remaining for some elevations:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 my-4">
            {exceedsWarnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <span className="material-icons text-warning text-sm mt-0.5">error_outline</span>
                <p className="text-sm">{warning}</p>
              </div>
            ))}
          </div>
          <AlertDialogDescription className="text-sm">
            Do you want to proceed anyway?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setPendingEndDayData(null);
                setExceedsWarnings([]);
              }}
              data-testid="button-cancel-exceeds"
            >
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={proceedWithEndDay} 
              data-testid="button-confirm-exceeds"
              className="bg-warning hover:bg-warning/90"
            >
              Proceed Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
