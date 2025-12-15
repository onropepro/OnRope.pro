import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, FileText, HardHat, AlertTriangle, CheckCircle2, Lightbulb, FileCheck, History, TrendingUp, TrendingDown, Minus, Building2, Users } from "lucide-react";
import { canViewCSR, type User } from "@/lib/permissions";
import { formatDistanceToNow } from "date-fns";

interface CSRBadgeProps {
  user?: User | null;
}

interface HarnessProjectBreakdown {
  projectId: number;
  projectName: string;
  workSessions: number;
  completedInspections: number;
  points: number;
}

interface ProjectDocBreakdown {
  projectId: number;
  projectName: string;
  isElevation: boolean;
  docsRequired: number;
  docsPresent: number;
  points: number;
}

interface CSRData {
  overallCSR: number;
  csrRating: number;
  csrLabel: string;
  csrColor: string;
  breakdown: {
    harnessInspectionPoints: number;
    projectDocumentationPoints: number;
    companyDocumentationPoints: number;
    employeeDocReviewPoints: number;
    documentationRating: number;
    toolboxMeetingRating: number;
    harnessInspectionRating: number;
    documentReviewRating: number;
    projectDocumentationRating: number;
  };
  details: {
    hasHealthSafety: boolean;
    hasCompanyPolicy: boolean;
    hasInsurance?: boolean;
    companyDocsUploaded?: number;
    toolboxDaysWithMeeting: number;
    toolboxTotalDays: number;
    harnessCompletedInspections: number;
    harnessRequiredInspections: number;
    harnessProjectBreakdown?: HarnessProjectBreakdown[];
    documentReviewsSigned: number;
    documentReviewsPending: number;
    documentReviewsTotal: number;
    documentReviewsTotalEmployees?: number;
    documentReviewsTotalDocs?: number;
    projectsWithAnchorInspection: number;
    projectsWithRopeAccessPlan: number;
    projectsWithFLHA: number;
    projectsWithToolboxMeeting?: number;
    activeProjectCount: number;
    elevationProjectCount: number;
    projectDocBreakdown?: ProjectDocBreakdown[];
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

function getPointsColor(points: number, maxPoints: number): string {
  if (maxPoints === 0) return "text-muted-foreground";
  const ratio = points / maxPoints;
  if (ratio >= 0.9) return "text-green-600 dark:text-green-400";
  if (ratio >= 0.7) return "text-yellow-600 dark:text-yellow-400";
  if (ratio >= 0.5) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function getOverallScoreColor(percentage: number): string {
  if (percentage >= 90) return "text-green-600 dark:text-green-400";
  if (percentage >= 70) return "text-yellow-600 dark:text-yellow-400";
  if (percentage >= 50) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function getBadgeColors(percentage: number): string {
  if (percentage >= 90) return "bg-green-600 dark:bg-green-500 text-white border-green-700 dark:border-green-400";
  if (percentage >= 70) return "bg-yellow-500 dark:bg-yellow-500 text-black dark:text-black border-yellow-600 dark:border-yellow-400";
  if (percentage >= 50) return "bg-orange-500 dark:bg-orange-500 text-white border-orange-600 dark:border-orange-400";
  return "bg-red-600 dark:bg-red-500 text-white border-red-700 dark:border-red-400";
}

function PointsProgress({ points, maxPoints }: { points: number; maxPoints: number }) {
  const percentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
  const ratio = maxPoints > 0 ? points / maxPoints : 0;
  
  const getBarColor = () => {
    if (ratio >= 0.9) return "bg-green-500 dark:bg-green-400";
    if (ratio >= 0.7) return "bg-yellow-500 dark:bg-yellow-400";
    if (ratio >= 0.5) return "bg-orange-500 dark:bg-orange-400";
    return "bg-red-500 dark:bg-red-400";
  };

  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all ${getBarColor()}`}
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  );
}

function formatPoints(points: number): string {
  return points.toFixed(2).replace(/\.?0+$/, '');
}

function getImprovementTips(csrData: CSRData): { category: string; icon: any; tip: string; priority: 'high' | 'medium' | 'low' }[] {
  const tips: { category: string; icon: any; tip: string; priority: 'high' | 'medium' | 'low' }[] = [];
  const { breakdown, details } = csrData;

  const companyDocsUploaded = details.companyDocsUploaded ?? 0;
  if (companyDocsUploaded < 3) {
    const missing: string[] = [];
    if (!details.hasHealthSafety) missing.push("Health & Safety Manual");
    if (!details.hasCompanyPolicy) missing.push("Company Policy");
    if (!details.hasInsurance) missing.push("Certificate of Insurance");
    
    tips.push({
      category: "Documents and Training",
      icon: Building2,
      tip: `Upload ${missing.join(", ")} to earn up to ${formatPoints(1 - breakdown.companyDocumentationPoints)} more points.`,
      priority: breakdown.companyDocumentationPoints < 0.5 ? 'high' : 'medium'
    });
  }

  if (breakdown.harnessInspectionPoints < details.activeProjectCount && details.activeProjectCount > 0) {
    const missingPoints = details.activeProjectCount - breakdown.harnessInspectionPoints;
    tips.push({
      category: "Harness Inspections",
      icon: HardHat,
      tip: `Complete harness inspections for all work sessions on each project to earn up to ${formatPoints(missingPoints)} more points.`,
      priority: missingPoints > 0.5 ? 'high' : 'medium'
    });
  }

  if (breakdown.projectDocumentationPoints < details.activeProjectCount && details.activeProjectCount > 0) {
    const missingPoints = details.activeProjectCount - breakdown.projectDocumentationPoints;
    tips.push({
      category: "Project Documentation",
      icon: FileText,
      tip: `Upload all required documents for each project to earn up to ${formatPoints(missingPoints)} more points. Elevation projects need: Rope Access Plan, Anchor Inspection, Toolbox Meeting, FLHA. Other projects need: Toolbox Meeting, FLHA.`,
      priority: missingPoints > 0.5 ? 'high' : 'medium'
    });
  }

  const totalEmployees = details.documentReviewsTotalEmployees ?? 0;
  if (breakdown.employeeDocReviewPoints < totalEmployees && totalEmployees > 0) {
    const missingPoints = totalEmployees - breakdown.employeeDocReviewPoints;
    tips.push({
      category: "Document Reviews",
      icon: FileCheck,
      tip: `${details.documentReviewsPending} document signature${details.documentReviewsPending !== 1 ? 's are' : ' is'} pending. Have all staff view and sign company documents to earn up to ${formatPoints(missingPoints)} more points.`,
      priority: missingPoints > 0.5 ? 'medium' : 'low'
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
    documentation: "Documents and Training",
    toolbox: "Toolbox Meetings",
    harness: "Harness Inspections",
    documentReview: "Document Reviews",
    projectDocumentation: "Project Documentation",
    companyDocumentation: "Documents and Training",
    employeeDocReview: "Document Reviews",
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

  const { breakdown, details } = csrData;
  const csrRating = csrData.csrRating ?? 0;
  const csrLabel = csrData.csrLabel ?? 'N/A';
  const improvementTips = getImprovementTips(csrData);
  const hasImprovements = improvementTips.length > 0;

  const maxHarnessPoints = details.activeProjectCount;
  const maxProjectDocPoints = details.activeProjectCount;
  const maxCompanyDocPoints = 1;
  const maxEmployeeDocPoints = details.documentReviewsTotalEmployees ?? 0;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Badge 
            variant="outline" 
            className={`gap-1.5 px-3 py-1.5 cursor-pointer ${getBadgeColors(csrRating)}`}
            data-testid="badge-csr"
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-semibold">CSR: {Math.round(csrRating)}%</span>
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
                <div className={`text-5xl font-bold ${getOverallScoreColor(csrRating)}`}>
                  {Math.round(csrRating)}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">{csrLabel}</p>
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
                      <HardHat className="w-4 h-4 text-muted-foreground" />
                      <span>Harness Inspections</span>
                    </div>
                    <span className={`font-semibold ${getPointsColor(breakdown.harnessInspectionPoints, maxHarnessPoints)}`}>
                      {formatPoints(breakdown.harnessInspectionPoints)} / {maxHarnessPoints} pts
                    </span>
                  </div>
                  <PointsProgress points={breakdown.harnessInspectionPoints} maxPoints={maxHarnessPoints} />
                  <p className="text-xs text-muted-foreground">
                    {details.activeProjectCount > 0 
                      ? `1 point per project with all work sessions having harness inspections`
                      : "No active projects"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>Project Documentation</span>
                    </div>
                    <span className={`font-semibold ${getPointsColor(breakdown.projectDocumentationPoints, maxProjectDocPoints)}`}>
                      {formatPoints(breakdown.projectDocumentationPoints)} / {maxProjectDocPoints} pts
                    </span>
                  </div>
                  <PointsProgress points={breakdown.projectDocumentationPoints} maxPoints={maxProjectDocPoints} />
                  <p className="text-xs text-muted-foreground">
                    {details.activeProjectCount > 0 
                      ? `1 point per project with all required documents uploaded`
                      : "No active projects"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>Documents and Training</span>
                    </div>
                    <span className={`font-semibold ${getPointsColor(breakdown.companyDocumentationPoints, maxCompanyDocPoints)}`}>
                      {formatPoints(breakdown.companyDocumentationPoints)} / {maxCompanyDocPoints} pts
                    </span>
                  </div>
                  <PointsProgress points={breakdown.companyDocumentationPoints} maxPoints={maxCompanyDocPoints} />
                  <p className="text-xs text-muted-foreground">
                    {details.companyDocsUploaded ?? 0} of 3 company documents uploaded
                    <span className="block mt-0.5 text-xs">
                      (H&S Manual, Company Policy, Certificate of Insurance)
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Employee Document Reviews</span>
                    </div>
                    <span className={`font-semibold ${getPointsColor(breakdown.employeeDocReviewPoints, maxEmployeeDocPoints)}`}>
                      {formatPoints(breakdown.employeeDocReviewPoints)} / {maxEmployeeDocPoints} pts
                    </span>
                  </div>
                  <PointsProgress points={breakdown.employeeDocReviewPoints} maxPoints={maxEmployeeDocPoints} />
                  <p className="text-xs text-muted-foreground">
                    {maxEmployeeDocPoints > 0 
                      ? `1 point per employee who signs all company documents`
                      : "No employees or no documents uploaded"}
                    {details.documentReviewsTotalEmployees && details.documentReviewsTotalDocs && details.documentReviewsTotalEmployees > 0 && (
                      <span className="block mt-0.5">
                        {details.documentReviewsSigned} of {details.documentReviewsTotal} signature{details.documentReviewsTotal !== 1 ? 's' : ''} completed
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
                            <span className={`text-lg font-bold ${getOverallScoreColor(entry.newScore)}`}>
                              {Math.round(entry.newScore)}%
                            </span>
                            <span className={`text-sm font-medium ${
                              entry.delta > 0 
                                ? 'text-green-600 dark:text-green-400' 
                                : entry.delta < 0 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : 'text-muted-foreground'
                            }`}>
                              {entry.delta > 0 ? '+' : ''}{Math.round(entry.delta)}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            from {Math.round(entry.previousScore)}%
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {getCategoryLabel(entry.category)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-3 whitespace-pre-line bg-muted/30 p-3 rounded-md">
                      {entry.reason}
                    </div>
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
