import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { 
  User, ArrowRight, ArrowLeft, Loader2, 
  Check, Shield, Briefcase, Clock, Bell, ChevronRight,
  HardHat, CheckCircle, Eye, EyeOff, Users
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";

type RegistrationStep = "welcome" | "accountDetails" | "employer" | "success";

interface GroundCrewData {
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
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

interface GroundCrewRegistrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GROUND_CREW_COLOR = "#5D7B6F";

export function GroundCrewRegistration({ open, onOpenChange }: GroundCrewRegistrationProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<RegistrationStep>("welcome");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState<GroundCrewData>({
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
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
  });
  const [error, setError] = useState("");

  const resetForm = () => {
    setStep("welcome");
    setData({
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
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
    });
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const registrationMutation = useMutation({
    mutationFn: async (formData: GroundCrewData) => {
      const response = await fetch("/api/ground-crew-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('groundCrewReg.success.title', 'Registration Complete!'),
        description: t('groundCrewReg.success.description', 'Your account has been created successfully.'),
      });
      setStep("success");
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: t('groundCrewReg.error.title', 'Registration Failed'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const validateAccountDetails = (): boolean => {
    if (!data.firstName.trim()) {
      setError(t('groundCrewReg.errors.firstNameRequired', 'First name is required'));
      return false;
    }
    if (!data.lastName.trim()) {
      setError(t('groundCrewReg.errors.lastNameRequired', 'Last name is required'));
      return false;
    }
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError(t('groundCrewReg.errors.validEmailRequired', 'Valid email is required'));
      return false;
    }
    if (!data.phone.trim()) {
      setError(t('groundCrewReg.errors.phoneRequired', 'Phone number is required'));
      return false;
    }
    if (!data.password || data.password.length < 8) {
      setError(t('groundCrewReg.errors.passwordMinLength', 'Password must be at least 8 characters'));
      return false;
    }
    if (!/[A-Z]/.test(data.password)) {
      setError(t('groundCrewReg.errors.passwordUppercase', 'Password must contain at least one uppercase letter'));
      return false;
    }
    if (!/[a-z]/.test(data.password)) {
      setError(t('groundCrewReg.errors.passwordLowercase', 'Password must contain at least one lowercase letter'));
      return false;
    }
    if (!/[0-9]/.test(data.password)) {
      setError(t('groundCrewReg.errors.passwordNumber', 'Password must contain at least one number'));
      return false;
    }
    if (data.password !== data.confirmPassword) {
      setError(t('groundCrewReg.errors.passwordsMismatch', 'Passwords do not match'));
      return false;
    }
    if (!data.emergencyContactName.trim()) {
      setError(t('groundCrewReg.errors.emergencyNameRequired', 'Emergency contact name is required'));
      return false;
    }
    if (!data.emergencyContactPhone.trim()) {
      setError(t('groundCrewReg.errors.emergencyPhoneRequired', 'Emergency contact phone is required'));
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
        setStep("employer");
      }
    } else if (step === "employer") {
      // Submit registration from employer step
      handleSubmit();
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "accountDetails") {
      setStep("welcome");
    } else if (step === "employer") {
      setStep("accountDetails");
    }
  };

  const handleSubmit = async () => {
    registrationMutation.mutate(data);
  };

  const handleGoToPortal = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    handleClose();
    setLocation("/ground-crew-portal");
  };

  const getStepNumber = () => {
    if (step === "accountDetails") return 1;
    if (step === "employer") return 2;
    if (step === "success") return 3;
    return 0;
  };

  const freeAccountBenefits = [
    t('groundCrewReg.benefits.hoursTracked', 'All your hours tracked automatically'),
    t('groundCrewReg.benefits.fastOnboarding', 'Fast onboarding with any employer'),
    t('groundCrewReg.benefits.safetyForms', 'Digital safety forms and toolbox talks'),
    t('groundCrewReg.benefits.schedule', 'View your schedule and assignments'),
    t('groundCrewReg.benefits.dataPortable', 'You own your work history'),
  ];

  const welcomeBenefits = [
    t('groundCrewReg.welcome.benefit1', 'Track your hours automatically'),
    t('groundCrewReg.welcome.benefit2', 'Digital safety forms and sign-offs'),
    t('groundCrewReg.welcome.benefit3', 'Fast onboarding at new jobs'),
    t('groundCrewReg.welcome.benefit4', 'View your schedule anytime'),
    t('groundCrewReg.welcome.benefit5', 'GPS-verified clock in/out'),
    t('groundCrewReg.welcome.benefit6', 'You own your work history'),
  ];

  const employerBenefits = [
    { 
      title: t('groundCrewReg.employer.autoHours', 'Hours log automatically'), 
      desc: t('groundCrewReg.employer.autoHoursDesc', 'Clock in/out and everything logs itself. No manual entry needed.') 
    },
    { 
      title: t('groundCrewReg.employer.gpsVerified', 'GPS-verified clock in/out'), 
      desc: t('groundCrewReg.employer.gpsVerifiedDesc', 'Location-stamped records protect you and your employer.') 
    },
    { 
      title: t('groundCrewReg.employer.dashboard', 'Work Dashboard'), 
      desc: t('groundCrewReg.employer.dashboardDesc', 'See your schedule, projects, and tasks in one place.') 
    },
    { 
      title: t('groundCrewReg.employer.digitalForms', 'Digital safety forms'), 
      desc: t('groundCrewReg.employer.digitalFormsDesc', 'Toolbox talks delivered to your phone, sign once, recorded forever.') 
    },
    { 
      title: t('groundCrewReg.employer.teamVisibility', 'Real-time team visibility'), 
      desc: t('groundCrewReg.employer.teamVisibilityDesc', 'Know who you are working with today.') 
    },
    { 
      title: t('groundCrewReg.employer.dataYours', 'Your data stays yours'), 
      desc: t('groundCrewReg.employer.dataYoursDesc', 'Leave anytime - your profile and hours come with you.') 
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden max-h-[90vh]" data-testid="dialog-ground-crew-registration">
        <div className="flex flex-col lg:flex-row min-h-[600px] max-h-[90vh]">
          {/* Left Panel - Ground Crew color sidebar */}
          <div className="hidden lg:flex lg:w-[320px] text-white p-8 flex-col" style={{ backgroundColor: GROUND_CREW_COLOR }}>
            <div className="mb-8">
              <Users className="w-10 h-10 mb-4" />
              <h2 className="text-xl font-bold mb-2">{t('groundCrewReg.sidebar.title', 'Ground Support Worker Account')}</h2>
              <p className="text-white/80 text-sm">{t('groundCrewReg.sidebar.subtitle', 'Your work. Your hours. Tracked.')}</p>
            </div>
            
            {/* Progress Steps */}
            <div className="space-y-3 mb-6">
              <div className={`flex items-center gap-3 ${getStepNumber() >= 1 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium`} style={{ backgroundColor: getStepNumber() >= 1 ? 'white' : 'rgba(255,255,255,0.2)', color: getStepNumber() >= 1 ? GROUND_CREW_COLOR : 'white' }}>
                  {getStepNumber() > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
                </div>
                <span className="text-sm font-medium">{t('groundCrewReg.steps.accountDetails', 'Account Details')}</span>
              </div>
              <div className={`flex items-center gap-3 ${getStepNumber() >= 2 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium`} style={{ backgroundColor: getStepNumber() >= 2 ? 'white' : 'rgba(255,255,255,0.2)', color: getStepNumber() >= 2 ? GROUND_CREW_COLOR : 'white' }}>
                  {getStepNumber() > 2 ? <Check className="w-3.5 h-3.5" /> : "2"}
                </div>
                <span className="text-sm font-medium">{t('groundCrewReg.steps.employer', 'Employer Info')}</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-auto">
              <p className="text-white/70 text-xs uppercase tracking-wider mb-2">{t('groundCrewReg.sidebar.benefits', 'Free Account Benefits')}</p>
              <div className="space-y-2">
                {freeAccountBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-white/80" />
                    <span className="text-white/90">{benefit}</span>
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
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-3" style={{ backgroundColor: `${GROUND_CREW_COLOR}10`, borderColor: `${GROUND_CREW_COLOR}30` }}>
                      <Users className="w-4 h-4" style={{ color: GROUND_CREW_COLOR }} />
                      <span className="text-xs font-medium text-center leading-tight" style={{ color: GROUND_CREW_COLOR }}>
                        {t('groundCrewReg.welcome.badge', 'For Ground Support Workers')}
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold mb-1">{t('groundCrewReg.welcome.title', 'Create your free account')}</h1>
                    <p className="text-sm text-muted-foreground">{t('groundCrewReg.welcome.subtitle', '60 seconds to set up. All your hours tracked.')}</p>
                  </div>

                  {/* FREE benefits section */}
                  <div className="space-y-1.5 mb-6">
                    {welcomeBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 shrink-0" style={{ color: GROUND_CREW_COLOR }} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={handleContinue}
                    className="w-full gap-2 rounded-full text-white"
                    style={{ backgroundColor: GROUND_CREW_COLOR }}
                    data-testid="button-ground-crew-start"
                  >
                    {t('groundCrewReg.welcome.start', 'Start Registration')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Account Details */}
              {step === "accountDetails" && (
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold mb-1">{t('groundCrewReg.account.title', 'Account Details')}</h2>
                      <p className="text-sm text-muted-foreground">{t('groundCrewReg.account.subtitle', 'Your personal and contact information')}</p>
                    </div>

                    {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm" data-testid="text-registration-error">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t('groundCrewReg.fields.firstName', 'First Name')} *</Label>
                        <Input
                          id="firstName"
                          value={data.firstName}
                          onChange={(e) => setData({ ...data, firstName: e.target.value })}
                          placeholder="John"
                          data-testid="input-first-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t('groundCrewReg.fields.lastName', 'Last Name')} *</Label>
                        <Input
                          id="lastName"
                          value={data.lastName}
                          onChange={(e) => setData({ ...data, lastName: e.target.value })}
                          placeholder="Smith"
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('groundCrewReg.fields.email', 'Email')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        placeholder="john@example.com"
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('groundCrewReg.fields.phone', 'Phone Number')} *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        data-testid="input-phone"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">{t('groundCrewReg.fields.password', 'Password')} *</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            placeholder="Min 8 characters"
                            data-testid="input-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t('groundCrewReg.fields.confirmPassword', 'Confirm Password')} *</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={data.confirmPassword}
                            onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                            placeholder="Re-enter password"
                            data-testid="input-confirm-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {t('groundCrewReg.passwordRequirements', 'Password must be at least 8 characters with uppercase, lowercase, and number')}
                    </p>

                    {/* Optional Address Section */}
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">{t('groundCrewReg.address.title', 'Address (Optional)')}</h3>
                      <div className="space-y-3">
                        <AddressAutocomplete
                          placeholder={t('groundCrewReg.fields.streetAddress', 'Start typing your address...')}
                          value={data.streetAddress}
                          onChange={(value) => setData({ ...data, streetAddress: value })}
                          onSelect={(address) => {
                            const streetAddr = address.houseNumber 
                              ? `${address.houseNumber} ${address.street}` 
                              : address.street;
                            setData({
                              ...data,
                              streetAddress: streetAddr || address.formatted,
                              city: address.city || "",
                              provinceState: address.state || "",
                              country: address.country || "",
                              postalCode: address.postcode || "",
                            });
                          }}
                          data-testid="input-street-address"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder={t('groundCrewReg.fields.city', 'City')}
                            value={data.city}
                            onChange={(e) => setData({ ...data, city: e.target.value })}
                            data-testid="input-city"
                          />
                          <Input
                            placeholder={t('groundCrewReg.fields.provinceState', 'Province/State')}
                            value={data.provinceState}
                            onChange={(e) => setData({ ...data, provinceState: e.target.value })}
                            data-testid="input-province"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder={t('groundCrewReg.fields.country', 'Country')}
                            value={data.country}
                            onChange={(e) => setData({ ...data, country: e.target.value })}
                            data-testid="input-country"
                          />
                          <Input
                            placeholder={t('groundCrewReg.fields.postalCode', 'Postal Code')}
                            value={data.postalCode}
                            onChange={(e) => setData({ ...data, postalCode: e.target.value })}
                            data-testid="input-postal-code"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact Section */}
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">{t('groundCrewReg.emergency.title', 'Emergency Contact')}</h3>
                      <div className="space-y-3">
                        <Input
                          placeholder={t('groundCrewReg.fields.emergencyName', 'Contact Name')}
                          value={data.emergencyContactName}
                          onChange={(e) => setData({ ...data, emergencyContactName: e.target.value })}
                          data-testid="input-emergency-name"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder={t('groundCrewReg.fields.emergencyPhone', 'Contact Phone')}
                            value={data.emergencyContactPhone}
                            onChange={(e) => setData({ ...data, emergencyContactPhone: e.target.value })}
                            data-testid="input-emergency-phone"
                          />
                          <Input
                            placeholder={t('groundCrewReg.fields.emergencyRelationship', 'Relationship')}
                            value={data.emergencyContactRelationship}
                            onChange={(e) => setData({ ...data, emergencyContactRelationship: e.target.value })}
                            data-testid="input-emergency-relationship"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={handleBack} className="gap-2" data-testid="button-back">
                        <ArrowLeft className="w-4 h-4" />
                        {t('common.back', 'Back')}
                      </Button>
                      <Button 
                        onClick={handleContinue}
                        className="flex-1 gap-2 text-white"
                        style={{ backgroundColor: GROUND_CREW_COLOR }}
                        disabled={registrationMutation.isPending}
                        data-testid="button-create-account"
                      >
                        {registrationMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t('groundCrewReg.creating', 'Creating Account...')}
                          </>
                        ) : (
                          <>
                            {t('groundCrewReg.createAccount', 'Create Account')}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Employer Info - Review Benefits Before Creating Account */}
              {step === "employer" && (
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${GROUND_CREW_COLOR}15` }}>
                        <Briefcase className="w-8 h-8" style={{ color: GROUND_CREW_COLOR }} />
                      </div>
                      <h2 className="text-xl font-bold mb-1">{t('groundCrewReg.employer.reviewTitle', 'What You Get')}</h2>
                      <p className="text-sm text-muted-foreground">{t('groundCrewReg.employer.subtitle', 'Here is what you get when connected to an employer')}</p>
                    </div>

                    <div className="space-y-3">
                      {employerBenefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <ChevronRight className="w-5 h-5 shrink-0 mt-0.5" style={{ color: GROUND_CREW_COLOR }} />
                          <div>
                            <h4 className="font-medium text-sm">{benefit.title}</h4>
                            <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-lg border border-dashed" style={{ borderColor: GROUND_CREW_COLOR }}>
                      <p className="text-sm text-center">
                        <strong>{t('groundCrewReg.employer.howToConnect', 'How to connect:')}</strong>{' '}
                        {t('groundCrewReg.employer.connectInstructions', 'Your employer will send you an invitation. Accept it from your portal to unlock all features.')}
                      </p>
                    </div>

                    {error && (
                      <p className="text-sm text-destructive text-center">{error}</p>
                    )}

                    <div className="flex gap-3">
                      <Button 
                        variant="outline"
                        onClick={handleBack}
                        className="flex-1"
                        disabled={registrationMutation.isPending}
                        data-testid="button-employer-back"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('groundCrewReg.back', 'Back')}
                      </Button>
                      <Button 
                        onClick={handleContinue}
                        className="flex-1 gap-2 text-white"
                        style={{ backgroundColor: GROUND_CREW_COLOR }}
                        disabled={registrationMutation.isPending}
                        data-testid="button-complete-registration"
                      >
                        {registrationMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t('groundCrewReg.creating', 'Creating Account...')}
                          </>
                        ) : (
                          <>
                            {t('groundCrewReg.completeRegistration', 'Complete Registration')}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Success (if needed) */}
              {step === "success" && (
                <div className="h-full flex flex-col justify-center items-center text-center max-w-md mx-auto">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${GROUND_CREW_COLOR}15` }}>
                    <CheckCircle className="w-10 h-10" style={{ color: GROUND_CREW_COLOR }} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{t('groundCrewReg.success.welcomeTitle', 'Welcome to OnRope.Pro!')}</h2>
                  <p className="text-muted-foreground mb-6">{t('groundCrewReg.success.welcomeMessage', 'Your Ground Crew account is ready. Head to your portal to get started.')}</p>
                  <Button 
                    onClick={handleGoToPortal}
                    className="gap-2 text-white"
                    style={{ backgroundColor: GROUND_CREW_COLOR }}
                    data-testid="button-success-portal"
                  >
                    {t('groundCrewReg.goToPortal', 'Go to My Portal')}
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
