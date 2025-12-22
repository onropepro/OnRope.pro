import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ChevronRight } from "lucide-react";
import { canManageEmployees } from "@/lib/permissions";
import type { CardProps } from "../cardRegistry";

export function CertificationAlertsCard({ currentUser, employees, onNavigate, branding }: CardProps) {
  const hasAccess = canManageEmployees(currentUser) || currentUser?.role === "company";
  const accentColor = branding?.primaryColor || "#0B64A3";

  const activeEmployees = employees?.filter(
    (e: any) => e.status !== "terminated" && e.status !== "suspended"
  ) || [];

  const expiringCerts = activeEmployees.filter((emp: any) => {
    if (!emp.irataExpiry) return false;
    const expiryDate = new Date(emp.irataExpiry);
    const now = new Date();
    const sixtyDays = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    return expiryDate <= sixtyDays && expiryDate >= now;
  });

  const expiredCerts = activeEmployees.filter((emp: any) => {
    if (!emp.irataExpiry) return false;
    return new Date(emp.irataExpiry) < new Date();
  });

  if (!hasAccess) {
    return (
      <>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: accentColor }} />
            Certification Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-base text-muted-foreground">No access</p>
        </CardContent>
      </>
    );
  }

  const totalAlerts = expiringCerts.length + expiredCerts.length;

  return (
    <>
      <CardHeader className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: accentColor }} />
            Certification Alerts
          </CardTitle>
          {totalAlerts > 0 && (
            <Badge variant="destructive" className="text-xs" data-testid="badge-cert-alert-count">
              {totalAlerts}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {totalAlerts === 0 ? (
          <p className="text-base text-muted-foreground">All certifications up to date</p>
        ) : (
          <div className="space-y-3">
            {expiredCerts.length > 0 && (
              <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                <div>
                  <p className="text-base font-medium text-red-700 dark:text-red-400">
                    {expiredCerts.length} Expired
                  </p>
                  <p className="text-sm text-muted-foreground">Require immediate renewal</p>
                </div>
              </div>
            )}
            {expiringCerts.length > 0 && (
              <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                <div>
                  <p className="text-base font-medium text-amber-700 dark:text-amber-400">
                    {expiringCerts.length} Expiring Soon
                  </p>
                  <p className="text-sm text-muted-foreground">Within 60 days</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between mt-2"
              onClick={() => onNavigate("employees")}
              data-testid="button-view-certifications"
            >
              View All Certifications
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
}
