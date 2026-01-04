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
import { ArrowLeft, Send, Loader2, MessageSquare, TicketIcon, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import type { SupportTicketWithMessages, User } from "@shared/schema";

const TICKET_CATEGORIES = [
  { value: 'account', label: 'Account Issues' },
  { value: 'billing', label: 'Billing & Payments' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'feature_question', label: 'Feature Questions' },
  { value: 'bug_report', label: 'Bug Report' },
  { value: 'other', label: 'Other' },
];

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  waiting_on_user: 'Awaiting Your Response',
  resolved: 'Resolved',
  closed: 'Closed',
};

export default function MySupportTickets() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketWithMessages | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: userData } = useQuery<{ user: User }>({
    queryKey: ["/api/user"],
  });

  const { data: ticketsData, isLoading, refetch } = useQuery<{ tickets: SupportTicketWithMessages[] }>({
    queryKey: ["/api/support-tickets"],
    enabled: !!userData?.user,
  });

  const tickets = ticketsData?.tickets || [];

  const filteredTickets = tickets.filter(t => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return !['resolved', 'closed'].includes(t.status);
    if (statusFilter === "closed") return ['resolved', 'closed'].includes(t.status);
    return t.status === statusFilter;
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      return apiRequest('POST', `/api/support-tickets/${ticketId}/messages`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support-tickets"] });
      setNewMessage("");
      toast({
        title: t("supportTickets.messageSent", "Message Sent"),
        description: t("supportTickets.messageSentDesc", "Your message has been added to the ticket."),
      });
      refetch();
    },
    onError: () => {
      toast({
        title: t("common.error", "Error"),
        description: t("supportTickets.failedToSendMessage", "Failed to send message. Please try again."),
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

  const getCategoryLabel = (value: string) => {
    return TICKET_CATEGORIES.find(c => c.value === value)?.label || value;
  };

  if (!userData?.user) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto text-center">
          <TicketIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t("supportTickets.loginRequired", "Login Required")}</h1>
          <p className="text-muted-foreground mb-4">
            {t("supportTickets.loginToView", "Please log in to view your support tickets.")}
          </p>
          <Link href="/auth">
            <Button data-testid="button-login">{t("common.login", "Log In")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  if (selectedTicket) {
    const currentTicket = tickets.find(t => t.id === selectedTicket.id) || selectedTicket;
    const isActive = !['resolved', 'closed'].includes(currentTicket.status);
    
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedTicket(null)}
              data-testid="button-back-to-list"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">{currentTicket.subject}</h1>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getStatusBadge(currentTicket.status)}>
                    {STATUS_LABELS[currentTicket.status] || currentTicket.status}
                  </Badge>
                  <Badge variant="outline">{getCategoryLabel(currentTicket.category)}</Badge>
                </div>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(currentTicket.createdAt), "PPp")}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none mb-6">
                <p className="whitespace-pre-wrap">{currentTicket.description}</p>
              </div>

              {currentTicket.messages && currentTicket.messages.length > 0 && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {t("supportTickets.conversation", "Conversation")}
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
                          {msg.senderRole === 'superuser' ? t("supportTickets.supportTeam", "Support Team") : t("supportTickets.you", "You")}
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

              {isActive ? (
                <div className="mt-6 border-t pt-4 space-y-3">
                  <Textarea
                    placeholder={t("supportTickets.writeReply", "Write your reply...")}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[100px]"
                    data-testid="textarea-reply"
                  />
                  <div className="flex justify-end">
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
                      {t("supportTickets.sendReply", "Send Reply")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 border-t pt-4 text-center text-muted-foreground">
                  <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <p>{t("supportTickets.ticketClosed", "This ticket has been resolved.")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">
              {t("supportTickets.myTickets", "My Support Tickets")}
            </h1>
            <p className="text-muted-foreground">
              {t("supportTickets.myTicketsDesc", "View and manage your support requests.")}
            </p>
          </div>
          <Link href="/help#support-ticket">
            <Button data-testid="button-new-ticket">
              <TicketIcon className="h-4 w-4 mr-2" />
              {t("supportTickets.newTicket", "New Ticket")}
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[
            { value: 'all', label: t("supportTickets.filterAll", "All") },
            { value: 'active', label: t("supportTickets.filterActive", "Active") },
            { value: 'closed', label: t("supportTickets.filterClosed", "Closed") },
          ].map((filter) => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
              data-testid={`button-filter-${filter.value}`}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {tickets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <TicketIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t("supportTickets.noTickets", "No Support Tickets")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("supportTickets.noTicketsDesc", "You haven't submitted any support tickets yet.")}
              </p>
              <Link href="/help#support-ticket">
                <Button data-testid="button-create-first-ticket">
                  {t("supportTickets.createFirst", "Create Your First Ticket")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {t("supportTickets.noMatchingTickets", "No tickets match the current filter.")}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTicket(ticket)}
                data-testid={`card-ticket-${ticket.id}`}
              >
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base truncate">{ticket.subject}</CardTitle>
                    <CardDescription className="flex items-center gap-2 flex-wrap mt-1">
                      <Badge className={`${getStatusBadge(ticket.status)} text-xs`}>
                        {STATUS_LABELS[ticket.status] || ticket.status}
                      </Badge>
                      <span>{getCategoryLabel(ticket.category)}</span>
                      <span className="text-xs">
                        {format(new Date(ticket.createdAt), "PP")}
                      </span>
                    </CardDescription>
                  </div>
                  {ticket.unreadCount && ticket.unreadCount > 0 && (
                    <Badge variant="default" className="shrink-0">
                      {ticket.unreadCount} {t("supportTickets.new", "new")}
                    </Badge>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
