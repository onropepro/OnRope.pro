import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Check, Loader2, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Official Resident color from stakeholder palette
const RESIDENT_COLOR = "#86A59C";

interface ResidentSlidingSignupProps {
  onClose?: () => void;
  onShowSignIn?: () => void;
}

type Step = 
  | "name" 
  | "email" 
  | "phone" 
  | "strata" 
  | "unit" 
  | "parking" 
  | "password";

const STEPS: Step[] = ["name", "email", "phone", "strata", "unit", "parking", "password"];

export function ResidentSlidingSignup({ onClose, onShowSignIn }: ResidentSlidingSignupProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("name");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnitConflict, setShowUnitConflict] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    strataPlanNumber: "",
    unitNumber: "",
    parkingStallNumber: "",
    password: "",
    confirmPassword: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentStepIndex = STEPS.indexOf(currentStep);

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case "name":
        if (!formData.name.trim()) {
          newErrors.name = "Name is required";
        }
        break;
      case "email":
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        break;
      case "phone":
        if (!formData.phoneNumber.trim()) {
          newErrors.phone = "Phone number is required";
        }
        break;
      case "strata":
        if (!formData.strataPlanNumber.trim()) {
          newErrors.strata = "Strata/HOA/LMS Plan Number is required";
        }
        break;
      case "unit":
        if (!formData.unitNumber.trim()) {
          newErrors.unit = "Unit number is required";
        }
        break;
      case "parking":
        // Optional - no validation needed
        break;
      case "password":
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const handleSubmit = async (confirmUnitTakeover: boolean = false) => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          strataPlanNumber: formData.strataPlanNumber,
          unitNumber: formData.unitNumber,
          parkingStallNumber: formData.parkingStallNumber || undefined,
          role: "resident",
          passwordHash: formData.password,
          confirmUnitTakeover,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409 && result.unitConflict && result.requiresConfirmation) {
          setShowUnitConflict(true);
          setIsSubmitting(false);
          return;
        }
        
        toast({
          title: "Registration Failed",
          description: result.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to dashboard
      window.location.href = "/resident-dashboard";
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentStep === "password") {
        handleSubmit();
      } else {
        handleNext();
      }
    }
  };

  // Unit conflict dialog
  if (showUnitConflict) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Unit Already Registered</h3>
        <p className="text-muted-foreground mb-4">
          This unit is already linked to another resident account. If this is your unit, 
          you can take over the registration. The previous account will be unlinked.
        </p>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowUnitConflict(false);
              setCurrentStep("unit");
            }}
            data-testid="button-cancel-takeover"
          >
            Change Unit Number
          </Button>
          <Button 
            style={{ backgroundColor: RESIDENT_COLOR }}
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            data-testid="button-confirm-takeover"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "This Is My Unit"}
          </Button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    const stepVariants = {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {currentStep === "name" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  placeholder={t('common.placeholders.fullName', 'John Smith')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className={errors.name ? "border-red-500" : ""}
                  data-testid="input-resident-name"
                />
                <Button 
                  onClick={handleNext}
                  style={{ backgroundColor: RESIDENT_COLOR }}
                  className="shrink-0"
                  data-testid="button-next-name"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
          )}

          {currentStep === "email" && (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder={t('common.placeholders.email', 'you@example.com')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className={errors.email ? "border-red-500" : ""}
                  data-testid="input-resident-email"
                />
                <Button 
                  onClick={handleNext}
                  style={{ backgroundColor: RESIDENT_COLOR }}
                  className="shrink-0"
                  data-testid="button-next-email"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
          )}

          {currentStep === "phone" && (
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t('common.placeholders.phone', '604-123-4567')}
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className={errors.phone ? "border-red-500" : ""}
                  data-testid="input-resident-phone"
                />
                <Button 
                  onClick={handleNext}
                  style={{ backgroundColor: RESIDENT_COLOR }}
                  className="shrink-0"
                  data-testid="button-next-phone"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
          )}

          {currentStep === "strata" && (
            <div className="space-y-2">
              <Label htmlFor="strata" className="text-sm font-medium text-foreground">Strata/HOA/LMS Plan Number</Label>
              <div className="flex gap-2">
                <Input
                  id="strata"
                  placeholder={t('resident.placeholders.strataNumber', 'LMS1234')}
                  value={formData.strataPlanNumber}
                  onChange={(e) => setFormData({ ...formData, strataPlanNumber: e.target.value })}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className={errors.strata ? "border-red-500" : ""}
                  data-testid="input-resident-strata"
                />
                <Button 
                  onClick={handleNext}
                  style={{ backgroundColor: RESIDENT_COLOR }}
                  className="shrink-0"
                  data-testid="button-next-strata"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              {errors.strata && <p className="text-sm text-red-500">{errors.strata}</p>}
            </div>
          )}

          {currentStep === "unit" && (
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-medium text-foreground">Unit Number</Label>
              <div className="flex gap-2">
                <Input
                  id="unit"
                  placeholder={t('resident.placeholders.unitNumber', '101')}
                  value={formData.unitNumber}
                  onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className={errors.unit ? "border-red-500" : ""}
                  data-testid="input-resident-unit"
                />
                <Button 
                  onClick={handleNext}
                  style={{ backgroundColor: RESIDENT_COLOR }}
                  className="shrink-0"
                  data-testid="button-next-unit"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              {errors.unit && <p className="text-sm text-red-500">{errors.unit}</p>}
            </div>
          )}

          {currentStep === "parking" && (
            <div className="space-y-2">
              <Label htmlFor="parking" className="text-sm font-medium text-foreground">Parking Stall Number (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="parking"
                  placeholder={t('resident.placeholders.parkingStall', 'P1-25')}
                  value={formData.parkingStallNumber}
                  onChange={(e) => setFormData({ ...formData, parkingStallNumber: e.target.value })}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  data-testid="input-resident-parking"
                />
                <Button 
                  onClick={handleNext}
                  style={{ backgroundColor: RESIDENT_COLOR }}
                  className="shrink-0"
                  data-testid="button-next-parking"
                >
                  {formData.parkingStallNumber ? <ArrowRight className="w-4 h-4" /> : "Skip"}
                </Button>
              </div>
            </div>
          )}

          {currentStep === "password" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('common.placeholders.createPassword', 'Create a password')}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className={errors.password ? "border-red-500" : ""}
                  data-testid="input-resident-password"
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t('common.placeholders.confirmPassword', 'Confirm your password')}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  data-testid="input-resident-confirm-password"
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
              <Button 
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="w-full"
                style={{ backgroundColor: RESIDENT_COLOR }}
                data-testid="button-create-resident-account"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Create Resident Account
              </Button>
            </div>
          )}

          {/* Back button and progress indicator */}
          <div className="flex items-center justify-between pt-2">
            {currentStepIndex > 0 ? (
              <button
                onClick={handleBack}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                data-testid="button-back-step"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-1">
              {STEPS.map((step, index) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStepIndex 
                      ? "bg-[#86A59C]" 
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      {renderStepContent()}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <button 
          onClick={onShowSignIn}
          className="font-medium hover:underline"
          style={{ color: RESIDENT_COLOR }}
          data-testid="button-switch-to-signin"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
