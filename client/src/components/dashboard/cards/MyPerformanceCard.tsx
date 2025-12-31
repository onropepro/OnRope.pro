import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ChevronRight, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import type { CardProps } from "../cardRegistry";

interface PerformanceData {
  completedJobs: number;
  hoursThisMonth: number;
  avgHoursPerJob: number;
}

export function MyPerformanceCard({ currentUser, onRouteNavigate, branding }: CardProps) {
  const { t } = useLanguage();
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data: perfData, isLoading } = useQuery<PerformanceData>({
    queryKey: ["/api/my-performance"],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.myPerformance.title", "My Performance")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse h-20 bg-muted rounded" />
        </CardContent>
      </div>
    );
  }

  const hasData = perfData && (perfData.completedJobs > 0 || perfData.hoursThisMonth > 0);

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: accentColor }} />
          {t("dashboardCards.myPerformance.title", "My Performance")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        {hasData ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">{t("common.jobsThisMonth", "Jobs This Month")}</p>
                <p className="text-xl font-bold" data-testid="text-my-jobs">
                  {perfData!.completedJobs}
                </p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">{t("common.hoursLogged", "Hours Logged")}</p>
                <p className="text-xl font-bold" data-testid="text-my-hours">
                  {perfData!.hoursThisMonth.toFixed(1)}h
                </p>
              </div>
            </div>
            {perfData!.avgHoursPerJob > 0 && (
              <p className="text-sm text-muted-foreground">
                {t("common.avgPerJob", "Avg")} {perfData!.avgHoursPerJob.toFixed(1)}h {t("common.perJob", "per job")}
              </p>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => onRouteNavigate("/timesheets")}
              data-testid="button-view-my-performance"
            >
              {t("common.viewDetails", "View Details")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <BarChart3 className="w-10 h-10 text-muted-foreground/50 mb-2" />
            <p className="text-base text-muted-foreground">{t("common.noActivityThisMonth", "No activity this month")}</p>
            <p className="text-sm text-muted-foreground/70">
              {t("common.completeSessionsForStats", "Complete work sessions to see your stats")}
            </p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
