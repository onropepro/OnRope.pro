import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface QRCodeScannerProps {
  onClose: () => void;
}

export function QRCodeScanner({ onClose }: QRCodeScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
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
      stopScanning();
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error linking account",
        description: error.message,
        variant: "destructive",
      });
      setError(error.message);
    },
  });

  const startScanning = async () => {
    if (isScanning) return;
    
    setError(null);
    
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await scanner.start(
        { facingMode: "environment" },  // Use rear camera
        config,
        (decodedText) => {
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
            }
          } catch (e) {
            setError("This QR code is not a valid company link");
          }
        },
        (errorMessage) => {
          // Scanning errors are normal while searching for QR code
          // Only log non-"NotFoundException" errors
          if (!errorMessage.includes("NotFoundException")) {
            console.warn("Scan warning:", errorMessage);
          }
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Camera error:", err);
      let errorMsg = "Failed to access camera. ";
      
      if (err.message?.includes("NotAllowedError") || err.message?.includes("Permission")) {
        errorMsg += "Please allow camera access in your browser settings.";
      } else if (err.message?.includes("NotFoundError")) {
        errorMsg += "No camera found on your device.";
      } else if (err.message?.includes("NotReadableError")) {
        errorMsg += "Camera is already in use by another application.";
      } else {
        errorMsg += err.message || "Unknown error.";
      }
      
      setError(errorMsg);
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setIsScanning(false);
    scannerRef.current = null;
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Scan Company QR Code</CardTitle>
            <CardDescription>
              Point your camera at the QR code to link your account
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              stopScanning();
              onClose();
            }}
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
            {!isScanning && (
              <Button
                onClick={() => {
                  setError(null);
                  startScanning();
                }}
                variant="outline"
                className="mt-3 w-full"
                data-testid="button-retry-camera"
              >
                Try Again
              </Button>
            )}
          </div>
        )}

        {!isScanning && !linkCodeMutation.isPending && (
          <Button
            onClick={startScanning}
            className="w-full h-14"
            data-testid="button-start-camera"
          >
            <Camera className="mr-2 h-5 w-5" />
            Start Camera
          </Button>
        )}

        <div
          id="qr-reader"
          className={`${isScanning ? 'block' : 'hidden'} w-full`}
          style={{ minHeight: isScanning ? '300px' : '0' }}
          data-testid="qr-reader-container"
        />

        {isScanning && (
          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              Position the QR code within the frame
            </p>
            <Button
              onClick={stopScanning}
              variant="outline"
              className="w-full"
              data-testid="button-stop-camera"
            >
              Stop Camera
            </Button>
          </div>
        )}

        {linkCodeMutation.isPending && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-center">Linking your account...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
