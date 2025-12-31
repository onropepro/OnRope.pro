import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import SuperUserLayout from "@/components/SuperUserLayout";
import { BackButton } from "@/components/BackButton";

const FEATURE_CATEGORIES = [
  { value: 'feature', label: 'New Feature' },
  { value: 'job_type', label: 'New Job Type' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'other', label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'declined', label: 'Declined' },
];

export default function SuperUserFeatureRequests() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: requestsData, isLoading, refetch } = useQuery<{ requests: any[] }>({
    queryKey: ["/api/superuser/feature-requests"],
  });

  const requests = requestsData?.requests || [];

  const filteredRequests = requests.filter(r => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
    return true;
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: string }) => {
      return apiRequest('PATCH', `/api/superuser/feature-requests/${requestId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/feature-requests"] });
      toast({
        title: "Status Updated",
        description: "Feature request status has been updated",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("superUserFeatureRequests.failedToUpdateStatus"),
        variant: "destructive",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ requestId, message }: { requestId: string; message: string }) => {
      return apiRequest('POST', `/api/superuser/feature-requests/${requestId}/messages`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/feature-requests"] });
      setNewMessage("");
      toast({
        title: "Message Sent",
        description: "Your response has been sent to the company owner",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("superUserFeatureRequests.failedToSendMessage"),
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!selectedRequest || !newMessage.trim()) return;
    sendMessageMutation.mutate({
      requestId: selectedRequest.id,
      message: newMessage.trim(),
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      reviewing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      in_progress: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      declined: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[status] || styles.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      normal: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[priority] || styles.normal;
  };

  const getCategoryLabel = (value: string) => {
    return FEATURE_CATEGORIES.find(c => c.value === value)?.label || value;
  };

  if (isLoading) {
    return (
      <SuperUserLayout title="Feature Requests">
        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <span className="material-icons animate-spin text-4xl text-muted-foreground">autorenew</span>
            </div>
          </div>
        </div>
      </SuperUserLayout>
    );
  }

  if (selectedRequest) {
    const currentRequest = requests.find(r => r.id === selectedRequest.id) || selectedRequest;
    return (
      <SuperUserLayout title={currentRequest.title}>
        <div className="p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedRequest(null)}
                data-testid="button-back-to-list"
              >
                <span className="material-icons">arrow_back</span>
              </Button>
            </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getStatusBadge(currentRequest.status)}>
                    {currentRequest.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPriorityBadge(currentRequest.priority)}>
                    {currentRequest.priority}
                  </Badge>
                  <Badge variant="outline">{getCategoryLabel(currentRequest.category)}</Badge>
                </div>
                <select
                  value={currentRequest.status}
                  onChange={(e) => updateStatusMutation.mutate({ requestId: currentRequest.id, status: e.target.value })}
                  className="h-9 px-3 rounded-md border bg-background text-sm"
                  data-testid="select-update-status"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <CardDescription className="mt-2">
                From: {currentRequest.userName || 'Unknown User'}{currentRequest.companyName ? ` (${currentRequest.companyName})` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Original Request:</p>
                <p className="text-sm whitespace-pre-wrap">{currentRequest.description}</p>
                {currentRequest.screenshotUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">Attached Screenshot:</p>
                    <img 
                      src={currentRequest.screenshotUrl} 
                      alt="Request screenshot" 
                      className="max-h-[300px] rounded-md border object-contain cursor-pointer hover:opacity-90"
                      onClick={() => window.open(currentRequest.screenshotUrl, '_blank')}
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Submitted {format(new Date(currentRequest.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>

              {currentRequest.messages && currentRequest.messages.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Conversation:</p>
                  {currentRequest.messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.senderRole === 'superuser'
                          ? 'bg-primary/10 ml-8'
                          : 'bg-muted mr-8'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {msg.senderRole === 'superuser' ? 'OnRopePro Team (You)' : currentRequest.userName || 'User'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm font-medium">Send Response:</p>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your response to the company owner..."
                  className="w-full min-h-[120px] p-3 border rounded-lg bg-background resize-none focus:ring-2 focus:ring-primary/20"
                  data-testid="textarea-admin-response"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  className="h-12"
                  data-testid="button-send-response"
                >
                  {sendMessageMutation.isPending ? (
                    <span className="material-icons animate-spin mr-2">autorenew</span>
                  ) : (
                    <span className="material-icons mr-2 text-lg">send</span>
                  )}
                  Send Response
                </Button>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </SuperUserLayout>
    );
  }

  return (
    <SuperUserLayout title="Feature Requests">
      <div className="p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back Button */}
          <BackButton to="/superuser" label="Back to Dashboard" />

          <p className="text-muted-foreground">Review and respond to company feedback</p>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle>All Requests ({filteredRequests.length})</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 px-3 rounded-md border bg-background text-sm"
                  data-testid="select-filter-status"
                >
                  <option value="all">All Status</option>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-9 px-3 rounded-md border bg-background text-sm"
                  data-testid="select-filter-category"
                >
                  <option value="all">All Categories</option>
                  {FEATURE_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-icons text-5xl text-muted-foreground mb-4">inbox</span>
                <p className="text-muted-foreground">No feature requests found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className="p-4 border rounded-lg hover-elevate cursor-pointer"
                    data-testid={`request-item-${request.id}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{request.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {request.userName || 'Unknown User'}{request.companyName ? ` - ${request.companyName}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                        <Badge className={getPriorityBadge(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge className={getStatusBadge(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{request.description}</p>
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {getCategoryLabel(request.category)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(request.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </SuperUserLayout>
  );
}
