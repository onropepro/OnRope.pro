import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, ChevronRight, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { hasFinancialAccess } from "@/lib/permissions";
import { format } from "date-fns";
import type { CardProps } from "../cardRegistry";

interface PayPeriodData {
  startDate: string;
  endDate: string;
  totalHours: number;
  totalCost: number;
  employeeCount: number;
}

export function PayPeriodCard({ currentUser, onRouteNavigate, branding }: CardProps) {
  const hasAccess = hasFinancialAccess(currentUser) || currentUser?.role === "company";
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data: payData, isLoading } = useQuery<PayPeriodData>({
    queryKey: ["/api/current-pay-period"],
    enabled: hasAccess,
  });

  if (!hasAccess) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5" style={{ color: accentColor }} />
            Pay Period
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
            <DollarSign className="w-5 h-5" style={{ color: accentColor }} />
            Pay Period
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </CardContent>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5" style={{ color: accentColor }} />
            Current Pay Period
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        <div className="space-y-3">
          {payData && (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(payData.startDate), "MMM d")} - {format(new Date(payData.endDate), "MMM d, yyyy")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-xl font-bold" data-testid="text-period-hours">
                    {payData.totalHours.toFixed(1)}h
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Est. Labor Cost</p>
                  <p className="text-xl font-bold" data-testid="text-period-cost">
                    {formatCurrency(payData.totalCost)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {payData.employeeCount} employees with hours
              </p>
            </>
          )}
          {!payData && (
            <div className="h-full flex items-center justify-center">
              <p className="text-base text-muted-foreground">No pay period data available</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => onRouteNavigate("/payroll")}
            data-testid="button-view-payroll"
          >
            View Payroll
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </div>
  );
}
