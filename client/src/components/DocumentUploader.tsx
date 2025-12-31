import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

interface DocumentUploaderProps {
  documents: string[];
  onDocumentsChange: (documents: string[]) => void;
  maxDocuments?: number;
  label?: string;
  description?: string;
}

export function DocumentUploader({
  documents,
  onDocumentsChange,
  maxDocuments = 5,
  label,
  description,
}: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const displayLabel = label || t("common.documents", "Documents");
  const displayDescription = description || t("documentUploader.uploadOrTakePhotos", "Upload documents or take photos");

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (documents.length + files.length > maxDocuments) {
      toast({
        title: t("documentUploader.tooManyDocuments", "Too many documents"),
        description: t("documentUploader.maxDocumentsMessage", `You can only upload up to ${maxDocuments} documents`).replace("{{max}}", String(maxDocuments)),
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("document", file);

        const response = await fetch("/api/upload-employee-document", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to upload document");
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      onDocumentsChange([...documents, ...uploadedUrls]);
      toast({
        title: t("common.success", "Success"),
        description: t("documentUploader.documentsUploaded", `${uploadedUrls.length} document(s) uploaded`).replace("{{count}}", String(uploadedUrls.length)),
      });
    } catch (error) {
      toast({
        title: t("documentUploader.uploadFailed", "Upload failed"),
        description: t("documentUploader.uploadFailedMessage", "Failed to upload one or more documents"),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveDocument = (index: number) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    onDocumentsChange(newDocuments);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">{displayLabel}</label>
        {displayDescription && (
          <p className="text-xs text-muted-foreground mt-1">{displayDescription}</p>
        )}
      </div>

      {documents.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {documents.map((url, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-2">
                <div className="aspect-video bg-muted rounded flex items-center justify-center relative overflow-hidden">
                  {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={url}
                      alt={`${t("common.document", "Document")} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => handleRemoveDocument(index)}
                    data-testid={`button-remove-document-${index}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {documents.length < maxDocuments && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12"
            disabled={uploading}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.capture = "environment";
              input.onchange = (e) => handleFileChange((e.target as HTMLInputElement).files);
              input.click();
            }}
            data-testid="button-take-photo"
          >
            <Camera className="w-4 h-4 mr-2" />
            {t("common.takePhoto", "Take Photo")}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12"
            disabled={uploading}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*,application/pdf";
              input.multiple = true;
              input.onchange = (e) => handleFileChange((e.target as HTMLInputElement).files);
              input.click();
            }}
            data-testid="button-upload-document"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? t("common.uploading", "Uploading...") : t("common.chooseFiles", "Choose Files")}
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {documents.length} / {maxDocuments} {t("common.documentsUploaded", "documents uploaded")}
      </p>
    </div>
  );
}
