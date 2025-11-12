import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { hasFinancialAccess } from "@/lib/permissions";
import type { PayPeriodConfig, PayPeriod, EmployeeHoursSummary } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Calendar, Users, Settings, ArrowLeft, Clock } from "lucide-react";
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
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<string>("1.5");
  const [doubleTimeMultiplier, setDoubleTimeMultiplier] = useState<string>("2.0");
  const [overtimeTriggerType, setOvertimeTriggerType] = useState<string>("daily");
  const [overtimeHoursThreshold, setOvertimeHoursThreshold] = useState<string>("8");
  const [doubleTimeTriggerType, setDoubleTimeTriggerType] = useState<string>("daily");
  const [doubleTimeHoursThreshold, setDoubleTimeHoursThreshold] = useState<string>("12");

  // State for add hours form
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [sessionType, setSessionType] = useState<string>("billable");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [workDate, setWorkDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("16:00");
  const [description, setDescription] = useState<string>("");
  const [dropsNorth, setDropsNorth] = useState<string>("0");
  const [dropsEast, setDropsEast] = useState<string>("0");
  const [dropsSouth, setDropsSouth] = useState<string>("0");
  const [dropsWest, setDropsWest] = useState<string>("0");
  const [shortfallReason, setShortfallReason] = useState<string>("");

  // Get selected project details
  const selectedProject = projectsData?.projects.find(p => p.id === selectedProjectId);
  const selectedJobType = selectedProject?.jobType || '4_elevation_system';

  // Fetch current user to check permissions
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;
  const canAccessPayroll = hasFinancialAccess(currentUser);

  // Fetch pay period configuration (only if user has permission)
  const { data: configData } = useQuery<{ config: PayPeriodConfig | null }>({
    queryKey: ['/api/payroll/config'],
    enabled: canAccessPayroll,
  });

  // Fetch pay periods (only if user has permission)
  const { data: periodsData } = useQuery<{ periods: PayPeriod[] }>({
    queryKey: ['/api/payroll/periods'],
    enabled: canAccessPayroll,
  });

  // Fetch employee hours for selected period (only if user has permission)
  const { data: hoursData, isLoading: hoursLoading } = useQuery<{ hoursSummary: EmployeeHoursSummary[]; period: PayPeriod }>({
    queryKey: ['/api/payroll/periods', selectedPeriodId, 'hours'],
    enabled: !!selectedPeriodId && canAccessPayroll,
  });

  // Fetch employees for add hours form
  const { data: employeesData } = useQuery<{ employees: any[] }>({
    queryKey: ['/api/employees'],
    enabled: canAccessPayroll,
  });

  // Fetch projects for add hours form
  const { data: projectsData } = useQuery<{ projects: any[] }>({
    queryKey: ['/api/projects'],
    enabled: canAccessPayroll,
  });

  // Auto-create default payroll config if none exists
  useEffect(() => {
    const setupDefaultPayroll = async () => {
      // Only run if we have config data loaded (even if null)
      if (configData !== undefined && !configData?.config && periodsData !== undefined && (!periodsData?.periods || periodsData.periods.length === 0)) {
        try {
          // Create default semi-monthly config
          const response = await fetch('/api/payroll/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              periodType: 'semi-monthly',
              firstPayDay: 1,
              secondPayDay: 15,
            }),
          });
          
          if (response.ok) {
            // Generate periods
            await fetch('/api/payroll/generate-periods', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ numberOfPeriods: 6 }),
            });
            
            // Refresh data
            await queryClient.invalidateQueries({ queryKey: ['/api/payroll/config'] });
            await queryClient.invalidateQueries({ queryKey: ['/api/payroll/periods'] });
          }
        } catch (error) {
          console.error('Failed to setup default payroll:', error);
        }
      }
    };
    
    setupDefaultPayroll();
  }, [configData, periodsData]);

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

  // Add work session mutation
  const addWorkSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = sessionType === 'billable' 
        ? '/api/payroll/add-work-session' 
        : '/api/payroll/add-non-billable-session';
      
      const response = await apiRequest('POST', endpoint, data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Work session added successfully",
      });
      
      // Reset form
      setSelectedEmployeeId("");
      setSelectedProjectId("");
      setDescription("");
      setDropsNorth("0");
      setDropsEast("0");
      setDropsSouth("0");
      setDropsWest("0");
      setShortfallReason("");
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/payroll/periods'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      if (selectedPeriodId) {
        queryClient.invalidateQueries({ queryKey: ['/api/payroll/periods', selectedPeriodId, 'hours'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add work session",
        variant: "destructive",
      });
    },
  });

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
          body: JSON.stringify({ numberOfPeriods: 6, clearExisting: true }),
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
  useEffect(() => {
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
      if (configData.config.overtimeMultiplier) setOvertimeMultiplier(String(configData.config.overtimeMultiplier));
      if (configData.config.doubleTimeMultiplier) setDoubleTimeMultiplier(String(configData.config.doubleTimeMultiplier));
      if (configData.config.overtimeTriggerType) setOvertimeTriggerType(configData.config.overtimeTriggerType);
      if (configData.config.overtimeHoursThreshold) setOvertimeHoursThreshold(String(configData.config.overtimeHoursThreshold));
      if (configData.config.doubleTimeTriggerType) setDoubleTimeTriggerType(configData.config.doubleTimeTriggerType);
      if (configData.config.doubleTimeHoursThreshold) setDoubleTimeHoursThreshold(String(configData.config.doubleTimeHoursThreshold));
    }
  }, [configData]);

  // Redirect unauthorized users to dashboard
  useEffect(() => {
    if (!userLoading && currentUser && !canAccessPayroll) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access payroll data.",
        variant: "destructive",
      });
      setLocation("/dashboard");
    }
  }, [currentUser, userLoading, canAccessPayroll, setLocation, toast]);

  // Show loading while checking permissions
  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render anything if user doesn't have financial access
  if (!currentUser || !canAccessPayroll) {
    return null;
  }

  const handleSaveConfiguration = () => {
    const config: any = {
      periodType,
      overtimeMultiplier: parseFloat(overtimeMultiplier),
      doubleTimeMultiplier: parseFloat(doubleTimeMultiplier),
      overtimeTriggerType,
      overtimeHoursThreshold: parseFloat(overtimeHoursThreshold),
      doubleTimeTriggerType,
      doubleTimeHoursThreshold: parseFloat(doubleTimeHoursThreshold),
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

  const handleAddWorkSession = () => {
    // Validate required fields
    if (!selectedEmployeeId || !workDate || !startTime || !endTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate session type specific requirements
    if (sessionType === 'billable' && !selectedProjectId) {
      toast({
        title: "Validation Error",
        description: "Please select a project for billable hours",
        variant: "destructive",
      });
      return;
    }

    if (sessionType === 'non-billable' && !description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a description for non-billable hours",
        variant: "destructive",
      });
      return;
    }

    // Combine date and time into timestamps
    const startDateTime = `${workDate}T${startTime}:00`;
    const endDateTime = `${workDate}T${endTime}:00`;

    const payload: any = {
      employeeId: selectedEmployeeId,
      workDate,
      startTime: startDateTime,
      endTime: endDateTime,
    };

    if (sessionType === 'billable') {
      payload.projectId = selectedProjectId;
      payload.dropsCompletedNorth = parseInt(dropsNorth) || 0;
      payload.dropsCompletedEast = parseInt(dropsEast) || 0;
      payload.dropsCompletedSouth = parseInt(dropsSouth) || 0;
      payload.dropsCompletedWest = parseInt(dropsWest) || 0;
      if (shortfallReason.trim()) {
        payload.shortfallReason = shortfallReason;
      }
    } else {
      payload.description = description;
    }

    addWorkSessionMutation.mutate(payload);
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
          onClick={() => setLocation('/dashboard')}
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
          <TabsTrigger value="add-hours" data-testid="tab-add-hours">
            <Clock className="w-4 h-4 mr-2" />
            Add Hours
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
                    <Accordion type="single" collapsible className="space-y-2">
                      {hoursData.hoursSummary.map((employee) => (
                        <AccordionItem 
                          key={employee.employeeId} 
                          value={employee.employeeId}
                          className="border rounded-lg"
                          data-testid={`accordion-employee-${employee.employeeId}`}
                        >
                          <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-4">
                                <div>
                                  <div className="text-lg font-semibold text-left">{employee.employeeName}</div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Total Hours: <span className="font-medium">{employee.totalHours.toFixed(2)} hours</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {employee.sessions.length} work sessions
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">${employee.hourlyRate}/hr</div>
                                <div className="text-lg font-bold text-primary">${employee.totalPay.toFixed(2)}</div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <div className="space-y-2 mt-2">
                              <div className="text-sm font-semibold mb-3">Work Sessions</div>
                              {employee.sessions.map((session, index) => {
                                const startTime = new Date(session.startTime);
                                const endTime = session.endTime ? new Date(session.endTime) : null;
                                const hours = endTime 
                                  ? ((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))
                                  : 0;
                                const sessionCost = hours * parseFloat(employee.hourlyRate);
                                const totalDrops = (session.dropsCompletedNorth || 0) + 
                                                  (session.dropsCompletedEast || 0) + 
                                                  (session.dropsCompletedSouth || 0) + 
                                                  (session.dropsCompletedWest || 0);
                                
                                return (
                                  <Card key={session.id} className="bg-muted/30" data-testid={`session-${session.id}`}>
                                    <CardContent className="p-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div>
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className="material-icons text-sm">event</span>
                                            <span className="font-medium">
                                              {format(new Date(session.workDate), 'EEE, MMM dd, yyyy')}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className="material-icons text-sm">business</span>
                                            <span className="text-muted-foreground">{session.projectName || 'Unknown Project'}</span>
                                          </div>
                                          {totalDrops > 0 && (
                                            <div className="flex items-center gap-2">
                                              <span className="material-icons text-sm">check_circle</span>
                                              <span className="text-muted-foreground">{totalDrops} drops completed</span>
                                            </div>
                                          )}
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2 mb-2">
                                            <Clock className="h-4 w-4" />
                                            <span className="text-muted-foreground">
                                              {format(startTime, 'h:mm a')} - {endTime ? format(endTime, 'h:mm a') : 'In Progress'}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className="material-icons text-sm">schedule</span>
                                            <span className="font-semibold">{hours.toFixed(2)} hours</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            <span className="font-semibold text-primary">${sessionCost.toFixed(2)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
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

        <TabsContent value="add-hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Work Hours</CardTitle>
              <CardDescription>Manually add work hours for employees (e.g., when they forgot to clock in)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="employee-select">Employee *</Label>
                  <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                    <SelectTrigger id="employee-select" data-testid="select-employee">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employeesData?.employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name} ({emp.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-type">Session Type *</Label>
                  <Select value={sessionType} onValueChange={setSessionType}>
                    <SelectTrigger id="session-type" data-testid="select-session-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="billable">Billable (Project Work)</SelectItem>
                      <SelectItem value="non-billable">Non-Billable (Errands, Training)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {sessionType === 'billable' && (
                <div className="space-y-2">
                  <Label htmlFor="project-select">Project *</Label>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger id="project-select" data-testid="select-project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectsData?.projects.filter((p) => p.status === 'active').map((proj) => (
                        <SelectItem key={proj.id} value={proj.id}>
                          {proj.buildingName} - {proj.strataPlanNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {sessionType === 'non-billable' && (
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Errands, Training, Equipment Maintenance"
                    data-testid="input-description"
                  />
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="work-date">Work Date *</Label>
                  <Input
                    id="work-date"
                    type="date"
                    value={workDate}
                    onChange={(e) => setWorkDate(e.target.value)}
                    data-testid="input-work-date"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time *</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    data-testid="input-start-time"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time *</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    data-testid="input-end-time"
                  />
                </div>
              </div>

              {sessionType === 'billable' && selectedProjectId && (
                <>
                  <div className="border-t pt-4">
                    {selectedJobType === 'parkade_pressure_cleaning' ? (
                      <>
                        <h4 className="font-medium mb-3">Stalls Completed (Optional)</h4>
                        <div className="space-y-2">
                          <Label htmlFor="stalls-completed">Number of Stalls</Label>
                          <Input
                            id="stalls-completed"
                            type="number"
                            min="0"
                            value={dropsNorth}
                            onChange={(e) => setDropsNorth(e.target.value)}
                            data-testid="input-stalls-completed"
                          />
                        </div>
                      </>
                    ) : selectedJobType === 'in_suite_dryer_vent_cleaning' ? (
                      <>
                        <h4 className="font-medium mb-3">Floors Completed (Optional)</h4>
                        <div className="space-y-2">
                          <Label htmlFor="floors-completed">Number of Floors</Label>
                          <Input
                            id="floors-completed"
                            type="number"
                            min="0"
                            value={dropsNorth}
                            onChange={(e) => setDropsNorth(e.target.value)}
                            data-testid="input-floors-completed"
                          />
                        </div>
                      </>
                    ) : selectedJobType === 'ground_window_cleaning' || selectedJobType === 'general_pressure_washing' ? (
                      <>
                        <h4 className="font-medium mb-3">Work Completed (Optional)</h4>
                        <div className="space-y-2">
                          <Label htmlFor="work-completed">Amount Completed</Label>
                          <Input
                            id="work-completed"
                            type="number"
                            min="0"
                            value={dropsNorth}
                            onChange={(e) => setDropsNorth(e.target.value)}
                            data-testid="input-work-completed"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="font-medium mb-3">Drops Completed (Optional)</h4>
                        <div className="grid gap-4 md:grid-cols-4">
                          <div className="space-y-2">
                            <Label htmlFor="drops-north">North</Label>
                            <Input
                              id="drops-north"
                              type="number"
                              min="0"
                              value={dropsNorth}
                              onChange={(e) => setDropsNorth(e.target.value)}
                              data-testid="input-drops-north"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="drops-east">East</Label>
                            <Input
                              id="drops-east"
                              type="number"
                              min="0"
                              value={dropsEast}
                              onChange={(e) => setDropsEast(e.target.value)}
                              data-testid="input-drops-east"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="drops-south">South</Label>
                            <Input
                              id="drops-south"
                              type="number"
                              min="0"
                              value={dropsSouth}
                              onChange={(e) => setDropsSouth(e.target.value)}
                              data-testid="input-drops-south"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="drops-west">West</Label>
                            <Input
                              id="drops-west"
                              type="number"
                              min="0"
                              value={dropsWest}
                              onChange={(e) => setDropsWest(e.target.value)}
                              data-testid="input-drops-west"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortfall-reason">Shortfall Reason (if work below target)</Label>
                    <Input
                      id="shortfall-reason"
                      type="text"
                      value={shortfallReason}
                      onChange={(e) => setShortfallReason(e.target.value)}
                      placeholder="e.g., Weather delay, Equipment issue"
                      data-testid="input-shortfall-reason"
                    />
                  </div>
                </>
              )}

              <Button
                onClick={handleAddWorkSession}
                disabled={addWorkSessionMutation.isPending}
                className="w-full"
                data-testid="button-add-work-session"
              >
                <Clock className="w-4 h-4 mr-2" />
                {addWorkSessionMutation.isPending ? "Adding..." : "Add Work Hours"}
              </Button>
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

              {/* Overtime and Double Time Pay Settings */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Overtime & Double Time Pay
                </h3>
                
                {/* Overtime Settings */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium text-sm text-muted-foreground">Overtime Configuration</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="overtime-trigger-type">Overtime Trigger</Label>
                      <Select value={overtimeTriggerType} onValueChange={setOvertimeTriggerType}>
                        <SelectTrigger id="overtime-trigger-type" data-testid="select-overtime-trigger-type">
                          <SelectValue placeholder="Select trigger type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Per Day</SelectItem>
                          <SelectItem value="weekly">Per Week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overtime-hours-threshold">
                        {overtimeTriggerType === 'daily' ? 'Triggers After (Hours/Day)' : 'Triggers After (Hours/Week)'}
                      </Label>
                      <Input
                        id="overtime-hours-threshold"
                        type="number"
                        min="0"
                        max="168"
                        step="0.5"
                        value={overtimeHoursThreshold}
                        onChange={(e) => setOvertimeHoursThreshold(e.target.value)}
                        data-testid="input-overtime-hours-threshold"
                      />
                      <p className="text-sm text-muted-foreground">
                        {overtimeTriggerType === 'daily' ? 'e.g., after 8 hours/day' : 'e.g., after 40 hours/week'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overtime-multiplier">Pay Multiplier</Label>
                      <Input
                        id="overtime-multiplier"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={overtimeMultiplier}
                        onChange={(e) => setOvertimeMultiplier(e.target.value)}
                        data-testid="input-overtime-multiplier"
                      />
                      <p className="text-sm text-muted-foreground">
                        e.g., 1.5 for time-and-a-half
                      </p>
                    </div>
                  </div>
                </div>

                {/* Double Time Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Double Time Configuration</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="double-time-trigger-type">Double Time Trigger</Label>
                      <Select value={doubleTimeTriggerType} onValueChange={setDoubleTimeTriggerType}>
                        <SelectTrigger id="double-time-trigger-type" data-testid="select-double-time-trigger-type">
                          <SelectValue placeholder="Select trigger type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Per Day</SelectItem>
                          <SelectItem value="weekly">Per Week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="double-time-hours-threshold">
                        {doubleTimeTriggerType === 'daily' ? 'Triggers After (Hours/Day)' : 'Triggers After (Hours/Week)'}
                      </Label>
                      <Input
                        id="double-time-hours-threshold"
                        type="number"
                        min="0"
                        max="168"
                        step="0.5"
                        value={doubleTimeHoursThreshold}
                        onChange={(e) => setDoubleTimeHoursThreshold(e.target.value)}
                        data-testid="input-double-time-hours-threshold"
                      />
                      <p className="text-sm text-muted-foreground">
                        {doubleTimeTriggerType === 'daily' ? 'e.g., after 12 hours/day' : 'e.g., after 60 hours/week'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="double-time-multiplier">Pay Multiplier</Label>
                      <Input
                        id="double-time-multiplier"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={doubleTimeMultiplier}
                        onChange={(e) => setDoubleTimeMultiplier(e.target.value)}
                        data-testid="input-double-time-multiplier"
                      />
                      <p className="text-sm text-muted-foreground">
                        e.g., 2.0 for double time
                      </p>
                    </div>
                  </div>
                </div>
              </div>

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
