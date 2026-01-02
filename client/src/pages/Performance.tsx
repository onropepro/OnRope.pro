import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Activity,
  FileText,
} from "lucide-react";
import { WorkSessionsExplorer } from "@/components/WorkSessionsExplorer";
import { canViewPerformance } from "@/lib/permissions";

interface WorkSession {
  id: string;
  employeeId: string;
  employeeName: string;
  projectId: string;
  projectName?: string;
  startTime: string;
  endTime?: string;
  regularHours?: number;
  overtimeHours?: number;
  doubleTimeHours?: number;
  dailyDropTarget?: number;
  dropsCompleted?: number;
  dropsCompletedNorth?: number;
  dropsCompletedEast?: number;
  dropsCompletedSouth?: number;
  dropsCompletedWest?: number;
  shortfallReason?: string;
  validShortfallReasonCode?: boolean;
}

interface NonBillableSession {
  id: string;
  employeeId: string;
  startTime: string;
  endTime?: string;
  description?: string;
}

export default function Performance() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const { data: userData, isLoading: isLoadingUser } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const user = userData?.user;
  const hasPermission = canViewPerformance(user);

  const { data: workSessionsData, isLoading: isLoadingWork } = useQuery<{ sessions: WorkSession[] }>({
    queryKey: ["/api/all-work-sessions"],
    enabled: hasPermission,
  });

  const { data: nonBillableData, isLoading: isLoadingNonBillable } = useQuery<{ sessions: NonBillableSession[] }>({
    queryKey: ["/api/non-billable-sessions"],
    enabled: hasPermission,
  });

  const { data: employeesData, isLoading: isLoadingEmployees } = useQuery<{ employees: any[] }>({
    queryKey: ["/api/employees"],
    enabled: hasPermission,
  });

  const isLoading = isLoadingUser || isLoadingWork || isLoadingNonBillable || isLoadingEmployees;

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t('performance.noAccess', 'You do not have permission to view performance analytics.')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allWorkSessions = workSessionsData?.sessions || [];
  const allNonBillableSessions = nonBillableData?.sessions || [];
  const employees = employeesData?.employees || [];

  const completedSessions = allWorkSessions.filter((s: WorkSession) => 
    s.endTime !== null && 
    s.dailyDropTarget != null && 
    s.dailyDropTarget > 0 && 
    s.employeeName
  );

  const targetMetCount = completedSessions.filter((s: WorkSession) => 
    (s.dropsCompleted || 0) >= (s.dailyDropTarget || 0)
  ).length;

  const validReasonCount = completedSessions.filter((s: WorkSession) => 
    (s.dropsCompleted || 0) < (s.dailyDropTarget || 0) && s.validShortfallReasonCode
  ).length;

  const belowTargetCount = completedSessions.filter((s: WorkSession) => 
    (s.dropsCompleted || 0) < (s.dailyDropTarget || 0) && !s.validShortfallReasonCode
  ).length;

  const performancePieData = [
    { name: t('performance.targetMet', 'Target Met'), value: targetMetCount, color: "hsl(var(--primary))" },
    { name: t('performance.validReason', 'Valid Reason'), value: validReasonCount, color: "hsl(var(--warning))" },
    { name: t('performance.belowTarget', 'Below Target'), value: belowTargetCount, color: "hsl(var(--destructive))" },
  ];

  const calculateBillableHours = (sessions: WorkSession[], startDate: Date, endDate: Date) => {
    return sessions
      .filter((s: WorkSession) => {
        const sessionDate = new Date(s.startTime);
        return sessionDate >= startDate && sessionDate <= endDate && s.endTime;
      })
      .reduce((sum: number, s: WorkSession) => {
        const regular = parseFloat(String(s.regularHours)) || 0;
        const overtime = parseFloat(String(s.overtimeHours)) || 0;
        const doubleTime = parseFloat(String(s.doubleTimeHours)) || 0;
        return sum + regular + overtime + doubleTime;
      }, 0);
  };

  const calculateNonBillableHours = (sessions: NonBillableSession[], startDate: Date, endDate: Date) => {
    return sessions
      .filter((s: NonBillableSession) => {
        const sessionDate = new Date(s.startTime);
        return sessionDate >= startDate && sessionDate <= endDate && s.endTime;
      })
      .reduce((sum: number, s: NonBillableSession) => {
        const start = new Date(s.startTime);
        const end = new Date(s.endTime!);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0);
  };

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const monthBillable = calculateBillableHours(allWorkSessions, monthStart, monthEnd);
  const monthNonBillable = calculateNonBillableHours(allNonBillableSessions, monthStart, monthEnd);
  const dayBillable = calculateBillableHours(allWorkSessions, dayStart, dayEnd);
  const dayNonBillable = calculateNonBillableHours(allNonBillableSessions, dayStart, dayEnd);

  const billablePercentage = (monthBillable + monthNonBillable) > 0
    ? ((monthBillable / (monthBillable + monthNonBillable)) * 100).toFixed(0)
    : "0";

  const hoursBreakdownData = [
    { name: t('performance.billable', 'Billable'), value: parseFloat(monthBillable.toFixed(2)), color: "hsl(var(--primary))" },
    { name: t('performance.nonBillable', 'Non-Billable'), value: parseFloat(monthNonBillable.toFixed(2)), color: "hsl(var(--chart-2))" },
  ];

  const sessionsByEmployee = completedSessions.reduce((acc: Record<string, WorkSession[]>, session: WorkSession) => {
    const name = session.employeeName || 'Unknown';
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(session);
    return acc;
  }, {});

  const employeePerformanceData = Object.entries(sessionsByEmployee).map(([employeeName, sessions]) => {
    const met = sessions.filter((s: WorkSession) => (s.dropsCompleted || 0) >= (s.dailyDropTarget || 0)).length;
    const valid = sessions.filter((s: WorkSession) => 
      (s.dropsCompleted || 0) < (s.dailyDropTarget || 0) && s.validShortfallReasonCode
    ).length;
    const below = sessions.filter((s: WorkSession) => 
      (s.dropsCompleted || 0) < (s.dailyDropTarget || 0) && !s.validShortfallReasonCode
    ).length;
    return {
      name: employeeName,
      sessions: sessions.length,
      met,
      valid,
      below,
      metRate: sessions.length > 0 ? Math.round((met / sessions.length) * 100) : 0,
    };
  }).sort((a, b) => b.metRate - a.metRate);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setLocation("/dashboard")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold" data-testid="text-page-title">
              {t('performance.title', 'Performance Analytics')}
            </h1>
            <p className="text-sm text-primary-foreground/80">
              {t('performance.subtitle', 'Track technician productivity and efficiency')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-6xl mx-auto">
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
            </div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="overview" data-testid="tab-overview">
                <Activity className="w-4 h-4 mr-2" />
                {t('performance.tabs.overview', 'Overview')}
              </TabsTrigger>
              <TabsTrigger value="drops" data-testid="tab-drops">
                <Target className="w-4 h-4 mr-2" />
                {t('performance.tabs.dropTargets', 'Drop Targets')}
              </TabsTrigger>
              <TabsTrigger value="hours" data-testid="tab-hours">
                <Clock className="w-4 h-4 mr-2" />
                {t('performance.tabs.hours', 'Hours')}
              </TabsTrigger>
              <TabsTrigger value="sessions" data-testid="tab-sessions">
                <FileText className="w-4 h-4 mr-2" />
                {t('performance.tabs.sessions', 'Sessions')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card data-testid="card-target-met">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 mx-auto text-primary mb-2" />
                    <div className="text-3xl font-bold text-primary">
                      {completedSessions.length > 0 ? Math.round((targetMetCount / completedSessions.length) * 100) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">{t('performance.targetMet', 'Target Met')}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t('performance.ofSessions', '{{count}} of {{total}}', { count: targetMetCount, total: completedSessions.length })}
                    </div>
                  </CardContent>
                </Card>
                <Card data-testid="card-valid-reason">
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{validReasonCount}</div>
                    <div className="text-sm text-muted-foreground">{t('performance.validReason', 'Valid Reason')}</div>
                  </CardContent>
                </Card>
                <Card data-testid="card-below-target">
                  <CardContent className="p-4 text-center">
                    <XCircle className="w-8 h-8 mx-auto text-destructive mb-2" />
                    <div className="text-3xl font-bold text-destructive">
                      {completedSessions.length > 0 ? Math.round((belowTargetCount / completedSessions.length) * 100) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">{t('performance.belowTarget', 'Below Target')}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t('performance.ofSessions', '{{count}} of {{total}}', { count: belowTargetCount, total: completedSessions.length })}
                    </div>
                  </CardContent>
                </Card>
                <Card data-testid="card-billable-rate">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto text-primary mb-2" />
                    <div className="text-3xl font-bold text-primary">{billablePercentage}%</div>
                    <div className="text-sm text-muted-foreground">{t('performance.billableRate', 'Billable Rate')}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {t('performance.dropTargetPerformance', 'Drop Target Performance')}
                    </CardTitle>
                    <CardDescription>{t('performance.allProjectsSessions', 'All projects and work sessions')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {completedSessions.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={performancePieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) => 
                              value > 0 ? `${value} (${(percent * 100).toFixed(0)}%)` : null
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {performancePieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>{t('performance.noDropData', 'No drop target data yet')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {t('performance.hoursBreakdown', 'Hours Breakdown (This Month)')}
                    </CardTitle>
                    <CardDescription>{t('performance.billableVsNonBillable', 'Billable vs non-billable hours')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(monthBillable + monthNonBillable) > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={hoursBreakdownData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ value }) => `${value.toFixed(1)}h`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {hoursBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>{t('performance.noHoursData', 'No hours logged this month')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {t('performance.todaysActivity', "Today's Activity")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">{(dayBillable + dayNonBillable).toFixed(1)}h</div>
                      <div className="text-sm text-muted-foreground">{t('performance.totalHoursToday', 'Total Hours')}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{dayBillable.toFixed(1)}h</div>
                      <div className="text-sm text-muted-foreground">{t('performance.billable', 'Billable')}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">{dayNonBillable.toFixed(1)}h</div>
                      <div className="text-sm text-muted-foreground">{t('performance.nonBillable', 'Non-Billable')}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">{employees.length}</div>
                      <div className="text-sm text-muted-foreground">{t('performance.totalEmployees', 'Employees')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drops" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('performance.overallTargetPerformance', 'Overall Target Performance')}</CardTitle>
                  <CardDescription>{t('performance.acrossAllProjects', 'Across all projects and work sessions')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {completedSessions.length > 0 ? (
                    <div className="flex flex-col items-center">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={performancePieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) => 
                              value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : null
                            }
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {performancePieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="grid grid-cols-3 gap-4 mt-4 w-full max-w-md">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{targetMetCount}</div>
                          <div className="text-xs text-muted-foreground">{t('performance.targetMet', 'Target Met')}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{validReasonCount}</div>
                          <div className="text-xs text-muted-foreground">{t('performance.validReason', 'Valid Reason')}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-destructive">{belowTargetCount}</div>
                          <div className="text-xs text-muted-foreground">{t('performance.belowTarget', 'Below Target')}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>{t('performance.noCompletedSessions', 'No completed work sessions yet')}</p>
                      <p className="text-sm mt-1">{t('performance.performanceDataAppear', 'Performance data will appear after completing work sessions')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {employeePerformanceData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {t('performance.performanceByEmployee', 'Performance by Employee')}
                    </CardTitle>
                    <CardDescription>{t('performance.rankedByTargetMetRate', 'Ranked by target met rate')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {employeePerformanceData.map((emp) => {
                        const pieData = [
                          { name: t('performance.met', 'Met'), value: emp.met, color: "hsl(var(--primary))" },
                          { name: t('performance.valid', 'Valid'), value: emp.valid, color: "hsl(var(--warning))" },
                          { name: t('performance.below', 'Below'), value: emp.below, color: "hsl(var(--destructive))" },
                        ];
                        return (
                          <Card key={emp.name} data-testid={`card-employee-${emp.name}`}>
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between gap-2">
                                <CardTitle className="text-base">{emp.name}</CardTitle>
                                <Badge variant={emp.metRate >= 80 ? "default" : emp.metRate >= 50 ? "secondary" : "destructive"}>
                                  {emp.metRate}% Met
                                </Badge>
                              </div>
                              <CardDescription className="text-xs">{emp.sessions} work sessions</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-4">
                                <ResponsiveContainer width={100} height={100}>
                                  <PieChart>
                                    <Pie
                                      data={pieData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={25}
                                      outerRadius={40}
                                      fill="#8884d8"
                                      dataKey="value"
                                    >
                                      {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                    </Pie>
                                  </PieChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-3 gap-2 flex-1 text-center">
                                  <div>
                                    <div className="text-lg font-bold text-primary">{emp.met}</div>
                                    <div className="text-xs text-muted-foreground">{t('performance.met', 'Met')}</div>
                                  </div>
                                  <div>
                                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{emp.valid}</div>
                                    <div className="text-xs text-muted-foreground">{t('performance.valid', 'Valid')}</div>
                                  </div>
                                  <div>
                                    <div className="text-lg font-bold text-destructive">{emp.below}</div>
                                    <div className="text-xs text-muted-foreground">{t('performance.below', 'Below')}</div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="hours" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{t('performance.today', 'Today')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{(dayBillable + dayNonBillable).toFixed(1)}h</div>
                    <div className="text-sm text-muted-foreground">
                      {dayBillable.toFixed(1)}h {t('performance.billable', 'billable')} / {dayNonBillable.toFixed(1)}h {t('performance.nonBillable', 'non-billable')}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{t('performance.thisMonth', 'This Month')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{(monthBillable + monthNonBillable).toFixed(1)}h</div>
                    <div className="text-sm text-muted-foreground">
                      {monthBillable.toFixed(1)}h {t('performance.billable', 'billable')} / {monthNonBillable.toFixed(1)}h {t('performance.nonBillable', 'non-billable')}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{t('performance.billableRate', 'Billable Rate')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{billablePercentage}%</div>
                    <div className="text-sm text-muted-foreground">{t('performance.ofTotalHours', 'of total hours')}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t('performance.monthlyHoursBreakdown', 'Monthly Hours Breakdown')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {(monthBillable + monthNonBillable) > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={hoursBreakdownData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) => `${name}: ${value.toFixed(1)}h (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {hoursBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{monthBillable.toFixed(2)}h</div>
                          <div className="text-sm text-muted-foreground">{t('performance.billableHours', 'Billable Hours')}</div>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="text-2xl font-bold">{monthNonBillable.toFixed(2)}h</div>
                          <div className="text-sm text-muted-foreground">{t('performance.nonBillableHours', 'Non-Billable Hours')}</div>
                        </div>
                        <div className="border-t pt-4">
                          <div className="text-lg font-semibold">{t('performance.total', 'Total')}: {(monthBillable + monthNonBillable).toFixed(2)}h</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>{t('performance.noHoursData', 'No hours logged this month')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card 
                className="hover-elevate active-elevate-2 cursor-pointer"
                onClick={() => setLocation("/hours-analytics")}
                data-testid="card-detailed-analytics"
              >
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{t('performance.detailedAnalytics', 'Detailed Hours Analytics')}</CardTitle>
                    <CardDescription className="text-sm">
                      {t('performance.viewFullBreakdown', 'View full breakdown with employee comparison charts')}
                    </CardDescription>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="text-primary w-6 h-6" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <WorkSessionsExplorer />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
