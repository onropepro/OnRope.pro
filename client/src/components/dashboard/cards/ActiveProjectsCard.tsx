import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Briefcase, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { CardProps } from "../cardRegistry";

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
              const progress = typeof project.progress === "number" ? project.progress : 0;
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
