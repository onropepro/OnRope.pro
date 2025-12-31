import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowRight, ArrowLeft, Loader2, 
  Check, Shield, Clock, DollarSign, Users,
  BarChart3, Eye, EyeOff, Building2, Lock, CreditCard
} from "lucide-react";
import { 
  PRICING, 
  TRIAL_PERIOD_DAYS,
  type BillingFrequency 
} from "@shared/stripe-config";
import { RegistrationEmbeddedCheckout } from "./RegistrationEmbeddedCheckout";

type RegistrationStep = "welcome" | "companyDetails" | "payment" | "processing" | "success";

interface EmployerData {
  companyName: string;
  ownerName: string;
  email: string;
  password: string;
  confirmPassword: string;
  billingFrequency: BillingFrequency;
}

interface EmployerRegistrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPLOYER_COLOR = "#0B64A3";

interface ProcessingStatus {
  step: number;
  message: string;
}

const PROCESSING_STEPS = [
  "Verifying payment...",
  "Creating your company account...",
  "Setting up your dashboard...",
  "Configuring permissions...",
  "Finalizing setup...",
];

export function EmployerRegistration({ open, onOpenChange }: EmployerRegistrationProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<RegistrationStep>("welcome");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({ step: 0, message: PROCESSING_STEPS[0] });
  const [registrationResult, setRegistrationResult] = useState<{ companyName: string; trialEnd: number | null } | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, []);
  const [data, setData] = useState<EmployerData>({
    companyName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    billingFrequency: "monthly",
  });
  const [error, setError] = useState("");

  const resetForm = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setStep("welcome");
    setData({
      companyName: "",
      ownerName: "",
      email: "",
      password: "",
      confirmPassword: "",
      billingFrequency: "monthly",
    });
    setError("");
    setSessionId(null);
    setProcessingStatus({ step: 0, message: PROCESSING_STEPS[0] });
    setRegistrationResult(null);
  };

  const completeRegistration = async (checkoutSessionId: string) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    try {
      setStep("processing");
      setProcessingStatus({ step: 0, message: PROCESSING_STEPS[0] });

      progressIntervalRef.current = setInterval(() => {
        setProcessingStatus(prev => {
          const nextStep = Math.min(prev.step + 1, PROCESSING_STEPS.length - 1);
          return { step: nextStep, message: PROCESSING_STEPS[nextStep] };
        });
      }, 2500);

      const response = await fetch(`/api/stripe/complete-registration/${checkoutSessionId}`, {
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setRegistrationResult({
          companyName: result.companyName || data.companyName,
          trialEnd: result.trialEnd,
        });
        setStep("success");
        
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        
        toast({
          title: "Registration Complete!",
          description: "Your company account has been created successfully.",
        });
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("[Registration] Error completing registration:", err);
      setError(err.message || "Failed to complete registration");
      setStep("payment");
      toast({
        title: "Registration Error",
        description: err.message || "Failed to complete registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const registrationMutation = useMutation({
    mutationFn: async (formData: EmployerData) => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          name: formData.ownerName,
          email: formData.email,
          passwordHash: formData.password,
          billingFrequency: formData.billingFrequency,
          role: "company",
        }),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
      return response.json();
    },
    onSuccess: () => {
      setStep("success");
      toast({
        title: "Registration Complete!",
        description: "Your company account has been created successfully.",
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const validateCompanyDetails = (): boolean => {
    if (!data.companyName.trim()) {
      setError("Company name is required");
      return false;
    }
    if (!data.ownerName.trim()) {
      setError("Owner name is required");
      return false;
    }
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError("Valid email is required");
      return false;
    }
    if (!data.password || data.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    setError("");
    
    if (step === "welcome") {
      setStep("companyDetails");
    } else if (step === "companyDetails") {
      if (validateCompanyDetails()) {
        setStep("payment");
      }
    } else if (step === "payment") {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "companyDetails") {
      setStep("welcome");
    } else if (step === "payment") {
      setStep("companyDetails");
    }
  };

  const handleSubmit = async () => {
    registrationMutation.mutate(data);
  };

  const getStepNumber = () => {
    if (step === "companyDetails") return 1;
    if (step === "payment") return 2;
    if (step === "processing") return 3;
    if (step === "success") return 3;
    return 0;
  };

  const sidebarBenefits = [
    { icon: Users, text: "Access our job board and reach 1000's of qualified techs" },
    { icon: BarChart3, text: "Real-time project tracking and budget monitoring" },
    { icon: Clock, text: "Eliminate 4-8 hours of payroll processing per pay period" },
    { icon: Shield, text: "Digital safety documentation for audits and compliance" },
    { icon: Lock, text: "44 individual permission levels for complete access control" },
    { icon: DollarSign, text: "15-20% improvement in quote accuracy" },
  ];

  const welcomeBenefits = [
    "Post jobs on our Rope Access Only Job Board",
    "Track every project and every drop in one central dashboard",
    "Clock in/out flows directly to payroll",
    "Complete audit trail for safety compliance",
    "Real-time budget vs. actual monitoring",
  ];

  const trialBenefits = [
    "Full access to all features",
    "Cancel anytime with data export",
    "Priority support during trial",
    "No charge until trial ends",
  ];

  const monthlyPrice = PRICING.base.monthly;
  const monthlySeatPrice = PRICING.seat.monthly;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden max-h-[90vh]">
        <div className="flex flex-col lg:flex-row min-h-[600px] max-h-[90vh]">
          {/* Left Panel - Ocean Blue sidebar (Employer color) */}
          <div className="hidden lg:flex lg:w-[320px] bg-[#0B64A3] text-white p-8 flex-col">
            <div className="mb-8">
              <Building2 className="w-10 h-10 mb-4" />
              <h2 className="text-xl font-bold mb-2">Rope Access Business Management</h2>
              <p className="text-white/80 text-sm">Everything connected. Nothing lost.</p>
            </div>
            
            {/* Progress Steps */}
            <div className="space-y-4 mb-8">
              <div className={`flex items-center gap-3 ${getStepNumber() >= 1 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepNumber() >= 1 ? 'bg-white text-[#0B64A3]' : 'bg-white/20'}`}>
                  {getStepNumber() > 1 ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <span className="text-sm font-medium">Account Details</span>
              </div>
              <div className={`flex items-center gap-3 ${getStepNumber() >= 2 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepNumber() >= 2 ? 'bg-white text-[#0B64A3]' : 'bg-white/20'}`}>
                  {getStepNumber() > 2 ? <Check className="w-4 h-4" /> : "2"}
                </div>
                <span className="text-sm font-medium">Billing Details</span>
              </div>
              <div className={`flex items-center gap-3 ${getStepNumber() >= 3 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepNumber() >= 3 ? 'bg-white text-[#0B64A3]' : 'bg-white/20'}`}>
                  {getStepNumber() >= 3 ? <Check className="w-4 h-4" /> : "3"}
                </div>
                <span className="text-sm font-medium">Complete</span>
              </div>
            </div>

            {/* Benefits - only show on welcome and company details steps */}
            {(step === "welcome" || step === "companyDetails") && (
              <div className="mt-auto">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-3">What You Get:</p>
                <div className="space-y-3">
                  {sidebarBenefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <benefit.icon className="w-4 h-4 text-white/80 mt-0.5 shrink-0" />
                      <span className="text-white/90">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Form content */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 p-8 lg:p-10">
              {/* Welcome Screen */}
              {step === "welcome" && (
                <div className="h-full flex flex-col justify-center max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B64A3]/10 border border-[#0B64A3]/20 mb-3">
                      <Building2 className="w-4 h-4 text-[#0B64A3]" />
                      <span className="text-xs font-medium text-[#0B64A3] text-center leading-tight">
                        For Rope Access Company Owners
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{TRIAL_PERIOD_DAYS} Days Free</h1>
                    <p className="text-muted-foreground">Full access to all features. No commitment.</p>
                  </div>

                  {/* Benefits section - now first */}
                  <div className="space-y-1.5 mb-4">
                    {welcomeBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded-md bg-muted/50">
                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Trial benefits */}
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                      Included in your trial:
                    </p>
                    <div className="space-y-1">
                      {trialBenefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 py-1 px-2 rounded-md bg-[#0B64A3]/5 border border-[#0B64A3]/10">
                          <div className="w-5 h-5 rounded-full bg-[#0B64A3]/20 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-[#0B64A3]" />
                          </div>
                          <span className="text-xs text-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing - now secondary, below features */}
                  <div className="text-center text-sm text-muted-foreground mb-4 py-3 border-t border-b border-border/50">
                    <p>
                      After trial: <span className="font-medium text-foreground">${monthlyPrice}/month</span>
                      {" "}+ ${monthlySeatPrice}/seat
                    </p>
                    <p className="text-xs mt-1">Cancel anytime during trial. Annual plans available later.</p>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full gap-2 rounded-full bg-[#0B64A3] hover:bg-[#0B64A3]/90"
                    onClick={handleContinue}
                    data-testid="button-get-started"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-4">
                    Already have an account?{" "}
                    <button 
                      onClick={handleClose}
                      className="text-[#0B64A3] hover:underline font-medium"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              )}

              {/* Company Details Step */}
              {step === "companyDetails" && (
                <div className="max-w-md mx-auto">
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
                    data-testid="button-back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  <h2 className="text-xl font-bold mb-1">Account Details</h2>
                  <p className="text-sm text-muted-foreground mb-6">Tell us about your rope access business</p>

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="ABC Rope Access Ltd."
                        value={data.companyName}
                        onChange={(e) => setData({ ...data, companyName: e.target.value })}
                        data-testid="input-company-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name</Label>
                      <Input
                        id="ownerName"
                        placeholder="John Smith"
                        value={data.ownerName}
                        onChange={(e) => setData({ ...data, ownerName: e.target.value })}
                        data-testid="input-owner-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a secure password"
                          value={data.password}
                          onChange={(e) => setData({ ...data, password: e.target.value })}
                          data-testid="input-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={data.confirmPassword}
                          onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                          data-testid="input-confirm-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-[#0B64A3] hover:bg-[#0B64A3]/90"
                      onClick={handleContinue}
                      data-testid="button-continue"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <p className="text-xs text-center mt-2 text-[#ff0000]">
                      <Lock className="w-3 h-3 inline mr-1" />
                      You won't be charged during your {TRIAL_PERIOD_DAYS}-day trial
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Step - Placeholder for Stripe Embedded Checkout */}
              {step === "payment" && (
                <div className="max-w-md mx-auto">
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
                    data-testid="button-back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  <h2 className="text-xl font-bold mb-1">Billing Details</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Enter your billing details to start your {TRIAL_PERIOD_DAYS}-day free trial
                  </p>

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
                      {error}
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>OnRopePro Base Plan (Monthly)</span>
                        <span className="font-medium">
                          ${monthlyPrice}/mo
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Billing Cycle</span>
                        <span>Monthly</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>Free trial</span>
                          <span>{TRIAL_PERIOD_DAYS} days</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          You won't be charged until your trial ends
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stripe Embedded Checkout */}
                  <div className="border rounded-lg overflow-hidden">
                    <RegistrationEmbeddedCheckout
                      companyName={data.companyName}
                      ownerName={data.ownerName}
                      email={data.email}
                      password={data.password}
                      billingFrequency={data.billingFrequency}
                      onComplete={(checkoutSessionId) => {
                        setSessionId(checkoutSessionId);
                        completeRegistration(checkoutSessionId);
                      }}
                      onError={(errorMsg) => setError(errorMsg)}
                    />
                  </div>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                    Your billing address will be used as your company address.
                  </p>
                </div>
              )}

              {/* Processing Step - Shows immediately when Stripe checkout completes */}
              {step === "processing" && (
                <div className="h-full flex flex-col justify-center items-center max-w-md mx-auto text-center py-8">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-2">Setting up your account...</h2>
                  <p className="text-muted-foreground mb-6">
                    Just a moment while we finalize everything.
                  </p>

                  {/* Progress indicator */}
                  <div className="w-full space-y-4 mb-6">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${((processingStatus.step + 1) / PROCESSING_STEPS.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground animate-pulse">
                      {processingStatus.message}
                    </p>
                  </div>

                  {/* Helpful tips while waiting */}
                  <div className="w-full bg-muted/50 rounded-lg p-4 text-left">
                    <h3 className="font-medium text-sm mb-2">While you wait...</h3>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500" />
                        Your payment has been confirmed
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500" />
                        {TRIAL_PERIOD_DAYS}-day free trial activated
                      </li>
                      <li className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Creating your workspace
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Success Step */}
              {step === "success" && (
                <div className="h-full flex flex-col justify-center items-center max-w-md mx-auto text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Welcome to OnRopePro!</h2>
                  <p className="text-muted-foreground mb-2">
                    Your account for {registrationResult?.companyName || data.companyName} is ready.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Your {TRIAL_PERIOD_DAYS}-day free trial has started. You're ready to start managing your rope access business.
                  </p>

                  <div className="space-y-3 w-full">
                    <Button 
                      className="w-full bg-[#0B64A3] hover:bg-[#0B64A3]/90"
                      onClick={() => {
                        handleClose();
                        setLocation("/dashboard");
                      }}
                      data-testid="button-go-to-dashboard"
                    >
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleClose}
                      data-testid="button-close"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
