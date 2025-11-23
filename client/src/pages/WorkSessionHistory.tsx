import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { hasFinancialAccess } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { ArrowLeft, ChevronDown, ChevronRight, Sparkles, MapPin } from "lucide-react";
import { format, getYear, getMonth } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useMemo, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SessionDetailsDialog } from "@/components/SessionDetailsDialog";

export default function WorkSessionHistory() {
  const [, params] = useRoute("/projects/:id/work-sessions");
  const [, setLocation] = useLocation();
  const projectId = params?.id;
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showSessionDialog, setShowSessionDialog] = useState(false);

  // Fetch current user to check role
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

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

  // Fetch all non-billable sessions for the company (management only)
  const { data: nonBillableData } = useQuery({
    queryKey: ["/api/non-billable-sessions"],
    enabled: !!userData?.user && (userData.user.role === "company" || userData.user.role === "operations_manager" || userData.user.role === "supervisor"),
  });

  const user = userData?.user;
  const project = projectData?.project;
  const allWorkSessions = workSessionsData?.sessions || [];
  const nonBillableSessions = nonBillableData?.sessions || [];
  
  // Check if user is management (show pie chart only for management)
  const isManagement = user?.role === "company" || 
                       user?.role === "operations_manager" || 
                       user?.role === "supervisor";

  // Group sessions by year, month, and day
  const groupedSessions = useMemo(() => {
    const groups: Record<string, Record<string, Record<string, any[]>>> = {};
    
    allWorkSessions.forEach((session: any) => {
      const sessionDate = new Date(session.workDate);
      const year = getYear(sessionDate).toString();
      const month = format(sessionDate, "MMMM");
      const day = format(sessionDate, "yyyy-MM-dd");
      
      if (!groups[year]) groups[year] = {};
      if (!groups[year][month]) groups[year][month] = {};
      if (!groups[year][month][day]) groups[year][month][day] = [];
      
      groups[year][month][day].push(session);
    });
    
    return groups;
  }, [allWorkSessions]);

  // Get sorted years (newest first)
  const sortedYears = Object.keys(groupedSessions).sort((a, b) => parseInt(b) - parseInt(a));

  // Collapsible state
  const [openYears, setOpenYears] = useState<Record<string, boolean>>({});
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});

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

  // Calculate total drops from elevation-specific fields
  const totalDrops = (project.totalDropsNorth ?? 0) + (project.totalDropsEast ?? 0) + 
                     (project.totalDropsSouth ?? 0) + (project.totalDropsWest ?? 0);

  // Calculate completed drops from work sessions (elevation-specific)
  const completedSessions = allWorkSessions.filter((s: any) => s.endTime !== null);
  
  const completedDropsNorth = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedNorth ?? 0), 0);
  const completedDropsEast = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedEast ?? 0), 0);
  const completedDropsSouth = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedSouth ?? 0), 0);
  const completedDropsWest = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedWest ?? 0), 0);
  
  const completedDrops = completedDropsNorth + completedDropsEast + completedDropsSouth + completedDropsWest;
  
  const progressPercent = totalDrops > 0 
    ? Math.round((completedDrops / totalDrops) * 100) 
    : 0;

  // Calculate target met statistics (sum all elevation drops per session)
  const targetMetCount = completedSessions.filter((s: any) => {
    const totalSessionDrops = (s.dropsCompletedNorth ?? 0) + (s.dropsCompletedEast ?? 0) + 
                              (s.dropsCompletedSouth ?? 0) + (s.dropsCompletedWest ?? 0);
    return totalSessionDrops >= project.dailyDropTarget;
  }).length;
  
  const belowTargetCount = completedSessions.filter((s: any) => {
    const totalSessionDrops = (s.dropsCompletedNorth ?? 0) + (s.dropsCompletedEast ?? 0) + 
                              (s.dropsCompletedSouth ?? 0) + (s.dropsCompletedWest ?? 0);
    return totalSessionDrops < project.dailyDropTarget;
  }).length;
  
  const pieData = [
    { name: "Target Met", value: targetMetCount, color: "hsl(var(--primary))" },
    { name: "Below Target", value: belowTargetCount, color: "hsl(var(--destructive))" },
  ];

  // Calculate billable vs non-billable hours
  const billableHours = completedSessions.reduce((sum: number, session: any) => {
    if (session.startTime && session.endTime) {
      const hours = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60);
      return sum + hours;
    }
    return sum;
  }, 0);

  const completedNonBillable = nonBillableSessions.filter((s: any) => s.endTime !== null);
  const nonBillableHours = completedNonBillable.reduce((sum: number, session: any) => {
    if (session.startTime && session.endTime) {
      const hours = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60);
      return sum + hours;
    }
    return sum;
  }, 0);

  const hoursData = [
    { name: "Billable Hours", value: parseFloat(billableHours.toFixed(2)), color: "hsl(var(--primary))" },
    { name: "Non-Billable Hours", value: parseFloat(nonBillableHours.toFixed(2)), color: "hsl(var(--chart-2))" },
  ];

  // Generate sample sessions mutation (company only)
  const generateSampleMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/generate-sample-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate sample sessions");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "work-sessions"] });
      toast({
        title: "Sample data generated",
        description: `Created ${data.count} sample work sessions across multiple years`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation(`/projects/${projectId}`)}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{project.buildingName || project.strataPlanNumber}</h1>
            <p className="text-sm text-muted-foreground">Work Session History</p>
          </div>
          {user?.role === "company" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateSampleMutation.mutate()}
              disabled={generateSampleMutation.isPending}
              data-testid="button-generate-sample"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {generateSampleMutation.isPending ? "Generating..." : "Generate Sample Data"}
            </Button>
          )}
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
                floors={project.floorCount}
                totalDropsNorth={project.totalDropsNorth ?? 0}
                totalDropsEast={project.totalDropsEast ?? 0}
                totalDropsSouth={project.totalDropsSouth ?? 0}
                totalDropsWest={project.totalDropsWest ?? 0}
                completedDropsNorth={completedDropsNorth}
                completedDropsEast={completedDropsEast}
                completedDropsSouth={completedDropsSouth}
                completedDropsWest={completedDropsWest}
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
                {completedDrops} of {totalDrops} drops completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Target Performance Chart - Management Only */}
        {isManagement && completedSessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Target Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{targetMetCount}</div>
                    <div className="text-sm text-muted-foreground">Target Met</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{belowTargetCount}</div>
                    <div className="text-sm text-muted-foreground">Below Target</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billable vs Non-Billable Hours Chart - Management Only */}
        {isManagement && (billableHours > 0 || nonBillableHours > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Hours Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={hoursData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => 
                        `${name}: ${value}h (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {hoursData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{billableHours.toFixed(2)}h</div>
                    <div className="text-sm text-muted-foreground">Billable Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: "hsl(var(--chart-2))" }}>{nonBillableHours.toFixed(2)}h</div>
                    <div className="text-sm text-muted-foreground">Non-Billable Hours</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-lg font-semibold">Total Hours: {(billableHours + nonBillableHours).toFixed(2)}h</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Work Sessions List - Organized by Year/Month/Day */}
        <Card>
          <CardHeader>
            <CardTitle>Session History ({allWorkSessions.length} total)</CardTitle>
          </CardHeader>
          <CardContent>
            {allWorkSessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No work sessions recorded yet
              </p>
            ) : (
              <div className="space-y-4">
                {sortedYears.map((year) => {
                  const monthsInYear = Object.keys(groupedSessions[year]);
                  const sortedMonths = monthsInYear.sort((a, b) => {
                    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    return monthOrder.indexOf(b) - monthOrder.indexOf(a);
                  });
                  
                  return (
                    <Collapsible
                      key={year}
                      open={openYears[year]}
                      onOpenChange={(open) => setOpenYears({ ...openYears, [year]: open })}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between text-lg font-semibold"
                          data-testid={`button-year-${year}`}
                        >
                          <span>{year}</span>
                          {openYears[year] ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-4 mt-2 space-y-3">
                        {sortedMonths.map((month) => {
                          const daysInMonth = Object.keys(groupedSessions[year][month]);
                          const sortedDays = daysInMonth.sort((a, b) => b.localeCompare(a));
                          
                          return (
                            <Collapsible
                              key={`${year}-${month}`}
                              open={openMonths[`${year}-${month}`]}
                              onOpenChange={(open) => setOpenMonths({ ...openMonths, [`${year}-${month}`]: open })}
                            >
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-between font-medium"
                                  data-testid={`button-month-${year}-${month}`}
                                >
                                  <span>{month}</span>
                                  {openMonths[`${year}-${month}`] ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="ml-4 mt-2 space-y-2">
                                {sortedDays.map((day) => {
                                  const sessionsOnDay = groupedSessions[year][month][day];
                                  
                                  return (
                                    <Collapsible
                                      key={day}
                                      open={openDays[day]}
                                      onOpenChange={(open) => setOpenDays({ ...openDays, [day]: open })}
                                    >
                                      <CollapsibleTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          className="w-full justify-between text-sm"
                                          data-testid={`button-day-${day}`}
                                        >
                                          <span>{format(new Date(day), "EEEE, MMM d")}</span>
                                          <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{sessionsOnDay.length}</Badge>
                                            {openDays[day] ? (
                                              <ChevronDown className="h-4 w-4" />
                                            ) : (
                                              <ChevronRight className="h-4 w-4" />
                                            )}
                                          </div>
                                        </Button>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent className="ml-4 mt-2 space-y-2">
                                        {sessionsOnDay.map((session: any) => {
                                          const isCompleted = session.endTime !== null;
                                          const sessionDrops = (session.dropsCompletedNorth ?? 0) + (session.dropsCompletedEast ?? 0) + 
                                                               (session.dropsCompletedSouth ?? 0) + (session.dropsCompletedWest ?? 0);
                                          const metTarget = sessionDrops >= project.dailyDropTarget;
                                          const hasLocation = session.startLatitude || session.endLatitude;

                                          return (
                                            <div
                                              key={session.id}
                                              className="p-3 rounded-lg border bg-card hover-elevate cursor-pointer active-elevate-2"
                                              data-testid={`session-${session.id}`}
                                              onClick={() => {
                                                setSelectedSession(session);
                                                setShowSessionDialog(true);
                                              }}
                                            >
                                              <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                  <p className="font-medium text-sm">
                                                    Tech: {session.techName || "Unknown"}
                                                  </p>
                                                  {hasLocation && (
                                                    <MapPin className="h-4 w-4 text-primary" title="GPS location available" />
                                                  )}
                                                  {isCompleted ? (
                                                    <Badge variant={metTarget ? "default" : "destructive"} data-testid={`badge-${metTarget ? "met" : "below"}-target`}>
                                                      {metTarget ? "Target Met" : "Below Target"}
                                                    </Badge>
                                                  ) : (
                                                    <Badge variant="outline">In Progress</Badge>
                                                  )}
                                                </div>
                                                {isCompleted && (
                                                  <>
                                                    <p className="text-sm">
                                                      Drops: {sessionDrops} / {project.dailyDropTarget} target
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                      {format(new Date(session.startTime), "h:mm a")} -{" "}
                                                      {format(new Date(session.endTime), "h:mm a")}
                                                    </p>
                                                    {session.shortfallReason && (
                                                      <p className="text-sm text-muted-foreground italic">
                                                        Note: {session.shortfallReason}
                                                      </p>
                                                    )}
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </CollapsibleContent>
                                    </Collapsible>
                                  );
                                })}
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Session Details Dialog with Map */}
      <SessionDetailsDialog
        open={showSessionDialog}
        onOpenChange={setShowSessionDialog}
        session={selectedSession}
        employeeName={selectedSession?.techName}
        projectName={project?.buildingName || project?.strataPlanNumber}
        jobType={project?.jobType}
        hasFinancialPermission={hasFinancialAccess(userData?.user)}
      />
    </div>
  );
}
