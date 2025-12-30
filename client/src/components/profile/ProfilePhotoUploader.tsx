import { useState, useRef, useCallback } from "react";
import { Camera, HardHat, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import Cropper from "react-easy-crop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface ProfilePhotoUploaderProps {
  photoUrl: string | null;
  userName: string;
  onPhotoUploaded?: (url: string) => void;
}

interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CroppedAreaPixels
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas is empty"));
        }
      },
      "image/jpeg",
      0.9
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

export function ProfilePhotoUploader({
  photoUrl,
  userName,
  onPhotoUploaded,
}: ProfilePhotoUploaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
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

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedAreaPixels: CroppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

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

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      const formData = new FormData();
      formData.append("photo", croppedBlob, "profile-photo.jpg");

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
      resetDialog();
      
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
      const response = await fetch("/api/technician/profile-photo", {
        method: "DELETE",
        credentials: "include",
      });
      
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
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
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
              {imageSrc
                ? "Drag to reposition, use slider to zoom"
                : "Upload a new photo or remove your current one"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {imageSrc ? (
              <>
                <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                
                <div className="flex items-center gap-3 px-2">
                  <ZoomOut className="w-4 h-4 text-muted-foreground" />
                  <Slider
                    value={[zoom]}
                    min={1}
                    max={3}
                    step={0.1}
                    onValueChange={(value) => setZoom(value[0])}
                    className="flex-1"
                    data-testid="slider-zoom"
                  />
                  <ZoomIn className="w-4 h-4 text-muted-foreground" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={photoUrl || undefined} alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-2xl">
                    {photoUrl ? (
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
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-profile-photo"
            />

            <div className="flex flex-col gap-2">
              {imageSrc ? (
                <>
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
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetDialog();
                    }}
                    disabled={isUploading}
                    data-testid="button-cancel-crop"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="default"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    data-testid="button-select-photo"
                  >
                    Upload new picture
                  </Button>

                  {photoUrl && (
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
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
