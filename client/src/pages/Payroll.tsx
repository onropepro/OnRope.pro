import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { hasFinancialAccess } from "@/lib/permissions";
import type { PayPeriodConfig, PayPeriod, EmployeeHoursSummary } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Calendar, Users, Settings, Clock, Pencil, Trash2, Download, FileText, FileSpreadsheet } from "lucide-react";
import jsPDF from 'jspdf';
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

// Helper to get date locale based on current language
const getDateLocale = () => i18n.language?.startsWith('fr') ? fr : enUS;

// Helper to parse YYYY-MM-DD date strings as local dates (not UTC)
// This prevents timezone issues where UTC midnight shows as previous day for users in negative UTC offsets
const parseLocalDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const parts = dateStr.split('T')[0].split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
};

export default function Payroll() {
  const { t } = useTranslation();
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
  // Helper for local date formatting
  const getLocalDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  
  const [workDate, setWorkDate] = useState<string>(getLocalDateString());
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("16:00");
  const [description, setDescription] = useState<string>("");
  const [dropsNorth, setDropsNorth] = useState<string>("0");
  const [dropsEast, setDropsEast] = useState<string>("0");
  const [dropsSouth, setDropsSouth] = useState<string>("0");
  const [dropsWest, setDropsWest] = useState<string>("0");
  const [shortfallReason, setShortfallReason] = useState<string>("");

  // State for editing sessions
  const [editingSession, setEditingSession] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch current user to check permissions
  const { data: userData, isLoading: userLoading } = useQuery<{ user: any }>({
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

  // Get selected project details
  const selectedProject = projectsData?.projects.find(p => p.id === selectedProjectId);
  const selectedJobType = selectedProject?.jobType || '4_elevation_system';

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
        title: t('common.success', 'Success'),
        description: t('payroll.sessionAdded', 'Work session added successfully'),
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
        title: t('payroll.error', 'Error'),
        description: error.message || t('payroll.error', 'Failed to add work session'),
        variant: "destructive",
      });
    },
  });

  // Update work session mutation
  const updateWorkSessionMutation = useMutation({
    mutationFn: async ({ sessionId, data, isNonBillable }: { sessionId: string; data: any; isNonBillable: boolean }) => {
      const endpoint = isNonBillable 
        ? `/api/payroll/non-billable-sessions/${sessionId}` 
        : `/api/payroll/work-sessions/${sessionId}`;
      
      const response = await apiRequest('PATCH', endpoint, data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: t('common.success', 'Success'),
        description: t('payroll.sessionUpdated', 'Work session updated successfully'),
      });
      
      setIsEditDialogOpen(false);
      setEditingSession(null);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/payroll/periods'] });
      if (selectedPeriodId) {
        queryClient.invalidateQueries({ queryKey: ['/api/payroll/periods', selectedPeriodId, 'hours'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: t('payroll.error', 'Error'),
        description: error.message || t('payroll.error', 'Failed to update work session'),
        variant: "destructive",
      });
    },
  });

  // Delete work session mutation
  const deleteWorkSessionMutation = useMutation({
    mutationFn: async ({ sessionId, isNonBillable }: { sessionId: string; isNonBillable: boolean }) => {
      const endpoint = isNonBillable 
        ? `/api/payroll/non-billable-sessions/${sessionId}` 
        : `/api/payroll/work-sessions/${sessionId}`;
      
      const response = await apiRequest('DELETE', endpoint, {});
      return response;
    },
    onSuccess: () => {
      toast({
        title: t('common.success', 'Success'),
        description: t('payroll.sessionDeleted', 'Work session deleted successfully'),
      });
      
      setIsDeleteDialogOpen(false);
      setDeleteSessionId(null);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/payroll/periods'] });
      if (selectedPeriodId) {
        queryClient.invalidateQueries({ queryKey: ['/api/payroll/periods', selectedPeriodId, 'hours'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: t('payroll.error', 'Error'),
        description: error.message || t('payroll.error', 'Failed to delete work session'),
        variant: "destructive",
      });
    },
  });

  // Export to CSV function
  const exportToCSV = () => {
    if (!hoursData || !hoursData.hoursSummary || hoursData.hoursSummary.length === 0) {
      toast({
        title: t('payroll.error', 'Error'),
        description: t('payroll.noDataToExport', 'No data to export'),
        variant: "destructive",
      });
      return;
    }

    const period = hoursData.period;
    const periodLabel = `${format(parseLocalDate(period.startDate), 'yyyy-MM-dd')}_to_${format(parseLocalDate(period.endDate), 'yyyy-MM-dd')}`;
    
    // Build CSV content
    const headers = ['Employee Name', 'Hourly Rate', 'Regular Hours', 'Overtime Hours', 'Double Time Hours', 'Total Hours', 'Total Pay'];
    const rows = hoursData.hoursSummary.map(emp => [
      emp.employeeName,
      `$${emp.hourlyRate}`,
      emp.regularHours.toFixed(2),
      emp.overtimeHours.toFixed(2),
      emp.doubleTimeHours.toFixed(2),
      emp.totalHours.toFixed(2),
      `$${emp.totalPay.toFixed(2)}`
    ]);

    // Add totals row
    const totals = hoursData.hoursSummary.reduce((acc, emp) => ({
      regularHours: acc.regularHours + emp.regularHours,
      overtimeHours: acc.overtimeHours + emp.overtimeHours,
      doubleTimeHours: acc.doubleTimeHours + emp.doubleTimeHours,
      totalHours: acc.totalHours + emp.totalHours,
      totalPay: acc.totalPay + emp.totalPay,
    }), { regularHours: 0, overtimeHours: 0, doubleTimeHours: 0, totalHours: 0, totalPay: 0 });

    rows.push([
      'TOTALS',
      '',
      totals.regularHours.toFixed(2),
      totals.overtimeHours.toFixed(2),
      totals.doubleTimeHours.toFixed(2),
      totals.totalHours.toFixed(2),
      `$${totals.totalPay.toFixed(2)}`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payroll_${periodLabel}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast({
      title: t('common.success', 'Success'),
      description: t('payroll.exportedCSV', 'Payroll exported to CSV'),
    });
  };

  // Export to PDF function
  const exportToPDF = () => {
    if (!hoursData || !hoursData.hoursSummary || hoursData.hoursSummary.length === 0) {
      toast({
        title: t('payroll.error', 'Error'),
        description: t('payroll.noDataToExport', 'No data to export'),
        variant: "destructive",
      });
      return;
    }

    const period = hoursData.period;
    const periodLabel = `${format(parseLocalDate(period.startDate), 'MMM dd, yyyy')} - ${format(parseLocalDate(period.endDate), 'MMM dd, yyyy')}`;
    const fileLabel = `${format(parseLocalDate(period.startDate), 'yyyy-MM-dd')}_to_${format(parseLocalDate(period.endDate), 'yyyy-MM-dd')}`;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(18);
    doc.text('Payroll Report', pageWidth / 2, 20, { align: 'center' });
    
    // Period
    doc.setFontSize(12);
    doc.text(`Pay Period: ${periodLabel}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`Status: ${period.status.charAt(0).toUpperCase() + period.status.slice(1)}`, pageWidth / 2, 37, { align: 'center' });

    // Calculate totals
    const totals = hoursData.hoursSummary.reduce((acc, emp) => ({
      regularHours: acc.regularHours + emp.regularHours,
      overtimeHours: acc.overtimeHours + emp.overtimeHours,
      doubleTimeHours: acc.doubleTimeHours + emp.doubleTimeHours,
      totalHours: acc.totalHours + emp.totalHours,
      totalPay: acc.totalPay + emp.totalPay,
    }), { regularHours: 0, overtimeHours: 0, doubleTimeHours: 0, totalHours: 0, totalPay: 0 });

    // Summary box
    doc.setFontSize(10);
    doc.setDrawColor(200);
    doc.rect(14, 45, pageWidth - 28, 25);
    doc.text(`Total Employees: ${hoursData.hoursSummary.length}`, 20, 55);
    doc.text(`Total Hours: ${totals.totalHours.toFixed(2)}`, 70, 55);
    doc.text(`Total Labor Cost: $${totals.totalPay.toFixed(2)}`, 130, 55);
    doc.text(`Regular: ${totals.regularHours.toFixed(2)}h | OT: ${totals.overtimeHours.toFixed(2)}h | 2x: ${totals.doubleTimeHours.toFixed(2)}h`, 20, 63);

    // Table headers
    let yPos = 80;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Employee', 14, yPos);
    doc.text('Rate', 70, yPos);
    doc.text('Regular', 95, yPos);
    doc.text('OT', 120, yPos);
    doc.text('2x', 140, yPos);
    doc.text('Total Hrs', 155, yPos);
    doc.text('Pay', 180, yPos);
    
    yPos += 5;
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 7;

    // Table rows
    doc.setFont('helvetica', 'normal');
    hoursData.hoursSummary.forEach((emp) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(emp.employeeName.substring(0, 25), 14, yPos);
      doc.text(`$${emp.hourlyRate}`, 70, yPos);
      doc.text(emp.regularHours.toFixed(2), 95, yPos);
      doc.text(emp.overtimeHours.toFixed(2), 120, yPos);
      doc.text(emp.doubleTimeHours.toFixed(2), 140, yPos);
      doc.text(emp.totalHours.toFixed(2), 155, yPos);
      doc.text(`$${emp.totalPay.toFixed(2)}`, 180, yPos);
      yPos += 7;
    });

    // Totals row
    yPos += 3;
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('TOTALS', 14, yPos);
    doc.text(totals.regularHours.toFixed(2), 95, yPos);
    doc.text(totals.overtimeHours.toFixed(2), 120, yPos);
    doc.text(totals.doubleTimeHours.toFixed(2), 140, yPos);
    doc.text(totals.totalHours.toFixed(2), 155, yPos);
    doc.text(`$${totals.totalPay.toFixed(2)}`, 180, yPos);

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on ${format(new Date(), 'MMM dd, yyyy h:mm a')}`, 14, 285);

    doc.save(`payroll_${fileLabel}.pdf`);

    toast({
      title: t('common.success', 'Success'),
      description: t('payroll.exportedPDF', 'Payroll exported to PDF'),
    });
  };

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
            title: t('payroll.configurationSaved', 'Configuration Saved'),
            description: t('payroll.configurationSaved', 'Pay period configuration has been updated and periods have been generated.'),
          });
        } else {
          toast({
            title: t('payroll.configurationSaved', 'Configuration Saved'),
            description: t('payroll.error', 'Configuration saved but failed to generate periods. You may need to configure your settings.'),
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: t('payroll.configurationSaved', 'Configuration Saved'),
          description: t('payroll.error', 'Configuration saved but failed to generate periods.'),
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: t('payroll.error', 'Error'),
        description: error.message || t('payroll.error', 'Failed to save configuration'),
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
        title: t('payroll.accessDenied', 'Access Denied'),
        description: t('payroll.accessDeniedMessage', "You don't have permission to access payroll data."),
        variant: "destructive",
      });
      setLocation("/dashboard");
    }
  }, [currentUser, userLoading, canAccessPayroll, setLocation, toast, t]);

  // Show loading while checking permissions
  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">{t('payroll.loading', 'Loading...')}</div>
        </div>
      </div>
    );
  }

  // Don't render anything if user doesn't have financial access
  if (!currentUser || !canAccessPayroll) {
    return null;
  }

  const handleSaveConfiguration = () => {
    // Validate period type is selected
    if (!periodType) {
      toast({
        title: t('payroll.error', 'Validation Error'),
        description: t('payroll.selectPeriod', 'Please select a pay period type'),
        variant: "destructive",
      });
      return;
    }

    // Parse and validate numeric values
    const overtimeMult = parseFloat(overtimeMultiplier);
    const doubleTimeMult = parseFloat(doubleTimeMultiplier);
    const overtimeThreshold = parseFloat(overtimeHoursThreshold);
    const doubleTimeThreshold = parseFloat(doubleTimeHoursThreshold);
    
    // Check for NaN values
    if (isNaN(overtimeMult) || isNaN(doubleTimeMult) || isNaN(overtimeThreshold) || isNaN(doubleTimeThreshold)) {
      toast({
        title: t('payroll.error', 'Validation Error'),
        description: t('payroll.error', 'Please enter valid numbers for all overtime and double time fields'),
        variant: "destructive",
      });
      return;
    }
    
    const config: any = {
      periodType,
      overtimeMultiplier: overtimeMult.toString(),
      doubleTimeMultiplier: doubleTimeMult.toString(),
      overtimeTriggerType: overtimeTriggerType || 'daily',
      overtimeHoursThreshold: overtimeThreshold.toString(),
      doubleTimeTriggerType: doubleTimeTriggerType || 'daily',
      doubleTimeHoursThreshold: doubleTimeThreshold.toString(),
    };

    if (periodType === 'semi-monthly') {
      config.firstPayDay = parseInt(firstPayDay) || 1;
      config.secondPayDay = parseInt(secondPayDay) || 15;
    } else if (periodType === 'monthly') {
      config.monthlyStartDay = parseInt(monthlyStartDay) || 1;
      config.monthlyEndDay = parseInt(monthlyEndDay) || 31;
    } else if (periodType === 'weekly') {
      config.startDayOfWeek = parseInt(startDayOfWeek) || 0;
    } else if (periodType === 'bi-weekly') {
      config.startDayOfWeek = parseInt(startDayOfWeek) || 0;
      config.biWeeklyAnchorDate = biWeeklyAnchorDate || getLocalDateString();
    } else if (periodType === 'custom') {
      if (!customStartDate || !customEndDate) {
        toast({
          title: t('payroll.error', 'Validation Error'),
          description: t('payroll.error', 'Please provide both start and end dates for custom period'),
          variant: "destructive",
        });
        return;
      }
      config.customStartDate = customStartDate;
      config.customEndDate = customEndDate;
    }

    saveConfigMutation.mutate(config);
  };

  const handleAddWorkSession = () => {
    // Validate required fields
    if (!selectedEmployeeId || !workDate || !startTime || !endTime) {
      toast({
        title: t('payroll.error', 'Validation Error'),
        description: t('payroll.error', 'Please fill in all required fields'),
        variant: "destructive",
      });
      return;
    }

    // Validate session type specific requirements
    if (sessionType === 'billable' && !selectedProjectId) {
      toast({
        title: t('payroll.error', 'Validation Error'),
        description: t('payroll.error', 'Please select a project for billable hours'),
        variant: "destructive",
      });
      return;
    }

    if (sessionType === 'non-billable' && !description.trim()) {
      toast({
        title: t('payroll.error', 'Validation Error'),
        description: t('payroll.error', 'Please provide a description for non-billable hours'),
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
    { value: "0", label: t('payroll.sunday', 'Sunday') },
    { value: "1", label: t('payroll.monday', 'Monday') },
    { value: "2", label: t('payroll.tuesday', 'Tuesday') },
    { value: "3", label: t('payroll.wednesday', 'Wednesday') },
    { value: "4", label: t('payroll.thursday', 'Thursday') },
    { value: "5", label: t('payroll.friday', 'Friday') },
    { value: "6", label: t('payroll.saturday', 'Saturday') },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-3xl font-bold truncate" data-testid="heading-payroll">{t('payroll.title', 'Payroll')}</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">{t('payroll.subtitle', 'Manage payroll and quotes')}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="grid w-full min-w-[400px] md:min-w-0 grid-cols-4 gap-1">
            <TabsTrigger value="hours" data-testid="tab-hours" className="text-xs md:text-sm px-2 md:px-4">
              <Users className="w-4 h-4 md:mr-2 flex-shrink-0" />
              <span className="hidden md:inline">{t('payroll.employeeHours', 'Employee Hours')}</span>
              <span className="md:hidden">{t('payroll.hours', 'Hours')}</span>
            </TabsTrigger>
            <TabsTrigger value="add-hours" data-testid="tab-add-hours" className="text-xs md:text-sm px-2 md:px-4">
              <Clock className="w-4 h-4 md:mr-2 flex-shrink-0" />
              <span className="hidden md:inline">{t('payroll.addHours', 'Add Hours')}</span>
              <span className="md:hidden">{t('common.add', 'Add')}</span>
            </TabsTrigger>
            <TabsTrigger value="past-periods" data-testid="tab-past-periods" className="text-xs md:text-sm px-2 md:px-4">
              <Calendar className="w-4 h-4 md:mr-2 flex-shrink-0" />
              <span className="hidden md:inline">{t('payroll.pastPeriod', 'Past Periods')}</span>
              <span className="md:hidden">{t('payroll.pastPeriod', 'Past')}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings" className="text-xs md:text-sm px-2 md:px-4">
              <Settings className="w-4 h-4 md:mr-2 flex-shrink-0" />
              <span className="hidden md:inline">{t('payroll.settings', 'Settings')}</span>
              <span className="md:hidden">{t('payroll.settings', 'Settings')}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('payroll.employeeHours', 'Employee Hours Summary')}</CardTitle>
              <CardDescription>{t('payroll.selectPeriod', 'Select a pay period to view employee hours and labor costs')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="period-select">{t('payroll.payPeriods', 'Pay Period')}</Label>
                  <Select 
                    value={selectedPeriodId || ""} 
                    onValueChange={setSelectedPeriodId}
                  >
                    <SelectTrigger id="period-select" data-testid="select-pay-period">
                      <SelectValue placeholder={t('payroll.selectPeriod', 'Select a pay period')} />
                    </SelectTrigger>
                    <SelectContent>
                      {periodsData?.periods
                        .slice()
                        .sort((a, b) => {
                          const statusOrder = { current: 0, upcoming: 1, past: 2 };
                          const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
                          const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
                          if (aOrder !== bOrder) return aOrder - bOrder;
                          return parseLocalDate(b.startDate).getTime() - parseLocalDate(a.startDate).getTime();
                        })
                        .map((period) => (
                        <SelectItem key={period.id} value={period.id}>
                          {format(parseLocalDate(period.startDate), 'MMM dd, yyyy', { locale: getDateLocale() })} - {format(parseLocalDate(period.endDate), 'MMM dd, yyyy', { locale: getDateLocale() })} ({period.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Export buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={exportToCSV}
                    disabled={!hoursData || hoursData.hoursSummary.length === 0}
                    data-testid="button-export-csv"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{t('payroll.exportCSV', 'Export CSV')}</span>
                    <span className="sm:hidden">CSV</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={exportToPDF}
                    disabled={!hoursData || hoursData.hoursSummary.length === 0}
                    data-testid="button-export-pdf"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{t('payroll.exportPDF', 'Export PDF')}</span>
                    <span className="sm:hidden">PDF</span>
                  </Button>
                </div>
              </div>

              {selectedPeriodId && hoursLoading && (
                <div className="text-center py-8 text-muted-foreground">{t('payroll.loading', 'Loading employee hours...')}</div>
              )}

              {selectedPeriodId && !hoursLoading && hoursData && hoursData.hoursSummary.length > 0 && (
                <div className="space-y-4">
                  {(() => {
                    // Calculate piece work total from all sessions
                    const pieceWorkTotal = hoursData.hoursSummary.reduce((total, emp) => {
                      return total + emp.sessions.reduce((empTotal, session) => {
                        if (session.isPeaceWork && session.peaceWorkPay) {
                          return empTotal + parseFloat(session.peaceWorkPay);
                        }
                        return empTotal;
                      }, 0);
                    }, 0);
                    
                    return (
                      <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{t('payroll.employee', 'Total Employees')}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{hoursData.hoursSummary.length}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{t('payroll.totalHours', 'Total Hours')}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {hoursData.hoursSummary.reduce((sum, emp) => sum + emp.totalHours, 0).toFixed(2)}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{t('payroll.pieceWorkTotal', 'Piece Work')}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              ${pieceWorkTotal.toFixed(2)}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{t('payroll.grossPay', 'Total Labor Cost')}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              ${hoursData.hoursSummary.reduce((sum, emp) => sum + emp.totalPay, 0).toFixed(2)}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })()}

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
                                    {t('payroll.totalHours', 'Total')}: <span className="font-medium">{employee.totalHours.toFixed(2)}h</span>
                                    {" "}(
                                    <span className="text-foreground">{employee.regularHours.toFixed(2)}h</span> {t('payroll.regularHours', 'regular')}
                                    {employee.overtimeHours > 0 && <>, <span className="text-orange-600 dark:text-orange-400">{employee.overtimeHours.toFixed(2)}h</span> {t('payroll.overtimeHours', 'OT')}</>}
                                    {employee.doubleTimeHours > 0 && <>, <span className="text-red-600 dark:text-red-400">{employee.doubleTimeHours.toFixed(2)}h</span> {t('payroll.doubleTimeHours', '2x')}</>}
                                    )
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {employee.sessions.length} {t('payroll.sessions', 'work sessions')}
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
                              <div className="text-sm font-semibold mb-3">{t('payroll.sessions', 'Work Sessions')}</div>
                              {employee.sessions.map((session, index) => {
                                const startTime = new Date(session.startTime);
                                const endTime = session.endTime ? new Date(session.endTime) : null;
                                const hours = endTime 
                                  ? ((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))
                                  : 0;
                                const isPeaceWork = Boolean(session.isPeaceWork);
                                const peaceWorkPayAmount = session.peaceWorkPay ? parseFloat(session.peaceWorkPay) : 0;
                                const sessionCost = isPeaceWork 
                                  ? peaceWorkPayAmount
                                  : hours * parseFloat(employee.hourlyRate);
                                const totalDrops = (session.dropsCompletedNorth || 0) + 
                                                  (session.dropsCompletedEast || 0) + 
                                                  (session.dropsCompletedSouth || 0) + 
                                                  (session.dropsCompletedWest || 0);
                                
                                return (
                                  <Card key={session.id} className="bg-muted/30" data-testid={`session-${session.id}`}>
                                    <CardContent className="p-4">
                                      <div className="flex justify-between gap-4">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                          <div>
                                            <div className="flex items-center gap-2 mb-2">
                                              <span className="material-icons text-sm">event</span>
                                              <span className="font-medium">
                                                {format(parseLocalDate(session.workDate), 'EEE, MMM dd, yyyy', { locale: getDateLocale() })}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                              <span className="material-icons text-sm">business</span>
                                              <span className="text-muted-foreground">{session.projectName || t('payroll.nonBillable', 'Non-Billable')}</span>
                                              {isPeaceWork && (
                                                <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                                  {t('payroll.pieceWork', 'Piece Work')}
                                                </Badge>
                                              )}
                                            </div>
                                            {totalDrops > 0 && (
                                              <div className="flex items-center gap-2">
                                                <span className="material-icons text-sm">check_circle</span>
                                                <span className="text-muted-foreground">
                                                  {totalDrops} {t('payroll.dropsNorth', 'drops completed')}
                                                  {isPeaceWork && totalDrops > 0 && ` @ $${(peaceWorkPayAmount / totalDrops).toFixed(0)}/drop`}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2 mb-2">
                                              <Clock className="h-4 w-4" />
                                              <span className="text-muted-foreground">
                                                {format(startTime, 'h:mm a')} - {endTime ? format(endTime, 'h:mm a') : t('payroll.loading', 'In Progress')}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                              <span className="material-icons text-sm">schedule</span>
                                              <div className="flex flex-col">
                                                <span className="font-semibold">{hours.toFixed(2)} {t('payroll.hours', 'hours')}</span>
                                                {(session.regularHours || session.overtimeHours || session.doubleTimeHours) && (
                                                  <span className="text-xs text-muted-foreground">
                                                    {parseFloat(session.regularHours || '0').toFixed(2)}h {t('payroll.regularHours', 'regular')}
                                                    {session.overtimeHours && parseFloat(session.overtimeHours) > 0 && (
                                                      <>, <span className="text-orange-600 dark:text-orange-400 font-medium">{parseFloat(session.overtimeHours).toFixed(2)}h {t('payroll.overtimeHours', 'OT')}</span></>
                                                    )}
                                                    {session.doubleTimeHours && parseFloat(session.doubleTimeHours) > 0 && (
                                                      <>, <span className="text-red-600 dark:text-red-400 font-medium">{parseFloat(session.doubleTimeHours).toFixed(2)}h {t('payroll.doubleTimeHours', '2x')}</span></>
                                                    )}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <DollarSign className="h-4 w-4" />
                                              <span className="font-semibold text-primary">${sessionCost.toFixed(2)}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => {
                                              setEditingSession(session);
                                              setIsEditDialogOpen(true);
                                            }}
                                            data-testid={`button-edit-session-${session.id}`}
                                          >
                                            <Pencil className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => {
                                              setDeleteSessionId(session.id);
                                              setIsDeleteDialogOpen(true);
                                            }}
                                            data-testid={`button-delete-session-${session.id}`}
                                          >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                          </Button>
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
                    {t('payroll.noHoursData', 'No employee hours recorded for this pay period.')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('payroll.noHoursData', 'Work sessions logged during this period will appear here automatically.')}
                  </div>
                </div>
              )}

              {!selectedPeriodId && (
                <div className="text-center py-12 text-muted-foreground">
                  {t('payroll.selectPeriod', 'Select a pay period above to view employee hours.')}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('payroll.addHours', 'Add Work Hours')}</CardTitle>
              <CardDescription>{t('payroll.addHours', 'Manually add work hours for employees (e.g., when they forgot to clock in)')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="employee-select">{t('payroll.employee', 'Employee')} *</Label>
                  <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                    <SelectTrigger id="employee-select" data-testid="select-employee">
                      <SelectValue placeholder={t('payroll.employee', 'Select employee')} />
                    </SelectTrigger>
                    <SelectContent>
                      {employeesData?.employees
                        .filter((emp) => !emp.suspendedAt && emp.connectionStatus !== 'suspended' && !emp.terminatedDate)
                        .map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name} ({emp.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-type">{t('payroll.sessionType', 'Session Type')} *</Label>
                  <Select value={sessionType} onValueChange={setSessionType}>
                    <SelectTrigger id="session-type" data-testid="select-session-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="billable">{t('payroll.billable', 'Billable (Project Work)')}</SelectItem>
                      <SelectItem value="non-billable">{t('payroll.nonBillable', 'Non-Billable (Errands, Maintenance)')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {sessionType === 'billable' && (
                <div className="space-y-2">
                  <Label htmlFor="project-select">{t('payroll.project', 'Project')} *</Label>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger id="project-select" data-testid="select-project">
                      <SelectValue placeholder={t('payroll.project', 'Select project')} />
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
                  <Label htmlFor="description">{t('payroll.description', 'Description')} *</Label>
                  <Input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('payroll.description', 'e.g., Errands, Equipment Maintenance, Admin Work')}
                    data-testid="input-description"
                  />
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="work-date">{t('payroll.workDate', 'Work Date')} *</Label>
                  <Input
                    id="work-date"
                    type="date"
                    value={workDate}
                    onChange={(e) => setWorkDate(e.target.value)}
                    data-testid="input-work-date"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-time">{t('payroll.startTime', 'Start Time')} *</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    data-testid="input-start-time"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-time">{t('payroll.endTime', 'End Time')} *</Label>
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
                        <h4 className="font-medium mb-3">{t('payroll.dropsNorth', 'Stalls Completed (Optional)')}</h4>
                        <div className="space-y-2">
                          <Label htmlFor="stalls-completed">{t('payroll.dropsNorth', 'Number of Stalls')}</Label>
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
                        <h4 className="font-medium mb-3">{t('payroll.dropsNorth', 'Floors Completed (Optional)')}</h4>
                        <div className="space-y-2">
                          <Label htmlFor="floors-completed">{t('payroll.dropsNorth', 'Number of Floors')}</Label>
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
                        <h4 className="font-medium mb-3">{t('payroll.dropsNorth', 'Work Completed (Optional)')}</h4>
                        <div className="space-y-2">
                          <Label htmlFor="work-completed">{t('payroll.dropsNorth', 'Amount Completed')}</Label>
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
                        <h4 className="font-medium mb-3">{t('payroll.dropsNorth', 'Drops Completed (Optional)')}</h4>
                        <div className="grid gap-4 md:grid-cols-4">
                          <div className="space-y-2">
                            <Label htmlFor="drops-north">{t('payroll.dropsNorth', 'North')}</Label>
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
                            <Label htmlFor="drops-east">{t('payroll.dropsEast', 'East')}</Label>
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
                            <Label htmlFor="drops-south">{t('payroll.dropsSouth', 'South')}</Label>
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
                            <Label htmlFor="drops-west">{t('payroll.dropsWest', 'West')}</Label>
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
                    <Label htmlFor="shortfall-reason">{t('payroll.shortfallReason', 'Shortfall Reason (if work below target)')}</Label>
                    <Input
                      id="shortfall-reason"
                      type="text"
                      value={shortfallReason}
                      onChange={(e) => setShortfallReason(e.target.value)}
                      placeholder={t('payroll.placeholders.shortfallReason', 'e.g., Weather delay, Equipment issue')}
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
                {addWorkSessionMutation.isPending ? t('payroll.loading', 'Adding...') : t('payroll.addHours', 'Add Work Hours')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past-periods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('payroll.pastPeriod', 'Past Pay Periods')}</CardTitle>
              <CardDescription>{t('payroll.pastPeriod', 'View historical pay periods')}</CardDescription>
            </CardHeader>
            <CardContent>
              {!periodsData?.periods || periodsData.periods.filter(p => p.status === 'past').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('payroll.noPeriods', 'No past pay periods yet.')}
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
                              {format(parseLocalDate(period.startDate), 'MMM dd, yyyy', { locale: getDateLocale() })} - {format(parseLocalDate(period.endDate), 'MMM dd, yyyy', { locale: getDateLocale() })}
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
                            {t('payroll.hours', 'View Hours')}
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
              <CardTitle>{t('payroll.configuration', 'Pay Period Configuration')}</CardTitle>
              <CardDescription>{t('payroll.configuration', 'Configure how pay periods are calculated. Periods are automatically generated when you save.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="period-type">{t('payroll.periodType', 'Pay Period Type')}</Label>
                <Select value={periodType} onValueChange={setPeriodType}>
                  <SelectTrigger id="period-type" data-testid="select-period-type">
                    <SelectValue placeholder={t('payroll.periodType', 'Select period type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semi-monthly">{t('payroll.semiMonthly', 'Semi-Monthly')}</SelectItem>
                    <SelectItem value="monthly">{t('payroll.monthly', 'Monthly')}</SelectItem>
                    <SelectItem value="weekly">{t('payroll.weekly', 'Weekly')}</SelectItem>
                    <SelectItem value="bi-weekly">{t('payroll.biWeekly', 'Bi-Weekly')}</SelectItem>
                    <SelectItem value="custom">{t('payroll.custom', 'Custom Range')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {periodType === 'semi-monthly' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-pay-day">{t('payroll.firstPayDay', 'First Pay Day of Month')}</Label>
                    <Input
                      id="first-pay-day"
                      type="number"
                      min="1"
                      max="28"
                      value={firstPayDay}
                      onChange={(e) => setFirstPayDay(e.target.value)}
                      data-testid="input-first-pay-day"
                    />
                    <p className="text-sm text-muted-foreground">{t('payroll.firstPayDay', 'Day 1-28')}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="second-pay-day">{t('payroll.secondPayDay', 'Second Pay Day of Month')}</Label>
                    <Input
                      id="second-pay-day"
                      type="number"
                      min="1"
                      max="28"
                      value={secondPayDay}
                      onChange={(e) => setSecondPayDay(e.target.value)}
                      data-testid="input-second-pay-day"
                    />
                    <p className="text-sm text-muted-foreground">{t('payroll.secondPayDay', 'Day 1-28')}</p>
                  </div>
                </div>
              )}

              {periodType === 'monthly' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="monthly-start-day">{t('payroll.startDate', 'Period Start Day')}</Label>
                    <Input
                      id="monthly-start-day"
                      type="number"
                      min="1"
                      max="28"
                      value={monthlyStartDay}
                      onChange={(e) => setMonthlyStartDay(e.target.value)}
                      data-testid="input-monthly-start-day"
                    />
                    <p className="text-sm text-muted-foreground">{t('payroll.startDate', 'Day of month when period starts (1-28)')}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-end-day">{t('payroll.endDate', 'Period End Day')}</Label>
                    <Input
                      id="monthly-end-day"
                      type="number"
                      min="1"
                      max="31"
                      value={monthlyEndDay}
                      onChange={(e) => setMonthlyEndDay(e.target.value)}
                      data-testid="input-monthly-end-day"
                    />
                    <p className="text-sm text-muted-foreground">{t('payroll.endDate', 'Day of month when period ends (1-31)')}</p>
                  </div>
                </div>
              )}

              {periodType === 'weekly' && (
                <div className="space-y-2">
                  <Label htmlFor="start-day-week">{t('payroll.startDayOfWeek', 'Week Starts On')}</Label>
                  <Select value={startDayOfWeek} onValueChange={setStartDayOfWeek}>
                    <SelectTrigger id="start-day-week" data-testid="select-start-day">
                      <SelectValue placeholder={t('payroll.startDayOfWeek', 'Select day')} />
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
                    <Label htmlFor="start-day-week-biweekly">{t('payroll.startDayOfWeek', 'Week Starts On')}</Label>
                    <Select value={startDayOfWeek} onValueChange={setStartDayOfWeek}>
                      <SelectTrigger id="start-day-week-biweekly" data-testid="select-start-day-biweekly">
                        <SelectValue placeholder={t('payroll.startDayOfWeek', 'Select day')} />
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
                    <Label htmlFor="anchor-date">{t('payroll.anchorDate', 'Starting Date (Anchor)')}</Label>
                    <Input
                      id="anchor-date"
                      type="date"
                      value={biWeeklyAnchorDate}
                      onChange={(e) => setBiWeeklyAnchorDate(e.target.value)}
                      data-testid="input-anchor-date"
                    />
                    <p className="text-sm text-muted-foreground">
                      {t('payroll.anchorDate', 'First day of a pay period to use as reference')}
                    </p>
                  </div>
                </div>
              )}

              {periodType === 'custom' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="custom-start-date">{t('payroll.startDate', 'Period Start Date')}</Label>
                    <Input
                      id="custom-start-date"
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      data-testid="input-custom-start-date"
                    />
                    <p className="text-sm text-muted-foreground">
                      {t('payroll.startDate', 'Starting date of your custom pay period')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-end-date">{t('payroll.endDate', 'Period End Date')}</Label>
                    <Input
                      id="custom-end-date"
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      data-testid="input-custom-end-date"
                    />
                    <p className="text-sm text-muted-foreground">
                      {t('payroll.endDate', 'Ending date of your custom pay period')}
                    </p>
                  </div>
                </div>
              )}

              {/* Overtime and Double Time Pay Settings */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {t('payroll.overtimeSettings', 'Overtime & Double Time Pay')}
                </h3>
                
                {/* Overtime Settings */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium text-sm text-muted-foreground">{t('payroll.overtimeSettings', 'Overtime Configuration')}</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="overtime-trigger-type">{t('payroll.triggerType', 'Overtime Trigger')}</Label>
                      <Select value={overtimeTriggerType} onValueChange={setOvertimeTriggerType}>
                        <SelectTrigger id="overtime-trigger-type" data-testid="select-overtime-trigger-type">
                          <SelectValue placeholder={t('payroll.triggerType', 'Select trigger type')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t('payroll.triggerType', 'None (No Overtime)')}</SelectItem>
                          <SelectItem value="daily">{t('payroll.daily', 'Per Day')}</SelectItem>
                          <SelectItem value="weekly">{t('payroll.weekly', 'Per Week')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overtime-hours-threshold">
                        {overtimeTriggerType === 'daily' ? t('payroll.hoursThreshold', 'Triggers After (Hours/Day)') : overtimeTriggerType === 'weekly' ? t('payroll.hoursThreshold', 'Triggers After (Hours/Week)') : t('payroll.hoursThreshold', 'Not Applicable')}
                      </Label>
                      <Input
                        id="overtime-hours-threshold"
                        type="number"
                        min="0"
                        max="168"
                        step="0.5"
                        disabled={overtimeTriggerType === 'none'}
                        value={overtimeHoursThreshold}
                        onChange={(e) => setOvertimeHoursThreshold(e.target.value)}
                        data-testid="input-overtime-hours-threshold"
                      />
                      <p className="text-sm text-muted-foreground">
                        {overtimeTriggerType === 'daily' ? t('payroll.hoursThreshold', 'e.g., after 8 hours/day') : t('payroll.hoursThreshold', 'e.g., after 40 hours/week')}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overtime-multiplier">{t('payroll.overtimeMultiplier', 'Pay Multiplier')}</Label>
                      <Input
                        id="overtime-multiplier"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        disabled={overtimeTriggerType === 'none'}
                        value={overtimeMultiplier}
                        onChange={(e) => setOvertimeMultiplier(e.target.value)}
                        data-testid="input-overtime-multiplier"
                      />
                      <p className="text-sm text-muted-foreground">
                        {overtimeTriggerType === 'none' ? t('payroll.overtimeMultiplier', 'Not applicable') : t('payroll.overtimeMultiplier', 'e.g., 1.5 for time-and-a-half')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Double Time Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">{t('payroll.doubleTimeMultiplier', 'Double Time Configuration')}</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="double-time-trigger-type">{t('payroll.triggerType', 'Double Time Trigger')}</Label>
                      <Select value={doubleTimeTriggerType} onValueChange={setDoubleTimeTriggerType}>
                        <SelectTrigger id="double-time-trigger-type" data-testid="select-double-time-trigger-type">
                          <SelectValue placeholder={t('payroll.triggerType', 'Select trigger type')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t('payroll.triggerType', 'None (No Double Time)')}</SelectItem>
                          <SelectItem value="daily">{t('payroll.daily', 'Per Day')}</SelectItem>
                          <SelectItem value="weekly">{t('payroll.weekly', 'Per Week')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="double-time-hours-threshold">
                        {doubleTimeTriggerType === 'daily' ? t('payroll.hoursThreshold', 'Triggers After (Hours/Day)') : doubleTimeTriggerType === 'weekly' ? t('payroll.hoursThreshold', 'Triggers After (Hours/Week)') : t('payroll.hoursThreshold', 'Not Applicable')}
                      </Label>
                      <Input
                        id="double-time-hours-threshold"
                        type="number"
                        min="0"
                        max="168"
                        step="0.5"
                        disabled={doubleTimeTriggerType === 'none'}
                        value={doubleTimeHoursThreshold}
                        onChange={(e) => setDoubleTimeHoursThreshold(e.target.value)}
                        data-testid="input-double-time-hours-threshold"
                      />
                      <p className="text-sm text-muted-foreground">
                        {doubleTimeTriggerType === 'none' ? t('payroll.hoursThreshold', 'Not applicable') : doubleTimeTriggerType === 'daily' ? t('payroll.hoursThreshold', 'e.g., after 12 hours/day') : t('payroll.hoursThreshold', 'e.g., after 60 hours/week')}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="double-time-multiplier">{t('payroll.doubleTimeMultiplier', 'Pay Multiplier')}</Label>
                      <Input
                        id="double-time-multiplier"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        disabled={doubleTimeTriggerType === 'none'}
                        value={doubleTimeMultiplier}
                        onChange={(e) => setDoubleTimeMultiplier(e.target.value)}
                        data-testid="input-double-time-multiplier"
                      />
                      <p className="text-sm text-muted-foreground">
                        {doubleTimeTriggerType === 'none' ? t('payroll.doubleTimeMultiplier', 'Not applicable') : t('payroll.doubleTimeMultiplier', 'e.g., 2.0 for double time')}
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
                {t('payroll.saveConfiguration', 'Save Configuration')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Work Session Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('payroll.editSession', 'Edit Work Session')}</DialogTitle>
            <DialogDescription>
              {t('payroll.editSession', 'Update the work session details')}
            </DialogDescription>
          </DialogHeader>
          {editingSession && (
            <EditSessionForm
              session={editingSession}
              onSave={(data) => {
                const isNonBillable = !editingSession.projectId;
                updateWorkSessionMutation.mutate({
                  sessionId: editingSession.id,
                  data,
                  isNonBillable
                });
              }}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingSession(null);
              }}
              isPending={updateWorkSessionMutation.isPending}
              projects={projectsData?.projects || []}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('payroll.confirmDelete', 'Delete Work Session?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('payroll.confirmDelete', 'This action cannot be undone. This will permanently delete the work session.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('payroll.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteSessionId) {
                  const session = hoursData?.hoursSummary
                    .flatMap(e => e.sessions)
                    .find(s => s.id === deleteSessionId);
                  const isNonBillable = session && !session.projectId;
                  deleteWorkSessionMutation.mutate({
                    sessionId: deleteSessionId,
                    isNonBillable: !!isNonBillable
                  });
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t('payroll.delete', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Edit Session Form Component
function EditSessionForm({ session, onSave, onCancel, isPending, projects }: {
  session: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
  projects: any[];
}) {
  const { t } = useTranslation();
  const [workDate, setWorkDate] = useState(session.workDate.split('T')[0]);
  const [startTime, setStartTime] = useState(format(new Date(session.startTime), 'HH:mm'));
  const [endTime, setEndTime] = useState(format(new Date(session.endTime), 'HH:mm'));
  const [dropsNorth, setDropsNorth] = useState(String(session.dropsCompletedNorth || 0));
  const [dropsEast, setDropsEast] = useState(String(session.dropsCompletedEast || 0));
  const [dropsSouth, setDropsSouth] = useState(String(session.dropsCompletedSouth || 0));
  const [dropsWest, setDropsWest] = useState(String(session.dropsCompletedWest || 0));
  const [shortfallReason, setShortfallReason] = useState(session.shortfallReason || "");
  const [description, setDescription] = useState(session.description || "");

  const isNonBillable = !session.projectId;
  const project = projects.find(p => p.id === session.projectId);
  const jobType = project?.jobType || '4_elevation_system';

  const handleSubmit = () => {
    const startDateTime = new Date(`${workDate}T${startTime}`);
    const endDateTime = new Date(`${workDate}T${endTime}`);

    if (isNonBillable) {
      onSave({
        workDate,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        description,
      });
    } else {
      onSave({
        workDate,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        dropsCompletedNorth: parseInt(dropsNorth) || 0,
        dropsCompletedEast: parseInt(dropsEast) || 0,
        dropsCompletedSouth: parseInt(dropsSouth) || 0,
        dropsCompletedWest: parseInt(dropsWest) || 0,
        shortfallReason: shortfallReason.trim() || null,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="edit-work-date">{t('payroll.workDate', 'Work Date')} *</Label>
          <Input
            id="edit-work-date"
            type="date"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            data-testid="input-edit-work-date"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-start-time">{t('payroll.startTime', 'Start Time')} *</Label>
          <Input
            id="edit-start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            data-testid="input-edit-start-time"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-end-time">{t('payroll.endTime', 'End Time')} *</Label>
          <Input
            id="edit-end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            data-testid="input-edit-end-time"
          />
        </div>
      </div>

      {isNonBillable ? (
        <div className="space-y-2">
          <Label htmlFor="edit-description">{t('payroll.description', 'Description')} *</Label>
          <Input
            id="edit-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('payroll.description', 'e.g., Errands, Admin Work')}
            data-testid="input-edit-description"
          />
        </div>
      ) : (
        <>
          <div className="border-t pt-4">
            {jobType === 'parkade_pressure_cleaning' ? (
              <div className="space-y-2">
                <Label htmlFor="edit-stalls">{t('payroll.dropsNorth', 'Stalls Completed')}</Label>
                <Input
                  id="edit-stalls"
                  type="number"
                  min="0"
                  value={dropsNorth}
                  onChange={(e) => setDropsNorth(e.target.value)}
                  data-testid="input-edit-stalls"
                />
              </div>
            ) : jobType === 'in_suite_dryer_vent_cleaning' ? (
              <div className="space-y-2">
                <Label htmlFor="edit-floors">{t('payroll.dropsNorth', 'Floors Completed')}</Label>
                <Input
                  id="edit-floors"
                  type="number"
                  min="0"
                  value={dropsNorth}
                  onChange={(e) => setDropsNorth(e.target.value)}
                  data-testid="input-edit-floors"
                />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-drops-north">{t('payroll.dropsNorth', 'North')}</Label>
                  <Input
                    id="edit-drops-north"
                    type="number"
                    min="0"
                    value={dropsNorth}
                    onChange={(e) => setDropsNorth(e.target.value)}
                    data-testid="input-edit-drops-north"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-drops-east">{t('payroll.dropsEast', 'East')}</Label>
                  <Input
                    id="edit-drops-east"
                    type="number"
                    min="0"
                    value={dropsEast}
                    onChange={(e) => setDropsEast(e.target.value)}
                    data-testid="input-edit-drops-east"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-drops-south">{t('payroll.dropsSouth', 'South')}</Label>
                  <Input
                    id="edit-drops-south"
                    type="number"
                    min="0"
                    value={dropsSouth}
                    onChange={(e) => setDropsSouth(e.target.value)}
                    data-testid="input-edit-drops-south"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-drops-west">{t('payroll.dropsWest', 'West')}</Label>
                  <Input
                    id="edit-drops-west"
                    type="number"
                    min="0"
                    value={dropsWest}
                    onChange={(e) => setDropsWest(e.target.value)}
                    data-testid="input-edit-drops-west"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-shortfall-reason">{t('payroll.shortfallReason', 'Shortfall Reason')}</Label>
            <Input
              id="edit-shortfall-reason"
              type="text"
              value={shortfallReason}
              onChange={(e) => setShortfallReason(e.target.value)}
              placeholder={t('payroll.shortfallReason', 'e.g., Weather delay, Equipment issue')}
              data-testid="input-edit-shortfall-reason"
            />
          </div>
        </>
      )}

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isPending}>
          {t('payroll.cancel', 'Cancel')}
        </Button>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? t('payroll.loading', 'Saving...') : t('payroll.save', 'Save Changes')}
        </Button>
      </div>
    </div>
  );
}
