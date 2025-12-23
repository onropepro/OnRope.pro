import { useState } from "react";
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
import { Loader2, Mail, CreditCard, Building2, KeyRound } from "lucide-react";
import { Link } from "wouter";

const loginSchema = z.object({
  identifier: z.string().min(1, "This field is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: (user: any) => void;
}

type LoginMethod = "email" | "license" | "strata";

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

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleMethodChange = (method: string) => {
    setLoginMethod(method as LoginMethod);
    form.setValue("identifier", "");
    form.clearErrors("identifier");
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const payload: Record<string, string> = {
        password: data.password,
      };
      
      switch (loginMethod) {
        case "email":
          payload.identifier = data.identifier;
          break;
        case "license":
          payload.identifier = data.identifier;
          break;
        case "strata":
          payload.identifier = data.identifier;
          break;
      }

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        <Tabs value={loginMethod} onValueChange={handleMethodChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email" className="flex items-center gap-1.5" data-testid="tab-method-email">
              <Mail className="h-3.5 w-3.5" />
              <span className="text-xs">Email</span>
            </TabsTrigger>
            <TabsTrigger value="license" className="flex items-center gap-1.5" data-testid="tab-method-license">
              <CreditCard className="h-3.5 w-3.5" />
              <span className="text-xs">License #</span>
            </TabsTrigger>
            <TabsTrigger value="strata" className="flex items-center gap-1.5" data-testid="tab-method-strata">
              <Building2 className="h-3.5 w-3.5" />
              <span className="text-xs">Strata #</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

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
