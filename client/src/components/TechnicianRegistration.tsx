import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { User, ArrowRight, Award, MapPin, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type CertificationType = "irata" | "sprat" | "both" | "none" | null;

type RegistrationStep = 
  | "firstName"
  | "lastName"
  | "certification"
  | "licenseNumbers"
  | "address"
  | "complete";

interface IrataVerificationResult {
  success: boolean;
  verified: boolean;
  technicianName?: string;
  level?: string;
  expiryDate?: string;
  status?: string;
  error?: string;
  requiresManualVerification?: boolean;
}

interface TechnicianData {
  firstName: string;
  lastName: string;
  certification: CertificationType;
  irataLicenseNumber: string;
  spratLicenseNumber: string;
  address: string;
  irataVerified?: IrataVerificationResult;
  manualVerificationAcknowledged?: boolean;
}

interface TechnicianRegistrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TechnicianRegistration({ open, onOpenChange }: TechnicianRegistrationProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<RegistrationStep>("firstName");
  const [data, setData] = useState<TechnicianData>({
    firstName: "",
    lastName: "",
    certification: null,
    irataLicenseNumber: "",
    spratLicenseNumber: "",
    address: "",
  });
  const [error, setError] = useState("");

  const irataVerifyMutation = useMutation({
    mutationFn: async ({ lastName, irataNumber }: { lastName: string; irataNumber: string }) => {
      const response = await apiRequest("POST", "/api/verify-irata", { lastName, irataNumber });
      return response as IrataVerificationResult;
    },
    onMutate: () => {
      // Reset acknowledgement and previous results before new verification attempt
      setData(prev => ({ ...prev, irataVerified: undefined, manualVerificationAcknowledged: false }));
      setError("");
    },
    onSuccess: (result) => {
      // Store result and ensure acknowledgement is reset
      setData(prev => ({ ...prev, irataVerified: result, manualVerificationAcknowledged: false }));
      if (result.verified) {
        toast({
          title: "IRATA License Verified",
          description: `${result.level || 'Technician'} - Valid until ${result.expiryDate || 'N/A'}`,
        });
        setError("");
      } else if (result.requiresManualVerification || !result.success) {
        // Soft failure - show info toast
        toast({
          title: "Manual Verification Required",
          description: "Please verify your license manually and acknowledge below.",
        });
      } else {
        // Hard failure - show error
        toast({
          title: "License Not Found",
          description: result.error || "Please check your license details",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      // Network/service error - treat as soft failure
      setData(prev => ({ 
        ...prev, 
        irataVerified: { 
          success: false, 
          verified: false, 
          error: error.message || "Could not verify IRATA license" 
        },
        manualVerificationAcknowledged: false 
      }));
      toast({
        title: "Verification Service Error",
        description: error.message || "Could not connect to verification service",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setStep("firstName");
    setData({
      firstName: "",
      lastName: "",
      certification: null,
      irataLicenseNumber: "",
      spratLicenseNumber: "",
      address: "",
    });
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleVerifyIrata = () => {
    if (!data.irataLicenseNumber.trim()) {
      setError("Please enter your IRATA license number first");
      return;
    }
    setError("");
    irataVerifyMutation.mutate({
      lastName: data.lastName,
      irataNumber: data.irataLicenseNumber.trim()
    });
  };

  const handleContinue = () => {
    setError("");
    
    switch (step) {
      case "firstName":
        if (!data.firstName.trim()) {
          setError("Please enter your first name");
          return;
        }
        setStep("lastName");
        break;
      case "lastName":
        if (!data.lastName.trim()) {
          setError("Please enter your last name");
          return;
        }
        setStep("certification");
        break;
      case "certification":
        if (!data.certification) {
          setError("Please select a certification option");
          return;
        }
        if (data.certification === "none") {
          setStep("address");
        } else {
          setStep("licenseNumbers");
        }
        break;
      case "licenseNumbers":
        // Block if verification is in progress
        if (irataVerifyMutation.isPending) {
          setError("Please wait while we verify your IRATA license...");
          return;
        }
        
        if (data.certification === "irata" || data.certification === "both") {
          if (!data.irataLicenseNumber.trim()) {
            setError("Please enter your IRATA license number");
            return;
          }
          // Require verification before proceeding
          if (!data.irataVerified) {
            // Auto-trigger verification
            irataVerifyMutation.mutate({
              lastName: data.lastName,
              irataNumber: data.irataLicenseNumber.trim()
            });
            return;
          }
          
          // Verification passed - allow to continue
          if (data.irataVerified.verified) {
            // Good to proceed
          }
          // Soft failure (CAPTCHA, network, timeout, service unavailable) - allow manual acknowledgement
          else if (data.irataVerified.requiresManualVerification || !data.irataVerified.success) {
            if (!data.manualVerificationAcknowledged) {
              setError("Please acknowledge manual verification by clicking the checkbox below");
              return;
            }
            // Has manual acknowledgement, can proceed
          }
          // Hard failure (technician not found with success=true) - cannot proceed
          else {
            setError("IRATA verification failed. Please check that your last name and license number are correct, then try again.");
            return;
          }
        }
        if (data.certification === "sprat" || data.certification === "both") {
          if (!data.spratLicenseNumber.trim()) {
            setError("Please enter your SPRAT license number");
            return;
          }
        }
        setStep("address");
        break;
      case "address":
        if (!data.address.trim()) {
          setError("Please enter your address");
          return;
        }
        setStep("complete");
        break;
    }
  };

  const handleBack = () => {
    setError("");
    switch (step) {
      case "lastName":
        setStep("firstName");
        break;
      case "certification":
        setStep("lastName");
        break;
      case "licenseNumbers":
        setStep("certification");
        break;
      case "address":
        if (data.certification === "none") {
          setStep("certification");
        } else {
          setStep("licenseNumbers");
        }
        break;
    }
  };

  const handleCertificationSelect = (cert: CertificationType) => {
    setData({ ...data, certification: cert, irataVerified: undefined });
    setError("");
  };

  const renderVerificationStatus = () => {
    if (irataVerifyMutation.isPending) {
      return (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Verifying with IRATA...</span>
        </div>
      );
    }

    if (data.irataVerified) {
      if (data.irataVerified.verified) {
        return (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">License Verified</span>
            </div>
            <div className="space-y-1 text-sm">
              {data.irataVerified.technicianName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{data.irataVerified.technicianName}</span>
                </div>
              )}
              {data.irataVerified.level && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <Badge variant="secondary">{data.irataVerified.level}</Badge>
                </div>
              )}
              {data.irataVerified.expiryDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires:</span>
                  <span>{data.irataVerified.expiryDate}</span>
                </div>
              )}
              {data.irataVerified.status && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={data.irataVerified.status === 'Current' || data.irataVerified.status === 'Active' ? 'default' : 'destructive'}>
                    {data.irataVerified.status}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        );
      } else if (data.irataVerified.requiresManualVerification || !data.irataVerified.success) {
        // Soft failure: CAPTCHA detected, service unavailable, or parsing failed
        // User can proceed after manual acknowledgement
        const isServiceUnavailable = !data.irataVerified.success;
        return (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">
                {isServiceUnavailable ? 'Verification Service Unavailable' : 'Manual Verification Required'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {data.irataVerified.error || 'Automatic verification unavailable. Please verify your license manually at '}
              {!data.irataVerified.error && (
                <a 
                  href="https://techconnect.irata.org/verify/tech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  techconnect.irata.org
                </a>
              )}
            </p>
            <div className="flex items-center space-x-2 pt-2 border-t border-amber-500/20">
              <Checkbox 
                id="manualVerify" 
                checked={data.manualVerificationAcknowledged || false}
                onCheckedChange={(checked) => {
                  setData({ ...data, manualVerificationAcknowledged: checked === true });
                  setError("");
                }}
                data-testid="checkbox-manual-verification"
              />
              <Label htmlFor="manualVerify" className="text-sm cursor-pointer">
                I confirm that I have verified my IRATA license manually
              </Label>
            </div>
          </div>
        );
      } else {
        // Hard failure - technician not found - no bypass allowed
        return (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">License Not Found</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {data.irataVerified.error || 'No technician found with the provided details.'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Please double-check your last name and IRATA license number, then try again.
            </p>
          </div>
        );
      }
    }

    return null;
  };

  const renderStepContent = () => {
    switch (step) {
      case "firstName":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="w-8 h-8 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">What's your first name?</DialogTitle>
              <DialogDescription className="text-center">
                Let's start with your first name
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="firstName" className="sr-only">First Name</Label>
              <Input
                id="firstName"
                data-testid="input-technician-first-name"
                placeholder="Enter your first name"
                value={data.firstName}
                onChange={(e) => setData({ ...data, firstName: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                autoFocus
                className="text-center text-lg h-12"
              />
              {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-first-name"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleClose}
                className="w-full"
                data-testid="button-cancel-registration"
              >
                Cancel
              </Button>
            </DialogFooter>
          </>
        );

      case "lastName":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="w-8 h-8 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Hi {data.firstName}! What's your last name?
              </DialogTitle>
              <DialogDescription className="text-center">
                Now let's get your last name
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="lastName" className="sr-only">Last Name</Label>
              <Input
                id="lastName"
                data-testid="input-technician-last-name"
                placeholder="Enter your last name"
                value={data.lastName}
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                autoFocus
                className="text-center text-lg h-12"
              />
              {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-last-name"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
                data-testid="button-back-to-first-name"
              >
                Back
              </Button>
            </DialogFooter>
          </>
        );

      case "certification":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-amber-500/10">
                  <Award className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Are you certified?
              </DialogTitle>
              <DialogDescription className="text-center">
                Select your rope access certification(s)
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-3">
              <Button
                variant={data.certification === "irata" ? "default" : "outline"}
                className="w-full h-14 text-base justify-start px-4"
                onClick={() => handleCertificationSelect("irata")}
                data-testid="button-cert-irata"
              >
                <Award className="w-5 h-5 mr-3" />
                IRATA Certified
              </Button>
              <Button
                variant={data.certification === "sprat" ? "default" : "outline"}
                className="w-full h-14 text-base justify-start px-4"
                onClick={() => handleCertificationSelect("sprat")}
                data-testid="button-cert-sprat"
              >
                <Award className="w-5 h-5 mr-3" />
                SPRAT Certified
              </Button>
              <Button
                variant={data.certification === "both" ? "default" : "outline"}
                className="w-full h-14 text-base justify-start px-4"
                onClick={() => handleCertificationSelect("both")}
                data-testid="button-cert-both"
              >
                <Award className="w-5 h-5 mr-3" />
                Both IRATA & SPRAT
              </Button>
              <Button
                variant={data.certification === "none" ? "default" : "outline"}
                className="w-full h-14 text-base justify-start px-4"
                onClick={() => handleCertificationSelect("none")}
                data-testid="button-cert-none"
              >
                <User className="w-5 h-5 mr-3" />
                Not Certified
              </Button>
              {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                disabled={!data.certification}
                data-testid="button-continue-certification"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
                data-testid="button-back-to-last-name"
              >
                Back
              </Button>
            </DialogFooter>
          </>
        );

      case "licenseNumbers":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-amber-500/10">
                  <Award className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Enter your license number{data.certification === "both" ? "s" : ""}
              </DialogTitle>
              <DialogDescription className="text-center">
                {data.certification === "both" 
                  ? "Please enter both your IRATA and SPRAT license numbers"
                  : `Please enter your ${data.certification?.toUpperCase()} license number`
                }
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              {(data.certification === "irata" || data.certification === "both") && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="irataLicense">IRATA License Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="irataLicense"
                        data-testid="input-irata-license"
                        placeholder="Enter IRATA license number"
                        value={data.irataLicenseNumber}
                        onChange={(e) => setData({ ...data, irataLicenseNumber: e.target.value, irataVerified: undefined })}
                        className="h-12 flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleVerifyIrata}
                        disabled={irataVerifyMutation.isPending || !data.irataLicenseNumber.trim()}
                        data-testid="button-verify-irata"
                      >
                        {irataVerifyMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </div>
                  </div>
                  {renderVerificationStatus()}
                </div>
              )}
              {(data.certification === "sprat" || data.certification === "both") && (
                <div className="space-y-2">
                  <Label htmlFor="spratLicense">SPRAT License Number</Label>
                  <Input
                    id="spratLicense"
                    data-testid="input-sprat-license"
                    placeholder="Enter SPRAT license number"
                    value={data.spratLicenseNumber}
                    onChange={(e) => setData({ ...data, spratLicenseNumber: e.target.value })}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    SPRAT verification coming soon
                  </p>
                </div>
              )}
              {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                disabled={irataVerifyMutation.isPending}
                data-testid="button-continue-license"
              >
                {irataVerifyMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
                disabled={irataVerifyMutation.isPending}
                data-testid="button-back-to-certification"
              >
                Back
              </Button>
            </DialogFooter>
          </>
        );

      case "address":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <MapPin className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                What's your address?
              </DialogTitle>
              <DialogDescription className="text-center">
                Enter your home address
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="address" className="sr-only">Address</Label>
              <Input
                id="address"
                data-testid="input-technician-address"
                placeholder="Enter your full address"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                autoFocus
                className="text-center text-lg h-12"
              />
              {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-address"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
                data-testid="button-back-to-license"
              >
                Back
              </Button>
            </DialogFooter>
          </>
        );

      case "complete":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Great job, {data.firstName}!
              </DialogTitle>
              <DialogDescription className="text-center">
                Here's a summary of your information
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-3">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{data.firstName} {data.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certification:</span>
                  <span className="font-medium">
                    {data.certification === "both" ? "IRATA & SPRAT" : 
                     data.certification === "none" ? "Not Certified" :
                     data.certification?.toUpperCase()}
                  </span>
                </div>
                {data.irataLicenseNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">IRATA License:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{data.irataLicenseNumber}</span>
                      {data.irataVerified?.verified && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                )}
                {data.irataVerified?.verified && data.irataVerified.level && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IRATA Level:</span>
                    <Badge variant="secondary">{data.irataVerified.level}</Badge>
                  </div>
                )}
                {data.spratLicenseNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SPRAT License:</span>
                    <span className="font-medium">{data.spratLicenseNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium text-right max-w-[200px]">{data.address}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Next steps: We'll help you connect with a rope access company.
              </p>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleClose} 
                className="w-full"
                data-testid="button-complete-registration"
              >
                Done
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setStep("address")}
                className="w-full"
                data-testid="button-back-to-address"
              >
                Back
              </Button>
            </DialogFooter>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
      else onOpenChange(true);
    }}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-technician-registration">
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
