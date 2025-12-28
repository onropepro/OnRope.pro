import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useSetHeaderConfig } from "@/components/DashboardLayout";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { parseLocalDate } from "@/lib/dateUtils";
import { IRATA_TASK_TYPES, type IrataTaskLog } from "@shared/schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Pencil } from "lucide-react";
import i18n from "@/i18n";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

// Helper to get date locale based on current language
const getDateLocale = () => i18n.language?.startsWith('fr') ? fr : enUS;

const getTaskLabel = (taskId: string, t: (key: string, fallback: string) => string): string => {
  const task = IRATA_TASK_TYPES.find(t => t.id === taskId);
  return t(`loggedHours.irataTaskTypes.${taskId}`, task?.label || taskId);
};

const getTaskIcon = (taskId: string): string => {
  const icons: Record<string, string> = {
    rope_transfer: "swap_horiz",
    re_anchor: "anchor",
    ascending: "arrow_upward",
    descending: "arrow_downward",
    rigging: "settings",
    deviation: "turn_slight_right",
    aid_climbing: "terrain",
    edge_transition: "open_in_new",
    knot_passing: "link",
    rope_to_rope_transfer: "compare_arrows",
    mid_rope_changeover: "sync_alt",
    rescue_technique: "health_and_safety",
    hauling: "publish",
    lowering: "download",
    tensioned_rope: "linear_scale",
    horizontal_traverse: "swap_horiz",
    window_cleaning: "cleaning_services",
    building_inspection: "search",
    maintenance_work: "build",
    other: "more_horiz",
  };
  return icons[taskId] || "assignment";
};

export default function MyLoggedHours() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showBaselineDialog, setShowBaselineDialog] = useState(false);
  const [baselineInput, setBaselineInput] = useState("");
  
  // Certification baseline state
  const [showCertBaselineDialog, setShowCertBaselineDialog] = useState(false);
  const [certBaselineHours, setCertBaselineHours] = useState("");
  const [certBaselineDate, setCertBaselineDate] = useState("");
  
  // Rope Access Experience state
  const [showExperienceDialog, setShowExperienceDialog] = useState(false);
  const [experienceStartDate, setExperienceStartDate] = useState("");

  const { data: userData, refetch: refetchUser } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: logsData, isLoading } = useQuery<{ logs: IrataTaskLog[] }>({
    queryKey: ["/api/my-irata-task-logs"],
  });

  const currentUser = userData?.user;
  const logs = logsData?.logs || [];

  const baselineHours = parseFloat(currentUser?.irataBaselineHours || "0");
  
  const loggedHours = logs.reduce((sum: number, log: IrataTaskLog) => {
    return sum + parseFloat(log.hoursWorked || "0");
  }, 0);

  const totalHours = baselineHours + loggedHours;

  const updateBaselineHoursMutation = useMutation({
    mutationFn: async (hours: number) => {
      return apiRequest("PATCH", "/api/my-irata-baseline-hours", { baselineHours: hours });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      refetchUser();
      setShowBaselineDialog(false);
      toast({ title: t('loggedHours.success', 'Success'), description: t('loggedHours.baselineUpdated', 'Baseline hours updated successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('loggedHours.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const handleSaveBaselineHours = () => {
    const hours = parseFloat(baselineInput);
    if (isNaN(hours) || hours < 0) {
      toast({ title: t('loggedHours.invalidInput', 'Invalid input'), description: t('loggedHours.enterValidHours', 'Please enter a valid number of hours'), variant: "destructive" });
      return;
    }
    updateBaselineHoursMutation.mutate(hours);
  };

  const openBaselineDialog = () => {
    setBaselineInput(baselineHours.toString());
    setShowBaselineDialog(true);
  };

  // Certification baseline mutation
  const updateCertBaselineMutation = useMutation({
    mutationFn: async ({ hours, date }: { hours: string; date: string }) => {
      return apiRequest("PATCH", "/api/technician/profile", { 
        name: currentUser?.name,
        email: currentUser?.email,
        employeePhoneNumber: currentUser?.employeePhoneNumber || "",
        emergencyContactName: currentUser?.emergencyContactName || "",
        emergencyContactPhone: currentUser?.emergencyContactPhone || "",
        irataHoursAtLastUpgrade: hours,
        irataLastUpgradeDate: date,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      refetchUser();
      setShowCertBaselineDialog(false);
      toast({ title: t('loggedHours.success', 'Success'), description: t('loggedHours.certBaselineUpdated', 'Certification baseline updated successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('loggedHours.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const openCertBaselineDialog = () => {
    setCertBaselineHours(currentUser?.irataHoursAtLastUpgrade || "");
    setCertBaselineDate(currentUser?.irataLastUpgradeDate || "");
    setShowCertBaselineDialog(true);
  };

  const handleSaveCertBaseline = () => {
    if (!certBaselineHours || !certBaselineDate) {
      toast({ title: t('loggedHours.invalidInput', 'Invalid input'), description: t('loggedHours.enterBothFields', 'Please enter both hours and date'), variant: "destructive" });
      return;
    }
    updateCertBaselineMutation.mutate({ hours: certBaselineHours, date: certBaselineDate });
  };

  // Rope Access Experience mutation
  const updateExperienceMutation = useMutation({
    mutationFn: async (startDate: string) => {
      return apiRequest("PATCH", "/api/technician/profile", { 
        name: currentUser?.name,
        email: currentUser?.email,
        employeePhoneNumber: currentUser?.employeePhoneNumber || "",
        emergencyContactName: currentUser?.emergencyContactName || "",
        emergencyContactPhone: currentUser?.emergencyContactPhone || "",
        ropeAccessStartDate: startDate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      refetchUser();
      setShowExperienceDialog(false);
      toast({ title: t('loggedHours.success', 'Success'), description: t('loggedHours.experienceUpdated', 'Experience start date updated successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('loggedHours.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const openExperienceDialog = () => {
    setExperienceStartDate(currentUser?.ropeAccessStartDate || "");
    setShowExperienceDialog(true);
  };

  const handleSaveExperience = () => {
    if (!experienceStartDate) {
      toast({ title: t('loggedHours.invalidInput', 'Invalid input'), description: t('loggedHours.enterStartDate', 'Please enter a start date'), variant: "destructive" });
      return;
    }
    updateExperienceMutation.mutate(experienceStartDate);
  };

  // Calculate experience duration
  const calculateExperience = () => {
    if (!currentUser?.ropeAccessStartDate) return null;
    const startDate = parseLocalDate(currentUser.ropeAccessStartDate);
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    if (months < 0 || (months === 0 && now.getDate() < startDate.getDate())) {
      years--;
      months += 12;
    }
    if (now.getDate() < startDate.getDate()) {
      months--;
      if (months < 0) months += 12;
    }
    return { years, months };
  };

  const experienceDuration = calculateExperience();

  // Calculate upgrade progress
  const calculateUpgradeProgress = () => {
    const irataLevel = parseInt(currentUser?.irataLevel || "0");
    if (!irataLevel || irataLevel >= 3) {
      return { isMaxLevel: irataLevel >= 3, noLevel: !irataLevel };
    }

    // Requirements: Level 1->2: 1000 hours + 12 months, Level 2->3: 1000 hours + 12 months
    const requiredHours = 1000;
    const requiredMonths = 12;

    const hoursAtLastUpgrade = parseFloat(currentUser?.irataHoursAtLastUpgrade || "0");
    const lastUpgradeDate = currentUser?.irataLastUpgradeDate;

    // Hours since last upgrade
    const hoursSinceUpgrade = hoursAtLastUpgrade > 0 
      ? totalHours - hoursAtLastUpgrade 
      : totalHours;

    // Months since last upgrade
    let monthsSinceUpgrade = 0;
    if (lastUpgradeDate) {
      const upgradeDate = new Date(lastUpgradeDate);
      const now = new Date();
      monthsSinceUpgrade = (now.getFullYear() - upgradeDate.getFullYear()) * 12 + (now.getMonth() - upgradeDate.getMonth());
    }

    const hoursProgress = Math.min(100, (hoursSinceUpgrade / requiredHours) * 100);
    const timeProgress = Math.min(100, (monthsSinceUpgrade / requiredMonths) * 100);
    const hoursRemaining = Math.max(0, requiredHours - hoursSinceUpgrade);
    const monthsRemaining = Math.max(0, requiredMonths - monthsSinceUpgrade);
    const eligible = hoursSinceUpgrade >= requiredHours && monthsSinceUpgrade >= requiredMonths;

    return {
      isMaxLevel: false,
      noLevel: false,
      nextLevel: irataLevel + 1,
      hoursSinceUpgrade,
      hoursProgress,
      hoursRemaining,
      monthsSinceUpgrade,
      timeProgress,
      monthsRemaining,
      eligible,
      hasBaseline: hoursAtLastUpgrade > 0 || !!lastUpgradeDate,
    };
  };

  const upgradeProgress = calculateUpgradeProgress();

  const totalSessions = logs.length;

  const taskCounts: Record<string, number> = {};
  logs.forEach((log: IrataTaskLog) => {
    (log.tasksPerformed || []).forEach((taskId: string) => {
      taskCounts[taskId] = (taskCounts[taskId] || 0) + 1;
    });
  });

  const sortedTasks = Object.entries(taskCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Group logs by project (building name)
  const groupedByProject: Record<string, { 
    buildingName: string; 
    buildingAddress: string; 
    logs: IrataTaskLog[];
    totalHours: number;
  }> = {};
  
  logs.forEach((log: IrataTaskLog) => {
    const unknownProjectLabel = t('loggedHours.unknownProject', 'Unknown Project');
    const projectKey = log.buildingName || unknownProjectLabel;
    if (!groupedByProject[projectKey]) {
      groupedByProject[projectKey] = {
        buildingName: log.buildingName || unknownProjectLabel,
        buildingAddress: log.buildingAddress || "",
        logs: [],
        totalHours: 0,
      };
    }
    groupedByProject[projectKey].logs.push(log);
    groupedByProject[projectKey].totalHours += parseFloat(log.hoursWorked || "0");
  });

  // Sort logs within each project by date (newest first)
  Object.values(groupedByProject).forEach((project) => {
    project.logs.sort((a, b) => {
      const dateA = parseLocalDate(a.workDate);
      const dateB = parseLocalDate(b.workDate);
      return dateB.getTime() - dateA.getTime();
    });
  });

  // Sort projects by total hours (most hours first)
  const sortedProjects = Object.entries(groupedByProject)
    .sort(([, a], [, b]) => b.totalHours - a.totalHours);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">{t('loggedHours.loading', 'Loading your logged hours...')}</div>
        </div>
      </div>
    );
  }

  // Configure unified header with back button and user info
  const handleBackClick = useCallback(() => {
    setLocation('/dashboard');
  }, [setLocation]);

  const userInfoBadges = useMemo(() => (
    <div className="flex flex-col items-start sm:items-end gap-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="material-icons text-sm text-muted-foreground hidden sm:inline">person</span>
        <span className="font-semibold text-sm sm:text-base truncate max-w-[150px] sm:max-w-none" data-testid="text-employee-name">{currentUser?.name}</span>
        {currentUser?.irataLevel && (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <span className="material-icons text-xs">verified</span>
            {t('loggedHours.level', 'Level')} {currentUser.irataLevel}
          </Badge>
        )}
      </div>
      {currentUser?.irataLicenseNumber && (
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
          <span className="material-icons text-xs">badge</span>
          <span>{t('loggedHours.license', 'License')}:</span>
          <span className="font-medium text-foreground" data-testid="text-irata-license">{currentUser.irataLicenseNumber}</span>
        </div>
      )}
    </div>
  ), [currentUser?.name, currentUser?.irataLevel, currentUser?.irataLicenseNumber, t]);

  useSetHeaderConfig({
    pageTitle: t('loggedHours.title', 'My Logged Hours'),
    pageDescription: t('loggedHours.subtitle', 'IRATA Logbook'),
    onBackClick: handleBackClick,
    actionButtons: userInfoBadges,
    showSearch: false,
  }, [t, handleBackClick, userInfoBadges]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="material-icons text-lg text-primary">schedule</span>
                {t('loggedHours.totalLogbookHours', 'Total Logbook Hours')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalHours.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span>{t('loggedHours.priorLogbookHoursLabel', 'Prior logbook hours')}:</span>
                  <span className="font-medium">{baselineHours.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('loggedHours.hoursFromSystem', 'Hours from this system')}:</span>
                  <span className="font-medium">{loggedHours.toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="material-icons text-lg">book</span>
                {t('loggedHours.priorLogbookHours', 'Prior Logbook Hours')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{baselineHours.toFixed(1)}</div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
                onClick={openBaselineDialog}
                data-testid="button-set-baseline-hours"
              >
                <span className="material-icons text-sm mr-1">edit</span>
                {baselineHours > 0 ? t('loggedHours.updateHours', 'Update Hours') : t('loggedHours.setHours', 'Set Hours')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="material-icons text-lg">assignment_turned_in</span>
                {t('loggedHours.workSessions', 'Work Sessions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalSessions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('loggedHours.sessionsLogged', 'Sessions logged in this system')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="material-icons text-lg">trending_up</span>
                {t('loggedHours.topTasks', 'Top Tasks')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedTasks.length > 0 ? (
                <div className="space-y-1">
                  {sortedTasks.slice(0, 3).map(([taskId, count]) => (
                    <div key={taskId} className="flex items-center justify-between gap-2">
                      <span className="text-sm truncate">{getTaskLabel(taskId, t)}</span>
                      <Badge variant="secondary" className="text-xs">{count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t('loggedHours.noTasksYet', 'No tasks logged yet')}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rope Access Experience Card */}
        <Card className="mb-6 border-indigo-500/30 bg-indigo-500/5">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="font-medium text-sm">{t('loggedHours.ropeAccessExperience', 'Rope Access Experience')}</p>
                  {experienceDuration ? (
                    <>
                      <p className="text-sm text-indigo-700 dark:text-indigo-300">
                        {experienceDuration.years > 0 || experienceDuration.months > 0 
                          ? t('loggedHours.yearsMonths', '{years} years, {months} months')
                              .replace('{years}', experienceDuration.years.toString())
                              .replace('{months}', experienceDuration.months.toString())
                          : t('loggedHours.lessThanMonth', 'Less than 1 month')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('loggedHours.startedOn', 'Started on')}: {format(parseLocalDate(currentUser?.ropeAccessStartDate), 'PPP', { locale: getDateLocale() })}
                      </p>
                    </>
                  ) : (
                    <p className="text-base text-muted-foreground italic">{t('loggedHours.addExperience', 'Add your experience start date')}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={openExperienceDialog}
                data-testid="button-edit-experience"
              >
                <Pencil className="w-4 h-4 mr-2" />
                {currentUser?.ropeAccessStartDate ? t('loggedHours.editExperience', 'Edit Experience') : t('loggedHours.setExperience', 'Set Experience')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Level Progress Section */}
        {currentUser?.irataLevel && (
          <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="material-icons text-amber-600">military_tech</span>
                {t('loggedHours.nextLevelProgress', 'Next Level Progress')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upgradeProgress.isMaxLevel ? (
                <div className="text-center py-4">
                  <span className="material-icons text-4xl text-amber-600 mb-2">emoji_events</span>
                  <p className="font-medium">{t('loggedHours.maxLevelReached', 'Congratulations! You have reached IRATA Level 3')}</p>
                  <p className="text-sm text-muted-foreground">{t('loggedHours.highestLevel', 'This is the highest IRATA certification level')}</p>
                </div>
              ) : upgradeProgress.noLevel ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">{t('loggedHours.noLevelSet', 'Set your IRATA level in your profile to track upgrade progress')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {t('loggedHours.level', 'Level')} {currentUser?.irataLevel}
                      </Badge>
                      <span className="material-icons text-muted-foreground">arrow_forward</span>
                      <Badge className="text-lg px-3 py-1 bg-amber-600">
                        {t('loggedHours.level', 'Level')} {upgradeProgress.nextLevel}
                      </Badge>
                    </div>
                    {upgradeProgress.eligible && (
                      <Badge className="bg-green-600">{t('loggedHours.eligible', 'Eligible for Upgrade!')}</Badge>
                    )}
                  </div>

                  {!upgradeProgress.hasBaseline && (
                    <div className="bg-muted/50 rounded-md p-3 border border-dashed">
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('loggedHours.setBaselinePrompt', 'Set your certification baseline to accurately track hours since your last upgrade')}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={openCertBaselineDialog}
                        data-testid="button-set-cert-baseline"
                      >
                        <span className="material-icons text-sm mr-1">edit</span>
                        {t('loggedHours.setCertBaseline', 'Set Certification Baseline')}
                      </Button>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{t('loggedHours.hoursProgress', 'Hours Progress')}</span>
                        <span className="text-sm text-muted-foreground">
                          {upgradeProgress.hoursSinceUpgrade?.toFixed(0) || 0} / 1000 {t('loggedHours.hrs', 'hrs')}
                        </span>
                      </div>
                      <Progress value={upgradeProgress.hoursProgress || 0} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {upgradeProgress.hoursRemaining?.toFixed(0) || 0} {t('loggedHours.hoursRemaining', 'hours remaining')}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{t('loggedHours.timeProgress', 'Time at Level')}</span>
                        <span className="text-sm text-muted-foreground">
                          {upgradeProgress.monthsSinceUpgrade || 0} / 12 {t('loggedHours.months', 'months')}
                        </span>
                      </div>
                      <Progress value={upgradeProgress.timeProgress || 0} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {upgradeProgress.monthsRemaining || 0} {t('loggedHours.monthsRemaining', 'months remaining')}
                      </p>
                    </div>
                  </div>

                  {upgradeProgress.hasBaseline && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={openCertBaselineDialog}
                      className="w-full"
                      data-testid="button-update-cert-baseline"
                    >
                      <span className="material-icons text-sm mr-1">edit</span>
                      {t('loggedHours.updateCertBaseline', 'Update Certification Baseline')}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {sortedTasks.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="material-icons">bar_chart</span>
                {t('loggedHours.taskBreakdown', 'Task Breakdown')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(taskCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([taskId, count]) => (
                    <Badge
                      key={taskId}
                      variant="outline"
                      className="flex items-center gap-1 px-3 py-1.5"
                    >
                      <span className="material-icons text-sm">{getTaskIcon(taskId)}</span>
                      <span>{getTaskLabel(taskId, t)}</span>
                      <span className="ml-1 px-1.5 rounded-full bg-muted text-xs font-semibold">
                        {count}
                      </span>
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="material-icons">history</span>
              {t('loggedHours.sessionHistoryByProject', 'Session History by Project')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-icons text-6xl text-muted-foreground/30">assignment</span>
                <h3 className="text-lg font-medium mt-4">{t('loggedHours.noLoggedHoursYet', 'No logged hours yet')}</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  {t('loggedHours.noLoggedHoursDesc', "When you end a work session, you'll be prompted to log the IRATA tasks you performed. Your logged hours will appear here for your IRATA certification logbook.")}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <Accordion type="multiple" className="w-full" defaultValue={sortedProjects.map(([key]) => key)}>
                  {sortedProjects.map(([projectKey, project]) => {
                    return (
                      <AccordionItem key={projectKey} value={projectKey}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 gap-2">
                            <div className="flex flex-col items-start">
                              <div className="flex items-center gap-2">
                                <span className="material-icons text-sm text-primary">apartment</span>
                                <span className="font-semibold">{project.buildingName}</span>
                              </div>
                              {project.buildingAddress && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1 ml-6">
                                  <span className="material-icons text-xs">location_on</span>
                                  {project.buildingAddress}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary">
                                {project.logs.length} {project.logs.length !== 1 ? t('loggedHours.days', 'days') : t('loggedHours.day', 'day')}
                              </Badge>
                              <Badge variant="default">
                                {project.totalHours.toFixed(1)} {t('loggedHours.hrs', 'hrs')}
                              </Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pl-6">
                            {project.logs.map((log) => (
                              <div
                                key={log.id}
                                className="p-4 rounded-md border bg-card hover-elevate"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="material-icons text-sm text-muted-foreground">event</span>
                                    <span className="font-medium">
                                      {format(parseLocalDate(log.workDate), "EEEE, MMMM d, yyyy", { locale: getDateLocale() })}
                                    </span>
                                  </div>
                                  <Badge>{parseFloat(log.hoursWorked || "0").toFixed(1)} {t('loggedHours.hrs', 'hrs')}</Badge>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                  {(log.tasksPerformed || []).map((taskId: string) => (
                                    <Badge
                                      key={taskId}
                                      variant="outline"
                                      className="text-xs flex items-center gap-1"
                                    >
                                      <span className="material-icons text-xs">{getTaskIcon(taskId)}</span>
                                      {getTaskLabel(taskId, t)}
                                    </Badge>
                                  ))}
                                </div>

                                {log.notes && (
                                  <div className="mt-3 p-2 bg-muted rounded-md text-sm text-muted-foreground">
                                    <span className="material-icons text-xs mr-1 align-middle">notes</span>
                                    {log.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {currentUser?.irataLevel && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="material-icons">info</span>
                {t('loggedHours.irataCertInfo', 'IRATA Certification Info')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">{t('loggedHours.currentLevel', 'Current Level')}</div>
                  <div className="font-semibold">{currentUser.irataLevel}</div>
                </div>
                {currentUser.irataLicenseNumber && (
                  <div>
                    <div className="text-xs text-muted-foreground">{t('loggedHours.licenseNumber', 'License Number')}</div>
                    <div className="font-semibold">{currentUser.irataLicenseNumber}</div>
                  </div>
                )}
                {currentUser.irataIssuedDate && (
                  <div>
                    <div className="text-xs text-muted-foreground">{t('loggedHours.issuedDate', 'Issued Date')}</div>
                    <div className="font-semibold">
                      {format(parseLocalDate(currentUser.irataIssuedDate), "MMM d, yyyy", { locale: getDateLocale() })}
                    </div>
                  </div>
                )}
                {currentUser.irataExpirationDate && (
                  <div>
                    <div className="text-xs text-muted-foreground">{t('loggedHours.expires', 'Expires')}</div>
                    <div className="font-semibold">
                      {format(parseLocalDate(currentUser.irataExpirationDate), "MMM d, yyyy", { locale: getDateLocale() })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showBaselineDialog} onOpenChange={setShowBaselineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons">book</span>
              {t('loggedHours.setPriorHoursTitle', 'Set Prior Logbook Hours')}
            </DialogTitle>
            <DialogDescription>
              {t('loggedHours.setPriorHoursDesc', 'Enter the total number of hours you have recorded in your IRATA logbook before using this system. This will be added to your hours logged here to show your complete total.')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium block mb-2">
              {t('loggedHours.totalHoursFromLogbook', 'Total hours from your existing logbook')}
            </label>
            <Input
              type="number"
              step="0.5"
              min="0"
              placeholder={t('loggedHours.hoursPlaceholder', 'e.g., 250')}
              value={baselineInput}
              onChange={(e) => setBaselineInput(e.target.value)}
              data-testid="input-baseline-hours"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {t('loggedHours.hoursAccumulatedNote', 'This is the total number of hours you have accumulated before starting to use this system.')}
            </p>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowBaselineDialog(false)}
              data-testid="button-cancel-baseline"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button 
              onClick={handleSaveBaselineHours}
              disabled={updateBaselineHoursMutation.isPending}
              data-testid="button-save-baseline"
            >
              {updateBaselineHoursMutation.isPending ? (
                <>
                  <span className="material-icons animate-spin text-sm mr-1">refresh</span>
                  {t('common.saving', 'Saving...')}
                </>
              ) : (
                <>
                  <span className="material-icons text-sm mr-1">save</span>
                  {t('loggedHours.saveHours', 'Save Hours')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certification Baseline Dialog */}
      <Dialog open={showCertBaselineDialog} onOpenChange={setShowCertBaselineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-amber-600">military_tech</span>
              {t('loggedHours.certBaselineTitle', 'Certification Upgrade Baseline')}
            </DialogTitle>
            <DialogDescription>
              {t('loggedHours.certBaselineDesc', 'Enter your total logbook hours and the date when you achieved your current IRATA level. This helps track your progress toward the next level.')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium block mb-2">
                {t('loggedHours.hoursAtLastUpgrade', 'Total hours at time of last certification/upgrade')}
              </Label>
              <Input
                type="number"
                step="0.5"
                min="0"
                placeholder={t('loggedHours.hoursPlaceholder', 'e.g., 250')}
                value={certBaselineHours}
                onChange={(e) => setCertBaselineHours(e.target.value)}
                data-testid="input-cert-baseline-hours"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('loggedHours.hoursAtUpgradeNote', 'Your total logged hours when you passed your last IRATA assessment')}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium block mb-2">
                {t('loggedHours.dateOfLastUpgrade', 'Date of last certification/upgrade')}
              </Label>
              <Input
                type="date"
                value={certBaselineDate}
                onChange={(e) => setCertBaselineDate(e.target.value)}
                data-testid="input-cert-baseline-date"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('loggedHours.dateOfUpgradeNote', 'The date you achieved your current IRATA level')}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCertBaselineDialog(false)}
              data-testid="button-cancel-cert-baseline"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button 
              onClick={handleSaveCertBaseline}
              disabled={updateCertBaselineMutation.isPending}
              data-testid="button-save-cert-baseline"
            >
              {updateCertBaselineMutation.isPending ? (
                <>
                  <span className="material-icons animate-spin text-sm mr-1">refresh</span>
                  {t('common.saving', 'Saving...')}
                </>
              ) : (
                <>
                  <span className="material-icons text-sm mr-1">save</span>
                  {t('loggedHours.saveBaseline', 'Save Baseline')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rope Access Experience Dialog */}
      <Dialog open={showExperienceDialog} onOpenChange={setShowExperienceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              {t('loggedHours.experienceTitle', 'Rope Access Experience')}
            </DialogTitle>
            <DialogDescription>
              {t('loggedHours.experienceDesc', 'Enter the date when you first started working in rope access. This helps calculate your total experience in the industry.')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label className="text-sm font-medium block mb-2">
              {t('loggedHours.experienceStartDate', 'Experience Start Date')}
            </Label>
            <Input
              type="date"
              value={experienceStartDate}
              onChange={(e) => setExperienceStartDate(e.target.value)}
              data-testid="input-experience-start-date"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {t('loggedHours.experienceStartDateNote', 'The date when you first started working in rope access')}
            </p>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowExperienceDialog(false)}
              data-testid="button-cancel-experience"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button 
              onClick={handleSaveExperience}
              disabled={updateExperienceMutation.isPending}
              data-testid="button-save-experience"
            >
              {updateExperienceMutation.isPending ? (
                <>
                  <span className="material-icons animate-spin text-sm mr-1">refresh</span>
                  {t('common.saving', 'Saving...')}
                </>
              ) : (
                <>
                  <span className="material-icons text-sm mr-1">save</span>
                  {t('loggedHours.saveExperience', 'Save Experience')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
