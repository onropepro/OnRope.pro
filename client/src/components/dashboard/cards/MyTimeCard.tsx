import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play, Square, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import type { CardProps } from "../cardRegistry";

interface MyTimeData {
  isClockedIn: boolean;
  currentSessionStart?: string;
  hoursToday: number;
  projectName?: string;
}

export function MyTimeCard({ currentUser, onRouteNavigate, branding }: CardProps) {
  const { t } = useLanguage();
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data: timeData, isLoading } = useQuery<MyTimeData>({
    queryKey: ["/api/my-time-status"],
    refetchInterval: 30000,
  });

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.myTime.title", "My Time Today")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse h-20 bg-muted rounded" />
        </CardContent>
      </div>
    );
  }

  const isClockedIn = timeData?.isClockedIn || false;

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.myTime.title", "My Time Today")}
          </CardTitle>
          <Badge 
            variant="secondary"
            className={isClockedIn 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-muted text-muted-foreground"
            }
            data-testid="badge-my-time-status"
          >
            {isClockedIn ? (
              <>
                <Play className="w-3 h-3 mr-1 fill-current" />
                {t("common.clockedIn", "Clocked In")}
              </>
            ) : (
              <>
                <Square className="w-3 h-3 mr-1" />
                {t("common.offDuty", "Off Duty")}
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 flex flex-col">
        <div className="flex-1 space-y-3">
          {isClockedIn && timeData?.currentSessionStart && (
            <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
              <p className="text-2xl font-bold text-green-700 dark:text-green-400" data-testid="text-current-session">
                {formatDuration(timeData.currentSessionStart)}
              </p>
              {timeData.projectName && (
                <p className="text-sm text-muted-foreground mt-1">
                  {t("dashboardCards.myTime.workingOn", "Working on")}: {timeData.projectName}
                </p>
              )}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-base text-muted-foreground">{t("dashboardCards.myTime.hoursToday", "Hours today")}:</span>
            <span className="text-base font-medium" data-testid="text-hours-today">
              {(timeData?.hoursToday || 0).toFixed(1)}h
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between mt-auto"
          onClick={() => onRouteNavigate("/time-tracking")}
          data-testid="button-view-my-timesheet"
        >
          {t("dashboardCards.myTime.viewTimesheet", "View My Timesheet")}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </div>
  );
}
