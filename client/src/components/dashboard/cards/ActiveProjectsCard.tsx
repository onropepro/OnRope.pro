import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Briefcase, ChevronRight, Plus } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import type { CardProps } from "../cardRegistry";

function isReadOnly(user: any): boolean {
  if (!user) return true;
  const role = user.role?.toLowerCase();
  if (role === 'owner' || role === 'superuser') return false;
  const permissions = user.permissions || [];
  return permissions.includes('read_only') || permissions.length === 0;
}

function calculateProjectProgress(project: any): number {
  const jobType = project.jobType || '';
  
  const hourBasedJobs = ['ndt_inspection', 'rock_scaling', 'concrete_repair', 'sign_installation', 'overhead_protection', 'general_repairs', 'general_pressure_washing', 'ground_window_cleaning'];
  if (hourBasedJobs.includes(jobType)) {
    if (project.overallCompletionPercentage !== null && project.overallCompletionPercentage !== undefined) {
      return project.overallCompletionPercentage;
    }
    const estimatedHours = project.estimatedHours || 0;
    const hoursWorked = project.hoursWorked || 0;
    return estimatedHours > 0 ? Math.min(100, (hoursWorked / estimatedHours) * 100) : 0;
  } else if (jobType === 'in_suite_dryer_vent_cleaning') {
    const totalSuites = project.totalSuites || project.floorCount || 0;
    const suitesCompleted = project.completedDrops || 0;
    return totalSuites > 0 ? (suitesCompleted / totalSuites) * 100 : 0;
  } else if (jobType === 'parkade_pressure_cleaning') {
    const totalStalls = project.totalStalls || project.floorCount || 0;
    const stallsCompleted = project.completedDrops || 0;
    return totalStalls > 0 ? (stallsCompleted / totalStalls) * 100 : 0;
  } else if (jobType === 'anchor_inspection') {
    const totalAnchors = project.totalAnchors || 0;
    const anchorsInspected = project.totalAnchorsInspected || 0;
    return totalAnchors > 0 ? (anchorsInspected / totalAnchors) * 100 : 0;
  } else {
    const totalDrops = project.totalDrops || 0;
    const completedDrops = project.completedDrops || 0;
    return totalDrops > 0 ? (completedDrops / totalDrops) * 100 : 0;
  }
}

export function ActiveProjectsCard({ projects, onNavigate, onCreateProject, currentUser, branding }: CardProps) {
  const { t } = useLanguage();
  const accentColor = branding?.primaryColor || "#0B64A3";
  const canCreate = !isReadOnly(currentUser);

  const activeProjects = projects?.filter(
    (p: any) => p.status === "active" || p.status === "in_progress"
  ) || [];

  const displayProjects = activeProjects.slice(0, 4);

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.activeProjects.title", "Active Projects")}
          </CardTitle>
          <div className="flex items-center gap-2">
            {canCreate && onCreateProject && (
              <Button
                size="icon"
                variant="ghost"
                onClick={onCreateProject}
                data-testid="button-quick-create-project"
                title={t("dashboardCards.activeProjects.createNew", "Create new project")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
            <Badge variant="secondary" className="text-xs" data-testid="badge-active-project-count">
              {activeProjects.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        {displayProjects.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-base text-muted-foreground">{t("dashboardCards.activeProjects.noProjects", "No active projects")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayProjects.map((project: any) => {
              const progress = calculateProjectProgress(project);
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block space-y-1 rounded-md p-2 -mx-2 hover-elevate cursor-pointer"
                  data-testid={`link-project-${project.id}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-base font-medium truncate">
                      {project.buildingName || project.name || t("common.untitled", "Untitled")}
                    </p>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </Link>
              );
            })}
            {activeProjects.length > 4 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={() => onNavigate("projects")}
                data-testid="button-view-all-projects"
              >
                {t("dashboardCards.activeProjects.viewAll", "View All")} ({activeProjects.length})
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </div>
  );
}
