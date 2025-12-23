import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { hasFinancialAccess } from "@/lib/permissions";
import type { CardProps } from "../cardRegistry";

interface OvertimeData {
  employeesApproaching: number;
  employeesExceeding: number;
  totalOvertimeHours: number;
}

export function OvertimeAlertCard({ currentUser, onRouteNavigate, branding }: CardProps) {
  const hasAccess = hasFinancialAccess(currentUser) || currentUser?.role === "company";
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data: otData, isLoading } = useQuery<OvertimeData>({
    queryKey: ["/api/overtime-alerts"],
    enabled: hasAccess,
  });

  if (!hasAccess) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" style={{ color: accentColor }} />
            Overtime Alert
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0 flex items-center justify-center">
          <p className="text-base text-muted-foreground">No access</p>
        </CardContent>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" style={{ color: accentColor }} />
            Overtime Alert
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </CardContent>
      </div>
    );
  }

  const approachingCount = otData?.employeesApproaching || 0;
  const exceedingCount = otData?.employeesExceeding || 0;
  const totalAlerts = approachingCount + exceedingCount;

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" style={{ color: accentColor }} />
            Overtime Alert
          </CardTitle>
          {totalAlerts > 0 && (
            <Badge variant="destructive" className="text-xs" data-testid="badge-overtime-count">
              {totalAlerts}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        {totalAlerts === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <Clock className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-base text-muted-foreground">No overtime alerts this period</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exceedingCount > 0 && (
              <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                <p className="text-base font-medium text-red-700 dark:text-red-400">
                  {exceedingCount} Exceeding OT
                </p>
                <p className="text-sm text-muted-foreground">Already over 40 hours</p>
              </div>
            )}
            {approachingCount > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                <p className="text-base font-medium text-amber-700 dark:text-amber-400">
                  {approachingCount} Approaching OT
                </p>
                <p className="text-sm text-muted-foreground">Within 5 hours of limit</p>
              </div>
            )}
            {otData?.totalOvertimeHours && otData.totalOvertimeHours > 0 && (
              <p className="text-sm text-muted-foreground">
                Total OT this period: {otData.totalOvertimeHours.toFixed(1)}h
              </p>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => onRouteNavigate("/payroll")}
              data-testid="button-view-overtime"
            >
              View Details
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </div>
  );
}
