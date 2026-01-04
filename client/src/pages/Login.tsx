import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { queryClient } from "@/lib/queryClient";
import { trackLogin } from "@/lib/analytics";
import { Mail, KeyRound, ArrowRight, Loader2, HardHat, Building2 } from "lucide-react";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or identifier is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { openRegister } = useAuthPortal();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "license" | "strata">("email");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleLoginMethodChange = (method: string) => {
    setLoginMethod(method as "email" | "license" | "strata");
    form.setValue("identifier", "");
    form.clearErrors("identifier");
  };

  const { data: userData, isLoading: isCheckingAuth, error: authError } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
    retry: false,
  });

  useEffect(() => {
    if (isCheckingAuth || authError) {
      return;
    }
    
    if (userData?.user) {
      redirectBasedOnRole(userData.user.role);
    }
  }, [userData, isCheckingAuth, authError]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "strata" || tab === "license" || tab === "email") {
      setLoginMethod(tab);
      form.setValue("identifier", "");
      form.clearErrors();
    }
  }, []);

  const redirectBasedOnRole = (role: string) => {
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
      // Building login uses a different endpoint
      if (loginMethod === "strata") {
        const response = await fetch("/api/building/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            strataPlanNumber: data.identifier, 
            password: data.password 
          }),
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          form.setError("identifier", { message: result.message || "Invalid strata number or password" });
          setIsSubmitting(false);
          return;
        }

        trackLogin("strata");
        
        toast({
          title: t('login.welcomeBack', 'Welcome back!'),
          description: t('buildingPortal.welcomePortal', 'Welcome to your building portal.'),
        });

        setLocation("/building-portal");
        setIsSubmitting(false);
        return;
      }

      // Standard login for email/license
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

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src={onRopeProLogo} 
              alt="OnRopePro" 
              className="h-8 w-auto brightness-0 dark:invert opacity-80"
            />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {t('login.noAccount', "Don't have an account?")}
            </span>
            <Button variant="outline" size="sm" onClick={openRegister}>
              {t('login.signUp', 'Sign Up')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">
                {t('login.title', 'Sign in to your account')}
              </CardTitle>
              <CardDescription className="text-base">
                {t('login.subtitle', 'Enter your credentials to access your dashboard')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4">
              {/* Login Method Tabs */}
              <Tabs value={loginMethod} onValueChange={handleLoginMethodChange} className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="email" className="gap-1" data-testid="tab-login-email">
                    <Mail className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('login.emailTab', 'Email')}</span>
                    <span className="sm:hidden">Email</span>
                  </TabsTrigger>
                  <TabsTrigger value="license" className="gap-1" data-testid="tab-login-license">
                    <HardHat className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('login.licenseTab', 'License #')}</span>
                    <span className="sm:hidden">License</span>
                  </TabsTrigger>
                  <TabsTrigger value="strata" className="gap-1" data-testid="tab-login-strata">
                    <Building2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('login.strataTab', 'Strata #')}</span>
                    <span className="sm:hidden">Strata</span>
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
                            : loginMethod === "license"
                            ? t('login.licenseLabel', 'IRATA / SPRAT License Number')
                            : t('login.strataLabel', 'Strata Plan Number')
                          }
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            {loginMethod === "email" ? (
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            ) : loginMethod === "license" ? (
                              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            )}
                            <Input 
                              {...field} 
                              type={loginMethod === "email" ? "email" : "text"}
                              placeholder={loginMethod === "email" 
                                ? "you@company.com" 
                                : loginMethod === "license"
                                ? "e.g., IRATA-12345"
                                : "e.g., LMS1234 or BCS5678"
                              }
                              autoComplete={loginMethod === "email" ? "email" : "username"}
                              className="pl-10"
                              data-testid="input-login-identifier"
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
                        <div className="flex items-center justify-between">
                          <FormLabel>{t('login.passwordLabel', 'Password')}</FormLabel>
                          <Link 
                            href="/reset-password" 
                            className="text-sm text-primary hover:underline"
                            data-testid="link-forgot-password"
                          >
                            {t('login.forgotPassword', 'Forgot password?')}
                          </Link>
                        </div>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password"
                            placeholder={t('login.passwordPlaceholder', 'Enter your password')}
                            autoComplete="current-password"
                            data-testid="input-login-password"
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
                    data-testid="button-login-submit"
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

                  {/* Quick Login Buttons for Testing */}
                  <div className="pt-4 border-t mt-4">
                    <p className="text-xs text-muted-foreground text-center mb-2">Quick Login (Testing)</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          form.setValue("identifier", "tester@tester.com");
                          form.setValue("password", "tester123");
                        }}
                        data-testid="button-quick-login-tester"
                      >
                        Tester
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          form.setValue("identifier", "166459");
                          form.setValue("password", "Mhlqt419!");
                        }}
                        data-testid="button-quick-login-tech"
                      >
                        Tech
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          form.setValue("identifier", "info@rabm.com");
                          form.setValue("password", "Rabm123");
                        }}
                        data-testid="button-quick-login-rabmltd"
                      >
                        RABMLTD
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {t('login.orContinueWith', 'Or continue with')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setLocation("/technician")}
                  data-testid="button-technician-portal"
                >
                  <HardHat className="w-4 h-4" />
                  <span className="text-sm">{t('login.technicianPortal', 'Technician Portal')}</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setLocation("/building-manager")}
                  data-testid="button-building-portal"
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">{t('login.buildingPortal', 'Building Portal')}</span>
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Additional Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('login.newToOnRopePro', 'New to OnRopePro?')}{' '}
              <button 
                type="button"
                onClick={openRegister} 
                className="text-primary font-medium hover:underline" 
                data-testid="link-create-account"
              >
                {t('login.createAccount', 'Create an account')}
              </button>
            </p>
            <p className="text-sm text-muted-foreground">
              <Link href="/" className="text-primary font-medium hover:underline" data-testid="link-learn-more">
                {t('login.learnMore', 'Learn more about OnRopePro')}
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          {t('login.copyright', '© 2024 OnRopePro. All rights reserved.')}
        </p>
      </footer>
    </div>
  );
}
