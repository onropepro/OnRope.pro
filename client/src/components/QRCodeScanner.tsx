import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface QRCodeScannerProps {
  onClose: () => void;
}

export function QRCodeScanner({ onClose }: QRCodeScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
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
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
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

  const onScanSuccess = (decodedText: string) => {
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
  };

  const onScanError = (errorMessage: string) => {
    // Ignore "NotFoundException" - it's just scanning
    if (errorMessage.includes("NotFoundException")) {
      return;
    }
    console.warn("Scan error:", errorMessage);
  };

  useEffect(() => {
    if (!isInitialized) {
      try {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            // Prefer back camera on mobile
            videoConstraints: {
              facingMode: "environment"
            }
          },
          false // verbose
        );
        
        scannerRef.current = scanner;
        scanner.render(onScanSuccess, onScanError);
        setIsInitialized(true);
      } catch (err: any) {
        console.error("Scanner initialization error:", err);
        setError("Failed to initialize scanner");
      }
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (err) {
          console.error("Error clearing scanner:", err);
        }
      }
    };
  }, [isInitialized]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Scan Company QR Code</CardTitle>
            <CardDescription>
              Point your camera at the company's QR code to link your account
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (scannerRef.current) {
                scannerRef.current.clear();
              }
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
          </div>
        )}

        <div
          id="qr-reader"
          className="w-full"
          data-testid="qr-reader-container"
        />

        {linkCodeMutation.isPending && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-center">Linking your account...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
