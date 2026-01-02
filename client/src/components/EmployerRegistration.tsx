import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
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

export function EmployerRegistration({ open, onOpenChange }: EmployerRegistrationProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const PROCESSING_STEPS = [
    t('employerReg.processing.verifyingPayment', 'Verifying payment...'),
    t('employerReg.processing.creatingAccount', 'Creating your company account...'),
    t('employerReg.processing.settingUpDashboard', 'Setting up your dashboard...'),
    t('employerReg.processing.configuringPermissions', 'Configuring permissions...'),
    t('employerReg.processing.finalizingSetup', 'Finalizing setup...'),
  ];
  
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
  const [animatedBenefitIndex, setAnimatedBenefitIndex] = useState(-1);

  // Staggered animation for sidebar benefits list
  useEffect(() => {
    if (open) {
      setAnimatedBenefitIndex(-1);
      const delays = [800, 1400, 2000, 2600, 3200, 3800];
      const timers = delays.map((delay, index) => 
        setTimeout(() => setAnimatedBenefitIndex(index), delay)
      );
      return () => timers.forEach(timer => clearTimeout(timer));
    } else {
      setAnimatedBenefitIndex(-1);
    }
  }, [open]);

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

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Safe JSON parsing helper - handles non-JSON responses gracefully
    const safeJsonParse = async (response: Response): Promise<any> => {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        console.error('[Registration] Failed to parse response as JSON:', text.substring(0, 200));
        return { message: text || 'Unknown server error' };
      }
    };

    // Phase 1: Poll session-status until Stripe has fully hydrated customer/subscription
    const waitForSessionReady = async (maxAttempts: number = 15): Promise<boolean> => {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const backoffMs = Math.min(1000 * Math.pow(1.5, attempt - 1), 5000);
          console.log(`[Registration] Polling session status, attempt ${attempt}/${maxAttempts}...`);
          
          const response = await fetch(`/api/stripe/session-status/${checkoutSessionId}`, {
            credentials: "include",
          });
          
          const result = await safeJsonParse(response);
          
          if (result.ready === true) {
            console.log('[Registration] Session is ready, proceeding with registration');
            return true;
          }
          
          console.log(`[Registration] Session not ready yet: status=${result.status}, hasCustomer=${result.hasCustomer}, hasSubscription=${result.hasSubscription}`);
          
          if (attempt < maxAttempts) {
            await delay(backoffMs);
          }
        } catch (err) {
          console.error(`[Registration] Session status check error on attempt ${attempt}:`, err);
          if (attempt < maxAttempts) {
            await delay(2000);
          }
        }
      }
      return false;
    };

    // Phase 2: Complete registration after session is confirmed ready
    const attemptRegistration = async (retries: number = 3): Promise<{ ok: boolean; result: any }> => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`[Registration] Completing registration, attempt ${attempt}/${retries}`);
          
          const response = await fetch(`/api/stripe/complete-registration/${checkoutSessionId}`, {
            credentials: "include",
          });

          const result = await safeJsonParse(response);

          if (response.ok && result.success) {
            return { ok: true, result };
          }

          // If session not ready (shouldn't happen after Phase 1), retry
          if (result.message?.includes('Missing customer') || result.message?.includes('not completed')) {
            console.log(`[Registration] Metadata not ready, retrying in ${attempt * 1500}ms...`);
            await delay(attempt * 1500);
            continue;
          }

          return { ok: false, result };
        } catch (fetchErr) {
          console.error(`[Registration] Fetch error on attempt ${attempt}:`, fetchErr);
          if (attempt < retries) {
            await delay(attempt * 1500);
            continue;
          }
          return { ok: false, result: { message: "Network error during registration. Please try again." } };
        }
      }
      
      return { ok: false, result: { message: "Registration timed out. Please contact support." } };
    };

    try {
      setStep("processing");
      setProcessingStatus({ step: 0, message: PROCESSING_STEPS[0] });

      progressIntervalRef.current = setInterval(() => {
        setProcessingStatus(prev => {
          const nextStep = Math.min(prev.step + 1, PROCESSING_STEPS.length - 1);
          return { step: nextStep, message: PROCESSING_STEPS[nextStep] };
        });
      }, 2500);

      // Phase 1: Wait for Stripe session to be fully ready
      const sessionReady = await waitForSessionReady(15);
      if (!sessionReady) {
        throw new Error("Payment session timed out. Please contact support if you were charged.");
      }

      // Phase 2: Complete the registration
      const { ok, result } = await attemptRegistration(3);

      if (ok && result.success) {
        setRegistrationResult({
          companyName: result.companyName || data.companyName,
          trialEnd: result.trialEnd,
        });
        setStep("success");
        
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        
        toast({
          title: t('employerReg.toast.registrationComplete', 'Registration Complete!'),
          description: t('employerReg.toast.accountCreatedSuccess', 'Your company account has been created successfully.'),
        });
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("[Registration] Error completing registration:", err);
      // Stay on processing step with error message instead of going back to payment
      // Going back to payment causes a loop where new checkout sessions are created
      setError(err.message || "Failed to complete registration. Please contact support.");
      toast({
        title: t('employerReg.toast.registrationError', 'Registration Error'),
        description: err.message || t('employerReg.toast.failedToComplete', 'Failed to complete registration. Please contact support.'),
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
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }
      return result;
    },
    onSuccess: () => {
      setStep("success");
      toast({
        title: t('employerReg.toast.registrationComplete', 'Registration Complete!'),
        description: t('employerReg.toast.accountCreatedSuccess', 'Your company account has been created successfully.'),
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: t('employerReg.toast.registrationFailed', 'Registration Failed'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const validateCompanyDetails = (): boolean => {
    if (!data.companyName.trim()) {
      setError(t('employerReg.errors.companyNameRequired', 'Company name is required'));
      return false;
    }
    if (!data.ownerName.trim()) {
      setError(t('employerReg.errors.ownerNameRequired', 'Owner name is required'));
      return false;
    }
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError(t('employerReg.errors.validEmailRequired', 'Valid email is required'));
      return false;
    }
    if (!data.password || data.password.length < 6) {
      setError(t('employerReg.errors.passwordMinLength', 'Password must be at least 6 characters'));
      return false;
    }
    if (data.password !== data.confirmPassword) {
      setError(t('employerReg.errors.passwordsMismatch', 'Passwords do not match'));
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
    { icon: Users, text: t('employerReg.benefits.jobBoard', "Access our job board and reach 1000's of qualified techs") },
    { icon: BarChart3, text: t('employerReg.benefits.projectTracking', "Real-time project tracking and budget monitoring") },
    { icon: Clock, text: t('employerReg.benefits.payrollSavings', "Eliminate 4-8 hours of payroll processing per pay period") },
    { icon: Shield, text: t('employerReg.benefits.safetyDocs', "Digital safety documentation for audits and compliance") },
    { icon: Lock, text: t('employerReg.benefits.permissions', "44 individual permission levels for complete access control") },
    { icon: DollarSign, text: t('employerReg.benefits.quoteAccuracy', "15-20% improvement in quote accuracy") },
  ];

  const welcomeBenefits = [
    t('employerReg.welcomeBenefits.jobBoard', "Post jobs on our Rope Access Only Job Board"),
    t('employerReg.welcomeBenefits.projectTracking', "Track every project and every drop in one central dashboard"),
    t('employerReg.welcomeBenefits.payrollIntegration', "Clock in/out flows directly to payroll"),
    t('employerReg.welcomeBenefits.auditTrail', "Complete audit trail for safety compliance"),
    t('employerReg.welcomeBenefits.budgetMonitoring', "Real-time budget vs. actual monitoring"),
  ];

  const trialBenefits = [
    t('employerReg.trialBenefits.fullAccess', "Full access to all features"),
    t('employerReg.trialBenefits.cancelAnytime', "Cancel anytime with data export"),
    t('employerReg.trialBenefits.prioritySupport', "Priority support during trial"),
    t('employerReg.trialBenefits.noCharge', "No charge until trial ends"),
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
              <h2 className="text-xl font-bold mb-2">{t('employerReg.sidebar.title', 'Rope Access Business Management')}</h2>
              <p className="text-white/80 text-sm">{t('employerReg.sidebar.subtitle', 'Everything connected. Nothing lost.')}</p>
            </div>
            
            {/* Progress Steps */}
            <div className="space-y-4 mb-8">
              <div className={`flex items-center gap-3 ${getStepNumber() >= 1 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepNumber() >= 1 ? 'bg-white text-[#0B64A3]' : 'bg-white/20'}`}>
                  {getStepNumber() > 1 ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <span className="text-sm font-medium">{t('employerReg.steps.accountDetails', 'Account Details')}</span>
              </div>
              <div className={`flex items-center gap-3 ${getStepNumber() >= 2 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepNumber() >= 2 ? 'bg-white text-[#0B64A3]' : 'bg-white/20'}`}>
                  {getStepNumber() > 2 ? <Check className="w-4 h-4" /> : "2"}
                </div>
                <span className="text-sm font-medium">{t('employerReg.steps.billingDetails', 'Billing Details')}</span>
              </div>
              <div className={`flex items-center gap-3 ${getStepNumber() >= 3 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepNumber() >= 3 ? 'bg-white text-[#0B64A3]' : 'bg-white/20'}`}>
                  {getStepNumber() >= 3 ? <Check className="w-4 h-4" /> : "3"}
                </div>
                <span className="text-sm font-medium">{t('employerReg.steps.complete', 'Complete')}</span>
              </div>
            </div>

            {/* Benefits - only show on welcome and company details steps (animated) */}
            {(step === "welcome" || step === "companyDetails") && (
              <div className="mt-auto">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-3">{t('common.whatYouGet', 'What You Get:')}</p>
                <div className="space-y-2">
                  {sidebarBenefits.map((benefit, i) => {
                    const isActive = i <= animatedBenefitIndex;
                    return (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-white border-white' : 'border border-white/40'}`}>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Check className="w-2.5 h-2.5 text-[#0B64A3]" />
                            </motion.div>
                          )}
                        </div>
                        <span className="text-white/90">{benefit.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Billing Details info and Order Summary - show on payment step */}
            {step === "payment" && (
              <div className="mt-auto">
                <h2 className="text-xl font-bold text-white mb-2">{t('employerReg.payment.title', 'Billing Details')}</h2>
                <p className="text-sm text-white/80 mb-4">
                  {t('employerReg.payment.subtitle', 'Enter your billing details to start your {{days}}-day free trial', { days: TRIAL_PERIOD_DAYS })}
                </p>
                
                {/* Order Summary */}
                <div className="bg-white/10 rounded-lg p-3 mt-4">
                  <h3 className="font-medium text-white text-sm mb-2">{t('employerReg.payment.orderSummary', 'Order Summary')}</h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between gap-2">
                      <span className="text-white/80">{t('employerReg.payment.basePlan', 'OnRopePro Base (Monthly)')}</span>
                      <span className="text-white font-medium">${monthlyPrice}/mo</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>{t('employerReg.payment.billingCycle', 'Billing Cycle')}</span>
                      <span>{t('employerReg.payment.monthly', 'Monthly')}</span>
                    </div>
                    <div className="border-t border-white/20 pt-1.5 mt-1.5">
                      <div className="flex justify-between text-green-300">
                        <span>{t('employerReg.payment.freeTrial', 'Free trial')}</span>
                        <span>{TRIAL_PERIOD_DAYS} {t('employerReg.payment.days', 'days')}</span>
                      </div>
                      <p className="text-white/60 text-xs mt-1">
                        {t('employerReg.payment.noChargeUntilTrialEnds', 'No charge until trial ends')}
                      </p>
                    </div>
                  </div>
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
                        {t('employerReg.welcome.badge', 'For Rope Access Company Owners')}
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{TRIAL_PERIOD_DAYS} {t('employerReg.payment.days', 'Days')} {t('common.free', 'Free')}</h1>
                    <p className="text-muted-foreground">{t('employerReg.welcome.subtitle', 'Full access to all features. No commitment.')}</p>
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
                      {t('common.includedInTrial', 'Included in your trial:')}
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
                      {t('common.afterTrial', 'After trial:')} <span className="font-medium text-foreground">${monthlyPrice}/month</span>
                      {" "}+ ${monthlySeatPrice}/seat
                    </p>
                    <p className="text-xs mt-1">{t('common.cancelAnytimeDuringTrial', 'Cancel anytime during trial. Annual plans available later.')}</p>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full gap-2 rounded-full bg-[#0B64A3] hover:bg-[#0B64A3]/90"
                    onClick={handleContinue}
                    data-testid="button-get-started"
                  >
                    {t('employerReg.welcome.getStarted', 'Start Free Trial')}
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-4">
                    {t('employerReg.welcome.haveAccount', 'Already have an account?')}{" "}
                    <button 
                      onClick={handleClose}
                      className="text-[#0B64A3] hover:underline font-medium"
                    >
                      {t('employerReg.welcome.signIn', 'Sign In')}
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
                    {t('employerReg.buttons.back', 'Back')}
                  </button>

                  <h2 className="text-xl font-bold mb-1">{t('employerReg.companyDetails.title', 'Account Details')}</h2>
                  <p className="text-sm text-muted-foreground mb-6">{t('employerReg.companyDetails.step', 'Tell us about your rope access business')}</p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">{t('employerReg.companyDetails.companyName', 'Company Name')}</Label>
                      <Input
                        id="companyName"
                        placeholder={t('employerReg.companyDetails.companyNamePlaceholder', 'ABC Rope Access Ltd.')}
                        value={data.companyName}
                        onChange={(e) => setData({ ...data, companyName: e.target.value })}
                        data-testid="input-company-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerName">{t('employerReg.companyDetails.ownerName', 'Owner Name')}</Label>
                      <Input
                        id="ownerName"
                        placeholder={t('employerReg.companyDetails.ownerNamePlaceholder', 'John Smith')}
                        value={data.ownerName}
                        onChange={(e) => setData({ ...data, ownerName: e.target.value })}
                        data-testid="input-owner-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('employerReg.companyDetails.email', 'Email Address')}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('employerReg.companyDetails.emailPlaceholder', 'you@company.com')}
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">{t('employerReg.companyDetails.password', 'Password')}</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t('employerReg.companyDetails.passwordPlaceholder', 'Create a secure password')}
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
                      <Label htmlFor="confirmPassword">{t('employerReg.companyDetails.confirmPassword', 'Confirm Password')}</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t('employerReg.companyDetails.confirmPasswordPlaceholder', 'Confirm your password')}
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
                      {t('employerReg.buttons.continue', 'Continue')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <p className="text-xs text-center mt-2 text-[#ff0000]">
                      <Lock className="w-3 h-3 inline mr-1" />
                      {t('employerReg.trialBenefits.noCharge', "You won't be charged during your trial")}
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
                    {t('employerReg.buttons.back', 'Back')}
                  </button>

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
                    {t('common.termsAgreement', 'By continuing, you agree to our Terms of Service and Privacy Policy. Your billing address will be used as your company address.')}
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
                  
                  <h2 className="text-xl font-bold mb-2">{t('employerReg.processing.settingUpDashboard', 'Setting up your account...')}</h2>
                  <p className="text-muted-foreground mb-6">
                    {t('employerReg.processing.finalizingSetup', 'Just a moment while we finalize everything.')}
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
                    <h3 className="font-medium text-sm mb-2">{t('common.whileYouWait', 'While you wait...')}</h3>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500" />
                        {t('employerReg.processing.verifyingPayment', 'Your payment has been confirmed')}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500" />
                        {TRIAL_PERIOD_DAYS}-{t('employerReg.payment.days', 'day')} {t('employerReg.payment.freeTrial', 'free trial')} {t('common.active', 'activated')}
                      </li>
                      <li className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {t('employerReg.processing.creatingAccount', 'Creating your workspace')}
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
                  
                  <h2 className="text-2xl font-bold mb-2">{t('employerReg.success.title', 'Welcome to OnRopePro!')}</h2>
                  <p className="text-muted-foreground mb-2">
                    {t('employerReg.success.subtitle', 'Your account for {{company}} is ready.', { company: registrationResult?.companyName || data.companyName })}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {t('employerReg.success.trialInfo', 'Your {{days}}-day free trial has started. You\'re ready to start managing your rope access business.', { days: TRIAL_PERIOD_DAYS })}
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
                      {t('employerReg.success.goToDashboard', 'Go to Dashboard')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleClose}
                      data-testid="button-close"
                    >
                      {t('common.close', 'Close')}
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
