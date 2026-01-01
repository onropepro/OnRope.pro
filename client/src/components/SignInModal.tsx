import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonColor?: string;
}

export function SignInModal({ 
  isOpen, 
  onClose,
  buttonColor = "#0B64A3"
}: SignInModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      let response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      let result = await response.json();

      if (!response.ok) {
        console.log("[SignInModal] Primary login failed, trying building login...");
        console.log("[SignInModal] Sending to /api/building/login:", { strataPlanNumber: data.identifier.toUpperCase().replace(/\s+/g, ''), password: "***" });
        
        try {
          const buildingResponse = await fetch("/api/building/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ strataPlanNumber: data.identifier.toUpperCase().replace(/\s+/g, ''), password: data.password }),
            credentials: "include",
          });
          
          console.log("[SignInModal] Building login response status:", buildingResponse.status);
          const buildingResult = await buildingResponse.json();
          console.log("[SignInModal] Building login result:", buildingResult);
          
          if (!buildingResponse.ok) {
            form.setError("identifier", { message: buildingResult.message || result.message || t("signIn.loginFailed", "Login failed") });
            return;
          }
          
          response = buildingResponse;
          result = buildingResult;
        } catch (buildingError) {
          console.error("[SignInModal] Building login fetch error:", buildingError);
          form.setError("identifier", { message: result.message || t("signIn.loginFailed", "Login failed") });
          return;
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      const userResponse = await fetch("/api/user", {
        credentials: "include",
      });
      
      if (!userResponse.ok) {
        form.setError("identifier", { 
          message: t("signIn.verifyFailed", "Failed to verify account status. Please try again.")
        });
        return;
      }
      
      const userDataResult = await userResponse.json();
      const user = userDataResult.user;
      
      toast({
        title: t("signIn.welcomeBack", "Welcome back!"),
        description: `${t("signIn.loggedInAs", "Logged in as")} ${user.name || user.companyName}`,
      });
      
      // Role-based redirect
      switch (user.role) {
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
    } catch (error) {
      form.setError("identifier", { message: t("signIn.errorOccurred", "An error occurred. Please try again.") });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) return;
    
    setIsResettingPassword(true);
    try {
      const response = await fetch("/api/password-reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });
      
      if (response.ok) {
        setResetSuccess(true);
      } else {
        setResetSuccess(true);
      }
    } catch (error) {
      setResetSuccess(true);
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto pt-6"
        >
          <Card className="shadow-xl">
            <CardContent className="p-6">
              {!showForgotPassword ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("signIn.emailAddress", "Email Address")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder={t("signIn.emailPlaceholder", "you@example.com")}
                                data-testid="input-signin-email"
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
                            <FormLabel>{t("signIn.password", "Password")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder={t("signIn.passwordPlaceholder", "Your password")}
                                data-testid="input-signin-password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      style={{ backgroundColor: buttonColor }}
                      disabled={form.formState.isSubmitting}
                      data-testid="button-signin-submit"
                    >
                      {form.formState.isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {t("signIn.signInButton", "Sign In")}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setForgotPasswordEmail(form.getValues("identifier"));
                          setResetSuccess(false);
                        }}
                        className="text-sm text-muted-foreground hover:underline"
                        data-testid="link-signin-forgot-password"
                      >
                        {t("signIn.forgotPassword", "Forgot Password?")}
                      </button>
                    </div>
                    
                    <div className="text-center text-sm text-muted-foreground">
                      {t("signIn.noAccount", "Do not have an account?")}{" "}
                      <button
                        type="button"
                        className="font-medium hover:underline"
                        style={{ color: buttonColor }}
                        data-testid="link-signin-create-account"
                      >
                        {t("signIn.createAccount", "Create Account")}
                      </button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{t("signIn.resetPassword", "Reset Your Password")}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t("signIn.resetDescription", "Enter your email and we'll send you a link to reset your password.")}
                    </p>
                  </div>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <Input
                      type="email"
                      placeholder={t("signIn.emailPlaceholder", "your@email.com")}
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      data-testid="input-forgot-password-email"
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      style={{ backgroundColor: buttonColor }}
                      disabled={isResettingPassword}
                      data-testid="button-forgot-password-submit"
                    >
                      {isResettingPassword ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        t("signIn.sendResetLink", "Send Reset Link")
                      )}
                    </Button>
                    {resetSuccess && (
                      <p className="text-sm text-green-600 text-center">
                        {t("signIn.checkEmail", "Check your email for the reset link.")}
                      </p>
                    )}
                  </form>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSuccess(false);
                    }}
                    className="text-sm text-muted-foreground hover:underline w-full text-center"
                    data-testid="link-forgot-password-back"
                  >
                    {t("signIn.backToSignIn", "Back to Sign In")}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
