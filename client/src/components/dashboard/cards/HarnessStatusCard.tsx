import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ChevronRight, CheckCircle } from "lucide-react";
import { canViewSafetyDocuments } from "@/lib/permissions";
import { useLanguage } from "@/hooks/use-language";
import type { CardProps } from "../cardRegistry";

export function HarnessStatusCard({ currentUser, harnessInspections, onRouteNavigate, branding }: CardProps) {
  const { t } = useLanguage();
  const hasAccess = canViewSafetyDocuments(currentUser) || currentUser?.role === "company";
  const accentColor = branding?.primaryColor || "#0B64A3";

  if (!hasAccess) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.harnessStatus.title", "Harness Status")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0 flex items-center justify-center">
          <p className="text-base text-muted-foreground">{t("common.noAccess", "No access")}</p>
        </CardContent>
      </div>
    );
  }

  const now = new Date();
  const overdue = harnessInspections?.filter((i: any) => {
    if (!i.nextInspectionDate) return false;
    return new Date(i.nextInspectionDate) < now;
  }) || [];

  const dueToday = harnessInspections?.filter((i: any) => {
    if (!i.nextInspectionDate) return false;
    const dueDate = new Date(i.nextInspectionDate);
    return dueDate.toDateString() === now.toDateString();
  }) || [];

  const dueSoon = harnessInspections?.filter((i: any) => {
    if (!i.nextInspectionDate) return false;
    const dueDate = new Date(i.nextInspectionDate);
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate > now && dueDate <= sevenDays;
  }) || [];

  const totalAlerts = overdue.length + dueToday.length;

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.harnessStatus.title", "Harness Status")}
          </CardTitle>
          {totalAlerts > 0 && (
            <Badge variant="destructive" className="text-xs" data-testid="badge-harness-alert-count">
              {totalAlerts} {t("common.needAttention", "need attention")}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        {totalAlerts === 0 && dueSoon.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <CheckCircle className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="text-base text-muted-foreground">{t("dashboardCards.harnessStatus.allInspected", "All harnesses inspected")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {overdue.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                <p className="text-base font-medium text-red-700 dark:text-red-400">
                  {overdue.length} {t("common.overdueLabel", "Overdue")}
                </p>
                <p className="text-sm text-muted-foreground">{t("dashboardCards.harnessStatus.pastInspection", "Past inspection date")}</p>
              </div>
            )}
            {dueToday.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                <p className="text-base font-medium text-amber-700 dark:text-amber-400">
                  {dueToday.length} {t("common.dueToday", "Due Today")}
                </p>
                <p className="text-sm text-muted-foreground">{t("common.inspectionRequired", "Inspection required")}</p>
              </div>
            )}
            {dueSoon.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                <p className="text-base font-medium text-blue-700 dark:text-blue-400">
                  {dueSoon.length} {t("common.dueThisWeek", "Due This Week")}
                </p>
                <p className="text-sm text-muted-foreground">{t("common.scheduleInspection", "Schedule inspection")}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => onRouteNavigate("/inventory")}
              data-testid="button-view-harness-inspections"
            >
              {t("dashboardCards.harnessStatus.viewInspections", "View Inspections")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </div>
  );
}
