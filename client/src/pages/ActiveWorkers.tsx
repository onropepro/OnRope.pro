import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ActiveWorkers() {
  const [, setLocation] = useLocation();

  // Fetch all active work sessions
  const { data: activeWorkersData, isLoading } = useQuery({
    queryKey: ["/api/active-workers"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const activeWorkers = activeWorkersData?.sessions || [];

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg dot-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg dot-pattern pb-6">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/dashboard")}
              className="h-12 gap-2"
              data-testid="button-back"
            >
              <span className="material-icons">arrow_back</span>
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Active Workers</h1>
              <p className="text-sm text-muted-foreground">
                Real-time view of who's working where
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {activeWorkers.length} active
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {activeWorkers.length === 0 ? (
          <Card className="glass-card border-0 shadow-premium">
            <CardContent className="p-12 text-center">
              <span className="material-icons text-6xl text-muted-foreground mb-4">
                work_off
              </span>
              <h3 className="text-xl font-bold mb-2">No Active Workers</h3>
              <p className="text-muted-foreground">
                No one is currently clocked in on any projects
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeWorkers.map((session: any) => (
              <Card
                key={session.id}
                className="glass-card border-0 shadow-premium hover-elevate cursor-pointer"
                onClick={() => setLocation(`/projects/${session.projectId}`)}
                data-testid={`active-worker-${session.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="material-icons text-primary">person</span>
                        {session.techName || 'Unknown Worker'}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {session.projectName || 'Unknown Project'}
                      </CardDescription>
                    </div>
                    <Badge variant="default" className="bg-primary">
                      <span className="material-icons text-xs mr-1">schedule</span>
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Started At
                      </div>
                      <div className="text-base font-medium flex items-center gap-1">
                        <span className="material-icons text-sm">login</span>
                        {session.startTime && format(new Date(session.startTime), 'h:mm a')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Duration
                      </div>
                      <div className="text-base font-medium flex items-center gap-1">
                        <span className="material-icons text-sm">timer</span>
                        {session.startTime && (() => {
                          const start = new Date(session.startTime);
                          const now = new Date();
                          const diff = now.getTime() - start.getTime();
                          const hours = Math.floor(diff / (1000 * 60 * 60));
                          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                          return `${hours}h ${minutes}m`;
                        })()}
                      </div>
                    </div>
                  </div>
                  {session.strataPlanNumber && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="material-icons text-sm">apartment</span>
                        {session.strataPlanNumber}
                        <span className="mx-1">•</span>
                        <span className="capitalize">
                          {session.jobType?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
