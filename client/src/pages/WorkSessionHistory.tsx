import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default function WorkSessionHistory() {
  const [, params] = useRoute("/projects/:id/work-sessions");
  const [, setLocation] = useLocation();
  const projectId = params?.id;

  // Fetch project details
  const { data: projectData } = useQuery({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Fetch work sessions for this project
  const { data: workSessionsData } = useQuery({
    queryKey: ["/api/projects", projectId, "work-sessions"],
    enabled: !!projectId,
  });

  const project = projectData?.project;
  const workSessions = workSessionsData?.sessions || [];

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const completedDrops = workSessions
    .filter((s: any) => s.dropsCompleted !== null)
    .reduce((sum: number, s: any) => sum + (s.dropsCompleted || 0), 0);
  
  const progressPercent = project.totalDrops > 0 
    ? Math.round((completedDrops / project.totalDrops) * 100) 
    : 0;
  
  const floorsCompleted = project.floorCount > 0
    ? Math.floor((completedDrops / project.totalDrops) * project.floorCount)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/management")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{project.buildingName || project.strataPlanNumber}</h1>
            <p className="text-sm text-muted-foreground">Work Session History</p>
          </div>
        </div>

        {/* Project Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Building Visualization */}
            <div className="flex justify-center">
              <HighRiseBuilding
                floorCount={project.floorCount}
                floorsCompleted={floorsCompleted}
                progressPercent={progressPercent}
                completedDrops={completedDrops}
                totalDrops={project.totalDrops}
              />
            </div>

            {/* Progress Stats */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {completedDrops} of {project.totalDrops} drops completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Work Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
          </CardHeader>
          <CardContent>
            {workSessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No work sessions recorded yet
              </p>
            ) : (
              <div className="space-y-3">
                {workSessions.map((session: any) => {
                  const sessionDate = new Date(session.workDate);
                  const isCompleted = session.endTime !== null;
                  const metTarget = session.dropsCompleted >= project.dailyDropTarget;

                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover-elevate"
                      data-testid={`session-${session.id}`}
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {format(sessionDate, "EEEE, MMM d, yyyy")}
                          </p>
                          {isCompleted ? (
                            <Badge variant={metTarget ? "default" : "secondary"}>
                              {metTarget ? "Target Met" : "Below Target"}
                            </Badge>
                          ) : (
                            <Badge variant="outline">In Progress</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Tech: {session.techName || "Unknown"}
                        </p>
                        {isCompleted && (
                          <>
                            <p className="text-sm">
                              Drops: {session.dropsCompleted} / {project.dailyDropTarget} target
                            </p>
                            {session.shortfallReason && (
                              <p className="text-sm text-muted-foreground italic">
                                Note: {session.shortfallReason}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {isCompleted && (
                          <p>
                            {format(new Date(session.startTime), "h:mm a")} -{" "}
                            {format(new Date(session.endTime), "h:mm a")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
