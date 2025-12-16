import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BackButton } from "@/components/BackButton";
import { User } from "@shared/schema";
import { canViewSchedule, canViewFullSchedule, canViewOwnSchedule } from "@/lib/permissions";
import { TechnicianSchedule } from "@/components/TechnicianSchedule";
import Schedule from "./Schedule";

export default function ScheduleRouter() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const { data: currentUserData, isLoading: isLoadingUser } = useQuery<{ user: User }>({
    queryKey: ["/api/user"],
  });
  const currentUser = currentUserData?.user;

  const hasSchedulePermission = canViewSchedule(currentUser);
  const hasFullScheduleAccess = canViewFullSchedule(currentUser);
  const hasOwnScheduleOnly = canViewOwnSchedule(currentUser) && !hasFullScheduleAccess;

  if (isLoadingUser) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <BackButton to="/dashboard" label={t('schedule.backToDashboard', 'Back to Dashboard')} />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (currentUser && !hasSchedulePermission) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <BackButton to="/dashboard" label={t('schedule.backToDashboard', 'Back to Dashboard')} />

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

  if (hasOwnScheduleOnly) {
    return <TechnicianSchedule />;
  }

  return <Schedule />;
}
