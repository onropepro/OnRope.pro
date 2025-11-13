import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus, Edit2, Trash2, Users, ArrowLeft, UserCheck, UserX } from "lucide-react";
import type { ScheduledJobWithAssignments, User } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Schedule() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ScheduledJobWithAssignments | null>(null);
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date } | null>(null);

  // Fetch current user
  const { data: currentUserData } = useQuery({
    queryKey: ["/api/user"],
  });
  const currentUser = currentUserData as User | undefined;

  // Fetch scheduled jobs
  const { data: jobsData, isLoading } = useQuery<{ jobs: ScheduledJobWithAssignments[] }>({
    queryKey: ["/api/schedule"],
  });
  const jobs = jobsData?.jobs || [];

  // Fetch employees for assignment
  const { data: employeesData } = useQuery<{ employees: User[] }>({
    queryKey: ["/api/employees"],
  });
  const employees = employeesData?.employees || [];

  // Transform jobs into FullCalendar events
  // Create separate event blocks for each day in multi-day jobs
  const events: EventInput[] = jobs.flatMap((job) => {
    const color = job.color || "#3b82f6";
    const start = new Date(job.startDate);
    const end = new Date(job.endDate);
    
    // If same day, return single event
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    
    if (startDay.getTime() === endDay.getTime()) {
      let displayTitle = job.title;
      if (job.assignedEmployees && job.assignedEmployees.length > 0) {
        const employeeNames = job.assignedEmployees.map(e => e.name).join(", ");
        displayTitle = `${job.title}\n👥 ${employeeNames}`;
      }
      
      return [{
        id: job.id,
        title: displayTitle,
        start: job.startDate,
        end: job.endDate,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          job,
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
      
      let displayTitle = job.title;
      if (job.assignedEmployees && job.assignedEmployees.length > 0) {
        const employeeNames = job.assignedEmployees.map(e => e.name).join(", ");
        displayTitle = `${job.title}\n👥 ${employeeNames}`;
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

  // Handle event click for viewing details
  const handleEventClick = (clickInfo: EventClickArg) => {
    const job = clickInfo.event.extendedProps.job as ScheduledJobWithAssignments;
    setSelectedJob(job);
    setDetailDialogOpen(true);
  };

  // Get assigned employee IDs from jobs
  const assignedEmployeeIds = new Set(
    jobs.flatMap(job => job.assignedEmployees?.map(e => e.id) || [])
  );

  const assignedEmployees = employees.filter(e => assignedEmployeeIds.has(e.id));
  const availableEmployees = employees.filter(e => !assignedEmployeeIds.has(e.id));

  return (
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Job Schedule</h1>
            <p className="text-sm text-muted-foreground">
              Manage your team's job assignments and schedule
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedDates(null);
            setCreateDialogOpen(true);
          }}
          data-testid="button-create-job"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Job
        </Button>
      </div>

      {/* Employee Availability */}
      <Card className="border-2 border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg">
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
                    return (
                      <div key={employee.id} className="p-1.5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded">
                        <div className="font-bold text-foreground truncate text-xs">{employee.name}</div>
                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                          {employeeJobs.map(job => (
                            <Badge key={job.id} variant="default" className="text-[9px] h-4 px-1.5 py-0 bg-green-600 hover:bg-green-700">
                              {job.project?.buildingName || job.title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Available Employees */}
            <div className="bg-card rounded p-1.5 border-l-4 border-l-blue-600 shadow-sm">
              <div className="flex items-center gap-1 mb-1">
                <UserX className="w-3.5 h-3.5 text-blue-600" />
                <h3 className="font-bold text-xs text-blue-700">Available ({availableEmployees.length})</h3>
              </div>
              {availableEmployees.length === 0 ? (
                <p className="text-xs text-muted-foreground">All employees assigned</p>
              ) : (
                <div className="space-y-0.5 max-h-24 overflow-y-auto pr-1">
                  {availableEmployees.map(employee => (
                    <div key={employee.id} className="p-1.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded">
                      <div className="font-bold text-foreground truncate text-xs">{employee.name}</div>
                      <Badge variant="default" className="mt-0.5 text-[9px] h-4 px-1.5 py-0 bg-blue-600 hover:bg-blue-700">
                        Ready
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <div className="bg-card rounded-lg shadow-premium p-6">
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
                right: "dayGridWeek,dayGridMonth",
              }}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={3}
              weekends={true}
              events={events}
              select={handleDateSelect}
              eventClick={handleEventClick}
              height="700px"
              displayEventTime={false}
              displayEventEnd={false}
              eventDisplay="block"
              data-testid="calendar"
              eventContent={(eventInfo) => {
                const job = eventInfo.event.extendedProps.job as ScheduledJobWithAssignments;
                
                return (
                  <div className="fc-event-main-frame" style={{ padding: '2px 4px', overflow: 'hidden' }}>
                    <div className="fc-event-title-container">
                      {job.project?.buildingName && (
                        <div className="fc-event-title" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          {job.project.buildingName}
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '1px' }}>
                        {job.project?.strataPlanNumber || job.title}
                      </div>
                      {job.assignedEmployees && job.assignedEmployees.length > 0 && (
                        <div style={{ fontSize: '0.7rem', opacity: 1, whiteSpace: 'normal', lineHeight: 1.3, marginTop: '3px' }}>
                          {job.assignedEmployees.map((employee, idx) => (
                            <div key={idx} style={{ 
                              fontWeight: 700, 
                              backgroundColor: 'rgba(255,255,255,0.25)',
                              padding: '1px 4px',
                              borderRadius: '3px',
                              marginTop: '2px',
                              display: 'inline-block'
                            }}>
                              👤 {employee.name}
                            </div>
                          ))}
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
  const [formData, setFormData] = useState({
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
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Window Cleaning - North Tower"
              required
              data-testid="input-job-title"
            />
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
                <SelectItem value="pressure_washing">Pressure Washing</SelectItem>
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
                      className="rounded border-gray-300"
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
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const assignEmployeesMutation = useMutation({
    mutationFn: async ({ jobId, employeeIds }: { jobId: string; employeeIds: string[] }) => {
      await apiRequest("PUT", `/api/schedule/${jobId}`, { employeeIds });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      await queryClient.refetchQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: "Employees assigned",
        description: "Team members have been assigned to this job",
      });
      setShowAssignEmployees(false);
    },
    onError: (error: Error) => {
      console.error("Assignment error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign employees",
        variant: "destructive",
      });
    },
  });

  // Initialize selected employees when job changes
  useEffect(() => {
    if (job) {
      setSelectedEmployeeIds(job.assignedEmployees?.map(e => e.id) || []);
    }
  }, [job]);

  if (!job) return null;

  const statusColors: Record<string, string> = {
    upcoming: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    in_progress: "bg-green-500/10 text-green-600 border-green-500/20",
    completed: "bg-gray-500/10 text-gray-600 border-gray-500/20",
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
                onClick={() => setShowAssignEmployees(!showAssignEmployees)}
                data-testid="button-assign-employees"
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                {showAssignEmployees ? "Cancel" : "Manage/assign employee to job"}
              </Button>
            </div>
            
            {showAssignEmployees ? (
              <div className="space-y-3">
                <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
                  {employees.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No employees available</p>
                  ) : (
                    employees.map((employee) => (
                      <div key={employee.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`detail-employee-${employee.id}`}
                          checked={selectedEmployeeIds.includes(employee.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEmployeeIds([...selectedEmployeeIds, employee.id]);
                            } else {
                              setSelectedEmployeeIds(selectedEmployeeIds.filter(id => id !== employee.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <label
                          htmlFor={`detail-employee-${employee.id}`}
                          className="text-sm flex-1 cursor-pointer"
                        >
                          {employee.name} {employee.role && `(${employee.role.replace(/_/g, ' ')})`}
                        </label>
                      </div>
                    ))
                  )}
                </div>
                <Button
                  onClick={() => assignEmployeesMutation.mutate({ jobId: job.id, employeeIds: selectedEmployeeIds })}
                  disabled={assignEmployeesMutation.isPending}
                  className="w-full"
                  data-testid="button-save-assignments"
                >
                  {assignEmployeesMutation.isPending ? "Saving..." : "Save Assignments"}
                </Button>
              </div>
            ) : (
              <>
                {job.assignedEmployees && job.assignedEmployees.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.assignedEmployees.map((employee) => (
                      <Badge key={employee.id} variant="secondary">
                        <Users className="w-3 h-3 mr-1" />
                        {employee.name}
                      </Badge>
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
  const [formData, setFormData] = useState({
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
            <Label htmlFor="edit-title">Job Title *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              data-testid="input-edit-title"
            />
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
                <SelectItem value="pressure_washing">Pressure Washing</SelectItem>
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
                      className="rounded border-gray-300"
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
