import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, FileText, ClipboardCheck, HardHat, TrendingUp } from "lucide-react";

interface CSRData {
  overallCSR: number;
  breakdown: {
    documentationRating: number;
    toolboxMeetingRating: number;
    harnessInspectionRating: number;
    projectCompletionRating: number;
  };
  details: {
    hasHealthSafety: boolean;
    hasCompanyPolicy: boolean;
    toolboxDaysWithMeeting: number;
    toolboxTotalDays: number;
    harnessCompletedInspections: number;
    harnessRequiredInspections: number;
    projectCount: number;
    totalProjectProgress: number;
  };
}

function getRatingColor(rating: number): string {
  if (rating >= 90) return "text-green-600 dark:text-green-400";
  if (rating >= 70) return "text-yellow-600 dark:text-yellow-400";
  if (rating >= 50) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function getBadgeColors(rating: number): string {
  if (rating >= 90) return "bg-green-600 dark:bg-green-500 text-white border-green-700 dark:border-green-400";
  if (rating >= 70) return "bg-yellow-500 dark:bg-yellow-500 text-black dark:text-black border-yellow-600 dark:border-yellow-400";
  if (rating >= 50) return "bg-orange-500 dark:bg-orange-500 text-white border-orange-600 dark:border-orange-400";
  return "bg-red-600 dark:bg-red-500 text-white border-red-700 dark:border-red-400";
}

function ColoredProgress({ value, rating }: { value: number; rating: number }) {
  const getBarColor = () => {
    if (rating >= 90) return "bg-green-500 dark:bg-green-400";
    if (rating >= 70) return "bg-yellow-500 dark:bg-yellow-400";
    if (rating >= 50) return "bg-orange-500 dark:bg-orange-400";
    return "bg-red-500 dark:bg-red-400";
  };

  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all ${getBarColor()}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function CSRBadge() {
  const { data: csrData, isLoading } = useQuery<CSRData>({
    queryKey: ['/api/company-safety-rating'],
  });

  if (isLoading) {
    return (
      <Badge variant="outline" className="gap-1.5 px-3 py-1.5 animate-pulse" data-testid="badge-csr-loading">
        <Shield className="w-4 h-4" />
        <span className="text-sm font-medium">CSR: --</span>
      </Badge>
    );
  }

  if (!csrData) {
    return null;
  }

  const { overallCSR, breakdown, details } = csrData;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant="outline" 
          className={`gap-1.5 px-3 py-1.5 cursor-help no-default-hover-elevate no-default-active-elevate ${getBadgeColors(overallCSR)}`}
          data-testid="badge-csr"
        >
          <Shield className="w-4 h-4" />
          <span className="text-sm font-semibold">CSR: {overallCSR}%</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        align="end" 
        className="w-80 p-4 space-y-4"
        data-testid="tooltip-csr-breakdown"
      >
        <div className="space-y-1">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Company Safety Rating
          </h4>
          <p className="text-xs text-muted-foreground">
            Combined safety compliance score
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Documentation</span>
              </div>
              <span className={`font-medium ${getRatingColor(breakdown.documentationRating)}`}>
                {breakdown.documentationRating}%
              </span>
            </div>
            <ColoredProgress value={breakdown.documentationRating} rating={breakdown.documentationRating} />
            <p className="text-[10px] text-muted-foreground">
              {details.hasHealthSafety && details.hasCompanyPolicy 
                ? "Both manuals uploaded" 
                : details.hasHealthSafety || details.hasCompanyPolicy 
                  ? "1 of 2 manuals uploaded" 
                  : "No manuals uploaded"}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Toolbox Meetings</span>
              </div>
              <span className={`font-medium ${getRatingColor(breakdown.toolboxMeetingRating)}`}>
                {breakdown.toolboxMeetingRating}%
              </span>
            </div>
            <ColoredProgress value={breakdown.toolboxMeetingRating} rating={breakdown.toolboxMeetingRating} />
            <p className="text-[10px] text-muted-foreground">
              {details.toolboxDaysWithMeeting} of {details.toolboxTotalDays} work days covered
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <HardHat className="w-3.5 h-3.5" />
                <span>Harness Inspections</span>
              </div>
              <span className={`font-medium ${getRatingColor(breakdown.harnessInspectionRating)}`}>
                {breakdown.harnessInspectionRating}%
              </span>
            </div>
            <ColoredProgress value={breakdown.harnessInspectionRating} rating={breakdown.harnessInspectionRating} />
            <p className="text-[10px] text-muted-foreground">
              {details.harnessCompletedInspections} of {details.harnessRequiredInspections} inspections (30 days)
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Project Progress</span>
              </div>
              <span className={`font-medium ${getRatingColor(breakdown.projectCompletionRating)}`}>
                {breakdown.projectCompletionRating}%
              </span>
            </div>
            <ColoredProgress value={breakdown.projectCompletionRating} rating={breakdown.projectCompletionRating} />
            <p className="text-[10px] text-muted-foreground">
              Average across {details.projectCount} project{details.projectCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Overall Score</span>
            <span className={`text-lg font-bold ${getRatingColor(overallCSR)}`}>
              {overallCSR}%
            </span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
