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
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        form.setError("identifier", { message: result.message || "Login failed" });
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
        return;
      }
      
      const userDataResult = await userResponse.json();
      const user = userDataResult.user;
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.name || user.companyName}`,
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
      form.setError("identifier", { message: "An error occurred. Please try again." });
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
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="you@example.com"
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Your password"
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
                          Sign In
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
                        Forgot Password?
                      </button>
                    </div>
                    
                    <div className="text-center text-sm text-muted-foreground">
                      Do not have an account?{" "}
                      <button
                        type="button"
                        className="font-medium hover:underline"
                        style={{ color: buttonColor }}
                        data-testid="link-signin-create-account"
                      >
                        Create Account
                      </button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Reset Your Password</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter your email and we'll send you a link to reset your password.
                    </p>
                  </div>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="your@email.com"
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
                        "Send Reset Link"
                      )}
                    </Button>
                    {resetSuccess && (
                      <p className="text-sm text-green-600 text-center">
                        Check your email for the reset link.
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
                    Back to Sign In
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
