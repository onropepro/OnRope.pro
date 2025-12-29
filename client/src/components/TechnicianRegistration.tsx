import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  User, ArrowRight, ArrowLeft, Award, Loader2, 
  Check, Upload, Shield, Copy, Mail, MessageSquare,
  Briefcase, FileText, Clock, Bell, ChevronRight,
  HardHat, X, CheckCircle, Eye, EyeOff, Lock, LockOpen
} from "lucide-react";

type RegistrationStep = "welcome" | "accountDetails" | "certification" | "referral" | "employer" | "success";
type CertificationType = "irata" | "sprat" | "both" | null;

interface TechnicianData {
  referralCodeInput: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  streetAddress: string;
  city: string;
  provinceState: string;
  country: string;
  postalCode: string;
  certification: CertificationType;
  irataLevel: string;
  irataLicenseNumber: string;
  spratLevel: string;
  spratLicenseNumber: string;
  certificationCardFile: File | null;
}

interface TechnicianRegistrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TechnicianRegistration({ open, onOpenChange }: TechnicianRegistrationProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<RegistrationStep>("welcome");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generatedReferralCode, setGeneratedReferralCode] = useState("");
  const [data, setData] = useState<TechnicianData>({
    referralCodeInput: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    streetAddress: "",
    city: "",
    provinceState: "",
    country: "",
    postalCode: "",
    certification: null,
    irataLevel: "",
    irataLicenseNumber: "",
    spratLevel: "",
    spratLicenseNumber: "",
    certificationCardFile: null,
  });
  const [error, setError] = useState("");
  const [animatedBenefitIndex, setAnimatedBenefitIndex] = useState(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setStep("welcome");
    setData({
      referralCodeInput: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      streetAddress: "",
      city: "",
      provinceState: "",
      country: "",
      postalCode: "",
      certification: null,
      irataLevel: "",
      irataLicenseNumber: "",
      spratLevel: "",
      spratLicenseNumber: "",
      certificationCardFile: null,
    });
    setError("");
    setGeneratedReferralCode("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // Staggered animation for PLUS benefits list
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

  const registrationMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/technician-register", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.referralCode) {
        setGeneratedReferralCode(data.referralCode);
      }
      toast({
        title: "Registration Complete!",
        description: "Your account has been created successfully.",
      });
      // Move to referral step after account creation
      setStep("referral");
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

  const validateAccountDetails = (): boolean => {
    if (!data.firstName.trim()) {
      setError(t('techReg.errors.firstNameRequired', 'First name is required'));
      return false;
    }
    if (!data.lastName.trim()) {
      setError(t('techReg.errors.lastNameRequired', 'Last name is required'));
      return false;
    }
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError(t('techReg.errors.validEmailRequired', 'Valid email is required'));
      return false;
    }
    if (!data.phone.trim()) {
      setError(t('techReg.errors.phoneRequired', 'Phone number is required'));
      return false;
    }
    if (!data.password || data.password.length < 8) {
      setError(t('techReg.errors.passwordMinLength', 'Password must be at least 8 characters'));
      return false;
    }
    if (!/[A-Z]/.test(data.password)) {
      setError(t('techReg.errors.passwordUppercase', 'Password must contain at least one uppercase letter'));
      return false;
    }
    if (!/[a-z]/.test(data.password)) {
      setError(t('techReg.errors.passwordLowercase', 'Password must contain at least one lowercase letter'));
      return false;
    }
    if (!/[0-9]/.test(data.password)) {
      setError(t('techReg.errors.passwordNumber', 'Password must contain at least one number'));
      return false;
    }
    if (data.password !== data.confirmPassword) {
      setError(t('techReg.errors.passwordsMismatch', 'Passwords do not match'));
      return false;
    }
    return true;
  };

  const validateCertification = (): boolean => {
    if (!data.certification) {
      setError(t('techReg.errors.selectCertification', 'Please select a certification type'));
      return false;
    }
    if (data.certification === "irata" || data.certification === "both") {
      if (!data.irataLevel || !data.irataLicenseNumber.trim()) {
        setError(t('techReg.errors.irataRequired', 'IRATA level and license number are required'));
        return false;
      }
    }
    if (data.certification === "sprat" || data.certification === "both") {
      if (!data.spratLevel || !data.spratLicenseNumber.trim()) {
        setError(t('techReg.errors.spratRequired', 'SPRAT level and license number are required'));
        return false;
      }
    }
    return true;
  };

  const handleContinue = () => {
    setError("");
    
    if (step === "welcome") {
      setStep("accountDetails");
    } else if (step === "accountDetails") {
      if (validateAccountDetails()) {
        setStep("certification");
      }
    } else if (step === "certification") {
      if (validateCertification()) {
        handleSubmit();
      }
    } else if (step === "referral") {
      setStep("employer");
    } else if (step === "employer") {
      onOpenChange(false);
      setLocation("/technician-passport");
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "accountDetails") {
      setStep("welcome");
    } else if (step === "certification") {
      setStep("accountDetails");
    } else if (step === "referral") {
      setStep("certification");
    } else if (step === "employer") {
      setStep("referral");
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("streetAddress", data.streetAddress);
    formData.append("city", data.city);
    formData.append("provinceState", data.provinceState);
    formData.append("country", data.country);
    formData.append("postalCode", data.postalCode);
    formData.append("certification", data.certification || "");
    
    if (data.certification === "irata" || data.certification === "both") {
      formData.append("irataLevel", data.irataLevel);
      formData.append("irataLicenseNumber", data.irataLicenseNumber);
    }
    if (data.certification === "sprat" || data.certification === "both") {
      formData.append("spratLevel", data.spratLevel);
      formData.append("spratLicenseNumber", data.spratLicenseNumber);
    }
    if (data.certificationCardFile) {
      formData.append("certificationCard", data.certificationCardFile);
    }
    if (data.referralCodeInput.trim()) {
      formData.append("referralCodeInput", data.referralCodeInput.trim());
    }

    registrationMutation.mutate(formData);
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(generatedReferralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const getStepNumber = () => {
    if (step === "accountDetails") return 1;
    if (step === "certification") return 2;
    if (step === "referral") return 3;
    if (step === "employer") return 4;
    if (step === "success") return 5;
    return 0;
  };

  // Left sidebar FREE ACCOUNT benefits (matching copy document)
  const freeAccountBenefits = [
    t('techReg.benefits.hoursSurvive', 'Your hours survive company closures'),
    t('techReg.benefits.importLogbook', 'Import your existing logbook via photo'),
    t('techReg.benefits.certifications', 'All certifications stored in one place'),
    t('techReg.benefits.fastOnboarding', '10-second onboarding at every new job'),
    t('techReg.benefits.safetyRating', 'Personal Safety Rating builds your reputation'),
  ];

  // Right panel welcome screen benefits (7 items matching copy doc)
  const welcomeBenefits = [
    t('techReg.welcome.benefit1', 'Your hours survive company closures'),
    t('techReg.welcome.benefit2', 'Import your logbook via photo'),
    t('techReg.welcome.benefit3', '10-second onboarding at new jobs'),
    t('techReg.welcome.benefit4', 'All certifications in one place'),
    t('techReg.welcome.benefit5', 'Import your logbook history via photo'),
    t('techReg.welcome.benefit6', 'Your hours follow you - every job, every city'),
    t('techReg.welcome.benefit7', 'Track progress toward L2/L3'),
  ];

  // PLUS benefits (unlocked by referring one tech)
  const plusBenefits = [
    t('techReg.plusBenefits.jobBoard', 'Rope Access Job Board'),
    t('techReg.plusBenefits.jobOffers', 'Employers Can Send Job Offers'),
    t('techReg.plusBenefits.expiryAlerts', '30-day certification expiry alerts'),
    t('techReg.plusBenefits.multiEmployers', 'Work for multiple employers simultaneously'),
    t('techReg.plusBenefits.taskLogging', 'Enhanced task logging'),
    t('techReg.plusBenefits.analytics', 'Work history analytics'),
  ];

  // Employer-connected benefits for Page 4
  const employerBenefits = [
    { title: t('techReg.employer.autoHours', 'Hours log automatically'), desc: t('techReg.employer.autoHoursDesc', 'No manual entry — clock in/out and everything logs itself. Drops. Payroll. Safety Meetings.') },
    { title: t('techReg.employer.gpsVerified', 'GPS-verified clock in/out'), desc: t('techReg.employer.gpsVerifiedDesc', 'Location-stamped records protect you and your employer. No more short paycheques.') },
    { title: t('techReg.employer.dashboard', 'Work Dashboard with projects & shifts'), desc: t('techReg.employer.dashboardDesc', 'See your schedule, projects, and tasks in one place') },
    { title: t('techReg.employer.digitalForms', 'Digital toolbox talks & safety forms'), desc: t('techReg.employer.digitalFormsDesc', 'Safety meetings delivered to your phone, sign once, recorded forever') },
    { title: t('techReg.employer.docRequests', 'Instant document requests'), desc: t('techReg.employer.docRequestsDesc', 'Employer needs something? One tap to upload from your phone') },
    { title: t('techReg.employer.safetyCredit', 'Harness inspections credit your Safety Rating'), desc: t('techReg.employer.safetyCreditDesc', 'Your reputation builds automatically with every completed form') },
    { title: t('techReg.employer.teamVisibility', 'Real-time team visibility'), desc: t('techReg.employer.teamVisibilityDesc', 'Know who you\'re working with today') },
    { title: t('techReg.employer.dataYours', 'Leave anytime — your data stays yours'), desc: t('techReg.employer.dataYoursDesc', 'Your profile, hours, and Safety Rating come with you') },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden max-h-[90vh]">
        <div className="flex flex-col lg:flex-row min-h-[600px] max-h-[90vh]">
          {/* Left Panel - Rust Brown sidebar (Technician color) */}
          <div className="hidden lg:flex lg:w-[320px] bg-[#5C7A84] text-white p-8 flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <HardHat className="w-10 h-10" />
                <h2 className="text-xl font-bold">{t('techReg.sidebar.title', 'Create Your Profile')}</h2>
              </div>
              <p className="text-white/80 text-sm">{t('techReg.sidebar.subtitle', 'Join thousands of rope access technicians')}</p>
            </div>
            
            {/* Progress Steps */}
            <div className="space-y-3 mb-6">
              <div className={`flex items-center gap-3 ${getStepNumber() >= 1 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${getStepNumber() >= 1 ? 'bg-white text-[#5C7A84]' : 'bg-white/20'}`}>
                  {getStepNumber() > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
                </div>
                <span className="text-sm font-medium">{t('techReg.steps.accountDetails', 'Account Details')}</span>
              </div>
              <div className={`flex items-center gap-3 ${getStepNumber() >= 2 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${getStepNumber() >= 2 ? 'bg-white text-[#5C7A84]' : 'bg-white/20'}`}>
                  {getStepNumber() > 2 ? <Check className="w-3.5 h-3.5" /> : "2"}
                </div>
                <span className="text-sm font-medium">{t('techReg.steps.certification', 'Certification')}</span>
              </div>
              <div className={`flex items-center gap-3 ${getStepNumber() >= 3 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${getStepNumber() >= 3 ? 'bg-white text-[#5C7A84]' : 'bg-white/20'}`}>
                  {getStepNumber() > 3 ? <Check className="w-3.5 h-3.5" /> : "3"}
                </div>
                <span className="text-sm font-medium">{t('techReg.steps.referral', 'Referral (Optional)')}</span>
              </div>
              <div className={`flex items-center gap-3 ${getStepNumber() >= 4 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${getStepNumber() >= 4 ? 'bg-white text-[#5C7A84]' : 'bg-white/20'}`}>
                  {getStepNumber() > 4 ? <Check className="w-3.5 h-3.5" /> : "4"}
                </div>
                <span className="text-sm font-medium">{t('techReg.steps.employer', 'Employer Info')}</span>
              </div>
            </div>

            {/* PLUS ACCOUNT Benefits (animated) */}
            <div className="mt-auto">
              <p className="text-xs uppercase tracking-wider mb-2 text-[#ffffff]">{t('techReg.sidebar.plusAccount', 'Refer 1 tech to upgrade to a PLUS Account for free')}</p>
              <div className="space-y-2">
                {plusBenefits.map((benefit, i) => {
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
                            <Check className="w-2.5 h-2.5 text-[#5C7A84]" />
                          </motion.div>
                        )}
                      </div>
                      <span className={`transition-colors duration-300 ${isActive ? 'text-[#ffffff]' : 'text-white/70 opacity-60'}`}>{benefit}</span>
                    </div>
                  );
                })}
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
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
                      <HardHat className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-primary text-center leading-tight">
                        For IRATA &amp; SPRAT Technicians or Rope Access Employees
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold mb-1">{t('techReg.welcome.title', 'Create your free account')}</h1>
                    <p className="text-sm text-muted-foreground">{t('techReg.welcome.subtitle', '60 seconds to set up. Protected forever.')}</p>
                  </div>

                  {/* FREE benefits section */}
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
                    className="w-full gap-2 rounded-full bg-[#5C7A84]"
                    onClick={handleContinue}
                    data-testid="button-get-started"
                  >
                    {t('techReg.welcome.getStarted', 'Create My Passport')}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {t('techReg.welcome.haveAccount', 'Already have an account?')}{" "}
                    <button 
                      className="text-primary font-medium hover:underline"
                      onClick={handleClose}
                    >
                      {t('techReg.welcome.signIn', 'Sign In')}
                    </button>
                  </p>
                </div>
              )}

              {/* Account Details Screen */}
              {step === "accountDetails" && (
                <div className="max-w-lg mx-auto">
                  <div className="mb-6">
                                        <h2 className="text-2xl font-bold">{t('techReg.accountDetails.title', 'Account Details')}</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{t('techReg.accountDetails.firstName', 'First Name')}</Label>
                        <Input
                          id="firstName"
                          placeholder={t('techReg.accountDetails.firstNamePlaceholder', 'John')}
                          value={data.firstName}
                          onChange={(e) => setData({ ...data, firstName: e.target.value })}
                          data-testid="input-first-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">{t('techReg.accountDetails.lastName', 'Last Name')}</Label>
                        <Input
                          id="lastName"
                          placeholder={t('techReg.accountDetails.lastNamePlaceholder', 'Smith')}
                          value={data.lastName}
                          onChange={(e) => setData({ ...data, lastName: e.target.value })}
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">{t('techReg.accountDetails.email', 'Email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('techReg.accountDetails.emailPlaceholder', 'john@example.com')}
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        data-testid="input-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">{t('techReg.accountDetails.phone', 'Phone')}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={t('techReg.accountDetails.phonePlaceholder', '+1 (555) 000-0000')}
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                        data-testid="input-phone"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">{t('techReg.accountDetails.password', 'Password')}</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t('techReg.accountDetails.passwordPlaceholder', 'Create a password')}
                          value={data.password}
                          onChange={(e) => setData({ ...data, password: e.target.value })}
                          data-testid="input-password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{t('techReg.accountDetails.passwordHint', 'Min 8 chars, 1 uppercase, 1 lowercase, 1 number')}</p>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">{t('techReg.accountDetails.confirmPassword', 'Confirm Password')}</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t('techReg.accountDetails.confirmPasswordPlaceholder', 'Confirm your password')}
                          value={data.confirmPassword}
                          onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                          data-testid="input-confirm-password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={handleBack} className="gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      {t('techReg.buttons.back', 'Back')}
                    </Button>
                    <Button 
                      className="flex-1 gap-2 bg-[#5C7A84]"
                      onClick={handleContinue}
                      data-testid="button-continue-to-certification"
                    >
                      {t('techReg.buttons.continue', 'Continue')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Certification Screen */}
              {step === "certification" && (
                <div className="max-w-lg mx-auto flex flex-col justify-center min-h-full">
                  <div className="mb-6">
                                        <h2 className="text-2xl font-bold">{t('techReg.certification.title', 'Verify Your Certification')}</h2>
                    <p className="text-muted-foreground mt-1">{t('techReg.certification.subtitle', 'Select your certification type')}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { value: "irata", label: "IRATA" },
                      { value: "sprat", label: "SPRAT" },
                      { value: "both", label: t('techReg.certification.both', 'Both') },
                    ].map((cert) => (
                      <button
                        key={cert.value}
                        type="button"
                        className={`p-4 rounded-lg border-2 text-center font-medium transition-all ${
                          data.certification === cert.value
                            ? "border-[#5C7A84] bg-[#5C7A84]/10 text-[#5C7A84]"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                        onClick={() => setData({ ...data, certification: cert.value as CertificationType })}
                        data-testid={`button-cert-${cert.value}`}
                      >
                        {cert.label}
                      </button>
                    ))}
                  </div>

                  {/* IRATA Fields */}
                  {(data.certification === "irata" || data.certification === "both") && (
                    <div className="space-y-4 mb-4 p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#5C7A84]" />
                        {t('techReg.certification.irataDetails', 'IRATA Details')}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>{t('techReg.certification.level', 'Level')}</Label>
                          <div className="flex gap-2 mt-1">
                            {["1", "2", "3"].map((level) => (
                              <button
                                key={level}
                                type="button"
                                className={`flex-1 py-2 rounded-md border text-sm font-medium transition-all ${
                                  data.irataLevel === level
                                    ? "border-[#5C7A84] bg-[#5C7A84] text-white"
                                    : "border-border hover:border-muted-foreground/50"
                                }`}
                                onClick={() => setData({ ...data, irataLevel: level })}
                                data-testid={`button-irata-level-${level}`}
                              >
                                {t('techReg.certification.levelNumber', 'Level')} {level}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="irataLicenseNumber">{t('techReg.certification.licenseNumber', 'License Number')}</Label>
                          <Input
                            id="irataLicenseNumber"
                            placeholder="123456"
                            value={data.irataLicenseNumber}
                            onChange={(e) => setData({ ...data, irataLicenseNumber: e.target.value })}
                            className="mt-1"
                            data-testid="input-irata-license"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SPRAT Fields */}
                  {(data.certification === "sprat" || data.certification === "both") && (
                    <div className="space-y-4 mb-4 p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#5C7A84]" />
                        {t('techReg.certification.spratDetails', 'SPRAT Details')}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>{t('techReg.certification.level', 'Level')}</Label>
                          <div className="flex gap-2 mt-1">
                            {["1", "2", "3"].map((level) => (
                              <button
                                key={level}
                                type="button"
                                className={`flex-1 py-2 rounded-md border text-sm font-medium transition-all ${
                                  data.spratLevel === level
                                    ? "border-[#5C7A84] bg-[#5C7A84] text-white"
                                    : "border-border hover:border-muted-foreground/50"
                                }`}
                                onClick={() => setData({ ...data, spratLevel: level })}
                                data-testid={`button-sprat-level-${level}`}
                              >
                                {t('techReg.certification.levelNumber', 'Level')} {level}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="spratLicenseNumber">{t('techReg.certification.licenseNumber', 'License Number')}</Label>
                          <Input
                            id="spratLicenseNumber"
                            placeholder="123456"
                            value={data.spratLicenseNumber}
                            onChange={(e) => setData({ ...data, spratLicenseNumber: e.target.value })}
                            className="mt-1"
                            data-testid="input-sprat-license"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Certification Card Upload */}
                  {data.certification && (
                    <div className="mb-4">
                      <Label className="mb-2 block">{t('techReg.certification.uploadCardLabel', 'Upload Certification Card (optional)')}</Label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setData({ ...data, certificationCardFile: file });
                        }}
                        data-testid="input-cert-card-file"
                      />
                      <Button
                        type="button"
                        variant={data.certificationCardFile ? "default" : "outline"}
                        className={`w-full justify-start gap-2 ${data.certificationCardFile ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="button-upload-cert-card"
                      >
                        {data.certificationCardFile ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span className="truncate">{data.certificationCardFile.name}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            {t('techReg.certification.tapToUpload', 'Tap to upload photo')}
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">{t('techReg.certification.supportedFormats', 'Supported: JPG, PNG, PDF')}</p>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={handleBack} className="gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      {t('techReg.buttons.back', 'Back')}
                    </Button>
                    <Button 
                      className="flex-1 gap-2 bg-[#5C7A84]"
                      onClick={handleContinue}
                      disabled={registrationMutation.isPending}
                      data-testid="button-create-account"
                    >
                      {registrationMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t('techReg.buttons.creatingAccount', 'Creating Account...')}
                        </>
                      ) : (
                        <>
                          {t('techReg.buttons.createAccount', 'Create Account')}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Referral Screen (Optional Step 4) */}
              {step === "referral" && (
                <div className="h-full flex flex-col justify-center max-w-lg mx-auto">
                  {/* Account Created Confirmation */}
                  <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="font-semibold text-green-800 dark:text-green-300">{t('techReg.referral.accountCreated', 'Your Account Has Been Created')}</p>
                    </div>
                  </div>

                  <div className="mb-9">
                    <h2 className="text-2xl font-bold">{t('techReg.referral.title', 'Pay-It-Forward Referral Code System')}</h2>
                    <div className="text-muted-foreground mt-3 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">1 -</span> {t('techReg.referral.step1', "Got a referral code from a friend? Enter it and they'll get upgraded to a PLUS account for free.")}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">2 -</span> {t('techReg.referral.step2', 'Once your account has been created, share your referral code to get upgraded to PLUS for free.')}
                      </p>
                    </div>
                  </div>

                  {/* Referral Code Input */}
                  <div className="mb-8">
                    <Label className="text-sm mb-2 block">{t('techReg.referral.inputLabel', 'Enter referral code (optional)')}</Label>
                    <Input
                      placeholder={t('techReg.referral.inputPlaceholder', 'Enter referral code (optional)')}
                      value={data.referralCodeInput}
                      onChange={(e) => setData({ ...data, referralCodeInput: e.target.value.toUpperCase() })}
                      className="text-center tracking-widest text-lg"
                      data-testid="input-referral-code"
                    />
                  </div>

                  {error && (
                    <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button 
                      className="flex-1 gap-2 bg-[#5C7A84]"
                      onClick={handleContinue}
                      data-testid="button-continue-referral"
                    >
                      {t('techReg.buttons.continueToPassport', 'Continue to My Passport')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Employer Connection Info Screen (Page 4) */}
              {step === "employer" && (
                <div className="max-w-lg mx-auto">
                  <div className="mb-8 text-center">
                    <p className="text-muted-foreground mb-2">{t('techReg.employer.question', 'Does Your Employer Use OnRopePro?')}</p>
                    <h2 className="text-2xl font-bold">{t('techReg.employer.title', 'Good alone. Unstoppable together.')}</h2>
                    <p className="text-muted-foreground mt-1">{t('techReg.employer.subtitle', 'Everything you do manually? It\'s Done For You.')}</p>
                  </div>

                  <div className="space-y-1 mb-8">
                    {employerBenefits.slice(0, 6).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-md bg-muted/50">
                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-base">{benefit.title}</p>
                          <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-md bg-muted/30 border border-border mb-6">
                    <p className="text-base text-muted-foreground text-center">
                      {t('techReg.employer.cta', 'Your account works great standalone. When your employer uses OnRopePro, everything becomes seamlessly automatic.')}
                    </p>
                  </div>

                  <Button 
                    className="w-full gap-2 bg-[#5C7A84]"
                    onClick={handleContinue}
                    data-testid="button-continue-to-passport"
                  >
                    {t('techReg.buttons.continueToPassport', 'Continue to My Passport')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Success Screen */}
              {step === "success" && (
                <div className="max-w-lg mx-auto text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">{t('techReg.success.title', 'Welcome to OnRopePro!')}</h2>
                  <p className="text-muted-foreground mb-8">
                    {t('techReg.success.subtitle', 'Your account is ready')}, {data.firstName}
                  </p>

                  {/* Referral Code Section */}
                  {generatedReferralCode && (
                    <div className="bg-muted/50 rounded-xl p-6 mb-6 text-left">
                      <h3 className="font-semibold text-center mb-4">{t('techReg.success.yourReferralCode', 'YOUR REFERRAL CODE')}</h3>
                      
                      <div className="flex items-center gap-2 bg-background rounded-lg p-3 mb-4">
                        <span className="flex-1 text-center font-mono text-lg font-bold tracking-widest">
                          {generatedReferralCode}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={copyReferralCode}
                          data-testid="button-copy-referral"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <p className="text-center text-sm text-muted-foreground mb-4">
                        {t('techReg.success.shareForUpgrade', 'Share with 1 other tech and you get a free upgrade to Plus')}
                      </p>
                      
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          {t('techReg.success.text', 'Text')}
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Mail className="w-4 h-4" />
                          {t('techReg.success.email', 'Email')}
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={copyReferralCode}>
                          <Copy className="w-4 h-4" />
                          {t('techReg.success.copy', 'Copy')}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Plus Benefits Preview */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-6 mb-6 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-400">PLUS</span>
                      <span className="text-sm text-muted-foreground">{t('techReg.success.includes', 'includes')}:</span>
                    </div>
                    <div className="space-y-2">
                      {plusBenefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    size="lg"
                    className="w-full gap-2 rounded-full bg-[#5C7A84]"
                    onClick={() => {
                      handleClose();
                      setLocation("/technician");
                    }}
                    data-testid="button-go-to-profile"
                  >
                    {t('techReg.success.goToSignIn', 'Go to Sign In')}
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  
                  <button 
                    className="text-sm text-muted-foreground mt-4 hover:underline"
                    onClick={handleClose}
                  >
                    {t('techReg.success.closeDialog', 'Close this dialog')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
