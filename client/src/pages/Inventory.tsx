import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGearItemSchema, type InsertGearItem, type GearItem, type GearAssignment, type GearSerialNumber } from "@shared/schema";
import { ArrowLeft, Plus, Pencil, X, Trash2, Shield, Cable, Link2, Gauge, TrendingUp, HardHat, Hand, Fuel, Scissors, PaintBucket, Droplets, CircleDot, Lock, Anchor, MoreHorizontal, Users, ShieldAlert } from "lucide-react";
import { Label } from "@/components/ui/label";
import { hasFinancialAccess, canViewCSR, canAccessInventory, canManageInventory, canAssignGear, canViewGearAssignments } from "@/lib/permissions";
import HarnessInspectionForm from "./HarnessInspectionForm";
import { format } from "date-fns";

const gearTypes = [
  { name: "Harness", icon: Shield },
  { name: "Rope", icon: Cable },
  { name: "Carabiner", icon: Link2 },
  { name: "Descender", icon: Gauge },
  { name: "Ascender", icon: TrendingUp },
  { name: "Helmet", icon: HardHat },
  { name: "Gloves", icon: Hand },
  { name: "Work positioning device", icon: Shield },
  { name: "Gas powered equipment", icon: Fuel },
  { name: "Squeegee rubbers", icon: Scissors },
  { name: "Applicators", icon: PaintBucket },
  { name: "Soap", icon: Droplets },
  { name: "Suction cup", icon: CircleDot },
  { name: "Back up device", icon: Lock },
  { name: "Lanyard", icon: Anchor },
  { name: "Other", icon: MoreHorizontal }
];

export default function Inventory() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<GearItem | null>(null);
  type SerialNumberEntry = {
    serialNumber: string;
    dateOfManufacture: string;
    dateInService: string;
  };
  const [serialEntries, setSerialEntries] = useState<SerialNumberEntry[]>([]);
  const [currentSerialNumber, setCurrentSerialNumber] = useState("");
  const [currentDateOfManufacture, setCurrentDateOfManufacture] = useState("");
  const [currentDateInService, setCurrentDateInService] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GearItem | null>(null);
  const [customType, setCustomType] = useState("");
  const [addItemStep, setAddItemStep] = useState(1);
  const [activeTab, setActiveTab] = useState("my-gear");
  const [inspectionFilter, setInspectionFilter] = useState<"week" | "month" | "all" | "combined">("week");
  
  // Assignment dialog state
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [managingItem, setManagingItem] = useState<GearItem | null>(null);
  const [assignEmployeeId, setAssignEmployeeId] = useState<string>("");
  const [assignQuantity, setAssignQuantity] = useState<string>("1");
  const [assignSerialNumber, setAssignSerialNumber] = useState<string>("");
  const [assignDateOfManufacture, setAssignDateOfManufacture] = useState<string>("");
  const [assignDateInService, setAssignDateInService] = useState<string>("");
  
  // Team Gear state - for management view of all employee gear
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<GearAssignment | null>(null);
  const [showEditAssignmentDialog, setShowEditAssignmentDialog] = useState(false);
  const [editAssignmentQuantity, setEditAssignmentQuantity] = useState<string>("1");
  const [editAssignmentSerialNumber, setEditAssignmentSerialNumber] = useState<string>("");
  const [editAssignmentDateOfManufacture, setEditAssignmentDateOfManufacture] = useState<string>("");
  const [editAssignmentDateInService, setEditAssignmentDateInService] = useState<string>("");

  // Fetch current user
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;
  const canViewFinancials = hasFinancialAccess(currentUser);
  const hasInventoryAccess = canAccessInventory(currentUser);

  // Redirect users without inventory access permission
  if (userData && !hasInventoryAccess) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <ShieldAlert className="w-12 h-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Access Restricted</h2>
              <p className="text-muted-foreground">
                You don't have permission to access the Inventory & Gear Management page.
              </p>
              <p className="text-sm text-muted-foreground">
                Please contact your administrator if you need access.
              </p>
              <Button variant="outline" onClick={() => setLocation("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user can view all employees' harness inspections
  const canViewAllInspections = currentUser?.role === 'company' || 
    ['operations_manager', 'general_supervisor', 'rope_access_supervisor', 'supervisor'].includes(currentUser?.role);

  // Fetch all work sessions for inspection tracking
  const { data: allSessionsData } = useQuery<{ sessions: any[] }>({
    queryKey: ["/api/all-work-sessions"],
  });

  // Fetch harness inspections - use the appropriate endpoint based on permissions
  const { data: harnessInspectionsData } = useQuery<{ inspections: any[] }>({
    queryKey: [canViewAllInspections ? "/api/harness-inspections" : "/api/my-harness-inspections"],
    enabled: !!currentUser,
  });

  const allSessions = allSessionsData?.sessions || [];
  const harnessInspections = harnessInspectionsData?.inspections || [];

  // Fetch all gear items
  const { data: gearData, isLoading } = useQuery<{ items: GearItem[] }>({
    queryKey: ["/api/gear-items"],
  });

  // Fetch all gear assignments
  const { data: assignmentsData } = useQuery<{ assignments: GearAssignment[] }>({
    queryKey: ["/api/gear-assignments"],
  });

  // Fetch active employees for dropdown
  const { data: employeesData } = useQuery<{ employees: any[] }>({
    queryKey: ["/api/employees"],
  });
  
  // Filter for active employees only
  const activeEmployees = (employeesData?.employees || []);
  
  // Helper function to get assignments for an item
  const getItemAssignments = (itemId: string) => {
    return (assignmentsData?.assignments || []).filter((a: GearAssignment) => a.gearItemId === itemId);
  };
  
  // Helper function to calculate available quantity for an item
  const getAvailableQuantity = (item: GearItem) => {
    const totalQuantity = Number(item.quantity) || 0;
    const assignments = getItemAssignments(item.id);
    const assignedQuantity = assignments.reduce((sum, a) => sum + (Number(a.quantity) || 0), 0);
    return totalQuantity - assignedQuantity;
  };

  const form = useForm<Partial<InsertGearItem>>({
    defaultValues: {
      equipmentType: undefined,
      brand: undefined,
      model: undefined,
      itemPrice: undefined,
      ropeLength: undefined,
      pricePerFeet: undefined,
      notes: undefined,
      quantity: undefined,
      serialNumbers: undefined,
      dateOfManufacture: undefined,
      dateInService: undefined,
      dateOutOfService: undefined,
      inService: true,
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (data: Partial<InsertGearItem>) => {
      return apiRequest("POST", "/api/gear-items", data);
    },
    onSuccess: async (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      
      // If there's an employee assignment, create it
      if (assignEmployeeId && response?.item?.id) {
        const quantity = parseInt(assignQuantity) || 0;
        if (quantity > 0) {
          try {
            await apiRequest("POST", "/api/gear-assignments", {
              gearItemId: response.item.id,
              employeeId: assignEmployeeId,
              quantity,
            });
            queryClient.invalidateQueries({ queryKey: ["/api/gear-assignments"] });
            toast({
              title: "Item Added & Assigned",
              description: "The gear item has been added and assigned to employee.",
            });
          } catch (error) {
            toast({
              title: "Item Added",
              description: "Item added but assignment failed. You can assign it manually.",
              variant: "destructive",
            });
          }
        }
      } else {
        toast({
          title: "Item Added",
          description: "The gear item has been added to inventory.",
        });
      }
      
      setShowAddDialog(false);
      setAddItemStep(1);
      form.reset();
      setSerialEntries([]);
      setCurrentSerialNumber("");
      setCurrentDateOfManufacture("");
      setCurrentDateInService("");
      setAssignEmployeeId("");
      setAssignQuantity("1");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item",
        variant: "destructive",
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertGearItem> }) => {
      return apiRequest("PATCH", `/api/gear-items/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      toast({
        title: "Item Updated",
        description: "The gear item has been updated.",
      });
      setShowEditDialog(false);
      setEditingItem(null);
      form.reset();
      setSerialEntries([]);
      setCurrentSerialNumber("");
      setCurrentDateOfManufacture("");
      setCurrentDateInService("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update item",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/gear-items/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      toast({
        title: "Item Deleted",
        description: "The gear item has been removed from inventory.",
      });
      setShowDeleteDialog(false);
      setItemToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete item",
        variant: "destructive",
      });
    },
  });

  const handleAddItem = (data: Partial<InsertGearItem>) => {
    // Extract just the serial number strings for legacy compatibility
    const serialNumberStrings = serialEntries.map(e => e.serialNumber);
    const finalData: any = {
      ...data,
      equipmentType: customType || data.equipmentType,
      serialNumbers: serialNumberStrings.length > 0 ? serialNumberStrings : undefined,
      serialEntries: serialEntries.length > 0 ? serialEntries : undefined, // New per-item data
    };
    
    // Add assignment info if provided
    if (assignEmployeeId) {
      finalData.assignEmployeeId = assignEmployeeId;
      finalData.assignQuantity = assignQuantity;
    }
    
    addItemMutation.mutate(finalData);
  };

  const handleEditItem = (data: Partial<InsertGearItem>) => {
    if (editingItem) {
      // Extract just the serial number strings for legacy compatibility
      const serialNumberStrings = serialEntries.map(e => e.serialNumber);
      const finalData = {
        ...data,
        equipmentType: customType || data.equipmentType,
        serialNumbers: serialNumberStrings.length > 0 ? serialNumberStrings : undefined,
        serialEntries: serialEntries.length > 0 ? serialEntries : undefined, // New per-item data
      };
      updateItemMutation.mutate({ id: editingItem.id, data: finalData });
    }
  };

  // Create gear assignment mutation
  const createAssignmentMutation = useMutation({
    mutationFn: async (data: { gearItemId: string; employeeId: string; quantity: number }) => {
      return apiRequest("POST", "/api/gear-assignments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-assignments"] });
      toast({
        title: "Gear Assigned",
        description: "Gear has been assigned to the employee.",
      });
      setAssignEmployeeId("");
      setAssignQuantity("1");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign gear",
        variant: "destructive",
      });
    },
  });

  // Delete gear assignment mutation
  const deleteAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      return apiRequest("DELETE", `/api/gear-assignments/${assignmentId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-assignments"] });
      toast({
        title: "Assignment Removed",
        description: "Gear assignment has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove assignment",
        variant: "destructive",
      });
    },
  });

  // Update gear assignment mutation
  const updateAssignmentMutation = useMutation({
    mutationFn: async (data: { id: string; quantity: number; serialNumber?: string; dateOfManufacture?: string; dateInService?: string }) => {
      return apiRequest("PATCH", `/api/gear-assignments/${data.id}`, { 
        quantity: data.quantity, 
        serialNumber: data.serialNumber,
        dateOfManufacture: data.dateOfManufacture,
        dateInService: data.dateInService,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-assignments"] });
      toast({
        title: "Assignment Updated",
        description: "Gear assignment has been updated.",
      });
      setShowEditAssignmentDialog(false);
      setEditingAssignment(null);
      setEditAssignmentSerialNumber("");
      setEditAssignmentDateOfManufacture("");
      setEditAssignmentDateInService("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update assignment",
        variant: "destructive",
      });
    },
  });

  const handleAddSerialNumber = () => {
    const quantity = form.getValues("quantity");
    const maxSerials = quantity !== undefined ? quantity : 1;
    
    if (!currentSerialNumber.trim()) {
      toast({
        title: "Empty Serial Number",
        description: "Please enter a serial number before adding.",
        variant: "destructive",
      });
      return;
    }
    
    // Check for duplicate serial number
    if (serialEntries.some(entry => entry.serialNumber === currentSerialNumber.trim())) {
      toast({
        title: "Duplicate Serial Number",
        description: "This serial number has already been added.",
        variant: "destructive",
      });
      return;
    }
    
    if (maxSerials === 0) {
      toast({
        title: "No Stock",
        description: "Quantity is 0. Cannot add serial numbers.",
        variant: "destructive",
      });
      return;
    }
    
    if (serialEntries.length >= maxSerials) {
      toast({
        title: "Limit Reached",
        description: `Cannot add more than ${maxSerials} serial numbers.`,
        variant: "destructive",
      });
      return;
    }
    
    // Add the serial entry with all fields
    const newEntry: SerialNumberEntry = {
      serialNumber: currentSerialNumber.trim(),
      dateOfManufacture: currentDateOfManufacture,
      dateInService: currentDateInService,
    };
    setSerialEntries([...serialEntries, newEntry]);
    
    // Reset all fields for next entry
    setCurrentSerialNumber("");
    setCurrentDateOfManufacture("");
    setCurrentDateInService("");
    
    toast({
      title: "Item Added",
      description: `Added: ${currentSerialNumber.trim()}. Enter another or save.`,
    });
  };

  const removeSerialEntry = (index: number) => {
    setSerialEntries(serialEntries.filter((_, i) => i !== index));
  };

  const openAddDialog = () => {
    // Guard: Only users with manage_inventory permission can add items
    if (!canManageInventory(currentUser)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to manage inventory",
        variant: "destructive",
      });
      return;
    }
    
    setEditingItem(null);
    form.reset({
      equipmentType: "",
      brand: "",
      model: "",
      itemPrice: "",
      notes: "",
      quantity: undefined,
      serialNumbers: [],
      dateOfManufacture: "",
      dateInService: "",
      dateOutOfService: "",
      inService: true,
    });
    setSerialEntries([]);
    setCurrentSerialNumber("");
    setCurrentDateOfManufacture("");
    setCurrentDateInService("");
    setCustomType("");
    setAddItemStep(1);
    setShowAddDialog(true);
  };

  const openEditDialog = (item: GearItem) => {
    // Guard: Only users with manage_inventory permission can edit items
    if (!canManageInventory(currentUser)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to manage inventory",
        variant: "destructive",
      });
      return;
    }
    
    setEditingItem(item);
    form.reset({
      equipmentType: item.equipmentType || undefined,
      brand: item.brand || undefined,
      model: item.model || undefined,
      itemPrice: item.itemPrice || undefined,
      ropeLength: item.ropeLength || undefined,
      pricePerFeet: item.pricePerFeet || undefined,
      notes: item.notes || undefined,
      quantity: item.quantity || 1,
      serialNumbers: item.serialNumbers || undefined,
      dateOfManufacture: item.dateOfManufacture || undefined,
      dateInService: item.dateInService || undefined,
      dateOutOfService: item.dateOutOfService || undefined,
      inService: item.inService,
    });
    // Load serial entries from item (prefer new serialEntries, fallback to legacy serialNumbers)
    const itemSerialEntries = (item as any).serialEntries || [];
    if (itemSerialEntries.length > 0) {
      setSerialEntries(itemSerialEntries.map((entry: any) => ({
        serialNumber: entry.serialNumber,
        dateOfManufacture: entry.dateOfManufacture || "",
        dateInService: entry.dateInService || "",
      })));
    } else {
      // Fallback to legacy serial numbers without dates
      const legacySerials = item.serialNumbers || [];
      setSerialEntries(legacySerials.map(sn => ({
        serialNumber: sn,
        dateOfManufacture: "",
        dateInService: "",
      })));
    }
    setCurrentSerialNumber("");
    setCurrentDateOfManufacture("");
    setCurrentDateInService("");
    // Check if type is a custom type (not in predefined list)
    const gearTypeNames = gearTypes.map(t => t.name);
    if (item.equipmentType && !gearTypeNames.includes(item.equipmentType)) {
      setCustomType(item.equipmentType);
      form.setValue("equipmentType", "Other");
    } else {
      setCustomType("");
    }
    setShowEditDialog(true);
  };

  const openAssignDialog = (item: GearItem) => {
    // Guard: Only users with assign_gear permission can open the assign dialog
    if (!canAssignGear(currentUser)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to assign gear",
        variant: "destructive",
      });
      return;
    }
    
    setManagingItem(item);
    // Auto-fill with current user's ID - employees can only assign to themselves by default
    setAssignEmployeeId(currentUser?.id || "");
    setAssignQuantity("1");
    setAssignSerialNumber("");
    setAssignDateOfManufacture("");
    setAssignDateInService("");
    setShowAssignDialog(true);
  };
  
  // Check if user can assign gear to other employees (requires assign_gear permission)
  const canAssignToOthers = canAssignGear(currentUser);

  const handleAssignGear = () => {
    if (!managingItem || !assignEmployeeId) {
      toast({
        title: "Validation Error",
        description: "Please select an employee",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseInt(assignQuantity) || 0;
    if (quantity <= 0) {
      toast({
        title: "Validation Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    const available = getAvailableQuantity(managingItem);
    if (quantity > available) {
      toast({
        title: "Validation Error",
        description: `Only ${available} items available`,
        variant: "destructive",
      });
      return;
    }

    createAssignmentMutation.mutate({
      gearItemId: managingItem.id,
      employeeId: assignEmployeeId,
      quantity,
      serialNumber: assignSerialNumber || undefined,
      dateOfManufacture: assignDateOfManufacture || undefined,
      dateInService: assignDateInService || undefined,
    });
  };

  const openDeleteDialog = (item: GearItem) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const handleDeleteItem = () => {
    if (itemToDelete) {
      deleteItemMutation.mutate(itemToDelete.id);
    }
  };

  const allGearItems = gearData?.items || [];
  
  // Get gear assigned to current user based on assignments
  const myGear = allGearItems.filter((item: GearItem) => {
    const assignments = getItemAssignments(item.id);
    return assignments.some(a => a.employeeId === currentUser?.id);
  });

  const totalMyItems = myGear.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  const totalMyValue = myGear.reduce((sum: number, item: any) => {
    const price = parseFloat(item.itemPrice || "0");
    const qty = item.quantity || 0;
    return sum + (price * qty);
  }, 0);

  // Calculate total value of ALL inventory items
  const totalAllItems = allGearItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  const totalAllValue = allGearItems.reduce((sum: number, item: any) => {
    const price = parseFloat(item.itemPrice || "0");
    const qty = item.quantity || 0;
    return sum + (price * qty);
  }, 0);

  const EQUIPMENT_ICONS: Record<string, string> = {
    Harness: "security",
    Rope: "architecture",
    Carabiner: "link",
    Descender: "arrow_downward",
    Ascender: "arrow_upward",
    Helmet: "sports_mma",
    Gloves: "back_hand",
    "Gas powered equipment": "power",
    "Squeegee rubbers": "cleaning_services",
    Applicators: "brush",
    Soap: "soap",
    "Suction cup": "panorama_fish_eye",
    "Back up device": "shield",
    Lanyard: "cable",
    "Work positioning device": "swap_vert",
    Other: "category",
  };

  // Helper function to check if employee had a work session on a given date
  const hadWorkSession = (employeeId: string, date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return allSessions.some((session: any) => {
      if (session.employeeId !== employeeId) return false;
      const sessionDate = session.startTime ? new Date(session.startTime) : null;
      if (!sessionDate) return false;
      const sessionDateStr = format(sessionDate, 'yyyy-MM-dd');
      return sessionDateStr === dateStr;
    });
  };

  // Helper function to check if employee submitted harness inspection for a given date
  const hasHarnessInspection = (employeeId: string, date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return harnessInspections.some((inspection: any) => 
      inspection.workerId === employeeId && inspection.inspectionDate === dateStr
    );
  };

  // Get date range for inspection tracking based on filter
  const inspectionDays = useMemo(() => {
    const days = [];
    const today = new Date();
    let daysToShow = 7;
    
    if (inspectionFilter === "month") {
      daysToShow = 30;
    } else if (inspectionFilter === "all" || inspectionFilter === "combined") {
      const earliestSession = allSessions.reduce((earliest: Date | null, session: any) => {
        if (!session.startTime) return earliest;
        const sessionDate = new Date(session.startTime);
        if (!earliest || sessionDate < earliest) return sessionDate;
        return earliest;
      }, null);
      
      if (earliestSession) {
        const daysSinceEarliest = Math.floor((today.getTime() - earliestSession.getTime()) / (1000 * 60 * 60 * 24));
        daysToShow = Math.min(daysSinceEarliest + 1, 90);
      }
    }
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  }, [inspectionFilter, allSessions]);

  // Helper function to calculate rating for a specific number of days
  const calculateRatingForDays = (daysCount: number) => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < daysCount; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }

    let totalRequiredInspections = 0;
    let totalCompletedInspections = 0;

    days.forEach((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const workersWithSessions = new Set<string>();
      allSessions.forEach((session: any) => {
        if (!session.startTime || !session.employeeId) return;
        const sessionDate = new Date(session.startTime);
        const sessionDateStr = format(sessionDate, 'yyyy-MM-dd');
        if (sessionDateStr === dateStr) {
          workersWithSessions.add(session.employeeId);
        }
      });

      workersWithSessions.forEach((workerId) => {
        const inspection = harnessInspections.find((inspection: any) =>
          inspection.workerId === workerId && inspection.inspectionDate === dateStr
        );
        
        if (!inspection || inspection.overallStatus !== "not_applicable") {
          totalRequiredInspections++;
          if (inspection && inspection.overallStatus !== "not_applicable") {
            totalCompletedInspections++;
          }
        }
      });
    });

    if (totalRequiredInspections === 0) return 0;
    return Math.round((totalCompletedInspections / totalRequiredInspections) * 100);
  };

  // Calculate company safety rating based on filter
  const companySafetyRating = useMemo(() => {
    if (inspectionFilter === "combined") {
      // Calculate average of week, month, and all-time ratings
      const weekRating = calculateRatingForDays(7);
      const monthRating = calculateRatingForDays(30);
      
      // Calculate all-time rating
      const earliestSession = allSessions.reduce((earliest: Date | null, session: any) => {
        if (!session.startTime) return earliest;
        const sessionDate = new Date(session.startTime);
        if (!earliest || sessionDate < earliest) return sessionDate;
        return earliest;
      }, null);
      
      let allTimeRating = 0;
      if (earliestSession) {
        const today = new Date();
        const daysSinceEarliest = Math.floor((today.getTime() - earliestSession.getTime()) / (1000 * 60 * 60 * 24));
        const daysToShow = Math.min(daysSinceEarliest + 1, 90);
        allTimeRating = calculateRatingForDays(daysToShow);
      }
      
      // Return average of all three
      return Math.round((weekRating + monthRating + allTimeRating) / 3);
    }
    
    // Regular calculation for single period
    let totalRequiredInspections = 0;
    let totalCompletedInspections = 0;

    inspectionDays.forEach((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const workersWithSessions = new Set<string>();
      allSessions.forEach((session: any) => {
        if (!session.startTime || !session.employeeId) return;
        const sessionDate = new Date(session.startTime);
        const sessionDateStr = format(sessionDate, 'yyyy-MM-dd');
        if (sessionDateStr === dateStr) {
          workersWithSessions.add(session.employeeId);
        }
      });

      workersWithSessions.forEach((workerId) => {
        const inspection = harnessInspections.find((inspection: any) =>
          inspection.workerId === workerId && inspection.inspectionDate === dateStr
        );
        
        if (!inspection || inspection.overallStatus !== "not_applicable") {
          totalRequiredInspections++;
          if (inspection && inspection.overallStatus !== "not_applicable") {
            totalCompletedInspections++;
          }
        }
      });
    });

    if (totalRequiredInspections === 0) return 0;
    return Math.round((totalCompletedInspections / totalRequiredInspections) * 100);
  }, [inspectionFilter, inspectionDays, allSessions, harnessInspections]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b shadow-md">
        <div className="px-4 h-16 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight">Inventory & Inspections</h1>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full mb-4 ${
            (() => {
              let cols = 3;
              if (canViewGearAssignments(currentUser)) cols++;
              if (canManageInventory(currentUser)) cols++;
              return `grid-cols-${cols}`;
            })()
          }`}>
            <TabsTrigger value="my-gear" data-testid="tab-my-gear">My Gear</TabsTrigger>
            {canViewGearAssignments(currentUser) && (
              <TabsTrigger value="team-gear" data-testid="tab-team-gear">
                <Users className="h-4 w-4 mr-1" />
                Team Gear
              </TabsTrigger>
            )}
            {canManageInventory(currentUser) && (
              <TabsTrigger value="manage" data-testid="tab-manage-gear">Manage Gear</TabsTrigger>
            )}
            <TabsTrigger value="inspections" data-testid="tab-inspections">Inspections</TabsTrigger>
            <TabsTrigger value="daily-harness" data-testid="tab-daily-harness">
              Daily Harness Inspection
            </TabsTrigger>
          </TabsList>

          {/* My Gear Tab */}
          <TabsContent value="my-gear" className="space-y-4">
            {/* Helpful Banner - only show for users who can manage inventory */}
            {canManageInventory(currentUser) && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="material-icons text-primary text-2xl">info</span>
                      <div>
                        <div className="font-semibold">Want to add new gear?</div>
                        <p className="text-sm text-muted-foreground">
                          Switch to the "Manage Gear" tab to add inventory items
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setActiveTab("manage")}
                      data-testid="button-go-to-manage"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Go to Manage Gear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {myGear.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="material-icons text-5xl text-muted-foreground">inventory_2</span>
                    <div>
                      <div className="font-semibold text-lg">No Gear Assigned</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        You don't have any equipment assigned yet.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myGear.map((item: any) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="material-icons text-primary text-2xl">
                            {EQUIPMENT_ICONS[item.equipmentType] || "category"}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <div className="font-semibold text-base flex items-center gap-2">
                                {item.equipmentType}
                                {item.inService === false && (
                                  <Badge variant="destructive" className="text-xs">
                                    Out of Service
                                  </Badge>
                                )}
                              </div>
                              {(item.brand || item.model) && (
                                <div className="text-sm text-muted-foreground mt-0.5">
                                  {[item.brand, item.model].filter(Boolean).join(" - ")}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {item.dateOfManufacture && (
                              <div>
                                <span className="text-muted-foreground">Manufactured:</span>
                                <div className="font-medium mt-0.5">
                                  {new Date(item.dateOfManufacture).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                            {item.dateInService && (
                              <div>
                                <span className="text-muted-foreground">In Service:</span>
                                <div className="font-medium mt-0.5">
                                  {new Date(item.dateInService).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                            {item.dateOutOfService && (
                              <div>
                                <span className="text-muted-foreground">Out of Service:</span>
                                <div className="font-medium mt-0.5">
                                  {new Date(item.dateOutOfService).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Assignment Serial Number */}
                          {(() => {
                            const myAssignment = getItemAssignments(item.id).find(a => a.employeeId === currentUser?.id);
                            return myAssignment?.serialNumber ? (
                              <div className="mt-3 pt-3 border-t">
                                <div className="text-xs text-muted-foreground mb-2">Assigned Serial Number:</div>
                                <Badge variant="secondary" className="text-xs font-mono">
                                  {myAssignment.serialNumber}
                                </Badge>
                              </div>
                            ) : null;
                          })()}

                          {/* Notes */}
                          {item.notes && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="text-xs text-muted-foreground mb-1">Notes:</div>
                              <div className="text-sm">{item.notes}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Team Gear Tab - Requires view_gear_assignments permission */}
          {canViewGearAssignments(currentUser) && (
            <TabsContent value="team-gear" className="space-y-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-primary text-2xl">groups</span>
                    <div>
                      <div className="font-semibold">Team Equipment Overview</div>
                      <p className="text-sm text-muted-foreground">
                        View and manage gear assigned to all employees
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employee List with Gear */}
              {activeEmployees.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-icons text-5xl text-muted-foreground">people</span>
                      <div>
                        <div className="font-semibold text-lg">No Employees</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          No employees found to display gear assignments.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {activeEmployees.map((employee: any) => {
                    const employeeAssignments = (assignmentsData?.assignments || []).filter((a: GearAssignment) => a.employeeId === employee.id);
                    const isExpanded = expandedEmployeeId === employee.id;
                    const totalAssignedItems = employeeAssignments.reduce((sum: number, a: GearAssignment) => sum + (a.quantity || 1), 0);
                    
                    return (
                      <Card key={employee.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          {/* Employee Header - Clickable to expand */}
                          <div
                            className="p-4 flex items-center justify-between cursor-pointer hover-elevate"
                            onClick={() => setExpandedEmployeeId(isExpanded ? null : employee.id)}
                            data-testid={`employee-row-${employee.id}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="material-icons text-primary">person</span>
                              </div>
                              <div>
                                <div className="font-semibold">{employee.name}</div>
                                <div className="text-sm text-muted-foreground">{employee.role || 'Employee'}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={employeeAssignments.length > 0 ? "default" : "secondary"}>
                                {totalAssignedItems} {totalAssignedItems === 1 ? 'item' : 'items'}
                              </Badge>
                              <span className={`material-icons transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                expand_more
                              </span>
                            </div>
                          </div>

                          {/* Expanded Gear List */}
                          {isExpanded && (
                            <div className="border-t bg-muted/30 p-4 space-y-3">
                              {employeeAssignments.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground">
                                  <span className="material-icons text-3xl mb-2">inventory_2</span>
                                  <p className="text-sm">No gear assigned to this employee</p>
                                </div>
                              ) : (
                                employeeAssignments.map((assignment: GearAssignment) => {
                                  const gearItem = allGearItems.find(g => g.id === assignment.gearItemId);
                                  if (!gearItem) return null;
                                  
                                  return (
                                    <div
                                      key={assignment.id}
                                      className="flex items-center justify-between p-3 bg-background rounded-lg border"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                                          <span className="material-icons text-primary text-sm">
                                            {gearItem.equipmentType === 'Harness' ? 'security' :
                                             gearItem.equipmentType === 'Rope' ? 'architecture' :
                                             gearItem.equipmentType === 'Helmet' ? 'sports_mma' :
                                             'category'}
                                          </span>
                                        </div>
                                        <div>
                                          <div className="font-medium text-sm">{gearItem.equipmentType}</div>
                                          {(gearItem.brand || gearItem.model) && (
                                            <div className="text-xs text-muted-foreground">
                                              {[gearItem.brand, gearItem.model].filter(Boolean).join(' - ')}
                                            </div>
                                          )}
                                          {assignment.serialNumber && (
                                            <div className="text-xs text-muted-foreground font-mono mt-1">
                                              S/N: {assignment.serialNumber}
                                            </div>
                                          )}
                                          {(assignment.dateOfManufacture || assignment.dateInService) && (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                              {assignment.dateOfManufacture && (
                                                <span className="text-xs text-muted-foreground">
                                                  Mfg: {new Date(assignment.dateOfManufacture).toLocaleDateString()}
                                                </span>
                                              )}
                                              {assignment.dateInService && (
                                                <span className="text-xs text-muted-foreground">
                                                  In Service: {new Date(assignment.dateInService).toLocaleDateString()}
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                          Qty: {assignment.quantity || 1}
                                        </Badge>
                                        {/* Only show edit/delete buttons for users with assign_gear permission */}
                                        {canAssignGear(currentUser) && (
                                          <>
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingAssignment(assignment);
                                                setEditAssignmentQuantity(String(assignment.quantity || 1));
                                                setEditAssignmentSerialNumber(assignment.serialNumber || "");
                                                setEditAssignmentDateOfManufacture(assignment.dateOfManufacture || "");
                                                setEditAssignmentDateInService(assignment.dateInService || "");
                                                setShowEditAssignmentDialog(true);
                                              }}
                                              data-testid={`button-edit-assignment-${assignment.id}`}
                                            >
                                              <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              className="text-destructive"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm(`Remove this ${gearItem.equipmentType} from ${employee.name}?`)) {
                                                  deleteAssignmentMutation.mutate(assignment.id);
                                                }
                                              }}
                                              data-testid={`button-delete-assignment-${assignment.id}`}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                              
                              {/* Add Gear Button - only for users with manage_inventory permission */}
                              {canManageInventory(currentUser) && (
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAssignEmployeeId(employee.id);
                                    setActiveTab("manage");
                                  }}
                                  data-testid={`button-add-gear-${employee.id}`}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Assign Gear to {employee.name}
                                </Button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          )}

          {/* Manage Gear Tab - Requires manage_inventory permission */}
          {canManageInventory(currentUser) && (
          <TabsContent value="manage" className="space-y-4">
            {/* Total Inventory Value Card - Only visible to users with financial permissions */}
            {canViewFinancials && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <span className="material-icons text-lg">inventory_2</span>
                      Total Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalAllItems}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Items in inventory
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <span className="material-icons text-lg">attach_money</span>
                      Total Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${totalAllValue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All inventory value
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Add Item Card */}
            <Card className="hover-elevate active-elevate-2 cursor-pointer" onClick={openAddDialog} data-testid="card-add-item">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Add Inventory Item</CardTitle>
                    <CardDescription>Add new gear to the inventory system</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* View Inventory Section */}
            <Card>
              <CardHeader>
                <CardTitle>All Inventory Items</CardTitle>
                <CardDescription>View all gear items in the system</CardDescription>
              </CardHeader>
              <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading inventory...</div>
            ) : !gearData?.items || gearData.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No items in inventory yet. Click "Add Item to Inventory" to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {gearData.items.map((item) => (
                  <Card key={item.id} className="bg-muted/30" data-testid={`item-${item.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                          <div>
                            <div className="font-semibold mb-1">{item.equipmentType || "Gear Item"}</div>
                            {item.brand && (
                              <div className="text-sm text-muted-foreground">Brand: {item.brand}</div>
                            )}
                            {item.model && (
                              <div className="text-sm text-muted-foreground">Model: {item.model}</div>
                            )}
                            <div className="text-sm font-medium text-foreground mt-1">
                              Quantity: {item.quantity || 1}
                            </div>
                            {item.serialNumbers && item.serialNumbers.length > 0 && (
                              <div className="text-sm text-muted-foreground space-y-0.5">
                                <div className="font-medium">Serial Numbers:</div>
                                {item.serialNumbers.map((sn, idx) => (
                                  <div key={idx} className="pl-2">• {sn}</div>
                                ))}
                              </div>
                            )}
                            <div className="text-sm mt-2">
                              <div className="font-medium text-foreground">
                                Available: {getAvailableQuantity(item)} / {item.quantity || 0}
                              </div>
                              {getItemAssignments(item.id).length > 0 && (
                                <div className="mt-1 space-y-1">
                                  <div className="text-xs text-muted-foreground">Assigned:</div>
                                  {getItemAssignments(item.id).map((assignment) => {
                                    const employee = activeEmployees.find(e => e.id === assignment.employeeId);
                                    return (
                                      <div key={assignment.id} className="flex items-center justify-between gap-2">
                                        <span className="text-xs">• {employee?.name || "Unknown"} ({assignment.quantity})</span>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          onClick={() => deleteAssignmentMutation.mutate(assignment.id)}
                                          className="h-5 w-5"
                                          data-testid={`button-unassign-${assignment.id}`}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            {canViewFinancials && item.itemPrice && (
                              <div className="space-y-0.5 mb-1">
                                <div className="text-sm font-semibold text-primary">
                                  ${parseFloat(item.itemPrice).toFixed(2)} each
                                </div>
                                {item.quantity && item.quantity > 1 && (
                                  <div className="text-sm font-medium text-primary/80">
                                    Total: ${(parseFloat(item.itemPrice) * item.quantity).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            )}
                            {item.notes && (
                              <div className="text-sm text-muted-foreground">
                                Notes: {item.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openAssignDialog(item)}
                            data-testid={`button-assign-${item.id}`}
                            title="Assign gear to employee"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditDialog(item)}
                            data-testid={`button-edit-${item.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openDeleteDialog(item)}
                            data-testid={`button-delete-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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
          )}

          {/* Harness Inspections Tab */}
          <TabsContent value="inspections" className="space-y-4">
            <HarnessInspectionForm />
          </TabsContent>

          {/* Daily Harness Inspection Tab */}
          <TabsContent value="daily-harness">
            <Card className="glass-card border-0 shadow-premium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="material-icons">verified</span>
                      Harness Inspection Tracking
                    </CardTitle>
                    <CardDescription>
                      Daily inspections for employees with work sessions
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={inspectionFilter === "week" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInspectionFilter("week")}
                      data-testid="filter-week-inspections"
                    >
                      7 Days
                    </Button>
                    <Button
                      variant={inspectionFilter === "month" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInspectionFilter("month")}
                      data-testid="filter-month-inspections"
                    >
                      30 Days
                    </Button>
                    <Button
                      variant={inspectionFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInspectionFilter("all")}
                      data-testid="filter-all-inspections"
                    >
                      All Time
                    </Button>
                    <Button
                      variant={inspectionFilter === "combined" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInspectionFilter("combined")}
                      data-testid="filter-combined-inspections"
                    >
                      Overall
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Safety Rating - Only visible to users with CSR permission */}
                {canViewCSR(currentUser) && (
                  <Card className="border-2" style={{
                    borderColor: companySafetyRating >= 90 ? 'hsl(142, 76%, 36%)' : 
                                 companySafetyRating >= 70 ? 'hsl(48, 96%, 53%)' : 
                                 'hsl(0, 84%, 60%)',
                    backgroundColor: companySafetyRating >= 90 ? 'hsl(142, 76%, 96%)' : 
                                     companySafetyRating >= 70 ? 'hsl(48, 96%, 95%)' : 
                                     'hsl(0, 84%, 96%)'
                  }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Company Safety Rating
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {inspectionFilter === "week" ? "Last 7 Days" : 
                             inspectionFilter === "month" ? "Last 30 Days" : 
                             inspectionFilter === "all" ? "All Time" :
                             "Combined Overall (7d + 30d + All)"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-5xl font-bold" style={{
                            color: companySafetyRating >= 90 ? 'hsl(142, 76%, 36%)' : 
                                   companySafetyRating >= 70 ? 'hsl(48, 96%, 53%)' : 
                                   'hsl(0, 84%, 60%)'
                          }}>
                            {companySafetyRating}%
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Inspection Compliance
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Inspection Grid */}
                <div className="overflow-x-auto">
                  {(() => {
                    // Filter employees: show all if has permission, otherwise only show current user
                    const visibleEmployees = canViewAllInspections 
                      ? (employeesData?.employees || [])
                      : (employeesData?.employees || []).filter((emp: any) => emp.id === currentUser?.id);
                    
                    return (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium text-sm">Employee</th>
                        {inspectionDays.map((date, index) => (
                          <th key={index} className="text-center p-3 font-medium text-sm">
                            <div>{format(date, 'EEE')}</div>
                            <div className="text-xs text-muted-foreground">{format(date, 'MMM d')}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleEmployees.length === 0 ? (
                        <tr>
                          <td colSpan={inspectionDays.length + 1} className="text-center p-8 text-muted-foreground">
                            No inspections found
                          </td>
                        </tr>
                      ) : (
                        visibleEmployees.map((employee: any) => (
                          <tr 
                            key={employee.id} 
                            className="border-b hover-elevate"
                            data-testid={`employee-inspection-row-${employee.id}`}
                          >
                            <td className="p-3">
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-xs text-muted-foreground">{employee.role?.replace(/_/g, ' ')}</div>
                            </td>
                            {inspectionDays.map((date, index) => {
                              const hadSession = hadWorkSession(employee.id, date);
                              const dateStr = format(date, 'yyyy-MM-dd');
                              const inspection = harnessInspections.find((inspection: any) =>
                                inspection.workerId === employee.id && inspection.inspectionDate === dateStr
                              );
                              const isNotApplicable = inspection?.overallStatus === "not_applicable";
                              const hasValidInspection = inspection && !isNotApplicable;
                              
                              return (
                                <td key={index} className="text-center p-3">
                                  {isNotApplicable ? (
                                    <span className="text-xs font-medium text-muted-foreground/60" title="Harness not applicable for this session">
                                      N/A
                                    </span>
                                  ) : hasValidInspection ? (
                                    <span className="material-icons text-green-500" title="Inspection submitted">
                                      check_circle
                                    </span>
                                  ) : hadSession ? (
                                    <span className="material-icons text-red-500" title="No inspection submitted">
                                      cancel
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground/30" title="No work session">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent data-testid="dialog-add-item" className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{addItemStep === 1 ? "Select Item Type" : "Add Item Details"}</DialogTitle>
            <DialogDescription>
              {addItemStep === 1 ? "Choose the type of gear you're adding" : "Fill in the item information"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
              
              {addItemStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="equipmentType"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto p-1">
                          {gearTypes.map((type) => {
                            const IconComponent = type.icon;
                            return (
                              <Card
                                key={type.name}
                                className={`cursor-pointer hover-elevate active-elevate-2 transition-all ${
                                  field.value === type.name ? "bg-primary/10 border-primary border-2" : ""
                                }`}
                                onClick={() => {
                                  field.onChange(type.name);
                                  if (type.name !== "Other") {
                                    setCustomType("");
                                  }
                                }}
                                data-testid={`card-type-${type.name.toLowerCase().replace(/\s+/g, "-")}`}
                              >
                                <CardContent className="p-4 flex flex-col items-center gap-2">
                                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                    field.value === type.name ? "bg-primary text-primary-foreground" : "bg-muted"
                                  }`}>
                                    <IconComponent className="h-5 w-5" />
                                  </div>
                                  <div className="text-xs text-center font-medium leading-tight">{type.name}</div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(form.watch("equipmentType") === "Other" || customType) && (
                    <div className="space-y-2">
                      <FormLabel>Custom Type Name</FormLabel>
                      <Input
                        placeholder="Enter custom gear type"
                        value={customType}
                        onChange={(e) => {
                          setCustomType(e.target.value);
                        }}
                        data-testid="input-custom-type"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddDialog(false)}
                      className="flex-1"
                      data-testid="button-cancel-step1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (!form.getValues("equipmentType")) {
                          toast({
                            title: "Type Required",
                            description: "Please select a gear type to continue.",
                            variant: "destructive",
                          });
                          return;
                        }
                        setAddItemStep(2);
                      }}
                      className="flex-1"
                      data-testid="button-continue-step1"
                    >
                      Continue
                    </Button>
                  </div>
                </>
              )}

              {addItemStep === 2 && (
                <>
                  <div className="max-h-[60vh] overflow-y-auto px-1 space-y-4">

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Petzl" {...field} value={field.value || ""} data-testid="input-brand" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., I'D S" {...field} value={field.value || ""} data-testid="input-model" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Enter quantity"
                        {...field}
                        value={field.value !== undefined && field.value !== null ? field.value : ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                          field.onChange(val === undefined || isNaN(val) ? undefined : val);
                        }}
                        data-testid="input-quantity"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rope-specific fields */}
              {form.watch("equipmentType") === "Rope" && (
                <>
                  <FormField
                    control={form.control}
                    name="ropeLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rope Length (feet)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter rope length"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-rope-length"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricePerFeet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Per Foot</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter price per foot"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-price-per-feet"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="border-t pt-4 mt-4">
                    <div className="text-sm font-medium mb-3">Assign to Employee (Optional)</div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Employee</Label>
                        <Select value={assignEmployeeId} onValueChange={setAssignEmployeeId}>
                          <SelectTrigger data-testid="select-assign-employee-add">
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {activeEmployees
                              .filter((emp: any) => emp.name && emp.name.trim() !== "")
                              .map((emp: any) => (
                                <SelectItem key={emp.id} value={emp.id}>
                                  {emp.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {assignEmployeeId && (
                        <div className="space-y-2">
                          <Label>How Many to Assign</Label>
                          <Input
                            type="number"
                            min="1"
                            max={form.watch("quantity") || 1}
                            value={assignQuantity}
                            onChange={(e) => setAssignQuantity(e.target.value)}
                            placeholder="Enter quantity"
                            data-testid="input-assign-quantity-add"
                          />
                          <div className="text-xs text-muted-foreground">
                            Max: {form.watch("quantity") || 0}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Carabiner-specific fields */}
              {form.watch("equipmentType") === "Carabiner" && (
                <>
                  <FormField
                    control={form.control}
                    name="itemPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="border-t pt-4 mt-4">
                    <div className="text-sm font-medium mb-3">Assign to Employee (Optional)</div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Employee</Label>
                        <Select value={assignEmployeeId} onValueChange={setAssignEmployeeId}>
                          <SelectTrigger data-testid="select-assign-employee-add">
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {activeEmployees
                              .filter((emp: any) => emp.name && emp.name.trim() !== "")
                              .map((emp: any) => (
                                <SelectItem key={emp.id} value={emp.id}>
                                  {emp.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {assignEmployeeId && (
                        <div className="space-y-2">
                          <Label>How Many to Assign</Label>
                          <Input
                            type="number"
                            min="1"
                            max={form.watch("quantity") || 1}
                            value={assignQuantity}
                            onChange={(e) => setAssignQuantity(e.target.value)}
                            placeholder="Enter quantity"
                            data-testid="input-assign-quantity-add"
                          />
                          <div className="text-xs text-muted-foreground">
                            Max: {form.watch("quantity") || 0}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* All other gear types: show full details */}
              {form.watch("equipmentType") !== "Carabiner" && form.watch("equipmentType") !== "Rope" && (
                <>
                  {/* Serial Number Entry with Per-Item Dates */}
                  <div className="space-y-3">
                    <FormLabel>Add Individual Items (Optional)</FormLabel>
                    <p className="text-xs text-muted-foreground">Enter serial number and dates for each item. All fields will reset after adding.</p>
                    
                    <div className="space-y-3 p-3 bg-muted/20 rounded-md border border-dashed">
                      <div>
                        <Label className="text-xs">Serial Number</Label>
                        <Input
                          placeholder="Enter serial number"
                          value={currentSerialNumber}
                          onChange={(e) => setCurrentSerialNumber(e.target.value)}
                          data-testid="input-current-serial"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Date of Manufacture</Label>
                          <Input
                            type="date"
                            value={currentDateOfManufacture}
                            onChange={(e) => setCurrentDateOfManufacture(e.target.value)}
                            data-testid="input-current-date-manufacture"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Date In Service</Label>
                          <Input
                            type="date"
                            value={currentDateInService}
                            onChange={(e) => setCurrentDateInService(e.target.value)}
                            data-testid="input-current-date-service"
                          />
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="default"
                        onClick={handleAddSerialNumber}
                        disabled={serialEntries.length >= (form.watch("quantity") || 1)}
                        data-testid="button-add-serial"
                        className="w-full"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Item ({serialEntries.length}/{form.watch("quantity") || 1})
                      </Button>
                    </div>

                    {serialEntries.length > 0 && (
                      <div className="space-y-2 bg-muted/30 p-3 rounded-md">
                        <div className="text-sm font-medium">Added Items:</div>
                        {serialEntries.map((entry, index) => (
                          <div key={index} className="flex items-start justify-between text-sm p-2 bg-background rounded border">
                            <div className="flex-1">
                              <div className="font-medium">{entry.serialNumber}</div>
                              <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                                {entry.dateOfManufacture && (
                                  <span>Mfg: {new Date(entry.dateOfManufacture).toLocaleDateString()}</span>
                                )}
                                {entry.dateInService && (
                                  <span>In Service: {new Date(entry.dateInService).toLocaleDateString()}</span>
                                )}
                                {!entry.dateOfManufacture && !entry.dateInService && (
                                  <span className="italic">No dates set</span>
                                )}
                              </div>
                            </div>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => removeSerialEntry(index)}
                              data-testid={`button-remove-serial-${index}`}
                              className="h-6 w-6 ml-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Additional information..." {...field} value={field.value || ""} data-testid="textarea-notes" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {canViewFinancials && (
                    <FormField
                      control={form.control}
                      name="itemPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              value={field.value || ""}
                              data-testid="input-price"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAddItemStep(1)}
                      data-testid="button-back-step2"
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={addItemMutation.isPending} data-testid="button-submit" className="flex-1">
                      {addItemMutation.isPending ? "Adding..." : "Add Item"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent data-testid="dialog-edit-item">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>Update the item details.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditItem)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              <FormField
                control={form.control}
                name="equipmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value !== "Other") {
                          setCustomType("");
                        }
                      }} 
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-item-type-edit">
                          <SelectValue placeholder="Select gear type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gearTypes.filter((type) => type.name && type.name.trim() !== "").map((type) => (
                          <SelectItem key={type.name} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(form.watch("equipmentType") === "Other" || customType) && (
                <div className="space-y-2">
                  <FormLabel>Custom Type Name</FormLabel>
                  <Input
                    placeholder="Enter custom gear type"
                    value={customType}
                    onChange={(e) => {
                      setCustomType(e.target.value);
                    }}
                    data-testid="input-custom-type-edit"
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Petzl" {...field} value={field.value || ""} data-testid="input-brand-edit" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., I'D S" {...field} value={field.value || ""} data-testid="input-model-edit" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        value={field.value !== undefined && field.value !== null ? field.value : ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                          field.onChange(isNaN(val) ? 0 : val);
                        }}
                        data-testid="input-quantity-edit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assigned To Field */}
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "Not in use"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-assigned-to-edit">
                          <SelectValue placeholder="Select employee or Not in use" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Not in use">Not in use</SelectItem>
                        {activeEmployees.filter((emp: any) => emp.name && emp.name.trim() !== "").map((emp: any) => (
                          <SelectItem key={emp.id} value={emp.name}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Serial Number Entry with Per-Item Dates */}
              <div className="space-y-3">
                <FormLabel>Add Individual Items (Optional)</FormLabel>
                <p className="text-xs text-muted-foreground">Enter serial number and dates for each item. All fields will reset after adding.</p>
                
                <div className="space-y-3 p-3 bg-muted/20 rounded-md border border-dashed">
                  <div>
                    <Label className="text-xs">Serial Number</Label>
                    <Input
                      placeholder="Enter serial number"
                      value={currentSerialNumber}
                      onChange={(e) => setCurrentSerialNumber(e.target.value)}
                      data-testid="input-current-serial-edit"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Date of Manufacture</Label>
                      <Input
                        type="date"
                        value={currentDateOfManufacture}
                        onChange={(e) => setCurrentDateOfManufacture(e.target.value)}
                        data-testid="input-current-date-manufacture-edit"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Date In Service</Label>
                      <Input
                        type="date"
                        value={currentDateInService}
                        onChange={(e) => setCurrentDateInService(e.target.value)}
                        data-testid="input-current-date-service-edit"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="default"
                    onClick={handleAddSerialNumber}
                    disabled={serialEntries.length >= (form.watch("quantity") || 1)}
                    data-testid="button-add-serial-edit"
                    className="w-full"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Item ({serialEntries.length}/{form.watch("quantity") || 1})
                  </Button>
                </div>

                {/* Added Items List */}
                {serialEntries.length > 0 && (
                  <div className="space-y-2 bg-muted/30 p-3 rounded-md">
                    <div className="text-sm font-medium">Added Items:</div>
                    {serialEntries.map((entry, index) => (
                      <div key={index} className="flex items-start justify-between text-sm p-2 bg-background rounded border">
                        <div className="flex-1">
                          <div className="font-medium">{entry.serialNumber}</div>
                          <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                            {entry.dateOfManufacture && (
                              <span>Mfg: {new Date(entry.dateOfManufacture).toLocaleDateString()}</span>
                            )}
                            {entry.dateInService && (
                              <span>In Service: {new Date(entry.dateInService).toLocaleDateString()}</span>
                            )}
                            {!entry.dateOfManufacture && !entry.dateInService && (
                              <span className="italic">No dates set</span>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeSerialEntry(index)}
                          data-testid={`button-remove-serial-edit-${index}`}
                          className="h-6 w-6 ml-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional information..." {...field} value={field.value || ""} data-testid="textarea-notes-edit" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {canViewFinancials && (
                form.watch("equipmentType") === "Rope" ? (
                  <>
                    <FormField
                      control={form.control}
                      name="ropeLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rope Length (feet)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Enter rope length"
                              {...field}
                              value={field.value || ""}
                              data-testid="input-rope-length-edit"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricePerFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Per Foot</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Enter price per foot"
                              {...field}
                              value={field.value || ""}
                              data-testid="input-price-per-feet-edit"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <FormField
                    control={form.control}
                    name="itemPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-price-edit"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false);
                    setEditingItem(null);
                    form.reset();
                  }}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateItemMutation.isPending} data-testid="button-submit-edit">
                  {updateItemMutation.isPending ? "Updating..." : "Update Item"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent data-testid="dialog-delete-item">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item from inventory? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {itemToDelete && (
            <div className="py-4">
              <div className="space-y-1">
                <div className="font-medium">{itemToDelete.equipmentType || "Gear Item"}</div>
                {itemToDelete.brand && <div className="text-sm text-muted-foreground">Brand: {itemToDelete.brand}</div>}
                {itemToDelete.model && <div className="text-sm text-muted-foreground">Model: {itemToDelete.model}</div>}
                <div className="text-sm text-muted-foreground">Quantity: {itemToDelete.quantity || 1}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setItemToDelete(null);
              }}
              data-testid="button-cancel-delete"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteItem}
              disabled={deleteItemMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteItemMutation.isPending ? "Deleting..." : "Delete Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assignment Management Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent data-testid="dialog-assign-gear">
          <DialogHeader>
            <DialogTitle>Assign Gear to Employee</DialogTitle>
            <DialogDescription>
              Manage who this gear item is assigned to
            </DialogDescription>
          </DialogHeader>
          
          {managingItem && (
            <div className="space-y-4">
              {/* Item Info */}
              <div className="p-3 bg-muted/50 rounded-md">
                <div className="font-medium">{managingItem.equipmentType}</div>
                {(managingItem.brand || managingItem.model) && (
                  <div className="text-sm text-muted-foreground">
                    {[managingItem.brand, managingItem.model].filter(Boolean).join(" - ")}
                  </div>
                )}
                <div className="text-sm text-muted-foreground mt-1">
                  Available: {getAvailableQuantity(managingItem)} / {managingItem.quantity || 0}
                </div>
              </div>

              {/* Current Assignments */}
              {getItemAssignments(managingItem.id).length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Current Assignments:</div>
                  <div className="space-y-2">
                    {getItemAssignments(managingItem.id).map((assignment) => {
                      const employee = activeEmployees.find(e => e.id === assignment.employeeId);
                      return (
                        <div key={assignment.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div className="text-sm">
                            <div className="font-medium">{employee?.name || "Unknown"}</div>
                            <div className="text-xs text-muted-foreground">Quantity: {assignment.quantity}</div>
                            {assignment.serialNumber && (
                              <div className="text-xs text-muted-foreground">S/N: {assignment.serialNumber}</div>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteAssignmentMutation.mutate(assignment.id)}
                            disabled={deleteAssignmentMutation.isPending}
                            data-testid={`button-remove-assignment-${assignment.id}`}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add Assignment Form */}
              <div className="border-t pt-4 space-y-3">
                <div className="text-sm font-medium">Assign to New Employee:</div>
                
                <div className="space-y-2">
                  <Label htmlFor="assign-employee">Employee</Label>
                  {canAssignToOthers ? (
                    <Select value={assignEmployeeId} onValueChange={setAssignEmployeeId}>
                      <SelectTrigger data-testid="select-assign-employee">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeEmployees
                          .filter((emp: any) => emp.name && emp.name.trim() !== "")
                          .map((emp: any) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md border">
                      <span className="text-sm font-medium">{currentUser?.name || currentUser?.email || "You"}</span>
                      <Badge variant="secondary" className="text-xs">Yourself</Badge>
                    </div>
                  )}
                  {!canAssignToOthers && (
                    <p className="text-xs text-muted-foreground">
                      You can only assign gear to yourself. Contact management to assign gear to other employees.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assign-quantity">Quantity</Label>
                  <Input
                    id="assign-quantity"
                    type="number"
                    min="1"
                    max={getAvailableQuantity(managingItem)}
                    value={assignQuantity}
                    onChange={(e) => setAssignQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    data-testid="input-assign-quantity"
                  />
                  <div className="text-xs text-muted-foreground">
                    Max available: {getAvailableQuantity(managingItem)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assign-serial-number">Serial Number (Optional)</Label>
                  <Input
                    id="assign-serial-number"
                    type="text"
                    value={assignSerialNumber}
                    onChange={(e) => setAssignSerialNumber(e.target.value)}
                    placeholder="Enter serial number of assigned gear"
                    data-testid="input-assign-serial-number"
                  />
                  <div className="text-xs text-muted-foreground">
                    Enter the serial number of the specific gear item being assigned
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assign-date-of-manufacture">Date of Manufacture (Optional)</Label>
                  <Input
                    id="assign-date-of-manufacture"
                    type="date"
                    value={assignDateOfManufacture}
                    onChange={(e) => setAssignDateOfManufacture(e.target.value)}
                    data-testid="input-assign-date-of-manufacture"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assign-date-in-service">Date In Service (Optional)</Label>
                  <Input
                    id="assign-date-in-service"
                    type="date"
                    value={assignDateInService}
                    onChange={(e) => setAssignDateInService(e.target.value)}
                    data-testid="input-assign-date-in-service"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAssignDialog(false);
                setManagingItem(null);
                setAssignEmployeeId("");
                setAssignQuantity("1");
                setAssignSerialNumber("");
                setAssignDateOfManufacture("");
                setAssignDateInService("");
              }}
              data-testid="button-cancel-assign"
            >
              Close
            </Button>
            <Button
              onClick={handleAssignGear}
              disabled={createAssignmentMutation.isPending || !assignEmployeeId}
              data-testid="button-submit-assign"
            >
              {createAssignmentMutation.isPending ? "Assigning..." : "Assign Gear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Dialog */}
      <Dialog open={showEditAssignmentDialog} onOpenChange={setShowEditAssignmentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Gear Assignment
            </DialogTitle>
            <DialogDescription>
              Update the details for this gear assignment.
            </DialogDescription>
          </DialogHeader>
          
          {editingAssignment && (
            <div className="space-y-4 py-4">
              {/* Gear Info */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Assigned Gear</div>
                <div className="font-medium">
                  {allGearItems.find(g => g.id === editingAssignment.gearItemId)?.equipmentType || 'Unknown'}
                </div>
                {(() => {
                  const item = allGearItems.find(g => g.id === editingAssignment.gearItemId);
                  return item && (item.brand || item.model) ? (
                    <div className="text-sm text-muted-foreground">
                      {[item.brand, item.model].filter(Boolean).join(' - ')}
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="editQuantity">Quantity</Label>
                <Input
                  id="editQuantity"
                  type="number"
                  min={1}
                  value={editAssignmentQuantity}
                  onChange={(e) => setEditAssignmentQuantity(e.target.value)}
                  data-testid="input-edit-assignment-quantity"
                />
              </div>

              {/* Serial Number */}
              <div className="space-y-2">
                <Label htmlFor="editSerialNumber">Serial Number (Optional)</Label>
                <Input
                  id="editSerialNumber"
                  type="text"
                  value={editAssignmentSerialNumber}
                  onChange={(e) => setEditAssignmentSerialNumber(e.target.value)}
                  placeholder="Enter serial number"
                  data-testid="input-edit-assignment-serial-number"
                />
              </div>

              {/* Date of Manufacture */}
              <div className="space-y-2">
                <Label htmlFor="editDateOfManufacture">Date of Manufacture (Optional)</Label>
                <Input
                  id="editDateOfManufacture"
                  type="date"
                  value={editAssignmentDateOfManufacture}
                  onChange={(e) => setEditAssignmentDateOfManufacture(e.target.value)}
                  data-testid="input-edit-assignment-date-of-manufacture"
                />
              </div>

              {/* Date In Service */}
              <div className="space-y-2">
                <Label htmlFor="editDateInService">Date In Service (Optional)</Label>
                <Input
                  id="editDateInService"
                  type="date"
                  value={editAssignmentDateInService}
                  onChange={(e) => setEditAssignmentDateInService(e.target.value)}
                  data-testid="input-edit-assignment-date-in-service"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditAssignmentDialog(false);
                setEditingAssignment(null);
                setEditAssignmentSerialNumber("");
                setEditAssignmentDateOfManufacture("");
                setEditAssignmentDateInService("");
              }}
              data-testid="button-cancel-edit-assignment"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingAssignment) {
                  updateAssignmentMutation.mutate({
                    id: editingAssignment.id,
                    quantity: parseInt(editAssignmentQuantity) || 1,
                    serialNumber: editAssignmentSerialNumber || undefined,
                    dateOfManufacture: editAssignmentDateOfManufacture || undefined,
                    dateInService: editAssignmentDateInService || undefined,
                  });
                }
              }}
              disabled={updateAssignmentMutation.isPending}
              data-testid="button-save-edit-assignment"
            >
              {updateAssignmentMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
