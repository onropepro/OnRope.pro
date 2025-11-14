import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { ArrowLeft } from "lucide-react";
import { format, getYear, getMonth } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WorkSessionHistory() {
  const [, params] = useRoute("/projects/:id/work-sessions");
  const [, setLocation] = useLocation();
  const projectId = params?.id;
  
  // Filter state
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

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
  
  // Get unique years and months from sessions
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    allWorkSessions.forEach((session: any) => {
      const year = getYear(new Date(session.workDate));
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [allWorkSessions]);
  
  const availableMonths = useMemo(() => {
    if (selectedYear === "all") return [];
    const months = new Set<number>();
    allWorkSessions.forEach((session: any) => {
      const sessionDate = new Date(session.workDate);
      if (getYear(sessionDate) === parseInt(selectedYear)) {
        months.add(getMonth(sessionDate));
      }
    });
    return Array.from(months).sort((a, b) => a - b);
  }, [allWorkSessions, selectedYear]);
  
  // Filter work sessions based on selected year and month
  const workSessions = useMemo(() => {
    return allWorkSessions.filter((session: any) => {
      const sessionDate = new Date(session.workDate);
      
      if (selectedYear !== "all") {
        if (getYear(sessionDate) !== parseInt(selectedYear)) {
          return false;
        }
      }
      
      if (selectedMonth !== "all") {
        if (getMonth(sessionDate) !== parseInt(selectedMonth)) {
          return false;
        }
      }
      
      return true;
    });
  }, [allWorkSessions, selectedYear, selectedMonth]);
  
  // Reset month when year changes to "all"
  useMemo(() => {
    if (selectedYear === "all") {
      setSelectedMonth("all");
    }
  }, [selectedYear]);

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
  const completedSessions = workSessions.filter((s: any) => s.endTime !== null);
  
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

        {/* Work Sessions List */}
        <Card>
          <CardHeader className="space-y-4">
            <CardTitle>Session History</CardTitle>
            {allWorkSessions.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1.5 block">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger data-testid="select-year">
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1.5 block">Month</label>
                  <Select 
                    value={selectedMonth} 
                    onValueChange={setSelectedMonth}
                    disabled={selectedYear === "all"}
                  >
                    <SelectTrigger data-testid="select-month">
                      <SelectValue placeholder={selectedYear === "all" ? "Select Year First" : "All Months"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {availableMonths.map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {format(new Date(2024, month, 1), "MMMM")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(selectedYear !== "all" || selectedMonth !== "all") && (
                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedYear("all");
                        setSelectedMonth("all");
                      }}
                      data-testid="button-clear-filters"
                    >
                      <span className="material-icons mr-2">clear</span>
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {allWorkSessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No work sessions recorded yet
              </p>
            ) : workSessions.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-muted-foreground">No work sessions found for the selected period</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedYear("all");
                    setSelectedMonth("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Showing {workSessions.length} of {allWorkSessions.length} work session{allWorkSessions.length !== 1 ? "s" : ""}
                </p>
                {workSessions.map((session: any) => {
                  const sessionDate = new Date(session.workDate);
                  const isCompleted = session.endTime !== null;
                  const sessionDrops = (session.dropsCompletedNorth ?? 0) + (session.dropsCompletedEast ?? 0) + 
                                       (session.dropsCompletedSouth ?? 0) + (session.dropsCompletedWest ?? 0);
                  const metTarget = sessionDrops >= project.dailyDropTarget;

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
                            <Badge variant={metTarget ? "default" : "destructive"} data-testid={`badge-${metTarget ? "met" : "below"}-target`}>
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
                              Drops: {sessionDrops} / {project.dailyDropTarget} target
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
