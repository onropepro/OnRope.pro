import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, FileText, ClipboardCheck, HardHat, AlertTriangle, CheckCircle2, Lightbulb, FileCheck, History, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { canViewCSR, type User } from "@/lib/permissions";
import { formatDistanceToNow } from "date-fns";

interface CSRBadgeProps {
  user?: User | null;
}

interface CSRData {
  overallCSR: number;
  breakdown: {
    documentationRating: number;
    toolboxMeetingRating: number;
    harnessInspectionRating: number;
    documentReviewRating: number;
    projectDocumentationRating: number;
  };
  details: {
    hasHealthSafety: boolean;
    hasCompanyPolicy: boolean;
    toolboxDaysWithMeeting: number;
    toolboxTotalDays: number;
    harnessCompletedInspections: number;
    harnessRequiredInspections: number;
    documentReviewsSigned: number;
    documentReviewsPending: number;
    documentReviewsTotal: number;
    documentReviewsTotalEmployees?: number;
    documentReviewsTotalDocs?: number;
    projectsWithAnchorInspection: number;
    projectsWithRopeAccessPlan: number;
    projectsWithFLHA: number;
    activeProjectCount: number;
    elevationProjectCount: number;
  };
}

interface CSRHistoryEntry {
  id: string;
  companyId: string;
  previousScore: number;
  newScore: number;
  delta: number;
  category: string;
  reason: string;
  createdAt: string;
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
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all ${getBarColor()}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function getImprovementTips(csrData: CSRData): { category: string; icon: any; tip: string; priority: 'high' | 'medium' | 'low' }[] {
  const tips: { category: string; icon: any; tip: string; priority: 'high' | 'medium' | 'low' }[] = [];
  const { breakdown, details } = csrData;

  if (!details.hasHealthSafety) {
    tips.push({
      category: "Documentation",
      icon: FileText,
      tip: "Upload your Health & Safety Manual in Documents to add 50% to your documentation score.",
      priority: breakdown.documentationRating < 50 ? 'high' : 'medium'
    });
  }

  if (!details.hasCompanyPolicy) {
    tips.push({
      category: "Documentation",
      icon: FileText,
      tip: "Upload your Company Policy document to complete your documentation requirements.",
      priority: breakdown.documentationRating < 50 ? 'high' : 'medium'
    });
  }

  if (breakdown.toolboxMeetingRating < 100) {
    const missingDays = details.toolboxTotalDays - details.toolboxDaysWithMeeting;
    if (missingDays > 0) {
      tips.push({
        category: "Toolbox Meetings",
        icon: ClipboardCheck,
        tip: `You're missing toolbox meetings for ${missingDays} work day${missingDays > 1 ? 's' : ''} in the last 30 days. Record meetings for each work day to reach 100%.`,
        priority: breakdown.toolboxMeetingRating < 50 ? 'high' : 'medium'
      });
    }
  }

  if (breakdown.harnessInspectionRating < 100) {
    const missingInspections = details.harnessRequiredInspections - details.harnessCompletedInspections;
    if (missingInspections > 0) {
      tips.push({
        category: "Harness Inspections",
        icon: HardHat,
        tip: `${missingInspections} harness inspection${missingInspections > 1 ? 's are' : ' is'} missing. Each employee should complete an inspection before starting work each day.`,
        priority: breakdown.harnessInspectionRating < 50 ? 'high' : 'medium'
      });
    }
  }

  if (breakdown.documentReviewRating < 100 && details.documentReviewsTotal > 0) {
    tips.push({
      category: "Document Reviews",
      icon: FileCheck,
      tip: `${details.documentReviewsPending} document signature${details.documentReviewsPending > 1 ? 's are' : ' is'} pending. All staff members (including the company owner) should view and sign required safety documents.`,
      priority: breakdown.documentReviewRating < 80 ? 'medium' : 'low'
    });
  }

  tips.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return tips;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    documentation: "Documentation",
    toolbox: "Toolbox Meetings",
    harness: "Harness Inspections",
    documentReview: "Document Reviews",
    projectDocumentation: "Project Documentation",
    improvement: "Improvement",
    initial: "Initial Rating",
    overall: "Overall"
  };
  return labels[category] || category;
}

export function CSRBadge({ user }: CSRBadgeProps) {
  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const hasAccess = canViewCSR(user);
  
  const { data: csrData, isLoading } = useQuery<CSRData>({
    queryKey: ['/api/company-safety-rating'],
    enabled: hasAccess,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery<{ history: CSRHistoryEntry[] }>({
    queryKey: ['/api/company-safety-rating/history'],
    enabled: hasAccess && historyOpen,
  });

  if (!hasAccess) {
    return null;
  }

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
  const improvementTips = getImprovementTips(csrData);
  const hasImprovements = improvementTips.length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Badge 
            variant="outline" 
            className={`gap-1.5 px-3 py-1.5 cursor-pointer ${getBadgeColors(overallCSR)}`}
            data-testid="badge-csr"
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-semibold">CSR: {overallCSR}%</span>
          </Badge>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" data-testid="dialog-csr-details">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Company Safety Rating
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center justify-center p-6 rounded-xl bg-muted/50">
              <div className="text-center">
                <div className={`text-5xl font-bold ${getRatingColor(overallCSR)}`}>
                  {overallCSR}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">Overall Safety Score</p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  setHistoryOpen(true);
                }}
                data-testid="button-csr-history"
              >
                <History className="w-4 h-4 mr-2" />
                Rating History
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                Score Breakdown
              </h4>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>Documentation</span>
                    </div>
                    <span className={`font-semibold ${getRatingColor(breakdown.documentationRating)}`}>
                      {breakdown.documentationRating}%
                    </span>
                  </div>
                  <ColoredProgress value={breakdown.documentationRating} rating={breakdown.documentationRating} />
                  <p className="text-xs text-muted-foreground">
                    {details.hasHealthSafety && details.hasCompanyPolicy 
                      ? "Both manuals uploaded" 
                      : details.hasHealthSafety || details.hasCompanyPolicy 
                        ? "1 of 2 manuals uploaded" 
                        : "No manuals uploaded"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
                      <span>Toolbox Meetings</span>
                    </div>
                    <span className={`font-semibold ${getRatingColor(breakdown.toolboxMeetingRating)}`}>
                      {breakdown.toolboxMeetingRating}%
                    </span>
                  </div>
                  <ColoredProgress value={breakdown.toolboxMeetingRating} rating={breakdown.toolboxMeetingRating} />
                  <p className="text-xs text-muted-foreground">
                    {details.toolboxDaysWithMeeting} of {details.toolboxTotalDays} work days covered (last 30 days)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <HardHat className="w-4 h-4 text-muted-foreground" />
                      <span>Harness Inspections</span>
                    </div>
                    <span className={`font-semibold ${getRatingColor(breakdown.harnessInspectionRating)}`}>
                      {breakdown.harnessInspectionRating}%
                    </span>
                  </div>
                  <ColoredProgress value={breakdown.harnessInspectionRating} rating={breakdown.harnessInspectionRating} />
                  <p className="text-xs text-muted-foreground">
                    {details.harnessCompletedInspections} of {details.harnessRequiredInspections} inspections completed (last 30 days)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-muted-foreground" />
                      <span>Document Reviews</span>
                    </div>
                    <span className={`font-semibold ${getRatingColor(breakdown.documentReviewRating)}`}>
                      {breakdown.documentReviewRating}%
                    </span>
                  </div>
                  <ColoredProgress value={breakdown.documentReviewRating} rating={breakdown.documentReviewRating} />
                  <p className="text-xs text-muted-foreground">
                    {details.documentReviewsSigned} of {details.documentReviewsTotal} document signature{details.documentReviewsTotal !== 1 ? 's' : ''} completed
                    {details.documentReviewsTotalEmployees && details.documentReviewsTotalDocs && (
                      <span className="block mt-0.5">
                        ({details.documentReviewsTotalEmployees} staff member{details.documentReviewsTotalEmployees !== 1 ? 's' : ''} × {details.documentReviewsTotalDocs} document{details.documentReviewsTotalDocs !== 1 ? 's' : ''})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {hasImprovements ? (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Tips to Improve Your Score
                </h4>
                <div className="space-y-2">
                  {improvementTips.map((tip, index) => (
                    <div 
                      key={index}
                      className={`flex gap-3 p-3 rounded-lg border ${
                        tip.priority === 'high' 
                          ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900' 
                          : tip.priority === 'medium'
                            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
                            : 'bg-muted/50 border-border'
                      }`}
                      data-testid={`tip-${index}`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {tip.priority === 'high' ? (
                          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        ) : (
                          <tip.icon className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{tip.category}</span>
                          {tip.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">High Priority</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{tip.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Excellent work!</p>
                  <p className="text-sm text-green-700 dark:text-green-300">You're maintaining a perfect safety compliance score.</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" data-testid="dialog-csr-history">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Rating History
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {historyLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading history...
              </div>
            ) : !historyData?.history || historyData.history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No rating history yet. Your rating history will appear here as changes occur.
              </div>
            ) : (
              <div className="space-y-3">
                {historyData.history.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-lg border bg-card"
                    data-testid={`history-entry-${entry.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {entry.delta > 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : entry.delta < 0 ? (
                          <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                        ) : (
                          <Minus className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${getRatingColor(entry.newScore)}`}>
                              {entry.newScore}%
                            </span>
                            <span className={`text-sm font-medium ${
                              entry.delta > 0 
                                ? 'text-green-600 dark:text-green-400' 
                                : entry.delta < 0 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : 'text-muted-foreground'
                            }`}>
                              {entry.delta > 0 ? '+' : ''}{entry.delta}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            from {entry.previousScore}%
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {getCategoryLabel(entry.category)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {entry.reason}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setHistoryOpen(false);
                  setOpen(true);
                }}
              >
                Back to Rating Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
