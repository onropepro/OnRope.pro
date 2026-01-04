import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import SuperUserLayout from "@/components/SuperUserLayout";
import { ArrowLeft, Send, Loader2, MessageSquare, TicketIcon, Clock, User, Building2, Sparkles, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SupportTicketWithMessages } from "@shared/schema";

const TICKET_CATEGORIES = [
  { value: 'account', label: 'Account Issues' },
  { value: 'billing', label: 'Billing & Payments' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'feature_question', label: 'Feature Questions' },
  { value: 'bug_report', label: 'Bug Report' },
  { value: 'other', label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting_on_user', label: 'Waiting on User' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export default function SuperUserSupportTickets() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketWithMessages | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDraftPending, setIsDraftPending] = useState(false);
  const [draftSources, setDraftSources] = useState<Array<{ title: string; slug: string }>>([]);

  const { data: ticketsData, isLoading, refetch } = useQuery<{ tickets: SupportTicketWithMessages[] }>({
    queryKey: ["/api/support-tickets"],
  });

  const tickets = ticketsData?.tickets || [];

  const filteredTickets = tickets.filter(t => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    return true;
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ ticketId, status, priority }: { ticketId: string; status?: string; priority?: string }) => {
      return apiRequest('PATCH', `/api/support-tickets/${ticketId}`, { status, priority });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support-tickets"] });
      toast({
        title: "Ticket Updated",
        description: "Support ticket has been updated",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Failed to update ticket",
        variant: "destructive",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      return apiRequest('POST', `/api/support-tickets/${ticketId}/messages`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support-tickets"] });
      setNewMessage("");
      toast({
        title: "Message Sent",
        description: "Your response has been sent to the user",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!selectedTicket || !newMessage.trim()) return;
    sendMessageMutation.mutate({
      ticketId: selectedTicket.id,
      message: newMessage.trim(),
    });
    // Clear draft status when sending
    setIsDraftPending(false);
    setDraftSources([]);
  };

  const generateDraftMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      const response = await apiRequest('POST', `/api/support-tickets/${ticketId}/ai-draft`);
      return response.json();
    },
    onSuccess: (data: { draft: string; sources: Array<{ title: string; slug: string }> }) => {
      setNewMessage(data.draft);
      setIsDraftPending(true);
      setDraftSources(data.sources || []);
      toast({
        title: "AI Draft Generated",
        description: "Review and edit the draft before sending",
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Failed to generate AI draft",
        variant: "destructive",
      });
    },
  });

  const handleGenerateDraft = () => {
    if (!selectedTicket) return;
    generateDraftMutation.mutate(selectedTicket.id);
  };

  const handleSelectTicket = (ticket: SupportTicketWithMessages | null) => {
    // Reset draft state when switching tickets
    setNewMessage("");
    setIsDraftPending(false);
    setDraftSources([]);
    setSelectedTicket(ticket);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      in_progress: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      waiting_on_user: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return styles[status] || styles.open;
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      normal: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[priority || 'normal'] || styles.normal;
  };

  const getCategoryLabel = (value: string) => {
    return TICKET_CATEGORIES.find(c => c.value === value)?.label || value;
  };

  if (isLoading) {
    return (
      <SuperUserLayout title="Support Tickets">
        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </div>
        </div>
      </SuperUserLayout>
    );
  }

  if (selectedTicket) {
    const currentTicket = tickets.find(t => t.id === selectedTicket.id) || selectedTicket;
    return (
      <SuperUserLayout title={currentTicket.subject}>
        <div className="p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSelectTicket(null)}
                data-testid="button-back-to-list"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getStatusBadge(currentTicket.status)}>
                      {currentTicket.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityBadge(currentTicket.priority || 'normal')}>
                      {currentTicket.priority || 'normal'}
                    </Badge>
                    <Badge variant="outline">{getCategoryLabel(currentTicket.category)}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={currentTicket.status}
                      onChange={(e) => updateStatusMutation.mutate({ ticketId: currentTicket.id, status: e.target.value })}
                      className="h-9 px-3 rounded-md border bg-background text-sm"
                      data-testid="select-update-status"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <select
                      value={currentTicket.priority || 'normal'}
                      onChange={(e) => updateStatusMutation.mutate({ ticketId: currentTicket.id, priority: e.target.value })}
                      className="h-9 px-3 rounded-md border bg-background text-sm"
                      data-testid="select-update-priority"
                    >
                      {PRIORITY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <CardTitle className="mt-4">{currentTicket.subject}</CardTitle>
                <CardDescription className="flex items-center gap-4 flex-wrap mt-2">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {currentTicket.userName} ({currentTicket.userRole})
                  </span>
                  <span>{currentTicket.userEmail}</span>
                  {currentTicket.companyName && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {currentTicket.companyName}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(currentTicket.createdAt), "PPp")}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <p className="whitespace-pre-wrap">{currentTicket.description}</p>
                </div>

                {currentTicket.messages && currentTicket.messages.length > 0 && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Conversation
                    </h3>
                    {currentTicket.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-lg ${
                          msg.senderRole === 'superuser'
                            ? 'bg-primary/10 border-l-4 border-primary'
                            : 'bg-muted'
                        }`}
                        data-testid={`message-${msg.id}`}
                      >
                        <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                          <span className="font-medium text-sm">
                            {msg.senderRole === 'superuser' ? 'You (Support)' : msg.senderName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(msg.createdAt), "PPp")}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 border-t pt-4 space-y-3">
                  {isDraftPending && (
                    <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-700 dark:text-amber-400">
                        AI Draft ready - please review and edit before sending
                        {draftSources.length > 0 && (
                          <span className="block text-xs mt-1 text-amber-600 dark:text-amber-500">
                            Sources: {draftSources.map(s => s.title).join(', ')}
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                  <Textarea
                    placeholder="Write your response..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      // Clear draft pending status when user starts editing
                      if (isDraftPending) {
                        setIsDraftPending(false);
                      }
                    }}
                    className="min-h-[100px]"
                    data-testid="textarea-reply"
                  />
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      onClick={handleGenerateDraft}
                      disabled={generateDraftMutation.isPending}
                      data-testid="button-generate-ai-draft"
                    >
                      {generateDraftMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      {generateDraftMutation.isPending ? 'Generating...' : 'Generate AI Draft'}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                      data-testid="button-send-reply"
                    >
                      {sendMessageMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Send Response
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SuperUserLayout>
    );
  }

  const activeTickets = tickets.filter(t => !['resolved', 'closed'].includes(t.status));
  const totalUnread = tickets.reduce((sum, t) => sum + (t.unreadCount || 0), 0);

  return (
    <SuperUserLayout title="Support Tickets">
      <div className="p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Support Tickets</h1>
              <p className="text-muted-foreground">
                {activeTickets.length} active tickets {totalUnread > 0 && `(${totalUnread} unread)`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-md border bg-background text-sm"
                data-testid="select-status-filter"
              >
                <option value="all">All Statuses</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 px-3 rounded-md border bg-background text-sm"
                data-testid="select-category-filter"
              >
                <option value="all">All Categories</option>
                {TICKET_CATEGORIES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {tickets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <TicketIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Support Tickets</h3>
                <p className="text-muted-foreground">
                  No support tickets have been submitted yet.
                </p>
              </CardContent>
            </Card>
          ) : filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No tickets match the current filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSelectTicket(ticket)}
                  data-testid={`card-ticket-${ticket.id}`}
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge className={`${getStatusBadge(ticket.status)} text-xs`}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={`${getPriorityBadge(ticket.priority || 'normal')} text-xs`}>
                          {ticket.priority || 'normal'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(ticket.category)}
                        </Badge>
                      </div>
                      <CardTitle className="text-base truncate">{ticket.subject}</CardTitle>
                      <CardDescription className="flex items-center gap-2 flex-wrap mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {ticket.userName}
                        </span>
                        {ticket.companyName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {ticket.companyName}
                          </span>
                        )}
                        <span className="text-xs">
                          {format(new Date(ticket.createdAt), "PP")}
                        </span>
                      </CardDescription>
                    </div>
                    {ticket.unreadCount && ticket.unreadCount > 0 && (
                      <Badge variant="default" className="shrink-0">
                        {ticket.unreadCount} new
                      </Badge>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </SuperUserLayout>
  );
}
