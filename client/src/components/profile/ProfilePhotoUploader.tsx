import { useState, useRef } from "react";
import { Camera, HardHat, Loader2, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ProfilePhotoUploaderProps {
  photoUrl: string | null;
  userName: string;
  onPhotoUploaded?: (url: string) => void;
}

export function ProfilePhotoUploader({
  photoUrl,
  userName,
  onPhotoUploaded,
}: ProfilePhotoUploaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, GIF, or WebP)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);

      const response = await fetch("/api/technician/profile-photo", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload photo");
      }

      const data = await response.json();
      
      toast({
        title: "Photo updated",
        description: "Your profile photo has been updated successfully",
      });

      setIsDialogOpen(false);
      setPreviewUrl(null);
      setSelectedFile(null);
      
      if (onPhotoUploaded) {
        onPhotoUploaded(data.photoUrl);
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    setIsUploading(true);
    try {
      const response = await apiRequest("DELETE", "/api/technician/profile-photo");
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete photo");
      }

      toast({
        title: "Photo removed",
        description: "Your profile photo has been removed",
      });

      setIsDialogOpen(false);
      
      if (onPhotoUploaded) {
        onPhotoUploaded("");
      }
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to remove profile photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetDialog = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="relative group cursor-pointer"
        data-testid="button-profile-photo"
      >
        <Avatar className="w-14 h-14 sm:w-16 sm:h-16">
          <AvatarImage src={photoUrl || undefined} alt={userName} />
          <AvatarFallback className="bg-primary/10">
            {photoUrl ? (
              getInitials(userName)
            ) : (
              <HardHat className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-5 h-5 text-white" />
        </div>
      </button>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetDialog();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update profile picture</DialogTitle>
            <DialogDescription>
              Upload a new photo or remove your current one
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={previewUrl || photoUrl || undefined}
                  alt={userName}
                />
                <AvatarFallback className="bg-primary/10 text-2xl">
                  {photoUrl || previewUrl ? (
                    getInitials(userName)
                  ) : (
                    <HardHat className="w-12 h-12 text-primary" />
                  )}
                </AvatarFallback>
              </Avatar>

              <p className="text-sm text-muted-foreground text-center">
                PNG, JPG, GIF or WebP (max 5MB)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-profile-photo"
            />

            <div className="flex flex-col gap-2">
              <Button
                variant="default"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                data-testid="button-select-photo"
              >
                {selectedFile ? "Change photo" : "Upload new picture"}
              </Button>

              {selectedFile && (
                <Button
                  variant="default"
                  onClick={handleUpload}
                  disabled={isUploading}
                  data-testid="button-save-photo"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              )}

              {photoUrl && !selectedFile && (
                <Button
                  variant="destructive"
                  onClick={handleDeletePhoto}
                  disabled={isUploading}
                  data-testid="button-delete-photo"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
