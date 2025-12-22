import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ChevronRight, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { hasFinancialAccess, canAccessQuotes } from "@/lib/permissions";
import type { CardProps } from "../cardRegistry";

interface QuoteData {
  pendingCount: number;
  pendingValue: number;
  sentThisWeek: number;
}

export function OutstandingQuotesCard({ currentUser, onRouteNavigate, branding }: CardProps) {
  const hasAccess = hasFinancialAccess(currentUser) || canAccessQuotes(currentUser) || currentUser?.role === "company";
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data: quoteData, isLoading } = useQuery<QuoteData>({
    queryKey: ["/api/quote-summary"],
    enabled: hasAccess,
  });

  if (!hasAccess) {
    return (
      <>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: accentColor }} />
            Outstanding Quotes
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
            <FileText className="w-5 h-5" style={{ color: accentColor }} />
            Outstanding Quotes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-muted rounded" />
            <div className="h-8 bg-muted rounded" />
          </div>
        </CardContent>
      </>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <>
      <CardHeader className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: accentColor }} />
            Outstanding Quotes
          </CardTitle>
          {(quoteData?.pendingCount || 0) > 0 && (
            <Badge variant="secondary" className="text-xs" data-testid="badge-pending-quotes">
              {quoteData?.pendingCount} pending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold" data-testid="text-pending-count">
                {quoteData?.pendingCount || 0}
              </p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Value</p>
              <p className="text-xl font-bold flex items-center" data-testid="text-pending-value">
                {formatCurrency(quoteData?.pendingValue || 0)}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {quoteData?.sentThisWeek || 0} quotes sent this week
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => onRouteNavigate("/quotes")}
            data-testid="button-view-quotes"
          >
            View All Quotes
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </>
  );
}
