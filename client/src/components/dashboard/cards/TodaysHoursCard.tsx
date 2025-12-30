import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight, Timer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { CardProps } from "../cardRegistry";

interface TodaysHoursData {
  totalHours: number;
  activeCount: number;
  completedSessions: number;
}

export function TodaysHoursCard({ onRouteNavigate, branding }: CardProps) {
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data, isLoading } = useQuery<TodaysHoursData>({
    queryKey: ["/api/todays-hours"],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" style={{ color: accentColor }} />
            Today's Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse h-20 bg-muted rounded" />
        </CardContent>
      </div>
    );
  }

  const hasData = data && (data.totalHours > 0 || data.activeCount > 0 || data.completedSessions > 0);

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" style={{ color: accentColor }} />
          Today's Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        {hasData ? (
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-3xl font-bold" data-testid="text-todays-hours">
                {data!.totalHours.toFixed(1)}h
              </p>
              <p className="text-sm text-muted-foreground">Company-wide total</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted/50 p-2 rounded text-center">
                <p className="font-medium" data-testid="text-active-count">{data!.activeCount}</p>
                <p className="text-muted-foreground text-xs">Active now</p>
              </div>
              <div className="bg-muted/50 p-2 rounded text-center">
                <p className="font-medium" data-testid="text-completed-sessions">{data!.completedSessions}</p>
                <p className="text-muted-foreground text-xs">Sessions</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => onRouteNavigate("/my-logged-hours")}
              data-testid="button-view-todays-hours"
            >
              View Logged Hours
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Timer className="w-10 h-10 text-muted-foreground/50 mb-2" />
            <p className="text-base text-muted-foreground">No hours logged today</p>
            <p className="text-sm text-muted-foreground/70">Work sessions will appear here</p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
