import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventInput } from "@fullcalendar/core";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BackButton } from "@/components/BackButton";
import { User, ScheduledJobWithAssignments } from "@shared/schema";
import { toLocalDateString, nextDateOnly } from "@/lib/dateUtils";
import { useContext } from "react";
import { BrandingContext } from "@/App";

export function TechnicianSchedule() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const { brandColors, brandingActive } = useContext(BrandingContext);
  const defaultJobColor = brandingActive && brandColors.length > 0 ? brandColors[0] : "hsl(var(--primary))";

  const calendarLocale = i18n.language === 'fr' ? 'fr' : 'en';

  const { data: currentUserData, isLoading: isLoadingUser } = useQuery<{ user: User }>({
    queryKey: ["/api/user"],
  });
  const currentUser = currentUserData?.user;

  const { data: jobsData, isLoading } = useQuery<{ jobs: ScheduledJobWithAssignments[] }>({
    queryKey: ["/api/schedule/my-jobs"],
    enabled: !!currentUser,
  });
  const jobs = jobsData?.jobs || [];

  if (isLoadingUser || isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <BackButton to="/dashboard" label={t('schedule.backToDashboard', 'Back to Dashboard')} />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const myAssignments = jobs.filter(job => 
    job.assignedEmployees?.some(e => e.id === currentUser.id)
  );

  const myEvents: EventInput[] = myAssignments.flatMap(job => {
    const assignment = job.employeeAssignments?.find(a => a.employee?.id === currentUser.id);
    if (assignment && assignment.startDate && assignment.endDate) {
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
    return [{
      id: job.id,
      title: job.project?.buildingName || job.title,
      start: String(job.startDate).split('T')[0],
      end: nextDateOnly(String(job.endDate).split('T')[0]),
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
      <BackButton to="/dashboard" label={t('schedule.backToDashboard', 'Back to Dashboard')} />

      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{t('schedule.mySchedule', 'My Schedule')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('schedule.myScheduleSubtitle', 'View your upcoming job assignments')}
          </p>
        </div>
      </div>

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
              plugins={[dayGridPlugin, timeGridPlugin]}
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
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
