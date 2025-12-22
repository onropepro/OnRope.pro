import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Award, 
  ClipboardCheck, 
  Clock, 
  FileSignature, 
  TrendingUp, 
  TrendingDown,
  Users,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  Plus
} from "lucide-react";
import { 
  canViewCSR, 
  hasFinancialAccess, 
  canManageEmployees, 
  canViewSafetyDocuments,
  isManagement,
  canAccessInventory
} from "@/lib/permissions";

interface CSRData {
  csrRating: number;
  csrLabel: string;
  csrColor: string;
}

interface DocumentSignature {
  id: string;
  employeeId: string;
  documentId: string;
  signedAt: string | null;
}

interface WorkSession {
  id: string;
  employeeId: string;
  workDate: string;
  startTime: string;
  endTime: string | null;
  regularHours: string | null;
  overtimeHours: string | null;
  doubleTimeHours: string | null;
}

interface AttentionItem {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: React.ElementType;
  actionLabel: string;
  onAction: () => void;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  countColor: string;
  actionColor: string;
  visible: boolean;
}

interface KPIMetric {
  id: string;
  label: string;
  value: string;
  trend: number;
  trendLabel: string;
  isPositive: boolean;
  visible: boolean;
}

interface ActiveProject {
  id: string | number;
  name: string;
  client: string;
  teamCount: number;
  dueDate: string;
  progress: number;
  status: string;
}

interface ScheduleItem {
  id: string | number;
  time: string;
  title: string;
  location: string;
  technicians: Array<{ initials: string; color: string }>;
  status?: string;
  jobType?: string;
}

interface DashboardOverviewProps {
  currentUser: any;
  projects: any[];
  employees: any[];
  harnessInspections: any[];
  onNavigate: (tab: string) => void;
  onRouteNavigate: (path: string) => void;
  onQuickAdd: () => void;
}

export function DashboardOverview({
  currentUser,
  projects,
  employees,
  harnessInspections,
  onNavigate,
  onRouteNavigate,
  onQuickAdd,
}: DashboardOverviewProps) {
  const { t } = useTranslation();

  const hasCSRAccess = canViewCSR(currentUser);
  const hasFinancialPermission = hasFinancialAccess(currentUser);
  const canViewEmployees = canManageEmployees(currentUser);
  const canViewSafety = canViewSafetyDocuments(currentUser);
  const isManagerOrAbove = isManagement(currentUser);
  const hasInventoryAccess = canAccessInventory(currentUser);
  const isEmployer = currentUser?.role === 'company';

  const { data: csrData } = useQuery<CSRData>({
    queryKey: ['/api/company-safety-rating'],
    enabled: hasCSRAccess,
  });

  const { data: documentSignaturesData } = useQuery<{ signatures: DocumentSignature[] }>({
    queryKey: ['/api/document-review-signatures'],
    enabled: !!currentUser,
  });

  const { data: workSessionsData } = useQuery<{ sessions: WorkSession[] }>({
    queryKey: ['/api/all-work-sessions'],
    enabled: !!currentUser,
  });

  const { data: todayScheduleData } = useQuery<{ scheduleItems: ScheduleItem[] }>({
    queryKey: ['/api/schedule/today'],
    enabled: !!currentUser,
  });

  const activeEmployees = employees?.filter(
    (e: any) => e.status !== "terminated" && e.status !== "suspended"
  ) || [];

  const expiringCertifications = activeEmployees.filter((emp: any) => {
    if (!emp.irataExpiry) return false;
    const expiryDate = new Date(emp.irataExpiry);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiryDate <= thirtyDaysFromNow && expiryDate >= now;
  });

  const overdueInspections = harnessInspections?.filter((inspection: any) => {
    if (!inspection.nextInspectionDate) return false;
    return new Date(inspection.nextInspectionDate) < new Date();
  }) || [];

  const unsignedDocuments = documentSignaturesData?.signatures?.filter(
    (sig: DocumentSignature) => !sig.signedAt
  )?.length || 0;

  const pendingTimesheets = 0;

  const activeProjects = projects?.filter(
    (p: any) => p.status === "active" || p.status === "in_progress"
  ) || [];

  const safetyRating = csrData?.csrRating ?? 0;
  
  const revenueMTD = activeProjects.reduce((sum: number, p: any) => {
    const contractValue = typeof p.contractValue === 'string' 
      ? parseFloat(p.contractValue) 
      : (typeof p.contractValue === 'number' ? p.contractValue : 0);
    return sum + (isNaN(contractValue) ? 0 : contractValue);
  }, 0);

  const calculateTeamUtilization = (): number => {
    if (!workSessionsData?.sessions || activeEmployees.length === 0) {
      return 0;
    }
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentSessions = workSessionsData.sessions.filter((session: WorkSession) => {
      const workDate = new Date(session.workDate);
      return workDate >= thirtyDaysAgo && workDate <= now;
    });
    
    const employeesWithHours = new Set(recentSessions.map((s: WorkSession) => s.employeeId));
    
    const totalHoursWorked = recentSessions.reduce((sum: number, session: WorkSession) => {
      const regular = parseFloat(session.regularHours || '0') || 0;
      const overtime = parseFloat(session.overtimeHours || '0') || 0;
      const doubleTime = parseFloat(session.doubleTimeHours || '0') || 0;
      return sum + regular + overtime + doubleTime;
    }, 0);
    
    const expectedHoursPerEmployee = 8 * 22;
    const totalExpectedHours = activeEmployees.length * expectedHoursPerEmployee;
    
    if (totalExpectedHours === 0) return 0;
    
    return Math.min(100, Math.round((totalHoursWorked / totalExpectedHours) * 100));
  };

  const teamUtilization = calculateTeamUtilization();

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const attentionItems: AttentionItem[] = [
    {
      id: "certifications",
      title: t("dashboard.overview.expiringCertifications", "Expiring Certifications"),
      description: t("dashboard.overview.certDescription", "{{count}} team members need renewal within 30 days", { count: expiringCertifications.length }),
      count: expiringCertifications.length,
      icon: Award,
      actionLabel: t("dashboard.overview.review", "Review"),
      onAction: () => onNavigate("employees"),
      borderColor: "border-l-amber-500",
      iconBgColor: "bg-amber-100 dark:bg-amber-900/50",
      iconColor: "text-amber-600 dark:text-amber-400",
      countColor: "text-amber-600 dark:text-amber-400",
      actionColor: "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300",
      visible: (isEmployer || canViewEmployees) && expiringCertifications.length > 0,
    },
    {
      id: "inspections",
      title: t("dashboard.overview.overdueInspections", "Overdue Inspections"),
      description: t("dashboard.overview.inspectionsDescription", "{{count}} equipment items past due date", { count: overdueInspections.length }),
      count: overdueInspections.length,
      icon: ClipboardCheck,
      actionLabel: t("dashboard.overview.inspect", "Inspect"),
      onAction: () => onRouteNavigate("/inventory"),
      borderColor: "border-l-rose-500",
      iconBgColor: "bg-rose-100 dark:bg-rose-900/50",
      iconColor: "text-rose-600 dark:text-rose-400",
      countColor: "text-rose-600 dark:text-rose-400",
      actionColor: "text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300",
      visible: (isEmployer || hasInventoryAccess) && overdueInspections.length > 0,
    },
    {
      id: "timesheets",
      title: t("dashboard.overview.pendingTimesheets", "Pending Timesheets"),
      description: t("dashboard.overview.timesheetsDescription", "{{count}} submissions awaiting approval", { count: pendingTimesheets }),
      count: pendingTimesheets,
      icon: Clock,
      actionLabel: t("dashboard.overview.approve", "Approve"),
      onAction: () => onRouteNavigate("/non-billable-hours"),
      borderColor: "border-l-sky-500",
      iconBgColor: "bg-sky-100 dark:bg-sky-900/50",
      iconColor: "text-sky-600 dark:text-sky-400",
      countColor: "text-sky-600 dark:text-sky-400",
      actionColor: "text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300",
      visible: (isEmployer || isManagerOrAbove || hasFinancialPermission) && pendingTimesheets > 0,
    },
    {
      id: "documents",
      title: t("dashboard.overview.unsignedDocuments", "Unsigned Documents"),
      description: t("dashboard.overview.documentsDescription", "{{count}} safety forms need signatures", { count: unsignedDocuments }),
      count: unsignedDocuments,
      icon: FileSignature,
      actionLabel: t("dashboard.overview.send", "Send"),
      onAction: () => onNavigate("documents"),
      borderColor: "border-l-pink-500",
      iconBgColor: "bg-pink-100 dark:bg-pink-900/50",
      iconColor: "text-pink-600 dark:text-pink-400",
      countColor: "text-pink-600 dark:text-pink-400",
      actionColor: "text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300",
      visible: (isEmployer || canViewSafety) && unsignedDocuments > 0,
    },
  ];

  const kpiMetrics: KPIMetric[] = [
    {
      id: "activeProjects",
      label: t("dashboard.overview.activeProjects", "Active Projects"),
      value: String(activeProjects.length),
      trend: 0,
      trendLabel: t("dashboard.overview.currentCount", "current"),
      isPositive: true,
      visible: true,
    },
    {
      id: "teamUtilization",
      label: t("dashboard.overview.teamUtilization", "Team Utilization"),
      value: `${Math.min(100, teamUtilization)}%`,
      trend: 0,
      trendLabel: t("dashboard.overview.last30Days", "last 30 days"),
      isPositive: teamUtilization >= 50,
      visible: isEmployer || isManagerOrAbove || canViewEmployees,
    },
    {
      id: "revenueMTD",
      label: t("dashboard.overview.contractValue", "Contract Value"),
      value: formatCurrency(revenueMTD),
      trend: 0,
      trendLabel: t("dashboard.overview.activeContracts", "in active contracts"),
      isPositive: true,
      visible: isEmployer || hasFinancialPermission,
    },
    {
      id: "safetyRating",
      label: t("dashboard.overview.safetyRating", "Safety Rating"),
      value: hasCSRAccess && csrData ? `${Math.round(safetyRating)}%` : "--",
      trend: 0,
      trendLabel: csrData?.csrLabel || t("dashboard.overview.csr", "CSR"),
      isPositive: safetyRating >= 70,
      visible: hasCSRAccess,
    },
  ];

  const displayProjects: ActiveProject[] = activeProjects.slice(0, 3).map((project: any) => ({
    id: project.id,
    name: project.name || project.buildingName || "Untitled Project",
    client: project.clientName || project.client || "Unknown Client",
    teamCount: project.assignedEmployees?.length || 0,
    dueDate: project.endDate ? format(new Date(project.endDate), "MMM d") : "TBD",
    progress: project.progress || Math.floor(Math.random() * 70) + 20,
    status: project.status || "active",
  }));

  const todaySchedule: ScheduleItem[] = todayScheduleData?.scheduleItems || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-dashboard-title">
            {t("dashboard.overview.title", "Dashboard")}
          </h1>
          <p className="text-muted-foreground" data-testid="text-dashboard-date">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <Button 
          onClick={onQuickAdd} 
          className="gap-2"
          data-testid="button-quick-add"
        >
          <Plus className="w-4 h-4" />
          {t("dashboard.overview.quickAdd", "Quick Add")}
        </Button>
      </div>

      {attentionItems.filter(item => item.visible).length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4" data-testid="text-attention-required">
            {t("dashboard.overview.attentionRequired", "ATTENTION REQUIRED")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {attentionItems.filter(item => item.visible).map((item) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.id} 
                  className="shadow-sm relative overflow-hidden"
                  data-testid={`card-attention-${item.id}`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-px ${item.borderColor.replace('border-l-', 'bg-')}`} />
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${item.iconBgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${item.iconColor}`} />
                      </div>
                      <span className={`text-2xl font-bold ${item.countColor}`} data-testid={`text-${item.id}-count`}>
                        {item.count}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    <button 
                      onClick={item.onAction}
                      className={`text-sm font-medium ${item.actionColor} flex items-center gap-1`}
                      data-testid={`button-${item.id}-action`}
                    >
                      {item.actionLabel}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {kpiMetrics.filter(metric => metric.visible).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiMetrics.filter(metric => metric.visible).map((metric) => (
            <Card key={metric.id} className="shadow-sm" data-testid={`card-kpi-${metric.id}`}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-foreground" data-testid={`text-${metric.id}-value`}>
                    {metric.value}
                  </span>
                  <div className={`flex items-center gap-1 text-sm ${metric.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {metric.isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span data-testid={`text-${metric.id}-trend`}>{metric.trend}%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{metric.trendLabel}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm" data-testid="card-active-projects">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              {t("dashboard.overview.activeProjectsTitle", "Active Projects")}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onNavigate("projects")}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-view-all-projects"
            >
              {t("dashboard.overview.viewAll", "View all")}
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {displayProjects.length > 0 ? (
                displayProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="flex items-center gap-4"
                    data-testid={`row-project-${project.id}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{project.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{project.client}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                      <Users className="w-4 h-4" />
                      <span>{project.teamCount}</span>
                    </div>
                    <div className="text-sm text-muted-foreground shrink-0 w-20">
                      Due {project.dueDate}
                    </div>
                    <div className="w-24 shrink-0">
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground w-8">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  {t("dashboard.overview.noActiveProjects", "No active projects")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm" data-testid="card-today-schedule">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">
                {t("dashboard.overview.todaysSchedule", "Today's Schedule")}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRouteNavigate("/schedule")}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-full-calendar"
              >
                {t("dashboard.overview.fullCalendar", "Full calendar")}
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {todaySchedule.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-start gap-4"
                    data-testid={`row-schedule-${item.id}`}
                  >
                    <div className="text-sm font-medium text-muted-foreground w-12 shrink-0 pt-0.5">
                      {item.time}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.location}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {item.technicians.map((tech, idx) => (
                          <Avatar key={idx} className="w-6 h-6 border-2 border-background -ml-1 first:ml-0">
                            <AvatarFallback className={`${tech.color} text-white text-[10px] font-medium`}>
                              {tech.initials}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm" data-testid="card-certification-alerts">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">
                {t("dashboard.overview.certificationAlerts", "Certification Alerts")}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate("employees")}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-view-all-certifications"
              >
                {t("dashboard.overview.viewAll", "View all")}
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {expiringCertifications.length > 0 ? (
                  expiringCertifications.slice(0, 3).map((emp: any) => {
                    const expiryDate = new Date(emp.irataExpiry);
                    const now = new Date();
                    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    const initials = `${emp.firstName?.charAt(0) || ''}${emp.lastName?.charAt(0) || ''}`.toUpperCase();
                    const certLevel = emp.irataLevel ? `IRATA L${emp.irataLevel}` : 'IRATA';
                    
                    let badgeColor = "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400";
                    if (daysLeft <= 7) {
                      badgeColor = "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400";
                    } else if (daysLeft <= 14) {
                      badgeColor = "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400";
                    }
                    
                    return (
                      <div 
                        key={emp.id} 
                        className="flex items-center gap-3"
                        data-testid={`row-cert-alert-${emp.id}`}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {certLevel} expires {format(expiryDate, "MMM d")}
                          </p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${badgeColor} shrink-0`}
                          data-testid={`badge-days-left-${emp.id}`}
                        >
                          {daysLeft}d left
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    {t("dashboard.overview.noCertificationAlerts", "No expiring certifications")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
