import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { HardHat, ArrowLeft, Mail, CreditCard } from "lucide-react";
import { TechnicianRegistration } from "@/components/TechnicianRegistration";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

const loginSchema = z.object({
  identifier: z.string().min(1, "License number or email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function TechnicianLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [loginMethod, setLoginMethod] = useState<"license" | "email">("license");
  const [showRegistration, setShowRegistration] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
    retry: false,
    staleTime: 30000,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (userData?.user) {
      if (userData.user.role === "rope_access_tech") {
        // If technician is linked to a company and not terminated, go to main dashboard
        if (userData.user.companyId && !userData.user.terminatedDate) {
          setLocation("/dashboard");
        } else {
          // Otherwise go to technician portal for onboarding/invitations
          setLocation("/technician-portal");
        }
      } else if (userData.user.role === "resident") {
        setLocation("/resident");
      } else if (userData.user.role === "property_manager") {
        setLocation("/property-manager");
      } else if (userData.user.role === "superuser") {
        setLocation("/superuser");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [userData, setLocation]);

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
      
      const userData = await userResponse.json();
      const user = userData.user;
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.name}`,
      });
      
      if (user.role === "rope_access_tech") {
        // If technician is linked to a company and not terminated, go to main dashboard
        if (user.companyId && !user.terminatedDate) {
          setLocation("/dashboard");
        } else {
          // Otherwise go to technician portal for onboarding/invitations
          setLocation("/technician-portal");
        }
      } else {
        setLocation("/dashboard");
      }
    } catch (error) {
      form.setError("identifier", { message: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/30">
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="gap-2"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src={onRopeProLogo} 
                alt="OnRopePro" 
                className="h-12 object-contain"
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <HardHat className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Technician Login</CardTitle>
            </div>
            <CardDescription>
              Sign in with your IRATA/SPRAT license number or email
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={loginMethod === "license" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => {
                  setLoginMethod("license");
                  form.setValue("identifier", "");
                }}
                data-testid="button-login-license"
              >
                <CreditCard className="w-4 h-4" />
                License Number
              </Button>
              <Button
                type="button"
                variant={loginMethod === "email" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => {
                  setLoginMethod("email");
                  form.setValue("identifier", "");
                }}
                data-testid="button-login-email"
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {loginMethod === "license" ? "IRATA or SPRAT License Number" : "Email Address"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type={loginMethod === "email" ? "email" : "text"}
                          placeholder={loginMethod === "license" ? "e.g., 123456 (without /1, /2, /3)" : "you@example.com"}
                          data-testid="input-identifier"
                        />
                      </FormControl>
                      {loginMethod === "license" && (
                        <p className="text-xs text-muted-foreground">
                          Enter just the number without the level prefix (e.g., 123456 not 1/123456)
                        </p>
                      )}
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
                          placeholder="Enter your password"
                          data-testid="input-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                  data-testid="button-login-submit"
                >
                  {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  New technician?
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setShowRegistration(true)}
              data-testid="button-register"
            >
              <HardHat className="w-4 h-4" />
              Register as a Technician
            </Button>
          </CardContent>
        </Card>
      </div>

      <TechnicianRegistration 
        open={showRegistration} 
        onOpenChange={setShowRegistration}
      />
    </div>
  );
}
