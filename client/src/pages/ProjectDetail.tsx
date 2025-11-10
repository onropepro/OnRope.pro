import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [renderError, setRenderError] = useState<Error | null>(null);

  // Catch any render errors
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("Runtime error:", event.error);
      setRenderError(event.error);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  // If there's a render error, show it
  if (renderError) {
    return (
      <div className="min-h-screen bg-red-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 Error Detected</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error Message:</p>
            <p className="font-mono text-sm">{renderError.message}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <p className="font-bold mb-2">Stack Trace:</p>
            <pre className="text-xs overflow-auto">{renderError.stack}</pre>
          </div>
          <button
            onClick={() => {
              setRenderError(null);
              window.location.reload();
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoUnitNumber, setPhotoUnitNumber] = useState("");
  const [photoComment, setPhotoComment] = useState("");
  const [isMissedUnit, setIsMissedUnit] = useState(false);
  const [missedUnitNumber, setMissedUnitNumber] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editJobType, setEditJobType] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [showDebugConsole, setShowDebugConsole] = useState(true);

  const { data: projectData, isLoading } = useQuery({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });

  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;
  
  // Check if user can view financial data (company owner OR has permission)
  const canViewFinancialData = currentUser?.role === "company" || 
                                currentUser?.permissions?.includes("view_financial_data");
  
  // Check if user can view work history (company owner OR has permission)
  const canViewWorkHistory = currentUser?.role === "company" || 
                              currentUser?.permissions?.includes("view_work_history");

  // Fetch work sessions for this project
  const { data: workSessionsData } = useQuery({
    queryKey: ["/api/projects", id, "work-sessions"],
    enabled: !!id,
  });

  // Fetch residents for this project (management only)
  const { data: residentsData } = useQuery({
    queryKey: ["/api/projects", id, "residents"],
    enabled: !!id && (currentUser?.role === "company" || currentUser?.role === "operations_manager" || currentUser?.role === "supervisor"),
  });

  // Fetch complaints for this project
  const { data: complaintsData } = useQuery({
    queryKey: ["/api/projects", id, "complaints"],
    enabled: !!id,
  });

  // Fetch photos for this project
  const { data: photosData, isError: photosError, error: photosErrorMsg, isLoading: photosLoading } = useQuery({
    queryKey: ["/api/projects", id, "photos"],
    enabled: !!id,
    retry: false, // Don't retry on error
    staleTime: 0, // Always fetch fresh data
  });
  
  // Show error toast if photo fetch fails (only once per error)
  useEffect(() => {
    if (photosError) {
      toast({
        title: "Failed to load photos",
        description: photosErrorMsg instanceof Error ? photosErrorMsg.message : "Could not load project photos",
        variant: "destructive"
      });
    }
  }, [photosError, photosErrorMsg, toast]);

  // Fetch toolbox meetings for this project
  const { data: toolboxMeetingsData } = useQuery({
    queryKey: ["/api/projects", id, "toolbox-meetings"],
    enabled: !!id,
  });

  // Fetch job comments for this project
  const { data: commentsData } = useQuery({
    queryKey: ["/api/projects", id, "comments"],
    enabled: !!id,
  });

  // Safely extract data with error logging
  let project: Project | undefined;
  let workSessions: any[] = [];
  let residents: any[] = [];
  let complaints: any[] = [];
  let photos: any[] = [];
  let toolboxMeetings: any[] = [];
  let jobComments: any[] = [];

  try {
    project = projectData?.project as Project | undefined;
    workSessions = workSessionsData?.sessions || [];
    residents = residentsData?.residents || [];
    complaints = complaintsData?.complaints || [];
    photos = photosData?.photos || [];
    toolboxMeetings = toolboxMeetingsData?.meetings || [];
    jobComments = commentsData?.comments || [];
  } catch (err) {
    console.error("Error extracting data:", err);
    setRenderError(err as Error);
  }
  
  // Only company and operations_manager can delete projects
  const canDeleteProject = currentUser?.role === "company" || currentUser?.role === "operations_manager";
  
  // Check if user is management (show pie chart only for management)
  const isManagement = currentUser?.role === "company" || 
                       currentUser?.role === "operations_manager" || 
                       currentUser?.role === "supervisor";

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete project");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted successfully" });
      setLocation("/management");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const completeProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to complete project");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      toast({ title: "Project marked as completed" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const reopenProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reopen project");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      toast({ title: "Project reopened successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (comment: string) => {
      const response = await fetch(`/api/projects/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to post comment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "comments"] });
      setNewComment("");
      toast({ title: "Comment posted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handlePdfUpload = async (file: File) => {
    if (!id) return;
    
    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`/api/projects/${id}/rope-access-plan`, {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload PDF');
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "PDF uploaded successfully" });
    } catch (error) {
      toast({ 
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "Failed to upload PDF", 
        variant: "destructive" 
      });
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setShowPhotoDialog(true);
  };

  const handlePhotoDialogSubmit = async () => {
    if (!id || !selectedFile) return;
    
    // Validate missed unit fields
    if (isMissedUnit && !missedUnitNumber.trim()) {
      toast({
        title: "Missing unit number",
        description: "Please enter a unit number for the missed unit",
        variant: "destructive"
      });
      return;
    }
    
    setUploadingImage(true);
    setShowPhotoDialog(false);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('unitNumber', photoUnitNumber);
      formData.append('comment', photoComment);
      formData.append('isMissedUnit', String(isMissedUnit));
      if (isMissedUnit) {
        formData.append('missedUnitNumber', missedUnitNumber);
      }
      
      const response = await fetch(`/api/projects/${id}/images`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload image');
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "photos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/all-project-photos"] });
      toast({ title: isMissedUnit ? "Missed unit photo uploaded successfully" : "Photo uploaded successfully" });
      
      // Reset form
      setSelectedFile(null);
      setPhotoUnitNumber("");
      setPhotoComment("");
      setIsMissedUnit(false);
      setMissedUnitNumber("");
    } catch (error) {
      toast({ 
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "Failed to upload photo", 
        variant: "destructive" 
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePhotoDialogCancel = () => {
    setShowPhotoDialog(false);
    setSelectedFile(null);
    setPhotoUnitNumber("");
    setPhotoComment("");
    setIsMissedUnit(false);
    setMissedUnitNumber("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">Project not found</div>
        </div>
      </div>
    );
  }

  // Calculate total drops from elevation-specific fields
  const totalDrops = (project.totalDropsNorth ?? 0) + (project.totalDropsEast ?? 0) + 
                     (project.totalDropsSouth ?? 0) + (project.totalDropsWest ?? 0);

  // Calculate completed drops from work sessions (elevation-specific)
  const completedSessions = workSessions.filter((s: any) => s.endTime !== null);
  
  const completedDropsNorth = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedNorth ?? 0), 0);
  const completedDropsEast = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedEast ?? 0), 0);
  const completedDropsSouth = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedSouth ?? 0), 0);
  const completedDropsWest = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedWest ?? 0), 0);
  
  const completedDrops = completedDropsNorth + completedDropsEast + completedDropsSouth + completedDropsWest;
  
  const progressPercent = totalDrops > 0 
    ? Math.min(100, Math.round((completedDrops / totalDrops) * 100))
    : 0;

  // Calculate target met statistics (sum all elevation drops per session)
  const targetMetCount = completedSessions.filter((s: any) => {
    const totalSessionDrops = (s.dropsCompletedNorth ?? 0) + (s.dropsCompletedEast ?? 0) + 
                              (s.dropsCompletedSouth ?? 0) + (s.dropsCompletedWest ?? 0);
    return totalSessionDrops >= project.dailyDropTarget;
  }).length;
  
  const belowTargetCount = completedSessions.filter((s: any) => {
    const totalSessionDrops = (s.dropsCompletedNorth ?? 0) + (s.dropsCompletedEast ?? 0) + 
                              (s.dropsCompletedSouth ?? 0) + (s.dropsCompletedWest ?? 0);
    return totalSessionDrops < project.dailyDropTarget;
  }).length;
  
  const pieData = [
    { name: "Target Met", value: targetMetCount, color: "hsl(var(--primary))" },
    { name: "Below Target", value: belowTargetCount, color: "hsl(var(--destructive))" },
  ];

  return (
    <div className="min-h-screen gradient-bg dot-pattern pb-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/management")}
              className="h-12 gap-2"
              data-testid="button-back"
            >
              <span className="material-icons">arrow_back</span>
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{project.buildingName}</h1>
              <p className="text-xs text-muted-foreground">
                {project.strataPlanNumber} - {project.jobType.replace(/_/g, ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Progress Card */}
        <Card className="glass-card border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="text-base">Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Building Visualization */}
            <HighRiseBuilding
              floors={project.floorCount}
              totalDropsNorth={project.totalDropsNorth ?? Math.floor(project.totalDrops / 4) + (project.totalDrops % 4 > 0 ? 1 : 0)}
              totalDropsEast={project.totalDropsEast ?? Math.floor(project.totalDrops / 4) + (project.totalDrops % 4 > 1 ? 1 : 0)}
              totalDropsSouth={project.totalDropsSouth ?? Math.floor(project.totalDrops / 4) + (project.totalDrops % 4 > 2 ? 1 : 0)}
              totalDropsWest={project.totalDropsWest ?? Math.floor(project.totalDrops / 4)}
              completedDropsNorth={completedDropsNorth}
              completedDropsEast={completedDropsEast}
              completedDropsSouth={completedDropsSouth}
              completedDropsWest={completedDropsWest}
              className="mb-4"
            />

            {/* Progress Stats */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {completedDrops} of {totalDrops} drops completed
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{project.dailyDropTarget}</div>
                <div className="text-sm text-muted-foreground mt-1">Daily Target</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {completedDrops > 0 
                    ? Math.ceil((totalDrops - completedDrops) / project.dailyDropTarget) 
                    : "N/A"}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Days Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics - Target Performance & Work Session History */}
        {(isManagement || canViewWorkHistory) && (
          <Card className="glass-card border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={isManagement && completedSessions.length > 0 ? "performance" : canViewFinancialData && project.estimatedHours ? "budget" : "history"} className="w-full">
                <TabsList className="grid grid-cols-3 w-full h-auto p-1 gap-1 bg-muted/50 rounded-lg">
                  {isManagement && completedSessions.length > 0 && (
                    <TabsTrigger value="performance" className="text-xs py-3 px-2 rounded-md" data-testid="tab-performance">Target Performance</TabsTrigger>
                  )}
                  {canViewFinancialData && project.estimatedHours && (
                    <TabsTrigger value="budget" className="text-xs py-3 px-2 rounded-md" data-testid="tab-budget">Hours & Budget</TabsTrigger>
                  )}
                  {canViewWorkHistory && (
                    <TabsTrigger value="history" className="text-xs py-3 px-2 rounded-md" data-testid="tab-history">Work History</TabsTrigger>
                  )}
                </TabsList>
                
                {isManagement && completedSessions.length > 0 && (
                  <TabsContent value="performance" className="mt-4">
                    <div className="flex flex-col items-center">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) => 
                              `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{targetMetCount}</div>
                          <div className="text-sm text-muted-foreground">Target Met</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-destructive">{belowTargetCount}</div>
                          <div className="text-sm text-muted-foreground">Below Target</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}
                
                {canViewFinancialData && project.estimatedHours && (
                  <TabsContent value="budget" className="mt-4">
                    {(() => {
                      // Calculate total hours worked from completed sessions
                      const totalHoursWorked = completedSessions.reduce((sum: number, session: any) => {
                        if (session.startTime && session.endTime) {
                          const start = new Date(session.startTime);
                          const end = new Date(session.endTime);
                          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                          return sum + hours;
                        }
                        return sum;
                      }, 0);
                      
                      const estimatedHours = project.estimatedHours || 0;
                      const hoursRemaining = Math.max(0, estimatedHours - totalHoursWorked);
                      
                      // Calculate total labor cost
                      const totalLaborCost = completedSessions.reduce((sum: number, session: any) => {
                        if (session.startTime && session.endTime && session.techHourlyRate) {
                          const start = new Date(session.startTime);
                          const end = new Date(session.endTime);
                          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                          const cost = hours * parseFloat(session.techHourlyRate);
                          return sum + cost;
                        }
                        return sum;
                      }, 0);
                      
                      const hoursPieData = [
                        { name: 'Hours Worked', value: parseFloat(totalHoursWorked.toFixed(2)), color: '#1976D2' },
                        { name: 'Hours Remaining', value: parseFloat(hoursRemaining.toFixed(2)), color: '#E0E0E0' },
                      ];
                      
                      return (
                        <div className="flex flex-col items-center">
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={hoursPieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value, percent}) => 
                                  `${name}: ${value}h (${(percent * 100).toFixed(0)}%)`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {hoursPieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-sm">
                            <div className="text-center p-4 rounded-lg border bg-card">
                              <div className="text-2xl font-bold text-primary">{totalHoursWorked.toFixed(1)}h</div>
                              <div className="text-sm text-muted-foreground">Hours Worked</div>
                            </div>
                            <div className="text-center p-4 rounded-lg border bg-card">
                              <div className="text-2xl font-bold text-muted-foreground">{hoursRemaining.toFixed(1)}h</div>
                              <div className="text-sm text-muted-foreground">Hours Remaining</div>
                            </div>
                          </div>
                          
                          <div className="w-full max-w-sm mt-6 p-6 rounded-lg border bg-card">
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground mb-2">Total Labor Cost</div>
                              <div className="text-3xl font-bold text-primary">
                                ${totalLaborCost.toFixed(2)}
                              </div>
                              {estimatedHours > 0 && (
                                <div className="text-xs text-muted-foreground mt-2">
                                  {totalHoursWorked > 0 && (
                                    <span>Average: ${(totalLaborCost / totalHoursWorked).toFixed(2)}/hr</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </TabsContent>
                )}
                
                {canViewWorkHistory && (
                  <TabsContent value="history" className="mt-4">
                    {workSessions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No work sessions recorded yet
                      </p>
                    ) : (() => {
                      // Organize sessions by year -> month -> day
                      const sessionsByDate: Record<string, Record<string, Record<string, any[]>>> = {};
                      
                      workSessions.forEach((session: any) => {
                        const sessionDate = new Date(session.workDate);
                        const year = format(sessionDate, "yyyy");
                        const month = format(sessionDate, "MMMM yyyy");
                        const day = format(sessionDate, "EEEE, MMM d, yyyy");
                        
                        if (!sessionsByDate[year]) sessionsByDate[year] = {};
                        if (!sessionsByDate[year][month]) sessionsByDate[year][month] = {};
                        if (!sessionsByDate[year][month][day]) sessionsByDate[year][month][day] = [];
                        
                        sessionsByDate[year][month][day].push(session);
                      });
                      
                      const years = Object.keys(sessionsByDate).sort().reverse();
                      
                      return (
                        <Accordion type="single" collapsible className="space-y-2">
                          {years.map((year) => (
                            <AccordionItem key={year} value={year} className="border rounded-lg px-3">
                              <AccordionTrigger className="hover:no-underline py-3">
                                <div className="flex items-center gap-2">
                                  <span className="material-icons text-lg">calendar_today</span>
                                  <span className="font-medium">{year}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <Accordion type="single" collapsible className="space-y-2 pl-4">
                                  {Object.keys(sessionsByDate[year]).sort((a, b) => {
                                    const dateA = new Date(a);
                                    const dateB = new Date(b);
                                    return dateB.getTime() - dateA.getTime();
                                  }).map((month) => (
                                    <AccordionItem key={month} value={month} className="border rounded-lg px-3">
                                      <AccordionTrigger className="hover:no-underline py-2">
                                        <div className="flex items-center gap-2">
                                          <span className="material-icons text-sm">event</span>
                                          <span className="text-sm font-medium">{month}</span>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <Accordion type="single" collapsible className="space-y-2 pl-4">
                                          {Object.keys(sessionsByDate[year][month]).sort((a, b) => {
                                            const dateA = new Date(a);
                                            const dateB = new Date(b);
                                            return dateB.getTime() - dateA.getTime();
                                          }).map((day) => {
                                            const daySessions = sessionsByDate[year][month][day];
                                            const completedCount = daySessions.filter(s => s.endTime !== null).length;
                                            
                                            return (
                                              <AccordionItem key={day} value={day} className="border rounded-lg px-3">
                                                <AccordionTrigger className="hover:no-underline py-2">
                                                  <div className="flex items-center justify-between w-full pr-3">
                                                    <div className="flex items-center gap-2">
                                                      <span className="material-icons text-xs">today</span>
                                                      <span className="text-xs font-medium">{day}</span>
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs">
                                                      {daySessions.length} session{daySessions.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                  </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                  <div className="space-y-2 pl-4 pt-2">
                                                    {daySessions.map((session: any) => {
                                                      const isCompleted = session.endTime !== null;
                                                      const sessionDrops = (session.dropsCompletedNorth ?? 0) + (session.dropsCompletedEast ?? 0) + 
                                                                           (session.dropsCompletedSouth ?? 0) + (session.dropsCompletedWest ?? 0);
                                                      const metTarget = sessionDrops >= project.dailyDropTarget;
                                                      
                                                      return (
                                                        <div
                                                          key={session.id}
                                                          onClick={() => setSelectedSession(session)}
                                                          className="flex items-center justify-between p-3 rounded-lg border bg-card cursor-pointer hover-elevate active-elevate-2"
                                                          data-testid={`session-${session.id}`}
                                                        >
                                                          <p className="text-sm font-medium">
                                                            {session.techName || "Unknown"}
                                                          </p>
                                                          {isCompleted ? (
                                                            <Badge variant={metTarget ? "default" : "destructive"} className="text-xs" data-testid={`badge-${metTarget ? "met" : "below"}-target`}>
                                                              {metTarget ? "Target Met" : "Below Target"}
                                                            </Badge>
                                                          ) : (
                                                            <Badge variant="outline" className="text-xs">In Progress</Badge>
                                                          )}
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                </AccordionContent>
                                              </AccordionItem>
                                            );
                                          })}
                                        </Accordion>
                                      </AccordionContent>
                                    </AccordionItem>
                                  ))}
                                </Accordion>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      );
                    })()}
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Project Documents and Photos - Combined Card */}
        <Card className="glass-card border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="text-base">Project Documents & Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Fall Protection Plan Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary">description</span>
                <h3 className="font-medium">Fall Protection Plan</h3>
              </div>
              {project.ropeAccessPlanUrl ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 gap-2"
                    onClick={() => window.open(project.ropeAccessPlanUrl!, '_blank')}
                    data-testid="button-view-pdf"
                  >
                    <span className="material-icons text-lg">description</span>
                    View Current PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 gap-2"
                    onClick={() => document.getElementById('pdf-upload-input')?.click()}
                    disabled={uploadingPdf}
                    data-testid="button-replace-pdf"
                  >
                    <span className="material-icons text-lg">upload</span>
                    {uploadingPdf ? "Uploading..." : "Replace"}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-12 gap-2"
                  onClick={() => document.getElementById('pdf-upload-input')?.click()}
                  disabled={uploadingPdf}
                  data-testid="button-upload-pdf"
                >
                  <span className="material-icons text-lg">upload</span>
                  {uploadingPdf ? "Uploading..." : "Upload PDF"}
                </Button>
              )}
              <input
                id="pdf-upload-input"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handlePdfUpload(file);
                    e.target.value = '';
                  }
                }}
              />
            </div>

            <Separator />

            {/* Project Photos Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-primary">photo_library</span>
                  <h3 className="font-medium">Project Photos</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
                </Badge>
              </div>
              
              {/* Image Gallery */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {photos.map((photo: any) => (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className="aspect-square rounded-lg overflow-hidden border bg-card hover-elevate active-elevate-2 group relative cursor-pointer"
                      >
                        <img
                          src={photo.imageUrl}
                          alt={photo.comment || `Project photo`}
                          className="w-full h-full object-cover"
                          data-testid={`project-image-${photo.id}`}
                        />
                        {(photo.unitNumber || photo.comment) && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                            {photo.unitNumber && (
                              <div className="text-xs font-medium text-white">
                                Unit {photo.unitNumber}
                              </div>
                            )}
                            {photo.comment && (
                              <div className="text-xs text-white/90 line-clamp-2">
                                {photo.comment}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              
              {/* Upload Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-12 gap-2"
                  onClick={() => document.getElementById('image-camera-input')?.click()}
                  disabled={uploadingImage}
                  data-testid="button-take-photo"
                >
                  <span className="material-icons text-lg">photo_camera</span>
                  {uploadingImage ? "Uploading..." : "Take Photo"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 gap-2"
                  onClick={() => document.getElementById('image-file-input')?.click()}
                  disabled={uploadingImage}
                  data-testid="button-upload-from-library"
                >
                  <span className="material-icons text-lg">photo_library</span>
                  {uploadingImage ? "Uploading..." : "From Library"}
                </Button>
              </div>
              
              {/* Camera input (mobile-first) */}
              <input
                id="image-camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelected(file);
                    e.target.value = '';
                  }
                }}
              />
              
              {/* File picker input */}
              <input
                id="image-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelected(file);
                    e.target.value = '';
                  }
                }}
              />
            </div>

            {/* Missed Units Section - Only for in-suite dryer vent projects */}
            {project.jobType === 'in_suite_dryer_vent_cleaning' && (() => {
              const missedUnitPhotos = photos.filter((photo: any) => photo.isMissedUnit);
              return missedUnitPhotos.length > 0 ? (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-orange-600">warning</span>
                        <h3 className="font-medium">Missed Units</h3>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {missedUnitPhotos.length} {missedUnitPhotos.length === 1 ? 'unit' : 'units'}
                      </Badge>
                    </div>
                    
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Photos of units that were missed during the initial sweep and need to be addressed
                      </p>
                    </div>
                    
                    {/* Missed Units Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {missedUnitPhotos.map((photo: any) => (
                        <div
                          key={photo.id}
                          className="border-2 border-orange-400 rounded-lg overflow-hidden bg-card hover-elevate active-elevate-2"
                          data-testid={`missed-unit-${photo.id}`}
                        >
                          <div
                            onClick={() => setSelectedPhoto(photo)}
                            className="aspect-square relative cursor-pointer"
                          >
                            <img
                              src={photo.imageUrl}
                              alt={`Missed unit ${photo.missedUnitNumber}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge variant="destructive" className="font-bold shadow-lg">
                                Unit {photo.missedUnitNumber}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-3 border-t border-orange-200 bg-orange-50">
                            <div className="font-medium text-sm">Unit {photo.missedUnitNumber}</div>
                            {photo.comment && (
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {photo.comment}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(new Date(photo.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null;
            })()}

            <Separator />

            {/* Toolbox Meetings Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-primary">assignment</span>
                  <h3 className="font-medium">Toolbox Meetings</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {toolboxMeetings.length} {toolboxMeetings.length === 1 ? 'meeting' : 'meetings'}
                </Badge>
              </div>

              {/* Meeting List */}
              {toolboxMeetings.length > 0 && (
                <div className="space-y-2">
                  {toolboxMeetings.slice(0, 3).map((meeting: any) => (
                    <Card
                      key={meeting.id}
                      className="hover-elevate cursor-pointer"
                      onClick={() => setSelectedMeeting(meeting)}
                      data-testid={`toolbox-meeting-${meeting.id}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">
                              {format(new Date(meeting.meetingDate), 'MMMM d, yyyy')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Conducted by: {meeting.conductedByName}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {meeting.attendees?.length || 0} attendees
                          </Badge>
                        </div>
                        {meeting.customTopic && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Custom: {meeting.customTopic}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Create Toolbox Meeting Button */}
              <Button
                variant="default"
                className="w-full h-12 gap-2"
                onClick={() => setLocation("/toolbox-meeting")}
                data-testid="button-create-toolbox-meeting"
              >
                <span className="material-icons text-lg">assignment</span>
                Conduct Toolbox Meeting
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resident Feedback Card */}
        <Card className="glass-card border-0 shadow-premium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Resident Feedback</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {complaints.length} {complaints.length === 1 ? 'complaint' : 'complaints'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
              
              {complaints.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm border rounded-lg">
                  No feedback received yet
                </div>
              ) : (
                <div className="space-y-2">
                  {complaints.map((complaint: any) => {
                    const status = complaint.status;
                    const isViewed = complaint.viewedAt !== null;
                    
                    let statusBadge;
                    if (status === 'closed') {
                      statusBadge = <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-xs">Closed</Badge>;
                    } else if (isViewed) {
                      statusBadge = <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs">Viewed</Badge>;
                    } else {
                      statusBadge = <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 text-xs">New</Badge>;
                    }
                    
                    return (
                      <Card 
                        key={complaint.id}
                        className="hover-elevate cursor-pointer"
                        onClick={() => setLocation(`/complaints/${complaint.id}`)}
                        data-testid={`complaint-card-${complaint.id}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{complaint.residentName}</div>
                              <div className="text-xs text-muted-foreground">Unit {complaint.unitNumber}</div>
                            </div>
                            {statusBadge}
                          </div>
                          <p className="text-sm line-clamp-2 mb-2">{complaint.message}</p>
                          <div className="text-xs text-muted-foreground">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
          </CardContent>
        </Card>

        {/* Job Comments Card */}
        <Card className="glass-card border-0 shadow-premium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Job Comments</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {jobComments.length} {jobComments.length === 1 ? 'comment' : 'comments'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">

              {/* Comment Form */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment about this project..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-20"
                  data-testid="input-job-comment"
                />
                <Button
                  onClick={() => {
                    if (newComment.trim()) {
                      createCommentMutation.mutate(newComment.trim());
                    }
                  }}
                  disabled={!newComment.trim() || createCommentMutation.isPending}
                  className="w-full h-12"
                  data-testid="button-post-comment"
                >
                  {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
                </Button>
              </div>

              {/* Comments List */}
              {jobComments.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm border rounded-lg">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                <div className="space-y-2">
                  {jobComments.map((comment: any) => (
                    <Card key={comment.id} className="border">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{comment.userName}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{comment.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>

        {/* Residents List - Management Only */}
        {isManagement && (
          <Card className="glass-card border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Residents linked to project {project?.strataPlanNumber}</CardTitle>
            </CardHeader>
            <CardContent>
              {residents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No residents linked to this project
                </p>
              ) : (
                <div className="space-y-3">
                  {residents.map((resident: any) => (
                    <div
                      key={resident.id}
                      className="p-4 rounded-lg border bg-card"
                      data-testid={`resident-${resident.id}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-lg text-muted-foreground">person</span>
                          <p className="font-medium">{resident.name}</p>
                        </div>
                        {resident.unitNumber && (
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-lg text-muted-foreground">home</span>
                            <p className="text-sm text-muted-foreground">Unit {resident.unitNumber}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-lg text-muted-foreground">email</span>
                          <p className="text-sm text-muted-foreground">{resident.email}</p>
                        </div>
                        {resident.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-lg text-muted-foreground">phone</span>
                            <p className="text-sm text-muted-foreground">{resident.phoneNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Project Actions Card - Edit, Complete, Delete */}
        {canDeleteProject && (
          <Card className="glass-card border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="text-base">Project Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Status</div>
                <Badge variant={project.status === "active" ? "default" : "secondary"} className="capitalize">
                  {project.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditJobType(project.jobType);
                    setShowEditDialog(true);
                  }}
                  className="w-full h-12"
                  data-testid="button-edit-project-action"
                >
                  <span className="material-icons mr-2">edit</span>
                  Edit Project
                </Button>

                {project.status === "active" && (
                  <Button 
                    variant="default" 
                    onClick={() => completeProjectMutation.mutate(project.id)}
                    className="w-full h-12 bg-success text-success-foreground border-success"
                    data-testid="button-complete-project"
                    disabled={completeProjectMutation.isPending}
                  >
                    <span className="material-icons mr-2">check_circle</span>
                    {completeProjectMutation.isPending ? "Completing..." : "Complete Project"}
                  </Button>
                )}

                {project.status === "completed" && (
                  <Button 
                    variant="default" 
                    onClick={() => reopenProjectMutation.mutate(project.id)}
                    className="w-full h-12"
                    data-testid="button-reopen-project"
                    disabled={reopenProjectMutation.isPending}
                  >
                    <span className="material-icons mr-2">restart_alt</span>
                    {reopenProjectMutation.isPending ? "Reopening..." : "Reopen Project"}
                  </Button>
                )}

                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full h-12"
                  data-testid="button-delete-project"
                >
                  <span className="material-icons mr-2">delete</span>
                  Delete Project
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This will permanently remove all associated work sessions, drop logs, and complaints. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-project">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProjectMutation.mutate(project.id)}
              data-testid="button-confirm-delete-project"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Photo Upload Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={(open) => !open && handlePhotoDialogCancel()}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-photo-upload">
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
            <DialogDescription>
              Add unit number and comment to help residents identify their work.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {project.jobType === 'in_suite_dryer_vent_cleaning' && (
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <Checkbox
                  id="missedUnit"
                  checked={isMissedUnit}
                  onCheckedChange={(checked) => setIsMissedUnit(checked as boolean)}
                  data-testid="checkbox-missed-unit"
                />
                <div className="space-y-1 flex-1">
                  <Label 
                    htmlFor="missedUnit"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Mark as Missed Unit
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Check this if the photo shows a unit that was missed during the initial sweep
                  </p>
                </div>
              </div>
            )}
            
            {isMissedUnit && project.jobType === 'in_suite_dryer_vent_cleaning' && (
              <div className="space-y-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <Label htmlFor="missedUnitNumber">Missed Unit Number *</Label>
                <Input
                  id="missedUnitNumber"
                  placeholder="e.g., 301, 1205"
                  value={missedUnitNumber}
                  onChange={(e) => setMissedUnitNumber(e.target.value)}
                  data-testid="input-missed-unit-number"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the unit number for the missed unit
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="unitNumber">Unit Number (Optional)</Label>
              <Input
                id="unitNumber"
                placeholder="e.g., 301, 1205"
                value={photoUnitNumber}
                onChange={(e) => setPhotoUnitNumber(e.target.value)}
                data-testid="input-unit-number"
              />
              <p className="text-xs text-muted-foreground">
                Enter the unit number if this photo is specific to a resident's suite.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="e.g., Before cleaning, After cleaning, Window detail"
                value={photoComment}
                onChange={(e) => setPhotoComment(e.target.value)}
                rows={3}
                data-testid="input-photo-comment"
              />
              <p className="text-xs text-muted-foreground">
                Add a description or note about this photo.
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePhotoDialogCancel}
              data-testid="button-cancel-upload"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePhotoDialogSubmit}
              disabled={!selectedFile}
              data-testid="button-submit-upload"
            >
              Upload Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Work Session Details Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons">work_history</span>
              Work Session Details
            </DialogTitle>
          </DialogHeader>
          {selectedSession && (() => {
            const sessionDate = new Date(selectedSession.workDate);
            const isCompleted = selectedSession.endTime !== null;
            const sessionDrops = (selectedSession.dropsCompletedNorth ?? 0) + 
                                (selectedSession.dropsCompletedEast ?? 0) + 
                                (selectedSession.dropsCompletedSouth ?? 0) + 
                                (selectedSession.dropsCompletedWest ?? 0);
            const metTarget = sessionDrops >= project.dailyDropTarget;
            
            let hoursWorked = 0;
            let laborCost = 0;
            if (isCompleted && selectedSession.startTime && selectedSession.endTime) {
              const start = new Date(selectedSession.startTime);
              const end = new Date(selectedSession.endTime);
              hoursWorked = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
              
              if (selectedSession.techHourlyRate) {
                laborCost = hoursWorked * parseFloat(selectedSession.techHourlyRate);
              }
            }
            
            return (
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Date</div>
                  <div className="text-base">{format(sessionDate, "EEEE, MMMM d, yyyy")}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Technician</div>
                  <div className="text-base">{selectedSession.techName || "Unknown"}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  {isCompleted ? (
                    <Badge variant={metTarget ? "default" : "destructive"}>
                      {metTarget ? "Target Met" : "Below Target"}
                    </Badge>
                  ) : (
                    <Badge variant="outline">In Progress</Badge>
                  )}
                </div>
                
                {isCompleted && (
                  <>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Time</div>
                      <div className="text-base">
                        {format(new Date(selectedSession.startTime), "h:mm a")} - {format(new Date(selectedSession.endTime), "h:mm a")}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Drops Completed</div>
                      <div className="text-base">
                        {sessionDrops} / {project.dailyDropTarget} target
                      </div>
                      {(selectedSession.dropsCompletedNorth ?? 0) > 0 && (
                        <div className="text-sm text-muted-foreground">North: {selectedSession.dropsCompletedNorth}</div>
                      )}
                      {(selectedSession.dropsCompletedEast ?? 0) > 0 && (
                        <div className="text-sm text-muted-foreground">East: {selectedSession.dropsCompletedEast}</div>
                      )}
                      {(selectedSession.dropsCompletedSouth ?? 0) > 0 && (
                        <div className="text-sm text-muted-foreground">South: {selectedSession.dropsCompletedSouth}</div>
                      )}
                      {(selectedSession.dropsCompletedWest ?? 0) > 0 && (
                        <div className="text-sm text-muted-foreground">West: {selectedSession.dropsCompletedWest}</div>
                      )}
                    </div>
                    
                    {canViewFinancialData && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Labor Cost</div>
                        <div className="text-base">
                          <div>
                            Hours Worked: {(() => {
                              const totalMinutes = Math.round(hoursWorked * 60);
                              const hours = Math.floor(totalMinutes / 60);
                              const minutes = totalMinutes % 60;
                              return hours > 0 
                                ? `${hours}h ${minutes}m`
                                : `${minutes}m`;
                            })()}
                          </div>
                          <div>Hourly Rate: ${selectedSession.techHourlyRate || "Not set"}</div>
                          {laborCost > 0 ? (
                            <div className="text-lg font-medium text-primary mt-1" data-testid="text-labor-cost">
                              Total: ${laborCost.toFixed(2)}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground mt-1">
                              No hourly rate set for this employee
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {selectedSession.shortfallReason && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Shortfall Reason</div>
                        <div className="text-base bg-muted p-3 rounded-md italic">
                          {selectedSession.shortfallReason}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Photo Viewer Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl p-0 bg-black/95 border-0">
          {selectedPhoto && (
            <div className="relative">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                data-testid="button-close-photo"
              >
                <span className="material-icons">close</span>
              </button>
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.comment || "Project photo"}
                className="w-full h-auto max-h-[80vh] object-contain"
                data-testid="fullsize-photo"
              />
              {(selectedPhoto.unitNumber || selectedPhoto.comment) && (
                <div className="bg-black/70 text-white p-4 space-y-1">
                  {selectedPhoto.unitNumber && (
                    <div className="font-medium">Unit {selectedPhoto.unitNumber}</div>
                  )}
                  {selectedPhoto.comment && (
                    <div className="text-sm text-white/90">{selectedPhoto.comment}</div>
                  )}
                  <div className="text-xs text-white/70">
                    Uploaded {format(new Date(selectedPhoto.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons">edit</span>
              Edit Project
            </DialogTitle>
            <DialogDescription>
              Update project details
            </DialogDescription>
          </DialogHeader>
          {project && (
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              try {
                const jobType = formData.get('jobType') as string;
                const isDropBased = !['in_suite_dryer_vent_cleaning', 'parkade_pressure_cleaning', 'ground_window_cleaning'].includes(jobType);
                
                const updateData: any = {
                  buildingName: formData.get('buildingName'),
                  buildingAddress: formData.get('buildingAddress') || undefined,
                  strataPlanNumber: formData.get('strataPlanNumber'),
                  jobType: formData.get('jobType'),
                  targetCompletionDate: formData.get('targetCompletionDate') || undefined,
                  estimatedHours: formData.get('estimatedHours') ? parseInt(formData.get('estimatedHours') as string) : undefined,
                };
                
                // Add drop-based fields
                if (isDropBased) {
                  updateData.totalDropsNorth = formData.get('totalDropsNorth') ? parseInt(formData.get('totalDropsNorth') as string) : 0;
                  updateData.totalDropsEast = formData.get('totalDropsEast') ? parseInt(formData.get('totalDropsEast') as string) : 0;
                  updateData.totalDropsSouth = formData.get('totalDropsSouth') ? parseInt(formData.get('totalDropsSouth') as string) : 0;
                  updateData.totalDropsWest = formData.get('totalDropsWest') ? parseInt(formData.get('totalDropsWest') as string) : 0;
                  updateData.dailyDropTarget = formData.get('dailyDropTarget') ? parseInt(formData.get('dailyDropTarget') as string) : 0;
                }
                
                // Add in-suite fields
                if (jobType === 'in_suite_dryer_vent_cleaning') {
                  updateData.totalFloors = formData.get('totalFloors') ? parseInt(formData.get('totalFloors') as string) : undefined;
                  updateData.floorsPerDay = formData.get('floorsPerDay') ? parseInt(formData.get('floorsPerDay') as string) : undefined;
                }
                
                // Add parkade fields
                if (jobType === 'parkade_pressure_cleaning') {
                  updateData.totalStalls = formData.get('totalStalls') ? parseInt(formData.get('totalStalls') as string) : undefined;
                  updateData.stallsPerDay = formData.get('stallsPerDay') ? parseInt(formData.get('stallsPerDay') as string) : undefined;
                }
                
                const response = await fetch(`/api/projects/${id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updateData),
                  credentials: 'include',
                });
                
                if (!response.ok) throw new Error('Failed to update project');
                
                queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
                toast({ title: "Project updated successfully" });
                setShowEditDialog(false);
              } catch (error) {
                toast({ 
                  title: "Update failed", 
                  description: error instanceof Error ? error.message : "Failed to update project",
                  variant: "destructive" 
                });
              }
            }}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="buildingName">Building Name</Label>
                  <Input
                    id="buildingName"
                    name="buildingName"
                    defaultValue={project.buildingName}
                    required
                    data-testid="input-edit-building-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="buildingAddress">Building Address (Optional)</Label>
                  <Input
                    id="buildingAddress"
                    name="buildingAddress"
                    defaultValue={project.buildingAddress || ""}
                    data-testid="input-edit-building-address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="strataPlanNumber">Strata Plan Number</Label>
                  <Input
                    id="strataPlanNumber"
                    name="strataPlanNumber"
                    defaultValue={project.strataPlanNumber}
                    required
                    data-testid="input-edit-strata-plan"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Links residents to this project
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <select
                    id="jobType"
                    name="jobType"
                    defaultValue={project.jobType}
                    onChange={(e) => setEditJobType(e.target.value)}
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    data-testid="select-edit-job-type"
                  >
                    <option value="window_cleaning">Window Cleaning (4-Elevation)</option>
                    <option value="pressure_washing">Pressure Washing (4-Elevation)</option>
                    <option value="dryer_vent_cleaning">Dryer Vent Cleaning (4-Elevation)</option>
                    <option value="in_suite_dryer_vent_cleaning">In-Suite Dryer Vent Cleaning</option>
                    <option value="parkade_pressure_cleaning">Parkade Pressure Cleaning</option>
                    <option value="ground_window_cleaning">Ground Level Window Cleaning</option>
                  </select>
                </div>
                
                {/* Drop-based fields (4-elevation jobs) */}
                {(!editJobType ? !['in_suite_dryer_vent_cleaning', 'parkade_pressure_cleaning', 'ground_window_cleaning'].includes(project.jobType) : !['in_suite_dryer_vent_cleaning', 'parkade_pressure_cleaning', 'ground_window_cleaning'].includes(editJobType)) && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="totalDropsNorth">North Drops</Label>
                        <Input
                          id="totalDropsNorth"
                          name="totalDropsNorth"
                          type="number"
                          min="0"
                          defaultValue={project.totalDropsNorth || 0}
                          required
                          data-testid="input-edit-drops-north"
                        />
                      </div>
                      <div>
                        <Label htmlFor="totalDropsEast">East Drops</Label>
                        <Input
                          id="totalDropsEast"
                          name="totalDropsEast"
                          type="number"
                          min="0"
                          defaultValue={project.totalDropsEast || 0}
                          required
                          data-testid="input-edit-drops-east"
                        />
                      </div>
                      <div>
                        <Label htmlFor="totalDropsSouth">South Drops</Label>
                        <Input
                          id="totalDropsSouth"
                          name="totalDropsSouth"
                          type="number"
                          min="0"
                          defaultValue={project.totalDropsSouth || 0}
                          required
                          data-testid="input-edit-drops-south"
                        />
                      </div>
                      <div>
                        <Label htmlFor="totalDropsWest">West Drops</Label>
                        <Input
                          id="totalDropsWest"
                          name="totalDropsWest"
                          type="number"
                          min="0"
                          defaultValue={project.totalDropsWest || 0}
                          required
                          data-testid="input-edit-drops-west"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="dailyDropTarget">Daily Drop Target</Label>
                      <Input
                        id="dailyDropTarget"
                        name="dailyDropTarget"
                        type="number"
                        min="1"
                        defaultValue={project.dailyDropTarget || ""}
                        required
                        data-testid="input-edit-daily-target"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Drops per technician per day
                      </p>
                    </div>
                  </>
                )}
                
                {/* In-suite fields */}
                {(!editJobType ? project.jobType === 'in_suite_dryer_vent_cleaning' : editJobType === 'in_suite_dryer_vent_cleaning') && (
                  <>
                    <div>
                      <Label htmlFor="totalFloors">Total Floors</Label>
                      <Input
                        id="totalFloors"
                        name="totalFloors"
                        type="number"
                        min="1"
                        defaultValue={project.totalFloors || ""}
                        required
                        data-testid="input-edit-total-floors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="floorsPerDay">Floors Per Day Target</Label>
                      <Input
                        id="floorsPerDay"
                        name="floorsPerDay"
                        type="number"
                        min="1"
                        defaultValue={project.floorsPerDay || ""}
                        data-testid="input-edit-floors-per-day"
                      />
                    </div>
                  </>
                )}
                
                {/* Parkade fields */}
                {(!editJobType ? project.jobType === 'parkade_pressure_cleaning' : editJobType === 'parkade_pressure_cleaning') && (
                  <>
                    <div>
                      <Label htmlFor="totalStalls">Total Stalls</Label>
                      <Input
                        id="totalStalls"
                        name="totalStalls"
                        type="number"
                        min="1"
                        defaultValue={project.totalStalls || ""}
                        required
                        data-testid="input-edit-total-stalls"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stallsPerDay">Stalls Per Day Target</Label>
                      <Input
                        id="stallsPerDay"
                        name="stallsPerDay"
                        type="number"
                        min="1"
                        defaultValue={project.stallsPerDay || ""}
                        data-testid="input-edit-stalls-per-day"
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <Label htmlFor="targetCompletionDate">Target Completion Date (Optional)</Label>
                  <Input
                    id="targetCompletionDate"
                    name="targetCompletionDate"
                    type="date"
                    defaultValue={project.targetCompletionDate || ""}
                    data-testid="input-edit-target-date"
                  />
                </div>
                
                <div>
                  <Label htmlFor="estimatedHours">Estimated Hours (Optional)</Label>
                  <Input
                    id="estimatedHours"
                    name="estimatedHours"
                    type="number"
                    min="1"
                    placeholder="Total estimated hours"
                    defaultValue={project.estimatedHours || ""}
                    data-testid="input-edit-estimated-hours"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Total hours estimated for the entire project
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-save-project">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Toolbox Meeting Details Dialog */}
      <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons">assignment</span>
              Toolbox Meeting Details
            </DialogTitle>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Date</div>
                  <div className="text-base">
                    {format(new Date(selectedMeeting.meetingDate), 'EEEE, MMMM d, yyyy')}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Conducted By</div>
                  <div className="text-base">{selectedMeeting.conductedByName}</div>
                </div>
              </div>

              {selectedMeeting.customTopic && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Custom Topic</div>
                  <div className="text-base bg-muted p-3 rounded-md">
                    {selectedMeeting.customTopic}
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Topics Covered</div>
                <div className="flex flex-wrap gap-2">
                  {selectedMeeting.topicFallProtection && <Badge>Fall Protection Systems</Badge>}
                  {selectedMeeting.topicAnchorPoints && <Badge>Anchor Point Selection</Badge>}
                  {selectedMeeting.topicRopeInspection && <Badge>Rope Inspection</Badge>}
                  {selectedMeeting.topicKnotTying && <Badge>Knot Tying Techniques</Badge>}
                  {selectedMeeting.topicPPECheck && <Badge>PPE Inspection</Badge>}
                  {selectedMeeting.topicWeatherConditions && <Badge>Weather Assessment</Badge>}
                  {selectedMeeting.topicCommunication && <Badge>Communication Protocols</Badge>}
                  {selectedMeeting.topicEmergencyEvacuation && <Badge>Emergency Procedures</Badge>}
                  {selectedMeeting.topicHazardAssessment && <Badge>Hazard Assessment</Badge>}
                  {selectedMeeting.topicLoadCalculations && <Badge>Load Calculations</Badge>}
                  {selectedMeeting.topicEquipmentCompatibility && <Badge>Equipment Compatibility</Badge>}
                  {selectedMeeting.topicDescenderAscender && <Badge>Descender/Ascender Use</Badge>}
                  {selectedMeeting.topicEdgeProtection && <Badge>Edge Protection</Badge>}
                  {selectedMeeting.topicSwingFall && <Badge>Swing Fall Hazards</Badge>}
                  {selectedMeeting.topicMedicalFitness && <Badge>Medical Fitness</Badge>}
                  {selectedMeeting.topicToolDropPrevention && <Badge>Tool Drop Prevention</Badge>}
                  {selectedMeeting.topicRegulations && <Badge>Working at Heights Regulations</Badge>}
                  {selectedMeeting.topicRescueProcedures && <Badge>Rescue Procedures</Badge>}
                  {selectedMeeting.topicSiteHazards && <Badge>Site-Specific Hazards</Badge>}
                  {selectedMeeting.topicBuddySystem && <Badge>Buddy System</Badge>}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Attendees ({selectedMeeting.attendees?.length || 0})
                </div>
                <div className="bg-muted p-3 rounded-md">
                  {selectedMeeting.attendees?.map((attendee: string, idx: number) => (
                    <div key={idx} className="py-1">
                      {idx + 1}. {attendee}
                    </div>
                  ))}
                </div>
              </div>

              {selectedMeeting.additionalNotes && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Additional Notes</div>
                  <div className="text-base bg-muted p-3 rounded-md">
                    {selectedMeeting.additionalNotes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Debug Console */}
      {showDebugConsole && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-green-400 font-mono text-xs p-4 border-t-2 border-green-500 z-50 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <div className="text-green-300 font-bold">🐛 DEBUG CONSOLE</div>
            <button 
              onClick={() => setShowDebugConsole(false)}
              className="text-red-400 hover:text-red-300 px-2"
              data-testid="button-close-debug"
            >
              ✕ CLOSE
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="border-b border-green-800 pb-1">
              <div className="text-yellow-400">📊 QUERY STATES:</div>
              <div className="pl-4">
                <div>• Project: {isLoading ? '⏳ LOADING' : project ? '✅ LOADED' : '❌ NOT FOUND'}</div>
                <div>• Photos: {photosLoading ? '⏳ LOADING' : photosError ? '❌ ERROR' : photos.length > 0 ? `✅ ${photos.length} photos` : '⚠️ No photos'}</div>
                <div>• Work Sessions: {workSessions.length > 0 ? `✅ ${workSessions.length} sessions` : '⚠️ No sessions'}</div>
                <div>• Complaints: {complaints.length > 0 ? `✅ ${complaints.length} complaints` : '⚠️ No complaints'}</div>
                <div>• Residents: {residents.length > 0 ? `✅ ${residents.length} residents` : '⚠️ No residents'}</div>
              </div>
            </div>

            {photosError && (
              <div className="border-b border-red-800 pb-1">
                <div className="text-red-400">🚨 PHOTO ERROR:</div>
                <div className="pl-4 text-red-300">
                  {photosErrorMsg instanceof Error ? photosErrorMsg.message : String(photosErrorMsg)}
                </div>
                <div className="pl-4 text-red-200 text-xs mt-1">
                  Stack: {photosErrorMsg instanceof Error && photosErrorMsg.stack ? photosErrorMsg.stack.substring(0, 200) : 'No stack trace'}
                </div>
              </div>
            )}

            <div className="border-b border-green-800 pb-1">
              <div className="text-yellow-400">📦 RAW DATA:</div>
              <div className="pl-4">
                <div>• projectData: {JSON.stringify(projectData).substring(0, 100)}...</div>
                <div>• photosData: {JSON.stringify(photosData).substring(0, 100)}...</div>
                <div>• userData: {JSON.stringify(userData).substring(0, 100)}...</div>
              </div>
            </div>

            <div className="border-b border-green-800 pb-1">
              <div className="text-yellow-400">🔍 PROJECT INFO:</div>
              <div className="pl-4">
                {project ? (
                  <>
                    <div>• ID: {project.id}</div>
                    <div>• Name: {project.buildingName}</div>
                    <div>• Job Type: {project.jobType}</div>
                    <div>• Status: {project.status}</div>
                  </>
                ) : (
                  <div className="text-red-400">❌ No project data available</div>
                )}
              </div>
            </div>

            <div className="border-b border-green-800 pb-1">
              <div className="text-yellow-400">👤 CURRENT USER:</div>
              <div className="pl-4">
                {currentUser ? (
                  <>
                    <div>• Role: {currentUser.role}</div>
                    <div>• ID: {currentUser.id}</div>
                    <div>• Can View Financial: {canViewFinancialData ? 'YES' : 'NO'}</div>
                  </>
                ) : (
                  <div className="text-red-400">❌ No user data</div>
                )}
              </div>
            </div>

            <div>
              <div className="text-yellow-400">📸 PHOTO DETAILS:</div>
              <div className="pl-4">
                <div>• Total Photos: {photos.length}</div>
                <div>• Photos Query Enabled: {!!id ? 'YES' : 'NO'}</div>
                <div>• Photos Error State: {photosError ? 'ERROR' : 'OK'}</div>
                {photos.length > 0 && (
                  <div className="mt-1">
                    <div className="text-blue-400">Recent photo:</div>
                    <div className="pl-4 text-xs">
                      {JSON.stringify(photos[0], null, 2).substring(0, 300)}...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!showDebugConsole && (
        <button
          onClick={() => setShowDebugConsole(true)}
          className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 z-50 font-mono text-sm"
          data-testid="button-open-debug"
        >
          🐛 DEBUG
        </button>
      )}
    </div>
  );
}
