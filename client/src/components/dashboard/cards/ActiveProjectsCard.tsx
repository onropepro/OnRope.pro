import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Briefcase, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { CardProps } from "../cardRegistry";

// Helper function to calculate project progress based on job type
function calculateProjectProgress(project: any): number {
  const jobType = project.jobType || '';
  
  // Hours-based jobs (NDT, Rock Scaling, etc.)
  const hourBasedJobs = ['ndt_inspection', 'rock_scaling', 'concrete_repair', 'sign_installation', 'overhead_protection', 'general_repairs', 'general_pressure_washing', 'ground_window_cleaning'];
  if (hourBasedJobs.includes(jobType)) {
    // Check for overallCompletionPercentage first
    if (project.overallCompletionPercentage !== null && project.overallCompletionPercentage !== undefined) {
      return project.overallCompletionPercentage;
    }
    const estimatedHours = project.estimatedHours || 0;
    const hoursWorked = project.hoursWorked || 0;
    return estimatedHours > 0 ? Math.min(100, (hoursWorked / estimatedHours) * 100) : 0;
  } else if (jobType === 'in_suite_dryer_vent_cleaning') {
    // Suite-based - uses completedDrops for suites completed
    const totalSuites = project.totalSuites || project.floorCount || 0;
    const suitesCompleted = project.completedDrops || 0;
    return totalSuites > 0 ? (suitesCompleted / totalSuites) * 100 : 0;
  } else if (jobType === 'parkade_pressure_cleaning') {
    // Stall-based
    const totalStalls = project.totalStalls || project.floorCount || 0;
    const stallsCompleted = project.completedDrops || 0;
    return totalStalls > 0 ? (stallsCompleted / totalStalls) * 100 : 0;
  } else if (jobType === 'anchor_inspection') {
    // Anchor-based
    const totalAnchors = project.totalAnchors || 0;
    const anchorsInspected = project.totalAnchorsInspected || 0;
    return totalAnchors > 0 ? (anchorsInspected / totalAnchors) * 100 : 0;
  } else {
    // Drop-based (window cleaning, building wash, etc.)
    const totalDrops = project.totalDrops || 0;
    const completedDrops = project.completedDrops || 0;
    return totalDrops > 0 ? (completedDrops / totalDrops) * 100 : 0;
  }
}

export function ActiveProjectsCard({ projects, onNavigate, branding }: CardProps) {
  const accentColor = branding?.primaryColor || "#0B64A3";

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
            Active Projects
          </CardTitle>
          <Badge variant="secondary" className="text-xs" data-testid="badge-active-project-count">
            {activeProjects.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        {displayProjects.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-base text-muted-foreground">No active projects</p>
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
                      {project.buildingName || project.name || "Untitled"}
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
                View All ({activeProjects.length})
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </div>
  );
}
