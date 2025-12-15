import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, RotateCcw, Check, X, Loader2, CreditCard, ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiRequest } from "@/lib/queryClient";

interface BusinessCardData {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  jobTitle: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  fax: string | null;
  website: string | null;
  address: string | null;
  notes: string | null;
  confidence: "high" | "medium" | "low";
}

interface BusinessCardScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanComplete: (data: BusinessCardData) => void;
}

type ScanStep = "intro" | "front" | "back" | "confirm" | "processing";

export function BusinessCardScanner({ open, onOpenChange, onScanComplete }: BusinessCardScannerProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<ScanStep>("intro");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [frontMimeType, setFrontMimeType] = useState<string>("image/jpeg");
  const [backMimeType, setBackMimeType] = useState<string>("image/jpeg");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setError(t('businessCardScanner.cameraError', 'Unable to access camera. Please use file upload instead.'));
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const base64 = dataUrl.split(",")[1];
      
      if (step === "front") {
        setFrontImage(base64);
        setFrontMimeType("image/jpeg");
      } else if (step === "back") {
        setBackImage(base64);
        setBackMimeType("image/jpeg");
      }
      
      stopCamera();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      const mimeType = file.type || "image/jpeg";
      
      if (step === "front") {
        setFrontImage(base64);
        setFrontMimeType(mimeType);
      } else if (step === "back") {
        setBackImage(base64);
        setBackMimeType(mimeType);
      }
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processBusinessCard = async () => {
    if (!frontImage) {
      setError(t('businessCardScanner.noFrontImage', 'Please capture or upload the front of the business card'));
      return;
    }

    setStep("processing");
    setIsProcessing(true);
    setError(null);

    try {
      const response = await apiRequest("POST", "/api/clients/scan-business-card", {
        frontImage,
        backImage: backImage || undefined,
        frontMimeType,
        backMimeType: backImage ? backMimeType : undefined,
      });

      const result = await response.json() as BusinessCardData & { success: boolean; error?: string };

      if (result.success) {
        onScanComplete(result);
        handleClose();
      } else {
        setError(result.error || t('businessCardScanner.analysisError', 'Failed to analyze business card'));
        setStep("confirm");
      }
    } catch (err: any) {
      console.error("Business card scan error:", err);
      setError(err.message || t('businessCardScanner.unknownError', 'An error occurred'));
      setStep("confirm");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    setStep("intro");
    setFrontImage(null);
    setBackImage(null);
    setError(null);
    onOpenChange(false);
  };

  const retakePhoto = (side: "front" | "back") => {
    if (side === "front") {
      setFrontImage(null);
    } else {
      setBackImage(null);
    }
    setStep(side);
  };

  const renderIntroStep = () => (
    <div className="space-y-6 py-4">
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <CreditCard className="w-12 h-12 text-primary" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">{t('businessCardScanner.title', 'Scan Business Card')}</h3>
        <p className="text-muted-foreground text-sm">
          {t('businessCardScanner.description', 'Take photos of a business card to automatically extract contact information and create a new client.')}
        </p>
      </div>
      <div className="bg-muted/50 rounded-md p-4 space-y-2">
        <p className="text-sm font-medium">{t('businessCardScanner.tips', 'Tips for best results:')}</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>{t('businessCardScanner.tip1', 'Place the card on a flat, contrasting surface')}</li>
          <li>{t('businessCardScanner.tip2', 'Ensure good lighting without glare')}</li>
          <li>{t('businessCardScanner.tip3', 'Keep the camera steady and card in focus')}</li>
        </ul>
      </div>
      <Button onClick={() => setStep("front")} className="w-full" data-testid="button-start-scan">
        {t('businessCardScanner.startScanning', 'Start Scanning')}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  const renderCaptureStep = (side: "front" | "back") => {
    const currentImage = side === "front" ? frontImage : backImage;
    
    return (
      <div className="space-y-4 py-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">
            {side === "front" 
              ? t('businessCardScanner.frontSide', 'Front Side') 
              : t('businessCardScanner.backSide', 'Back Side (Optional)')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {side === "front"
              ? t('businessCardScanner.captureFront', 'Capture or upload the front of the business card')
              : t('businessCardScanner.captureBack', 'Add the back side if it contains additional information')}
          </p>
        </div>

        {currentImage ? (
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src={`data:${side === "front" ? frontMimeType : backMimeType};base64,${currentImage}`}
                  alt={side === "front" ? "Front of business card" : "Back of business card"}
                  className="w-full h-auto max-h-64 object-contain bg-muted"
                />
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => retakePhoto(side)} className="flex-1" data-testid={`button-retake-${side}`}>
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('businessCardScanner.retake', 'Retake')}
              </Button>
              <Button 
                onClick={() => {
                  if (side === "front") {
                    setStep("back");
                  } else {
                    setStep("confirm");
                  }
                }} 
                className="flex-1"
                data-testid={`button-continue-${side}`}
              >
                <Check className="w-4 h-4 mr-2" />
                {t('businessCardScanner.continue', 'Continue')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isCameraActive ? (
              <div className="space-y-4">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-auto max-h-64 object-cover bg-black"
                    />
                  </CardContent>
                </Card>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={stopCamera} className="flex-1" data-testid="button-cancel-camera">
                    <X className="w-4 h-4 mr-2" />
                    {t('businessCardScanner.cancel', 'Cancel')}
                  </Button>
                  <Button onClick={capturePhoto} className="flex-1" data-testid="button-capture">
                    <Camera className="w-4 h-4 mr-2" />
                    {t('businessCardScanner.capture', 'Capture')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Button onClick={startCamera} variant="outline" className="w-full h-32 flex-col gap-2" data-testid="button-use-camera">
                  <Camera className="w-8 h-8" />
                  <span>{t('businessCardScanner.useCamera', 'Use Camera')}</span>
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">{t('businessCardScanner.or', 'or')}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full h-16"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-upload-file"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {t('businessCardScanner.uploadFile', 'Upload from Device')}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="text-destructive text-sm text-center p-2 bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="ghost" 
            onClick={() => {
              stopCamera();
              if (side === "front") {
                setStep("intro");
              } else {
                setStep("front");
              }
            }}
            data-testid="button-back-step"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('businessCardScanner.back', 'Back')}
          </Button>
          {side === "back" && !backImage && (
            <Button 
              variant="ghost" 
              onClick={() => setStep("confirm")} 
              className="ml-auto"
              data-testid="button-skip-back"
            >
              {t('businessCardScanner.skipBack', 'Skip Back Side')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderConfirmStep = () => (
    <div className="space-y-4 py-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">{t('businessCardScanner.reviewPhotos', 'Review Photos')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('businessCardScanner.reviewDescription', 'Confirm your photos before processing')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-center">{t('businessCardScanner.frontSide', 'Front Side')}</p>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {frontImage ? (
                <img 
                  src={`data:${frontMimeType};base64,${frontImage}`}
                  alt="Front of business card"
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-muted flex items-center justify-center">
                  <X className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={() => retakePhoto("front")}
            data-testid="button-edit-front"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            {t('businessCardScanner.retake', 'Retake')}
          </Button>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-center">{t('businessCardScanner.backSide', 'Back Side')}</p>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {backImage ? (
                <img 
                  src={`data:${backMimeType};base64,${backImage}`}
                  alt="Back of business card"
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-muted flex items-center justify-center text-muted-foreground text-xs">
                  {t('businessCardScanner.notCaptured', 'Not captured')}
                </div>
              )}
            </CardContent>
          </Card>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={() => setStep("back")}
            data-testid="button-edit-back"
          >
            {backImage ? (
              <>
                <RotateCcw className="w-3 h-3 mr-1" />
                {t('businessCardScanner.retake', 'Retake')}
              </>
            ) : (
              <>
                <Camera className="w-3 h-3 mr-1" />
                {t('businessCardScanner.addBackSide', 'Add Back')}
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-destructive text-sm text-center p-2 bg-destructive/10 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={() => setStep("back")} data-testid="button-back-to-capture">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('businessCardScanner.back', 'Back')}
        </Button>
        <Button onClick={processBusinessCard} className="flex-1" data-testid="button-analyze">
          <Check className="w-4 h-4 mr-2" />
          {t('businessCardScanner.analyzeCard', 'Analyze Card')}
        </Button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="py-12 text-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
      <div>
        <h3 className="text-lg font-semibold">{t('businessCardScanner.analyzing', 'Analyzing Business Card')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('businessCardScanner.pleaseWait', 'Please wait while we extract contact information...')}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('businessCardScanner.dialogTitle', 'Scan Business Card')}</DialogTitle>
          <DialogDescription>
            {t('businessCardScanner.dialogDescription', 'Capture a business card to automatically create a client')}
          </DialogDescription>
        </DialogHeader>

        {step === "intro" && renderIntroStep()}
        {step === "front" && renderCaptureStep("front")}
        {step === "back" && renderCaptureStep("back")}
        {step === "confirm" && renderConfirmStep()}
        {step === "processing" && renderProcessingStep()}
      </DialogContent>
    </Dialog>
  );
}
