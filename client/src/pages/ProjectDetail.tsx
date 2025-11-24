import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { hasFinancialAccess, isManagement as checkIsManagement, hasPermission } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { VerticalBuildingProgress } from "@/components/VerticalBuildingProgress";
import { ParkadeView } from "@/components/ParkadeView";
import { SessionDetailsDialog } from "@/components/SessionDetailsDialog";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Project } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const endDaySchema = z.object({
  dropsCompletedNorth: z.string().optional(),
  dropsCompletedEast: z.string().optional(),
  dropsCompletedSouth: z.string().optional(),
  dropsCompletedWest: z.string().optional(),
  manualCompletionPercentage: z.string().optional(),
  shortfallReason: z.string().optional(),
});

type EndDayFormData = z.infer<typeof endDaySchema>;

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
  const [uploadingAnchorCertificate, setUploadingAnchorCertificate] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoUnitNumber, setPhotoUnitNumber] = useState("");
  const [photoComment, setPhotoComment] = useState("");
  const [isMissedUnit, setIsMissedUnit] = useState(false);
  const [missedUnitNumber, setMissedUnitNumber] = useState("");
  const [isMissedStall, setIsMissedStall] = useState(false);
  const [missedStallNumber, setMissedStallNumber] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editJobType, setEditJobType] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [showStartDayDialog, setShowStartDayDialog] = useState(false);
  const [showEndDayDialog, setShowEndDayDialog] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [showHarnessInspectionDialog, setShowHarnessInspectionDialog] = useState(false);

  const endDayForm = useForm<EndDayFormData>({
    resolver: zodResolver(endDaySchema),
    defaultValues: {
      dropsCompletedNorth: "0",
      dropsCompletedEast: "0",
      dropsCompletedSouth: "0",
      dropsCompletedWest: "0",
      manualCompletionPercentage: "0",
      shortfallReason: "",
    },
  });

  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;
  
  // Check if user can view financial data using centralized permission helper
  const canViewFinancialData = hasFinancialAccess(currentUser);

  // Fetch project details - backend filters financial data (estimatedHours) for unauthorized users
  const { data: projectData, isLoading } = useQuery({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });
  
  // Check if user can view work history using centralized permission helper
  const canViewWorkHistory = checkIsManagement(currentUser) || hasPermission(currentUser, 'view_work_history');

  // Fetch work sessions - backend filters financial data (techHourlyRate) for unauthorized users
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

  // Check for active work session on this project
  useEffect(() => {
    const checkActiveSession = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/projects/${id}/my-work-sessions`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const activeSess = data.sessions?.find((s: any) => !s.endTime);
          setActiveSession(activeSess || null);
        }
      } catch (error) {
        console.error("Error checking active session:", error);
      }
    };
    checkActiveSession();
  }, [id]);

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
  
  // Check if user is management using centralized permission helper
  const isManagement = checkIsManagement(currentUser);

  // Helper function to get current GPS location
  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(new Error("Unable to get your location. Please enable location services."));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const startDayMutation = useMutation({
    mutationFn: async (projectId: string) => {
      // Get current location
      let locationData = {};
      try {
        const location = await getCurrentLocation();
        locationData = {
          startLatitude: location.latitude,
          startLongitude: location.longitude,
        };
        console.log("✅ Clock-in location captured:", location);
      } catch (error) {
        console.warn("⚠️ Could not get location for clock-in:", error);
        toast({ 
          title: "Location Unavailable", 
          description: "Could not capture your location for clock-in. Session will be saved without GPS data.",
          variant: "destructive"
        });
        // Continue without location if unavailable
      }

      // Get local date in YYYY-MM-DD format (user's timezone)
      const localDate = new Date();
      const localDateString = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;

      const response = await fetch(`/api/projects/${projectId}/work-sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...locationData,
          workDate: localDateString, // Send client's local date
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to start work session");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setActiveSession(data.session);
      setShowStartDayDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "work-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-drops-today"] });
      toast({ title: "Work session started", description: "Good luck today!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const endDayMutation = useMutation({
    mutationFn: async (data: EndDayFormData) => {
      if (!activeSession) throw new Error("No active session");
      
      // Get current location
      let locationData = {};
      try {
        const location = await getCurrentLocation();
        locationData = {
          endLatitude: location.latitude,
          endLongitude: location.longitude,
        };
        console.log("✅ Clock-out location captured:", location);
      } catch (error) {
        console.warn("⚠️ Could not get location for clock-out:", error);
        toast({ 
          title: "Location Unavailable", 
          description: "Could not capture your location for clock-out. Session will be saved without GPS data.",
          variant: "destructive"
        });
        // Continue without location if unavailable
      }
      
      // Build payload based on job type
      const isHoursBased = project.jobType === "general_pressure_washing" || project.jobType === "ground_window_cleaning";
      
      const payload: any = {
        ...locationData,
      };
      
      if (isHoursBased) {
        // For hours-based projects, send manual completion percentage
        payload.manualCompletionPercentage = parseInt(data.manualCompletionPercentage || "0");
      } else {
        // For drop-based projects, send drop counts
        payload.dropsCompletedNorth = parseInt(data.dropsCompletedNorth || "0");
        payload.dropsCompletedEast = parseInt(data.dropsCompletedEast || "0");
        payload.dropsCompletedSouth = parseInt(data.dropsCompletedSouth || "0");
        payload.dropsCompletedWest = parseInt(data.dropsCompletedWest || "0");
        payload.shortfallReason = data.shortfallReason;
      }
      
      console.log("📤 Sending clock-out data to backend:", payload);
      
      const response = await fetch(`/api/projects/${id}/work-sessions/${activeSession.id}/end`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to end work session");
      }

      return response.json();
    },
    onSuccess: () => {
      setActiveSession(null);
      setShowEndDayDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "work-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-drops-today"] });
      endDayForm.reset();
      toast({ title: "Work session ended", description: "Great work today!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

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
      setLocation("/dashboard");
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

  const onEndDaySubmit = (data: EndDayFormData) => {
    const isHoursBased = project.jobType === "general_pressure_washing" || project.jobType === "ground_window_cleaning";
    
    if (isHoursBased) {
      // For hours-based projects, validate percentage
      const percentage = parseInt(data.manualCompletionPercentage || "0");
      if (percentage < 0 || percentage > 100) {
        endDayForm.setError("manualCompletionPercentage", {
          message: "Percentage must be between 0 and 100"
        });
        return;
      }
    } else {
      // For drop-based projects, validate drops and daily target
      const north = parseInt(data.dropsCompletedNorth || "0");
      const east = parseInt(data.dropsCompletedEast || "0");
      const south = parseInt(data.dropsCompletedSouth || "0");
      const west = parseInt(data.dropsCompletedWest || "0");
      const totalDrops = north + east + south + west;

      // Check if shortfall reason is required but missing
      const isInSuite = project.jobType === "in_suite_dryer_vent_cleaning";
      const isParkade = project.jobType === "parkade_pressure_cleaning";
      const target = isInSuite || isParkade ? (project.suitesPerDay || project.stallsPerDay || 0) : project.dailyDropTarget;
      
      if (totalDrops < target && !data.shortfallReason?.trim()) {
        endDayForm.setError("shortfallReason", {
          message: "Please explain why the daily target wasn't met"
        });
        return;
      }
    }

    endDayMutation.mutate(data);
  };

  const confirmStartDay = () => {
    if (id) {
      startDayMutation.mutate(id);
    }
  };

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

  const handleAnchorCertificateUpload = async (file: File) => {
    if (!id) return;
    
    setUploadingAnchorCertificate(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`/api/projects/${id}/anchor-certificate`, {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload anchor inspection certificate');
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Anchor inspection certificate uploaded successfully" });
    } catch (error) {
      toast({ 
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "Failed to upload anchor inspection certificate", 
        variant: "destructive" 
      });
    } finally {
      setUploadingAnchorCertificate(false);
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
    
    // Validate missed stall fields
    if (isMissedStall && !missedStallNumber.trim()) {
      toast({
        title: "Missing stall number",
        description: "Please enter a stall number for the missed stall",
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
      formData.append('isMissedStall', String(isMissedStall));
      if (isMissedStall) {
        formData.append('missedStallNumber', missedStallNumber);
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
      const successMessage = isMissedUnit ? "Missed unit photo uploaded successfully" : 
                            isMissedStall ? "Missed stall photo uploaded successfully" : 
                            "Photo uploaded successfully";
      toast({ title: successMessage });
      
      // Reset form
      setSelectedFile(null);
      setPhotoUnitNumber("");
      setPhotoComment("");
      setIsMissedUnit(false);
      setMissedUnitNumber("");
      setIsMissedStall(false);
      setMissedStallNumber("");
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

  // Calculate completed sessions
  const completedSessions = workSessions.filter((s: any) => s.endTime !== null);
  
  // Determine tracking type and calculate progress
  const isHoursBased = project.jobType === "general_pressure_washing" || project.jobType === "ground_window_cleaning";
  const isInSuite = project.jobType === "in_suite_dryer_vent_cleaning";
  const isParkade = project.jobType === "parkade_pressure_cleaning";
  
  let totalDrops: number, completedDrops: number, progressPercent: number;
  let completedDropsNorth = 0, completedDropsEast = 0, completedDropsSouth = 0, completedDropsWest = 0;
  
  if (isHoursBased) {
    // Percentage-based tracking (General Pressure Washing, Ground Window)
    // Use the latest manually entered completion percentage from work sessions
    const sessionsWithPercentage = completedSessions.filter((s: any) => 
      s.manualCompletionPercentage !== null && s.manualCompletionPercentage !== undefined
    );
    
    if (sessionsWithPercentage.length > 0) {
      // Sort by end time descending and get the most recent percentage
      const sortedSessions = [...sessionsWithPercentage].sort((a: any, b: any) => 
        new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
      );
      progressPercent = sortedSessions[0].manualCompletionPercentage;
    } else {
      progressPercent = 0;
    }
    
    totalDrops = 100;
    completedDrops = progressPercent;
  } else {
    // Drop/Unit-based tracking
    totalDrops = isInSuite 
      ? project.floorCount  // For dryer vent, use total suite count
      : isParkade
      ? (project.totalStalls || project.floorCount)  // For parkade, use total stalls
      : (project.totalDropsNorth ?? 0) + (project.totalDropsEast ?? 0) + 
        (project.totalDropsSouth ?? 0) + (project.totalDropsWest ?? 0);  // For window cleaning, use elevation drops
    
    // Calculate completed drops from work sessions (elevation-specific)
    completedDropsNorth = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedNorth ?? 0), 0);
    completedDropsEast = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedEast ?? 0), 0);
    completedDropsSouth = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedSouth ?? 0), 0);
    completedDropsWest = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedWest ?? 0), 0);
    
    completedDrops = completedDropsNorth + completedDropsEast + completedDropsSouth + completedDropsWest;
    
    progressPercent = totalDrops > 0 
      ? Math.min(100, Math.round((completedDrops / totalDrops) * 100))
      : 0;
  }

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
              onClick={() => setLocation("/dashboard")}
              className="h-12 gap-2"
              data-testid="button-back"
            >
              <span className="material-icons">arrow_back</span>
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{project.buildingName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-muted-foreground">
                  {project.strataPlanNumber} - {project.jobType.replace(/_/g, ' ')}
                </p>
                {project.companyResidentCode && (
                  <>
                    <span className="text-muted-foreground/50">•</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Code:</span>
                      <Badge variant="outline" className="font-mono text-xs" data-testid="badge-resident-code">
                        {project.companyResidentCode}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Start Work Session Button - Available to all users when no active session exists */}
            {!activeSession && project.status === "active" && (
              <Button
                onClick={() => setShowHarnessInspectionDialog(true)}
                className="h-10 bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-start-day"
              >
                <span className="material-icons mr-2 text-base">play_circle</span>
                Start Work Session
              </Button>
            )}
            {/* End Day Button - Shown when there IS an active session */}
            {activeSession && (
              <Button
                onClick={() => setShowEndDayDialog(true)}
                variant="destructive"
                className="h-10"
                data-testid="button-end-day"
              >
                <span className="material-icons mr-2 text-base">stop_circle</span>
                End Day
              </Button>
            )}
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
            {isHoursBased ? (
              <div className="space-y-6">
                {/* Header with progress */}
                <div className="text-center">
                  <h3 className="text-5xl font-bold mb-2">{progressPercent}%</h3>
                  <p className="text-base font-medium text-foreground">Project Completion</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manual percentage tracking
                  </p>
                </div>

                {/* Progress bar */}
                <div className="relative h-10 bg-muted/50 rounded-xl overflow-hidden border border-border/30 shadow-sm">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out flex items-center justify-end pr-4"
                    style={{ width: `${progressPercent}%` }}
                  >
                    {progressPercent > 15 && (
                      <span className="text-sm font-bold text-white drop-shadow">
                        {progressPercent}%
                      </span>
                    )}
                  </div>
                  {progressPercent <= 15 && progressPercent > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-muted-foreground">
                        {progressPercent}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : project.jobType === "in_suite_dryer_vent_cleaning" ? (
              <div className="space-y-6">
                {/* Header with progress */}
                <div className="text-center">
                  <h3 className="text-5xl font-bold mb-2">{progressPercent}%</h3>
                  <p className="text-base font-medium text-foreground">Suite Completion Progress</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {completedDrops} of {project.floorCount} suites completed
                  </p>
                </div>

                {/* Suites visualization */}
                <div className="bg-gradient-to-br from-card to-background rounded-2xl p-6 border border-border/50 shadow-premium">
                  {/* Header */}
                  <div className="flex items-center justify-center gap-3 mb-6 pb-4 border-b border-border/30">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
                      <span className="material-icons text-xl text-primary">meeting_room</span>
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Building Units</h4>
                  </div>

                  {/* Suites grid */}
                  {(() => {
                    const totalSuites = project.floorCount;
                    const completedSuites = completedDrops;
                    
                    // Calculate grid config based on total suites
                    const getConfig = (total: number) => {
                      if (total <= 20) return { columns: 4, height: "h-16", iconSize: "text-2xl" };
                      if (total <= 50) return { columns: 5, height: "h-14", iconSize: "text-xl" };
                      if (total <= 100) return { columns: 6, height: "h-12", iconSize: "text-lg" };
                      if (total <= 200) return { columns: 8, height: "h-10", iconSize: "text-base" };
                      return { columns: 10, height: "h-8", iconSize: "text-sm" };
                    };
                    
                    const config = getConfig(totalSuites);
                    
                    return (
                      <>
                        <div 
                          className="grid gap-2.5 max-h-[500px] overflow-y-auto pr-2"
                          style={{ gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))` }}
                        >
                          {Array.from({ length: totalSuites }, (_, index) => {
                            const isCompleted = index < completedSuites;
                            return (
                              <div
                                key={index}
                                className={`
                                  ${config.height}
                                  flex items-center justify-center
                                  rounded-xl border transition-premium
                                  ${isCompleted 
                                    ? 'bg-success/10 border-success/30 shadow-sm' 
                                    : 'bg-card border-border/50 hover-elevate'
                                  }
                                `}
                                data-testid={`suite-${index + 1}`}
                              >
                                <span className={`material-icons ${config.iconSize} ${isCompleted ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground/40'}`}>
                                  {isCompleted ? 'check_circle' : 'meeting_room'}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/30">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-full">
                            <div className="w-3 h-3 rounded-full bg-success"></div>
                            <span className="text-xs font-semibold text-success">Completed</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                            <div className="w-3 h-3 rounded-full bg-muted-foreground/40 border border-border"></div>
                            <span className="text-xs font-semibold text-muted-foreground">Remaining</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Progress bar */}
                <div className="relative h-10 bg-muted/50 rounded-xl overflow-hidden border border-border/30 shadow-sm">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-success to-success/80 transition-all duration-500 ease-out flex items-center justify-end pr-4"
                    style={{ width: `${progressPercent}%` }}
                  >
                    {progressPercent > 15 && (
                      <span className="text-sm font-bold text-white drop-shadow">
                        {progressPercent}%
                      </span>
                    )}
                  </div>
                  {progressPercent <= 15 && progressPercent > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-muted-foreground">
                        {progressPercent}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : project.jobType === "parkade_pressure_cleaning" ? (
              <ParkadeView
                totalStalls={project.totalStalls || 0}
                completedStalls={completedDrops}
                className="mb-4"
              />
            ) : (
              <>
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
                  customColors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]}
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
              </>
            )}

            {/* Stats - Hide for hours-based projects since they don't have daily targets */}
            {!isHoursBased && (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">
                    {project.jobType === "in_suite_dryer_vent_cleaning" 
                      ? project.suitesPerDay 
                      : project.jobType === "parkade_pressure_cleaning" 
                      ? project.stallsPerDay 
                      : project.dailyDropTarget}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {project.jobType === "in_suite_dryer_vent_cleaning" 
                      ? "Expected Suites/Day" 
                      : project.jobType === "parkade_pressure_cleaning" 
                      ? "Expected Stalls/Day" 
                      : "Daily Target"}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">
                    {completedDrops > 0 
                      ? (() => {
                          const dailyTarget = project.jobType === "in_suite_dryer_vent_cleaning" 
                            ? project.suitesPerDay 
                            : project.jobType === "parkade_pressure_cleaning" 
                            ? project.stallsPerDay 
                            : project.dailyDropTarget;
                          const remaining = totalDrops - completedDrops;
                          return Math.ceil(remaining / (dailyTarget || 1));
                        })()
                      : "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Days Remaining</div>
                </div>
              </div>
            )}

            {/* Active Workers */}
            {(() => {
              const activeWorkers = workSessions.filter((s: any) => !s.endTime);
              if (activeWorkers.length === 0) return null;
              
              return (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-icons text-sm text-primary">groups</span>
                    <h3 className="text-sm font-medium">Currently Working</h3>
                  </div>
                  <div className="space-y-2">
                    {activeWorkers.map((session: any) => (
                      <div 
                        key={session.id} 
                        className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20"
                        data-testid={`active-worker-${session.id}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-sm text-primary">person</span>
                          <span className="font-medium text-sm">{session.techName || 'Unknown'} {session.techRole && `(${session.techRole.replace(/_/g, ' ')})`}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="material-icons text-xs">schedule</span>
                          {session.startTime && format(new Date(session.startTime), 'h:mm a')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
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
                      const isOverBudget = totalHoursWorked > estimatedHours;
                      const hoursOver = isOverBudget ? totalHoursWorked - estimatedHours : 0;
                      
                      // Calculate total labor cost and overage cost
                      let totalLaborCost = 0;
                      let cumulativeHours = 0;
                      let overageCost = 0;
                      
                      completedSessions.forEach((session: any) => {
                        if (session.startTime && session.endTime && session.techHourlyRate) {
                          const start = new Date(session.startTime);
                          const end = new Date(session.endTime);
                          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                          const cost = hours * parseFloat(session.techHourlyRate);
                          totalLaborCost += cost;
                          
                          // Track overage cost (hours beyond estimated hours)
                          if (isOverBudget) {
                            const previousCumulative = cumulativeHours;
                            cumulativeHours += hours;
                            
                            if (cumulativeHours > estimatedHours) {
                              // This session crosses or is beyond the budget
                              const overageHoursInSession = Math.min(hours, cumulativeHours - estimatedHours);
                              const sessionOverageCost = overageHoursInSession * parseFloat(session.techHourlyRate);
                              overageCost += sessionOverageCost;
                            }
                          }
                        }
                      });
                      
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
                          
                          {isOverBudget && (
                            <Alert className="w-full max-w-sm mt-6 border-destructive/50 bg-destructive/10">
                              <AlertCircle className="h-4 w-4 text-destructive" />
                              <AlertTitle className="text-destructive">Over Budget</AlertTitle>
                              <AlertDescription className="text-destructive/90">
                                <div className="space-y-1">
                                  <div className="font-semibold">
                                    {hoursOver.toFixed(1)}h over allocated hours
                                  </div>
                                  <div className="text-sm">
                                    Overage cost: ${overageCost.toFixed(2)}
                                  </div>
                                  <div className="text-xs mt-2">
                                    Allocated: {estimatedHours}h | Worked: {totalHoursWorked.toFixed(1)}h
                                  </div>
                                </div>
                              </AlertDescription>
                            </Alert>
                          )}
                          
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
                                                      
                                                      const hasLocation = (session.startLatitude && session.startLongitude) || 
                                                                         (session.endLatitude && session.endLongitude);
                                                      
                                                      return (
                                                        <div
                                                          key={session.id}
                                                          onClick={() => setSelectedSession(session)}
                                                          className="flex items-center justify-between p-3 rounded-lg border bg-card cursor-pointer hover-elevate active-elevate-2"
                                                          data-testid={`session-${session.id}`}
                                                        >
                                                          <div className="flex items-center gap-2">
                                                            <p className="text-sm font-medium">
                                                              {session.techName || "Unknown"} {session.techRole && `(${session.techRole.replace(/_/g, ' ')})`}
                                                            </p>
                                                            {hasLocation && (
                                                              <MapPin className="h-4 w-4 text-primary" />
                                                            )}
                                                          </div>
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
            
            {/* Rope Access Plan Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary">description</span>
                <h3 className="font-medium">Rope Access Plan</h3>
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

            {/* Anchor Inspection Certificate Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary">verified</span>
                <h3 className="font-medium">Anchor Inspection Certificate</h3>
              </div>
              {project.anchorInspectionCertificateUrl ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 gap-2"
                    onClick={() => window.open(project.anchorInspectionCertificateUrl!, '_blank')}
                    data-testid="button-view-anchor-certificate"
                  >
                    <span className="material-icons text-lg">description</span>
                    View Certificate
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 gap-2"
                    onClick={() => document.getElementById('anchor-certificate-input')?.click()}
                    disabled={uploadingAnchorCertificate}
                    data-testid="button-replace-anchor-certificate"
                  >
                    <span className="material-icons text-lg">upload</span>
                    {uploadingAnchorCertificate ? "Uploading..." : "Replace"}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-12 gap-2"
                  onClick={() => document.getElementById('anchor-certificate-input')?.click()}
                  disabled={uploadingAnchorCertificate}
                  data-testid="button-upload-anchor-certificate"
                >
                  <span className="material-icons text-lg">upload</span>
                  {uploadingAnchorCertificate ? "Uploading..." : "Upload Certificate"}
                </Button>
              )}
              <input
                id="anchor-certificate-input"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleAnchorCertificateUpload(file);
                    e.target.value = '';
                  }
                }}
              />
            </div>

            <Separator />

            {/* Uploaded Documents Section */}
            {project.documentUrls && project.documentUrls.length > 0 && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-primary">folder_open</span>
                      <h3 className="font-medium">Documents</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {project.documentUrls.length} {project.documentUrls.length === 1 ? 'document' : 'documents'}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-2">
                    {project.documentUrls.map((url: string, index: number) => {
                      const filename = url.split('/').pop() || `Document ${index + 1}`;
                      const displayName = filename.replace(/^rope-access-plan-/, 'Rope Access Plan - ').replace(/\.pdf$/, '');
                      
                      return (
                        <div key={index} className="flex items-center gap-2 p-3 rounded-md border bg-card hover-elevate">
                          <span className="material-icons text-primary">description</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{displayName}</div>
                            <div className="text-xs text-muted-foreground">PDF Document</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(url, '_blank')}
                            data-testid={`button-download-document-${index}`}
                          >
                            <span className="material-icons text-sm">download</span>
                            Download
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />
              </>
            )}

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

            {/* Missed Stalls Section - Only for parkade projects */}
            {project.jobType === 'parkade_pressure_cleaning' && (() => {
              const missedStallPhotos = photos.filter((photo: any) => photo.isMissedStall);
              return missedStallPhotos.length > 0 ? (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-orange-600">warning</span>
                        <h3 className="font-medium">Missed Stalls</h3>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {missedStallPhotos.length} {missedStallPhotos.length === 1 ? 'stall' : 'stalls'}
                      </Badge>
                    </div>
                    
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Photos of parking stalls that were missed during the initial sweep and need to be addressed
                      </p>
                    </div>
                    
                    {/* Missed Stalls Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {missedStallPhotos.map((photo: any) => (
                        <div
                          key={photo.id}
                          className="border-2 border-orange-400 rounded-lg overflow-hidden bg-card hover-elevate active-elevate-2"
                          data-testid={`missed-stall-${photo.id}`}
                        >
                          <div
                            onClick={() => setSelectedPhoto(photo)}
                            className="aspect-square relative cursor-pointer"
                          >
                            <img
                              src={photo.imageUrl}
                              alt={`Missed stall ${photo.missedStallNumber}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge variant="destructive" className="font-bold shadow-lg">
                                Stall {photo.missedStallNumber}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-3 border-t border-orange-200 bg-orange-50">
                            <div className="font-medium text-sm">Stall {photo.missedStallNumber}</div>
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
                          {complaint.photoUrl && (
                            <div className="mb-2">
                              <img 
                                src={complaint.photoUrl} 
                                alt="Complaint photo" 
                                className="w-full max-w-xs rounded-lg border"
                              />
                            </div>
                          )}
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

      {/* Harness Inspection Check Dialog */}
      <AlertDialog open={showHarnessInspectionDialog} onOpenChange={setShowHarnessInspectionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Daily Harness Inspection Complete?</AlertDialogTitle>
            <AlertDialogDescription>
              Before starting your work session, please confirm if your daily harness inspection has been completed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowHarnessInspectionDialog(false);
                setShowStartDayDialog(true);
              }}
              data-testid="button-harness-not-applicable"
            >
              Not Applicable
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowHarnessInspectionDialog(false);
                setLocation("/harness-inspection");
              }}
              data-testid="button-harness-no"
            >
              No
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setShowHarnessInspectionDialog(false);
                setShowStartDayDialog(true);
              }}
              data-testid="button-harness-yes"
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Start Day Confirmation Dialog */}
      <AlertDialog open={showStartDayDialog} onOpenChange={setShowStartDayDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Work Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will begin tracking your work session for {project.buildingName}. You can log drops throughout the day and end your session when finished.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-start-day">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (id) {
                  startDayMutation.mutate(id);
                }
              }}
              data-testid="button-confirm-start-day"
              disabled={startDayMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {startDayMutation.isPending ? "Starting..." : "Start Work Session"}
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
              {project.jobType === 'parkade_pressure_cleaning' 
                ? 'Add parking stall number and comment to help residents identify their work.'
                : 'Add unit number and comment to help residents identify their work.'}
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

            {project.jobType === 'parkade_pressure_cleaning' && (
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <Checkbox
                  id="missedStall"
                  checked={isMissedStall}
                  onCheckedChange={(checked) => setIsMissedStall(checked as boolean)}
                  data-testid="checkbox-missed-stall"
                />
                <div className="space-y-1 flex-1">
                  <Label 
                    htmlFor="missedStall"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Mark as Missed Stall
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Check this if the photo shows a stall that was missed during the initial sweep
                  </p>
                </div>
              </div>
            )}
            
            {isMissedStall && project.jobType === 'parkade_pressure_cleaning' && (
              <div className="space-y-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <Label htmlFor="missedStallNumber">Missed Stall Number *</Label>
                <Input
                  id="missedStallNumber"
                  placeholder="e.g., 42, 101, A-5"
                  value={missedStallNumber}
                  onChange={(e) => setMissedStallNumber(e.target.value)}
                  data-testid="input-missed-stall-number"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the stall number for the missed parking stall
                </p>
              </div>
            )}
            
            {!isMissedUnit && !isMissedStall && (
              <div className="space-y-2">
                <Label htmlFor="unitNumber">
                  {project.jobType === 'parkade_pressure_cleaning' ? 'Parking Stall Number (Optional)' : 'Unit Number (Optional)'}
                </Label>
                <Input
                  id="unitNumber"
                  placeholder={project.jobType === 'parkade_pressure_cleaning' ? 'e.g., 42, A-5, P1-23' : 'e.g., 301, 1205'}
                  value={photoUnitNumber}
                  onChange={(e) => setPhotoUnitNumber(e.target.value)}
                  data-testid="input-unit-number"
                />
                <p className="text-xs text-muted-foreground">
                  {project.jobType === 'parkade_pressure_cleaning' 
                    ? 'Enter the parking stall number if this photo is specific to a resident\'s stall.'
                    : 'Enter the unit number if this photo is specific to a resident\'s suite.'}
                </p>
              </div>
            )}
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

      {/* Work Session Details Dialog with GPS Map */}
      <SessionDetailsDialog
        open={!!selectedSession}
        onOpenChange={() => setSelectedSession(null)}
        session={selectedSession}
        employeeName={selectedSession?.techName}
        projectName={project?.buildingName}
        jobType={project?.jobType}
        hasFinancialPermission={hasFinancialAccess(userData?.user)}
      />

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
                  startDate: formData.get('startDate') || undefined,
                  endDate: formData.get('endDate') || undefined,
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
                  <Label htmlFor="buildingAddress">Building Address</Label>
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
                    <option value="building_wash">Building Wash - Pressure washing (4-Elevation)</option>
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
                  <Label htmlFor="targetCompletionDate">Target Completion Date</Label>
                  <Input
                    id="targetCompletionDate"
                    name="targetCompletionDate"
                    type="date"
                    defaultValue={project.targetCompletionDate || ""}
                    data-testid="input-edit-target-date"
                  />
                </div>
                
                <div>
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
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
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      defaultValue={project.startDate || ""}
                      data-testid="input-edit-start-date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      defaultValue={project.endDate || ""}
                      data-testid="input-edit-end-date"
                    />
                  </div>
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

      {/* Start Day Confirmation Dialog */}
      <AlertDialog open={showStartDayDialog} onOpenChange={setShowStartDayDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Work Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will begin tracking your work session for {project.buildingName}. You can end your session later when finished.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-start-day">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStartDay}
              data-testid="button-confirm-start-day"
              disabled={startDayMutation.isPending}
            >
              {startDayMutation.isPending ? "Starting..." : "Start Work Session"}
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
              {isHoursBased
                ? `Enter the completion percentage (0-100%) for your work on ${project.buildingName}.`
                : project.jobType === "in_suite_dryer_vent_cleaning" 
                ? `Enter the number of units you completed today for ${project.buildingName}.`
                : project.jobType === "parkade_pressure_cleaning"
                ? `Enter the number of stalls you cleaned today for ${project.buildingName}.`
                : `Enter the number of drops you completed today for ${project.buildingName}.`}
            </DialogDescription>
          </DialogHeader>

          <Form {...endDayForm}>
            <form onSubmit={endDayForm.handleSubmit(onEndDaySubmit)} className="space-y-4">
              {isHoursBased ? (
                <FormField
                  control={endDayForm.control}
                  name="manualCompletionPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Completion Percentage (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0"
                          {...field}
                          data-testid="input-completion-percentage"
                          className="h-16 text-3xl font-bold text-center"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter how much of this job you completed (0-100%)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : project.jobType === "in_suite_dryer_vent_cleaning" ? (
                <FormField
                  control={endDayForm.control}
                  name="dropsCompletedNorth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Units Completed</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          data-testid="input-units-completed"
                          className="h-16 text-3xl font-bold text-center"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : project.jobType === "parkade_pressure_cleaning" ? (
                <FormField
                  control={endDayForm.control}
                  name="dropsCompletedNorth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stalls Completed</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          data-testid="input-stalls-completed"
                          className="h-16 text-3xl font-bold text-center"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
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
                          className="h-12 text-xl font-bold text-center"
                          autoComplete="off"
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
                          className="h-12 text-xl font-bold text-center"
                          autoComplete="off"
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
                          className="h-12 text-xl font-bold text-center"
                          autoComplete="off"
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
                          className="h-12 text-xl font-bold text-center"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              )}

              {(() => {
                const north = parseInt(endDayForm.watch("dropsCompletedNorth") || "0");
                const east = parseInt(endDayForm.watch("dropsCompletedEast") || "0");
                const south = parseInt(endDayForm.watch("dropsCompletedSouth") || "0");
                const west = parseInt(endDayForm.watch("dropsCompletedWest") || "0");
                const totalDrops = north + east + south + west;
                const isInSuite = project.jobType === "in_suite_dryer_vent_cleaning";
                const isParkade = project.jobType === "parkade_pressure_cleaning";
                const isHoursBasedLocal = project.jobType === "general_pressure_washing" || project.jobType === "ground_window_cleaning";
                const target = isInSuite || isParkade ? (project.suitesPerDay || project.stallsPerDay || 0) : project.dailyDropTarget;
                const isBelowTarget = totalDrops < target;

                return (
                  <>
                    {!isInSuite && !isParkade && !isHoursBasedLocal && (
                      <div className="p-3 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground">Total Drops</div>
                        <div className="text-2xl font-bold">{totalDrops}</div>
                      </div>
                    )}

                    {isBelowTarget && !isHoursBasedLocal && (
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
                  </>
                );
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
    </div>
  );
}
