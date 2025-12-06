import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, ArrowRight, ArrowLeft, Award, MapPin, Loader2, Phone, Mail, Lock, Heart, Building, CreditCard, Car, Calendar, Upload, Shield, Info, CheckCircle, X, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

function FileUploadButton({ 
  label, 
  file, 
  onFileChange,
  accept = "image/*,.pdf",
  testId
}: { 
  label: string; 
  file: File | null; 
  onFileChange: (file: File | null) => void;
  accept?: string;
  testId: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const isImage = useMemo(() => {
    return file?.type.startsWith('image/') ?? false;
  }, [file]);
  
  const isPdf = useMemo(() => {
    return file?.type === 'application/pdf';
  }, [file]);
  
  useEffect(() => {
    if (file && isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [file, isImage]);
  
  const handleClick = () => {
    inputRef.current?.click();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onFileChange(selectedFile);
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={accept}
        onChange={handleChange}
        data-testid={testId}
      />
      <Button
        type="button"
        variant={file ? "default" : "outline"}
        className={`w-full justify-start gap-2 ${file ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
        onClick={handleClick}
      >
        {file ? <CheckCircle className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
        <span className="truncate flex-1 text-left">
          {file ? file.name : label}
        </span>
        {file && (
          <X 
            className="w-4 h-4 ml-auto hover:text-red-200" 
            onClick={handleRemove}
          />
        )}
      </Button>
      {file && (
        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </p>
      )}
      {previewUrl && isImage && (
        <div className="relative mt-2 rounded-md overflow-hidden border border-border">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-auto max-h-48 object-contain bg-muted"
            data-testid={`${testId}-preview`}
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
      {file && isPdf && (
        <div className="relative mt-2 rounded-md overflow-hidden border border-border bg-muted p-4 flex items-center gap-3">
          <FileText className="w-8 h-8 text-red-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">PDF Document</p>
          </div>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="h-6 w-6 flex-shrink-0"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

type CertificationType = "irata" | "sprat" | "both" | "none" | null;

type RegistrationStep = 
  | "firstName"
  | "lastName"
  | "certification"
  | "licenseNumbers"
  | "address"
  | "email"
  | "phone"
  | "password"
  | "emergencyContact"
  | "socialInsurance"
  | "bankInfo"
  | "driversLicense"
  | "birthday"
  | "medicalConditions"
  | "complete";

interface TechnicianData {
  firstName: string;
  lastName: string;
  certification: CertificationType;
  irataLevel: string;
  irataLicenseNumber: string;
  spratLevel: string;
  spratLicenseNumber: string;
  certificationCardFile: File | null;
  streetAddress: string;
  city: string;
  provinceState: string;
  country: string;
  postalCode: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  socialInsuranceNumber: string;
  bankTransitNumber: string;
  bankInstitutionNumber: string;
  bankAccountNumber: string;
  voidChequeFile: File | null;
  driversLicenseNumber: string;
  driversLicenseExpiry: string;
  driversLicenseFile: File | null;
  driversAbstractFile: File | null;
  birthday: string;
  specialMedicalConditions: string;
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
    irataLevel: "",
    irataLicenseNumber: "",
    spratLevel: "",
    spratLicenseNumber: "",
    certificationCardFile: null,
    streetAddress: "",
    city: "",
    provinceState: "",
    country: "",
    postalCode: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    socialInsuranceNumber: "",
    bankTransitNumber: "",
    bankInstitutionNumber: "",
    bankAccountNumber: "",
    voidChequeFile: null,
    driversLicenseNumber: "",
    driversLicenseExpiry: "",
    driversLicenseFile: null,
    driversAbstractFile: null,
    birthday: "",
    specialMedicalConditions: "",
  });
  const [error, setError] = useState("");

  const resetForm = () => {
    setStep("firstName");
    setData({
      firstName: "",
      lastName: "",
      certification: null,
      irataLevel: "",
      irataLicenseNumber: "",
      spratLevel: "",
      spratLicenseNumber: "",
      certificationCardFile: null,
      streetAddress: "",
      city: "",
      provinceState: "",
      country: "",
      postalCode: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      socialInsuranceNumber: "",
      bankTransitNumber: "",
      bankInstitutionNumber: "",
      bankAccountNumber: "",
      voidChequeFile: null,
      driversLicenseNumber: "",
      driversLicenseExpiry: "",
      driversLicenseFile: null,
      driversAbstractFile: null,
      birthday: "",
      specialMedicalConditions: "",
    });
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const stepOrder: RegistrationStep[] = [
    "firstName",
    "lastName", 
    "certification",
    "licenseNumbers",
    "address",
    "email",
    "phone",
    "password",
    "emergencyContact",
    "socialInsurance",
    "bankInfo",
    "driversLicense",
    "birthday",
    "medicalConditions",
    "complete"
  ];

  const getNextStep = (currentStep: RegistrationStep): RegistrationStep => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentStep === "certification" && data.certification === "none") {
      return "address";
    }
    return stepOrder[currentIndex + 1] || "complete";
  };

  const getPrevStep = (currentStep: RegistrationStep): RegistrationStep => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentStep === "address" && data.certification === "none") {
      return "certification";
    }
    return stepOrder[currentIndex - 1] || "firstName";
  };

  const handleContinue = () => {
    setError("");
    
    switch (step) {
      case "firstName":
        if (!data.firstName.trim()) {
          setError("Please enter your first name");
          return;
        }
        break;
      case "lastName":
        if (!data.lastName.trim()) {
          setError("Please enter your last name");
          return;
        }
        break;
      case "certification":
        if (!data.certification) {
          setError("Please select a certification option");
          return;
        }
        break;
      case "licenseNumbers":
        if (data.certification === "irata" || data.certification === "both") {
          if (!data.irataLevel) {
            setError("Please select your IRATA level");
            return;
          }
          if (!data.irataLicenseNumber.trim()) {
            setError("Please enter your IRATA license number");
            return;
          }
        }
        if (data.certification === "sprat" || data.certification === "both") {
          if (!data.spratLevel) {
            setError("Please select your SPRAT level");
            return;
          }
          if (!data.spratLicenseNumber.trim()) {
            setError("Please enter your SPRAT license number");
            return;
          }
        }
        break;
      case "address":
        if (!data.streetAddress.trim()) {
          setError("Please enter your street address");
          return;
        }
        if (!data.city.trim()) {
          setError("Please enter your city");
          return;
        }
        if (!data.provinceState.trim()) {
          setError("Please enter your province/state");
          return;
        }
        if (!data.country.trim()) {
          setError("Please enter your country");
          return;
        }
        if (!data.postalCode.trim()) {
          setError("Please enter your postal code");
          return;
        }
        break;
      case "email":
        if (!data.email.trim()) {
          setError("Please enter your email address");
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          setError("Please enter a valid email address");
          return;
        }
        break;
      case "phone":
        if (!data.phone.trim()) {
          setError("Please enter your phone number");
          return;
        }
        break;
      case "password":
        if (!data.password) {
          setError("Please enter a password");
          return;
        }
        if (data.password.length < 8) {
          setError("Password must be at least 8 characters");
          return;
        }
        if (!/[A-Z]/.test(data.password)) {
          setError("Password must contain at least one uppercase letter");
          return;
        }
        if (!/[a-z]/.test(data.password)) {
          setError("Password must contain at least one lowercase letter");
          return;
        }
        if (!/[0-9]/.test(data.password)) {
          setError("Password must contain at least one number");
          return;
        }
        if (data.password !== data.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        break;
      case "emergencyContact":
        if (!data.emergencyContactName.trim()) {
          setError("Please enter emergency contact name");
          return;
        }
        if (!data.emergencyContactPhone.trim()) {
          setError("Please enter emergency contact phone number");
          return;
        }
        break;
      case "socialInsurance":
        break;
      case "bankInfo":
        break;
      case "driversLicense":
        break;
      case "birthday":
        break;
      case "medicalConditions":
        break;
    }
    
    setStep(getNextStep(step));
  };

  const handleBack = () => {
    setError("");
    setStep(getPrevStep(step));
  };

  const handleCertificationSelect = (cert: CertificationType) => {
    setData({ ...data, certification: cert });
    setError("");
  };

  const handleFileChange = (field: keyof TechnicianData, file: File | null) => {
    setData({ ...data, [field]: file });
  };

  const registrationMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('certification', data.certification || 'none');
      formData.append('irataLevel', data.irataLevel);
      formData.append('irataLicenseNumber', data.irataLicenseNumber);
      formData.append('spratLevel', data.spratLevel);
      formData.append('spratLicenseNumber', data.spratLicenseNumber);
      formData.append('streetAddress', data.streetAddress);
      formData.append('city', data.city);
      formData.append('provinceState', data.provinceState);
      formData.append('country', data.country);
      formData.append('postalCode', data.postalCode);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      formData.append('emergencyContactName', data.emergencyContactName);
      formData.append('emergencyContactPhone', data.emergencyContactPhone);
      formData.append('socialInsuranceNumber', data.socialInsuranceNumber);
      formData.append('bankTransitNumber', data.bankTransitNumber);
      formData.append('bankInstitutionNumber', data.bankInstitutionNumber);
      formData.append('bankAccountNumber', data.bankAccountNumber);
      formData.append('driversLicenseNumber', data.driversLicenseNumber);
      formData.append('driversLicenseExpiry', data.driversLicenseExpiry);
      formData.append('birthday', data.birthday);
      formData.append('specialMedicalConditions', data.specialMedicalConditions);
      
      if (data.certificationCardFile) {
        formData.append('certificationCard', data.certificationCardFile);
      }
      if (data.voidChequeFile) {
        formData.append('voidCheque', data.voidChequeFile);
      }
      if (data.driversLicenseFile) {
        formData.append('driversLicense', data.driversLicenseFile);
      }
      if (data.driversAbstractFile) {
        formData.append('driversAbstract', data.driversAbstractFile);
      }

      const response = await fetch('/api/technician-register', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted successfully.",
      });
      setStep("complete");
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

  const handleSubmit = () => {
    registrationMutation.mutate();
  };

  const PrivacyNotice = () => (
    <div className="p-3 rounded-lg bg-muted/50 border text-sm space-y-2">
      <div className="flex items-start gap-2">
        <Shield className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
        <div>
          <p className="font-medium">Your Information is Secure</p>
          <p className="text-muted-foreground text-xs mt-1">
            We store your information securely, limit access to authorized employer staff only, 
            and never sell or share it outside your company without your consent or legal requirement.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Info className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
        <p className="text-muted-foreground text-xs">
          Information collected may be used by your employer for HR purposes including payroll processing, 
          certification compliance, driving eligibility verification, and emergency contact procedures.
        </p>
      </div>
    </div>
  );

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
            <div className="py-6 space-y-4">
              <PrivacyNotice />
              <div>
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
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
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
                <ArrowLeft className="w-4 h-4 mr-2" />
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
                <ArrowLeft className="w-4 h-4 mr-2" />
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
                Enter your license details
              </DialogTitle>
              <DialogDescription className="text-center">
                {data.certification === "both" 
                  ? "Please enter both your IRATA and SPRAT license details"
                  : `Please enter your ${data.certification?.toUpperCase()} license details`
                }
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {(data.certification === "irata" || data.certification === "both") && (
                <div className="space-y-4 p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold">IRATA License</h3>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <p className="text-muted-foreground">
                      Your IRATA license number format is: <strong>1/123456</strong> where the first digit 
                      indicates your level (1, 2, or 3) followed by your unique license number.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>IRATA Level & License Number</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={data.irataLevel}
                        onValueChange={(value) => setData({ ...data, irataLevel: value })}
                      >
                        <SelectTrigger className="w-24" data-testid="select-irata-level">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1/</SelectItem>
                          <SelectItem value="2">2/</SelectItem>
                          <SelectItem value="3">3/</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        data-testid="input-irata-license-number"
                        placeholder="123456"
                        value={data.irataLicenseNumber}
                        onChange={(e) => setData({ ...data, irataLicenseNumber: e.target.value.replace(/\D/g, '') })}
                        className="flex-1"
                        maxLength={10}
                      />
                    </div>
                    {data.irataLevel && data.irataLicenseNumber && (
                      <p className="text-sm text-muted-foreground">
                        Full license number: <Badge variant="secondary">{data.irataLevel}/{data.irataLicenseNumber}</Badge>
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Upload Certification Card (Optional)</Label>
                    <FileUploadButton
                      label="Upload IRATA certification card photo"
                      file={data.certificationCardFile}
                      onFileChange={(file) => handleFileChange('certificationCardFile', file)}
                      testId="input-cert-card-upload"
                    />
                  </div>
                </div>
              )}

              {(data.certification === "sprat" || data.certification === "both") && (
                <div className="space-y-4 p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">SPRAT License</h3>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <p className="text-muted-foreground">
                      Your SPRAT certification level (1, 2, or 3) and license number.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>SPRAT Level & License Number</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={data.spratLevel}
                        onValueChange={(value) => setData({ ...data, spratLevel: value })}
                      >
                        <SelectTrigger className="w-24" data-testid="select-sprat-level">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Level 1</SelectItem>
                          <SelectItem value="2">Level 2</SelectItem>
                          <SelectItem value="3">Level 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        data-testid="input-sprat-license-number"
                        placeholder="License number"
                        value={data.spratLicenseNumber}
                        onChange={(e) => setData({ ...data, spratLicenseNumber: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-license"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
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
                <div className="p-3 rounded-full bg-green-500/10">
                  <MapPin className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                What's your address?
              </DialogTitle>
              <DialogDescription className="text-center">
                Enter your home address
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  data-testid="input-street-address"
                  placeholder="123 Main Street, Apt 4B"
                  value={data.streetAddress}
                  onChange={(e) => setData({ ...data, streetAddress: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    data-testid="input-city"
                    placeholder="Vancouver"
                    value={data.city}
                    onChange={(e) => setData({ ...data, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provinceState">Province/State</Label>
                  <Input
                    id="provinceState"
                    data-testid="input-province-state"
                    placeholder="BC"
                    value={data.provinceState}
                    onChange={(e) => setData({ ...data, provinceState: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    data-testid="input-country"
                    placeholder="Canada"
                    value={data.country}
                    onChange={(e) => setData({ ...data, country: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    data-testid="input-postal-code"
                    placeholder="V6B 1A1"
                    value={data.postalCode}
                    onChange={(e) => setData({ ...data, postalCode: e.target.value })}
                  />
                </div>
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
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
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </DialogFooter>
          </>
        );

      case "email":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                What's your email?
              </DialogTitle>
              <DialogDescription className="text-center">
                We'll use this to send you important updates
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="input-email"
                placeholder="you@example.com"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
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
                data-testid="button-continue-email"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </DialogFooter>
          </>
        );

      case "phone":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <Phone className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                What's your phone number?
              </DialogTitle>
              <DialogDescription className="text-center">
                For work-related communication
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="phone" className="sr-only">Phone</Label>
              <Input
                id="phone"
                type="tel"
                data-testid="input-phone"
                placeholder="(604) 555-0123"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
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
                data-testid="button-continue-phone"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </DialogFooter>
          </>
        );

      case "password":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-purple-500/10">
                  <Lock className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Create a password
              </DialogTitle>
              <DialogDescription className="text-center">
                Choose a secure password
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Password requirements:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>At least 8 characters</li>
                  <li>At least one uppercase letter (A-Z)</li>
                  <li>At least one lowercase letter (a-z)</li>
                  <li>At least one number (0-9)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  data-testid="input-password"
                  placeholder="Enter password"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  data-testid="input-confirm-password"
                  placeholder="Re-enter password"
                  value={data.confirmPassword}
                  onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                  className="h-12"
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-password"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </DialogFooter>
          </>
        );

      case "emergencyContact":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-red-500/10">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Emergency Contact
              </DialogTitle>
              <DialogDescription className="text-center">
                Who should we contact in case of emergency?
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input
                  id="emergencyName"
                  data-testid="input-emergency-name"
                  placeholder="John Doe"
                  value={data.emergencyContactName}
                  onChange={(e) => setData({ ...data, emergencyContactName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  data-testid="input-emergency-phone"
                  placeholder="(604) 555-0123"
                  value={data.emergencyContactPhone}
                  onChange={(e) => setData({ ...data, emergencyContactPhone: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-emergency"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </DialogFooter>
          </>
        );

      case "socialInsurance":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-slate-500/10">
                  <Building className="w-8 h-8 text-slate-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Social Insurance Number
              </DialogTitle>
              <DialogDescription className="text-center">
                Optional - for Human Resources and payroll purposes
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="text-muted-foreground">
                  Your SIN is used for tax reporting and payroll processing. 
                  This field is optional and can be provided later.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sin">Social Insurance Number (Optional)</Label>
                <Input
                  id="sin"
                  data-testid="input-sin"
                  placeholder="XXX-XXX-XXX"
                  value={data.socialInsuranceNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                    const formatted = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3').replace(/-$/, '').replace(/-$/, '');
                    setData({ ...data, socialInsuranceNumber: formatted });
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                  className="text-center text-lg h-12"
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-sin"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </DialogFooter>
          </>
        );

      case "bankInfo":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <CreditCard className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Bank Information
              </DialogTitle>
              <DialogDescription className="text-center">
                Optional - for direct deposit payroll
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="text-muted-foreground">
                  Bank details are used for direct deposit of your pay. 
                  You can skip this and provide it later, or upload a void cheque instead.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transit">Transit Number</Label>
                  <Input
                    id="transit"
                    data-testid="input-bank-transit"
                    placeholder="12345"
                    value={data.bankTransitNumber}
                    onChange={(e) => setData({ ...data, bankTransitNumber: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution Number</Label>
                  <Input
                    id="institution"
                    data-testid="input-bank-institution"
                    placeholder="123"
                    value={data.bankInstitutionNumber}
                    onChange={(e) => setData({ ...data, bankInstitutionNumber: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                    maxLength={3}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Account Number</Label>
                <Input
                  id="account"
                  data-testid="input-bank-account"
                  placeholder="1234567"
                  value={data.bankAccountNumber}
                  onChange={(e) => setData({ ...data, bankAccountNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                  maxLength={12}
                />
              </div>
              <div className="space-y-2">
                <Label>Upload Void Cheque (Optional)</Label>
                <FileUploadButton
                  label="Upload void cheque photo"
                  file={data.voidChequeFile}
                  onFileChange={(file) => handleFileChange('voidChequeFile', file)}
                  testId="input-void-cheque-upload"
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-bank"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </DialogFooter>
          </>
        );

      case "driversLicense":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Car className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Driver's License
              </DialogTitle>
              <DialogDescription className="text-center">
                Optional - for driving eligibility verification
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="text-muted-foreground">
                  Driver's license information may be required for positions that involve operating company vehicles.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dlNumber">License Number</Label>
                  <Input
                    id="dlNumber"
                    data-testid="input-dl-number"
                    placeholder="1234567"
                    value={data.driversLicenseNumber}
                    onChange={(e) => setData({ ...data, driversLicenseNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dlExpiry">Expiry Date</Label>
                  <Input
                    id="dlExpiry"
                    type="date"
                    data-testid="input-dl-expiry"
                    value={data.driversLicenseExpiry}
                    onChange={(e) => setData({ ...data, driversLicenseExpiry: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Upload Driver's License Photo (Optional)</Label>
                <FileUploadButton
                  label="Upload driver's license photo"
                  file={data.driversLicenseFile}
                  onFileChange={(file) => handleFileChange('driversLicenseFile', file)}
                  testId="input-dl-photo-upload"
                />
              </div>
              <div className="space-y-2">
                <Label>Upload Driver's Abstract (Optional)</Label>
                <FileUploadButton
                  label="Upload driver's abstract"
                  file={data.driversAbstractFile}
                  onFileChange={(file) => handleFileChange('driversAbstractFile', file)}
                  testId="input-dl-abstract-upload"
                />
                <p className="text-xs text-muted-foreground">
                  A driver's abstract is an official driving record from your province/state.
                </p>
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-dl"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </DialogFooter>
          </>
        );

      case "birthday":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-pink-500/10">
                  <Calendar className="w-8 h-8 text-pink-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                When's your birthday?
              </DialogTitle>
              <DialogDescription className="text-center">
                Optional - for HR records
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="birthday" className="sr-only">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                data-testid="input-birthday"
                value={data.birthday}
                onChange={(e) => setData({ ...data, birthday: e.target.value })}
                className="text-center text-lg h-12"
              />
              {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-birthday"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </DialogFooter>
          </>
        );

      case "medicalConditions":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-red-500/10">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Special Medical Conditions
              </DialogTitle>
              <DialogDescription className="text-center">
                Optional - any conditions we should be aware of
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="text-muted-foreground">
                  This information helps us ensure your safety on the job. 
                  Include any allergies, conditions, or medications that first responders should know about.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medical">Medical Conditions (Optional)</Label>
                <Textarea
                  id="medical"
                  data-testid="input-medical-conditions"
                  placeholder="e.g., Allergies, diabetes, epilepsy, medications..."
                  value={data.specialMedicalConditions}
                  onChange={(e) => setData({ ...data, specialMedicalConditions: e.target.value })}
                  rows={4}
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleSubmit} 
                className="w-full"
                disabled={registrationMutation.isPending}
                data-testid="button-save-registration"
              >
                {registrationMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Save Registration
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
                disabled={registrationMutation.isPending}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
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
                  <Award className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Registration Complete!
              </DialogTitle>
              <DialogDescription className="text-center">
                Thank you, {data.firstName}! Your registration has been submitted.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 space-y-2">
                <p className="text-sm text-center">
                  Your employer will review your registration and grant you access to the system.
                </p>
                <p className="text-sm text-center text-muted-foreground">
                  You'll receive an email at <strong>{data.email}</strong> once your account is activated.
                </p>
              </div>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleClose} 
                className="w-full"
                data-testid="button-close-registration"
              >
                Close
              </Button>
            </DialogFooter>
          </>
        );

      default:
        return null;
    }
  };

  const currentStepIndex = stepOrder.indexOf(step);
  const totalSteps = stepOrder.length - 1;
  const progress = Math.round((currentStepIndex / totalSteps) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {step !== "complete" && step !== "firstName" && (
          <div className="w-full bg-muted rounded-full h-1.5 mb-2">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
