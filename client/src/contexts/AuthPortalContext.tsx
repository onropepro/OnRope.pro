import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { trackLogin } from "@/lib/analytics";
import { User, KeyRound, Loader2, HardHat, Building2, Briefcase, Home, Eye, EyeOff, ChevronRight, Clock } from "lucide-react";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import { TechnicianRegistration } from "@/components/TechnicianRegistration";
import { PropertyManagerRegistration } from "@/components/PropertyManagerRegistration";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import { ResidentSlidingSignup } from "@/components/ResidentSlidingSignup";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email, license number, or strata number is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface AuthPortalContextType {
  isOpen: boolean;
  openLogin: () => void;
  openRegister: () => void;
  closePortal: () => void;
}

const AuthPortalContext = createContext<AuthPortalContextType | null>(null);

export function useAuthPortalContext() {
  const context = useContext(AuthPortalContext);
  if (!context) {
    throw new Error("useAuthPortalContext must be used within AuthPortalProvider");
  }
  return context;
}

interface AuthPortalProviderProps {
  children: ReactNode;
}

export function AuthPortalProvider({ children }: AuthPortalProviderProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [locationPath, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const [showPassword, setShowPassword] = useState(false);
  
  const [showTechnicianRegistration, setShowTechnicianRegistration] = useState(false);
  const [showPropertyManagerRegistration, setShowPropertyManagerRegistration] = useState(false);
  const [showEmployerRegistration, setShowEmployerRegistration] = useState(false);
  const [showResidentSignup, setShowResidentSignup] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const openLogin = useCallback(() => {
    form.reset();
    setActiveTab("signin");
    setIsOpen(true);
  }, [form]);

  const openRegister = useCallback(() => {
    form.reset();
    setActiveTab("register");
    setIsOpen(true);
  }, [form]);
  
  // Auto-open register modal when URL has signup=true query param
  // Watch locationPath to detect SPA navigations
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === 'true') {
      openRegister();
      // Clean up the URL by removing only the signup param, preserving others
      const url = new URL(window.location.href);
      url.searchParams.delete('signup');
      // Preserve remaining query params if any
      const newUrl = url.searchParams.toString() 
        ? `${url.pathname}?${url.searchParams.toString()}`
        : url.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [openRegister, locationPath]);

  const closePortal = useCallback(() => {
    setIsOpen(false);
    setShowPassword(false);
    form.reset();
  }, [form]);

  const redirectBasedOnRole = (role: string) => {
    closePortal();
    switch (role) {
      case "resident":
        setLocation("/resident-dashboard");
        break;
      case "property_manager":
        setLocation("/property-manager");
        break;
      case "superuser":
        setLocation("/superuser");
        break;
      case "building_manager":
        setLocation("/building-portal");
        break;
      case "rope_access_tech":
        setLocation("/technician-portal");
        break;
      case "ground_crew":
      case "ground_crew_supervisor":
        setLocation("/ground-crew-portal");
        break;
      default:
        setLocation("/dashboard");
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        form.setError("identifier", { message: result.message || "Login failed" });
        setIsSubmitting(false);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      const userResponse = await fetch("/api/user", {
        credentials: "include",
      });
      
      if (!userResponse.ok) {
        form.setError("identifier", { 
          message: "Failed to verify account status. Please try again." 
        });
        setIsSubmitting(false);
        return;
      }
      
      const userData = await userResponse.json();
      const user = userData.user;
      
      trackLogin("unified");
      
      toast({
        title: t('login.welcomeBack', 'Welcome back!'),
        description: t('login.signedInAs', 'Signed in as {{name}}', { name: user.name || user.email }),
      });

      redirectBasedOnRole(user.role);
      setIsSubmitting(false);
    } catch (error) {
      form.setError("identifier", { message: "An error occurred. Please try again." });
      setIsSubmitting(false);
    }
  };

  const handleTechnicianRegister = () => {
    closePortal();
    setShowTechnicianRegistration(true);
  };

  const handlePropertyManagerRegister = () => {
    closePortal();
    setShowPropertyManagerRegistration(true);
  };

  const handleEmployerRegister = () => {
    closePortal();
    setShowEmployerRegistration(true);
  };

  const handleResidentRegister = () => {
    closePortal();
    setShowResidentSignup(true);
  };

  return (
    <AuthPortalContext.Provider value={{ isOpen, openLogin, openRegister, closePortal }}>
      {children}
      
      <Dialog open={isOpen} onOpenChange={(open) => !open && closePortal()}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
          <VisuallyHidden>
            <DialogTitle>{t('login.signIn', 'Sign In')}</DialogTitle>
            <DialogDescription>{t('login.modalDescription', 'Sign in to your account or register as a new user')}</DialogDescription>
          </VisuallyHidden>
          <div className="flex flex-col items-center pt-8 pb-4 px-6">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-12 object-contain" />
          </div>
          
          <div className="px-6 pb-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-muted p-1 rounded-full">
                <button
                  type="button"
                  onClick={() => setActiveTab("signin")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === "signin"
                      ? "bg-white dark:bg-slate-800 shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid="tab-modal-signin"
                >
                  {t('login.signIn', 'Sign In')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === "register"
                      ? "bg-white dark:bg-slate-800 shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid="tab-modal-register"
                >
                  {t('login.register', 'Register')}
                </button>
              </div>
            </div>

            {activeTab === "signin" && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {t('login.unifiedLabel', 'Email, License #, or Strata #')}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="text"
                            placeholder={t('login.unifiedPlaceholder', 'Enter email, license number, or strata number')}
                            autoComplete="username"
                            data-testid="input-modal-login-identifier"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-2">
                          <FormLabel className="flex items-center gap-2">
                            <KeyRound className="w-4 h-4" />
                            {t('login.passwordLabel', 'Password')}
                          </FormLabel>
                          <button
                            type="button"
                            onClick={() => {
                              closePortal();
                              setLocation("/reset-password");
                            }}
                            className="text-sm text-primary hover:underline"
                            data-testid="link-modal-forgot-password"
                          >
                            {t('login.forgotPassword', 'Forgot password?')}
                          </button>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              type={showPassword ? "text" : "password"}
                              placeholder={t('login.passwordPlaceholder', 'Enter your password')}
                              autoComplete="current-password"
                              className="pr-10"
                              data-testid="input-modal-login-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              data-testid="button-toggle-password"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                    data-testid="button-modal-login-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        {t('login.signingIn', 'Signing in...')}
                      </>
                    ) : (
                      t('login.signIn', 'Sign In')
                    )}
                  </Button>
                </form>
              </Form>
            )}

            {activeTab === "register" && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 mb-3">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      {t('login.quickSetup', 'Takes 60 seconds to set up')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('login.selectAccountType', 'Select your account type to get started')}
                  </p>
                </div>
                
                <button 
                  type="button"
                  onClick={handleTechnicianRegister}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-transparent bg-muted/50 hover:bg-muted hover:border-[#5C7A84]/30 transition-all group"
                  data-testid="button-register-technician"
                >
                  <div className="w-11 h-11 rounded-full bg-[#5C7A84]/10 flex items-center justify-center flex-shrink-0">
                    <HardHat className="w-5 h-5 text-[#5C7A84]" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-foreground">{t('login.technicianAccount', 'Technician')}</div>
                    <div className="text-sm text-muted-foreground">{t('login.technicianDesc', 'Rope access professional')}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#5C7A84] transition-colors" />
                </button>

                <button 
                  type="button"
                  onClick={handleEmployerRegister}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-transparent bg-muted/50 hover:bg-muted hover:border-[#0B64A3]/30 transition-all group"
                  data-testid="button-register-employer"
                >
                  <div className="w-11 h-11 rounded-full bg-[#0B64A3]/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-[#0B64A3]" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-foreground">{t('login.employerAccount', 'Employer')}</div>
                    <div className="text-sm text-muted-foreground">{t('login.employerDesc', 'Rope access company')}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#0B64A3] transition-colors" />
                </button>

                <button 
                  type="button"
                  onClick={handlePropertyManagerRegister}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-transparent bg-muted/50 hover:bg-muted hover:border-[#6E9075]/30 transition-all group"
                  data-testid="button-register-property-manager"
                >
                  <div className="w-11 h-11 rounded-full bg-[#6E9075]/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-[#6E9075]" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-foreground">{t('login.propertyManagerAccount', 'Property Manager')}</div>
                    <div className="text-sm text-muted-foreground">{t('login.propertyManagerDesc', 'Building management')}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#6E9075] transition-colors" />
                </button>

                <button 
                  type="button"
                  onClick={handleResidentRegister}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-transparent bg-muted/50 hover:bg-muted hover:border-[#86A59C]/30 transition-all group"
                  data-testid="button-register-resident"
                >
                  <div className="w-11 h-11 rounded-full bg-[#86A59C]/10 flex items-center justify-center flex-shrink-0">
                    <Home className="w-5 h-5 text-[#86A59C]" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-foreground">{t('login.residentAccount', 'Resident')}</div>
                    <div className="text-sm text-muted-foreground">{t('login.residentDesc', 'Building resident')}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#86A59C] transition-colors" />
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <TechnicianRegistration 
        open={showTechnicianRegistration} 
        onOpenChange={(open) => setShowTechnicianRegistration(open)} 
      />
      
      <PropertyManagerRegistration 
        open={showPropertyManagerRegistration} 
        onOpenChange={(open) => setShowPropertyManagerRegistration(open)} 
      />
      
      <EmployerRegistration 
        open={showEmployerRegistration} 
        onOpenChange={(open) => setShowEmployerRegistration(open)} 
      />
      
      {showResidentSignup && (
        <ResidentSlidingSignup 
          onClose={() => setShowResidentSignup(false)}
          onShowSignIn={() => {
            setShowResidentSignup(false);
            openLogin();
          }}
        />
      )}
    </AuthPortalContext.Provider>
  );
}
