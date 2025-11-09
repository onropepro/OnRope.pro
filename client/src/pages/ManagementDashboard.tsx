import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
import { Checkbox } from "@/components/ui/checkbox";
import type { Project } from "@shared/schema";
import { normalizeStrataPlan } from "@shared/schema";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const projectSchema = z.object({
  strataPlanNumber: z.string().min(1, "Strata plan number is required"),
  buildingName: z.string().min(1, "Building name is required"),
  buildingAddress: z.string().optional(),
  jobType: z.enum(["window_cleaning", "dryer_vent_cleaning", "pressure_washing", "in_suite_dryer_vent_cleaning", "parkade_pressure_cleaning", "ground_window_cleaning"]),
  totalDropsNorth: z.string().optional(),
  totalDropsEast: z.string().optional(),
  totalDropsSouth: z.string().optional(),
  totalDropsWest: z.string().optional(),
  dailyDropTarget: z.string().optional(),
  floorCount: z.string().min(1, "Floor count is required"),
  targetCompletionDate: z.string().optional(),
  estimatedHours: z.string().optional(),
  ropeAccessPlan: z.any().optional(),
  suitesPerDay: z.string().optional(),
  floorsPerDay: z.string().optional(),
  stallsPerDay: z.string().optional(),
}).superRefine((data, ctx) => {
  // Job types that use drop-based tracking
  const dropBasedJobTypes = ["window_cleaning", "dryer_vent_cleaning", "pressure_washing"];
  
  if (dropBasedJobTypes.includes(data.jobType)) {
    // For drop-based jobs, dailyDropTarget is required
    if (!data.dailyDropTarget || data.dailyDropTarget.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Daily drop target is required",
        path: ["dailyDropTarget"],
      });
    }
    
    // Elevation fields are also required for drop-based jobs
    if (!data.totalDropsNorth || data.totalDropsNorth.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total drops (North) is required",
        path: ["totalDropsNorth"],
      });
    }
    if (!data.totalDropsEast || data.totalDropsEast.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total drops (East) is required",
        path: ["totalDropsEast"],
      });
    }
    if (!data.totalDropsSouth || data.totalDropsSouth.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total drops (South) is required",
        path: ["totalDropsSouth"],
      });
    }
    if (!data.totalDropsWest || data.totalDropsWest.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total drops (West) is required",
        path: ["totalDropsWest"],
      });
    }
  }
  
  if (data.jobType === "in_suite_dryer_vent_cleaning") {
    if (!data.suitesPerDay && !data.floorsPerDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either suites per day or floors per day is required for in-suite dryer vent cleaning",
        path: ["suitesPerDay"],
      });
    }
  }
  if (data.jobType === "parkade_pressure_cleaning") {
    if (!data.stallsPerDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Stalls per day is required for parkade pressure cleaning",
        path: ["stallsPerDay"],
      });
    }
  }
});

// Available permissions for employees
const AVAILABLE_PERMISSIONS = [
  { id: "view_projects", label: "View Projects" },
  { id: "create_projects", label: "Create Projects" },
  { id: "edit_projects", label: "Edit Projects" },
  { id: "delete_projects", label: "Delete Projects" },
  { id: "view_employees", label: "View Employees" },
  { id: "create_employees", label: "Create Employees" },
  { id: "edit_employees", label: "Edit Employees" },
  { id: "delete_employees", label: "Delete Employees" },
  { id: "log_drops", label: "Log Drops" },
  { id: "view_complaints", label: "View Complaints" },
  { id: "manage_complaints", label: "Manage Complaints" },
  { id: "view_work_sessions", label: "View Work Sessions" },
  { id: "manage_work_sessions", label: "Manage Work Sessions" },
  { id: "view_work_history", label: "View Work History" },
  { id: "view_analytics", label: "View Analytics" },
  { id: "view_financial_data", label: "View Financial Data (Labor Costs, Wages)" },
] as const;

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["operations_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"]),
  techLevel: z.string().optional(),
  hourlyRate: z.string().optional(),
  permissions: z.array(z.string()).default([]),
}).refine((data) => {
  if (data.role === "rope_access_tech" && !data.techLevel) {
    return false;
  }
  return true;
}, {
  message: "IRATA level is required for rope access technicians",
  path: ["techLevel"],
});

const editEmployeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["operations_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"]),
  techLevel: z.string().optional(),
  hourlyRate: z.string().optional(),
  permissions: z.array(z.string()).default([]),
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
  elevation: z.enum(["north", "east", "south", "west"], { required_error: "Please select an elevation" }),
  dropsCompleted: z.string().min(1, "Number of drops is required"),
  shortfallReason: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;
type EmployeeFormData = z.infer<typeof employeeSchema>;
type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;
type DropLogFormData = z.infer<typeof dropLogSchema>;
type EndDayFormData = z.infer<typeof endDaySchema>;

export default function ManagementDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [showEditEmployeeDialog, setShowEditEmployeeDialog] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [showDropDialog, setShowDropDialog] = useState(false);
  const [dropProject, setDropProject] = useState<any>(null);
  const [showStartDayDialog, setShowStartDayDialog] = useState(false);
  const [showEndDayDialog, setShowEndDayDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [uploadedPlanFile, setUploadedPlanFile] = useState<File | null>(null);
  const [isUploadingPlan, setIsUploadingPlan] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch projects with auto-refresh to show real-time progress
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true,
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
  
  // Fetch all complaints for the company
  const { data: complaintsData, isLoading: complaintsLoading } = useQuery({
    queryKey: ["/api/complaints"],
  });

  // Fetch harness inspections
  const { data: harnessInspectionsData } = useQuery({
    queryKey: ["/api/harness-inspections"],
  });

  // Fetch toolbox meetings
  const { data: toolboxMeetingsData } = useQuery({
    queryKey: ["/api/toolbox-meetings"],
  });
  
  const employees = employeesData?.employees || [];
  const todayDrops = myDropsData?.totalDropsToday || 0;
  const dailyTarget = projects[0]?.dailyDropTarget || 20;
  const companyName = companyData?.company?.companyName || "";
  const complaints = complaintsData?.complaints || [];
  const harnessInspections = harnessInspectionsData?.inspections || [];
  const toolboxMeetings = toolboxMeetingsData?.meetings || [];

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
      totalDropsNorth: "",
      totalDropsEast: "",
      totalDropsSouth: "",
      totalDropsWest: "",
      dailyDropTarget: "",
      floorCount: "",
      targetCompletionDate: "",
      estimatedHours: "",
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
      hourlyRate: "",
      permissions: [],
    },
  });

  const editEmployeeForm = useForm<EditEmployeeFormData>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "rope_access_tech",
      techLevel: "",
      hourlyRate: "",
      permissions: [],
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
      elevation: "north",
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
          totalDropsNorth: data.totalDropsNorth ? parseInt(data.totalDropsNorth) : 0,
          totalDropsEast: data.totalDropsEast ? parseInt(data.totalDropsEast) : 0,
          totalDropsSouth: data.totalDropsSouth ? parseInt(data.totalDropsSouth) : 0,
          totalDropsWest: data.totalDropsWest ? parseInt(data.totalDropsWest) : 0,
          totalDrops: (data.totalDropsNorth ? parseInt(data.totalDropsNorth) : 0) + 
                     (data.totalDropsEast ? parseInt(data.totalDropsEast) : 0) + 
                     (data.totalDropsSouth ? parseInt(data.totalDropsSouth) : 0) + 
                     (data.totalDropsWest ? parseInt(data.totalDropsWest) : 0),
          dailyDropTarget: data.dailyDropTarget ? parseInt(data.dailyDropTarget) : undefined,
          floorCount: parseInt(data.floorCount),
          estimatedHours: data.estimatedHours ? parseInt(data.estimatedHours) : undefined,
          ropeAccessPlanUrl: data.ropeAccessPlanUrl || undefined,
          suitesPerDay: data.suitesPerDay ? parseInt(data.suitesPerDay) : undefined,
          floorsPerDay: data.floorsPerDay ? parseInt(data.floorsPerDay) : undefined,
          stallsPerDay: data.stallsPerDay ? parseInt(data.stallsPerDay) : undefined,
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

  const editEmployeeMutation = useMutation({
    mutationFn: async (data: EditEmployeeFormData & { id: string }) => {
      const response = await apiRequest("PATCH", `/api/employees/${data.id}`, {
        name: data.name,
        email: data.email,
        role: data.role,
        techLevel: data.techLevel,
        hourlyRate: data.hourlyRate,
        permissions: data.permissions,
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      // Invalidate all work sessions to refresh hourly rates
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          query.queryKey.length >= 3 && 
          query.queryKey[0] === "/api/projects" && 
          query.queryKey[2] === "work-sessions"
      });
      setShowEditEmployeeDialog(false);
      setEmployeeToEdit(null);
      editEmployeeForm.reset();
      toast({
        title: "Employee updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onProjectSubmit = async (data: ProjectFormData) => {
    // Normalize strata plan number (remove spaces, uppercase)
    const normalizedData = {
      ...data,
      strataPlanNumber: normalizeStrataPlan(data.strataPlanNumber),
    };
    
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
        
        const uploadResult = await uploadResponse.json();
        
        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || 'Failed to upload fall protection plan');
        }
        
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
      ...normalizedData,
      ropeAccessPlanUrl,
    });
    setUploadedPlanFile(null);
  };

  const onEmployeeSubmit = async (data: EmployeeFormData) => {
    createEmployeeMutation.mutate(data);
  };

  const handleEditEmployee = (employee: any) => {
    setEmployeeToEdit(employee);
    editEmployeeForm.reset({
      name: employee.name || "",
      email: employee.email || "",
      role: employee.role,
      techLevel: employee.techLevel || "",
      hourlyRate: employee.hourlyRate || "",
      permissions: employee.permissions || [],
    });
    setShowEditEmployeeDialog(true);
  };

  const onEditEmployeeSubmit = async (data: EditEmployeeFormData) => {
    if (!employeeToEdit) return;
    editEmployeeMutation.mutate({ ...data, id: employeeToEdit.id });
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

  const deleteInspectionMutation = useMutation({
    mutationFn: async (inspectionId: string) => {
      const response = await fetch(`/api/harness-inspections/${inspectionId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete inspection");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/harness-inspections"] });
      setSelectedInspection(null);
      toast({ title: "Harness inspection deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMeetingMutation = useMutation({
    mutationFn: async (meetingId: string) => {
      const response = await fetch(`/api/toolbox-meetings/${meetingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete meeting");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/toolbox-meetings"] });
      setSelectedMeeting(null);
      toast({ title: "Toolbox meeting deleted successfully" });
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
      <header className="sticky top-0 z-[100] bg-card border-b shadow-md">
        <div className="px-4 h-20 flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Management</h1>
            {companyName && (
              <p className="text-sm text-muted-foreground mt-0.5">{companyName}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-profile" onClick={() => setLocation("/profile")}>
              <span className="material-icons">person</span>
            </Button>
            <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-logout" onClick={() => setShowLogoutDialog(true)}>
              <span className="material-icons">logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => setLocation("/harness-inspection")}
              data-testid="button-harness-inspection"
            >
              <span className="material-icons text-primary">verified_user</span>
              <div className="text-center">
                <div className="font-semibold">Harness Inspection</div>
                <div className="text-xs text-muted-foreground">Fill daily inspection form</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => setLocation("/toolbox-meeting")}
              data-testid="button-toolbox-meeting"
            >
              <span className="material-icons text-primary">group</span>
              <div className="text-center">
                <div className="font-semibold">Toolbox Meeting</div>
                <div className="text-xs text-muted-foreground">Record safety meeting</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => setLocation("/payroll")}
              data-testid="button-payroll"
            >
              <span className="material-icons text-primary">payments</span>
              <div className="text-center">
                <div className="font-semibold">Payroll</div>
                <div className="text-xs text-muted-foreground">Manage employee hours</div>
              </div>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Mobile Dropdown */}
          <div className="block sm:hidden mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="h-12 w-full" data-testid="select-tab-mobile">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="projects">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm">apartment</span>
                    Projects
                  </div>
                </SelectItem>
                <SelectItem value="past-projects">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm">done_all</span>
                    Past Projects
                  </div>
                </SelectItem>
                <SelectItem value="performance">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm">analytics</span>
                    Performance
                  </div>
                </SelectItem>
                <SelectItem value="complaints">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm">feedback</span>
                    Complaints
                  </div>
                </SelectItem>
                <SelectItem value="my-drops">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm">checklist</span>
                    My Drops
                  </div>
                </SelectItem>
                <SelectItem value="employees">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm">people</span>
                    Employees
                  </div>
                </SelectItem>
                <SelectItem value="documents">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm">description</span>
                    Documents
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Tabs */}
          <ScrollArea className="hidden sm:block w-full mb-4">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-full bg-muted p-1 text-muted-foreground w-full sm:w-auto">
              <TabsTrigger value="projects" data-testid="tab-projects" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all min-w-[110px] sm:min-w-0">
                <span className="material-icons text-sm mr-2">apartment</span>
                Projects
              </TabsTrigger>
              <TabsTrigger value="past-projects" data-testid="tab-past-projects" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all min-w-[130px] sm:min-w-0">
                <span className="material-icons text-sm mr-2">done_all</span>
                Past Projects
              </TabsTrigger>
              <TabsTrigger value="performance" data-testid="tab-performance" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all min-w-[120px] sm:min-w-0">
                <span className="material-icons text-sm mr-2">analytics</span>
                Performance
              </TabsTrigger>
              <TabsTrigger value="complaints" data-testid="tab-complaints" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all min-w-[120px] sm:min-w-0">
                <span className="material-icons text-sm mr-2">feedback</span>
                Complaints
              </TabsTrigger>
              <TabsTrigger value="my-drops" data-testid="tab-my-drops" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all min-w-[110px] sm:min-w-0">
                <span className="material-icons text-sm mr-2">checklist</span>
                My Drops
              </TabsTrigger>
              <TabsTrigger value="employees" data-testid="tab-employees" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all min-w-[110px] sm:min-w-0">
                <span className="material-icons text-sm mr-2">people</span>
                Employees
              </TabsTrigger>
              <TabsTrigger value="documents" data-testid="tab-documents" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all min-w-[110px] sm:min-w-0">
                <span className="material-icons text-sm mr-2">description</span>
                Documents
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="projects">
            <div className="space-y-4">
              {/* Search and Create */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-base">
                    search
                  </span>
                  <Input
                    placeholder="Search by strata plan number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 pl-12 text-base shadow-sm border-2 focus-visible:ring-2"
                    data-testid="input-search-projects"
                  />
                </div>
                <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
                  <DialogTrigger asChild>
                    <Button className="h-14 px-6 gap-2 shadow-md hover:shadow-lg text-base font-semibold" data-testid="button-create-project">
                      <span className="material-icons text-xl">add_circle</span>
                      <span className="hidden sm:inline">New Project</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md p-0 max-h-[95vh] flex flex-col gap-0">
                    <div className="p-6 border-b bg-card">
                      <DialogHeader>
                        <DialogTitle className="text-xl">Create New Project</DialogTitle>
                        <DialogDescription>Add a new building maintenance project</DialogDescription>
                      </DialogHeader>
                    </div>
                    <div className="overflow-y-auto flex-1 p-6">
                      <Form {...projectForm}>
                        {Object.keys(projectForm.formState.errors).length > 0 && (
                          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-md">
                            <div className="font-semibold text-destructive mb-2">Form Errors:</div>
                            <div className="text-sm space-y-1">
                              {Object.entries(projectForm.formState.errors).map(([key, error]: [string, any]) => (
                                <div key={key} className="text-destructive">
                                  • {key}: {error?.message || 'Invalid'}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <form onSubmit={projectForm.handleSubmit(onProjectSubmit, (errors) => {
                          console.log("Form validation errors:", errors);
                          toast({ 
                            title: "Form validation failed", 
                            description: "Please check all required fields", 
                            variant: "destructive" 
                          });
                        })} className="space-y-4">
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
                                  <SelectItem value="in_suite_dryer_vent_cleaning">In-Suite Dryer Vent Cleaning</SelectItem>
                                  <SelectItem value="parkade_pressure_cleaning">Parkade Pressure Cleaning</SelectItem>
                                  <SelectItem value="ground_window_cleaning">Ground Window Cleaning</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {projectForm.watch("jobType") === "in_suite_dryer_vent_cleaning" && (
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={projectForm.control}
                              name="suitesPerDay"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Suites per Day</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="0" placeholder="e.g., 10" {...field} data-testid="input-suites-per-day" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={projectForm.control}
                              name="floorsPerDay"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Floors per Day (alt.)</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="0" placeholder="e.g., 5" {...field} data-testid="input-floors-per-day" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}

                        {projectForm.watch("jobType") === "parkade_pressure_cleaning" && (
                          <FormField
                            control={projectForm.control}
                            name="stallsPerDay"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stalls per Day</FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" placeholder="e.g., 20" {...field} data-testid="input-stalls-per-day" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={projectForm.control}
                          name="floorCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {projectForm.watch("jobType") === "parkade_pressure_cleaning" 
                                  ? "Stall Count" 
                                  : projectForm.watch("jobType") === "in_suite_dryer_vent_cleaning"
                                  ? "Unit Count"
                                  : "Floor Count"}
                              </FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} data-testid="input-floor-count" className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {(projectForm.watch("jobType") === "window_cleaning" || 
                          projectForm.watch("jobType") === "pressure_washing" || 
                          projectForm.watch("jobType") === "dryer_vent_cleaning") && (
                          <>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Total Drops per Elevation</label>
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={projectForm.control}
                                  name="totalDropsNorth"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>North</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="1" {...field} data-testid="input-total-drops-north" className="h-12" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={projectForm.control}
                                  name="totalDropsEast"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>East</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="1" {...field} data-testid="input-total-drops-east" className="h-12" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={projectForm.control}
                                  name="totalDropsSouth"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>South</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="1" {...field} data-testid="input-total-drops-south" className="h-12" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={projectForm.control}
                                  name="totalDropsWest"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>West</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="1" {...field} data-testid="input-total-drops-west" className="h-12" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

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
                          </>
                        )}

                        {projectForm.watch("jobType") === "parkade_pressure_cleaning" && (
                          <FormField
                            control={projectForm.control}
                            name="dailyDropTarget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Daily Stall Cleaning Target</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} data-testid="input-daily-stall-target" className="h-12" />
                                </FormControl>
                                <FormDescription className="text-xs">
                                  Visible to rope access techs
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

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

                        <FormField
                          control={projectForm.control}
                          name="estimatedHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estimated Hours (Optional)</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" placeholder="Total estimated hours for entire building" {...field} data-testid="input-estimated-hours" className="h-12" />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Total hours estimated for the entire project
                              </FormDescription>
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
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Active Projects */}
              <div>
                <div className="flex items-center gap-2 mb-6 mt-8">
                  <div className="h-8 w-1 bg-primary rounded-full"></div>
                  <h2 className="text-xl font-bold">Active Projects</h2>
                </div>
                <div className="space-y-4">
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
                          className="group relative border-l-4 border-l-primary shadow-lg hover:shadow-2xl transition-all duration-200 cursor-pointer overflow-visible bg-gradient-to-br from-background to-muted/30" 
                          data-testid={`project-card-${project.id}`}
                          onClick={() => setLocation(`/projects/${project.id}`)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="text-xl font-bold mb-1">{project.buildingName}</div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">{project.strataPlanNumber}</div>
                                <div className="text-sm text-muted-foreground capitalize flex items-center gap-2">
                                  <span className="material-icons text-base">business</span>
                                  {project.jobType.replace(/_/g, ' ')}
                                </div>
                                {project.createdAt && (
                                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <span className="material-icons text-xs">event</span>
                                    Created {new Date(project.createdAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                              <Badge variant="secondary" className="text-sm px-3 py-1">
                                <span className="material-icons text-xs mr-1">layers</span>
                                {project.floorCount}
                              </Badge>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Progress</span>
                                <span className="text-2xl font-bold">{Math.round(progressPercent)}%</span>
                              </div>
                              <Progress value={progressPercent} className="h-3" />
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{completedDrops} / {totalDrops} drops</span>
                                <span className="material-icons text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="past-projects">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1 bg-success rounded-full"></div>
                <h2 className="text-xl font-bold">Past Projects</h2>
              </div>
              {filteredProjects.filter((p: Project) => p.status === "completed").length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <span className="material-icons text-4xl mb-2 opacity-50">done_all</span>
                    <div>No completed projects yet</div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredProjects.filter((p: Project) => p.status === "completed").map((project: Project) => (
                    <Card 
                      key={project.id} 
                      className="group border-l-4 border-l-success shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-background to-success/5" 
                      data-testid={`completed-project-${project.id}`}
                      onClick={() => setLocation(`/projects/${project.id}`)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-lg font-bold mb-1">{project.buildingName}</div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">{project.strataPlanNumber}</div>
                            <div className="text-sm text-muted-foreground capitalize flex items-center gap-2">
                              <span className="material-icons text-base text-success">check_circle</span>
                              {project.jobType.replace(/_/g, ' ')}
                            </div>
                            {project.createdAt && (
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <span className="material-icons text-xs">event</span>
                                Created {new Date(project.createdAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <Badge variant="default" className="bg-success hover:bg-success text-white">
                            <span className="material-icons text-xs mr-1">done_all</span>
                            Complete
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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

          <TabsContent value="complaints">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Complaints</CardTitle>
                  <CardDescription>
                    View and manage resident feedback across all projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {complaintsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading complaints...</div>
                  ) : complaints.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No complaints yet</div>
                  ) : (() => {
                    // Group complaints by strata plan number
                    const groupedComplaints = complaints.reduce((acc: any, complaint: any) => {
                      const key = complaint.strataPlanNumber || 'Unknown';
                      if (!acc[key]) {
                        acc[key] = {
                          strataPlanNumber: key,
                          buildingName: complaint.buildingName || 'Unknown Building',
                          complaints: []
                        };
                      }
                      acc[key].complaints.push(complaint);
                      return acc;
                    }, {});

                    const buildings = Object.values(groupedComplaints);

                    return (
                      <Accordion type="single" collapsible className="w-full space-y-2">
                        {buildings.map((building: any) => {
                          const openCount = building.complaints.filter((c: any) => c.status === 'open').length;
                          
                          return (
                            <AccordionItem 
                              key={building.strataPlanNumber} 
                              value={building.strataPlanNumber}
                              className="border rounded-lg px-4"
                            >
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full pr-4">
                                  <div className="flex-1 text-left">
                                    <div className="font-semibold text-base">{building.buildingName}</div>
                                    <div className="text-sm text-muted-foreground">LMS {building.strataPlanNumber}</div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {openCount > 0 && (
                                      <Badge variant="default" className="text-xs">
                                        {openCount} open
                                      </Badge>
                                    )}
                                    <Badge variant="secondary" className="text-xs">
                                      {building.complaints.length} total
                                    </Badge>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3 pt-2">
                                  {building.complaints.map((complaint: any) => (
                                    <Card 
                                      key={complaint.id} 
                                      className="hover-elevate cursor-pointer"
                                      onClick={() => setLocation(`/complaints/${complaint.id}`)}
                                      data-testid={`complaint-card-${complaint.id}`}
                                    >
                                      <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                              <span className="font-medium">{complaint.residentName}</span>
                                              <Badge variant={complaint.status === 'open' ? 'default' : 'secondary'} className="text-xs">
                                                {complaint.status}
                                              </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground mb-1">
                                              Unit {complaint.unitNumber} • {complaint.phoneNumber}
                                            </div>
                                            <p className="text-sm line-clamp-2">{complaint.message}</p>
                                            <div className="text-xs text-muted-foreground mt-2">
                                              {new Date(complaint.createdAt).toLocaleDateString()}
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    );
                  })()}
                </CardContent>
              </Card>
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
                <DialogContent className="max-w-md p-0 max-h-[95vh] flex flex-col">
                  <div className="p-6 border-b">
                    <DialogHeader>
                      <DialogTitle>Create Employee Account</DialogTitle>
                      <DialogDescription>
                        Enter login credentials for the new employee
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  <div className="overflow-y-auto flex-1 p-6">
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
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="ground_crew">Ground Crew</SelectItem>
                                <SelectItem value="ground_crew_supervisor">Ground Crew Supervisor</SelectItem>
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

                      <FormField
                        control={employeeForm.control}
                        name="hourlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate ($/hr)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                placeholder="25.00" 
                                {...field} 
                                data-testid="input-employee-hourly-rate" 
                                className="h-12" 
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Optional - for labor cost calculations
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={employeeForm.control}
                        name="permissions"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-base">Permissions</FormLabel>
                              <FormDescription className="text-xs">
                                Select which features this employee can access
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {AVAILABLE_PERMISSIONS.map((permission) => (
                                <FormField
                                  key={permission.id}
                                  control={employeeForm.control}
                                  name="permissions"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={permission.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(permission.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, permission.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== permission.id
                                                    )
                                                  )
                                            }}
                                            data-testid={`checkbox-permission-${permission.id}`}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                          {permission.label}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full h-12" data-testid="button-submit-employee" disabled={createEmployeeMutation.isPending}>
                        {createEmployeeMutation.isPending ? "Creating..." : "Create Employee"}
                      </Button>
                    </form>
                  </Form>
                  </div>
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
                            <div className="font-medium">{employee.name || employee.email}</div>
                            {employee.techLevel && (
                              <div className="text-xs text-muted-foreground mt-1">IRATA {employee.techLevel}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs capitalize">
                              {employee.role.replace(/_/g, ' ')}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditEmployee(employee)}
                              data-testid={`button-edit-employee-${employee.id}`}
                              className="h-9 w-9"
                            >
                              <span className="material-icons text-sm">edit</span>
                            </Button>
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

          <TabsContent value="documents" className="space-y-6">
            {/* Platform Overview Document */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons">description</span>
                  Platform Overview Document
                </CardTitle>
                <CardDescription>
                  Comprehensive documentation covering all platform features and capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">
                    Download a complete, detailed HTML document describing all functionalities of the Rope Access Management Platform. Perfect for publishing on your website, sharing with stakeholders, or creating marketing materials.
                  </p>
                  <Button 
                    className="w-full h-12 gap-2"
                    onClick={() => window.open('/platform-overview.html', '_blank')}
                    data-testid="button-download-platform-overview"
                  >
                    <span className="material-icons">download</span>
                    Download Platform Overview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Harness Inspections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons">verified_user</span>
                  Harness Safety Inspections
                </CardTitle>
                <CardDescription>
                  Daily harness inspection records - {harnessInspections.length} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                {harnessInspections.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <span className="material-icons text-5xl mb-4 opacity-50">folder_open</span>
                    <div className="text-lg mb-2">No Inspections Yet</div>
                    <div className="text-sm">
                      Harness inspections will appear here once submitted
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {harnessInspections.map((inspection: any) => (
                      <Card 
                        key={inspection.id} 
                        className="hover-elevate cursor-pointer"
                        onClick={() => setSelectedInspection(inspection)}
                        data-testid={`inspection-card-${inspection.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{inspection.inspectorName}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(inspection.inspectionDate).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                              {inspection.manufacturer && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Manufacturer: {inspection.manufacturer}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {inspection.lanyardType || 'Standard'}
                              </Badge>
                              <span className="material-icons text-muted-foreground">chevron_right</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Toolbox Meetings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons">assignment</span>
                  Toolbox Meetings
                </CardTitle>
                <CardDescription>
                  Safety meeting records - {toolboxMeetings.length} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                {toolboxMeetings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <span className="material-icons text-5xl mb-4 opacity-50">folder_open</span>
                    <div className="text-lg mb-2">No Meetings Yet</div>
                    <div className="text-sm">
                      Toolbox meeting records will appear here once submitted
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {toolboxMeetings.map((meeting: any) => (
                      <Card 
                        key={meeting.id} 
                        className="hover-elevate cursor-pointer"
                        onClick={() => setSelectedMeeting(meeting)}
                        data-testid={`meeting-card-${meeting.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">
                                {new Date(meeting.meetingDate).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Conducted by: {meeting.conductedByName}
                              </div>
                              {meeting.customTopic && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Custom Topic: {meeting.customTopic}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {meeting.attendees?.length || 0} attendees
                              </Badge>
                              <span className="material-icons text-muted-foreground">chevron_right</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Employee Dialog */}
      <Dialog open={showEditEmployeeDialog} onOpenChange={setShowEditEmployeeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            <Form {...editEmployeeForm}>
              <form onSubmit={editEmployeeForm.handleSubmit(onEditEmployeeSubmit)} className="space-y-4">
                <FormField
                  control={editEmployeeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="h-12" data-testid="input-edit-employee-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editEmployeeForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} className="h-12" data-testid="input-edit-employee-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editEmployeeForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12" data-testid="select-edit-employee-role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="operations_manager">Operations Manager</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="rope_access_tech">Rope Access Tech</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="ground_crew">Ground Crew</SelectItem>
                          <SelectItem value="ground_crew_supervisor">Ground Crew Supervisor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {editEmployeeForm.watch("role") === "rope_access_tech" && (
                  <FormField
                    control={editEmployeeForm.control}
                    name="techLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IRATA Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12" data-testid="select-edit-tech-level">
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

                <FormField
                  control={editEmployeeForm.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate ($/hr)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          placeholder="25.00" 
                          {...field} 
                          data-testid="input-edit-employee-hourly-rate" 
                          className="h-12" 
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Optional - for labor cost calculations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editEmployeeForm.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Permissions</FormLabel>
                        <FormDescription className="text-xs">
                          Select which features this employee can access
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {AVAILABLE_PERMISSIONS.map((permission) => (
                          <FormField
                            key={permission.id}
                            control={editEmployeeForm.control}
                            name="permissions"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={permission.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(permission.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, permission.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== permission.id
                                              )
                                            )
                                      }}
                                      data-testid={`checkbox-edit-permission-${permission.id}`}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {permission.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-12" data-testid="button-submit-edit-employee" disabled={editEmployeeMutation.isPending}>
                  {editEmployeeMutation.isPending ? "Updating..." : "Update Employee"}
                </Button>
              </form>
            </Form>
          </div>
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

      {/* Harness Inspection Details Dialog */}
      <Dialog open={!!selectedInspection} onOpenChange={() => setSelectedInspection(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons">verified_user</span>
              Harness Inspection Details
            </DialogTitle>
          </DialogHeader>
          {selectedInspection && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Inspector</div>
                  <div className="text-base">{selectedInspection.inspectorName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Date</div>
                  <div className="text-base">
                    {new Date(selectedInspection.inspectionDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Manufacturer</div>
                  <div className="text-base">{selectedInspection.manufacturer || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Model</div>
                  <div className="text-base">{selectedInspection.model || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Serial Number</div>
                  <div className="text-base">{selectedInspection.serialNumber || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Lanyard Type</div>
                  <div className="text-base">{selectedInspection.lanyardType || 'N/A'}</div>
                </div>
              </div>
              
              {selectedInspection.manufactureDate && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Manufacture Date</div>
                  <div className="text-base">
                    {new Date(selectedInspection.manufactureDate).toLocaleDateString()}
                  </div>
                </div>
              )}
              
              {selectedInspection.notes && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Additional Notes</div>
                  <div className="text-base bg-muted p-3 rounded-md">
                    {selectedInspection.notes}
                  </div>
                </div>
              )}
            </div>
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
                    {new Date(selectedMeeting.meetingDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
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
    </div>
  );
}
