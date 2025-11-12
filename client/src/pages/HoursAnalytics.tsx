import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ArrowLeft } from "lucide-react";

export default function HoursAnalytics() {
  const [, setLocation] = useLocation();

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

  const user = userData?.user;
  const allWorkSessions = workSessionsData?.sessions || [];
  const allNonBillableSessions = nonBillableData?.sessions || [];

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

              {/* Center Column - Project Progress Donut */}
              <div className="lg:col-span-1">
                <Card className="shadow-xl h-full rounded-3xl border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-muted-foreground">Project Progress</CardTitle>
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
                      <div className="text-sm text-muted-foreground mt-1">Q4 Initiative</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Stats Cards */}
              <div className="lg:col-span-1 grid gap-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 shadow-xl">
                  <div className="relative z-10">
                    <div className="text-sm font-semibold text-white/80 mb-2">Project Progress</div>
                    <div className="text-4xl font-bold text-white mb-1">{((yearBillable / (yearBillable + yearNonBillable || 1)) * 100).toFixed(0)}%</div>
                    <div className="text-white/70 text-sm">Completion</div>
                    <div className="text-white/70 text-xs mt-2">181,58% Outpund</div>
                  </div>
                </div>
                
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 shadow-xl">
                  <div className="relative z-10">
                    <div className="text-sm font-semibold text-white/80 mb-2">Average Task Completion Time</div>
                    <div className="text-4xl font-bold text-white mb-1">{(dayBillable + dayNonBillable).toFixed(1).replace('.', ',')}</div>
                    <div className="text-white/70 text-sm">Previous periods</div>
                    <div className="text-white/70 text-xs mt-2">223,80% Asduund</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Performance Bar Chart Section */}
            <Card className="shadow-xl rounded-3xl border-0 mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Team Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Hours Logged</p>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-8 justify-center">
                  {[
                    { name: 'Sorin', billable: 3.2, nonBillable: 1.8 },
                    { name: 'Mona', billable: 4.5, nonBillable: 0.8 },
                    { name: 'Mon', billable: 5.1, nonBillable: 1.2 },
                    { name: 'Span', billable: 2.8, nonBillable: 1.5 },
                    { name: 'Sont', billable: 4.2, nonBillable: 0.9 },
                  ].map((person, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                      <div className="flex flex-col gap-1 w-full">
                        {/* Billable bar */}
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${person.billable * 30}px` }}
                        ></div>
                        {/* Non-billable bar */}
                        <div 
                          className="w-full bg-gradient-to-t from-blue-300 to-blue-200 rounded-b-lg transition-all hover:opacity-80"
                          style={{ height: `${person.nonBillable * 30}px` }}
                        ></div>
                      </div>
                      <div className="text-xs font-medium text-muted-foreground text-center">{person.name}</div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-xs font-bold text-white">
                        {person.name[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Statistics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <Card className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="material-icons text-blue-600">assignment</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{Math.round(yearBillable + yearNonBillable)}</div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                  <div className="text-xs text-muted-foreground mt-1">Pending</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="material-icons text-blue-600">pending_actions</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{Math.round(monthBillable)}</div>
                  <div className="text-sm text-muted-foreground">Pending Tasks</div>
                  <div className="text-xs text-muted-foreground mt-1">Pending</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="material-icons text-blue-600">people</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">85%</div>
                  <div className="text-sm text-muted-foreground">Team Utilization</div>
                  <div className="text-xs text-muted-foreground mt-1">Rate</div>
                </CardContent>
              </Card>

              <Card className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="material-icons text-blue-600">leaderboard</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">92%</div>
                  <div className="text-sm text-muted-foreground">Team Utilization</div>
                  <div className="text-xs text-muted-foreground mt-1">Rate</div>
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
