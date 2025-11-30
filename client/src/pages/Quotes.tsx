import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BackButton } from "@/components/BackButton";
import { hasFinancialAccess, isManagement, hasPermission } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertQuoteSchema, type QuoteWithServices } from "@shared/schema";
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
  Kanban
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';

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
  { id: "draft", color: "bg-muted-foreground" },
  { id: "submitted", color: "bg-blue-500" },
  { id: "review", color: "bg-yellow-500" },
  { id: "negotiation", color: "bg-orange-500" },
  { id: "approved", color: "bg-purple-500" },
  { id: "won", color: "bg-green-500" },
  { id: "lost", color: "bg-red-500" },
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
      className={`bg-card border rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${isDragging ? 'shadow-lg ring-2 ring-primary' : ''}`}
      {...attributes}
      {...listeners}
      data-testid={`draggable-quote-${quote.id}`}
    >
      <div className="flex items-start gap-2 mb-2">
        <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{quote.buildingName}</h4>
          <p className="text-xs text-muted-foreground truncate">{quote.strataPlanNumber}</p>
        </div>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p className="truncate">{quote.buildingAddress}</p>
        <div className="flex items-center justify-between">
          <span>{quote.services.length} {t('quotes.pipeline.services', 'services')}</span>
          {totalAmount > 0 && (
            <span className="font-medium text-foreground">${totalAmount.toLocaleString()}</span>
          )}
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="mt-2 text-xs text-primary hover:underline"
        data-testid={`button-view-quote-${quote.id}`}
      >
        {t('quotes.pipeline.viewDetails', 'View Details')}
      </button>
    </div>
  );
}

// Droppable Stage Column component for Kanban
function StageColumn({ 
  stageId, 
  quotes, 
  onQuoteClick,
  color 
}: { 
  stageId: string; 
  quotes: QuoteWithServices[]; 
  onQuoteClick: (quote: QuoteWithServices) => void;
  color: string;
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
      className={`flex flex-col min-w-[280px] max-w-[320px] bg-muted/30 rounded-lg p-2 ${isOver ? 'ring-2 ring-primary bg-primary/5' : ''}`}
      data-testid={`stage-column-${stageId}`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <h3 className="font-semibold text-sm">{stageName}</h3>
          <Badge variant="secondary" className="text-xs">{quotes.length}</Badge>
        </div>
        {totalValue > 0 && (
          <span className="text-xs text-muted-foreground">${totalValue.toLocaleString()}</span>
        )}
      </div>
      <div className="flex-1 space-y-2 min-h-[200px] overflow-y-auto max-h-[calc(100vh-300px)]">
        {quotes.length === 0 ? (
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-muted-foreground/20 rounded-lg">
            <p className="text-xs text-muted-foreground">{t('quotes.pipeline.dragHere', 'Drag quotes here')}</p>
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
  
  // Form data
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfoFormData | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [configuredServices, setConfiguredServices] = useState<Map<string, ServiceFormData>>(new Map());
  const [serviceBeingConfigured, setServiceBeingConfigured] = useState<string | null>(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
      
      // Create quote with services in a single atomic request
      const quoteResponse = await apiRequest("POST", "/api/quotes", {
        buildingName: buildingInfo.buildingName,
        strataPlanNumber: buildingInfo.strataPlanNumber,
        buildingAddress: buildingInfo.buildingAddress,
        floorCount: buildingInfo.floorCount,
        strataManagerName: buildingInfo.strataManagerName,
        strataManagerAddress: buildingInfo.strataManagerAddress,
        status: "open",
        services, // Include services array
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
        };
      });
      
      const payload = {
        ...data,
        services,
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
    setCreateStep("services");
    buildingForm.reset();
    serviceForm.reset();
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
        parkadeStalls: data.parkadeStalls,
        pricePerStall: data.pricePerStall,
        totalCost,
      } as ServiceFormData;
    } else if (serviceBeingConfigured === "dryer_vent_cleaning" && data.dryerVentPricingType === "per_unit") {
      configData = {
        serviceType: data.serviceType,
        dryerVentPricingType: data.dryerVentPricingType,
        dryerVentUnits: data.dryerVentUnits,
        dryerVentPricePerUnit: data.dryerVentPricePerUnit,
        totalCost,
      } as ServiceFormData;
    } else if (serviceBeingConfigured === "general_pressure_washing" || serviceBeingConfigured === "gutter_cleaning") {
      configData = {
        serviceType: data.serviceType,
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
  
  // Download quote as professional HTML file
  const downloadQuote = (quote: QuoteWithServices) => {
    const serviceNames: Record<string, string> = {
      window_cleaning: "Window Cleaning",
      dryer_vent_cleaning: "Exterior Dryer Vent Cleaning",
      building_wash: "Building Wash - Pressure washing",
      general_pressure_washing: "General Pressure Washing",
      gutter_cleaning: "Gutter Cleaning",
      parkade: "Parkade Cleaning",
      ground_windows: "Ground Windows",
      in_suite: "In-Suite Dryer Vent",
      painting: "Painting",
      custom: "Custom Service"
    };

    const grandTotal = quote.services.reduce((sum, s) => sum + Number(s.totalCost || 0), 0);
    const companyName = currentUser?.companyName || "Rope Access Company";

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Quote - ${quote.strataPlanNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 60px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 3px solid #3B82F6; padding-bottom: 30px; margin-bottom: 40px; }
        .header h1 { color: #3B82F6; font-size: 32px; margin-bottom: 8px; }
        .header .subtitle { color: #71717A; font-size: 18px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        .info-section h3 { color: #3B82F6; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .info-section p { color: #333; margin-bottom: 5px; }
        .info-section strong { font-weight: 600; }
        .services-section { margin: 40px 0; }
        .services-section h2 { color: #0A0A0A; font-size: 24px; margin-bottom: 25px; border-bottom: 2px solid #E4E4E7; padding-bottom: 10px; }
        .service-item { background: #FAFAFA; border: 1px solid #E4E4E7; border-radius: 8px; padding: 25px; margin-bottom: 20px; }
        .service-item h3 { color: #0A0A0A; font-size: 18px; margin-bottom: 15px; }
        .service-details { color: #71717A; font-size: 14px; }
        .service-details p { margin: 8px 0; padding-left: 10px; }
        .pricing-row { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #E4E4E7; }
        .pricing-row strong { color: #0A0A0A; }
        .total-section { background: #3B82F6; color: white; padding: 30px; border-radius: 8px; text-align: right; margin-top: 30px; }
        .total-section h3 { font-size: 16px; margin-bottom: 10px; font-weight: 500; opacity: 0.9; }
        .total-section .amount { font-size: 36px; font-weight: bold; }
        .footer { margin-top: 50px; padding-top: 30px; border-top: 2px solid #E4E4E7; text-align: center; color: #71717A; font-size: 14px; }
        @media print { body { background: white; margin: 0; padding: 0; } .container { box-shadow: none; padding: 40px; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SERVICE QUOTE</h1>
            <p class="subtitle">Rope Access & High-Rise Maintenance Services</p>
        </div>

        <div class="info-grid">
            <div class="info-section">
                <h3>Quote Information</h3>
                <p><strong>Quote Date:</strong> ${quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                <p><strong>Quote Number:</strong> ${quote.strataPlanNumber}</p>
                <p><strong>Status:</strong> ${quote.status.toUpperCase()}</p>
            </div>
            <div class="info-section">
                <h3>Property Information</h3>
                <p><strong>Building:</strong> ${quote.buildingName}</p>
                <p><strong>Address:</strong> ${quote.buildingAddress}</p>
                <p><strong>Floors:</strong> ${quote.floorCount}</p>
            </div>
        </div>

        ${quote.strataManagerName || quote.strataManagerAddress ? `
        <div class="info-grid">
            <div class="info-section">
                <h3>Strata Property Manager</h3>
                ${quote.strataManagerName ? `<p><strong>Name:</strong> ${quote.strataManagerName}</p>` : ''}
                ${quote.strataManagerAddress ? `<p><strong>Address:</strong> ${quote.strataManagerAddress}</p>` : ''}
            </div>
        </div>
        ` : ''}

        <div class="services-section">
            <h2>Services Proposed</h2>
            ${quote.services.map((service, index) => {
              const serviceName = service.customServiceName || serviceNames[service.serviceType] || service.serviceType;
              let details = [];

              if (service.dropsNorth || service.dropsEast || service.dropsSouth || service.dropsWest) {
                details.push(`<p><strong>Elevation Drops:</strong> North: ${service.dropsNorth || 0}, East: ${service.dropsEast || 0}, South: ${service.dropsSouth || 0}, West: ${service.dropsWest || 0}</p>`);
                if (service.dropsPerDay) details.push(`<p><strong>Drops per Day:</strong> ${service.dropsPerDay}</p>`);
              }

              if (service.parkadeStalls) {
                details.push(`<p><strong>Parking Stalls:</strong> ${service.parkadeStalls}</p>`);
              }

              if (service.groundWindowHours) {
                details.push(`<p><strong>Estimated Hours:</strong> ${service.groundWindowHours}</p>`);
              }

              if (service.suitesPerDay) {
                details.push(`<p><strong>Suites per Day:</strong> ${service.suitesPerDay}</p>`);
              }

              if (service.floorsPerDay) {
                details.push(`<p><strong>Floors per Day:</strong> ${service.floorsPerDay}</p>`);
              }

              return `
                <div class="service-item">
                    <h3>${index + 1}. ${serviceName}</h3>
                    <div class="service-details">
                        ${details.join('')}
                        ${canViewFinancialData && service.totalHours ? `<p><strong>Total Hours:</strong> ${service.totalHours}</p>` : ''}
                        ${canViewFinancialData && service.pricePerHour ? `<p><strong>Hourly Rate:</strong> $${Number(service.pricePerHour).toFixed(2)}/hour</p>` : ''}
                        ${canViewFinancialData && service.pricePerStall ? `<p><strong>Price per Stall:</strong> $${Number(service.pricePerStall).toFixed(2)}</p>` : ''}
                    </div>
                    ${canViewFinancialData && service.totalCost ? `
                    <div class="pricing-row">
                        <strong>Service Total</strong>
                        <strong>$${Number(service.totalCost).toFixed(2)}</strong>
                    </div>
                    ` : ''}
                </div>
              `;
            }).join('')}
        </div>

        ${canViewFinancialData ? `
        <div class="total-section">
            <h3>TOTAL INVESTMENT</h3>
            <div class="amount">$${grandTotal.toFixed(2)}</div>
        </div>
        ` : ''}

        <div class="footer">
            <p><strong>${companyName}</strong></p>
            <p>Professional Rope Access & High-Rise Maintenance Services</p>
            <p style="margin-top: 15px; font-size: 12px;">This quote is valid for 30 days from the date of issue. All work will be completed in accordance with IRATA standards and local safety regulations.</p>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quote_${quote.strataPlanNumber}_${new Date(quote.createdAt || Date.now()).toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            <BackButton to="/dashboard" label={t('quotes.backToDashboard', 'Back to Dashboard')} />

            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">{t('quotes.pageTitle', 'Service Quotes')}</h1>
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
                      placeholder={t('quotes.searchPlaceholder', 'Search by strata plan number or building name...')}
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
                              <CardTitle className="text-xl font-semibold text-foreground mb-1">
                                {quote.buildingName}
                              </CardTitle>
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
                                {new Date(quote.createdAt).toLocaleDateString()}
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
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <BackButton to="/dashboard" label={t('quotes.backToDashboard', 'Back to Dashboard')} />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{t('quotes.pageTitle', 'Service Quotes')}</h1>
              <p className="text-muted-foreground">{t('quotes.pageSubtitle', 'Create and manage service quotes for buildings')}</p>
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
          <Tabs value={managementTab} onValueChange={(value) => setManagementTab(value as "list" | "pipeline" | "analytics")} className="mb-6">
            <TabsList className="mb-6">
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
                    placeholder={t('quotes.searchPlaceholder', 'Search by strata plan number or building name...')}
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
                            <CardTitle className="text-xl font-semibold text-foreground mb-1">
                              {quote.buildingName}
                            </CardTitle>
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
                              {new Date(quote.createdAt).toLocaleDateString()}
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
                          {canViewFinancialData && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">{t('quotes.total', 'Total')}:</span>
                              <span className="text-2xl font-bold text-primary">
                                ${quote.services.reduce((sum, s) => sum + Number(s.totalCost || 0), 0).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Pipeline Tab - Kanban Board */}
            <TabsContent value="pipeline">
              <div className="mb-4">
                <p className="text-muted-foreground">
                  {t('quotes.pipeline.description', 'Drag quotes between stages to track their progress through your sales pipeline.')}
                </p>
              </div>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('quotes.loading', 'Loading quotes...')}</p>
                </div>
              ) : (
                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                  <div className="flex gap-4 overflow-x-auto pb-4">
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
          <BackButton 
            onClick={() => {
              setSelectedQuote(null);
              setView("list");
            }}
            label={t('quotes.backToQuotes', 'Back to Quotes')}
          />

          <Card className="rounded-2xl shadow-lg border border-border mb-8">
            <CardHeader className="p-4 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle className="text-3xl font-bold text-foreground mb-2">
                    {selectedQuote.buildingName}
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground">
                    {selectedQuote.strataPlanNumber}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge
                    className={`rounded-full px-4 py-2 text-base ${
                      selectedQuote.status === "draft"
                        ? "bg-muted-foreground text-white"
                        : selectedQuote.status === "submitted"
                        ? "bg-primary text-white"
                        : selectedQuote.status === "open"
                        ? "bg-chart-2 text-white"
                        : "bg-success text-white"
                    }`}
                    data-testid="badge-quote-status"
                  >
                    {selectedQuote.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => downloadQuote(selectedQuote)}
                      variant="outline"
                      data-testid="button-download-quote"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {t('quotes.download', 'Download')}
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
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">{t('quotes.quoteTotal', 'Quote Total')}</h3>
                    <p className="text-muted-foreground">
                      {selectedQuote.services.length} service{selectedQuote.services.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-4xl font-bold text-primary">
                    ${selectedQuote.services.reduce((sum, s) => sum + Number(s.totalCost || 0), 0).toFixed(2)}
                  </div>
                </div>
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
                className="bg-success hover:bg-success/90"
                data-testid="button-close-quote"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Close Quote
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
                            <Input {...field} className="h-12" data-testid="input-edit-building-address" />
                          </FormControl>
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
                            <Input {...field} className="h-12" data-testid="input-edit-strata-manager-address" />
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
                          <Input
                            {...field}
                            placeholder="e.g., 123 Main Street, Vancouver, BC"
                            className="h-12"
                            data-testid="input-building-address"
                          />
                        </FormControl>
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

                  <div className="space-y-4">
                    <Label>Strata Property Manager (Optional)</Label>
                    <Select
                      onValueChange={(value) => {
                        const client = clients.find((c: any) => c.id === value);
                        if (client) {
                          buildingForm.setValue('strataManagerName', `${client.firstName} ${client.lastName}`);
                          buildingForm.setValue('strataManagerAddress', client.address || '');
                        }
                      }}
                    >
                      <SelectTrigger className="h-12" data-testid="select-client">
                        <SelectValue placeholder="Select from client list..." />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client: any) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.firstName} {client.lastName} {client.company ? `- ${client.company}` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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
                          <Input
                            {...field}
                            placeholder="e.g., 456 Business St, Vancouver, BC"
                            className="h-12"
                            data-testid="input-manager-address"
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
                      <p className="text-sm text-muted-foreground mb-1">Estimated Total</p>
                      <p className="text-3xl font-bold text-primary">
                        ${calculateQuoteTotal().toFixed(2)}
                      </p>
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
