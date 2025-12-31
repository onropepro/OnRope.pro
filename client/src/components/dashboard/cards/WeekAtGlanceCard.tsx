import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarRange, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, startOfWeek, parseISO } from "date-fns";
import { canViewSchedule } from "@/lib/permissions";
import { useLanguage } from "@/hooks/use-language";
import type { CardProps } from "../cardRegistry";

interface WeekDay {
  date: string;
  dayName: string;
  jobCount: number;
  isToday: boolean;
}

export function WeekAtGlanceCard({ currentUser, onRouteNavigate, branding }: CardProps) {
  const { t } = useLanguage();
  const hasAccess = canViewSchedule(currentUser) || currentUser?.role === "company";
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data: weekData, isLoading } = useQuery<{ days: WeekDay[]; uniqueJobCount: number }>({
    queryKey: ["/api/schedule/week-summary"],
    enabled: hasAccess,
  });

  if (!hasAccess) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarRange className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.weekAtGlance.title", "Week at a Glance")}
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
            <CalendarRange className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.weekAtGlance.title", "Week at a Glance")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse h-20 bg-muted rounded" />
        </CardContent>
      </div>
    );
  }

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const today = new Date();
  
  const days = weekData?.days || Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date: format(date, "yyyy-MM-dd"),
      dayName: format(date, "EEE"),
      jobCount: 0,
      isToday: format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
    };
  });

  const totalJobs = weekData?.uniqueJobCount ?? 0;

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarRange className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.weekAtGlance.title", "Week at a Glance")}
          </CardTitle>
          <Badge variant="secondary" className="text-xs" data-testid="badge-week-total">
            {totalJobs} {t("common.jobs", "jobs")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 flex flex-col justify-between">
        <div className="grid grid-cols-7 gap-1 mb-3">
          {days.map((day) => {
            const dayOfMonth = format(parseISO(day.date), "d");
            return (
              <div 
                key={day.date}
                className={`text-center p-2 rounded-lg ${
                  day.isToday 
                    ? "bg-primary text-primary-foreground" 
                    : day.jobCount > 0 
                      ? "bg-muted" 
                      : "bg-muted/30"
                }`}
                data-testid={`week-day-${day.date}`}
              >
                <p className="text-xs font-medium">{day.dayName}</p>
                <p className={`text-lg font-bold ${day.isToday ? "" : ""}`}>{dayOfMonth}</p>
                {day.jobCount > 0 && (
                  <p className={`text-[10px] ${day.isToday ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {day.jobCount} {day.jobCount !== 1 ? t("common.jobs", "jobs") : t("common.job", "job")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between"
          onClick={() => onRouteNavigate("/schedule")}
          data-testid="button-view-week-schedule"
        >
          {t("dashboardCards.weekAtGlance.openSchedule", "Open Schedule")}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </div>
  );
}
