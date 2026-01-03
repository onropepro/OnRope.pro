import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PlatformNotificationRecipient {
  id: string;
  notificationId: string;
  userId: string;
  openedAt: string | null;
  deletedByRecipient: boolean;
  createdAt: string;
  notification: {
    id: string;
    title: string;
    message: string;
    targetType: string;
    createdAt: string;
  };
}

export function PlatformNotificationBell() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<PlatformNotificationRecipient | null>(null);

  const { data: unreadCountData, refetch: refetchUnreadCount } = useQuery<{ count: number }>({
    queryKey: ["/api/platform-notifications/unread-count"],
    refetchInterval: 60000,
  });

  const { data: notificationsData, isLoading, refetch: refetchNotifications } = useQuery<{ notifications: PlatformNotificationRecipient[] }>({
    queryKey: ["/api/platform-notifications"],
    enabled: popoverOpen,
  });

  const unreadCount = unreadCountData?.count || 0;
  const notifications = notificationsData?.notifications || [];

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return apiRequest('PATCH', `/api/platform-notifications/${notificationId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/platform-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/platform-notifications/unread-count"] });
      refetchUnreadCount();
      refetchNotifications();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return apiRequest('DELETE', `/api/platform-notifications/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/platform-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/platform-notifications/unread-count"] });
      toast({
        title: t('notifications.removed', 'Notification removed'),
        description: t('notifications.removedDescription', 'The notification has been removed from your list'),
      });
      refetchUnreadCount();
      refetchNotifications();
      if (detailDialogOpen) {
        setDetailDialogOpen(false);
        setSelectedNotification(null);
      }
    },
    onError: () => {
      toast({
        title: t('common.error', 'Error'),
        description: t('notifications.removeError', 'Failed to remove notification'),
        variant: "destructive",
      });
    },
  });

  const handleNotificationClick = (notification: PlatformNotificationRecipient) => {
    setSelectedNotification(notification);
    setDetailDialogOpen(true);
    setPopoverOpen(false);
    
    if (!notification.openedAt) {
      markAsReadMutation.mutate(notification.notificationId);
    }
  };

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    deleteMutation.mutate(notificationId);
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            data-testid="button-platform-notification-bell"
          >
            <span className="material-icons text-xl sm:text-2xl">campaign</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-3 border-b">
            <h4 className="font-semibold">{t('notifications.platformAnnouncements', 'Announcements')}</h4>
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">{unreadCount} {t('notifications.unread', 'unread')}</span>
            )}
          </div>
          <ScrollArea className="h-[300px]">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                {t('common.loading', 'Loading...')}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <span className="material-icons text-4xl text-muted-foreground mb-2">campaign</span>
                <p className="text-muted-foreground text-sm">
                  {t('notifications.noAnnouncements', 'No announcements')}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 cursor-pointer hover-elevate group ${!notification.openedAt ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                    data-testid={`platform-notification-${notification.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${!notification.openedAt ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                        <span className="material-icons text-sm">campaign</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm truncate ${!notification.openedAt ? 'font-medium' : 'text-muted-foreground'}`}>
                            {notification.notification.title}
                          </p>
                          {!notification.openedAt && (
                            <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(notification.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => handleDelete(e, notification.notificationId)}
                        data-testid={`button-delete-platform-notification-${notification.id}`}
                      >
                        <span className="material-icons text-sm">close</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-blue-500">campaign</span>
              {selectedNotification?.notification.title}
            </DialogTitle>
            <DialogDescription>
              {selectedNotification && format(new Date(selectedNotification.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="whitespace-pre-wrap text-sm">{selectedNotification?.notification.message}</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                if (selectedNotification) {
                  deleteMutation.mutate(selectedNotification.notificationId);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              <span className="material-icons text-sm mr-2">delete</span>
              {t('common.remove', 'Remove')}
            </Button>
            <Button onClick={() => setDetailDialogOpen(false)}>
              {t('common.close', 'Close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
