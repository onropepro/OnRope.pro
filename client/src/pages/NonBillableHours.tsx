import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "@/lib/dateUtils";
import { useSetHeaderConfig } from "@/components/DashboardLayout";

export default function NonBillableHours() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  
  // Get current user
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });
  
  const user = userData?.user;

  // Get active non-billable session
  const { data: activeSessionData } = useQuery<{ session: any }>({
    queryKey: ["/api/non-billable-sessions/active"],
    enabled: !!user,
  });

  const activeSession = activeSessionData?.session;

  // Back navigation handler
  const handleBackClick = useCallback(() => {
    setLocation("/dashboard");
  }, [setLocation]);

  // Configure header through DashboardLayout
  useSetHeaderConfig({
    pageTitle: t('nonBillable.title', 'Non-Billable Hours'),
    pageDescription: t('nonBillable.subtitle', 'Track errands, training, and other non-project work'),
    onBackClick: handleBackClick,
    showSearch: false,
  }, [t, handleBackClick]);

  // Start new non-billable work session
  const startSessionMutation = useMutation({
    mutationFn: async (description: string) => {
      // Get local date in YYYY-MM-DD format (user's timezone)
      const localDate = new Date();
      const localDateString = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
      
      return apiRequest("POST", "/api/non-billable-sessions", {
        description,
        workDate: localDateString, // Send client's local date
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/non-billable-sessions/active"] });
      setDescription("");
      toast({
        title: t('nonBillable.sessionStarted', 'Non-billable session started'),
        description: t('nonBillable.sessionStartedDesc', 'Your non-billable work session has been started'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // End non-billable work session
  const endSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return apiRequest("PATCH", `/api/non-billable-sessions/${sessionId}/end`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/non-billable-sessions/active"] });
      toast({
        title: t('nonBillable.sessionEnded', 'Session ended'),
        description: t('nonBillable.sessionEndedDesc', 'Your non-billable work session has been ended'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartSession = () => {
    if (!description.trim()) {
      toast({
        title: t('common.error', 'Error'),
        description: t('nonBillable.describeWork', "Please describe what you're working on"),
        variant: "destructive",
      });
      return;
    }
    
    startSessionMutation.mutate(description);
  };

  const handleEndSession = () => {
    if (activeSession) {
      endSessionMutation.mutate(activeSession.id);
    }
  };

  // Calculate duration for active session
  const getSessionDuration = () => {
    if (!activeSession?.startTime) return "0h 0m";
    
    const start = new Date(activeSession.startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Active Session Card */}
      {activeSession ? (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons text-primary animate-pulse">schedule</span>
                  {t('nonBillable.activeSession', 'Active Session')}
                </CardTitle>
                <CardDescription className="mt-2">
                  {activeSession.description}
                </CardDescription>
              </div>
              <Badge variant="default">
                {getSessionDuration()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="material-icons text-base">today</span>
                <span>{t('nonBillable.started', 'Started')}: {formatDateTime(activeSession.startTime)}</span>
              </div>
              
              <Button
                onClick={handleEndSession}
                disabled={endSessionMutation.isPending}
                className="w-full"
                variant="destructive"
                data-testid="button-end-session"
              >
                <span className="material-icons mr-2">stop_circle</span>
                {endSessionMutation.isPending ? t('nonBillable.ending', 'Ending...') : t('nonBillable.endSession', 'End Session')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">add_circle</span>
              {t('nonBillable.startNewSession', 'Start New Session')}
            </CardTitle>
            <CardDescription>
              {t('nonBillable.logDescription', 'Log non-billable work like errands, training, meetings, or administrative tasks')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">{t('nonBillable.whatWorking', 'What are you working on?')}</Label>
              <Textarea
                id="description"
                placeholder={t('nonBillable.placeholder', 'e.g., Picking up supplies, training, office work...')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
                data-testid="input-description"
                autoComplete="off"
              />
            </div>

            <Button
              onClick={handleStartSession}
              disabled={startSessionMutation.isPending || !description.trim()}
              className="w-full"
              data-testid="button-start-session"
            >
              <span className="material-icons mr-2">play_circle</span>
              {startSessionMutation.isPending ? t('nonBillable.starting', 'Starting...') : t('nonBillable.startSession', 'Start Session')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="material-icons text-primary mt-0.5">info</span>
              <div>
                <p className="font-medium mb-1">{t('nonBillable.aboutTitle', 'About Non-Billable Hours')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('nonBillable.aboutDescription', "These hours are included in payroll but don't count toward project performance analytics. Use this for any work that isn't directly tied to a specific project.")}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="material-icons text-primary mt-0.5">schedule</span>
              <div>
                <p className="font-medium mb-1">{t('nonBillable.timeTrackingTitle', 'Time Tracking')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('nonBillable.timeTrackingDescription', "Your session time is tracked automatically from start to finish. Remember to end your session when you're done.")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
