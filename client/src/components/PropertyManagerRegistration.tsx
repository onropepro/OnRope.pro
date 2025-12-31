import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { 
  ArrowRight, ArrowLeft, Loader2, 
  Check, Shield, Clock, MessageSquare, Building2,
  Eye, EyeOff, ThumbsUp, Inbox, FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type RegistrationStep = "welcome" | "accountDetails" | "success";

interface PropertyManagerData {
  firstName: string;
  lastName: string;
  propertyManagementCompany: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface PropertyManagerRegistrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SAGE_GREEN = "#6E9075";

export function PropertyManagerRegistration({ open, onOpenChange }: PropertyManagerRegistrationProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<RegistrationStep>("welcome");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState<PropertyManagerData>({
    firstName: "",
    lastName: "",
    propertyManagementCompany: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const resetForm = () => {
    setStep("welcome");
    setData({
      firstName: "",
      lastName: "",
      propertyManagementCompany: "",
      email: "",
      phoneNumber: "",
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
    mutationFn: async (formData: PropertyManagerData) => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          propertyManagementCompany: formData.propertyManagementCompany,
          propertyManagerPhoneNumber: formData.phoneNumber || undefined,
          passwordHash: formData.password,
          role: "property_manager",
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
        title: t('pmReg.toast.registrationComplete', 'Registration Complete!'),
        description: t('pmReg.toast.accountCreated', 'Your property manager account has been created successfully.'),
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: t('pmReg.toast.registrationFailed', 'Registration Failed'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const validateAccountDetails = (): boolean => {
    if (!data.firstName.trim()) {
      setError(t('validation.firstNameRequired', 'First name is required'));
      return false;
    }
    if (!data.lastName.trim()) {
      setError(t('validation.lastNameRequired', 'Last name is required'));
      return false;
    }
    if (!data.propertyManagementCompany.trim()) {
      setError(t('pmReg.validation.companyRequired', 'Property management company is required'));
      return false;
    }
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError(t('validation.validEmailRequired', 'Valid email is required'));
      return false;
    }
    if (!data.password || data.password.length < 6) {
      setError(t('validation.passwordMin6', 'Password must be at least 6 characters'));
      return false;
    }
    if (data.password !== data.confirmPassword) {
      setError(t('validation.passwordsNoMatch', 'Passwords do not match'));
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    setError("");
    
    if (step === "welcome") {
      setStep("accountDetails");
    } else if (step === "accountDetails") {
      if (validateAccountDetails()) {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "accountDetails") {
      setStep("welcome");
    }
  };

  const handleSubmit = async () => {
    registrationMutation.mutate(data);
  };

  const getStepNumber = () => {
    if (step === "accountDetails") return 1;
    if (step === "success") return 2;
    return 0;
  };

  const sidebarBenefits = [
    { icon: Inbox, text: "Receive and review quotes from verified vendors in one inbox" },
    { icon: Shield, text: "Compare vendor safety ratings before you approve anything" },
    { icon: Clock, text: "Track complaint resolution times across your entire portfolio" },
    { icon: MessageSquare, text: "Two-way messaging — negotiate quotes without email chains" },
    { icon: ThumbsUp, text: "Approve, deny, or request changes with one click" },
  ];

  const welcomeBenefits = [
    "Receive itemized quotes directly from rope access vendors",
    "Compare safety compliance ratings before approving work",
    "View resolution times and feedback history per building",
    "Negotiate and approve quotes without leaving the platform",
    "Answer board questions with real data, not guesswork",
  ];

  const includedBenefits = [
    "Full quote inbox with two-way messaging",
    "Vendor safety ratings and compliance data",
    "Complete complaint and resolution tracking",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden max-h-[90vh]">
        <VisuallyHidden>
          <DialogTitle>Property Manager Registration</DialogTitle>
          <DialogDescription>Create your free property manager account to access vendor safety ratings and quote management.</DialogDescription>
        </VisuallyHidden>
        <div className="flex flex-col lg:flex-row min-h-[600px] max-h-[90vh]">
          {/* Left Panel - Sage Green sidebar (PM color) */}
          <div className="hidden lg:flex lg:w-[320px] text-white p-8 flex-col" style={{backgroundColor: SAGE_GREEN}}>
            <div className="mb-8">
              <Shield className="w-10 h-10 mb-4" />
              <h2 className="text-xl font-bold mb-2">Vendor Management Hub</h2>
              <p className="text-white/80 text-sm">Stop chasing. Start deciding.</p>
            </div>
            
            {/* Progress Steps - Simplified to 2 steps */}
            <div className="space-y-4 mb-8">
              <div className={`flex items-center gap-3 ${getStepNumber() >= 1 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepNumber() >= 1 ? 'bg-white' : 'bg-white/20'}`} style={{color: getStepNumber() >= 1 ? SAGE_GREEN : 'white'}}>
                  {getStepNumber() > 1 ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <span className="text-sm font-medium">Create Account</span>
              </div>
              <div className={`flex items-center gap-3 ${getStepNumber() >= 2 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepNumber() >= 2 ? 'bg-white' : 'bg-white/20'}`} style={{color: getStepNumber() >= 2 ? SAGE_GREEN : 'white'}}>
                  {getStepNumber() >= 2 ? <Check className="w-4 h-4" /> : "2"}
                </div>
                <span className="text-sm font-medium">Complete</span>
              </div>
            </div>

            {/* Benefits */}
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
          </div>

          {/* Right Panel - Form content */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 p-8 lg:p-10">
              {/* Welcome Screen */}
              {step === "welcome" && (
                <div className="h-full flex flex-col justify-center max-w-md mx-auto">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-3" style={{backgroundColor: `${SAGE_GREEN}10`, borderColor: `${SAGE_GREEN}30`}}>
                      <Building2 className="w-4 h-4" style={{color: SAGE_GREEN}} />
                      <span className="text-xs font-medium text-center leading-tight" style={{color: SAGE_GREEN}}>
                        For Property Managers
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold mb-1">Still Chasing Vendors Through Email and Voicemail?</h1>
                    <p className="text-sm text-muted-foreground">One dashboard for quotes, safety ratings, and complaint history. Free for buildings.</p>
                  </div>

                  {/* Benefits section */}
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

                  {/* Included benefits */}
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                      Always Included:
                    </p>
                    <div className="space-y-1">
                      {includedBenefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 py-1 px-2 rounded-md border" style={{backgroundColor: `${SAGE_GREEN}08`, borderColor: `${SAGE_GREEN}15`}}>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                            <Check className="w-3 h-3" style={{color: SAGE_GREEN}} />
                          </div>
                          <span className="text-xs text-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coming Soon teaser */}
                  <div className="mb-4 px-2">
                    <p className="text-xs text-muted-foreground italic">
                      Coming Soon: Send RFPs to multiple verified vendors at once
                    </p>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full gap-2 rounded-full text-white"
                    style={{backgroundColor: SAGE_GREEN}}
                    onClick={handleContinue}
                    data-testid="button-get-started"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Already registered?{" "}
                    <button 
                      onClick={() => { handleClose(); setLocation("/login"); }}
                      className="font-medium hover:underline"
                      style={{color: SAGE_GREEN}}
                      data-testid="link-sign-in"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              )}

              {/* Account Details Step - Combined personal info + password */}
              {step === "accountDetails" && (
                <div className="max-w-md mx-auto">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
                    data-testid="button-back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  
                  <h2 className="text-xl font-bold mb-1">Create Your Account</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Enter your details to get started. You can add vendors from your dashboard after signing up.
                  </p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                        <Input
                          id="firstName"
                          value={data.firstName}
                          onChange={(e) => setData({ ...data, firstName: e.target.value })}
                          placeholder={t('common.placeholders.firstName', 'John')}
                          data-testid="input-first-name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                        <Input
                          id="lastName"
                          value={data.lastName}
                          onChange={(e) => setData({ ...data, lastName: e.target.value })}
                          placeholder={t('common.placeholders.lastName', 'Smith')}
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="propertyManagementCompany" className="text-sm font-medium">Property Management Company</Label>
                      <Input
                        id="propertyManagementCompany"
                        value={data.propertyManagementCompany}
                        onChange={(e) => setData({ ...data, propertyManagementCompany: e.target.value })}
                        placeholder={t('common.placeholders.company', 'ABC Property Management')}
                        data-testid="input-company"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        placeholder={t('common.placeholders.companyEmail', 'you@company.com')}
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number (Optional)</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={data.phoneNumber}
                        onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
                        placeholder="604-123-4567"
                        data-testid="input-phone-number"
                      />
                      <p className="text-xs text-muted-foreground">Used for SMS notifications when you receive quotes</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-sm font-medium">Create Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={data.password}
                          onChange={(e) => setData({ ...data, password: e.target.value })}
                          placeholder={t('common.placeholders.minSixChars', 'Minimum 6 characters')}
                          className="pr-10"
                          data-testid="input-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={data.confirmPassword}
                          onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                          placeholder={t('common.placeholders.reenterPassword', 'Re-enter password')}
                          className="pr-10"
                          data-testid="input-confirm-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          data-testid="button-toggle-confirm-password"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}

                    <Button 
                      size="lg" 
                      className="w-full gap-2 rounded-full text-white"
                      style={{backgroundColor: SAGE_GREEN}}
                      onClick={handleContinue}
                      disabled={registrationMutation.isPending}
                      data-testid="button-complete"
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

              {/* Success Step */}
              {step === "success" && (
                <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                    <Check className="w-8 h-8" style={{color: SAGE_GREEN}} />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your account has been created. Head to your dashboard to add vendors and start managing your portfolio.
                  </p>

                  <div className="w-full space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                        <Building2 className="w-4 h-4" style={{color: SAGE_GREEN}} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">Add Your Vendors</p>
                        <p className="text-xs text-muted-foreground">Request company codes from your rope access vendors</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                        <Shield className="w-4 h-4" style={{color: SAGE_GREEN}} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">View Safety Ratings</p>
                        <p className="text-xs text-muted-foreground">Compare vendor compliance scores</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                        <FileText className="w-4 h-4" style={{color: SAGE_GREEN}} />
                      </div>
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">Receive Project Quotes</p>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Coming Soon</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Post RFPs to selected vendors</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full gap-2 rounded-full text-white"
                    style={{backgroundColor: SAGE_GREEN}}
                    onClick={() => {
                      handleClose();
                      setLocation("/pm-dashboard");
                    }}
                    data-testid="button-go-to-dashboard"
                  >
                    Go to My Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
