// GPS Location Tracking - v2.0 - CACHE BUST
import { useState, useEffect, useMemo, useRef } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Project, Client, InsertClient } from "@shared/schema";
import { normalizeStrataPlan } from "@shared/schema";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { isManagement, hasFinancialAccess, canManageEmployees, canViewPerformance, hasPermission, isReadOnly, canViewSchedule } from "@/lib/permissions";
import { DocumentUploader } from "@/components/DocumentUploader";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const projectSchema = z.object({
  strataPlanNumber: z.string().min(1, "Strata plan number is required"),
  buildingName: z.string().min(1, "Building name is required"),
  buildingAddress: z.string().optional(),
  jobType: z.enum(["window_cleaning", "dryer_vent_cleaning", "pressure_washing", "general_pressure_washing", "gutter_cleaning", "in_suite_dryer_vent_cleaning", "parkade_pressure_cleaning", "ground_window_cleaning"]),
  totalDropsNorth: z.string().optional(),
  totalDropsEast: z.string().optional(),
  totalDropsSouth: z.string().optional(),
  totalDropsWest: z.string().optional(),
  dailyDropTarget: z.string().optional(),
  floorCount: z.string().min(1, "Floor count is required"),
  targetCompletionDate: z.string().optional(),
  estimatedHours: z.string().optional(),
  calendarColor: z.string().default("#3b82f6"),
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

// Role definitions with icons
const ROLE_OPTIONS = [
  { value: "owner_ceo", label: "Owner/CEO", icon: "business_center", category: "management" },
  { value: "operations_manager", label: "Operations Manager", icon: "engineering", category: "management" },
  { value: "human_resources", label: "Human Resources", icon: "badge", category: "management" },
  { value: "accounting", label: "Accounting", icon: "account_balance", category: "management" },
  { value: "account_manager", label: "Account Manager", icon: "person_search", category: "management" },
  { value: "general_supervisor", label: "General Supervisor", icon: "admin_panel_settings", category: "management" },
  { value: "rope_access_supervisor", label: "Rope Access Supervisor", icon: "height", category: "management" },
  { value: "manager", label: "Manager", icon: "manage_accounts", category: "management" },
  { value: "rope_access_tech", label: "Rope Access Technician", icon: "construction", category: "worker" },
  { value: "ground_crew_supervisor", label: "Ground Crew Supervisor", icon: "groups", category: "worker" },
  { value: "ground_crew", label: "Ground Crew", icon: "engineering", category: "worker" },
  { value: "labourer", label: "Labourer", icon: "handyman", category: "worker" },
] as const;

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
  { id: "view_clients", label: "View Clients" },
  { id: "manage_clients", label: "Manage Clients (Create/Edit/Delete)" },
  { id: "log_drops", label: "Log Drops" },
  { id: "view_complaints", label: "View Complaints" },
  { id: "manage_complaints", label: "Manage Complaints" },
  { id: "view_work_sessions", label: "View Work Sessions" },
  { id: "manage_work_sessions", label: "Manage Work Sessions" },
  { id: "view_work_history", label: "View Work History" },
  { id: "view_analytics", label: "View Analytics" },
  { id: "view_active_workers", label: "View Active Workers" },
  { id: "view_financial_data", label: "View Financial Data (Labor Costs, Wages)" },
] as const;

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["owner_ceo", "operations_manager", "human_resources", "accounting", "account_manager", "general_supervisor", "rope_access_supervisor", "manager", "rope_access_tech", "ground_crew_supervisor", "ground_crew", "labourer"]),
  hourlyRate: z.string().optional(),
  permissions: z.array(z.string()).default([]),
  // New employee details
  startDate: z.string().optional(),
  birthday: z.string().optional(),
  driversLicenseNumber: z.string().optional(),
  driversLicenseProvince: z.string().optional(),
  driversLicenseDocuments: z.array(z.string()).default([]),
  homeAddress: z.string().optional(),
  employeePhoneNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  specialMedicalConditions: z.string().optional(),
  // IRATA fields
  irataLevel: z.string().optional(),
  irataLicenseNumber: z.string().optional(),
  irataIssuedDate: z.string().optional(),
  irataExpirationDate: z.string().optional(),
});

const editEmployeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["owner_ceo", "operations_manager", "human_resources", "accounting", "account_manager", "general_supervisor", "rope_access_supervisor", "manager", "rope_access_tech", "ground_crew_supervisor", "ground_crew", "labourer"]),
  hourlyRate: z.string().optional(),
  permissions: z.array(z.string()).default([]),
  // New employee details
  startDate: z.string().optional(),
  birthday: z.string().optional(),
  driversLicenseNumber: z.string().optional(),
  driversLicenseProvince: z.string().optional(),
  driversLicenseDocuments: z.array(z.string()).default([]),
  homeAddress: z.string().optional(),
  employeePhoneNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  specialMedicalConditions: z.string().optional(),
  // IRATA fields
  irataLevel: z.string().optional(),
  irataLicenseNumber: z.string().optional(),
  irataIssuedDate: z.string().optional(),
  irataExpirationDate: z.string().optional(),
  // Termination
  terminatedDate: z.string().optional(),
  terminationReason: z.string().optional(),
  terminationNotes: z.string().optional(),
});

const dropLogSchema = z.object({
  projectId: z.string().min(1, "Please select a project"),
  date: z.string().min(1, "Date is required"),
  dropsCompleted: z.string().min(1, "Number of drops is required"),
});

const endDaySchema = z.object({
  dropsNorth: z.string().default("0"),
  dropsEast: z.string().default("0"),
  dropsSouth: z.string().default("0"),
  dropsWest: z.string().default("0"),
  shortfallReason: z.string().optional(),
});

const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  lmsNumbers: z.array(z.string()).default([]),
  billingAddress: z.string().optional(),
  sameAsAddress: z.boolean().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;
type EmployeeFormData = z.infer<typeof employeeSchema>;
type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;
type DropLogFormData = z.infer<typeof dropLogSchema>;
type EndDayFormData = z.infer<typeof endDaySchema>;
type ClientFormData = z.infer<typeof clientSchema>;

// Sortable Card Component
function SortableCard({ card, isRearranging }: { card: any; isRearranging: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, disabled: !isRearranging });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    borderLeft: `6px solid ${card.borderColor}`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-card rounded-xl border-2 border-border shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group hover-scale relative"
      onClick={isRearranging ? undefined : card.onClick}
      data-testid={card.testId}
      {...attributes}
    >
      <div className="p-4 flex flex-col items-center gap-3">
        {/* Drag Handle - only visible when rearranging */}
        {isRearranging && (
          <div
            {...listeners}
            className="absolute top-1 right-1 p-1.5 bg-background/80 rounded-lg cursor-grab active:cursor-grabbing shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="material-icons text-muted-foreground text-base">drag_indicator</span>
          </div>
        )}
        
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border-2"
          style={{ backgroundColor: `${card.borderColor}15`, color: card.borderColor, borderColor: `${card.borderColor}40` }}
        >
          <span className="material-icons text-4xl">{card.icon}</span>
        </div>
        <div className="text-center">
          <div className="text-base font-bold text-foreground mb-0.5">{card.label}</div>
          <div className="text-xs text-muted-foreground">{card.description}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("");

  // Scroll to top when changing tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToNav = () => {
    setActiveTab("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [showEditEmployeeDialog, setShowEditEmployeeDialog] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<any | null>(null);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showEditClientDialog, setShowEditClientDialog] = useState(false);
  const [showDeleteClientDialog, setShowDeleteClientDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [lmsNumbers, setLmsNumbers] = useState<Array<{ number: string; address: string; stories?: number; units?: number; parkingStalls?: number; dailyDropTarget?: number; totalDropsNorth?: number; totalDropsEast?: number; totalDropsSouth?: number; totalDropsWest?: number }>>([{ number: "", address: "" }]);
  const [editLmsNumbers, setEditLmsNumbers] = useState<Array<{ number: string; address: string; stories?: number; units?: number; parkingStalls?: number; dailyDropTarget?: number; totalDropsNorth?: number; totalDropsEast?: number; totalDropsSouth?: number; totalDropsWest?: number }>>([{ number: "", address: "" }]);
  const [sameAsAddress, setSameAsAddress] = useState(false);
  const [editSameAsAddress, setEditSameAsAddress] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientForProject, setSelectedClientForProject] = useState<string>("");
  const [selectedStrataForProject, setSelectedStrataForProject] = useState<string>("");
  const isManualEntryRef = useRef(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
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
  const [employeeFormStep, setEmployeeFormStep] = useState<1 | 2>(1); // Track form step (1 = info, 2 = permissions)
  const [editEmployeeFormStep, setEditEmployeeFormStep] = useState<1 | 2>(1); // Track edit form step
  const [showTerminationConfirm, setShowTerminationConfirm] = useState(false); // Confirmation for termination
  const [showTerminationDialog, setShowTerminationDialog] = useState(false); // Dialog for termination details
  const [terminationData, setTerminationData] = useState<{ reason: string; notes: string }>({ reason: "", notes: "" });
  const [cardOrder, setCardOrder] = useState<string[]>([]);
  const [isRearranging, setIsRearranging] = useState(false);
  const [showSaveAsClientDialog, setShowSaveAsClientDialog] = useState(false);
  const [projectDataForClient, setProjectDataForClient] = useState<any>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch projects with auto-refresh to show real-time progress
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true,
  });

  // Fetch all employees (including terminated) for management
  const { data: employeesData, isLoading: employeesLoading } = useQuery({
    queryKey: ["/api/employees/all"],
  });

  // Fetch all clients
  const { data: clientsData, isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Fetch today's drops for daily target
  const { data: myDropsData } = useQuery({
    queryKey: ["/api/my-drops-today"],
  });

  // Fetch current user to get company info
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  // Fetch user preferences
  const { data: preferencesData } = useQuery({
    queryKey: ["/api/user-preferences"],
    enabled: !!userData?.user,
  });

  // Extract user from userData for use throughout component
  const user = userData?.user;

  // License verification gate - redirect unverified company owners
  useEffect(() => {
    if (user) {
      // Only check company role users
      if (user.role === 'company' && user.licenseVerified !== true) {
        // Check if user explicitly chose read-only mode
        const allowReadOnly = localStorage.getItem("allowReadOnlyMode");
        
        if (allowReadOnly !== "true") {
          console.log('[License Gate] Redirecting unverified company user to license verification page');
          setLocation("/license-verification");
        } else {
          console.log('[License Gate] User in read-only mode - allowing access with restrictions');
        }
      }
    }
  }, [userData, setLocation]);

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
  const completedSessions = allWorkSessions.filter((s: any) => 
    s.endTime !== null && // Session is completed
    s.dailyDropTarget != null && // Has a drop target (excludes non-drop-based work)
    s.dailyDropTarget > 0 && // Target is meaningful
    s.techName // Has a valid employee name (checking truthiness instead of != null)
  );
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
      calendarColor: "#3b82f6",
    },
  });

  const employeeForm = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "rope_access_tech",
      hourlyRate: "",
      permissions: [],
      startDate: "",
      birthday: "",
      driversLicenseNumber: "",
      driversLicenseProvince: "",
      driversLicenseDocuments: [],
      homeAddress: "",
      employeePhoneNumber: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      specialMedicalConditions: "",
      irataLevel: "",
      irataLicenseNumber: "",
      irataIssuedDate: "",
      irataExpirationDate: "",
    },
  });

  const editEmployeeForm = useForm<EditEmployeeFormData>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "rope_access_tech",
      hourlyRate: "",
      permissions: [],
      startDate: "",
      birthday: "",
      driversLicenseNumber: "",
      driversLicenseProvince: "",
      driversLicenseDocuments: [],
      homeAddress: "",
      employeePhoneNumber: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      specialMedicalConditions: "",
      irataLevel: "",
      irataLicenseNumber: "",
      irataIssuedDate: "",
      irataExpirationDate: "",
      terminatedDate: "",
      terminationReason: "",
      terminationNotes: "",
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
      dropsNorth: "0",
      dropsEast: "0",
      dropsSouth: "0",
      dropsWest: "0",
      shortfallReason: "",
    },
  });

  const clientForm = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      phoneNumber: "",
      lmsNumbers: [""],
      billingAddress: "",
      sameAsAddress: false,
    },
  });

  const editClientForm = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      phoneNumber: "",
      lmsNumbers: [""],
      billingAddress: "",
      sameAsAddress: false,
    },
  });

  // Auto-select all permissions for Owner/CEO role when creating employee
  // Auto-select financial permissions for Accounting role when creating employee
  useEffect(() => {
    const subscription = employeeForm.watch((value, { name }) => {
      if (name === "role") {
        if (value.role === "owner_ceo") {
          const allPermissionIds = AVAILABLE_PERMISSIONS.map(p => p.id);
          employeeForm.setValue("permissions", allPermissionIds);
        } else if (value.role === "accounting") {
          const currentPermissions = employeeForm.getValues("permissions") || [];
          if (!currentPermissions.includes("view_financial_data")) {
            employeeForm.setValue("permissions", [...currentPermissions, "view_financial_data"]);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [employeeForm]);

  // Auto-select all permissions for Owner/CEO role when editing employee
  // Auto-select financial permissions for Accounting role when editing employee
  useEffect(() => {
    const subscription = editEmployeeForm.watch((value, { name }) => {
      if (name === "role") {
        if (value.role === "owner_ceo") {
          const allPermissionIds = AVAILABLE_PERMISSIONS.map(p => p.id);
          editEmployeeForm.setValue("permissions", allPermissionIds);
        } else if (value.role === "accounting") {
          const currentPermissions = editEmployeeForm.getValues("permissions") || [];
          if (!currentPermissions.includes("view_financial_data")) {
            editEmployeeForm.setValue("permissions", [...currentPermissions, "view_financial_data"]);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [editEmployeeForm]);

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      
      // Store project data BEFORE resetting
      const formData = projectForm.getValues();
      
      // Check if this project was created from client database or manually
      // If selectedClientForProject is empty, it means manual entry
      const wasManualEntry = !selectedClientForProject;
      
      // Close dialog and reset everything
      setShowProjectDialog(false);
      projectForm.reset();
      setUploadedPlanFile(null);
      setSelectedClientForProject("");
      setSelectedStrataForProject("");
      isManualEntryRef.current = false;
      
      toast({ title: "Project created successfully" });
      
      // If manual entry, show save dialog after a brief delay
      if (wasManualEntry) {
        setProjectDataForClient(formData);
        setTimeout(() => {
          setShowSaveAsClientDialog(true);
        }, 100);
      }
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
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      setShowEmployeeDialog(false);
      setEmployeeFormStep(1); // Reset to step 1
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
        hourlyRate: data.hourlyRate,
        permissions: data.permissions,
        startDate: data.startDate,
        birthday: data.birthday,
        driversLicenseNumber: data.driversLicenseNumber,
        driversLicenseProvince: data.driversLicenseProvince,
        driversLicenseDocuments: data.driversLicenseDocuments,
        homeAddress: data.homeAddress,
        employeePhoneNumber: data.employeePhoneNumber,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        specialMedicalConditions: data.specialMedicalConditions,
        irataLevel: data.irataLevel,
        irataLicenseNumber: data.irataLicenseNumber,
        irataIssuedDate: data.irataIssuedDate,
        irataExpirationDate: data.irataExpirationDate,
        terminatedDate: data.terminatedDate,
        terminationReason: data.terminationReason,
        terminationNotes: data.terminationNotes,
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      // Invalidate all work sessions to refresh hourly rates
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          query.queryKey.length >= 3 && 
          query.queryKey[0] === "/api/projects" && 
          query.queryKey[2] === "work-sessions"
      });
      setShowEditEmployeeDialog(false);
      setEditEmployeeFormStep(1); // Reset to step 1
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

  const handleClientStrataSelection = (value: string) => {
    setSelectedStrataForProject(value);
    
    if (value === "manual") {
      // Set the ref to track manual entry
      isManualEntryRef.current = true;
      // Clear all form fields
      projectForm.reset();
      setSelectedClientForProject("");
      return;
    }
    
    // Not manual entry
    isManualEntryRef.current = false;

    // Parse the value (format: "clientId|strataNumber")
    const [clientId, strataIndex] = value.split("|");
    setSelectedClientForProject(clientId);
    
    // Find the client and strata details
    const client = clientsData?.find(c => c.id === clientId);
    if (client && client.lmsNumbers && client.lmsNumbers.length > 0) {
      const strataIdx = parseInt(strataIndex);
      const strata = client.lmsNumbers[strataIdx];
      
      if (strata) {
        // Autofill the form
        projectForm.setValue("strataPlanNumber", strata.number);
        projectForm.setValue("buildingAddress", strata.address || "");
        
        // Optionally set building name from client company or generate from strata
        projectForm.setValue("buildingName", `${strata.number} Building`);
        
        // Always populate all available building details
        // The form will show/hide fields based on selected job type
        if (strata.stories !== undefined && strata.stories !== null) {
          projectForm.setValue("floorCount", String(strata.stories));
        }
        
        // Populate Daily Drop Target if available
        if (strata.dailyDropTarget !== undefined && strata.dailyDropTarget !== null) {
          projectForm.setValue("dailyDropTarget", String(strata.dailyDropTarget));
        }
        
        // Populate Total Drops per Elevation if available
        if (strata.totalDropsNorth !== undefined && strata.totalDropsNorth !== null) {
          projectForm.setValue("totalDropsNorth", String(strata.totalDropsNorth));
        }
        if (strata.totalDropsEast !== undefined && strata.totalDropsEast !== null) {
          projectForm.setValue("totalDropsEast", String(strata.totalDropsEast));
        }
        if (strata.totalDropsSouth !== undefined && strata.totalDropsSouth !== null) {
          projectForm.setValue("totalDropsSouth", String(strata.totalDropsSouth));
        }
        if (strata.totalDropsWest !== undefined && strata.totalDropsWest !== null) {
          projectForm.setValue("totalDropsWest", String(strata.totalDropsWest));
        }
      }
    }
  };

  const handleSaveProjectAsClient = () => {
    if (!projectDataForClient) return;
    
    // Pre-fill the client form with building details from the project
    const lmsData = [{
      number: projectDataForClient.strataPlanNumber || "",
      address: projectDataForClient.buildingAddress || "",
      stories: projectDataForClient.floorCount ? parseInt(projectDataForClient.floorCount) : undefined,
      dailyDropTarget: projectDataForClient.dailyDropTarget ? parseInt(projectDataForClient.dailyDropTarget) : undefined,
      totalDropsNorth: projectDataForClient.totalDropsNorth ? parseInt(projectDataForClient.totalDropsNorth) : undefined,
      totalDropsEast: projectDataForClient.totalDropsEast ? parseInt(projectDataForClient.totalDropsEast) : undefined,
      totalDropsSouth: projectDataForClient.totalDropsSouth ? parseInt(projectDataForClient.totalDropsSouth) : undefined,
      totalDropsWest: projectDataForClient.totalDropsWest ? parseInt(projectDataForClient.totalDropsWest) : undefined,
    }];
    
    setLmsNumbers(lmsData);
    
    // Reset the client form with empty contact info
    clientForm.reset({
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      phoneNumber: "",
      billingAddress: "",
    });
    
    // Close the save dialog
    setShowSaveAsClientDialog(false);
    setProjectDataForClient(null);
    
    // Switch to Clients tab and open the client dialog
    setActiveTab("clients");
    setTimeout(() => {
      setShowClientDialog(true);
    }, 100);
  };

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
      hourlyRate: employee.hourlyRate || "",
      permissions: employee.permissions || [],
      startDate: employee.startDate || "",
      birthday: employee.birthday || "",
      driversLicenseNumber: employee.driversLicenseNumber || "",
      driversLicenseProvince: employee.driversLicenseProvince || "",
      driversLicenseDocuments: employee.driversLicenseDocuments || [],
      homeAddress: employee.homeAddress || "",
      employeePhoneNumber: employee.employeePhoneNumber || "",
      emergencyContactName: employee.emergencyContactName || "",
      emergencyContactPhone: employee.emergencyContactPhone || "",
      specialMedicalConditions: employee.specialMedicalConditions || "",
      irataLevel: employee.irataLevel || "",
      irataLicenseNumber: employee.irataLicenseNumber || "",
      irataIssuedDate: employee.irataIssuedDate || "",
      irataExpirationDate: employee.irataExpirationDate || "",
      terminatedDate: employee.terminatedDate || "",
      terminationReason: employee.terminationReason || "",
      terminationNotes: employee.terminationNotes || "",
    });
    setEditEmployeeFormStep(1); // Reset to first step
    setShowEditEmployeeDialog(true);
  };
  
  // Watch for termination date changes
  const watchedTerminationDate = editEmployeeForm.watch("terminatedDate");
  useEffect(() => {
    // If a termination date is set and there's no termination reason yet, open dialog
    if (watchedTerminationDate && !editEmployeeForm.getValues("terminationReason") && employeeToEdit && !employeeToEdit.terminatedDate) {
      setShowTerminationDialog(true);
    }
  }, [watchedTerminationDate, employeeToEdit]);
  
  const handleTerminationSubmit = () => {
    editEmployeeForm.setValue("terminationReason", terminationData.reason);
    editEmployeeForm.setValue("terminationNotes", terminationData.notes);
    setShowTerminationDialog(false);
    setTerminationData({ reason: "", notes: "" });
  };
  
  const reactivateEmployeeMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const response = await apiRequest("POST", `/api/employees/${employeeId}/reactivate`, {});
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      toast({
        title: "Employee reactivated successfully",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      setEmployeeToDelete(null);
      toast({ title: "Employee deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
      const { sameAsAddress, ...clientData } = data;
      return await apiRequest("POST", "/api/clients", {
        ...clientData,
        companyId: currentUser?.id,
        lmsNumbers: lmsNumbers.filter(lms => lms.number.trim() !== ""),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setShowClientDialog(false);
      clientForm.reset();
      setLmsNumbers([{ number: "", address: "" }]);
      setSameAsAddress(false);
      toast({ title: "Client created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const editClientMutation = useMutation({
    mutationFn: async (data: { id: string } & ClientFormData) => {
      const { id, sameAsAddress, ...clientData } = data;
      return await apiRequest("PATCH", `/api/clients/${id}`, {
        ...clientData,
        lmsNumbers: editLmsNumbers.filter(lms => lms.number.trim() !== ""),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setShowEditClientDialog(false);
      setClientToEdit(null);
      editClientForm.reset();
      setEditLmsNumbers([{ number: "", address: "" }]);
      setEditSameAsAddress(false);
      toast({ title: "Client updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      return await apiRequest("DELETE", `/api/clients/${clientId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setShowDeleteClientDialog(false);
      setClientToDelete(null);
      toast({ title: "Client deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteClientDialog(true);
  };

  const confirmDeleteClient = () => {
    if (clientToDelete) {
      deleteClientMutation.mutate(clientToDelete.id);
    }
  };

  const onClientSubmit = async (data: ClientFormData) => {
    createClientMutation.mutate(data);
  };

  const onEditClientSubmit = async (data: ClientFormData) => {
    if (!clientToEdit) return;
    editClientMutation.mutate({ ...data, id: clientToEdit.id });
  };

  const handleEditClient = (client: Client) => {
    setClientToEdit(client);
    editClientForm.reset({
      firstName: client.firstName,
      lastName: client.lastName,
      company: client.company || "",
      address: client.address || "",
      phoneNumber: client.phoneNumber || "",
      billingAddress: client.billingAddress || "",
      sameAsAddress: false,
    });
    setEditLmsNumbers(client.lmsNumbers && client.lmsNumbers.length > 0 ? client.lmsNumbers : [{ number: "", address: "" }]);
    setEditSameAsAddress(client.address === client.billingAddress);
    setShowEditClientDialog(true);
  };

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

  // Helper function to get current GPS location
  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser");
        toast({ 
          title: "Location Not Available", 
          description: "Your browser doesn't support location tracking",
          variant: "destructive" 
        });
        resolve(null);
        return;
      }

      console.log("Requesting location permission...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location captured:", position.coords.latitude, position.coords.longitude);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Failed to get location:", error.message);
          if (error.code === error.PERMISSION_DENIED) {
            toast({ 
              title: "Location Permission Denied", 
              description: "Location tracking is optional but helps verify work site attendance",
            });
          } else if (error.code === error.TIMEOUT) {
            toast({ 
              title: "Location Timeout", 
              description: "Could not determine location in time. Session will continue without location data.",
            });
          }
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const startDayMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const location = await getCurrentLocation();
      console.log("Starting work session with location:", location);
      return apiRequest("POST", `/api/projects/${projectId}/work-sessions/start`, {
        startLatitude: location?.latitude,
        startLongitude: location?.longitude,
      });
    },
    onSuccess: (data) => {
      console.log("Start day response:", data);
      setActiveSession(data.session);
      setShowStartDayDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-drops-today"] });
      const hasLocation = data.session?.startLatitude && data.session?.startLongitude;
      toast({ 
        title: "Work session started", 
        description: hasLocation 
          ? "Good luck today! Location recorded." 
          : "Good luck today! (Location not recorded)"
      });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const endDayMutation = useMutation({
    mutationFn: async (data: EndDayFormData & { sessionId: string; projectId: string }) => {
      const location = await getCurrentLocation();
      console.log("Ending work session with location:", location);
      return apiRequest("PATCH", `/api/projects/${data.projectId}/work-sessions/${data.sessionId}/end`, {
        dropsCompletedNorth: parseInt(data.dropsNorth) || 0,
        dropsCompletedEast: parseInt(data.dropsEast) || 0,
        dropsCompletedSouth: parseInt(data.dropsSouth) || 0,
        dropsCompletedWest: parseInt(data.dropsWest) || 0,
        shortfallReason: data.shortfallReason,
        endLatitude: location?.latitude,
        endLongitude: location?.longitude,
      });
    },
    onSuccess: (data) => {
      setActiveSession(null);
      setShowEndDayDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-drops-today"] });
      endDayForm.reset();
      const hasLocation = data?.session?.endLatitude && data?.session?.endLongitude;
      toast({ 
        title: "Work session ended", 
        description: hasLocation 
          ? "Great work today! Location recorded." 
          : "Great work today! (Location not recorded)"
      });
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
    
    // Get the daily target from the active session's project
    const activeProject = projects.find(p => p.id === activeSession.projectId);
    const sessionDailyTarget = activeProject?.dailyDropTarget || 0;
    
    // Calculate total drops from all elevations being submitted
    const dropsNorth = parseInt(data.dropsNorth) || 0;
    const dropsEast = parseInt(data.dropsEast) || 0;
    const dropsSouth = parseInt(data.dropsSouth) || 0;
    const dropsWest = parseInt(data.dropsWest) || 0;
    const totalDropsBeingSubmitted = dropsNorth + dropsEast + dropsSouth + dropsWest;
    
    // Calculate total drops today: existing drops + new drops being submitted
    const totalDropsToday = todayDrops + totalDropsBeingSubmitted;
    
    // Validate shortfall reason is required when TOTAL drops < target
    if (totalDropsToday < sessionDailyTarget && !data.shortfallReason?.trim()) {
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

  // Get current user for permission checks
  const currentUser = userData?.user;
  const userIsReadOnly = isReadOnly(currentUser);

  // Dashboard card configuration with permission filtering
  const dashboardCards = useMemo(() => [
    {
      id: "projects",
      label: "Projects",
      description: "Active projects",
      icon: "apartment",
      onClick: () => handleTabChange("projects"),
      testId: "button-nav-projects",
      isVisible: () => true, // Everyone
      borderColor: "#3b82f6",
    },
    {
      id: "non-billable-hours",
      label: "Non-Billable Hours",
      description: "Errands & training",
      icon: "schedule",
      onClick: () => setLocation("/non-billable-hours"),
      testId: "button-non-billable-hours",
      isVisible: () => true, // Everyone
      borderColor: "#06b6d4",
    },
    {
      id: "past-projects",
      label: "Past Projects",
      description: "Completed work",
      icon: "done_all",
      onClick: () => handleTabChange("past-projects"),
      testId: "button-nav-past-projects",
      isVisible: () => true, // Everyone
      borderColor: "#60a5fa",
    },
    {
      id: "employees",
      label: "Employees",
      description: "Manage team",
      icon: "people",
      onClick: () => handleTabChange("employees"),
      testId: "button-nav-employees",
      isVisible: (user: any) => canManageEmployees(user), // Management only
      borderColor: "#a855f7",
    },
    {
      id: "clients",
      label: "Clients",
      description: "Property managers",
      icon: "business",
      onClick: () => handleTabChange("clients"),
      testId: "button-nav-clients",
      isVisible: (user: any) => hasPermission(user, "view_clients"), // Permission-based
      borderColor: "#10b981",
    },
    {
      id: "performance",
      label: "Performance",
      description: "View analytics",
      icon: "analytics",
      onClick: () => handleTabChange("performance"),
      testId: "button-nav-performance",
      isVisible: (user: any) => canViewPerformance(user), // Management only
      borderColor: "#f97316",
    },
    {
      id: "active-workers",
      label: "Active Workers",
      description: "Who's working",
      icon: "work_history",
      onClick: () => setLocation("/active-workers"),
      testId: "button-active-workers",
      isVisible: (user: any) => hasPermission(user, "view_active_workers"), // Permission-based
      borderColor: "#6366f1",
    },
    {
      id: "complaints",
      label: "Complaints",
      description: "Resident feedback",
      icon: "feedback",
      onClick: () => handleTabChange("complaints"),
      testId: "button-nav-complaints",
      isVisible: () => true, // Everyone
      borderColor: "#ec4899",
    },
    {
      id: "inventory",
      label: "Inventory & Inspections",
      description: "Gear & safety checks",
      icon: "inventory_2",
      onClick: () => setLocation("/inventory"),
      testId: "button-inventory",
      isVisible: () => true, // Everyone can access (tabs handle different views)
      borderColor: "#d97706",
    },
    {
      id: "toolbox-meeting",
      label: "Toolbox Meeting",
      description: "Safety meeting",
      icon: "group",
      onClick: () => setLocation("/toolbox-meeting"),
      testId: "button-toolbox-meeting",
      isVisible: () => true, // Everyone
      borderColor: "#f87171",
    },
    {
      id: "payroll",
      label: "Payroll",
      description: "Employee hours",
      icon: "payments",
      onClick: () => setLocation("/payroll"),
      testId: "button-payroll",
      isVisible: (user: any) => hasFinancialAccess(user), // Financial permission required
      borderColor: "#22c55e",
    },
    {
      id: "quotes",
      label: "Quotes",
      description: "Service quotes",
      icon: "request_quote",
      onClick: () => setLocation("/quotes"),
      testId: "button-quotes",
      isVisible: (user: any) => hasFinancialAccess(user), // Financial permission required
      borderColor: "#16a34a",
    },
    {
      id: "schedule",
      label: "Job Schedule",
      description: "Team assignments",
      icon: "event",
      onClick: () => setLocation("/schedule"),
      testId: "button-schedule",
      isVisible: (user: any) => isManagement(user), // Management only
      borderColor: "#0ea5e9",
    },
    {
      id: "documents",
      label: "Documents",
      description: "Project files",
      icon: "folder",
      onClick: () => handleTabChange("documents"),
      testId: "button-documents",
      isVisible: () => true, // Everyone
      borderColor: "#14b8a6",
    },
  ].filter(card => {
    try {
      return card.isVisible(currentUser);
    } catch (e) {
      console.error('Error filtering card:', card.id, e);
      return false;
    }
  }), [currentUser]); // useMemo dependency - only recreate when currentUser changes

  // Load saved card order from localStorage
  // Load saved card order from backend preferences
  useEffect(() => {
    if (preferencesData?.preferences?.dashboardCardOrder) {
      setCardOrder(preferencesData.preferences.dashboardCardOrder);
    } else {
      setCardOrder(dashboardCards.map(c => c.id));
    }
  }, [preferencesData, dashboardCards]); // Re-run when preferences or available cards change

  // Sort cards based on saved order
  const sortedDashboardCards = [...dashboardCards].sort((a, b) => {
    const aIndex = cardOrder.indexOf(a.id);
    const bIndex = cardOrder.indexOf(b.id);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  // Handle drag end
  // Mutation to save preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: { dashboardCardOrder?: string[], hoursAnalyticsCardOrder?: string[] }) => {
      const response = await apiRequest("POST", "/api/user-preferences", updates);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-preferences"] });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = sortedDashboardCards.findIndex(c => c.id === active.id);
      const newIndex = sortedDashboardCards.findIndex(c => c.id === over.id);
      
      const newOrder = arrayMove(sortedDashboardCards, oldIndex, newIndex).map(c => c.id);
      setCardOrder(newOrder);
      updatePreferencesMutation.mutate({ dashboardCardOrder: newOrder });
    }
  };

  // Reset card order to default
  const resetCardOrder = () => {
    const defaultOrder = dashboardCards.map(c => c.id);
    setCardOrder(defaultOrder);
    
    // Save to backend
    updatePreferencesMutation.mutate({ dashboardCardOrder: defaultOrder });
    
    toast({ title: "Layout reset", description: "Dashboard cards restored to default order" });
  };

  // Get page title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case "": return "Dashboard";
      case "projects": return "Projects";
      case "past-projects": return "Past Projects";
      case "performance": return "Performance";
      case "complaints": return "Complaints";
      case "employees": return "Employees";
      case "documents": return "Documents";
      case "clients": return "Clients";
      default: return "Dashboard";
    }
  };

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
    <div className="min-h-screen page-gradient">
      {/* Header - Premium Glass Effect */}
      <header className="sticky top-0 z-[100] glass backdrop-blur-xl border-b border-border/50 shadow-premium">
        <div className="px-6 h-20 flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold gradient-text">{getPageTitle()}</h1>
            {companyName && (
              <p className="text-sm text-muted-foreground mt-1 font-medium">{companyName}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" data-testid="button-profile" onClick={() => setLocation("/profile")} className="hover-elevate w-12 h-12">
              <span className="material-icons text-2xl">person</span>
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-logout" onClick={() => setShowLogoutDialog(true)} className="hover-elevate w-12 h-12">
              <span className="material-icons text-2xl">logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Read-Only Mode Banner */}
      {currentUser && isReadOnly(currentUser) && (
        <Alert className="mx-4 mt-4 border-yellow-500/50 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          <div className="flex-1">
            <AlertTitle className="text-yellow-700 dark:text-yellow-400">Read-Only Mode</AlertTitle>
            <AlertDescription className="text-yellow-600 dark:text-yellow-500 mb-3">
              Your account is in read-only mode. Verify your license to create, edit, or delete data.
            </AlertDescription>
            <Button
              onClick={() => setLocation("/license-verification")}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              size="sm"
              data-testid="button-verify-license"
            >
              <span className="material-icons text-sm mr-1">verified_user</span>
              Verify License Key
            </Button>
          </div>
        </Alert>
      )}

      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        {/* Navigation Grid - Permission-filtered dashboard cards */}
        {activeTab === "" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold gradient-text">Quick Actions</h2>
              <div className="flex gap-2">
                <Button
                  variant={isRearranging ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsRearranging(!isRearranging)}
                  className="gap-2"
                  data-testid="button-rearrange-cards"
                >
                  <span className="material-icons text-base">
                    {isRearranging ? "check" : "swap_vert"}
                  </span>
                  {isRearranging ? "Done" : "Rearrange Cards"}
                </Button>
                {isRearranging && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetCardOrder}
                    className="gap-2"
                    data-testid="button-reset-layout"
                  >
                    <span className="material-icons text-base">restart_alt</span>
                    Reset
                  </Button>
                )}
              </div>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedDashboardCards.map(c => c.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedDashboardCards.map(card => (
                    <SortableCard key={card.id} card={card} isRearranging={isRearranging} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Back Button for all tabs */}
        {activeTab !== "" && (
          <div className="mb-4">
            <Button 
              variant="ghost" 
              onClick={handleBackToNav}
              data-testid="button-back-to-nav"
              className="gap-2"
            >
              <span className="material-icons">arrow_back</span>
              Back to Dashboard
            </Button>
          </div>
        )}

        {activeTab === "projects" && (
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
                    <Button 
                      className="h-14 px-6 gap-2 shadow-md hover:shadow-lg text-base font-semibold" 
                      data-testid="button-create-project"
                      disabled={userIsReadOnly}
                    >
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
                        <div className="mb-4">
                          <label className="text-sm font-medium mb-2 block">Quick Fill from Client Database</label>
                          <Popover open={clientDropdownOpen} onOpenChange={setClientDropdownOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={clientDropdownOpen}
                                className="w-full h-12 justify-between"
                                data-testid="button-client-strata-search"
                              >
                                {selectedStrataForProject && selectedStrataForProject !== "manual"
                                  ? (() => {
                                      const [clientId, strataIdx] = selectedStrataForProject.split("|");
                                      const client = clientsData?.find(c => c.id === clientId);
                                      const strata = client?.lmsNumbers?.[parseInt(strataIdx)];
                                      return strata ? `${strata.number} - ${client.firstName} ${client.lastName}` : "Select a building...";
                                    })()
                                  : selectedStrataForProject === "manual"
                                  ? "Enter Details Manually"
                                  : "Select a building..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0">
                              <Command>
                                <CommandInput placeholder="Search by client, strata, or address..." />
                                <CommandList>
                                  <CommandEmpty>
                                    <div className="py-6 text-center">
                                      <p className="text-sm text-muted-foreground mb-3">No clients found.</p>
                                      <Button
                                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                                        size="default"
                                        onClick={() => {
                                          handleClientStrataSelection("manual");
                                          setClientDropdownOpen(false);
                                        }}
                                        data-testid="button-manual-entry-empty"
                                      >
                                        <span className="material-icons mr-2">edit</span>
                                        Enter Details Manually
                                      </Button>
                                    </div>
                                  </CommandEmpty>
                                  <CommandGroup>
                                    <CommandItem
                                      value="manual"
                                      onSelect={() => {
                                        handleClientStrataSelection("manual");
                                        setClientDropdownOpen(false);
                                      }}
                                      className="!bg-primary !text-primary-foreground font-medium hover:!bg-primary/90 rounded-xl mx-2 my-1"
                                    >
                                      <span className="material-icons mr-2 text-sm">edit</span>
                                      Enter Details Manually
                                    </CommandItem>
                                    {clientsData && clientsData.length > 0 && clientsData.flatMap((client) =>
                                      client.lmsNumbers && client.lmsNumbers.length > 0
                                        ? client.lmsNumbers.map((strata, idx) => (
                                            <CommandItem
                                              key={`${client.id}-${idx}`}
                                              value={`${strata.number} ${client.firstName} ${client.lastName} ${strata.address || ""}`}
                                              onSelect={() => {
                                                handleClientStrataSelection(`${client.id}|${idx}`);
                                                setClientDropdownOpen(false);
                                              }}
                                            >
                                              <Check
                                                className={`mr-2 h-4 w-4 ${selectedStrataForProject === `${client.id}|${idx}` ? "opacity-100" : "opacity-0"}`}
                                              />
                                              <div className="flex flex-col">
                                                <span className="font-medium">{strata.number} - {client.firstName} {client.lastName}</span>
                                                {strata.address && <span className="text-xs text-muted-foreground">{strata.address}</span>}
                                              </div>
                                            </CommandItem>
                                          ))
                                        : []
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <p className="text-xs text-muted-foreground mt-1">
                            Search and select a building from your client database to auto-fill details
                          </p>
                        </div>

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
                                  <SelectItem value="dryer_vent_cleaning">Exterior Dryer Vent Cleaning</SelectItem>
                                  <SelectItem value="pressure_washing">Pressure Washing</SelectItem>
                                  <SelectItem value="general_pressure_washing">General Pressure Washing</SelectItem>
                                  <SelectItem value="gutter_cleaning">Gutter Cleaning</SelectItem>
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
                          <>
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
                            <FormField
                              control={projectForm.control}
                              name="buildingFloors"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Building Floors</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="1" placeholder="Total floors in building" {...field} data-testid="input-building-floors" className="h-12" />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    How many floors does the building have?
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

                        <FormField
                          control={projectForm.control}
                          name="calendarColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Calendar Color</FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-3">
                                  <Input 
                                    type="color" 
                                    {...field} 
                                    data-testid="input-calendar-color"
                                    className="h-12 w-20 cursor-pointer"
                                  />
                                  <span className="text-sm text-muted-foreground">{field.value}</span>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                Choose the color this project appears on the calendar
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
        )}

        {activeTab === "past-projects" && (
          <div>
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
          </div>
        )}

        {activeTab === "performance" && (
          <div>
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

                  {/* Hours Analytics Card */}
                  <Card 
                    className="hover-elevate active-elevate-2 cursor-pointer"
                    onClick={() => setLocation("/hours-analytics")}
                    data-testid="card-hours-analytics"
                  >
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">Hours Analytics</CardTitle>
                        <CardDescription className="text-sm">
                          View billable vs non-billable hours breakdown
                        </CardDescription>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="material-icons text-primary text-2xl">pie_chart</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Analyze time allocation across all projects
                      </p>
                    </CardContent>
                  </Card>

                  {/* Job Schedule Card - Only visible with permission */}
                  {canViewSchedule(user) && (
                    <Card 
                      className="hover-elevate active-elevate-2 cursor-pointer"
                      onClick={() => setLocation("/schedule")}
                      data-testid="card-schedule"
                    >
                      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg">Job Schedule</CardTitle>
                          <CardDescription className="text-sm">
                            Manage team assignments and job scheduling
                          </CardDescription>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="material-icons text-primary text-2xl">event</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Schedule jobs and assign employees to tasks
                        </p>
                      </CardContent>
                    </Card>
                  )}
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
          </div>
        )}


        {activeTab === "complaints" && (
          <div>
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
          </div>
        )}

        {activeTab === "employees" && (
          <div>
            <div className="space-y-4">
              {/* Create Employee Button */}
              <Dialog open={showEmployeeDialog} onOpenChange={(open) => { setShowEmployeeDialog(open); if (!open) setEmployeeFormStep(1); }}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full h-12 gap-2" 
                    data-testid="button-create-employee"
                    disabled={userIsReadOnly}
                  >
                    <span className="material-icons">person_add</span>
                    Add New Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md p-0 max-h-[95vh] flex flex-col">
                  <div className="p-6 border-b">
                    <DialogHeader>
                      <DialogTitle>
                        {employeeFormStep === 1 ? "Employee Information" : "Permissions"}
                      </DialogTitle>
                      <DialogDescription>
                        {employeeFormStep === 1 ? "Step 1 of 2: Enter employee details" : "Step 2 of 2: Configure access permissions"}
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  <div className="overflow-y-auto flex-1 p-6">
                    <Form {...employeeForm}>
                      <form onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)} className="space-y-4">
                      {employeeFormStep === 1 && (
                        <>
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
                          <FormItem className="space-y-3">
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-3"
                              >
                                {ROLE_OPTIONS.map((role) => (
                                  <FormItem key={role.value}>
                                    <FormControl>
                                      <div className="relative">
                                        <RadioGroupItem
                                          value={role.value}
                                          id={`role-${role.value}`}
                                          className="peer sr-only"
                                          data-testid={`radio-role-${role.value}`}
                                        />
                                        <FormLabel
                                          htmlFor={`role-${role.value}`}
                                          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-background p-3 hover-elevate active-elevate-2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                        >
                                          <span className="material-icons text-2xl text-primary">
                                            {role.icon}
                                          </span>
                                          <span className="text-xs font-medium text-center leading-tight">
                                            {role.label}
                                          </span>
                                        </FormLabel>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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

                      <div className="border-t pt-4 mt-6">
                        <h3 className="text-sm font-medium mb-4">Personal Details (Optional)</h3>
                        
                        <div className="space-y-4">
                          <FormField
                            control={employeeForm.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} data-testid="input-employee-start-date" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="birthday"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Birthday</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} data-testid="input-employee-birthday" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="driversLicenseNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Driver's License Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="License number" {...field} data-testid="input-employee-dl-number" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="driversLicenseProvince"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Driver's License Province/State</FormLabel>
                                <FormControl>
                                  <Input placeholder="BC, AB, etc." {...field} data-testid="input-employee-dl-province" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <DocumentUploader
                            documents={employeeForm.watch("driversLicenseDocuments") || []}
                            onDocumentsChange={(docs) => employeeForm.setValue("driversLicenseDocuments", docs)}
                            maxDocuments={5}
                            label="Driver's License Documents"
                            description="Upload driver's license photos, abstracts, or related documents"
                          />

                          <FormField
                            control={employeeForm.control}
                            name="homeAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Home Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Street address" {...field} data-testid="input-employee-address" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="employeePhoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input type="tel" placeholder="(604) 555-1234" {...field} data-testid="input-employee-phone" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="emergencyContactName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Emergency Contact Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Contact name" {...field} data-testid="input-employee-emergency-name" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="emergencyContactPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Emergency Contact Phone</FormLabel>
                                <FormControl>
                                  <Input type="tel" placeholder="(604) 555-1234" {...field} data-testid="input-employee-emergency-phone" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="specialMedicalConditions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Special Medical Conditions</FormLabel>
                                <FormControl>
                                  <Input placeholder="Medical conditions to be aware of" {...field} data-testid="input-employee-medical" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="border-t pt-4 mt-4">
                            <h4 className="text-sm font-medium mb-4">IRATA Certification (Optional)</h4>
                            <div className="space-y-4">
                              <FormField
                                control={employeeForm.control}
                                name="irataLevel"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>IRATA Level</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="h-12" data-testid="select-irata-level">
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

                              {employeeForm.watch("irataLevel") && (
                                <>
                                  <FormField
                                    control={employeeForm.control}
                                    name="irataLicenseNumber"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>IRATA License Number</FormLabel>
                                        <FormControl>
                                          <Input placeholder="License number" {...field} data-testid="input-irata-license" className="h-12" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={employeeForm.control}
                                    name="irataIssuedDate"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>IRATA Issued Date</FormLabel>
                                        <FormControl>
                                          <Input type="date" {...field} data-testid="input-irata-issued" className="h-12" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={employeeForm.control}
                                    name="irataExpirationDate"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>IRATA Expiration Date</FormLabel>
                                        <FormControl>
                                          <Input type="date" {...field} data-testid="input-irata-expiration" className="h-12" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button 
                        type="button" 
                        className="w-full h-12" 
                        onClick={() => setEmployeeFormStep(2)}
                        data-testid="button-continue-to-permissions"
                      >
                        Continue to Permissions
                      </Button>
                      </>
                      )}

                      {employeeFormStep === 2 && (
                        <>
                      <FormField
                        control={employeeForm.control}
                        name="permissions"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <FormLabel className="text-base">Permissions</FormLabel>
                                  <FormDescription className="text-xs">
                                    Select which features this employee can access
                                  </FormDescription>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const allPermissionIds = AVAILABLE_PERMISSIONS.map(p => p.id);
                                    employeeForm.setValue("permissions", allPermissionIds);
                                  }}
                                  data-testid="button-select-all-permissions"
                                >
                                  Select All
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {AVAILABLE_PERMISSIONS.map((permission) => (
                                <FormField
                                  key={permission.id}
                                  control={employeeForm.control}
                                  name="permissions"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={permission.id}
                                        className="flex flex-row items-start space-x-2 space-y-0 bg-muted/30 p-2 rounded-md"
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
                                        <FormLabel className="text-xs font-normal leading-tight cursor-pointer">
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

                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          className="w-full h-12" 
                          onClick={() => setEmployeeFormStep(1)}
                          data-testid="button-back-to-info"
                        >
                          Back
                        </Button>
                        <Button type="submit" className="w-full h-12" data-testid="button-submit-employee" disabled={createEmployeeMutation.isPending}>
                          {createEmployeeMutation.isPending ? "Creating..." : "Create Employee"}
                        </Button>
                      </div>
                      </>
                      )}
                    </form>
                  </Form>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Employee List */}
              <div className="space-y-6">
                {/* Active Employees */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Active Employees</h3>
                  {(() => {
                    const activeEmployees = employees.filter((emp: any) => !emp.terminatedDate);
                    
                    if (activeEmployees.length === 0) {
                      return (
                        <Card>
                          <CardContent className="p-8 text-center text-muted-foreground">
                            <span className="material-icons text-4xl mb-2 opacity-50">people</span>
                            <div>No active employees yet</div>
                          </CardContent>
                        </Card>
                      );
                    }
                    
                    return activeEmployees.map((employee: any) => (
                      <Card key={employee.id} data-testid={`employee-card-${employee.id}`} className="hover-elevate">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Header - Name and Actions */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="font-medium text-lg">{employee.name || employee.companyName || employee.email}</div>
                                <Badge variant="secondary" className="text-xs capitalize mt-1">
                                  {employee.role.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditEmployee(employee)}
                                  data-testid={`button-edit-employee-${employee.id}`}
                                  className="h-9 w-9"
                                  disabled={userIsReadOnly}
                                >
                                  <span className="material-icons text-sm">edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEmployeeToDelete(employee.id)}
                                  data-testid={`button-delete-employee-${employee.id}`}
                                  className="h-9 w-9 text-destructive hover:text-destructive"
                                  disabled={userIsReadOnly}
                                >
                                  <span className="material-icons text-sm">delete</span>
                                </Button>
                              </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="material-icons text-base">email</span>
                                {employee.email}
                              </div>
                              {employee.employeePhoneNumber && (
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  <span className="material-icons text-base">phone</span>
                                  {employee.employeePhoneNumber}
                                </div>
                              )}
                            </div>

                            {/* Employment Details */}
                            <div className="flex flex-wrap gap-2">
                              {employee.startDate && (
                                <Badge variant="outline" className="text-xs">
                                  Started: {new Date(employee.startDate).toLocaleDateString()}
                                </Badge>
                              )}
                              {employee.hourlyRate && hasFinancialAccess(user) && (
                                <Badge variant="outline" className="text-xs">
                                  ${employee.hourlyRate}/hr
                                </Badge>
                              )}
                              {employee.techLevel && (
                                <Badge variant="outline" className="text-xs">
                                  IRATA {employee.techLevel}
                                </Badge>
                              )}
                            </div>

                            {/* IRATA Details */}
                            {employee.irataLevel && (
                              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                                <div className="flex items-center gap-2">
                                  <span className="material-icons text-sm">workspace_premium</span>
                                  <span>IRATA Level {employee.irataLevel}</span>
                                </div>
                                {employee.irataLicenseNumber && (
                                  <div className="ml-6">License: {employee.irataLicenseNumber}</div>
                                )}
                                {employee.irataExpirationDate && (
                                  <div className="ml-6">
                                    Expires: {new Date(employee.irataExpirationDate).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Driver's License */}
                            {(employee.driversLicenseNumber || employee.driversLicenseProvince) && (
                              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                                <div className="flex items-center gap-2">
                                  <span className="material-icons text-sm">badge</span>
                                  <span>
                                    Driver's License: {employee.driversLicenseNumber || 'N/A'}
                                    {employee.driversLicenseProvince && ` (${employee.driversLicenseProvince})`}
                                  </span>
                                </div>
                                {employee.driversLicenseDocuments && employee.driversLicenseDocuments.length > 0 && (
                                  <div className="ml-6">
                                    {employee.driversLicenseDocuments.length} document(s) on file
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Emergency Contact */}
                            {employee.emergencyContactName && (
                              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                                <div className="flex items-center gap-2">
                                  <span className="material-icons text-sm">contact_emergency</span>
                                  <span>Emergency: {employee.emergencyContactName}</span>
                                </div>
                                {employee.emergencyContactPhone && (
                                  <div className="ml-6">{employee.emergencyContactPhone}</div>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ));
                  })()}
                </div>

                {/* Terminated Employees */}
                {(() => {
                  const terminatedEmployees = employees.filter((emp: any) => emp.terminatedDate);
                  
                  if (terminatedEmployees.length > 0) {
                    return (
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-muted-foreground">Terminated Employees</h3>
                        {terminatedEmployees.map((employee: any) => (
                          <Card key={employee.id} data-testid={`terminated-employee-card-${employee.id}`} className="opacity-60">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {/* Header - Name and Actions */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="font-medium text-lg">{employee.name || employee.companyName || employee.email}</div>
                                    <Badge variant="outline" className="text-xs capitalize mt-1">
                                      {employee.role.replace(/_/g, ' ')}
                                    </Badge>
                                    {employee.terminatedDate && (
                                      <div className="text-xs text-destructive mt-2">
                                        Terminated: {new Date(employee.terminatedDate).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => reactivateEmployeeMutation.mutate(employee.id)}
                                      data-testid={`button-reactivate-employee-${employee.id}`}
                                      className="h-9"
                                      disabled={userIsReadOnly}
                                    >
                                      <span className="material-icons text-sm mr-1">refresh</span>
                                      Reactivate
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditEmployee(employee)}
                                      data-testid={`button-edit-terminated-employee-${employee.id}`}
                                      className="h-9 w-9"
                                      disabled={userIsReadOnly}
                                    >
                                      <span className="material-icons text-sm">edit</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setEmployeeToDelete(employee.id)}
                                      data-testid={`button-delete-terminated-employee-${employee.id}`}
                                      className="h-9 w-9 text-destructive hover:text-destructive"
                                      disabled={userIsReadOnly}
                                    >
                                      <span className="material-icons text-sm">delete</span>
                                    </Button>
                                  </div>
                                </div>

                                {/* Termination Details */}
                                {employee.terminationReason && (
                                  <div className="text-xs text-muted-foreground pt-2 border-t">
                                    <div className="font-medium">Termination Reason: {employee.terminationReason}</div>
                                    {employee.terminationNotes && (
                                      <div className="mt-1">{employee.terminationNotes}</div>
                                    )}
                                  </div>
                                )}

                                {/* Contact Info */}
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <span className="material-icons text-base">email</span>
                                    {employee.email}
                                  </div>
                                  {employee.employeePhoneNumber && (
                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                      <span className="material-icons text-base">phone</span>
                                      {employee.employeePhoneNumber}
                                    </div>
                                  )}
                                </div>

                                {/* Employment Details */}
                                <div className="flex flex-wrap gap-2">
                                  {employee.startDate && (
                                    <Badge variant="outline" className="text-xs">
                                      Started: {new Date(employee.startDate).toLocaleDateString()}
                                    </Badge>
                                  )}
                                  {employee.hourlyRate && hasFinancialAccess(user) && (
                                    <Badge variant="outline" className="text-xs">
                                      ${employee.hourlyRate}/hr
                                    </Badge>
                                  )}
                                  {employee.techLevel && (
                                    <Badge variant="outline" className="text-xs">
                                      IRATA {employee.techLevel}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-6">
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
          </div>
        )}

        {activeTab === "clients" && (
          <div>
            <div className="space-y-4">
              {/* Add Client Button */}
              <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full h-12 gap-2" 
                    data-testid="button-create-client"
                    disabled={userIsReadOnly || !hasPermission(currentUser, "manage_clients")}
                  >
                    <span className="material-icons">business</span>
                    Add New Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="pb-4">
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>Enter property manager or building owner details</DialogDescription>
                  </DialogHeader>
                  <Form {...clientForm}>
                    <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-4">
                      <FormField
                        control={clientForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} className="h-12" data-testid="input-client-firstname" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={clientForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Smith" {...field} className="h-12" data-testid="input-client-lastname" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={clientForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="ABC Property Management" {...field} className="h-12" data-testid="input-client-company" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={clientForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="(604) 555-1234" {...field} className="h-12" data-testid="input-client-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={clientForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="123 Main St, Vancouver, BC" 
                                {...field} 
                                data-testid="input-client-address"
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (sameAsAddress) {
                                    clientForm.setValue("billingAddress", e.target.value);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <label className="text-sm font-medium">Strata Plan Numbers & Addresses</label>
                        {lmsNumbers.map((lms, index) => (
                          <Card key={index} className="p-3">
                            <div className="space-y-3">
                              <div className="flex gap-2 items-start">
                                <div className="flex-1">
                                  <label className="text-xs text-muted-foreground mb-1 block">Strata Number</label>
                                  <Input
                                    placeholder="LMS1234 or VR5678"
                                    value={lms.number}
                                    onChange={(e) => {
                                      const newLmsNumbers = [...lmsNumbers];
                                      newLmsNumbers[index] = { ...lms, number: e.target.value };
                                      setLmsNumbers(newLmsNumbers);
                                    }}
                                    className="h-12"
                                    data-testid={`input-client-lms-number-${index}`}
                                  />
                                </div>
                                {lmsNumbers.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="mt-5"
                                    onClick={() => {
                                      const newLmsNumbers = lmsNumbers.filter((_, i) => i !== index);
                                      setLmsNumbers(newLmsNumbers);
                                    }}
                                    data-testid={`button-remove-lms-${index}`}
                                  >
                                    <span className="material-icons">delete</span>
                                  </Button>
                                )}
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Building Address</label>
                                <Textarea
                                  placeholder="123 Main St, Vancouver, BC"
                                  value={lms.address}
                                  onChange={(e) => {
                                    const newLmsNumbers = [...lmsNumbers];
                                    newLmsNumbers[index] = { ...lms, address: e.target.value };
                                    setLmsNumbers(newLmsNumbers);
                                  }}
                                  rows={2}
                                  data-testid={`input-client-lms-address-${index}`}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">Stories</label>
                                  <Input
                                    type="number"
                                    placeholder="20"
                                    value={lms.stories || ""}
                                    onChange={(e) => {
                                      const newLmsNumbers = [...lmsNumbers];
                                      newLmsNumbers[index] = { ...lms, stories: e.target.value ? parseInt(e.target.value) : undefined };
                                      setLmsNumbers(newLmsNumbers);
                                    }}
                                    className="h-12"
                                    data-testid={`input-client-lms-stories-${index}`}
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">Units</label>
                                  <Input
                                    type="number"
                                    placeholder="150"
                                    value={lms.units || ""}
                                    onChange={(e) => {
                                      const newLmsNumbers = [...lmsNumbers];
                                      newLmsNumbers[index] = { ...lms, units: e.target.value ? parseInt(e.target.value) : undefined };
                                      setLmsNumbers(newLmsNumbers);
                                    }}
                                    className="h-12"
                                    data-testid={`input-client-lms-units-${index}`}
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">Parking Stalls</label>
                                  <Input
                                    type="number"
                                    placeholder="80"
                                    value={lms.parkingStalls || ""}
                                    onChange={(e) => {
                                      const newLmsNumbers = [...lmsNumbers];
                                      newLmsNumbers[index] = { ...lms, parkingStalls: e.target.value ? parseInt(e.target.value) : undefined };
                                      setLmsNumbers(newLmsNumbers);
                                    }}
                                    className="h-12"
                                    data-testid={`input-client-lms-parking-${index}`}
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">Daily Drop Target</label>
                                  <Input
                                    type="number"
                                    placeholder="40"
                                    value={lms.dailyDropTarget || ""}
                                    onChange={(e) => {
                                      const newLmsNumbers = [...lmsNumbers];
                                      newLmsNumbers[index] = { ...lms, dailyDropTarget: e.target.value ? parseInt(e.target.value) : undefined };
                                      setLmsNumbers(newLmsNumbers);
                                    }}
                                    className="h-12"
                                    data-testid={`input-client-lms-daily-drop-target-${index}`}
                                  />
                                </div>
                              </div>
                              <div className="mt-3">
                                <label className="text-xs text-muted-foreground mb-2 block">Total Drops per Elevation</label>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">North</label>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      value={lms.totalDropsNorth || ""}
                                      onChange={(e) => {
                                        const newLmsNumbers = [...lmsNumbers];
                                        newLmsNumbers[index] = { ...lms, totalDropsNorth: e.target.value ? parseInt(e.target.value) : undefined };
                                        setLmsNumbers(newLmsNumbers);
                                      }}
                                      className="h-12"
                                      data-testid={`input-client-lms-drops-north-${index}`}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">East</label>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      value={lms.totalDropsEast || ""}
                                      onChange={(e) => {
                                        const newLmsNumbers = [...lmsNumbers];
                                        newLmsNumbers[index] = { ...lms, totalDropsEast: e.target.value ? parseInt(e.target.value) : undefined };
                                        setLmsNumbers(newLmsNumbers);
                                      }}
                                      className="h-12"
                                      data-testid={`input-client-lms-drops-east-${index}`}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">South</label>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      value={lms.totalDropsSouth || ""}
                                      onChange={(e) => {
                                        const newLmsNumbers = [...lmsNumbers];
                                        newLmsNumbers[index] = { ...lms, totalDropsSouth: e.target.value ? parseInt(e.target.value) : undefined };
                                        setLmsNumbers(newLmsNumbers);
                                      }}
                                      className="h-12"
                                      data-testid={`input-client-lms-drops-south-${index}`}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">West</label>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      value={lms.totalDropsWest || ""}
                                      onChange={(e) => {
                                        const newLmsNumbers = [...lmsNumbers];
                                        newLmsNumbers[index] = { ...lms, totalDropsWest: e.target.value ? parseInt(e.target.value) : undefined };
                                        setLmsNumbers(newLmsNumbers);
                                      }}
                                      className="h-12"
                                      data-testid={`input-client-lms-drops-west-${index}`}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setLmsNumbers([...lmsNumbers, { number: "", address: "" }])}
                          className="w-full"
                          data-testid="button-add-lms"
                        >
                          <span className="material-icons text-sm mr-1">add</span>
                          Add Another Strata Number
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="sameAsAddress"
                            checked={sameAsAddress}
                            onCheckedChange={(checked) => {
                              setSameAsAddress(checked as boolean);
                              if (checked) {
                                clientForm.setValue("billingAddress", clientForm.getValues("address") || "");
                              } else {
                                clientForm.setValue("billingAddress", "");
                              }
                            }}
                            data-testid="checkbox-same-as-address"
                          />
                          <label
                            htmlFor="sameAsAddress"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Billing address same as address
                          </label>
                        </div>

                        <FormField
                          control={clientForm.control}
                          name="billingAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Billing Address (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="456 Billing Ave, Vancouver, BC" 
                                  {...field} 
                                  disabled={sameAsAddress}
                                  data-testid="input-client-billing-address"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="w-full h-12" disabled={createClientMutation.isPending} data-testid="button-submit-client">
                        {createClientMutation.isPending ? "Creating..." : "Create Client"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Clients List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="material-icons text-primary">business</span>
                    Client Database
                  </CardTitle>
                  <CardDescription>Property managers and building contacts</CardDescription>
                  <div className="mt-4 relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      search
                    </span>
                    <Input
                      placeholder="Search by name, company, strata number, or address..."
                      value={clientSearchQuery}
                      onChange={(e) => setClientSearchQuery(e.target.value)}
                      className="h-10 pl-10"
                      data-testid="input-search-clients"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {clientsLoading ? (
                    <p className="text-sm text-muted-foreground">Loading clients...</p>
                  ) : !clientsData || clientsData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No clients yet. Add your first client to get started.</p>
                  ) : (
                    <div className="space-y-3">
                      {clientsData
                        .filter(client => {
                          if (!clientSearchQuery) return true;
                          const query = clientSearchQuery.toLowerCase();
                          return (
                            client.firstName.toLowerCase().includes(query) ||
                            client.lastName.toLowerCase().includes(query) ||
                            client.company?.toLowerCase().includes(query) ||
                            client.lmsNumbers?.some(lms => 
                              lms.number.toLowerCase().includes(query) ||
                              lms.address?.toLowerCase().includes(query)
                            )
                          );
                        })
                        .map((client) => (
                        <Card key={client.id} className="hover-elevate" data-testid={`client-card-${client.id}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-base mb-1">
                                  {client.firstName} {client.lastName}
                                </div>
                                {client.company && (
                                  <div className="text-sm text-muted-foreground mb-1">
                                    {client.company}
                                  </div>
                                )}
                                {client.phoneNumber && (
                                  <div className="text-sm text-muted-foreground mb-1">
                                    {client.phoneNumber}
                                  </div>
                                )}
                                {client.lmsNumbers && client.lmsNumbers.length > 0 && (
                                  <div className="space-y-2 mt-2">
                                    {client.lmsNumbers.map((lms, idx) => (
                                      <div key={idx} className="text-sm">
                                        <Badge variant="secondary" className="text-xs mr-2">
                                          {lms.number}
                                        </Badge>
                                        {lms.address && (
                                          <span className="text-muted-foreground text-xs">{lms.address}</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {hasPermission(currentUser, "manage_clients") && !userIsReadOnly && (
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditClient(client)}
                                    data-testid={`button-edit-client-${client.id}`}
                                  >
                                    <span className="material-icons">edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteClient(client)}
                                    data-testid={`button-delete-client-${client.id}`}
                                  >
                                    <span className="material-icons text-destructive">delete</span>
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Edit Client Dialog */}
      <Dialog open={showEditClientDialog} onOpenChange={setShowEditClientDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update property manager or building owner details</DialogDescription>
          </DialogHeader>
          <Form {...editClientForm}>
            <form onSubmit={editClientForm.handleSubmit(onEditClientSubmit)} className="space-y-4">
              <FormField
                control={editClientForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} className="h-12" data-testid="input-edit-client-firstname" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editClientForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Smith" {...field} className="h-12" data-testid="input-edit-client-lastname" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editClientForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC Property Management" {...field} className="h-12" data-testid="input-edit-client-company" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editClientForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="(604) 555-1234" {...field} className="h-12" data-testid="input-edit-client-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editClientForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="123 Main St, Vancouver, BC" 
                        {...field} 
                        data-testid="input-edit-client-address"
                        onChange={(e) => {
                          field.onChange(e);
                          if (editSameAsAddress) {
                            editClientForm.setValue("billingAddress", e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <label className="text-sm font-medium">Strata Plan Numbers & Addresses</label>
                {editLmsNumbers.map((lms, index) => (
                  <Card key={index} className="p-3">
                    <div className="space-y-3">
                      <div className="flex gap-2 items-start">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground mb-1 block">Strata Number</label>
                          <Input
                            placeholder="LMS1234 or VR5678"
                            value={lms.number}
                            onChange={(e) => {
                              const newLmsNumbers = [...editLmsNumbers];
                              newLmsNumbers[index] = { ...lms, number: e.target.value };
                              setEditLmsNumbers(newLmsNumbers);
                            }}
                            className="h-12"
                            data-testid={`input-edit-client-lms-number-${index}`}
                          />
                        </div>
                        {editLmsNumbers.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="mt-5"
                            onClick={() => {
                              const newLmsNumbers = editLmsNumbers.filter((_, i) => i !== index);
                              setEditLmsNumbers(newLmsNumbers);
                            }}
                            data-testid={`button-edit-remove-lms-${index}`}
                          >
                            <span className="material-icons">delete</span>
                          </Button>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Building Address</label>
                        <Textarea
                          placeholder="123 Main St, Vancouver, BC"
                          value={lms.address}
                          onChange={(e) => {
                            const newLmsNumbers = [...editLmsNumbers];
                            newLmsNumbers[index] = { ...lms, address: e.target.value };
                            setEditLmsNumbers(newLmsNumbers);
                          }}
                          rows={2}
                          data-testid={`input-edit-client-lms-address-${index}`}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Stories</label>
                          <Input
                            type="number"
                            placeholder="20"
                            value={lms.stories || ""}
                            onChange={(e) => {
                              const newLmsNumbers = [...editLmsNumbers];
                              newLmsNumbers[index] = { ...lms, stories: e.target.value ? parseInt(e.target.value) : undefined };
                              setEditLmsNumbers(newLmsNumbers);
                            }}
                            className="h-12"
                            data-testid={`input-edit-client-lms-stories-${index}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Units</label>
                          <Input
                            type="number"
                            placeholder="150"
                            value={lms.units || ""}
                            onChange={(e) => {
                              const newLmsNumbers = [...editLmsNumbers];
                              newLmsNumbers[index] = { ...lms, units: e.target.value ? parseInt(e.target.value) : undefined };
                              setEditLmsNumbers(newLmsNumbers);
                            }}
                            className="h-12"
                            data-testid={`input-edit-client-lms-units-${index}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Parking Stalls</label>
                          <Input
                            type="number"
                            placeholder="80"
                            value={lms.parkingStalls || ""}
                            onChange={(e) => {
                              const newLmsNumbers = [...editLmsNumbers];
                              newLmsNumbers[index] = { ...lms, parkingStalls: e.target.value ? parseInt(e.target.value) : undefined };
                              setEditLmsNumbers(newLmsNumbers);
                            }}
                            className="h-12"
                            data-testid={`input-edit-client-lms-parking-${index}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Daily Drop Target</label>
                        <Input
                          type="number"
                          placeholder="40"
                          value={lms.dailyDropTarget || ""}
                          onChange={(e) => {
                            const newLmsNumbers = [...editLmsNumbers];
                            newLmsNumbers[index] = { ...lms, dailyDropTarget: e.target.value ? parseInt(e.target.value) : undefined };
                            setEditLmsNumbers(newLmsNumbers);
                          }}
                          className="h-12"
                          data-testid={`input-edit-client-lms-daily-drop-target-${index}`}
                        />
                      </div>
                      <div className="mt-3">
                        <label className="text-xs text-muted-foreground mb-2 block">Total Drops per Elevation</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">North</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={lms.totalDropsNorth || ""}
                              onChange={(e) => {
                                const newLmsNumbers = [...editLmsNumbers];
                                newLmsNumbers[index] = { ...lms, totalDropsNorth: e.target.value ? parseInt(e.target.value) : undefined };
                                setEditLmsNumbers(newLmsNumbers);
                              }}
                              className="h-12"
                              data-testid={`input-edit-client-lms-drops-north-${index}`}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">East</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={lms.totalDropsEast || ""}
                              onChange={(e) => {
                                const newLmsNumbers = [...editLmsNumbers];
                                newLmsNumbers[index] = { ...lms, totalDropsEast: e.target.value ? parseInt(e.target.value) : undefined };
                                setEditLmsNumbers(newLmsNumbers);
                              }}
                              className="h-12"
                              data-testid={`input-edit-client-lms-drops-east-${index}`}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">South</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={lms.totalDropsSouth || ""}
                              onChange={(e) => {
                                const newLmsNumbers = [...editLmsNumbers];
                                newLmsNumbers[index] = { ...lms, totalDropsSouth: e.target.value ? parseInt(e.target.value) : undefined };
                                setEditLmsNumbers(newLmsNumbers);
                              }}
                              className="h-12"
                              data-testid={`input-edit-client-lms-drops-south-${index}`}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">West</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={lms.totalDropsWest || ""}
                              onChange={(e) => {
                                const newLmsNumbers = [...editLmsNumbers];
                                newLmsNumbers[index] = { ...lms, totalDropsWest: e.target.value ? parseInt(e.target.value) : undefined };
                                setEditLmsNumbers(newLmsNumbers);
                              }}
                              className="h-12"
                              data-testid={`input-edit-client-lms-drops-west-${index}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditLmsNumbers([...editLmsNumbers, { number: "", address: "" }])}
                  className="w-full"
                  data-testid="button-edit-add-lms"
                >
                  <span className="material-icons text-sm mr-1">add</span>
                  Add Another Strata Number
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editSameAsAddress"
                    checked={editSameAsAddress}
                    onCheckedChange={(checked) => {
                      setEditSameAsAddress(checked as boolean);
                      if (checked) {
                        editClientForm.setValue("billingAddress", editClientForm.getValues("address") || "");
                      } else {
                        editClientForm.setValue("billingAddress", "");
                      }
                    }}
                    data-testid="checkbox-edit-same-as-address"
                  />
                  <label
                    htmlFor="editSameAsAddress"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Billing address same as address
                  </label>
                </div>

                <FormField
                  control={editClientForm.control}
                  name="billingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Address (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="456 Billing Ave, Vancouver, BC" 
                          {...field} 
                          disabled={editSameAsAddress}
                          data-testid="input-edit-client-billing-address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full h-12" disabled={editClientMutation.isPending} data-testid="button-submit-edit-client">
                {editClientMutation.isPending ? "Updating..." : "Update Client"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Client Confirmation Dialog */}
      <AlertDialog open={showDeleteClientDialog} onOpenChange={setShowDeleteClientDialog}>
        <AlertDialogContent data-testid="dialog-delete-client">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {clientToDelete?.firstName} {clientToDelete?.lastName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-client">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteClient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-client"
            >
              {deleteClientMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Employee Dialog */}
      <Dialog open={showEditEmployeeDialog} onOpenChange={(open) => { setShowEditEmployeeDialog(open); if (!open) setEditEmployeeFormStep(1); }}>
        <DialogContent className="max-w-md p-0 max-h-[95vh] flex flex-col">
          <div className="p-6 border-b">
            <DialogHeader>
              <DialogTitle>
                {editEmployeeFormStep === 1 ? "Employee Information" : "Permissions"}
              </DialogTitle>
              <DialogDescription>
                {editEmployeeFormStep === 1 ? "Step 1 of 2: Update employee details" : "Step 2 of 2: Configure access permissions"}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="overflow-y-auto flex-1 p-6">
            <Form {...editEmployeeForm}>
              <form onSubmit={editEmployeeForm.handleSubmit(onEditEmployeeSubmit)} className="space-y-4">
              {editEmployeeFormStep === 1 && (
                <>
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
                    <FormItem className="space-y-3">
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 gap-3"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <FormItem key={role.value}>
                              <FormControl>
                                <div className="relative">
                                  <RadioGroupItem
                                    value={role.value}
                                    id={`edit-role-${role.value}`}
                                    className="peer sr-only"
                                    data-testid={`radio-edit-role-${role.value}`}
                                  />
                                  <FormLabel
                                    htmlFor={`edit-role-${role.value}`}
                                    className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-background p-3 hover-elevate active-elevate-2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                  >
                                    <span className="material-icons text-2xl text-primary">
                                      {role.icon}
                                    </span>
                                    <span className="text-xs font-medium text-center leading-tight">
                                      {role.label}
                                    </span>
                                  </FormLabel>
                                </div>
                              </FormControl>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
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

                <div className="border-t pt-4 mt-6">
                  <h3 className="text-sm font-medium mb-4">Personal Details (Optional)</h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={editEmployeeForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-edit-employee-start-date" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="birthday"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birthday</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-edit-employee-birthday" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="driversLicenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver's License Number</FormLabel>
                          <FormControl>
                            <Input placeholder="License number" {...field} data-testid="input-edit-employee-dl-number" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="driversLicenseProvince"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver's License Province/State</FormLabel>
                          <FormControl>
                            <Input placeholder="BC, AB, etc." {...field} data-testid="input-edit-employee-dl-province" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DocumentUploader
                      documents={editEmployeeForm.watch("driversLicenseDocuments") || []}
                      onDocumentsChange={(docs) => editEmployeeForm.setValue("driversLicenseDocuments", docs)}
                      maxDocuments={5}
                      label="Driver's License Documents"
                      description="Upload driver's license photos, abstracts, or related documents"
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="homeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Street address" {...field} data-testid="input-edit-employee-address" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="employeePhoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(604) 555-1234" {...field} data-testid="input-edit-employee-phone" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact name" {...field} data-testid="input-edit-employee-emergency-name" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="emergencyContactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(604) 555-1234" {...field} data-testid="input-edit-employee-emergency-phone" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="specialMedicalConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Medical Conditions</FormLabel>
                          <FormControl>
                            <Input placeholder="Medical conditions to be aware of" {...field} data-testid="input-edit-employee-medical" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-medium mb-4">IRATA Certification (Optional)</h4>
                      <div className="space-y-4">
                        <FormField
                          control={editEmployeeForm.control}
                          name="irataLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>IRATA Level</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12" data-testid="select-edit-irata-level">
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

                        {editEmployeeForm.watch("irataLevel") && (
                          <>
                            <FormField
                              control={editEmployeeForm.control}
                              name="irataLicenseNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>IRATA License Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="License number" {...field} data-testid="input-edit-irata-license" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={editEmployeeForm.control}
                              name="irataIssuedDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>IRATA Issued Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} data-testid="input-edit-irata-issued" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={editEmployeeForm.control}
                              name="irataExpirationDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>IRATA Expiration Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} data-testid="input-edit-irata-expiration" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <FormField
                        control={editEmployeeForm.control}
                        name="terminatedDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Termination Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-edit-employee-terminated-date" className="h-12" />
                            </FormControl>
                            <FormDescription className="text-xs text-destructive">
                              Setting a termination date will move this employee to terminated status
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="button" 
                  className="w-full h-12" 
                  onClick={() => setEditEmployeeFormStep(2)}
                  data-testid="button-edit-continue-to-permissions"
                >
                  Continue to Permissions
                </Button>
                </>
                )}

                {editEmployeeFormStep === 2 && (
                  <>
                <FormField
                  control={editEmployeeForm.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <FormLabel className="text-base">Permissions</FormLabel>
                            <FormDescription className="text-xs">
                              Select which features this employee can access
                            </FormDescription>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const allPermissionIds = AVAILABLE_PERMISSIONS.map(p => p.id);
                              editEmployeeForm.setValue("permissions", allPermissionIds);
                            }}
                            data-testid="button-edit-select-all-permissions"
                          >
                            Select All
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {AVAILABLE_PERMISSIONS.map((permission) => (
                          <FormField
                            key={permission.id}
                            control={editEmployeeForm.control}
                            name="permissions"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={permission.id}
                                  className="flex flex-row items-start space-x-2 space-y-0 bg-muted/30 p-2 rounded-md"
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
                                  <FormLabel className="text-xs font-normal leading-tight cursor-pointer">
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

                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full h-12" 
                    onClick={() => setEditEmployeeFormStep(1)}
                    data-testid="button-edit-back-to-info"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="w-full h-12" data-testid="button-submit-edit-employee" disabled={editEmployeeMutation.isPending}>
                    {editEmployeeMutation.isPending ? "Updating..." : "Update Employee"}
                  </Button>
                </div>
                </>
                )}
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
              {(() => {
                const activeProject = projects.find(p => p.id === activeSession?.projectId);
                if (activeProject?.jobType === "parkade_pressure_cleaning") {
                  return "Enter the number of parking stalls you completed today.";
                } else if (activeProject?.jobType === "in_suite_dryer_vent_cleaning") {
                  return "Enter the number of suites you completed today.";
                } else {
                  return "Enter the number of drops you completed today for each elevation.";
                }
              })()}
            </DialogDescription>
          </DialogHeader>

          <Form {...endDayForm}>
            <form onSubmit={endDayForm.handleSubmit(onEndDaySubmit)} className="space-y-4">
              {(() => {
                const activeProject = projects.find(p => p.id === activeSession?.projectId);
                const isParkade = activeProject?.jobType === "parkade_pressure_cleaning";
                const isInSuite = activeProject?.jobType === "in_suite_dryer_vent_cleaning";
                
                if (isParkade) {
                  return (
                    <FormField
                      control={endDayForm.control}
                      name="dropsNorth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parking Stalls Completed</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              data-testid="input-stalls-completed"
                              className="h-12 text-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                } else if (isInSuite) {
                  return (
                    <FormField
                      control={endDayForm.control}
                      name="dropsNorth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suites Completed</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              data-testid="input-suites-completed"
                              className="h-12 text-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                } else {
                  return (
                    <>
                      {/* North Elevation */}
                      <FormField
                        control={endDayForm.control}
                        name="dropsNorth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>North Elevation</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                data-testid="input-drops-north"
                                className="h-12 text-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* East Elevation */}
                      <FormField
                        control={endDayForm.control}
                        name="dropsEast"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>East Elevation</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                data-testid="input-drops-east"
                                className="h-12 text-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* South Elevation */}
                      <FormField
                        control={endDayForm.control}
                        name="dropsSouth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>South Elevation</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                data-testid="input-drops-south"
                                className="h-12 text-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* West Elevation */}
                      <FormField
                        control={endDayForm.control}
                        name="dropsWest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>West Elevation</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                data-testid="input-drops-west"
                                className="h-12 text-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  );
                }
              })()}

              {activeSession && (() => {
                const dropsNorth = parseInt(endDayForm.watch("dropsNorth")) || 0;
                const dropsEast = parseInt(endDayForm.watch("dropsEast")) || 0;
                const dropsSouth = parseInt(endDayForm.watch("dropsSouth")) || 0;
                const dropsWest = parseInt(endDayForm.watch("dropsWest")) || 0;
                const totalDrops = dropsNorth + dropsEast + dropsSouth + dropsWest;
                const totalWithExisting = todayDrops + totalDrops;
                return totalWithExisting < dailyTarget && totalDrops > 0;
              })() && (
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

      {/* Termination Details Dialog */}
      <Dialog open={showTerminationDialog} onOpenChange={(open) => {
        if (!open) {
          // If closing without submitting, clear the termination date
          editEmployeeForm.setValue("terminatedDate", "");
          setTerminationData({ reason: "", notes: "" });
        }
        setShowTerminationDialog(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Termination Details</DialogTitle>
            <DialogDescription>
              Please provide the reason for termination and any additional notes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason for Termination *</label>
              <Input
                value={terminationData.reason}
                onChange={(e) => setTerminationData({ ...terminationData, reason: e.target.value })}
                placeholder="e.g., Voluntary resignation, Performance issues, etc."
                className="mt-1"
                data-testid="input-termination-reason"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Additional Notes</label>
              <Textarea
                value={terminationData.notes}
                onChange={(e) => setTerminationData({ ...terminationData, notes: e.target.value })}
                placeholder="Any additional information about the termination..."
                className="mt-1"
                rows={4}
                data-testid="input-termination-notes"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                editEmployeeForm.setValue("terminatedDate", "");
                setTerminationData({ reason: "", notes: "" });
                setShowTerminationDialog(false);
              }}
              data-testid="button-cancel-termination"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTerminationSubmit}
              disabled={!terminationData.reason.trim()}
              data-testid="button-submit-termination"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Project as Client Dialog */}
      <AlertDialog open={showSaveAsClientDialog} onOpenChange={setShowSaveAsClientDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Building as Client?</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to save this building information in your client database? This will make it easier to create future projects for this property.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setShowSaveAsClientDialog(false);
                setProjectDataForClient(null);
              }}
              data-testid="button-cancel-save-client"
            >
              No, Thanks
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSaveProjectAsClient}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-confirm-save-client"
            >
              <span className="material-icons mr-2 text-sm">person_add</span>
              Yes, Add to Clients
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
