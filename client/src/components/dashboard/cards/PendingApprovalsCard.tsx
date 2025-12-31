import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, ChevronRight, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import type { CardProps } from "../cardRegistry";

interface PendingApprovalsData {
  timesheetCount: number;
  totalHours: number;
}

export function PendingApprovalsCard({ onRouteNavigate, branding }: CardProps) {
  const { t } = useLanguage();
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data, isLoading } = useQuery<PendingApprovalsData>({
    queryKey: ["/api/pending-approvals"],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.pendingApprovals.title", "Pending Approvals")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse h-20 bg-muted rounded" />
        </CardContent>
      </div>
    );
  }

  const hasData = data && data.timesheetCount > 0;

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5" style={{ color: accentColor }} />
          {t("dashboardCards.pendingApprovals.title", "Pending Approvals")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        {hasData ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-amber-600" data-testid="text-pending-count">
                  {data!.timesheetCount}
                </p>
                <p className="text-xs text-muted-foreground">{t("common.timesheets", "Timesheets")}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <p className="text-xl font-bold" data-testid="text-pending-hours">
                  {data!.totalHours.toFixed(1)}h
                </p>
                <p className="text-xs text-muted-foreground">{t("common.totalHours", "Total Hours")}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => onRouteNavigate("/timesheets")}
              data-testid="button-view-pending-approvals"
            >
              {t("common.reviewTimesheets", "Review Timesheets")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-10 h-10 text-muted-foreground/50 mb-2" />
            <p className="text-base text-muted-foreground">{t("dashboardCards.pendingApprovals.noPending", "No pending approvals")}</p>
            <p className="text-sm text-muted-foreground/70">{t("common.allTimesheetsReviewed", "All timesheets reviewed")}</p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
