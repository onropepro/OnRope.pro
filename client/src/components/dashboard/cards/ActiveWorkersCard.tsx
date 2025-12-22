import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { canManageEmployees } from "@/lib/permissions";
import type { CardProps } from "../cardRegistry";

interface ActiveSession {
  employeeId: string;
  employeeName: string;
  projectName?: string;
  startTime: string;
  locationName?: string;
}

export function ActiveWorkersCard({ currentUser, branding }: CardProps) {
  const hasAccess = canManageEmployees(currentUser) || currentUser?.role === "company";
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data: sessionsData, isLoading } = useQuery<{ sessions: ActiveSession[] }>({
    queryKey: ["/api/active-work-sessions"],
    enabled: hasAccess,
    refetchInterval: 30000,
  });

  const activeSessions = sessionsData?.sessions || [];

  if (!hasAccess) {
    return (
      <>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: accentColor }} />
            Active Workers
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-base text-muted-foreground">No access</p>
        </CardContent>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: accentColor }} />
            Active Workers
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="animate-pulse space-y-2">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <CardHeader className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: accentColor }} />
            Active Workers
          </CardTitle>
          <Badge 
            variant="secondary" 
            className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            data-testid="badge-active-workers-count"
          >
            <Clock className="w-3 h-3 mr-1" />
            {activeSessions.length} clocked in
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {activeSessions.length === 0 ? (
          <p className="text-base text-muted-foreground">No workers currently clocked in</p>
        ) : (
          <div className="space-y-2">
            {activeSessions.slice(0, 5).map((session, idx) => (
              <div 
                key={session.employeeId || idx}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                data-testid={`active-worker-${session.employeeId}`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs" style={{ backgroundColor: accentColor, color: "white" }}>
                    {getInitials(session.employeeName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium truncate">{session.employeeName}</p>
                  {session.projectName && (
                    <p className="text-sm text-muted-foreground truncate">{session.projectName}</p>
                  )}
                </div>
              </div>
            ))}
            {activeSessions.length > 5 && (
              <p className="text-sm text-muted-foreground text-center pt-2">
                +{activeSessions.length - 5} more
              </p>
            )}
          </div>
        )}
      </CardContent>
    </>
  );
}
