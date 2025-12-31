import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ChevronRight, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import type { CardProps } from "../cardRegistry";

interface ExpiringCert {
  employeeId: string;
  employeeName: string;
  certType: string;
  daysUntilExpiry: number;
}

interface ExpiringCertsData {
  certs: ExpiringCert[];
  count: number;
}

export function ExpiringCertsCard({ onRouteNavigate, branding }: CardProps) {
  const { t } = useLanguage();
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data, isLoading } = useQuery<ExpiringCertsData>({
    queryKey: ["/api/expiring-certs"],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.expiringCerts.title", "Expiring Certs")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse h-20 bg-muted rounded" />
        </CardContent>
      </div>
    );
  }

  const hasData = data && data.count > 0;

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Award className="w-5 h-5" style={{ color: accentColor }} />
          {t("dashboardCards.expiringCerts.title", "Expiring Certs")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        {hasData ? (
          <div className="space-y-3">
            <div className="text-center mb-2">
              <p className="text-2xl font-bold text-amber-600" data-testid="text-expiring-count">
                {data!.count}
              </p>
              <p className="text-sm text-muted-foreground">{t("dashboardCards.expiringCerts.within60Days", "Within 60 days")}</p>
            </div>
            <div className="space-y-2">
              {data!.certs.slice(0, 3).map((cert, idx) => (
                <div
                  key={`${cert.employeeId}-${idx}`}
                  className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded"
                  data-testid={`row-cert-${cert.employeeId}-${idx}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{cert.employeeName}</p>
                    <p className="text-xs text-muted-foreground truncate">{cert.certType}</p>
                  </div>
                  <span className={`text-xs ml-2 ${cert.daysUntilExpiry <= 14 ? 'text-destructive' : 'text-amber-600'}`}>
                    {cert.daysUntilExpiry}d
                  </span>
                </div>
              ))}
              {data!.count > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{data!.count - 3} {t("dashboardCards.expiringCerts.more", "more")}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => onRouteNavigate("/employees")}
              data-testid="button-view-expiring-certs"
            >
              {t("dashboardCards.expiringCerts.viewEmployees", "View Employees")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <ShieldCheck className="w-10 h-10 text-muted-foreground/50 mb-2" />
            <p className="text-base text-muted-foreground">{t("dashboardCards.expiringCerts.noCerts", "No expiring certifications")}</p>
            <p className="text-sm text-muted-foreground/70">{t("dashboardCards.expiringCerts.allCurrent", "All certs current")}</p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
