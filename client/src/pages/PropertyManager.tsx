import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, Mail, Phone, Settings, FileText, Download, AlertCircle, CheckCircle2, Clock, Upload, FileCheck, Trash2, User, Shield, Users, Map, MapPin, Save, Loader2, Copy, Check } from "lucide-react";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { PropertyManagerBuildingsMap, MapBuildingData } from "@/components/PropertyManagerBuildingsMap";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { formatLocalDate, formatTimestampDate, formatTime, formatDurationMs } from "@/lib/dateUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePropertyManagerAccountSchema, type UpdatePropertyManagerAccount } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type VendorSummary = {
  linkId: string;
  id: string;
  companyName: string;
  email: string;
  phone: string | null;
  logo: string | null;
  activeProjectsCount: number;
  residentCode: string | null;
  propertyManagerCode: string | null;
  strataNumber: string | null;
  whitelabelBrandingActive: boolean;
  brandingColors: string | null;
  csrRating: number | null;
  csrLabel: string | null;
  csrColor: string | null;
};

type CsrRatingHistory = {
  id: string;
  companyId: string;
  previousScore: number;
  newScore: number;
  delta: number;
  category: string;
  reason: string;
  createdAt: string;
};

type PropertyManagerQuote = {
  id: string;
  quoteNumber: string | null;
  buildingName: string;
  strataPlanNumber: string;
  buildingAddress: string;
  status: string;
  pipelineStage: string;
  createdAt: string;
  companyName: string;
  grandTotal: number;
  serviceCount: number;
};

function QuotesSection() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const { data: quotesData, isLoading } = useQuery<{ quotes: PropertyManagerQuote[] }>({
    queryKey: ["/api/property-managers/me/quotes"],
  });

  const quotes = quotesData?.quotes || [];

  if (isLoading) {
    return (
      <Card className="mb-6" data-testid="card-my-quotes">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('propertyManager.quotes.title', 'My Quotes')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {t('propertyManager.quotes.loading', 'Loading quotes...')}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quotes.length === 0) {
    return (
      <Card className="mb-6" data-testid="card-my-quotes">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('propertyManager.quotes.title', 'My Quotes')}
          </CardTitle>
          <CardDescription>
            {t('propertyManager.quotes.noQuotesDescription', 'Service quotes from your vendors will appear here')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-semibold mb-2">{t('propertyManager.quotes.noQuotesTitle', 'No Quotes Yet')}</p>
            <p className="text-sm text-muted-foreground">
              {t('propertyManager.quotes.noQuotesMessage', 'When vendors send you quotes, they will appear here for review')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6" data-testid="card-my-quotes">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t('propertyManager.quotes.title', 'My Quotes')}
        </CardTitle>
        <CardDescription>
          {quotes.length === 1
            ? t('propertyManager.quotes.quoteCount', 'You have {{count}} quote to review', { count: quotes.length })
            : t('propertyManager.quotes.quoteCountPlural', 'You have {{count}} quotes to review', { count: quotes.length })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="p-4 border rounded-md hover-elevate cursor-pointer"
              onClick={() => setLocation(`/property-manager/quotes/${quote.id}`)}
              data-testid={`card-quote-${quote.id}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold" data-testid={`text-quote-building-${quote.id}`}>
                      {quote.buildingName}
                    </span>
                    {quote.quoteNumber && (
                      <Badge variant="outline" className="text-xs">
                        {quote.quoteNumber}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid={`text-quote-address-${quote.id}`}>
                    {quote.buildingAddress}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('propertyManager.quotes.fromVendor', 'From')}: {quote.companyName}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-lg font-bold" data-testid={`text-quote-total-${quote.id}`}>
                    ${quote.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {quote.serviceCount} {quote.serviceCount === 1 ? t('propertyManager.quotes.service', 'service') : t('propertyManager.quotes.services', 'services')}
                  </p>
                  <Badge 
                    variant={quote.pipelineStage === 'won' ? 'default' : quote.pipelineStage === 'lost' ? 'destructive' : 'secondary'}
                  >
                    {quote.pipelineStage}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PropertyManager() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [addCodeOpen, setAddCodeOpen] = useState(false);
  const [companyCode, setCompanyCode] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<VendorSummary | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pmCodeCopied, setPmCodeCopied] = useState(false);
  const [strataNumber, setStrataNumber] = useState("");
  const [uploadingAnchorInspection, setUploadingAnchorInspection] = useState(false);
  const [vendorToRemove, setVendorToRemove] = useState<VendorSummary | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [csrHistoryVendor, setCsrHistoryVendor] = useState<VendorSummary | null>(null);
  const [editBuildingInstructionsOpen, setEditBuildingInstructionsOpen] = useState(false);
  const [buildingInstructionsForm, setBuildingInstructionsForm] = useState({
    buildingAccess: "",
    keysAndFob: "",
    keysReturnPolicy: "",
    roofAccess: "",
    buildingManagerName: "",
    buildingManagerPhone: "",
    buildingManagerEmail: "",
    conciergeNames: "",
    conciergePhone: "",
    conciergeHours: "",
    maintenanceName: "",
    maintenancePhone: "",
    councilMemberUnits: "",
    tradeParkingInstructions: "",
    tradeParkingSpots: "",
    tradeWashroomLocation: "",
    specialRequests: "",
  });
  const [buildingAddressForm, setBuildingAddressForm] = useState({
    address: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });
  
  const accountForm = useForm<UpdatePropertyManagerAccount>({
    resolver: zodResolver(updatePropertyManagerAccountSchema),
    defaultValues: {
      name: "",
      email: "",
      propertyManagerPhoneNumber: "",
      propertyManagerSmsOptIn: false,
      propertyManagementCompany: "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const { data: vendorsData, isLoading } = useQuery<{ vendors: VendorSummary[] }>({
    queryKey: ["/api/property-managers/me/vendors"],
  });

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      
      // Clear ALL query cache to prevent stale data from causing redirect issues
      queryClient.clear();
      
      // Navigate to login page
      setLocation("/login");
      
      toast({
        title: t('propertyManager.toasts.loggedOut', 'Logged Out'),
        description: t('propertyManager.toasts.loggedOutDesc', 'You have been successfully logged out.'),
      });
    } catch (error) {
      toast({
        title: t('propertyManager.toasts.logoutFailed', 'Logout Failed'),
        description: t('propertyManager.toasts.logoutFailedDesc', 'An error occurred while logging out. Please try again.'),
        variant: "destructive",
      });
    }
  };

  const addVendorMutation = useMutation({
    mutationFn: async (code: string) => {
      return await apiRequest("POST", "/api/property-managers/vendors", { companyCode: code });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/property-managers/me/vendors"] });
      toast({
        title: t('propertyManager.toasts.vendorAdded', 'Vendor Added'),
        description: t('propertyManager.toasts.vendorAddedDesc', 'The company has been successfully added to your vendors list.'),
      });
      setCompanyCode("");
      setAddCodeOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t('propertyManager.toasts.failedToAddVendor', 'Failed to Add Vendor'),
        description: error.message || t('propertyManager.toasts.invalidCompanyCode', 'Invalid company code. Please check with the rope access company.'),
        variant: "destructive",
      });
    },
  });

  const removeVendorMutation = useMutation({
    mutationFn: async (linkId: string) => {
      return await apiRequest("DELETE", `/api/property-managers/vendors/${linkId}`, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/property-managers/me/vendors"] });
      toast({
        title: t('propertyManager.toasts.vendorRemoved', 'Vendor Removed'),
        description: t('propertyManager.toasts.vendorRemovedDesc', 'The vendor has been successfully removed from your list.'),
      });
      setVendorToRemove(null);
    },
    onError: (error: any) => {
      toast({
        title: t('propertyManager.toasts.failedToRemoveVendor', 'Failed to Remove Vendor'),
        description: error.message || t('propertyManager.toasts.failedToRemoveVendor', 'Failed to remove vendor. Please try again.'),
        variant: "destructive",
      });
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: async (data: UpdatePropertyManagerAccount) => {
      return await apiRequest("PATCH", "/api/property-managers/me/account", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t('propertyManager.toasts.accountUpdated', 'Account Updated'),
        description: t('propertyManager.toasts.accountUpdatedDesc', 'Your account settings have been successfully updated.'),
      });
      accountForm.reset();
      setSettingsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t('propertyManager.toasts.updateFailed', 'Update Failed'),
        description: error.message || t('propertyManager.toasts.updateFailedDesc', 'Failed to update account settings.'),
        variant: "destructive",
      });
    },
  });

  const updateStrataMutation = useMutation({
    mutationFn: async ({ linkId, strataNumber }: { linkId: string; strataNumber: string }) => {
      return await apiRequest("PATCH", `/api/property-managers/vendors/${linkId}`, { strataNumber });
    },
    onSuccess: async (data: any) => {
      // Invalidate and refetch vendors list
      await queryClient.invalidateQueries({ queryKey: ["/api/property-managers/me/vendors"] });
      
      // Update selectedVendor with the new strata number from the response
      if (selectedVendor && data?.link) {
        setSelectedVendor({
          ...selectedVendor,
          strataNumber: data.link.strataNumber,
        });
      }
      
      toast({
        title: t('propertyManager.toasts.strataUpdated', 'Strata Number Updated'),
        description: t('propertyManager.toasts.strataUpdatedDesc', 'The strata number has been saved successfully.'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('propertyManager.toasts.updateFailed', 'Update Failed'),
        description: error.message || t('propertyManager.toasts.strataUpdateFailed', 'Failed to update strata number.'),
        variant: "destructive",
      });
    },
  });

  const saveBuildingInstructionsMutation = useMutation({
    mutationFn: async (data: typeof buildingInstructionsForm) => {
      return await apiRequest(
        "PUT", 
        `/api/property-managers/vendors/${selectedVendor!.linkId}/projects/${selectedProject!.id}/building-instructions`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/property-managers/vendors", selectedVendor?.linkId, "projects", selectedProject?.id] 
      });
      toast({
        title: t('propertyManager.toasts.instructionsSaved', 'Instructions Saved'),
        description: t('propertyManager.toasts.instructionsSavedDesc', 'Building instructions have been saved successfully.'),
      });
      setEditBuildingInstructionsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t('propertyManager.toasts.saveFailed', 'Save Failed'),
        description: error.message || t('propertyManager.toasts.instructionsSaveFailedDesc', 'Failed to save building instructions.'),
        variant: "destructive",
      });
    },
  });

  const saveBuildingAddressMutation = useMutation({
    mutationFn: async (data: typeof buildingAddressForm) => {
      const buildingId = projectDetailsData?.project?.buildingId;
      if (!buildingId) throw new Error("Building not found");
      return await apiRequest("PATCH", `/api/buildings/${buildingId}/address`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/property-managers/vendors", selectedVendor?.linkId, "projects"] 
      });
      toast({
        title: t('common.saved', 'Saved'),
        description: t('propertyManager.toasts.addressUpdated', 'Building address has been updated.'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('propertyManager.toasts.addressUpdateFailed', 'Failed to update building address.'),
        variant: "destructive",
      });
    },
  });

  const { data: projectsData, isLoading: isLoadingProjects, error: projectsError } = useQuery({
    queryKey: ["/api/property-managers/vendors", selectedVendor?.linkId, "projects"],
    queryFn: async () => {
      const response = await fetch(`/api/property-managers/vendors/${selectedVendor!.linkId}/projects`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch projects');
      }
      return data;
    },
    enabled: !!selectedVendor?.linkId && !!selectedVendor?.strataNumber,
    retry: false,
  });

  const { data: projectDetailsData, isLoading: isLoadingProjectDetails, error: projectDetailsError } = useQuery({
    queryKey: ["/api/property-managers/vendors", selectedVendor?.linkId, "projects", selectedProject?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/property-managers/vendors/${selectedVendor!.linkId}/projects/${selectedProject!.id}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch project details');
      }
      return data;
    },
    enabled: !!selectedVendor?.linkId && !!selectedProject?.id,
    retry: false,
  });

  // Fetch CSR for selected vendor
  const { data: vendorCSRData, isLoading: isLoadingCSR } = useQuery<{
    csrRating: number;
    csrLabel: string;
    csrColor: string;
    breakdown: {
      documentationRating: number;
      toolboxMeetingRating: number;
      harnessInspectionRating: number;
    };
  }>({
    queryKey: ["/api/property-managers/vendors", selectedVendor?.linkId, "csr"],
    queryFn: async () => {
      const response = await fetch(
        `/api/property-managers/vendors/${selectedVendor!.linkId}/csr`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch CSR');
      }
      return data;
    },
    enabled: !!selectedVendor?.linkId,
    retry: false,
  });

  // Fetch complaint metrics for selected vendor (average resolution time)
  const { data: vendorMetricsData, isLoading: isLoadingMetrics } = useQuery<{
    metrics: {
      totalClosed: number;
      averageResolutionMs: number | null;
    };
  }>({
    queryKey: ["/api/complaints/metrics", selectedVendor?.id],
    enabled: !!selectedVendor?.id,
    retry: false,
  });

  // Fetch vendor documents (Certificate of Insurance, etc.)
  const { data: vendorDocumentsData, isLoading: isLoadingDocuments } = useQuery<{
    documents: Array<{
      id: string;
      documentType: string;
      fileName: string;
      fileUrl: string;
      createdAt: string;
    }>;
  }>({
    queryKey: ["/api/property-managers/vendors", selectedVendor?.linkId, "documents"],
    queryFn: async () => {
      const response = await fetch(
        `/api/property-managers/vendors/${selectedVendor!.linkId}/documents`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch documents');
      }
      return data;
    },
    enabled: !!selectedVendor?.linkId,
    retry: false,
  });

  // Fetch CSR history for a vendor when history dialog is open
  const { data: csrHistoryData, isLoading: isLoadingCsrHistory } = useQuery<{
    history: CsrRatingHistory[];
  }>({
    queryKey: ["/api/property-managers/vendors", csrHistoryVendor?.linkId, "csr", "history"],
    queryFn: async () => {
      const response = await fetch(
        `/api/property-managers/vendors/${csrHistoryVendor!.linkId}/csr/history`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch CSR history');
      }
      return data;
    },
    enabled: !!csrHistoryVendor?.linkId,
    retry: false,
  });

  // SECURITY: Clear selectedProject if details fetch fails to prevent showing stale data
  useEffect(() => {
    if (projectDetailsError) {
      toast({
        title: t('propertyManager.toasts.unableToLoadDetails', 'Unable to Load Project Details'),
        description: (projectDetailsError as Error).message || t('common.tryAgain', 'Please try again.'),
        variant: "destructive",
      });
      // Close dialog and clear selection to prevent stale data display
      setSelectedProject(null);
    }
  }, [projectDetailsError, toast, t]);

  useEffect(() => {
    // Only show toast once when error first appears
    if (projectsError) {
      const errorMessage = (projectsError as Error).message;
      // Don't show toast for "strata required" errors - those are handled in UI
      if (!errorMessage?.includes('Strata number required')) {
        toast({
          title: t('propertyManager.toasts.failedToLoadProjects', 'Failed to Load Projects'),
          description: errorMessage || t('propertyManager.toasts.unableToLoadProjects', 'Unable to load projects. Please try again.'),
          variant: "destructive",
        });
      }
    }
  }, [projectsError, t]);

  useEffect(() => {
    if (selectedVendor) {
      setStrataNumber(selectedVendor.strataNumber || "");
    }
  }, [selectedVendor]);

  // Populate building instructions form when project details data loads
  useEffect(() => {
    if (projectDetailsData?.buildingInstructions) {
      const bi = projectDetailsData.buildingInstructions;
      setBuildingInstructionsForm({
        buildingAccess: bi.buildingAccess || "",
        keysAndFob: bi.keysAndFob || "",
        keysReturnPolicy: bi.keysReturnPolicy || "",
        roofAccess: bi.roofAccess || "",
        buildingManagerName: bi.buildingManagerName || "",
        buildingManagerPhone: bi.buildingManagerPhone || "",
        buildingManagerEmail: bi.buildingManagerEmail || "",
        conciergeNames: bi.conciergeNames || "",
        conciergePhone: bi.conciergePhone || "",
        conciergeHours: bi.conciergeHours || "",
        maintenanceName: bi.maintenanceName || "",
        maintenancePhone: bi.maintenancePhone || "",
        councilMemberUnits: bi.councilMemberUnits || "",
        tradeParkingInstructions: bi.tradeParkingInstructions || "",
        tradeParkingSpots: bi.tradeParkingSpots?.toString() || "",
        tradeWashroomLocation: bi.tradeWashroomLocation || "",
        specialRequests: bi.specialRequests || "",
      });
    } else if (projectDetailsData && !projectDetailsData.buildingInstructions) {
      // Reset form if no instructions exist
      setBuildingInstructionsForm({
        buildingAccess: "",
        keysAndFob: "",
        keysReturnPolicy: "",
        roofAccess: "",
        buildingManagerName: "",
        buildingManagerPhone: "",
        buildingManagerEmail: "",
        conciergeNames: "",
        conciergePhone: "",
        conciergeHours: "",
        maintenanceName: "",
        maintenancePhone: "",
        councilMemberUnits: "",
        tradeParkingInstructions: "",
        tradeParkingSpots: "",
        tradeWashroomLocation: "",
        specialRequests: "",
      });
    }
    // Also set building address from project data
    if (projectDetailsData?.project) {
      setBuildingAddressForm({
        address: projectDetailsData.project.buildingAddress || "",
        latitude: null,
        longitude: null,
      });
    }
  }, [projectDetailsData]);

  // Apply vendor's brand colors when viewing a vendor with active branding
  useEffect(() => {
    // CSS variables to manage
    const cssVars = ['--primary', '--ring', '--sidebar-primary', '--primary-foreground', 
                     '--sidebar-primary-foreground', '--sidebar-ring',
                     '--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5'];
    
    // Helper to clear all brand CSS variables
    const clearBrandingVars = () => {
      cssVars.forEach(v => document.documentElement.style.removeProperty(v));
    };

    // If no vendor selected or vendor doesn't have active branding, clear all brand vars
    if (!selectedVendor || !selectedVendor.whitelabelBrandingActive || !selectedVendor.brandingColors) {
      clearBrandingVars();
      return;
    }

    // Parse brand colors (stored as JSON string)
    let colors: string[] = [];
    try {
      colors = typeof selectedVendor.brandingColors === 'string' 
        ? JSON.parse(selectedVendor.brandingColors) 
        : selectedVendor.brandingColors;
    } catch {
      colors = [];
    }

    if (colors.length === 0 || !colors[0]) {
      clearBrandingVars();
      return;
    }

    // Convert hex to HSL for CSS variables
    const hexToHSL = (hex: string | undefined): string => {
      if (!hex) return '240 10% 3.9%'; // fallback to default
      hex = hex.replace(/^#/, '');
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    const primaryHSL = hexToHSL(colors[0]);
    document.documentElement.style.setProperty('--primary', primaryHSL);
    document.documentElement.style.setProperty('--ring', primaryHSL);
    document.documentElement.style.setProperty('--sidebar-primary', primaryHSL);
    document.documentElement.style.setProperty('--sidebar-ring', primaryHSL);
    document.documentElement.style.setProperty('--chart-1', primaryHSL);
    
    // Calculate foreground color
    const l = parseInt(primaryHSL.split(' ')[2]);
    const foreground = l < 50 ? '0 0% 100%' : '240 10% 3.9%';
    document.documentElement.style.setProperty('--primary-foreground', foreground);
    document.documentElement.style.setProperty('--sidebar-primary-foreground', foreground);
    
    // Apply additional brand colors for charts
    if (colors[1]) document.documentElement.style.setProperty('--chart-2', hexToHSL(colors[1]));
    if (colors[2]) document.documentElement.style.setProperty('--chart-3', hexToHSL(colors[2]));
    if (colors[3]) document.documentElement.style.setProperty('--chart-4', hexToHSL(colors[3]));
    if (colors[4]) document.documentElement.style.setProperty('--chart-5', hexToHSL(colors[4]));
    
    // Cleanup on unmount - always clear brand vars
    return () => {
      clearBrandingVars();
    };
  }, [selectedVendor]);

  const handleSaveStrata = () => {
    if (!selectedVendor) return;
    updateStrataMutation.mutate({ 
      linkId: selectedVendor.linkId, 
      strataNumber: strataNumber.trim() 
    });
  };

  const handleAddVendor = () => {
    if (companyCode.trim().length !== 10) {
      toast({
        title: t('propertyManager.toasts.invalidCode', 'Invalid Code'),
        description: t('propertyManager.toasts.codeMustBe10Chars', 'Company code must be exactly 10 characters.'),
        variant: "destructive",
      });
      return;
    }
    addVendorMutation.mutate(companyCode.trim());
  };

  // Handle anchor inspection document upload
  const handleAnchorInspectionUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedProject || !selectedVendor) return;

    setUploadingAnchorInspection(true);
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch(
        `/api/property-managers/vendors/${selectedVendor.linkId}/projects/${selectedProject.id}/anchor-inspection`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      toast({
        title: t('propertyManager.toasts.uploadSuccess', 'Success'),
        description: t('propertyManager.toasts.anchorInspectionUploaded', 'Anchor inspection document uploaded successfully'),
      });

      // Refresh project details to show the new document
      queryClient.invalidateQueries({ 
        queryKey: ["/api/property-managers/vendors", selectedVendor.linkId, "projects", selectedProject.id] 
      });
    } catch (error: any) {
      toast({
        title: t('propertyManager.toasts.uploadError', 'Error'),
        description: error.message || t('propertyManager.toasts.uploadFailed', 'Failed to upload document'),
        variant: "destructive",
      });
    } finally {
      setUploadingAnchorInspection(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const onSubmitAccountSettings = (data: UpdatePropertyManagerAccount) => {
    // Filter out empty values
    const updateData: Partial<UpdatePropertyManagerAccount> = {};
    if (data.name && data.name !== userData?.user?.name) {
      updateData.name = data.name;
    }
    if (data.email && data.email !== userData?.user?.email) {
      updateData.email = data.email;
    }
    // Check phone number changes (allow clearing by comparing with empty string)
    const currentPhone = userData?.user?.propertyManagerPhoneNumber || '';
    const newPhone = data.propertyManagerPhoneNumber || '';
    if (newPhone !== currentPhone) {
      updateData.propertyManagerPhoneNumber = newPhone;
    }
    // Check SMS opt-in changes
    const currentSmsOptIn = userData?.user?.propertyManagerSmsOptIn ?? false;
    if (data.propertyManagerSmsOptIn !== currentSmsOptIn) {
      updateData.propertyManagerSmsOptIn = data.propertyManagerSmsOptIn;
    }
    if (data.newPassword) {
      updateData.currentPassword = data.currentPassword;
      updateData.newPassword = data.newPassword;
    }

    if (Object.keys(updateData).length === 0) {
      toast({
        title: t('propertyManager.toasts.noChanges', 'No Changes'),
        description: t('propertyManager.toasts.noChangesDesc', 'No changes were made to your account.'),
      });
      return;
    }

    updateAccountMutation.mutate(updateData as UpdatePropertyManagerAccount);
  };

  const vendors = vendorsData?.vendors || [];

  const handleMapBuildingSelect = (building: MapBuildingData) => {
    const vendor = vendors.find(v => v.linkId === building.vendorLinkId);
    if (vendor) {
      setSelectedVendor(vendor);
      setSelectedProject({
        id: building.projectId,
        strataPlanNumber: building.strataPlanNumber,
        buildingName: building.buildingName,
        buildingAddress: building.buildingAddress,
        jobType: building.jobType,
        customJobType: building.customJobType,
        status: building.status,
        startDate: building.startDate,
        endDate: building.endDate,
      });
    }
  };

  return (
    <div className="w-full bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">{t('propertyManager.title', 'My Vendors')}</h1>
            <p className="text-muted-foreground" data-testid="text-page-description">
              {t('propertyManager.description', 'Manage your connected rope access companies and view their information')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <InstallPWAButton />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  data-testid="button-profile" 
                  className="hover-elevate h-12 w-12"
                >
                  <User className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => {
                  accountForm.reset({
                    name: userData?.user?.name || "",
                    email: userData?.user?.email || "",
                    propertyManagerPhoneNumber: userData?.user?.propertyManagerPhoneNumber || "",
                    propertyManagerSmsOptIn: userData?.user?.propertyManagerSmsOptIn || false,
                    propertyManagementCompany: userData?.user?.propertyManagementCompany || "",
                    currentPassword: "",
                    newPassword: "",
                  });
                  setSettingsOpen(true);
                }}
                data-testid="menu-account-settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t('propertyManager.menu.accountSettings', 'Account Settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                data-testid="menu-logout"
              >
                <span className="material-icons text-base mr-2">logout</span>
                {t('propertyManager.menu.logout', 'Log Out')}
              </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* PM Code Section */}
        {userData?.user?.pmCode && (
          <Card className="mb-6" data-testid="card-pm-code">
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('propertyManager.pmCode.label', 'Your PM Code')}
                    </p>
                    <p className="font-mono text-lg font-semibold tracking-wider" data-testid="text-pm-code">
                      {userData.user.pmCode}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(userData.user.pmCode);
                    setPmCodeCopied(true);
                    setTimeout(() => setPmCodeCopied(false), 2000);
                    toast({
                      title: t('propertyManager.pmCode.copied', 'Code Copied'),
                      description: t('propertyManager.pmCode.copiedDesc', 'Your PM code has been copied to clipboard'),
                    });
                  }}
                  data-testid="button-copy-pm-code"
                >
                  {pmCodeCopied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {pmCodeCopied 
                    ? t('propertyManager.pmCode.copiedButton', 'Copied') 
                    : t('propertyManager.pmCode.copyButton', 'Copy Code')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6">
          <Card data-testid="card-buildings-map">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                {t('propertyManager.map.title', 'Buildings Map')}
              </CardTitle>
              <CardDescription>
                {t('propertyManager.map.description', 'View all your buildings with active projects on the map')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PropertyManagerBuildingsMap onBuildingSelect={handleMapBuildingSelect} />
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6" data-testid="card-my-vendors">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-4">
            <div>
              <CardTitle data-testid="text-vendors-title">{t('propertyManager.connectedVendors', 'Connected Vendors')}</CardTitle>
              <CardDescription data-testid="text-vendors-description">
                {vendors.length === 0 
                  ? t('propertyManager.noVendorsYet', 'No vendors connected yet. Add a company code to get started.')
                  : vendors.length === 1 
                    ? t('propertyManager.vendorCount', 'You have access to {{count}} rope access company', { count: vendors.length })
                    : t('propertyManager.vendorCountPlural', 'You have access to {{count}} rope access companies', { count: vendors.length })}
              </CardDescription>
            </div>
            <Button 
              onClick={() => setAddCodeOpen(true)}
              data-testid="button-add-vendor"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('propertyManager.addVendor', 'Add Vendor')}
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="text-loading">
                {t('propertyManager.loadingVendors', 'Loading vendors...')}
              </div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2" data-testid="text-no-vendors">{t('propertyManager.noVendorsTitle', 'No Vendors Yet')}</p>
                <p className="text-sm text-muted-foreground mb-4" data-testid="text-no-vendors-description">
                  {t('propertyManager.noVendorsDescription', 'Request a company code from your rope access company and add it above')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendors.map((vendor) => {
                  // Parse brand colors if branding is active
                  let brandColors: any = null;
                  let primaryColor: string | null = null;
                  
                  if (vendor.whitelabelBrandingActive && vendor.brandingColors) {
                    try {
                      const parsed = JSON.parse(vendor.brandingColors);
                      if (parsed && typeof parsed === 'object') {
                        // Support both 'primary' and 'primaryColor' keys for flexibility
                        const colorValue = parsed.primary || parsed.primaryColor;
                        
                        // Validate color string (allow hex, rgb, hsl, named colors)
                        if (colorValue && typeof colorValue === 'string' && colorValue.trim().length > 0) {
                          const trimmedColor = colorValue.trim();
                          // Accept hex (#fff, #ffffff), rgb/rgba, hsl/hsla, or CSS named colors
                          if (
                            trimmedColor.match(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/) || // hex
                            trimmedColor.startsWith('rgb') || // rgb/rgba
                            trimmedColor.startsWith('hsl') || // hsl/hsla
                            /^[a-z]+$/i.test(trimmedColor) // named colors (letters only)
                          ) {
                            brandColors = parsed;
                            primaryColor = trimmedColor;
                          }
                        }
                      }
                    } catch (e) {
                      console.error('Failed to parse brand colors:', e);
                    }
                  }

                  return (
                    <Card 
                      key={vendor.id} 
                      className="hover-elevate cursor-pointer relative overflow-hidden"
                      onClick={() => setSelectedVendor(vendor)}
                      data-testid={`card-vendor-${vendor.id}`}
                      style={primaryColor ? {
                        borderLeft: `4px solid ${primaryColor}`,
                        borderTop: `4px solid ${primaryColor}`,
                      } : undefined}
                    >
                      {primaryColor && (
                        <div 
                          className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at top right, ${primaryColor}, transparent)`,
                          }}
                        />
                      )}
                      <CardContent className="p-6 relative z-10">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12 ring-2 ring-offset-2" style={primaryColor ? {
                            ringColor: primaryColor,
                          } : undefined}>
                            <AvatarImage src={vendor.logo || undefined} />
                            <AvatarFallback 
                              style={primaryColor ? {
                                backgroundColor: primaryColor,
                                color: 'white',
                              } : undefined}
                              className={!primaryColor ? "bg-primary text-primary-foreground" : ""}
                            >
                              {vendor.companyName ? vendor.companyName.substring(0, 2).toUpperCase() : "RA"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold truncate" data-testid={`text-vendor-name-${vendor.id}`}>
                                {vendor.companyName}
                              </h3>
                              {vendor.csrRating !== null && (
                                <Badge
                                  variant="outline"
                                  className={`cursor-pointer gap-1 text-xs ${
                                    vendor.csrRating >= 90 ? "bg-green-600 dark:bg-green-500 text-white border-green-700 dark:border-green-400" :
                                    vendor.csrRating >= 70 ? "bg-yellow-500 dark:bg-yellow-500 text-black border-yellow-600 dark:border-yellow-400" :
                                    vendor.csrRating >= 50 ? "bg-orange-500 dark:bg-orange-500 text-white border-orange-600 dark:border-orange-400" :
                                    "bg-red-600 dark:bg-red-500 text-white border-red-700 dark:border-red-400"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCsrHistoryVendor(vendor);
                                  }}
                                  data-testid={`badge-vendor-csr-${vendor.id}`}
                                >
                                  <Shield className="w-3 h-3" />
                                  <span>CSR: {vendor.csrRating}%</span>
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate" data-testid={`text-vendor-email-${vendor.id}`}>
                                  {vendor.email}
                                </span>
                              </div>
                              {vendor.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3 flex-shrink-0" />
                                  <span data-testid={`text-vendor-phone-${vendor.id}`}>{vendor.phone}</span>
                                </div>
                              )}
                              {vendor.residentCode && (
                                <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                                  <Users className="w-3 h-3 flex-shrink-0" />
                                  <span className="text-xs text-muted-foreground">{t('propertyManager.vendorCard.residentCode', 'Resident Code:')}</span>
                                  <span className="font-mono font-medium text-foreground" data-testid={`text-vendor-resident-code-${vendor.id}`}>
                                    {vendor.residentCode}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-4 right-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVendorToRemove(vendor);
                            }}
                            data-testid={`button-remove-vendor-${vendor.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quotes Section */}
        <QuotesSection />

        <Dialog open={addCodeOpen} onOpenChange={setAddCodeOpen}>
          <DialogContent data-testid="dialog-add-vendor">
            <DialogHeader>
              <DialogTitle data-testid="text-dialog-title">{t('propertyManager.addVendorDialog.title', 'Add Vendor Company')}</DialogTitle>
              <DialogDescription data-testid="text-dialog-description">
                {t('propertyManager.addVendorDialog.description', 'Enter the 10-character company code provided by your rope access company')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="companyCode">{t('propertyManager.addVendorDialog.companyCode', 'Company Code')}</Label>
                <Input
                  id="companyCode"
                  placeholder={t('propertyManager.addVendorDialog.placeholder', 'Enter 10-character code')}
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                  maxLength={10}
                  data-testid="input-company-code"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAddCodeOpen(false);
                    setCompanyCode("");
                  }}
                  data-testid="button-cancel-add-vendor"
                >
                  {t('propertyManager.addVendorDialog.cancel', 'Cancel')}
                </Button>
                <Button
                  onClick={handleAddVendor}
                  disabled={companyCode.trim().length !== 10 || addVendorMutation.isPending}
                  data-testid="button-submit-add-vendor"
                >
                  {addVendorMutation.isPending ? t('propertyManager.addVendorDialog.adding', 'Adding...') : t('propertyManager.addVendorDialog.add', 'Add Vendor')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={selectedVendor !== null} onOpenChange={(open) => {
          if (!open) {
            // Clear projects query cache when closing dialog to prevent stale errors
            if (selectedVendor?.linkId) {
              queryClient.removeQueries({ 
                queryKey: ["/api/property-managers/vendors", selectedVendor.linkId, "projects"] 
              });
            }
            setSelectedVendor(null);
          }
        }}>
          <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0" data-testid="dialog-vendor-details">
            <DialogHeader className="p-6 pb-4 shrink-0">
              <DialogTitle className="flex items-center gap-3" data-testid="text-vendor-details-title">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedVendor?.logo || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {selectedVendor?.companyName ? selectedVendor.companyName.substring(0, 2).toUpperCase() : "RA"}
                  </AvatarFallback>
                </Avatar>
                {selectedVendor?.companyName}
              </DialogTitle>
              <DialogDescription data-testid="text-vendor-details-description">
                {t('propertyManager.vendorDetails.description', 'Vendor company information')}
              </DialogDescription>
            </DialogHeader>
            {selectedVendor && (
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="space-y-6 pt-4">
                {/* Company Safety Rating */}
                <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">{t('propertyManager.vendorDetails.csr.title', 'Company Safety Rating (CSR)')}</Label>
                        <p className="text-xs text-muted-foreground mt-0.5">{t('propertyManager.vendorDetails.csr.description', 'Overall safety compliance score')}</p>
                      </div>
                    </div>
                    {isLoadingCSR ? (
                      <Badge variant="outline" className="gap-1.5 px-3 py-1.5 animate-pulse" data-testid="badge-vendor-csr-loading">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">CSR: --</span>
                      </Badge>
                    ) : vendorCSRData ? (
                      <Badge 
                        variant="outline"
                        className={`gap-1.5 px-3 py-1.5 no-default-hover-elevate no-default-active-elevate ${
                          vendorCSRData.csrRating >= 90 ? "bg-green-600 dark:bg-green-500 text-white border-green-700 dark:border-green-400" :
                          vendorCSRData.csrRating >= 70 ? "bg-yellow-500 dark:bg-yellow-500 text-black dark:text-black border-yellow-600 dark:border-yellow-400" :
                          vendorCSRData.csrRating >= 50 ? "bg-orange-500 dark:bg-orange-500 text-white border-orange-600 dark:border-orange-400" :
                          "bg-red-600 dark:bg-red-500 text-white border-red-700 dark:border-red-400"
                        }`}
                        data-testid="badge-vendor-csr"
                      >
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-semibold">CSR: {vendorCSRData.csrRating}%</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1.5 px-3 py-1.5" data-testid="badge-vendor-csr-unavailable">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('propertyManager.vendorDetails.csr.notAvailable', 'N/A')}</span>
                      </Badge>
                    )}
                  </div>
                  
                  {/* CSR Breakdown */}
                  {vendorCSRData && (
                    <div className="pt-2 border-t space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">{t('propertyManager.vendorDetails.csr.breakdown', 'Safety Compliance Breakdown:')}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center justify-between bg-background rounded px-2 py-1.5">
                          <span className="text-muted-foreground">{t('propertyManager.vendorDetails.csr.documentation', 'Documentation')}</span>
                          <span className={`font-medium ${
                            vendorCSRData.breakdown.documentationRating === 100 ? "text-green-600 dark:text-green-400" :
                            vendorCSRData.breakdown.documentationRating >= 50 ? "text-yellow-600 dark:text-yellow-400" :
                            "text-red-600 dark:text-red-400"
                          }`}>{vendorCSRData.breakdown.documentationRating}%</span>
                        </div>
                        <div className="flex items-center justify-between bg-background rounded px-2 py-1.5">
                          <span className="text-muted-foreground">{t('propertyManager.vendorDetails.csr.toolboxMeetings', 'Toolbox Meetings')}</span>
                          <span className={`font-medium ${
                            vendorCSRData.breakdown.toolboxMeetingRating >= 90 ? "text-green-600 dark:text-green-400" :
                            vendorCSRData.breakdown.toolboxMeetingRating >= 70 ? "text-yellow-600 dark:text-yellow-400" :
                            "text-red-600 dark:text-red-400"
                          }`}>{vendorCSRData.breakdown.toolboxMeetingRating}%</span>
                        </div>
                        <div className="flex items-center justify-between bg-background rounded px-2 py-1.5">
                          <span className="text-muted-foreground">{t('propertyManager.vendorDetails.csr.harnessInspections', 'Harness Inspections')}</span>
                          <span className={`font-medium ${
                            vendorCSRData.breakdown.harnessInspectionRating >= 90 ? "text-green-600 dark:text-green-400" :
                            vendorCSRData.breakdown.harnessInspectionRating >= 70 ? "text-yellow-600 dark:text-yellow-400" :
                            "text-red-600 dark:text-red-400"
                          }`}>{vendorCSRData.breakdown.harnessInspectionRating}%</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {t('propertyManager.vendorDetails.csr.helpText', 'CSR measures vendor compliance with safety documentation, daily toolbox meetings, and equipment inspections. A score of 90%+ indicates excellent safety practices.')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Feedback Resolution Metrics */}
                <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">{t('propertyManager.vendorDetails.resolutionTime.title', 'Average Resolution Time')}</Label>
                        <p className="text-xs text-muted-foreground mt-0.5">{t('propertyManager.vendorDetails.resolutionTime.description', 'Average time to resolve resident feedback')}</p>
                      </div>
                    </div>
                    {isLoadingMetrics ? (
                      <Badge variant="outline" className="gap-1.5 px-3 py-1.5 animate-pulse" data-testid="badge-resolution-time-loading">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">--</span>
                      </Badge>
                    ) : vendorMetricsData?.metrics?.averageResolutionMs ? (
                      <Badge 
                        variant="outline"
                        className="gap-1.5 px-3 py-1.5 no-default-hover-elevate no-default-active-elevate bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                        data-testid="badge-resolution-time"
                      >
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">{formatDurationMs(vendorMetricsData.metrics.averageResolutionMs)}</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1.5 px-3 py-1.5" data-testid="badge-resolution-time-unavailable">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('propertyManager.vendorDetails.resolutionTime.noData', 'No data')}</span>
                      </Badge>
                    )}
                  </div>
                  {vendorMetricsData?.metrics && vendorMetricsData.metrics.totalClosed > 0 && (
                    <p className="text-xs text-muted-foreground pt-2 border-t">
                      {t('propertyManager.vendorDetails.resolutionTime.basedOn', 'Based on {{count}} resolved feedback items', { count: vendorMetricsData.metrics.totalClosed })}
                    </p>
                  )}
                </div>

                {/* Safety Documents Section */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <Label className="text-sm font-medium">{t('propertyManager.vendorDetails.safetyDocuments', 'Safety Documents')}</Label>
                  </div>
                  
                  {isLoadingDocuments ? (
                    <div className="text-sm text-muted-foreground">{t('propertyManager.vendorDetails.loadingDocuments', 'Loading documents...')}</div>
                  ) : (() => {
                    // Filter to only show Certificate of Insurance - exclude Company Policy and Health & Safety Manual
                    const visibleDocs = (vendorDocumentsData?.documents || []).filter(
                      (doc) => doc.documentType === 'certificate_of_insurance'
                    );
                    
                    if (visibleDocs.length > 0) {
                      return (
                        <div className="space-y-2">
                          {visibleDocs.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between bg-background rounded-md px-3 py-2 border">
                              <div className="flex items-center gap-2">
                                <FileCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <div>
                                  <p className="text-sm font-medium">{t('propertyManager.vendorDetails.certificateOfInsurance', 'Certificate of Insurance')}</p>
                                  <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(doc.fileUrl, '_blank')}
                                data-testid={`button-view-document-${doc.id}`}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                {t('propertyManager.viewDetails', 'View Details')}
                              </Button>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    
                    return (
                      <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                        {t('propertyManager.vendorDetails.noCertificate', 'No Certificate of Insurance available from this vendor.')}
                      </p>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('propertyManager.vendorDetails.companyEmail', 'Company Email')}</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span data-testid="text-vendor-detail-email">{selectedVendor.email}</span>
                    </div>
                  </div>
                  {selectedVendor.phone && (
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('propertyManager.vendorDetails.phoneNumber', 'Phone Number')}</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span data-testid="text-vendor-detail-phone">{selectedVendor.phone}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedVendor.residentCode && (
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('propertyManager.vendorDetails.residentAccessCode', 'Resident Access Code')}</Label>
                      <div className="font-mono text-sm bg-muted px-3 py-2 rounded-md mt-1" data-testid="text-vendor-detail-resident-code">
                        {selectedVendor.residentCode}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {t('propertyManager.vendorDetails.residentCodeHelp', 'Share this code with building residents so they can access the resident portal to view project updates and submit feedback.')}
                      </p>
                    </div>
                  )}
                  {selectedVendor.propertyManagerCode && (
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('propertyManager.vendorDetails.propertyManagerCode', 'Property Manager Code')}</Label>
                      <div className="font-mono text-sm bg-muted px-3 py-2 rounded-md mt-1" data-testid="text-vendor-detail-pm-code">
                        {selectedVendor.propertyManagerCode}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <Label className="text-sm font-medium">{t('propertyManager.vendorDetails.strataNumber.label', 'Strata/Building Number (Required)')}</Label>
                  <p className="text-xs text-muted-foreground">
                    {t('propertyManager.vendorDetails.strataNumber.description', 'Enter your strata/building number to access projects for your building. This field is required.')}
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder={t('propertyManager.vendorDetails.strataNumber.placeholder', 'e.g., LMS1234 or EPS 1234')}
                      value={strataNumber}
                      onChange={(e) => setStrataNumber(e.target.value)}
                      maxLength={100}
                      data-testid="input-strata-number"
                    />
                    <Button
                      onClick={handleSaveStrata}
                      disabled={updateStrataMutation.isPending || !strataNumber.trim()}
                      data-testid="button-save-strata"
                    >
                      {updateStrataMutation.isPending ? t('propertyManager.vendorDetails.strataNumber.saving', 'Saving...') : t('propertyManager.vendorDetails.strataNumber.save', 'Save')}
                    </Button>
                  </div>
                  {!strataNumber.trim() && (
                    <p className="text-xs text-destructive">
                      {t('propertyManager.vendorDetails.strataNumber.emptyError', 'Strata number cannot be empty')}
                    </p>
                  )}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <Label className="text-sm font-medium">{t('propertyManager.vendorDetails.projects.title', 'Projects for Your Building')}</Label>
                  {!selectedVendor.strataNumber ? (
                    <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md" data-testid="text-strata-required">
                      <strong>{t('propertyManager.vendorDetails.projects.strataRequired', 'Strata number required:')}</strong> {t('propertyManager.vendorDetails.projects.strataRequiredDesc', 'Please enter and save your strata/building number above to view projects for your building.')}
                    </div>
                  ) : projectsError ? (
                    <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md" data-testid="text-projects-error">
                      <strong>{t('propertyManager.vendorDetails.projects.unableToLoad', 'Unable to load projects:')}</strong> {(projectsError as Error).message || t('common.tryAgain', 'Please try again or contact support.')}
                    </div>
                  ) : isLoadingProjects ? (
                    <div className="text-sm text-muted-foreground" data-testid="text-loading-projects">
                      {t('propertyManager.vendorDetails.projects.loading', 'Loading projects...')}
                    </div>
                  ) : projectsData?.projects && projectsData.projects.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {(() => {
                        const activeProjects = projectsData.projects.filter((p: any) => p.status === 'active');
                        const completedProjects = projectsData.projects.filter((p: any) => p.status === 'completed');
                        
                        return (
                          <>
                            {activeProjects.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-primary" />
                                  <h4 className="text-sm font-medium">{t('propertyManager.vendorDetails.projects.activeProjects', 'Active Projects')} ({activeProjects.length})</h4>
                                </div>
                                <div className="space-y-2">
                                  {activeProjects.map((project: any) => (
                                    <Card 
                                      key={project.id} 
                                      className="hover-elevate cursor-pointer active-elevate-2" 
                                      onClick={() => setSelectedProject(project)}
                                      data-testid={`card-project-${project.id}`}
                                    >
                                      <CardContent className="p-3">
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="space-y-1 flex-1">
                                            <div className="font-medium" data-testid={`text-project-name-${project.id}`}>
                                              {project.buildingName || project.projectName || t('propertyManager.vendorDetails.projects.unnamedProject', 'Unnamed Project')}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {project.jobType?.replace(/_/g, ' ')}
                                            </div>
                                          </div>
                                          <Badge variant="default" className="text-xs">
                                            {t('propertyManager.vendorDetails.projects.active', 'Active')}
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {completedProjects.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  <h4 className="text-sm font-medium">{t('propertyManager.vendorDetails.projects.completedProjects', 'Completed Projects')} ({completedProjects.length})</h4>
                                </div>
                                <div className="space-y-2">
                                  {completedProjects.map((project: any) => (
                                    <Card 
                                      key={project.id} 
                                      className="hover-elevate cursor-pointer active-elevate-2" 
                                      onClick={() => setSelectedProject(project)}
                                      data-testid={`card-project-${project.id}`}
                                    >
                                      <CardContent className="p-3">
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="space-y-1 flex-1">
                                            <div className="font-medium" data-testid={`text-project-name-${project.id}`}>
                                              {project.buildingName || project.projectName || t('propertyManager.vendorDetails.projects.unnamedProject', 'Unnamed Project')}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {project.jobType?.replace(/_/g, ' ')}
                                            </div>
                                          </div>
                                          <Badge variant="secondary" className="text-xs">
                                            {t('propertyManager.vendorDetails.projects.completed', 'Completed')}
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground" data-testid="text-no-projects">
                      {t('propertyManager.vendorDetails.projects.noProjectsFound', 'No projects found for strata number "{{strataNumber}}". Please verify your strata number is correct.', { strataNumber: selectedVendor.strataNumber })}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVendor(null)}
                    data-testid="button-close-vendor-details"
                  >
                    {t('propertyManager.close', 'Close')}
                  </Button>
                </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className="max-w-2xl" data-testid="dialog-account-settings">
            <DialogHeader>
              <DialogTitle data-testid="text-settings-title">{t('propertyManager.accountSettings.title', 'Account Settings')}</DialogTitle>
              <DialogDescription data-testid="text-settings-description">
                {t('propertyManager.accountSettings.description', 'Update your account information and password')}
              </DialogDescription>
            </DialogHeader>
            <Form {...accountForm}>
              <form onSubmit={accountForm.handleSubmit(onSubmitAccountSettings)} className="space-y-4 pt-4">
                <FormField
                  control={accountForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('propertyManager.accountSettings.name', 'Name')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('propertyManager.accountSettings.namePlaceholder', 'Your full name')}
                          {...field}
                          data-testid="input-account-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('propertyManager.accountSettings.email', 'Email Address')}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('propertyManager.accountSettings.emailPlaceholder', 'your.email@example.com')}
                          {...field}
                          data-testid="input-account-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="propertyManagementCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('propertyManager.accountSettings.company', 'Property Management Company')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('propertyManager.accountSettings.companyPlaceholder', 'e.g., ABC Property Management')}
                          {...field}
                          data-testid="input-account-company"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="propertyManagerPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('propertyManager.accountSettings.phone', 'Phone Number')}</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder={t('propertyManager.accountSettings.phonePlaceholder', 'Enter your phone number')}
                          {...field}
                          data-testid="input-account-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="propertyManagerSmsOptIn"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {t('propertyManager.accountSettings.smsOptIn', 'Receive SMS Notifications')}
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          {t('propertyManager.accountSettings.smsOptInDescription', 'Get text message alerts when companies send you new quotes')}
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-sms-opt-in"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-4">{t('propertyManager.accountSettings.changePassword', 'Change Password (Optional)')}</h4>
                  <div className="space-y-4">
                    <FormField
                      control={accountForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('propertyManager.accountSettings.currentPassword', 'Current Password')}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t('propertyManager.accountSettings.currentPasswordPlaceholder', 'Enter current password')}
                              {...field}
                              data-testid="input-current-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={accountForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('propertyManager.accountSettings.newPassword', 'New Password')}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t('propertyManager.accountSettings.newPasswordPlaceholder', 'Enter new password (min 6 characters)')}
                              {...field}
                              data-testid="input-new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSettingsOpen(false);
                      accountForm.reset();
                    }}
                    data-testid="button-cancel-settings"
                  >
                    {t('propertyManager.accountSettings.cancel', 'Cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateAccountMutation.isPending}
                    data-testid="button-save-settings"
                  >
                    {updateAccountMutation.isPending ? t('propertyManager.accountSettings.saving', 'Saving...') : t('propertyManager.accountSettings.saveChanges', 'Save Changes')}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={selectedProject !== null} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent className="max-w-3xl h-[95vh] flex flex-col p-0" data-testid="dialog-project-details">
            {selectedProject && (
              <>
                <DialogHeader className="p-6 pb-4 shrink-0">
                  <DialogTitle className="flex items-center gap-2" data-testid="text-project-details-title">
                    <Building2 className="w-5 h-5" />
                    {selectedProject.buildingName || selectedProject.projectName || t('propertyManager.projectDetails.title', 'Project Details')}
                  </DialogTitle>
                  <DialogDescription data-testid="text-project-details-description">
                    {t('propertyManager.projectDetails.description', 'View project information, progress, and feedback history')}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto px-6 pb-6">

                {isLoadingProjectDetails ? (
                  <div className="text-sm text-muted-foreground text-center py-8" data-testid="text-loading-details">
                    {t('propertyManager.projectDetails.loading', 'Loading project details...')}
                  </div>
                ) : projectDetailsData ? (
                  <div className="space-y-4 pt-4">
                    {/* Project Info */}
                    <Card data-testid="card-project-info">
                      <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-lg">{t('propertyManager.projectDetails.projectInfo', 'Project Information')}</CardTitle>
                          <Badge variant={projectDetailsData.project.status === 'active' ? 'default' : 'secondary'}>
                            {projectDetailsData.project.status === 'active' ? t('propertyManager.projectDetails.active', 'Active') : t('propertyManager.projectDetails.completed', 'Completed')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <Label className="text-xs text-muted-foreground">{t('propertyManager.projectDetails.jobType', 'Job Type')}</Label>
                            <p className="font-medium capitalize">{projectDetailsData.project.jobType?.replace(/_/g, ' ')}</p>
                          </div>
                          {projectDetailsData.project.startDate && (
                            <div>
                              <Label className="text-xs text-muted-foreground">{t('propertyManager.projectDetails.startDate', 'Start Date')}</Label>
                              <p className="font-medium">{formatLocalDate(projectDetailsData.project.startDate)}</p>
                            </div>
                          )}
                          {projectDetailsData.project.endDate && (
                            <div>
                              <Label className="text-xs text-muted-foreground">{t('propertyManager.projectDetails.endDate', 'End Date')}</Label>
                              <p className="font-medium">{formatLocalDate(projectDetailsData.project.endDate)}</p>
                            </div>
                          )}
                          {projectDetailsData.project.buildingAddress && (
                            <div className="col-span-2">
                              <Label className="text-xs text-muted-foreground">{t('propertyManager.projectDetails.address', 'Address')}</Label>
                              <p className="font-medium">{projectDetailsData.project.buildingAddress}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Building Instructions */}
                    <Card data-testid="card-building-instructions" className="border-2 border-primary/30">
                      <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            {t('propertyManager.projectDetails.buildingInstructions.title', 'Building Instructions')}
                          </CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditBuildingInstructionsOpen(true)}
                            data-testid="button-edit-building-instructions"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            {t('propertyManager.projectDetails.buildingInstructions.edit', 'Edit')}
                          </Button>
                        </div>
                        <CardDescription>
                          {t('propertyManager.projectDetails.buildingInstructions.description', 'Access details and contact information for this building')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {projectDetailsData.buildingInstructions ? (
                          <div className="space-y-4">
                            {/* Access Information */}
                            {(projectDetailsData.buildingInstructions.buildingAccess || 
                              projectDetailsData.buildingInstructions.keysAndFob ||
                              projectDetailsData.buildingInstructions.roofAccess) && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">{t('propertyManager.projectDetails.buildingInstructions.accessInfo', 'Access Information')}</h4>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                  {projectDetailsData.buildingInstructions.buildingAccess && (
                                    <div>
                                      <Label className="text-xs text-muted-foreground">{t('propertyManager.projectDetails.buildingInstructions.buildingAccess', 'Building Access')}</Label>
                                      <p className="text-sm">{projectDetailsData.buildingInstructions.buildingAccess}</p>
                                    </div>
                                  )}
                                  {projectDetailsData.buildingInstructions.keysAndFob && (
                                    <div>
                                      <Label className="text-xs text-muted-foreground">{t('propertyManager.projectDetails.buildingInstructions.keysAndFob', 'Keys/Fob')}</Label>
                                      <p className="text-sm">{projectDetailsData.buildingInstructions.keysAndFob}</p>
                                      {projectDetailsData.buildingInstructions.keysReturnPolicy && (
                                        <Badge variant="secondary" className="mt-1">{projectDetailsData.buildingInstructions.keysReturnPolicy}</Badge>
                                      )}
                                    </div>
                                  )}
                                  {projectDetailsData.buildingInstructions.roofAccess && (
                                    <div>
                                      <Label className="text-xs text-muted-foreground">{t('propertyManager.projectDetails.buildingInstructions.roofAccess', 'Roof Access')}</Label>
                                      <p className="text-sm">{projectDetailsData.buildingInstructions.roofAccess}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Contacts */}
                            {(projectDetailsData.buildingInstructions.buildingManagerName || 
                              projectDetailsData.buildingInstructions.buildingManagerPhone ||
                              projectDetailsData.buildingInstructions.conciergeNames ||
                              projectDetailsData.buildingInstructions.conciergePhone ||
                              projectDetailsData.buildingInstructions.conciergeHours ||
                              projectDetailsData.buildingInstructions.maintenanceName ||
                              projectDetailsData.buildingInstructions.maintenancePhone ||
                              projectDetailsData.buildingInstructions.councilMemberUnits) && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">{t('propertyManager.projectDetails.buildingInstructions.contacts', 'Contacts')}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                  {(projectDetailsData.buildingInstructions.buildingManagerName || 
                                    projectDetailsData.buildingInstructions.buildingManagerPhone) && (
                                    <div>
                                      <Label className="text-xs text-muted-foreground">{t('propertyManager.projectDetails.buildingInstructions.buildingManager', 'Building Manager')}</Label>
                                      {projectDetailsData.buildingInstructions.buildingManagerName && (
                                        <p className="font-medium">{projectDetailsData.buildingInstructions.buildingManagerName}</p>
                                      )}
                                      {projectDetailsData.buildingInstructions.buildingManagerPhone && (
                                        <p className="text-muted-foreground">{projectDetailsData.buildingInstructions.buildingManagerPhone}</p>
                                      )}
                                    </div>
                                  )}
                                  {(projectDetailsData.buildingInstructions.conciergeNames || 
                                    projectDetailsData.buildingInstructions.conciergePhone ||
                                    projectDetailsData.buildingInstructions.conciergeHours) && (
                                    <div>
                                      <Label className="text-xs text-muted-foreground">{t('propertyManager.projectDetails.buildingInstructions.concierge', 'Concierge')}</Label>
                                      {projectDetailsData.buildingInstructions.conciergeNames && (
                                        <p className="font-medium">{projectDetailsData.buildingInstructions.conciergeNames}</p>
                                      )}
                                      {projectDetailsData.buildingInstructions.conciergePhone && (
                                        <p className="text-muted-foreground">{projectDetailsData.buildingInstructions.conciergePhone}</p>
                                      )}
                                      {projectDetailsData.buildingInstructions.conciergeHours && (
                                        <p className="text-xs text-muted-foreground">{projectDetailsData.buildingInstructions.conciergeHours}</p>
                                      )}
                                    </div>
                                  )}
                                  {(projectDetailsData.buildingInstructions.maintenanceName ||
                                    projectDetailsData.buildingInstructions.maintenancePhone) && (
                                    <div>
                                      <Label className="text-xs text-muted-foreground">{t('propertyManager.projectDetails.buildingInstructions.maintenance', 'Maintenance')}</Label>
                                      {projectDetailsData.buildingInstructions.maintenanceName && (
                                        <p className="font-medium">{projectDetailsData.buildingInstructions.maintenanceName}</p>
                                      )}
                                      {projectDetailsData.buildingInstructions.maintenancePhone && (
                                        <p className="text-muted-foreground">{projectDetailsData.buildingInstructions.maintenancePhone}</p>
                                      )}
                                    </div>
                                  )}
                                  {projectDetailsData.buildingInstructions.councilMemberUnits && (
                                    <div>
                                      <Label className="text-xs text-muted-foreground">{t('propertyManager.projectDetails.buildingInstructions.councilUnits', 'Council Member Units')}</Label>
                                      <p className="text-sm">{projectDetailsData.buildingInstructions.councilMemberUnits}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Trade Facilities */}
                            {(projectDetailsData.buildingInstructions.tradeParkingInstructions || 
                              projectDetailsData.buildingInstructions.tradeWashroomLocation) && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">{t('propertyManager.projectDetails.buildingInstructions.tradeFacilities', 'Trade Facilities')}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                  {projectDetailsData.buildingInstructions.tradeParkingInstructions && (
                                    <div>
                                      <Label className="text-xs text-muted-foreground">{t('propertyManager.projectDetails.buildingInstructions.tradeParking', 'Trade Parking')}</Label>
                                      <p className="text-sm">{projectDetailsData.buildingInstructions.tradeParkingInstructions}</p>
                                      {projectDetailsData.buildingInstructions.tradeParkingSpots && (
                                        <Badge variant="secondary" className="mt-1">{t('propertyManager.projectDetails.buildingInstructions.tradeParkingSpotsCount', '{{count}} spots', { count: projectDetailsData.buildingInstructions.tradeParkingSpots })}</Badge>
                                      )}
                                    </div>
                                  )}
                                  {projectDetailsData.buildingInstructions.tradeWashroomLocation && (
                                    <div>
                                      <Label className="text-xs text-muted-foreground">{t('propertyManager.projectDetails.buildingInstructions.tradeWashroom', 'Trade Washroom')}</Label>
                                      <p className="text-sm">{projectDetailsData.buildingInstructions.tradeWashroomLocation}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Special Requests */}
                            {projectDetailsData.buildingInstructions.specialRequests && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">{t('propertyManager.projectDetails.buildingInstructions.specialRequests', 'Special Requests')}</h4>
                                <p className="text-sm bg-muted/50 p-3 rounded-md">{projectDetailsData.buildingInstructions.specialRequests}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">{t('propertyManager.projectDetails.buildingInstructions.noInstructions', 'No building instructions have been added yet.')}</p>
                            <Button
                              variant="outline"
                              className="mt-3"
                              onClick={() => setEditBuildingInstructionsOpen(true)}
                              data-testid="button-add-building-instructions"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              {t('propertyManager.projectDetails.buildingInstructions.addInstructions', 'Add Instructions')}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Progress Display - Different for each job type */}
                    {(() => {
                      const isHoursBased = projectDetailsData.project.jobType === 'general_pressure_washing' || 
                                          projectDetailsData.project.jobType === 'ground_window_cleaning';
                      const isInSuite = projectDetailsData.project.jobType === 'in_suite_dryer_vent_cleaning';
                      const isParkade = projectDetailsData.project.jobType === 'parkade_pressure_cleaning';
                      
                      // Calculate completed sessions
                      const completedSessions = (projectDetailsData.project.workSessions || [])
                        .filter((s: any) => s.endTime !== null);
                      
                      if (isHoursBased) {
                        // Hours-based: Use project-level overall completion percentage (set by "last one out" technician)
                        // Fall back to session-based calculation for legacy data
                        let progressPercent = 0;
                        if ((projectDetailsData.project as any).overallCompletionPercentage !== null && 
                            (projectDetailsData.project as any).overallCompletionPercentage !== undefined) {
                          progressPercent = (projectDetailsData.project as any).overallCompletionPercentage;
                        } else {
                          const sessionsWithPercentage = completedSessions.filter((s: any) => 
                            s.manualCompletionPercentage !== null && s.manualCompletionPercentage !== undefined
                          );
                          
                          if (sessionsWithPercentage.length > 0) {
                            const sortedSessions = [...sessionsWithPercentage].sort((a: any, b: any) => 
                              new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
                            );
                            progressPercent = sortedSessions[0].manualCompletionPercentage;
                          }
                        }
                        
                        return (
                          <Card data-testid="card-project-progress">
                            <CardContent className="pt-6">
                              <div className="text-center space-y-4">
                                <div>
                                  <h3 className="text-5xl font-bold mb-2">{progressPercent}%</h3>
                                  <p className="text-base font-medium text-foreground">{t('propertyManager.projectDetails.progress.projectCompletion', 'Project Completion')}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{t('propertyManager.projectDetails.progress.hoursBased', 'Hours-based tracking')}</p>
                                </div>
                                <Progress value={progressPercent} className="h-3" />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      } else if (isInSuite) {
                        // In-Suite: Show suite count progress
                        const completedSuites = completedSessions.reduce((sum: number, s: any) => 
                          sum + (s.dropsCompletedNorth ?? 0), 0
                        );
                        const totalSuites = projectDetailsData.project.floorCount || 0;
                        const progressPercent = totalSuites > 0 
                          ? Math.min(100, Math.round((completedSuites / totalSuites) * 100))
                          : 0;
                        
                        return (
                          <Card data-testid="card-project-progress">
                            <CardContent className="pt-6">
                              <div className="text-center space-y-4">
                                <div>
                                  <h3 className="text-5xl font-bold mb-2">{progressPercent}%</h3>
                                  <p className="text-base font-medium text-foreground">{t('propertyManager.projectDetails.progress.projectCompletion', 'Project Completion')}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {t('propertyManager.projectDetails.progress.unitsCompleted', '{{completed}} of {{total}} units completed', { completed: completedSuites, total: totalSuites })}
                                  </p>
                                </div>
                                <Progress value={progressPercent} className="h-3" />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      } else if (isParkade) {
                        // Parkade: Show stall count progress
                        const completedStalls = completedSessions.reduce((sum: number, s: any) => 
                          sum + (s.dropsCompletedNorth ?? 0), 0
                        );
                        const totalStalls = projectDetailsData.project.totalStalls || projectDetailsData.project.floorCount || 0;
                        const progressPercent = totalStalls > 0 
                          ? Math.min(100, Math.round((completedStalls / totalStalls) * 100))
                          : 0;
                        
                        return (
                          <Card data-testid="card-project-progress">
                            <CardContent className="pt-6">
                              <div className="text-center space-y-4">
                                <div>
                                  <h3 className="text-5xl font-bold mb-2">{progressPercent}%</h3>
                                  <p className="text-base font-medium text-foreground">{t('propertyManager.projectDetails.progress.projectCompletion', 'Project Completion')}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {t('propertyManager.projectDetails.progress.stallsCompleted', '{{completed}} of {{total}} stalls completed', { completed: completedStalls, total: totalStalls })}
                                  </p>
                                </div>
                                <Progress value={progressPercent} className="h-3" />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                      
                      return null;
                    })()}

                    {/* Building Progress Visualization - Only for 4-elevation job types */}
                    {!['in_suite_dryer_vent_cleaning', 'parkade_pressure_cleaning', 'ground_window_cleaning', 'general_pressure_washing'].includes(projectDetailsData.project.jobType) && (
                      <Card data-testid="card-building-progress">
                        <CardHeader>
                          <CardTitle className="text-lg">{t('propertyManager.projectDetails.buildingProgress.title', 'Building Progress')}</CardTitle>
                          <CardDescription>
                            {t('propertyManager.projectDetails.buildingProgress.description', 'Visual representation of work completed across all four elevations')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {(() => {
                            // Calculate completed drops from all work sessions
                            const completedDropsNorth = (projectDetailsData.project.workSessions || [])
                              .reduce((sum: number, s: any) => sum + (s.dropsCompletedNorth ?? 0), 0);
                            const completedDropsEast = (projectDetailsData.project.workSessions || [])
                              .reduce((sum: number, s: any) => sum + (s.dropsCompletedEast ?? 0), 0);
                            const completedDropsSouth = (projectDetailsData.project.workSessions || [])
                              .reduce((sum: number, s: any) => sum + (s.dropsCompletedSouth ?? 0), 0);
                            const completedDropsWest = (projectDetailsData.project.workSessions || [])
                              .reduce((sum: number, s: any) => sum + (s.dropsCompletedWest ?? 0), 0);
                            
                            const totalDrops = (projectDetailsData.project.totalDropsNorth ?? 0) + 
                              (projectDetailsData.project.totalDropsEast ?? 0) + 
                              (projectDetailsData.project.totalDropsSouth ?? 0) + 
                              (projectDetailsData.project.totalDropsWest ?? 0);
                            
                            const completedDrops = completedDropsNorth + completedDropsEast + completedDropsSouth + completedDropsWest;
                            const progressPercent = totalDrops > 0 
                              ? Math.min(100, Math.round((completedDrops / totalDrops) * 100))
                              : 0;

                            return (
                              <>
                                <HighRiseBuilding
                                  floors={projectDetailsData.project.floors || 25}
                                  totalDropsNorth={projectDetailsData.project.totalDropsNorth ?? 0}
                                  totalDropsEast={projectDetailsData.project.totalDropsEast ?? 0}
                                  totalDropsSouth={projectDetailsData.project.totalDropsSouth ?? 0}
                                  totalDropsWest={projectDetailsData.project.totalDropsWest ?? 0}
                                  completedDropsNorth={completedDropsNorth}
                                  completedDropsEast={completedDropsEast}
                                  completedDropsSouth={completedDropsSouth}
                                  completedDropsWest={completedDropsWest}
                                />
                                
                                {/* Overall Progress Bar */}
                                <div className="mt-6 space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{t('propertyManager.projectDetails.buildingProgress.overallProgress', 'Overall Progress')}</span>
                                    <span className="font-medium">{progressPercent}%</span>
                                  </div>
                                  <Progress value={progressPercent} className="h-2" />
                                  <div className="text-xs text-muted-foreground text-center">
                                    {t('propertyManager.projectDetails.buildingProgress.dropsCompleted', '{{completed}} of {{total}} drops completed', { completed: completedDrops, total: totalDrops })}
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </CardContent>
                      </Card>
                    )}

                    {/* Rope Access Plan */}
                    {projectDetailsData.project.ropeAccessPlanUrl && (
                      <Card data-testid="card-rope-access-plan">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            {t('propertyManager.projectDetails.ropeAccessPlan.title', 'Rope Access Plan')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(projectDetailsData.project.ropeAccessPlanUrl, '_blank')}
                            data-testid="button-download-rope-access-plan"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {t('propertyManager.projectDetails.ropeAccessPlan.viewDownload', 'View/Download Rope Access Plan')}
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {/* Anchor Inspection Document */}
                    <Card data-testid="card-anchor-inspection">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileCheck className="w-5 h-5" />
                          {t('propertyManager.projectDetails.anchorInspection.title', 'Anchor Inspection Document')}
                        </CardTitle>
                        <CardDescription>
                          {t('propertyManager.projectDetails.anchorInspection.description', 'Upload anchor inspection certificate for this project')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {projectDetailsData.project.anchorInspectionCertificateUrl ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span>{t('propertyManager.projectDetails.anchorInspection.uploaded', 'Anchor inspection document uploaded')}</span>
                            </div>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => window.open(projectDetailsData.project.anchorInspectionCertificateUrl, '_blank')}
                              data-testid="button-view-anchor-inspection"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              {t('propertyManager.projectDetails.anchorInspection.viewDownload', 'View/Download Document')}
                            </Button>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            {t('propertyManager.projectDetails.anchorInspection.notUploaded', 'No anchor inspection document uploaded yet')}
                          </div>
                        )}
                        
                        {/* Upload new document */}
                        <div>
                          <input
                            type="file"
                            id="anchor-inspection-upload"
                            className="hidden"
                            accept=".pdf,image/*"
                            onChange={handleAnchorInspectionUpload}
                            disabled={uploadingAnchorInspection}
                            data-testid="input-anchor-inspection-upload"
                          />
                          <Button
                            variant="default"
                            className="w-full"
                            onClick={() => document.getElementById('anchor-inspection-upload')?.click()}
                            disabled={uploadingAnchorInspection}
                            data-testid="button-upload-anchor-inspection"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingAnchorInspection ? t('propertyManager.projectDetails.anchorInspection.uploading', 'Uploading...') : (projectDetailsData.project.anchorInspectionCertificateUrl ? t('propertyManager.projectDetails.anchorInspection.uploadNew', 'Upload New Document') : t('propertyManager.projectDetails.anchorInspection.upload', 'Upload Document'))}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Feedback History */}
                    <Card data-testid="card-feedback-history">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          {t('propertyManager.projectDetails.feedback.title', 'Feedback History')}
                          {projectDetailsData.complaints.length > 0 && (
                            <Badge variant="secondary">{projectDetailsData.complaints.length}</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {projectDetailsData.complaints.length === 0 ? (
                          <div className="text-sm text-muted-foreground text-center py-4" data-testid="text-no-feedback">
                            {t('propertyManager.projectDetails.feedback.none', 'No feedback recorded for this project')}
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {projectDetailsData.complaints.map((complaint: any) => (
                              <Card 
                                key={complaint.id} 
                                className="bg-muted/50 cursor-pointer hover-elevate" 
                                data-testid={`card-feedback-${complaint.id}`}
                                onClick={() => setSelectedComplaint(complaint)}
                              >
                                <CardContent className="p-3">
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">{complaint.subject || t('propertyManager.projectDetails.feedback.noSubject', 'No Subject')}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {formatTimestampDate(complaint.createdAt)} {t('propertyManager.projectDetails.feedback.at', 'at')}{' '}
                                          {formatTime(complaint.createdAt)}
                                        </p>
                                      </div>
                                      <Badge variant={complaint.status === 'resolved' ? 'default' : 'secondary'} className="text-xs">
                                        {complaint.status === 'resolved' ? t('propertyManager.projectDetails.feedback.resolved', 'resolved') : t('propertyManager.projectDetails.feedback.pending', 'pending')}
                                      </Badge>
                                    </div>
                                    {complaint.description && (
                                      <div className="text-sm text-muted-foreground line-clamp-2">
                                        {complaint.description}
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

                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedProject(null)}
                        data-testid="button-close-project-details"
                      >
                        {t('propertyManager.close', 'Close')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-8" data-testid="text-error-loading-details">
                    {t('propertyManager.projectDetails.errorLoading', 'Failed to load project details')}
                  </div>
                )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Remove Vendor Confirmation Dialog */}
        <Dialog open={vendorToRemove !== null} onOpenChange={(open) => !open && setVendorToRemove(null)}>
          <DialogContent data-testid="dialog-remove-vendor">
            <DialogHeader>
              <DialogTitle data-testid="text-remove-vendor-title">{t('propertyManager.removeVendor.title', 'Remove Vendor?')}</DialogTitle>
              <DialogDescription data-testid="text-remove-vendor-description">
                {t('propertyManager.removeVendor.description', 'Are you sure you want to remove {{companyName}} from your vendors list? This action cannot be undone.', { companyName: vendorToRemove?.companyName })}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setVendorToRemove(null)}
                data-testid="button-cancel-remove-vendor"
              >
                {t('propertyManager.removeVendor.cancel', 'Cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (vendorToRemove) {
                    removeVendorMutation.mutate(vendorToRemove.linkId);
                  }
                }}
                disabled={removeVendorMutation.isPending}
                data-testid="button-confirm-remove-vendor"
              >
                {removeVendorMutation.isPending ? t('propertyManager.removeVendor.removing', 'Removing...') : t('propertyManager.removeVendor.remove', 'Remove Vendor')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* CSR History Dialog */}
        <Dialog open={csrHistoryVendor !== null} onOpenChange={(open) => !open && setCsrHistoryVendor(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col" data-testid="dialog-csr-history">
            <DialogHeader>
              <DialogTitle data-testid="text-csr-history-title">
                {t('propertyManager.csrHistory.title', 'Company Safety Rating History')}
              </DialogTitle>
              <DialogDescription data-testid="text-csr-history-description">
                {csrHistoryVendor?.companyName} - {t('propertyManager.csrHistory.description', 'View how the safety rating has changed over time')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto">
              {/* Current CSR Rating */}
              {csrHistoryVendor?.csrRating !== null && (
                <div className="mb-6 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('propertyManager.csrHistory.currentRating', 'Current Rating')}</p>
                      <p className="text-2xl font-bold">{csrHistoryVendor?.csrRating}%</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`gap-1.5 px-3 py-1.5 ${
                        (csrHistoryVendor?.csrRating ?? 0) >= 90 ? "bg-green-600 dark:bg-green-500 text-white border-green-700 dark:border-green-400" :
                        (csrHistoryVendor?.csrRating ?? 0) >= 70 ? "bg-yellow-500 dark:bg-yellow-500 text-black border-yellow-600 dark:border-yellow-400" :
                        (csrHistoryVendor?.csrRating ?? 0) >= 50 ? "bg-orange-500 dark:bg-orange-500 text-white border-orange-600 dark:border-orange-400" :
                        "bg-red-600 dark:bg-red-500 text-white border-red-700 dark:border-red-400"
                      }`}
                      data-testid="badge-csr-current"
                    >
                      <Shield className="w-4 h-4" />
                      <span>{csrHistoryVendor?.csrLabel || 'N/A'}</span>
                    </Badge>
                  </div>
                </div>
              )}

              {/* History Timeline */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">{t('propertyManager.csrHistory.ratingChanges', 'Rating Changes')}</h4>
                
                {isLoadingCsrHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : csrHistoryData?.history && csrHistoryData.history.length > 0 ? (
                  <div className="space-y-3">
                    {csrHistoryData.history.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3 rounded-lg border bg-card"
                        data-testid={`csr-history-entry-${entry.id}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="outline"
                                className={entry.delta >= 0 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700"}
                              >
                                {entry.delta >= 0 ? '+' : ''}{entry.delta.toFixed(1)}%
                              </Badge>
                              <span className="text-xs text-muted-foreground capitalize">{entry.category}</span>
                            </div>
                            <p className="text-sm">{entry.reason}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span>{entry.previousScore.toFixed(1)}%</span>
                              <span className="text-muted-foreground/50">-&gt;</span>
                              <span className="font-medium">{entry.newScore.toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimestampDate(entry.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>{t('propertyManager.csrHistory.noHistory', 'No rating changes recorded yet')}</p>
                    <p className="text-xs mt-1">{t('propertyManager.csrHistory.noHistoryHint', 'Changes will appear here as the company updates their safety documentation')}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setCsrHistoryVendor(null)}
                data-testid="button-close-csr-history"
              >
                {t('common.close', 'Close')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Complaint Details Dialog */}
        <Dialog open={selectedComplaint !== null} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
          <DialogContent className="h-[90vh] flex flex-col p-0 max-w-2xl" data-testid="dialog-complaint-details">
            <DialogHeader className="shrink-0 px-6 pt-6 pb-4 border-b">
              <DialogTitle data-testid="text-complaint-title">
                {selectedComplaint?.subject || t('propertyManager.feedbackDetails.noSubject', 'No Subject')}
              </DialogTitle>
              <DialogDescription data-testid="text-complaint-timestamp">
                {t('propertyManager.feedbackDetails.submittedOn', 'Submitted on')} {selectedComplaint ? formatTimestampDate(selectedComplaint.createdAt) : ''} {t('propertyManager.feedbackDetails.at', 'at')}{' '}
                {selectedComplaint ? formatTime(selectedComplaint.createdAt) : ''}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{t('propertyManager.feedbackDetails.status', 'Status:')}</span>
                  <Badge variant={selectedComplaint?.status === 'resolved' ? 'default' : 'secondary'}>
                    {selectedComplaint?.status === 'resolved' ? t('propertyManager.feedbackDetails.resolved', 'resolved') : t('propertyManager.feedbackDetails.pending', 'pending')}
                  </Badge>
                </div>

                {/* Resident Information */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">{t('propertyManager.feedbackDetails.residentInfo', 'Resident Information')}</h4>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                    <div><span className="font-medium">{t('propertyManager.feedbackDetails.name', 'Name:')}</span> {selectedComplaint?.residentName || t('propertyManager.feedbackDetails.notAvailable', 'N/A')}</div>
                    {selectedComplaint?.unitNumber && (
                      <div><span className="font-medium">{t('propertyManager.feedbackDetails.unit', 'Unit:')}</span> {selectedComplaint.unitNumber}</div>
                    )}
                    {selectedComplaint?.phoneNumber && (
                      <div><span className="font-medium">{t('propertyManager.feedbackDetails.phone', 'Phone:')}</span> {selectedComplaint.phoneNumber}</div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {selectedComplaint?.description && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">{t('propertyManager.feedbackDetails.description', 'Description')}</h4>
                    <div className="bg-muted/50 rounded-lg p-3 text-sm whitespace-pre-wrap">
                      {selectedComplaint.description}
                    </div>
                  </div>
                )}

                {/* Photo */}
                {selectedComplaint?.photoUrl && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">{t('propertyManager.feedbackDetails.attachedPhoto', 'Attached Photo')}</h4>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <img 
                        src={selectedComplaint.photoUrl} 
                        alt={t('propertyManager.feedbackDetails.photoAlt', 'Feedback photo')} 
                        className="w-full h-auto rounded-md"
                        data-testid="img-feedback-photo"
                      />
                    </div>
                  </div>
                )}

                {/* Notes (visible to resident) */}
                {selectedComplaint?.notes && selectedComplaint.notes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">{t('propertyManager.feedbackDetails.communicationHistory', 'Communication History')}</h4>
                    <div className="space-y-2">
                      {selectedComplaint.notes
                        .filter((note: any) => note.visibleToResident)
                        .map((note: any) => (
                          <div key={note.id} className="bg-muted/50 rounded-lg p-3" data-testid={`note-${note.id}`}>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="text-xs font-medium">{note.authorName}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestampDate(note.createdAt)} {formatTime(note.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 px-6 py-4 border-t flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedComplaint(null)}
                data-testid="button-close-feedback-details"
              >
                {t('propertyManager.close', 'Close')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Building Instructions Dialog */}
        <Dialog open={editBuildingInstructionsOpen} onOpenChange={setEditBuildingInstructionsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="dialog-edit-building-instructions">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('propertyManager.buildingInstructions.editTitle', 'Edit Building Instructions')}
              </DialogTitle>
              <DialogDescription>
                {t('propertyManager.buildingInstructions.editDescription', 'Add access details and contact information for this building.')}
              </DialogDescription>
            </DialogHeader>

            {/* Notice about shared visibility */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
              <span className="material-icons text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">info</span>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {t('propertyManager.buildingInstructions.sharedNotice', 'All changes you make here will be visible to the rope access company working on projects at this building.')}
              </p>
            </div>

            <div className="space-y-4 py-4">
              {/* Building Address */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('propertyManager.buildingInstructions.buildingAddress', 'Building Address')}
                </h4>
                <div className="space-y-2">
                  <AddressAutocomplete
                    value={buildingAddressForm.address}
                    onChange={(value) => setBuildingAddressForm(prev => ({ ...prev, address: value }))}
                    onSelect={(address, lat, lng) => {
                      setBuildingAddressForm({ address, latitude: lat, longitude: lng });
                    }}
                    placeholder={t('propertyManager.buildingInstructions.addressPlaceholder', 'Start typing to search...')}
                    data-testid="input-pm-building-address"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('propertyManager.buildingInstructions.addressHint', 'Select from suggestions to capture coordinates for map display')}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => saveBuildingAddressMutation.mutate(buildingAddressForm)}
                    disabled={saveBuildingAddressMutation.isPending || !buildingAddressForm.address}
                    data-testid="button-save-pm-address"
                  >
                    {saveBuildingAddressMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {t('propertyManager.buildingInstructions.saveAddress', 'Save Address')}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Access Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">{t('propertyManager.buildingInstructions.accessInfo', 'Access Information')}</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="pm-buildingAccess">{t('propertyManager.buildingInstructions.buildingAccess', 'Building Access Instructions')}</Label>
                    <Input
                      id="pm-buildingAccess"
                      value={buildingInstructionsForm.buildingAccess}
                      onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, buildingAccess: e.target.value }))}
                      placeholder={t('propertyManager.buildingInstructions.buildingAccessPlaceholder', 'e.g., Enter through loading dock on south side')}
                      data-testid="input-building-access"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="pm-keysAndFob">{t('propertyManager.buildingInstructions.keysAndFob', 'Keys/Fob Information')}</Label>
                      <Input
                        id="pm-keysAndFob"
                        value={buildingInstructionsForm.keysAndFob}
                        onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, keysAndFob: e.target.value }))}
                        placeholder={t('propertyManager.buildingInstructions.keysPlaceholder', 'e.g., Pick up from concierge')}
                        data-testid="input-keys-and-fob"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pm-keysReturnPolicy">{t('propertyManager.buildingInstructions.keysReturnPolicy', 'Keys Return Policy')}</Label>
                      <select
                        id="pm-keysReturnPolicy"
                        value={buildingInstructionsForm.keysReturnPolicy}
                        onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, keysReturnPolicy: e.target.value }))}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        data-testid="select-keys-return-policy"
                      >
                        <option value="">{t('propertyManager.buildingInstructions.selectReturnPolicy', 'Select return policy...')}</option>
                        <option value="End of Every Day">{t('propertyManager.buildingInstructions.returnEndOfDay', 'End of Every Day')}</option>
                        <option value="End of Week">{t('propertyManager.buildingInstructions.returnEndOfWeek', 'End of Week')}</option>
                        <option value="End of Project">{t('propertyManager.buildingInstructions.returnEndOfProject', 'End of Project')}</option>
                        <option value="Keep Until Work Complete">{t('propertyManager.buildingInstructions.keepUntilComplete', 'Keep Until Work Complete')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pm-roofAccess">{t('propertyManager.buildingInstructions.roofAccess', 'Roof Access Instructions')}</Label>
                    <Input
                      id="pm-roofAccess"
                      value={buildingInstructionsForm.roofAccess}
                      onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, roofAccess: e.target.value }))}
                      placeholder={t('propertyManager.buildingInstructions.roofAccessPlaceholder', 'e.g., Access via penthouse stairwell')}
                      data-testid="input-roof-access"
                    />
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">{t('propertyManager.buildingInstructions.contacts', 'Building Contacts')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="pm-bmName">{t('propertyManager.buildingInstructions.buildingManagerName', 'Building Manager Name')}</Label>
                    <Input
                      id="pm-bmName"
                      value={buildingInstructionsForm.buildingManagerName}
                      onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, buildingManagerName: e.target.value }))}
                      data-testid="input-building-manager-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pm-bmPhone">{t('propertyManager.buildingInstructions.buildingManagerPhone', 'Phone')}</Label>
                    <Input
                      id="pm-bmPhone"
                      value={buildingInstructionsForm.buildingManagerPhone}
                      onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, buildingManagerPhone: e.target.value }))}
                      data-testid="input-building-manager-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pm-bmEmail">{t('propertyManager.buildingInstructions.buildingManagerEmail', 'Email')}</Label>
                    <Input
                      id="pm-bmEmail"
                      type="email"
                      value={buildingInstructionsForm.buildingManagerEmail}
                      onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, buildingManagerEmail: e.target.value }))}
                      data-testid="input-building-manager-email"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="pm-conciergeName">{t('propertyManager.buildingInstructions.conciergeName', 'Concierge Name')}</Label>
                    <Input
                      id="pm-conciergeName"
                      value={buildingInstructionsForm.conciergeNames}
                      onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, conciergeNames: e.target.value }))}
                      data-testid="input-concierge-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pm-conciergePhone">{t('propertyManager.buildingInstructions.conciergePhone', 'Phone')}</Label>
                    <Input
                      id="pm-conciergePhone"
                      value={buildingInstructionsForm.conciergePhone}
                      onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, conciergePhone: e.target.value }))}
                      data-testid="input-concierge-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pm-conciergeHours">{t('propertyManager.buildingInstructions.conciergeHours', 'Hours')}</Label>
                    <Input
                      id="pm-conciergeHours"
                      value={buildingInstructionsForm.conciergeHours}
                      onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, conciergeHours: e.target.value }))}
                      placeholder={t('propertyManager.buildingInstructions.conciergeHoursPlaceholder', 'e.g., 8am - 8pm')}
                      data-testid="input-concierge-hours"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="pm-maintName">{t('propertyManager.buildingInstructions.maintenanceName', 'Maintenance Contact Name')}</Label>
                    <Input
                      id="pm-maintName"
                      value={buildingInstructionsForm.maintenanceName}
                      onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, maintenanceName: e.target.value }))}
                      data-testid="input-maintenance-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pm-maintPhone">{t('propertyManager.buildingInstructions.maintenancePhone', 'Phone')}</Label>
                    <Input
                      id="pm-maintPhone"
                      value={buildingInstructionsForm.maintenancePhone}
                      onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, maintenancePhone: e.target.value }))}
                      data-testid="input-maintenance-phone"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="pm-councilUnits">{t('propertyManager.buildingInstructions.councilMemberUnits', 'Council Member Units')}</Label>
                  <Input
                    id="pm-councilUnits"
                    value={buildingInstructionsForm.councilMemberUnits}
                    onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, councilMemberUnits: e.target.value }))}
                    placeholder={t('propertyManager.buildingInstructions.councilUnitsPlaceholder', 'e.g., Units 301, 502, 1201')}
                    data-testid="input-council-units"
                  />
                </div>
              </div>

              {/* Trade Facilities */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">{t('propertyManager.buildingInstructions.tradeFacilities', 'Trade Facilities')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="pm-tradeParkingInstructions">{t('propertyManager.buildingInstructions.tradeParkingInstructions', 'Trade Parking Instructions')}</Label>
                    <Input
                      id="pm-tradeParkingInstructions"
                      value={buildingInstructionsForm.tradeParkingInstructions}
                      onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, tradeParkingInstructions: e.target.value }))}
                      placeholder={t('propertyManager.buildingInstructions.tradeParkingPlaceholder', 'e.g., P1 level, spots 45-48')}
                      data-testid="input-trade-parking-instructions"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pm-tradeParkingSpots">{t('propertyManager.buildingInstructions.tradeParkingSpots', 'Number of Spots')}</Label>
                    <Input
                      id="pm-tradeParkingSpots"
                      type="number"
                      min="0"
                      value={buildingInstructionsForm.tradeParkingSpots}
                      onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, tradeParkingSpots: e.target.value }))}
                      data-testid="input-trade-parking-spots"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="pm-tradeWashroom">{t('propertyManager.buildingInstructions.tradeWashroom', 'Trade Washroom Location')}</Label>
                  <Input
                    id="pm-tradeWashroom"
                    value={buildingInstructionsForm.tradeWashroomLocation}
                    onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, tradeWashroomLocation: e.target.value }))}
                    placeholder={t('propertyManager.buildingInstructions.tradeWashroomPlaceholder', 'e.g., P1 level near loading dock')}
                    data-testid="input-trade-washroom"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">{t('propertyManager.buildingInstructions.specialRequests', 'Special Requests')}</h4>
                <div>
                  <Label htmlFor="pm-specialRequests">{t('propertyManager.buildingInstructions.specialRequestsLabel', 'Any special requirements or notes')}</Label>
                  <textarea
                    id="pm-specialRequests"
                    value={buildingInstructionsForm.specialRequests}
                    onChange={(e) => setBuildingInstructionsForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder={t('propertyManager.buildingInstructions.specialRequestsPlaceholder', 'Enter any special instructions or requirements...')}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    data-testid="textarea-special-requests"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setEditBuildingInstructionsOpen(false)}
                data-testid="button-cancel-building-instructions"
              >
                {t('propertyManager.cancel', 'Cancel')}
              </Button>
              <Button
                onClick={() => saveBuildingInstructionsMutation.mutate(buildingInstructionsForm)}
                disabled={saveBuildingInstructionsMutation.isPending}
                data-testid="button-save-building-instructions"
              >
                {saveBuildingInstructionsMutation.isPending 
                  ? t('propertyManager.saving', 'Saving...') 
                  : t('propertyManager.save', 'Save Instructions')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
