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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import overhaulLabsLogo from "@assets/Screenshot 2025-11-09 at 14.46.08_1762728408763.png";
import ropeAccessProLogo from "@assets/generated_images/Blue_rope_access_worker_logo_ac1aa8fd.png";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Check if user is already logged in and redirect appropriately
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
    retry: false,
  });

  useEffect(() => {
    if (userData?.user) {
      console.log("👤 Already logged in, redirecting...", userData.user.role);
      if (userData.user.role === "resident") {
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

      // Invalidate user cache to ensure fresh data is fetched
      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Fetch fresh user data to get the latest subscription status
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
      
      console.log("🔐 Login successful! User data:", {
        id: user.id,
        username: user.username,
        role: user.role,
        companyId: user.companyId
      });
      
      // Use client-side navigation to preserve React state and cache
      if (user.role === "resident") {
        console.log("🏠 Redirecting to resident dashboard...");
        setLocation("/resident");
      } else if (user.role === "property_manager") {
        console.log("🏢 Redirecting to property manager dashboard...");
        setLocation("/property-manager");
      } else {
        console.log("📊 Redirecting to employee dashboard...");
        setLocation("/dashboard");
      }
      
      console.log("✅ Navigation triggered");
    } catch (error) {
      form.setError("identifier", { message: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex flex-col">
      {/* Header with Sign In Button */}
      <header className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-3">
          <img src={ropeAccessProLogo} alt="Rope Access Pro" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg">Rope Access Pro</span>
        </div>
        <Button 
          onClick={() => setShowLoginForm(!showLoginForm)}
          variant="default"
          data-testid="button-sign-in-header"
        >
          Sign In
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          {/* Hero Section - Hidden on mobile */}
        <div className="hidden md:flex flex-col justify-center space-y-8 pr-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
              <span className="material-icons text-lg">apartment</span>
              Professional High-Rise Maintenance
            </div>
            <div className="text-5xl font-bold">Rope Access{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Management Platform
              </span>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              The comprehensive solution for managing building maintenance operations. From project planning to completion tracking, streamline your entire workflow with precision and transparency.
            </p>
          </div>
          
          {/* Key Features */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Comprehensive Platform Features</h3>
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-primary">location_city</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">4-Elevation Building Visualization</div>
                  <div className="text-sm text-muted-foreground">Track progress across all building sides with real-time completion metrics and visual progress bars</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-primary">badge</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Employee Management & Payroll</div>
                  <div className="text-sm text-muted-foreground">Manage IRATA certifications, hourly rates, work sessions, and automated payroll across 5 pay period types</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-primary">inventory_2</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Gear Inventory System</div>
                  <div className="text-sm text-muted-foreground">Track personal safety equipment with serial numbers, employee assignments, and service dates</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-primary">request_quote</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Multi-Service Quoting</div>
                  <div className="text-sm text-muted-foreground">Create detailed quotes with photo attachments, cost breakdowns, and service-specific pricing</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-primary">schedule</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Real-Time Worker Tracking</div>
                  <div className="text-sm text-muted-foreground">Monitor active workers, billable/non-billable hours, and performance analytics with live dashboards</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-primary">verified_user</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Safety Compliance</div>
                  <div className="text-sm text-muted-foreground">Digital safety forms, PDF rope access plans, and comprehensive safety documentation management</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-primary">home</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Resident Portal</div>
                  <div className="text-sm text-muted-foreground">Transparent project tracking, complaint submission, and real-time progress updates for building residents</div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Supported Services</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="px-3 py-1">Window Cleaning</Badge>
              <Badge variant="secondary" className="px-3 py-1">Dryer Vent Cleaning</Badge>
              <Badge variant="secondary" className="px-3 py-1">Pressure Washing</Badge>
              <Badge variant="secondary" className="px-3 py-1">In-Suite Services</Badge>
              <Badge variant="secondary" className="px-3 py-1">Parkade Cleaning</Badge>
              <Badge variant="secondary" className="px-3 py-1">Ground Window Cleaning</Badge>
            </div>
          </div>
        </div>

          {/* Login Card - Conditionally shown */}
          {showLoginForm && (
            <Card className="w-full shadow-2xl border-2">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-3 md:hidden mb-2">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-icons text-2xl text-primary">apartment</span>
              </div>
              <div>
                <CardTitle className="text-2xl">Rope Access</CardTitle>
                <CardDescription className="text-xs">Management Platform</CardDescription>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
            <CardDescription className="text-base">
              Sign in to access your dashboard and manage operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
                            email
                          </span>
                          <Input 
                            type="email"
                            placeholder="your@email.com" 
                            {...field} 
                            data-testid="input-identifier" 
                            className="h-12 pl-12 text-base" 
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
                      <FormLabel className="text-sm font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
                            lock
                          </span>
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            {...field} 
                            data-testid="input-password" 
                            className="h-12 pl-12 text-base" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-shadow" 
                  data-testid="button-login"
                >
                  <span className="material-icons mr-2">login</span>
                  Sign In
                </Button>
              </form>
            </Form>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="h-10 text-xs bg-yellow-500 hover:bg-yellow-600 text-black" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "testcom", password: "test123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      const user = result.user;
                      if (user.role === "resident") {
                        window.location.href = "/resident";
                      } else if (user.role === "property_manager") {
                        window.location.href = "/property-manager";
                      } else {
                        window.location.href = "/dashboard";
                      }
                    } else {
                      toast({
                        title: "Quick Login Failed",
                        description: result.message || "Test account not found in production database",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Login Error",
                      description: "Network error. Please try manual login.",
                      variant: "destructive",
                    });
                  }
                }}
                data-testid="button-quick-login-testcom"
              >
                <span className="material-icons mr-1 text-base">flash_on</span>
                OWNER DEVELOPMENT ONLY
              </Button>

              <Button 
                className="h-10 text-xs bg-green-600 hover:bg-green-700 text-white" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "tester@tester.com", password: "tester123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      const user = result.user;
                      if (user.role === "resident") {
                        window.location.href = "/resident";
                      } else if (user.role === "property_manager") {
                        window.location.href = "/property-manager";
                      } else {
                        window.location.href = "/dashboard";
                      }
                    } else {
                      toast({
                        title: "Quick Login Failed",
                        description: result.message || "Test account not found in production database",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Login Error",
                      description: "Network error. Please try manual login.",
                      variant: "destructive",
                    });
                  }
                }}
                data-testid="button-quick-login-tester"
              >
                <span className="material-icons mr-1 text-base">flash_on</span>
                TESTER OWNER
              </Button>

              <Button 
                className="h-10 text-xs bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "employee@employee.com", password: "employee123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      const user = result.user;
                      if (user.role === "resident") {
                        window.location.href = "/resident";
                      } else if (user.role === "property_manager") {
                        window.location.href = "/property-manager";
                      } else {
                        window.location.href = "/dashboard";
                      }
                    } else {
                      toast({
                        title: "Quick Login Failed",
                        description: result.message || "Test account not found in production database",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Login Error",
                      description: "Network error. Please try manual login.",
                      variant: "destructive",
                    });
                  }
                }}
                data-testid="button-quick-login-employee"
              >
                <span className="material-icons mr-1 text-base">flash_on</span>
                EMPLOYEE TESTER
              </Button>

              <Button 
                variant="secondary" 
                className="h-10 text-xs" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "res@res.com", password: "res123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      const user = result.user;
                      if (user.role === "resident") {
                        window.location.href = "/resident";
                      } else if (user.role === "property_manager") {
                        window.location.href = "/property-manager";
                      } else {
                        window.location.href = "/dashboard";
                      }
                    } else {
                      toast({
                        title: "Quick Login Failed",
                        description: result.message || "Test account not found in production database",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Login Error",
                      description: "Network error. Please try manual login.",
                      variant: "destructive",
                    });
                  }
                }}
                data-testid="button-quick-login-resident"
              >
                <span className="material-icons mr-1 text-base">flash_on</span>
                RESIDENT TESTER
              </Button>

              <Button 
                variant="secondary" 
                className="h-10 text-xs" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "property@property.com", password: "property123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      window.location.href = "/property-manager";
                    } else {
                      toast({
                        title: "Quick Login Failed",
                        description: result.message || "Property manager account not found",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Login Error",
                      description: "Network error. Please try manual login.",
                      variant: "destructive",
                    });
                  }
                }}
                data-testid="button-quick-login-property-manager"
              >
                <span className="material-icons mr-1 text-base">flash_on</span>
                PROPERTY MANAGER
              </Button>

              <Button 
                variant="destructive" 
                className="h-10 text-xs col-span-2" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "SuperUser", password: "Mhlqt419!" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      window.location.href = "/superuser";
                    } else {
                      toast({
                        title: "SuperUser Login Failed",
                        description: result.message || "SuperUser access denied",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Login Error",
                      description: "Network error. Please try manual login.",
                      variant: "destructive",
                    });
                  }
                }}
                data-testid="button-quick-login-superuser"
              >
                <span className="material-icons mr-1 text-base">shield</span>
                SuperUser
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">New to the platform?</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="default" 
                className="w-full h-12 text-base font-medium" 
                onClick={() => window.location.href = "/get-license"}
                data-testid="button-get-license"
              >
                <span className="material-icons mr-2">shopping_cart</span>
                Get License
              </Button>

              <Button 
                variant="outline" 
                className="w-full h-12 text-base font-medium" 
                onClick={() => window.location.href = "/register"}
                data-testid="link-register"
              >
                <span className="material-icons mr-2">person_add</span>
                Create Resident/Property Manager Account
              </Button>
            </div>

            {/* Mobile-only feature highlights */}
            <div className="md:hidden pt-4 space-y-4 border-t">
              <h3 className="text-sm font-semibold text-center">Built for All Stakeholders</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="space-y-1">
                  <span className="material-icons text-primary text-2xl">business</span>
                  <div className="text-xs font-medium">Companies</div>
                </div>
                <div className="space-y-1">
                  <span className="material-icons text-primary text-2xl">manage_accounts</span>
                  <div className="text-xs font-medium">Managers</div>
                </div>
                <div className="space-y-1">
                  <span className="material-icons text-primary text-2xl">engineering</span>
                  <div className="text-xs font-medium">Technicians</div>
                </div>
                <div className="space-y-1">
                  <span className="material-icons text-primary text-2xl">home</span>
                  <div className="text-xs font-medium">Residents</div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Secure, Professional, Transparent</p>
              <p>Purpose-built for rope access and building maintenance operations</p>
            </div>
          </CardContent>
        </Card>
          )}
        </div>
      </div>
    </div>
  );
}
