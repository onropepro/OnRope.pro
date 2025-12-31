import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatLocalDate, formatLocalDateLong } from "@/lib/dateUtils";
import { Loader2, Building2, History, CheckCircle, Clock, AlertCircle, LogOut, Lock, Hash, ArrowLeft, KeyRound, DoorOpen, Phone, User, Wrench, FileText, Pencil, Save, Copy, Users, Download, Megaphone, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { loadLogoAsBase64 } from "@/lib/pdfBranding";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import type { BuildingInstructions } from "@shared/schema";

interface BuildingData {
  id: string;
  strataPlanNumber: string;
  buildingName: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  totalUnits: number | null;
  totalProjects: number;
  projectsCompleted: number;
  createdAt: string;
  passwordChangedAt: string | null;
}

interface ProjectHistoryItem {
  id: string;
  jobType: string;
  customJobType: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  companyName: string;
  createdAt: string;
  // Additional fields for active projects
  residentCode?: string | null;
  companyPhone?: string | null;
  companyEmail?: string | null;
  notes?: string | null;
  scheduledDates?: string[];
  progressType?: 'drops' | 'suites' | 'stalls' | 'hours';
  // Drop progress
  totalDropsNorth?: number;
  totalDropsEast?: number;
  totalDropsSouth?: number;
  totalDropsWest?: number;
  completedDropsNorth?: number;
  completedDropsEast?: number;
  completedDropsSouth?: number;
  completedDropsWest?: number;
  // Suite progress
  totalSuites?: number;
  completedSuites?: number;
  // Stall progress
  totalStalls?: number;
  completedStalls?: number;
  // Hours progress
  estimatedHours?: number;
  loggedHours?: number;
}

interface WorkNoticeItem {
  id: string;
  title: string;
  content: string;
  additionalInstructions?: string | null;
  workStartDate: string | null;
  workEndDate: string | null;
  projectId: string;
  buildingName: string;
  jobType: string;
  companyName: string;
  companyPhone?: string | null;
  logoUrl?: string | null;
  propertyManagerName?: string | null;
  createdAt: string;
}

interface PortalData {
  building: BuildingData;
  projectHistory: ProjectHistoryItem[];
  workNotices?: WorkNoticeItem[];
  stats: {
    totalProjects: number;
    completedProjects: number;
    activeProjects: number;
  };
}

export default function BuildingPortal() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [strataPlanNumber, setStrataPlanNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
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
  const [addressForm, setAddressForm] = useState({
    address: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const { 
    data: portalData, 
    isLoading: isLoadingPortal, 
    error: portalError,
    isError: hasPortalError,
    refetch: refetchPortal 
  } = useQuery<PortalData>({
    queryKey: ["/api/building/portal"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Fetch building instructions when we have building data
  const buildingId = portalData?.building?.id;
  const { data: buildingInstructions, isLoading: isLoadingInstructions } = useQuery<BuildingInstructions | null>({
    queryKey: ["/api/buildings", buildingId, "instructions"],
    queryFn: async () => {
      if (!buildingId) return null;
      const response = await fetch(`/api/buildings/${buildingId}/instructions`, { credentials: "include" });
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!buildingId,
  });

  // Initialize form when instructions are loaded
  useEffect(() => {
    if (buildingInstructions) {
      setInstructionsForm({
        buildingAccess: buildingInstructions.buildingAccess || "",
        keysAndFob: buildingInstructions.keysAndFob || "",
        keysReturnPolicy: (buildingInstructions as any).keysReturnPolicy || "",
        roofAccess: buildingInstructions.roofAccess || "",
        specialRequests: buildingInstructions.specialRequests || "",
        buildingManagerName: buildingInstructions.buildingManagerName || "",
        buildingManagerPhone: buildingInstructions.buildingManagerPhone || "",
        conciergeNames: buildingInstructions.conciergeNames || "",
        conciergePhone: buildingInstructions.conciergePhone || "",
        conciergeHours: (buildingInstructions as any).conciergeHours || "",
        maintenanceName: buildingInstructions.maintenanceName || "",
        maintenancePhone: buildingInstructions.maintenancePhone || "",
        councilMemberUnits: (buildingInstructions as any).councilMemberUnits || "",
        tradeParkingInstructions: (buildingInstructions as any).tradeParkingInstructions || "",
        tradeParkingSpots: (buildingInstructions as any).tradeParkingSpots?.toString() || "",
        tradeWashroomLocation: (buildingInstructions as any).tradeWashroomLocation || "",
      });
    }
  }, [buildingInstructions]);

  // Initialize address form when building data is loaded
  useEffect(() => {
    if (portalData?.building) {
      setAddressForm({
        address: portalData.building.address || "",
        latitude: null,
        longitude: null,
      });
    }
  }, [portalData?.building]);

  const saveInstructionsMutation = useMutation({
    mutationFn: async (data: typeof instructionsForm) => {
      const response = await apiRequest("POST", `/api/buildings/${buildingId}/instructions`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('buildingPortal.instructionsSaved', 'Instructions Saved'),
        description: t('buildingPortal.instructionsSavedDesc', 'Building instructions have been updated successfully.'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/buildings", buildingId, "instructions"] });
      setShowInstructionsDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: t('buildingPortal.saveFailed', 'Save Failed'),
        description: error.message || t('buildingPortal.saveInstructionsFailed', 'Failed to save building instructions.'),
        variant: "destructive",
      });
    },
  });

  const saveAddressMutation = useMutation({
    mutationFn: async (data: typeof addressForm) => {
      const response = await apiRequest("PATCH", `/api/buildings/${buildingId}/address`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("common.saved"),
        description: t('buildingPortal.addressUpdated', 'Building address has been updated.'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/building/portal"] });
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description: error.message || t('buildingPortal.addressUpdateFailed', 'Failed to update building address.'),
        variant: "destructive",
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({ strataPlanNumber, password }: { strataPlanNumber: string; password: string }) => {
      const response = await apiRequest("POST", "/api/building/login", { strataPlanNumber, password });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('buildingPortal.loginSuccessful', 'Login Successful'),
        description: t('buildingPortal.welcomePortal', 'Welcome to your building portal.'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/building/portal"] });
    },
    onError: (error: any) => {
      toast({
        title: t('buildingPortal.loginFailed', 'Login Failed'),
        description: error.message || t('buildingPortal.invalidCredentials', 'Invalid strata plan number or password.'),
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordForm) => {
      const response = await apiRequest("POST", "/api/building/change-password", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('buildingPortal.passwordChanged', 'Password Changed'),
        description: t('buildingPortal.passwordChangedDesc', 'Your password has been updated successfully.'),
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowChangePasswordDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/building/portal"] });
    },
    onError: (error: any) => {
      toast({
        title: t('buildingPortal.passwordChangeFailed', 'Password Change Failed'),
        description: error.message || t('buildingPortal.passwordChangeError', 'Failed to change password. Please try again.'),
        variant: "destructive",
      });
    },
  });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: t('validation.missingInfo', 'Missing Information'),
        description: t('buildingPortal.fillAllPasswordFields', 'Please fill in all password fields.'),
        variant: "destructive",
      });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: t('validation.passwordsDontMatch', "Passwords Don't Match"),
        description: t('validation.passwordsMustMatch', 'New password and confirmation must match.'),
        variant: "destructive",
      });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: t('validation.passwordTooShort', 'Password Too Short'),
        description: t('validation.passwordMinLength', 'Password must be at least 6 characters long.'),
        variant: "destructive",
      });
      return;
    }
    changePasswordMutation.mutate(passwordForm);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!strataPlanNumber.trim() || !password.trim()) {
      toast({
        title: t('validation.missingInfo', 'Missing Information'),
        description: t('buildingPortal.enterBothFields', 'Please enter both strata plan number and password.'),
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ strataPlanNumber: strataPlanNumber.trim(), password });
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      queryClient.clear();
      setStrataPlanNumber("");
      setPassword("");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      refetchPortal();
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-success-600/10 text-success-600 dark:text-success-500 border-success-600/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "active":
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-action-600/10 text-action-600 dark:text-action-400 border-action-600/30">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-warning-600/10 text-warning-600 dark:text-warning-500 border-warning-600/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const getJobTypeName = (project: ProjectHistoryItem) => {
    if (project.customJobType) return project.customJobType;
    const jobTypeNames: Record<string, string> = {
      window_cleaning: "Window Cleaning",
      facade_inspection: "Facade Inspection",
      painting: "Painting",
      caulking: "Caulking",
      pressure_washing: "Pressure Washing",
      building_maintenance: "Building Maintenance",
      gutter_cleaning: "Gutter Cleaning",
      light_replacement: "Light Replacement",
      signage_installation: "Signage Installation",
      other: "Other",
    };
    return jobTypeNames[project.jobType] || project.jobType;
  };

  const getProjectProgress = (project: ProjectHistoryItem): { completed: number; total: number; label: string; hasProgress: boolean } | null => {
    if (!project.progressType) return null;
    
    switch (project.progressType) {
      case 'drops': {
        const total = (project.totalDropsNorth || 0) + (project.totalDropsEast || 0) + 
                     (project.totalDropsSouth || 0) + (project.totalDropsWest || 0);
        const completed = (project.completedDropsNorth || 0) + (project.completedDropsEast || 0) + 
                         (project.completedDropsSouth || 0) + (project.completedDropsWest || 0);
        return { completed, total, label: 'drops', hasProgress: total > 0 };
      }
      case 'suites': {
        const total = project.totalSuites || 0;
        return { completed: project.completedSuites || 0, total, label: 'suites', hasProgress: total > 0 };
      }
      case 'stalls': {
        const total = project.totalStalls || 0;
        return { completed: project.completedStalls || 0, total, label: 'stalls', hasProgress: total > 0 };
      }
      case 'hours': {
        const total = project.estimatedHours || 0;
        return { completed: project.loggedHours || 0, total, label: 'hours', hasProgress: total > 0 };
      }
      default:
        return null;
    }
  };

  const isAuthenticated = !hasPortalError && portalData;
  const needsLogin = hasPortalError || (!isLoadingPortal && !portalData);

  if (isLoadingPortal) {
    return (
      <div className="min-h-screen page-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t('buildingPortal.loading', 'Loading building portal...')}</p>
        </div>
      </div>
    );
  }

  if (needsLogin) {
    return (
      <div className="min-h-screen page-gradient flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mb-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Building Portal</CardTitle>
              <CardDescription>
                Access your building's maintenance history
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strataPlanNumber">Strata Plan / Job Number</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="strataPlanNumber"
                    type="text"
                    placeholder="Enter your strata or job number"
                    value={strataPlanNumber}
                    onChange={(e) => setStrataPlanNumber(e.target.value)}
                    className="pl-10 h-12"
                    autoComplete="username"
                    data-testid="input-strata-number"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  You can enter with or without spaces (e.g., LMS1000 or LMS 1000)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    autoComplete="current-password"
                    data-testid="input-password"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Access Building Portal
                  </>
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Your strata plan number is your username. Contact your property manager if you need assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const building = portalData?.building;
  const projectHistory = portalData?.projectHistory || [];
  const workNotices = portalData?.workNotices || [];
  const stats = portalData?.stats;

  // PDF Download function for work notices
  const downloadNoticePdf = async (notice: WorkNoticeItem) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPos = 25;

    // Header with logo if available
    if (notice.logoUrl) {
      try {
        const logoData = await loadLogoAsBase64(notice.logoUrl);
        if (logoData) {
          const logoHeight = 15;
          const logoWidth = logoHeight * logoData.aspectRatio;
          doc.addImage(logoData.base64, 'PNG', margin, yPos, logoWidth, logoHeight);
          yPos += logoHeight + 10;
        }
      } catch (e) {
        console.error('Failed to load logo for PDF:', e);
      }
    }

    // Title banner
    doc.setFillColor(51, 65, 85); // Slate-700
    doc.rect(margin, yPos, contentWidth, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL NOTICE', margin + 5, yPos + 11);
    yPos += 22;

    // Notice title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(notice.title, contentWidth);
    doc.text(titleLines, margin, yPos);
    yPos += titleLines.length * 8 + 5;

    // Building name
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(notice.buildingName, margin, yPos);
    yPos += 10;

    // Dates banner
    doc.setFillColor(254, 243, 199); // Amber-100
    doc.rect(margin, yPos, contentWidth, 20, 'F');
    doc.setDrawColor(217, 119, 6); // Amber-600
    doc.rect(margin, yPos, contentWidth, 20, 'S');
    
    doc.setTextColor(146, 64, 14); // Amber-800
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('WORK PERIOD:', margin + 5, yPos + 8);
    doc.setFont('helvetica', 'normal');
    
    const startDate = notice.workStartDate ? new Date(notice.workStartDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD';
    const endDate = notice.workEndDate ? new Date(notice.workEndDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD';
    doc.text(`${startDate} - ${endDate}`, margin + 35, yPos + 8);
    
    // Job type
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICE TYPE:', margin + 5, yPos + 16);
    doc.setFont('helvetica', 'normal');
    doc.text(notice.jobType.replace(/_/g, ' ').toUpperCase(), margin + 35, yPos + 16);
    yPos += 28;

    // Notice content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const contentLines = doc.splitTextToSize(notice.content, contentWidth);
    
    // Check if we need a new page
    const lineHeight = 5;
    const remainingHeight = doc.internal.pageSize.getHeight() - yPos - 30;
    const contentHeight = contentLines.length * lineHeight;
    
    if (contentHeight > remainingHeight) {
      // Split content across pages
      let currentLine = 0;
      while (currentLine < contentLines.length) {
        const linesPerPage = Math.floor((doc.internal.pageSize.getHeight() - yPos - 30) / lineHeight);
        const pageLines = contentLines.slice(currentLine, currentLine + linesPerPage);
        doc.text(pageLines, margin, yPos);
        currentLine += linesPerPage;
        
        if (currentLine < contentLines.length) {
          doc.addPage();
          yPos = 25;
        } else {
          yPos += pageLines.length * lineHeight + 10;
        }
      }
    } else {
      doc.text(contentLines, margin, yPos);
      yPos += contentLines.length * lineHeight + 10;
    }

    // Additional instructions if present
    if (notice.additionalInstructions) {
      yPos += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('ADDITIONAL INSTRUCTIONS:', margin, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const instructionLines = doc.splitTextToSize(notice.additionalInstructions, contentWidth);
      doc.text(instructionLines, margin, yPos);
      yPos += instructionLines.length * 5 + 10;
    }

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, doc.internal.pageSize.getHeight() - 25, pageWidth - margin, doc.internal.pageSize.getHeight() - 25);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Posted by: ${notice.companyName}`, margin, doc.internal.pageSize.getHeight() - 18);
    if (notice.companyPhone) {
      doc.text(`Contact: ${notice.companyPhone}`, margin, doc.internal.pageSize.getHeight() - 12);
    }
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, doc.internal.pageSize.getHeight() - 18);

    // Download
    const filename = `Notice-${notice.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.pdf`;
    doc.save(filename);
    
    toast({
      title: "PDF Downloaded",
      description: "Notice has been downloaded. You can print it for elevator posting.",
    });
  };

  return (
    <div className="min-h-screen page-gradient p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
                {building?.buildingName || `Building ${building?.strataPlanNumber}`}
              </h1>
              <p className="text-muted-foreground">
                {building?.address ? `${building.address}, ${building.city || ""} ${building.province || ""}`.trim() : `Strata: ${building?.strataPlanNumber}`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowChangePasswordDialog(true)}
              data-testid="button-change-password"
            >
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Password Change Warning Banner - shown until password is changed */}
        {building && !building.passwordChangedAt && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-800 dark:text-amber-200">Security Notice: Please Change Your Password</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Your account is using the default password (your strata number). For security reasons, please change your password to something unique and secure.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 border-amber-400 text-amber-700 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/50"
                onClick={() => setShowChangePasswordDialog(true)}
                data-testid="button-change-password-banner"
              >
                <Lock className="mr-2 h-4 w-4" />
                Change Password Now
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-action-600/10 flex items-center justify-center">
                  <History className="h-5 w-5 text-action-600 dark:text-action-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats?.totalProjects || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-success-600/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats?.completedProjects || 0}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-warning-600/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning-600 dark:text-warning-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats?.activeProjects || 0}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Building Instructions Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle>Building Instructions</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInstructionsDialog(true)}
                data-testid="button-edit-instructions"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
            <CardDescription>
              Access information, contacts, and special instructions for contractors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingInstructions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : buildingInstructions && (
              buildingInstructions.buildingAccess || 
              buildingInstructions.keysAndFob || 
              buildingInstructions.roofAccess ||
              buildingInstructions.buildingManagerName ||
              buildingInstructions.conciergeNames ||
              buildingInstructions.maintenanceName ||
              buildingInstructions.specialRequests
            ) ? (
              <div className="grid gap-4">
                {/* Contact Information */}
                {(buildingInstructions?.buildingManagerName || buildingInstructions?.conciergeNames || buildingInstructions?.maintenanceName) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Contacts</h4>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {buildingInstructions?.buildingManagerName && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium text-sm text-foreground">Building Manager</p>
                            <p className="text-sm text-foreground">{buildingInstructions.buildingManagerName}</p>
                            {buildingInstructions.buildingManagerPhone && (
                              <a href={`tel:${buildingInstructions.buildingManagerPhone}`} className="text-sm text-action-600 dark:text-action-400 hover:underline">
                                {buildingInstructions.buildingManagerPhone}
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      {buildingInstructions?.conciergeNames && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium text-sm text-foreground">Concierge</p>
                            <p className="text-sm text-foreground">{buildingInstructions.conciergeNames}</p>
                            {buildingInstructions.conciergePhone && (
                              <a href={`tel:${buildingInstructions.conciergePhone}`} className="text-sm text-action-600 dark:text-action-400 hover:underline">
                                {buildingInstructions.conciergePhone}
                              </a>
                            )}
                            {(buildingInstructions as any).conciergeHours && (
                              <p className="text-xs text-muted-foreground mt-1">Hours: {(buildingInstructions as any).conciergeHours}</p>
                            )}
                          </div>
                        </div>
                      )}
                      {buildingInstructions?.maintenanceName && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <Wrench className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium text-sm text-foreground">Maintenance</p>
                            <p className="text-sm text-foreground">{buildingInstructions.maintenanceName}</p>
                            {buildingInstructions.maintenancePhone && (
                              <a href={`tel:${buildingInstructions.maintenancePhone}`} className="text-sm text-action-600 dark:text-action-400 hover:underline">
                                {buildingInstructions.maintenancePhone}
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      {(buildingInstructions as any)?.councilMemberUnits && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <span className="material-icons text-muted-foreground mt-0.5" style={{ fontSize: '20px' }}>groups</span>
                          <div>
                            <p className="font-medium text-sm text-foreground">Council Member Units</p>
                            <p className="text-sm text-foreground">{(buildingInstructions as any).councilMemberUnits}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Access Information */}
                {(buildingInstructions?.buildingAccess || buildingInstructions?.keysAndFob || buildingInstructions?.roofAccess) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Access Information</h4>
                    <div className="grid gap-3">
                      {buildingInstructions?.buildingAccess && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <DoorOpen className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium text-sm text-foreground">Building Access</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{buildingInstructions.buildingAccess}</p>
                          </div>
                        </div>
                      )}
                      {buildingInstructions?.keysAndFob && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <KeyRound className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium text-sm text-foreground">Keys / Fob</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{buildingInstructions.keysAndFob}</p>
                            {(buildingInstructions as any).keysReturnPolicy && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Return: {
                                  (buildingInstructions as any).keysReturnPolicy === 'end_of_day' ? 'End of Every Day' :
                                  (buildingInstructions as any).keysReturnPolicy === 'end_of_week' ? 'End of Week' :
                                  (buildingInstructions as any).keysReturnPolicy === 'end_of_project' ? 'End of Project' :
                                  'Keep Until Work Complete'
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      {buildingInstructions?.roofAccess && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium text-sm text-foreground">Roof Access</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{buildingInstructions.roofAccess}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Trade Parking */}
                {((buildingInstructions as any)?.tradeParkingInstructions || (buildingInstructions as any)?.tradeParkingSpots) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Trade Parking</h4>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="material-icons text-muted-foreground mt-0.5 shrink-0" style={{ fontSize: '20px' }}>local_parking</span>
                      <div>
                        {(buildingInstructions as any).tradeParkingSpots && (
                          <p className="text-sm font-medium text-foreground">{(buildingInstructions as any).tradeParkingSpots} spot(s) available</p>
                        )}
                        {(buildingInstructions as any).tradeParkingInstructions && (
                          <p className="text-sm text-foreground whitespace-pre-wrap">{(buildingInstructions as any).tradeParkingInstructions}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Trade Washroom */}
                {(buildingInstructions as any)?.tradeWashroomLocation && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Trade Washroom</h4>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="material-icons text-muted-foreground mt-0.5 shrink-0" style={{ fontSize: '20px' }}>wc</span>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{(buildingInstructions as any).tradeWashroomLocation}</p>
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                {buildingInstructions?.specialRequests && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Special Requests</h4>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{buildingInstructions.specialRequests}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-3">No building instructions added yet.</p>
                <Button variant="outline" onClick={() => setShowInstructionsDialog(true)} data-testid="button-add-instructions">
                  <Pencil className="h-4 w-4 mr-2" />
                  Add Instructions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Notices Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-purple-600" />
              Work Notices
              {workNotices.length > 0 && (
                <Badge variant="secondary" className="ml-2">{workNotices.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Active notices for upcoming or ongoing maintenance work - download and post in elevators
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workNotices.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Megaphone className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No active work notices at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workNotices.map((notice) => (
                  <div 
                    key={notice.id}
                    className="border rounded-lg overflow-hidden"
                    data-testid={`work-notice-${notice.id}`}
                  >
                    {/* Professional Header */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-900 dark:to-slate-800 px-4 py-3 text-white">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {notice.logoUrl ? (
                            <div className="flex-shrink-0 bg-white rounded p-1.5">
                              <img 
                                src={notice.logoUrl} 
                                alt="Company logo" 
                                className="h-8 w-auto object-contain"
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 bg-white/10 rounded p-2">
                              <Building2 className="h-5 w-5" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium uppercase tracking-wider text-white/70">Official Notice</span>
                            <h4 className="font-semibold truncate">{notice.title}</h4>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => downloadNoticePdf(notice)}
                          className="flex-shrink-0"
                          data-testid={`button-download-notice-${notice.id}`}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>

                    {/* Dates Banner */}
                    <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                          <span className="font-medium text-amber-900 dark:text-amber-100">
                            {notice.workStartDate && notice.workEndDate ? (
                              <>
                                {new Date(notice.workStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                                {' - '}
                                {new Date(notice.workEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </>
                            ) : notice.workStartDate ? (
                              <>Starting {new Date(notice.workStartDate).toLocaleDateString()}</>
                            ) : (
                              'Dates TBD'
                            )}
                          </span>
                        </div>
                        <Badge variant="outline" className="capitalize text-xs">
                          {notice.jobType.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                        {notice.content}
                      </p>
                      <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                        <span>From: {notice.companyName}</span>
                        <span>Posted: {formatLocalDate(notice.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Maintenance History
            </CardTitle>
            <CardDescription>
              All maintenance projects performed at this building across all service providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Maintenance History</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  There are no recorded maintenance projects for this building yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {projectHistory.map((project, index) => {
                  const progress = project.status === 'active' ? getProjectProgress(project) : null;
                  const isActive = project.status === 'active';
                  
                  return (
                    <div key={project.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className={`${isActive ? 'p-4 rounded-lg border-2 border-action-600/30 dark:border-action-600/40 bg-action-600/5 dark:bg-action-600/10' : ''}`}>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-foreground">{getJobTypeName(project)}</span>
                              {getStatusBadge(project.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              by {project.companyName}
                            </p>
                            
                            {/* Enhanced details for active projects */}
                            {isActive && (
                              <div className="mt-3 space-y-3">
                                {/* Progress bar */}
                                {progress && (
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                      <span>Progress</span>
                                      {progress.hasProgress ? (
                                        <span>{progress.completed} / {progress.total} {progress.label}</span>
                                      ) : (
                                        <span className="italic">Not yet configured</span>
                                      )}
                                    </div>
                                    <Progress 
                                      value={progress.hasProgress ? (progress.completed / progress.total) * 100 : 0} 
                                      className="h-2" 
                                    />
                                  </div>
                                )}
                                
                                {/* Resident Code - important for building manager */}
                                {project.residentCode && (
                                  <div className="flex items-center gap-2 p-2 rounded-md bg-background border">
                                    <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs text-muted-foreground">Resident Feedback Code</p>
                                      <p className="font-mono font-medium">{project.residentCode}</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        navigator.clipboard.writeText(project.residentCode!);
                                        toast({
                                          title: "Copied",
                                          description: "Resident code copied to clipboard",
                                        });
                                      }}
                                      data-testid={`button-copy-resident-code-${project.id}`}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                                
                                {/* Company contact info */}
                                {(project.companyPhone || project.companyEmail) && (
                                  <div className="flex flex-wrap gap-3 text-sm">
                                    {project.companyPhone && (
                                      <a href={`tel:${project.companyPhone}`} className="flex items-center gap-1 text-action-600 dark:text-action-400 hover:underline">
                                        <Phone className="h-3 w-3" />
                                        {project.companyPhone}
                                      </a>
                                    )}
                                  </div>
                                )}
                                
                                {/* Notes */}
                                {project.notes && (
                                  <p className="text-sm text-muted-foreground italic">
                                    Note: {project.notes}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground md:text-right shrink-0">
                            {project.startDate ? (
                              <>
                                <span>{formatLocalDate(project.startDate)}</span>
                                {project.endDate && project.startDate !== project.endDate && (
                                  <span> - {formatLocalDate(project.endDate)}</span>
                                )}
                              </>
                            ) : (
                              <span>Created {formatLocalDate(project.createdAt)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Building Portal - Viewing maintenance history for {building?.strataPlanNumber}</p>
        </div>
      </div>

      {/* Edit Instructions Dialog */}
      <Dialog open={showInstructionsDialog} onOpenChange={setShowInstructionsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Building Instructions</DialogTitle>
            <DialogDescription>
              Add access information and contact details for contractors working at this building.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Building Address Section */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Building Address
              </h4>
              <div className="space-y-2">
                <Label>Address</Label>
                <AddressAutocomplete
                  value={addressForm.address}
                  onChange={(value) => setAddressForm(prev => ({ ...prev, address: value }))}
                  onSelect={(address, lat, lng) => {
                    setAddressForm({ address, latitude: lat, longitude: lng });
                  }}
                  placeholder="Start typing to search..."
                  data-testid="input-building-address"
                />
                <p className="text-xs text-muted-foreground">
                  Select from suggestions to capture coordinates for map display
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => saveAddressMutation.mutate(addressForm)}
                  disabled={saveAddressMutation.isPending || !addressForm.address}
                  data-testid="button-save-address"
                >
                  {saveAddressMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Address
                </Button>
              </div>
            </div>

            <Separator />

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Information
              </h4>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="buildingManagerName">Building Manager Name</Label>
                  <Input
                    id="buildingManagerName"
                    placeholder="e.g., John Smith"
                    value={instructionsForm.buildingManagerName}
                    onChange={(e) => setInstructionsForm(prev => ({ ...prev, buildingManagerName: e.target.value }))}
                    data-testid="input-manager-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buildingManagerPhone">Building Manager Phone</Label>
                  <Input
                    id="buildingManagerPhone"
                    placeholder="e.g., (604) 555-1234"
                    value={instructionsForm.buildingManagerPhone}
                    onChange={(e) => setInstructionsForm(prev => ({ ...prev, buildingManagerPhone: e.target.value }))}
                    data-testid="input-manager-phone"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="conciergeNames">Concierge Name(s)</Label>
                  <Input
                    id="conciergeNames"
                    placeholder="e.g., Jane Doe, Mike Wilson"
                    value={instructionsForm.conciergeNames}
                    onChange={(e) => setInstructionsForm(prev => ({ ...prev, conciergeNames: e.target.value }))}
                    data-testid="input-concierge-names"
                  />
                  <p className="text-xs text-muted-foreground">Separate multiple names with commas</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conciergePhone">Concierge Phone</Label>
                  <Input
                    id="conciergePhone"
                    placeholder="e.g., (604) 555-5678"
                    value={instructionsForm.conciergePhone}
                    onChange={(e) => setInstructionsForm(prev => ({ ...prev, conciergePhone: e.target.value }))}
                    data-testid="input-concierge-phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conciergeHours">Concierge Hours of Operation</Label>
                <Input
                  id="conciergeHours"
                  placeholder="e.g., Mon-Fri 8am-8pm, Sat-Sun 9am-5pm"
                  value={instructionsForm.conciergeHours}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, conciergeHours: e.target.value }))}
                  data-testid="input-concierge-hours"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceName">Maintenance Contact Name</Label>
                  <Input
                    id="maintenanceName"
                    placeholder="e.g., Building Maintenance"
                    value={instructionsForm.maintenanceName}
                    onChange={(e) => setInstructionsForm(prev => ({ ...prev, maintenanceName: e.target.value }))}
                    data-testid="input-maintenance-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenancePhone">Maintenance Phone</Label>
                  <Input
                    id="maintenancePhone"
                    placeholder="e.g., (604) 555-9012"
                    value={instructionsForm.maintenancePhone}
                    onChange={(e) => setInstructionsForm(prev => ({ ...prev, maintenancePhone: e.target.value }))}
                    data-testid="input-maintenance-phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="councilMemberUnits">Council Member Units</Label>
                <Input
                  id="councilMemberUnits"
                  placeholder="e.g., Unit 301, 502, 1205"
                  value={instructionsForm.councilMemberUnits}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, councilMemberUnits: e.target.value }))}
                  data-testid="input-council-units"
                />
                <p className="text-xs text-muted-foreground">Floor/unit numbers where council members reside</p>
              </div>
            </div>

            <Separator />

            {/* Access Information Section */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <DoorOpen className="h-4 w-4" />
                Access Information
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="buildingAccess">Building Access Instructions</Label>
                <Textarea
                  id="buildingAccess"
                  placeholder="e.g., Enter through main lobby, check in with concierge..."
                  value={instructionsForm.buildingAccess}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, buildingAccess: e.target.value }))}
                  rows={3}
                  data-testid="textarea-building-access"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keysAndFob">Keys / Fob Pickup</Label>
                <Textarea
                  id="keysAndFob"
                  placeholder="e.g., Pick up keys from concierge desk, return by 5pm..."
                  value={instructionsForm.keysAndFob}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, keysAndFob: e.target.value }))}
                  rows={3}
                  data-testid="textarea-keys-fob"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keysReturnPolicy">Keys / Fob Return Policy</Label>
                <Select
                  value={instructionsForm.keysReturnPolicy}
                  onValueChange={(value) => setInstructionsForm(prev => ({ ...prev, keysReturnPolicy: value }))}
                >
                  <SelectTrigger data-testid="select-keys-return">
                    <SelectValue placeholder="Select when to return keys..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="end_of_day">End of Every Day</SelectItem>
                    <SelectItem value="end_of_week">End of Week</SelectItem>
                    <SelectItem value="end_of_project">End of Project</SelectItem>
                    <SelectItem value="keep_until_complete">Keep Until Work Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roofAccess">Roof Access Instructions</Label>
                <Textarea
                  id="roofAccess"
                  placeholder="e.g., Roof access via penthouse level, key required..."
                  value={instructionsForm.roofAccess}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, roofAccess: e.target.value }))}
                  rows={3}
                  data-testid="textarea-roof-access"
                />
              </div>
            </div>

            <Separator />

            {/* Trade Parking Section */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <span className="material-icons text-base">local_parking</span>
                Trade Parking
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="tradeParkingSpots">Number of Trade Parking Spots</Label>
                <Input
                  id="tradeParkingSpots"
                  type="number"
                  min="0"
                  placeholder="e.g., 2"
                  value={instructionsForm.tradeParkingSpots}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, tradeParkingSpots: e.target.value }))}
                  data-testid="input-trade-parking-spots"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradeParkingInstructions">Trade Parking Instructions</Label>
                <Textarea
                  id="tradeParkingInstructions"
                  placeholder="e.g., Visitor parking on P1, loading zone available, street parking with permit..."
                  value={instructionsForm.tradeParkingInstructions}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, tradeParkingInstructions: e.target.value }))}
                  rows={3}
                  data-testid="textarea-trade-parking"
                />
              </div>
            </div>

            <Separator />

            {/* Trade Washroom Section */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <span className="material-icons text-base">wc</span>
                Trade Washroom
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="tradeWashroomLocation">Washroom Location</Label>
                <Textarea
                  id="tradeWashroomLocation"
                  placeholder="e.g., Main floor lobby, P1 parkade near elevator, amenity room on 2nd floor..."
                  value={instructionsForm.tradeWashroomLocation}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, tradeWashroomLocation: e.target.value }))}
                  rows={2}
                  data-testid="textarea-trade-washroom"
                />
              </div>
            </div>

            <Separator />

            {/* Special Requests Section */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Special Requests
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="specialRequests">Additional Instructions or Requests</Label>
                <Textarea
                  id="specialRequests"
                  placeholder="e.g., Quiet hours before 8am, no work on weekends..."
                  value={instructionsForm.specialRequests}
                  onChange={(e) => setInstructionsForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                  rows={4}
                  data-testid="textarea-special-requests"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInstructionsDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => saveInstructionsMutation.mutate(instructionsForm)}
              disabled={saveInstructionsMutation.isPending}
              data-testid="button-save-instructions"
            >
              {saveInstructionsMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Instructions
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
        <DialogContent className="max-w-md" data-testid="dialog-change-password">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new secure password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter your current password"
                data-testid="input-current-password"
              />
              <p className="text-xs text-muted-foreground">
                Your current password is your strata number if you haven't changed it before.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password (min 6 characters)"
                data-testid="input-new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
                data-testid="input-confirm-password"
              />
            </div>
            <DialogFooter className="gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowChangePasswordDialog(false);
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={changePasswordMutation.isPending}
                data-testid="button-submit-password-change"
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
