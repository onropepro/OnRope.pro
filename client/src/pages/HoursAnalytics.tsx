import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ArrowLeft, Clock, Users, TrendingUp, Award } from "lucide-react";

export default function HoursAnalytics() {
  const [, setLocation] = useLocation();
  const [modalOpen, setModalOpen] = useState<string | null>(null);

  // Fetch current user
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  // Fetch all work sessions for the company (billable hours)
  const { data: workSessionsData, isLoading: isLoadingWork } = useQuery({
    queryKey: ["/api/all-work-sessions"],
  });

  // Fetch all non-billable sessions for the company
  const { data: nonBillableData, isLoading: isLoadingNonBillable } = useQuery({
    queryKey: ["/api/non-billable-sessions"],
  });

  // Fetch projects for stats
  const { data: projectsData } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Fetch employees for stats
  const { data: employeesData } = useQuery({
    queryKey: ["/api/employees"],
  });

  const user = userData?.user;
  const allWorkSessions = workSessionsData?.sessions || [];
  const allNonBillableSessions = nonBillableData?.sessions || [];
  const projects = projectsData?.projects || [];
  const employees = employeesData?.employees || [];

  const isLoading = isLoadingWork || isLoadingNonBillable;

  // Check if user is management
  const isManagement = user?.role === "company" || 
                       user?.role === "operations_manager" || 
                       user?.role === "supervisor";

  // Filter sessions to show only employee's own data if they're not management
  const workSessions = isManagement 
    ? allWorkSessions 
    : allWorkSessions.filter((s: any) => s.employeeId === user?.id);
  
  const nonBillableSessions = isManagement 
    ? allNonBillableSessions 
    : allNonBillableSessions.filter((s: any) => s.employeeId === user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate hours for different time periods
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  const calculateHours = (sessions: any[], startDate: Date, endDate: Date) => {
    return sessions
      .filter((s: any) => s.endTime !== null)
      .filter((s: any) => {
        // Parse workDate correctly regardless of format
        const dateStr = s.workDate || s.date;
        if (!dateStr) return false;
        
        // Create date object in local timezone by parsing as YYYY-MM-DD
        const parts = dateStr.split('T')[0].split('-');
        const sessionDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        
        return sessionDate >= startDate && sessionDate <= endDate;
      })
      .reduce((sum: number, session: any) => {
        if (session.startTime && session.endTime) {
          const hours = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60);
          return sum + hours;
        }
        return sum;
      }, 0);
  };

  // Year boundaries
  const yearStart = new Date(currentYear, 0, 1);
  const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

  // Month boundaries
  const monthStart = new Date(currentYear, currentMonth, 1);
  const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

  // Day boundaries
  const dayStart = new Date(currentYear, currentMonth, currentDay, 0, 0, 0);
  const dayEnd = new Date(currentYear, currentMonth, currentDay, 23, 59, 59);

  // Calculate hours for each time period
  const yearBillable = calculateHours(workSessions, yearStart, yearEnd);
  const yearNonBillable = calculateHours(nonBillableSessions, yearStart, yearEnd);

  const monthBillable = calculateHours(workSessions, monthStart, monthEnd);
  const monthNonBillable = calculateHours(nonBillableSessions, monthStart, monthEnd);

  const dayBillable = calculateHours(workSessions, dayStart, dayEnd);
  const dayNonBillable = calculateHours(nonBillableSessions, dayStart, dayEnd);

  const yearData = [
    { name: "Billable Hours", value: parseFloat(yearBillable.toFixed(2)), color: "hsl(var(--primary))" },
    { name: "Non-Billable Hours", value: parseFloat(yearNonBillable.toFixed(2)), color: "hsl(var(--chart-2))" },
  ];

  const monthData = [
    { name: "Billable Hours", value: parseFloat(monthBillable.toFixed(2)), color: "hsl(var(--primary))" },
    { name: "Non-Billable Hours", value: parseFloat(monthNonBillable.toFixed(2)), color: "hsl(var(--chart-2))" },
  ];

  const dayData = [
    { name: "Billable Hours", value: parseFloat(dayBillable.toFixed(2)), color: "hsl(var(--primary))" },
    { name: "Non-Billable Hours", value: parseFloat(dayNonBillable.toFixed(2)), color: "hsl(var(--chart-2))" },
  ];

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Calculate comprehensive statistics
  const activeProjects = projects.filter((p: any) => p.status === 'active').length;
  const completedProjects = projects.filter((p: any) => p.status === 'completed').length;
  const totalEmployees = employees.length;
  
  // Get unique employees who worked this month
  const monthSessions = [...workSessions, ...nonBillableSessions].filter((s: any) => {
    if (!s.endTime) return false;
    const dateStr = s.workDate || s.date;
    if (!dateStr) return false;
    const parts = dateStr.split('T')[0].split('-');
    const sessionDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return sessionDate >= monthStart && sessionDate <= monthEnd;
  });
  
  const uniqueEmployeesThisMonth = new Set(monthSessions.map((s: any) => s.employeeId)).size;
  const totalSessionsThisMonth = monthSessions.length;
  
  // Calculate average hours per employee
  const avgHoursPerEmployee = totalEmployees > 0 
    ? ((monthBillable + monthNonBillable) / totalEmployees).toFixed(1)
    : '0.0';
  
  // Calculate total drops completed this month
  const totalDropsThisMonth = workSessions
    .filter((s: any) => {
      if (!s.endTime) return false;
      const dateStr = s.workDate;
      if (!dateStr) return false;
      const parts = dateStr.split('T')[0].split('-');
      const sessionDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return sessionDate >= monthStart && sessionDate <= monthEnd;
    })
    .reduce((sum: number, s: any) => {
      return sum + (s.dropsCompletedNorth || 0) + (s.dropsCompletedEast || 0) + 
             (s.dropsCompletedSouth || 0) + (s.dropsCompletedWest || 0);
    }, 0);
  
  // Calculate average session duration (in hours)
  const completedSessions = [...workSessions, ...nonBillableSessions].filter((s: any) => s.endTime && s.startTime);
  const avgSessionDuration = completedSessions.length > 0
    ? (completedSessions.reduce((sum: number, s: any) => {
        const hours = (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0) / completedSessions.length).toFixed(1)
    : '0.0';
  
  // Calculate billable percentage
  const billablePercentage = (monthBillable + monthNonBillable) > 0
    ? ((monthBillable / (monthBillable + monthNonBillable)) * 100).toFixed(0)
    : '0';
  
  // Find most productive employee this month (by hours)
  const employeeHours = new Map();
  monthSessions.forEach((s: any) => {
    if (s.startTime && s.endTime) {
      const hours = (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / (1000 * 60 * 60);
      const current = employeeHours.get(s.employeeId) || { hours: 0, name: s.employeeName || 'Unknown' };
      employeeHours.set(s.employeeId, { hours: current.hours + hours, name: s.employeeName || current.name });
    }
  });
  
  let topEmployee = { name: 'N/A', hours: 0 };
  employeeHours.forEach((data) => {
    if (data.hours > topEmployee.hours) {
      topEmployee = data;
    }
  });
  
  // Calculate average drops per work session
  const sessionsWithDrops = workSessions.filter((s: any) => s.endTime);
  const avgDropsPerSession = sessionsWithDrops.length > 0
    ? (totalDropsThisMonth / sessionsWithDrops.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen page-gradient">
      <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Header - Premium Style */}
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/dashboard")}
            data-testid="button-back"
            className="hover-elevate"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold gradient-text">{isManagement ? "Hours Analytics" : "My Hours"}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isManagement ? "Billable vs Non-Billable Hours Breakdown" : "View your work hours and session history"}
            </p>
          </div>
        </div>

        {isLoading ? (
          <Card className="shadow-premium">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Loading analytics...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Work Tracking Analytics Dashboard - Professional Layout */}
            <div className="grid gap-6 lg:grid-cols-3">
              
              {/* Left Column - Weekly Hours Card */}
              <div className="lg:col-span-1">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-8 shadow-xl h-full">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="material-icons text-white/80">event_note</span>
                      <div className="text-sm font-semibold text-white/80 uppercase tracking-wide">Total Hours This Month</div>
                    </div>
                    <div className="text-6xl font-bold text-white mb-4">
                      {(monthBillable + monthNonBillable).toFixed(1).replace('.', ',')}
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <span className="material-icons">trending_up</span>
                      <span className="text-lg">{((monthBillable / (monthBillable + monthNonBillable || 1)) * 100).toFixed(0)}% Billable</span>
                    </div>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute top-10 right-10 w-24 h-24 border-4 border-white/20 rounded-full"></div>
                  <div className="absolute bottom-10 right-16 w-16 h-16 bg-white/10 rounded-full"></div>
                </div>
              </div>

              {/* Center Column - Hours Breakdown Donut */}
              <div className="lg:col-span-1">
                <Card className="shadow-xl h-full rounded-3xl border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-muted-foreground">Hours Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={monthData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {monthData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center mt-4">
                      <div className="text-4xl font-bold text-primary">
                        {((monthBillable / (monthBillable + monthNonBillable || 1)) * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Billable Rate</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Stats Cards */}
              <div className="lg:col-span-1 grid gap-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 shadow-xl">
                  <div className="relative z-10">
                    <div className="text-sm font-semibold text-white/80 mb-2">Year Efficiency</div>
                    <div className="text-4xl font-bold text-white mb-1">{((yearBillable / (yearBillable + yearNonBillable || 1)) * 100).toFixed(0)}%</div>
                    <div className="text-white/70 text-sm">Completion</div>
                    <div className="text-white/70 text-xs mt-2">{yearBillable.toFixed(1)}h billable</div>
                  </div>
                </div>
                
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 shadow-xl">
                  <div className="relative z-10">
                    <div className="text-sm font-semibold text-white/80 mb-2">Today's Hours</div>
                    <div className="text-4xl font-bold text-white mb-1">{(dayBillable + dayNonBillable).toFixed(1).replace('.', ',')}</div>
                    <div className="text-white/70 text-sm">{dayBillable.toFixed(1)}h billable</div>
                    <div className="text-white/70 text-xs mt-2">{dayNonBillable.toFixed(1)}h non-billable</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Performance Bar Chart Section */}
            <Card className="shadow-xl rounded-3xl border-0 mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Team Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Hours Logged This Month</p>
              </CardHeader>
              <CardContent>
                {employees.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">No employees to display</p>
                ) : (
                  <div className="h-64 flex items-end gap-4 justify-center overflow-x-auto pb-2">
                    {employees.slice(0, 10).map((employee: any) => {
                      const empBillable = workSessions
                        .filter((s: any) => {
                          if (s.employeeId !== employee.id || !s.endTime) return false;
                          const dateStr = s.workDate;
                          if (!dateStr) return false;
                          const parts = dateStr.split('T')[0].split('-');
                          const sessionDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                          return sessionDate >= monthStart && sessionDate <= monthEnd;
                        })
                        .reduce((sum: number, s: any) => {
                          if (s.startTime && s.endTime) {
                            const hours = (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / (1000 * 60 * 60);
                            return sum + hours;
                          }
                          return sum;
                        }, 0);
                      
                      const empNonBillable = nonBillableSessions
                        .filter((s: any) => {
                          if (s.employeeId !== employee.id || !s.endTime) return false;
                          const dateStr = s.workDate || s.date;
                          if (!dateStr) return false;
                          const parts = dateStr.split('T')[0].split('-');
                          const sessionDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                          return sessionDate >= monthStart && sessionDate <= monthEnd;
                        })
                        .reduce((sum: number, s: any) => {
                          if (s.startTime && s.endTime) {
                            const hours = (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / (1000 * 60 * 60);
                            return sum + hours;
                          }
                          return sum;
                        }, 0);

                      const totalHours = empBillable + empNonBillable;
                      const displayName = employee.name?.split(' ')[0] || 'Unknown';

                      return (
                        <div key={employee.id} className="flex flex-col items-center gap-2 flex-1 min-w-[60px] max-w-[100px]">
                          <div className="flex flex-col gap-1 w-full">
                            {/* Billable bar */}
                            <div 
                              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:opacity-80"
                              style={{ height: `${Math.max(empBillable * 20, 2)}px` }}
                              title={`${empBillable.toFixed(1)}h billable`}
                            ></div>
                            {/* Non-billable bar */}
                            <div 
                              className="w-full bg-gradient-to-t from-blue-300 to-blue-200 rounded-b-lg transition-all hover:opacity-80"
                              style={{ height: `${Math.max(empNonBillable * 20, 2)}px` }}
                              title={`${empNonBillable.toFixed(1)}h non-billable`}
                            ></div>
                          </div>
                          <div className="text-xs font-medium text-muted-foreground text-center truncate w-full px-1">
                            {displayName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {totalHours.toFixed(1)}h
                          </div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                            {displayName[0]?.toUpperCase() || '?'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Key Statistics Grid - Row 1 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <Card className="shadow-lg rounded-2xl border-0 hover-elevate active-elevate-2 cursor-pointer transition-all" onClick={() => setModalOpen('activeProjects')} data-testid="card-active-projects">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="material-icons text-blue-600">assignment</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{activeProjects}</div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                  <div className="text-xs text-muted-foreground mt-1">In Progress</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg rounded-2xl border-0 hover-elevate active-elevate-2 cursor-pointer transition-all" onClick={() => setModalOpen('completedProjects')} data-testid="card-completed-projects">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <span className="material-icons text-emerald-600">check_circle</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{completedProjects}</div>
                  <div className="text-sm text-muted-foreground">Completed Projects</div>
                  <div className="text-xs text-muted-foreground mt-1">All Time</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg rounded-2xl border-0 hover-elevate active-elevate-2 cursor-pointer transition-all" onClick={() => setModalOpen('totalEmployees')} data-testid="card-total-employees">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="material-icons text-blue-600">group</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{totalEmployees}</div>
                  <div className="text-sm text-muted-foreground">Total Employees</div>
                  <div className="text-xs text-muted-foreground mt-1">Company Wide</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg rounded-2xl border-0 hover-elevate active-elevate-2 cursor-pointer transition-all" onClick={() => setModalOpen('activeEmployees')} data-testid="card-active-employees">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="material-icons text-blue-600">people</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{uniqueEmployeesThisMonth}</div>
                  <div className="text-sm text-muted-foreground">Active This Month</div>
                  <div className="text-xs text-muted-foreground mt-1">Employees</div>
                </CardContent>
              </Card>
            </div>

            {/* Key Statistics Grid - Row 2 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <Card className="shadow-lg rounded-2xl border-0 hover-elevate active-elevate-2 cursor-pointer transition-all" onClick={() => setModalOpen('workSessions')} data-testid="card-work-sessions">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-100 flex items-center justify-center">
                    <span className="material-icons text-purple-600">calendar_month</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{totalSessionsThisMonth}</div>
                  <div className="text-sm text-muted-foreground">Work Sessions</div>
                  <div className="text-xs text-muted-foreground mt-1">This Month</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg rounded-2xl border-0 hover-elevate active-elevate-2 cursor-pointer transition-all" onClick={() => setModalOpen('avgDuration')} data-testid="card-avg-duration">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="material-icons text-blue-600">schedule</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{avgSessionDuration}h</div>
                  <div className="text-sm text-muted-foreground">Avg Session Duration</div>
                  <div className="text-xs text-muted-foreground mt-1">Per Session</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg rounded-2xl border-0 hover-elevate active-elevate-2 cursor-pointer transition-all" onClick={() => setModalOpen('totalDrops')} data-testid="card-total-drops">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-100 flex items-center justify-center">
                    <span className="material-icons text-orange-600">arrow_downward</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{totalDropsThisMonth}</div>
                  <div className="text-sm text-muted-foreground">Total Drops</div>
                  <div className="text-xs text-muted-foreground mt-1">This Month</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg rounded-2xl border-0 hover-elevate active-elevate-2 cursor-pointer transition-all" onClick={() => setModalOpen('avgDrops')} data-testid="card-avg-drops">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="material-icons text-blue-600">speed</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{avgDropsPerSession}</div>
                  <div className="text-sm text-muted-foreground">Avg Drops/Session</div>
                  <div className="text-xs text-muted-foreground mt-1">Productivity</div>
                </CardContent>
              </Card>
            </div>

            {/* Key Statistics Grid - Row 3 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <Card className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <span className="material-icons text-emerald-600">percent</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{billablePercentage}%</div>
                  <div className="text-sm text-muted-foreground">Billable Rate</div>
                  <div className="text-xs text-muted-foreground mt-1">This Month</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="material-icons text-blue-600">trending_up</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{avgHoursPerEmployee}h</div>
                  <div className="text-sm text-muted-foreground">Avg Hours/Employee</div>
                  <div className="text-xs text-muted-foreground mt-1">This Month</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <span className="material-icons text-yellow-600">star</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{topEmployee.hours > 0 ? topEmployee.hours.toFixed(0) : '0'}h</div>
                  <div className="text-sm text-muted-foreground">Top Performer</div>
                  <div className="text-xs text-muted-foreground mt-1 truncate px-2">{topEmployee.name}</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="material-icons text-blue-600">today</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{(dayBillable + dayNonBillable).toFixed(1)}h</div>
                  <div className="text-sm text-muted-foreground">Today's Hours</div>
                  <div className="text-xs text-muted-foreground mt-1">{dayBillable.toFixed(1)}h billable</div>
                </CardContent>
              </Card>
            </div>

            {/* Task Status Breakdown - Donut Chart */}
            <Card className="shadow-xl rounded-3xl border-0 mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Task Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'In Progress', value: 35, color: '#3b82f6' },
                        { name: 'Completed', value: 45, color: '#60a5fa' },
                        { name: 'Task 98', value: 10, color: '#93c5fd' },
                        { name: 'On Hold', value: 10, color: '#dbeafe' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'In Progress', value: 35, color: '#3b82f6' },
                        { name: 'Completed', value: 45, color: '#60a5fa' },
                        { name: 'Task 98', value: 10, color: '#93c5fd' },
                        { name: 'On Hold', value: 10, color: '#dbeafe' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Current Year - Premium Chart */}
            <Card className="shadow-premium border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons text-primary">calendar_today</span>
                  Current Year - {currentYear}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {yearBillable + yearNonBillable === 0 ? (
                  <p className="text-center text-muted-foreground py-12">No hours recorded this year</p>
                ) : (
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={yearData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => 
                            value > 0 ? `${name}: ${value}h (${(percent * 100).toFixed(0)}%)` : null
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {yearData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{yearBillable.toFixed(2)}h</div>
                        <div className="text-sm text-muted-foreground">Billable</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "hsl(var(--chart-2))" }}>{yearNonBillable.toFixed(2)}h</div>
                        <div className="text-sm text-muted-foreground">Non-Billable</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="text-lg font-semibold">Total: {(yearBillable + yearNonBillable).toFixed(2)}h</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Month - Premium Chart */}
            <Card className="shadow-premium border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons text-primary">event</span>
                  Current Month - {monthNames[currentMonth]} {currentYear}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {monthBillable + monthNonBillable === 0 ? (
                  <p className="text-center text-muted-foreground py-12">No hours recorded this month</p>
                ) : (
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={monthData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => 
                            value > 0 ? `${name}: ${value}h (${(percent * 100).toFixed(0)}%)` : null
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {monthData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{monthBillable.toFixed(2)}h</div>
                        <div className="text-sm text-muted-foreground">Billable</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "hsl(var(--chart-2))" }}>{monthNonBillable.toFixed(2)}h</div>
                        <div className="text-sm text-muted-foreground">Non-Billable</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="text-lg font-semibold">Total: {(monthBillable + monthNonBillable).toFixed(2)}h</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Day - Premium Chart */}
            <Card className="shadow-premium border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons text-primary">today</span>
                  Today - {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dayBillable + dayNonBillable === 0 ? (
                  <p className="text-center text-muted-foreground py-12">No hours recorded today</p>
                ) : (
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={dayData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => 
                            value > 0 ? `${name}: ${value}h (${(percent * 100).toFixed(0)}%)` : null
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dayData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{dayBillable.toFixed(2)}h</div>
                        <div className="text-sm text-muted-foreground">Billable</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "hsl(var(--chart-2))" }}>{dayNonBillable.toFixed(2)}h</div>
                        <div className="text-sm text-muted-foreground">Non-Billable</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="text-lg font-semibold">Total: {(dayBillable + dayNonBillable).toFixed(2)}h</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
