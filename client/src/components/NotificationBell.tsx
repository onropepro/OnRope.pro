import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { formatTimestampDateShort } from "@/lib/dateUtils";

export function NotificationBell() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: countData } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/unread-count"],
    refetchInterval: 30000,
  });

  const { data: notificationsData, isLoading } = useQuery<{ notifications: any[] }>({
    queryKey: ["/api/notifications"],
    enabled: isOpen,
  });

  const markReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return apiRequest("PATCH", `/api/notifications/${notificationId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", "/api/notifications/read-all", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const unreadCount = countData?.count || 0;
  const notifications = notificationsData?.notifications || [];

  const getNotificationMessage = (notification: any) => {
    if (notification.type === "job_offer_refused") {
      const payload = notification.payload as any;
      return t('notifications.jobOfferRefused', '{{name}} declined your offer for {{job}}', {
        name: payload?.technicianName || 'A technician',
        job: payload?.jobTitle || 'a position',
      });
    }
    return t('notifications.genericNotification', 'New notification');
  };

  const getNotificationIcon = (type: string) => {
    if (type === "job_offer_refused") return "person_off";
    return "notifications";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          data-testid="button-notifications"
        >
          <span className="material-icons text-xl sm:text-2xl">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-semibold">{t('notifications.title', 'Notifications')}</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              data-testid="button-mark-all-read"
            >
              {t('notifications.markAllRead', 'Mark all read')}
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              {t('common.loading', 'Loading...')}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <span className="material-icons text-4xl text-muted-foreground mb-2">notifications_none</span>
              <p className="text-muted-foreground text-sm">
                {t('notifications.noNotifications', 'No notifications')}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className={`p-3 hover-elevate cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
                  onClick={() => {
                    if (!notification.isRead) {
                      markReadMutation.mutate(notification.id);
                    }
                  }}
                  data-testid={`notification-${notification.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${!notification.isRead ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                      <span className="material-icons text-sm">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? 'font-medium' : 'text-muted-foreground'}`}>
                        {getNotificationMessage(notification)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.createdAt && formatTimestampDateShort(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
