import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PayPeriodConfig, PayPeriod, EmployeeHoursSummary } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Calendar, Users, Settings, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default function Payroll() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("hours");

  // State for configuration form
  const [periodType, setPeriodType] = useState<string>("");
  const [firstPayDay, setFirstPayDay] = useState<string>("1");
  const [secondPayDay, setSecondPayDay] = useState<string>("15");
  const [startDayOfWeek, setStartDayOfWeek] = useState<string>("0");
  const [biWeeklyAnchorDate, setBiWeeklyAnchorDate] = useState<string>("");
  const [monthlyStartDay, setMonthlyStartDay] = useState<string>("1");
  const [monthlyEndDay, setMonthlyEndDay] = useState<string>("31");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // Fetch pay period configuration
  const { data: configData } = useQuery<{ config: PayPeriodConfig | null }>({
    queryKey: ['/api/payroll/config'],
  });

  // Fetch pay periods
  const { data: periodsData } = useQuery<{ periods: PayPeriod[] }>({
    queryKey: ['/api/payroll/periods'],
  });

  // Fetch employee hours for selected period
  const { data: hoursData, isLoading: hoursLoading } = useQuery<{ hoursSummary: EmployeeHoursSummary[]; period: PayPeriod }>({
    queryKey: ['/api/payroll/periods', selectedPeriodId, 'hours'],
    enabled: !!selectedPeriodId,
  });

  // Auto-select current period when periods load
  useEffect(() => {
    if (periodsData?.periods && periodsData.periods.length > 0 && !selectedPeriodId) {
      const currentPeriod = periodsData.periods.find(p => p.status === 'current');
      if (currentPeriod) {
        setSelectedPeriodId(currentPeriod.id);
      } else {
        setSelectedPeriodId(periodsData.periods[0].id);
      }
    }
  }, [periodsData, selectedPeriodId]);

  // Save configuration mutation
  const saveConfigMutation = useMutation({
    mutationFn: async (config: Partial<PayPeriodConfig>) => {
      const response = await fetch('/api/payroll/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(config),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save configuration');
      }
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/payroll/config'] });
      
      // Auto-generate pay periods after saving configuration
      try {
        const response = await fetch('/api/payroll/generate-periods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ numberOfPeriods: 6 }),
        });
        
        if (response.ok) {
          await queryClient.invalidateQueries({ queryKey: ['/api/payroll/periods'] });
          toast({
            title: "Configuration Saved",
            description: "Pay period configuration has been updated and periods have been generated.",
          });
        } else {
          toast({
            title: "Configuration Saved",
            description: "Configuration saved but failed to generate periods. You may need to configure your settings.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Configuration Saved",
          description: "Configuration saved but failed to generate periods.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save configuration",
        variant: "destructive",
      });
    },
  });


  // Initialize form with existing config
  useState(() => {
    if (configData?.config) {
      setPeriodType(configData.config.periodType);
      if (configData.config.firstPayDay) setFirstPayDay(String(configData.config.firstPayDay));
      if (configData.config.secondPayDay) setSecondPayDay(String(configData.config.secondPayDay));
      if (configData.config.startDayOfWeek !== null) setStartDayOfWeek(String(configData.config.startDayOfWeek));
      if (configData.config.biWeeklyAnchorDate) setBiWeeklyAnchorDate(configData.config.biWeeklyAnchorDate);
      if (configData.config.monthlyStartDay) setMonthlyStartDay(String(configData.config.monthlyStartDay));
      if (configData.config.monthlyEndDay) setMonthlyEndDay(String(configData.config.monthlyEndDay));
      if (configData.config.customStartDate) setCustomStartDate(configData.config.customStartDate);
      if (configData.config.customEndDate) setCustomEndDate(configData.config.customEndDate);
    }
  });

  const handleSaveConfiguration = () => {
    const config: any = {
      periodType,
    };

    if (periodType === 'semi-monthly') {
      config.firstPayDay = parseInt(firstPayDay);
      config.secondPayDay = parseInt(secondPayDay);
    } else if (periodType === 'monthly') {
      config.monthlyStartDay = parseInt(monthlyStartDay);
      config.monthlyEndDay = parseInt(monthlyEndDay);
    } else if (periodType === 'weekly') {
      config.startDayOfWeek = parseInt(startDayOfWeek);
    } else if (periodType === 'bi-weekly') {
      config.startDayOfWeek = parseInt(startDayOfWeek);
      config.biWeeklyAnchorDate = biWeeklyAnchorDate || new Date().toISOString().split('T')[0];
    } else if (periodType === 'custom') {
      config.customStartDate = customStartDate;
      config.customEndDate = customEndDate;
    }

    saveConfigMutation.mutate(config);
  };

  const dayOfWeekOptions = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation('/management')}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold" data-testid="heading-payroll">Payroll Management</h1>
          <p className="text-muted-foreground">Manage pay periods and employee hours</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hours" data-testid="tab-hours">
            <Users className="w-4 h-4 mr-2" />
            Employee Hours
          </TabsTrigger>
          <TabsTrigger value="current-periods" data-testid="tab-current-periods">
            <Calendar className="w-4 h-4 mr-2" />
            Current Period
          </TabsTrigger>
          <TabsTrigger value="past-periods" data-testid="tab-past-periods">
            <Calendar className="w-4 h-4 mr-2" />
            Past Periods
          </TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Hours Summary</CardTitle>
              <CardDescription>Select a pay period to view employee hours and labor costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="period-select">Pay Period</Label>
                <Select 
                  value={selectedPeriodId || ""} 
                  onValueChange={setSelectedPeriodId}
                >
                  <SelectTrigger id="period-select" data-testid="select-pay-period">
                    <SelectValue placeholder="Select a pay period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodsData?.periods.map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {format(new Date(period.startDate), 'MMM dd, yyyy')} - {format(new Date(period.endDate), 'MMM dd, yyyy')} ({period.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPeriodId && hoursLoading && (
                <div className="text-center py-8 text-muted-foreground">Loading employee hours...</div>
              )}

              {selectedPeriodId && !hoursLoading && hoursData && hoursData.hoursSummary.length > 0 && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{hoursData.hoursSummary.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {hoursData.hoursSummary.reduce((sum, emp) => sum + emp.totalHours, 0).toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Labor Cost</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ${hoursData.hoursSummary.reduce((sum, emp) => sum + emp.totalPay, 0).toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    {hoursData.hoursSummary.map((employee) => (
                      <Card key={employee.employeeId} data-testid={`card-employee-${employee.employeeId}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{employee.employeeName}</CardTitle>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">${employee.hourlyRate}/hr</div>
                              <div className="text-lg font-bold text-primary">${employee.totalPay.toFixed(2)}</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total Hours:</span>
                            <span className="font-medium">{employee.totalHours.toFixed(2)} hours</span>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {employee.sessions.length} work sessions
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {selectedPeriodId && !hoursLoading && (!hoursData || hoursData.hoursSummary.length === 0) && (
                <div className="text-center py-12 space-y-2">
                  <div className="text-muted-foreground">
                    No employee hours recorded for this pay period.
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Work sessions logged during this period will appear here automatically.
                  </div>
                </div>
              )}

              {!selectedPeriodId && (
                <div className="text-center py-12 text-muted-foreground">
                  Select a pay period above to view employee hours.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current-periods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Pay Period</CardTitle>
              <CardDescription>View the active pay period</CardDescription>
            </CardHeader>
            <CardContent>
              {!periodsData?.periods || periodsData.periods.filter(p => p.status === 'current' || p.status === 'upcoming').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No current pay period. Configure your pay period settings to get started.
                </div>
              ) : (
                <div className="space-y-2">
                  {periodsData.periods
                    .filter(p => p.status === 'current' || p.status === 'upcoming')
                    .map((period) => (
                      <Card key={period.id} data-testid={`card-period-${period.id}`}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div>
                            <div className="font-medium">
                              {format(new Date(period.startDate), 'MMM dd, yyyy')} - {format(new Date(period.endDate), 'MMM dd, yyyy')}
                            </div>
                            <div className="text-sm text-muted-foreground capitalize">{period.status}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPeriodId(period.id);
                              setActiveTab("hours");
                            }}
                            data-testid={`button-view-hours-${period.id}`}
                          >
                            View Hours
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past-periods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Past Pay Periods</CardTitle>
              <CardDescription>View historical pay periods</CardDescription>
            </CardHeader>
            <CardContent>
              {!periodsData?.periods || periodsData.periods.filter(p => p.status === 'past').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No past pay periods yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {periodsData.periods
                    .filter(p => p.status === 'past')
                    .map((period) => (
                      <Card key={period.id} data-testid={`card-period-${period.id}`}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div>
                            <div className="font-medium">
                              {format(new Date(period.startDate), 'MMM dd, yyyy')} - {format(new Date(period.endDate), 'MMM dd, yyyy')}
                            </div>
                            <div className="text-sm text-muted-foreground capitalize">{period.status}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPeriodId(period.id);
                              setActiveTab("hours");
                            }}
                            data-testid={`button-view-hours-${period.id}`}
                          >
                            View Hours
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pay Period Configuration</CardTitle>
              <CardDescription>Configure how pay periods are calculated. Periods are automatically generated when you save.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="period-type">Pay Period Type</Label>
                <Select value={periodType} onValueChange={setPeriodType}>
                  <SelectTrigger id="period-type" data-testid="select-period-type">
                    <SelectValue placeholder="Select period type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semi-monthly">Semi-Monthly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {periodType === 'semi-monthly' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-pay-day">First Pay Day of Month</Label>
                    <Input
                      id="first-pay-day"
                      type="number"
                      min="1"
                      max="28"
                      value={firstPayDay}
                      onChange={(e) => setFirstPayDay(e.target.value)}
                      data-testid="input-first-pay-day"
                    />
                    <p className="text-sm text-muted-foreground">Day 1-28</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="second-pay-day">Second Pay Day of Month</Label>
                    <Input
                      id="second-pay-day"
                      type="number"
                      min="1"
                      max="28"
                      value={secondPayDay}
                      onChange={(e) => setSecondPayDay(e.target.value)}
                      data-testid="input-second-pay-day"
                    />
                    <p className="text-sm text-muted-foreground">Day 1-28</p>
                  </div>
                </div>
              )}

              {periodType === 'monthly' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="monthly-start-day">Period Start Day</Label>
                    <Input
                      id="monthly-start-day"
                      type="number"
                      min="1"
                      max="28"
                      value={monthlyStartDay}
                      onChange={(e) => setMonthlyStartDay(e.target.value)}
                      data-testid="input-monthly-start-day"
                    />
                    <p className="text-sm text-muted-foreground">Day of month when period starts (1-28)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-end-day">Period End Day</Label>
                    <Input
                      id="monthly-end-day"
                      type="number"
                      min="1"
                      max="31"
                      value={monthlyEndDay}
                      onChange={(e) => setMonthlyEndDay(e.target.value)}
                      data-testid="input-monthly-end-day"
                    />
                    <p className="text-sm text-muted-foreground">Day of month when period ends (1-31)</p>
                  </div>
                </div>
              )}

              {periodType === 'weekly' && (
                <div className="space-y-2">
                  <Label htmlFor="start-day-week">Week Starts On</Label>
                  <Select value={startDayOfWeek} onValueChange={setStartDayOfWeek}>
                    <SelectTrigger id="start-day-week" data-testid="select-start-day">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {dayOfWeekOptions.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {periodType === 'bi-weekly' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-day-week-biweekly">Week Starts On</Label>
                    <Select value={startDayOfWeek} onValueChange={setStartDayOfWeek}>
                      <SelectTrigger id="start-day-week-biweekly" data-testid="select-start-day-biweekly">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {dayOfWeekOptions.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anchor-date">Starting Date (Anchor)</Label>
                    <Input
                      id="anchor-date"
                      type="date"
                      value={biWeeklyAnchorDate}
                      onChange={(e) => setBiWeeklyAnchorDate(e.target.value)}
                      data-testid="input-anchor-date"
                    />
                    <p className="text-sm text-muted-foreground">
                      First day of a pay period to use as reference
                    </p>
                  </div>
                </div>
              )}

              {periodType === 'custom' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="custom-start-date">Period Start Date</Label>
                    <Input
                      id="custom-start-date"
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      data-testid="input-custom-start-date"
                    />
                    <p className="text-sm text-muted-foreground">
                      Starting date of your custom pay period
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-end-date">Period End Date</Label>
                    <Input
                      id="custom-end-date"
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      data-testid="input-custom-end-date"
                    />
                    <p className="text-sm text-muted-foreground">
                      Ending date of your custom pay period
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleSaveConfiguration}
                disabled={!periodType || saveConfigMutation.isPending}
                className="w-full"
                data-testid="button-save-config"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
