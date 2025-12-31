import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, ChevronRight, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import type { CardProps } from "../cardRegistry";

interface ScheduleItem {
  id: string | number;
  time: string;
  title: string;
  location: string;
  technicians: Array<{ initials: string; color: string }>;
  status?: string;
}

export function TodayScheduleCard({ onRouteNavigate, branding }: CardProps) {
  const { t } = useLanguage();
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data: scheduleData, isLoading } = useQuery<{ scheduleItems: ScheduleItem[] }>({
    queryKey: ["/api/schedule/today"],
  });

  const items = scheduleData?.scheduleItems || [];

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.todaySchedule.title", "Today's Schedule")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-muted rounded" />
            <div className="h-16 bg-muted rounded" />
          </div>
        </CardContent>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.todaySchedule.title", "Today's Schedule")}
          </CardTitle>
          <Badge variant="secondary" className="text-xs" data-testid="badge-schedule-count">
            {items.length} {t("dashboardCards.todaySchedule.jobs", "jobs")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-base text-muted-foreground">{t("dashboardCards.todaySchedule.noJobs", "No jobs scheduled for today")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.slice(0, 3).map((item, idx) => (
              <div 
                key={item.id || idx}
                className="flex items-start gap-3 p-2 rounded-lg bg-muted/50"
                data-testid={`schedule-item-${item.id || idx}`}
              >
                <div className="text-center min-w-[50px]">
                  <p className="text-sm font-medium" style={{ color: accentColor }}>
                    {item.time}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium truncate">{item.title}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {item.technicians?.slice(0, 3).map((tech, i) => (
                    <Avatar key={i} className="w-6 h-6 border-2 border-background">
                      <AvatarFallback 
                        className="text-xs"
                        style={{ backgroundColor: tech.color }}
                      >
                        {tech.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {(item.technicians?.length || 0) > 3 && (
                    <Avatar className="w-6 h-6 border-2 border-background">
                      <AvatarFallback className="text-xs bg-muted">
                        +{item.technicians!.length - 3}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {items.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={() => onRouteNavigate("/schedule")}
                data-testid="button-view-full-schedule"
              >
                {t("dashboardCards.todaySchedule.viewFullSchedule", "View Full Schedule")}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </div>
  );
}
