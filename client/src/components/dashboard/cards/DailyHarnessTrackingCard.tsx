import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ChevronRight, AlertTriangle } from "lucide-react";
import { canViewSafetyDocuments } from "@/lib/permissions";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import type { CardProps } from "../cardRegistry";

interface WorkSession {
  id: number;
  userId: number;
  startTime: string;
  endTime?: string;
}

interface HarnessInspection {
  id: number;
  inspectorId: number;
  inspectionDate: string;
  overallStatus: string;
}

export function DailyHarnessTrackingCard({ currentUser, onRouteNavigate, branding }: CardProps) {
  const { t } = useLanguage();
  const hasAccess = canViewSafetyDocuments(currentUser) || currentUser?.role === "company";
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data: sessionsData } = useQuery<WorkSession[]>({
    queryKey: ["/api/work-sessions/all"],
    enabled: hasAccess,
  });

  const { data: inspectionsData } = useQuery<HarnessInspection[]>({
    queryKey: ["/api/harness-inspections"],
    enabled: hasAccess,
  });

  if (!hasAccess) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.dailyHarnessTracking.title", "Daily Harness Tracking")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0 flex items-center justify-center">
          <p className="text-base text-muted-foreground">{t("common.noAccess", "No access")}</p>
        </CardContent>
      </div>
    );
  }

  const sessions = sessionsData || [];
  const inspections = inspectionsData || [];

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentSessions = sessions.filter((s) => new Date(s.startTime) >= sevenDaysAgo);
  const recentInspections = inspections.filter((i) => new Date(i.inspectionDate) >= sevenDaysAgo);

  const workDates = new Set<string>();
  recentSessions.forEach((s) => {
    const date = new Date(s.startTime).toDateString();
    workDates.add(date);
  });

  const inspectedDates = new Set<string>();
  recentInspections.forEach((i) => {
    const date = new Date(i.inspectionDate).toDateString();
    inspectedDates.add(date);
  });

  const totalWorkDays = workDates.size;
  let compliantDays = 0;
  workDates.forEach((date) => {
    if (inspectedDates.has(date)) {
      compliantDays++;
    }
  });

  const complianceRate = totalWorkDays > 0 ? Math.round((compliantDays / totalWorkDays) * 100) : 100;

  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return "text-emerald-600 dark:text-emerald-400";
    if (rate >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getComplianceBadge = (rate: number) => {
    if (rate >= 90) return { variant: "default" as const, label: t("common.excellent", "Excellent") };
    if (rate >= 50) return { variant: "secondary" as const, label: t("common.needsImprovement", "Needs Improvement") };
    return { variant: "destructive" as const, label: t("common.critical", "Critical") };
  };

  const badge = getComplianceBadge(complianceRate);

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.dailyHarnessTracking.title", "Daily Harness Tracking")}
          </CardTitle>
          {complianceRate < 90 && (
            <Badge variant={badge.variant} className="text-xs" data-testid="badge-harness-compliance">
              {badge.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        <div className="space-y-3">
          <div className="text-center py-2">
            <div className={`text-4xl font-bold ${getComplianceColor(complianceRate)}`} data-testid="text-compliance-rate">
              {complianceRate}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {t("dashboardCards.dailyHarnessTracking.complianceLast7Days", "Inspection compliance (last 7 days)")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-muted/30 rounded-lg p-2">
              <div className="text-lg font-semibold">{compliantDays}</div>
              <div className="text-xs text-muted-foreground">{t("dashboardCards.dailyHarnessTracking.compliantDays", "Compliant Days")}</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-2">
              <div className="text-lg font-semibold">{totalWorkDays}</div>
              <div className="text-xs text-muted-foreground">{t("dashboardCards.dailyHarnessTracking.workDays", "Work Days")}</div>
            </div>
          </div>

          {complianceRate < 100 && totalWorkDays > 0 && (
            <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                {totalWorkDays - compliantDays} {t("dashboardCards.dailyHarnessTracking.missedInspections", "work day(s) missing inspections")}
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => onRouteNavigate("/inventory?tab=daily-harness")}
            data-testid="button-view-daily-harness"
          >
            {t("dashboardCards.dailyHarnessTracking.viewDetails", "View Details")}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </div>
  );
}
