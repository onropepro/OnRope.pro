import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSetHeaderConfig } from "@/components/DashboardLayout";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
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
import { ArrowLeft, Plus, Pencil, X, Trash2, Shield, Cable, Link2, Gauge, TrendingUp, HardHat, Hand, Fuel, Scissors, PaintBucket, Droplets, CircleDot, Lock, Anchor, Zap, MoreHorizontal, Users, ShieldAlert, AlertTriangle, FileWarning, FileDown, Wrench, Search, ChevronDown, ChevronRight, Triangle, Signpost, Disc, Wand2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { hasFinancialAccess, canViewCSR, canAccessInventory, canManageInventory, canAssignGear, canViewGearAssignments } from "@/lib/permissions";
import HarnessInspectionForm from "./HarnessInspectionForm";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { jsPDF } from "jspdf";
import { formatLocalDate, formatLocalDateLong, parseLocalDate, toLocalDateString } from "@/lib/dateUtils";

// Helper to get date locale based on current language
const getDateLocale = () => i18n.language?.startsWith('fr') ? fr : enUS;

// Calculate how long an item has been in service
const getServiceDuration = (dateInService: string | null | undefined): string | null => {
  if (!dateInService) return null;
  
  try {
    const inServiceDate = new Date(dateInService);
    const now = new Date();
    
    if (isNaN(inServiceDate.getTime())) return null;
    
    const diffMs = now.getTime() - inServiceDate.getTime();
    if (diffMs < 0) return null; // Future date
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return diffDays === 1 ? "1 day" : `${diffDays} days`;
    }
    
    const months = Math.floor(diffDays / 30);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return months === 1 ? "1 month" : `${months} months`;
    }
    
    if (remainingMonths === 0) {
      return years === 1 ? "1 year" : `${years} years`;
    }
    
    const yearPart = years === 1 ? "1 yr" : `${years} yrs`;
    const monthPart = remainingMonths === 1 ? "1 mo" : `${remainingMonths} mo`;
    return `${yearPart}, ${monthPart}`;
  } catch {
    return null;
  }
};

// Gear type keys for translation - will be translated inside component
const gearTypeKeys = [
  { key: "harness", defaultName: "Harness", icon: Shield },
  { key: "rope", defaultName: "Rope", icon: Cable },
  { key: "carabinerSteel", defaultName: "Carabiner - Steel", icon: Link2 },
  { key: "carabinerAluminum", defaultName: "Carabiner - Aluminum", icon: Link2 },
  { key: "descender", defaultName: "Descender", icon: Gauge },
  { key: "ascender", defaultName: "Ascender", icon: TrendingUp },
  { key: "helmet", defaultName: "Helmet", icon: HardHat },
  { key: "gloves", defaultName: "Gloves", icon: Hand },
  { key: "workPositioningDevice", defaultName: "Work positioning device", icon: Shield },
  { key: "gasPoweredEquipment", defaultName: "Gas powered equipment", icon: Fuel },
  { key: "squeegeeRubbers", defaultName: "Squeegee rubbers", icon: Scissors },
  { key: "applicators", defaultName: "Applicators", icon: PaintBucket },
  { key: "soap", defaultName: "Soap", icon: Droplets },
  { key: "suctionCup", defaultName: "Suction cup", icon: CircleDot },
  { key: "backupDevice", defaultName: "Back up device", icon: Lock },
  { key: "lanyard", defaultName: "Lanyard", icon: Anchor },
  { key: "shockAbsorber", defaultName: "Shock absorber", icon: Zap },
  { key: "highPressureHose", defaultName: "High pressure hose", icon: Cable },
  { key: "airHose", defaultName: "Air hose", icon: Cable },
  { key: "cautionSigns", defaultName: "Caution signs", icon: AlertTriangle },
  { key: "cones", defaultName: "Cones", icon: Triangle },
  { key: "streetSigns", defaultName: "Street signs", icon: Signpost },
  { key: "delineator", defaultName: "Delineator", icon: Triangle },
  { key: "pressureHoseGasket", defaultName: "Pressure hose gasket", icon: Disc },
  { key: "pressureWasherWand", defaultName: "Pressure washer wand", icon: Wand2 },
  { key: "pulley", defaultName: "Pulley", icon: Gauge },
  { key: "slings", defaultName: "Slings", icon: Anchor },
  { key: "other", defaultName: "Other", icon: MoreHorizontal }
];

export default function Inventory() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Translated gear types
  const gearTypes = gearTypeKeys.map(gt => ({
    name: t(`inventory.gearTypes.${gt.key}`, gt.defaultName),
    icon: gt.icon
  }));
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
  const [activeTab, setActiveTab] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [inspectionFilter, setInspectionFilter] = useState<"week" | "month" | "all" | "combined">("week");
  
  // Assignment dialog state
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [managingItem, setManagingItem] = useState<(GearItem & { serialNumbers: string[], assignedQuantity: number, availableQuantity: number }) | null>(null);
  const [assignEmployeeId, setAssignEmployeeId] = useState<string>("");
  const [assignQuantity, setAssignQuantity] = useState<string>("1");
  const [assignSerialNumber, setAssignSerialNumber] = useState<string>("");
  const [assignDateOfManufacture, setAssignDateOfManufacture] = useState<string>("");
  const [assignDateInService, setAssignDateInService] = useState<string>("");
  const [assignSerialMode, setAssignSerialMode] = useState<"pick" | "new">("pick");
  const [selectedAssignSerialEntry, setSelectedAssignSerialEntry] = useState<any | null>(null);
  
  // Team Gear state - for management view of all employee gear
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<GearAssignment | null>(null);
  const [showEditAssignmentDialog, setShowEditAssignmentDialog] = useState(false);
  const [editAssignmentQuantity, setEditAssignmentQuantity] = useState<string>("1");
  const [editAssignmentSerialNumber, setEditAssignmentSerialNumber] = useState<string>("");
  const [editAssignmentDateOfManufacture, setEditAssignmentDateOfManufacture] = useState<string>("");
  const [editAssignmentDateInService, setEditAssignmentDateInService] = useState<string>("");

  // Self-assign gear state
  const [showSelfAssignDialog, setShowSelfAssignDialog] = useState(false);
  const [selfAssignItem, setSelfAssignItem] = useState<(GearItem & { serialNumbers: string[], assignedQuantity: number, availableQuantity: number }) | null>(null);
  const [selfAssignQuantity, setSelfAssignQuantity] = useState<string>("1");
  const [selfAssignSearch, setSelfAssignSearch] = useState("");
  const [selfAssignSerialNumber, setSelfAssignSerialNumber] = useState<string>("");
  const [selfAssignDateOfManufacture, setSelfAssignDateOfManufacture] = useState<string>("");
  const [selfAssignDateInService, setSelfAssignDateInService] = useState<string>("");
  const [selfAssignSerialMode, setSelfAssignSerialMode] = useState<"pick" | "new">("pick");
  const [selectedSerialEntry, setSelectedSerialEntry] = useState<any | null>(null);
  
  // Edit my gear state
  const [showEditMyGearDialog, setShowEditMyGearDialog] = useState(false);
  const [editingMyAssignment, setEditingMyAssignment] = useState<any | null>(null);
  const [editMySerialNumber, setEditMySerialNumber] = useState<string>("");
  const [editMyDateOfManufacture, setEditMyDateOfManufacture] = useState<string>("");
  const [editMyDateInService, setEditMyDateInService] = useState<string>("");

  // Damage report state
  const [showDamageReportDialog, setShowDamageReportDialog] = useState(false);
  const [damageReportStep, setDamageReportStep] = useState(1);
  const [selectedDamageCategory, setSelectedDamageCategory] = useState("");
  const [selectedDamageItem, setSelectedDamageItem] = useState<GearItem | null>(null);
  const [selectedDamageSerialEntry, setSelectedDamageSerialEntry] = useState<any | null>(null); // Selected specific unit
  const [selectedDamageUnitIndex, setSelectedDamageUnitIndex] = useState<number | null>(null); // For items without serial numbers
  const [damageDescription, setDamageDescription] = useState("");
  const [damageLocation, setDamageLocation] = useState("");
  const [damageSeverity, setDamageSeverity] = useState<"minor" | "moderate" | "severe" | "critical">("moderate");
  const [discoveredDate, setDiscoveredDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [retireEquipment, setRetireEquipment] = useState(false);
  const [retirementReason, setRetirementReason] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [damageNotes, setDamageNotes] = useState("");

  // Equipment catalog state - for smart gear picker
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<{ id: string; brand: string; model: string } | null>(null);
  const [showOtherDescender, setShowOtherDescender] = useState(false);
  const [customBrand, setCustomBrand] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [catalogSearch, setCatalogSearch] = useState("");
  
  // Retire gear state
  const [showRetireDialog, setShowRetireDialog] = useState(false);
  const [serialToRetire, setSerialToRetire] = useState<GearSerialNumber | null>(null);
  const [retireReason, setRetireReason] = useState<string>("");
  
  // Gear item detail dialog state
  const [showItemDetailDialog, setShowItemDetailDialog] = useState(false);
  const [showFieldValueBreakdown, setShowFieldValueBreakdown] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<GearItem | null>(null);
  const [detailDialogSource, setDetailDialogSource] = useState<"myGear" | "manageGear">("manageGear");

  // Fetch current user
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;
  const canViewFinancials = hasFinancialAccess(currentUser);
  const hasInventoryAccess = canAccessInventory(currentUser);

  // Set default tab based on user role - company owners go directly to manage gear
  useEffect(() => {
    if (currentUser && !activeTab) {
      if (currentUser.role === 'company') {
        setActiveTab("manage");
      } else {
        setActiveTab("my-gear");
      }
    }
  }, [currentUser, activeTab]);

  // Redirect users without inventory access permission
  if (userData && !hasInventoryAccess) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <ShieldAlert className="w-12 h-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">{t('common.accessRestricted', 'Access Restricted')}</h2>
              <p className="text-muted-foreground">
                {t('inventory.accessDenied', "You don't have permission to access the Inventory & Gear Management page.")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('common.contactAdmin', 'Please contact your administrator if you need access.')}
              </p>
              <Button variant="outline" onClick={() => setLocation("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.backToDashboard', 'Return to Dashboard')}
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
  const { data: gearData, isLoading } = useQuery<{ items: (GearItem & { serialNumbers: string[], assignedQuantity: number, availableQuantity: number })[] }>({
    queryKey: ["/api/gear-items"],
  });

  // Fetch all gear assignments
  const { data: assignmentsData } = useQuery<{ assignments: GearAssignment[] }>({
    queryKey: ["/api/gear-assignments"],
  });

  // Fetch field value (value of gear currently assigned to employees, excluding consumables)
  const { data: fieldValueData } = useQuery<{ 
    totalFieldValue: number; 
    totalItemCount: number;
    employeeBreakdown: { employeeId: string; name: string; value: number; itemCount: number }[] 
  }>({
    queryKey: ["/api/gear/field-value"],
    enabled: canViewFinancials,
  });

  // Fetch active employees for dropdown
  const { data: employeesData } = useQuery<{ employees: any[] }>({
    queryKey: ["/api/employees"],
  });

  // Fetch equipment damage reports
  const { data: damageReportsData, isLoading: damageReportsLoading } = useQuery<{ reports: any[] }>({
    queryKey: ["/api/equipment-damage-reports"],
  });

  // Fetch retired gear
  const { data: retiredGearData, isLoading: retiredGearLoading } = useQuery<{ retiredGear: any[] }>({
    queryKey: ["/api/retired-gear"],
    enabled: canManageInventory(currentUser),
  });
  const retiredGear = retiredGearData?.retiredGear || [];

  // Equipment types that have catalog support (all except Gas powered equipment, Soap, and Other)
  const CATALOG_SUPPORTED_TYPES = [
    "Descender", "Harness", "Rope", "Carabiner - Steel", "Carabiner - Aluminum",
    "Ascender", "Helmet", "Gloves", "Work positioning device", "Squeegee rubbers",
    "Applicators", "Suction cup", "Back up device", "Lanyard", "Shock absorber"
  ];

  // Fetch equipment catalogs for smart gear picker
  const { data: descenderCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Descender" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Descender")).json(),
  });
  const { data: harnessCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Harness" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Harness")).json(),
  });
  const { data: ropeCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Rope" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Rope")).json(),
  });
  const { data: steelCarabinerCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Carabiner - Steel" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Carabiner%20-%20Steel")).json(),
  });
  const { data: aluminumCarabinerCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Carabiner - Aluminum" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Carabiner%20-%20Aluminum")).json(),
  });
  const { data: ascenderCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Ascender" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Ascender")).json(),
  });
  const { data: helmetCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Helmet" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Helmet")).json(),
  });
  const { data: glovesCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Gloves" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Gloves")).json(),
  });
  const { data: workPositioningCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Work positioning device" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Work%20positioning%20device")).json(),
  });
  const { data: squeegeeCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Squeegee rubbers" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Squeegee%20rubbers")).json(),
  });
  const { data: applicatorsCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Applicators" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Applicators")).json(),
  });
  const { data: suctionCupCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Suction cup" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Suction%20cup")).json(),
  });
  const { data: backupDeviceCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Back up device" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Back%20up%20device")).json(),
  });
  const { data: lanyardCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Lanyard" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Lanyard")).json(),
  });
  const { data: shockAbsorberCatalog } = useQuery<{ items: { id: string; brand: string; model: string; usageCount: number }[] }>({
    queryKey: ["/api/equipment-catalog", { type: "Shock absorber" }],
    queryFn: async () => (await fetch("/api/equipment-catalog?type=Shock%20absorber")).json(),
  });

  // Create damage report mutation
  const createDamageReportMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/equipment-damage-reports", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment-damage-reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      toast({
        title: t('inventory.toast.damageReportSuccess', 'Damage Report Submitted'),
        description: retireEquipment 
          ? t('inventory.damageReport.reportWithRetirement', 'The damage report has been created and the equipment has been retired.')
          : t('inventory.damageReport.reportSubmitted', 'The damage report has been created successfully.'),
      });
      resetDamageReportDialog();
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('inventory.toast.damageReportError', 'Failed to create damage report'),
        variant: "destructive",
      });
    },
  });

  const resetDamageReportDialog = () => {
    setShowDamageReportDialog(false);
    setDamageReportStep(1);
    setSelectedDamageCategory("");
    setSelectedDamageItem(null);
    setSelectedDamageSerialEntry(null);
    setSelectedDamageUnitIndex(null);
    setDamageDescription("");
    setDamageLocation("");
    setDamageSeverity("moderate");
    setDiscoveredDate(format(new Date(), "yyyy-MM-dd"));
    setRetireEquipment(false);
    setRetirementReason("");
    setCorrectiveAction("");
    setDamageNotes("");
  };

  // PDF generation for damage reports
  const downloadDamageReportPdf = (report: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Helper function to add multi-line text
    const addMultilineText = (text: string, x: number, currentY: number, maxWidth: number, lineHeight: number = 6): number => {
      const lines = doc.splitTextToSize(text, maxWidth);
      let y = currentY;
      for (const line of lines) {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, x, y);
        y += lineHeight;
      }
      return y;
    };

    // Company branding if active
    let brandingHeight = 0;
    if (currentUser?.whitelabelBrandingActive && currentUser?.companyName) {
      brandingHeight = 5;
    }

    // Header - Orange for damage report
    doc.setFillColor(251, 146, 60); // Orange
    const headerHeight = 35 + brandingHeight;
    doc.rect(0, 0, pageWidth, headerHeight, 'F');

    if (currentUser?.whitelabelBrandingActive && currentUser?.companyName) {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(currentUser.companyName.toUpperCase(), pageWidth / 2, 8, { align: 'center' });
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('EQUIPMENT DAMAGE REPORT', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(report.equipmentRetired ? 'Equipment Retirement Document' : 'Damage Documentation Record', pageWidth / 2, 25 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Equipment Information Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Equipment Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Equipment Type: ${report.equipmentType || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Brand: ${report.equipmentBrand || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Model: ${report.equipmentModel || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    if (report.serialNumber) {
      doc.text(`Serial Number: ${report.serialNumber}`, 20, yPosition);
      yPosition += 6;
    }
    yPosition += 4;

    // Damage Details Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Damage Details', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const discoveredDateStr = report.discoveredDate 
      ? format(new Date(report.discoveredDate), 'MMMM d, yyyy') 
      : 'N/A';
    doc.text(`Date Discovered: ${discoveredDateStr}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Reported By: ${report.reporterName || 'Unknown'}`, 20, yPosition);
    yPosition += 6;
    
    // Severity badge
    const severityColors: Record<string, [number, number, number]> = {
      minor: [34, 197, 94],
      moderate: [251, 191, 36],
      severe: [249, 115, 22],
      critical: [239, 68, 68]
    };
    const severityColor = severityColors[report.damageSeverity] || [100, 100, 100];
    doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Severity: ${report.damageSeverity.toUpperCase()}`, 20, yPosition);
    yPosition += 8;

    // Damage description
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Description of Damage:', 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    yPosition = addMultilineText(report.damageDescription || 'No description provided.', 20, yPosition, pageWidth - 40);
    yPosition += 4;

    if (report.damageLocation) {
      doc.setFont('helvetica', 'bold');
      doc.text('Location on Equipment:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      yPosition = addMultilineText(report.damageLocation, 20, yPosition, pageWidth - 40);
      yPosition += 4;
    }

    if (report.correctiveAction) {
      doc.setFont('helvetica', 'bold');
      doc.text('Corrective Action Taken:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      yPosition = addMultilineText(report.correctiveAction, 20, yPosition, pageWidth - 40);
      yPosition += 4;
    }

    // Retirement Section (if applicable)
    if (report.equipmentRetired) {
      yPosition += 4;
      doc.setFillColor(254, 226, 226); // Light red
      doc.rect(15, yPosition - 5, pageWidth - 30, 30, 'F');
      
      doc.setTextColor(185, 28, 28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('EQUIPMENT RETIRED', 20, yPosition + 3);
      yPosition += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('Reason for Retirement:', 20, yPosition);
      yPosition += 6;
      yPosition = addMultilineText(report.retirementReason || 'No reason provided.', 20, yPosition, pageWidth - 40);
      yPosition += 8;
    }

    if (report.notes) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Additional Notes:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      yPosition = addMultilineText(report.notes, 20, yPosition, pageWidth - 40);
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Equipment Damage Report - Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      doc.text(
        `Generated: ${format(new Date(), 'MMM d, yyyy')}`,
        pageWidth - 20,
        pageHeight - 10,
        { align: 'right' }
      );
    }

    // Save
    const dateStr = report.discoveredDate 
      ? format(new Date(report.discoveredDate), 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd');
    const typeStr = (report.equipmentType || 'equipment').toLowerCase().replace(/\s+/g, '-');
    const filename = `damage-report-${typeStr}-${dateStr}.pdf`;
    doc.save(filename);

    toast({
      title: t('inventory.toast.pdfDownloaded', 'PDF Downloaded'),
      description: t('inventory.damageReport.pdfDownloaded', 'The damage report has been downloaded.'),
    });
  };
  
  // Filter out suspended and terminated employees - they should not appear in inventory
  const activeEmployees = (employeesData?.employees || []).filter((e: any) => 
    !e.suspendedAt && e.connectionStatus !== 'suspended' && !e.terminatedDate
  );
  
  // Helper function to get assignments for an item
  const getItemAssignments = (itemId: string) => {
    return (assignmentsData?.assignments || []).filter((a: GearAssignment) => a.gearItemId === itemId);
  };
  
  // Get available serial numbers (not currently assigned to anyone) for self-assign
  const getAvailableSerialNumbers = () => {
    if (!selfAssignItem) return [];
    // Use serialNumbers directly from the item (backend provides array of unassigned serial strings)
    const serials = selfAssignItem.serialNumbers || [];
    // Get serialEntries for date information (cast to any since backend adds this dynamically)
    const entries = (selfAssignItem as any).serialEntries || [];
    
    // Convert strings to objects, looking up dates from serialEntries
    if (Array.isArray(serials) && serials.length > 0) {
      return serials.map((serialNumber: string) => {
        // Find the matching entry to get dates
        const entry = entries.find((e: any) => e.serialNumber === serialNumber);
        return {
          id: serialNumber,
          serialNumber,
          dateOfManufacture: entry?.dateOfManufacture || null,
          dateInService: entry?.dateInService || null,
          isAssigned: false
        };
      });
    }
    return [];
  };
  
  // Get available serial numbers for manager assign dialog
  const getAvailableSerialNumbersForAssign = () => {
    if (!managingItem) return [];
    // Use serialNumbers directly from the item (backend provides array of unassigned serial strings)
    const serials = managingItem.serialNumbers || [];
    // Get serialEntries for date information (cast to any since backend adds this dynamically)
    const entries = (managingItem as any).serialEntries || [];
    
    // Convert strings to objects, looking up dates from serialEntries
    if (Array.isArray(serials) && serials.length > 0) {
      return serials.map((serialNumber: string) => {
        // Find the matching entry to get dates
        const entry = entries.find((e: any) => e.serialNumber === serialNumber);
        return {
          id: serialNumber,
          serialNumber,
          dateOfManufacture: entry?.dateOfManufacture || null,
          dateInService: entry?.dateInService || null,
          isAssigned: false
        };
      });
    }
    return [];
  };
  
  // Helper function to get available slots for an item
  // Available slots = total quantity - assigned quantity (regardless of serial registration)
  const getAvailableQuantity = (item: any) => {
    // Backend now provides availableQuantity as slots-based (quantity - assigned)
    if (typeof item.availableQuantity === 'number') {
      return item.availableQuantity;
    }
    // Fallback calculation
    const totalQuantity = Number(item.quantity) || 0;
    const assignedQuantity = Number(item.assignedQuantity) || 0;
    return Math.max(0, totalQuantity - assignedQuantity);
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

  // Get catalog for current equipment type (must be after form is defined)
  const getCurrentCatalog = () => {
    const equipType = form.watch("equipmentType");
    switch (equipType) {
      case "Descender": return descenderCatalog?.items || [];
      case "Harness": return harnessCatalog?.items || [];
      case "Rope": return ropeCatalog?.items || [];
      case "Carabiner - Steel": return steelCarabinerCatalog?.items || [];
      case "Carabiner - Aluminum": return aluminumCarabinerCatalog?.items || [];
      case "Ascender": return ascenderCatalog?.items || [];
      case "Helmet": return helmetCatalog?.items || [];
      case "Gloves": return glovesCatalog?.items || [];
      case "Work positioning device": return workPositioningCatalog?.items || [];
      case "Squeegee rubbers": return squeegeeCatalog?.items || [];
      case "Applicators": return applicatorsCatalog?.items || [];
      case "Suction cup": return suctionCupCatalog?.items || [];
      case "Back up device": return backupDeviceCatalog?.items || [];
      case "Lanyard": return lanyardCatalog?.items || [];
      case "Shock absorber": return shockAbsorberCatalog?.items || [];
      default: return [];
    }
  };

  // Check if current equipment type has catalog support
  const watchedEquipmentType = form.watch("equipmentType");
  const hasCatalogSupport = CATALOG_SUPPORTED_TYPES.includes(watchedEquipmentType || "");

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
              title: t('inventory.toast.addAndAssignSuccess', 'Item Added & Assigned'),
              description: t('inventory.toast.addAndAssignDescription', 'The gear item has been added and assigned to employee.'),
            });
          } catch (error) {
            toast({
              title: t('inventory.toast.addSuccess', 'Item Added'),
              description: t('inventory.toast.addButAssignFailed', 'Item added but assignment failed. You can assign it manually.'),
              variant: "destructive",
            });
          }
        }
      } else {
        toast({
          title: t('inventory.toast.addSuccess', 'Item Added'),
          description: t('inventory.toast.addDescription', 'The gear item has been added to inventory.'),
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
      // Reset descender picker state
      setSelectedCatalogItem(null);
      setShowOtherDescender(false);
      setCustomBrand("");
      setCustomModel("");
      setCatalogSearch("");
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('inventory.toast.addError', 'Failed to add item'),
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
        title: t('inventory.toast.updateSuccess', 'Item Updated'),
        description: t('inventory.toast.updateDescription', 'The gear item has been updated.'),
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
        title: t('common.error', 'Error'),
        description: error.message || t('inventory.toast.updateError', 'Failed to update item'),
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
        title: t('inventory.toast.deleteSuccess', 'Item Deleted'),
        description: t('inventory.toast.deleteDescription', 'The gear item has been removed from inventory.'),
      });
      setShowDeleteDialog(false);
      setItemToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('inventory.toast.deleteError', 'Failed to delete item'),
        variant: "destructive",
      });
    },
  });

  // Retire gear serial number mutation
  const retireGearMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      return apiRequest("PATCH", `/api/gear-serial-numbers/${id}/retire`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/retired-gear"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gear-assignments"] });
      toast({
        title: t('inventory.toast.retireSuccess', 'Item Retired'),
        description: t('inventory.toast.retireDescription', 'The gear item has been retired and removed from active inventory.'),
      });
      setShowRetireDialog(false);
      setSerialToRetire(null);
      setRetireReason("");
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('inventory.toast.retireError', 'Failed to retire item'),
        variant: "destructive",
      });
    },
  });

  const handleAddItem = async (data: Partial<InsertGearItem>) => {
    // If adding custom gear for a catalog-supported type, save it to the shared catalog first
    const equipType = data.equipmentType || "";
    if (CATALOG_SUPPORTED_TYPES.includes(equipType) && showOtherDescender && data.brand && data.model) {
      try {
        await apiRequest("POST", "/api/equipment-catalog", {
          equipmentType: equipType,
          brand: data.brand,
          model: data.model,
        });
        // Invalidate catalog cache so new item appears next time
        queryClient.invalidateQueries({ queryKey: ["/api/equipment-catalog"] });
      } catch (err) {
        console.log("Item added to catalog or already exists");
      }
    }
    
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
    mutationFn: async (data: { 
      gearItemId: string; 
      employeeId: string; 
      quantity: number;
      serialNumber?: string;
      dateOfManufacture?: string;
      dateInService?: string;
    }) => {
      return apiRequest("POST", "/api/gear-assignments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gear"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items", managingItem?.id, "serial-numbers"] });
      toast({
        title: t('inventory.toast.assignSuccess', 'Gear Assigned'),
        description: t('inventory.toast.assignDescription', 'Gear has been assigned to the employee.'),
      });
      setAssignEmployeeId("");
      setAssignQuantity("1");
      setAssignSerialNumber("");
      setAssignDateOfManufacture("");
      setAssignDateInService("");
      setAssignSerialMode("pick");
      setSelectedAssignSerialEntry(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('inventory.toast.assignError', 'Failed to assign gear'),
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
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      toast({
        title: t('inventory.toast.unassignSuccess', 'Assignment Removed'),
        description: t('inventory.toast.unassignDescription', 'Gear assignment has been removed.'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('inventory.toast.unassignError', 'Failed to remove assignment'),
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
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      toast({
        title: t('inventory.toast.assignmentUpdated', 'Assignment Updated'),
        description: t('inventory.toast.assignmentUpdatedDescription', 'Gear assignment has been updated.'),
      });
      setShowEditAssignmentDialog(false);
      setEditingAssignment(null);
      setEditAssignmentSerialNumber("");
      setEditAssignmentDateOfManufacture("");
      setEditAssignmentDateInService("");
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('inventory.toast.assignmentUpdateError', 'Failed to update assignment'),
        variant: "destructive",
      });
    },
  });

  // Self-assign gear mutation - allows any employee to assign gear to themselves
  const selfAssignMutation = useMutation({
    mutationFn: async (data: { 
      gearItemId: string; 
      quantity: number;
      serialNumber?: string;
      dateOfManufacture?: string;
      dateInService?: string;
    }) => {
      return apiRequest("POST", "/api/gear-assignments/self", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gear"] });
      toast({
        title: t('inventory.toast.selfAssignSuccess', 'Gear Added'),
        description: t('inventory.toast.selfAssignDescription', 'Gear has been added to your equipment.'),
      });
      setShowSelfAssignDialog(false);
      setSelfAssignItem(null);
      setSelfAssignQuantity("1");
      setSelfAssignSearch("");
      setSelfAssignSerialNumber("");
      setSelfAssignDateOfManufacture("");
      setSelfAssignDateInService("");
      setSelfAssignSerialMode("pick");
      setSelectedSerialEntry(null);
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('inventory.toast.selfAssignError', 'Failed to add gear'),
        variant: "destructive",
      });
    },
  });

  // Remove self-assigned gear mutation
  const removeSelfAssignedMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      return apiRequest("DELETE", `/api/gear-assignments/self/${assignmentId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      toast({
        title: t('inventory.toast.gearRemoved', 'Gear Removed'),
        description: t('inventory.toast.gearRemovedDescription', 'Gear has been removed from your equipment.'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('inventory.toast.gearRemoveError', 'Failed to remove gear'),
        variant: "destructive",
      });
    },
  });

  // Edit my own gear assignment mutation
  const editMyGearMutation = useMutation({
    mutationFn: async (data: { 
      assignmentId: string;
      serialNumber?: string;
      dateOfManufacture?: string;
      dateInService?: string;
    }) => {
      return apiRequest("PATCH", `/api/gear-assignments/self/${data.assignmentId}`, {
        serialNumber: data.serialNumber,
        dateOfManufacture: data.dateOfManufacture,
        dateInService: data.dateInService,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      toast({
        title: t('inventory.toast.gearUpdated', 'Gear Updated'),
        description: t('inventory.toast.gearUpdatedDescription', 'Your gear details have been updated.'),
      });
      setShowEditMyGearDialog(false);
      setEditingMyAssignment(null);
      setEditMySerialNumber("");
      setEditMyDateOfManufacture("");
      setEditMyDateInService("");
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('inventory.toast.gearUpdateError', 'Failed to update gear details'),
        variant: "destructive",
      });
    },
  });

  const handleAddSerialNumber = () => {
    const quantity = form.getValues("quantity");
    const maxSerials = quantity !== undefined ? quantity : 1;
    
    if (!currentSerialNumber.trim()) {
      toast({
        title: t('inventory.validation.emptySerialNumber', 'Empty Serial Number'),
        description: t('inventory.validation.enterSerialNumber', 'Please enter a serial number before adding.'),
        variant: "destructive",
      });
      return;
    }
    
    // Check for duplicate serial number
    if (serialEntries.some(entry => entry.serialNumber === currentSerialNumber.trim())) {
      toast({
        title: t('inventory.validation.duplicateSerialNumber', 'Duplicate Serial Number'),
        description: t('inventory.validation.serialAlreadyAdded', 'This serial number has already been added.'),
        variant: "destructive",
      });
      return;
    }
    
    if (maxSerials === 0) {
      toast({
        title: t('inventory.validation.noStock', 'No Stock'),
        description: t('inventory.validation.quantityZero', 'Quantity is 0. Cannot add serial numbers.'),
        variant: "destructive",
      });
      return;
    }
    
    if (serialEntries.length >= maxSerials) {
      toast({
        title: t('inventory.validation.limitReached', 'Limit Reached'),
        description: t('inventory.validation.maxSerialNumbers', 'Cannot add more than {{max}} serial numbers.', { max: maxSerials }),
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
      title: t('inventory.toast.serialAdded', 'Item Added'),
      description: t('inventory.toast.serialAddedDescription', 'Added: {{serial}}. Enter another or save.', { serial: currentSerialNumber.trim() }),
    });
  };

  const removeSerialEntry = (index: number) => {
    setSerialEntries(serialEntries.filter((_, i) => i !== index));
  };

  const openAddDialog = () => {
    // Guard: Only users with manage_inventory permission can add items
    if (!canManageInventory(currentUser)) {
      toast({
        title: t('common.accessDenied', 'Access Denied'),
        description: t('inventory.permissions.noManageInventory', "You don't have permission to manage inventory"),
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
      itemSuffix: "",
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
        title: t('common.accessDenied', 'Access Denied'),
        description: t('inventory.permissions.noManageInventory', "You don't have permission to manage inventory"),
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
      itemSuffix: item.itemSuffix || undefined,
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

  const openAssignDialog = (item: any) => {
    // All employees can self-assign gear (for "My Kit" functionality)
    // The assign dialog will restrict to self-only if user doesn't have assign_gear permission
    
    setManagingItem(item);
    // Auto-fill with current user's ID - employees can only assign to themselves by default
    setAssignEmployeeId(currentUser?.id || "");
    setAssignQuantity("1");
    setAssignSerialNumber("");
    setAssignDateOfManufacture("");
    setAssignDateInService("");
    setAssignSerialMode("pick");
    setSelectedAssignSerialEntry(null);
    setShowAssignDialog(true);
  };
  
  // Check if user can assign gear to other employees (requires assign_gear permission)
  // Users without this permission can still self-assign gear
  const canAssignToOthers = canAssignGear(currentUser);

  const handleAssignGear = () => {
    if (!managingItem || !assignEmployeeId) {
      toast({
        title: t('common.validationError', 'Validation Error'),
        description: t('inventory.validation.selectEmployee', 'Please select an employee'),
        variant: "destructive",
      });
      return;
    }

    const quantity = parseInt(assignQuantity) || 0;
    if (quantity <= 0) {
      toast({
        title: t('common.validationError', 'Validation Error'),
        description: t('inventory.validation.quantityGreaterThanZero', 'Quantity must be greater than 0'),
        variant: "destructive",
      });
      return;
    }

    const available = getAvailableQuantity(managingItem);
    if (quantity > available) {
      toast({
        title: t('common.validationError', 'Validation Error'),
        description: t('inventory.validation.onlyAvailable', 'Only {{count}} items available', { count: available }),
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

  // Helper function to calculate item value - handles ropes (length × pricePerFeet) and other items (itemPrice × quantity)
  const calculateItemValue = (item: any): number => {
    if (item.equipmentType === "Rope" && item.ropeLength && item.pricePerFeet) {
      // For ropes: value = length × price per foot × quantity
      const length = parseFloat(item.ropeLength || "0");
      const pricePerFoot = parseFloat(item.pricePerFeet || "0");
      const qty = item.quantity || 1;
      return length * pricePerFoot * qty;
    } else {
      // For other items: value = itemPrice × quantity
      const price = parseFloat(item.itemPrice || "0");
      const qty = item.quantity || 1;
      return price * qty;
    }
  };

  const totalMyItems = myGear.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  const totalMyValue = myGear.reduce((sum: number, item: any) => sum + calculateItemValue(item), 0);

  // Calculate total value of ALL inventory items
  const totalAllItems = allGearItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  const totalAllValue = allGearItems.reduce((sum: number, item: any) => sum + calculateItemValue(item), 0);

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
      // Use workDate field (YYYY-MM-DD string) or fall back to startTime
      const sessionDateStr = session.workDate || (session.startTime ? format(new Date(session.startTime), 'yyyy-MM-dd') : null);
      if (!sessionDateStr) return false;
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
        // Use workDate field or fall back to startTime
        const dateValue = session.workDate || session.startTime;
        if (!dateValue) return earliest;
        const sessionDate = new Date(dateValue);
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

  // Helper to normalize date to YYYY-MM-DD string using timezone-safe parsing
  const normalizeDateStr = (date: any): string => {
    if (!date) return '';
    if (typeof date === 'string') {
      // If already YYYY-MM-DD format, return as-is
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
      // Use timezone-safe parsing for ISO strings
      const parsed = parseLocalDate(date);
      if (!parsed || isNaN(parsed.getTime())) return '';
      return toLocalDateString(parsed);
    }
    return toLocalDateString(date);
  };

  // Helper function to calculate rating for a specific number of days
  // Per-work-day compliance: every day an employee works, they need an inspection
  const calculateRatingForDays = (daysCount: number) => {
    const today = new Date();
    const days: Date[] = [];
    for (let i = 0; i < daysCount; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }

    // Count total work-days and compliant work-days
    let totalWorkDays = 0;
    let compliantWorkDays = 0;

    days.forEach((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Find all employees who worked on this day
      const employeesWhoWorkedThisDay = new Set<string>();
      allSessions.forEach((session: any) => {
        if (!session.employeeId) return;
        // Use workDate field (YYYY-MM-DD string) or fall back to startTime
        const sessionDateStr = session.workDate || normalizeDateStr(session.startTime);
        if (sessionDateStr === dateStr) {
          employeesWhoWorkedThisDay.add(session.employeeId);
        }
      });

      // For each employee who worked this day, check if they have an inspection for this day
      employeesWhoWorkedThisDay.forEach((workerId) => {
        // Find any inspection for this worker on this day
        const inspection = harnessInspections.find((insp: any) => {
          if (insp.workerId !== workerId) return false;
          const inspDateStr = normalizeDateStr(insp.inspectionDate);
          return inspDateStr === dateStr;
        });
        
        // If inspection is N/A, skip this work-day entirely (no harness used)
        if (inspection?.overallStatus === "not_applicable") {
          return;
        }
        
        // Count this as a required work-day
        totalWorkDays++;
        
        // Check if they have any inspection submitted (matches the green checkmark logic in the grid)
        // An inspection is considered compliant if it exists and is not N/A
        if (inspection) {
          compliantWorkDays++;
        }
      });
    });

    // If no work days required inspections, compliance is 100% (nothing to miss)
    if (totalWorkDays === 0) return 100;
    return Math.round((compliantWorkDays / totalWorkDays) * 100);
  };

  // Calculate company safety rating based on filter
  const companySafetyRating = useMemo(() => {
    if (inspectionFilter === "combined") {
      // Calculate average of week, month, and all-time ratings
      const weekRating = calculateRatingForDays(7);
      const monthRating = calculateRatingForDays(30);
      
      // Calculate all-time rating
      const earliestSession = allSessions.reduce((earliest: Date | null, session: any) => {
        // Use workDate field or fall back to startTime
        const dateValue = session.workDate || session.startTime;
        if (!dateValue) return earliest;
        const sessionDate = new Date(dateValue);
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
    // Per-work-day compliance: every day an employee works, they need an inspection
    
    // Count total work-days and compliant work-days
    let totalWorkDays = 0;
    let compliantWorkDays = 0;

    inspectionDays.forEach((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Find all employees who worked on this day
      const employeesWhoWorkedThisDay = new Set<string>();
      allSessions.forEach((session: any) => {
        if (!session.employeeId) return;
        // Use workDate field (YYYY-MM-DD string) or fall back to startTime
        const sessionDateStr = session.workDate || normalizeDateStr(session.startTime);
        if (sessionDateStr === dateStr) {
          employeesWhoWorkedThisDay.add(session.employeeId);
        }
      });

      // For each employee who worked this day, check if they have an inspection for this day
      employeesWhoWorkedThisDay.forEach((workerId) => {
        // Find any inspection for this worker on this day
        const inspection = harnessInspections.find((insp: any) => {
          if (insp.workerId !== workerId) return false;
          const inspDateStr = normalizeDateStr(insp.inspectionDate);
          return inspDateStr === dateStr;
        });
        
        // If inspection is N/A, skip this work-day entirely (no harness used)
        if (inspection?.overallStatus === "not_applicable") {
          return;
        }
        
        // Count this as a required work-day
        totalWorkDays++;
        
        // Check if they have any inspection submitted (matches the green checkmark logic in the grid)
        // An inspection is considered compliant if it exists and is not N/A
        if (inspection) {
          compliantWorkDays++;
        }
      });
    });

    console.log('Final counts - totalWorkDays:', totalWorkDays, 'compliantWorkDays:', compliantWorkDays);
    console.log('=== END DEBUG ===');

    // If no work days required inspections, compliance is 100% (nothing to miss)
    // This ensures new accounts/employees start at 100% and only lose points for missed inspections
    if (totalWorkDays === 0) return 100;
    return Math.round((compliantWorkDays / totalWorkDays) * 100);
  }, [inspectionFilter, inspectionDays, allSessions, harnessInspections]);

  // Use default header config to show consistent unified header with search bar
  useSetHeaderConfig({}, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap w-full mb-4 h-auto gap-1 p-1">
            <TabsTrigger value="my-gear" className="flex-1 min-w-fit" data-testid="tab-my-gear">{t('inventory.tabs.myGear', 'My Gear')}</TabsTrigger>
            {canViewGearAssignments(currentUser) && (
              <TabsTrigger value="team-gear" className="flex-1 min-w-fit" data-testid="tab-team-gear">
                <Users className="h-4 w-4 mr-1" />
                {t('inventory.tabs.teamGear', 'Team Gear')}
              </TabsTrigger>
            )}
            {canManageInventory(currentUser) && (
              <TabsTrigger value="manage" className="flex-1 min-w-fit" data-testid="tab-manage-gear">{t('inventory.tabs.manageGear', 'Manage Gear')}</TabsTrigger>
            )}
            {canManageInventory(currentUser) && (
              <TabsTrigger value="retired" className="flex-1 min-w-fit" data-testid="tab-retired-gear">
                <span className="material-icons text-sm mr-1">archive</span>
                {t('inventory.tabs.retiredGear', 'Retired')}
              </TabsTrigger>
            )}
            <TabsTrigger value="inspections" className="flex-1 min-w-fit" data-testid="tab-inspections">{t('inventory.tabs.inspections', 'Inspections')}</TabsTrigger>
            <TabsTrigger value="daily-harness" className="flex-1 min-w-fit" data-testid="tab-daily-harness">
              {t('inventory.tabs.dailyHarnessInspection', 'Daily Harness Inspection')}
            </TabsTrigger>
            <TabsTrigger value="report-damage" className="flex-1 min-w-fit" data-testid="tab-report-damage">
              {t('inventory.tabs.reportDamage', 'Report Damage')}
            </TabsTrigger>
          </TabsList>

          {/* My Gear Tab */}
          <TabsContent value="my-gear" className="space-y-4">
            {/* Header with Add Gear Button */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{t('inventory.myEquipment', 'My Equipment')}</h2>
                <p className="text-sm text-muted-foreground">{t('inventory.equipmentAssignedToYou', 'Equipment assigned to you')}</p>
              </div>
              <Button
                onClick={() => setShowSelfAssignDialog(true)}
                data-testid="button-add-my-gear"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('inventory.addGear', 'Add Gear')}
              </Button>
            </div>

            {/* Helpful Banner - only show for users who can manage inventory */}
            {canManageInventory(currentUser) && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="material-icons text-primary text-2xl">info</span>
                      <div>
                        <div className="font-semibold">{t('inventory.wantToAddNew', 'Want to add new items to company inventory?')}</div>
                        <p className="text-sm text-muted-foreground">
                          {t('inventory.switchToManageGear', 'Switch to the "Manage Gear" tab to add new inventory items')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("manage")}
                      data-testid="button-go-to-manage"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('inventory.goToManageGear', 'Go to Manage Gear')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {myGear.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <span className="material-icons text-5xl text-muted-foreground">inventory_2</span>
                    <div>
                      <div className="font-semibold text-lg">{t('inventory.empty.myGear', 'No Gear Assigned')}</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('inventory.empty.myGearDescription', "You don't have any equipment assigned yet. Add gear from the company inventory.")}
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowSelfAssignDialog(true)}
                      data-testid="button-add-gear-empty"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('inventory.addFromInventory', 'Add Gear from Inventory')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myGear.map((item: any) => {
                  const myAssignment = getItemAssignments(item.id).find(a => a.employeeId === currentUser?.id);
                  return (
                  <Card 
                    key={item.id} 
                    className="overflow-visible cursor-pointer hover-elevate"
                    onClick={() => {
                      setSelectedDetailItem(item);
                      setDetailDialogSource("myGear");
                      setShowItemDetailDialog(true);
                    }}
                    data-testid={`mygear-item-${item.id}`}
                  >
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
                                {item.equipmentType}{item.itemSuffix ? ` ${item.itemSuffix}` : ''}
                                {item.inService === false && (
                                  <Badge variant="destructive" className="text-xs">
                                    {t('inventory.outOfService', 'Out of Service')}
                                  </Badge>
                                )}
                              </div>
                              {(item.brand || item.model) && (
                                <div className="text-sm text-muted-foreground mt-0.5">
                                  {[item.brand, item.model].filter(Boolean).join(" - ")}
                                </div>
                              )}
                            </div>
                            {/* Edit and Remove buttons */}
                            {myAssignment && (
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingMyAssignment({ ...myAssignment, gearItem: item });
                                    setEditMySerialNumber(myAssignment.serialNumber || "");
                                    setEditMyDateOfManufacture(myAssignment.dateOfManufacture || "");
                                    setEditMyDateInService(myAssignment.dateInService || "");
                                    setShowEditMyGearDialog(true);
                                  }}
                                  data-testid={`button-edit-gear-${item.id}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSelfAssignedMutation.mutate(myAssignment.id);
                                  }}
                                  disabled={removeSelfAssignedMutation.isPending}
                                  data-testid={`button-remove-gear-${item.id}`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Serial Number - prominent display */}
                          {myAssignment?.serialNumber ? (
                            <div className="mb-3 flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="font-mono text-sm px-3 py-1">
                                S/N: {myAssignment.serialNumber}
                              </Badge>
                              {/* Service duration badge */}
                              {getServiceDuration(myAssignment.dateInService) && (
                                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                  <span className="material-icons text-xs mr-1">schedule</span>
                                  {getServiceDuration(myAssignment.dateInService)} in service
                                </Badge>
                              )}
                              {/* Retire button for serial number */}
                              {(() => {
                                const serialEntry = ((item as any).serialEntries || []).find(
                                  (se: GearSerialNumber) => se.serialNumber === myAssignment.serialNumber
                                );
                                if (serialEntry) {
                                  return (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 px-2 text-xs text-muted-foreground"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSerialToRetire(serialEntry);
                                        setShowRetireDialog(true);
                                      }}
                                      title={t('inventory.retireItem', 'Retire this item')}
                                      data-testid={`button-retire-mygear-${serialEntry.id}`}
                                    >
                                      <span className="material-icons text-sm mr-1">archive</span>
                                      {t('inventory.retire', 'Retire')}
                                    </Button>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          ) : (
                            <div className="mb-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingMyAssignment({ ...myAssignment, gearItem: item });
                                  setEditMySerialNumber("");
                                  setEditMyDateOfManufacture("");
                                  setEditMyDateInService("");
                                  setShowEditMyGearDialog(true);
                                }}
                                className="text-xs"
                                data-testid={`button-add-details-${item.id}`}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                {t('inventory.addSerialAndDates', 'Add Serial Number & Dates')}
                              </Button>
                            </div>
                          )}

                          {/* Details Grid - from assignment data */}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {myAssignment?.dateOfManufacture && (
                              <div>
                                <span className="text-muted-foreground">{t('inventory.dateOfManufacture', 'Date of Manufacture')}:</span>
                                <div className="font-medium mt-0.5">
                                  {formatLocalDate(myAssignment.dateOfManufacture)}
                                </div>
                              </div>
                            )}
                            {myAssignment?.dateInService && (
                              <div>
                                <span className="text-muted-foreground">{t('inventory.dateInService', 'Date In Service')}:</span>
                                <div className="font-medium mt-0.5">
                                  {formatLocalDate(myAssignment.dateInService)}
                                </div>
                              </div>
                            )}
                            {myAssignment?.quantity && myAssignment.quantity > 1 && (
                              <div>
                                <span className="text-muted-foreground">{t('inventory.quantity', 'Quantity')}:</span>
                                <div className="font-medium mt-0.5">
                                  {myAssignment.quantity}
                                </div>
                              </div>
                            )}
                            {item.dateOutOfService && (
                              <div>
                                <span className="text-muted-foreground">{t('inventory.outOfServiceDate', 'Out of Service')}:</span>
                                <div className="font-medium mt-0.5">
                                  {formatLocalDate(item.dateOutOfService)}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Notes */}
                          {item.notes && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="text-xs text-muted-foreground mb-1">{t('inventory.notes', 'Notes')}:</div>
                              <div className="text-sm">{item.notes}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
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
                      <div className="font-semibold">{t('inventory.teamEquipmentOverview', 'Team Equipment Overview')}</div>
                      <p className="text-sm text-muted-foreground">
                        {t('inventory.teamEquipmentDescription', 'View and manage gear assigned to all employees')}
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
                        <div className="font-semibold text-lg">{t('inventory.noEmployees', 'No Employees')}</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('inventory.noEmployeesDescription', 'No employees found to display gear assignments.')}
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
                                <div className="text-sm text-muted-foreground">{employee.role || t('common.employee', 'Employee')}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={employeeAssignments.length > 0 ? "default" : "secondary"}>
                                {totalAssignedItems} {totalAssignedItems === 1 ? t('inventory.item', 'item') : t('inventory.items', 'items')}
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
                                  <p className="text-sm">{t('inventory.noGearAssignedToEmployee', 'No gear assigned to this employee')}</p>
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
                                                  {t('inventory.mfg', 'Mfg')}: {formatLocalDate(assignment.dateOfManufacture)}
                                                </span>
                                              )}
                                              {assignment.dateInService && (
                                                <span className="text-xs text-muted-foreground">
                                                  {t('inventory.inService', 'In Service')}: {formatLocalDate(assignment.dateInService)}
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
                                  {t('inventory.assignGearTo', 'Assign Gear to {{name}}', { name: employee.name })}
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <span className="material-icons text-lg">inventory_2</span>
                        {t('inventory.totalItems', 'Total Items')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{totalAllItems}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('inventory.itemsInInventory', 'Items in inventory')}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <span className="material-icons text-lg">attach_money</span>
                        {t('inventory.totalValue', 'Total Value')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">${totalAllValue.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('inventory.allInventoryValue', 'All inventory value')}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover-elevate cursor-pointer" onClick={() => setShowFieldValueBreakdown(!showFieldValueBreakdown)} data-testid="card-field-value">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {t('inventory.fieldValue', 'Value in Field')}
                        {showFieldValueBreakdown ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">${(fieldValueData?.totalFieldValue ?? 0).toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('inventory.fieldValueDescription', '{{count}} items with crew', { count: fieldValueData?.totalItemCount ?? 0 })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {showFieldValueBreakdown && fieldValueData?.employeeBreakdown && fieldValueData.employeeBreakdown.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {t('inventory.fieldValueByEmployee', 'Field Value by Employee')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {fieldValueData.employeeBreakdown.map((emp) => (
                          <div key={emp.employeeId} className="flex items-center justify-between py-2 border-b last:border-b-0">
                            <div>
                              <span className="font-medium">{emp.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({emp.itemCount} {emp.itemCount === 1 ? t('inventory.item', 'item') : t('inventory.items', 'items')})
                              </span>
                            </div>
                            <span className="font-semibold text-primary">${emp.value.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
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
                    <CardTitle>{t('inventory.addInventoryItem', 'Add Inventory Item')}</CardTitle>
                    <CardDescription>{t('inventory.addInventoryDescription', 'Add new gear to the inventory system')}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('inventory.searchInventory', 'Search by brand, model, or type...')}
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="pl-10"
                data-testid="input-inventory-search"
              />
              {inventorySearch && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setInventorySearch("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* View Inventory Section - Grouped by Equipment Type */}
            {isLoading ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">{t('inventory.loading', 'Loading inventory...')}</div>
                </CardContent>
              </Card>
            ) : !gearData?.items || gearData.items.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    {t('inventory.empty.manageGear', 'No items in inventory yet. Click "Add Item to Inventory" to get started.')}
                  </div>
                </CardContent>
              </Card>
            ) : (() => {
              // Filter items based on search
              const searchLower = inventorySearch.toLowerCase();
              const filteredItems = inventorySearch 
                ? gearData.items.filter(item => 
                    (item.brand?.toLowerCase().includes(searchLower)) ||
                    (item.model?.toLowerCase().includes(searchLower)) ||
                    (item.equipmentType?.toLowerCase().includes(searchLower)) ||
                    (item.notes?.toLowerCase().includes(searchLower))
                  )
                : gearData.items;

              if (filteredItems.length === 0) {
                return (
                  <Card>
                    <CardContent className="py-8">
                      <div className="text-center text-muted-foreground">
                        {t('inventory.noSearchResults', 'No items match your search.')}
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              // Group filtered items by equipment type
              const grouped = filteredItems.reduce((groups: Record<string, typeof gearData.items>, item) => {
                const type = item.equipmentType || "Other";
                if (!groups[type]) groups[type] = [];
                groups[type].push(item);
                return groups;
              }, {});

              return (
                <div className="space-y-2">
                  {Object.entries(grouped)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([equipmentType, items]) => {
                      const typeIcon = EQUIPMENT_ICONS[equipmentType] || "build";
                      const totalQty = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
                      const typeValue = items.reduce((sum, item) => sum + calculateItemValue(item), 0);
                      const isExpanded = expandedSections[equipmentType] ?? true;
                      
                      return (
                        <Collapsible 
                          key={equipmentType} 
                          open={isExpanded}
                          onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, [equipmentType]: open }))}
                        >
                          <Card>
                            <CollapsibleTrigger asChild>
                              <CardHeader className="pb-3 cursor-pointer hover-elevate">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                      <span className="material-icons text-primary">{typeIcon}</span>
                                    </div>
                                    <div>
                                      <CardTitle className="text-lg">{equipmentType}</CardTitle>
                                      <CardDescription>
                                        {totalQty} {totalQty === 1 ? t('inventory.item', 'item') : t('inventory.items', 'items')}
                                        {canViewFinancials && typeValue > 0 && (
                                          <span className="ml-2 text-primary font-medium">
                                            • ${typeValue.toFixed(2)}
                                          </span>
                                        )}
                                      </CardDescription>
                                    </div>
                                  </div>
                                  {isExpanded ? (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                              </CardHeader>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <CardContent className="pt-0">
                                <div className="space-y-2">
                                  {items.map((item) => (
                  <Card 
                    key={item.id} 
                    className="bg-muted/30 cursor-pointer hover-elevate" 
                    data-testid={`item-${item.id}`}
                    onClick={() => {
                      setSelectedDetailItem(item);
                      setDetailDialogSource("manageGear");
                      setShowItemDetailDialog(true);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                          <div>
                            <div className="font-semibold mb-1">{item.equipmentType || "Gear Item"}{item.itemSuffix ? ` ${item.itemSuffix}` : ''}</div>
                            {item.brand && (
                              <div className="text-sm text-muted-foreground">{t('inventory.brand', 'Brand')}: {item.brand}</div>
                            )}
                            {item.model && (
                              <div className="text-sm text-muted-foreground">{t('inventory.model', 'Model')}: {item.model}</div>
                            )}
                            <div className="text-sm font-medium text-foreground mt-1">
                              {t('inventory.quantity', 'Quantity')}: {item.quantity || 1}
                            </div>
                            {(item as any).serialEntries && (item as any).serialEntries.length > 0 && (
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="font-medium">{t('inventory.serialNumbers', 'Serial Numbers')}:</div>
                                {(item as any).serialEntries.map((entry: GearSerialNumber) => (
                                  <div key={entry.id} className="flex items-center justify-between pl-2 group">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span>• {entry.serialNumber}</span>
                                      {getServiceDuration(entry.dateInService) && (
                                        <span className="text-xs text-primary">
                                          ({getServiceDuration(entry.dateInService)})
                                        </span>
                                      )}
                                    </div>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSerialToRetire(entry);
                                        setShowRetireDialog(true);
                                      }}
                                      title={t('inventory.retireItem', 'Retire this item')}
                                      data-testid={`button-retire-${entry.id}`}
                                    >
                                      <span className="material-icons text-sm text-muted-foreground">archive</span>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="text-sm mt-2">
                              <div className="font-medium text-foreground">
                                {t('inventory.available', 'Available')}: {getAvailableQuantity(item)} / {item.quantity || 0}
                              </div>
                              {getItemAssignments(item.id).length > 0 && (
                                <div className="mt-1 space-y-1">
                                  <div className="text-xs text-muted-foreground">{t('inventory.assigned', 'Assigned')}:</div>
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
                            {canViewFinancials && (item.itemPrice || (item.equipmentType === "Rope" && item.ropeLength && item.pricePerFeet)) && (
                              <div className="space-y-0.5 mb-1">
                                {item.equipmentType === "Rope" && item.ropeLength && item.pricePerFeet ? (
                                  <>
                                    <div className="text-xs text-muted-foreground">
                                      {item.ropeLength}ft @ ${parseFloat(item.pricePerFeet).toFixed(2)}/ft
                                    </div>
                                    <div className="text-sm font-semibold text-primary">
                                      Value: ${(parseFloat(item.ropeLength) * parseFloat(item.pricePerFeet) * (item.quantity || 1)).toFixed(2)}
                                    </div>
                                  </>
                                ) : item.itemPrice ? (
                                  <>
                                    <div className="text-sm font-semibold text-primary">
                                      ${parseFloat(item.itemPrice).toFixed(2)} each
                                    </div>
                                    {item.quantity && item.quantity > 1 && (
                                      <div className="text-sm font-medium text-primary/80">
                                        Total: ${(parseFloat(item.itemPrice) * item.quantity).toFixed(2)}
                                      </div>
                                    )}
                                  </>
                                ) : null}
                              </div>
                            )}
                            {item.notes && (
                              <div className="text-sm text-muted-foreground">
                                {t('inventory.notes', 'Notes')}: {item.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
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
                              </CardContent>
                            </CollapsibleContent>
                          </Card>
                        </Collapsible>
                      );
                    })}
                </div>
              );
            })()}
          </TabsContent>
          )}

          {/* Retired Gear Tab */}
          {canManageInventory(currentUser) && (
          <TabsContent value="retired" className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{t('inventory.retiredGear', 'Retired Gear')}</h2>
                <p className="text-sm text-muted-foreground">{t('inventory.retiredGearDescription', 'Equipment that has been retired from active inventory')}</p>
              </div>
            </div>

            {retiredGearLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : retiredGear.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <span className="material-icons text-4xl text-muted-foreground">archive</span>
                    <h3 className="font-semibold">{t('inventory.noRetiredGear', 'No Retired Gear')}</h3>
                    <p className="text-muted-foreground">
                      {t('inventory.noRetiredGearDescription', 'Retired equipment will appear here. Use the manage gear tab to retire items.')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {retiredGear.map((item: any) => (
                  <Card key={item.id} className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{item.gearItemType || item.gearItemCategory}</span>
                            <Badge variant="secondary" className="text-xs">
                              <span className="material-icons text-xs mr-1">archive</span>
                              {t('inventory.retired', 'Retired')}
                            </Badge>
                          </div>
                          {item.gearItemBrand && (
                            <div className="text-sm text-muted-foreground">{t('inventory.brand', 'Brand')}: {item.gearItemBrand}</div>
                          )}
                          {item.gearItemModel && (
                            <div className="text-sm text-muted-foreground">{t('inventory.model', 'Model')}: {item.gearItemModel}</div>
                          )}
                          <div className="text-sm text-muted-foreground">{t('inventory.serialNumber', 'Serial')}: {item.serialNumber}</div>
                          {item.dateOfManufacture && (
                            <div className="text-sm text-muted-foreground">
                              {t('inventory.mfg', 'Mfg Date')}: {formatLocalDate(item.dateOfManufacture)}
                            </div>
                          )}
                          {item.dateInService && (
                            <div className="text-sm text-muted-foreground">
                              {t('inventory.inServiceDate', 'In Service')}: {formatLocalDate(item.dateInService)}
                            </div>
                          )}
                          <div className="mt-2 p-2 bg-muted rounded-md">
                            <div className="text-sm">
                              <span className="font-medium">{t('inventory.retiredReason', 'Reason')}:</span>{' '}
                              {item.retiredReason}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {t('inventory.retiredOn', 'Retired')}: {item.retiredAt ? formatLocalDate(item.retiredAt) : 'N/A'}
                              {item.retiredByName && ` by ${item.retiredByName}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
                      {t('inventory.harnessInspectionTracking', 'Harness Inspection Tracking')}
                    </CardTitle>
                    <CardDescription>
                      {t('inventory.dailyInspectionsDescription', 'Daily inspections for employees with work sessions')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={inspectionFilter === "week" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInspectionFilter("week")}
                      data-testid="filter-week-inspections"
                    >
                      {t('inventory.filter.week', '7 Days')}
                    </Button>
                    <Button
                      variant={inspectionFilter === "month" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInspectionFilter("month")}
                      data-testid="filter-month-inspections"
                    >
                      {t('inventory.filter.month', '30 Days')}
                    </Button>
                    <Button
                      variant={inspectionFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInspectionFilter("all")}
                      data-testid="filter-all-inspections"
                    >
                      {t('inventory.filter.allTime', 'All Time')}
                    </Button>
                    <Button
                      variant={inspectionFilter === "combined" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInspectionFilter("combined")}
                      data-testid="filter-combined-inspections"
                    >
                      {t('inventory.filter.overall', 'Overall')}
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
                            {t('inventory.companySafetyRating', 'Company Safety Rating')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {inspectionFilter === "week" ? t('inventory.filter.last7Days', 'Last 7 Days') : 
                             inspectionFilter === "month" ? t('inventory.filter.last30Days', 'Last 30 Days') : 
                             inspectionFilter === "all" ? t('inventory.filter.allTime', 'All Time') :
                             t('inventory.filter.combinedOverall', 'Combined Overall (7d + 30d + All)')}
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
                            {t('inventory.inspectionCompliance', 'Inspection Compliance')}
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
                    // Also filter out suspended and terminated employees
                    const allActiveEmployees = (employeesData?.employees || []).filter((emp: any) => 
                      !emp.suspendedAt && emp.connectionStatus !== 'suspended' && !emp.terminatedDate
                    );
                    const visibleEmployees = canViewAllInspections 
                      ? allActiveEmployees
                      : allActiveEmployees.filter((emp: any) => emp.id === currentUser?.id);
                    
                    return (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium text-sm">{t('common.employee', 'Employee')}</th>
                        {inspectionDays.map((date, index) => (
                          <th key={index} className="text-center p-3 font-medium text-sm">
                            <div>{format(date, 'EEE', { locale: getDateLocale() })}</div>
                            <div className="text-xs text-muted-foreground">{format(date, 'MMM d', { locale: getDateLocale() })}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleEmployees.length === 0 ? (
                        <tr>
                          <td colSpan={inspectionDays.length + 1} className="text-center p-8 text-muted-foreground">
                            {t('inventory.noInspectionsFound', 'No inspections found')}
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
                                  {!hadSession ? (
                                    <span className="text-muted-foreground/30" title="No work session">—</span>
                                  ) : isNotApplicable ? (
                                    <span className="text-xs font-medium text-muted-foreground/60" title="Harness not applicable for this session">
                                      N/A
                                    </span>
                                  ) : hasValidInspection ? (
                                    <span className="material-icons text-green-500" title="Inspection submitted">
                                      check_circle
                                    </span>
                                  ) : (
                                    <span className="material-icons text-red-500" title="No inspection submitted - required for work sessions">
                                      cancel
                                    </span>
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

          {/* Report Damage Tab */}
          <TabsContent value="report-damage" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    {t('inventory.equipmentDamageReports', 'Equipment Damage Reports')}
                  </CardTitle>
                  <CardDescription>{t('inventory.damageReportsDescription', 'Report damaged equipment and track repairs or retirements')}</CardDescription>
                </div>
                <Button 
                  onClick={() => setShowDamageReportDialog(true)}
                  data-testid="button-report-damage"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('inventory.reportDamage', 'Report Damage')}
                </Button>
              </CardHeader>
              <CardContent>
                {damageReportsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('inventory.loadingDamageReports', 'Loading damage reports...')}
                  </div>
                ) : (damageReportsData?.reports || []).length === 0 ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="flex flex-col items-center gap-2">
                      <FileWarning className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">{t('inventory.empty.damageReports', 'No damage reports filed yet')}</p>
                      <p className="text-sm text-muted-foreground/70">
                        {t('inventory.empty.damageReportsDescription', 'Use this feature to document any equipment damage and track repairs or retirements')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(damageReportsData?.reports || []).map((report: any) => (
                      <Card key={report.id} className={report.equipmentRetired ? "border-red-200 dark:border-red-900/50" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="space-y-1 flex-1 min-w-[200px]">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold">{report.equipmentType}</span>
                                {report.equipmentBrand && (
                                  <span className="text-muted-foreground">- {report.equipmentBrand}</span>
                                )}
                                {report.equipmentRetired && (
                                  <Badge variant="destructive" className="text-xs">{t('inventory.retired', 'Retired')}</Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {report.serialNumber && <span>S/N: {report.serialNumber}</span>}
                              </div>
                              <div className="text-sm mt-2">
                                <span className="font-medium">{t('inventory.damage', 'Damage')}: </span>
                                {report.damageDescription}
                              </div>
                              {report.damageLocation && (
                                <div className="text-sm text-muted-foreground">
                                  <span className="font-medium">{t('inventory.location', 'Location')}: </span>
                                  {report.damageLocation}
                                </div>
                              )}
                            </div>
                            <div className="text-right space-y-1 min-w-[120px]">
                              <Badge 
                                variant={
                                  report.damageSeverity === "critical" ? "destructive" :
                                  report.damageSeverity === "severe" ? "destructive" :
                                  report.damageSeverity === "moderate" ? "secondary" : "outline"
                                }
                              >
                                {report.damageSeverity}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(report.discoveredDate), "MMM d, yyyy", { locale: getDateLocale() })}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                by {report.reporterName}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadDamageReportPdf(report);
                                }}
                                data-testid={`button-download-damage-report-${report.id}`}
                                className="mt-2"
                              >
                                <FileDown className="h-4 w-4 mr-1" />
                                PDF
                              </Button>
                            </div>
                          </div>
                          {(report.correctiveAction || report.retirementReason) && (
                            <div className="mt-3 pt-3 border-t space-y-1">
                              {report.correctiveAction && (
                                <div className="text-sm">
                                  <span className="font-medium">{t('inventory.correctiveAction', 'Corrective Action')}: </span>
                                  {report.correctiveAction}
                                </div>
                              )}
                              {report.retirementReason && (
                                <div className="text-sm text-red-600 dark:text-red-400">
                                  <span className="font-medium">{t('inventory.retirementReason', 'Retirement Reason')}: </span>
                                  {report.retirementReason}
                                </div>
                              )}
                            </div>
                          )}
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

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent data-testid="dialog-add-item" className="max-w-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{addItemStep === 1 ? t('inventory.dialog.selectItemType', 'Select Item Type') : t('inventory.dialog.addItemDetails', 'Add Item Details')}</DialogTitle>
            <DialogDescription>
              {addItemStep === 1 ? t('inventory.dialog.chooseGearType', "Choose the type of gear you're adding") : t('inventory.dialog.fillItemInfo', 'Fill in the item information')}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddItem)} className="flex flex-col flex-1 min-h-0 space-y-4">
              
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
                      <FormLabel>{t('inventory.customTypeName', 'Custom Type Name')}</FormLabel>
                      <Input
                        placeholder={t('inventory.enterCustomGearType', 'Enter custom gear type')}
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
                      {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (!form.getValues("equipmentType")) {
                          toast({
                            title: t('inventory.validation.typeRequired', 'Type Required'),
                            description: t('inventory.validation.selectGearType', 'Please select a gear type to continue.'),
                            variant: "destructive",
                          });
                          return;
                        }
                        setAddItemStep(2);
                      }}
                      className="flex-1"
                      data-testid="button-continue-step1"
                    >
                      {t('common.continue', 'Continue')}
                    </Button>
                  </div>
                </>
              )}

              {addItemStep === 2 && (
                <>
                  <div className="flex-1 min-h-0 overflow-y-auto px-1 space-y-4">

              {/* Smart Gear Picker - shows list of common gear for supported types */}
              {hasCatalogSupport && !showOtherDescender && (
                <div className="space-y-3">
                  <FormLabel>
                    {t('inventory.selectEquipment', 'Select')} {form.watch("equipmentType")}
                  </FormLabel>
                  <div className="relative">
                    <Input
                      placeholder={t('inventory.searchGear', 'Search by brand or model...')}
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="pr-8"
                      data-testid="input-catalog-search"
                    />
                    {catalogSearch && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                        onClick={() => setCatalogSearch("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-[35vh] overflow-y-auto pr-1">
                    {getCurrentCatalog()
                      .filter((item) => {
                        if (!catalogSearch) return true;
                        const search = catalogSearch.toLowerCase();
                        return item.brand.toLowerCase().includes(search) || 
                               item.model.toLowerCase().includes(search);
                      })
                      .map((item) => {
                        const equipType = form.watch("equipmentType");
                        const IconComponent = equipType === "Harness" ? Shield : 
                                             equipType === "Rope" ? Cable : 
                                             equipType === "Carabiner" ? Link2 : Gauge;
                        return (
                          <Card
                            key={item.id}
                            className={`cursor-pointer hover-elevate active-elevate-2 transition-all ${
                              selectedCatalogItem?.id === item.id ? "bg-primary/10 border-primary border-2" : ""
                            }`}
                            onClick={() => {
                              setSelectedCatalogItem(item);
                              form.setValue("brand", item.brand);
                              form.setValue("model", item.model);
                              apiRequest("PATCH", `/api/equipment-catalog/${item.id}/use`);
                            }}
                            data-testid={`card-gear-${item.brand.toLowerCase()}-${item.model.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <CardContent className="p-3 flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                selectedCatalogItem?.id === item.id ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{item.brand}</div>
                                <div className="text-xs text-muted-foreground truncate">{item.model}</div>
                              </div>
                              {selectedCatalogItem?.id === item.id && (
                                <div className="text-primary">
                                  <span className="material-icons text-lg">check_circle</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    {/* Other option */}
                    <Card
                      className="cursor-pointer hover-elevate active-elevate-2 transition-all border-dashed"
                      onClick={() => {
                        setShowOtherDescender(true);
                        setSelectedCatalogItem(null);
                        form.setValue("brand", "");
                        form.setValue("model", "");
                      }}
                      data-testid="card-gear-other"
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-muted">
                          <Plus className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{t('inventory.otherGear', 'Other / Not Listed')}</div>
                          <div className="text-xs text-muted-foreground">{t('inventory.addNewGear', 'Add new gear to the shared database')}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Custom Gear Entry - when "Other" is selected for catalog-supported types */}
              {hasCatalogSupport && showOtherDescender && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowOtherDescender(false);
                        setCustomBrand("");
                        setCustomModel("");
                      }}
                      data-testid="button-back-to-gear-list"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      {t('common.back', 'Back')}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {t('inventory.addCustomGear', 'Add Custom')} {form.watch("equipmentType")}
                    </span>
                  </div>
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('inventory.brand', 'Brand')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('inventory.placeholders.brand', 'e.g., Petzl')} 
                            {...field} 
                            value={field.value || ""} 
                            onChange={(e) => {
                              field.onChange(e);
                              setCustomBrand(e.target.value);
                            }}
                            data-testid="input-brand" 
                          />
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
                        <FormLabel>{t('inventory.model', 'Model')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('inventory.placeholders.model', "e.g., I'D S")} 
                            {...field} 
                            value={field.value || ""} 
                            onChange={(e) => {
                              field.onChange(e);
                              setCustomModel(e.target.value);
                            }}
                            data-testid="input-model" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('inventory.catalogNoteGeneric', 'This item will be saved to the shared database for all companies to use.')}
                  </p>
                </div>
              )}

              {/* Standard Brand/Model fields for non-catalog items */}
              {!hasCatalogSupport && (
                <>
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('inventory.brand', 'Brand')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('inventory.placeholders.brand', 'e.g., Petzl')} {...field} value={field.value || ""} data-testid="input-brand" />
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
                        <FormLabel>{t('inventory.model', 'Model')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('inventory.placeholders.model', "e.g., I'D S")} {...field} value={field.value || ""} data-testid="input-model" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Item Suffix - Optional specification to append to item type */}
              <FormField
                control={form.control}
                name="itemSuffix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('inventory.itemSuffix', 'Item Specification (Optional)')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('inventory.placeholders.itemSuffix', 'e.g., 18" or Large or Red')} 
                        {...field} 
                        value={field.value || ""} 
                        data-testid="input-item-suffix" 
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      {t('inventory.itemSuffixHint', 'Add a size, color, or other detail to the item name')}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('inventory.quantity', 'Quantity')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder={t('inventory.placeholders.quantity', 'Enter quantity')}
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

              {/* Rope-specific fields - Pricing */}
              {form.watch("equipmentType") === "Rope" && (
                <>
                  <div className="bg-primary/5 border border-primary/20 rounded-md p-4 space-y-4">
                    <div className="text-sm font-semibold text-primary flex items-center gap-2">
                      <span className="material-icons text-sm">straighten</span>
                      {t('inventory.ropePricing', 'Rope Pricing')}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ropeLength"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('inventory.lengthPerRope', 'Length Per Rope (ft)')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder={t('inventory.placeholders.ropeLength', 'e.g., 400')}
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
                            <FormLabel>{t('inventory.pricePerFoot', 'Price Per Foot ($)')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder={t('inventory.placeholders.pricePerFoot', 'e.g., 1.45')}
                                {...field}
                                value={field.value || ""}
                                data-testid="input-price-per-feet"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Live calculation preview */}
                    {form.watch("ropeLength") && form.watch("pricePerFeet") && form.watch("quantity") && (
                      <div className="bg-background border rounded-md p-3 mt-2">
                        <div className="text-xs text-muted-foreground mb-1">
                          {t('inventory.calculatedValue', 'Calculated Value')}:
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {form.watch("quantity")} {form.watch("quantity") === 1 ? 'rope' : 'ropes'} × {form.watch("ropeLength")}ft × ${form.watch("pricePerFeet")}/ft = ${(
                            parseFloat(form.watch("quantity")?.toString() || "0") *
                            parseFloat(form.watch("ropeLength") || "0") *
                            parseFloat(form.watch("pricePerFeet") || "0")
                          ).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="text-sm font-medium mb-3">{t('inventory.assignToEmployee', 'Assign to Employee (Optional)')}</div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>{t('common.employee', 'Employee')}</Label>
                        <Select value={assignEmployeeId} onValueChange={setAssignEmployeeId}>
                          <SelectTrigger data-testid="select-assign-employee-add">
                            <SelectValue placeholder={t('inventory.placeholders.selectEmployee', 'Select employee')} />
                          </SelectTrigger>
                          <SelectContent>
                            {activeEmployees
                              .filter((emp: any) => emp.name && emp.name.trim() !== "")
                              .map((emp: any) => (
                                <SelectItem key={emp.id} value={emp.id}>
                                  {emp.name} {emp.email ? `(${emp.email})` : ''}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {assignEmployeeId && (
                        <div className="space-y-2">
                          <Label>{t('inventory.howManyToAssign', 'How Many to Assign')}</Label>
                          <Input
                            type="number"
                            min="1"
                            max={form.watch("quantity") || 1}
                            value={assignQuantity}
                            onChange={(e) => setAssignQuantity(e.target.value)}
                            placeholder={t('inventory.placeholders.quantity', 'Enter quantity')}
                            data-testid="input-assign-quantity-add"
                          />
                          <div className="text-xs text-muted-foreground">
                            {t('inventory.max', 'Max')}: {form.watch("quantity") || 0}
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
                        <FormLabel>{t('inventory.price', 'Price')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder={t('inventory.placeholders.price', '0.00')}
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
                    <div className="text-sm font-medium mb-3">{t('inventory.assignToEmployee', 'Assign to Employee (Optional)')}</div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>{t('common.employee', 'Employee')}</Label>
                        <Select value={assignEmployeeId} onValueChange={setAssignEmployeeId}>
                          <SelectTrigger data-testid="select-assign-employee-add">
                            <SelectValue placeholder={t('inventory.placeholders.selectEmployee', 'Select employee')} />
                          </SelectTrigger>
                          <SelectContent>
                            {activeEmployees
                              .filter((emp: any) => emp.name && emp.name.trim() !== "")
                              .map((emp: any) => (
                                <SelectItem key={emp.id} value={emp.id}>
                                  {emp.name} {emp.email ? `(${emp.email})` : ''}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {assignEmployeeId && (
                        <div className="space-y-2">
                          <Label>{t('inventory.howManyToAssign', 'How Many to Assign')}</Label>
                          <Input
                            type="number"
                            min="1"
                            max={form.watch("quantity") || 1}
                            value={assignQuantity}
                            onChange={(e) => setAssignQuantity(e.target.value)}
                            placeholder={t('inventory.placeholders.quantity', 'Enter quantity')}
                            data-testid="input-assign-quantity-add"
                          />
                          <div className="text-xs text-muted-foreground">
                            {t('inventory.max', 'Max')}: {form.watch("quantity") || 0}
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
                    <FormLabel>{t('inventory.addIndividualItems', 'Add Individual Items (Optional)')}</FormLabel>
                    <p className="text-xs text-muted-foreground">{t('inventory.addIndividualItemsDescription', 'Enter serial number and dates for each item. All fields will reset after adding.')}</p>
                    
                    <div className="space-y-3 p-3 bg-muted/20 rounded-md border border-dashed">
                      <div>
                        <Label className="text-xs">{t('inventory.serialNumber', 'Serial Number')}</Label>
                        <Input
                          placeholder={t('inventory.placeholders.serialNumber', 'Enter serial number')}
                          value={currentSerialNumber}
                          onChange={(e) => setCurrentSerialNumber(e.target.value)}
                          data-testid="input-current-serial"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">{t('inventory.dateOfManufacture', 'Date of Manufacture')}</Label>
                          <Input
                            type="date"
                            value={currentDateOfManufacture}
                            onChange={(e) => setCurrentDateOfManufacture(e.target.value)}
                            data-testid="input-current-date-manufacture"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">{t('inventory.dateInService', 'Date In Service')}</Label>
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
                        variant="outline"
                        onClick={handleAddSerialNumber}
                        disabled={serialEntries.length >= (form.watch("quantity") || 1)}
                        data-testid="button-add-serial"
                        className="w-full"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        {t('inventory.addToList', 'Add to List')} ({serialEntries.length}/{form.watch("quantity") || 1})
                      </Button>
                    </div>

                    {serialEntries.length > 0 && (
                      <div className="space-y-2 bg-muted/30 p-3 rounded-md">
                        <div className="text-sm font-medium">{t('inventory.addedItems', 'Added Items')}:</div>
                        {serialEntries.map((entry, index) => (
                          <div key={index} className="flex items-start justify-between text-sm p-2 bg-background rounded border">
                            <div className="flex-1">
                              <div className="font-medium">{entry.serialNumber}</div>
                              <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                                {entry.dateOfManufacture && (
                                  <span>{t('inventory.mfgAbbrev', 'Mfg')}: {formatLocalDate(entry.dateOfManufacture)}</span>
                                )}
                                {entry.dateInService && (
                                  <span>{t('inventory.inService', 'In Service')}: {formatLocalDate(entry.dateInService)}</span>
                                )}
                                {!entry.dateOfManufacture && !entry.dateInService && (
                                  <span className="italic">{t('inventory.noDatesSet', 'No dates set')}</span>
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
                        <FormLabel>{t('inventory.notes', 'Notes')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t('inventory.placeholders.additionalInfo', 'Additional information...')} {...field} value={field.value || ""} data-testid="textarea-notes" />
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
                          <FormLabel>{t('inventory.price', 'Price')}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder={t('inventory.placeholders.price', '0.00')}
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

                  <div className="flex gap-2 pt-4 flex-shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAddItemStep(1)}
                      data-testid="button-back-step2"
                    >
                      {t('common.back', 'Back')}
                    </Button>
                    <Button type="submit" disabled={addItemMutation.isPending} data-testid="button-submit" className="flex-1">
                      {addItemMutation.isPending ? t('inventory.saving', 'Saving...') : t('inventory.saveToInventory', 'Save to Inventory')}
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
            <DialogTitle>{t('inventory.dialog.editInventoryItem', 'Edit Inventory Item')}</DialogTitle>
            <DialogDescription>{t('inventory.dialog.updateItemDetails', 'Update the item details.')}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditItem)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              <FormField
                control={form.control}
                name="equipmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('inventory.type', 'Type')}</FormLabel>
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
                          <SelectValue placeholder={t('inventory.placeholders.selectGearType', 'Select gear type')} />
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
                  <FormLabel>{t('inventory.customTypeName', 'Custom Type Name')}</FormLabel>
                  <Input
                    placeholder={t('inventory.enterCustomGearType', 'Enter custom gear type')}
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
                    <FormLabel>{t('inventory.brand', 'Brand')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('inventory.placeholders.brand', 'e.g., Petzl')} {...field} value={field.value || ""} data-testid="input-brand-edit" />
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
                    <FormLabel>{t('inventory.model', 'Model')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('inventory.placeholders.model', "e.g., I'D S")} {...field} value={field.value || ""} data-testid="input-model-edit" />
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
                    <FormLabel>{t('inventory.quantity', 'Quantity')}</FormLabel>
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

              {/* Assignment Info */}
              {editingItem && getItemAssignments(editingItem.id).length > 0 && (
                <div className="p-3 bg-muted/30 rounded-md">
                  <div className="text-sm font-medium mb-2">{t('inventory.currentAssignments', 'Current Assignments')}</div>
                  <div className="space-y-1">
                    {getItemAssignments(editingItem.id).map((assignment) => {
                      const employee = activeEmployees.find((e: any) => e.id === assignment.employeeId);
                      return (
                        <div key={assignment.id} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="material-icons text-xs">person</span>
                          {employee?.name || 'Unknown'} ({assignment.quantity})
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('inventory.useAssignButtonToManage', 'Use the "Assign Gear" button to manage assignments.')}
                  </p>
                </div>
              )}

              {/* Serial Number Entry with Per-Item Dates */}
              <div className="space-y-3">
                <FormLabel>{t('inventory.addIndividualItems', 'Add Individual Items (Optional)')}</FormLabel>
                <p className="text-xs text-muted-foreground">{t('inventory.addIndividualItemsDescription', 'Enter serial number and dates for each item. All fields will reset after adding.')}</p>
                
                <div className="space-y-3 p-3 bg-muted/20 rounded-md border border-dashed">
                  <div>
                    <Label className="text-xs">{t('inventory.serialNumber', 'Serial Number')}</Label>
                    <Input
                      placeholder={t('inventory.placeholders.serialNumber', 'Enter serial number')}
                      value={currentSerialNumber}
                      onChange={(e) => setCurrentSerialNumber(e.target.value)}
                      data-testid="input-current-serial-edit"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">{t('inventory.dateOfManufacture', 'Date of Manufacture')}</Label>
                      <Input
                        type="date"
                        value={currentDateOfManufacture}
                        onChange={(e) => setCurrentDateOfManufacture(e.target.value)}
                        data-testid="input-current-date-manufacture-edit"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">{t('inventory.dateInService', 'Date In Service')}</Label>
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
                    variant="outline"
                    onClick={handleAddSerialNumber}
                    disabled={serialEntries.length >= (form.watch("quantity") || 1)}
                    data-testid="button-add-serial-edit"
                    className="w-full"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {t('inventory.addToList', 'Add to List')} ({serialEntries.length}/{form.watch("quantity") || 1})
                  </Button>
                </div>

                {/* Added Items List */}
                {serialEntries.length > 0 && (
                  <div className="space-y-2 bg-muted/30 p-3 rounded-md">
                    <div className="text-sm font-medium">{t('inventory.addedItems', 'Added Items')}:</div>
                    {serialEntries.map((entry, index) => (
                      <div key={index} className="flex items-start justify-between text-sm p-2 bg-background rounded border">
                        <div className="flex-1">
                          <div className="font-medium">{entry.serialNumber}</div>
                          <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                            {entry.dateOfManufacture && (
                              <span>{t('inventory.mfgAbbrev', 'Mfg')}: {formatLocalDate(entry.dateOfManufacture)}</span>
                            )}
                            {entry.dateInService && (
                              <span>{t('inventory.inService', 'In Service')}: {formatLocalDate(entry.dateInService)}</span>
                            )}
                            {!entry.dateOfManufacture && !entry.dateInService && (
                              <span className="italic">{t('inventory.noDatesSet', 'No dates set')}</span>
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
                    <FormLabel>{t('inventory.notes', 'Notes')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('inventory.placeholders.additionalInfo', 'Additional information...')} {...field} value={field.value || ""} data-testid="textarea-notes-edit" />
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
                          <FormLabel>{t('inventory.ropeLength', 'Rope Length (feet)')}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder={t('inventory.placeholders.ropeLength', 'Enter rope length')}
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
                          <FormLabel>{t('inventory.pricePerFoot', 'Price Per Foot')}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder={t('inventory.placeholders.pricePerFoot', 'Enter price per foot')}
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
                        <FormLabel>{t('inventory.price', 'Price')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder={t('inventory.placeholders.price', '0.00')}
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
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button type="submit" disabled={updateItemMutation.isPending} data-testid="button-submit-edit">
                  {updateItemMutation.isPending ? t('inventory.updating', 'Updating...') : t('inventory.updateItem', 'Update Item')}
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
            <DialogTitle>{t('inventory.dialog.deleteItem', 'Delete Item')}</DialogTitle>
            <DialogDescription>
              {t('inventory.dialog.deleteItemConfirmation', 'Are you sure you want to delete this item from inventory? This action cannot be undone.')}
            </DialogDescription>
          </DialogHeader>
          {itemToDelete && (
            <div className="py-4">
              <div className="space-y-1">
                <div className="font-medium">{itemToDelete.equipmentType || t('inventory.gearItem', 'Gear Item')}</div>
                {itemToDelete.brand && <div className="text-sm text-muted-foreground">{t('inventory.brand', 'Brand')}: {itemToDelete.brand}</div>}
                {itemToDelete.model && <div className="text-sm text-muted-foreground">{t('inventory.model', 'Model')}: {itemToDelete.model}</div>}
                <div className="text-sm text-muted-foreground">{t('inventory.quantity', 'Quantity')}: {itemToDelete.quantity || 1}</div>
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
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteItem}
              disabled={deleteItemMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteItemMutation.isPending ? t('inventory.deleting', 'Deleting...') : t('inventory.dialog.deleteItem', 'Delete Item')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Retire Gear Dialog */}
      <Dialog open={showRetireDialog} onOpenChange={(open) => {
        setShowRetireDialog(open);
        if (!open) {
          setSerialToRetire(null);
          setRetireReason("");
        }
      }}>
        <DialogContent data-testid="dialog-retire-item">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-muted-foreground">archive</span>
              {t('inventory.dialog.retireItem', 'Retire Item')}
            </DialogTitle>
            <DialogDescription>
              {t('inventory.dialog.retireItemDescription', 'Retiring an item removes it from active inventory and unassigns it from any technician. This action is for items that are worn out, damaged beyond repair, or at end of life.')}
            </DialogDescription>
          </DialogHeader>
          {serialToRetire && (
            <div className="py-2">
              <div className="p-3 bg-muted/50 rounded-md">
                <div className="font-medium text-sm">{t('inventory.serialNumber', 'Serial Number')}: {serialToRetire.serialNumber}</div>
                {serialToRetire.dateOfManufacture && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {t('inventory.mfg', 'Mfg Date')}: {formatLocalDate(serialToRetire.dateOfManufacture)}
                  </div>
                )}
                {serialToRetire.dateInService && (
                  <div className="text-xs text-muted-foreground">
                    {t('inventory.inServiceDate', 'In Service')}: {formatLocalDate(serialToRetire.dateInService)}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Label htmlFor="retire-reason">{t('inventory.retireReason', 'Reason for Retirement')} *</Label>
                <Select value={retireReason} onValueChange={setRetireReason}>
                  <SelectTrigger id="retire-reason" data-testid="select-retire-reason">
                    <SelectValue placeholder={t('inventory.selectReason', 'Select a reason...')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="End of life - wear and tear">{t('inventory.reason.endOfLife', 'End of life - wear and tear')}</SelectItem>
                    <SelectItem value="Damaged beyond repair">{t('inventory.reason.damaged', 'Damaged beyond repair')}</SelectItem>
                    <SelectItem value="Failed inspection">{t('inventory.reason.failedInspection', 'Failed inspection')}</SelectItem>
                    <SelectItem value="Recalled by manufacturer">{t('inventory.reason.recalled', 'Recalled by manufacturer')}</SelectItem>
                    <SelectItem value="Lost">{t('inventory.reason.lost', 'Lost')}</SelectItem>
                    <SelectItem value="Stolen">{t('inventory.reason.stolen', 'Stolen')}</SelectItem>
                    <SelectItem value="Other">{t('inventory.reason.other', 'Other')}</SelectItem>
                  </SelectContent>
                </Select>
                {retireReason === "Other" && (
                  <Input
                    className="mt-2"
                    placeholder={t('inventory.specifyReason', 'Please specify the reason...')}
                    value={retireReason === "Other" ? "" : retireReason}
                    onChange={(e) => setRetireReason(e.target.value || "Other")}
                    data-testid="input-retire-reason-other"
                  />
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowRetireDialog(false);
                setSerialToRetire(null);
                setRetireReason("");
              }}
              data-testid="button-cancel-retire"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={() => {
                if (serialToRetire && retireReason) {
                  retireGearMutation.mutate({ id: serialToRetire.id, reason: retireReason });
                }
              }}
              disabled={!retireReason || retireGearMutation.isPending}
              data-testid="button-confirm-retire"
            >
              <span className="material-icons text-sm mr-1">archive</span>
              {retireGearMutation.isPending ? t('inventory.retiring', 'Retiring...') : t('inventory.dialog.retireItem', 'Retire Item')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Detail Dialog */}
      <Dialog open={showItemDetailDialog} onOpenChange={(open) => {
        setShowItemDetailDialog(open);
        if (!open) setSelectedDetailItem(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" data-testid="dialog-item-detail">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-icons text-primary">
                  {EQUIPMENT_ICONS[selectedDetailItem?.equipmentType || ""] || "category"}
                </span>
              </div>
              <div>
                <div>{selectedDetailItem?.equipmentType || t('inventory.gearItem', 'Gear Item')}</div>
                {(selectedDetailItem?.brand || selectedDetailItem?.model) && (
                  <div className="text-sm font-normal text-muted-foreground">
                    {[selectedDetailItem?.brand, selectedDetailItem?.model].filter(Boolean).join(" - ")}
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedDetailItem && (
            <div className="space-y-6 py-2">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">{t('inventory.quantity', 'Quantity')}</div>
                  <div className="font-semibold">{selectedDetailItem.quantity || 1}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t('inventory.available', 'Available')}</div>
                  <div className="font-semibold">{getAvailableQuantity(selectedDetailItem)} / {selectedDetailItem.quantity || 0}</div>
                </div>
                {canViewFinancials && selectedDetailItem.itemPrice && (
                  <>
                    <div>
                      <div className="text-sm text-muted-foreground">{t('inventory.priceEach', 'Price Each')}</div>
                      <div className="font-semibold text-primary">${parseFloat(selectedDetailItem.itemPrice).toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{t('inventory.totalValue', 'Total Value')}</div>
                      <div className="font-semibold text-primary">${(parseFloat(selectedDetailItem.itemPrice) * (selectedDetailItem.quantity || 1)).toFixed(2)}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Rope-specific info */}
              {selectedDetailItem.equipmentType === "Rope" && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedDetailItem.ropeLength && (
                    <div>
                      <div className="text-sm text-muted-foreground">{t('inventory.ropeLength', 'Rope Length')}</div>
                      <div className="font-semibold">{selectedDetailItem.ropeLength} ft</div>
                    </div>
                  )}
                  {selectedDetailItem.pricePerFeet && canViewFinancials && (
                    <div>
                      <div className="text-sm text-muted-foreground">{t('inventory.pricePerFt', 'Price per ft')}</div>
                      <div className="font-semibold text-primary">${parseFloat(selectedDetailItem.pricePerFeet).toFixed(2)}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {selectedDetailItem.notes && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{t('inventory.notes', 'Notes')}</div>
                  <div className="text-sm p-3 bg-muted/50 rounded-md">{selectedDetailItem.notes}</div>
                </div>
              )}

              {/* Serial Numbers Section */}
              {(() => {
                // Filter serial entries based on source
                const allSerialEntries = (selectedDetailItem as any).serialEntries || [];
                const myAssignments = getItemAssignments(selectedDetailItem.id).filter(a => a.employeeId === currentUser?.id);
                const mySerialNumbers = myAssignments.map(a => a.serialNumber).filter(Boolean);
                
                // If viewing from My Gear, only show MY serial numbers
                const serialEntriesToShow = detailDialogSource === "myGear" 
                  ? allSerialEntries.filter((entry: GearSerialNumber) => mySerialNumbers.includes(entry.serialNumber))
                  : allSerialEntries;
                
                if (serialEntriesToShow.length === 0) return null;
                
                return (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">
                        {detailDialogSource === "myGear" 
                          ? t('inventory.mySerialNumbers', 'My Serial Numbers')
                          : t('inventory.serialNumbers', 'Serial Numbers')}
                      </h4>
                      <Badge variant="secondary">{serialEntriesToShow.length} {t('inventory.units', 'units')}</Badge>
                    </div>
                    <div className="space-y-2">
                      {serialEntriesToShow.map((entry: GearSerialNumber) => {
                        const assignment = gearData?.assignments?.find(
                          (a: any) => a.gearItemId === selectedDetailItem.id && a.serialNumber === entry.serialNumber
                        );
                        const assignedEmployee = assignment ? activeEmployees.find(e => e.id === assignment.employeeId) : null;
                        
                        return (
                          <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="font-mono">
                                  {entry.serialNumber}
                                </Badge>
                                {getServiceDuration(entry.dateInService) && (
                                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                    <span className="material-icons text-xs mr-1">schedule</span>
                                    {getServiceDuration(entry.dateInService)} in service
                                  </Badge>
                                )}
                                {assignedEmployee && detailDialogSource !== "myGear" && (
                                  <Badge variant="secondary" className="text-xs">
                                    <span className="material-icons text-xs mr-1">person</span>
                                    {assignedEmployee.name}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                                {entry.dateOfManufacture && (
                                  <span>{t('inventory.mfg', 'Mfg')}: {formatLocalDate(entry.dateOfManufacture)}</span>
                                )}
                                {entry.dateInService && (
                                  <span>{t('inventory.inService', 'In Service')}: {formatLocalDate(entry.dateInService)}</span>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-muted-foreground"
                              onClick={() => {
                                setSerialToRetire(entry);
                                setShowRetireDialog(true);
                              }}
                              data-testid={`button-retire-detail-${entry.id}`}
                            >
                              <span className="material-icons text-sm mr-1">archive</span>
                              {t('inventory.retire', 'Retire')}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Current Assignments - only show in Manage Gear view */}
              {detailDialogSource === "manageGear" && getItemAssignments(selectedDetailItem.id).length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">{t('inventory.currentAssignments', 'Current Assignments')}</h4>
                  <div className="space-y-2">
                    {getItemAssignments(selectedDetailItem.id).map((assignment) => {
                      const employee = activeEmployees.find(e => e.id === assignment.employeeId);
                      return (
                        <div key={assignment.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                          <div>
                            <div className="font-medium">{employee?.name || t('common.unknown', 'Unknown')}</div>
                            <div className="text-xs text-muted-foreground">
                              {t('inventory.quantity', 'Qty')}: {assignment.quantity}
                              {assignment.serialNumber && ` | S/N: ${assignment.serialNumber}`}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => deleteAssignmentMutation.mutate(assignment.id)}
                            disabled={deleteAssignmentMutation.isPending}
                            data-testid={`button-unassign-detail-${assignment.id}`}
                          >
                            <X className="h-4 w-4 mr-1" />
                            {t('common.remove', 'Remove')}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {/* Management buttons only shown when viewing from Manage Gear */}
            {detailDialogSource === "manageGear" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedDetailItem) openAssignDialog(selectedDetailItem);
                    setShowItemDetailDialog(false);
                  }}
                  data-testid="button-assign-from-detail"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {t('inventory.assignGear', 'Assign Gear')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedDetailItem) openEditDialog(selectedDetailItem);
                    setShowItemDetailDialog(false);
                  }}
                  data-testid="button-edit-from-detail"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  {t('inventory.edit', 'Edit')}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => setShowItemDetailDialog(false)}
              data-testid="button-close-detail"
            >
              {t('common.close', 'Close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assignment Management Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent data-testid="dialog-assign-gear">
          <DialogHeader>
            <DialogTitle>{t('inventory.dialog.assignGear', 'Assign Gear to Employee')}</DialogTitle>
            <DialogDescription>
              {t('inventory.dialog.assignGearDescription', 'Manage who this gear item is assigned to')}
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
                  {t('inventory.available', 'Available')}: {getAvailableQuantity(managingItem)} / {managingItem.quantity || 0}
                </div>
              </div>

              {/* Current Assignments */}
              {getItemAssignments(managingItem.id).length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">{t('inventory.currentAssignments', 'Current Assignments')}:</div>
                  <div className="space-y-2">
                    {getItemAssignments(managingItem.id).map((assignment) => {
                      const employee = activeEmployees.find(e => e.id === assignment.employeeId);
                      return (
                        <div key={assignment.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div className="text-sm">
                            <div className="font-medium">{employee?.name || t('common.unknown', 'Unknown')}</div>
                            <div className="text-xs text-muted-foreground">{t('inventory.quantity', 'Quantity')}: {assignment.quantity}</div>
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
                            {t('common.remove', 'Remove')}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add Assignment Form */}
              <div className="border-t pt-4 space-y-3">
                <div className="text-sm font-medium">{t('inventory.assignToNewEmployee', 'Assign to New Employee')}:</div>
                
                <div className="space-y-2">
                  <Label htmlFor="assign-employee">{t('common.employee', 'Employee')}</Label>
                  {canAssignToOthers ? (
                    <Select value={assignEmployeeId} onValueChange={setAssignEmployeeId}>
                      <SelectTrigger data-testid="select-assign-employee">
                        <SelectValue placeholder={t('inventory.placeholders.selectEmployee', 'Select employee')} />
                      </SelectTrigger>
                      <SelectContent>
                        {activeEmployees
                          .filter((emp: any) => emp.name && emp.name.trim() !== "")
                          .map((emp: any) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.name} {emp.email ? `(${emp.email})` : ''}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md border">
                      <span className="text-sm font-medium">{currentUser?.name || currentUser?.email || t('common.you', 'You')}</span>
                      <Badge variant="secondary" className="text-xs">{t('inventory.yourself', 'Yourself')}</Badge>
                    </div>
                  )}
                  {!canAssignToOthers && (
                    <p className="text-xs text-muted-foreground">
                      {t('inventory.canOnlyAssignToSelf', 'You can only assign gear to yourself. Contact management to assign gear to other employees.')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assign-quantity">{t('inventory.quantity', 'Quantity')}</Label>
                  <Input
                    id="assign-quantity"
                    type="number"
                    min="1"
                    max={getAvailableQuantity(managingItem)}
                    value={assignQuantity}
                    onChange={(e) => setAssignQuantity(e.target.value)}
                    placeholder={t('inventory.placeholders.quantity', 'Enter quantity')}
                    data-testid="input-assign-quantity"
                  />
                  <div className="text-xs text-muted-foreground">
                    {t('inventory.maxAvailable', 'Max available')}: {getAvailableQuantity(managingItem)}
                  </div>
                </div>

                {/* Serial Number Picker / Entry */}
                {(() => {
                  const availableSerials = getAvailableSerialNumbersForAssign();
                  
                  if (availableSerials.length > 0) {
                    return (
                      <div className="space-y-3">
                        {/* Mode Toggle */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={assignSerialMode === "pick" ? "default" : "outline"}
                            onClick={() => {
                              setAssignSerialMode("pick");
                              setAssignSerialNumber("");
                              setAssignDateOfManufacture("");
                              setAssignDateInService("");
                              setSelectedAssignSerialEntry(null);
                            }}
                            className="flex-1"
                            data-testid="button-assign-serial-mode-pick"
                          >
                            {t('inventory.pickExisting', 'Pick Existing')} ({availableSerials.length})
                          </Button>
                          <Button
                            size="sm"
                            variant={assignSerialMode === "new" ? "default" : "outline"}
                            onClick={() => {
                              setAssignSerialMode("new");
                              setSelectedAssignSerialEntry(null);
                            }}
                            className="flex-1"
                            data-testid="button-assign-serial-mode-new"
                          >
                            {t('inventory.enterNew', 'Enter New')}
                          </Button>
                        </div>

                        {assignSerialMode === "pick" ? (
                          <div className="space-y-2">
                            <Label>{t('inventory.availableSerialNumbers', 'Available Serial Numbers')}</Label>
                            <div className="space-y-1 max-h-32 overflow-y-auto border rounded-md p-2">
                              {availableSerials.map((serial: any) => (
                                <div
                                  key={serial.id}
                                  className={`p-2 rounded cursor-pointer hover-elevate ${
                                    selectedAssignSerialEntry?.id === serial.id ? 'bg-primary/10 border border-primary' : 'bg-muted/50'
                                  }`}
                                  onClick={() => {
                                    setSelectedAssignSerialEntry(serial);
                                    setAssignSerialNumber(serial.serialNumber);
                                    setAssignDateOfManufacture(serial.dateOfManufacture || "");
                                    setAssignDateInService(serial.dateInService || "");
                                    setAssignQuantity("1");
                                  }}
                                  data-testid={`assign-serial-option-${serial.id}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="font-mono text-sm font-medium">{serial.serialNumber}</div>
                                    {selectedAssignSerialEntry?.id === serial.id && (
                                      <Badge variant="default" className="text-xs">{t('inventory.selected', 'Selected')}</Badge>
                                    )}
                                  </div>
                                  {(serial.dateOfManufacture || serial.dateInService) && (
                                    <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                                      {serial.dateOfManufacture && (
                                        <span>Mfg: {formatLocalDate(serial.dateOfManufacture)}</span>
                                      )}
                                      {serial.dateInService && (
                                        <span>In Service: {formatLocalDate(serial.dateInService)}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            {selectedAssignSerialEntry && (
                              <div className="text-sm text-muted-foreground">
                                {t('inventory.selected', 'Selected')}: <span className="font-mono font-medium">{selectedAssignSerialEntry.serialNumber}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor="assign-serial-number">{t('inventory.serialNumberOptional', 'Serial Number (Optional)')}</Label>
                              <Input
                                id="assign-serial-number"
                                type="text"
                                value={assignSerialNumber}
                                onChange={(e) => setAssignSerialNumber(e.target.value)}
                                placeholder={t('inventory.placeholders.enterNewSerialNumber', 'Enter new serial number')}
                                data-testid="input-assign-serial-number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="assign-date-of-manufacture">{t('inventory.dateOfManufactureOptional', 'Date of Manufacture (Optional)')}</Label>
                              <Input
                                id="assign-date-of-manufacture"
                                type="date"
                                value={assignDateOfManufacture}
                                onChange={(e) => setAssignDateOfManufacture(e.target.value)}
                                data-testid="input-assign-date-of-manufacture"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="assign-date-in-service">{t('inventory.dateInServiceOptional', 'Date In Service (Optional)')}</Label>
                              <Input
                                id="assign-date-in-service"
                                type="date"
                                value={assignDateInService}
                                onChange={(e) => setAssignDateInService(e.target.value)}
                                data-testid="input-assign-date-in-service"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  // No unassigned serials available - show standard input fields with explanation
                  return (
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md mb-2">
                        {t('inventory.noUnassignedSerials', 'No unassigned serial numbers available. Enter a new serial number below.')}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assign-serial-number">{t('inventory.serialNumberOptional', 'Serial Number (Optional)')}</Label>
                        <Input
                          id="assign-serial-number"
                          type="text"
                          value={assignSerialNumber}
                          onChange={(e) => setAssignSerialNumber(e.target.value)}
                          placeholder={t('inventory.placeholders.enterSerialNumber', 'Enter serial number of assigned gear')}
                          data-testid="input-assign-serial-number"
                        />
                        <div className="text-xs text-muted-foreground">
                          {t('inventory.enterSerialNumberHelp', 'Enter the serial number of the specific gear item being assigned')}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assign-date-of-manufacture">{t('inventory.dateOfManufactureOptional', 'Date of Manufacture (Optional)')}</Label>
                        <Input
                          id="assign-date-of-manufacture"
                          type="date"
                          value={assignDateOfManufacture}
                          onChange={(e) => setAssignDateOfManufacture(e.target.value)}
                          data-testid="input-assign-date-of-manufacture"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assign-date-in-service">{t('inventory.dateInServiceOptional', 'Date In Service (Optional)')}</Label>
                        <Input
                          id="assign-date-in-service"
                          type="date"
                          value={assignDateInService}
                          onChange={(e) => setAssignDateInService(e.target.value)}
                          data-testid="input-assign-date-in-service"
                        />
                      </div>
                    </div>
                  );
                })()}
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
                setAssignSerialMode("pick");
                setSelectedAssignSerialEntry(null);
              }}
              data-testid="button-cancel-assign"
            >
              {t('common.close', 'Close')}
            </Button>
            <Button
              onClick={handleAssignGear}
              disabled={createAssignmentMutation.isPending || !assignEmployeeId}
              data-testid="button-submit-assign"
            >
              {createAssignmentMutation.isPending ? t('inventory.assigning', 'Assigning...') : t('inventory.assignGear', 'Assign Gear')}
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
              {t('inventory.dialog.editGearAssignment', 'Edit Gear Assignment')}
            </DialogTitle>
            <DialogDescription>
              {t('inventory.dialog.updateAssignmentDetails', 'Update the details for this gear assignment.')}
            </DialogDescription>
          </DialogHeader>
          
          {editingAssignment && (
            <div className="space-y-4 py-4">
              {/* Gear Info */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">{t('inventory.assignedGear', 'Assigned Gear')}</div>
                <div className="font-medium">
                  {allGearItems.find(g => g.id === editingAssignment.gearItemId)?.equipmentType || t('common.unknown', 'Unknown')}
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
                <Label htmlFor="editQuantity">{t('inventory.quantity', 'Quantity')}</Label>
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
                <Label htmlFor="editSerialNumber">{t('inventory.serialNumberOptional', 'Serial Number (Optional)')}</Label>
                <Input
                  id="editSerialNumber"
                  type="text"
                  value={editAssignmentSerialNumber}
                  onChange={(e) => setEditAssignmentSerialNumber(e.target.value)}
                  placeholder={t('inventory.placeholders.serialNumber', 'Enter serial number')}
                  data-testid="input-edit-assignment-serial-number"
                />
              </div>

              {/* Date of Manufacture */}
              <div className="space-y-2">
                <Label htmlFor="editDateOfManufacture">{t('inventory.dateOfManufactureOptional', 'Date of Manufacture (Optional)')}</Label>
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
                <Label htmlFor="editDateInService">{t('inventory.dateInServiceOptional', 'Date In Service (Optional)')}</Label>
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
              {t('common.cancel', 'Cancel')}
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
              {updateAssignmentMutation.isPending ? t('common.saving', 'Saving...') : t('common.saveChanges', 'Save Changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Self-Assign Gear Dialog */}
      <Dialog open={showSelfAssignDialog} onOpenChange={(open) => {
        setShowSelfAssignDialog(open);
        if (!open) {
          setSelfAssignItem(null);
          setSelfAssignQuantity("1");
          setSelfAssignSearch("");
          setSelfAssignSerialNumber("");
          setSelfAssignDateOfManufacture("");
          setSelfAssignDateInService("");
          setSelfAssignSerialMode("pick");
          setSelectedSerialEntry(null);
        }
      }}>
        <DialogContent data-testid="dialog-self-assign-gear" className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{t('inventory.dialog.addGearToMyEquipment', 'Add Gear to My Equipment')}</DialogTitle>
            <DialogDescription>
              {t('inventory.dialog.selectGearFromInventory', 'Select gear from the company inventory to add to your equipment')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            {/* Search */}
            <div>
              <Input
                placeholder={t('inventory.placeholders.searchInventory', 'Search inventory...')}
                value={selfAssignSearch}
                onChange={(e) => setSelfAssignSearch(e.target.value)}
                data-testid="input-self-assign-search"
              />
            </div>

            {/* Available Items List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ maxHeight: selfAssignItem ? '150px' : '300px' }}>
              {(() => {
                const availableItems = (gearData?.items || []).filter((item) => {
                  const available = getAvailableQuantity(item);
                  const matchesSearch = !selfAssignSearch || 
                    item.equipmentType?.toLowerCase().includes(selfAssignSearch.toLowerCase()) ||
                    item.brand?.toLowerCase().includes(selfAssignSearch.toLowerCase()) ||
                    item.model?.toLowerCase().includes(selfAssignSearch.toLowerCase());
                  return available > 0 && matchesSearch;
                });

                if (availableItems.length === 0) {
                  return (
                    <div className="text-center py-8 text-muted-foreground">
                      {selfAssignSearch ? t('inventory.noMatchingItemsFound', 'No matching items found') : t('inventory.noItemsAvailable', 'No items available in inventory')}
                    </div>
                  );
                }

                return availableItems.map((item) => {
                  const available = getAvailableQuantity(item);
                  const isSelected = selfAssignItem?.id === item.id;
                  
                  return (
                    <Card 
                      key={item.id} 
                      className={`cursor-pointer hover-elevate ${isSelected ? 'border-primary border-2' : ''}`}
                      onClick={() => {
                        setSelfAssignItem(item);
                        setSelfAssignQuantity("1");
                        setSelfAssignSerialNumber("");
                        setSelfAssignDateOfManufacture("");
                        setSelfAssignDateInService("");
                        setSelfAssignSerialMode("pick");
                        setSelectedSerialEntry(null);
                      }}
                      data-testid={`self-assign-item-${item.id}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="material-icons text-primary">
                                {(item.equipmentType && EQUIPMENT_ICONS[item.equipmentType]) || "category"}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{item.equipmentType || "Unknown"}{item.itemSuffix ? ` ${item.itemSuffix}` : ''}</div>
                              {(item.brand || item.model) && (
                                <div className="text-xs text-muted-foreground">
                                  {[item.brand, item.model].filter(Boolean).join(" - ")}
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {available} available
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                });
              })()}
            </div>

            {/* Selected Item Form */}
            {selfAssignItem && (
              <div className="border-t pt-4 space-y-3 overflow-y-auto" style={{ maxHeight: '300px' }}>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Selected: {selfAssignItem.equipmentType}</div>
                  <Badge variant="outline">{getAvailableQuantity(selfAssignItem)} available</Badge>
                </div>
                
                {/* Show available serial numbers if any exist */}
                {(() => {
                  const availableSerials = getAvailableSerialNumbers();
                  
                  if (availableSerials.length > 0) {
                    return (
                      <div className="space-y-3">
                        {/* Mode Toggle */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={selfAssignSerialMode === "pick" ? "default" : "outline"}
                            onClick={() => {
                              setSelfAssignSerialMode("pick");
                              setSelfAssignSerialNumber("");
                              setSelfAssignDateOfManufacture("");
                              setSelfAssignDateInService("");
                            }}
                            className="flex-1"
                            data-testid="button-serial-mode-pick"
                          >
                            Pick Existing ({availableSerials.length})
                          </Button>
                          <Button
                            size="sm"
                            variant={selfAssignSerialMode === "new" ? "default" : "outline"}
                            onClick={() => {
                              setSelfAssignSerialMode("new");
                              setSelectedSerialEntry(null);
                            }}
                            className="flex-1"
                            data-testid="button-serial-mode-new"
                          >
                            Enter New
                          </Button>
                        </div>

                        {selfAssignSerialMode === "pick" ? (
                          <div className="space-y-2">
                            <Label>Available Serial Numbers</Label>
                            <div className="space-y-1 max-h-32 overflow-y-auto border rounded-md p-2">
                              {availableSerials.map((serial: any) => (
                                <div
                                  key={serial.id}
                                  className={`p-2 rounded cursor-pointer hover-elevate ${
                                    selectedSerialEntry?.id === serial.id ? 'bg-primary/10 border border-primary' : 'bg-muted/50'
                                  }`}
                                  onClick={() => {
                                    setSelectedSerialEntry(serial);
                                    setSelfAssignSerialNumber(serial.serialNumber);
                                    setSelfAssignDateOfManufacture(serial.dateOfManufacture || "");
                                    setSelfAssignDateInService(serial.dateInService || "");
                                    setSelfAssignQuantity("1");
                                  }}
                                  data-testid={`serial-option-${serial.id}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="font-mono text-sm font-medium">{serial.serialNumber}</div>
                                    {selectedSerialEntry?.id === serial.id && (
                                      <Badge variant="default" className="text-xs">Selected</Badge>
                                    )}
                                  </div>
                                  {(serial.dateOfManufacture || serial.dateInService) && (
                                    <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                                      {serial.dateOfManufacture && (
                                        <span>Mfg: {formatLocalDate(serial.dateOfManufacture)}</span>
                                      )}
                                      {serial.dateInService && (
                                        <span>In Service: {formatLocalDate(serial.dateInService)}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            {selectedSerialEntry && (
                              <div className="text-sm text-muted-foreground">
                                Selected: <span className="font-mono font-medium">{selectedSerialEntry.serialNumber}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="self-assign-quantity">Quantity</Label>
                              <Input
                                id="self-assign-quantity"
                                type="number"
                                min="1"
                                max={getAvailableQuantity(selfAssignItem)}
                                value={selfAssignQuantity}
                                onChange={(e) => setSelfAssignQuantity(e.target.value)}
                                data-testid="input-self-assign-quantity"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="self-assign-serial">Serial Number</Label>
                              <Input
                                id="self-assign-serial"
                                placeholder={t('inventory.enterNewSerial', 'Enter new serial number')}
                                value={selfAssignSerialNumber}
                                onChange={(e) => setSelfAssignSerialNumber(e.target.value)}
                                data-testid="input-self-assign-serial-number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="self-assign-manufacture">Date of Manufacture</Label>
                              <Input
                                id="self-assign-manufacture"
                                type="date"
                                value={selfAssignDateOfManufacture}
                                onChange={(e) => setSelfAssignDateOfManufacture(e.target.value)}
                                data-testid="input-self-assign-date-manufacture"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="self-assign-service">Date In Service</Label>
                              <Input
                                id="self-assign-service"
                                type="date"
                                value={selfAssignDateInService}
                                onChange={(e) => setSelfAssignDateInService(e.target.value)}
                                data-testid="input-self-assign-date-service"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                        No unassigned serial numbers available. Enter a new serial number below, or unassign existing gear first.
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="self-assign-quantity">Quantity</Label>
                          <Input
                            id="self-assign-quantity"
                            type="number"
                            min="1"
                            max={getAvailableQuantity(selfAssignItem)}
                            value={selfAssignQuantity}
                            onChange={(e) => setSelfAssignQuantity(e.target.value)}
                            data-testid="input-self-assign-quantity"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="self-assign-serial">Serial Number</Label>
                          <Input
                            id="self-assign-serial"
                            placeholder={t('inventory.enterSerial', 'Enter serial number')}
                            value={selfAssignSerialNumber}
                            onChange={(e) => setSelfAssignSerialNumber(e.target.value)}
                            data-testid="input-self-assign-serial-number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="self-assign-manufacture">Date of Manufacture</Label>
                          <Input
                            id="self-assign-manufacture"
                            type="date"
                            value={selfAssignDateOfManufacture}
                            onChange={(e) => setSelfAssignDateOfManufacture(e.target.value)}
                            data-testid="input-self-assign-date-manufacture"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="self-assign-service">Date In Service</Label>
                          <Input
                            id="self-assign-service"
                            type="date"
                            value={selfAssignDateInService}
                            onChange={(e) => setSelfAssignDateInService(e.target.value)}
                            data-testid="input-self-assign-date-service"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowSelfAssignDialog(false);
                setSelfAssignItem(null);
                setSelfAssignQuantity("1");
                setSelfAssignSearch("");
                setSelfAssignSerialNumber("");
                setSelfAssignDateOfManufacture("");
                setSelfAssignDateInService("");
                setSelfAssignSerialMode("pick");
                setSelectedSerialEntry(null);
              }}
              data-testid="button-cancel-self-assign"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selfAssignItem) {
                  selfAssignMutation.mutate({
                    gearItemId: selfAssignItem.id,
                    quantity: parseInt(selfAssignQuantity) || 1,
                    serialNumber: selfAssignSerialNumber || undefined,
                    dateOfManufacture: selfAssignDateOfManufacture || undefined,
                    dateInService: selfAssignDateInService || undefined,
                  });
                }
              }}
              disabled={!selfAssignItem || selfAssignMutation.isPending}
              data-testid="button-confirm-self-assign"
            >
              {selfAssignMutation.isPending ? "Adding..." : "Add to My Gear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit My Gear Dialog */}
      <Dialog open={showEditMyGearDialog} onOpenChange={(open) => {
        setShowEditMyGearDialog(open);
        if (!open) {
          setEditingMyAssignment(null);
          setEditMySerialNumber("");
          setEditMyDateOfManufacture("");
          setEditMyDateInService("");
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Gear Details</DialogTitle>
            <DialogDescription>
              Update the serial number and dates for your {editingMyAssignment?.gearItem?.equipmentType || "gear"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-my-serial">Serial Number</Label>
              <Input
                id="edit-my-serial"
                placeholder={t('inventory.enterSerial', 'Enter serial number')}
                value={editMySerialNumber}
                onChange={(e) => setEditMySerialNumber(e.target.value)}
                data-testid="input-edit-my-serial"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-my-manufacture">Date of Manufacture</Label>
                <Input
                  id="edit-my-manufacture"
                  type="date"
                  value={editMyDateOfManufacture}
                  onChange={(e) => setEditMyDateOfManufacture(e.target.value)}
                  data-testid="input-edit-my-date-manufacture"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-my-service">Date In Service</Label>
                <Input
                  id="edit-my-service"
                  type="date"
                  value={editMyDateInService}
                  onChange={(e) => setEditMyDateInService(e.target.value)}
                  data-testid="input-edit-my-date-service"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditMyGearDialog(false);
                setEditingMyAssignment(null);
                setEditMySerialNumber("");
                setEditMyDateOfManufacture("");
                setEditMyDateInService("");
              }}
              data-testid="button-cancel-edit-my-gear"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingMyAssignment) {
                  editMyGearMutation.mutate({
                    assignmentId: editingMyAssignment.id,
                    serialNumber: editMySerialNumber || undefined,
                    dateOfManufacture: editMyDateOfManufacture || undefined,
                    dateInService: editMyDateInService || undefined,
                  });
                }
              }}
              disabled={editMyGearMutation.isPending}
              data-testid="button-save-my-gear"
            >
              {editMyGearMutation.isPending ? "Saving..." : "Save Details"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Equipment Damage Dialog */}
      <Dialog open={showDamageReportDialog} onOpenChange={(open) => {
        if (!open) resetDamageReportDialog();
        else setShowDamageReportDialog(open);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-damage-report">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {damageReportStep === 1 ? "Select Equipment Category" : 
               damageReportStep === 2 ? "Select Equipment Item" :
               "Report Damage Details"}
            </DialogTitle>
            <DialogDescription>
              {damageReportStep === 1 ? "Choose the type of equipment that was damaged" :
               damageReportStep === 2 ? "Select the specific item from your inventory" :
               "Provide details about the damage"}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Select Category */}
          {damageReportStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto p-1">
                {gearTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <Card
                      key={type.name}
                      className={`cursor-pointer hover-elevate active-elevate-2 transition-all ${
                        selectedDamageCategory === type.name ? "bg-primary/10 border-primary border-2" : ""
                      }`}
                      onClick={() => setSelectedDamageCategory(type.name)}
                      data-testid={`card-damage-category-${type.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <CardContent className="p-4 flex flex-col items-center gap-2">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          selectedDamageCategory === type.name ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="text-xs text-center font-medium leading-tight">{type.name}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={resetDamageReportDialog} data-testid="button-cancel-damage-step1">
                  Cancel
                </Button>
                <Button 
                  onClick={() => setDamageReportStep(2)}
                  disabled={!selectedDamageCategory}
                  data-testid="button-continue-damage-step1"
                >
                  Continue
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* Step 2: Select Specific Unit */}
          {damageReportStep === 2 && (
            <div className="space-y-4">
              {(() => {
                const categoryItems = ((gearData?.items || []) as any[]).filter(
                  item => item.equipmentType === selectedDamageCategory
                );
                
                if (categoryItems.length === 0) {
                  return (
                    <div className="text-center py-8 space-y-3">
                      <Wrench className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      <p className="text-muted-foreground">No {selectedDamageCategory} items in inventory</p>
                      <Button variant="outline" onClick={() => setDamageReportStep(1)}>
                        Choose Different Category
                      </Button>
                    </div>
                  );
                }
                
                // Build a list of all selectable units across all items
                const allUnits: Array<{
                  item: any;
                  serialEntry?: any;
                  unitIndex?: number;
                  displayName: string;
                  isRetired?: boolean;
                }> = [];
                
                categoryItems.forEach((item) => {
                  const serialEntries = (item.serialEntries || []).filter((s: any) => !s.isRetired);
                  
                  if (serialEntries.length > 0) {
                    // Item has serial numbers - show each as a separate unit
                    serialEntries.forEach((entry: any) => {
                      allUnits.push({
                        item,
                        serialEntry: entry,
                        displayName: `${item.brand || ''} ${item.model || ''} - SN: ${entry.serialNumber}`.trim(),
                        isRetired: entry.isRetired,
                      });
                    });
                  } else if (item.quantity > 0) {
                    // No serial numbers but has quantity - show numbered units
                    for (let i = 0; i < item.quantity; i++) {
                      allUnits.push({
                        item,
                        unitIndex: i,
                        displayName: `${item.brand || ''} ${item.model || ''} - Unit ${i + 1}`.trim(),
                      });
                    }
                  }
                });
                
                if (allUnits.length === 0) {
                  return (
                    <div className="text-center py-8 space-y-3">
                      <Wrench className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      <p className="text-muted-foreground">No available {selectedDamageCategory} units in inventory</p>
                      <Button variant="outline" onClick={() => setDamageReportStep(1)}>
                        Choose Different Category
                      </Button>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                    <p className="text-sm text-muted-foreground mb-3">
                      Select the specific unit that was damaged:
                    </p>
                    {allUnits.map((unit, idx) => {
                      const isSelected = selectedDamageItem?.id === unit.item.id && 
                        ((unit.serialEntry && selectedDamageSerialEntry?.id === unit.serialEntry.id) ||
                         (unit.unitIndex !== undefined && selectedDamageUnitIndex === unit.unitIndex));
                      
                      return (
                        <Card
                          key={`${unit.item.id}-${unit.serialEntry?.id || unit.unitIndex}`}
                          className={`cursor-pointer hover-elevate active-elevate-2 transition-all ${
                            isSelected ? "bg-primary/10 border-primary border-2" : ""
                          }`}
                          onClick={() => {
                            setSelectedDamageItem(unit.item);
                            setSelectedDamageSerialEntry(unit.serialEntry || null);
                            setSelectedDamageUnitIndex(unit.unitIndex ?? null);
                          }}
                          data-testid={`card-damage-unit-${idx}`}
                        >
                          <CardContent className="p-3 flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <div className="font-medium">{unit.displayName}</div>
                              {unit.serialEntry?.dateOfManufacture && (
                                <div className="text-xs text-muted-foreground">
                                  Mfg: {unit.serialEntry.dateOfManufacture}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <span className="material-icons text-primary">check_circle</span>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                );
              })()}
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDamageReportStep(1)} data-testid="button-back-damage-step2">
                  Back
                </Button>
                <Button 
                  onClick={() => setDamageReportStep(3)}
                  disabled={!selectedDamageItem}
                  data-testid="button-continue-damage-step2"
                >
                  Continue
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* Step 3: Damage Details */}
          {damageReportStep === 3 && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Selected Equipment Summary */}
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center">
                      {(() => {
                        const gearType = gearTypes.find(t => t.name === selectedDamageCategory);
                        const IconComponent = gearType?.icon || Shield;
                        return <IconComponent className="h-5 w-5" />;
                      })()}
                    </div>
                    <div>
                      <div className="font-medium">{selectedDamageItem?.brand} {selectedDamageItem?.model}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedDamageCategory}
                        {selectedDamageSerialEntry && ` - SN: ${selectedDamageSerialEntry.serialNumber}`}
                        {selectedDamageUnitIndex !== null && !selectedDamageSerialEntry && ` - Unit ${selectedDamageUnitIndex + 1}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Damage Description */}
              <div className="space-y-2">
                <Label htmlFor="damage-description">Damage Description *</Label>
                <Textarea
                  id="damage-description"
                  placeholder={t('inventory.describeDamage', 'Describe the damage in detail...')}
                  value={damageDescription}
                  onChange={(e) => setDamageDescription(e.target.value)}
                  className="min-h-[100px]"
                  data-testid="textarea-damage-description"
                />
              </div>

              {/* Damage Location */}
              <div className="space-y-2">
                <Label htmlFor="damage-location">Location on Equipment</Label>
                <Input
                  id="damage-location"
                  placeholder={t('inventory.placeholders.damageLocation', 'e.g., Left shoulder strap, buckle area...')}
                  value={damageLocation}
                  onChange={(e) => setDamageLocation(e.target.value)}
                  data-testid="input-damage-location"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Severity */}
                <div className="space-y-2">
                  <Label>Severity *</Label>
                  <Select value={damageSeverity} onValueChange={(v: any) => setDamageSeverity(v)}>
                    <SelectTrigger data-testid="select-damage-severity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor - Cosmetic only</SelectItem>
                      <SelectItem value="moderate">Moderate - Needs repair</SelectItem>
                      <SelectItem value="severe">Severe - Safety concern</SelectItem>
                      <SelectItem value="critical">Critical - Immediate retirement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Discovered Date */}
                <div className="space-y-2">
                  <Label htmlFor="discovered-date">Date Discovered *</Label>
                  <Input
                    id="discovered-date"
                    type="date"
                    value={discoveredDate}
                    onChange={(e) => setDiscoveredDate(e.target.value)}
                    data-testid="input-discovered-date"
                  />
                </div>
              </div>

              {/* Corrective Action */}
              <div className="space-y-2">
                <Label htmlFor="corrective-action">Corrective Action Taken</Label>
                <Textarea
                  id="corrective-action"
                  placeholder={t('inventory.describeRepairs', 'Describe any repairs or actions taken...')}
                  value={correctiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                  data-testid="textarea-corrective-action"
                />
              </div>

              {/* Retire Equipment Section */}
              <Card className={retireEquipment ? "border-red-500/50 bg-red-50/50 dark:bg-red-900/10" : ""}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-5 w-5 ${retireEquipment ? "text-red-500" : "text-muted-foreground"}`} />
                      <Label htmlFor="retire-equipment" className="cursor-pointer font-medium">
                        Retire this equipment
                      </Label>
                    </div>
                    <input
                      id="retire-equipment"
                      type="checkbox"
                      checked={retireEquipment}
                      onChange={(e) => setRetireEquipment(e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300"
                      data-testid="checkbox-retire-equipment"
                    />
                  </div>
                  {retireEquipment && (
                    <div className="space-y-2">
                      <Label htmlFor="retirement-reason">Retirement Reason *</Label>
                      <Textarea
                        id="retirement-reason"
                        placeholder={t('inventory.explainRetirement', 'Explain why this equipment needs to be retired...')}
                        value={retirementReason}
                        onChange={(e) => setRetirementReason(e.target.value)}
                        className="min-h-[80px]"
                        data-testid="textarea-retirement-reason"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="damage-notes">Additional Notes</Label>
                <Textarea
                  id="damage-notes"
                  placeholder={t('inventory.otherInfo', 'Any other relevant information...')}
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  data-testid="textarea-damage-notes"
                />
              </div>

              <DialogFooter className="gap-2 pt-4">
                <Button variant="outline" onClick={() => setDamageReportStep(2)} data-testid="button-back-damage-step3">
                  Back
                </Button>
                <Button 
                  onClick={() => {
                    if (!damageDescription.trim()) {
                      toast({
                        title: "Description Required",
                        description: "Please describe the damage.",
                        variant: "destructive",
                      });
                      return;
                    }
                    if (retireEquipment && !retirementReason.trim()) {
                      toast({
                        title: "Retirement Reason Required",
                        description: "Please provide a reason for retiring this equipment.",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    createDamageReportMutation.mutate({
                      gearItemId: selectedDamageItem?.id,
                      gearSerialNumberId: selectedDamageSerialEntry?.id || null,
                      equipmentCategory: selectedDamageCategory,
                      damageDescription: damageDescription.trim(),
                      damageLocation: damageLocation.trim() || null,
                      damageSeverity,
                      discoveredDate,
                      equipmentRetired: retireEquipment,
                      retirementReason: retireEquipment ? retirementReason.trim() : null,
                      correctiveAction: correctiveAction.trim() || null,
                      notes: damageNotes.trim() || null,
                      serialNumber: selectedDamageSerialEntry?.serialNumber || null,
                    });
                  }}
                  disabled={createDamageReportMutation.isPending}
                  variant={retireEquipment ? "destructive" : "default"}
                  data-testid="button-submit-damage-report"
                >
                  {createDamageReportMutation.isPending 
                    ? "Submitting..." 
                    : retireEquipment 
                      ? "Submit & Retire Equipment" 
                      : "Submit Damage Report"
                  }
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
