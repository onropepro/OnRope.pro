import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  Clock,
  Building2,
  Download,
  X,
  AlertCircle,
  File,
  FileImage,
  FileArchive,
  Send
} from "lucide-react";
import { format } from "date-fns";
import type { TechnicianDocumentRequest, TechnicianDocumentRequestFile } from "@shared/schema";

type Language = 'en' | 'fr';

interface DocumentRequestWithDetails extends TechnicianDocumentRequest {
  files: TechnicianDocumentRequestFile[];
  company?: {
    id: string;
    companyName?: string | null;
    name?: string | null;
  };
}

interface TechnicianDocumentRequestsProps {
  language?: Language;
}

const translations = {
  en: {
    title: "Document Requests",
    subtitle: "Documents requested by your employers",
    noRequests: "No document requests",
    noRequestsDesc: "You don't have any pending document requests from employers.",
    pending: "Pending",
    fulfilled: "Fulfilled",
    cancelled: "Cancelled",
    requestedBy: "Requested by",
    requestedOn: "Requested on",
    details: "Details",
    uploadFiles: "Upload Files",
    uploadedFiles: "Uploaded Files",
    responseNote: "Response Note (Optional)",
    responseNotePlaceholder: "Add any notes for the employer about these documents...",
    submitResponse: "Submit Response",
    submitting: "Submitting...",
    dropFilesHere: "Drop files here or click to browse",
    supportedFormats: "PDF, images, documents up to 25MB each",
    removeFile: "Remove file",
    downloadFile: "Download file",
    filesUploaded: "files uploaded",
    respondedOn: "Responded on",
    markAsFulfilled: "Mark as Fulfilled",
    atLeastOneFile: "Please upload at least one file",
    uploadSuccess: "Files uploaded successfully",
    fulfillSuccess: "Document request fulfilled",
    uploadError: "Failed to upload files",
    fulfillError: "Failed to submit response",
    loading: "Loading document requests...",
    viewDetails: "View Details",
    noFilesYet: "No files uploaded yet",
    yourResponse: "Your Response",
  },
  fr: {
    title: "Demandes de documents",
    subtitle: "Documents demandes par vos employeurs",
    noRequests: "Aucune demande de document",
    noRequestsDesc: "Vous n'avez aucune demande de document en attente de vos employeurs.",
    pending: "En attente",
    fulfilled: "Complete",
    cancelled: "Annule",
    requestedBy: "Demande par",
    requestedOn: "Demande le",
    details: "Details",
    uploadFiles: "Telecharger des fichiers",
    uploadedFiles: "Fichiers telecharges",
    responseNote: "Note de reponse (Optionnel)",
    responseNotePlaceholder: "Ajoutez des notes pour l'employeur concernant ces documents...",
    submitResponse: "Soumettre la reponse",
    submitting: "Soumission...",
    dropFilesHere: "Deposez des fichiers ici ou cliquez pour parcourir",
    supportedFormats: "PDF, images, documents jusqu'a 25 Mo chacun",
    removeFile: "Supprimer le fichier",
    downloadFile: "Telecharger le fichier",
    filesUploaded: "fichiers telecharges",
    respondedOn: "Repondu le",
    markAsFulfilled: "Marquer comme complete",
    atLeastOneFile: "Veuillez telecharger au moins un fichier",
    uploadSuccess: "Fichiers telecharges avec succes",
    fulfillSuccess: "Demande de document completee",
    uploadError: "Echec du telechargement des fichiers",
    fulfillError: "Echec de la soumission de la reponse",
    loading: "Chargement des demandes de documents...",
    viewDetails: "Voir les details",
    noFilesYet: "Aucun fichier telecharge",
    yourResponse: "Votre reponse",
  }
};

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

export function TechnicianDocumentRequests({ language = 'en' }: TechnicianDocumentRequestsProps) {
  const { toast } = useToast();
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequestWithDetails | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [responseNote, setResponseNote] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: requestsData, isLoading } = useQuery<{ requests: DocumentRequestWithDetails[] }>({
    queryKey: ["/api/technicians/me/document-requests"],
  });

  const uploadFilesMutation = useMutation({
    mutationFn: async ({ requestId, files }: { requestId: string; files: File[] }) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      const response = await fetch(`/api/technicians/document-requests/${requestId}/files`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/technicians/me/document-requests"] });
      toast({ title: t.uploadSuccess });
    },
    onError: () => {
      toast({ title: t.uploadError, variant: "destructive" });
    },
  });

  const fulfillRequestMutation = useMutation({
    mutationFn: async ({ requestId, responseNote }: { requestId: string; responseNote?: string }) => {
      return apiRequest("PATCH", `/api/technicians/document-requests/${requestId}`, {
        status: 'fulfilled',
        responseNote,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/technicians/me/document-requests"] });
      toast({ title: t.fulfillSuccess });
      setSelectedRequest(null);
      setFilesToUpload([]);
      setResponseNote("");
    },
    onError: () => {
      toast({ title: t.fulfillError, variant: "destructive" });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFilesToUpload(prev => [...prev, ...files].slice(0, 10));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setFilesToUpload(prev => [...prev, ...files].slice(0, 10));
  };

  const handleSubmitResponse = async () => {
    if (!selectedRequest) return;
    
    const totalFiles = (selectedRequest.files?.length || 0) + filesToUpload.length;
    if (totalFiles === 0) {
      toast({ title: t.atLeastOneFile, variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      if (filesToUpload.length > 0) {
        await uploadFilesMutation.mutateAsync({ 
          requestId: selectedRequest.id, 
          files: filesToUpload 
        });
      }
      
      await fulfillRequestMutation.mutateAsync({ 
        requestId: selectedRequest.id, 
        responseNote: responseNote.trim() || undefined 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const requests = requestsData?.requests || [];
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const fulfilledRequests = requests.filter(r => r.status === 'fulfilled');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground mt-2">{t.loading}</p>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {t.title}
          </CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-medium">{t.noRequests}</h3>
          <p className="text-sm text-muted-foreground mt-1">{t.noRequestsDesc}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {t.title}
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingRequests.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {pendingRequests.length > 0 && (
              <AccordionItem value="pending">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>{t.pending}</span>
                    <Badge variant="secondary">{pendingRequests.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 border rounded-lg hover-elevate cursor-pointer"
                        onClick={() => setSelectedRequest(request)}
                        data-testid={`doc-request-pending-${request.id}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{request.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Building2 className="w-3 h-3" />
                              <span>{request.company?.companyName || request.company?.name || 'Unknown Company'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {t.requestedOn} {format(new Date(request.requestedAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" className="gap-1.5">
                            <Upload className="w-3 h-3" />
                            {t.uploadFiles}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {fulfilledRequests.length > 0 && (
              <AccordionItem value="fulfilled">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{t.fulfilled}</span>
                    <Badge variant="outline">{fulfilledRequests.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {fulfilledRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 border rounded-lg hover-elevate cursor-pointer"
                        onClick={() => setSelectedRequest(request)}
                        data-testid={`doc-request-fulfilled-${request.id}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{request.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Building2 className="w-3 h-3" />
                              <span>{request.company?.companyName || request.company?.name || 'Unknown Company'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {t.respondedOn} {request.respondedAt ? format(new Date(request.respondedAt), 'MMM d, yyyy') : '-'}
                            </p>
                          </div>
                          <Badge variant="default" className="gap-1">
                            <FileText className="w-3 h-3" />
                            {request.files?.length || 0} {t.filesUploaded}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>

      <Dialog open={!!selectedRequest} onOpenChange={(open) => {
        if (!open) {
          setSelectedRequest(null);
          setFilesToUpload([]);
          setResponseNote("");
        }
      }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" data-testid="dialog-document-request-details">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  {selectedRequest.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {selectedRequest.company?.companyName || selectedRequest.company?.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t.requestedOn}</span>
                  <span>{format(new Date(selectedRequest.requestedAt), 'MMM d, yyyy h:mm a')}</span>
                </div>

                {selectedRequest.details && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">{t.details}</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedRequest.details}</p>
                  </div>
                )}

                <Separator />

                {selectedRequest.files && selectedRequest.files.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">{t.uploadedFiles}</p>
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
                              onClick={(e) => e.stopPropagation()}
                              data-testid={`download-file-${file.id}`}
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedRequest.status === 'pending' && (
                  <>
                    <div>
                      <p className="text-sm font-medium mb-2">{t.uploadFiles}</p>
                      <div
                        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        data-testid="drop-zone-files"
                      >
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">{t.dropFilesHere}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t.supportedFormats}</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileSelect}
                          accept="*/*"
                          data-testid="input-file-upload"
                        />
                      </div>

                      {filesToUpload.length > 0 && (
                        <div className="space-y-2 mt-3">
                          {filesToUpload.map((file, index) => {
                            const FileIcon = getFileIcon(file.type);
                            return (
                              <div key={index} className="flex items-center gap-3 p-2 border rounded-md bg-muted/30">
                                <FileIcon className="w-5 h-5 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-7 h-7"
                                  onClick={() => setFilesToUpload(prev => prev.filter((_, i) => i !== index))}
                                  data-testid={`remove-file-${index}`}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="responseNote">{t.responseNote}</Label>
                      <Textarea
                        id="responseNote"
                        value={responseNote}
                        onChange={(e) => setResponseNote(e.target.value)}
                        placeholder={t.responseNotePlaceholder}
                        className="mt-1.5"
                        data-testid="input-response-note"
                      />
                    </div>
                  </>
                )}

                {selectedRequest.status === 'fulfilled' && selectedRequest.responseNote && (
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">{t.yourResponse}</p>
                    <p className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">{selectedRequest.responseNote}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedRequest(null);
                    setFilesToUpload([]);
                    setResponseNote("");
                  }}
                  data-testid="button-close-request"
                >
                  {selectedRequest.status === 'fulfilled' ? 'Close' : 'Cancel'}
                </Button>
                {selectedRequest.status === 'pending' && (
                  <Button
                    onClick={handleSubmitResponse}
                    disabled={isUploading || ((selectedRequest.files?.length || 0) + filesToUpload.length === 0)}
                    className="gap-1.5"
                    data-testid="button-submit-response"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.submitting}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t.submitResponse}
                      </>
                    )}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
