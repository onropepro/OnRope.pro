import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import type { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
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
import { Calendar, Plus, Edit2, Trash2, Users, ArrowLeft, UserCheck, UserX, Lock, ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import type { ScheduledJobWithAssignments, User } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { canViewSchedule } from "@/lib/permissions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Schedule() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ScheduledJobWithAssignments | null>(null);
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date } | null>(null);
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  
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

  // Fetch current user
  const { data: currentUserData, isLoading: isLoadingUser } = useQuery<{ user: User }>({
    queryKey: ["/api/user"],
  });
  const currentUser = currentUserData?.user;

  // Check schedule permission
  const hasSchedulePermission = canViewSchedule(currentUser);

  // If still loading user, show nothing (prevent flash of access denied)
  if (isLoadingUser) {
    return null;
  }

  // If no permission, show access denied
  if (currentUser && !hasSchedulePermission) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/dashboard")}
          data-testid="button-back"
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="border-2 border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <div className="rounded-full bg-destructive/10 p-4">
                <Lock className="w-12 h-12 text-destructive" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p className="text-muted-foreground max-w-md">
                  You don't have permission to view the Job Schedule. Please contact your administrator to request access.
                </p>
              </div>
              <Button onClick={() => setLocation("/dashboard")} data-testid="button-return-dashboard">
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch scheduled jobs
  const { data: jobsData, isLoading } = useQuery<{ jobs: ScheduledJobWithAssignments[] }>({
    queryKey: ["/api/schedule"],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
  const jobs = jobsData?.jobs || [];

  // Fetch employees for assignment
  const { data: employeesData } = useQuery<{ employees: User[] }>({
    queryKey: ["/api/employees"],
  });
  const employees = employeesData?.employees || [];

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
        backgroundColor: job.color || "#0EA5E9",
        borderColor: job.color || "#0EA5E9",
        extendedProps: {
          job,
          employee: assignment.employee,
        },
      };
    });
  });

  // Simple Employee Schedule Week View helpers
  const getWeekDates = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (weekOffset * 7));
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  }, [weekOffset]);

  const formatWeekRange = useMemo(() => {
    const start = getWeekDates[0];
    const end = getWeekDates[6];
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const year = end.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${year}`;
    }
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`;
  }, [getWeekDates]);

  // Get employee assignments for a specific day (using local date to avoid timezone issues)
  const getEmployeeJobsForDay = (employeeId: string, date: Date) => {
    // Format date as YYYY-MM-DD in local timezone to avoid UTC conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return jobs.filter(job => {
      // Check if employee is assigned to this job
      const isAssigned = job.employeeAssignments?.some((assignment: any) => {
        if (assignment.employee.id !== employeeId) return false;
        
        // Check if the date falls within the assignment's date range
        const assignStart = String(assignment.startDate || job.startDate);
        const assignEnd = String(assignment.endDate || job.endDate);
        
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

  // Transform jobs into FullCalendar events [UPDATED: Testing date filtering]
  // Create separate event blocks for each day in multi-day jobs
  const events: EventInput[] = jobs.flatMap((job) => {
    // DEBUG: Log the job data to see what we're getting
    if (job.title?.includes("Dryer")) {
      console.log("=== FRONTEND DEBUG: Dryer vent job ===");
      console.log("employeeAssignments exists?", !!job.employeeAssignments);
      console.log("employeeAssignments length:", job.employeeAssignments?.length);
      if (job.employeeAssignments && job.employeeAssignments.length > 0) {
        const first = job.employeeAssignments[0] as any;
        console.log("First assignment:", {
          name: first.employee?.name,
          startDate: first.startDate,
          endDate: first.endDate
        });
      }
    }
    
    const color = job.color || "#3b82f6";
    // Use project dates if job is linked to a project, otherwise use job dates
    const startDate = job.project?.startDate || job.startDate;
    const endDate = job.project?.endDate || job.endDate;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // If same day, return single event
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    
    if (startDay.getTime() === endDay.getTime()) {
      // For single-day jobs, filter employees by their assignment date range
      const dayDateStr = startDay.toISOString().split('T')[0];
      const employeesForThisDay = job.employeeAssignments?.filter((assignment: any) => {
        // Include employee if they're assigned for this specific day
        if (!assignment.startDate && !assignment.endDate) return true; // No date range = full job duration
        
        const empStart = assignment.startDate ? new Date(assignment.startDate).toISOString().split('T')[0] : dayDateStr;
        const empEnd = assignment.endDate ? new Date(assignment.endDate).toISOString().split('T')[0] : dayDateStr;
        
        return dayDateStr >= empStart && dayDateStr <= empEnd;
      }) || [];
      
      let displayTitle = job.project?.buildingName || job.title;
      if (employeesForThisDay.length > 0) {
        const employeeNames = employeesForThisDay.map((a: any) => `${a.employee.name} (${a.employee.role?.replace(/_/g, ' ') || 'Staff'})`).join(", ");
        displayTitle = `${job.project?.buildingName || job.title}\n👥 ${employeeNames}`;
      }
      
      return [{
        id: job.id,
        title: displayTitle,
        start: startDate,
        end: endDate,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          job,
          employeesForThisDay, // Pass filtered employees for this day
        },
      }];
    }
    
    // Multi-day: create separate all-day events for each day
    const dayEvents = [];
    const currentDate = new Date(startDay);
    
    while (currentDate <= endDay) {
      const eventStart = new Date(currentDate);
      const eventEnd = new Date(currentDate);
      eventEnd.setDate(eventEnd.getDate() + 1);
      
      // Filter employees by their assignment date range for THIS specific day
      const dayDateStr = currentDate.toISOString().split('T')[0];
      const employeesForThisDay = job.employeeAssignments?.filter((assignment: any) => {
        // Include employee if they're assigned for this specific day
        if (!assignment.startDate && !assignment.endDate) return true; // No date range = full job duration
        
        const empStart = assignment.startDate ? new Date(assignment.startDate).toISOString().split('T')[0] : dayDateStr;
        const empEnd = assignment.endDate ? new Date(assignment.endDate).toISOString().split('T')[0] : dayDateStr;
        
        const isInRange = dayDateStr >= empStart && dayDateStr <= empEnd;
        
        // DEBUG
        if (job.title.includes("Dryer")) {
          console.log(`Day ${dayDateStr}: employee ${assignment.employee?.name}, range ${empStart} to ${empEnd}, inRange: ${isInRange}`);
        }
        
        return isInRange;
      }) || [];
      
      let displayTitle = job.project?.buildingName || job.title;
      if (employeesForThisDay.length > 0) {
        const employeeNames = employeesForThisDay.map((a: any) => `${a.employee.name} (${a.employee.role?.replace(/_/g, ' ') || 'Staff'})`).join(", ");
        displayTitle = `${job.project?.buildingName || job.title}\n👥 ${employeeNames}`;
      }
      
      dayEvents.push({
        id: `${job.id}-${currentDate.toISOString().split('T')[0]}`,
        title: displayTitle,
        start: eventStart,
        end: eventEnd,
        allDay: true,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          job,
          employeesForThisDay, // Pass filtered employees for this specific day
        },
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dayEvents;
  });

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
    mutationFn: async ({ jobId, employeeId, startDate, endDate }: { 
      jobId: string; 
      employeeId: string; 
      startDate?: string; 
      endDate?: string; 
    }) => {
      return await apiRequest("POST", `/api/schedule/${jobId}/assign-employee`, { 
        employeeId, 
        startDate, 
        endDate 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: "Employee assigned",
        description: "Team member has been assigned with specified dates",
      });
      setAssignmentDialogOpen(false);
      setSelectedEmployeeForAssignment(null);
      setJobForAssignment(null);
      setAssignmentDates({ startDate: "", endDate: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign employee",
        variant: "destructive",
      });
    },
  });

  // Mutation to assign/unassign employees via drag and drop (legacy quick assign)
  const quickAssignMutation = useMutation({
    mutationFn: async ({ jobId, employeeIds }: { jobId: string; employeeIds: string[] }) => {
      await apiRequest("PUT", `/api/schedule/${jobId}`, { employeeIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: "Assignment updated",
        description: "Employee assignment has been updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update assignment",
        variant: "destructive",
      });
    },
  });

  // Handle event drag/drop to reschedule jobs
  const handleEventDrop = (dropInfo: any) => {
    const job = dropInfo.event.extendedProps.job as ScheduledJobWithAssignments;
    const daysDelta = dropInfo.delta.days;
    
    // Calculate new start and end dates
    const oldStart = new Date(job.startDate);
    const oldEnd = new Date(job.endDate);
    
    const newStart = new Date(oldStart);
    newStart.setDate(newStart.getDate() + daysDelta);
    
    const newEnd = new Date(oldEnd);
    newEnd.setDate(newEnd.getDate() + daysDelta);
    
    // Update the job with new dates
    updateJobDatesMutation.mutate({
      jobId: job.id,
      startDate: newStart.toISOString().split('T')[0],
      endDate: newEnd.toISOString().split('T')[0],
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
        title: "Job rescheduled",
        description: "All days of the job have been moved",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reschedule job",
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
        title: "Employee unassigned",
        description: "Removed from all scheduled jobs",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unassign employee",
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
      
      // Initialize dates with job's full range
      const jobStartDate = new Date(job.startDate).toISOString().slice(0, 10);
      const jobEndDate = new Date(job.endDate).toISOString().slice(0, 10);
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

  return (
    <DndContext 
      onDragEnd={handleDragEnd} 
      onDragStart={(event) => setActiveEmployeeId(event.active.id as string)}
    >
    <div className="p-4 md:p-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setLocation("/dashboard")}
        data-testid="button-back"
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Job Schedule</h1>
          <p className="text-sm text-muted-foreground">
            Manage your team's job assignments and schedule
          </p>
        </div>
      </div>

      {/* Employee Availability */}
      <Card className="sticky top-0 z-10 border-2 border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-1 pt-2">
          <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-primary">
            <Users className="w-4 h-4" />
            EMPLOYEE AVAILABILITY
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-2">
          <div className="grid md:grid-cols-2 gap-2">
            {/* Assigned Employees */}
            <div className="bg-card rounded p-1.5 border-l-4 border-l-green-600 shadow-sm">
              <div className="flex items-center gap-1 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-green-600" />
                <h3 className="font-bold text-xs text-green-700">Assigned ({assignedEmployees.length})</h3>
              </div>
              {assignedEmployees.length === 0 ? (
                <p className="text-xs text-muted-foreground">No employees assigned</p>
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
                  <h3 className="font-bold text-xs text-primary">Available ({availableEmployees.length})</h3>
                </div>
                {availableEmployees.length === 0 ? (
                  <p className="text-xs text-muted-foreground">All employees assigned</p>
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
      </Card>

      {/* Calendar Tabs */}
      <Tabs defaultValue="job-schedule" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-2 h-14 p-1.5 bg-card border-2 border-border shadow-md">
          <TabsTrigger 
            value="job-schedule" 
            data-testid="tab-job-schedule"
            className="text-base font-bold bg-background border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-lg transition-all"
          >
            Job Schedule
          </TabsTrigger>
          <TabsTrigger 
            value="employee-schedule" 
            data-testid="tab-employee-schedule"
            className="text-base font-bold bg-background border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-lg transition-all"
          >
            Employee Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="job-schedule" className="mt-4">
          <div className="bg-card rounded-lg shadow-premium p-6">
            {activeEmployeeId && (
              <div className="mb-4 p-3 bg-primary/10 border-2 border-primary rounded-lg">
                <p className="text-sm font-semibold text-primary">
                  🎯 Assigning: {activeEmployee?.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click on any job to assign this employee. Green = assign, Red = remove. Press Escape to cancel.
                </p>
              </div>
            )}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-muted-foreground">Loading calendar...</div>
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
                font-size: 0.75rem;
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
              events={events}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventDrop={handleEventDrop}
              height="700px"
              displayEventTime={false}
              displayEventEnd={false}
              eventDisplay="block"
              data-testid="calendar"
              eventDidMount={(info) => {
                const job = info.event.extendedProps.job as ScheduledJobWithAssignments;
                info.el.setAttribute('data-job-id', job.id);
              }}
              eventContent={(eventInfo) => {
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
                      {job.project?.buildingName && (
                        <div className="fc-event-title" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          {job.project.buildingName}
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '1px' }}>
                        {job.project?.strataPlanNumber || job.title}
                      </div>
                      {employeesForThisDay && employeesForThisDay.length > 0 && (
                        <div style={{ fontSize: '0.7rem', opacity: 1, whiteSpace: 'normal', lineHeight: 1.3, marginTop: '3px' }}>
                          {employeesForThisDay.map((assignment: any, idx: number) => (
                            <div key={idx} style={{ 
                              fontWeight: 700, 
                              backgroundColor: 'rgba(255,255,255,0.25)',
                              padding: '1px 4px',
                              borderRadius: '3px',
                              marginTop: '2px',
                              display: 'inline-block'
                            }}>
                              👤 {assignment.employee.name} {assignment.employee.role && `(${assignment.employee.role.replace(/_/g, ' ')})`}
                            </div>
                          ))}
                        </div>
                      )}
                      {isHighlighted && (
                        <div style={{ 
                          fontSize: '0.65rem', 
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
            className="rounded-lg shadow-premium p-4 md:p-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary) / 0.12) 0%, hsl(var(--brand-secondary-hsl, var(--chart-2)) / 0.06) 50%, hsl(var(--card)) 100%)`
            }}
          >
            {/* Multi-color decorative gradient overlays */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse at top right, hsl(var(--primary) / 0.15), transparent 50%),
                  radial-gradient(ellipse at bottom left, hsl(var(--brand-secondary-hsl, var(--chart-2)) / 0.10), transparent 40%),
                  radial-gradient(ellipse at top left, hsl(var(--brand-tertiary-hsl, var(--chart-3)) / 0.08), transparent 35%)
                `
              }}
            />
            {/* Week Navigation Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setWeekOffset(prev => prev - 1)}
                data-testid="button-prev-week"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold" data-testid="text-week-range">
                  {formatWeekRange}
                </h3>
                {weekOffset !== 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setWeekOffset(0)}
                    data-testid="button-today"
                  >
                    Today
                  </Button>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setWeekOffset(prev => prev + 1)}
                data-testid="button-next-week"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-8 gap-1 mb-2 relative z-10">
              <div className="font-medium text-sm text-muted-foreground px-2">Team</div>
              {getWeekDates.map((date, idx) => (
                <div 
                  key={idx}
                  className={`text-center py-2 rounded-md ${
                    isToday(date) 
                      ? 'bg-primary text-primary-foreground font-semibold' 
                      : 'bg-muted font-medium'
                  }`}
                >
                  <div className="text-xs uppercase">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-lg">
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Employee Rows */}
            <div className="space-y-2 relative z-10">
              {employees.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No team members found</p>
                </div>
              ) : (
                employees.map((employee) => (
                  <div 
                    key={employee.id}
                    className="grid grid-cols-8 gap-1 items-stretch"
                    data-testid={`employee-row-${employee.id}`}
                  >
                    {/* Employee Name */}
                    <div className="flex items-center gap-2 px-2 py-3 bg-muted/50 rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs font-medium">
                          {employee.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{employee.name}</div>
                        {employee.role && (
                          <div className="text-xs text-muted-foreground truncate">
                            {employee.role.replace(/_/g, ' ')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Day Cells */}
                    {getWeekDates.map((date, dayIdx) => {
                      const dayJobs = getEmployeeJobsForDay(employee.id, date);
                      const hasJobs = dayJobs.length > 0;
                      
                      return (
                        <div 
                          key={dayIdx}
                          className={`min-h-[60px] rounded-md p-1 ${
                            isToday(date) 
                              ? 'bg-primary/5 border border-primary/20' 
                              : 'bg-muted/30 border border-transparent'
                          }`}
                        >
                          {hasJobs ? (
                            <div className="space-y-1">
                              {dayJobs.slice(0, 2).map((job) => (
                                <Tooltip key={job.id}>
                                  <TooltipTrigger asChild>
                                    <div 
                                      className="px-2 py-1.5 rounded text-xs font-medium text-white truncate cursor-pointer hover-elevate"
                                      style={{ backgroundColor: job.color || '#3b82f6' }}
                                      onClick={() => {
                                        setSelectedJob(job);
                                        setDetailDialogOpen(true);
                                      }}
                                      data-testid={`job-block-${job.id}-${dayIdx}`}
                                    >
                                      {job.project?.buildingName || job.title}
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
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                              {dayJobs.length > 2 && (
                                <div className="text-xs text-muted-foreground text-center">
                                  +{dayJobs.length - 2} more
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground/30">
                              <span className="text-xs">-</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t relative z-10">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary"></div>
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Click on a job to view details</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

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
      />

      {/* Edit Job Dialog */}
      <EditJobDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        job={selectedJob}
        employees={employees}
      />

      {/* Shared Assignment Dialog (used by drag-drop and job detail button) */}
      {jobForAssignment && selectedEmployeeForAssignment && (
        <Sheet open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Assign Employee to Job</SheetTitle>
              <SheetDescription>
                Specify the date range when {selectedEmployeeForAssignment.name} will work on this job
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-4 mt-6">
              <div>
                <Label htmlFor="assign-start-date">Start Date</Label>
                <Input
                  id="assign-start-date"
                  type="date"
                  value={assignmentDates.startDate}
                  onChange={(e) => setAssignmentDates({ ...assignmentDates, startDate: e.target.value })}
                  data-testid="input-assignment-start-date"
                />
              </div>
              <div>
                <Label htmlFor="assign-end-date">End Date</Label>
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
                Cancel
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
                {assignEmployeeMutation.isPending ? "Assigning..." : "Assign Employee"}
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
          <p className="text-sm font-bold text-primary">Drop to unassign from all jobs</p>
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
  const { toast } = useToast();
  
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
    color: "#3b82f6",
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
        title: "Job created",
        description: "Job has been added to the schedule",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      if (error.conflicts) {
        toast({
          title: "Schedule conflict",
          description: `${error.conflicts[0].employeeName} is already assigned to "${error.conflicts[0].conflictingJob}"`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create job",
          variant: "destructive",
        });
      }
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
      color: "#3b82f6",
      employeeIds: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    const result = await createJobMutation.mutateAsync({
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
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Schedule a new job and assign team members
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Select Project (Optional)</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) => setFormData({ ...formData, projectId: value })}
            >
              <SelectTrigger data-testid="select-project">
                <SelectValue placeholder="Choose a project or leave blank for custom job" />
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
            <Label htmlFor="title">Job Title {!formData.projectId && '*'}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Window Cleaning - North Tower"
              required={!formData.projectId}
              disabled={!!formData.projectId}
              data-testid="input-job-title"
            />
            {formData.projectId && (
              <p className="text-xs text-muted-foreground">Project name will be used automatically</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
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
              <Label htmlFor="endDate">End Date *</Label>
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
            <Label htmlFor="jobType">Job Type *</Label>
            <Select
              value={formData.jobType}
              onValueChange={(value) => setFormData({ ...formData, jobType: value })}
            >
              <SelectTrigger data-testid="select-job-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="window_cleaning">Window Cleaning</SelectItem>
                <SelectItem value="dryer_vent_cleaning">Dryer Vent Cleaning</SelectItem>
                <SelectItem value="building_wash">Building Wash - Pressure washing</SelectItem>
                <SelectItem value="in_suite">In-Suite Service</SelectItem>
                <SelectItem value="parkade">Parkade Cleaning</SelectItem>
                <SelectItem value="ground_window">Ground Window Cleaning</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.jobType === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customJobType">Custom Job Type *</Label>
              <Input
                id="customJobType"
                value={formData.customJobType}
                onChange={(e) => setFormData({ ...formData, customJobType: e.target.value })}
                placeholder="e.g., Gutter Cleaning, Sidewalk Repair"
                required
                data-testid="input-custom-job-type"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Job site address"
              data-testid="input-location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Calendar Color</Label>
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
            <Label htmlFor="estimatedHours">Estimated Hours</Label>
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Job details..."
              rows={3}
              data-testid="input-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={2}
              data-testid="input-notes"
            />
          </div>

          {/* Employee Assignment */}
          <div className="space-y-2">
            <Label>Assign Team Members</Label>
            <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
              {employees.length === 0 ? (
                <p className="text-sm text-muted-foreground">No employees available</p>
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
                {formData.employeeIds.length} team member(s) selected
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createJobMutation.isPending}
              data-testid="button-submit-job"
            >
              {createJobMutation.isPending ? "Creating..." : "Create Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: ScheduledJobWithAssignments | null;
  onEdit: () => void;
  employees: User[];
}) {
  const { toast } = useToast();
  const [showAssignEmployees, setShowAssignEmployees] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [assignmentDates, setAssignmentDates] = useState<{ startDate: string; endDate: string }>({
    startDate: "",
    endDate: "",
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      await apiRequest("DELETE", `/api/schedule/${jobId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: "Job deleted",
        description: "Job has been removed from the schedule",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    },
  });

  const assignEmployeeMutation = useMutation({
    mutationFn: async ({ jobId, employeeId, startDate, endDate }: { 
      jobId: string; 
      employeeId: string; 
      startDate?: string; 
      endDate?: string; 
    }) => {
      console.log("assignEmployeeMutation executing with:", { jobId, employeeId, startDate, endDate });
      const result = await apiRequest("POST", `/api/schedule/${jobId}/assign-employee`, { 
        employeeId, 
        startDate, 
        endDate 
      });
      console.log("assignEmployeeMutation result:", result);
      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: "Employee assigned",
        description: "Team member has been assigned to this job",
      });
      setAssignDialogOpen(false);
      setSelectedEmployee(null);
      setShowAssignEmployees(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign employee",
        variant: "destructive",
      });
    },
  });

  const unassignEmployeeMutation = useMutation({
    mutationFn: async ({ jobId, assignmentId }: { jobId: string; assignmentId: string }) => {
      await apiRequest("DELETE", `/api/schedule/${jobId}/assignments/${assignmentId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: "Employee unassigned",
        description: "Team member has been removed from this job",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unassign employee",
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
    // Set default dates to job's date range
    const startDate = new Date(job.startDate).toISOString().slice(0, 10);
    const endDate = new Date(job.endDate).toISOString().slice(0, 10);
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
              <h3 className="font-medium text-sm mb-1">Description</h3>
              <p className="text-sm text-muted-foreground">{job.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm mb-1">Start Date</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(job.startDate).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">End Date</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(job.endDate).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Assigned Team Members</h3>
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
                {showAssignEmployees ? "Cancel" : "Manage/assign employee to job"}
              </Button>
            </div>
            
            {showAssignEmployees ? (
              <div className="space-y-3">
                <div className="border rounded-md p-4 max-h-64 overflow-y-auto">
                  {(() => {
                    if (employees.length === 0) {
                      return <p className="text-sm text-muted-foreground">No employees available</p>;
                    }
                    
                    const unassignedEmployees = employees.filter(emp => {
                      const isAssigned = job.employeeAssignments?.some(assignment => assignment.employee.id === emp.id) ||
                                        job.assignedEmployees?.some(assigned => assigned.id === emp.id);
                      return !isAssigned;
                    });
                    
                    if (unassignedEmployees.length === 0) {
                      return <p className="text-sm text-muted-foreground">All employees are already assigned to this job</p>;
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
                                {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                              </>
                            ) : (
                              <span>Entire job duration</span>
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
                                ? new Date(assignment.startDate).toISOString().slice(0, 10)
                                : new Date(job.startDate).toISOString().slice(0, 10);
                              const endDate = assignment.endDate
                                ? new Date(assignment.endDate).toISOString().slice(0, 10)
                                : new Date(job.endDate).toISOString().slice(0, 10);
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
                    No team members assigned yet
                  </p>
                )}
              </>
            )}
          </div>

          {job.location && (
            <div>
              <h3 className="font-medium text-sm mb-1">Location</h3>
              <p className="text-sm text-muted-foreground">{job.location}</p>
            </div>
          )}

          {job.estimatedHours && (
            <div>
              <h3 className="font-medium text-sm mb-1">Estimated Hours</h3>
              <p className="text-sm text-muted-foreground">{job.estimatedHours} hours</p>
            </div>
          )}

          {job.notes && (
            <div>
              <h3 className="font-medium text-sm mb-1">Notes</h3>
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
            Delete
          </Button>
          <Button
            onClick={onEdit}
            data-testid="button-edit-job"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Job?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{job?.title}"? This action cannot be undone and will remove all assignments for this job.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (job) {
                deleteJobMutation.mutate(job.id);
                setShowDeleteConfirm(false);
              }
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Job
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {job && (
      <Sheet open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Assign Employee to Job</SheetTitle>
            <SheetDescription>
              Specify the date range when {selectedEmployee?.name} will work on this job
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 mt-6">
            <div>
              <Label htmlFor="assign-start-date">Start Date</Label>
              <Input
                id="assign-start-date"
                type="date"
                value={assignmentDates.startDate}
                onChange={(e) => setAssignmentDates({ ...assignmentDates, startDate: e.target.value })}
                min={new Date(job.startDate).toISOString().slice(0, 10)}
                max={new Date(job.endDate).toISOString().slice(0, 10)}
                data-testid="input-assignment-start-date"
              />
            </div>
            <div>
              <Label htmlFor="assign-end-date">End Date</Label>
              <Input
                id="assign-end-date"
                type="date"
                value={assignmentDates.endDate}
                onChange={(e) => setAssignmentDates({ ...assignmentDates, endDate: e.target.value })}
                min={assignmentDates.startDate || new Date(job.startDate).toISOString().slice(0, 10)}
                max={new Date(job.endDate).toISOString().slice(0, 10)}
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
              Cancel
            </Button>
            <Button
              onClick={handleSaveAssignment}
              disabled={assignEmployeeMutation.isPending}
              data-testid="button-save-assignment"
            >
              {assignEmployeeMutation.isPending ? "Assigning..." : "Assign Employee"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )}
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
  const { toast } = useToast();
  
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
    color: "#3b82f6",
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
        color: job.color || "#3b82f6",
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
        title: "Job updated",
        description: "Job details have been saved",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update job",
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
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-project">Select Project (Optional)</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) => setFormData({ ...formData, projectId: value })}
            >
              <SelectTrigger data-testid="select-edit-project">
                <SelectValue placeholder="Choose a project or leave blank for custom job" />
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
            <Label htmlFor="edit-title">Job Title {!formData.projectId && '*'}</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required={!formData.projectId}
              disabled={!!formData.projectId}
              data-testid="input-edit-title"
            />
            {formData.projectId && (
              <p className="text-xs text-muted-foreground">Project name will be used automatically</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Start Date *</Label>
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
              <Label htmlFor="edit-endDate">End Date *</Label>
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
            <Label htmlFor="edit-status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger data-testid="select-edit-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-jobType">Job Type *</Label>
            <Select
              value={formData.jobType}
              onValueChange={(value) => setFormData({ ...formData, jobType: value })}
            >
              <SelectTrigger data-testid="select-edit-job-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="window_cleaning">Window Cleaning</SelectItem>
                <SelectItem value="dryer_vent_cleaning">Dryer Vent Cleaning</SelectItem>
                <SelectItem value="building_wash">Building Wash - Pressure washing</SelectItem>
                <SelectItem value="in_suite">In-Suite Service</SelectItem>
                <SelectItem value="parkade">Parkade Cleaning</SelectItem>
                <SelectItem value="ground_window">Ground Window Cleaning</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.jobType === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="edit-customJobType">Custom Job Type *</Label>
              <Input
                id="edit-customJobType"
                value={formData.customJobType}
                onChange={(e) => setFormData({ ...formData, customJobType: e.target.value })}
                placeholder="e.g., Gutter Cleaning, Sidewalk Repair"
                required
                data-testid="input-edit-custom-job-type"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-location">Location</Label>
            <Input
              id="edit-location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              data-testid="input-edit-location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-color">Calendar Color</Label>
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
            <Label htmlFor="edit-estimatedHours">Estimated Hours</Label>
            <Input
              id="edit-estimatedHours"
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
              data-testid="input-edit-estimated-hours"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              data-testid="input-edit-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
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
            <Label>Assigned Team Members</Label>
            <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
              {employees.length === 0 ? (
                <p className="text-sm text-muted-foreground">No employees available</p>
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
                {formData.employeeIds.length} team member(s) selected
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateJobMutation.isPending}
              data-testid="button-update-job"
            >
              {updateJobMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
