import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, ChevronRight, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { CardProps } from "../cardRegistry";

interface PendingApprovalsData {
  timesheetCount: number;
  totalHours: number;
}

export function PendingApprovalsCard({ onRouteNavigate, branding }: CardProps) {
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data, isLoading } = useQuery<PendingApprovalsData>({
    queryKey: ["/api/pending-approvals"],
  });

  if (isLoading) {
    return (
      <>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5" style={{ color: accentColor }} />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="animate-pulse h-20 bg-muted rounded" />
        </CardContent>
      </>
    );
  }

  const hasData = data && data.timesheetCount > 0;

  return (
    <>
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5" style={{ color: accentColor }} />
          Pending Approvals
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {hasData ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-amber-600" data-testid="text-pending-count">
                  {data!.timesheetCount}
                </p>
                <p className="text-xs text-muted-foreground">Timesheets</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <p className="text-xl font-bold" data-testid="text-pending-hours">
                  {data!.totalHours.toFixed(1)}h
                </p>
                <p className="text-xs text-muted-foreground">Total Hours</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => onRouteNavigate("/timesheets")}
              data-testid="button-view-pending-approvals"
            >
              Review Timesheets
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <CheckCircle className="w-10 h-10 text-muted-foreground/50 mb-2" />
            <p className="text-base text-muted-foreground">No pending approvals</p>
            <p className="text-sm text-muted-foreground/70">All timesheets reviewed</p>
          </div>
        )}
      </CardContent>
    </>
  );
}
