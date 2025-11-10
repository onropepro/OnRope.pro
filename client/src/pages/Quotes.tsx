import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  Search
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    id: "pressure_washing", 
    name: "Pressure Washing", 
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
];

// Form schemas
const buildingInfoSchema = z.object({
  buildingName: z.string().min(1, "Building name is required"),
  strataPlanNumber: z.string().min(1, "Strata plan number is required"),
  buildingAddress: z.string().min(1, "Building address is required"),
  floorCount: z.coerce.number().min(1, "Floor count must be at least 1"),
});

const serviceFormSchema = z.object({
  serviceType: z.string(),
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
  const { toast } = useToast();
  
  // View states
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [activeTab, setActiveTab] = useState<"create" | "my-quotes">("my-quotes");
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
  
  // Check if user can view financial data (company owner OR has permission)
  const canViewFinancialData = currentUser?.role === "company" || 
                                currentUser?.permissions?.includes("view_financial_data");
  
  // Check if user can edit quotes (management OR has permission)
  const canEditQuotes = ["company", "operations_manager", "supervisor"].includes(currentUser?.role || "") ||
                        currentUser?.permissions?.includes("edit_quotes");

  // Fetch quotes
  const { data: quotesData, isLoading } = useQuery<{ quotes: QuoteWithServices[] }>({
    queryKey: ["/api/quotes"],
  });

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
      await apiRequest("POST", `/api/quotes/${id}/submit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      setIsSubmitDialogOpen(false);
      setQuoteToSubmit(null);
      setView("list");
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
      // Simple services: hours + price per hour
      totalHours = data.simpleServiceHours || 0;
      totalCost = totalHours * (data.pricePerHour || 0);
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
        <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/management">
              <Button
                variant="ghost"
                className="mb-6"
                data-testid="button-back-to-dashboard"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#0A0A0A] mb-2">Service Quotes</h1>
              <p className="text-[#71717A]">Create and manage service quotes for buildings</p>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "create" | "my-quotes")}>
              <TabsList className="mb-6">
                <TabsTrigger value="my-quotes" data-testid="tab-my-quotes">My Quotes</TabsTrigger>
                <TabsTrigger value="create" data-testid="tab-create">Create Quote</TabsTrigger>
              </TabsList>

              <TabsContent value="my-quotes">
                {/* Search bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                    <Input
                      placeholder="Search by strata plan number or building name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-quotes"
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-[#71717A]">Loading quotes...</p>
                  </div>
                ) : filteredQuotes.length === 0 ? (
                  <Card className="rounded-2xl shadow-lg border border-[#F4F4F5]">
                    <CardContent className="p-12 text-center">
                      <Building2 className="w-12 h-12 text-[#71717A] mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-[#0A0A0A] mb-2">
                        {searchQuery ? "No quotes found" : "No quotes yet"}
                      </h3>
                      <p className="text-[#71717A] mb-6">
                        {searchQuery ? "Try a different search term" : "Create your first service quote to get started"}
                      </p>
                      {!searchQuery && (
                        <Button
                          onClick={() => setActiveTab("create")}
                          className="bg-[#3B82F6] hover:bg-[#3B82F6]/90"
                          data-testid="button-create-first-quote"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Quote
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredQuotes.map((quote) => (
                      <Card
                        key={quote.id}
                        className="rounded-2xl shadow-lg border border-[#F4F4F5] hover:shadow-xl transition-shadow cursor-pointer"
                        onClick={() => {
                          setSelectedQuote(quote);
                          setView("detail");
                        }}
                        data-testid={`card-quote-${quote.id}`}
                      >
                        <CardHeader className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <CardTitle className="text-xl font-semibold text-[#0A0A0A] mb-1">
                                {quote.buildingName}
                              </CardTitle>
                              <CardDescription className="text-[#71717A]">
                                {quote.strataPlanNumber}
                              </CardDescription>
                            </div>
                            <Badge
                              className={`rounded-full px-3 py-1 ${
                                quote.status === "open"
                                  ? "bg-[#06B6D4] text-white"
                                  : quote.status === "draft"
                                  ? "bg-[#71717A] text-white"
                                  : "bg-[#84CC16] text-white"
                              }`}
                              data-testid={`badge-status-${quote.id}`}
                            >
                              {quote.status}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm text-[#71717A]">
                            <p>{quote.buildingAddress}</p>
                            <p>{quote.floorCount} floors</p>
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
                              <span className="text-[#71717A]">Services:</span>
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
                <Card className="rounded-2xl shadow-lg border border-[#F4F4F5]">
                  <CardContent className="p-12 text-center">
                    <Building2 className="w-12 h-12 text-[#71717A] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#0A0A0A] mb-2">Create a new quote</h3>
                    <p className="text-[#71717A] mb-6">Start creating a service quote for a building</p>
                    <Button
                      onClick={() => {
                        resetForm();
                        setView("create");
                      }}
                      className="bg-[#3B82F6] hover:bg-[#3B82F6]/90"
                      data-testid="button-create-quote"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Quote
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      );
    }

    // Management view (no tabs)
    return (
      <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/management">
            <Button
              variant="ghost"
              className="mb-6"
              data-testid="button-back-to-dashboard"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#0A0A0A] mb-2">Service Quotes</h1>
              <p className="text-[#71717A]">Create and manage service quotes for buildings</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setView("create");
              }}
              className="bg-[#3B82F6] hover:bg-[#3B82F6]/90"
              data-testid="button-create-quote"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Quote
            </Button>
          </div>

          {/* Search bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#71717A]" />
              <Input
                placeholder="Search by strata plan number or building name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-quotes"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-[#71717A]">Loading quotes...</p>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <Card className="rounded-2xl shadow-lg border border-[#F4F4F5]">
              <CardContent className="p-12 text-center">
                <Building2 className="w-12 h-12 text-[#71717A] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0A0A0A] mb-2">
                  {searchQuery ? "No quotes found" : "No quotes yet"}
                </h3>
                <p className="text-[#71717A] mb-6">
                  {searchQuery ? "Try a different search term" : "Create your first service quote to get started"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => {
                      resetForm();
                      setView("create");
                    }}
                    className="bg-[#3B82F6] hover:bg-[#3B82F6]/90"
                    data-testid="button-create-first-quote"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Quote
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredQuotes.map((quote) => (
                <Card
                  key={quote.id}
                  className="rounded-2xl shadow-lg border border-[#F4F4F5] hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedQuote(quote);
                    setView("detail");
                  }}
                  data-testid={`card-quote-${quote.id}`}
                >
                  <CardHeader className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-semibold text-[#0A0A0A] mb-1">
                          {quote.buildingName}
                        </CardTitle>
                        <CardDescription className="text-[#71717A]">
                          {quote.strataPlanNumber}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`rounded-full px-3 py-1 ${
                          quote.status === "open"
                            ? "bg-[#06B6D4] text-white"
                            : quote.status === "draft"
                            ? "bg-[#71717A] text-white"
                            : "bg-[#84CC16] text-white"
                        }`}
                        data-testid={`badge-status-${quote.id}`}
                      >
                        {quote.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-[#71717A]">
                      <p>{quote.buildingAddress}</p>
                      <p>{quote.floorCount} floors</p>
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
                        <span className="text-[#71717A]">Services:</span>
                        <Badge variant="outline" data-testid={`badge-service-count-${quote.id}`}>
                          {quote.services.length}
                        </Badge>
                      </div>
                      {canViewFinancialData && (
                        <div className="flex items-center justify-between">
                          <span className="text-[#71717A]">Total:</span>
                          <span className="text-2xl font-bold text-[#3B82F6]">
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
        </div>
      </div>
    );
  }

  // Render detail view
  if (view === "detail" && selectedQuote) {
    return (
      <>
        <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedQuote(null);
              setView("list");
            }}
            className="mb-6"
            data-testid="button-back-to-list"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quotes
          </Button>

          <Card className="rounded-2xl shadow-lg border border-[#F4F4F5] mb-8">
            <CardHeader className="p-4 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle className="text-3xl font-bold text-[#0A0A0A] mb-2">
                    {selectedQuote.buildingName}
                  </CardTitle>
                  <CardDescription className="text-lg text-[#71717A]">
                    {selectedQuote.strataPlanNumber}
                  </CardDescription>
                </div>
                <Badge
                  className={`rounded-full px-4 py-2 text-base ${
                    selectedQuote.status === "open"
                      ? "bg-[#06B6D4] text-white"
                      : "bg-[#84CC16] text-white"
                  }`}
                >
                  {selectedQuote.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[#71717A]">
                <div>
                  <p className="text-sm mb-1">Address</p>
                  <p className="font-medium text-[#0A0A0A]">{selectedQuote.buildingAddress}</p>
                </div>
                <div>
                  <p className="text-sm mb-1">Floor Count</p>
                  <p className="font-medium text-[#0A0A0A]">{selectedQuote.floorCount} floors</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Building Photo Section - visible to all if photo exists, or to editors for upload */}
          {(selectedQuote.photoUrl || canEditQuotes) && (
            <Card className="rounded-2xl shadow-lg border border-[#F4F4F5] mb-8">
              <CardHeader className="p-4 md:p-8">
                <CardTitle className="text-xl font-bold text-[#0A0A0A] mb-4">Building Photo</CardTitle>
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
                    <div className="border-2 border-dashed border-[#E4E4E7] rounded-lg p-8 hover:border-[#3B82F6] transition-colors">
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
                        <Image className="w-16 h-16 text-[#71717A] mb-3" />
                        <p className="text-lg text-[#71717A] text-center">
                          {uploadingPhoto ? "Uploading..." : "Click to upload building photo"}
                        </p>
                      </label>
                    </div>
                )}
              </CardHeader>
            </Card>
          )}

          <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">Services</h2>
          <div className="space-y-6 mb-8">
            {selectedQuote.services.map((service) => {
              const serviceConfig = SERVICE_TYPES.find(s => s.id === service.serviceType);
              const Icon = serviceConfig?.icon || Building2;

              return (
                <Card key={service.id} className="rounded-2xl shadow-lg border border-[#F4F4F5]">
                  <CardHeader className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#3B82F6]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-[#0A0A0A]">
                          {serviceConfig?.name || service.serviceType}
                        </CardTitle>
                        <CardDescription>
                          {serviceConfig?.description}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {serviceConfig?.requiresElevation && (
                        <>
                          <div>
                            <p className="text-[#71717A] mb-1">North</p>
                            <p className="font-medium text-[#0A0A0A]">{service.dropsNorth || 0} drops</p>
                          </div>
                          <div>
                            <p className="text-[#71717A] mb-1">East</p>
                            <p className="font-medium text-[#0A0A0A]">{service.dropsEast || 0} drops</p>
                          </div>
                          <div>
                            <p className="text-[#71717A] mb-1">South</p>
                            <p className="font-medium text-[#0A0A0A]">{service.dropsSouth || 0} drops</p>
                          </div>
                          <div>
                            <p className="text-[#71717A] mb-1">West</p>
                            <p className="font-medium text-[#0A0A0A]">{service.dropsWest || 0} drops</p>
                          </div>
                          <div>
                            <p className="text-[#71717A] mb-1">Drops/Day</p>
                            <p className="font-medium text-[#0A0A0A]">{service.dropsPerDay}</p>
                          </div>
                        </>
                      )}

                      {service.serviceType === "parkade" && (
                        <>
                          <div>
                            <p className="text-[#71717A] mb-1">Stalls</p>
                            <p className="font-medium text-[#0A0A0A]">{service.parkadeStalls}</p>
                          </div>
                          {canViewFinancialData && (
                            <div>
                              <p className="text-[#71717A] mb-1">Price/Stall</p>
                              <p className="font-medium text-[#0A0A0A]">${Number(service.pricePerStall).toFixed(2)}</p>
                            </div>
                          )}
                        </>
                      )}

                      {service.serviceType === "ground_windows" && (
                        <div>
                          <p className="text-[#71717A] mb-1">Hours</p>
                          <p className="font-medium text-[#0A0A0A]">{Number(service.groundWindowHours).toFixed(1)}</p>
                        </div>
                      )}

                      {service.serviceType === "in_suite" && (
                        <>
                          {service.suitesPerDay && (
                            <div>
                              <p className="text-[#71717A] mb-1">Suites/Day</p>
                              <p className="font-medium text-[#0A0A0A]">{service.suitesPerDay}</p>
                            </div>
                          )}
                          {service.floorsPerDay && (
                            <div>
                              <p className="text-[#71717A] mb-1">Floors/Day</p>
                              <p className="font-medium text-[#0A0A0A]">{service.floorsPerDay}</p>
                            </div>
                          )}
                        </>
                      )}

                      {canViewFinancialData && (
                        <>
                          <div>
                            <p className="text-[#71717A] mb-1">Price/Hour</p>
                            <p className="font-medium text-[#0A0A0A]">${Number(service.pricePerHour).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[#71717A] mb-1">Total Hours</p>
                            <p className="font-medium text-[#0A0A0A]">{Number(service.totalHours).toFixed(1)}</p>
                          </div>
                          <div>
                            <p className="text-[#71717A] mb-1">Total Cost</p>
                            <p className="text-xl font-bold text-[#3B82F6]">
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
            <Card className="rounded-2xl shadow-lg border border-[#F4F4F5] bg-[#3B82F6]/5">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0A0A0A] mb-1">Quote Total</h3>
                    <p className="text-[#71717A]">
                      {selectedQuote.services.length} service{selectedQuote.services.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-4xl font-bold text-[#3B82F6]">
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
                className="bg-[#3B82F6] hover:bg-[#3B82F6]/90"
                data-testid="button-edit-quote"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Quote
              </Button>
            )}
            {selectedQuote.status === "open" && (
              <Button
                onClick={() => closeQuoteMutation.mutate(selectedQuote.id)}
                disabled={closeQuoteMutation.isPending}
                className="bg-[#84CC16] hover:bg-[#84CC16]/90"
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
              Delete Quote
            </Button>
          </div>
        </div>
        </div>

        {/* Edit Quote Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Edit Quote</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit((data) => editQuoteMutation.mutate(data))} className="space-y-6">
                {/* Building Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Building Information</h3>
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
                              <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-[#3B82F6]" />
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
                      <p className="text-sm text-[#71717A]">Current Photo</p>
                    </div>
                  )}
                  <div className="border-2 border-dashed border-[#E4E4E7] rounded-lg p-6 hover:border-[#3B82F6] transition-colors">
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
                      <Image className="w-12 h-12 text-[#71717A] mb-2" />
                      <p className="text-sm text-[#71717A] text-center">
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
                    className="bg-[#3B82F6] hover:bg-[#3B82F6]/90"
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

      </>
    );
  }

  // Render create view - Building info step
  if (view === "create" && createStep === "building") {
    return (
      <div className="min-h-screen bg-[#FAFAFA] p-8">
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

          <Card className="rounded-2xl shadow-lg border border-[#F4F4F5]">
            <CardHeader className="p-8">
              <CardTitle className="text-3xl font-bold text-[#0A0A0A] mb-2">
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

                  <div className="space-y-2">
                    <Label>Building Photo (Optional)</Label>
                    <div className="border-2 border-dashed border-[#E4E4E7] rounded-lg p-6 hover:border-[#3B82F6] transition-colors">
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
                        <Image className="w-12 h-12 text-[#71717A] mb-2" />
                        <p className="text-sm text-[#71717A] text-center">
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
                    className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 h-12"
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
      <div className="min-h-screen bg-[#FAFAFA] p-8">
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
            Back to Quotes
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#0A0A0A] mb-2">Select Services</h1>
            <p className="text-[#71717A] text-lg">
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
                      ? "border-[#3B82F6] bg-[#3B82F6]/5"
                      : "border-[#F4F4F5] hover:border-[#3B82F6]/30"
                  }`}
                  data-testid={`card-service-${service.id}`}
                >
                  <CardHeader className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                          isSelected ? "bg-[#3B82F6]" : "bg-[#F4F4F5]"
                        }`}
                      >
                        <Icon className={`w-8 h-8 ${isSelected ? "text-white" : "text-[#71717A]"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-[#0A0A0A]">{service.name}</h3>
                          {isConfigured && (
                            <Badge className="bg-[#84CC16] text-white rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-[#71717A]">{service.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleServiceToggle(service.id)}
                        variant={isSelected ? "destructive" : "default"}
                        className={`flex-1 ${
                          !isSelected ? "bg-[#3B82F6] hover:bg-[#3B82F6]/90" : ""
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
            <Card className="rounded-2xl shadow-lg border border-[#F4F4F5] bg-[#3B82F6]/5">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0A0A0A] mb-1">
                      {selectedServices.length} Service{selectedServices.length !== 1 ? 's' : ''} Selected
                    </h3>
                    <p className="text-[#71717A]">
                      {canFinalize
                        ? "All services configured. Ready to create quote."
                        : "Please configure all selected services."}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#71717A] mb-1">Estimated Total</p>
                    <p className="text-3xl font-bold text-[#3B82F6]">
                      ${calculateQuoteTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setCreateStep("building")}
                  disabled={!canFinalize}
                  className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 h-12"
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
      <div className="min-h-screen bg-[#FAFAFA] p-8">
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

          <Card className="rounded-2xl shadow-lg border border-[#F4F4F5]">
            <CardHeader className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-[#3B82F6] flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-[#0A0A0A] mb-1">
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
                  {service.requiresElevation && 
                   (serviceBeingConfigured !== "dryer_vent_cleaning" || 
                    serviceForm.watch("dryerVentPricingType") === "per_hour") && (
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

                      {serviceForm.watch("dryerVentPricingType") === "per_unit" && (
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
                                      data-testid="input-dryer-vent-price-per-unit"
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
                    </>
                  )}

                  {(serviceBeingConfigured === "general_pressure_washing" || serviceBeingConfigured === "gutter_cleaning") && (
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
                    className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 h-12"
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
