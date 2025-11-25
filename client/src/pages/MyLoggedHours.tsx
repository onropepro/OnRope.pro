import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { parseLocalDate } from "@/lib/dateUtils";
import { IRATA_TASK_TYPES, type IrataTaskLog } from "@shared/schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

const getTaskLabel = (taskId: string): string => {
  const task = IRATA_TASK_TYPES.find(t => t.id === taskId);
  return task?.label || taskId;
};

const getTaskIcon = (taskId: string): string => {
  const icons: Record<string, string> = {
    rope_transfer: "swap_horiz",
    re_anchor: "anchor",
    ascending: "arrow_upward",
    descending: "arrow_downward",
    rigging: "settings",
    deviation: "turn_slight_right",
    aid_climbing: "terrain",
    edge_transition: "open_in_new",
    knot_passing: "link",
    rope_to_rope_transfer: "compare_arrows",
    mid_rope_changeover: "sync_alt",
    rescue_technique: "health_and_safety",
    hauling: "publish",
    lowering: "download",
    tensioned_rope: "linear_scale",
    horizontal_traverse: "swap_horiz",
    window_cleaning: "cleaning_services",
    building_inspection: "search",
    maintenance_work: "build",
    other: "more_horiz",
  };
  return icons[taskId] || "assignment";
};

export default function MyLoggedHours() {
  const [, setLocation] = useLocation();

  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: logsData, isLoading } = useQuery<{ logs: IrataTaskLog[] }>({
    queryKey: ["/api/my-irata-task-logs"],
  });

  const currentUser = userData?.user;
  const logs = logsData?.logs || [];

  const totalHours = logs.reduce((sum: number, log: IrataTaskLog) => {
    return sum + parseFloat(log.hoursWorked || "0");
  }, 0);

  const totalSessions = logs.length;

  const taskCounts: Record<string, number> = {};
  logs.forEach((log: IrataTaskLog) => {
    (log.tasksPerformed || []).forEach((taskId: string) => {
      taskCounts[taskId] = (taskCounts[taskId] || 0) + 1;
    });
  });

  const sortedTasks = Object.entries(taskCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const groupedByMonth: Record<string, IrataTaskLog[]> = {};
  logs.forEach((log: IrataTaskLog) => {
    const date = parseLocalDate(log.workDate);
    const monthKey = format(date, "MMMM yyyy");
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = [];
    }
    groupedByMonth[monthKey].push(log);
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading your logged hours...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-[100] bg-card border-b shadow-md">
        <div className="px-4 h-16 flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard")}
              data-testid="button-back"
            >
              <span className="material-icons">arrow_back</span>
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">My Logged Hours</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                IRATA Logbook for {currentUser?.name}
              </p>
            </div>
          </div>
          {currentUser?.irataLevel && (
            <Badge variant="outline" className="hidden sm:flex items-center gap-1">
              <span className="material-icons text-sm">verified</span>
              IRATA {currentUser.irataLevel}
            </Badge>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="material-icons text-lg">schedule</span>
                Total Hours Logged
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalHours.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {totalSessions} session{totalSessions !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="material-icons text-lg">assignment_turned_in</span>
                Work Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalSessions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Sessions with logged tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="material-icons text-lg">trending_up</span>
                Top Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedTasks.length > 0 ? (
                <div className="space-y-1">
                  {sortedTasks.slice(0, 3).map(([taskId, count]) => (
                    <div key={taskId} className="flex items-center justify-between">
                      <span className="text-sm truncate">{getTaskLabel(taskId)}</span>
                      <Badge variant="secondary" className="text-xs">{count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tasks logged yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {sortedTasks.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="material-icons">bar_chart</span>
                Task Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(taskCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([taskId, count]) => (
                    <Badge
                      key={taskId}
                      variant="outline"
                      className="flex items-center gap-1 px-3 py-1.5"
                    >
                      <span className="material-icons text-sm">{getTaskIcon(taskId)}</span>
                      <span>{getTaskLabel(taskId)}</span>
                      <span className="ml-1 px-1.5 rounded-full bg-muted text-xs font-semibold">
                        {count}
                      </span>
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="material-icons">history</span>
              Session History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-icons text-6xl text-muted-foreground/30">assignment</span>
                <h3 className="text-lg font-medium mt-4">No logged hours yet</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  When you end a work session, you'll be prompted to log the IRATA tasks you performed. 
                  Your logged hours will appear here for your IRATA certification logbook.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[500px] pr-4">
                <Accordion type="multiple" className="w-full">
                  {Object.entries(groupedByMonth).map(([month, monthLogs]) => {
                    const monthHours = monthLogs.reduce((sum, log) => sum + parseFloat(log.hoursWorked || "0"), 0);
                    return (
                      <AccordionItem key={month} value={month}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-2">
                              <span className="material-icons text-sm">calendar_month</span>
                              <span className="font-medium">{month}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary">{monthLogs.length} session{monthLogs.length !== 1 ? "s" : ""}</Badge>
                              <span className="text-sm text-muted-foreground">{monthHours.toFixed(1)} hrs</span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pl-6">
                            {monthLogs.map((log) => (
                              <div
                                key={log.id}
                                className="p-4 rounded-md border bg-card hover-elevate"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                  <div>
                                    <div className="font-medium flex items-center gap-2">
                                      <span className="material-icons text-sm">apartment</span>
                                      {log.buildingName || "Unknown Building"}
                                    </div>
                                    {log.buildingAddress && (
                                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                        <span className="material-icons text-xs">location_on</span>
                                        {log.buildingAddress}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm">
                                    <div className="flex items-center gap-1">
                                      <span className="material-icons text-sm text-muted-foreground">event</span>
                                      {format(parseLocalDate(log.workDate), "MMM d, yyyy")}
                                    </div>
                                    <Badge>{parseFloat(log.hoursWorked || "0").toFixed(1)} hrs</Badge>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                  {(log.tasksPerformed || []).map((taskId: string) => (
                                    <Badge
                                      key={taskId}
                                      variant="outline"
                                      className="text-xs flex items-center gap-1"
                                    >
                                      <span className="material-icons text-xs">{getTaskIcon(taskId)}</span>
                                      {getTaskLabel(taskId)}
                                    </Badge>
                                  ))}
                                </div>

                                {log.notes && (
                                  <div className="mt-3 p-2 bg-muted rounded-md text-sm text-muted-foreground">
                                    <span className="material-icons text-xs mr-1 align-middle">notes</span>
                                    {log.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {currentUser?.irataLevel && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="material-icons">info</span>
                IRATA Certification Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Current Level</div>
                  <div className="font-semibold">{currentUser.irataLevel}</div>
                </div>
                {currentUser.irataLicenseNumber && (
                  <div>
                    <div className="text-xs text-muted-foreground">License Number</div>
                    <div className="font-semibold">{currentUser.irataLicenseNumber}</div>
                  </div>
                )}
                {currentUser.irataIssuedDate && (
                  <div>
                    <div className="text-xs text-muted-foreground">Issued Date</div>
                    <div className="font-semibold">
                      {format(parseLocalDate(currentUser.irataIssuedDate), "MMM d, yyyy")}
                    </div>
                  </div>
                )}
                {currentUser.irataExpirationDate && (
                  <div>
                    <div className="text-xs text-muted-foreground">Expires</div>
                    <div className="font-semibold">
                      {format(parseLocalDate(currentUser.irataExpirationDate), "MMM d, yyyy")}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
