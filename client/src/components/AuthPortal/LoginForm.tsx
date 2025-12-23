import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { trackLogin } from "@/lib/analytics";
import { Loader2, User, KeyRound } from "lucide-react";
import { Link } from "wouter";

const loginSchema = z.object({
  identifier: z.string().min(1, "This field is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: (user: any) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: data.identifier.trim(),
          password: data.password,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = getErrorMessage(result.message);
        form.setError("identifier", { message: errorMessage });
        setIsSubmitting(false);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      const userResponse = await fetch("/api/user", {
        credentials: "include",
      });

      if (!userResponse.ok) {
        form.setError("identifier", {
          message: "Failed to verify account. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      const userData = await userResponse.json();
      const user = userData.user;

      trackLogin("unified");

      toast({
        title: t("auth.welcomeBack", "Welcome back!"),
        description: t("auth.signedInAs", "Signed in as {{name}}", { name: user.name || user.email }),
      });

      onSuccess(user);
    } catch (error) {
      form.setError("identifier", { message: "An error occurred. Please try again." });
      setIsSubmitting(false);
    }
  };

  const getErrorMessage = (message: string): string => {
    if (message.toLowerCase().includes("not found") || message.toLowerCase().includes("invalid")) {
      return "Account not found. Please check your credentials.";
    }
    if (message.toLowerCase().includes("password")) {
      return "Incorrect password. Please try again.";
    }
    return message || "Login failed. Please try again.";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("auth.yourCredentials", "Your Credentials")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder={t("auth.enterCredentials", "Email, license number, or strata number")}
                  autoComplete="username"
                  data-testid="input-identifier"
                />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1.5 space-y-0.5">
                <span className="block">{t("auth.loginHintTechnician", "Technicians: use your email or IRATA/SPRAT license number")}</span>
                <span className="block">{t("auth.loginHintBuildingManager", "Building Managers: use your strata plan number")}</span>
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                {t("auth.password", "Password")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder={t("auth.enterPassword", "Enter your password")}
                  autoComplete="current-password"
                  data-testid="input-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Link href="/reset-password" className="text-sm text-muted-foreground hover:text-foreground">
            {t("auth.forgotPassword", "Forgot password?")}
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-login-submit">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("auth.signingIn", "Signing in...")}
            </>
          ) : (
            t("auth.signIn", "Sign In")
          )}
        </Button>
      </form>
    </Form>
  );
}
