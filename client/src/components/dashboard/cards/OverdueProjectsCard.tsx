import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronRight, FolderCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import type { CardProps } from "../cardRegistry";

interface OverdueProject {
  id: string;
  name: string;
  daysOverdue: number;
}

interface OverdueProjectsData {
  projects: OverdueProject[];
  count: number;
}

export function OverdueProjectsCard({ onRouteNavigate, branding }: CardProps) {
  const { t } = useLanguage();
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data, isLoading } = useQuery<OverdueProjectsData>({
    queryKey: ["/api/overdue-projects"],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.overdueProjects.title", "Overdue Projects")}
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
          <AlertTriangle className="w-5 h-5" style={{ color: accentColor }} />
          {t("dashboardCards.overdueProjects.title", "Overdue Projects")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        {hasData ? (
          <div className="space-y-3">
            <div className="text-center mb-2">
              <p className="text-2xl font-bold text-destructive" data-testid="text-overdue-count">
                {data!.count}
              </p>
              <p className="text-sm text-muted-foreground">{t("common.pastDueDate", "Past due date")}</p>
            </div>
            <div className="space-y-2">
              {data!.projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded"
                  data-testid={`row-overdue-${project.id}`}
                >
                  <span className="font-medium truncate flex-1">{project.name}</span>
                  <span className="text-destructive text-xs ml-2">
                    {project.daysOverdue}d {t("common.overdue", "overdue")}
                  </span>
                </div>
              ))}
              {data!.count > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{data!.count - 3} {t("common.more", "more")}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => onRouteNavigate("/projects")}
              data-testid="button-view-overdue"
            >
              {t("dashboardCards.overdueProjects.viewProjects", "View Projects")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <FolderCheck className="w-10 h-10 text-muted-foreground/50 mb-2" />
            <p className="text-base text-muted-foreground">{t("dashboardCards.overdueProjects.noOverdue", "No overdue projects")}</p>
            <p className="text-sm text-muted-foreground/70">{t("dashboardCards.overdueProjects.allOnTrack", "All projects on track")}</p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
