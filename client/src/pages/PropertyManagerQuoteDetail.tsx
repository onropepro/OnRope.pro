import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText, 
  Check, 
  X, 
  MessageSquare, 
  Send,
  RefreshCcw
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuoteService {
  id: string;
  serviceType: string;
  description: string | null;
  totalCost: number | string | null;
}

interface QuoteDetail {
  id: string;
  quoteNumber: string | null;
  buildingName: string;
  strataPlanNumber: string;
  buildingAddress: string;
  floorCount: number;
  status: string;
  pipelineStage: string;
  collaborationStatus?: string;
  createdAt: string | null;
  companyName: string;
  services: QuoteService[];
  grandTotal: number;
}

interface QuoteMessage {
  id: string;
  quoteId: string;
  senderUserId: string;
  senderType: 'company' | 'property_manager';
  senderName: string;
  messageType: 'message' | 'counter_offer' | 'accept' | 'decline' | 'revoke';
  content: string | null;
  counterOfferAmount: string | null;
  counterOfferNotes: string | null;
  responseStatus: string | null;
  isRead: boolean;
  createdAt: string;
}

const serviceNames: Record<string, string> = {
  window_cleaning: "Window Cleaning",
  dryer_vent_cleaning: "Exterior Dryer Vent Cleaning",
  building_wash: "Building Wash - Pressure Washing",
  general_pressure_washing: "General Pressure Washing",
  gutter_cleaning: "Gutter Cleaning",
  parkade: "Parkade Cleaning",
  ground_windows: "Ground Windows",
  in_suite: "In-Suite Dryer Vent",
  painting: "Painting",
  custom: "Custom Service"
};

function getCollaborationStatusBadge(status: string | undefined) {
  switch (status) {
    case 'accepted':
      return <Badge variant="default" className="bg-green-600">Accepted</Badge>;
    case 'declined':
      return <Badge variant="destructive">Declined</Badge>;
    case 'negotiation':
      return <Badge variant="secondary">In Negotiation</Badge>;
    case 'sent':
    case 'viewed':
      return <Badge variant="outline">Awaiting Response</Badge>;
    default:
      return <Badge variant="secondary">{status || 'Pending'}</Badge>;
  }
}

export default function PropertyManagerQuoteDetail() {
  const { t } = useTranslation();
  const { quoteId } = useParams<{ quoteId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [messageContent, setMessageContent] = useState("");
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [showCounterOfferDialog, setShowCounterOfferDialog] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [counterOfferAmount, setCounterOfferAmount] = useState("");
  const [counterOfferNotes, setCounterOfferNotes] = useState("");

  const { data, isLoading, error, refetch } = useQuery<{ quote: QuoteDetail }>({
    queryKey: ['/api/property-managers/quotes', quoteId],
  });

  const { data: messagesData, refetch: refetchMessages } = useQuery<{ messages: QuoteMessage[] }>({
    queryKey: ['/api/property-managers/quotes', quoteId, 'messages'],
    enabled: !!quoteId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('POST', `/api/property-managers/quotes/${quoteId}/messages`, { content });
    },
    onSuccess: () => {
      setMessageContent("");
      refetchMessages();
      toast({ title: t("propertyManagerQuoteDetail.messageSent") });
    },
    onError: () => {
      toast({ title: t("propertyManagerQuoteDetail.sendMessageFailed"), variant: "destructive" });
    }
  });

  const acceptMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/property-managers/quotes/${quoteId}/accept`);
    },
    onSuccess: () => {
      refetch();
      refetchMessages();
      queryClient.invalidateQueries({ queryKey: ['/api/property-managers/me/quotes'] });
      toast({ title: t("propertyManagerQuoteDetail.quoteAccepted") });
    },
    onError: () => {
      toast({ title: t("propertyManagerQuoteDetail.acceptFailed"), variant: "destructive" });
    }
  });

  const declineMutation = useMutation({
    mutationFn: async (reason: string) => {
      return apiRequest('POST', `/api/property-managers/quotes/${quoteId}/decline`, { reason });
    },
    onSuccess: () => {
      setShowDeclineDialog(false);
      setDeclineReason("");
      refetch();
      refetchMessages();
      queryClient.invalidateQueries({ queryKey: ['/api/property-managers/me/quotes'] });
      toast({ title: t("propertyManagerQuoteDetail.quoteDeclined") });
    },
    onError: () => {
      toast({ title: t("propertyManagerQuoteDetail.declineFailed"), variant: "destructive" });
    }
  });

  const counterOfferMutation = useMutation({
    mutationFn: async ({ amount, notes }: { amount: string; notes: string }) => {
      return apiRequest('POST', `/api/property-managers/quotes/${quoteId}/counter-offer`, { counterOfferAmount: amount, notes });
    },
    onSuccess: () => {
      setShowCounterOfferDialog(false);
      setCounterOfferAmount("");
      setCounterOfferNotes("");
      refetch();
      refetchMessages();
      toast({ title: t("propertyManagerQuoteDetail.counterOfferSubmitted") });
    },
    onError: () => {
      toast({ title: t("propertyManagerQuoteDetail.counterOfferFailed"), variant: "destructive" });
    }
  });

  const handleSendMessage = () => {
    if (messageContent.trim()) {
      sendMessageMutation.mutate(messageContent.trim());
    }
  };

  const handleAccept = () => {
    acceptMutation.mutate();
  };

  const handleDecline = () => {
    declineMutation.mutate(declineReason);
  };

  const handleCounterOffer = () => {
    if (counterOfferAmount && !isNaN(Number(counterOfferAmount))) {
      counterOfferMutation.mutate({ amount: counterOfferAmount, notes: counterOfferNotes });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data?.quote) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation('/property-manager')}
            data-testid="button-back-to-dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Quote Details</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">Quote Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This quote may have been removed or you don't have access to view it.
            </p>
            <Button onClick={() => setLocation('/property-manager')} data-testid="button-go-to-dashboard">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const quote = data.quote;
  const messages = messagesData?.messages || [];
  const isQuoteClosed = quote.collaborationStatus === 'accepted' || quote.collaborationStatus === 'declined';
  
  const formattedDate = quote.createdAt 
    ? new Date(quote.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'N/A';

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLocation('/property-manager')}
          data-testid="button-back-to-dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold" data-testid="text-quote-title">
          Quote {quote.quoteNumber || quote.strataPlanNumber}
        </h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {quote.buildingName}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{quote.buildingAddress}</p>
          </div>
          {getCollaborationStatusBadge(quote.collaborationStatus)}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Date:</span>
              <span data-testid="text-quote-date">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Floors:</span>
              <span data-testid="text-floor-count">{quote.floorCount}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">From:</span>
              <span data-testid="text-company-name">{quote.companyName}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Services</h3>
            <div className="space-y-3">
              {quote.services.map((service) => (
                <div 
                  key={service.id} 
                  className="flex justify-between items-start p-3 bg-muted/50 rounded-md"
                  data-testid={`service-item-${service.id}`}
                >
                  <div>
                    <p className="font-medium">
                      {serviceNames[service.serviceType] || service.serviceType}
                    </p>
                    {service.description && (
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    )}
                  </div>
                  <span className="font-semibold">
                    ${Number(service.totalCost || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary" data-testid="text-grand-total">
              <DollarSign className="h-5 w-5 inline" />
              {quote.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {!isQuoteClosed && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleAccept}
                  disabled={acceptMutation.isPending}
                  data-testid="button-accept-quote"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {acceptMutation.isPending ? "Accepting..." : "Accept Quote"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCounterOfferDialog(true)}
                  data-testid="button-counter-offer"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Counter-Offer
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeclineDialog(true)}
                  data-testid="button-decline-quote"
                >
                  <X className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-80 overflow-y-auto space-y-3 p-2 bg-muted/30 rounded-md">
            {messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No messages yet. Start a conversation with the company.
              </p>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-3 rounded-md ${
                    msg.senderType === 'property_manager' 
                      ? 'bg-primary/10 ml-8' 
                      : 'bg-muted mr-8'
                  }`}
                  data-testid={`message-${msg.id}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{msg.senderName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {msg.messageType === 'counter_offer' && msg.counterOfferAmount && (
                    <div className="mb-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                      <span className="text-sm font-medium">Counter-Offer: </span>
                      <span className="font-bold">${Number(msg.counterOfferAmount).toLocaleString()}</span>
                    </div>
                  )}
                  {msg.messageType === 'accept' && (
                    <Badge variant="default" className="bg-green-600 mb-2">Quote Accepted</Badge>
                  )}
                  {msg.messageType === 'decline' && (
                    <Badge variant="destructive" className="mb-2">Quote Declined</Badge>
                  )}
                  {msg.content && <p className="text-sm">{msg.content}</p>}
                </div>
              ))
            )}
          </div>

          {!isQuoteClosed && (
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="flex-1"
                data-testid="input-message"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!messageContent.trim() || sendMessageMutation.isPending}
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Decline Quote</DialogTitle>
            <DialogDescription>
              Please provide a reason for declining this quote (optional).
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for declining..."
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            data-testid="input-decline-reason"
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeclineDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDecline}
              disabled={declineMutation.isPending}
              data-testid="button-confirm-decline"
            >
              {declineMutation.isPending ? "Declining..." : "Decline Quote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCounterOfferDialog} onOpenChange={setShowCounterOfferDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Counter-Offer</DialogTitle>
            <DialogDescription>
              Current quote total: ${quote.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Your Counter-Offer Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={counterOfferAmount}
                onChange={(e) => setCounterOfferAmount(e.target.value)}
                data-testid="input-counter-offer-amount"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Notes (optional)</label>
              <Textarea
                placeholder="Additional notes or justification..."
                value={counterOfferNotes}
                onChange={(e) => setCounterOfferNotes(e.target.value)}
                data-testid="input-counter-offer-notes"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCounterOfferDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCounterOffer}
              disabled={!counterOfferAmount || isNaN(Number(counterOfferAmount)) || counterOfferMutation.isPending}
              data-testid="button-confirm-counter-offer"
            >
              {counterOfferMutation.isPending ? "Submitting..." : "Submit Counter-Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
