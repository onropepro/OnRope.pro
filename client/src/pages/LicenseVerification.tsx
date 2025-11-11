import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Key } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const licenseSchema = z.object({
  licenseKey: z.string().min(1, "License key is required"),
});

type LicenseFormData = z.infer<typeof licenseSchema>;

export default function LicenseVerification() {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isBypassing, setIsBypassing] = useState(false);
  
  const form = useForm<LicenseFormData>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      licenseKey: "",
    },
  });

  const onSubmit = async (data: LicenseFormData) => {
    setIsVerifying(true);
    try {
      const response = await fetch("/api/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Verification Failed",
          description: result.message || "Invalid license key",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: result.message || "License verified successfully",
      });
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBypass = async () => {
    setIsBypassing(true);
    try {
      const response = await fetch("/api/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bypass: true }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Bypass Failed",
          description: result.message || "Failed to bypass license verification",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Bypass Activated",
        description: "License verification bypassed (development mode)",
      });
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBypassing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-2">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Key className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl">License Verification Required</CardTitle>
              <CardDescription className="text-base">
                Enter your license key to activate your account and access all features.
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Info Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Where to find your license key</AlertTitle>
              <AlertDescription>
                Your license key was provided when you purchased access to this platform from the{" "}
                <a 
                  href="https://overhaullabs.replit.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover-elevate underline font-medium"
                >
                  Overhaul Labs Marketplace
                </a>.
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="licenseKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Key</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your license key" 
                          {...field} 
                          data-testid="input-license-key"
                          disabled={isVerifying || isBypassing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isVerifying || isBypassing}
                    data-testid="button-verify-license"
                  >
                    {isVerifying ? (
                      <>
                        <span className="material-icons animate-spin mr-2">refresh</span>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Verify License
                      </>
                    )}
                  </Button>

                  {/* Bypass Button */}
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full" 
                    size="lg"
                    onClick={handleBypass}
                    disabled={isVerifying || isBypassing}
                    data-testid="button-bypass-license"
                  >
                    {isBypassing ? (
                      <>
                        <span className="material-icons animate-spin mr-2">refresh</span>
                        Bypassing...
                      </>
                    ) : (
                      <>
                        <span className="material-icons mr-2">fast_forward</span>
                        Bypass (Development Mode)
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Help Text */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Need help? Contact{" "}
                <a 
                  href="https://overhaulabs.com/support" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Overhaul Labs Support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
