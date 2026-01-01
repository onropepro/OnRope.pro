import { useState, useEffect, useMemo, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import FullCalendar from "@fullcalendar/react";
import { toLocalDateString, parseLocalDate, nextDateOnly, addDaysToDateString, extractLocalDateFromISO, formatDateTime, formatLocalDate } from "@/lib/dateUtils";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import type { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import frLocale from "@fullcalendar/core/locales/fr";
import enLocale from "@fullcalendar/core/locales/en-gb";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus, Edit2, Trash2, Users, User as UserIcon, ArrowLeft, UserCheck, UserX, Lock, ChevronLeft, ChevronRight, Briefcase, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { ScheduledJobWithAssignments, User, EmployeeTimeOff } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { canViewSchedule, canViewFullSchedule, canViewOwnSchedule, canEditSchedule } from "@/lib/permissions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BrandingContext } from "@/App";
import { DoubleBookingWarningDialog } from "@/components/DoubleBookingWarningDialog";

export default function Schedule() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  
  // Get the appropriate FullCalendar locale based on current language
  const calendarLocale = i18n.language?.startsWith('fr') ? frLocale : enLocale;
  const [, setLocation] = useLocation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ScheduledJobWithAssignments | null>(null);
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date } | null>(null);
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  
  const { brandColors, brandingActive } = useContext(BrandingContext);
  const defaultJobColor = brandingActive && brandColors.length > 0 ? brandColors[0] : "hsl(var(--primary))";
  
  // Shared assignment dialog state (used by both drag-drop and job detail button)
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedEmployeeForAssignment, setSelectedEmployeeForAssignment] = useState<User | null>(null);
  const [jobForAssignment, setJobForAssignment] = useState<ScheduledJobWithAssignments | null>(null);
  const [assignmentDates, setAssignmentDates] = useState<{ startDate: string; endDate: string }>({
    startDate: "",
    endDate: "",
  });
  
  // Employee schedule week navigation
  const [weekOffset, setWeekOffset] = useState(0);
  
  // Timeline view mode: day, week, or month
  const [timelineViewMode, setTimelineViewMode] = useState<'day' | 'week' | 'month'>('week');
  
  // Mobile: collapse availability section by default
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  
  // Double-booking warning dialog state
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<{
    conflicts: Array<{ employeeId: string; employeeName: string; conflictingJob: string; conflictType?: 'job' | 'time_off' }>;
    pendingAssignment: { jobId: string; employeeIds?: string[]; employeeId?: string; startDate?: string; endDate?: string } | null;
    assignmentType: 'batch' | 'single';
  }>({ conflicts: [], pendingAssignment: null, assignmentType: 'batch' });

  // Fetch current user
  const { data: currentUserData, isLoading: isLoadingUser } = useQuery<{ user: User }>({
    queryKey: ["/api/user"],
  });
  const currentUser = currentUserData?.user;

  // Check granular schedule permissions
  const hasSchedulePermission = canViewSchedule(currentUser);
  const hasFullScheduleAccess = canViewFullSchedule(currentUser);
  const hasOwnScheduleOnly = canViewOwnSchedule(currentUser) && !hasFullScheduleAccess;
  const hasEditPermission = canEditSchedule(currentUser);

  // ALL HOOKS MUST BE DEFINED BEFORE ANY EARLY RETURNS (React rules of hooks)
  
  // Time off dialog state
  const [timeOffDialogOpen, setTimeOffDialogOpen] = useState(false);
  const [selectedEmployeeForTimeOff, setSelectedEmployeeForTimeOff] = useState<string>("");
  const [selectedTimeOffStartDate, setSelectedTimeOffStartDate] = useState<string>("");
  const [selectedTimeOffEndDate, setSelectedTimeOffEndDate] = useState<string>("");
  const [selectedTimeOffType, setSelectedTimeOffType] = useState<string>("day_off");
  const [timeOffNotes, setTimeOffNotes] = useState<string>("");

  // Fetch scheduled jobs - for full schedule access users, get all jobs
  // For own schedule only users, use the dedicated my-jobs endpoint
  const { data: jobsData, isLoading } = useQuery<{ jobs: ScheduledJobWithAssignments[] }>({
    queryKey: hasOwnScheduleOnly ? ["/api/schedule/my-jobs"] : ["/api/schedule"],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    enabled: hasSchedulePermission && !isLoadingUser,
  });
  const jobs = jobsData?.jobs || [];

  // Fetch employees for assignment - ONLY for full schedule access (managers)
  const { data: employeesData } = useQuery<{ employees: (User & { connectionStatus?: string })[] }>({
    queryKey: ["/api/employees"],
    enabled: hasFullScheduleAccess && !isLoadingUser,
  });
  // Filter out suspended and terminated employees from schedule
  // Check both users.suspendedAt (primary) and connectionStatus (PLUS multi-employer)
  const employees = (employeesData?.employees || []).filter(e => 
    !e.suspendedAt && !e.terminatedDate && e.connectionStatus !== 'suspended'
  );

  // Fetch employee time off entries - ONLY for full schedule access (managers)
  const { data: timeOffData } = useQuery<{ timeOff: EmployeeTimeOff[] }>({
    queryKey: ["/api/employee-time-off"],
    enabled: hasFullScheduleAccess && !isLoadingUser,
  });
  const timeOffEntries = timeOffData?.timeOff || [];

  // EARLY RETURNS - must be after all hooks
  // If still loading user, show nothing (prevent flash of access denied)
  if (isLoadingUser) {
    return null;
  }

  // If no permission at all, show access denied
  if (currentUser && !hasSchedulePermission) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Card className="border-2 border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <div className="rounded-full bg-destructive/10 p-4">
                <Lock className="w-12 h-12 text-destructive" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{t('schedule.accessDenied', 'Access Denied')}</h2>
                <p className="text-muted-foreground max-w-md">
                  {t('schedule.accessDeniedMessage', "You don't have permission to view the Job Schedule. Please contact your administrator to request access.")}
                </p>
              </div>
              <Button onClick={() => setLocation("/dashboard")} data-testid="button-return-dashboard">
                {t('schedule.returnToDashboard', 'Return to Dashboard')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Time off type options with display labels and colors
  const timeOffTypes = [
    { value: "day_off", label: "Day Off", color: "hsl(210, 15%, 70%)" },
    { value: "paid_day_off", label: "Paid Day Off", color: "hsl(142, 60%, 50%)" },
    { value: "stat_holiday", label: "Stat Holiday", color: "hsl(280, 60%, 55%)" },
    { value: "sick_day", label: "Sick Day", color: "hsl(25, 85%, 55%)" },
    { value: "sick_paid_day", label: "Sick Day (Paid)", color: "hsl(25, 85%, 45%)" },
    { value: "vacation", label: "Vacation", color: "hsl(200, 80%, 50%)" },
    { value: "unpaid_leave", label: "Unpaid Leave", color: "hsl(0, 60%, 55%)" },
  ];

  // Create time off mutation
  const createTimeOffMutation = useMutation({
    mutationFn: async (data: { employeeId: string; date: string; timeOffType: string; notes?: string }) => {
      const response = await apiRequest("POST", "/api/employee-time-off", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employee-time-off"] });
    },
  });

  // Delete time off mutation
  const deleteTimeOffMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/employee-time-off/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employee-time-off"] });
      toast({
        title: t('schedule.timeOffRemoved', 'Time Off Removed'),
        description: t('schedule.timeOffRemovedDesc', 'Time off entry has been removed.'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('schedule.timeOffRemoveFailed', 'Failed to remove time off.'),
        variant: "destructive",
      });
    },
  });

  const resetTimeOffForm = () => {
    setSelectedEmployeeForTimeOff("");
    setSelectedTimeOffStartDate("");
    setSelectedTimeOffEndDate("");
    setSelectedTimeOffType("day_off");
    setTimeOffNotes("");
  };

  const handleCreateTimeOff = async () => {
    if (!selectedEmployeeForTimeOff || !selectedTimeOffStartDate || !selectedTimeOffType) {
      toast({
        title: t('schedule.missingInfo', 'Missing Information'),
        description: t('schedule.selectTimeOffFields', 'Please select an employee, start date, and time off type.'),
        variant: "destructive",
      });
      return;
    }
    
    const startDate = new Date(selectedTimeOffStartDate);
    const endDate = selectedTimeOffEndDate ? new Date(selectedTimeOffEndDate) : startDate;
    
    if (endDate < startDate) {
      toast({
        title: t('schedule.invalidDateRange', 'Invalid Date Range'),
        description: t('schedule.endBeforeStart', 'End date cannot be before start date.'),
        variant: "destructive",
      });
      return;
    }
    
    const dates: string[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    try {
      for (const date of dates) {
        await createTimeOffMutation.mutateAsync({
          employeeId: selectedEmployeeForTimeOff,
          date: date,
          timeOffType: selectedTimeOffType,
          notes: timeOffNotes || undefined,
        });
      }
      setTimeOffDialogOpen(false);
      resetTimeOffForm();
      toast({
        title: t('schedule.timeOffScheduled', 'Time Off Scheduled'),
        description: t('schedule.timeOffScheduledDesc', 'Time off has been scheduled for {{count}} day(s).', { count: dates.length }),
      });
    } catch (error: any) {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('schedule.timeOffScheduleFailed', 'Failed to schedule some time off entries.'),
        variant: "destructive",
      });
    }
  };

  // Get time off for a specific employee on a specific date
  const getTimeOffForDay = (employeeId: string, date: Date): EmployeeTimeOff | null => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return timeOffEntries.find(entry => 
      entry.employeeId === employeeId && entry.date === dateStr
    ) || null;
  };

  // Get color for time off type
  const getTimeOffColor = (type: string): string => {
    return timeOffTypes.find(t => t.value === type)?.color || "hsl(210, 15%, 70%)";
  };

  // Get label for time off type
  const getTimeOffLabel = (type: string): string => {
    return timeOffTypes.find(t => t.value === type)?.label || type.replace(/_/g, ' ');
  };

  // Transform jobs into employee timeline events for Employee Schedule view
  const employeeTimelineEvents: EventInput[] = jobs.flatMap((job) => {
    if (!job.employeeAssignments || job.employeeAssignments.length === 0) {
      return [];
    }

    return job.employeeAssignments.map((assignment: any) => {
      const startDate = assignment.startDate || job.startDate;
      const endDate = assignment.endDate || job.endDate;
      
      return {
        id: `${job.id}-${assignment.employee.id}`,
        resourceId: assignment.employee.id,
        title: job.project?.buildingName || job.title,
        start: startDate,
        end: endDate,
        backgroundColor: job.color || defaultJobColor,
        borderColor: job.color || defaultJobColor,
        extendedProps: {
          job,
          employee: assignment.employee,
        },
      };
    });
  });

  // Simple Employee Schedule View helpers - supports day, week, month
  const getViewDates = useMemo(() => {
    const today = new Date();
    const days: Date[] = [];
    
    if (timelineViewMode === 'day') {
      // Single day view
      const targetDay = new Date(today);
      targetDay.setDate(today.getDate() + weekOffset);
      days.push(targetDay);
    } else if (timelineViewMode === 'week') {
      // Week view (7 days)
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek + (weekOffset * 7));
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        days.push(day);
      }
    } else {
      // Month view
      const targetMonth = new Date(today.getFullYear(), today.getMonth() + weekOffset, 1);
      const daysInMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
      for (let i = 0; i < daysInMonth; i++) {
        const day = new Date(targetMonth);
        day.setDate(i + 1);
        days.push(day);
      }
    }
    return days;
  }, [weekOffset, timelineViewMode]);
  
  // Legacy alias for compatibility
  const getWeekDates = getViewDates;

  const formatViewRange = useMemo(() => {
    if (timelineViewMode === 'day') {
      const day = getViewDates[0];
      return day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    } else if (timelineViewMode === 'week') {
      const start = getViewDates[0];
      const end = getViewDates[getViewDates.length - 1];
      const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
      const year = end.getFullYear();
      
      if (startMonth === endMonth) {
        return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${year}`;
      }
      return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`;
    } else {
      // Month view
      const day = getViewDates[0];
      return day.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  }, [getViewDates, timelineViewMode]);
  
  // Legacy alias for compatibility
  const formatWeekRange = formatViewRange;

  // Get employee assignments for a specific day (using local date to avoid timezone issues)
  const getEmployeeJobsForDay = (employeeId: string, date: Date) => {
    // Format date as YYYY-MM-DD in local timezone to avoid UTC conversion issues
    const dateStr = toLocalDateString(date);
    
    return jobs.filter(job => {
      // Check if employee is assigned to this job
      const isAssigned = job.employeeAssignments?.some((assignment: any) => {
        if (assignment.employee.id !== employeeId) return false;
        
        // Check if the date falls within the assignment's date range
        // Normalize both assignment dates to date-only format to ensure correct comparison
        const assignStart = String(assignment.startDate || job.startDate).split('T')[0];
        const assignEnd = String(assignment.endDate || job.endDate).split('T')[0];
        
        return dateStr >= assignStart && dateStr <= assignEnd;
      });
      
      return isAssigned;
    });
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Transform jobs into FullCalendar events
  // Create separate event blocks for each day in multi-day jobs
  // Uses timezone-safe date utilities to prevent date shifting
  const events: EventInput[] = jobs.flatMap((job) => {
    const color = job.color || defaultJobColor;
    // Use project dates if job is linked to a project, otherwise use job dates
    const rawStartDate = job.project?.startDate || job.startDate;
    const rawEndDate = job.project?.endDate || job.endDate;
    
    // Extract date-only strings in local timezone
    const startDateStr = String(rawStartDate).split('T')[0];
    const endDateStr = String(rawEndDate).split('T')[0];
    
    // If same day, return single event
    if (startDateStr === endDateStr) {
      // For single-day jobs, filter employees by their assignment date range
      const employeesForThisDay = job.employeeAssignments?.filter((assignment: any) => {
        if (!assignment.startDate && !assignment.endDate) return true;
        const empStart = String(assignment.startDate || startDateStr).split('T')[0];
        const empEnd = String(assignment.endDate || endDateStr).split('T')[0];
        return startDateStr >= empStart && startDateStr <= empEnd;
      }) || [];
      
      let displayTitle = job.project?.buildingName || job.title;
      if (employeesForThisDay.length > 0) {
        const employeeNames = employeesForThisDay.map((a: any) => `${a.employee.name} (${a.employee.role?.replace(/_/g, ' ') || 'Staff'})`).join(", ");
        displayTitle = `${job.project?.buildingName || job.title}\n${employeeNames}`;
      }
      
      return [{
        id: job.id,
        title: displayTitle,
        start: startDateStr,
        end: nextDateOnly(startDateStr),
        allDay: true,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          job,
          employeesForThisDay,
        },
      }];
    }
    
    // Multi-day: create separate all-day events for each day
    const dayEvents = [];
    let currentDateStr = startDateStr;
    
    while (currentDateStr <= endDateStr) {
      // Filter employees by their assignment date range for THIS specific day
      const employeesForThisDay = job.employeeAssignments?.filter((assignment: any) => {
        if (!assignment.startDate && !assignment.endDate) return true;
        const empStart = String(assignment.startDate || currentDateStr).split('T')[0];
        const empEnd = String(assignment.endDate || currentDateStr).split('T')[0];
        return currentDateStr >= empStart && currentDateStr <= empEnd;
      }) || [];
      
      let displayTitle = job.project?.buildingName || job.title;
      if (employeesForThisDay.length > 0) {
        const employeeNames = employeesForThisDay.map((a: any) => `${a.employee.name} (${a.employee.role?.replace(/_/g, ' ') || 'Staff'})`).join(", ");
        displayTitle = `${job.project?.buildingName || job.title}\n${employeeNames}`;
      }
      
      dayEvents.push({
        id: `${job.id}-${currentDateStr}`,
        title: displayTitle,
        start: currentDateStr,
        end: nextDateOnly(currentDateStr),
        allDay: true,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          job,
          employeesForThisDay,
        },
      });
      currentDateStr = addDaysToDateString(currentDateStr, 1);
    }
    
    return dayEvents;
  });

  // Add time-off events to the calendar
  // Use date-only strings (YYYY-MM-DD) to avoid timezone shifting
  const timeOffEvents: EventInput[] = timeOffEntries.map((entry) => {
    const employee = employees.find(e => e.id === entry.employeeId);
    const employeeName = employee?.name || 'Employee';
    const timeOffLabel = getTimeOffLabel(entry.timeOffType);
    const timeOffColor = getTimeOffColor(entry.timeOffType);
    
    // Use the raw date string from database (YYYY-MM-DD format)
    // FullCalendar treats date-only strings as local dates, avoiding UTC conversion
    const startDate = String(entry.date).split('T')[0]; // Ensure YYYY-MM-DD format
    const endDate = nextDateOnly(startDate); // Exclusive end date for allDay events
    
    return {
      id: `timeoff-${entry.id}`,
      title: `${timeOffLabel}\n${employeeName}`,
      start: startDate,
      end: endDate,
      allDay: true,
      backgroundColor: timeOffColor,
      borderColor: timeOffColor,
      extendedProps: {
        isTimeOff: true,
        timeOffEntry: entry,
        employeeName,
        timeOffLabel,
      },
    };
  });

  // Combine job events and time-off events
  const allCalendarEvents = [...events, ...timeOffEvents];

  // Handle date selection for creating new job
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDates({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setCreateDialogOpen(true);
    selectInfo.view.calendar.unselect();
  };

  // Handle event click for viewing details or quick assignment
  const handleEventClick = (clickInfo: EventClickArg) => {
    // Handle time-off events - confirm deletion
    if (clickInfo.event.extendedProps.isTimeOff) {
      const { timeOffEntry, employeeName, timeOffLabel } = clickInfo.event.extendedProps;
      if (window.confirm(`Remove ${timeOffLabel} for ${employeeName}?`)) {
        deleteTimeOffMutation.mutate(timeOffEntry.id);
      }
      return;
    }

    const job = clickInfo.event.extendedProps.job as ScheduledJobWithAssignments;
    
    // If dragging an employee, assign/unassign them
    if (activeEmployeeId) {
      const currentAssignments = job.assignedEmployees?.map(e => e.id) || [];
      const isAssigned = currentAssignments.includes(activeEmployeeId);
      
      let newAssignments: string[];
      if (isAssigned) {
        newAssignments = currentAssignments.filter(id => id !== activeEmployeeId);
      } else {
        newAssignments = [...currentAssignments, activeEmployeeId];
      }
      
      quickAssignMutation.mutate({ jobId: job.id, employeeIds: newAssignments });
      setActiveEmployeeId(null);
      setDropTargetJobId(null);
      return;
    }
    
    // Otherwise, show job details
    setSelectedJob(job);
    setDetailDialogOpen(true);
  };

  // Shared mutation for assigning employee with date range
  const assignEmployeeMutation = useMutation({
    mutationFn: async ({ jobId, employeeId, startDate, endDate, forceAssignment }: { 
      jobId: string; 
      employeeId: string; 
      startDate?: string; 
      endDate?: string;
      forceAssignment?: boolean;
    }) => {
      return await apiRequest("POST", `/api/schedule/${jobId}/assign-employee`, { 
        employeeId, 
        startDate, 
        endDate,
        forceAssignment
      });
    },
    onMutate: async (variables) => {
      // Store the variables so we can access them in onError
      return { 
        jobId: variables.jobId, 
        employeeId: variables.employeeId,
        startDate: variables.startDate,
        endDate: variables.endDate
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: t('schedule.employeeAssigned', 'Employee assigned'),
        description: t('schedule.employeeAssignedDesc', 'Team member has been assigned with specified dates'),
      });
      setAssignmentDialogOpen(false);
      setSelectedEmployeeForAssignment(null);
      setJobForAssignment(null);
      setAssignmentDates({ startDate: "", endDate: "" });
      setConflictDialogOpen(false);
      setConflictInfo({ conflicts: [], pendingAssignment: null, assignmentType: 'batch' });
    },
    onError: (error: any, _variables, context) => {
      // Check if this is a conflict error (409)
      const errorMessage = error?.message || '';
      if (errorMessage.startsWith('409:')) {
        try {
          const jsonStr = errorMessage.substring(4).trim();
          const errorData = JSON.parse(jsonStr);
          if (errorData?.conflicts && errorData.conflicts.length > 0) {
            setConflictInfo({
              conflicts: errorData.conflicts,
              pendingAssignment: { 
                jobId: context?.jobId || '', 
                employeeId: context?.employeeId,
                startDate: context?.startDate,
                endDate: context?.endDate
              },
              assignmentType: 'single'
            });
            setConflictDialogOpen(true);
            return;
          }
        } catch (e) {
          // Fall through to default error handling
        }
      }
      toast({
        title: t('common.error', 'Error'),
        description: t('schedule.assignFailed', 'Failed to assign employee'),
        variant: "destructive",
      });
    },
  });

  // Mutation to assign/unassign employees via drag and drop (uses /api/schedule/:id/assign for conflict detection)
  const quickAssignMutation = useMutation({
    mutationFn: async ({ jobId, employeeIds, forceAssignment }: { jobId: string; employeeIds: string[]; forceAssignment?: boolean }) => {
      await apiRequest("POST", `/api/schedule/${jobId}/assign`, { employeeIds, forceAssignment });
    },
    onMutate: async (variables) => {
      // Store the variables so we can access them in onError
      return { jobId: variables.jobId, employeeIds: variables.employeeIds };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: t('schedule.assignmentCreated', 'Assignment updated'),
        description: t('schedule.assignmentCreated', 'Employee assignment has been updated'),
      });
      setConflictDialogOpen(false);
      setConflictInfo({ conflicts: [], pendingAssignment: null, assignmentType: 'batch' });
    },
    onError: (error: any, _variables, context) => {
      // Check if this is a conflict error (409)
      const errorMessage = error?.message || '';
      if (errorMessage.startsWith('409:')) {
        try {
          const jsonStr = errorMessage.substring(4).trim();
          const errorData = JSON.parse(jsonStr);
          if (errorData?.conflicts && errorData.conflicts.length > 0) {
            // Use context to get the original variables
            const pendingJobId = context?.jobId || '';
            const pendingEmployeeIds = context?.employeeIds || [];
            setConflictInfo({
              conflicts: errorData.conflicts,
              pendingAssignment: { jobId: pendingJobId, employeeIds: pendingEmployeeIds },
              assignmentType: 'batch'
            });
            setConflictDialogOpen(true);
            return;
          }
        } catch (e) {
          // Fall through to default error handling
        }
      }
      toast({
        title: t('schedule.error', 'Error'),
        description: t('schedule.error', 'Failed to update assignment'),
        variant: "destructive",
      });
    },
  });
  
  // Handler for proceeding with force assignment after conflict warning
  const handleForceAssignment = () => {
    if (!conflictInfo.pendingAssignment) return;
    
    if (conflictInfo.assignmentType === 'batch' && conflictInfo.pendingAssignment.employeeIds) {
      quickAssignMutation.mutate({
        jobId: conflictInfo.pendingAssignment.jobId,
        employeeIds: conflictInfo.pendingAssignment.employeeIds,
        forceAssignment: true
      });
    } else if (conflictInfo.assignmentType === 'single' && conflictInfo.pendingAssignment.employeeId) {
      assignEmployeeMutation.mutate({
        jobId: conflictInfo.pendingAssignment.jobId,
        employeeId: conflictInfo.pendingAssignment.employeeId,
        startDate: conflictInfo.pendingAssignment.startDate,
        endDate: conflictInfo.pendingAssignment.endDate,
        forceAssignment: true
      });
    }
  };

  // Handle event drag/drop to reschedule jobs
  const handleEventDrop = (dropInfo: any) => {
    const job = dropInfo.event.extendedProps.job as ScheduledJobWithAssignments;
    const daysDelta = dropInfo.delta.days;
    
    // Get date-only strings and add the delta using timezone-safe utilities
    const oldStartStr = String(job.startDate).split('T')[0];
    const oldEndStr = String(job.endDate).split('T')[0];
    
    const newStartStr = addDaysToDateString(oldStartStr, daysDelta);
    const newEndStr = addDaysToDateString(oldEndStr, daysDelta);
    
    // Update the job with new dates
    updateJobDatesMutation.mutate({
      jobId: job.id,
      startDate: newStartStr,
      endDate: newEndStr,
    });
  };

  // Mutation to update job dates
  const updateJobDatesMutation = useMutation({
    mutationFn: async ({ jobId, startDate, endDate }: { jobId: string; startDate: string; endDate: string }) => {
      await apiRequest("PUT", `/api/schedule/${jobId}`, { startDate, endDate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: t('schedule.jobUpdated', 'Job rescheduled'),
        description: t('schedule.jobUpdated', 'All days of the job have been moved'),
      });
    },
    onError: () => {
      toast({
        title: t('schedule.error', 'Error'),
        description: t('schedule.error', 'Failed to reschedule job'),
        variant: "destructive",
      });
    },
  });

  // Mutation to unassign employee from all jobs
  const unassignFromAllJobsMutation = useMutation({
    mutationFn: async ({ employeeId }: { employeeId: string }) => {
      // Find all jobs this employee is assigned to
      const assignedJobs = jobs.filter(job => 
        job.assignedEmployees?.some(e => e.id === employeeId)
      );
      
      // Remove employee from each job
      await Promise.all(
        assignedJobs.map(job => {
          const newAssignments = job.assignedEmployees
            ?.filter(e => e.id !== employeeId)
            .map(e => e.id) || [];
          return apiRequest("PUT", `/api/schedule/${job.id}`, { employeeIds: newAssignments });
        })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: t('schedule.assignmentRemoved', 'Employee unassigned'),
        description: t('schedule.assignmentRemoved', 'Removed from all scheduled jobs'),
      });
    },
    onError: () => {
      toast({
        title: t('schedule.error', 'Error'),
        description: t('schedule.error', 'Failed to unassign employee'),
        variant: "destructive",
      });
    },
  });

  const [dropTargetJobId, setDropTargetJobId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  // Track mouse position during drag to determine which job we're over
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (activeEmployeeId) {
        setDragPosition({ x: e.clientX, y: e.clientY });
        
        // Find which calendar event element we're hovering over
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const eventElement = elements.find(el => el.hasAttribute && el.hasAttribute('data-job-id'));
        
        if (eventElement) {
          const jobId = eventElement.getAttribute('data-job-id');
          setDropTargetJobId(jobId);
        } else {
          setDropTargetJobId(null);
        }
      }
    };

    if (activeEmployeeId) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [activeEmployeeId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!active.id) {
      setActiveEmployeeId(null);
      setDropTargetJobId(null);
      setDragPosition(null);
      return;
    }

    const employeeId = active.id as string;

    // Check if dropped on "Available" zone - unassign from all jobs
    if (over?.id === 'available-zone') {
      unassignFromAllJobsMutation.mutate({ employeeId });
      setActiveEmployeeId(null);
      setDropTargetJobId(null);
      setDragPosition(null);
      return;
    }

    // Otherwise, check if dropped on a job
    if (!dropTargetJobId) {
      setActiveEmployeeId(null);
      setDropTargetJobId(null);
      setDragPosition(null);
      return;
    }

    const jobId = dropTargetJobId;

    // Find the job
    const job = jobs.find(j => j.id === jobId);
    if (!job) {
      setActiveEmployeeId(null);
      setDropTargetJobId(null);
      setDragPosition(null);
      return;
    }

    // Find the employee
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) {
      setActiveEmployeeId(null);
      setDropTargetJobId(null);
      setDragPosition(null);
      return;
    }

    // Check if employee is already assigned
    const currentAssignments = job.assignedEmployees?.map(e => e.id) || [];
    const isAssigned = currentAssignments.includes(employeeId);

    if (isAssigned) {
      // If already assigned, unassign directly
      const newAssignments = currentAssignments.filter(id => id !== employeeId);
      quickAssignMutation.mutate({ jobId, employeeIds: newAssignments });
      setActiveEmployeeId(null);
      setDropTargetJobId(null);
      setDragPosition(null);
    } else {
      // If not assigned, open date picker dialog
      setJobForAssignment(job);
      setSelectedEmployeeForAssignment(employee);
      
      // Initialize dates with job's full range (use timezone-safe extraction)
      const jobStartDate = String(job.startDate).split('T')[0];
      const jobEndDate = String(job.endDate).split('T')[0];
      setAssignmentDates({ startDate: jobStartDate, endDate: jobEndDate });
      
      // Open the assignment dialog
      setAssignmentDialogOpen(true);
      
      // Clear drag state
      setActiveEmployeeId(null);
      setDropTargetJobId(null);
      setDragPosition(null);
    }
  };

  // Get assigned employee IDs from jobs
  const assignedEmployeeIds = new Set(
    jobs.flatMap(job => job.assignedEmployees?.map(e => e.id) || [])
  );

  const assignedEmployees = employees.filter(e => assignedEmployeeIds.has(e.id));
  const availableEmployees = employees.filter(e => !assignedEmployeeIds.has(e.id));

  const activeEmployee = employees.find(e => e.id === activeEmployeeId);

  // Handle escape key to cancel assignment
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeEmployeeId) {
        setActiveEmployeeId(null);
        setDropTargetJobId(null);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeEmployeeId]);

  // If user only has "view own schedule" permission, show simplified My Schedule view
  if (hasOwnScheduleOnly && currentUser) {
    // Get jobs where this user is assigned
    const myAssignments = jobs.filter(job => 
      job.assignedEmployees?.some(e => e.id === currentUser.id)
    );

    // Transform into timeline events for this employee only
    const myEvents: EventInput[] = myAssignments.flatMap(job => {
      const assignment = job.employeeAssignments?.find(a => a.employee?.id === currentUser.id);
      if (assignment && assignment.startDate && assignment.endDate) {
        // Use assignment-specific dates
        const startStr = toLocalDateString(assignment.startDate);
        const endStr = toLocalDateString(assignment.endDate);
        return [{
          id: `${job.id}-${currentUser.id}`,
          title: job.project?.buildingName || job.title,
          start: startStr,
          end: nextDateOnly(endStr),
          backgroundColor: job.color || defaultJobColor,
          borderColor: job.color || defaultJobColor,
          extendedProps: {
            jobId: job.id,
            projectId: job.projectId,
            notes: job.notes,
            projectName: job.project?.buildingName,
            address: job.project?.buildingAddress,
          }
        }];
      }
      // Fallback to job dates
      return [{
        id: job.id,
        title: job.project?.buildingName || job.title,
        start: job.startDate,
        end: nextDateOnly(job.endDate),
        backgroundColor: job.color || defaultJobColor,
        borderColor: job.color || defaultJobColor,
        extendedProps: {
          jobId: job.id,
          projectId: job.projectId,
          notes: job.notes,
          projectName: job.project?.buildingName,
          address: job.project?.buildingAddress,
        }
      }];
    }) as EventInput[];

    return (
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">{t('schedule.mySchedule', 'My Schedule')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('schedule.myScheduleSubtitle', 'View your upcoming job assignments')}
            </p>
          </div>
        </div>

        {/* My Schedule Calendar */}
        <Card>
          <CardContent className="p-4">
            {myAssignments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">{t('schedule.noUpcomingShifts', 'No upcoming shifts')}</p>
                <p className="text-sm">{t('schedule.noUpcomingShiftsDesc', 'You have not been assigned to any upcoming jobs.')}</p>
              </div>
            ) : (
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, resourceTimelinePlugin]}
                initialView="dayGridMonth"
                locale={calendarLocale}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek'
                }}
                events={myEvents}
                height="auto"
                editable={false}
                selectable={false}
                eventClick={(info) => {
                  const jobId = info.event.extendedProps.jobId;
                  const job = jobs.find(j => j.id === jobId);
                  if (job) {
                    setSelectedJob(job);
                    setDetailDialogOpen(true);
                  }
                }}
                eventContent={(eventInfo) => {
                  return (
                    <div className="p-1 text-sm overflow-hidden">
                      <div className="font-medium truncate">{eventInfo.event.title}</div>
                      {eventInfo.event.extendedProps.address && (
                        <div className="text-sm opacity-80 truncate">{eventInfo.event.extendedProps.address}</div>
                      )}
                    </div>
                  );
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Upcoming Shifts List */}
        {myAssignments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {t('schedule.upcomingShifts', 'Upcoming Shifts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myAssignments.map(job => {
                  const assignment = job.employeeAssignments?.find(a => a.employee?.id === currentUser.id);
                  const startDate = assignment?.startDate ? toLocalDateString(assignment.startDate) : job.startDate;
                  const endDate = assignment?.endDate ? toLocalDateString(assignment.endDate) : job.endDate;
                  return (
                    <div 
                      key={job.id}
                      className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30"
                      data-testid={`my-shift-${job.id}`}
                    >
                      <div 
                        className="w-3 h-12 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: job.color || defaultJobColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{job.project?.buildingName || job.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{job.project?.buildingAddress}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{formatLocalDate(startDate)}</span>
                          <span>-</span>
                          <span>{formatLocalDate(endDate)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Detail Dialog - Read Only */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedJob?.project?.buildingName || selectedJob?.title}</DialogTitle>
              <DialogDescription>
                {selectedJob?.project?.buildingAddress}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">{t('schedule.dates', 'Dates')}</Label>
                <p className="font-medium">
                  {selectedJob && formatLocalDate(selectedJob.startDate)} - {selectedJob && formatLocalDate(selectedJob.endDate)}
                </p>
              </div>
              {selectedJob?.notes && (
                <div>
                  <Label className="text-muted-foreground">{t('schedule.notes', 'Notes')}</Label>
                  <p className="text-sm">{selectedJob.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <DndContext 
      onDragEnd={handleDragEnd} 
      onDragStart={(event) => setActiveEmployeeId(event.active.id as string)}
    >
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{t('schedule.title', 'Schedule')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('schedule.subtitle', "Manage your team's job assignments and schedule")}
          </p>
        </div>
      </div>

      {/* Employee Availability - Collapsible on mobile */}
      <Collapsible open={availabilityOpen} onOpenChange={setAvailabilityOpen} className="md:hidden">
        <Card className="border-2 border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg backdrop-blur-sm">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-2 pt-2 cursor-pointer">
              <CardTitle className="text-sm font-bold flex items-center justify-between text-primary">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {t('schedule.employeeAvailability', 'EMPLOYEE AVAILABILITY')}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {assignedEmployees.length} / {employees.length}
                  </Badge>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${availabilityOpen ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-2">
              <div className="grid gap-2">
                {/* Assigned Employees */}
                <div className="bg-card rounded p-1.5 border-l-4 border-l-green-600 shadow-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <UserCheck className="w-3.5 h-3.5 text-green-600" />
                    <h3 className="font-bold text-xs text-green-700">{t('schedule.assigned', 'Assigned')} ({assignedEmployees.length})</h3>
                  </div>
                  {assignedEmployees.length === 0 ? (
                    <p className="text-xs text-muted-foreground">{t('schedule.noAssignments', 'No employees assigned')}</p>
                  ) : (
                    <div className="space-y-0.5 max-h-24 overflow-y-auto pr-1">
                      {assignedEmployees.map(employee => {
                        const employeeJobs = jobs.filter(job => 
                          job.assignedEmployees?.some(e => e.id === employee.id)
                        );
                        const isActive = activeEmployeeId === employee.id;
                        return (
                          <DraggableEmployeeCard
                            key={employee.id}
                            employee={employee}
                            isActive={isActive}
                            onClick={() => setActiveEmployeeId(isActive ? null : employee.id)}
                          >
                            <div className="flex flex-wrap gap-0.5 mt-0.5">
                              {employeeJobs.map(job => (
                                <Badge 
                                  key={job.id} 
                                  variant="default" 
                                  className="text-[9px] h-4 px-1.5 py-0 bg-green-600 hover:bg-red-600 cursor-pointer transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const currentAssignments = job.assignedEmployees?.map(e => e.id) || [];
                                    const newAssignments = currentAssignments.filter(id => id !== employee.id);
                                    quickAssignMutation.mutate({ jobId: job.id, employeeIds: newAssignments });
                                  }}
                                  title="Click to remove from this job"
                                >
                                  {job.project?.buildingName || job.title} ✕
                                </Badge>
                              ))}
                            </div>
                          </DraggableEmployeeCard>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Available Employees */}
                <DroppableAvailableZone isDragging={activeEmployeeId !== null}>
                  <div className="bg-card rounded p-1.5 border-l-4 border-l-primary shadow-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <UserX className="w-3.5 h-3.5 text-primary" />
                      <h3 className="font-bold text-xs text-primary">{t('schedule.available', 'Available')} ({availableEmployees.length})</h3>
                    </div>
                    {availableEmployees.length === 0 ? (
                      <p className="text-xs text-muted-foreground">{t('schedule.allAssigned', 'All employees assigned')}</p>
                    ) : (
                      <div className="space-y-0.5 max-h-24 overflow-y-auto pr-1">
                        {availableEmployees.map(employee => {
                          const isActive = activeEmployeeId === employee.id;
                          return (
                            <DraggableEmployeeCard
                              key={employee.id}
                              employee={employee}
                              isActive={isActive}
                              onClick={() => setActiveEmployeeId(isActive ? null : employee.id)}
                              type="available"
                            >
                              <Badge variant="default" className="mt-0.5 text-[9px] h-4 px-1.5 py-0 bg-primary hover:bg-primary/90">
                                Ready
                              </Badge>
                            </DraggableEmployeeCard>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </DroppableAvailableZone>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      {/* Desktop version - always visible */}
      <Card className="hidden md:block sticky top-0 z-10 border-2 border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-1 pt-2">
          <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-primary">
            <Users className="w-4 h-4" />
            {t('schedule.employeeAvailability', 'EMPLOYEE AVAILABILITY')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-2">
          <div className="grid md:grid-cols-2 gap-2">
            {/* Assigned Employees */}
            <div className="bg-card rounded p-1.5 border-l-4 border-l-green-600 shadow-sm">
              <div className="flex items-center gap-1 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-green-600" />
                <h3 className="font-bold text-xs text-green-700">{t('schedule.assigned', 'Assigned')} ({assignedEmployees.length})</h3>
              </div>
              {assignedEmployees.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t('schedule.noAssignments', 'No employees assigned')}</p>
              ) : (
                <div className="space-y-0.5 max-h-24 overflow-y-auto pr-1">
                  {assignedEmployees.map(employee => {
                    const employeeJobs = jobs.filter(job => 
                      job.assignedEmployees?.some(e => e.id === employee.id)
                    );
                    const isActive = activeEmployeeId === employee.id;
                    return (
                      <DraggableEmployeeCard
                        key={employee.id}
                        employee={employee}
                        isActive={isActive}
                        onClick={() => setActiveEmployeeId(isActive ? null : employee.id)}
                      >
                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                          {employeeJobs.map(job => (
                            <Badge 
                              key={job.id} 
                              variant="default" 
                              className="text-[9px] h-4 px-1.5 py-0 bg-green-600 hover:bg-red-600 cursor-pointer transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentAssignments = job.assignedEmployees?.map(e => e.id) || [];
                                const newAssignments = currentAssignments.filter(id => id !== employee.id);
                                quickAssignMutation.mutate({ jobId: job.id, employeeIds: newAssignments });
                              }}
                              title="Click to remove from this job"
                            >
                              {job.project?.buildingName || job.title} ✕
                            </Badge>
                          ))}
                        </div>
                      </DraggableEmployeeCard>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Available Employees */}
            <DroppableAvailableZone isDragging={activeEmployeeId !== null}>
              <div className="bg-card rounded p-1.5 border-l-4 border-l-primary shadow-sm">
                <div className="flex items-center gap-1 mb-1">
                  <UserX className="w-3.5 h-3.5 text-primary" />
                  <h3 className="font-bold text-xs text-primary">{t('schedule.available', 'Available')} ({availableEmployees.length})</h3>
                </div>
                {availableEmployees.length === 0 ? (
                  <p className="text-xs text-muted-foreground">{t('schedule.allAssigned', 'All employees assigned')}</p>
                ) : (
                  <div className="space-y-0.5 max-h-24 overflow-y-auto pr-1">
                    {availableEmployees.map(employee => {
                      const isActive = activeEmployeeId === employee.id;
                      return (
                        <DraggableEmployeeCard
                          key={employee.id}
                          employee={employee}
                          isActive={isActive}
                          onClick={() => setActiveEmployeeId(isActive ? null : employee.id)}
                          type="available"
                        >
                          <Badge variant="default" className="mt-0.5 text-[9px] h-4 px-1.5 py-0 bg-primary hover:bg-primary/90">
                            {t('schedule.available', 'Ready')}
                          </Badge>
                        </DraggableEmployeeCard>
                      );
                    })}
                  </div>
                )}
              </div>
            </DroppableAvailableZone>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Tabs */}
      <Tabs defaultValue="job-schedule" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-2 h-14 p-1.5 bg-card border-2 border-border shadow-md">
          <TabsTrigger 
            value="job-schedule" 
            data-testid="tab-job-schedule"
            className="text-base font-bold bg-background border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-lg transition-all"
          >
            {t('schedule.calendar', 'Job Schedule')}
          </TabsTrigger>
          <TabsTrigger 
            value="employee-schedule" 
            data-testid="tab-employee-schedule"
            className="text-base font-bold bg-background border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-lg transition-all"
          >
            {t('schedule.timeline', 'Employee Schedule')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="job-schedule" className="mt-4">
          <div className="bg-card rounded-lg shadow-premium p-6">
            {activeEmployeeId && (
              <div className="mb-4 p-3 bg-primary/10 border-2 border-primary rounded-lg">
                <p className="text-sm font-semibold text-primary">
                  {t('schedule.assignEmployee', 'Assigning')}: {activeEmployee?.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('schedule.dragToAssign', 'Click on any job to assign this employee. Green = assign, Red = remove. Press Escape to cancel.')}
                </p>
              </div>
            )}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-muted-foreground">{t('schedule.loading', 'Loading calendar...')}</div>
          </div>
        ) : (
          <div className="schedule-calendar-wrapper">
            <style>{`
              .schedule-calendar-wrapper .fc {
                --fc-border-color: hsl(var(--border));
                --fc-button-bg-color: hsl(var(--primary));
                --fc-button-border-color: hsl(var(--primary));
                --fc-button-hover-bg-color: hsl(var(--primary) / 0.9);
                --fc-button-active-bg-color: hsl(var(--primary) / 0.8);
                --fc-today-bg-color: hsl(var(--primary) / 0.05);
              }
              
              .schedule-calendar-wrapper .fc-theme-standard td,
              .schedule-calendar-wrapper .fc-theme-standard th {
                border-color: hsl(var(--border) / 0.3);
              }
              
              .schedule-calendar-wrapper .fc-col-header-cell {
                background: hsl(var(--muted));
                font-weight: 600;
                padding: 12px 8px;
                text-transform: uppercase;
                font-size: 0.875rem;
                letter-spacing: 0.05em;
              }
              
              .schedule-calendar-wrapper .fc-timegrid-slot {
                height: 3em;
              }
              
              .schedule-calendar-wrapper .fc-event {
                border-radius: 6px;
                border: none;
                padding: 4px 8px;
                font-size: 0.875rem;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              
              .schedule-calendar-wrapper .fc-event-title {
                font-weight: 500;
              }
              
              .schedule-calendar-wrapper .fc-toolbar-title {
                font-size: 1.5rem;
                font-weight: 700;
              }
              
              .schedule-calendar-wrapper .fc-button {
                border-radius: 6px;
                text-transform: capitalize;
                font-weight: 500;
                padding: 0.5rem 1rem;
              }
              
              .schedule-calendar-wrapper .fc-daygrid-day-number {
                padding: 8px;
                font-size: 0.875rem;
              }
            `}</style>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={calendarLocale}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridDay,dayGridWeek,dayGridMonth",
              }}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={3}
              weekends={true}
              events={allCalendarEvents}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventDrop={handleEventDrop}
              height="700px"
              displayEventTime={false}
              displayEventEnd={false}
              eventDisplay="block"
              data-testid="calendar"
              eventDidMount={(info) => {
                if (info.event.extendedProps.isTimeOff) {
                  info.el.setAttribute('data-timeoff-id', info.event.id);
                } else {
                  const job = info.event.extendedProps.job as ScheduledJobWithAssignments;
                  info.el.setAttribute('data-job-id', job.id);
                }
              }}
              eventContent={(eventInfo) => {
                // Handle time-off events separately
                if (eventInfo.event.extendedProps.isTimeOff) {
                  const { employeeName, timeOffLabel, timeOffEntry } = eventInfo.event.extendedProps;
                  return (
                    <div 
                      className="fc-event-main-frame" 
                      style={{ 
                        padding: '4px 8px', 
                        overflow: 'hidden',
                        cursor: 'pointer',
                        color: 'white',
                      }}
                    >
                      <div className="fc-event-title-container">
                        <div className="fc-event-title" style={{ fontWeight: 700, fontSize: '0.875rem', color: 'white' }}>
                          {timeOffLabel}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.95)', marginTop: '2px', fontWeight: 600 }}>
                          {employeeName}
                        </div>
                        {timeOffEntry.notes && (
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', marginTop: '2px', fontStyle: 'italic' }}>
                            {timeOffEntry.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                const job = eventInfo.event.extendedProps.job as ScheduledJobWithAssignments;
                const employeesForThisDay = eventInfo.event.extendedProps.employeesForThisDay || [];
                const isHighlighted = activeEmployeeId !== null;
                const currentlyAssigned = job.assignedEmployees?.some(e => e.id === activeEmployeeId);
                const isDropTarget = dropTargetJobId === job.id;
                
                return (
                  <div 
                    className="fc-event-main-frame" 
                    style={{ 
                      padding: '2px 4px', 
                      overflow: 'hidden',
                      backgroundColor: isDropTarget 
                        ? (currentlyAssigned ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)')
                        : isHighlighted 
                          ? (currentlyAssigned ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)')
                          : undefined,
                      outline: isDropTarget ? '3px solid rgba(14, 165, 233, 1)' : isHighlighted ? '2px dashed rgba(14, 165, 233, 0.5)' : undefined,
                      outlineOffset: '-2px',
                      cursor: isHighlighted ? 'pointer' : 'pointer',
                    }}
                  >
                    <div className="fc-event-title-container">
                      <div className="fc-event-title" style={{ fontWeight: 600, fontSize: '0.8rem' }}>
                        {job.project?.buildingName || job.title}
                      </div>
                      {employeesForThisDay && employeesForThisDay.length > 0 && (
                        <div style={{ fontSize: '0.7rem', opacity: 1, whiteSpace: 'normal', lineHeight: 1.3, marginTop: '2px' }}>
                          {employeesForThisDay.map((assignment: any, idx: number) => (
                            <div key={idx} style={{ 
                              fontWeight: 500, 
                              backgroundColor: 'rgba(255,255,255,0.25)',
                              padding: '1px 5px',
                              borderRadius: '3px',
                              marginTop: '2px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}>
                              <UserIcon style={{ width: '11px', height: '11px', flexShrink: 0 }} />
                              <span>{assignment.employee.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {isHighlighted && (
                        <div style={{ 
                          fontSize: '0.75rem', 
                          marginTop: '3px', 
                          fontWeight: 600,
                          color: currentlyAssigned ? '#ef4444' : '#22c55e'
                        }}>
                          Click to {currentlyAssigned ? 'remove' : 'assign'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            />
          </div>
        )}
          </div>
        </TabsContent>

        <TabsContent value="employee-schedule" className="mt-4">
          <div 
            className="rounded-lg border bg-card p-4 md:p-6 relative"
          >
            {/* Timeline Navigation Header - Mobile optimized */}
            <div className="flex flex-col gap-3 mb-4 md:mb-6 relative z-10">
              {/* View mode toggle */}
              <div className="flex items-center justify-center gap-1">
                <div className="inline-flex rounded-md border bg-muted p-0.5">
                  <Button 
                    variant={timelineViewMode === 'day' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => { setTimelineViewMode('day'); setWeekOffset(0); }}
                    data-testid="button-view-day"
                    className="px-3 text-xs"
                  >
                    {t('schedule.day', 'Day')}
                  </Button>
                  <Button 
                    variant={timelineViewMode === 'week' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => { setTimelineViewMode('week'); setWeekOffset(0); }}
                    data-testid="button-view-week"
                    className="px-3 text-xs"
                  >
                    {t('schedule.week', 'Week')}
                  </Button>
                  <Button 
                    variant={timelineViewMode === 'month' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => { setTimelineViewMode('month'); setWeekOffset(0); }}
                    data-testid="button-view-month"
                    className="px-3 text-xs"
                  >
                    {t('schedule.month', 'Month')}
                  </Button>
                </div>
              </div>
              
              {/* Navigation row: prev/next and date */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setWeekOffset(prev => prev - 1)}
                    data-testid="button-prev-period"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {weekOffset !== 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setWeekOffset(0)}
                      data-testid="button-today"
                      className="px-2"
                    >
                      {t('schedule.today', 'Today')}
                    </Button>
                  )}
                </div>
                
                <h3 className="text-sm md:text-lg font-semibold text-center" data-testid="text-date-range">
                  {formatViewRange}
                </h3>
                
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setWeekOffset(prev => prev + 1)}
                    data-testid="button-next-period"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Action button (full width on mobile) */}
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setTimeOffDialogOpen(true)}
                data-testid="button-schedule-time-off"
                className="w-full md:w-auto md:absolute md:top-0 md:right-0"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t('schedule.scheduleTimeOff', 'Schedule Time Off')}
              </Button>
            </div>

            {/* Day Headers + Employee Rows - Scrollable on mobile */}
            <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 relative z-10">
              <div style={{ minWidth: timelineViewMode === 'month' ? '1200px' : timelineViewMode === 'day' ? '400px' : '700px' }}>
                {/* Day Headers */}
                <div 
                  className="gap-1 mb-2"
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: `minmax(80px, 120px) repeat(${getViewDates.length}, 1fr)` 
                  }}
                >
                  <div className="font-medium text-sm text-muted-foreground px-2 flex items-center">{t('schedule.team', 'Team')}</div>
                  {getViewDates.map((date, idx) => (
                    <div 
                      key={idx}
                      className={`text-center py-1 md:py-1.5 rounded-md ${
                        isToday(date) 
                          ? 'bg-primary text-primary-foreground font-semibold' 
                          : 'bg-muted font-medium'
                      }`}
                    >
                      <div className={`uppercase ${timelineViewMode === 'month' ? 'text-[8px]' : 'text-[10px] md:text-xs'}`}>
                        {date.toLocaleDateString(i18n.language?.startsWith('fr') ? 'fr-CA' : 'en-US', { weekday: timelineViewMode === 'month' ? 'narrow' : 'short' })}
                      </div>
                      <div className={timelineViewMode === 'month' ? 'text-xs' : 'text-sm md:text-lg'}>
                        {date.getDate()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Employee Rows */}
                <div className="space-y-1.5 md:space-y-2">
                  {employees.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>{t('schedule.noAssignments', 'No team members found')}</p>
                    </div>
                  ) : (
                    employees.map((employee) => (
                      <div 
                        key={employee.id}
                        className="gap-1 items-stretch"
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: `minmax(80px, 120px) repeat(${getViewDates.length}, 1fr)` 
                        }}
                        data-testid={`employee-row-${employee.id}`}
                      >
                        {/* Employee Name */}
                        <div className="flex items-center gap-1.5 md:gap-2 px-1.5 md:px-2 py-2 md:py-3 bg-muted/50 rounded-md">
                          <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
                            <AvatarFallback className="text-[10px] md:text-xs font-medium">
                              {employee.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">{employee.name}</div>
                            <div className="text-xs text-muted-foreground truncate hidden md:block">
                              {employee.role?.replace(/_/g, ' ')}
                            </div>
                          </div>
                        </div>
                    
                    {/* Day Cells */}
                    {getViewDates.map((date, dayIdx) => {
                      const dayJobs = getEmployeeJobsForDay(employee.id, date);
                      const hasJobs = dayJobs.length > 0;
                      const timeOff = getTimeOffForDay(employee.id, date);
                      const isMonthView = timelineViewMode === 'month';
                      
                      return (
                        <div 
                          key={dayIdx}
                          className={`rounded-md ${isMonthView ? 'min-h-[40px] p-0.5' : 'min-h-[60px] p-1'} ${
                            isToday(date) 
                              ? 'bg-primary/5 border border-primary/20' 
                              : 'bg-muted/30 border border-transparent'
                          }`}
                          data-testid={`day-cell-${employee.id}-${dayIdx}`}
                        >
                          <div className={isMonthView ? 'space-y-0.5' : 'space-y-1'}>
                            {timeOff && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div 
                                    className={`rounded font-semibold text-white cursor-pointer text-center ${isMonthView ? 'px-0.5 py-0.5 text-[8px]' : 'px-2 py-1 text-xs'}`}
                                    style={{ backgroundColor: getTimeOffColor(timeOff.timeOffType) }}
                                    onClick={() => {
                                      if (window.confirm(`Remove ${getTimeOffLabel(timeOff.timeOffType)} for ${employee.name}?`)) {
                                        deleteTimeOffMutation.mutate(timeOff.id);
                                      }
                                    }}
                                    data-testid={`time-off-${employee.id}-${dayIdx}`}
                                  >
                                    {isMonthView ? getTimeOffLabel(timeOff.timeOffType).substring(0, 3) : getTimeOffLabel(timeOff.timeOffType)}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <div className="font-semibold">{getTimeOffLabel(timeOff.timeOffType)}</div>
                                  {timeOff.notes && (
                                    <div className="text-xs text-muted-foreground">{timeOff.notes}</div>
                                  )}
                                  <div className="text-xs mt-1 text-muted-foreground">Click to remove</div>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {hasJobs && (
                              <>
                                {dayJobs.slice(0, timeOff ? 1 : (isMonthView ? 1 : 2)).map((job) => (
                                  <Tooltip key={job.id}>
                                    <TooltipTrigger asChild>
                                      <div 
                                        className={`rounded font-medium text-white truncate cursor-pointer hover-elevate ${timeOff ? 'opacity-60' : ''} ${isMonthView ? 'px-0.5 py-0.5 text-[8px]' : 'px-2 py-1.5 text-xs'}`}
                                        style={{ 
                                          backgroundColor: job.color || defaultJobColor,
                                          filter: 'saturate(0.85) brightness(1.05)'
                                        }}
                                        onClick={() => {
                                          setSelectedJob(job);
                                          setDetailDialogOpen(true);
                                        }}
                                        data-testid={`job-block-${job.id}-${dayIdx}`}
                                      >
                                        {isMonthView ? (job.project?.buildingName || job.title).substring(0, 4) : (job.project?.buildingName || job.title)}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs">
                                      <div className="font-semibold">{job.project?.buildingName || job.title}</div>
                                      {job.project?.buildingAddress && (
                                        <div className="text-xs text-muted-foreground">{job.project.buildingAddress}</div>
                                      )}
                                      <div className="text-xs mt-1">
                                        {String(job.startDate)} to {String(job.endDate)}
                                      </div>
                                      {timeOff && (
                                        <div className="text-xs mt-1 text-amber-500 font-medium">
                                          Note: Employee has time off scheduled
                                        </div>
                                      )}
                                    </TooltipContent>
                                  </Tooltip>
                                ))}
                                {dayJobs.length > (timeOff ? 1 : (isMonthView ? 1 : 2)) && (
                                  <div className={`text-muted-foreground text-center ${isMonthView ? 'text-[7px]' : 'text-xs'}`}>
                                    +{dayJobs.length - (timeOff ? 1 : (isMonthView ? 1 : 2))}
                                  </div>
                                )}
                              </>
                            )}
                            {!timeOff && !hasJobs && !isMonthView && (
                              <div className="h-full min-h-[52px] flex items-center justify-center text-muted-foreground/30">
                                <span className="text-xs">-</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              </div>
              {/* End Employee Rows */}
            </div>
            {/* End min-w wrapper */}
          </div>
          {/* End overflow-x-auto wrapper */}

            {/* Legend */}
            <div className="mt-6 pt-4 border-t relative z-10">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary"></div>
                  <span>{t('schedule.today', 'Today')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{t('schedule.jobDetails', 'Click on a job to view details')}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="font-medium text-muted-foreground">{t('schedule.onTimeOff', 'Time Off')}:</span>
                {timeOffTypes.map((type) => (
                  <div key={type.value} className="flex items-center gap-1.5">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-muted-foreground">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Time Off Dialog */}
      <Dialog open={timeOffDialogOpen} onOpenChange={setTimeOffDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('schedule.onTimeOff', 'Schedule Time Off')}</DialogTitle>
            <DialogDescription>
              {t('schedule.onTimeOff', 'Schedule time off for a team member. This will block the selected days on their schedule.')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('schedule.employees', 'Employee')}</Label>
              <Select
                value={selectedEmployeeForTimeOff}
                onValueChange={setSelectedEmployeeForTimeOff}
              >
                <SelectTrigger data-testid="select-time-off-employee">
                  <SelectValue placeholder={t('schedule.selectEmployee', 'Select employee...')} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t('schedule.startDate', 'Start Date')}</Label>
                <Input
                  type="date"
                  value={selectedTimeOffStartDate}
                  onChange={(e) => {
                    setSelectedTimeOffStartDate(e.target.value);
                    if (!selectedTimeOffEndDate || e.target.value > selectedTimeOffEndDate) {
                      setSelectedTimeOffEndDate(e.target.value);
                    }
                  }}
                  data-testid="input-time-off-start-date"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('schedule.endDate', 'End Date')}</Label>
                <Input
                  type="date"
                  value={selectedTimeOffEndDate}
                  min={selectedTimeOffStartDate}
                  onChange={(e) => setSelectedTimeOffEndDate(e.target.value)}
                  data-testid="input-time-off-end-date"
                />
              </div>
            </div>
            {selectedTimeOffStartDate && selectedTimeOffEndDate && selectedTimeOffStartDate <= selectedTimeOffEndDate && (
              <p className="text-xs text-muted-foreground">
                {(() => {
                  const start = new Date(selectedTimeOffStartDate);
                  const end = new Date(selectedTimeOffEndDate);
                  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                  return `${days} day${days > 1 ? 's' : ''} selected`;
                })()}
              </p>
            )}
            
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={selectedTimeOffType}
                onValueChange={setSelectedTimeOffType}
              >
                <SelectTrigger data-testid="select-time-off-type">
                  <SelectValue placeholder={t('schedule.selectType', 'Select type...')} />
                </SelectTrigger>
                <SelectContent>
                  {timeOffTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: type.color }}
                        />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{t('schedule.notes', 'Notes')} ({t('common.optional', 'Optional')})</Label>
              <Textarea
                value={timeOffNotes}
                onChange={(e) => setTimeOffNotes(e.target.value)}
                placeholder={t('schedule.notes', 'Add any notes about this time off...')}
                data-testid="input-time-off-notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setTimeOffDialogOpen(false);
                resetTimeOffForm();
              }}
              data-testid="button-cancel-time-off"
            >
              {t('schedule.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleCreateTimeOff}
              disabled={createTimeOffMutation.isPending}
              data-testid="button-save-time-off"
            >
              {createTimeOffMutation.isPending ? t('schedule.onTimeOff', 'Scheduling...') : t('schedule.onTimeOff', 'Schedule Time Off')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Job Dialog */}
      <CreateJobDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        selectedDates={selectedDates}
        employees={employees}
      />

      {/* Job Detail Dialog */}
      <JobDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        job={selectedJob}
        employees={employees}
        onEdit={() => {
          setDetailDialogOpen(false);
          setSelectedJob(selectedJob);
          setEditDialogOpen(true);
        }}
        onJobUpdate={setSelectedJob}
      />

      {/* Edit Job Dialog */}
      <EditJobDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        job={selectedJob}
        employees={employees}
      />

      {/* Double Booking Warning Dialog */}
      <DoubleBookingWarningDialog
        open={conflictDialogOpen}
        onClose={() => {
          setConflictDialogOpen(false);
          setConflictInfo({ conflicts: [], pendingAssignment: null, assignmentType: 'batch' });
        }}
        onProceed={handleForceAssignment}
        conflicts={conflictInfo.conflicts}
        isPending={quickAssignMutation.isPending || assignEmployeeMutation.isPending}
      />

      {/* Shared Assignment Dialog (used by drag-drop and job detail button) */}
      {jobForAssignment && selectedEmployeeForAssignment && (
        <Sheet open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t('schedule.assignEmployee', 'Assign Employee to Job')}</SheetTitle>
              <SheetDescription>
                {t('schedule.assignEmployee', 'Specify the date range when')} {selectedEmployeeForAssignment.name} {t('schedule.assignEmployee', 'will work on this job')}
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-4 mt-6">
              <div>
                <Label htmlFor="assign-start-date">{t('schedule.startDate', 'Start Date')}</Label>
                <Input
                  id="assign-start-date"
                  type="date"
                  value={assignmentDates.startDate}
                  onChange={(e) => setAssignmentDates({ ...assignmentDates, startDate: e.target.value })}
                  data-testid="input-assignment-start-date"
                />
              </div>
              <div>
                <Label htmlFor="assign-end-date">{t('schedule.endDate', 'End Date')}</Label>
                <Input
                  id="assign-end-date"
                  type="date"
                  value={assignmentDates.endDate}
                  onChange={(e) => setAssignmentDates({ ...assignmentDates, endDate: e.target.value })}
                  data-testid="input-assignment-end-date"
                />
              </div>
            </div>
            
            <SheetFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => setAssignmentDialogOpen(false)}
                data-testid="button-cancel-assignment"
              >
                {t('schedule.cancel', 'Cancel')}
              </Button>
              <Button
                onClick={() => {
                  assignEmployeeMutation.mutate({
                    jobId: jobForAssignment.id,
                    employeeId: selectedEmployeeForAssignment.id,
                    startDate: assignmentDates.startDate,
                    endDate: assignmentDates.endDate,
                  });
                }}
                disabled={assignEmployeeMutation.isPending}
                data-testid="button-save-assignment"
              >
                {assignEmployeeMutation.isPending ? t('schedule.assignEmployee', 'Assigning...') : t('schedule.assignEmployee', 'Assign Employee')}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      <DragOverlay>
        {activeEmployee ? (
          <div className="p-1.5 bg-primary/90 border-2 border-primary rounded shadow-lg">
            <div className="font-bold text-primary-foreground text-xs">{activeEmployee.name}</div>
          </div>
        ) : null}
      </DragOverlay>
    </div>
    </DndContext>
  );
}

// Draggable Employee Card Component
function DraggableEmployeeCard({ 
  employee, 
  isActive, 
  onClick, 
  children,
  type = 'assigned'
}: { 
  employee: User; 
  isActive: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
  type?: 'assigned' | 'available';
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: employee.id,
  });

  const bgColor = type === 'assigned' 
    ? 'bg-green-50 dark:bg-green-950/30' 
    : 'bg-primary/5 dark:bg-primary/20/30';
  
  const borderColor = isActive 
    ? 'border-primary border-2' 
    : type === 'assigned'
      ? 'border-green-200 dark:border-green-800'
      : 'border-primary/20 dark:border-primary/80';

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`p-1.5 ${bgColor} border ${borderColor} rounded cursor-grab active:cursor-grabbing hover:scale-105 transition-all ${isDragging ? 'opacity-50' : ''} ${isActive ? 'scale-105' : ''}`}
    >
      <div className="font-bold text-foreground text-xs flex items-center gap-1 overflow-hidden">
        {isActive && <span className="text-primary flex-shrink-0">→</span>}
        <span className="truncate">{employee.name} {employee.role && `(${employee.role.replace(/_/g, ' ')})`}</span>
      </div>
      {children}
    </div>
  );
}

// Droppable Available Zone Component
function DroppableAvailableZone({ isDragging, children }: { isDragging: boolean; children: React.ReactNode }) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({
    id: 'available-zone',
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`relative ${isOver ? 'ring-2 ring-primary ring-offset-2 rounded-lg bg-primary/10' : ''}`}
    >
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-lg z-10 pointer-events-none">
          <p className="text-sm font-bold text-primary">{t('schedule.dropHere', 'Drop to unassign from all jobs')}</p>
        </div>
      )}
      {children}
    </div>
  );
}

// Create Job Dialog Component
function CreateJobDialog({
  open,
  onOpenChange,
  selectedDates,
  employees,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDates: { start: Date; end: Date } | null;
  employees: User[];
}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { brandColors, brandingActive } = useContext(BrandingContext);
  const defaultJobColor = brandingActive && brandColors.length > 0 ? brandColors[0] : "hsl(var(--primary))";
  
  // Conflict dialog state
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [pendingConflicts, setPendingConflicts] = useState<Array<{ employeeId: string; employeeName: string; conflictingJob: string; conflictType?: 'job' | 'time_off' }>>([]);
  const [pendingJobData, setPendingJobData] = useState<any>(null);
  
  // Fetch projects for dropdown
  const { data: projectsData } = useQuery<{ projects: any[] }>({
    queryKey: ["/api/projects"],
  });
  const projects = projectsData?.projects || [];
  
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    jobType: "window_cleaning",
    customJobType: "",
    location: "",
    estimatedHours: "",
    notes: "",
    startDate: "",
    endDate: "",
    color: defaultJobColor,
    employeeIds: [] as string[],
  });

  // Auto-populate dates when project is selected
  useEffect(() => {
    if (formData.projectId) {
      const selectedProject = projects.find((p: any) => p.id === formData.projectId);
      if (selectedProject) {
        // Only set dates if project has them and form dates are empty
        if (selectedProject.startDate && !formData.startDate) {
          const projectStart = new Date(selectedProject.startDate);
          setFormData(prev => ({
            ...prev,
            startDate: projectStart.toISOString().slice(0, 16),
          }));
        }
        if (selectedProject.endDate && !formData.endDate) {
          const projectEnd = new Date(selectedProject.endDate);
          setFormData(prev => ({
            ...prev,
            endDate: projectEnd.toISOString().slice(0, 16),
          }));
        }
      }
    }
  }, [formData.projectId, projects]);

  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/schedule", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: t('schedule.jobCreated', 'Job created'),
        description: t('schedule.jobCreated', 'Job has been added to the schedule'),
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      // Check if this is a conflict error (409)
      if (error.message.startsWith('409:')) {
        try {
          const jsonStr = error.message.substring(5).trim();
          const errorData = JSON.parse(jsonStr);
          if (errorData?.conflicts && errorData.conflicts.length > 0) {
            // Show professional conflict dialog
            setPendingConflicts(errorData.conflicts.map((c: any) => ({
              employeeId: c.employeeId,
              employeeName: c.employeeName,
              conflictingJob: c.conflictingJobTitle,
              conflictType: c.conflictType,
            })));
            setConflictDialogOpen(true);
            return;
          }
        } catch (e) {
          console.error("Failed to parse conflict response:", e);
        }
      }
      toast({
        title: t('schedule.error', 'Error'),
        description: error.message || t('schedule.error', 'Failed to create job'),
        variant: "destructive",
      });
    },
  });
  
  // Force create mutation (bypasses conflict check)
  const forceCreateJobMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/schedule", { ...data, forceAssignment: true });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: t('schedule.jobCreated', 'Job created'),
        description: t('schedule.jobCreated', 'Job has been added to the schedule'),
      });
      setConflictDialogOpen(false);
      setPendingConflicts([]);
      setPendingJobData(null);
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: t('schedule.error', 'Error'),
        description: error.message || t('schedule.error', 'Failed to create job'),
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      projectId: "",
      title: "",
      description: "",
      jobType: "window_cleaning",
      customJobType: "",
      location: "",
      estimatedHours: "",
      notes: "",
      startDate: "",
      endDate: "",
      color: defaultJobColor,
      employeeIds: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    const jobData = {
      projectId: formData.projectId || null,
      title: formData.title,
      description: formData.description,
      jobType: formData.jobType,
      customJobType: formData.jobType === "custom" ? formData.customJobType : null,
      location: formData.location,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null,
      notes: formData.notes,
      startDate,
      endDate,
      color: formData.color,
      status: "upcoming",
      employeeIds: formData.employeeIds,
    };
    
    // Save for potential force submit
    setPendingJobData(jobData);
    
    await createJobMutation.mutateAsync(jobData);
  };
  
  const handleForceCreate = () => {
    if (pendingJobData) {
      forceCreateJobMutation.mutate(pendingJobData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('schedule.createJob', 'Create New Job')}</DialogTitle>
          <DialogDescription>
            {t('schedule.createJob', 'Schedule a new job and assign team members')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">{t('schedule.project', 'Select Project')} ({t('common.optional', 'Optional')})</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) => setFormData({ ...formData, projectId: value })}
            >
              <SelectTrigger data-testid="select-project">
                <SelectValue placeholder={t('schedule.selectProject', 'Choose a project or leave blank for custom job')} />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project: any) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.buildingName} - {project.strataPlanNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">{t('schedule.jobTitle', 'Job Title')} {!formData.projectId && '*'}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t('schedule.jobTitle', 'e.g., Window Cleaning - North Tower')}
              required={!formData.projectId}
              disabled={!!formData.projectId}
              data-testid="input-job-title"
            />
            {formData.projectId && (
              <p className="text-xs text-muted-foreground">{t('schedule.project', 'Project name will be used automatically')}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">{t('schedule.startDate', 'Start Date')} *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                data-testid="input-start-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">{t('schedule.endDate', 'End Date')} *</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                data-testid="input-end-date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobType">{t('projects.type', 'Job Type')} *</Label>
            <Select
              value={formData.jobType}
              onValueChange={(value) => setFormData({ ...formData, jobType: value })}
            >
              <SelectTrigger data-testid="select-job-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="window_cleaning">{t('projects.windowCleaning', 'Window Cleaning')}</SelectItem>
                <SelectItem value="dryer_vent_cleaning">{t('projects.dryerVentCleaning', 'Dryer Vent Cleaning')}</SelectItem>
                <SelectItem value="building_wash">{t('projects.buildingWash', 'Building Wash - Pressure washing')}</SelectItem>
                <SelectItem value="in_suite">{t('projects.inSuite', 'In-Suite Service')}</SelectItem>
                <SelectItem value="parkade">{t('projects.parkade', 'Parkade Cleaning')}</SelectItem>
                <SelectItem value="ground_window">{t('projects.groundWindow', 'Ground Window Cleaning')}</SelectItem>
                <SelectItem value="custom">{t('projects.custom', 'Custom')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.jobType === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customJobType">{t('projects.customType', 'Custom Job Type')} *</Label>
              <Input
                id="customJobType"
                value={formData.customJobType}
                onChange={(e) => setFormData({ ...formData, customJobType: e.target.value })}
                placeholder={t('projects.customType', 'e.g., Gutter Cleaning, Sidewalk Repair')}
                required
                data-testid="input-custom-job-type"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="location">{t('projects.location', 'Location')}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder={t('projects.location', 'Job site address')}
              data-testid="input-location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">{t('schedule.color', 'Calendar Color')}</Label>
            <div className="flex items-center gap-3">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-20 h-10 cursor-pointer"
                data-testid="input-color"
              />
              <span className="text-sm text-muted-foreground">{formData.color}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedHours">{t('projects.estimatedHours', 'Estimated Hours')}</Label>
            <Input
              id="estimatedHours"
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
              placeholder="0"
              data-testid="input-estimated-hours"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('common.description', 'Description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('common.description', 'Job details...')}
              rows={3}
              data-testid="input-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('schedule.notes', 'Notes')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('schedule.notes', 'Additional notes...')}
              rows={2}
              data-testid="input-notes"
            />
          </div>

          {/* Employee Assignment */}
          <div className="space-y-2">
            <Label>{t('schedule.assignedEmployees', 'Assign Team Members')}</Label>
            <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
              {employees.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('schedule.availableEmployees', 'No employees available')}</p>
              ) : (
                employees.map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`employee-${employee.id}`}
                      checked={formData.employeeIds.includes(employee.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            employeeIds: [...formData.employeeIds, employee.id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            employeeIds: formData.employeeIds.filter(id => id !== employee.id),
                          });
                        }
                      }}
                      className="rounded border-border"
                      data-testid={`checkbox-employee-${employee.id}`}
                    />
                    <label
                      htmlFor={`employee-${employee.id}`}
                      className="text-sm flex-1 cursor-pointer"
                    >
                      {employee.name} {employee.role && `(${employee.role.replace(/_/g, ' ')})`}
                    </label>
                  </div>
                ))
              )}
            </div>
            {formData.employeeIds.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {formData.employeeIds.length} {t('schedule.assignedEmployees', 'team member(s) selected')}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              {t('schedule.cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              disabled={createJobMutation.isPending}
              data-testid="button-submit-job"
            >
              {createJobMutation.isPending ? t('schedule.createJob', 'Creating...') : t('schedule.createJob', 'Create Job')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      
      <DoubleBookingWarningDialog
        open={conflictDialogOpen}
        onClose={() => {
          setConflictDialogOpen(false);
          setPendingConflicts([]);
        }}
        onProceed={handleForceCreate}
        conflicts={pendingConflicts}
        isPending={forceCreateJobMutation.isPending}
      />
    </Dialog>
  );
}

// Job Detail Dialog Component
function JobDetailDialog({
  open,
  onOpenChange,
  job,
  onEdit,
  employees,
  onJobUpdate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: ScheduledJobWithAssignments | null;
  onEdit: () => void;
  employees: User[];
  onJobUpdate?: (updatedJob: ScheduledJobWithAssignments) => void;
}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showAssignEmployees, setShowAssignEmployees] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [assignmentDates, setAssignmentDates] = useState<{ startDate: string; endDate: string }>({
    startDate: "",
    endDate: "",
  });
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<{
    conflicts: Array<{ employeeId: string; employeeName: string; conflictingJob: string; conflictType?: 'job' | 'time_off' }>;
    pendingAssignment: { jobId: string; employeeId: string; startDate: string; endDate: string } | null;
  }>({ conflicts: [], pendingAssignment: null });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      await apiRequest("DELETE", `/api/schedule/${jobId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: t('schedule.jobDeleted', 'Job deleted'),
        description: t('schedule.jobDeleted', 'Job has been removed from the schedule'),
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: t('schedule.error', 'Error'),
        description: t('schedule.error', 'Failed to delete job'),
        variant: "destructive",
      });
    },
  });

  const assignEmployeeMutation = useMutation({
    mutationFn: async ({ jobId, employeeId, startDate, endDate, forceAssignment }: { 
      jobId: string; 
      employeeId: string; 
      startDate?: string; 
      endDate?: string; 
      forceAssignment?: boolean;
    }) => {
      console.log("assignEmployeeMutation executing with:", { jobId, employeeId, startDate, endDate, forceAssignment });
      const result = await apiRequest("POST", `/api/schedule/${jobId}/assign-employee`, { 
        employeeId, 
        startDate, 
        endDate,
        forceAssignment
      });
      console.log("assignEmployeeMutation result:", result);
      return result;
    },
    onMutate: async (variables) => {
      return { jobId: variables.jobId, employeeId: variables.employeeId, startDate: variables.startDate, endDate: variables.endDate };
    },
    onSuccess: async () => {
      setConflictDialogOpen(false);
      setConflictInfo({ conflicts: [], pendingAssignment: null });
      // Use refetchQueries to wait for fresh data before updating dialog
      await queryClient.refetchQueries({ queryKey: ["/api/schedule"] });
      // Update the job in parent state for immediate UI refresh
      if (job && onJobUpdate) {
        const scheduleData = queryClient.getQueryData(["/api/schedule"]) as { jobs?: ScheduledJobWithAssignments[] } | ScheduledJobWithAssignments[] | undefined;
        const jobsArray = Array.isArray(scheduleData) ? scheduleData : (scheduleData?.jobs || []);
        const updatedJob = jobsArray.find((j: ScheduledJobWithAssignments) => j.id === job.id);
        if (updatedJob) {
          onJobUpdate(updatedJob);
        }
      }
      toast({
        title: t('schedule.assignmentCreated', 'Employee assigned'),
        description: t('schedule.assignmentCreated', 'Team member has been assigned to this job'),
      });
      setAssignDialogOpen(false);
      setSelectedEmployee(null);
      setShowAssignEmployees(false);
    },
    onError: async (error: Error, _variables, context) => {
      // Check if this is a conflict error (409)
      if (error.message.startsWith('409:')) {
        try {
          // Error format is "409: {json_body}"
          const jsonStr = error.message.substring(5).trim();
          const errorData = JSON.parse(jsonStr);
          if (errorData?.conflicts && errorData.conflicts.length > 0) {
            setConflictInfo({
              conflicts: errorData.conflicts,
              pendingAssignment: context ? {
                jobId: context.jobId,
                employeeId: context.employeeId,
                startDate: context.startDate || '',
                endDate: context.endDate || '',
              } : null,
            });
            setConflictDialogOpen(true);
            return;
          }
        } catch (e) {
          console.error("Failed to parse conflict response:", e);
        }
      }
      toast({
        title: t('schedule.error', 'Error'),
        description: error.message || t('schedule.error', 'Failed to assign employee'),
        variant: "destructive",
      });
    },
  });

  const handleForceAssignment = () => {
    if (!conflictInfo.pendingAssignment) return;
    assignEmployeeMutation.mutate({
      jobId: conflictInfo.pendingAssignment.jobId,
      employeeId: conflictInfo.pendingAssignment.employeeId,
      startDate: conflictInfo.pendingAssignment.startDate,
      endDate: conflictInfo.pendingAssignment.endDate,
      forceAssignment: true,
    });
  };

  const unassignEmployeeMutation = useMutation({
    mutationFn: async ({ jobId, assignmentId }: { jobId: string; assignmentId: string }) => {
      await apiRequest("DELETE", `/api/schedule/${jobId}/assignments/${assignmentId}`);
    },
    onSuccess: async () => {
      // Use refetchQueries to wait for fresh data before updating dialog
      await queryClient.refetchQueries({ queryKey: ["/api/schedule"] });
      // Update the job in parent state for immediate UI refresh
      if (job && onJobUpdate) {
        const scheduleData = queryClient.getQueryData(["/api/schedule"]) as { jobs?: ScheduledJobWithAssignments[] } | ScheduledJobWithAssignments[] | undefined;
        const jobsArray = Array.isArray(scheduleData) ? scheduleData : (scheduleData?.jobs || []);
        const updatedJob = jobsArray.find((j: ScheduledJobWithAssignments) => j.id === job.id);
        if (updatedJob) {
          onJobUpdate(updatedJob);
        }
      }
      toast({
        title: t('schedule.assignmentRemoved', 'Employee unassigned'),
        description: t('schedule.assignmentRemoved', 'Team member has been removed from this job'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('schedule.error', 'Error'),
        description: error.message || t('schedule.error', 'Failed to unassign employee'),
        variant: "destructive",
      });
    },
  });

  const handleAssignEmployee = (employee: User) => {
    console.log("handleAssignEmployee called", employee);
    if (!job) {
      console.log("No job available");
      return;
    }
    setSelectedEmployee(employee);
    // Set default dates to job's date range (timezone-safe extraction)
    const startDate = String(job.startDate).split('T')[0];
    const endDate = String(job.endDate).split('T')[0];
    console.log("Setting dates:", startDate, endDate);
    setAssignmentDates({ startDate, endDate });
    console.log("Opening dialog");
    setAssignDialogOpen(true);
  };

  const handleSaveAssignment = () => {
    console.log("handleSaveAssignment called");
    console.log("job:", job);
    console.log("selectedEmployee:", selectedEmployee);
    console.log("assignmentDates:", assignmentDates);
    
    if (!job || !selectedEmployee) {
      console.log("Missing job or selectedEmployee");
      return;
    }
    
    const payload = {
      jobId: job.id,
      employeeId: selectedEmployee.id,
      startDate: assignmentDates.startDate,
      endDate: assignmentDates.endDate,
    };
    
    console.log("Calling mutation with payload:", payload);
    assignEmployeeMutation.mutate(payload);
  };

  if (!job) return null;

  const statusColors: Record<string, string> = {
    upcoming: "bg-primary/50/10 text-primary border-primary/50/20",
    in_progress: "bg-green-500/10 text-green-600 border-green-500/20",
    completed: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
    cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{job.title}</DialogTitle>
            <Badge className={statusColors[job.status]} variant="outline">
              {job.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {job.description && (
            <div>
              <h3 className="font-medium text-sm mb-1">{t('common.description', 'Description')}</h3>
              <p className="text-sm text-muted-foreground">{job.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm mb-1">{t('schedule.startDate', 'Start Date')}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(job.startDate)}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">{t('schedule.endDate', 'End Date')}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(job.endDate)}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">{t('schedule.assignedEmployees', 'Assigned Team Members')}</h3>
              <Button
                variant={showAssignEmployees ? "outline" : "default"}
                size="default"
                onClick={() => {
                  console.log("Manage/assign button clicked");
                  // For testing: open dialog directly when there are employees
                  if (employees.length > 0 && !showAssignEmployees) {
                    const firstUnassigned = employees.find(emp => {
                      const isAssigned = job.employeeAssignments?.some(assignment => assignment.employee.id === emp.id) ||
                                        job.assignedEmployees?.some(assigned => assigned.id === emp.id);
                      return !isAssigned;
                    });
                    if (firstUnassigned) {
                      console.log("Opening dialog with first unassigned employee:", firstUnassigned.name);
                      handleAssignEmployee(firstUnassigned);
                      return;
                    }
                  }
                  setShowAssignEmployees(!showAssignEmployees);
                }}
                data-testid="button-assign-employees"
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                {showAssignEmployees ? t('schedule.cancel', 'Cancel') : t('schedule.assignEmployee', 'Manage/assign employee to job')}
              </Button>
            </div>
            
            {showAssignEmployees ? (
              <div className="space-y-3">
                <div className="border rounded-md p-4 max-h-64 overflow-y-auto">
                  {(() => {
                    if (employees.length === 0) {
                      return <p className="text-sm text-muted-foreground">{t('schedule.availableEmployees', 'No employees available')}</p>;
                    }
                    
                    const unassignedEmployees = employees.filter(emp => {
                      const isAssigned = job.employeeAssignments?.some(assignment => assignment.employee.id === emp.id) ||
                                        job.assignedEmployees?.some(assigned => assigned.id === emp.id);
                      return !isAssigned;
                    });
                    
                    if (unassignedEmployees.length === 0) {
                      return <p className="text-sm text-muted-foreground">{t('schedule.allAssigned', 'All employees are already assigned to this job')}</p>;
                    }
                    
                    return (
                      <div className="grid grid-cols-1 gap-2">
                        {unassignedEmployees.map((employee) => (
                          <Button
                            key={employee.id}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              console.log("Button clicked for employee:", employee.name);
                              handleAssignEmployee(employee);
                            }}
                            data-testid={`button-assign-${employee.id}`}
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            {employee.name} {employee.role && `(${employee.role.replace(/_/g, ' ')})`}
                          </Button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <>
                {job.employeeAssignments && job.employeeAssignments.length > 0 ? (
                  <div className="space-y-2">
                    {job.employeeAssignments.map((assignment) => (
                      <div key={assignment.assignmentId} className="flex items-center justify-between border rounded-md p-3">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{assignment.employee.name} {assignment.employee.role && `(${assignment.employee.role.replace(/_/g, ' ')})`}</div>
                          <div className="text-xs text-muted-foreground">
                            {assignment.startDate && assignment.endDate ? (
                              <>
                                {formatLocalDate(assignment.startDate)} - {formatLocalDate(assignment.endDate)}
                              </>
                            ) : (
                              <span>{t('schedule.allDay', 'Entire job duration')}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedEmployee(assignment.employee);
                              const startDate = assignment.startDate 
                                ? String(assignment.startDate).split('T')[0]
                                : String(job.startDate).split('T')[0];
                              const endDate = assignment.endDate
                                ? String(assignment.endDate).split('T')[0]
                                : String(job.endDate).split('T')[0];
                              setAssignmentDates({ startDate, endDate });
                              setAssignDialogOpen(true);
                            }}
                            data-testid={`button-edit-assignment-${assignment.employee.id}`}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => unassignEmployeeMutation.mutate({ 
                              jobId: job.id, 
                              assignmentId: assignment.assignmentId 
                            })}
                            data-testid={`button-remove-assignment-${assignment.employee.id}`}
                          >
                            <UserX className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t('schedule.noAssignments', 'No team members assigned yet')}
                  </p>
                )}
              </>
            )}
          </div>

          {job.location && (
            <div>
              <h3 className="font-medium text-sm mb-1">{t('projects.location', 'Location')}</h3>
              <p className="text-sm text-muted-foreground">{job.location}</p>
            </div>
          )}

          {job.estimatedHours && (
            <div>
              <h3 className="font-medium text-sm mb-1">{t('projects.estimatedHours', 'Estimated Hours')}</h3>
              <p className="text-sm text-muted-foreground">{job.estimatedHours} {t('common.hours', 'hours')}</p>
            </div>
          )}

          {job.notes && (
            <div>
              <h3 className="font-medium text-sm mb-1">{t('schedule.notes', 'Notes')}</h3>
              <p className="text-sm text-muted-foreground">{job.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            data-testid="button-delete-job"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('schedule.removeJobFromCalendar', 'Remove Job from Calendar')}
          </Button>
          <Button
            onClick={onEdit}
            data-testid="button-edit-job"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {t('schedule.editJob', 'Edit Job')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('schedule.removeJobFromCalendar', 'Remove Job from Calendar')}?</AlertDialogTitle>
          <AlertDialogDescription>
            {t('schedule.confirmRemove', 'Are you sure you want to remove')} "{job?.title}" {t('schedule.confirmRemove', 'from the calendar? This will remove all employee assignments for this scheduled job.')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('schedule.cancel', 'Cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (job) {
                deleteJobMutation.mutate(job.id);
                setShowDeleteConfirm(false);
              }
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('schedule.removeJobFromCalendar', 'Remove Job from Calendar')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {job && (
      <Sheet open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('schedule.assignEmployee', 'Assign Employee to Job')}</SheetTitle>
            <SheetDescription>
              {t('schedule.assignEmployee', 'Specify the date range when')} {selectedEmployee?.name} {t('schedule.assignEmployee', 'will work on this job')}
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 mt-6">
            <div>
              <Label htmlFor="assign-start-date">{t('schedule.startDate', 'Start Date')}</Label>
              <Input
                id="assign-start-date"
                type="date"
                value={assignmentDates.startDate}
                onChange={(e) => setAssignmentDates({ ...assignmentDates, startDate: e.target.value })}
                min={String(job.startDate).split('T')[0]}
                max={String(job.endDate).split('T')[0]}
                data-testid="input-assignment-start-date"
              />
            </div>
            <div>
              <Label htmlFor="assign-end-date">{t('schedule.endDate', 'End Date')}</Label>
              <Input
                id="assign-end-date"
                type="date"
                value={assignmentDates.endDate}
                onChange={(e) => setAssignmentDates({ ...assignmentDates, endDate: e.target.value })}
                min={assignmentDates.startDate || String(job.startDate).split('T')[0]}
                max={String(job.endDate).split('T')[0]}
                data-testid="input-assignment-end-date"
              />
            </div>
          </div>
          
          <SheetFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
              data-testid="button-cancel-assignment"
            >
              {t('schedule.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleSaveAssignment}
              disabled={assignEmployeeMutation.isPending}
              data-testid="button-save-assignment"
            >
              {assignEmployeeMutation.isPending ? t('schedule.assignEmployee', 'Assigning...') : t('schedule.assignEmployee', 'Assign Employee')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )}

    <DoubleBookingWarningDialog
      open={conflictDialogOpen}
      onClose={() => {
        setConflictDialogOpen(false);
        setConflictInfo({ conflicts: [], pendingAssignment: null });
      }}
      onProceed={handleForceAssignment}
      conflicts={conflictInfo.conflicts}
      isPending={assignEmployeeMutation.isPending}
    />
  </>
  );
}

// Edit Job Dialog Component  
function EditJobDialog({
  open,
  onOpenChange,
  job,
  employees,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: ScheduledJobWithAssignments | null;
  employees: User[];
}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { brandColors, brandingActive } = useContext(BrandingContext);
  const defaultJobColor = brandingActive && brandColors.length > 0 ? brandColors[0] : "hsl(var(--primary))";
  
  // Fetch projects for dropdown
  const { data: projectsData } = useQuery<{ projects: any[] }>({
    queryKey: ["/api/projects"],
  });
  const projects = projectsData?.projects || [];
  
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    jobType: "",
    customJobType: "",
    location: "",
    estimatedHours: "",
    notes: "",
    startDate: "",
    endDate: "",
    status: "",
    color: defaultJobColor,
    employeeIds: [] as string[],
  });

  // Update form when job changes
  useEffect(() => {
    if (job) {
      setFormData({
        projectId: job.projectId || "",
        title: job.title || "",
        description: job.description || "",
        jobType: job.jobType || "window_cleaning",
        customJobType: job.customJobType || "",
        location: job.location || "",
        estimatedHours: job.estimatedHours?.toString() || "",
        notes: job.notes || "",
        startDate: job.startDate ? new Date(job.startDate).toISOString().slice(0, 16) : "",
        endDate: job.endDate ? new Date(job.endDate).toISOString().slice(0, 16) : "",
        status: job.status || "upcoming",
        color: job.color || defaultJobColor,
        employeeIds: job.assignedEmployees?.map(e => e.id) || [],
      });
    }
  }, [job]);

  // Auto-populate dates when project is selected (after initial load)
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (job && initialLoad) {
      setInitialLoad(false);
      return;
    }
    
    if (formData.projectId && !initialLoad) {
      const selectedProject = projects.find((p: any) => p.id === formData.projectId);
      if (selectedProject && selectedProject.startDate && selectedProject.endDate) {
        const projectStart = new Date(selectedProject.startDate);
        const projectEnd = new Date(selectedProject.endDate);
        setFormData(prev => ({
          ...prev,
          startDate: projectStart.toISOString().slice(0, 16),
          endDate: projectEnd.toISOString().slice(0, 16),
        }));
      }
    }
  }, [formData.projectId, projects, initialLoad, job]);

  const updateJobMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/schedule/${job?.id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: t('schedule.jobUpdated', 'Job updated'),
        description: t('schedule.jobUpdated', 'Job details have been saved'),
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: t('schedule.error', 'Error'),
        description: error.message || t('schedule.error', 'Failed to update job'),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    await updateJobMutation.mutateAsync({
      projectId: formData.projectId || null,
      title: formData.title,
      description: formData.description,
      jobType: formData.jobType,
      customJobType: formData.jobType === "custom" ? formData.customJobType : null,
      location: formData.location,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null,
      notes: formData.notes,
      startDate,
      endDate,
      status: formData.status,
      color: formData.color,
      employeeIds: formData.employeeIds,
    });
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('schedule.editJob', 'Edit Job')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-project">{t('schedule.project', 'Select Project')} ({t('common.optional', 'Optional')})</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) => setFormData({ ...formData, projectId: value })}
            >
              <SelectTrigger data-testid="select-edit-project">
                <SelectValue placeholder={t('schedule.selectProject', 'Choose a project or leave blank for custom job')} />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project: any) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.buildingName} - {project.strataPlanNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-title">{t('schedule.jobTitle', 'Job Title')} {!formData.projectId && '*'}</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required={!formData.projectId}
              disabled={!!formData.projectId}
              data-testid="input-edit-title"
            />
            {formData.projectId && (
              <p className="text-xs text-muted-foreground">{t('schedule.project', 'Project name will be used automatically')}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">{t('schedule.startDate', 'Start Date')} *</Label>
              <Input
                id="edit-startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                data-testid="input-edit-start-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-endDate">{t('schedule.endDate', 'End Date')} *</Label>
              <Input
                id="edit-endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                data-testid="input-edit-end-date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">{t('common.status', 'Status')} *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger data-testid="select-edit-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">{t('projects.upcoming', 'Upcoming')}</SelectItem>
                <SelectItem value="in_progress">{t('projects.inProgress', 'In Progress')}</SelectItem>
                <SelectItem value="completed">{t('projects.completed', 'Completed')}</SelectItem>
                <SelectItem value="cancelled">{t('projects.cancelled', 'Cancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-jobType">{t('projects.type', 'Job Type')} *</Label>
            <Select
              value={formData.jobType}
              onValueChange={(value) => setFormData({ ...formData, jobType: value })}
            >
              <SelectTrigger data-testid="select-edit-job-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="window_cleaning">{t('projects.windowCleaning', 'Window Cleaning')}</SelectItem>
                <SelectItem value="dryer_vent_cleaning">{t('projects.dryerVentCleaning', 'Dryer Vent Cleaning')}</SelectItem>
                <SelectItem value="building_wash">{t('projects.buildingWash', 'Building Wash - Pressure washing')}</SelectItem>
                <SelectItem value="in_suite">{t('projects.inSuite', 'In-Suite Service')}</SelectItem>
                <SelectItem value="parkade">{t('projects.parkade', 'Parkade Cleaning')}</SelectItem>
                <SelectItem value="ground_window">{t('projects.groundWindow', 'Ground Window Cleaning')}</SelectItem>
                <SelectItem value="custom">{t('projects.custom', 'Custom')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.jobType === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="edit-customJobType">{t('projects.customType', 'Custom Job Type')} *</Label>
              <Input
                id="edit-customJobType"
                value={formData.customJobType}
                onChange={(e) => setFormData({ ...formData, customJobType: e.target.value })}
                placeholder={t('projects.customType', 'e.g., Gutter Cleaning, Sidewalk Repair')}
                required
                data-testid="input-edit-custom-job-type"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-location">{t('projects.location', 'Location')}</Label>
            <Input
              id="edit-location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              data-testid="input-edit-location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-color">{t('schedule.color', 'Calendar Color')}</Label>
            <div className="flex items-center gap-3">
              <Input
                id="edit-color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-20 h-10 cursor-pointer"
                data-testid="input-edit-color"
              />
              <span className="text-sm text-muted-foreground">{formData.color}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-estimatedHours">{t('projects.estimatedHours', 'Estimated Hours')}</Label>
            <Input
              id="edit-estimatedHours"
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
              data-testid="input-edit-estimated-hours"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">{t('common.description', 'Description')}</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              data-testid="input-edit-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">{t('schedule.notes', 'Notes')}</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              data-testid="input-edit-notes"
            />
          </div>

          {/* Employee Assignment */}
          <div className="space-y-2">
            <Label>{t('schedule.assignedEmployees', 'Assigned Team Members')}</Label>
            <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
              {employees.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('schedule.availableEmployees', 'No employees available')}</p>
              ) : (
                employees.map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-employee-${employee.id}`}
                      checked={formData.employeeIds.includes(employee.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            employeeIds: [...formData.employeeIds, employee.id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            employeeIds: formData.employeeIds.filter(id => id !== employee.id),
                          });
                        }
                      }}
                      className="rounded border-border"
                      data-testid={`checkbox-edit-employee-${employee.id}`}
                    />
                    <label
                      htmlFor={`edit-employee-${employee.id}`}
                      className="text-sm flex-1 cursor-pointer"
                    >
                      {employee.name} {employee.role && `(${employee.role.replace(/_/g, ' ')})`}
                    </label>
                  </div>
                ))
              )}
            </div>
            {formData.employeeIds.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {formData.employeeIds.length} {t('schedule.assignedEmployees', 'team member(s) selected')}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-edit-cancel"
            >
              {t('schedule.cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              disabled={updateJobMutation.isPending}
              data-testid="button-update-job"
            >
              {updateJobMutation.isPending ? t('schedule.save', 'Saving...') : t('schedule.save', 'Save Changes')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
