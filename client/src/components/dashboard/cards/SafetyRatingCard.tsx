import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, TrendingUp, TrendingDown, Users } from "lucide-react";
import { canViewCSR } from "@/lib/permissions";
import type { CardProps } from "../cardRegistry";

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

export function SafetyRatingCard({ currentUser, branding }: CardProps) {
  const hasAccess = canViewCSR(currentUser);
  
  const { data: csrData, isLoading } = useQuery<CSRData>({
    queryKey: ["/api/company-safety-rating"],
    enabled: hasAccess,
  });
  
  const { data: wssData, isLoading: wssLoading } = useQuery<WSSData>({
    queryKey: ["/api/workforce-safety-score"],
    enabled: hasAccess,
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
        
        {/* WSS Section - Educational metric */}
        {!wssLoading && wssData && (
          <div className={`rounded-lg p-3 w-full ${wssColors.bg} border border-dashed border-muted-foreground/30`}>
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
              <div className="text-right">
                <Badge variant="outline" className="text-xs">
                  {wssData.employeeCount} employees
                </Badge>
                <p className="text-xs text-muted-foreground mt-1 italic">
                  Educational only
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
