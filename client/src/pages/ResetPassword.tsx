import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { useLanguage } from "@/hooks/use-language";

const RESIDENT_COLOR = "#86A59C";

export default function ResetPassword() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { openLogin } = useAuthPortal();
  
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    const emailParam = params.get("email");
    
    if (tokenParam) setToken(tokenParam);
    if (emailParam) setEmail(decodeURIComponent(emailParam));
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!token || !email) {
      setError(t("resetPassword.invalidLink", "Invalid reset link. Please request a new password reset."));
      return;
    }
    
    if (newPassword.length < 8) {
      setError(t("resetPassword.minLength", "Password must be at least 8 characters long"));
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError(t("resetPassword.uppercase", "Password must contain at least one uppercase letter"));
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setError(t("resetPassword.lowercase", "Password must contain at least one lowercase letter"));
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setError(t("resetPassword.number", "Password must contain at least one number"));
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError(t("resetPassword.mismatch", "Passwords do not match"));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/reset-password", {
        token,
        email,
        newPassword,
      });
      
      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: t("resetPassword.successTitle", "Password Reset Successful"),
          description: t("resetPassword.successDescription", "You can now sign in with your new password."),
        });
      } else {
        const data = await response.json();
        setError(data.message || t("resetPassword.failed", "Failed to reset password. Please try again."));
      }
    } catch (err) {
      setError(t("common.somethingWentWrong", "Something went wrong. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8">
            {isSuccess ? (
              <div className="text-center space-y-6">
                <div 
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${RESIDENT_COLOR}20` }}
                >
                  <CheckCircle2 className="w-10 h-10" style={{ color: RESIDENT_COLOR }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{t("resetPassword.completeTitle", "Password Reset Complete")}</h1>
                  <p className="text-muted-foreground mt-2">
                    {t("resetPassword.completeDescription", "Your password has been successfully reset. You can now sign in with your new password.")}
                  </p>
                </div>
                <Button
                  onClick={() => setLocation("/resident")}
                  className="w-full"
                  style={{ backgroundColor: RESIDENT_COLOR }}
                  data-testid="button-go-to-signin"
                >
                  {t("resetPassword.goToSignIn", "Go to Sign In")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-foreground">{t("resetPassword.createNewTitle", "Create New Password")}</h1>
                  <p className="text-muted-foreground mt-2">
                    {t("resetPassword.createNewDescription", "Enter your new password below.")}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-foreground">{t("resetPassword.newPassword", "New Password")}</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder={t("resetPassword.enterNewPassword", "Enter new password")}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      data-testid="input-new-password"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("resetPassword.requirements", "At least 8 characters with uppercase, lowercase, and a number")}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-foreground">{t("resetPassword.confirmPassword", "Confirm Password")}</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder={t("resetPassword.confirmNewPassword", "Confirm new password")}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      data-testid="input-confirm-password"
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="button-reset-password"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {t("resetPassword.resetButton", "Reset Password")}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  {t("resetPassword.rememberPassword", "Remember your password?")}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setLocation("/");
                      openLogin();
                    }}
                    className="font-medium text-primary hover:underline"
                    data-testid="link-back-to-signin"
                  >
                    {t("common.signIn", "Sign In")}
                  </button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
