import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  User, ArrowRight, ArrowLeft, Award, Loader2, 
  Check, Upload, Shield, Copy, Mail, MessageSquare,
  Briefcase, FileText, Clock, Bell, ChevronRight,
  HardHat, X, CheckCircle, Eye, EyeOff, Building
} from "lucide-react";

type RegistrationStep = "welcome" | "accountDetails" | "certification" | "success";
type CertificationType = "irata" | "sprat" | "both" | "trainee" | null;

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
  employerCompanyName: string;
  employerEmail: string;
}

interface TechnicianRegistrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TechnicianRegistration({ open, onOpenChange }: TechnicianRegistrationProps) {
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
    employerCompanyName: "",
    employerEmail: "",
  });
  const [error, setError] = useState("");
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
      employerCompanyName: "",
      employerEmail: "",
    });
    setError("");
    setGeneratedReferralCode("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

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
      setStep("success");
      toast({
        title: "Registration Complete!",
        description: "Your account has been created successfully.",
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

  const validateAccountDetails = (): boolean => {
    if (!data.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!data.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError("Valid email is required");
      return false;
    }
    if (!data.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!data.password || data.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(data.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(data.password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(data.password)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!data.streetAddress.trim() || !data.city.trim() || !data.provinceState.trim() || !data.country.trim() || !data.postalCode.trim()) {
      setError("Full address is required");
      return false;
    }
    return true;
  };

  const validateCertification = (): boolean => {
    if (!data.certification) {
      setError("Please select a certification type");
      return false;
    }
    if (data.certification === "irata" || data.certification === "both") {
      if (!data.irataLevel || !data.irataLicenseNumber.trim()) {
        setError("IRATA level and license number are required");
        return false;
      }
    }
    if (data.certification === "sprat" || data.certification === "both") {
      if (!data.spratLevel || !data.spratLicenseNumber.trim()) {
        setError("SPRAT level and license number are required");
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
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "accountDetails") {
      setStep("welcome");
    } else if (step === "certification") {
      setStep("accountDetails");
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
    if (step === "success") return 3;
    return 0;
  };

  const benefits = [
    { icon: Briefcase, text: "Portable professional profile" },
    { icon: Clock, text: "Automatic work hour logging" },
    { icon: FileText, text: "Never fill out onboarding forms again" },
    { icon: Award, text: "Free upgrade when you share" },
  ];

  const plusBenefits = [
    "Unlimited employer connections",
    "Exportable work history PDF",
    "30-day certification expiry alerts",
    "Job board access",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden max-h-[90vh]">
        <div className="flex flex-col lg:flex-row min-h-[600px] max-h-[90vh]">
          {/* Left Panel - Blue sidebar */}
          <div className="hidden lg:flex lg:w-[320px] bg-[#0369A1] text-white p-8 flex-col">
            <div className="mb-8">
              <HardHat className="w-10 h-10 mb-4" />
              <h2 className="text-xl font-bold mb-2">Create Your Profile</h2>
              <p className="text-white/80 text-sm">Join thousands of rope access technicians</p>
            </div>
            
            {/* Progress Steps */}
            <div className="space-y-4 mb-8">
              <div className={`flex items-center gap-3 ${getStepNumber() >= 1 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepNumber() >= 1 ? 'bg-white text-[#0369A1]' : 'bg-white/20'}`}>
                  {getStepNumber() > 1 ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <span className="text-sm font-medium">Account Details</span>
              </div>
              <div className={`flex items-center gap-3 ${getStepNumber() >= 2 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepNumber() >= 2 ? 'bg-white text-[#0369A1]' : 'bg-white/20'}`}>
                  {getStepNumber() > 2 ? <Check className="w-4 h-4" /> : "2"}
                </div>
                <span className="text-sm font-medium">Certification</span>
              </div>
              <div className={`flex items-center gap-3 ${getStepNumber() >= 3 ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepNumber() >= 3 ? 'bg-white text-[#0369A1]' : 'bg-white/20'}`}>
                  {getStepNumber() >= 3 ? <Check className="w-4 h-4" /> : "3"}
                </div>
                <span className="text-sm font-medium">Complete</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-auto">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-3">What you get</p>
              <div className="space-y-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <benefit.icon className="w-4 h-4 text-white/80" />
                    <span className="text-white/90">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Form content */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Close button */}
            <div className="absolute right-4 top-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                data-testid="button-close-registration"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 p-8 lg:p-10">
              {/* Welcome Screen */}
              {step === "welcome" && (
                <div className="h-full flex flex-col justify-center max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                      <HardHat className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">For IRATA & SPRAT Technicians</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-3">Create your free account</h1>
                    <p className="text-muted-foreground">Takes 60 seconds. Free forever.</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="font-medium">{benefit.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Referral Code Input */}
                  <div className="mb-6">
                    <Label className="text-sm text-muted-foreground mb-2 block">Have a referral code? (optional)</Label>
                    <Input
                      placeholder="Enter referral code"
                      value={data.referralCodeInput}
                      onChange={(e) => setData({ ...data, referralCodeInput: e.target.value.toUpperCase() })}
                      className="text-center tracking-widest"
                      data-testid="input-referral-code"
                    />
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full gap-2 rounded-full bg-[#0369A1]"
                    onClick={handleContinue}
                    data-testid="button-get-started"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Already have an account?{" "}
                    <button 
                      className="text-primary font-medium hover:underline"
                      onClick={handleClose}
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              )}

              {/* Account Details Screen */}
              {step === "accountDetails" && (
                <div className="max-w-lg mx-auto">
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Step 1 of 3</p>
                    <h2 className="text-2xl font-bold">Account Details</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={data.firstName}
                          onChange={(e) => setData({ ...data, firstName: e.target.value })}
                          data-testid="input-first-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Smith"
                          value={data.lastName}
                          onChange={(e) => setData({ ...data, lastName: e.target.value })}
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        data-testid="input-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                        data-testid="input-phone"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
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
                      <p className="text-xs text-muted-foreground mt-1">Min 8 chars, 1 uppercase, 1 lowercase, 1 number</p>
                    </div>

                    <div>
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium mb-3">Address</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="streetAddress">Street Address</Label>
                          <Input
                            id="streetAddress"
                            placeholder="123 Main St"
                            value={data.streetAddress}
                            onChange={(e) => setData({ ...data, streetAddress: e.target.value })}
                            data-testid="input-street-address"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              placeholder="Vancouver"
                              value={data.city}
                              onChange={(e) => setData({ ...data, city: e.target.value })}
                              data-testid="input-city"
                            />
                          </div>
                          <div>
                            <Label htmlFor="provinceState">Province/State</Label>
                            <Input
                              id="provinceState"
                              placeholder="BC"
                              value={data.provinceState}
                              onChange={(e) => setData({ ...data, provinceState: e.target.value })}
                              data-testid="input-province-state"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              placeholder="Canada"
                              value={data.country}
                              onChange={(e) => setData({ ...data, country: e.target.value })}
                              data-testid="input-country"
                            />
                          </div>
                          <div>
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input
                              id="postalCode"
                              placeholder="V6B 1A1"
                              value={data.postalCode}
                              onChange={(e) => setData({ ...data, postalCode: e.target.value })}
                              data-testid="input-postal-code"
                            />
                          </div>
                        </div>
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
                      Back
                    </Button>
                    <Button 
                      className="flex-1 gap-2 bg-[#0369A1]"
                      onClick={handleContinue}
                      data-testid="button-continue-to-certification"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Certification Screen */}
              {step === "certification" && (
                <div className="max-w-lg mx-auto">
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Step 2 of 3</p>
                    <h2 className="text-2xl font-bold">Verify Your Certification</h2>
                    <p className="text-muted-foreground mt-1">Select your certification type</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { value: "irata", label: "IRATA" },
                      { value: "sprat", label: "SPRAT" },
                      { value: "both", label: "Both" },
                      { value: "trainee", label: "Trainee" },
                    ].map((cert) => (
                      <button
                        key={cert.value}
                        type="button"
                        className={`p-4 rounded-lg border-2 text-center font-medium transition-all ${
                          data.certification === cert.value
                            ? "border-[#0369A1] bg-[#0369A1]/10 text-[#0369A1]"
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
                        <Award className="w-4 h-4 text-[#0369A1]" />
                        IRATA Details
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Level</Label>
                          <div className="flex gap-2 mt-1">
                            {["1", "2", "3"].map((level) => (
                              <button
                                key={level}
                                type="button"
                                className={`flex-1 py-2 rounded-md border text-sm font-medium transition-all ${
                                  data.irataLevel === level
                                    ? "border-[#0369A1] bg-[#0369A1] text-white"
                                    : "border-border hover:border-muted-foreground/50"
                                }`}
                                onClick={() => setData({ ...data, irataLevel: level })}
                                data-testid={`button-irata-level-${level}`}
                              >
                                Level {level}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="irataLicenseNumber">License Number</Label>
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
                        <Award className="w-4 h-4 text-[#0369A1]" />
                        SPRAT Details
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Level</Label>
                          <div className="flex gap-2 mt-1">
                            {["1", "2", "3"].map((level) => (
                              <button
                                key={level}
                                type="button"
                                className={`flex-1 py-2 rounded-md border text-sm font-medium transition-all ${
                                  data.spratLevel === level
                                    ? "border-[#0369A1] bg-[#0369A1] text-white"
                                    : "border-border hover:border-muted-foreground/50"
                                }`}
                                onClick={() => setData({ ...data, spratLevel: level })}
                                data-testid={`button-sprat-level-${level}`}
                              >
                                Level {level}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="spratLicenseNumber">License Number</Label>
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
                  {data.certification && data.certification !== "trainee" && (
                    <div className="mb-4">
                      <Label className="mb-2 block">Upload Certification Card (optional)</Label>
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
                            Tap to upload photo
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">Supported: JPG, PNG, PDF</p>
                    </div>
                  )}

                  {/* Employer Connection (Optional) */}
                  <div className="space-y-3 mb-4 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#0369A1]" />
                      Employer Connection (Optional)
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      We will search to see if your employer already has an OnRopePro account and will initiate a connection if they do.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="employerCompanyName">Employer Company Name</Label>
                        <Input
                          id="employerCompanyName"
                          placeholder="Acme Rope Access Inc."
                          value={data.employerCompanyName || ""}
                          onChange={(e) => setData({ ...data, employerCompanyName: e.target.value })}
                          className="mt-1"
                          data-testid="input-employer-company-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="employerEmail">Employer Email Address</Label>
                        <Input
                          id="employerEmail"
                          type="email"
                          placeholder="office@acmerope.com"
                          value={data.employerEmail || ""}
                          onChange={(e) => setData({ ...data, employerEmail: e.target.value })}
                          className="mt-1"
                          data-testid="input-employer-email"
                        />
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
                      Back
                    </Button>
                    <Button 
                      className="flex-1 gap-2 bg-[#0369A1]"
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
                <div className="max-w-lg mx-auto text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Welcome to OnRopePro!</h2>
                  <p className="text-muted-foreground mb-8">
                    Your account is ready, {data.firstName}
                  </p>

                  {/* Referral Code Section */}
                  {generatedReferralCode && (
                    <div className="bg-muted/50 rounded-xl p-6 mb-6 text-left">
                      <h3 className="font-semibold text-center mb-4">YOUR REFERRAL CODE</h3>
                      
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
                        Share with 1 other tech and you get a free upgrade to Plus
                      </p>
                      
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Text
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={copyReferralCode}>
                          <Copy className="w-4 h-4" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Plus Benefits Preview */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-6 mb-6 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-400">PLUS</span>
                      <span className="text-sm text-muted-foreground">includes:</span>
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
                    className="w-full gap-2 rounded-full bg-[#0369A1]"
                    onClick={() => {
                      handleClose();
                      setLocation("/technician-login");
                    }}
                    data-testid="button-go-to-profile"
                  >
                    Go to Sign In
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  
                  <button 
                    className="text-sm text-muted-foreground mt-4 hover:underline"
                    onClick={handleClose}
                  >
                    Close this dialog
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
