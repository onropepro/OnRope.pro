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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
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
            {/* Analytics Grid - Premium Layout */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Total Year Hours Card */}
              <Card className="shadow-premium transition-premium hover:shadow-premium-lg border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours {currentYear}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    {(yearBillable + yearNonBillable).toFixed(1)}h
                  </div>
                  <div className="flex gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-muted-foreground">{yearBillable.toFixed(1)}h billable</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Month Hours Card */}
              <Card className="shadow-premium transition-premium hover:shadow-premium-lg border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{monthNames[currentMonth]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    {(monthBillable + monthNonBillable).toFixed(1)}h
                  </div>
                  <div className="flex gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-muted-foreground">{monthBillable.toFixed(1)}h billable</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Day Hours Card */}
              <Card className="shadow-premium transition-premium hover:shadow-premium-lg border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    {(dayBillable + dayNonBillable).toFixed(1)}h
                  </div>
                  <div className="flex gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-muted-foreground">{dayBillable.toFixed(1)}h billable</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

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
