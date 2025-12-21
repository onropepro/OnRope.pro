import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
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
  Plus,
  AlertTriangle
} from "lucide-react";

interface AttentionItem {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: React.ElementType;
  actionLabel: string;
  onAction: () => void;
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
}

interface KPIMetric {
  id: string;
  label: string;
  value: string;
  trend: number;
  trendLabel: string;
  isPositive: boolean;
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
}

interface DashboardOverviewProps {
  currentUser: any;
  projects: any[];
  employees: any[];
  harnessInspections: any[];
  onNavigate: (tab: string) => void;
  onRouteNavigate: (path: string) => void;
  onQuickAdd: () => void;
  isLicenseVerified?: boolean;
  onVerifyLicense?: () => void;
}

export function DashboardOverview({
  currentUser,
  projects,
  employees,
  harnessInspections,
  onNavigate,
  onRouteNavigate,
  onQuickAdd,
  isLicenseVerified = true,
  onVerifyLicense,
}: DashboardOverviewProps) {
  const { t } = useTranslation();

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

  const pendingTimesheets = 8;
  const unsignedDocuments = 4;

  const activeProjects = projects?.filter(
    (p: any) => p.status === "active" || p.status === "in_progress"
  ) || [];

  const attentionItems: AttentionItem[] = [
    {
      id: "certifications",
      title: t("dashboard.overview.expiringCertifications", "Expiring Certifications"),
      description: t("dashboard.overview.certDescription", "{{count}} team members need renewal within 30 days", { count: expiringCertifications.length }),
      count: expiringCertifications.length,
      icon: Award,
      actionLabel: t("dashboard.overview.review", "Review"),
      onAction: () => onNavigate("employees"),
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      iconBgColor: "bg-amber-100 dark:bg-amber-900/50",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      id: "inspections",
      title: t("dashboard.overview.overdueInspections", "Overdue Inspections"),
      description: t("dashboard.overview.inspectionsDescription", "{{count}} equipment items past due date", { count: overdueInspections.length }),
      count: overdueInspections.length,
      icon: ClipboardCheck,
      actionLabel: t("dashboard.overview.inspect", "Inspect"),
      onAction: () => onRouteNavigate("/inventory"),
      bgColor: "bg-rose-50 dark:bg-rose-950/30",
      iconBgColor: "bg-rose-100 dark:bg-rose-900/50",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
    {
      id: "timesheets",
      title: t("dashboard.overview.pendingTimesheets", "Pending Timesheets"),
      description: t("dashboard.overview.timesheetsDescription", "{{count}} submissions awaiting approval", { count: pendingTimesheets }),
      count: pendingTimesheets,
      icon: Clock,
      actionLabel: t("dashboard.overview.approve", "Approve"),
      onAction: () => onRouteNavigate("/non-billable-hours"),
      bgColor: "bg-sky-50 dark:bg-sky-950/30",
      iconBgColor: "bg-sky-100 dark:bg-sky-900/50",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
    {
      id: "documents",
      title: t("dashboard.overview.unsignedDocuments", "Unsigned Documents"),
      description: t("dashboard.overview.documentsDescription", "{{count}} safety forms need signatures", { count: unsignedDocuments }),
      count: unsignedDocuments,
      icon: FileSignature,
      actionLabel: t("dashboard.overview.send", "Send"),
      onAction: () => onNavigate("documents"),
      bgColor: "bg-pink-50 dark:bg-pink-950/30",
      iconBgColor: "bg-pink-100 dark:bg-pink-900/50",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
  ];

  const kpiMetrics: KPIMetric[] = [
    {
      id: "activeProjects",
      label: t("dashboard.overview.activeProjects", "Active Projects"),
      value: String(activeProjects.length),
      trend: 2,
      trendLabel: t("dashboard.overview.fromLastMonth", "from last month"),
      isPositive: true,
    },
    {
      id: "teamUtilization",
      label: t("dashboard.overview.teamUtilization", "Team Utilization"),
      value: "87%",
      trend: 5,
      trendLabel: t("dashboard.overview.fromLastWeek", "from last week"),
      isPositive: true,
    },
    {
      id: "revenueMTD",
      label: t("dashboard.overview.revenueMTD", "Revenue MTD"),
      value: "$124.5K",
      trend: 12,
      trendLabel: t("dashboard.overview.vsTarget", "vs target"),
      isPositive: true,
    },
    {
      id: "safetyRating",
      label: t("dashboard.overview.safetyRating", "Safety Rating"),
      value: "82%",
      trend: 2,
      trendLabel: t("dashboard.overview.fromLastMonth", "from last month"),
      isPositive: false,
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

  const todaySchedule: ScheduleItem[] = [
    {
      id: 1,
      time: "07:00",
      title: "Window cleaning - Floors 20-25",
      location: "Pacific Centre Tower A",
      technicians: [
        { initials: "MC", color: "bg-blue-500" },
        { initials: "SW", color: "bg-green-500" },
      ],
    },
    {
      id: 2,
      time: "08:30",
      title: "Facade inspection - East side",
      location: "Bentall 5 Annual",
      technicians: [
        { initials: "JM", color: "bg-purple-500" },
        { initials: "TK", color: "bg-orange-500" },
        { initials: "AR", color: "bg-teal-500" },
      ],
    },
    {
      id: 3,
      time: "13:00",
      title: "Window cleaning - Floors 26-30",
      location: "Pacific Centre Tower A",
      technicians: [
        { initials: "MC", color: "bg-blue-500" },
        { initials: "SW", color: "bg-green-500" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {!isLicenseVerified && onVerifyLicense && (
        <div 
          className="flex items-center justify-between gap-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
          data-testid="alert-license-verification"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200">
                {t("dashboard.overview.accountReadOnly", "Account in read-only mode")}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {t("dashboard.overview.verifyLicense", "Verify your license to enable editing. Your team cannot log hours until verified.")}
              </p>
            </div>
          </div>
          <Button 
            onClick={onVerifyLicense}
            className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
            data-testid="button-verify-license"
          >
            {t("dashboard.overview.verifyLicenseBtn", "Verify License")}
          </Button>
        </div>
      )}

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

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4" data-testid="text-attention-required">
          {t("dashboard.overview.attentionRequired", "ATTENTION REQUIRED")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {attentionItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.id} 
                className={`${item.bgColor} border-0 shadow-sm`}
                data-testid={`card-attention-${item.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg ${item.iconBgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <span className={`text-2xl font-bold ${item.iconColor}`} data-testid={`text-${item.id}-count`}>
                      {item.count}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <button 
                    onClick={item.onAction}
                    className={`text-sm font-medium ${item.iconColor} flex items-center gap-1 hover:underline`}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((metric) => (
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
      </div>
    </div>
  );
}
