import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  Download,
  File,
  FileImage,
  FileArchive,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import type { TechnicianDocumentRequest, TechnicianDocumentRequestFile } from "@shared/schema";

interface DocumentRequestWithDetails extends TechnicianDocumentRequest {
  files: TechnicianDocumentRequestFile[];
  technician?: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
}

interface EmployerDocumentRequestsProps {
  technicianId: string;
  technicianName?: string;
  companyId: string;
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return FileImage;
  if (fileType.includes('pdf')) return FileText;
  if (fileType.includes('zip') || fileType.includes('archive')) return FileArchive;
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function EmployerDocumentRequests({ technicianId, technicianName, companyId }: EmployerDocumentRequestsProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequestWithDetails | null>(null);
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDetails, setRequestDetails] = useState("");

  const { data: requestsData, isLoading } = useQuery<{ requests: DocumentRequestWithDetails[] }>({
    queryKey: ["/api/companies", companyId, "document-requests", technicianId],
    queryFn: async () => {
      const response = await fetch(`/api/companies/${companyId}/document-requests?technicianId=${technicianId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch requests');
      return response.json();
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async ({ title, details }: { title: string; details?: string }) => {
      return apiRequest("POST", `/api/technicians/${technicianId}/document-requests`, {
        title,
        details,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "document-requests", technicianId] });
      toast({ title: t("employerDocumentRequests.requestSent") });
      setShowRequestDialog(false);
      setRequestTitle("");
      setRequestDetails("");
    },
    onError: () => {
      toast({ title: t("employerDocumentRequests.sendFailed"), variant: "destructive" });
    },
  });

  const handleSubmitRequest = () => {
    if (!requestTitle.trim()) {
      toast({ title: t("employerDocumentRequests.titleRequired"), variant: "destructive" });
      return;
    }
    createRequestMutation.mutate({
      title: requestTitle.trim(),
      details: requestDetails.trim() || undefined,
    });
  };

  const requests = requestsData?.requests || [];
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const fulfilledRequests = requests.filter(r => r.status === 'fulfilled');

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Document Requests</CardTitle>
          </div>
          <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5" data-testid="button-request-document">
                <Plus className="w-4 h-4" />
                Request Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" data-testid="dialog-request-document">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Request Document
                </DialogTitle>
                <DialogDescription>
                  Request a document from {technicianName || 'this technician'}. They will be notified and can upload files in response.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="requestTitle">Document Title <span className="text-destructive">*</span></Label>
                  <Input
                    id="requestTitle"
                    value={requestTitle}
                    onChange={(e) => setRequestTitle(e.target.value)}
                    placeholder={t('employerDocumentRequests.placeholders.documentTitle', 'e.g., Updated First Aid Certificate')}
                    className="mt-1.5"
                    data-testid="input-request-title"
                  />
                </div>
                <div>
                  <Label htmlFor="requestDetails">Details (Optional)</Label>
                  <Textarea
                    id="requestDetails"
                    value={requestDetails}
                    onChange={(e) => setRequestDetails(e.target.value)}
                    placeholder={t('employerDocumentRequests.placeholders.additionalDetails', 'Any additional instructions or details...')}
                    className="mt-1.5"
                    data-testid="input-request-details"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowRequestDialog(false)}
                  data-testid="button-cancel-request"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={createRequestMutation.isPending || !requestTitle.trim()}
                  className="gap-1.5"
                  data-testid="button-send-request"
                >
                  {createRequestMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Request
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>Request and track documents from this technician</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No document requests yet</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {pendingRequests.length > 0 && (
              <AccordionItem value="pending">
                <AccordionTrigger className="hover:no-underline py-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">Pending</span>
                    <Badge variant="secondary" className="text-xs">{pendingRequests.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-1">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-3 border rounded-md hover-elevate cursor-pointer"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowViewDialog(true);
                        }}
                        data-testid={`employer-doc-request-pending-${request.id}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm truncate">{request.title}</p>
                          <Badge variant="outline" className="text-xs">
                            {format(new Date(request.requestedAt), 'MMM d')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {fulfilledRequests.length > 0 && (
              <AccordionItem value="fulfilled">
                <AccordionTrigger className="hover:no-underline py-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Fulfilled</span>
                    <Badge variant="outline" className="text-xs">{fulfilledRequests.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-1">
                    {fulfilledRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-3 border rounded-md hover-elevate cursor-pointer"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowViewDialog(true);
                        }}
                        data-testid={`employer-doc-request-fulfilled-${request.id}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm truncate">{request.title}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="text-xs gap-1">
                              <FileText className="w-3 h-3" />
                              {request.files?.length || 0}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}
      </CardContent>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto" data-testid="dialog-view-document-request">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  {selectedRequest.title}
                </DialogTitle>
                <DialogDescription>
                  Requested on {format(new Date(selectedRequest.requestedAt), 'MMM d, yyyy')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {selectedRequest.status === 'pending' ? (
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="w-3 h-3" />
                      Pending
                    </Badge>
                  ) : (
                    <Badge variant="default" className="gap-1 bg-green-600">
                      <CheckCircle2 className="w-3 h-3" />
                      Fulfilled
                    </Badge>
                  )}
                </div>

                {selectedRequest.details && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Request Details</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedRequest.details}</p>
                  </div>
                )}

                {selectedRequest.status === 'fulfilled' && (
                  <>
                    {selectedRequest.respondedAt && (
                      <p className="text-sm text-muted-foreground">
                        Fulfilled on {format(new Date(selectedRequest.respondedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    )}

                    {selectedRequest.responseNote && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Technician's Note</p>
                        <p className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">{selectedRequest.responseNote}</p>
                      </div>
                    )}

                    {selectedRequest.files && selectedRequest.files.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Uploaded Files ({selectedRequest.files.length})</p>
                        <div className="space-y-2">
                          {selectedRequest.files.map((file) => {
                            const FileIcon = getFileIcon(file.fileType);
                            return (
                              <div key={file.id} className="flex items-center gap-3 p-2 border rounded-md">
                                <FileIcon className="w-5 h-5 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{file.fileName}</p>
                                  <p className="text-xs text-muted-foreground">{formatFileSize(file.fileSize)}</p>
                                </div>
                                <a
                                  href={`/api/document-request-files/${file.id}/download`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 hover:bg-muted rounded-md"
                                  data-testid={`employer-download-file-${file.id}`}
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selectedRequest.status === 'pending' && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Waiting for the technician to upload the requested document.
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
