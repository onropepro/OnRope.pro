import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { hasFinancialAccess, isManagement, hasPermission } from "@/lib/permissions";
import { getTaxInfo, calculateTax, getTaxLabel, type TaxInfo } from "@shared/taxRates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertQuoteSchema, type QuoteWithServices, type QuoteHistory } from "@shared/schema";
import { 
  Building2, 
  Droplet, 
  Wind, 
  Sparkles, 
  ParkingCircle, 
  Home, 
  ArrowLeft, 
  Plus,
  X,
  Eye,
  CheckCircle2,
  Waves,
  Pipette,
  Edit,
  Image,
  Search,
  Download,
  Paintbrush,
  GripVertical,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Target,
  Clock,
  Trophy,
  XCircle,
  Kanban,
  Mail,
  Send,
  History,
  ChevronDown,
  ChevronRight,
  FileText,
  ArrowRightLeft,
  Users,
  FolderPlus
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { formatTimestampDate } from "@/lib/dateUtils";

// Service types configuration
const SERVICE_TYPES = [
  { 
    id: "window_cleaning", 
    name: "Window Cleaning", 
    icon: Building2,
    description: "Rope access window cleaning",
    requiresElevation: true
  },
  { 
    id: "dryer_vent_cleaning", 
    name: "Exterior Dryer Vent Cleaning", 
    icon: Wind,
    description: "Exterior dryer vent cleaning",
    requiresElevation: true
  },
  { 
    id: "building_wash", 
    name: "Building Wash - Pressure washing", 
    icon: Droplet,
    description: "Building exterior cleaning",
    requiresElevation: true
  },
  { 
    id: "general_pressure_washing", 
    name: "General Pressure Washing", 
    icon: Pipette,
    description: "General pressure washing services",
    requiresElevation: false
  },
  { 
    id: "gutter_cleaning", 
    name: "Gutter Cleaning", 
    icon: Waves,
    description: "Gutter cleaning and maintenance",
    requiresElevation: false
  },
  { 
    id: "parkade", 
    name: "Parkade Cleaning", 
    icon: ParkingCircle,
    description: "Parkade pressure washing",
    requiresElevation: false
  },
  { 
    id: "ground_windows", 
    name: "Ground Windows", 
    icon: Home,
    description: "Ground level window cleaning",
    requiresElevation: false
  },
  { 
    id: "in_suite", 
    name: "In-Suite Dryer Vent", 
    icon: Sparkles,
    description: "In-suite dryer vent service",
    requiresElevation: false
  },
  { 
    id: "painting", 
    name: "Painting", 
    icon: Paintbrush,
    description: "Building exterior painting services",
    requiresElevation: true
  },
  { 
    id: "custom", 
    name: "Custom Service", 
    icon: Plus,
    description: "Create your own custom service",
    requiresElevation: false
  },
];

// Pipeline stages configuration for Kanban board
const PIPELINE_STAGES = [
  { id: "draft", color: "bg-slate-400 dark:bg-slate-500", borderColor: "border-slate-300 dark:border-slate-600", bgColor: "bg-slate-50/50 dark:bg-slate-900/30" },
  { id: "submitted", color: "bg-blue-500", borderColor: "border-blue-200 dark:border-blue-800", bgColor: "bg-blue-50/50 dark:bg-blue-950/30" },
  { id: "review", color: "bg-amber-500", borderColor: "border-amber-200 dark:border-amber-800", bgColor: "bg-amber-50/50 dark:bg-amber-950/30" },
  { id: "negotiation", color: "bg-orange-500", borderColor: "border-orange-200 dark:border-orange-800", bgColor: "bg-orange-50/50 dark:bg-orange-950/30" },
  { id: "won", color: "bg-emerald-500", borderColor: "border-emerald-200 dark:border-emerald-800", bgColor: "bg-emerald-50/50 dark:bg-emerald-950/30" },
  { id: "lost", color: "bg-rose-500", borderColor: "border-rose-200 dark:border-rose-800", bgColor: "bg-rose-50/50 dark:bg-rose-950/30" },
];

// Draggable Quote Card component for Kanban
function DraggableQuoteCard({ quote, onClick }: { quote: QuoteWithServices; onClick: () => void }) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: quote.id,
    data: { quote },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  const totalAmount = parseFloat(quote.totalAmount?.toString() || '0') || 
    quote.services.reduce((sum, s) => sum + parseFloat(s.totalCost?.toString() || '0'), 0);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card border border-border/60 rounded-md p-2 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 ${isDragging ? 'shadow-lg ring-2 ring-primary border-primary' : ''}`}
      {...attributes}
      {...listeners}
      data-testid={`draggable-quote-${quote.id}`}
    >
      <div className="flex items-start gap-1.5 mb-1">
        <GripVertical className="w-3 h-3 text-muted-foreground/50 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[11px] truncate text-foreground leading-tight">{quote.buildingName}</h4>
          <p className="text-[10px] text-muted-foreground truncate">{quote.strataPlanNumber}</p>
        </div>
      </div>
      <div className="space-y-0.5 text-[10px] text-muted-foreground pl-4">
        <p className="truncate">{quote.buildingAddress}</p>
        <div className="flex items-center justify-between gap-1">
          <span className="text-muted-foreground/70">{quote.services.length} svc</span>
          {totalAmount > 0 && (
            <span className="font-semibold text-[11px] text-primary">${totalAmount.toLocaleString()}</span>
          )}
        </div>
      </div>
      <div className="mt-1.5 pt-1 border-t border-border/40 pl-4">
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="text-[10px] font-medium text-primary hover:text-primary/80 transition-colors"
          data-testid={`button-view-quote-${quote.id}`}
        >
          {t('quotes.pipeline.viewDetails', 'View')}
        </button>
      </div>
    </div>
  );
}

// Droppable Stage Column component for Kanban
function StageColumn({ 
  stageId, 
  quotes, 
  onQuoteClick,
  color,
  borderColor,
  bgColor
}: { 
  stageId: string; 
  quotes: QuoteWithServices[]; 
  onQuoteClick: (quote: QuoteWithServices) => void;
  color: string;
  borderColor: string;
  bgColor: string;
}) {
  const { t } = useTranslation();
  const { isOver, setNodeRef } = useDroppable({
    id: stageId,
  });

  const stageName = t(`quotes.pipeline.stages.${stageId}`, stageId.charAt(0).toUpperCase() + stageId.slice(1));
  const totalValue = quotes.reduce((sum, q) => {
    const amount = parseFloat(q.totalAmount?.toString() || '0') || 
      q.services.reduce((s, svc) => s + parseFloat(svc.totalCost?.toString() || '0'), 0);
    return sum + amount;
  }, 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col flex-1 min-w-0 rounded-lg border-2 ${borderColor} ${bgColor} transition-all duration-200 ${isOver ? 'ring-2 ring-primary border-primary shadow-lg scale-[1.01]' : ''}`}
      data-testid={`stage-column-${stageId}`}
    >
      <div className={`flex items-center justify-between gap-1 px-2 py-2 border-b ${borderColor}`}>
        <div className="flex items-center gap-1.5 min-w-0">
          <div className={`w-2 h-2 rounded-full ${color} shadow-sm shrink-0`} />
          <h3 className="font-semibold text-xs text-foreground truncate">{stageName}</h3>
          <Badge variant="outline" className="text-[10px] px-1 py-0 font-medium border-border/60 shrink-0">{quotes.length}</Badge>
        </div>
        {totalValue > 0 && (
          <span className="text-[10px] font-medium text-muted-foreground shrink-0">${totalValue.toLocaleString()}</span>
        )}
      </div>
      <div className="flex-1 space-y-1.5 overflow-y-auto p-1.5">
        {quotes.length === 0 ? (
          <div className={`flex items-center justify-center h-full min-h-[100px] border-2 border-dashed ${borderColor} rounded-md bg-background/50`}>
            <p className="text-[10px] text-muted-foreground/70 text-center px-1">{t('quotes.pipeline.dragHere', 'Drag quotes here')}</p>
          </div>
        ) : (
          quotes.map((quote) => (
            <DraggableQuoteCard
              key={quote.id}
              quote={quote}
              onClick={() => onQuoteClick(quote)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Form schemas
const buildingInfoSchema = z.object({
  buildingName: z.string().min(1, "Building name is required"),
  strataPlanNumber: z.string().min(1, "Strata plan number is required"),
  buildingAddress: z.string().min(1, "Building address is required"),
  floorCount: z.coerce.number().min(1, "Floor count must be at least 1"),
  strataManagerName: z.string().optional(),
  strataManagerAddress: z.string().optional(),
});

const serviceFormSchema = z.object({
  serviceType: z.string(),
  customServiceName: z.string().optional(), // For custom services
  customServiceJobType: z.enum(["rope", "ground"]).optional(), // For custom services - rope vs ground work
  description: z.string().optional(), // Service-specific notes/description
  // Elevation-based fields
  dropsNorth: z.coerce.number().optional(),
  dropsEast: z.coerce.number().optional(),
  dropsSouth: z.coerce.number().optional(),
  dropsWest: z.coerce.number().optional(),
  dropsPerDay: z.coerce.number().optional(),
  // Parkade fields
  parkadeStalls: z.coerce.number().optional(),
  pricePerStall: z.coerce.number().optional(),
  // Ground windows fields
  groundWindowHours: z.coerce.number().optional(),
  // In-suite fields
  suitesPerDay: z.coerce.number().optional(),
  floorsPerDay: z.coerce.number().optional(),
  // Dryer vent pricing option
  dryerVentPricingType: z.enum(["per_hour", "per_unit"]).default("per_hour"),
  dryerVentUnits: z.coerce.number().min(1, "At least 1 unit required").optional(),
  dryerVentPricePerUnit: z.coerce.number().min(0).optional(),
  // General pressure washing / gutter cleaning fields
  simpleServiceHours: z.coerce.number().min(0.1, "At least 0.1 hours required").optional(),
  // Common fields
  pricePerHour: z.coerce.number().min(0).optional(), // Optional for parkade (uses price per stall)
  totalHours: z.coerce.number().optional(),
  totalCost: z.coerce.number().optional(),
});

type BuildingInfoFormData = z.infer<typeof buildingInfoSchema>;
type ServiceFormData = z.infer<typeof serviceFormSchema>;

export default function Quotes() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // View states
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [activeTab, setActiveTab] = useState<"create" | "my-quotes">("my-quotes");
  const [managementTab, setManagementTab] = useState<"list" | "pipeline" | "analytics">("list");
  const [analyticsRange, setAnalyticsRange] = useState<"week" | "month" | "year" | "all">("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [createStep, setCreateStep] = useState<"building" | "services" | "configure">("services");
  const [selectedQuote, setSelectedQuote] = useState<QuoteWithServices | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [quoteToSubmit, setQuoteToSubmit] = useState<QuoteWithServices | null>(null);
  const [editingServices, setEditingServices] = useState<Map<string, ServiceFormData>>(new Map());
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [quoteHistory, setQuoteHistory] = useState<QuoteHistory[]>([]);
  
  // Client & Property selection for autofill
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState<number | null>(null);
  
  // Property Manager selection for quote recipient
  const [selectedPmId, setSelectedPmId] = useState<string | null>(null);
  
  // Form data
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfoFormData | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [configuredServices, setConfiguredServices] = useState<Map<string, ServiceFormData>>(new Map());
  const [serviceBeingConfigured, setServiceBeingConfigured] = useState<string | null>(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  // Tax information based on building address
  const [currentTaxInfo, setCurrentTaxInfo] = useState<TaxInfo | null>(null);
  const [editTaxInfo, setEditTaxInfo] = useState<TaxInfo | null>(null);
  
  // Track which individual tax components are removed (for multi-tax regions like GST+PST)
  const [removedTaxTypes, setRemovedTaxTypes] = useState<Set<'gst' | 'pst' | 'hst' | 'state'>>(new Set());
  const [editRemovedTaxTypes, setEditRemovedTaxTypes] = useState<Set<'gst' | 'pst' | 'hst' | 'state'>>(new Set());
  
  // Helper to get individual tax components from TaxInfo
  const getTaxComponents = (taxInfo: TaxInfo | null, removed: Set<'gst' | 'pst' | 'hst' | 'state'>) => {
    if (!taxInfo) return [];
    const components: { type: 'gst' | 'pst' | 'hst' | 'state'; label: string; rate: number }[] = [];
    
    if (taxInfo.hstRate > 0 && !removed.has('hst')) {
      components.push({ type: 'hst', label: `HST (${taxInfo.hstRate}%)`, rate: taxInfo.hstRate });
    }
    if (taxInfo.gstRate > 0 && !removed.has('gst')) {
      components.push({ type: 'gst', label: `GST (${taxInfo.gstRate}%)`, rate: taxInfo.gstRate });
    }
    if (taxInfo.pstRate > 0 && !removed.has('pst')) {
      const pstLabel = taxInfo.taxType === 'GST+QST' ? 'QST' : (taxInfo.country === 'US' ? 'State Tax' : 'PST');
      components.push({ type: taxInfo.country === 'US' ? 'state' : 'pst', label: `${pstLabel} (${taxInfo.pstRate}%)`, rate: taxInfo.pstRate });
    }
    
    return components;
  };
  
  // Compute effective tax info with removed components zeroed out
  const getEffectiveTaxInfo = (taxInfo: TaxInfo | null, removed: Set<'gst' | 'pst' | 'hst' | 'state'>): TaxInfo | null => {
    if (!taxInfo) return null;
    
    const effectiveGst = removed.has('gst') ? 0 : taxInfo.gstRate;
    const effectivePst = (removed.has('pst') || removed.has('state')) ? 0 : taxInfo.pstRate;
    const effectiveHst = removed.has('hst') ? 0 : taxInfo.hstRate;
    const effectiveTotal = effectiveGst + effectivePst + effectiveHst;
    
    if (effectiveTotal === 0) return null;
    
    return {
      ...taxInfo,
      gstRate: effectiveGst,
      pstRate: effectivePst,
      hstRate: effectiveHst,
      totalRate: effectiveTotal,
    };
  };
  
  // Custom adjustments (additional fees/taxes)
  type CustomAdjustment = {
    id: string;
    name: string;
    type: 'fixed' | 'percentage';
    value: number;
  };
  const [customAdjustments, setCustomAdjustments] = useState<CustomAdjustment[]>([]);
  const [editCustomAdjustments, setEditCustomAdjustments] = useState<CustomAdjustment[]>([]);
  
  // Helper function to detect tax from a full address string
  const detectTaxFromAddress = (address: string): TaxInfo | null => {
    if (!address) return null;
    
    // Canadian province codes and names
    const canadianProvinces = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland', 'Nova Scotia', 
      'Northwest Territories', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'];
    
    // US state codes
    const usStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
      'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
    
    // Try to detect country first
    const isCanada = /canada/i.test(address);
    const isUSA = /\b(USA|United States|US)\b/i.test(address);
    
    // Parse address parts
    const parts = address.split(',').map(p => p.trim());
    
    // Look for province/state in address parts
    for (const part of parts) {
      // Check for Canadian provinces (format: "BC V2R 4P4" or just "BC")
      for (const prov of canadianProvinces) {
        const regex = new RegExp(`\\b${prov}\\b`, 'i');
        if (regex.test(part)) {
          const taxInfo = getTaxInfo(prov, 'Canada');
          if (taxInfo) return taxInfo;
        }
      }
      
      // Check for US states (format: "CA 90210" or just "CA")
      if (!isCanada) {
        for (const state of usStates) {
          const regex = new RegExp(`\\b${state}\\b`, 'i');
          if (regex.test(part)) {
            const taxInfo = getTaxInfo(state, 'US');
            if (taxInfo) return taxInfo;
          }
        }
      }
    }
    
    return null;
  };

  // Building info form
  const buildingForm = useForm<BuildingInfoFormData>({
    resolver: zodResolver(buildingInfoSchema),
    defaultValues: {
      buildingName: "",
      strataPlanNumber: "",
      buildingAddress: "",
    },
  });

  // Edit form for quote metadata (separate from creation flow)
  const editForm = useForm<BuildingInfoFormData>({
    resolver: zodResolver(buildingInfoSchema),
    defaultValues: {
      buildingName: "",
      strataPlanNumber: "",
      buildingAddress: "",
      floorCount: undefined,
      strataManagerName: "",
      strataManagerAddress: "",
    },
  });

  // Service configuration form
  const serviceForm = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
  });

  // Fetch current user to check permissions
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;
  
  // Check if user can view financial data using centralized permission helper
  const canViewFinancialData = hasFinancialAccess(currentUser);
  
  // Check if user can edit quotes using centralized permission helpers
  const canEditQuotes = isManagement(currentUser) || hasPermission(currentUser, 'edit_quotes');

  // Fetch quotes - backend filters financial data for unauthorized users
  const { data: quotesData, isLoading } = useQuery<{ quotes: QuoteWithServices[] }>({
    queryKey: ["/api/quotes"],
  });

  // Fetch clients for property manager dropdown
  const { data: clientsData } = useQuery<{ clients: any[] }>({
    queryKey: ["/api/clients"],
  });

  const clients = clientsData?.clients || [];
  
  // Fetch linked property managers for quote recipient dropdown
  const { data: linkedPMsData } = useQuery<Array<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    smsOptIn: boolean;
    strataNumber: string | null;
  }>>({
    queryKey: ["/api/property-managers/linked"],
  });
  
  const linkedPMs = linkedPMsData || [];

  // Create quote mutation
  const createQuoteMutation = useMutation({
    mutationFn: async () => {
      if (!buildingInfo) throw new Error("Building info required");
      
      // Convert configured services Map to array with string conversions for numeric fields
      const services = Array.from(configuredServices.entries()).map(([serviceType, serviceData]) => {
        const totalCost = serviceType === "parkade" 
          ? (serviceData.parkadeStalls || 0) * (serviceData.pricePerStall || 0)
          : serviceData.totalCost;
        
        return {
          serviceType,
          ...serviceData,
          // Convert numeric fields to strings for PostgreSQL numeric columns
          pricePerHour: serviceData.pricePerHour != null ? String(serviceData.pricePerHour) : undefined,
          pricePerStall: serviceData.pricePerStall != null ? String(serviceData.pricePerStall) : undefined,
          dryerVentPricePerUnit: serviceData.dryerVentPricePerUnit != null ? String(serviceData.dryerVentPricePerUnit) : undefined,
          groundWindowHours: serviceData.groundWindowHours != null ? String(serviceData.groundWindowHours) : undefined,
          simpleServiceHours: serviceData.simpleServiceHours != null ? String(serviceData.simpleServiceHours) : undefined,
          totalHours: serviceData.totalHours != null ? String(serviceData.totalHours) : undefined,
          totalCost: totalCost != null ? String(totalCost) : undefined,
        };
      });
      
      // Calculate totals and tax (use effective tax info with removed taxes zeroed out)
      const subtotal = services.reduce((sum, s) => sum + Number(s.totalCost || 0), 0);
      let taxData: any = {};
      
      const effectiveTax = getEffectiveTaxInfo(currentTaxInfo, removedTaxTypes);
      if (effectiveTax) {
        const taxCalc = calculateTax(subtotal, effectiveTax);
        taxData = {
          taxRegion: effectiveTax.region,
          taxCountry: effectiveTax.country,
          taxType: effectiveTax.taxType,
          gstRate: String(effectiveTax.gstRate),
          pstRate: String(effectiveTax.pstRate),
          hstRate: String(effectiveTax.hstRate),
          gstAmount: String(taxCalc.gstAmount),
          pstAmount: String(taxCalc.pstAmount),
          hstAmount: String(taxCalc.hstAmount),
          totalTax: String(taxCalc.totalTax),
          grandTotal: String(taxCalc.grandTotal),
        };
      }
      
      // Create quote with services in a single atomic request
      const quoteResponse = await apiRequest("POST", "/api/quotes", {
        buildingName: buildingInfo.buildingName,
        strataPlanNumber: buildingInfo.strataPlanNumber,
        buildingAddress: buildingInfo.buildingAddress,
        floorCount: buildingInfo.floorCount,
        strataManagerName: buildingInfo.strataManagerName,
        strataManagerAddress: buildingInfo.strataManagerAddress,
        clientId: selectedClientId, // Save client reference for project conversion
        recipientPropertyManagerId: selectedPmId, // Manually selected PM to send quote to
        status: "open",
        services, // Include services array
        totalAmount: String(subtotal),
        ...taxData, // Include tax information
      });
      
      const { quote } = await quoteResponse.json();
      return quote;
    },
    onSuccess: async (quote) => {
      // Upload photo if one was selected
      if (selectedPhotoFile) {
        try {
          setUploadingPhoto(true);
          const formData = new FormData();
          formData.append('photo', selectedPhotoFile);
          
          const uploadResponse = await fetch(`/api/quotes/${quote.id}/photo`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload photo');
          }
        } catch (error) {
          console.error('Photo upload error:', error);
          toast({
            variant: "destructive",
            title: "Photo upload failed",
            description: "Quote was created but photo upload failed.",
          });
        } finally {
          setUploadingPhoto(false);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      
      // Check if user is a worker - navigate to My Quotes tab
      const isWorker = ["rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"].includes(currentUser?.role || "");
      toast({
        title: "Quote created",
        description: "The quote has been created successfully.",
      });
      resetForm();
      if (isWorker) {
        setActiveTab("my-quotes");
      }
      setView("list");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create quote",
      });
    },
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/quotes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({
        title: "Quote deleted",
        description: "The quote has been deleted successfully.",
      });
      setView("list");
    },
  });

  const closeQuoteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/quotes/${id}`, { status: "closed" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({
        title: "Quote closed",
        description: "The quote has been marked as closed.",
      });
    },
  });

  const loadQuoteHistory = async (quoteId: string) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/history`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setQuoteHistory(data.history || []);
      }
    } catch (error) {
      console.error("Failed to load quote history:", error);
    }
  };

  const submitQuoteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/quotes/${id}/status`, { status: "submitted" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      setIsSubmitDialogOpen(false);
      setQuoteToSubmit(null);
      if (selectedQuote) {
        setSelectedQuote({ ...selectedQuote, status: "submitted" });
      }
      toast({
        title: "Quote submitted",
        description: "The quote has been submitted to management for review.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message || "Failed to submit quote",
      });
    },
  });

  // Edit quote mutation (building metadata and services)
  const editQuoteMutation = useMutation({
    mutationFn: async (data: BuildingInfoFormData) => {
      if (!selectedQuote) throw new Error("No quote selected");
      
      // Convert editingServices Map to array with string conversions for numeric fields
      const services = Array.from(editingServices.entries()).map(([serviceType, serviceData]) => {
        const totalCost = serviceType === "parkade" 
          ? (serviceData.parkadeStalls || 0) * (serviceData.pricePerStall || 0)
          : serviceData.totalCost;
        
        return {
          serviceType,
          ...serviceData,
          // Convert numeric fields to strings for PostgreSQL numeric columns
          pricePerHour: serviceData.pricePerHour?.toString(),
          pricePerStall: serviceData.pricePerStall?.toString(),
          dryerVentPricePerUnit: serviceData.dryerVentPricePerUnit?.toString(),
          totalHours: serviceData.totalHours?.toString(),
          totalCost: totalCost?.toString(),
          groundWindowHours: serviceData.groundWindowHours?.toString(),
          simpleServiceHours: serviceData.simpleServiceHours?.toString(),
        };
      });
      
      // Calculate totals and tax for edit
      const subtotal = services.reduce((sum, s) => sum + Number(s.totalCost || 0), 0);
      let taxData: any = {};
      
      if (editTaxInfo) {
        const taxCalc = calculateTax(subtotal, editTaxInfo);
        taxData = {
          taxRegion: editTaxInfo.region,
          taxCountry: editTaxInfo.country,
          taxType: editTaxInfo.taxType,
          gstRate: String(editTaxInfo.gstRate),
          pstRate: String(editTaxInfo.pstRate),
          hstRate: String(editTaxInfo.hstRate),
          gstAmount: String(taxCalc.gstAmount),
          pstAmount: String(taxCalc.pstAmount),
          hstAmount: String(taxCalc.hstAmount),
          totalTax: String(taxCalc.totalTax),
          grandTotal: String(taxCalc.grandTotal),
        };
      }
      
      const payload = {
        ...data,
        services,
        totalAmount: String(subtotal),
        ...taxData, // Include tax information if available
      };
      
      const response = await apiRequest("PATCH", `/api/quotes/${selectedQuote.id}`, payload);
      return response.json();
    },
    onSuccess: async (data: any) => {
      // Upload photo if one was selected
      if (editPhotoFile && selectedQuote) {
        try {
          setUploadingPhoto(true);
          const formData = new FormData();
          formData.append('photo', editPhotoFile);
          
          const uploadResponse = await fetch(`/api/quotes/${selectedQuote.id}/photo`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload photo');
          }
          
          const uploadData = await uploadResponse.json();
          // Update selectedQuote with new photoUrl
          if (uploadData.photoUrl && data.quote) {
            data.quote.photoUrl = uploadData.photoUrl;
          }
        } catch (error) {
          console.error('Photo upload error:', error);
          toast({
            variant: "destructive",
            title: "Photo upload failed",
            description: "Quote was updated but photo upload failed.",
          });
        } finally {
          setUploadingPhoto(false);
          setEditPhotoFile(null);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      // Update selected quote with new data
      if (data.quote) {
        setSelectedQuote(data.quote);
      }
      setIsEditDialogOpen(false);
      toast({
        title: "Quote updated",
        description: "The quote has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update quote",
        variant: "destructive",
      });
    },
  });

  // Pipeline stage update mutation for Kanban drag-and-drop
  const updateStageMutation = useMutation({
    mutationFn: async ({ quoteId, pipelineStage }: { quoteId: string; pipelineStage: string }) => {
      await apiRequest("PATCH", `/api/quotes/${quoteId}/stage`, { pipelineStage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes/analytics", { range: analyticsRange }] });
    },
    onError: (error: any) => {
      toast({
        title: t('quotes.pipeline.updateFailed', 'Update failed'),
        description: error.message || t('quotes.pipeline.updateFailedDesc', 'Failed to update quote stage'),
        variant: "destructive",
      });
    },
  });

  // Email quote mutation
  const emailQuoteMutation = useMutation({
    mutationFn: async ({ quoteId, recipientEmail, message, subject }: { 
      quoteId: string; 
      recipientEmail: string; 
      message?: string;
      subject?: string;
    }) => {
      const response = await apiRequest("POST", `/api/quotes/${quoteId}/email`, { 
        recipientEmail, 
        message,
        subject 
      });
      return response;
    },
    onSuccess: () => {
      setIsEmailDialogOpen(false);
      setEmailRecipient("");
      setEmailMessage("");
      setEmailSubject("");
      toast({
        title: t('quotes.email.success', 'Quote sent'),
        description: t('quotes.email.successDesc', 'The quote has been emailed successfully.'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('quotes.email.failed', 'Send failed'),
        description: error.message || t('quotes.email.failedDesc', 'Failed to send quote email'),
        variant: "destructive",
      });
    },
  });

  // Fetch quote analytics
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery<{
    range: string;
    totalQuotes: number;
    wonCount: number;
    lostCount: number;
    pendingCount: number;
    wonAmount: number;
    lostAmount: number;
    pendingAmount: number;
    totalAmount: number;
    winRate: number;
    stageBreakdown: Record<string, number>;
  }>({
    queryKey: ["/api/quotes/analytics", { range: analyticsRange }],
    queryFn: async () => {
      const response = await fetch(`/api/quotes/analytics?range=${analyticsRange}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      return response.json();
    },
    enabled: managementTab === "analytics" && !["rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"].includes(currentUser?.role || ""),
  });

  // Group quotes by pipeline stage for Kanban view
  const quotesByStage = useMemo(() => {
    const quotes = quotesData?.quotes || [];
    const grouped: Record<string, QuoteWithServices[]> = {};
    
    PIPELINE_STAGES.forEach(stage => {
      grouped[stage.id] = [];
    });
    
    quotes.forEach(quote => {
      const stage = (quote as any).pipelineStage || 'draft';
      if (grouped[stage]) {
        grouped[stage].push(quote);
      } else {
        // Log unexpected pipeline stage for debugging data integrity issues
        console.warn(`Quote ${quote.id} has unexpected pipeline stage: "${stage}". Defaulting to draft.`);
        grouped['draft'].push(quote);
      }
    });
    
    return grouped;
  }, [quotesData?.quotes]);

  // Handle drag end for pipeline stage change
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    const quoteId = active.id as string;
    const newStage = over.id as string;
    
    // Find the quote being moved
    const quote = quotesData?.quotes?.find(q => q.id === quoteId);
    if (!quote) return;
    
    const currentStage = (quote as any).pipelineStage || 'draft';
    if (currentStage === newStage) return;
    
    // Update the stage
    updateStageMutation.mutate({ quoteId, pipelineStage: newStage });
    
    toast({
      title: t('quotes.pipeline.stageMoved', 'Quote moved'),
      description: t('quotes.pipeline.stageMovedDesc', 'Quote moved to {{stage}}', { 
        stage: t(`quotes.pipeline.stages.${newStage}`, newStage) 
      }),
    });
  };

  const resetForm = () => {
    setBuildingInfo(null);
    setSelectedServices([]);
    setConfiguredServices(new Map());
    setServiceBeingConfigured(null);
    setSelectedPhotoFile(null);
    setSelectedClientId(null);
    setSelectedPropertyIndex(null);
    setSelectedPmId(null); // Reset PM selection
    setCreateStep("services");
    setCurrentTaxInfo(null); // Reset tax info when starting a new quote
    setRemovedTaxTypes(new Set()); // Reset removed tax types
    setCustomAdjustments([]); // Reset custom adjustments
    buildingForm.reset();
    serviceForm.reset();
  };

  // Handle converting a won quote to a project
  const handleConvertToProject = (quote: QuoteWithServices) => {
    // Find the primary service type from the quote's services
    const primaryService = quote.services[0];
    let jobType = "window_cleaning";
    let customJobType = "";
    
    // Map quote service types to project job types
    if (primaryService) {
      const serviceTypeMap: Record<string, string> = {
        "window_cleaning": "window_cleaning",
        "dryer_vent_cleaning": "dryer_vent_cleaning", 
        "building_wash": "building_wash",
        "general_pressure_washing": "general_pressure_washing",
        "gutter_cleaning": "gutter_cleaning",
        "in_suite": "in_suite_dryer_vent_cleaning",
        "parkade": "parkade_pressure_cleaning",
        "ground_windows": "ground_window_cleaning",
        "painting": "painting",
        "custom": "other"
      };
      
      jobType = serviceTypeMap[primaryService.serviceType] || "other";
      if (jobType === "other" && primaryService.customServiceName) {
        customJobType = primaryService.customServiceName;
      }
    }
    
    // Get elevation drops from the primary service if available
    const dropsNorth = primaryService?.dropsNorth?.toString() || "";
    const dropsEast = primaryService?.dropsEast?.toString() || "";
    const dropsSouth = primaryService?.dropsSouth?.toString() || "";
    const dropsWest = primaryService?.dropsWest?.toString() || "";
    const dropsPerDay = primaryService?.dropsPerDay?.toString() || "";
    
    // Store quote data in sessionStorage for the project form to use
    const projectData = {
      strataPlanNumber: quote.strataPlanNumber || "",
      buildingName: quote.buildingName || "",
      buildingAddress: quote.buildingAddress || "",
      floorCount: quote.floorCount?.toString() || "",
      jobType,
      customJobType,
      totalDropsNorth: dropsNorth,
      totalDropsEast: dropsEast,
      totalDropsSouth: dropsSouth,
      totalDropsWest: dropsWest,
      dailyDropTarget: dropsPerDay,
      quoteId: quote.id,
      quoteNumber: quote.quoteNumber || "",
      clientId: quote.clientId || "", // Pass client reference for project creation
    };
    
    sessionStorage.setItem('quoteToProject', JSON.stringify(projectData));
    
    toast({
      title: t('quotes.convertToProject.navigating', 'Opening Project Form'),
      description: t('quotes.convertToProject.prefilled', 'Building details will be prefilled from the quote'),
    });
    
    // Navigate to dashboard with projects tab and trigger create
    setLocation("/dashboard?tab=projects&action=create&fromQuote=true");
  };

  const handleBuildingInfoSubmit = (data: BuildingInfoFormData) => {
    setBuildingInfo(data);
    // Trigger quote creation after building info is captured
    createQuoteMutation.mutate();
  };

  const handleServiceToggle = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      // Remove service
      setSelectedServices(selectedServices.filter(s => s !== serviceId));
      const newConfigured = new Map(configuredServices);
      newConfigured.delete(serviceId);
      setConfiguredServices(newConfigured);
    } else {
      // Add service
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleConfigureService = (serviceId: string) => {
    const service = SERVICE_TYPES.find(s => s.id === serviceId);
    if (!service) return;

    const existingConfig = configuredServices.get(serviceId);
    
    serviceForm.reset({
      serviceType: serviceId,
      customServiceName: existingConfig?.customServiceName,
      customServiceJobType: existingConfig?.customServiceJobType,
      description: existingConfig?.description,
      dropsNorth: existingConfig?.dropsNorth,
      dropsEast: existingConfig?.dropsEast,
      dropsSouth: existingConfig?.dropsSouth,
      dropsWest: existingConfig?.dropsWest,
      dropsPerDay: existingConfig?.dropsPerDay,
      parkadeStalls: existingConfig?.parkadeStalls,
      pricePerStall: existingConfig?.pricePerStall,
      groundWindowHours: existingConfig?.groundWindowHours,
      suitesPerDay: existingConfig?.suitesPerDay,
      floorsPerDay: existingConfig?.floorsPerDay,
      dryerVentPricingType: existingConfig?.dryerVentPricingType ?? "per_hour",
      dryerVentUnits: existingConfig?.dryerVentUnits,
      dryerVentPricePerUnit: existingConfig?.dryerVentPricePerUnit,
      simpleServiceHours: existingConfig?.simpleServiceHours,
      pricePerHour: existingConfig?.pricePerHour,
      totalHours: existingConfig?.totalHours,
      totalCost: existingConfig?.totalCost,
    });

    setServiceBeingConfigured(serviceId);
    setCreateStep("configure");
  };

  const handleServiceFormSubmit = (data: ServiceFormData) => {
    if (!serviceBeingConfigured) return;

    const service = SERVICE_TYPES.find(s => s.id === serviceBeingConfigured);
    if (!service) return;

    // Validate custom service requires job type selection
    if (serviceBeingConfigured === "custom" && !data.customServiceJobType) {
      toast({
        title: "Job Type Required",
        description: "Please select whether this is a rope access or ground work job.",
        variant: "destructive",
      });
      return;
    }

    // Calculate totals
    let totalHours: number | undefined = 0;
    let totalCost = 0;

    if (serviceBeingConfigured === "dryer_vent_cleaning") {
      // Dryer vent can be priced per hour OR per unit
      if (data.dryerVentPricingType === "per_unit") {
        totalCost = (data.dryerVentUnits || 0) * (data.dryerVentPricePerUnit || 0);
        totalHours = undefined; // Not tracking hours for per-unit pricing
      } else {
        // Per hour pricing - uses the standard elevation drop logic
        const totalDrops = (data.dropsNorth || 0) + (data.dropsEast || 0) + 
                          (data.dropsSouth || 0) + (data.dropsWest || 0);
        const dropsPerDay = data.dropsPerDay || 1;
        const days = totalDrops / dropsPerDay;
        totalHours = days * 8;
        totalCost = totalHours * (data.pricePerHour || 0);
      }
    } else if (service.requiresElevation) {
      const totalDrops = (data.dropsNorth || 0) + (data.dropsEast || 0) + 
                        (data.dropsSouth || 0) + (data.dropsWest || 0);
      const dropsPerDay = data.dropsPerDay || 1;
      const days = totalDrops / dropsPerDay;
      totalHours = days * 8;
      totalCost = totalHours * (data.pricePerHour || 0);
    } else if (serviceBeingConfigured === "parkade") {
      // Parkade uses stalls * price per stall (no hourly pricing)
      totalCost = (data.parkadeStalls || 0) * (data.pricePerStall || 0);
      totalHours = undefined; // Parkade doesn't track hours
    } else if (serviceBeingConfigured === "ground_windows") {
      totalHours = data.groundWindowHours || 0;
      totalCost = totalHours * (data.pricePerHour || 0);
    } else if (serviceBeingConfigured === "general_pressure_washing" || serviceBeingConfigured === "gutter_cleaning") {
      // Simple ground services: hours + price per hour
      totalHours = data.simpleServiceHours || 0;
      totalCost = totalHours * (data.pricePerHour || 0);
    } else if (serviceBeingConfigured === "custom") {
      // Custom service - check if rope or ground job
      if (data.customServiceJobType === "rope") {
        // Rope job uses elevation drop logic like window cleaning
        const totalDrops = (data.dropsNorth || 0) + (data.dropsEast || 0) + 
                          (data.dropsSouth || 0) + (data.dropsWest || 0);
        const dropsPerDay = data.dropsPerDay || 1;
        const days = totalDrops / dropsPerDay;
        totalHours = days * 8;
        totalCost = totalHours * (data.pricePerHour || 0);
      } else {
        // Ground job uses simple hours
        totalHours = data.simpleServiceHours || 0;
        totalCost = totalHours * (data.pricePerHour || 0);
      }
    } else if (serviceBeingConfigured === "in_suite") {
      if (data.floorsPerDay) {
        const days = (buildingInfo?.floorCount || 1) / data.floorsPerDay;
        totalHours = days * 8;
      } else if (data.suitesPerDay) {
        const estimatedSuites = (buildingInfo?.floorCount || 1) * 10;
        const days = estimatedSuites / data.suitesPerDay;
        totalHours = days * 8;
      }
      totalCost = totalHours * (data.pricePerHour || 0);
    }

    const newConfigured = new Map(configuredServices);
    
    // Build configData based on service type
    let configData: ServiceFormData;
    
    if (serviceBeingConfigured === "parkade") {
      configData = {
        serviceType: data.serviceType,
        description: data.description,
        parkadeStalls: data.parkadeStalls,
        pricePerStall: data.pricePerStall,
        totalCost,
      } as ServiceFormData;
    } else if (serviceBeingConfigured === "dryer_vent_cleaning" && data.dryerVentPricingType === "per_unit") {
      configData = {
        serviceType: data.serviceType,
        description: data.description,
        dryerVentPricingType: data.dryerVentPricingType,
        dryerVentUnits: data.dryerVentUnits,
        dryerVentPricePerUnit: data.dryerVentPricePerUnit,
        totalCost,
      } as ServiceFormData;
    } else if (serviceBeingConfigured === "general_pressure_washing" || serviceBeingConfigured === "gutter_cleaning") {
      configData = {
        serviceType: data.serviceType,
        description: data.description,
        simpleServiceHours: data.simpleServiceHours,
        pricePerHour: data.pricePerHour,
        totalHours,
        totalCost,
      } as ServiceFormData;
    } else if (serviceBeingConfigured === "custom") {
      // Custom service - include job type and relevant fields
      if (data.customServiceJobType === "rope") {
        configData = {
          serviceType: data.serviceType,
          description: data.description,
          customServiceName: data.customServiceName,
          customServiceJobType: data.customServiceJobType,
          dropsNorth: data.dropsNorth,
          dropsEast: data.dropsEast,
          dropsSouth: data.dropsSouth,
          dropsWest: data.dropsWest,
          dropsPerDay: data.dropsPerDay,
          pricePerHour: data.pricePerHour,
          totalHours,
          totalCost,
        } as ServiceFormData;
      } else {
        configData = {
          serviceType: data.serviceType,
          description: data.description,
          customServiceName: data.customServiceName,
          customServiceJobType: data.customServiceJobType,
          simpleServiceHours: data.simpleServiceHours,
          pricePerHour: data.pricePerHour,
          totalHours,
          totalCost,
        } as ServiceFormData;
      }
    } else {
      // For all other services (elevation-based, ground_windows, in_suite)
      configData = {
        ...data,
        totalHours,
        totalCost,
      };
    }
    
    newConfigured.set(serviceBeingConfigured, configData);
    setConfiguredServices(newConfigured);
    setServiceBeingConfigured(null);
    setCreateStep("services");
  };

  const calculateQuoteTotal = () => {
    let total = 0;
    for (const [, serviceData] of configuredServices) {
      total += serviceData.totalCost || 0;
    }
    return total;
  };

  const canFinalize = selectedServices.length > 0 && 
    selectedServices.every(s => configuredServices.has(s));

  // Check if user is a worker
  const isWorker = ["rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"].includes(currentUser?.role || "");
  
  // Download quote as professional PDF
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  
  const downloadQuote = async (quote: QuoteWithServices) => {
    if (!canViewFinancialData) {
      toast({
        title: t('quotes.pdf.noAccess', 'Access Denied'),
        description: t('quotes.pdf.noAccessDesc', 'Financial data access required to download quotes.'),
        variant: "destructive",
      });
      return;
    }
    
    setIsDownloadingPdf(true);
    try {
      const response = await fetch(`/api/quotes/${quote.id}/pdf`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate PDF');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quote-${quote.strataPlanNumber}-${quote.buildingName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: t('quotes.pdf.success', 'PDF Downloaded'),
        description: t('quotes.pdf.successDesc', 'Your quote has been downloaded as a PDF.'),
      });
    } catch (error: any) {
      console.error('PDF download error:', error);
      toast({
        title: t('quotes.pdf.error', 'Download Failed'),
        description: error.message || t('quotes.pdf.errorDesc', 'Failed to download the quote PDF. Please try again.'),
        variant: "destructive",
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };
  
  // Filter and sort quotes
  const filteredQuotes = (quotesData?.quotes || [])
    .filter(quote => 
      quote.strataPlanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.buildingName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  // Render list view
  if (view === "list") {
    // If worker, show tabbed interface
    if (isWorker) {
      return (
        <div className="min-h-screen bg-background p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">{t('quotes.pageTitle', 'Quotes')}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">{t('quotes.pageSubtitle', 'Create and manage service quotes for buildings')}</p>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "create" | "my-quotes")}>
              <TabsList className="mb-6">
                <TabsTrigger value="my-quotes" data-testid="tab-my-quotes">{t('quotes.myQuotes', 'My Quotes')}</TabsTrigger>
                <TabsTrigger value="create" data-testid="tab-create">{t('quotes.createQuote', 'Create Quote')}</TabsTrigger>
              </TabsList>

              <TabsContent value="my-quotes">
                {/* Search bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={t('quotes.searchPlaceholder', 'Search by strata/job number or site name...')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-quotes"
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">{t('quotes.loading', 'Loading quotes...')}</p>
                  </div>
                ) : filteredQuotes.length === 0 ? (
                  <Card className="rounded-2xl shadow-lg border border-border">
                    <CardContent className="p-12 text-center">
                      <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {searchQuery ? t('quotes.noQuotesFound', 'No quotes found') : t('quotes.noQuotesYet', 'No quotes yet')}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {searchQuery ? t('quotes.tryDifferentSearch', 'Try a different search term') : t('quotes.createFirstQuote', 'Create your first service quote to get started')}
                      </p>
                      {!searchQuery && (
                        <Button
                          onClick={() => setActiveTab("create")}
                          className="bg-primary hover:bg-primary/90"
                          data-testid="button-create-first-quote"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {t('quotes.createQuote', 'Create Quote')}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredQuotes.map((quote) => (
                      <Card
                        key={quote.id}
                        className="rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow cursor-pointer"
                        onClick={() => {
                          setSelectedQuote(quote);
                          setView("detail");
                        }}
                        data-testid={`card-quote-${quote.id}`}
                      >
                        <CardHeader className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-xl font-semibold text-foreground">
                                  {quote.buildingName}
                                </CardTitle>
                                {quote.quoteNumber && (
                                  <Badge variant="outline" className="text-xs font-medium">
                                    {quote.quoteNumber}
                                  </Badge>
                                )}
                              </div>
                              <CardDescription className="text-muted-foreground">
                                {quote.strataPlanNumber}
                              </CardDescription>
                            </div>
                            <Badge
                              className={`rounded-full px-3 py-1 ${
                                quote.status === "open"
                                  ? "bg-chart-2 text-white"
                                  : quote.status === "draft"
                                  ? "bg-muted-foreground text-white"
                                  : "bg-success text-white"
                              }`}
                              data-testid={`badge-status-${quote.id}`}
                            >
                              {quote.status}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p>{quote.buildingAddress}</p>
                            <p>{quote.floorCount} {t('quotes.floors', 'floors')}</p>
                            {quote.createdAt && (
                              <p className="text-xs">
                                {formatTimestampDate(quote.createdAt)}
                              </p>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{t('quotes.services', 'Services')}:</span>
                              <Badge variant="outline" data-testid={`badge-service-count-${quote.id}`}>
                                {quote.services.length}
                              </Badge>
                            </div>
                            {(() => {
                              const subtotal = quote.services.reduce((sum, s) => sum + Number(s.totalCost || 0), 0);
                              const totalTax = Number(quote.totalTax || 0);
                              const grandTotal = Number(quote.grandTotal || 0) || subtotal;
                              const hasTax = totalTax > 0;
                              
                              return (
                                <div className="space-y-1 pt-2 border-t border-border/50">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{t('quotes.subtotal', 'Subtotal')}:</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                  </div>
                                  {hasTax && (
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">{t('quotes.tax', 'Tax')}:</span>
                                      <span className="font-medium">${totalTax.toFixed(2)}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground font-medium">{t('quotes.total', 'Total')}:</span>
                                    <span className="text-2xl font-bold text-primary">
                                      ${(hasTax ? grandTotal : subtotal).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="create">
                <Card className="rounded-2xl shadow-lg border border-border">
                  <CardContent className="p-12 text-center">
                    <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Create a new quote</h3>
                    <p className="text-muted-foreground mb-6">Start creating a service quote for a building</p>
                    <Button
                      onClick={() => {
                        resetForm();
                        setView("create");
                      }}
                      className="bg-primary hover:bg-primary/90"
                      data-testid="button-create-quote"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('quotes.newQuote', 'New Quote')}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      );
    }

    // Management view with tabs for List, Pipeline, and Analytics
    return (
      <div className="h-screen bg-background p-4 md:p-6 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0 max-w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('quotes.pageTitle', 'Quotes')}</h1>
              <p className="text-xs text-muted-foreground">{t('quotes.pageSubtitle', 'Create and manage service quotes for buildings')}</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setView("create");
              }}
              className="bg-primary hover:bg-primary/90"
              data-testid="button-create-quote"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('quotes.newQuote', 'New Quote')}
            </Button>
          </div>

          {/* Management Tabs */}
          <Tabs value={managementTab} onValueChange={(value) => setManagementTab(value as "list" | "pipeline" | "analytics")} className="flex-1 flex flex-col min-h-0">
            <TabsList className="mb-3">
              <TabsTrigger value="list" data-testid="tab-list">
                <Building2 className="w-4 h-4 mr-2" />
                {t('quotes.tabs.list', 'All Quotes')}
              </TabsTrigger>
              <TabsTrigger value="pipeline" data-testid="tab-pipeline">
                <Kanban className="w-4 h-4 mr-2" />
                {t('quotes.tabs.pipeline', 'Pipeline')}
              </TabsTrigger>
              <TabsTrigger value="analytics" data-testid="tab-analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                {t('quotes.tabs.analytics', 'Analytics')}
              </TabsTrigger>
            </TabsList>

            {/* List Tab */}
            <TabsContent value="list">
              {/* Search bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t('quotes.searchPlaceholder', 'Search by strata/job number or site name...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-quotes"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('quotes.loading', 'Loading quotes...')}</p>
                </div>
              ) : filteredQuotes.length === 0 ? (
                <Card className="rounded-2xl shadow-lg border border-border">
                  <CardContent className="p-12 text-center">
                    <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {searchQuery ? t('quotes.noQuotesFound', 'No quotes found') : t('quotes.noQuotesYet', 'No quotes yet')}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery ? t('quotes.tryDifferentSearch', 'Try a different search term') : t('quotes.createFirstQuote', 'Create your first service quote to get started')}
                    </p>
                    {!searchQuery && (
                      <Button
                        onClick={() => {
                          resetForm();
                          setView("create");
                        }}
                        className="bg-primary hover:bg-primary/90"
                        data-testid="button-create-first-quote"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('quotes.createQuote', 'Create Quote')}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredQuotes.map((quote) => (
                    <Card
                      key={quote.id}
                      className="rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedQuote(quote);
                        setView("detail");
                      }}
                      data-testid={`card-quote-${quote.id}`}
                    >
                      <CardHeader className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-xl font-semibold text-foreground">
                                {quote.buildingName}
                              </CardTitle>
                              {quote.quoteNumber && (
                                <Badge variant="outline" className="text-xs font-medium">
                                  {quote.quoteNumber}
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-muted-foreground">
                              {quote.strataPlanNumber}
                            </CardDescription>
                          </div>
                          <Badge
                            className={`rounded-full px-3 py-1 ${
                              quote.status === "open"
                                ? "bg-chart-2 text-white"
                                : quote.status === "draft"
                                ? "bg-muted-foreground text-white"
                                : "bg-success text-white"
                            }`}
                            data-testid={`badge-status-${quote.id}`}
                          >
                            {quote.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>{quote.buildingAddress}</p>
                          <p>{quote.floorCount} {t('quotes.floors', 'floors')}</p>
                          {quote.createdAt && (
                            <p className="text-xs">
                              {formatTimestampDate(quote.createdAt)}
                            </p>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('quotes.services', 'Services')}:</span>
                            <Badge variant="outline" data-testid={`badge-service-count-${quote.id}`}>
                              {quote.services.length}
                            </Badge>
                          </div>
                          {canViewFinancialData && (() => {
                            const subtotal = quote.services.reduce((sum, s) => sum + Number(s.totalCost || 0), 0);
                            const totalTax = Number(quote.totalTax || 0);
                            const grandTotal = Number(quote.grandTotal || 0) || subtotal;
                            const hasTax = totalTax > 0;
                            
                            return (
                              <div className="space-y-1 pt-2 border-t border-border/50">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">{t('quotes.subtotal', 'Subtotal')}:</span>
                                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                {hasTax && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{t('quotes.tax', 'Tax')}:</span>
                                    <span className="font-medium">${totalTax.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground font-medium">{t('quotes.total', 'Total')}:</span>
                                  <span className="text-2xl font-bold text-primary">
                                    ${(hasTax ? grandTotal : subtotal).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Pipeline Tab - Kanban Board - Full Page View */}
            <TabsContent value="pipeline" className="flex-1 flex flex-col min-h-0">
              <div className="mb-3">
                <p className="text-sm text-muted-foreground">
                  {t('quotes.pipeline.description', 'Drag quotes between stages to track their progress through your sales pipeline.')}
                </p>
              </div>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('quotes.loading', 'Loading quotes...')}</p>
                </div>
              ) : (
                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                  <div className="flex-1 grid grid-cols-6 gap-3 min-h-0">
                    {PIPELINE_STAGES.map((stage) => (
                      <StageColumn
                        key={stage.id}
                        stageId={stage.id}
                        quotes={quotesByStage[stage.id] || []}
                        onQuoteClick={(quote) => {
                          setSelectedQuote(quote);
                          setView("detail");
                        }}
                        color={stage.color}
                        borderColor={stage.borderColor}
                        bgColor={stage.bgColor}
                      />
                    ))}
                  </div>
                </DndContext>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              {/* Time Range Selector */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Label className="text-sm font-medium">{t('quotes.analytics.timeRange', 'Time Range')}:</Label>
                <div className="flex gap-2">
                  {(['week', 'month', 'year', 'all'] as const).map((range) => (
                    <Button
                      key={range}
                      variant={analyticsRange === range ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAnalyticsRange(range)}
                      data-testid={`button-range-${range}`}
                    >
                      {t(`quotes.analytics.ranges.${range}`, range.charAt(0).toUpperCase() + range.slice(1))}
                    </Button>
                  ))}
                </div>
              </div>

              {isLoadingAnalytics ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('quotes.analytics.loading', 'Loading analytics...')}</p>
                </div>
              ) : analyticsData ? (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t('quotes.analytics.totalQuotes', 'Total Quotes')}</p>
                            <p className="text-2xl font-bold">{analyticsData.totalQuotes}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/10 rounded-lg">
                            <Trophy className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t('quotes.analytics.won', 'Won')}</p>
                            <p className="text-2xl font-bold text-green-500">{analyticsData.wonCount}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500/10 rounded-lg">
                            <XCircle className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t('quotes.analytics.lost', 'Lost')}</p>
                            <p className="text-2xl font-bold text-red-500">{analyticsData.lostCount}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Target className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t('quotes.analytics.winRate', 'Win Rate')}</p>
                            <p className="text-2xl font-bold text-blue-500">{analyticsData.winRate}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Financial Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/10 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t('quotes.analytics.wonValue', 'Won Value')}</p>
                            <p className="text-2xl font-bold text-green-500">${analyticsData.wonAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500/10 rounded-lg">
                            <TrendingDown className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t('quotes.analytics.lostValue', 'Lost Value')}</p>
                            <p className="text-2xl font-bold text-red-500">${analyticsData.lostAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{t('quotes.analytics.pendingValue', 'Pending Value')}</p>
                            <p className="text-2xl font-bold text-yellow-500">${analyticsData.pendingAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Stage Breakdown Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('quotes.analytics.stageBreakdown', 'Pipeline Stage Breakdown')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={Object.entries(analyticsData.stageBreakdown).map(([stage, count]) => ({
                            stage: t(`quotes.pipeline.stages.${stage}`, stage),
                            count,
                          }))}>
                            <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} />
                            <RechartsTooltip />
                            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">{t('quotes.analytics.noData', 'No analytics data')}</h3>
                    <p className="text-muted-foreground">{t('quotes.analytics.noDataDesc', 'Create some quotes to see analytics here.')}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Render detail view
  if (view === "detail" && selectedQuote) {
    return (
      <>
        <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost"
            onClick={() => {
              setSelectedQuote(null);
              setView("list");
            }}
            className="mb-4"
            data-testid="button-back-to-quotes"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('quotes.backToQuotes', 'Back to Quotes')}
          </Button>

          <Card className="rounded-2xl shadow-lg border border-border mb-8">
            <CardHeader className="p-4 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-3xl font-bold text-foreground">
                      {selectedQuote.buildingName}
                    </CardTitle>
                    {selectedQuote.quoteNumber && (
                      <Badge variant="outline" className="text-base font-semibold">
                        {selectedQuote.quoteNumber}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-lg text-muted-foreground">
                    {selectedQuote.strataPlanNumber}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge
                    className={`rounded-full px-4 py-2 text-base ${
                      (selectedQuote as any).pipelineStage === "draft"
                        ? "bg-muted-foreground text-white"
                        : (selectedQuote as any).pipelineStage === "submitted"
                        ? "bg-primary text-white"
                        : (selectedQuote as any).pipelineStage === "review"
                        ? "bg-chart-2 text-white"
                        : (selectedQuote as any).pipelineStage === "negotiation"
                        ? "bg-amber-500 text-white"
                        : (selectedQuote as any).pipelineStage === "approved"
                        ? "bg-emerald-500 text-white"
                        : (selectedQuote as any).pipelineStage === "won"
                        ? "bg-success text-white"
                        : (selectedQuote as any).pipelineStage === "lost"
                        ? "bg-destructive text-white"
                        : "bg-chart-2 text-white"
                    }`}
                    data-testid="badge-quote-status"
                  >
                    {((selectedQuote as any).pipelineStage || 'draft').replace(/_/g, ' ')}
                  </Badge>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => downloadQuote(selectedQuote)}
                      variant="outline"
                      disabled={isDownloadingPdf}
                      data-testid="button-download-quote"
                    >
                      {isDownloadingPdf ? (
                        <span className="material-icons animate-spin w-4 h-4 mr-2 text-sm">autorenew</span>
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      {isDownloadingPdf ? t('quotes.downloading', 'Downloading...') : t('quotes.downloadPdf', 'Download PDF')}
                    </Button>
                    <Button
                      onClick={() => {
                        setEmailSubject(`${t('quotes.email.defaultSubject', 'Service Quote for')} ${selectedQuote.buildingName} - ${selectedQuote.quoteNumber || selectedQuote.strataPlanNumber}`);
                        setIsEmailDialogOpen(true);
                      }}
                      variant="outline"
                      data-testid="button-email-quote"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {t('quotes.email.button', 'Email')}
                    </Button>
                    {selectedQuote.status === "draft" && 
                     (canEditQuotes || selectedQuote.createdBy === currentUser?.id) && (
                      <Button
                        onClick={() => {
                          setQuoteToSubmit(selectedQuote);
                          setIsSubmitDialogOpen(true);
                        }}
                        className="bg-primary hover:bg-primary/90"
                        data-testid="button-submit-quote"
                      >
                        Submit Quote
                      </Button>
                    )}
                    {/* Convert to Project button - available for all quotes */}
                    {canEditQuotes && (
                      <Button
                        onClick={() => handleConvertToProject(selectedQuote)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        data-testid="button-convert-to-project"
                      >
                        <FolderPlus className="w-4 h-4 mr-2" />
                        {t('quotes.convertToProject.button', 'Convert to Project')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-muted-foreground">
                <div>
                  <p className="text-sm mb-1">Address</p>
                  <p className="font-medium text-foreground">{selectedQuote.buildingAddress}</p>
                </div>
                <div>
                  <p className="text-sm mb-1">Floor Count</p>
                  <p className="font-medium text-foreground">{selectedQuote.floorCount} floors</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Building Photo Section - visible to all if photo exists, or to editors for upload */}
          {(selectedQuote.photoUrl || canEditQuotes) && (
            <Card className="rounded-2xl shadow-lg border border-border mb-8">
              <CardHeader className="p-4 md:p-8">
                <CardTitle className="text-xl font-bold text-foreground mb-4">Building Photo</CardTitle>
                {selectedQuote.photoUrl ? (
                  <div className="space-y-4">
                    <img
                      src={selectedQuote.photoUrl}
                      alt={selectedQuote.buildingName}
                      className="w-full max-h-96 object-contain rounded-lg cursor-pointer hover-elevate"
                      onClick={() => setIsPhotoDialogOpen(true)}
                      data-testid="img-quote-photo"
                    />
                    {canEditQuotes && (
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file && selectedQuote) {
                              try {
                                setUploadingPhoto(true);
                                const formData = new FormData();
                                formData.append('photo', file);
                                
                                const uploadResponse = await fetch(`/api/quotes/${selectedQuote.id}/photo`, {
                                  method: 'POST',
                                  body: formData,
                                  credentials: 'include',
                                });
                                
                                if (!uploadResponse.ok) {
                                  throw new Error('Failed to upload photo');
                                }
                                
                                const uploadData = await uploadResponse.json();
                                if (uploadData.photoUrl) {
                                  setSelectedQuote({...selectedQuote, photoUrl: uploadData.photoUrl});
                                }
                                
                                queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
                                toast({
                                  title: "Photo updated",
                                  description: "The building photo has been updated.",
                                });
                              } catch (error) {
                                toast({
                                  variant: "destructive",
                                  title: "Upload failed",
                                  description: "Failed to upload photo.",
                                });
                              } finally {
                                setUploadingPhoto(false);
                              }
                            }
                          }}
                          className="hidden"
                          id="quote-photo-replace"
                          data-testid="input-replace-photo"
                        />
                        <label htmlFor="quote-photo-replace">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploadingPhoto}
                            asChild
                          >
                            <span className="cursor-pointer">
                              {uploadingPhoto ? "Uploading..." : "Replace Photo"}
                            </span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                ) : (
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 hover:border-primary transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file && selectedQuote) {
                            try {
                              setUploadingPhoto(true);
                              const formData = new FormData();
                              formData.append('photo', file);
                              
                              const uploadResponse = await fetch(`/api/quotes/${selectedQuote.id}/photo`, {
                                method: 'POST',
                                body: formData,
                                credentials: 'include',
                              });
                              
                              if (!uploadResponse.ok) {
                                throw new Error('Failed to upload photo');
                              }
                              
                              const uploadData = await uploadResponse.json();
                              // Update selectedQuote with new photoUrl
                              if (uploadData.photoUrl) {
                                setSelectedQuote({...selectedQuote, photoUrl: uploadData.photoUrl});
                              }
                              
                              queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
                              toast({
                                title: "Photo uploaded",
                                description: "The building photo has been uploaded.",
                              });
                            } catch (error) {
                              toast({
                                variant: "destructive",
                                title: "Upload failed",
                                description: "Failed to upload photo.",
                              });
                            } finally {
                              setUploadingPhoto(false);
                            }
                          }
                        }}
                        className="hidden"
                        id="quote-photo-add"
                        data-testid="input-add-photo"
                      />
                      <label htmlFor="quote-photo-add" className="flex flex-col items-center cursor-pointer">
                        <Image className="w-16 h-16 text-muted-foreground mb-3" />
                        <p className="text-lg text-muted-foreground text-center">
                          {uploadingPhoto ? "Uploading..." : "Click to upload building photo"}
                        </p>
                      </label>
                    </div>
                )}
              </CardHeader>
            </Card>
          )}

          <h2 className="text-2xl font-bold text-foreground mb-6">Services</h2>
          <div className="space-y-6 mb-8">
            {selectedQuote.services.map((service) => {
              const serviceConfig = SERVICE_TYPES.find(s => s.id === service.serviceType);
              const Icon = serviceConfig?.icon || Building2;

              return (
                <Card key={service.id} className="rounded-2xl shadow-lg border border-border">
                  <CardHeader className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-foreground">
                          {service.customServiceName || serviceConfig?.name || service.serviceType}
                        </CardTitle>
                        <CardDescription>
                          {service.customServiceName ? "Custom Service" : serviceConfig?.description}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {serviceConfig?.requiresElevation && (
                        <>
                          <div>
                            <p className="text-muted-foreground mb-1">North</p>
                            <p className="font-medium text-foreground">{service.dropsNorth || 0} drops</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">East</p>
                            <p className="font-medium text-foreground">{service.dropsEast || 0} drops</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">South</p>
                            <p className="font-medium text-foreground">{service.dropsSouth || 0} drops</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">West</p>
                            <p className="font-medium text-foreground">{service.dropsWest || 0} drops</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Drops/Day</p>
                            <p className="font-medium text-foreground">{service.dropsPerDay}</p>
                          </div>
                        </>
                      )}

                      {service.serviceType === "parkade" && (
                        <>
                          <div>
                            <p className="text-muted-foreground mb-1">Stalls</p>
                            <p className="font-medium text-foreground">{service.parkadeStalls}</p>
                          </div>
                          {canViewFinancialData && (
                            <div>
                              <p className="text-muted-foreground mb-1">Price/Stall</p>
                              <p className="font-medium text-foreground">${Number(service.pricePerStall).toFixed(2)}</p>
                            </div>
                          )}
                        </>
                      )}

                      {service.serviceType === "ground_windows" && (
                        <div>
                          <p className="text-muted-foreground mb-1">Hours</p>
                          <p className="font-medium text-foreground">{Number(service.groundWindowHours).toFixed(1)}</p>
                        </div>
                      )}

                      {service.serviceType === "in_suite" && (
                        <>
                          {service.suitesPerDay && (
                            <div>
                              <p className="text-muted-foreground mb-1">Suites/Day</p>
                              <p className="font-medium text-foreground">{service.suitesPerDay}</p>
                            </div>
                          )}
                          {service.floorsPerDay && (
                            <div>
                              <p className="text-muted-foreground mb-1">Floors/Day</p>
                              <p className="font-medium text-foreground">{service.floorsPerDay}</p>
                            </div>
                          )}
                        </>
                      )}

                      {canViewFinancialData && (
                        <>
                          <div>
                            <p className="text-muted-foreground mb-1">Price/Hour</p>
                            <p className="font-medium text-foreground">${Number(service.pricePerHour).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">{t('quotes.totalHours', 'Total Hours')}</p>
                            <p className="font-medium text-foreground">{Number(service.totalHours).toFixed(1)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">{t('quotes.totalCost', 'Total Cost')}</p>
                            <p className="text-xl font-bold text-primary">
                              ${Number(service.totalCost).toFixed(2)}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {canViewFinancialData && (
            <Card className="rounded-2xl shadow-lg border border-border bg-primary/5">
              <CardContent className="p-8">
                {(() => {
                  const subtotal = selectedQuote.services.reduce((sum, s) => sum + Number(s.totalCost || 0), 0);
                  const q = selectedQuote as any;
                  const hasTax = q.taxRegion && q.taxType && q.taxType !== 'NONE';
                  const totalTax = Number(q.totalTax || 0);
                  const grandTotal = Number(q.grandTotal || 0) || subtotal + totalTax;
                  
                  return (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-1">{t('quotes.quoteTotal', 'Quote Total')}</h3>
                        <p className="text-muted-foreground">
                          {selectedQuote.services.length} service{selectedQuote.services.length !== 1 ? 's' : ''}
                          {hasTax && ` (${q.taxRegion})`}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex justify-end items-center gap-2">
                          <span className="text-sm text-muted-foreground">Subtotal:</span>
                          <span className="text-lg font-semibold">${subtotal.toFixed(2)}</span>
                        </div>
                        {hasTax && totalTax > 0 && (
                          <>
                            {q.taxType === 'HST' && Number(q.hstAmount) > 0 && (
                              <div className="flex justify-end items-center gap-2">
                                <span className="text-sm text-muted-foreground">HST ({Number(q.hstRate)}%):</span>
                                <span className="text-lg font-semibold">${Number(q.hstAmount).toFixed(2)}</span>
                              </div>
                            )}
                            {(q.taxType === 'GST' || q.taxType === 'GST+PST' || q.taxType === 'GST+QST') && (
                              <>
                                {Number(q.gstAmount) > 0 && (
                                  <div className="flex justify-end items-center gap-2">
                                    <span className="text-sm text-muted-foreground">GST ({Number(q.gstRate)}%):</span>
                                    <span className="text-lg font-semibold">${Number(q.gstAmount).toFixed(2)}</span>
                                  </div>
                                )}
                                {Number(q.pstAmount) > 0 && (
                                  <div className="flex justify-end items-center gap-2">
                                    <span className="text-sm text-muted-foreground">{q.taxType === 'GST+QST' ? 'QST' : 'PST'} ({Number(q.pstRate)}%):</span>
                                    <span className="text-lg font-semibold">${Number(q.pstAmount).toFixed(2)}</span>
                                  </div>
                                )}
                              </>
                            )}
                            {q.taxType === 'STATE' && Number(q.pstAmount) > 0 && (
                              <div className="flex justify-end items-center gap-2">
                                <span className="text-sm text-muted-foreground">Sales Tax ({Number(q.pstRate)}%):</span>
                                <span className="text-lg font-semibold">${Number(q.pstAmount).toFixed(2)}</span>
                              </div>
                            )}
                          </>
                        )}
                        <div className="flex justify-end items-center gap-2 pt-1 border-t border-border">
                          <span className="text-sm font-medium text-foreground">Total:</span>
                          <span className="text-4xl font-bold text-primary">
                            ${hasTax ? grandTotal.toFixed(2) : subtotal.toFixed(2)}
                          </span>
                        </div>
                        {!hasTax && (
                          <p className="text-xs text-muted-foreground">No tax information available</p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4 mt-8">
            {canEditQuotes && (
              <Button
                onClick={() => {
                  // Prefill edit form with current quote data
                  editForm.reset({
                    buildingName: selectedQuote.buildingName,
                    strataPlanNumber: selectedQuote.strataPlanNumber,
                    buildingAddress: selectedQuote.buildingAddress,
                    floorCount: selectedQuote.floorCount,
                    strataManagerName: selectedQuote.strataManagerName || "",
                    strataManagerAddress: selectedQuote.strataManagerAddress || "",
                  });
                  
                  // Populate services Map from quote
                  const servicesMap = new Map<string, ServiceFormData>();
                  selectedQuote.services.forEach((service) => {
                    servicesMap.set(service.serviceType, {
                      serviceType: service.serviceType,
                      dropsNorth: service.dropsNorth || undefined,
                      dropsEast: service.dropsEast || undefined,
                      dropsSouth: service.dropsSouth || undefined,
                      dropsWest: service.dropsWest || undefined,
                      dropsPerDay: service.dropsPerDay || undefined,
                      parkadeStalls: service.parkadeStalls || undefined,
                      pricePerStall: service.pricePerStall ? Number(service.pricePerStall) : undefined,
                      groundWindowHours: service.groundWindowHours ? Number(service.groundWindowHours) : undefined,
                      suitesPerDay: service.suitesPerDay || undefined,
                      floorsPerDay: service.floorsPerDay || undefined,
                      dryerVentPricingType: service.dryerVentPricingType || undefined,
                      dryerVentUnits: service.dryerVentUnits || undefined,
                      dryerVentPricePerUnit: service.dryerVentPricePerUnit ? Number(service.dryerVentPricePerUnit) : undefined,
                      pricePerHour: service.pricePerHour ? Number(service.pricePerHour) : undefined,
                      totalHours: service.totalHours ? Number(service.totalHours) : undefined,
                      totalCost: service.totalCost ? Number(service.totalCost) : undefined,
                    });
                  });
                  setEditingServices(servicesMap);
                  
                  // Initialize tax info from existing quote data
                  const q = selectedQuote as any;
                  if (q.taxRegion && (q.gstRate || q.pstRate || q.hstRate)) {
                    const gstRate = Number(q.gstRate) || 0;
                    const pstRate = Number(q.pstRate) || 0;
                    const hstRate = Number(q.hstRate) || 0;
                    const taxInfoFromQuote = {
                      region: q.taxRegion || "",
                      regionName: q.taxRegion || "",
                      country: q.taxCountry || "CA",
                      taxType: q.taxType || "GST+PST",
                      gstRate,
                      pstRate,
                      hstRate,
                      totalRate: gstRate + pstRate + hstRate
                    };
                    setEditTaxInfo(taxInfoFromQuote);
                    // Also set currentTaxInfo so restore buttons have access to original rates
                    setCurrentTaxInfo(taxInfoFromQuote);
                  } else {
                    setEditTaxInfo(null);
                    setCurrentTaxInfo(null);
                  }
                  
                  setIsEditDialogOpen(true);
                }}
                className="bg-primary hover:bg-primary/90"
                data-testid="button-edit-quote"
              >
                <Edit className="w-4 h-4 mr-2" />
                {t('quotes.editQuote', 'Edit Quote')}
              </Button>
            )}
            {selectedQuote.status === "open" && (
              <Button
                onClick={() => closeQuoteMutation.mutate(selectedQuote.id)}
                disabled={closeQuoteMutation.isPending}
                variant="outline"
                className="border-success text-success hover:bg-success hover:text-white"
                data-testid="button-close-quote"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {t('quotes.closeQuote', 'Close Quote')}
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Are you sure you want to delete this quote?")) {
                  deleteQuoteMutation.mutate(selectedQuote.id);
                }
              }}
              disabled={deleteQuoteMutation.isPending}
              data-testid="button-delete-quote"
            >
              {t('quotes.deleteQuote', 'Delete Quote')}
            </Button>
          </div>
        </div>

          {/* Quote History Timeline */}
          <Card className="rounded-2xl shadow-lg border border-border mb-8">
            <Collapsible open={isHistoryOpen} onOpenChange={(open) => {
              setIsHistoryOpen(open);
              if (open && selectedQuote) {
                loadQuoteHistory(selectedQuote.id);
              }
            }}>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="p-4 md:p-6 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <History className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {t('quotes.history.title', 'Quote History')}
                    </CardTitle>
                  </div>
                  {isHistoryOpen ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                  {quoteHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>{t('quotes.history.noHistory', 'No history entries yet')}</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border" />
                      <div className="space-y-4">
                        {quoteHistory.map((entry, index) => (
                          <div key={entry.id} className="relative flex gap-4 pl-10">
                            <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                              {entry.eventType === 'created' ? (
                                <FileText className="w-2.5 h-2.5 text-primary" />
                              ) : (
                                <ArrowRightLeft className="w-2.5 h-2.5 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-start justify-between gap-2 flex-wrap">
                                <div>
                                  <p className="font-medium text-foreground">
                                    {entry.eventType === 'created' 
                                      ? t('quotes.history.created', 'Quote Created')
                                      : t('quotes.history.stageChanged', 'Stage Changed')
                                    }
                                  </p>
                                  {entry.eventType === 'pipeline_stage_changed' && entry.previousStage && entry.newStage && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {entry.previousStage}
                                      </Badge>
                                      <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                                      <Badge variant="secondary" className="text-xs">
                                        {entry.newStage}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {entry.createdAt && formatTimestampDate(entry.createdAt)}
                                </span>
                              </div>
                              {entry.actorName && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {t('quotes.history.by', 'by')} {entry.actorName}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>

        {/* Edit Quote Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{t('quotes.editQuote', 'Edit Quote')}</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit((data) => editQuoteMutation.mutate(data))} className="space-y-6">
                {/* Building Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t('quotes.buildingInfo', 'Building Information')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="buildingName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Building Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12" data-testid="input-edit-building-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="strataPlanNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Strata Plan Number</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12" data-testid="input-edit-strata-plan" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="buildingAddress"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Building Address</FormLabel>
                          <FormControl>
                            <AddressAutocomplete
                              value={field.value}
                              placeholder="Start typing address..."
                              data-testid="input-edit-building-address"
                              onSelect={(address) => {
                                field.onChange(address.formatted);
                                const taxInfo = getTaxInfo(address.state, address.country);
                                setEditTaxInfo(taxInfo);
                              }}
                              onChange={(value) => field.onChange(value)}
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          {editTaxInfo && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Tax Region: {editTaxInfo.regionName} ({getTaxLabel(editTaxInfo)})
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="floorCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Floors</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              min="1" 
                              className="h-12" 
                              data-testid="input-edit-floor-count"
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Strata Property Manager */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Strata Property Manager (Optional)</h3>
                  
                  <div>
                    <Label>Select from Client List</Label>
                    <Select
                      onValueChange={(value) => {
                        const client = clients.find((c: any) => c.id === value);
                        if (client) {
                          editForm.setValue('strataManagerName', `${client.firstName} ${client.lastName}`);
                          editForm.setValue('strataManagerAddress', client.address || '');
                        }
                      }}
                    >
                      <SelectTrigger className="h-12" data-testid="select-edit-client">
                        <SelectValue placeholder="Select from client list..." />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">No clients found. Add clients first.</div>
                        ) : (
                          clients.map((client: any) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.firstName} {client.lastName} {client.company ? `- ${client.company}` : ''}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="strataManagerName"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Property Manager Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12" data-testid="input-edit-strata-manager-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="strataManagerAddress"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Property Manager Address</FormLabel>
                          <FormControl>
                            <AddressAutocomplete
                              value={field.value || ""}
                              placeholder="Start typing address..."
                              data-testid="input-edit-strata-manager-address"
                              onSelect={(address) => {
                                field.onChange(address.formatted);
                              }}
                              onChange={(value) => field.onChange(value)}
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Services</h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {Array.from(editingServices.entries()).map(([serviceType, serviceData]) => {
                      const serviceConfig = SERVICE_TYPES.find(s => s.id === serviceType);
                      const Icon = serviceConfig?.icon || Building2;
                      
                      return (
                        <AccordionItem key={serviceType} value={serviceType} className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-primary" />
                              </div>
                              <span className="font-medium">{serviceConfig?.name || serviceType}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-4 space-y-4">
                            {/* Elevation-based services */}
                            {serviceConfig?.requiresElevation && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>North Drops</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={serviceData.dropsNorth || ""}
                                    onChange={(e) => {
                                      const newServices = new Map(editingServices);
                                      newServices.set(serviceType, {
                                        ...serviceData,
                                        dropsNorth: e.target.value ? parseInt(e.target.value) : undefined
                                      });
                                      setEditingServices(newServices);
                                    }}
                                    className="h-12"
                                  />
                                </div>
                                <div>
                                  <Label>East Drops</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={serviceData.dropsEast || ""}
                                    onChange={(e) => {
                                      const newServices = new Map(editingServices);
                                      newServices.set(serviceType, {
                                        ...serviceData,
                                        dropsEast: e.target.value ? parseInt(e.target.value) : undefined
                                      });
                                      setEditingServices(newServices);
                                    }}
                                    className="h-12"
                                  />
                                </div>
                                <div>
                                  <Label>South Drops</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={serviceData.dropsSouth || ""}
                                    onChange={(e) => {
                                      const newServices = new Map(editingServices);
                                      newServices.set(serviceType, {
                                        ...serviceData,
                                        dropsSouth: e.target.value ? parseInt(e.target.value) : undefined
                                      });
                                      setEditingServices(newServices);
                                    }}
                                    className="h-12"
                                  />
                                </div>
                                <div>
                                  <Label>West Drops</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={serviceData.dropsWest || ""}
                                    onChange={(e) => {
                                      const newServices = new Map(editingServices);
                                      newServices.set(serviceType, {
                                        ...serviceData,
                                        dropsWest: e.target.value ? parseInt(e.target.value) : undefined
                                      });
                                      setEditingServices(newServices);
                                    }}
                                    className="h-12"
                                  />
                                </div>
                                <div>
                                  <Label>Drops Per Day</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={serviceData.dropsPerDay || ""}
                                    onChange={(e) => {
                                      const newServices = new Map(editingServices);
                                      newServices.set(serviceType, {
                                        ...serviceData,
                                        dropsPerDay: e.target.value ? parseInt(e.target.value) : undefined
                                      });
                                      setEditingServices(newServices);
                                    }}
                                    className="h-12"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Parkade service */}
                            {serviceType === "parkade" && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Parkade Stalls</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={serviceData.parkadeStalls || ""}
                                    onChange={(e) => {
                                      const newServices = new Map(editingServices);
                                      newServices.set(serviceType, {
                                        ...serviceData,
                                        parkadeStalls: e.target.value ? parseInt(e.target.value) : undefined
                                      });
                                      setEditingServices(newServices);
                                    }}
                                    className="h-12"
                                  />
                                </div>
                                {canViewFinancialData && (
                                  <div>
                                    <Label>Price Per Stall</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={serviceData.pricePerStall || ""}
                                      onChange={(e) => {
                                        const newServices = new Map(editingServices);
                                        newServices.set(serviceType, {
                                          ...serviceData,
                                          pricePerStall: e.target.value ? parseFloat(e.target.value) : undefined
                                        });
                                        setEditingServices(newServices);
                                      }}
                                      className="h-12"
                                    />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Ground windows service */}
                            {serviceType === "ground_windows" && (
                              <div>
                                <Label>Hours</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  value={serviceData.groundWindowHours || ""}
                                  onChange={(e) => {
                                    const newServices = new Map(editingServices);
                                    newServices.set(serviceType, {
                                      ...serviceData,
                                      groundWindowHours: e.target.value ? parseFloat(e.target.value) : undefined
                                    });
                                    setEditingServices(newServices);
                                  }}
                                  className="h-12"
                                />
                              </div>
                            )}

                            {/* In-suite dryer vent service */}
                            {serviceType === "in_suite" && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Number of Suites</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={serviceData.dryerVentUnits || ""}
                                    onChange={(e) => {
                                      const newServices = new Map(editingServices);
                                      newServices.set(serviceType, {
                                        ...serviceData,
                                        dryerVentUnits: e.target.value ? parseInt(e.target.value) : undefined
                                      });
                                      setEditingServices(newServices);
                                    }}
                                    className="h-12"
                                  />
                                </div>
                                {canViewFinancialData && (
                                  <div>
                                    <Label>Price Per Unit</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={serviceData.dryerVentPricePerUnit || ""}
                                      onChange={(e) => {
                                        const newServices = new Map(editingServices);
                                        newServices.set(serviceType, {
                                          ...serviceData,
                                          dryerVentPricePerUnit: e.target.value ? parseFloat(e.target.value) : undefined
                                        });
                                        setEditingServices(newServices);
                                      }}
                                      className="h-12"
                                    />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Pricing fields - common to all services */}
                            {canViewFinancialData && (
                              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                <div>
                                  <Label>Price Per Hour</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={serviceData.pricePerHour || ""}
                                    onChange={(e) => {
                                      const newServices = new Map(editingServices);
                                      const newPricePerHour = e.target.value ? parseFloat(e.target.value) : undefined;
                                      const totalHours = serviceData.totalHours;
                                      const totalCost = newPricePerHour !== undefined && totalHours !== undefined ? newPricePerHour * totalHours : undefined;
                                      
                                      newServices.set(serviceType, {
                                        ...serviceData,
                                        pricePerHour: newPricePerHour,
                                        totalCost
                                      });
                                      setEditingServices(newServices);
                                    }}
                                    className="h-12"
                                  />
                                </div>
                                <div>
                                  <Label>Total Hours</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={serviceData.totalHours || ""}
                                    onChange={(e) => {
                                      const newServices = new Map(editingServices);
                                      const newTotalHours = e.target.value ? parseFloat(e.target.value) : undefined;
                                      const pricePerHour = serviceData.pricePerHour;
                                      const totalCost = pricePerHour !== undefined && newTotalHours !== undefined ? pricePerHour * newTotalHours : undefined;
                                      
                                      newServices.set(serviceType, {
                                        ...serviceData,
                                        totalHours: newTotalHours,
                                        totalCost
                                      });
                                      setEditingServices(newServices);
                                    }}
                                    className="h-12"
                                  />
                                </div>
                                <div>
                                  <Label>Total Cost (calculated)</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={serviceData.totalCost || ""}
                                    readOnly
                                    disabled
                                    className="h-12 bg-muted"
                                  />
                                </div>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>

                {/* Pricing & Tax Section - only visible to users with financial access */}
                {canViewFinancialData && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t('quotes.pricingAndTax', 'Pricing & Tax')}</h3>
                    <Card>
                      <CardContent className="pt-4 space-y-4">
                        {/* Subtotal - calculated from services */}
                        <div className="flex items-center justify-between">
                          <Label className="text-base">{t('quotes.subtotal', 'Subtotal')}</Label>
                          <span className="text-lg font-semibold">
                            ${Array.from(editingServices.values()).reduce((sum, s) => sum + Number(s.totalCost || 0), 0).toFixed(2)}
                          </span>
                        </div>

                        <Separator />

                        {/* Tax Settings */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-base">{t('quotes.taxSettings', 'Tax Settings')}</Label>
                            {editTaxInfo && (
                              <Badge variant="secondary">
                                {editTaxInfo.regionName}
                              </Badge>
                            )}
                          </div>

                          {editTaxInfo ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                {(editTaxInfo.gstRate > 0 || editTaxInfo.taxType?.includes('GST')) && (
                                  <div>
                                    <Label className="text-sm text-muted-foreground">GST Rate (%)</Label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={editTaxInfo.gstRate}
                                        onChange={(e) => {
                                          const newGst = parseFloat(e.target.value) || 0;
                                          setEditTaxInfo({
                                            ...editTaxInfo,
                                            gstRate: newGst,
                                            totalRate: newGst + editTaxInfo.pstRate + editTaxInfo.hstRate
                                          });
                                        }}
                                        className="h-10 flex-1"
                                        data-testid="input-edit-gst-rate"
                                      />
                                      {editTaxInfo.gstRate === 0 ? (
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() => {
                                            const defaultRate = currentTaxInfo?.gstRate || 5;
                                            setEditTaxInfo({
                                              ...editTaxInfo,
                                              gstRate: defaultRate,
                                              totalRate: defaultRate + editTaxInfo.pstRate + editTaxInfo.hstRate
                                            });
                                          }}
                                          data-testid="button-restore-gst"
                                          title="Restore default GST rate"
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      ) : (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => {
                                            const newTotal = editTaxInfo.pstRate + editTaxInfo.hstRate;
                                            if (newTotal === 0) {
                                              setEditTaxInfo(null);
                                            } else {
                                              setEditTaxInfo({
                                                ...editTaxInfo,
                                                gstRate: 0,
                                                totalRate: newTotal
                                              });
                                            }
                                          }}
                                          data-testid="button-remove-gst"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {(editTaxInfo.pstRate > 0 || editTaxInfo.taxType?.includes('PST') || editTaxInfo.taxType?.includes('QST')) && (
                                  <div>
                                    <Label className="text-sm text-muted-foreground">
                                      {editTaxInfo.taxType === 'GST+QST' ? 'QST' : (editTaxInfo.country === 'US' ? 'State Tax' : 'PST')} Rate (%)
                                    </Label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={editTaxInfo.pstRate}
                                        onChange={(e) => {
                                          const newPst = parseFloat(e.target.value) || 0;
                                          setEditTaxInfo({
                                            ...editTaxInfo,
                                            pstRate: newPst,
                                            totalRate: editTaxInfo.gstRate + newPst + editTaxInfo.hstRate
                                          });
                                        }}
                                        className="h-10 flex-1"
                                        data-testid="input-edit-pst-rate"
                                      />
                                      {editTaxInfo.pstRate === 0 ? (
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() => {
                                            const defaultRate = currentTaxInfo?.pstRate || 7;
                                            setEditTaxInfo({
                                              ...editTaxInfo,
                                              pstRate: defaultRate,
                                              totalRate: editTaxInfo.gstRate + defaultRate + editTaxInfo.hstRate
                                            });
                                          }}
                                          data-testid="button-restore-pst"
                                          title="Restore default PST rate"
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      ) : (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => {
                                            const newTotal = editTaxInfo.gstRate + editTaxInfo.hstRate;
                                            if (newTotal === 0) {
                                              setEditTaxInfo(null);
                                            } else {
                                              setEditTaxInfo({
                                                ...editTaxInfo,
                                                pstRate: 0,
                                                totalRate: newTotal
                                              });
                                            }
                                          }}
                                          data-testid="button-remove-pst"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {(editTaxInfo.hstRate > 0 || editTaxInfo.taxType?.includes('HST')) && (
                                  <div>
                                    <Label className="text-sm text-muted-foreground">HST Rate (%)</Label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={editTaxInfo.hstRate}
                                        onChange={(e) => {
                                          const newHst = parseFloat(e.target.value) || 0;
                                          setEditTaxInfo({
                                            ...editTaxInfo,
                                            hstRate: newHst,
                                            totalRate: editTaxInfo.gstRate + editTaxInfo.pstRate + newHst
                                          });
                                        }}
                                        className="h-10 flex-1"
                                        data-testid="input-edit-hst-rate"
                                      />
                                      {editTaxInfo.hstRate === 0 ? (
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() => {
                                            const defaultRate = currentTaxInfo?.hstRate || 13;
                                            setEditTaxInfo({
                                              ...editTaxInfo,
                                              hstRate: defaultRate,
                                              totalRate: editTaxInfo.gstRate + editTaxInfo.pstRate + defaultRate
                                            });
                                          }}
                                          data-testid="button-restore-hst"
                                          title="Restore default HST rate"
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      ) : (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => {
                                            const newTotal = editTaxInfo.gstRate + editTaxInfo.pstRate;
                                            if (newTotal === 0) {
                                              setEditTaxInfo(null);
                                            } else {
                                              setEditTaxInfo({
                                                ...editTaxInfo,
                                                hstRate: 0,
                                                totalRate: newTotal
                                              });
                                            }
                                          }}
                                          data-testid="button-remove-hst"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="col-span-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditTaxInfo(null)}
                                  data-testid="button-remove-tax"
                                >
                                  {t('quotes.removeTax', 'Remove Tax')}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground">{t('quotes.noTaxApplied', 'No tax applied')}</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Set default tax info based on address or use BC defaults
                                  setEditTaxInfo({
                                    region: "BC",
                                    regionName: "British Columbia",
                                    country: "CA",
                                    taxType: "GST+PST",
                                    gstRate: 5,
                                    pstRate: 7,
                                    hstRate: 0,
                                    totalRate: 12
                                  });
                                }}
                                data-testid="button-add-tax"
                              >
                                {t('quotes.addTax', 'Add Tax')}
                              </Button>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Grand Total */}
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-semibold">{t('quotes.grandTotal', 'Grand Total')}</Label>
                          <span className="text-xl font-bold text-primary">
                            {(() => {
                              const subtotal = Array.from(editingServices.values()).reduce((sum, s) => sum + Number(s.totalCost || 0), 0);
                              if (editTaxInfo) {
                                const taxCalc = calculateTax(subtotal, editTaxInfo);
                                return `$${taxCalc.grandTotal.toFixed(2)}`;
                              }
                              return `$${subtotal.toFixed(2)}`;
                            })()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Photo Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Building Photo</h3>
                  {selectedQuote.photoUrl && (
                    <div className="space-y-2">
                      <img
                        src={selectedQuote.photoUrl}
                        alt={selectedQuote.buildingName}
                        className="w-full max-h-48 object-contain rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">Current Photo</p>
                    </div>
                  )}
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEditPhotoFile(file);
                        }
                      }}
                      className="hidden"
                      id="edit-quote-photo"
                      data-testid="input-edit-quote-photo"
                    />
                    <label
                      htmlFor="edit-quote-photo"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Image className="w-12 h-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        {editPhotoFile ? editPhotoFile.name : selectedQuote.photoUrl ? "Click to replace photo" : "Click to upload building photo"}
                      </p>
                      {editPhotoFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={(e) => {
                            e.preventDefault();
                            setEditPhotoFile(null);
                          }}
                          data-testid="button-remove-edit-photo"
                        >
                          Remove Selected Photo
                        </Button>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 justify-end pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditPhotoFile(null);
                    }}
                    data-testid="button-cancel-edit"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={editQuoteMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                    data-testid="button-submit-edit"
                  >
                    {editQuoteMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Photo Viewer Dialog */}
        <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
          <DialogContent className="max-w-5xl p-2">
            <DialogHeader className="sr-only">
              <DialogTitle>Building Photo</DialogTitle>
            </DialogHeader>
            {selectedQuote?.photoUrl && (
              <img
                src={selectedQuote.photoUrl}
                alt={selectedQuote.buildingName}
                className="w-full h-auto max-h-[90vh] object-contain"
                data-testid="img-photo-fullsize"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Submit Quote Confirmation Dialog */}
        <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Quote</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit this quote? Once submitted, it will be sent to management for review.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-submit">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (quoteToSubmit) {
                    submitQuoteMutation.mutate(quoteToSubmit.id);
                  }
                }}
                className="bg-primary hover:bg-primary/90"
                data-testid="button-confirm-submit"
              >
                Submit Quote
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {t('quotes.email.title', 'Email Quote to Customer')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email-recipient">{t('quotes.email.recipientLabel', 'Recipient Email')} *</Label>
                <Input
                  id="email-recipient"
                  type="email"
                  placeholder={t('quotes.email.recipientPlaceholder', 'customer@example.com')}
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  data-testid="input-email-recipient"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-subject">{t('quotes.email.subjectLabel', 'Subject')}</Label>
                <Input
                  id="email-subject"
                  type="text"
                  placeholder={t('quotes.email.subjectPlaceholder', 'Service Quote for...')}
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  data-testid="input-email-subject"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-message">{t('quotes.email.messageLabel', 'Personal Message (Optional)')}</Label>
                <textarea
                  id="email-message"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t('quotes.email.messagePlaceholder', 'Add a personal message to include with the quote...')}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  data-testid="input-email-message"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {t('quotes.email.note', 'The quote will be sent as a professionally formatted email that can be printed to PDF.')}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEmailDialogOpen(false)}
                data-testid="button-cancel-email"
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                onClick={() => {
                  if (selectedQuote && emailRecipient) {
                    emailQuoteMutation.mutate({
                      quoteId: selectedQuote.id,
                      recipientEmail: emailRecipient,
                      message: emailMessage || undefined,
                      subject: emailSubject || undefined,
                    });
                  }
                }}
                disabled={!emailRecipient || emailQuoteMutation.isPending}
                data-testid="button-send-email"
              >
                {emailQuoteMutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">...</span>
                    {t('quotes.email.sending', 'Sending...')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t('quotes.email.send', 'Send Quote')}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </>
    );
  }

  // Render create view - Building info step
  if (view === "create" && createStep === "building") {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setCreateStep("services")}
            className="mb-6"
            data-testid="button-back-to-services"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>

          <Card className="rounded-2xl shadow-lg border border-border">
            <CardHeader className="p-8">
              <CardTitle className="text-3xl font-bold text-foreground mb-2">
                Building Information
              </CardTitle>
              <CardDescription className="text-lg">
                Enter the building details for this quote
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <Form {...buildingForm}>
                <form onSubmit={buildingForm.handleSubmit(handleBuildingInfoSubmit)} className="space-y-6">
                  
                  {/* Client Selection with Property Autofill */}
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-primary" />
                      <Label className="text-base font-semibold">Quick Fill from Client</Label>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select a client to autofill property manager details. If the client has saved properties, you can also autofill building information.
                    </p>
                    
                    <div className="space-y-2">
                      <Label>Select Client</Label>
                      <Select
                        value={selectedClientId || ""}
                        onValueChange={(value) => {
                          const client = clients.find((c: any) => c.id === value);
                          setSelectedClientId(value);
                          setSelectedPropertyIndex(null);
                          if (client) {
                            buildingForm.setValue('strataManagerName', `${client.firstName} ${client.lastName}`);
                            buildingForm.setValue('strataManagerAddress', client.address || '');
                            buildingForm.setValue('buildingName', '');
                            buildingForm.setValue('strataPlanNumber', '');
                            buildingForm.setValue('buildingAddress', '');
                            buildingForm.setValue('floorCount', undefined);
                            
                            // Auto-select PM recipient if client email matches a linked PM
                            const matchingPM = linkedPMs.find((pm) => pm.email === client.email);
                            if (matchingPM) {
                              setSelectedPmId(matchingPM.id);
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="h-12" data-testid="select-client">
                          <SelectValue placeholder="Select a client..." />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground">No clients found. Add clients first.</div>
                          ) : (
                            clients.map((client: any) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.firstName} {client.lastName} {client.company ? `- ${client.company}` : ''}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Property Selector - only show if client has properties */}
                    {selectedClientId && (() => {
                      const selectedClient = clients.find((c: any) => c.id === selectedClientId);
                      const properties = selectedClient?.lmsNumbers || [];
                      
                      if (properties.length > 0) {
                        return (
                          <div className="space-y-2">
                            <Label>Select Property to Autofill</Label>
                            <Select
                              value={selectedPropertyIndex !== null ? String(selectedPropertyIndex) : ""}
                              onValueChange={(value) => {
                                const index = parseInt(value);
                                setSelectedPropertyIndex(index);
                                const property = properties[index];
                                if (property) {
                                  buildingForm.setValue('buildingName', property.buildingName || '');
                                  buildingForm.setValue('strataPlanNumber', property.number || '');
                                  buildingForm.setValue('buildingAddress', property.address || '');
                                  if (property.stories) {
                                    buildingForm.setValue('floorCount', property.stories);
                                  }
                                  // Detect tax from the autofilled address
                                  if (property.address) {
                                    const taxInfo = detectTaxFromAddress(property.address);
                                    if (taxInfo) {
                                      setCurrentTaxInfo(taxInfo);
                                    }
                                  }
                                  toast({
                                    title: "Property details filled",
                                    description: `Building information autofilled from ${property.buildingName || property.number}`,
                                  });
                                }
                              }}
                            >
                              <SelectTrigger className="h-12" data-testid="select-property">
                                <SelectValue placeholder="Select a property to autofill building details..." />
                              </SelectTrigger>
                              <SelectContent>
                                {properties.map((prop: any, idx: number) => (
                                  <SelectItem key={idx} value={String(idx)}>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{prop.buildingName || prop.number}</span>
                                      <span className="text-xs text-muted-foreground">{prop.address}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              This client has {properties.length} saved {properties.length === 1 ? 'property' : 'properties'}
                            </p>
                          </div>
                        );
                      }
                      return (
                        <p className="text-sm text-muted-foreground italic">
                          This client has no saved properties. Building details must be entered manually.
                        </p>
                      );
                    })()}
                  </div>

                  <Separator />
                  
                  {/* Property Manager Selection for Quote Recipient */}
                  {linkedPMs.length > 0 && (
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Send className="w-5 h-5 text-primary" />
                        <Label className="text-base font-semibold">{t('quotes.sendToPropertyManager', 'Send to Property Manager')}</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('quotes.pmSelectDescription', 'Select a property manager to send this quote to. They will receive an SMS notification and see the quote on their portal.')}
                      </p>
                      
                      <div className="space-y-2">
                        <Label>{t('quotes.selectPM', 'Select Property Manager')}</Label>
                        <Select
                          value={selectedPmId || "none"}
                          onValueChange={(value) => setSelectedPmId(value === "none" ? null : value)}
                        >
                          <SelectTrigger className="h-12" data-testid="select-property-manager">
                            <SelectValue placeholder={t('quotes.selectPMPlaceholder', 'Select a property manager...')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              <span className="text-muted-foreground">{t('quotes.noPMSelected', 'No property manager (auto-match by strata)')}</span>
                            </SelectItem>
                            {linkedPMs.map((pm) => (
                              <SelectItem key={pm.id} value={pm.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{pm.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {pm.company}{pm.strataNumber ? ` - ${pm.strataNumber}` : ''}
                                    {pm.smsOptIn && pm.phone ? ' (SMS enabled)' : ''}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <FormField
                    control={buildingForm.control}
                    name="buildingName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Oceanview Towers"
                            className="h-12"
                            data-testid="input-building-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={buildingForm.control}
                    name="strataPlanNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Strata Plan Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., LMS1234"
                            className="h-12"
                            data-testid="input-strata-plan"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={buildingForm.control}
                    name="buildingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building Address</FormLabel>
                        <FormControl>
                          <AddressAutocomplete
                            value={field.value}
                            placeholder="Start typing address..."
                            data-testid="input-building-address"
                            onSelect={(address) => {
                              field.onChange(address.formatted);
                              const taxInfo = getTaxInfo(address.state, address.country);
                              setCurrentTaxInfo(taxInfo);
                            }}
                            onChange={(value) => field.onChange(value)}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        {currentTaxInfo && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Tax Region: {currentTaxInfo.regionName} ({getTaxLabel(currentTaxInfo)})
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={buildingForm.control}
                    name="floorCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Floor Count</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            placeholder="e.g., 20"
                            className="h-12"
                            data-testid="input-floor-count"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={buildingForm.control}
                    name="strataManagerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manager Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., John Smith"
                            className="h-12"
                            data-testid="input-manager-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={buildingForm.control}
                    name="strataManagerAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manager Address</FormLabel>
                        <FormControl>
                          <AddressAutocomplete
                            value={field.value}
                            placeholder="Start typing address..."
                            data-testid="input-manager-address"
                            onSelect={(address) => {
                              field.onChange(address.formatted);
                            }}
                            onChange={(value) => field.onChange(value)}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Building Photo (Optional)</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 hover:border-primary transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedPhotoFile(file);
                          }
                        }}
                        className="hidden"
                        id="quote-photo-upload"
                        data-testid="input-quote-photo"
                      />
                      <label
                        htmlFor="quote-photo-upload"
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <Image className="w-12 h-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center">
                          {selectedPhotoFile ? selectedPhotoFile.name : "Click to upload building photo"}
                        </p>
                        {selectedPhotoFile && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedPhotoFile(null);
                            }}
                            data-testid="button-remove-photo"
                          >
                            Remove Photo
                          </Button>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Custom Adjustments (Fees/Taxes) */}
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <Label className="text-base font-semibold">Additional Fees & Taxes</Label>
                        <p className="text-sm text-muted-foreground">Add custom fees, discounts, or additional taxes</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newAdjustment: CustomAdjustment = {
                            id: crypto.randomUUID(),
                            name: '',
                            type: 'fixed',
                            value: 0,
                          };
                          setCustomAdjustments([...customAdjustments, newAdjustment]);
                        }}
                        data-testid="button-add-adjustment"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Fee
                      </Button>
                    </div>
                    
                    {/* Auto-detected tax display - show each component separately */}
                    {getTaxComponents(currentTaxInfo, removedTaxTypes).map((component) => (
                      <div key={component.type} className="p-3 bg-muted/50 rounded-md border border-border flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{component.label}</p>
                          <p className="text-xs text-muted-foreground">Auto-detected from building address</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newRemoved = new Set(removedTaxTypes);
                            newRemoved.add(component.type);
                            setRemovedTaxTypes(newRemoved);
                          }}
                          data-testid={`button-remove-tax-${component.type}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {/* Custom adjustments list */}
                    {customAdjustments.map((adj, index) => (
                      <div key={adj.id} className="flex items-center gap-2 p-3 bg-muted/30 rounded-md border border-border">
                        <Input
                          placeholder="Fee name (e.g., Equipment Rental)"
                          value={adj.name}
                          onChange={(e) => {
                            const updated = [...customAdjustments];
                            updated[index] = { ...adj, name: e.target.value };
                            setCustomAdjustments(updated);
                          }}
                          className="flex-1"
                          data-testid={`input-adjustment-name-${index}`}
                        />
                        <Select
                          value={adj.type}
                          onValueChange={(value: 'fixed' | 'percentage') => {
                            const updated = [...customAdjustments];
                            updated[index] = { ...adj, type: value };
                            setCustomAdjustments(updated);
                          }}
                        >
                          <SelectTrigger className="w-28" data-testid={`select-adjustment-type-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed $</SelectItem>
                            <SelectItem value="percentage">Percent %</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="0"
                          value={adj.value || ''}
                          onChange={(e) => {
                            const updated = [...customAdjustments];
                            updated[index] = { ...adj, value: parseFloat(e.target.value) || 0 };
                            setCustomAdjustments(updated);
                          }}
                          className="w-24"
                          data-testid={`input-adjustment-value-${index}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCustomAdjustments(customAdjustments.filter(a => a.id !== adj.id));
                          }}
                          data-testid={`button-remove-adjustment-${index}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {customAdjustments.length === 0 && getTaxComponents(currentTaxInfo, removedTaxTypes).length === 0 && (
                      <p className="text-sm text-muted-foreground italic">No additional fees or taxes added</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={createQuoteMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 h-12"
                    data-testid="button-create-quote-submit"
                  >
                    {createQuoteMutation.isPending ? "Creating..." : "Create Quote"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render create view - Service selection step
  if (view === "create" && createStep === "services") {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => {
              resetForm();
              setView("list");
            }}
            className="mb-6"
            data-testid="button-back-to-list"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('quotes.backToQuotes', 'Back to Quotes')}
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Select Services</h1>
            <p className="text-muted-foreground text-lg">
              Choose one or more services for this quote
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {SERVICE_TYPES.map((service) => {
              const Icon = service.icon;
              const isSelected = selectedServices.includes(service.id);
              const isConfigured = configuredServices.has(service.id);

              return (
                <Card
                  key={service.id}
                  className={`rounded-2xl shadow-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                  data-testid={`card-service-${service.id}`}
                >
                  <CardHeader className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                          isSelected ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <Icon className={`w-8 h-8 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{service.name}</h3>
                          {isConfigured && (
                            <Badge className="bg-success text-white rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleServiceToggle(service.id)}
                        variant={isSelected ? "destructive" : "default"}
                        className={`flex-1 ${
                          !isSelected ? "bg-primary hover:bg-primary/90" : ""
                        }`}
                        data-testid={`button-toggle-${service.id}`}
                      >
                        {isSelected ? (
                          <>
                            <X className="w-4 h-4 mr-2" />
                            Remove
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </>
                        )}
                      </Button>
                      {isSelected && (
                        <Button
                          onClick={() => handleConfigureService(service.id)}
                          variant="outline"
                          data-testid={`button-configure-${service.id}`}
                        >
                          {isConfigured ? "Edit" : "Configure"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {selectedServices.length > 0 && (
            <Card className="rounded-2xl shadow-lg border border-border bg-primary/5">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      {selectedServices.length} Service{selectedServices.length !== 1 ? 's' : ''} Selected
                    </h3>
                    <p className="text-muted-foreground">
                      {canFinalize
                        ? "All services configured. Ready to create quote."
                        : "Please configure all selected services."}
                    </p>
                  </div>
                  {canViewFinancialData && (
                    <div className="text-right">
                      {(() => {
                        const subtotal = calculateQuoteTotal();
                        return (
                          <div className="space-y-1">
                            <div className="flex justify-end items-center gap-2 pt-1 border-t border-border">
                              <span className="text-sm font-medium text-foreground">Subtotal:</span>
                              <span className="text-3xl font-bold text-primary">
                                ${subtotal.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">Tax will be calculated based on building address</p>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setCreateStep("building")}
                  disabled={!canFinalize}
                  className="w-full bg-primary hover:bg-primary/90 h-12"
                  data-testid="button-next-to-building"
                >
                  Next: Building Info
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Render create view - Configure service step
  if (view === "create" && createStep === "configure" && serviceBeingConfigured) {
    const service = SERVICE_TYPES.find(s => s.id === serviceBeingConfigured);
    if (!service) return null;

    const Icon = service.icon;

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => {
              setServiceBeingConfigured(null);
              setCreateStep("services");
            }}
            className="mb-6"
            data-testid="button-back-to-service-selection"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Service Selection
          </Button>

          <Card className="rounded-2xl shadow-lg border border-border">
            <CardHeader className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-foreground mb-1">
                    {service.name}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {service.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <Form {...serviceForm}>
                <form onSubmit={serviceForm.handleSubmit(handleServiceFormSubmit)} className="space-y-6">
                  {/* Custom Service Name and Job Type Input */}
                  {serviceBeingConfigured === "custom" && (
                    <>
                      <FormField
                        control={serviceForm.control}
                        name="customServiceName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., Roof Inspection, Caulking, etc."
                                className="h-12"
                                data-testid="input-custom-service-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={serviceForm.control}
                        name="customServiceJobType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="rope" id="job-type-rope" data-testid="radio-job-type-rope" />
                                  <Label htmlFor="job-type-rope">Rope Access (Elevation)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="ground" id="job-type-ground" data-testid="radio-job-type-ground" />
                                  <Label htmlFor="job-type-ground">Ground Work</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  
                  {/* Elevation fields for rope access services OR custom rope services */}
                  {((service.requiresElevation && serviceBeingConfigured !== "dryer_vent_cleaning") ||
                    (service.requiresElevation && serviceBeingConfigured === "dryer_vent_cleaning" && 
                     serviceForm.watch("dryerVentPricingType") === "per_hour") ||
                    (serviceBeingConfigured === "custom" && serviceForm.watch("customServiceJobType") === "rope")) && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={serviceForm.control}
                          name="dropsNorth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Drops North</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  className="h-12"
                                  data-testid="input-drops-north"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={serviceForm.control}
                          name="dropsEast"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Drops East</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  className="h-12"
                                  data-testid="input-drops-east"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={serviceForm.control}
                          name="dropsSouth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Drops South</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  className="h-12"
                                  data-testid="input-drops-south"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={serviceForm.control}
                          name="dropsWest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Drops West</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  className="h-12"
                                  data-testid="input-drops-west"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={serviceForm.control}
                        name="dropsPerDay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Drops Per Day</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                className="h-12"
                                data-testid="input-drops-per-day"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {serviceBeingConfigured === "parkade" && (
                    <>
                      <FormField
                        control={serviceForm.control}
                        name="parkadeStalls"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Stalls</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                className="h-12"
                                data-testid="input-parkade-stalls"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {canViewFinancialData ? (
                        <FormField
                          control={serviceForm.control}
                          name="pricePerStall"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price Per Stall</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="h-12"
                                  data-testid="input-price-per-stall"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="p-3 bg-muted/50 rounded-md border border-border">
                          <p className="text-sm text-muted-foreground">
                            Pricing fields require financial data access. Management can add pricing later.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {serviceBeingConfigured === "ground_windows" && (
                    <FormField
                      control={serviceForm.control}
                      name="groundWindowHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Hours</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              step="0.1"
                              className="h-12"
                              data-testid="input-ground-window-hours"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {serviceBeingConfigured === "in_suite" && (
                    <>
                      <FormField
                        control={serviceForm.control}
                        name="dryerVentUnits"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Suites</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                className="h-12"
                                data-testid="input-number-of-suites"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {canViewFinancialData ? (
                        <FormField
                          control={serviceForm.control}
                          name="dryerVentPricePerUnit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price Per Unit</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="h-12"
                                  data-testid="input-price-per-unit"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="p-3 bg-muted/50 rounded-md border border-border">
                          <p className="text-sm text-muted-foreground">
                            Pricing fields require financial data access. Management can add pricing later.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {serviceBeingConfigured === "dryer_vent_cleaning" && (
                    <>
                      {canViewFinancialData && (
                        <FormField
                          control={serviceForm.control}
                          name="dryerVentPricingType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pricing Method</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value || "per_hour"}
                                  className="flex gap-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="per_hour" id="per_hour" data-testid="radio-per-hour" />
                                    <Label htmlFor="per_hour">Per Hour</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="per_unit" id="per_unit" data-testid="radio-per-unit" />
                                    <Label htmlFor="per_unit">Per Unit</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {canViewFinancialData && serviceForm.watch("dryerVentPricingType") === "per_unit" && (
                        <>
                          <FormField
                            control={serviceForm.control}
                            name="dryerVentUnits"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Number of Units</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    min="1"
                                    className="h-12"
                                    data-testid="input-dryer-vent-units"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={serviceForm.control}
                            name="dryerVentPricePerUnit"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price Per Unit</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="h-12"
                                    data-testid="input-dryer-vent-price-per-unit"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </>
                  )}

                  {/* Simple service hours for ground services */}
                  {(serviceBeingConfigured === "general_pressure_washing" || 
                    serviceBeingConfigured === "gutter_cleaning" ||
                    (serviceBeingConfigured === "custom" && serviceForm.watch("customServiceJobType") === "ground")) && (
                    <FormField
                      control={serviceForm.control}
                      name="simpleServiceHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hours Required</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              step="0.1"
                              className="h-12"
                              data-testid="input-simple-service-hours"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Price Per Hour - Not needed for parkade (uses price per stall) or dryer vent per-unit */}
                  {serviceBeingConfigured !== "parkade" && 
                   !(serviceBeingConfigured === "dryer_vent_cleaning" && serviceForm.watch("dryerVentPricingType") === "per_unit") && (
                    canViewFinancialData ? (
                      <FormField
                        control={serviceForm.control}
                        name="pricePerHour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Per Hour</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                step="0.01"
                                className="h-12"
                                data-testid="input-price-per-hour"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-md border border-border">
                        <p className="text-sm text-muted-foreground">
                          Pricing fields require financial data access. Management can add pricing later.
                        </p>
                      </div>
                    )
                  )}

                  {/* Description field for service notes */}
                  <FormField
                    control={serviceForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description / Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Add any specific notes, scope details, or special requirements for this service..."
                            className="min-h-[100px] resize-none"
                            data-testid="input-service-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 h-12"
                    data-testid="button-save-service-config"
                  >
                    Save Configuration
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
