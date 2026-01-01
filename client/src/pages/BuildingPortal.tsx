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
import { Loader2, Building2, History, CheckCircle, Clock, AlertCircle, LogOut, Lock, Hash, ArrowLeft, KeyRound, DoorOpen, Phone, User, Wrench, FileText, Pencil, Save, Copy, Users, Download, Megaphone, MapPin, Home, Settings, Bell } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { loadLogoAsBase64 } from "@/lib/pdfBranding";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { DashboardSidebar, type NavGroup } from "@/components/DashboardSidebar";
import { UnifiedDashboardHeader } from "@/components/UnifiedDashboardHeader";
import type { BuildingInstructions } from "@shared/schema";

type BuildingTabType = 'overview' | 'projects' | 'instructions' | 'notices' | 'settings';

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
  const [activeTab, setActiveTab] = useState<BuildingTabType>('overview');
  const [selectedProject, setSelectedProject] = useState<ProjectHistoryItem | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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

  // Navigation groups for the building manager sidebar
  const buildingNavGroups: NavGroup[] = [
    {
      id: 'main',
      label: t('buildingPortal.nav.main', 'Main'),
      items: [
        {
          id: 'overview',
          label: t('buildingPortal.nav.overview', 'Overview'),
          icon: Home,
          isVisible: () => true,
        },
        {
          id: 'projects',
          label: t('buildingPortal.nav.projects', 'Project History'),
          icon: History,
          isVisible: () => true,
        },
        {
          id: 'notices',
          label: t('buildingPortal.nav.notices', 'Work Notices'),
          icon: Megaphone,
          isVisible: () => true,
        },
      ],
    },
    {
      id: 'management',
      label: t('buildingPortal.nav.management', 'Management'),
      items: [
        {
          id: 'instructions',
          label: t('buildingPortal.nav.instructions', 'Building Instructions'),
          icon: FileText,
          isVisible: () => true,
        },
        {
          id: 'settings',
          label: t('buildingPortal.nav.settings', 'Settings'),
          icon: Settings,
          isVisible: () => true,
        },
      ],
    },
  ];

  const isAuthenticated = !hasPortalError && portalData;
  const needsLogin = hasPortalError || (!isLoadingPortal && !portalData);

  // Redirect to unified login if not authenticated
  useEffect(() => {
    if (needsLogin && !isLoadingPortal) {
      setLocation("/login");
    }
  }, [needsLogin, isLoadingPortal, setLocation]);

  if (isLoadingPortal || needsLogin) {
    return (
      <div className="min-h-screen page-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t('buildingPortal.loading', 'Loading building portal...')}</p>
        </div>
      </div>
    );
  }

  // Create a mock user object for the sidebar/header components
  const buildingUser = {
    id: portalData.building.id,
    name: portalData.building.buildingName || portalData.building.strataPlanNumber,
    email: portalData.building.strataPlanNumber,
    role: 'building_manager' as const,
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      queryClient.clear();
      toast({
        title: t('buildingPortal.loggedOut', 'Logged Out'),
        description: t('buildingPortal.loggedOutDesc', 'You have been successfully logged out.'),
      });
      setLocation("/login");
    } catch (error) {
      toast({
        title: t('common.error', 'Error'),
        description: t('buildingPortal.logoutError', 'An error occurred while logging out.'),
        variant: "destructive",
      });
    }
  };

  // Password not changed warning
  const showPasswordWarning = !portalData.building.passwordChangedAt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Sidebar */}
      <DashboardSidebar
        currentUser={buildingUser}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as BuildingTabType)}
        variant="building-manager"
        customNavigationGroups={buildingNavGroups}
        showDashboardLink={false}
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />

      {/* Main content wrapper - offset for sidebar on desktop */}
      <div className="lg:pl-60">
        <UnifiedDashboardHeader
          variant="building-manager"
          currentUser={buildingUser}
          onMobileMenuClick={() => setMobileSidebarOpen(true)}
          showSearch={false}
          showNotifications={false}
          showLanguageDropdown={true}
          showInstallPWA={true}
          showProfile={true}
          showLogout={true}
          onLogout={handleLogout}
        />

        {/* Password Change Warning Banner */}
        {showPasswordWarning && (
          <div className="bg-amber-500/20 border-b border-amber-500/30" data-testid="banner-password-warning">
            <div className="w-full px-4 md:px-6 xl:px-8 py-3">
              <div className="flex items-center gap-3 flex-wrap">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base text-amber-700 dark:text-amber-400">
                    {t('buildingPortal.passwordWarningTitle', 'Security Notice')}
                  </p>
                  <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                    {t('buildingPortal.passwordWarningDesc', 'Your password has not been changed from the default. Please update it in Settings for security.')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('settings')}
                  className="border-amber-500/50 text-amber-700 dark:text-amber-400"
                  data-testid="button-change-password-banner"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {t('buildingPortal.changePassword', 'Change Password')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="w-full px-4 md:px-6 xl:px-8 py-6 space-y-6 pb-24">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              {/* Building Info Card */}
              <Card data-testid="card-building-info">
                <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-[#B89685]/10 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-[#B89685]" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl" data-testid="text-building-name">
                        {portalData.building.buildingName || portalData.building.strataPlanNumber}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Hash className="h-4 w-4" />
                        {portalData.building.strataPlanNumber}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {portalData.building.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{t('buildingPortal.address', 'Address')}</p>
                          <p className="text-sm text-muted-foreground" data-testid="text-building-address">
                            {portalData.building.address}
                            {portalData.building.city && `, ${portalData.building.city}`}
                            {portalData.building.province && `, ${portalData.building.province}`}
                            {portalData.building.postalCode && ` ${portalData.building.postalCode}`}
                          </p>
                        </div>
                      </div>
                    )}
                    {portalData.building.totalUnits && (
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{t('buildingPortal.totalUnits', 'Total Units')}</p>
                          <p className="text-sm text-muted-foreground" data-testid="text-total-units">
                            {portalData.building.totalUnits}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <History className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{t('buildingPortal.projectHistory', 'Project History')}</p>
                        <p className="text-sm text-muted-foreground" data-testid="text-project-count">
                          {portalData.stats.completedProjects} {t('buildingPortal.completed', 'completed')}, {portalData.stats.activeProjects} {t('buildingPortal.active', 'active')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card data-testid="card-stat-total">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#B89685]" data-testid="text-stat-total">
                        {portalData.stats.totalProjects}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('buildingPortal.totalProjects', 'Total Projects')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card data-testid="card-stat-completed">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600" data-testid="text-stat-completed">
                        {portalData.stats.completedProjects}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('buildingPortal.completedProjects', 'Completed')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card data-testid="card-stat-active">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600" data-testid="text-stat-active">
                        {portalData.stats.activeProjects}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('buildingPortal.activeProjects', 'In Progress')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Projects with Progress */}
              {portalData.projectHistory.filter(p => p.status === 'active' || p.status === 'in_progress').length > 0 && (
                <Card data-testid="card-active-projects">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {t('buildingPortal.activeProjectsTitle', 'Active Projects')}
                    </CardTitle>
                    <CardDescription>
                      {t('buildingPortal.activeProjectsDesc', 'Current work in progress at your building')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {portalData.projectHistory
                      .filter(p => p.status === 'active' || p.status === 'in_progress')
                      .map((project) => {
                        const progress = getProjectProgress(project);
                        return (
                          <div 
                            key={project.id} 
                            className="p-4 border rounded-lg cursor-pointer hover-elevate transition-all" 
                            data-testid={`card-active-project-${project.id}`}
                            onClick={() => setSelectedProject(project)}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                              <div>
                                <h4 className="font-semibold">{getJobTypeName(project)}</h4>
                                <p className="text-sm text-muted-foreground">{project.companyName}</p>
                              </div>
                              {getStatusBadge(project.status)}
                            </div>
                            {progress && progress.hasProgress && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>{t('buildingPortal.progress', 'Progress')}</span>
                                  <span className="font-medium">
                                    {progress.completed} / {progress.total} {progress.label}
                                  </span>
                                </div>
                                <Progress 
                                  value={(progress.completed / progress.total) * 100} 
                                  className="h-2"
                                />
                              </div>
                            )}
                            {project.companyPhone && (
                              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                {project.companyPhone}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <Card data-testid="card-project-history">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  {t('buildingPortal.projectHistoryTitle', 'Project History')}
                </CardTitle>
                <CardDescription>
                  {t('buildingPortal.projectHistoryDesc', 'All maintenance work performed at your building')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {portalData.projectHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-semibold mb-2">{t('buildingPortal.noProjects', 'No Projects Yet')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('buildingPortal.noProjectsDesc', 'Project history will appear here once work is scheduled.')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {portalData.projectHistory.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg" data-testid={`card-project-${project.id}`}>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold">{getJobTypeName(project)}</h4>
                            <p className="text-sm text-muted-foreground">{project.companyName}</p>
                            {project.startDate && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatLocalDate(project.startDate)}
                                {project.endDate && ` - ${formatLocalDate(project.endDate)}`}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(project.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* NOTICES TAB */}
          {activeTab === 'notices' && (
            <Card data-testid="card-work-notices">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  {t('buildingPortal.workNoticesTitle', 'Work Notices')}
                </CardTitle>
                <CardDescription>
                  {t('buildingPortal.workNoticesDesc', 'Official notices about upcoming and ongoing work')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(!portalData.workNotices || portalData.workNotices.length === 0) ? (
                  <div className="text-center py-12">
                    <Megaphone className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-semibold mb-2">{t('buildingPortal.noNotices', 'No Work Notices')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('buildingPortal.noNoticesDesc', 'Work notices will appear here when vendors schedule work.')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {portalData.workNotices.map((notice) => (
                      <div key={notice.id} className="p-4 border rounded-lg" data-testid={`card-notice-${notice.id}`}>
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold">{notice.title}</h4>
                          {notice.workStartDate && (
                            <Badge variant="outline">
                              {formatLocalDate(notice.workStartDate)}
                              {notice.workEndDate && ` - ${formatLocalDate(notice.workEndDate)}`}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notice.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('buildingPortal.from', 'From')}: {notice.companyName}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* INSTRUCTIONS TAB */}
          {activeTab === 'instructions' && (
            <Card data-testid="card-building-instructions">
              <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t('buildingPortal.instructionsTitle', 'Building Instructions')}
                  </CardTitle>
                  <CardDescription>
                    {t('buildingPortal.instructionsDesc', 'Information for service providers working at your building')}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowInstructionsDialog(true)}
                  data-testid="button-edit-instructions"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  {t('buildingPortal.editInstructions', 'Edit Instructions')}
                </Button>
              </CardHeader>
              <CardContent>
                {!buildingInstructions ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-semibold mb-2">{t('buildingPortal.noInstructions', 'No Instructions Set')}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('buildingPortal.noInstructionsDesc', 'Add building access information, contact details, and special instructions.')}
                    </p>
                    <Button onClick={() => setShowInstructionsDialog(true)} data-testid="button-add-instructions">
                      <Pencil className="w-4 h-4 mr-2" />
                      {t('buildingPortal.addInstructions', 'Add Instructions')}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {buildingInstructions.buildingAccess && (
                      <div>
                        <h4 className="font-medium mb-1">{t('buildingPortal.buildingAccess', 'Building Access')}</h4>
                        <p className="text-sm text-muted-foreground">{buildingInstructions.buildingAccess}</p>
                      </div>
                    )}
                    {buildingInstructions.keysAndFob && (
                      <div>
                        <h4 className="font-medium mb-1">{t('buildingPortal.keysAndFob', 'Keys & Fob')}</h4>
                        <p className="text-sm text-muted-foreground">{buildingInstructions.keysAndFob}</p>
                      </div>
                    )}
                    {buildingInstructions.roofAccess && (
                      <div>
                        <h4 className="font-medium mb-1">{t('buildingPortal.roofAccess', 'Roof Access')}</h4>
                        <p className="text-sm text-muted-foreground">{buildingInstructions.roofAccess}</p>
                      </div>
                    )}
                    {buildingInstructions.buildingManagerName && (
                      <div>
                        <h4 className="font-medium mb-1">{t('buildingPortal.buildingManager', 'Building Manager')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {buildingInstructions.buildingManagerName}
                          {buildingInstructions.buildingManagerPhone && ` - ${buildingInstructions.buildingManagerPhone}`}
                        </p>
                      </div>
                    )}
                    {buildingInstructions.conciergeNames && (
                      <div>
                        <h4 className="font-medium mb-1">{t('buildingPortal.concierge', 'Concierge')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {buildingInstructions.conciergeNames}
                          {buildingInstructions.conciergePhone && ` - ${buildingInstructions.conciergePhone}`}
                        </p>
                      </div>
                    )}
                    {buildingInstructions.specialRequests && (
                      <div className="md:col-span-2">
                        <h4 className="font-medium mb-1">{t('buildingPortal.specialRequests', 'Special Requests')}</h4>
                        <p className="text-sm text-muted-foreground">{buildingInstructions.specialRequests}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <Card data-testid="card-settings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t('buildingPortal.settingsTitle', 'Settings')}
                </CardTitle>
                <CardDescription>
                  {t('buildingPortal.settingsDesc', 'Manage your building portal account')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password Section */}
                <div className="p-4 border rounded-lg">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">{t('buildingPortal.password', 'Password')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {showPasswordWarning 
                            ? t('buildingPortal.passwordNotChanged', 'Using default password - please change for security')
                            : t('buildingPortal.passwordChanged', 'Last changed: ') + (portalData.building.passwordChangedAt ? formatLocalDate(portalData.building.passwordChangedAt) : '')
                          }
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={showPasswordWarning ? "default" : "outline"}
                      onClick={() => setShowChangePasswordDialog(true)}
                      data-testid="button-change-password"
                    >
                      <KeyRound className="w-4 h-4 mr-2" />
                      {t('buildingPortal.changePassword', 'Change Password')}
                    </Button>
                  </div>
                </div>

                {/* Account Info */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">{t('buildingPortal.accountInfo', 'Account Information')}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('buildingPortal.strataNumber', 'Strata Number')}: {portalData.building.strataPlanNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('buildingPortal.accountCreated', 'Account Created')}: {formatLocalDate(portalData.building.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Instructions Dialog */}
      <Dialog open={showInstructionsDialog} onOpenChange={setShowInstructionsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('buildingPortal.editInstructionsTitle', 'Edit Building Instructions')}</DialogTitle>
            <DialogDescription>
              {t('buildingPortal.editInstructionsDesc', 'This information will be shared with service providers working at your building.')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveInstructionsMutation.mutate(instructionsForm); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('buildingPortal.buildingAccess', 'Building Access')}</Label>
                <Textarea
                  value={instructionsForm.buildingAccess}
                  onChange={(e) => setInstructionsForm({ ...instructionsForm, buildingAccess: e.target.value })}
                  placeholder={t('buildingPortal.buildingAccessPlaceholder', 'How to access the building...')}
                  data-testid="input-building-access"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('buildingPortal.keysAndFob', 'Keys & Fob')}</Label>
                <Textarea
                  value={instructionsForm.keysAndFob}
                  onChange={(e) => setInstructionsForm({ ...instructionsForm, keysAndFob: e.target.value })}
                  placeholder={t('buildingPortal.keysPlaceholder', 'Key pickup location...')}
                  data-testid="input-keys-fob"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('buildingPortal.roofAccess', 'Roof Access')}</Label>
                <Textarea
                  value={instructionsForm.roofAccess}
                  onChange={(e) => setInstructionsForm({ ...instructionsForm, roofAccess: e.target.value })}
                  placeholder={t('buildingPortal.roofAccessPlaceholder', 'Roof access instructions...')}
                  data-testid="input-roof-access"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('buildingPortal.specialRequests', 'Special Requests')}</Label>
                <Textarea
                  value={instructionsForm.specialRequests}
                  onChange={(e) => setInstructionsForm({ ...instructionsForm, specialRequests: e.target.value })}
                  placeholder={t('buildingPortal.specialRequestsPlaceholder', 'Any special requirements...')}
                  data-testid="input-special-requests"
                />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('buildingPortal.buildingManagerName', 'Building Manager Name')}</Label>
                <Input
                  value={instructionsForm.buildingManagerName}
                  onChange={(e) => setInstructionsForm({ ...instructionsForm, buildingManagerName: e.target.value })}
                  placeholder={t('buildingPortal.namePlaceholder', 'Name')}
                  data-testid="input-manager-name"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('buildingPortal.buildingManagerPhone', 'Building Manager Phone')}</Label>
                <Input
                  value={instructionsForm.buildingManagerPhone}
                  onChange={(e) => setInstructionsForm({ ...instructionsForm, buildingManagerPhone: e.target.value })}
                  placeholder={t('buildingPortal.phonePlaceholder', 'Phone number')}
                  data-testid="input-manager-phone"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('buildingPortal.conciergeNames', 'Concierge Names')}</Label>
                <Input
                  value={instructionsForm.conciergeNames}
                  onChange={(e) => setInstructionsForm({ ...instructionsForm, conciergeNames: e.target.value })}
                  placeholder={t('buildingPortal.conciergeNamesPlaceholder', 'Concierge staff names')}
                  data-testid="input-concierge-names"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('buildingPortal.conciergePhone', 'Concierge Phone')}</Label>
                <Input
                  value={instructionsForm.conciergePhone}
                  onChange={(e) => setInstructionsForm({ ...instructionsForm, conciergePhone: e.target.value })}
                  placeholder={t('buildingPortal.phonePlaceholder', 'Phone number')}
                  data-testid="input-concierge-phone"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowInstructionsDialog(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" disabled={saveInstructionsMutation.isPending} data-testid="button-save-instructions">
                {saveInstructionsMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('common.saving', 'Saving...')}</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" />{t('common.save', 'Save')}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('buildingPortal.changePasswordTitle', 'Change Password')}</DialogTitle>
            <DialogDescription>
              {t('buildingPortal.changePasswordDesc', 'Enter your current password and choose a new one.')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('buildingPortal.currentPassword', 'Current Password')}</Label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder={t('buildingPortal.currentPasswordPlaceholder', 'Enter current password')}
                data-testid="input-current-password"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('buildingPortal.newPassword', 'New Password')}</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder={t('buildingPortal.newPasswordPlaceholder', 'Enter new password')}
                data-testid="input-new-password"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('buildingPortal.confirmPassword', 'Confirm New Password')}</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder={t('buildingPortal.confirmPasswordPlaceholder', 'Confirm new password')}
                data-testid="input-confirm-password"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowChangePasswordDialog(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" disabled={changePasswordMutation.isPending} data-testid="button-submit-password">
                {changePasswordMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('common.saving', 'Saving...')}</>
                ) : (
                  <><Lock className="w-4 h-4 mr-2" />{t('buildingPortal.updatePassword', 'Update Password')}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Project Progress Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {selectedProject && (selectedProject.customJobType || 
                (selectedProject.jobType === 'window_cleaning' ? 'Window Cleaning' :
                 selectedProject.jobType === 'facade_inspection' ? 'Facade Inspection' :
                 selectedProject.jobType === 'painting' ? 'Painting' :
                 selectedProject.jobType === 'caulking' ? 'Caulking' :
                 selectedProject.jobType === 'power_washing' ? 'Power Washing' :
                 selectedProject.jobType === 'balcony_repairs' ? 'Balcony Repairs' :
                 selectedProject.jobType === 'glass_replacement' ? 'Glass Replacement' :
                 selectedProject.jobType === 'lighting' ? 'Lighting' :
                 selectedProject.jobType === 'signage' ? 'Signage' :
                 selectedProject.jobType === 'other' ? 'Other' :
                 selectedProject.jobType)
              )}
            </DialogTitle>
            <DialogDescription>
              {t('buildingPortal.projectProgressDesc', 'Building elevation progress by direction')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && selectedProject.progressType === 'drops' && (
            <div className="py-6">
              <HighRiseBuilding
                floors={25}
                totalDropsNorth={selectedProject.totalDropsNorth || 0}
                totalDropsEast={selectedProject.totalDropsEast || 0}
                totalDropsSouth={selectedProject.totalDropsSouth || 0}
                totalDropsWest={selectedProject.totalDropsWest || 0}
                completedDropsNorth={selectedProject.completedDropsNorth || 0}
                completedDropsEast={selectedProject.completedDropsEast || 0}
                completedDropsSouth={selectedProject.completedDropsSouth || 0}
                completedDropsWest={selectedProject.completedDropsWest || 0}
              />
            </div>
          )}
          
          {selectedProject && selectedProject.progressType !== 'drops' && (
            <div className="py-6 text-center">
              <div className="space-y-4">
                <div className="text-lg font-semibold">
                  {selectedProject.progressType === 'suites' && t('buildingPortal.suitesProgress', 'Suites Progress')}
                  {selectedProject.progressType === 'stalls' && t('buildingPortal.stallsProgress', 'Stalls Progress')}
                  {selectedProject.progressType === 'hours' && t('buildingPortal.hoursProgress', 'Hours Progress')}
                </div>
                <div className="flex flex-col items-center gap-4">
                  {selectedProject.progressType === 'suites' && (
                    <>
                      <div className="text-4xl font-bold text-primary">
                        {selectedProject.completedSuites || 0} / {selectedProject.totalSuites || 0}
                      </div>
                      <Progress 
                        value={selectedProject.totalSuites ? ((selectedProject.completedSuites || 0) / selectedProject.totalSuites) * 100 : 0} 
                        className="h-4 w-64"
                      />
                    </>
                  )}
                  {selectedProject.progressType === 'stalls' && (
                    <>
                      <div className="text-4xl font-bold text-primary">
                        {selectedProject.completedStalls || 0} / {selectedProject.totalStalls || 0}
                      </div>
                      <Progress 
                        value={selectedProject.totalStalls ? ((selectedProject.completedStalls || 0) / selectedProject.totalStalls) * 100 : 0} 
                        className="h-4 w-64"
                      />
                    </>
                  )}
                  {selectedProject.progressType === 'hours' && (
                    <>
                      <div className="text-4xl font-bold text-primary">
                        {selectedProject.loggedHours || 0} / {selectedProject.estimatedHours || 0} {t('common.hours', 'hours')}
                      </div>
                      <Progress 
                        value={selectedProject.estimatedHours ? ((selectedProject.loggedHours || 0) / selectedProject.estimatedHours) * 100 : 0} 
                        className="h-4 w-64"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {selectedProject && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{selectedProject.companyName}</span>
              </div>
              {selectedProject.companyPhone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{selectedProject.companyPhone}</span>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProject(null)}>
              {t('common.close', 'Close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
