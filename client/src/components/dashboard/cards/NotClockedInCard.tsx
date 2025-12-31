import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX, ChevronRight, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import type { CardProps } from "../cardRegistry";

interface NotClockedInData {
  employees: Array<{
    id: string;
    name: string;
    scheduledTime: string;
  }>;
  count: number;
}

export function NotClockedInCard({ onRouteNavigate, branding }: CardProps) {
  const { t } = useLanguage();
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data, isLoading } = useQuery<NotClockedInData>({
    queryKey: ["/api/not-clocked-in"],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UserX className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.notClockedIn.title", "Not Clocked In")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse h-20 bg-muted rounded" />
        </CardContent>
      </div>
    );
  }

  const hasData = data && data.count > 0;

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <UserX className="w-5 h-5" style={{ color: accentColor }} />
          {t("dashboardCards.notClockedIn.title", "Not Clocked In")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        {hasData ? (
          <div className="space-y-3">
            <div className="text-center mb-3">
              <p className="text-2xl font-bold text-amber-600" data-testid="text-not-clocked-count">
                {data!.count}
              </p>
              <p className="text-sm text-muted-foreground">{t("dashboardCards.notClockedIn.scheduled", "Scheduled but not started")}</p>
            </div>
            <div className="space-y-2">
              {data!.employees.slice(0, 3).map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded"
                  data-testid={`row-not-clocked-${emp.id}`}
                >
                  <span className="font-medium truncate">{emp.name}</span>
                  <span className="text-muted-foreground text-xs">{emp.scheduledTime}</span>
                </div>
              ))}
              {data!.count > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{data!.count - 3} {t("common.more", "more")}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => onRouteNavigate("/timesheets")}
              data-testid="button-view-not-clocked"
            >
              {t("common.viewAll", "View All")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Users className="w-10 h-10 text-muted-foreground/50 mb-2" />
            <p className="text-base text-muted-foreground">{t("dashboardCards.notClockedIn.allClockedIn", "All scheduled employees clocked in")}</p>
            <p className="text-sm text-muted-foreground/70">{t("dashboardCards.notClockedIn.noMissing", "No missing check-ins")}</p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
