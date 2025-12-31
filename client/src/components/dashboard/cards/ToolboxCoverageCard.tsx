import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { canViewSafetyDocuments } from "@/lib/permissions";
import { useLanguage } from "@/hooks/use-language";
import type { CardProps } from "../cardRegistry";

interface ToolboxData {
  lastMeetingDate: string | null;
  daysSinceMeeting: number;
  totalMeetingsThisMonth: number;
}

export function ToolboxCoverageCard({ currentUser, onRouteNavigate, branding }: CardProps) {
  const { t } = useLanguage();
  const hasAccess = canViewSafetyDocuments(currentUser) || currentUser?.role === "company";
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data: toolboxData, isLoading } = useQuery<ToolboxData>({
    queryKey: ["/api/toolbox-coverage"],
    enabled: hasAccess,
  });

  if (!hasAccess) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ClipboardList className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.toolboxCoverage.title", "Toolbox Coverage")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0 flex items-center justify-center">
          <p className="text-base text-muted-foreground">{t("common.noAccess", "No access")}</p>
        </CardContent>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ClipboardList className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.toolboxCoverage.title", "Toolbox Coverage")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse h-20 bg-muted rounded" />
        </CardContent>
      </div>
    );
  }

  const daysSince = toolboxData?.daysSinceMeeting || 999;
  const needsMeeting = daysSince > 7;

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ClipboardList className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.toolboxCoverage.title", "Toolbox Coverage")}
          </CardTitle>
          {needsMeeting && (
            <Badge variant="destructive" className="text-xs" data-testid="badge-toolbox-alert">
              {t("common.overdueLabel", "Overdue")}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        <div className="space-y-3">
          {needsMeeting ? (
            <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <p className="text-base font-medium text-amber-700 dark:text-amber-400">
                  {t("dashboardCards.toolboxCoverage.required", "Meeting Required")}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {daysSince === 999 
                  ? t("dashboardCards.toolboxCoverage.noRecords", "No meetings on record") 
                  : t("dashboardCards.toolboxCoverage.daysSince", "{{count}} days since last meeting").replace("{{count}}", daysSince.toString())
                }
              </p>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-base font-medium text-green-700 dark:text-green-400">
                  {t("common.upToDate", "Up to Date")}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t("dashboardCards.toolboxCoverage.lastMeeting", "Last meeting {{count}} day(s) ago").replace("{{count}}", daysSince.toString())}
              </p>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            {toolboxData?.totalMeetingsThisMonth || 0} {t("dashboardCards.toolboxCoverage.meetingsThisMonth", "meetings this month")}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => onRouteNavigate("/safety")}
            data-testid="button-view-toolbox-meetings"
          >
            {t("dashboardCards.toolboxCoverage.viewMeetings", "View Meetings")}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </div>
  );
}
