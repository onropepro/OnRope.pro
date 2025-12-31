import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ChevronRight } from "lucide-react";
import { canManageEmployees } from "@/lib/permissions";
import { useLanguage } from "@/hooks/use-language";
import type { CardProps } from "../cardRegistry";

export function CertificationAlertsCard({ currentUser, employees, onNavigate, branding }: CardProps) {
  const { t } = useLanguage();
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
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.certificationAlerts.title", "Certification Alerts")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0 flex items-center justify-center">
          <p className="text-base text-muted-foreground">{t("common.noAccess", "No access")}</p>
        </CardContent>
      </div>
    );
  }

  const totalAlerts = expiringCerts.length + expiredCerts.length;

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.certificationAlerts.title", "Certification Alerts")}
          </CardTitle>
          {totalAlerts > 0 && (
            <Badge variant="destructive" className="text-xs" data-testid="badge-cert-alert-count">
              {totalAlerts}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        {totalAlerts === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-base text-muted-foreground">{t("dashboardCards.certificationAlerts.allUpToDate", "All certifications up to date")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expiredCerts.length > 0 && (
              <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                <div>
                  <p className="text-base font-medium text-red-700 dark:text-red-400">
                    {expiredCerts.length} {t("common.expired", "Expired")}
                  </p>
                  <p className="text-sm text-muted-foreground">{t("dashboardCards.certificationAlerts.requireRenewal", "Require immediate renewal")}</p>
                </div>
              </div>
            )}
            {expiringCerts.length > 0 && (
              <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                <div>
                  <p className="text-base font-medium text-amber-700 dark:text-amber-400">
                    {expiringCerts.length} {t("common.expiringSoon", "Expiring Soon")}
                  </p>
                  <p className="text-sm text-muted-foreground">{t("dashboardCards.certificationAlerts.within60Days", "Within 60 days")}</p>
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
              {t("dashboardCards.certificationAlerts.viewAll", "View All Certifications")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </div>
  );
}
