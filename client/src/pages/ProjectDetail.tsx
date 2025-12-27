import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { queryClient } from "@/lib/queryClient";
import { hasFinancialAccess, isManagement as checkIsManagement, hasPermission, canViewSafetyDocuments } from "@/lib/permissions";
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
import { WorkNoticeList, WorkNoticeForm } from "@/components/WorkNoticeForm";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MapPin, Calculator } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { useSetHeaderConfig } from "@/components/DashboardLayout";
import { fr, enUS } from "date-fns/locale";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { parseLocalDate, formatTimestampDate, getTodayString, formatDurationMs } from "@/lib/dateUtils";
import type { Project, Building, BuildingInstructions } from "@shared/schema";
import { IRATA_TASK_TYPES, VALID_SHORTFALL_REASONS } from "@shared/schema";
import { usesPercentageProgress, getProgressType } from "@shared/jobTypes";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { KeyRound, DoorOpen, Phone, User, Wrench, FileText, ChevronDown, ChevronRight, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

// Helper to get date locale based on current language
const getDateLocale = () => i18n.language?.startsWith('fr') ? fr : enUS;

const endDaySchema = z.object({
  dropsCompletedNorth: z.string().optional(),
  dropsCompletedEast: z.string().optional(),
  dropsCompletedSouth: z.string().optional(),
  dropsCompletedWest: z.string().optional(),
  manualCompletionPercentage: z.string().optional(),
  validShortfallReasonCode: z.string().optional(),
  shortfallReason: z.string().optional(),
  logRopeAccessHours: z.boolean().default(false),
  ropeAccessTaskHours: z.string().optional(),
});

type EndDayFormData = z.infer<typeof endDaySchema>;

export default function ProjectDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
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
  const [documentsExpanded, setDocumentsExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editJobType, setEditJobType] = useState<string>("");
  const [editAddressCoords, setEditAddressCoords] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });
  const [editAddressValue, setEditAddressValue] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [showStartDayDialog, setShowStartDayDialog] = useState(false);
  const [showEndDayDialog, setShowEndDayDialog] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [showHarnessInspectionDialog, setShowHarnessInspectionDialog] = useState(false);
  const [showLogHoursPrompt, setShowLogHoursPrompt] = useState(false);
  const [showIrataTaskDialog, setShowIrataTaskDialog] = useState(false);
  const [selectedIrataTasks, setSelectedIrataTasks] = useState<string[]>([]);
  const [irataTaskNotes, setIrataTaskNotes] = useState("");
  const [ropeAccessTaskHours, setRopeAccessTaskHours] = useState("");
  // "Last one out" progress prompt state
  const [showProgressPrompt, setShowProgressPrompt] = useState(false);
  const [currentOverallProgress, setCurrentOverallProgress] = useState<number>(0);
  const [newProgressValue, setNewProgressValue] = useState<string>("");
  const [endedSessionData, setEndedSessionData] = useState<{
    sessionId: string;
    hoursWorked: number;
    workDate: string;
    projectId: string;
    buildingName: string;
    buildingAddress: string;
  } | null>(null);
  
  // Building instructions state
  const [buildingInstructionsOpen, setBuildingInstructionsOpen] = useState(true);
  const [showEditInstructionsDialog, setShowEditInstructionsDialog] = useState(false);
  
  // Work notice quick action state
  const [showQuickNoticeForm, setShowQuickNoticeForm] = useState(false);
  const [instructionsForm, setInstructionsForm] = useState({
    buildingAccess: "",
    keysAndFob: "",
    keysReturnPolicy: "",
    roofAccess: "",
    specialRequests: "",
    buildingManagerName: "",
    buildingManagerPhone: "",
    conciergeNames: "",
    conciergePhone: "",
    conciergeHours: "",
    maintenanceName: "",
    maintenancePhone: "",
    councilMemberUnits: "",
    tradeParkingInstructions: "",
    tradeParkingSpots: "",
    tradeWashroomLocation: "",
  });

  const endDayForm = useForm<EndDayFormData>({
    resolver: zodResolver(endDaySchema),
    defaultValues: {
      dropsCompletedNorth: "0",
      dropsCompletedEast: "0",
      dropsCompletedSouth: "0",
      dropsCompletedWest: "0",
      manualCompletionPercentage: "0",
      validShortfallReasonCode: "",
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

  // Fetch complaint metrics for company-wide average resolution time
  const { data: complaintMetricsData, isLoading: metricsLoading } = useQuery<{
    metrics: {
      totalClosed: number;
      averageResolutionMs: number | null;
    };
  }>({
    queryKey: ["/api/complaints/metrics", (projectData?.project as any)?.companyId],
    enabled: !!(projectData?.project as any)?.companyId,
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
        title: t('projectDetail.toasts.failedToLoadPhotos', 'Failed to load photos'),
        description: photosErrorMsg instanceof Error ? photosErrorMsg.message : t('projectDetail.toasts.failedToLoadPhotos', 'Could not load project photos'),
        variant: "destructive"
      });
    }
  }, [photosError, photosErrorMsg, toast, t]);

  // Fetch toolbox meetings for this project
  const { data: toolboxMeetingsData } = useQuery({
    queryKey: ["/api/projects", id, "toolbox-meetings"],
    enabled: !!id,
  });

  // Fetch FLHA forms for this project
  const { data: flhaFormsData } = useQuery<{ flhaForms: any[] }>({
    queryKey: ["/api/projects", id, "flha-forms"],
    enabled: !!id,
  });

  // Fetch job comments for this project
  const { data: commentsData } = useQuery({
    queryKey: ["/api/projects", id, "comments"],
    enabled: !!id,
  });

  // Check if user has done a harness inspection today (any project)
  const { data: harnessInspectionTodayData } = useQuery({
    queryKey: ["/api/harness-inspection-today"],
  });

  const hasHarnessInspectionToday = harnessInspectionTodayData?.hasInspectionToday ?? false;

  // Fetch building data and instructions
  const projectStrataPlan = (projectData?.project as any)?.strataPlanNumber;
  const { data: buildingData, isLoading: isLoadingBuilding } = useQuery<{
    building: Building | null;
    instructions: BuildingInstructions | null;
  }>({
    queryKey: ["/api/buildings/by-strata", projectStrataPlan],
    queryFn: async () => {
      if (!projectStrataPlan) return { building: null, instructions: null };
      const response = await fetch(`/api/buildings/by-strata/${encodeURIComponent(projectStrataPlan)}`, { credentials: "include" });
      if (!response.ok) return { building: null, instructions: null };
      return response.json();
    },
    enabled: !!projectStrataPlan,
  });

  // Initialize instructions form when data loads
  useEffect(() => {
    if (buildingData?.instructions) {
      setInstructionsForm({
        buildingAccess: buildingData.instructions.buildingAccess || "",
        keysAndFob: buildingData.instructions.keysAndFob || "",
        keysReturnPolicy: (buildingData.instructions as any).keysReturnPolicy || "",
        roofAccess: buildingData.instructions.roofAccess || "",
        specialRequests: buildingData.instructions.specialRequests || "",
        buildingManagerName: buildingData.instructions.buildingManagerName || "",
        buildingManagerPhone: buildingData.instructions.buildingManagerPhone || "",
        conciergeNames: buildingData.instructions.conciergeNames || "",
        conciergePhone: buildingData.instructions.conciergePhone || "",
        conciergeHours: (buildingData.instructions as any).conciergeHours || "",
        maintenanceName: buildingData.instructions.maintenanceName || "",
        maintenancePhone: buildingData.instructions.maintenancePhone || "",
        councilMemberUnits: (buildingData.instructions as any).councilMemberUnits || "",
        tradeParkingInstructions: (buildingData.instructions as any).tradeParkingInstructions || "",
        tradeParkingSpots: (buildingData.instructions as any).tradeParkingSpots?.toString() || "",
        tradeWashroomLocation: (buildingData.instructions as any).tradeWashroomLocation || "",
      });
    }
  }, [buildingData?.instructions]);

  // Save building instructions mutation
  const saveInstructionsMutation = useMutation({
    mutationFn: async (data: typeof instructionsForm) => {
      if (!buildingData?.building?.id) throw new Error("Building not found");
      const response = await apiRequest("POST", `/api/buildings/${buildingData.building.id}/instructions`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('projectDetail.buildingInstructions.saved', 'Instructions Saved'),
        description: t('projectDetail.buildingInstructions.savedDesc', 'Building instructions have been updated.'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/buildings/by-strata", projectStrataPlan] });
      setShowEditInstructionsDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: t('projectDetail.toasts.error', 'Error'),
        description: error.message,
        variant: "destructive",
      });
    },
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
  let flhaForms: any[] = [];
  let jobComments: any[] = [];

  try {
    project = projectData?.project as Project | undefined;
    workSessions = workSessionsData?.sessions || [];
    residents = residentsData?.residents || [];
    complaints = complaintsData?.complaints || [];
    photos = photosData?.photos || [];
    toolboxMeetings = toolboxMeetingsData?.meetings || [];
    flhaForms = flhaFormsData?.flhaForms || [];
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
          title: t('projectDetail.toasts.locationUnavailable', 'Location Unavailable'), 
          description: t('projectDetail.toasts.locationUnavailableDesc', 'Could not capture your location for clock-in/clock-out. Location tracking may be limited.'),
          variant: "destructive"
        });
        // Continue without location if unavailable
      }

      // Get local date in YYYY-MM-DD format (user's timezone) using timezone-safe utility
      const localDateString = getTodayString();

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
      toast({ title: t('projectDetail.toasts.sessionStarted', 'Work session started'), description: t('projectDetail.toasts.goodLuck', 'Good luck today!') });
    },
    onError: (error: Error) => {
      toast({ title: t('projectDetail.toasts.error', 'Error'), description: error.message, variant: "destructive" });
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
          title: t('projectDetail.toasts.locationUnavailable', 'Location Unavailable'), 
          description: t('projectDetail.toasts.locationUnavailableDesc', 'Could not capture your location for clock-in/clock-out. Location tracking may be limited.'),
          variant: "destructive"
        });
        // Continue without location if unavailable
      }
      
      // Build payload based on job type - use shared utility for correct determination
      const isPercentageBasedJob = usesPercentageProgress(project.jobType, project.requiresElevation);
      
      const payload: any = {
        ...locationData,
      };
      
      if (isPercentageBasedJob) {
        // For percentage-based jobs, no upfront percentage is sent
        // Only the "last one out" will be prompted to update overall progress after session ends
      } else {
        // For drop-based projects, send drop counts
        payload.dropsCompletedNorth = parseInt(data.dropsCompletedNorth || "0");
        payload.dropsCompletedEast = parseInt(data.dropsCompletedEast || "0");
        payload.dropsCompletedSouth = parseInt(data.dropsCompletedSouth || "0");
        payload.dropsCompletedWest = parseInt(data.dropsCompletedWest || "0");
        payload.validShortfallReasonCode = data.validShortfallReasonCode || null;
        // Only send shortfallReason if "other" is selected or no valid code selected
        payload.shortfallReason = (data.validShortfallReasonCode === 'other' || !data.validShortfallReasonCode) 
          ? data.shortfallReason 
          : null;
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
    onSuccess: (data) => {
      // Calculate hours worked from session data
      const session = data.session;
      const startTime = new Date(session.startTime);
      const endTime = new Date(session.endTime);
      const hoursWorked = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      
      // Store session data for IRATA task logging
      setEndedSessionData({
        sessionId: session.id,
        hoursWorked: parseFloat(hoursWorked.toFixed(2)),
        workDate: session.workDate,
        projectId: id || "",
        buildingName: project?.buildingName || "",
        buildingAddress: project?.buildingAddress || "",
      });
      
      setActiveSession(null);
      setShowEndDayDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "work-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-drops-today"] });
      endDayForm.reset();
      
      // Check if this is a "last one out" situation for percentage-based jobs
      if (data.requiresProgressPrompt) {
        setCurrentOverallProgress(data.currentOverallProgress ?? 0);
        setNewProgressValue(String(data.currentOverallProgress ?? 0));
        setShowProgressPrompt(true);
      } else {
        // Only show log hours prompt for rope access jobs (jobs that require elevation)
        // Skip for ground-level jobs: in-suite dryer vent, parkade, and any job with requiresElevation = false
        const isGroundLevelJob = project?.requiresElevation === false ||
          project?.jobType === 'in_suite_dryer_vent_cleaning' ||
          project?.jobType === 'parkade_pressure_cleaning' ||
          project?.jobType === 'ground_window_cleaning';
        
        if (isGroundLevelJob) {
          // Don't show hours prompt for ground-level jobs, just show success toast
          toast({ title: t('projectDetail.toasts.sessionEnded', 'Work session ended'), description: t('projectDetail.toasts.greatWork', 'Great work today!') });
        } else {
          setShowLogHoursPrompt(true);
        }
      }
    },
    onError: (error: Error) => {
      toast({ title: t('projectDetail.toasts.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  // IRATA Task Log mutation
  const saveIrataTaskLogMutation = useMutation({
    mutationFn: async (data: { 
      workSessionId: string; 
      tasksPerformed: string[];
      notes?: string;
      ropeAccessTaskHours?: number;
    }) => {
      return apiRequest("POST", "/api/irata-task-logs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-irata-task-logs"] });
      setShowIrataTaskDialog(false);
      setSelectedIrataTasks([]);
      setIrataTaskNotes("");
      setRopeAccessTaskHours("");
      setEndedSessionData(null);
      toast({ title: t('projectDetail.toasts.sessionEnded', 'Work session ended'), description: t('projectDetail.toasts.irataTasksLogged', 'IRATA tasks logged successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('projectDetail.toasts.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  // Handle IRATA task log submission
  const handleSaveIrataTasks = () => {
    if (!endedSessionData || selectedIrataTasks.length === 0) {
      toast({ title: t('projectDetail.toasts.error', 'Error'), description: t('projectDetail.dialogs.irataTask.selectTasks', 'Select Tasks Performed'), variant: "destructive" });
      return;
    }
    
    // Validate rope access hours if provided
    let validatedHours: number | undefined = undefined;
    if (ropeAccessTaskHours && ropeAccessTaskHours.trim() !== "") {
      const hours = parseFloat(ropeAccessTaskHours);
      if (isNaN(hours) || hours < 0 || hours > 24) {
        toast({ title: t('projectDetail.toasts.error', 'Error'), description: "Rope access hours must be between 0 and 24", variant: "destructive" });
        return;
      }
      if ((hours * 4) % 1 !== 0) {
        toast({ title: t('projectDetail.toasts.error', 'Error'), description: "Hours must be in quarter-hour increments", variant: "destructive" });
        return;
      }
      validatedHours = hours;
    }
    
    saveIrataTaskLogMutation.mutate({
      workSessionId: endedSessionData.sessionId,
      tasksPerformed: selectedIrataTasks,
      notes: irataTaskNotes || undefined,
      ropeAccessTaskHours: validatedHours,
    });
  };

  // Confirm user wants to log hours - show task selection dialog
  const handleConfirmLogHours = () => {
    setShowLogHoursPrompt(false);
    setShowIrataTaskDialog(true);
  };

  // User declines to log hours
  const handleDeclineLogHours = () => {
    setShowLogHoursPrompt(false);
    setRopeAccessTaskHours("");
    setEndedSessionData(null);
    toast({ title: t('projectDetail.toasts.sessionEnded', 'Work session ended'), description: t('projectDetail.toasts.greatWork', 'Great work today!') });
  };

  // Skip IRATA task logging
  const handleSkipIrataTasks = () => {
    setShowIrataTaskDialog(false);
    setSelectedIrataTasks([]);
    setIrataTaskNotes("");
    setRopeAccessTaskHours("");
    setEndedSessionData(null);
    toast({ title: t('projectDetail.toasts.sessionEnded', 'Work session ended'), description: t('projectDetail.toasts.greatWork', 'Great work today!') });
  };

  // Update project overall progress mutation (for "last one out" scenario)
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { completionPercentage?: number; skip?: boolean }) => {
      const response = await fetch(`/api/projects/${id}/overall-progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update progress");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      setShowProgressPrompt(false);
      setNewProgressValue("");
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      
      if (variables.skip) {
        toast({ 
          title: t('projectDetail.toasts.sessionEnded', 'Work session ended'), 
          description: t('projectDetail.toasts.progressSkipped', 'Progress update skipped') 
        });
      } else {
        toast({ 
          title: t('projectDetail.toasts.progressUpdated', 'Progress Updated'), 
          description: `Project is now ${variables.completionPercentage}% complete` 
        });
      }
      
      // Continue to log hours prompt only for rope access jobs
      const isGroundLevelJob = project?.requiresElevation === false ||
        project?.jobType === 'in_suite_dryer_vent_cleaning' ||
        project?.jobType === 'parkade_pressure_cleaning' ||
        project?.jobType === 'ground_window_cleaning';
      
      if (isGroundLevelJob) {
        // Don't show hours prompt for ground-level jobs
        toast({ title: t('projectDetail.toasts.sessionEnded', 'Work session ended'), description: t('projectDetail.toasts.greatWork', 'Great work today!') });
      } else {
        setShowLogHoursPrompt(true);
      }
    },
    onError: (error: Error) => {
      toast({ title: t('projectDetail.toasts.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  // Handle progress update submission
  const handleProgressSubmit = () => {
    const percentage = parseInt(newProgressValue, 10);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast({ 
        title: t('projectDetail.toasts.error', 'Error'), 
        description: "Please enter a valid percentage between 0 and 100", 
        variant: "destructive" 
      });
      return;
    }
    updateProgressMutation.mutate({ completionPercentage: percentage });
  };

  // Handle skip progress update
  const handleProgressSkip = () => {
    updateProgressMutation.mutate({ skip: true });
  };

  // Toggle IRATA task selection
  const toggleIrataTask = (taskId: string) => {
    setSelectedIrataTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(t => t !== taskId)
        : [...prev, taskId]
    );
  };

  // Create "not applicable" inspection record
  const createNotApplicableInspectionMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error("User not found");
      
      // Get local date in YYYY-MM-DD format using timezone-safe utility
      const localDateString = getTodayString();
      
      // Backend auto-fills workerId from session.userId and companyId from user data
      const response = await fetch('/api/harness-inspections', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: id || undefined,
          inspectionDate: localDateString,
          inspectorName: currentUser.name || currentUser.email || "Unknown",
          overallStatus: "not_applicable",
          equipmentFindings: {},
          comments: "Harness not applicable for this work session",
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to record harness status");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/harness-inspections"] });
      setShowHarnessInspectionDialog(false);
      // Start work session directly without a second confirmation
      if (id) {
        startDayMutation.mutate(id);
      }
    },
    onError: (error: Error) => {
      console.error("Error creating not applicable inspection:", error);
      // Still proceed to start work session even if this fails
      setShowHarnessInspectionDialog(false);
      if (id) {
        startDayMutation.mutate(id);
      }
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
      toast({ title: t('projectDetail.toasts.projectDeleted', 'Project deleted successfully') });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({ title: t('projectDetail.toasts.error', 'Error'), description: error.message, variant: "destructive" });
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
      toast({ title: t('projectDetail.toasts.projectCompleted', 'Project completed successfully') });
      setLocation("/dashboard?tab=projects");
    },
    onError: (error: Error) => {
      toast({ title: t('projectDetail.toasts.error', 'Error'), description: error.message, variant: "destructive" });
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
      toast({ title: t('projectDetail.toasts.projectReopened', 'Project reopened successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('projectDetail.toasts.error', 'Error'), description: error.message, variant: "destructive" });
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
      toast({ title: t('projectDetail.toasts.commentPosted', 'Comment posted successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('projectDetail.toasts.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const onEndDaySubmit = (data: EndDayFormData) => {
    // Use shared utility for correct determination of percentage-based jobs
    const isPercentageBasedJob = usesPercentageProgress(project.jobType, project.requiresElevation);
    
    if (isPercentageBasedJob) {
      // For percentage-based jobs, no upfront input needed
      // Only the "last one out" will be prompted for overall progress after the session ends
      // Just proceed with ending the session
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
      
      // Require either a valid reason code OR a custom explanation when below target
      const hasValidReasonCode = data.validShortfallReasonCode && data.validShortfallReasonCode !== '' && data.validShortfallReasonCode !== 'other';
      const hasOtherWithExplanation = data.validShortfallReasonCode === 'other' && data.shortfallReason?.trim();
      const hasCustomExplanation = !data.validShortfallReasonCode && data.shortfallReason?.trim();
      
      if (totalDrops < target && !hasValidReasonCode && !hasOtherWithExplanation && !hasCustomExplanation) {
        endDayForm.setError("validShortfallReasonCode", {
          message: "Please select a reason why the daily target wasn't met"
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
      toast({ title: t('projectDetail.documents.pdfUploadedSuccess', 'PDF uploaded successfully') });
    } catch (error) {
      toast({ 
        title: t('projectDetail.documents.uploadFailed', 'Upload failed'), 
        description: error instanceof Error ? error.message : t('projectDetail.documents.uploadFailed', 'Failed to upload PDF'), 
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
      toast({ title: t('projectDetail.documents.pdfUploadedSuccess', 'PDF uploaded successfully') });
    } catch (error) {
      toast({ 
        title: t('projectDetail.documents.uploadFailed', 'Upload failed'), 
        description: error instanceof Error ? error.message : t('projectDetail.documents.uploadFailed', 'Failed to upload anchor inspection certificate'), 
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
        title: t('projectDetail.toasts.error', 'Error'),
        description: t('projectDetail.dialogs.uploadPhoto.enterMissedUnitNumber', 'Enter the unit number for the missed unit'),
        variant: "destructive"
      });
      return;
    }
    
    // Validate missed stall fields
    if (isMissedStall && !missedStallNumber.trim()) {
      toast({
        title: t('projectDetail.toasts.error', 'Error'),
        description: t('projectDetail.dialogs.uploadPhoto.enterMissedStallNumber', 'Enter the stall number for the missed parking stall'),
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
      toast({ title: t('projectDetail.documents.photoUploadedSuccess', 'Photo uploaded successfully') });
      
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
        title: t('projectDetail.documents.uploadFailed', 'Upload failed'), 
        description: error instanceof Error ? error.message : t('projectDetail.documents.uploadFailed', 'Failed to upload photo'), 
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

  // Configure unified header with back button and project name
  // These hooks must be called unconditionally before any early returns
  const handleBackClick = useCallback(() => {
    setLocation("/dashboard?tab=projects");
  }, [setLocation]);

  const headerActionButtons = useMemo(() => {
    if (!project) return null;
    return (
      <>
        {!activeSession && project.status === "active" && (
          <Button
            onClick={() => {
              if (hasHarnessInspectionToday) {
                setShowStartDayDialog(true);
              } else {
                setShowHarnessInspectionDialog(true);
              }
            }}
            className="h-10 bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-start-day"
          >
            <span className="material-icons mr-2 text-base">play_circle</span>
            {t('projectDetail.workSession.startSession', 'Start Work Session')}
          </Button>
        )}
        {activeSession && (
          <Button
            onClick={() => setShowEndDayDialog(true)}
            variant="destructive"
            className="h-10"
            data-testid="button-end-day"
          >
            <span className="material-icons mr-2 text-base">stop_circle</span>
            {t('projectDetail.workSession.endSession', 'End Day')}
          </Button>
        )}
      </>
    );
  }, [activeSession, project, hasHarnessInspectionToday, t]);

  useSetHeaderConfig({
    pageTitle: project?.buildingName || t('projectDetail.title', 'Project'),
    pageDescription: project?.buildingAddress ? `${project.strataPlanNumber} - ${project.jobType.replace(/_/g, ' ')}` : undefined,
    onBackClick: handleBackClick,
    actionButtons: headerActionButtons,
    showSearch: false,
  }, [project?.buildingName, project?.buildingAddress, project?.strataPlanNumber, project?.jobType, handleBackClick, headerActionButtons, t]);

  // If there's a render error, show it
  if (renderError) {
    return (
      <div className="min-h-screen bg-red-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('projectDetail.error.detected', 'Error Detected')}</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">{t('projectDetail.error.message', 'Error Message:')}</p>
            <p className="font-mono text-sm">{renderError.message}</p>
          </div>
          <div className="bg-muted p-4 rounded">
            <p className="font-bold mb-2">{t('projectDetail.error.stackTrace', 'Stack Trace:')}</p>
            <pre className="text-xs overflow-auto">{renderError.stack}</pre>
          </div>
          <button
            onClick={() => {
              setRenderError(null);
              window.location.reload();
            }}
            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            {t('projectDetail.error.reloadPage', 'Reload Page')}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen page-gradient p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">{t('common.loading', 'Loading...')}</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen page-gradient p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">{t('projectDetail.notFound', 'Project not found')}</div>
        </div>
      </div>
    );
  }

  // Calculate completed sessions
  const completedSessions = workSessions.filter((s: any) => s.endTime !== null);
  
  // Determine tracking type and calculate progress
  // Use shared utility function that accounts for hours-based jobs AND non-elevation drop-based jobs
  const isPercentageBased = usesPercentageProgress(project.jobType, project.requiresElevation);
  const isInSuite = project.jobType === "in_suite_dryer_vent_cleaning";
  const isParkade = project.jobType === "parkade_pressure_cleaning";
  
  let totalDrops: number, completedDrops: number, progressPercent: number;
  let completedDropsNorth = 0, completedDropsEast = 0, completedDropsSouth = 0, completedDropsWest = 0;
  
  if (isPercentageBased) {
    // Percentage-based tracking (General Pressure Washing, Ground Window, NDT, Rock Scaling)
    // Use project-level overall completion percentage (set by "last one out" technician)
    // Fall back to session-based calculation for legacy data
    if ((project as any).overallCompletionPercentage !== null && (project as any).overallCompletionPercentage !== undefined) {
      progressPercent = (project as any).overallCompletionPercentage;
    } else {
      // Legacy: Use the latest manually entered completion percentage from work sessions
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
    
    // Calculate completed drops from work sessions (elevation-specific) + adjustments
    completedDropsNorth = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedNorth ?? 0), 0) + (project.dropsAdjustmentNorth ?? 0);
    completedDropsEast = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedEast ?? 0), 0) + (project.dropsAdjustmentEast ?? 0);
    completedDropsSouth = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedSouth ?? 0), 0) + (project.dropsAdjustmentSouth ?? 0);
    completedDropsWest = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedWest ?? 0), 0) + (project.dropsAdjustmentWest ?? 0);
    
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
  
  // Valid Reason: below target but has a valid shortfall reason code (not 'other' and not empty)
  const validReasonCount = completedSessions.filter((s: any) => {
    const totalSessionDrops = (s.dropsCompletedNorth ?? 0) + (s.dropsCompletedEast ?? 0) + 
                              (s.dropsCompletedSouth ?? 0) + (s.dropsCompletedWest ?? 0);
    const isBelowTarget = totalSessionDrops < project.dailyDropTarget;
    const hasValidReasonCode = s.validShortfallReasonCode && s.validShortfallReasonCode !== '' && s.validShortfallReasonCode !== 'other';
    return isBelowTarget && hasValidReasonCode;
  }).length;
  
  // Below Target: below target without a valid reason code
  const belowTargetCount = completedSessions.filter((s: any) => {
    const totalSessionDrops = (s.dropsCompletedNorth ?? 0) + (s.dropsCompletedEast ?? 0) + 
                              (s.dropsCompletedSouth ?? 0) + (s.dropsCompletedWest ?? 0);
    const isBelowTarget = totalSessionDrops < project.dailyDropTarget;
    const hasValidReasonCode = s.validShortfallReasonCode && s.validShortfallReasonCode !== '' && s.validShortfallReasonCode !== 'other';
    return isBelowTarget && !hasValidReasonCode;
  }).length;
  
  const pieData = [
    { name: t('projectDetail.progress.targetMet', 'Target Met'), value: targetMetCount, color: "hsl(var(--primary))" },
    { name: t('projectDetail.progress.validReason', 'Valid Reason'), value: validReasonCount, color: "hsl(var(--warning))" },
    { name: t('projectDetail.progress.belowTarget', 'Below Target'), value: belowTargetCount, color: "hsl(var(--destructive))" },
  ];

  return (
    <div className="min-h-screen gradient-bg dot-pattern pb-6">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Progress Card */}
        <Card className="glass-card border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="text-base">{t('projectDetail.progress.title', 'Progress')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Building Visualization */}
            {isPercentageBased ? (
              <div className="space-y-6">
                {/* Header with progress */}
                <div className="text-center">
                  <h3 className="text-5xl font-bold mb-2">{progressPercent}%</h3>
                  <p className="text-base font-medium text-foreground">{t('projectDetail.progress.completionPercentage', 'Project Completion')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('projectDetail.progress.completionPercentage', 'Manual percentage tracking')}
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
                            <span className="text-xs font-semibold text-success">{t('common.completed', 'Completed')}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                            <div className="w-3 h-3 rounded-full bg-muted-foreground/40 border border-border"></div>
                            <span className="text-xs font-semibold text-muted-foreground">{t('projectDetail.progress.remaining', 'Remaining')}</span>
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
                    <span className="text-muted-foreground">{t('projectDetail.progress.title', 'Overall Progress')}</span>
                    <span className="font-medium">{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {completedDrops} {t('common.of', 'of')} {totalDrops} {t('projectDetail.progress.dropsCompleted', 'drops completed')}
                  </p>
                </div>
              </>
            )}

            {/* Stats - Hide for hours-based projects since they don't have daily targets */}
            {!isPercentageBased && (
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
                      ? t('projectDetail.progress.unitsPerDay', 'Expected Suites/Day') 
                      : project.jobType === "parkade_pressure_cleaning" 
                      ? t('projectDetail.progress.stallsPerDay', 'Expected Stalls/Day') 
                      : t('projectDetail.progress.dailyTarget', 'Daily Target')}
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
                  <div className="text-sm text-muted-foreground mt-1">{t('projectDetail.progress.remaining', 'Days Remaining')}</div>
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
                    <h3 className="text-sm font-medium">{t('projectDetail.workSession.currentlyWorking', 'Currently Working')}</h3>
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

        {/* Building Instructions Section - Prominent styling */}
        {buildingData?.building && (
          <Card className="glass-card border-2 border-primary/30 shadow-premium bg-primary/5">
            <Collapsible open={buildingInstructionsOpen} onOpenChange={setBuildingInstructionsOpen}>
              <CardHeader className="pb-3">
                <CollapsibleTrigger className="flex items-center justify-between w-full" data-testid="trigger-building-instructions">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="material-icons text-primary">apartment</span>
                    {t('projectDetail.buildingInstructions.title', 'Building Instructions')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {currentUser?.role === "company" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEditInstructionsDialog(true);
                        }}
                        data-testid="button-edit-building-instructions"
                      >
                        <span className="material-icons text-sm">edit</span>
                      </Button>
                    )}
                    {buildingInstructionsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {buildingData?.instructions ? (
                    <div className="space-y-4">
                      {/* Access Information */}
                      <div className="space-y-3">
                        {buildingData.instructions.buildingAccess && (
                          <div className="flex gap-3">
                            <DoorOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">{t('projectDetail.buildingInstructions.buildingAccess', 'Building Access')}</p>
                              <p className="text-sm">{buildingData.instructions.buildingAccess}</p>
                            </div>
                          </div>
                        )}
                        {buildingData.instructions.keysAndFob && (
                          <div className="flex gap-3">
                            <KeyRound className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">{t('projectDetail.buildingInstructions.keysAndFob', 'Keys/Fob Location')}</p>
                              <p className="text-sm">{buildingData.instructions.keysAndFob}</p>
                              {(buildingData.instructions as any).keysReturnPolicy && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {t('projectDetail.buildingInstructions.returnBy', 'Return')}: {
                                    (buildingData.instructions as any).keysReturnPolicy === 'end_of_day' ? t('projectDetail.buildingInstructions.endOfDay', 'End of Every Day') :
                                    (buildingData.instructions as any).keysReturnPolicy === 'end_of_week' ? t('projectDetail.buildingInstructions.endOfWeek', 'End of Week') :
                                    (buildingData.instructions as any).keysReturnPolicy === 'end_of_project' ? t('projectDetail.buildingInstructions.endOfProject', 'End of Project') :
                                    t('projectDetail.buildingInstructions.keepUntilComplete', 'Keep Until Work Complete')
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {buildingData.instructions.roofAccess && (
                          <div className="flex gap-3">
                            <span className="material-icons text-sm text-muted-foreground shrink-0 mt-0.5">roofing</span>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">{t('projectDetail.buildingInstructions.roofAccess', 'Roof Access')}</p>
                              <p className="text-sm">{buildingData.instructions.roofAccess}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Contacts */}
                      {(buildingData.instructions.buildingManagerName || buildingData.instructions.conciergeNames || buildingData.instructions.maintenanceName) && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            {buildingData.instructions.buildingManagerName && (
                              <div className="flex gap-3">
                                <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">{t('projectDetail.buildingInstructions.buildingManager', 'Building Manager')}</p>
                                  <p className="text-sm">{buildingData.instructions.buildingManagerName}</p>
                                  {buildingData.instructions.buildingManagerPhone && (
                                    <a href={`tel:${buildingData.instructions.buildingManagerPhone}`} className="text-sm text-primary flex items-center gap-1 mt-0.5">
                                      <Phone className="h-3 w-3" />
                                      {buildingData.instructions.buildingManagerPhone}
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                            {buildingData.instructions.conciergeNames && (
                              <div className="flex gap-3">
                                <span className="material-icons text-sm text-muted-foreground shrink-0 mt-0.5">support_agent</span>
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">{t('projectDetail.buildingInstructions.concierge', 'Concierge')}</p>
                                  <p className="text-sm">{buildingData.instructions.conciergeNames}</p>
                                  {buildingData.instructions.conciergePhone && (
                                    <a href={`tel:${buildingData.instructions.conciergePhone}`} className="text-sm text-primary flex items-center gap-1 mt-0.5">
                                      <Phone className="h-3 w-3" />
                                      {buildingData.instructions.conciergePhone}
                                    </a>
                                  )}
                                  {(buildingData.instructions as any).conciergeHours && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {t('projectDetail.buildingInstructions.hours', 'Hours')}: {(buildingData.instructions as any).conciergeHours}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                            {buildingData.instructions.maintenanceName && (
                              <div className="flex gap-3">
                                <Wrench className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">{t('projectDetail.buildingInstructions.maintenance', 'Maintenance')}</p>
                                  <p className="text-sm">{buildingData.instructions.maintenanceName}</p>
                                  {buildingData.instructions.maintenancePhone && (
                                    <a href={`tel:${buildingData.instructions.maintenancePhone}`} className="text-sm text-primary flex items-center gap-1 mt-0.5">
                                      <Phone className="h-3 w-3" />
                                      {buildingData.instructions.maintenancePhone}
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                            {(buildingData.instructions as any).councilMemberUnits && (
                              <div className="flex gap-3">
                                <span className="material-icons text-sm text-muted-foreground shrink-0 mt-0.5">groups</span>
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">{t('projectDetail.buildingInstructions.councilMemberUnits', 'Council Member Units')}</p>
                                  <p className="text-sm">{(buildingData.instructions as any).councilMemberUnits}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Trade Parking */}
                      {((buildingData.instructions as any).tradeParkingInstructions || (buildingData.instructions as any).tradeParkingSpots) && (
                        <>
                          <Separator />
                          <div className="flex gap-3">
                            <span className="material-icons text-sm text-muted-foreground shrink-0 mt-0.5">local_parking</span>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">{t('projectDetail.buildingInstructions.tradeParking', 'Trade Parking')}</p>
                              {(buildingData.instructions as any).tradeParkingSpots && (
                                <p className="text-sm font-medium">{(buildingData.instructions as any).tradeParkingSpots} {t('projectDetail.buildingInstructions.spotsAvailable', 'spot(s) available')}</p>
                              )}
                              {(buildingData.instructions as any).tradeParkingInstructions && (
                                <p className="text-sm whitespace-pre-wrap">{(buildingData.instructions as any).tradeParkingInstructions}</p>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Trade Washroom */}
                      {(buildingData.instructions as any).tradeWashroomLocation && (
                        <>
                          <Separator />
                          <div className="flex gap-3">
                            <span className="material-icons text-sm text-muted-foreground shrink-0 mt-0.5">wc</span>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">{t('projectDetail.buildingInstructions.tradeWashroom', 'Trade Washroom')}</p>
                              <p className="text-sm whitespace-pre-wrap">{(buildingData.instructions as any).tradeWashroomLocation}</p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Special Requests */}
                      {buildingData.instructions.specialRequests && (
                        <>
                          <Separator />
                          <div className="flex gap-3">
                            <span className="material-icons text-sm text-muted-foreground shrink-0 mt-0.5">warning</span>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">{t('projectDetail.buildingInstructions.specialRequests', 'Special Requests')}</p>
                              <p className="text-sm whitespace-pre-wrap">{buildingData.instructions.specialRequests}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{t('projectDetail.buildingInstructions.noInstructions', 'No building instructions available')}</p>
                      {currentUser?.role === "company" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => setShowEditInstructionsDialog(true)}
                          data-testid="button-add-building-instructions"
                        >
                          {t('projectDetail.buildingInstructions.addInstructions', 'Add Instructions')}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* Quick Actions - Safety Forms accessible to all employees */}
        <Card className="glass-card border-0 shadow-premium">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="material-icons text-primary">bolt</span>
              {t('projectDetail.quickActions.title', 'Quick Actions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => setLocation(`/harness-inspection?projectId=${id}`)}
                data-testid="button-harness-inspection"
              >
                <span className="material-icons text-2xl text-amber-600">security</span>
                <span className="text-xs font-medium text-center">{t('projectDetail.quickActions.harnessInspection', 'Harness Inspection')}</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => setLocation(`/toolbox-meeting?projectId=${id}`)}
                data-testid="button-toolbox-meeting"
              >
                <span className="material-icons text-2xl text-blue-600">groups</span>
                <span className="text-xs font-medium text-center">{t('projectDetail.quickActions.toolboxMeeting', 'Toolbox Meeting')}</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => setLocation(`/flha-form?projectId=${id}`)}
                data-testid="button-flha"
              >
                <span className="material-icons text-2xl text-green-600">assignment</span>
                <span className="text-xs font-medium text-center">{t('projectDetail.quickActions.flha', 'FLHA Form')}</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => setLocation(`/incident-report?projectId=${id}`)}
                data-testid="button-incident-report"
              >
                <span className="material-icons text-2xl text-red-600">report_problem</span>
                <span className="text-xs font-medium text-center">{t('projectDetail.quickActions.incidentReport', 'Incident Report')}</span>
              </Button>
              {isManagement && (
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => setShowQuickNoticeForm(true)}
                  data-testid="button-create-notice"
                >
                  <span className="material-icons text-2xl text-purple-600">campaign</span>
                  <span className="text-xs font-medium text-center">{t('projectDetail.quickActions.createNotice', 'Create Notice')}</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analytics - Target Performance & Work Session History */}
        {(isManagement || canViewWorkHistory) && (
          <Card className="glass-card border-0 shadow-premium">
            <CardHeader>
              <CardTitle>{t('projectDetail.analytics.title', 'Analytics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={isManagement && completedSessions.length > 0 ? "performance" : canViewFinancialData && project.estimatedHours ? "budget" : "history"} className="w-full">
                <TabsList className="grid grid-cols-3 w-full h-auto p-1 gap-1 bg-muted/50 rounded-lg">
                  {isManagement && completedSessions.length > 0 && (
                    <TabsTrigger value="performance" className="text-xs py-3 px-2 rounded-md" data-testid="tab-performance">{t('projectDetail.analytics.tabs.targetPerformance', 'Target Performance')}</TabsTrigger>
                  )}
                  {canViewFinancialData && project.estimatedHours && (
                    <TabsTrigger value="budget" className="text-xs py-3 px-2 rounded-md" data-testid="tab-budget">{t('projectDetail.analytics.tabs.hoursBudget', 'Hours & Budget')}</TabsTrigger>
                  )}
                  {canViewWorkHistory && (
                    <TabsTrigger value="history" className="text-xs py-3 px-2 rounded-md" data-testid="tab-history">{t('projectDetail.analytics.tabs.workHistory', 'Work History')}</TabsTrigger>
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
                          <div className="text-sm text-muted-foreground">{t('projectDetail.progress.targetMet', 'Target Met')}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-destructive">{belowTargetCount}</div>
                          <div className="text-sm text-muted-foreground">{t('projectDetail.progress.belowTarget', 'Below Target')}</div>
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
                        {t('projectDetail.workSession.noActiveSession', 'No work sessions recorded yet')}
                      </p>
                    ) : (() => {
                      // Organize sessions by year -> month -> day
                      const sessionsByDate: Record<string, Record<string, Record<string, any[]>>> = {};
                      
                      workSessions.forEach((session: any) => {
                        const sessionDate = new Date(session.workDate);
                        const year = format(sessionDate, "yyyy");
                        const month = format(sessionDate, "MMMM yyyy", { locale: getDateLocale() });
                        const day = format(sessionDate, "EEEE, MMM d, yyyy", { locale: getDateLocale() });
                        
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
                                                      const isPercentageBasedSession = usesPercentageProgress(project.jobType, project.requiresElevation);
                                                      const contributionPct = session.manualCompletionPercentage;
                                                      const sessionLaborCost = session.laborCost ? parseFloat(session.laborCost) : null;
                                                      
                                                      const hasLocation = (session.startLatitude && session.startLongitude) || 
                                                                         (session.endLatitude && session.endLongitude);
                                                      
                                                      return (
                                                        <div
                                                          key={session.id}
                                                          onClick={() => setSelectedSession(session)}
                                                          className="flex items-center justify-between p-3 rounded-lg border bg-card cursor-pointer hover-elevate active-elevate-2"
                                                          data-testid={`session-${session.id}`}
                                                        >
                                                          <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2">
                                                              <p className="text-sm font-medium">
                                                                {session.techName || "Unknown"} {session.techRole && `(${session.techRole.replace(/_/g, ' ')})`}
                                                              </p>
                                                              {hasLocation && (
                                                                <MapPin className="h-4 w-4 text-primary" />
                                                              )}
                                                            </div>
                                                            {isCompleted && (isPercentageBasedSession || sessionLaborCost) && (
                                                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                                {isPercentageBasedSession && contributionPct !== null && contributionPct !== undefined && (
                                                                  <span className="flex items-center gap-1">
                                                                    <span className="material-icons text-xs">trending_up</span>
                                                                    +{contributionPct}% {t('projectDetail.progress.contribution', 'contribution')}
                                                                  </span>
                                                                )}
                                                                {sessionLaborCost !== null && (
                                                                  <span className="flex items-center gap-1">
                                                                    <span className="material-icons text-xs">attach_money</span>
                                                                    ${sessionLaborCost.toFixed(2)} {t('projectDetail.progress.laborCost', 'labor')}
                                                                  </span>
                                                                )}
                                                              </div>
                                                            )}
                                                          </div>
                                                          {isCompleted ? (
                                                            isPercentageBasedSession && contributionPct !== null ? (
                                                              <Badge variant="default" className="text-xs">
                                                                +{contributionPct}%
                                                              </Badge>
                                                            ) : (
                                                              <Badge variant={metTarget ? "default" : "destructive"} className="text-xs" data-testid={`badge-${metTarget ? "met" : "below"}-target`}>
                                                                {metTarget ? t('projectDetail.progress.targetMet', 'Target Met') : t('projectDetail.progress.belowTarget', 'Below Target')}
                                                              </Badge>
                                                            )
                                                          ) : (
                                                            <Badge variant="outline" className="text-xs">{t('common.inProgress', 'In Progress')}</Badge>
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

        {/* Project Documents and Photos - Collapsible Combined Card */}
        <Card className="glass-card border-0 shadow-premium">
          <Collapsible open={documentsExpanded} onOpenChange={setDocumentsExpanded}>
            <CardHeader className="pb-0">
              <CollapsibleTrigger asChild>
                <button
                  className="w-full flex items-center justify-between hover-elevate active-elevate-2 rounded-md p-2 -m-2"
                  data-testid="button-toggle-documents"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-primary">folder</span>
                    <CardTitle className="text-base">{t('projectDetail.documents.title', 'Project Documents & Photos')}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {photos.length + toolboxMeetings.length + flhaForms.length} {t('projectDetail.documents.items', 'items')}
                    </Badge>
                    <span className={`material-icons text-muted-foreground transition-transform duration-200 ${documentsExpanded ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-6 pt-4">
            
            {/* Rope Access Plan Section - Only visible to users with safety document permission */}
            {canViewSafetyDocuments(currentUser) && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-primary">description</span>
                    <h3 className="font-medium">{t('projectDetail.documents.ropeAccessPlan', 'Rope Access Plan')}</h3>
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
                        {t('projectDetail.documents.viewCurrentPdf', 'View Current PDF')}
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 gap-2"
                        onClick={() => document.getElementById('pdf-upload-input')?.click()}
                        disabled={uploadingPdf}
                        data-testid="button-replace-pdf"
                      >
                        <span className="material-icons text-lg">upload</span>
                        {uploadingPdf ? t('projectDetail.documents.uploading', 'Uploading...') : t('projectDetail.documents.replace', 'Replace')}
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
                      {uploadingPdf ? t('projectDetail.documents.uploading', 'Uploading...') : t('projectDetail.documents.uploadPdf', 'Upload PDF')}
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
              </>
            )}

            {/* Anchor Inspection Certificate Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary">verified</span>
                <h3 className="font-medium">{t('projectDetail.documents.anchorCertificate', 'Anchor Inspection Certificate')}</h3>
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
                    {t('projectDetail.documents.viewCertificate', 'View Certificate')}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 gap-2"
                    onClick={() => document.getElementById('anchor-certificate-input')?.click()}
                    disabled={uploadingAnchorCertificate}
                    data-testid="button-replace-anchor-certificate"
                  >
                    <span className="material-icons text-lg">upload</span>
                    {uploadingAnchorCertificate ? t('projectDetail.documents.uploading', 'Uploading...') : t('projectDetail.documents.replace', 'Replace')}
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
                  {uploadingAnchorCertificate ? t('projectDetail.documents.uploading', 'Uploading...') : t('projectDetail.documents.uploadCertificate', 'Upload Certificate')}
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
                      <h3 className="font-medium">{t('projectDetail.documents.documentsTitle', 'Documents')}</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {project.documentUrls.length} {project.documentUrls.length === 1 ? t('projectDetail.documents.document', 'document') : t('projectDetail.documents.documentsPlural', 'documents')}
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
                            <div className="text-xs text-muted-foreground">{t('projectDetail.documents.pdfDocument', 'PDF Document')}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(url, '_blank')}
                            data-testid={`button-download-document-${index}`}
                          >
                            <span className="material-icons text-sm">download</span>
                            {t('common.download', 'Download')}
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
                  <h3 className="font-medium">{t('projectDetail.documents.projectPhotos', 'Project Photos')}</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {photos.length} {photos.length === 1 ? t('projectDetail.documents.photo', 'photo') : t('projectDetail.documents.photosPlural', 'photos')}
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
                                {t('projectDetail.documents.unit', 'Unit')} {photo.unitNumber}
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
                  {uploadingImage ? t('projectDetail.documents.uploading', 'Uploading...') : t('projectDetail.documents.takePhoto', 'Take Photo')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 gap-2"
                  onClick={() => document.getElementById('image-file-input')?.click()}
                  disabled={uploadingImage}
                  data-testid="button-upload-from-library"
                >
                  <span className="material-icons text-lg">photo_library</span>
                  {uploadingImage ? t('projectDetail.documents.uploading', 'Uploading...') : t('projectDetail.documents.fromLibrary', 'From Library')}
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
                        <h3 className="font-medium">{t('projectDetail.documents.missedUnits', 'Missed Units')}</h3>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {missedUnitPhotos.length} {missedUnitPhotos.length === 1 ? t('projectDetail.documents.unit', 'unit') : t('projectDetail.documents.unitsPlural', 'units')}
                      </Badge>
                    </div>
                    
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {t('projectDetail.documents.missedUnitsDescription', 'Photos of units that were missed during the initial sweep and need to be addressed')}
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
                                {t('projectDetail.documents.unit', 'Unit')} {photo.missedUnitNumber}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-3 border-t border-orange-200 bg-orange-50">
                            <div className="font-medium text-sm">{t('projectDetail.documents.unit', 'Unit')} {photo.missedUnitNumber}</div>
                            {photo.comment && (
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {photo.comment}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(new Date(photo.createdAt), "MMM d, yyyy 'at' h:mm a", { locale: getDateLocale() })}
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
                        <h3 className="font-medium">{t('projectDetail.documents.missedStalls', 'Missed Stalls')}</h3>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {missedStallPhotos.length} {missedStallPhotos.length === 1 ? t('projectDetail.documents.stall', 'stall') : t('projectDetail.documents.stallsPlural', 'stalls')}
                      </Badge>
                    </div>
                    
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {t('projectDetail.documents.missedStallsDescription', 'Photos of parking stalls that were missed during the initial sweep and need to be addressed')}
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
                                {t('projectDetail.documents.stall', 'Stall')} {photo.missedStallNumber}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-3 border-t border-orange-200 bg-orange-50">
                            <div className="font-medium text-sm">{t('projectDetail.documents.stall', 'Stall')} {photo.missedStallNumber}</div>
                            {photo.comment && (
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {photo.comment}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(new Date(photo.createdAt), "MMM d, yyyy 'at' h:mm a", { locale: getDateLocale() })}
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
                  <h3 className="font-medium">{t('projectDetail.toolbox.title', 'Toolbox Meetings')}</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {toolboxMeetings.length} {toolboxMeetings.length === 1 ? t('projectDetail.toolbox.meeting', 'meeting') : t('projectDetail.toolbox.meetingsPlural', 'meetings')}
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
                              {format(parseLocalDate(meeting.meetingDate), 'MMMM d, yyyy', { locale: getDateLocale() })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t('projectDetail.toolbox.conductedBy', 'Conducted by')}: {meeting.conductedByName}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {meeting.attendees?.length || 0} {t('projectDetail.toolbox.attendees', 'attendees')}
                          </Badge>
                        </div>
                        {meeting.customTopic && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('projectDetail.toolbox.custom', 'Custom')}: {meeting.customTopic}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

            </div>

            <Separator />

            {/* FLHA Forms Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-orange-600 dark:text-orange-400">warning</span>
                  <h3 className="font-medium">{t('projectDetail.flha.title', 'FLHA Forms')}</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {flhaForms.length} {flhaForms.length === 1 ? t('projectDetail.flha.form', 'form') : t('projectDetail.flha.formsPlural', 'forms')}
                </Badge>
              </div>

              {/* FLHA List */}
              {flhaForms.length > 0 && (
                <div className="space-y-2">
                  {flhaForms.slice(0, 3).map((flha: any) => (
                    <Card
                      key={flha.id}
                      className="hover-elevate"
                      data-testid={`flha-form-${flha.id}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">
                              {format(parseLocalDate(flha.assessmentDate), 'MMMM d, yyyy', { locale: getDateLocale() })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t('projectDetail.flha.assessor', 'Assessor')}: {flha.assessorName}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20">
                            {t('projectDetail.flha.completed', 'Completed')}
                          </Badge>
                        </div>
                        {flha.location && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('projectDetail.flha.location', 'Location')}: {flha.location}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {flhaForms.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{flhaForms.length - 3} {t('projectDetail.flha.more', 'more forms')}
                    </p>
                  )}
                </div>
              )}
            </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Resident Feedback Card */}
        <Card className="glass-card border-0 shadow-premium">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base">{t('projectDetail.feedback.title', 'Resident Feedback')}</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {complaintMetricsData?.metrics?.averageResolutionMs && (
                  <Badge variant="outline" className="text-xs gap-1" data-testid="badge-avg-resolution-time">
                    <span className="material-icons text-sm">schedule</span>
                    {t('projectDetail.feedback.avgResolution', 'Avg')}: {formatDurationMs(complaintMetricsData.metrics.averageResolutionMs)}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {complaints.length} {complaints.length === 1 ? t('projectDetail.feedback.item', 'item') : t('projectDetail.feedback.itemsPlural', 'items')}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
              
              {complaints.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm border rounded-lg">
                  {t('projectDetail.feedback.noFeedback', 'No feedback received yet')}
                </div>
              ) : (
                <div className="space-y-2">
                  {complaints.map((complaint: any) => {
                    const status = complaint.status;
                    const isViewed = complaint.viewedAt !== null;
                    
                    let statusBadge;
                    if (status === 'closed') {
                      statusBadge = <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-xs">{t('projectDetail.feedback.closed', 'Closed')}</Badge>;
                    } else if (isViewed) {
                      statusBadge = <Badge variant="secondary" className="bg-primary/50/10 text-primary dark:text-primary border-primary/50/20 text-xs">{t('projectDetail.feedback.viewed', 'Viewed')}</Badge>;
                    } else {
                      statusBadge = <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 text-xs">{t('projectDetail.feedback.new', 'New')}</Badge>;
                    }
                    
                    return (
                      <Card 
                        key={complaint.id}
                        className="hover-elevate cursor-pointer"
                        onClick={() => setLocation(`/complaints/${complaint.id}`)}
                        data-testid={`feedback-card-${complaint.id}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{complaint.residentName}</div>
                              <div className="text-xs text-muted-foreground">{t('projectDetail.documents.unit', 'Unit')} {complaint.unitNumber}</div>
                            </div>
                            {statusBadge}
                          </div>
                          <p className="text-sm line-clamp-2 mb-2">{complaint.message}</p>
                          {complaint.photoUrl && (
                            <div className="mb-2">
                              <img 
                                src={complaint.photoUrl} 
                                alt="Feedback photo" 
                                className="w-full max-w-xs rounded-lg border"
                              />
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {formatTimestampDate(complaint.createdAt)}
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
              <CardTitle className="text-base">{t('projectDetail.comments.title', 'Job Comments')}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {jobComments.length} {jobComments.length === 1 ? t('projectDetail.comments.comment', 'comment') : t('projectDetail.comments.commentsPlural', 'comments')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">

              {/* Comment Form */}
              <div className="space-y-2">
                <Textarea
                  placeholder={t('projectDetail.comments.placeholder', 'Add a comment about this project...')}
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
                  {createCommentMutation.isPending ? t('projectDetail.comments.posting', 'Posting...') : t('projectDetail.comments.postComment', 'Post Comment')}
                </Button>
              </div>

              {/* Comments List */}
              {jobComments.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm border rounded-lg">
                  {t('projectDetail.comments.noComments', 'No comments yet. Be the first to comment!')}
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

        {/* Work Notices - Management Only */}
        {isManagement && project && (
          <Card className="glass-card border-0 shadow-premium">
            <CardContent className="pt-6">
              <WorkNoticeList projectId={project.id} project={project} />
            </CardContent>
          </Card>
        )}

        {/* Residents List - Management Only */}
        {isManagement && (
          <Card className="glass-card border-0 shadow-premium">
            <CardHeader>
              <CardTitle>{t('projectDetail.residents.title', 'Residents linked to project')} {project?.strataPlanNumber}</CardTitle>
            </CardHeader>
            <CardContent>
              {residents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {t('projectDetail.residents.noResidents', 'No residents linked to this project')}
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
              <CardTitle className="text-base">{t('projectDetail.actions.title', 'Project Actions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-2">{t('common.status', 'Status')}</div>
                <Badge variant={project.status === "active" ? "default" : "secondary"} className="capitalize">
                  {project.status === 'active' ? t('common.active', 'Active') : project.status === 'completed' ? t('common.completed', 'Completed') : project.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditJobType(project.jobType);
                    setEditAddressValue(project.buildingAddress || "");
                    setEditAddressCoords({ 
                      latitude: project.latitude ? parseFloat(project.latitude) : null, 
                      longitude: project.longitude ? parseFloat(project.longitude) : null 
                    });
                    setShowEditDialog(true);
                  }}
                  className="w-full h-12"
                  data-testid="button-edit-project-action"
                >
                  <span className="material-icons mr-2">edit</span>
                  {t('projectDetail.actions.editProject', 'Edit Project')}
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
                    {completeProjectMutation.isPending ? t('projectDetail.actions.completing', 'Completing...') : t('projectDetail.actions.completeProject', 'Complete Project')}
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
                    {reopenProjectMutation.isPending ? t('projectDetail.actions.reopening', 'Reopening...') : t('projectDetail.actions.reopenProject', 'Reopen Project')}
                  </Button>
                )}

                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full h-12"
                  data-testid="button-delete-project"
                >
                  <span className="material-icons mr-2">delete</span>
                  {t('projectDetail.actions.deleteProject', 'Delete Project')}
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
            <AlertDialogTitle>{t('projectDetail.dialogs.deleteProject.title', 'Delete Project')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('projectDetail.dialogs.deleteProject.description', 'Are you sure you want to delete this project? This will permanently remove all associated work sessions, drop logs, and feedback. This action cannot be undone.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-project">{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProjectMutation.mutate(project.id)}
              data-testid="button-confirm-delete-project"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('projectDetail.actions.deleteProject', 'Delete Project')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Harness Inspection Check Dialog */}
      <AlertDialog open={showHarnessInspectionDialog} onOpenChange={setShowHarnessInspectionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('projectDetail.dialogs.harnessInspection.title', 'Daily Harness Inspection Complete?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('projectDetail.dialogs.harnessInspection.description', 'Before starting your work session, please confirm if your daily harness inspection has been completed.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => createNotApplicableInspectionMutation.mutate()}
              disabled={createNotApplicableInspectionMutation.isPending}
              data-testid="button-harness-not-applicable"
            >
              {createNotApplicableInspectionMutation.isPending ? t('projectDetail.dialogs.harnessInspection.recording', 'Recording...') : t('projectDetail.dialogs.harnessInspection.notApplicable', 'Not Applicable')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowHarnessInspectionDialog(false);
                setLocation(`/harness-inspection?projectId=${id}`);
              }}
              data-testid="button-harness-no"
            >
              {t('common.no', 'No')}
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setShowHarnessInspectionDialog(false);
                if (id) {
                  startDayMutation.mutate(id);
                }
              }}
              disabled={startDayMutation.isPending}
              data-testid="button-harness-yes"
            >
              {startDayMutation.isPending ? t('projectDetail.workSession.starting', 'Starting...') : t('common.yes', 'Yes')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Start Day Confirmation Dialog */}
      <AlertDialog open={showStartDayDialog} onOpenChange={setShowStartDayDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('projectDetail.dialogs.startSession.title', 'Start Work Session?')}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                {t('projectDetail.dialogs.startSession.description', 'This will begin tracking your work session for {{buildingName}}. You can log drops throughout the day and end your session when finished.', { buildingName: project.buildingName })}
              </span>
              {hasHarnessInspectionToday && (
                <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                  <span className="material-icons text-sm">check_circle</span>
                  {t('projectDetail.dialogs.startSession.harnessInspectionDone', 'Harness inspection already completed today')}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-start-day">{t('common.cancel', 'Cancel')}</AlertDialogCancel>
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
              {startDayMutation.isPending ? t('projectDetail.workSession.starting', 'Starting...') : t('projectDetail.workSession.startSession', 'Start Work Session')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick Create Work Notice Dialog */}
      {project && (
        <Dialog open={showQuickNoticeForm} onOpenChange={setShowQuickNoticeForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <WorkNoticeForm
              project={project}
              onClose={() => setShowQuickNoticeForm(false)}
              onSuccess={() => {
                setShowQuickNoticeForm(false);
                queryClient.invalidateQueries({ queryKey: ["/api/projects", project.id, "work-notices"] });
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Photo Upload Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={(open) => !open && handlePhotoDialogCancel()}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-photo-upload">
          <DialogHeader>
            <DialogTitle>{t('projectDetail.dialogs.uploadPhoto.title', 'Upload Photo')}</DialogTitle>
            <DialogDescription>
              {project.jobType === 'parkade_pressure_cleaning' 
                ? t('projectDetail.dialogs.uploadPhoto.parkadeDescription', 'Add parking stall number and comment to help residents identify their work.')
                : t('projectDetail.dialogs.uploadPhoto.unitDescription', 'Add unit number and comment to help residents identify their work.')}
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
                    {t('projectDetail.dialogs.uploadPhoto.markAsMissedUnit', 'Mark as Missed Unit')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('projectDetail.dialogs.uploadPhoto.missedUnitHint', 'Check this if the photo shows a unit that was missed during the initial sweep')}
                  </p>
                </div>
              </div>
            )}
            
            {isMissedUnit && project.jobType === 'in_suite_dryer_vent_cleaning' && (
              <div className="space-y-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <Label htmlFor="missedUnitNumber">{t('projectDetail.dialogs.uploadPhoto.missedUnitNumber', 'Missed Unit Number')} *</Label>
                <Input
                  id="missedUnitNumber"
                  placeholder={t('projectDetail.dialogs.uploadPhoto.unitNumberPlaceholder', 'e.g., 301, 1205')}
                  value={missedUnitNumber}
                  onChange={(e) => setMissedUnitNumber(e.target.value)}
                  data-testid="input-missed-unit-number"
                />
                <p className="text-xs text-muted-foreground">
                  {t('projectDetail.dialogs.uploadPhoto.enterMissedUnitNumber', 'Enter the unit number for the missed unit')}
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
                    {t('projectDetail.dialogs.uploadPhoto.markAsMissedStall', 'Mark as Missed Stall')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('projectDetail.dialogs.uploadPhoto.missedStallHint', 'Check this if the photo shows a stall that was missed during the initial sweep')}
                  </p>
                </div>
              </div>
            )}
            
            {isMissedStall && project.jobType === 'parkade_pressure_cleaning' && (
              <div className="space-y-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <Label htmlFor="missedStallNumber">{t('projectDetail.dialogs.uploadPhoto.missedStallNumber', 'Missed Stall Number')} *</Label>
                <Input
                  id="missedStallNumber"
                  placeholder={t('projectDetail.dialogs.uploadPhoto.stallNumberPlaceholder', 'e.g., 42, 101, A-5')}
                  value={missedStallNumber}
                  onChange={(e) => setMissedStallNumber(e.target.value)}
                  data-testid="input-missed-stall-number"
                />
                <p className="text-xs text-muted-foreground">
                  {t('projectDetail.dialogs.uploadPhoto.enterMissedStallNumber', 'Enter the stall number for the missed parking stall')}
                </p>
              </div>
            )}
            
            {!isMissedUnit && !isMissedStall && (
              <div className="space-y-2">
                <Label htmlFor="unitNumber">
                  {project.jobType === 'parkade_pressure_cleaning' ? t('projectDetail.dialogs.uploadPhoto.parkingStallNumber', 'Parking Stall Number (Optional)') : t('projectDetail.dialogs.uploadPhoto.unitNumber', 'Unit Number (Optional)')}
                </Label>
                <Input
                  id="unitNumber"
                  placeholder={project.jobType === 'parkade_pressure_cleaning' ? t('projectDetail.dialogs.uploadPhoto.parkingStallPlaceholder', 'e.g., 42, A-5, P1-23') : t('projectDetail.dialogs.uploadPhoto.unitPlaceholder', 'e.g., 301, 1205')}
                  value={photoUnitNumber}
                  onChange={(e) => setPhotoUnitNumber(e.target.value)}
                  data-testid="input-unit-number"
                />
                <p className="text-xs text-muted-foreground">
                  {project.jobType === 'parkade_pressure_cleaning' 
                    ? t('projectDetail.dialogs.uploadPhoto.parkingStallHelp', 'Enter the parking stall number if this photo is specific to a resident\'s stall.')
                    : t('projectDetail.dialogs.uploadPhoto.unitHelp', 'Enter the unit number if this photo is specific to a resident\'s suite.')}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="comment">{t('projectDetail.dialogs.uploadPhoto.comment', 'Comment (Optional)')}</Label>
              <Textarea
                id="comment"
                placeholder={t('projectDetail.dialogs.uploadPhoto.commentPlaceholder', 'e.g., Before cleaning, After cleaning, Window detail')}
                value={photoComment}
                onChange={(e) => setPhotoComment(e.target.value)}
                rows={3}
                data-testid="input-photo-comment"
              />
              <p className="text-xs text-muted-foreground">
                {t('projectDetail.dialogs.uploadPhoto.commentHelp', 'Add a description or note about this photo.')}
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePhotoDialogCancel}
              data-testid="button-cancel-upload"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handlePhotoDialogSubmit}
              disabled={!selectedFile}
              data-testid="button-submit-upload"
            >
              {t('projectDetail.dialogs.uploadPhoto.upload', 'Upload Photo')}
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
                    <div className="font-medium">{t('projectDetail.documents.unit', 'Unit')} {selectedPhoto.unitNumber}</div>
                  )}
                  {selectedPhoto.comment && (
                    <div className="text-sm text-white/90">{selectedPhoto.comment}</div>
                  )}
                  <div className="text-xs text-white/70">
                    {t('projectDetail.dialogs.photoViewer.uploaded', 'Uploaded')} {format(new Date(selectedPhoto.createdAt), "MMM d, yyyy 'at' h:mm a")}
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
              {t('projectDetail.dialogs.editProject.title', 'Edit Project')}
            </DialogTitle>
            <DialogDescription>
              {t('projectDetail.dialogs.editProject.description', 'Update project details')}
            </DialogDescription>
          </DialogHeader>
          {project && (
            <form key={`edit-project-${project.id}-${project.dropsAdjustmentNorth}-${project.dropsAdjustmentEast}-${project.dropsAdjustmentSouth}-${project.dropsAdjustmentWest}`} onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              try {
                const jobType = formData.get('jobType') as string;
                const isDropBased = !['in_suite_dryer_vent_cleaning', 'parkade_pressure_cleaning', 'ground_window_cleaning'].includes(jobType);
                
                const updateData: any = {
                  buildingName: formData.get('buildingName'),
                  buildingAddress: editAddressValue || formData.get('buildingAddress') || undefined,
                  strataPlanNumber: formData.get('strataPlanNumber'),
                  jobType: formData.get('jobType'),
                  targetCompletionDate: formData.get('targetCompletionDate') || undefined,
                  estimatedHours: formData.get('estimatedHours') ? parseInt(formData.get('estimatedHours') as string) : undefined,
                  buildingHeight: formData.get('buildingHeight') || undefined,
                  startDate: formData.get('startDate') || undefined,
                  endDate: formData.get('endDate') || undefined,
                  // Include coordinates from address autocomplete - convert to strings for drizzle numeric type
                  latitude: editAddressCoords.latitude !== null ? String(editAddressCoords.latitude) : undefined,
                  longitude: editAddressCoords.longitude !== null ? String(editAddressCoords.longitude) : undefined,
                };
                
                // Add drop-based fields
                if (isDropBased) {
                  updateData.totalDropsNorth = formData.get('totalDropsNorth') ? parseInt(formData.get('totalDropsNorth') as string) : 0;
                  updateData.totalDropsEast = formData.get('totalDropsEast') ? parseInt(formData.get('totalDropsEast') as string) : 0;
                  updateData.totalDropsSouth = formData.get('totalDropsSouth') ? parseInt(formData.get('totalDropsSouth') as string) : 0;
                  updateData.totalDropsWest = formData.get('totalDropsWest') ? parseInt(formData.get('totalDropsWest') as string) : 0;
                  updateData.dailyDropTarget = formData.get('dailyDropTarget') ? parseInt(formData.get('dailyDropTarget') as string) : 0;
                  // Set completed drops - calculate adjustment based on absolute value entered
                  // sessionTotal = completedDrops - currentAdjustment
                  // If user enters value X, we need adjustment so that sessionTotal + adjustment = X
                  // Therefore: adjustment = X - sessionTotal
                  const sessionNorth = completedDropsNorth - (project.dropsAdjustmentNorth ?? 0);
                  const sessionEast = completedDropsEast - (project.dropsAdjustmentEast ?? 0);
                  const sessionSouth = completedDropsSouth - (project.dropsAdjustmentSouth ?? 0);
                  const sessionWest = completedDropsWest - (project.dropsAdjustmentWest ?? 0);
                  
                  const setNorthVal = formData.get('setCompletedNorth') as string;
                  const setEastVal = formData.get('setCompletedEast') as string;
                  const setSouthVal = formData.get('setCompletedSouth') as string;
                  const setWestVal = formData.get('setCompletedWest') as string;
                  
                  // Only update adjustment if user entered a value (non-empty)
                  if (setNorthVal !== '' && setNorthVal !== null) {
                    updateData.dropsAdjustmentNorth = parseInt(setNorthVal) - sessionNorth;
                  }
                  if (setEastVal !== '' && setEastVal !== null) {
                    updateData.dropsAdjustmentEast = parseInt(setEastVal) - sessionEast;
                  }
                  if (setSouthVal !== '' && setSouthVal !== null) {
                    updateData.dropsAdjustmentSouth = parseInt(setSouthVal) - sessionSouth;
                  }
                  if (setWestVal !== '' && setWestVal !== null) {
                    updateData.dropsAdjustmentWest = parseInt(setWestVal) - sessionWest;
                  }
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
                
                // Wait for queries to refetch before closing dialog so UI updates immediately
                await queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
                await queryClient.refetchQueries({ queryKey: ["/api/projects", id] });
                toast({ title: t('projectDetail.dialogs.editProject.updateSuccess', 'Project updated successfully') });
                setShowEditDialog(false);
              } catch (error) {
                toast({ 
                  title: t('projectDetail.dialogs.editProject.updateFailed', 'Update failed'), 
                  description: error instanceof Error ? error.message : t('projectDetail.toasts.error', 'Failed to update project'),
                  variant: "destructive" 
                });
              }
            }}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="buildingName">{t('projectDetail.dialogs.editProject.buildingName', 'Building Name')}</Label>
                  <Input
                    id="buildingName"
                    name="buildingName"
                    defaultValue={project.buildingName}
                    required
                    data-testid="input-edit-building-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="buildingAddress">{t('projectDetail.dialogs.editProject.buildingAddress', 'Building Address')}</Label>
                  <AddressAutocomplete
                    data-testid="input-edit-building-address"
                    placeholder={t('projectDetail.dialogs.editProject.buildingAddressPlaceholder', 'Start typing address...')}
                    value={editAddressValue || project.buildingAddress || ""}
                    onChange={(value) => setEditAddressValue(value)}
                    onSelect={(address) => {
                      setEditAddressValue(address.formatted);
                      setEditAddressCoords({ latitude: address.latitude, longitude: address.longitude });
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="strataPlanNumber">{t('projectDetail.dialogs.editProject.strataPlanNumber', 'Strata Plan Number')}</Label>
                  <Input
                    id="strataPlanNumber"
                    name="strataPlanNumber"
                    defaultValue={project.strataPlanNumber}
                    required
                    data-testid="input-edit-strata-plan"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('projectDetail.dialogs.editProject.strataPlanHelp', 'Links residents to this project')}
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="jobType">{t('projectDetail.dialogs.editProject.jobType', 'Job Type')}</Label>
                  <select
                    id="jobType"
                    name="jobType"
                    defaultValue={project.jobType}
                    onChange={(e) => setEditJobType(e.target.value)}
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    data-testid="select-edit-job-type"
                  >
                    <option value="window_cleaning">{t('projectDetail.jobTypes.windowCleaning', 'Window Cleaning (4-Elevation)')}</option>
                    <option value="building_wash">{t('projectDetail.jobTypes.buildingWash', 'Building Wash - Pressure washing (4-Elevation)')}</option>
                    <option value="dryer_vent_cleaning">{t('projectDetail.jobTypes.dryerVentCleaning', 'Dryer Vent Cleaning (4-Elevation)')}</option>
                    <option value="in_suite_dryer_vent_cleaning">{t('projectDetail.jobTypes.inSuiteDryerVent', 'In-Suite Dryer Vent Cleaning')}</option>
                    <option value="parkade_pressure_cleaning">{t('projectDetail.jobTypes.parkadePressureCleaning', 'Parkade Pressure Cleaning')}</option>
                    <option value="ground_window_cleaning">{t('projectDetail.jobTypes.groundWindowCleaning', 'Ground Level Window Cleaning')}</option>
                  </select>
                </div>
                
                {/* Drop-based fields (4-elevation jobs) */}
                {(!editJobType ? !['in_suite_dryer_vent_cleaning', 'parkade_pressure_cleaning', 'ground_window_cleaning'].includes(project.jobType) : !['in_suite_dryer_vent_cleaning', 'parkade_pressure_cleaning', 'ground_window_cleaning'].includes(editJobType)) && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="totalDropsNorth">{t('projectDetail.directions.northDrops', 'North Drops')}</Label>
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
                        <Label htmlFor="totalDropsEast">{t('projectDetail.directions.eastDrops', 'East Drops')}</Label>
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
                        <Label htmlFor="totalDropsSouth">{t('projectDetail.directions.southDrops', 'South Drops')}</Label>
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
                        <Label htmlFor="totalDropsWest">{t('projectDetail.directions.westDrops', 'West Drops')}</Label>
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
                      <Label htmlFor="dailyDropTarget">{t('projectDetail.dialogs.editProject.dailyDropTarget', 'Daily Drop Target')}</Label>
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
                        {t('projectDetail.dialogs.editProject.dailyDropTargetHelp', 'Drops per technician per day')}
                      </p>
                    </div>
                    
                    <div className="border-t pt-4 mt-2">
                      <h4 className="font-medium text-sm mb-2">{t('projectDetail.dialogs.editProject.completedDropsSection', 'Completed Drops (from work sessions)')}</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        {t('projectDetail.dialogs.editProject.completedDropsHelp', 'Raw drops logged by employees. Use adjustments below to correct mistakes.')}
                      </p>
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="text-center p-2 bg-muted/50 rounded-md">
                          <div className="text-xs text-muted-foreground">{t('projectDetail.directions.north', 'North')}</div>
                          <div className="text-lg font-bold" data-testid="display-completed-north">{completedDropsNorth - (project.dropsAdjustmentNorth ?? 0)}</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded-md">
                          <div className="text-xs text-muted-foreground">{t('projectDetail.directions.east', 'East')}</div>
                          <div className="text-lg font-bold" data-testid="display-completed-east">{completedDropsEast - (project.dropsAdjustmentEast ?? 0)}</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded-md">
                          <div className="text-xs text-muted-foreground">{t('projectDetail.directions.south', 'South')}</div>
                          <div className="text-lg font-bold" data-testid="display-completed-south">{completedDropsSouth - (project.dropsAdjustmentSouth ?? 0)}</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded-md">
                          <div className="text-xs text-muted-foreground">{t('projectDetail.directions.west', 'West')}</div>
                          <div className="text-lg font-bold" data-testid="display-completed-west">{completedDropsWest - (project.dropsAdjustmentWest ?? 0)}</div>
                        </div>
                      </div>
                      <h4 className="font-medium text-sm mb-2">{t('projectDetail.dialogs.editProject.setCompleted', 'Set Completed Drops')}</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        {t('projectDetail.dialogs.editProject.setCompletedHelp', 'Enter the new total completed drops for each direction. Leave empty to keep current value.')}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="setCompletedNorth">{t('projectDetail.directions.setNorth', 'Set North')}</Label>
                          <Input
                            id="setCompletedNorth"
                            name="setCompletedNorth"
                            type="number"
                            min="0"
                            placeholder={String(completedDropsNorth)}
                            data-testid="input-edit-set-north"
                          />
                        </div>
                        <div>
                          <Label htmlFor="setCompletedEast">{t('projectDetail.directions.setEast', 'Set East')}</Label>
                          <Input
                            id="setCompletedEast"
                            name="setCompletedEast"
                            type="number"
                            min="0"
                            placeholder={String(completedDropsEast)}
                            data-testid="input-edit-set-east"
                          />
                        </div>
                        <div>
                          <Label htmlFor="setCompletedSouth">{t('projectDetail.directions.setSouth', 'Set South')}</Label>
                          <Input
                            id="setCompletedSouth"
                            name="setCompletedSouth"
                            type="number"
                            min="0"
                            placeholder={String(completedDropsSouth)}
                            data-testid="input-edit-set-south"
                          />
                        </div>
                        <div>
                          <Label htmlFor="setCompletedWest">{t('projectDetail.directions.setWest', 'Set West')}</Label>
                          <Input
                            id="setCompletedWest"
                            name="setCompletedWest"
                            type="number"
                            min="0"
                            placeholder={String(completedDropsWest)}
                            data-testid="input-edit-set-west"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* In-suite fields */}
                {(!editJobType ? project.jobType === 'in_suite_dryer_vent_cleaning' : editJobType === 'in_suite_dryer_vent_cleaning') && (
                  <>
                    <div>
                      <Label htmlFor="totalFloors">{t('projectDetail.progress.totalFloors', 'Total Floors')}</Label>
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
                      <Label htmlFor="floorsPerDay">{t('projectDetail.progress.floorsPerDay', 'Floors Per Day Target')}</Label>
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
                      <Label htmlFor="totalStalls">{t('projectDetail.progress.totalStalls', 'Total Stalls')}</Label>
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
                      <Label htmlFor="stallsPerDay">{t('projectDetail.progress.stallsPerDay', 'Stalls Per Day Target')}</Label>
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
                  <Label htmlFor="targetCompletionDate">{t('projectDetail.dialogs.editProject.targetCompletionDate', 'Target Completion Date')}</Label>
                  <Input
                    id="targetCompletionDate"
                    name="targetCompletionDate"
                    type="date"
                    defaultValue={project.targetCompletionDate || ""}
                    data-testid="input-edit-target-date"
                  />
                </div>
                
                <div>
                  <Label htmlFor="estimatedHours">{t('projectDetail.dialogs.editProject.estimatedHours', 'Estimated Hours')}</Label>
                  <Input
                    id="estimatedHours"
                    name="estimatedHours"
                    type="number"
                    min="1"
                    placeholder={t('projectDetail.dialogs.editProject.estimatedHoursPlaceholder', 'Total estimated hours')}
                    defaultValue={project.estimatedHours || ""}
                    data-testid="input-edit-estimated-hours"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('projectDetail.dialogs.editProject.estimatedHoursHelp', 'Total hours estimated for the entire project')}
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="buildingHeight">{t('projectDetail.dialogs.editProject.buildingHeight', 'Building Height')}</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="buildingHeight"
                      name="buildingHeight"
                      type="text"
                      placeholder={t('projectDetail.dialogs.editProject.buildingHeightPlaceholder', 'e.g., 100m or 300ft')}
                      defaultValue={project.buildingHeight || ""}
                      data-testid="input-edit-building-height"
                      onChange={(e) => {
                        const value = e.target.value;
                        const conversionEl = document.getElementById('height-conversion');
                        if (conversionEl) {
                          const metersMatch = value.match(/^(\d+(?:\.\d+)?)\s*m$/i);
                          const feetMatch = value.match(/^(\d+(?:\.\d+)?)\s*ft$/i);
                          if (metersMatch) {
                            const meters = parseFloat(metersMatch[1]);
                            const feet = Math.round(meters / 0.3048);
                            conversionEl.textContent = `= ${feet}ft`;
                          } else if (feetMatch) {
                            const feet = parseFloat(feetMatch[1]);
                            const meters = Math.round(feet * 0.3048);
                            conversionEl.textContent = `= ${meters}m`;
                          } else {
                            conversionEl.textContent = '';
                          }
                        }
                      }}
                    />
                    {project.floorCount && project.floorCount > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const floors = project.floorCount || 0;
                          const feet = floors * 9;
                          const meters = Math.round(feet * 0.3048);
                          const input = document.getElementById('buildingHeight') as HTMLInputElement;
                          if (input) {
                            input.value = `${feet}ft (${meters}m)`;
                          }
                        }}
                        className="whitespace-nowrap"
                        data-testid="button-calculate-height-edit"
                      >
                        <Calculator className="w-4 h-4 mr-1" />
                        {t('projectDetail.dialogs.editProject.calculateHeight', 'Calculate')}
                      </Button>
                    )}
                  </div>
                  <p id="height-conversion" className="text-sm text-muted-foreground font-medium mt-1"></p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium text-foreground">{t('projectDetail.dialogs.editProject.buildingHeightImportant', 'Important for technicians:')}</span>{' '}
                    {t('projectDetail.dialogs.editProject.buildingHeightExplain', 'Building height is required for IRATA logbook entries to track work at height for certification.')}
                  </p>
                  {project.floorCount && project.floorCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {t('projectDetail.dialogs.editProject.buildingHeightCalcHint', 'Click Calculate to estimate height from floor count (floors × 9ft)')}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="startDate">{t('projectDetail.dialogs.editProject.startDate', 'Start Date')}</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      defaultValue={project.startDate || ""}
                      data-testid="input-edit-start-date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">{t('projectDetail.dialogs.editProject.endDate', 'End Date')}</Label>
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
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button type="submit" data-testid="button-save-project">
                  {t('projectDetail.dialogs.editProject.save', 'Save Changes')}
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
              {t('projectDetail.toolboxMeetings.detailsTitle', 'Toolbox Meeting Details')}
            </DialogTitle>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{t('projectDetail.toolboxMeetings.date', 'Date')}</div>
                  <div className="text-base">
                    {format(parseLocalDate(selectedMeeting.meetingDate), 'EEEE, MMMM d, yyyy', { locale: getDateLocale() })}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{t('projectDetail.toolboxMeetings.conductedBy', 'Conducted By')}</div>
                  <div className="text-base">{selectedMeeting.conductedByName}</div>
                </div>
              </div>

              {selectedMeeting.customTopic && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">{t('projectDetail.toolboxMeetings.customTopic', 'Custom Topic')}</div>
                  <div className="text-base bg-muted p-3 rounded-md">
                    {selectedMeeting.customTopic}
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">{t('projectDetail.toolboxMeetings.topicsCovered', 'Topics Covered')}</div>
                <div className="flex flex-wrap gap-2">
                  {selectedMeeting.topicFallProtection && <Badge>{t('projectDetail.toolboxMeetings.topics.fallProtection', 'Fall Protection Systems')}</Badge>}
                  {selectedMeeting.topicAnchorPoints && <Badge>{t('projectDetail.toolboxMeetings.topics.anchorPoints', 'Anchor Point Selection')}</Badge>}
                  {selectedMeeting.topicRopeInspection && <Badge>{t('projectDetail.toolboxMeetings.topics.ropeInspection', 'Rope Inspection')}</Badge>}
                  {selectedMeeting.topicKnotTying && <Badge>{t('projectDetail.toolboxMeetings.topics.knotTying', 'Knot Tying Techniques')}</Badge>}
                  {selectedMeeting.topicPPECheck && <Badge>{t('projectDetail.toolboxMeetings.topics.ppeCheck', 'PPE Inspection')}</Badge>}
                  {selectedMeeting.topicWeatherConditions && <Badge>{t('projectDetail.toolboxMeetings.topics.weatherConditions', 'Weather Assessment')}</Badge>}
                  {selectedMeeting.topicCommunication && <Badge>{t('projectDetail.toolboxMeetings.topics.communication', 'Communication Protocols')}</Badge>}
                  {selectedMeeting.topicEmergencyEvacuation && <Badge>{t('projectDetail.toolboxMeetings.topics.emergencyEvacuation', 'Emergency Procedures')}</Badge>}
                  {selectedMeeting.topicHazardAssessment && <Badge>{t('projectDetail.toolboxMeetings.topics.hazardAssessment', 'Hazard Assessment')}</Badge>}
                  {selectedMeeting.topicLoadCalculations && <Badge>{t('projectDetail.toolboxMeetings.topics.loadCalculations', 'Load Calculations')}</Badge>}
                  {selectedMeeting.topicEquipmentCompatibility && <Badge>{t('projectDetail.toolboxMeetings.topics.equipmentCompatibility', 'Equipment Compatibility')}</Badge>}
                  {selectedMeeting.topicDescenderAscender && <Badge>{t('projectDetail.toolboxMeetings.topics.descenderAscender', 'Descender/Ascender Use')}</Badge>}
                  {selectedMeeting.topicEdgeProtection && <Badge>{t('projectDetail.toolboxMeetings.topics.edgeProtection', 'Edge Protection')}</Badge>}
                  {selectedMeeting.topicSwingFall && <Badge>{t('projectDetail.toolboxMeetings.topics.swingFall', 'Swing Fall Hazards')}</Badge>}
                  {selectedMeeting.topicMedicalFitness && <Badge>{t('projectDetail.toolboxMeetings.topics.medicalFitness', 'Medical Fitness')}</Badge>}
                  {selectedMeeting.topicToolDropPrevention && <Badge>{t('projectDetail.toolboxMeetings.topics.toolDropPrevention', 'Tool Drop Prevention')}</Badge>}
                  {selectedMeeting.topicRegulations && <Badge>{t('projectDetail.toolboxMeetings.topics.regulations', 'Working at Heights Regulations')}</Badge>}
                  {selectedMeeting.topicRescueProcedures && <Badge>{t('projectDetail.toolboxMeetings.topics.rescueProcedures', 'Rescue Procedures')}</Badge>}
                  {selectedMeeting.topicSiteHazards && <Badge>{t('projectDetail.toolboxMeetings.topics.siteHazards', 'Site-Specific Hazards')}</Badge>}
                  {selectedMeeting.topicBuddySystem && <Badge>{t('projectDetail.toolboxMeetings.topics.buddySystem', 'Buddy System')}</Badge>}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {t('projectDetail.toolboxMeetings.attendees', 'Attendees')} ({selectedMeeting.attendees?.length || 0})
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
                  <div className="text-sm font-medium text-muted-foreground mb-1">{t('projectDetail.toolboxMeetings.additionalNotes', 'Additional Notes')}</div>
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
            <AlertDialogTitle>{t('projectDetail.dialogs.startSession.title', 'Start Work Session?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('projectDetail.dialogs.startSession.descriptionSimple', 'This will begin tracking your work session for {{buildingName}}. You can end your session later when finished.', { buildingName: project.buildingName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-start-day">{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStartDay}
              data-testid="button-confirm-start-day"
              disabled={startDayMutation.isPending}
            >
              {startDayMutation.isPending ? t('projectDetail.workSession.starting', 'Starting...') : t('projectDetail.workSession.startSession', 'Start Work Session')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Day Dialog with Drop Count */}
      <Dialog open={showEndDayDialog} onOpenChange={setShowEndDayDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('projectDetail.dialogs.endDay.title', 'End Your Work Day')}</DialogTitle>
            <DialogDescription>
              {isPercentageBased
                ? t('projectDetail.dialogs.endDay.descriptionPercentage', 'End your work session for {{buildingName}}. If you are the last one to clock out today, you will be asked to update the overall project progress.', { buildingName: project.buildingName })
                : project.jobType === "in_suite_dryer_vent_cleaning" 
                ? t('projectDetail.dialogs.endDay.descriptionUnits', 'Enter the number of units you completed today for {{buildingName}}.', { buildingName: project.buildingName })
                : project.jobType === "parkade_pressure_cleaning"
                ? t('projectDetail.dialogs.endDay.descriptionStalls', 'Enter the number of stalls you cleaned today for {{buildingName}}.', { buildingName: project.buildingName })
                : t('projectDetail.dialogs.endDay.descriptionDrops', 'Enter the number of drops you completed today for {{buildingName}}.', { buildingName: project.buildingName })}
            </DialogDescription>
          </DialogHeader>

          <Form {...endDayForm}>
            <form onSubmit={endDayForm.handleSubmit(onEndDaySubmit)} className="space-y-4">
              {isPercentageBased ? (
                /* For percentage-based jobs, no input needed upfront - only the "last one out" will be prompted for overall progress after session ends */
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    {t('projectDetail.dialogs.endDay.percentageNote', 'Your work session will be recorded. Only the last person to clock out will update the project progress.')}
                  </p>
                </div>
              ) : project.jobType === "in_suite_dryer_vent_cleaning" ? (
                <FormField
                  control={endDayForm.control}
                  name="dropsCompletedNorth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('projectDetail.dialogs.endDay.unitsCompleted', 'Units Completed')}</FormLabel>
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
                      <FormLabel>{t('projectDetail.dialogs.endDay.stallsCompleted', 'Stalls Completed')}</FormLabel>
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
                      <FormLabel>{t('projectDetail.directions.north', 'North')}</FormLabel>
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
                      <FormLabel>{t('projectDetail.directions.east', 'East')}</FormLabel>
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
                      <FormLabel>{t('projectDetail.directions.south', 'South')}</FormLabel>
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
                      <FormLabel>{t('projectDetail.directions.west', 'West')}</FormLabel>
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
                const isPercentageBasedLocal = usesPercentageProgress(project.jobType, project.requiresElevation);
                const target = isInSuite || isParkade ? (project.suitesPerDay || project.stallsPerDay || 0) : project.dailyDropTarget;
                const isBelowTarget = totalDrops < target;

                return (
                  <>
                    {!isInSuite && !isParkade && !isPercentageBasedLocal && (
                      <div className="p-3 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground">{t('projectDetail.progress.totalDrops', 'Total Drops')}</div>
                        <div className="text-2xl font-bold">{totalDrops}</div>
                      </div>
                    )}

                    {isBelowTarget && !isPercentageBasedLocal && (
                      <>
                        <FormField
                          control={endDayForm.control}
                          name="validShortfallReasonCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('projectDetail.dialogs.endDay.validReasonLabel', 'Why was the daily target not met?')}</FormLabel>
                              <Select onValueChange={(value) => {
                                field.onChange(value);
                                // Clear shortfallReason when selecting a non-"other" valid reason
                                if (value && value !== 'other') {
                                  endDayForm.setValue('shortfallReason', '');
                                }
                              }} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-shortfall-reason">
                                    <SelectValue placeholder={t('projectDetail.dialogs.endDay.selectReason', 'Select a reason...')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {VALID_SHORTFALL_REASONS.map((reason) => (
                                    <SelectItem key={reason.code} value={reason.code} data-testid={`option-reason-${reason.code}`}>
                                      {reason.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t('projectDetail.dialogs.endDay.validReasonNote', 'Valid reasons (weather, safety, etc.) do not impact your performance score.')}
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {endDayForm.watch("validShortfallReasonCode") === "other" && (
                          <FormField
                            control={endDayForm.control}
                            name="shortfallReason"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('projectDetail.dialogs.endDay.shortfallReason', 'Please explain (Required)')}</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder={t('projectDetail.dialogs.endDay.shortfallPlaceholder', 'Explain why the daily target wasn\'t met...')}
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
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="flex-1 h-12"
                  data-testid="button-confirm-end-day"
                  disabled={endDayMutation.isPending}
                >
                  <span className="material-icons mr-2">stop_circle</span>
                  {endDayMutation.isPending ? t('projectDetail.workSession.ending', 'Ending...') : t('projectDetail.dialogs.endDay.confirm', 'End Day')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* "Last One Out" Progress Prompt Dialog */}
      <Dialog open={showProgressPrompt} onOpenChange={setShowProgressPrompt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">trending_up</span>
              {t('projectDetail.dialogs.progressPrompt.title', 'Update Project Progress')}
            </DialogTitle>
            <DialogDescription>
              {t('projectDetail.dialogs.progressPrompt.description', "You're the last one clocking out today. Please update the overall project completion.")}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Current Progress */}
            <div className="p-4 bg-muted rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{t('projectDetail.dialogs.progressPrompt.currentProgress', 'Current Progress')}</span>
                <span className="text-lg font-semibold">{currentOverallProgress}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${currentOverallProgress}%` }}
                />
              </div>
            </div>

            {/* New Progress Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('projectDetail.dialogs.progressPrompt.newProgress', 'New Overall Completion (%)')}
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newProgressValue}
                  onChange={(e) => setNewProgressValue(e.target.value)}
                  placeholder="0-100"
                  className="flex-1"
                  data-testid="input-new-progress"
                />
                <span className="text-lg font-semibold">%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('projectDetail.dialogs.progressPrompt.hint', 'Enter the overall project completion percentage (not just your contribution)')}
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleProgressSkip}
              disabled={updateProgressMutation.isPending}
              data-testid="button-skip-progress"
            >
              {t('projectDetail.dialogs.progressPrompt.skip', "Skip - I'm Not The Last One")}
            </Button>
            <Button
              type="button"
              onClick={handleProgressSubmit}
              disabled={updateProgressMutation.isPending || !newProgressValue}
              data-testid="button-submit-progress"
            >
              {updateProgressMutation.isPending ? (
                <span className="material-icons animate-spin mr-2 text-sm">refresh</span>
              ) : (
                <span className="material-icons mr-2 text-sm">check</span>
              )}
              {t('projectDetail.dialogs.progressPrompt.update', 'Update Progress')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Hours Prompt Dialog */}
      <Dialog open={showLogHoursPrompt} onOpenChange={setShowLogHoursPrompt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">schedule</span>
              {t('projectDetail.dialogs.logHoursPrompt.title', 'Log Your Hours?')}
            </DialogTitle>
            <DialogDescription>
              {t('projectDetail.dialogs.logHoursPrompt.description', 'Would you like to log the tasks you performed during this work session? This helps fill your IRATA logbook for certification tracking.')}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Session Summary */}
            <div className="p-4 bg-muted rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('projectDetail.dialogs.logHoursPrompt.hoursWorked', 'Hours Worked')}</span>
                <span className="text-lg font-semibold text-primary">{endedSessionData?.hoursWorked.toFixed(1)} hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('projectDetail.dialogs.logHoursPrompt.date', 'Date')}</span>
                <span className="font-medium">
                  {endedSessionData?.workDate ? format(parseLocalDate(endedSessionData.workDate), "MMM d, yyyy", { locale: getDateLocale() }) : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('projectDetail.dialogs.logHoursPrompt.building', 'Building')}</span>
                <span className="font-medium truncate max-w-[200px]">{endedSessionData?.buildingName || "-"}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              {t('projectDetail.dialogs.logHoursPrompt.reviewNote', 'Your logged hours can be reviewed anytime in "My Logged Hours" from your dashboard.')}
            </p>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDeclineLogHours}
              data-testid="button-decline-log-hours"
            >
              {t('projectDetail.dialogs.logHoursPrompt.notNow', 'Not Now')}
            </Button>
            <Button
              type="button"
              onClick={handleConfirmLogHours}
              data-testid="button-confirm-log-hours"
            >
              <span className="material-icons mr-2 text-sm">edit_note</span>
              {t('projectDetail.dialogs.logHoursPrompt.yesLogHours', 'Yes, Log Hours')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* IRATA Task Selection Dialog */}
      <Dialog open={showIrataTaskDialog} onOpenChange={(open) => {
        if (!open) handleSkipIrataTasks();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">assignment</span>
              {t('projectDetail.dialogs.irataTask.title', 'Log Your IRATA Tasks')}
            </DialogTitle>
            <DialogDescription>
              {t('projectDetail.dialogs.irataTask.description', 'Select all the rope access tasks you performed during this session at {{buildingName}}. This helps track your IRATA logbook hours for certification progression.', { buildingName: endedSessionData?.buildingName || t('projectDetail.dialogs.irataTask.thisBuilding', 'this building') })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Session Info */}
            <div className="flex flex-wrap gap-4 p-3 bg-muted rounded-md">
              <div>
                <div className="text-xs text-muted-foreground">{t('projectDetail.dialogs.logHoursPrompt.hoursWorked', 'Hours Worked')}</div>
                <div className="text-lg font-semibold">{endedSessionData?.hoursWorked.toFixed(1)} hrs</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t('projectDetail.dialogs.logHoursPrompt.date', 'Date')}</div>
                <div className="text-lg font-semibold">
                  {endedSessionData?.workDate ? format(parseLocalDate(endedSessionData.workDate), "MMM d, yyyy", { locale: getDateLocale() }) : "-"}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">{t('projectDetail.dialogs.logHoursPrompt.building', 'Building')}</div>
                <div className="text-sm font-medium truncate">{endedSessionData?.buildingName || "-"}</div>
              </div>
            </div>

            {/* Task Selection Grid */}
            <div>
              <Label className="text-sm font-medium mb-3 block">{t('projectDetail.dialogs.irataTask.selectTasks', 'Select Tasks Performed (click to select)')}</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {IRATA_TASK_TYPES.map((task) => {
                  const isSelected = selectedIrataTasks.includes(task.id);
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => toggleIrataTask(task.id)}
                      data-testid={`button-irata-task-${task.id}`}
                      className={`
                        p-3 rounded-md border text-left transition-all
                        ${isSelected 
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30" 
                          : "border-border hover-elevate"
                        }
                      `}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`
                          w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5
                          ${isSelected 
                            ? "bg-primary text-primary-foreground" 
                            : "border border-muted-foreground/30"
                          }
                        `}>
                          {isSelected && <span className="material-icons text-sm">check</span>}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{task.label}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">{task.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Count */}
            {selectedIrataTasks.length > 0 && (
              <div className="p-2 bg-primary/10 rounded-md text-center">
                <span className="text-sm font-medium text-primary">
                  {selectedIrataTasks.length === 1 
                    ? t('projectDetail.dialogs.irataTask.tasksSelected', '{{count}} task selected', { count: selectedIrataTasks.length })
                    : t('projectDetail.dialogs.irataTask.tasksSelectedPlural', '{{count}} tasks selected', { count: selectedIrataTasks.length })}
                </span>
              </div>
            )}

            {/* Rope Access Task Hours */}
            <div>
              <Label className="text-sm font-medium mb-2 block">{t('projectDetail.dialogs.irataTask.ropeAccessHours', 'Rope Access Task Hours (Optional)')}</Label>
              <Input
                type="number"
                min="0"
                max="24"
                step="0.25"
                placeholder="e.g., 6.5"
                value={ropeAccessTaskHours}
                onChange={(e) => setRopeAccessTaskHours(e.target.value)}
                data-testid="input-irata-rope-access-hours"
                className="h-12"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('projectDetail.dialogs.irataTask.ropeAccessHoursHint', 'Enter in quarter-hour increments. Excludes lunch, breaks, and downtime.')}
              </p>
            </div>

            {/* Notes */}
            <div>
              <Label className="text-sm font-medium mb-2 block">{t('projectDetail.dialogs.irataTask.additionalNotes', 'Additional Notes (Optional)')}</Label>
              <Textarea
                placeholder={t('projectDetail.dialogs.irataTask.additionalNotesPlaceholder', 'Any additional details about the work performed...')}
                value={irataTaskNotes}
                onChange={(e) => setIrataTaskNotes(e.target.value)}
                className="min-h-20"
                data-testid="input-irata-notes"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkipIrataTasks}
              data-testid="button-skip-irata-tasks"
            >
              {t('projectDetail.dialogs.irataTask.skip', 'Skip for Now')}
            </Button>
            <Button
              type="button"
              onClick={handleSaveIrataTasks}
              disabled={selectedIrataTasks.length === 0 || saveIrataTaskLogMutation.isPending}
              data-testid="button-save-irata-tasks"
            >
              <span className="material-icons mr-2 text-sm">save</span>
              {saveIrataTaskLogMutation.isPending ? t('projectDetail.dialogs.irataTask.saving', 'Saving...') : t('projectDetail.dialogs.irataTask.save', 'Save to Logbook')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Building Instructions Dialog */}
      <Dialog open={showEditInstructionsDialog} onOpenChange={setShowEditInstructionsDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t('projectDetail.buildingInstructions.editTitle', 'Edit Building Instructions')}
            </DialogTitle>
            <DialogDescription>
              {t('projectDetail.buildingInstructions.editDescription', 'Add access details and contact information for this building. This information will be visible to all company employees working on projects at this building.')}
            </DialogDescription>
          </DialogHeader>

          {/* Notice about Building Portal visibility */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
            <span className="material-icons text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">info</span>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {t('projectDetail.buildingInstructions.portalNotice', 'All changes you make here will be visible to the Building Manager from their OnRopePro Building Portal.')}
            </p>
          </div>

          <div className="space-y-4 py-4">
            {/* Access Information */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <DoorOpen className="h-4 w-4" />
                {t('projectDetail.buildingInstructions.accessInfo', 'Access Information')}
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="buildingAccess">{t('projectDetail.buildingInstructions.buildingAccess', 'Building Access')}</Label>
                <Textarea
                  id="buildingAccess"
                  placeholder={t('projectDetail.buildingInstructions.buildingAccessPlaceholder', 'How to enter the building (e.g., main entrance code, parking instructions)...')}
                  value={instructionsForm.buildingAccess}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, buildingAccess: e.target.value }))}
                  data-testid="input-building-access"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keysAndFob">{t('projectDetail.buildingInstructions.keysAndFob', 'Keys/Fob Location')}</Label>
                <Textarea
                  id="keysAndFob"
                  placeholder={t('projectDetail.buildingInstructions.keysAndFobPlaceholder', 'Where to pick up/return keys or fobs...')}
                  value={instructionsForm.keysAndFob}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, keysAndFob: e.target.value }))}
                  data-testid="input-keys-fob"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keysReturnPolicy">{t('projectDetail.buildingInstructions.keysReturnPolicy', 'Keys/Fob Return Policy')}</Label>
                <Select
                  value={instructionsForm.keysReturnPolicy}
                  onValueChange={(value) => setInstructionsForm(prev => ({ ...prev, keysReturnPolicy: value }))}
                >
                  <SelectTrigger data-testid="select-keys-return">
                    <SelectValue placeholder={t('projectDetail.buildingInstructions.selectReturnPolicy', 'Select when to return keys...')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="end_of_day">{t('projectDetail.buildingInstructions.endOfDay', 'End of Every Day')}</SelectItem>
                    <SelectItem value="end_of_week">{t('projectDetail.buildingInstructions.endOfWeek', 'End of Week')}</SelectItem>
                    <SelectItem value="end_of_project">{t('projectDetail.buildingInstructions.endOfProject', 'End of Project')}</SelectItem>
                    <SelectItem value="keep_until_complete">{t('projectDetail.buildingInstructions.keepUntilComplete', 'Keep Until Work Complete')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roofAccess">{t('projectDetail.buildingInstructions.roofAccess', 'Roof Access')}</Label>
                <Textarea
                  id="roofAccess"
                  placeholder={t('projectDetail.buildingInstructions.roofAccessPlaceholder', 'How to access the roof (e.g., stairwell, elevator, key required)...')}
                  value={instructionsForm.roofAccess}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, roofAccess: e.target.value }))}
                  data-testid="input-roof-access"
                />
              </div>
            </div>

            <Separator />

            {/* Contacts */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t('projectDetail.buildingInstructions.contacts', 'Contacts')}
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="buildingManagerName">{t('projectDetail.buildingInstructions.buildingManagerName', 'Building Manager Name')}</Label>
                  <Input
                    id="buildingManagerName"
                    placeholder={t('projectDetail.buildingInstructions.namePlaceholder', 'Name')}
                    value={instructionsForm.buildingManagerName}
                    onChange={(e) => setInstructionsForm(prev => ({ ...prev, buildingManagerName: e.target.value }))}
                    data-testid="input-bm-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buildingManagerPhone">{t('projectDetail.buildingInstructions.phone', 'Phone')}</Label>
                  <Input
                    id="buildingManagerPhone"
                    type="tel"
                    placeholder={t('projectDetail.buildingInstructions.phonePlaceholder', 'Phone number')}
                    value={instructionsForm.buildingManagerPhone}
                    onChange={(e) => setInstructionsForm(prev => ({ ...prev, buildingManagerPhone: e.target.value }))}
                    data-testid="input-bm-phone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="conciergeNames">{t('projectDetail.buildingInstructions.conciergeName', 'Concierge Name(s)')}</Label>
                  <Input
                    id="conciergeNames"
                    placeholder={t('projectDetail.buildingInstructions.namePlaceholder', 'Name')}
                    value={instructionsForm.conciergeNames}
                    onChange={(e) => setInstructionsForm(prev => ({ ...prev, conciergeNames: e.target.value }))}
                    data-testid="input-concierge-names"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conciergePhone">{t('projectDetail.buildingInstructions.phone', 'Phone')}</Label>
                  <Input
                    id="conciergePhone"
                    type="tel"
                    placeholder={t('projectDetail.buildingInstructions.phonePlaceholder', 'Phone number')}
                    value={instructionsForm.conciergePhone}
                    onChange={(e) => setInstructionsForm(prev => ({ ...prev, conciergePhone: e.target.value }))}
                    data-testid="input-concierge-phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conciergeHours">{t('projectDetail.buildingInstructions.conciergeHours', 'Concierge Hours of Operation')}</Label>
                <Input
                  id="conciergeHours"
                  placeholder={t('projectDetail.buildingInstructions.conciergeHoursPlaceholder', 'e.g., Mon-Fri 8am-8pm, Sat-Sun 9am-5pm')}
                  value={instructionsForm.conciergeHours}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, conciergeHours: e.target.value }))}
                  data-testid="input-concierge-hours"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceName">{t('projectDetail.buildingInstructions.maintenanceName', 'Maintenance Name')}</Label>
                  <Input
                    id="maintenanceName"
                    placeholder={t('projectDetail.buildingInstructions.namePlaceholder', 'Name')}
                    value={instructionsForm.maintenanceName}
                    onChange={(e) => setInstructionsForm(prev => ({ ...prev, maintenanceName: e.target.value }))}
                    data-testid="input-maintenance-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenancePhone">{t('projectDetail.buildingInstructions.phone', 'Phone')}</Label>
                  <Input
                    id="maintenancePhone"
                    type="tel"
                    placeholder={t('projectDetail.buildingInstructions.phonePlaceholder', 'Phone number')}
                    value={instructionsForm.maintenancePhone}
                    onChange={(e) => setInstructionsForm(prev => ({ ...prev, maintenancePhone: e.target.value }))}
                    data-testid="input-maintenance-phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="councilMemberUnits">{t('projectDetail.buildingInstructions.councilMemberUnits', 'Council Member Units')}</Label>
                <Input
                  id="councilMemberUnits"
                  placeholder={t('projectDetail.buildingInstructions.councilMemberUnitsPlaceholder', 'e.g., Unit 301, 502, 1205')}
                  value={instructionsForm.councilMemberUnits}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, councilMemberUnits: e.target.value }))}
                  data-testid="input-council-units"
                />
                <p className="text-xs text-muted-foreground">{t('projectDetail.buildingInstructions.councilMemberUnitsHint', 'Floor/unit numbers where council members reside')}</p>
              </div>
            </div>

            <Separator />

            {/* Trade Parking */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <span className="material-icons text-sm">local_parking</span>
                {t('projectDetail.buildingInstructions.tradeParking', 'Trade Parking')}
              </Label>
              <div className="space-y-2">
                <Label htmlFor="tradeParkingSpots">{t('projectDetail.buildingInstructions.tradeParkingSpots', 'Number of Trade Parking Spots')}</Label>
                <Input
                  id="tradeParkingSpots"
                  type="number"
                  min="0"
                  placeholder={t('projectDetail.buildingInstructions.tradeParkingSpotsPlaceholder', 'e.g., 2')}
                  value={instructionsForm.tradeParkingSpots}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, tradeParkingSpots: e.target.value }))}
                  data-testid="input-trade-parking-spots"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tradeParkingInstructions">{t('projectDetail.buildingInstructions.tradeParkingInstructions', 'Trade Parking Instructions')}</Label>
                <Textarea
                  id="tradeParkingInstructions"
                  placeholder={t('projectDetail.buildingInstructions.tradeParkingPlaceholder', 'Where trades can park (e.g., visitor parking, loading zone, street parking with permit)...')}
                  value={instructionsForm.tradeParkingInstructions}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, tradeParkingInstructions: e.target.value }))}
                  data-testid="input-trade-parking"
                />
              </div>
            </div>

            <Separator />

            {/* Trade Washroom */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <span className="material-icons text-sm">wc</span>
                {t('projectDetail.buildingInstructions.tradeWashroom', 'Trade Washroom')}
              </Label>
              <div className="space-y-2">
                <Label htmlFor="tradeWashroomLocation">{t('projectDetail.buildingInstructions.tradeWashroomLocation', 'Washroom Location')}</Label>
                <Textarea
                  id="tradeWashroomLocation"
                  placeholder={t('projectDetail.buildingInstructions.tradeWashroomPlaceholder', 'e.g., Main floor lobby, P1 parkade near elevator, amenity room...')}
                  value={instructionsForm.tradeWashroomLocation}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, tradeWashroomLocation: e.target.value }))}
                  data-testid="input-trade-washroom"
                />
              </div>
            </div>

            <Separator />

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="specialRequests" className="flex items-center gap-2">
                <span className="material-icons text-sm">warning</span>
                {t('projectDetail.buildingInstructions.specialRequests', 'Special Requests')}
              </Label>
              <Textarea
                id="specialRequests"
                placeholder={t('projectDetail.buildingInstructions.specialRequestsPlaceholder', 'Any special instructions or requirements (e.g., noise restrictions, time limits, areas to avoid)...')}
                value={instructionsForm.specialRequests}
                onChange={(e) => setInstructionsForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                className="min-h-24"
                data-testid="input-special-requests"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditInstructionsDialog(false)}
              data-testid="button-cancel-instructions"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              type="button"
              onClick={() => saveInstructionsMutation.mutate(instructionsForm)}
              disabled={saveInstructionsMutation.isPending}
              data-testid="button-save-instructions"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveInstructionsMutation.isPending 
                ? t('common.saving', 'Saving...') 
                : t('common.save', 'Save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
