import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, ArrowRight, ArrowLeft, Loader2, 
  Check, Shield, MessageSquare, Bell, Star,
  Eye, EyeOff, Building2
} from "lucide-react";

type RegistrationStep = "welcome" | "personalDetails" | "buildingDetails" | "success";

interface ResidentData {
  name: string;
  email: string;
  phoneNumber: string;
  strataPlanNumber: string;
  unitNumber: string;
  parkingStallNumber: string;
  password: string;
  confirmPassword: string;
}

interface ResidentRegistrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RESIDENT_COLOR = "#86A59C";

export function ResidentRegistration({ open, onOpenChange }: ResidentRegistrationProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<RegistrationStep>("welcome");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState<ResidentData>({
    name: "",
    email: "",
    phoneNumber: "",
    strataPlanNumber: "",
    unitNumber: "",
    parkingStallNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const resetForm = () => {
    setStep("welcome");
    setData({
      name: "",
      email: "",
      phoneNumber: "",
      strataPlanNumber: "",
      unitNumber: "",
      parkingStallNumber: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const registrationMutation = useMutation({
    mutationFn: async (registrationData: ResidentData) => {
      const response = await fetch("/api/register/resident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registrationData.name,
          email: registrationData.email,
          phone: registrationData.phoneNumber,
          strataPlanNumber: registrationData.strataPlanNumber,
          unitNumber: registrationData.unitNumber,
          parkingStallNumber: registrationData.parkingStallNumber,
          password: registrationData.password,
        }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setStep("success");
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: t('residentReg.toast.registrationFailed', 'Registration Failed'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStepNumber = () => {
    switch (step) {
      case "welcome": return 0;
      case "personalDetails": return 1;
      case "buildingDetails": return 2;
      case "success": return 3;
      default: return 0;
    }
  };

  const validatePersonalDetails = () => {
    if (!data.name.trim()) {
      setError(t('validation.fullNameRequired', 'Full name is required'));
      return false;
    }
    if (!data.email.trim()) {
      setError(t('validation.emailRequired', 'Email is required'));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError(t('validation.validEmail', 'Please enter a valid email address'));
      return false;
    }
    if (!data.phoneNumber.trim()) {
      setError(t('validation.phoneRequired', 'Phone number is required'));
      return false;
    }
    if (!data.password) {
      setError(t('validation.passwordRequired', 'Password is required'));
      return false;
    }
    if (data.password.length < 6) {
      setError(t('validation.passwordMin6', 'Password must be at least 6 characters'));
      return false;
    }
    if (data.password !== data.confirmPassword) {
      setError(t('validation.passwordsNoMatch', 'Passwords do not match'));
      return false;
    }
    return true;
  };

  const validateBuildingDetails = () => {
    if (!data.strataPlanNumber.trim()) {
      setError(t('residentReg.validation.strataRequired', 'Strata/HOA/LMS Plan Number is required'));
      return false;
    }
    if (!data.unitNumber.trim()) {
      setError(t('validation.unitRequired', 'Unit number is required'));
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    setError("");
    
    if (step === "welcome") {
      setStep("personalDetails");
    } else if (step === "personalDetails") {
      if (validatePersonalDetails()) {
        setStep("buildingDetails");
      }
    } else if (step === "buildingDetails") {
      if (validateBuildingDetails()) {
        registrationMutation.mutate(data);
      }
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "personalDetails") {
      setStep("welcome");
    } else if (step === "buildingDetails") {
      setStep("personalDetails");
    }
  };

  const handleGoToDashboard = () => {
    handleClose();
    setLocation("/resident-dashboard");
  };

  const welcomeBenefits = [
    t('residentReg.benefits.submitFeedback', 'Submit maintenance feedback with photos'),
    t('residentReg.benefits.trackResolution', 'Track complaint resolution in real-time'),
    t('residentReg.benefits.getNotified', 'Get notified when work is scheduled'),
    t('residentReg.benefits.rateWork', 'Rate completed work quality'),
    t('residentReg.benefits.directComms', 'Direct communication with property management'),
    t('residentReg.benefits.viewHistory', 'View building maintenance history'),
  ];

  const featureHighlights = [
    { title: t('residentReg.features.photoEvidence', 'Photo Evidence'), desc: t('residentReg.features.photoDesc', 'Upload photos of issues for faster resolution') },
    { title: t('residentReg.features.realTimeUpdates', 'Real-time Updates'), desc: t('residentReg.features.realTimeDesc', 'Get notified when your complaint status changes') },
    { title: t('residentReg.features.qualityRatings', 'Quality Ratings'), desc: t('residentReg.features.qualityDesc', 'Rate contractors after work completion') },
    { title: t('residentReg.features.securePortal', 'Secure Portal'), desc: t('residentReg.features.secureDesc', 'Your information is protected and private') },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden max-h-[90vh]">
        <VisuallyHidden>
          <DialogTitle>Resident Registration</DialogTitle>
          <DialogDescription>Create your resident account to submit maintenance feedback and track resolutions</DialogDescription>
        </VisuallyHidden>
        <div className="flex flex-col lg:flex-row min-h-[600px] max-h-[90vh]">
          {/* Left Panel - Resident color sidebar */}
          <div className="hidden lg:flex lg:w-[320px] text-white p-8 flex-col" style={{ backgroundColor: RESIDENT_COLOR }}>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Home className="w-10 h-10" />
                <h2 className="text-xl font-bold">{t('residentReg.sidebar.title', 'Resident Portal')}</h2>
              </div>
              <p className="text-white/80 text-sm">{t('residentReg.sidebar.subtitle', 'Your voice matters in building maintenance')}</p>
            </div>
            
            {/* Progress Steps */}
            <div className="space-y-3 mb-6">
              <div className={`flex items-center gap-3 ${getStepNumber() >= 1 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${getStepNumber() >= 1 ? 'bg-white' : 'bg-white/20'}`} style={{ color: getStepNumber() >= 1 ? RESIDENT_COLOR : 'inherit' }}>
                  {getStepNumber() > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
                </div>
                <span className="text-sm font-medium">{t('residentReg.steps.personalDetails', 'Personal Details')}</span>
              </div>
              <div className={`flex items-center gap-3 ${getStepNumber() >= 2 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${getStepNumber() >= 2 ? 'bg-white' : 'bg-white/20'}`} style={{ color: getStepNumber() >= 2 ? RESIDENT_COLOR : 'inherit' }}>
                  {getStepNumber() > 2 ? <Check className="w-3.5 h-3.5" /> : "2"}
                </div>
                <span className="text-sm font-medium">{t('residentReg.steps.buildingInfo', 'Building Information')}</span>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="mt-auto">
              <p className="text-xs uppercase tracking-wider mb-3 text-white/80">{t('common.whatYouGet', 'What You Get')}</p>
              <div className="space-y-3">
                {featureHighlights.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{feature.title}</p>
                      <p className="text-xs text-white/70">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Form content */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 p-8 lg:p-10">
              {/* Welcome Screen */}
              {step === "welcome" && (
                <div className="h-full flex flex-col justify-center max-w-md mx-auto">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#86A59C]/10 border border-[#86A59C]/20 mb-3">
                      <Home className="w-4 h-4" style={{ color: RESIDENT_COLOR }} />
                      <span className="text-xs font-medium text-center leading-tight" style={{ color: RESIDENT_COLOR }}>
                        For Building Residents
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold mb-1">Create your resident account</h1>
                    <p className="text-sm text-muted-foreground">Free access. Takes 60 seconds.</p>
                  </div>

                  {/* Benefits section */}
                  <div className="space-y-1.5 mb-6">
                    {welcomeBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded-md bg-muted/50">
                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full gap-2 rounded-full"
                    style={{ backgroundColor: RESIDENT_COLOR }}
                    onClick={handleContinue}
                    data-testid="button-get-started"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Already have an account?{" "}
                    <button 
                      className="font-medium hover:underline"
                      style={{ color: RESIDENT_COLOR }}
                      onClick={handleClose}
                      data-testid="button-signin-link"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              )}

              {/* Personal Details Screen */}
              {step === "personalDetails" && (
                <div className="max-w-md mx-auto">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
                    data-testid="button-back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  
                  <h2 className="text-2xl font-bold mb-1">Personal Details</h2>
                  <p className="text-sm text-muted-foreground mb-6">Tell us about yourself</p>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        placeholder="John Smith"
                        data-testid="input-name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        placeholder="john@example.com"
                        data-testid="input-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={data.phoneNumber}
                        onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        data-testid="input-phone"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={data.password}
                          onChange={(e) => setData({ ...data, password: e.target.value })}
                          placeholder="Create a password"
                          className="pr-10"
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

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={data.confirmPassword}
                          onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                          placeholder="Confirm your password"
                          className="pr-10"
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
                      className="w-full gap-2 mt-4"
                      style={{ backgroundColor: RESIDENT_COLOR }}
                      onClick={handleContinue}
                      data-testid="button-continue"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Building Details Screen */}
              {step === "buildingDetails" && (
                <div className="max-w-md mx-auto">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
                    data-testid="button-back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  
                  <h2 className="text-2xl font-bold mb-1">Building Information</h2>
                  <p className="text-sm text-muted-foreground mb-6">Help us connect you to your building</p>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="strata">Strata/HOA/LMS Plan Number</Label>
                      <Input
                        id="strata"
                        value={data.strataPlanNumber}
                        onChange={(e) => setData({ ...data, strataPlanNumber: e.target.value })}
                        placeholder="e.g., BCS1234"
                        data-testid="input-strata"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Found on your strata documents or property tax notice
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="unit">Unit Number</Label>
                      <Input
                        id="unit"
                        value={data.unitNumber}
                        onChange={(e) => setData({ ...data, unitNumber: e.target.value })}
                        placeholder="e.g., 1205"
                        data-testid="input-unit"
                      />
                    </div>

                    <div>
                      <Label htmlFor="parking">Parking Stall Number (Optional)</Label>
                      <Input
                        id="parking"
                        value={data.parkingStallNumber}
                        onChange={(e) => setData({ ...data, parkingStallNumber: e.target.value })}
                        placeholder="e.g., P1-42"
                        data-testid="input-parking"
                      />
                    </div>

                    <Button 
                      className="w-full gap-2 mt-4"
                      style={{ backgroundColor: RESIDENT_COLOR }}
                      onClick={handleContinue}
                      disabled={registrationMutation.isPending}
                      data-testid="button-create-account"
                    >
                      {registrationMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Success Screen */}
              {step === "success" && (
                <div className="h-full flex flex-col justify-center max-w-md mx-auto text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${RESIDENT_COLOR}20` }}>
                    <Check className="w-8 h-8" style={{ color: RESIDENT_COLOR }} />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Welcome to Your Resident Portal!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your account has been created. You can now submit maintenance feedback and track resolutions.
                  </p>

                  <div className="space-y-3">
                    <Button 
                      size="lg"
                      className="w-full gap-2"
                      style={{ backgroundColor: RESIDENT_COLOR }}
                      onClick={handleGoToDashboard}
                      data-testid="button-go-to-dashboard"
                    >
                      Go to My Dashboard
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={handleClose}
                      data-testid="button-close"
                    >
                      Close this dialog
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
