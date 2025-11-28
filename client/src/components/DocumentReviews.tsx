import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import SignatureCanvas from "react-signature-canvas";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, Eye, PenLine, Check, AlertCircle, Clock, ChevronRight, ChevronDown, FileCheck, FileWarning, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface DocumentReviewSignature {
  id: string;
  companyId: string;
  employeeId: string;
  documentType: string;
  documentId?: string;
  documentName: string;
  fileUrl?: string;
  viewedAt?: string;
  signedAt?: string;
  signatureDataUrl?: string;
  documentVersion?: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentReviewsProps {
  companyDocuments?: any[];
  methodStatements?: any[];
}

export function DocumentReviews({ companyDocuments = [], methodStatements = [] }: DocumentReviewsProps) {
  const { toast } = useToast();
  const signatureRef = useRef<SignatureCanvas>(null);
  const [selectedReview, setSelectedReview] = useState<DocumentReviewSignature | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);

  const { data: reviewsData, isLoading } = useQuery<{ reviews: DocumentReviewSignature[] }>({
    queryKey: ['/api/document-reviews/my'],
  });

  const markViewedMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      return apiRequest('POST', `/api/document-reviews/${reviewId}/view`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/document-reviews/my'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to mark document as viewed",
      });
    },
  });

  const signDocumentMutation = useMutation({
    mutationFn: async ({ reviewId, signatureDataUrl }: { reviewId: string; signatureDataUrl: string }) => {
      return apiRequest('POST', `/api/document-reviews/${reviewId}/sign`, { signatureDataUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/document-reviews/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/csr'] });
      setIsSignDialogOpen(false);
      setSelectedReview(null);
      toast({
        title: "Document Signed",
        description: "Your signature has been recorded.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign document",
      });
    },
  });

  const reviews = reviewsData?.reviews || [];
  const pendingReviews = reviews.filter(r => !r.signedAt);
  const signedReviews = reviews.filter(r => r.signedAt);

  const getDocumentUrl = (review: DocumentReviewSignature) => {
    // Use the fileUrl stored in the review record (most reliable)
    if (review.fileUrl) {
      return review.fileUrl;
    }
    
    // Fallback: try to find the document in passed props (for legacy records without fileUrl)
    if (review.documentType === 'health_safety_manual') {
      const doc = companyDocuments.find((d: any) => d.documentType === 'health_safety_manual');
      return doc?.fileUrl;
    }
    if (review.documentType === 'company_policy') {
      const doc = companyDocuments.find((d: any) => d.documentType === 'company_policy');
      return doc?.fileUrl;
    }
    
    return null;
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'health_safety_manual':
        return 'Health & Safety Manual';
      case 'company_policy':
        return 'Company Policy';
      case 'method_statement':
        return 'Method Statement';
      default:
        return type;
    }
  };

  const handleViewDocument = (review: DocumentReviewSignature) => {
    const url = getDocumentUrl(review);
    if (url) {
      // Open the document in a new tab
      window.open(url, '_blank');
      // Only mark as viewed after successfully opening a valid URL
      markViewedMutation.mutate(review.id);
      setSelectedReview(review);
    } else {
      // No valid URL available - cannot mark as viewed
      toast({
        variant: "destructive",
        title: "Document Not Available",
        description: "The document file is not available. Please contact your administrator.",
      });
    }
  };

  const handleOpenSignDialog = (review: DocumentReviewSignature) => {
    if (!review.viewedAt) {
      toast({
        variant: "destructive",
        title: "View Required",
        description: "You must view the document before signing.",
      });
      return;
    }
    setSelectedReview(review);
    setIsSignDialogOpen(true);
  };

  const handleClearSignature = () => {
    signatureRef.current?.clear();
    setIsSignatureEmpty(true);
  };

  const handleSignDocument = () => {
    if (!selectedReview || !signatureRef.current) return;
    
    if (signatureRef.current.isEmpty()) {
      toast({
        variant: "destructive",
        title: "Signature Required",
        description: "Please provide your signature before submitting.",
      });
      return;
    }

    const signatureDataUrl = signatureRef.current.toDataURL('image/png');
    signDocumentMutation.mutate({
      reviewId: selectedReview.id,
      signatureDataUrl,
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent pb-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl ring-1 ring-amber-500/20">
            <FileCheck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">Document Reviews Required</CardTitle>
            <CardDescription>
              Review and sign the following documents to acknowledge receipt and understanding
            </CardDescription>
          </div>
          {pendingReviews.length > 0 && (
            <Badge variant="destructive" className="text-base font-semibold px-3">
              {pendingReviews.length} Pending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {pendingReviews.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Awaiting Your Signature
            </h3>
            <div className="space-y-3">
              {pendingReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border bg-card"
                  data-testid={`review-pending-${review.id}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
                      <FileWarning className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{review.documentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {getDocumentTypeLabel(review.documentType)}
                        {review.viewedAt && (
                          <span className="ml-2 text-emerald-600">
                            <Eye className="h-3 w-3 inline mr-1" />
                            Viewed
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                    {!review.viewedAt ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDocument(review)}
                        data-testid={`button-view-${review.id}`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Document
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDocument(review)}
                          data-testid={`button-reread-${review.id}`}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Re-read
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleOpenSignDialog(review)}
                          data-testid={`button-sign-${review.id}`}
                        >
                          <PenLine className="h-4 w-4 mr-2" />
                          Sign
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {signedReviews.length > 0 && (
          <Collapsible defaultOpen={pendingReviews.length === 0}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded-lg hover-elevate mb-2">
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Signed Documents ({signedReviews.length})
              </h3>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-2 pl-6">
                {signedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border bg-muted/30"
                    data-testid={`review-signed-${review.id}`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0">
                        <FileCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{review.documentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {getDocumentTypeLabel(review.documentType)}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      Signed: {formatDate(review.signedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>

      <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign Document</DialogTitle>
            <DialogDescription>
              {selectedReview?.documentName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              By signing below, you acknowledge that you have read and understood the document.
            </p>
            
            <div className="border rounded-lg p-2 bg-white">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  className: 'w-full h-40 cursor-crosshair',
                  style: { width: '100%', height: '160px' },
                }}
                backgroundColor="white"
                onBegin={() => setIsSignatureEmpty(false)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSignature}
                data-testid="button-clear-signature"
              >
                Clear
              </Button>
              <p className="text-xs text-muted-foreground">
                Sign with your mouse or touch
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSignDialogOpen(false)}
              data-testid="button-cancel-sign"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSignDocument}
              disabled={signDocumentMutation.isPending || isSignatureEmpty}
              data-testid="button-confirm-sign"
            >
              {signDocumentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <PenLine className="h-4 w-4 mr-2" />
                  Submit Signature
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
