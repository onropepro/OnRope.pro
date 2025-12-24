import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, TrendingUp, TrendingDown, Users, ChevronRight, Award, FileCheck, BookOpen, Briefcase } from "lucide-react";
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

interface CSRData {
  csrRating: number;
  csrLabel: string;
  csrColor: string;
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
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" style={{ color: accentColor }} />
            Safety Rating
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
            <ShieldCheck className="w-5 h-5" style={{ color: accentColor }} />
            Safety Rating
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse h-16 bg-muted rounded" />
        </CardContent>
      </div>
    );
  }

  const wssScore = wssData?.wssScore ?? 0;
  const wssColors = getColorScheme(wssScore);

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" style={{ color: accentColor }} />
          Safety Ratings
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 flex flex-col gap-3">
        {/* CSR Section */}
        <div className={`rounded-lg p-4 w-full ${colors.bg}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-3xl font-bold ${colors.text}`} data-testid="text-safety-rating-value">
                {Math.round(rating)}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {csrData?.csrLabel || "Company Safety Rating (CSR)"}
              </p>
            </div>
            <Badge className={colors.badge}>
              {rating >= 70 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {rating >= 90 ? "Excellent" : rating >= 70 ? "Good" : rating >= 50 ? "Warning" : "Critical"}
            </Badge>
          </div>
        </div>
        
        {/* WSS Section - Educational metric (clickable) */}
        {!wssLoading && wssData && (
          <div 
            className={`rounded-lg p-3 w-full ${wssColors.bg} border border-dashed border-muted-foreground/30 cursor-pointer hover-elevate`}
            onClick={() => setShowWSSDialog(true)}
            data-testid="button-wss-details"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className={`text-xl font-semibold ${wssColors.text}`} data-testid="text-wss-value">
                    {wssScore}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Workforce Safety Score (WSS)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {wssData.employeeCount} employees
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    Educational only
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
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
                    Average of all employee Personal Safety Ratings
                  </p>
                </div>
                <Badge variant="outline">{wssData?.employeeCount || 0} employees</Badge>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
              <p className="font-medium mb-1">PSR Components (25% each):</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1"><Award className="w-3 h-3" /> Certifications</div>
                <div className="flex items-center gap-1"><FileCheck className="w-3 h-3" /> Safety Documents</div>
                <div className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Safety Quizzes</div>
                <div className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> Work History</div>
              </div>
            </div>
            
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
