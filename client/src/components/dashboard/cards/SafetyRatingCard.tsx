import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, TrendingUp, TrendingDown } from "lucide-react";
import { canViewCSR } from "@/lib/permissions";
import type { CardProps } from "../cardRegistry";

interface CSRData {
  csrRating: number;
  csrLabel: string;
  csrColor: string;
}

export function SafetyRatingCard({ currentUser, branding }: CardProps) {
  const hasAccess = canViewCSR(currentUser);
  
  const { data: csrData, isLoading } = useQuery<CSRData>({
    queryKey: ["/api/company-safety-rating"],
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
      <>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" style={{ color: accentColor }} />
            Safety Rating
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-base text-muted-foreground">No access</p>
        </CardContent>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" style={{ color: accentColor }} />
            Safety Rating
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="animate-pulse h-16 bg-muted rounded" />
        </CardContent>
      </>
    );
  }

  return (
    <>
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" style={{ color: accentColor }} />
          Safety Rating (CSR)
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className={`rounded-lg p-4 ${colors.bg}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-3xl font-bold ${colors.text}`} data-testid="text-safety-rating-value">
                {Math.round(rating)}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {csrData?.csrLabel || "Company Safety Rating"}
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
      </CardContent>
    </>
  );
}
