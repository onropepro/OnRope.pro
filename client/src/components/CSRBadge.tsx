import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, FileText, ClipboardCheck, HardHat, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

function getProgressColor(rating: number): string {
  if (rating >= 90) return "bg-green-500";
  if (rating >= 70) return "bg-yellow-500";
  if (rating >= 50) return "bg-orange-500";
  return "bg-red-500";
}

function getBadgeVariant(rating: number): "default" | "secondary" | "destructive" | "outline" {
  if (rating >= 90) return "default";
  if (rating >= 70) return "secondary";
  return "destructive";
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
          variant={getBadgeVariant(overallCSR)} 
          className="gap-1.5 px-3 py-1.5 cursor-help no-default-hover-elevate no-default-active-elevate"
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
            <Progress 
              value={breakdown.documentationRating} 
              className="h-1.5" 
            />
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
            <Progress 
              value={breakdown.toolboxMeetingRating} 
              className="h-1.5" 
            />
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
            <Progress 
              value={breakdown.harnessInspectionRating} 
              className="h-1.5" 
            />
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
            <Progress 
              value={breakdown.projectCompletionRating} 
              className="h-1.5" 
            />
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
