import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { trackLogin } from "@/lib/analytics";
import { UserType } from "@/hooks/use-auth-portal";
import { Loader2, Mail, CreditCard, Building2, KeyRound } from "lucide-react";
import { Link } from "wouter";

const loginSchema = z.object({
  identifier: z.string().min(1, "This field is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  userType: UserType;
  onSuccess: (user: any) => void;
}

type LoginMethod = "email" | "license" | "strata";

const userTypeLoginMethods: Record<UserType, LoginMethod[]> = {
  technician: ["license", "email"],
  property_manager: ["email"],
  building_manager: ["strata", "email"],
  resident: ["email"],
  company: ["email"],
};

const loginMethodConfig: Record<LoginMethod, { label: string; icon: typeof Mail; placeholder: string }> = {
  email: {
    label: "Email",
    icon: Mail,
    placeholder: "Enter your email address",
  },
  license: {
    label: "License #",
    icon: CreditCard,
    placeholder: "Enter IRATA/SPRAT license number",
  },
  strata: {
    label: "Strata #",
    icon: Building2,
    placeholder: "Enter strata plan number",
  },
};

export function LoginForm({ userType, onSuccess }: LoginFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableMethods = userTypeLoginMethods[userType];
  const [loginMethod, setLoginMethod] = useState<LoginMethod>(availableMethods[0]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    const newMethods = userTypeLoginMethods[userType];
    if (!newMethods.includes(loginMethod)) {
      setLoginMethod(newMethods[0]);
    }
    form.reset({ identifier: "", password: "" });
  }, [userType]);

  const handleMethodChange = (method: string) => {
    setLoginMethod(method as LoginMethod);
    form.setValue("identifier", "");
    form.clearErrors("identifier");
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
        const errorMessage = getErrorMessage(result.message, loginMethod);
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

      trackLogin(loginMethod);

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

  const getErrorMessage = (message: string, method: LoginMethod): string => {
    if (message.toLowerCase().includes("not found") || message.toLowerCase().includes("invalid")) {
      switch (method) {
        case "license":
          return "License number not found. Please check and try again.";
        case "strata":
          return "Strata plan not found. Please check and try again.";
        default:
          return "Account not found. Please check your email.";
      }
    }
    if (message.toLowerCase().includes("password")) {
      return "Incorrect password. Please try again.";
    }
    return message || "Login failed. Please try again.";
  };

  const currentMethodConfig = loginMethodConfig[loginMethod];
  const MethodIcon = currentMethodConfig.icon;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {availableMethods.length > 1 && (
          <Tabs value={loginMethod} onValueChange={handleMethodChange} className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableMethods.length}, 1fr)` }}>
              {availableMethods.map((method) => {
                const config = loginMethodConfig[method];
                const Icon = config.icon;
                return (
                  <TabsTrigger key={method} value={method} className="flex items-center gap-1.5" data-testid={`tab-method-${method}`}>
                    <Icon className="h-3.5 w-3.5" />
                    <span className="text-xs">{config.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        )}

        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MethodIcon className="h-4 w-4" />
                {currentMethodConfig.label}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type={loginMethod === "email" ? "email" : "text"}
                  placeholder={currentMethodConfig.placeholder}
                  autoComplete={loginMethod === "email" ? "email" : "off"}
                  data-testid="input-identifier"
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
