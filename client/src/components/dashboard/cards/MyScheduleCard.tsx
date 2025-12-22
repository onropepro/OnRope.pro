import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronRight, MapPin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { CardProps } from "../cardRegistry";

interface MyScheduleItem {
  id: string;
  date: string;
  startTime: string;
  projectName: string;
  location: string;
}

export function MyScheduleCard({ currentUser, onRouteNavigate, branding }: CardProps) {
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data: scheduleData, isLoading } = useQuery<{ jobs: MyScheduleItem[] }>({
    queryKey: ["/api/my-schedule"],
  });

  if (isLoading) {
    return (
      <>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarDays className="w-5 h-5" style={{ color: accentColor }} />
            My Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-muted rounded" />
            <div className="h-16 bg-muted rounded" />
          </div>
        </CardContent>
      </>
    );
  }

  const jobs = scheduleData?.jobs || [];
  const upcomingJobs = jobs.slice(0, 3);

  return (
    <>
      <CardHeader className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarDays className="w-5 h-5" style={{ color: accentColor }} />
            My Schedule
          </CardTitle>
          <Badge variant="secondary" className="text-xs" data-testid="badge-my-jobs-count">
            {jobs.length} upcoming
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {upcomingJobs.length === 0 ? (
          <p className="text-base text-muted-foreground text-center py-4">
            No upcoming jobs scheduled
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingJobs.map((job) => (
              <div 
                key={job.id}
                className="p-3 rounded-lg bg-muted/50"
                data-testid={`my-schedule-item-${job.id}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-base font-medium truncate">{job.projectName}</p>
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {format(new Date(job.date), "MMM d")}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{job.startTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{job.location}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => onRouteNavigate("/schedule")}
              data-testid="button-view-my-schedule"
            >
              View Full Schedule
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
}
