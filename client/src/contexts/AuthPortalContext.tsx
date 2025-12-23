import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { trackLogin } from "@/lib/analytics";
import { User, KeyRound, Loader2 } from "lucide-react";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email, license number, or strata number is required"),
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
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");

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

  const closePortal = useCallback(() => {
    setIsOpen(false);
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

  const handleRegisterClick = () => {
    closePortal();
    setLocation("/register");
  };

  return (
    <AuthPortalContext.Provider value={{ isOpen, openLogin, closePortal }}>
      {children}
      
      <Dialog open={isOpen} onOpenChange={(open) => !open && closePortal()}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
          <div className="flex flex-col items-center pt-6 pb-4 px-6">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-10 object-contain mb-4" />
            <h2 className="text-xl font-bold">{t('login.signIn', 'Sign In')}</h2>
          </div>
          
          <div className="px-6 pb-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "register")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" data-testid="tab-modal-signin">
                  {t('login.signIn', 'Sign In')}
                </TabsTrigger>
                <TabsTrigger value="register" data-testid="tab-modal-register">
                  {t('login.register', 'Register')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-0">
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
                            <Input 
                              {...field} 
                              type="password"
                              placeholder={t('login.passwordPlaceholder', 'Enter your password')}
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
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <div className="text-center py-6 space-y-4">
                  <p className="text-muted-foreground">
                    {t('login.registerDescription', 'Create a new account to access OnRopePro.')}
                  </p>
                  <Button 
                    onClick={handleRegisterClick}
                    className="w-full"
                    size="lg"
                    data-testid="button-modal-go-to-register"
                  >
                    {t('login.createAccount', 'Create an account')}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </AuthPortalContext.Provider>
  );
}
