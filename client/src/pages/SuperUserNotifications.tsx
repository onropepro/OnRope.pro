import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import SuperUserLayout from "@/components/SuperUserLayout";
import { BackButton } from "@/components/BackButton";
import { Bell, Send, Eye, Trash2, Edit, Users, Building2, Wrench, BarChart3 } from "lucide-react";

type TargetType = 'single_company' | 'selected_companies' | 'all_companies' | 'single_tech' | 'selected_techs' | 'all_techs';

interface PlatformNotification {
  id: string;
  title: string;
  message: string;
  targetType: TargetType;
  targetIds: string[] | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalRecipients: number;
    openedCount: number;
    openRate: number;
  };
}

interface Recipient {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  openedAt: string | null;
  deletedByRecipient: boolean;
}

interface Company {
  id: string;
  companyName: string;
  email: string;
}

interface Technician {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
}

const TARGET_TYPE_OPTIONS = [
  { value: 'all_companies', label: 'All Companies', icon: Building2 },
  { value: 'selected_companies', label: 'Selected Companies', icon: Building2 },
  { value: 'single_company', label: 'Single Company', icon: Building2 },
  { value: 'all_techs', label: 'All Technicians', icon: Wrench },
  { value: 'selected_techs', label: 'Selected Technicians', icon: Wrench },
  { value: 'single_tech', label: 'Single Technician', icon: Wrench },
];

export default function SuperUserNotifications() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<PlatformNotification | null>(null);
  const [analyticsRecipients, setAnalyticsRecipients] = useState<Recipient[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetType: "all_companies" as TargetType,
    targetIds: [] as string[],
  });

  const { data: notificationsData, isLoading: notificationsLoading, refetch } = useQuery<{ notifications: PlatformNotification[] }>({
    queryKey: ["/api/superuser/notifications"],
  });

  const { data: companiesData } = useQuery<{ companies: Company[] }>({
    queryKey: ["/api/superuser/companies"],
  });

  const { data: techniciansData } = useQuery<{ technicians: Technician[] }>({
    queryKey: ["/api/superuser/technicians"],
  });

  const notifications = notificationsData?.notifications || [];
  const companies = companiesData?.companies || [];
  const technicians = techniciansData?.technicians || [];

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest('POST', '/api/superuser/notifications', data);
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/notifications"] });
      toast({
        title: "Notification Sent",
        description: `Notification sent to ${result.recipientCount} recipient(s)`,
      });
      setCreateDialogOpen(false);
      setFormData({ title: "", message: "", targetType: "all_companies", targetIds: [] });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send notification",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/superuser/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/notifications"] });
      toast({
        title: "Notification Deleted",
        description: "The notification has been deleted",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    },
  });

  const viewAnalytics = async (notification: PlatformNotification) => {
    try {
      const response = await fetch(`/api/superuser/notifications/${notification.id}`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json() as { notification: PlatformNotification; stats: any; recipients: Recipient[] };
      setSelectedNotification({ ...notification, stats: data.stats });
      setAnalyticsRecipients(data.recipients);
      setAnalyticsDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (['single_company', 'selected_companies', 'single_tech', 'selected_techs'].includes(formData.targetType) && formData.targetIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one recipient",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(formData);
  };

  const toggleRecipientSelection = (id: string) => {
    setFormData(prev => ({
      ...prev,
      targetIds: prev.targetIds.includes(id)
        ? prev.targetIds.filter(i => i !== id)
        : [...prev.targetIds, id],
    }));
  };

  const getTargetTypeLabel = (type: TargetType) => {
    return TARGET_TYPE_OPTIONS.find(o => o.value === type)?.label || type;
  };

  const getTargetTypeIcon = (type: TargetType) => {
    const Icon = TARGET_TYPE_OPTIONS.find(o => o.value === type)?.icon || Users;
    return <Icon className="h-4 w-4" />;
  };

  const showRecipientSelector = ['single_company', 'selected_companies', 'single_tech', 'selected_techs'].includes(formData.targetType);
  const isCompanyTarget = formData.targetType.includes('company');
  const recipientList = isCompanyTarget ? companies : technicians;

  return (
    <SuperUserLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Bell className="h-6 w-6" />
                Platform Notifications
              </h1>
              <p className="text-muted-foreground">Send notifications to companies and technicians</p>
            </div>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-notification">
            <Send className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sent Notifications</CardTitle>
            <CardDescription>View and manage platform notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {notificationsLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications sent yet</p>
                <p className="text-sm">Click "Send Notification" to create your first broadcast</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id} data-testid={`row-notification-${notification.id}`}>
                      <TableCell className="font-medium">{notification.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          {getTargetTypeIcon(notification.targetType)}
                          {getTargetTypeLabel(notification.targetType)}
                        </Badge>
                      </TableCell>
                      <TableCell>{notification.stats?.totalRecipients || 0}</TableCell>
                      <TableCell>
                        <Badge variant={notification.stats?.openRate && notification.stats.openRate > 50 ? "default" : "secondary"}>
                          {notification.stats?.openRate || 0}%
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(notification.createdAt), "MMM d, yyyy HH:mm")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => viewAnalytics(notification)}
                            data-testid={`button-analytics-${notification.id}`}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(notification.id)}
                            data-testid={`button-delete-${notification.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Platform Notification
              </DialogTitle>
              <DialogDescription>
                Create a new notification to send to companies or technicians
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter notification title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  data-testid="input-notification-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Enter notification message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  data-testid="input-notification-message"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetType">Target Audience</Label>
                <Select
                  value={formData.targetType}
                  onValueChange={(value) => setFormData({ ...formData, targetType: value as TargetType, targetIds: [] })}
                >
                  <SelectTrigger data-testid="select-target-type">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {TARGET_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showRecipientSelector && (
                <div className="space-y-2">
                  <Label>
                    Select Recipients ({formData.targetIds.length} selected)
                  </Label>
                  <ScrollArea className="h-48 border rounded-md p-2">
                    {recipientList.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">No recipients available</div>
                    ) : (
                      <div className="space-y-2">
                        {recipientList.map((recipient: any) => {
                          const id = recipient.id;
                          const name = isCompanyTarget
                            ? recipient.companyName
                            : recipient.firstName && recipient.lastName
                              ? `${recipient.firstName} ${recipient.lastName}`
                              : recipient.name || 'Unknown';
                          const email = recipient.email;
                          const isSelected = formData.targetIds.includes(id);

                          return (
                            <div
                              key={id}
                              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover-elevate ${
                                isSelected ? 'bg-primary/10 border border-primary' : 'border border-transparent'
                              }`}
                              onClick={() => toggleRecipientSelection(id)}
                              data-testid={`checkbox-recipient-${id}`}
                            >
                              <Checkbox checked={isSelected} />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{name}</div>
                                <div className="text-sm text-muted-foreground truncate">{email}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                data-testid="button-submit-notification"
              >
                {createMutation.isPending ? "Sending..." : "Send Notification"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={analyticsDialogOpen} onOpenChange={setAnalyticsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Notification Analytics
              </DialogTitle>
              <DialogDescription>
                {selectedNotification?.title}
              </DialogDescription>
            </DialogHeader>

            {selectedNotification && (
              <div className="space-y-4 flex-1 overflow-y-auto">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{selectedNotification.stats?.totalRecipients || 0}</div>
                      <p className="text-sm text-muted-foreground">Total Recipients</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{selectedNotification.stats?.openedCount || 0}</div>
                      <p className="text-sm text-muted-foreground">Opened</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{selectedNotification.stats?.openRate || 0}%</div>
                      <p className="text-sm text-muted-foreground">Open Rate</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{selectedNotification.message}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recipients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Opened At</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analyticsRecipients.map((recipient) => (
                            <TableRow key={recipient.id}>
                              <TableCell className="font-medium">{recipient.userName}</TableCell>
                              <TableCell>{recipient.userEmail}</TableCell>
                              <TableCell>
                                <Badge variant={recipient.openedAt ? "default" : "secondary"}>
                                  {recipient.deletedByRecipient ? "Deleted" : recipient.openedAt ? "Opened" : "Unread"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {recipient.openedAt
                                  ? format(new Date(recipient.openedAt), "MMM d, yyyy HH:mm")
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setAnalyticsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SuperUserLayout>
  );
}
