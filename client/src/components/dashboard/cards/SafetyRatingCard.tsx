import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, TrendingUp, TrendingDown, Users, ChevronRight, Award, FileCheck, BookOpen, Briefcase, Building2, Calendar, ClipboardCheck, AlertTriangle, History } from "lucide-react";
import { canViewCSR } from "@/lib/permissions";
import type { CardProps } from "../cardRegistry";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

interface CSRData {
  csrRating: number;
  csrLabel: string;
  csrColor: string;
}

interface CSRHistoryEntry {
  id: string;
  previousScore: number;
  newScore: number;
  changeReason: string;
  changedAt: string;
  csrLabel: string;
}

interface CSRHistoryData {
  history: CSRHistoryEntry[];
}

interface WSSData {
  wssScore: number;
  wssLabel: string;
  employeeCount: number;
  description: string;
}

interface EmployeePSRDetail {
  id: string;
  name: string;
  role: string;
  overallPSR: number;
  components: {
    certifications: { score: number; status: string };
    safetyDocs: { score: number; recentInspections: number };
    quizzes: { score: number; passed: number; total: number };
    workHistory: { score: number; sessions: number; incidents: number };
  };
}

interface WSSDetailsData {
  employees: EmployeePSRDetail[];
}

export function SafetyRatingCard({ currentUser, branding }: CardProps) {
  const [showCSRDialog, setShowCSRDialog] = useState(false);
  const [showWSSDialog, setShowWSSDialog] = useState(false);
  const hasAccess = canViewCSR(currentUser);
  
  const { data: csrData, isLoading } = useQuery<CSRData>({
    queryKey: ["/api/company-safety-rating"],
    enabled: hasAccess,
  });
  
  const { data: wssData, isLoading: wssLoading } = useQuery<WSSData>({
    queryKey: ["/api/workforce-safety-score"],
    enabled: hasAccess,
  });
  
  const { data: wssDetails, isLoading: wssDetailsLoading } = useQuery<WSSDetailsData>({
    queryKey: ["/api/workforce-safety-score/details"],
    enabled: hasAccess && showWSSDialog,
  });
  
  const { data: csrHistory, isLoading: csrHistoryLoading } = useQuery<CSRHistoryData>({
    queryKey: ["/api/company-safety-rating/history"],
    enabled: hasAccess && showCSRDialog,
  });

  const rating = csrData?.csrRating ?? 0;
  
  const getColorScheme = (r: number) => {
    if (r >= 90) return { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", badge: "bg-green-100 text-green-700" };
    if (r >= 70) return { bg: "bg-yellow-50 dark:bg-yellow-950/30", text: "text-yellow-700 dark:text-yellow-400", badge: "bg-yellow-100 text-yellow-700" };
    if (r >= 50) return { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", badge: "bg-orange-100 text-orange-700" };
    return { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", badge: "bg-red-100 text-red-700" };
  };

  const colors = getColorScheme(rating);
  const accentColor = branding?.primaryColor || "#0B64A3";

  if (!hasAccess) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" style={{ color: accentColor }} />
            Safety Rating
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pt-0 flex-1 min-h-0 flex items-center justify-center">
          <p className="text-base text-muted-foreground">No access</p>
        </CardContent>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" style={{ color: accentColor }} />
            Safety Rating
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pt-0 flex-1 min-h-0">
          <div className="animate-pulse h-16 bg-muted rounded" />
        </CardContent>
      </div>
    );
  }

  const wssScore = wssData?.wssScore ?? 0;
  const wssColors = getColorScheme(wssScore);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" style={{ color: accentColor }} />
          Safety Ratings
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pt-0 flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {/* CSR Section (clickable) */}
          <div 
            className={`rounded-lg p-3 w-full ${colors.bg} cursor-pointer hover-elevate`}
            onClick={() => setShowCSRDialog(true)}
            data-testid="button-csr-details"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className={`text-xl font-bold ${colors.text}`} data-testid="text-safety-rating-value">
                    {Math.round(rating)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Company Safety</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge className={colors.badge}>
                  {rating >= 70 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {rating >= 90 ? "Excellent" : rating >= 70 ? "Good" : rating >= 50 ? "Warning" : "Critical"}
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          {/* WSS Section - Educational metric (clickable) */}
          {!wssLoading && wssData && (
            <div 
              className={`rounded-lg p-2 w-full ${wssColors.bg} border border-dashed border-muted-foreground/30 cursor-pointer hover-elevate`}
              onClick={() => setShowWSSDialog(true)}
              data-testid="button-wss-details"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className={`text-lg font-semibold ${wssColors.text}`} data-testid="text-wss-value">
                      {wssScore}%
                    </p>
                    <p className="text-xs text-muted-foreground">Workforce Safety</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">
                    {wssData.employeeCount} emp
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* CSR Details Dialog */}
      <Dialog open={showCSRDialog} onOpenChange={setShowCSRDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Company Safety Rating (CSR)
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className={`rounded-lg p-4 ${colors.bg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-3xl font-bold ${colors.text}`}>
                    {Math.round(rating)}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Current Rating: {csrData?.csrLabel || "Unknown"}
                  </p>
                </div>
                <Badge className={colors.badge}>
                  {rating >= 90 ? "Excellent" : rating >= 70 ? "Good" : rating >= 50 ? "Warning" : "Critical"}
                </Badge>
              </div>
            </div>
            
            <div className="text-sm bg-muted/50 rounded-md p-3 space-y-2">
              <p className="font-medium">What is CSR?</p>
              <p className="text-muted-foreground text-xs">
                The Company Safety Rating measures your company's overall safety compliance based on:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-center gap-1"><ClipboardCheck className="w-3 h-3" /> Harness inspections</div>
                <div className="flex items-center gap-1"><FileCheck className="w-3 h-3" /> Toolbox meetings</div>
                <div className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> FLHA compliance</div>
                <div className="flex items-center gap-1"><Building2 className="w-3 h-3" /> Incident reports</div>
              </div>
              <p className="text-muted-foreground text-xs pt-2">
                This rating affects your company's reputation with property managers and clients.
              </p>
            </div>
            
            <div>
              <p className="font-medium text-sm flex items-center gap-1 mb-2">
                <History className="w-4 h-4" /> Rating History
              </p>
              <ScrollArea className="h-[200px] pr-2">
                {csrHistoryLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-muted rounded-md h-12" />
                    ))}
                  </div>
                ) : csrHistory?.history && csrHistory.history.length > 0 ? (
                  <div className="space-y-2">
                    {csrHistory.history.map((entry) => {
                      const change = entry.newScore - entry.previousScore;
                      const isPositive = change >= 0;
                      let formattedDate = "Unknown date";
                      try {
                        const date = new Date(entry.changedAt);
                        if (!isNaN(date.getTime())) {
                          formattedDate = format(date, "MMM d, yyyy");
                        }
                      } catch {
                        formattedDate = "Unknown date";
                      }
                      return (
                        <div 
                          key={entry.id} 
                          className="border rounded-md p-2 text-sm"
                          data-testid={`card-csr-history-${entry.id}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {formattedDate}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{Math.round(entry.previousScore)}%</span>
                              <span>{isPositive ? "+" : ""}{Math.round(change)}%</span>
                              <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
                                {Math.round(entry.newScore)}%
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{entry.changeReason}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <History className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No rating changes recorded yet</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* WSS Details Dialog */}
      <Dialog open={showWSSDialog} onOpenChange={setShowWSSDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Workforce Safety Score Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className={`rounded-lg p-3 ${wssColors.bg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-2xl font-bold ${wssColors.text}`}>
                    {wssScore}% WSS
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Workforce Safety Score
                  </p>
                </div>
                <Badge variant="outline">{wssData?.employeeCount || 0} employees</Badge>
              </div>
            </div>
            
            <div className="text-sm bg-muted/50 rounded-md p-3 space-y-2">
              <p className="font-medium">What is WSS?</p>
              <p className="text-muted-foreground text-xs">
                The Workforce Safety Score is the average of all employee Personal Safety Ratings (PSR). 
                Each employee's PSR is calculated from 4 components (25% each):
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-center gap-1"><Award className="w-3 h-3" /> Certifications status</div>
                <div className="flex items-center gap-1"><FileCheck className="w-3 h-3" /> Safety documents</div>
                <div className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Safety quizzes passed</div>
                <div className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> Work history</div>
              </div>
              <p className="text-muted-foreground text-xs pt-2 italic">
                This is an educational metric only and does not affect your CSR.
              </p>
            </div>
            
            <p className="font-medium text-sm">Employee PSR Breakdown</p>
            
            <ScrollArea className="h-[300px] pr-2">
              {wssDetailsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-muted rounded-md h-24" />
                  ))}
                </div>
              ) : wssDetails?.employees && wssDetails.employees.length > 0 ? (
                <div className="space-y-3">
                  {wssDetails.employees.map((emp) => {
                    const empColors = getColorScheme(emp.overallPSR);
                    return (
                      <div 
                        key={emp.id} 
                        className="border rounded-lg p-3 space-y-2"
                        data-testid={`card-employee-psr-${emp.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{emp.role}</p>
                          </div>
                          <Badge className={empColors.badge}>
                            {emp.overallPSR}% PSR
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <Award className="w-3 h-3" /> Certs
                              </span>
                              <span className="font-medium">{emp.components.certifications.score}%</span>
                            </div>
                            <Progress value={emp.components.certifications.score} className="h-1" />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <FileCheck className="w-3 h-3" /> Docs
                              </span>
                              <span className="font-medium">{emp.components.safetyDocs.score}%</span>
                            </div>
                            <Progress value={emp.components.safetyDocs.score} className="h-1" />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" /> Quizzes
                              </span>
                              <span className="font-medium">{emp.components.quizzes.score}%</span>
                            </div>
                            <Progress value={emp.components.quizzes.score} className="h-1" />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" /> Work
                              </span>
                              <span className="font-medium">{emp.components.workHistory.score}%</span>
                            </div>
                            <Progress value={emp.components.workHistory.score} className="h-1" />
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1">
                          <span>{emp.components.quizzes.passed}/{emp.components.quizzes.total} quizzes</span>
                          <span>{emp.components.safetyDocs.recentInspections} recent inspections</span>
                          <span>{emp.components.workHistory.sessions} work sessions</span>
                          {emp.components.workHistory.incidents > 0 && (
                            <span className="text-destructive">{emp.components.workHistory.incidents} incidents</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No employee PSR data available</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
