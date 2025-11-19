import { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Input } from '@/components/ui/input';

interface QRCodeScannerProps {
  onClose: () => void;
}

export function QRCodeScanner({ onClose }: QRCodeScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const linkCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await fetch("/api/link-resident-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residentCode: code }),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to link account");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: `Linked to ${data.companyName}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error linking account",
        description: error.message,
        variant: "destructive",
      });
      setError(error.message);
      setIsProcessing(false);
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      const html5QrCode = new Html5Qrcode("qr-reader-hidden");
      const decodedText = await html5QrCode.scanFile(file, true);
      
      console.log("QR Code detected:", decodedText);
      
      // Check if this is a valid link
      try {
        const url = new URL(decodedText);
        const code = url.searchParams.get('code');
        
        if (code && code.length === 10) {
          // Valid company code found
          toast({
            title: "Code detected!",
            description: "Linking your account...",
          });
          linkCodeMutation.mutate(code.toUpperCase());
        } else {
          setError("Invalid QR code - no company code found");
          setIsProcessing(false);
        }
      } catch (e) {
        setError("This QR code is not a valid company link");
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("QR scan error:", err);
      setError("Could not read QR code from image. Please try again with a clearer photo.");
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Scan Company QR Code</CardTitle>
            <CardDescription>
              Take a photo of the QR code or select from your gallery
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-scanner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            Use your camera to take a photo of the QR code shown on the employee's device
          </p>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
            data-testid="input-qr-file"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-14"
            disabled={isProcessing || linkCodeMutation.isPending}
            data-testid="button-upload-qr"
          >
            <Camera className="mr-2 h-5 w-5" />
            {isProcessing ? "Processing..." : "Take Photo of QR Code"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or select image</span>
            </div>
          </div>

          <Button
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.removeAttribute('capture');
                fileInputRef.current.click();
              }
            }}
            variant="outline"
            className="w-full h-14"
            disabled={isProcessing || linkCodeMutation.isPending}
            data-testid="button-select-qr"
          >
            <Upload className="mr-2 h-5 w-5" />
            Choose from Gallery
          </Button>
        </div>

        {(isProcessing || linkCodeMutation.isPending) && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-center">
              {linkCodeMutation.isPending ? "Linking your account..." : "Reading QR code..."}
            </p>
          </div>
        )}

        <div id="qr-reader-hidden" className="hidden" />
      </CardContent>
    </Card>
  );
}
