import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { trackLogin } from "@/lib/analytics";
import { Mail, KeyRound, ArrowRight, Loader2, HardHat, Building2 } from "lucide-react";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or identifier is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface AuthPortalContextType {
  isOpen: boolean;
  openLogin: () => void;
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
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "license">("email");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const openLogin = useCallback(() => {
    form.reset();
    setLoginMethod("email");
    setIsOpen(true);
  }, [form]);

  const closePortal = useCallback(() => {
    setIsOpen(false);
    form.reset();
  }, [form]);

  const handleLoginMethodChange = (method: string) => {
    setLoginMethod(method as "email" | "license");
    form.setValue("identifier", "");
    form.clearErrors("identifier");
  };

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
      
      trackLogin(loginMethod);
      
      toast({
        title: "Welcome back!",
        description: `Signed in as ${user.name || user.email}`,
      });

      redirectBasedOnRole(user.role);
      setIsSubmitting(false);
    } catch (error) {
      form.setError("identifier", { message: "An error occurred. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPortalContext.Provider value={{ isOpen, openLogin, closePortal }}>
      {children}
      
      <Dialog open={isOpen} onOpenChange={(open) => !open && closePortal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-2xl font-bold text-center">
              {t('login.title', 'Sign in to your account')}
            </DialogTitle>
            <DialogDescription className="text-base text-center">
              {t('login.subtitle', 'Enter your credentials to access your dashboard')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="pt-4">
            <Tabs value={loginMethod} onValueChange={handleLoginMethodChange} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email" className="gap-2" data-testid="tab-modal-login-email">
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('login.emailTab', 'Email')}</span>
                  <span className="sm:hidden">Email</span>
                </TabsTrigger>
                <TabsTrigger value="license" className="gap-2" data-testid="tab-modal-login-license">
                  <HardHat className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('login.licenseTab', 'License #')}</span>
                  <span className="sm:hidden">License</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {loginMethod === "email" 
                          ? t('login.emailLabel', 'Email Address')
                          : t('login.licenseLabel', 'IRATA / SPRAT License Number')
                        }
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          {loginMethod === "email" ? (
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          ) : (
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          )}
                          <Input 
                            {...field} 
                            type={loginMethod === "email" ? "email" : "text"}
                            placeholder={loginMethod === "email" 
                              ? "you@company.com" 
                              : "e.g., IRATA-12345"
                            }
                            autoComplete={loginMethod === "email" ? "email" : "username"}
                            className="pl-10"
                            data-testid="input-modal-login-identifier"
                          />
                        </div>
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
                        <FormLabel>{t('login.passwordLabel', 'Password')}</FormLabel>
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
                        <Input 
                          {...field} 
                          type="password"
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          data-testid="input-modal-login-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full gap-2" 
                  size="lg"
                  disabled={isSubmitting}
                  data-testid="button-modal-login-submit"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('login.signingIn', 'Signing in...')}
                    </>
                  ) : (
                    <>
                      {t('login.signIn', 'Sign In')}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('login.orContinueWith', 'Or continue with')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  closePortal();
                  setLocation("/technician");
                }}
                data-testid="button-modal-technician-portal"
              >
                <HardHat className="w-4 h-4" />
                <span className="text-sm">{t('login.technicianPortal', 'Technician Portal')}</span>
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  closePortal();
                  setLocation("/building-portal");
                }}
                data-testid="button-modal-building-portal"
              >
                <Building2 className="w-4 h-4" />
                <span className="text-sm">{t('login.buildingPortal', 'Building Portal')}</span>
              </Button>
            </div>
          </div>

          <div className="text-center space-y-2 pt-2">
            <p className="text-sm text-muted-foreground">
              {t('login.newToOnRopePro', 'New to OnRopePro?')}{' '}
              <button
                type="button"
                onClick={() => {
                  closePortal();
                  setLocation("/register");
                }}
                className="text-primary font-medium hover:underline"
                data-testid="link-modal-create-account"
              >
                {t('login.createAccount', 'Create an account')}
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </AuthPortalContext.Provider>
  );
}
