import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import overhaulLabsLogo from "@assets/Screenshot 2025-11-09 at 14.46.08_1762728408763.png";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { toast } = useToast();
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

      const user = result.user;
      if (user.role === "resident") {
        window.location.href = "/resident";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      form.setError("identifier", { message: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Hero Section - Hidden on mobile */}
        <div className="hidden md:flex flex-col justify-center space-y-8 pr-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
              <span className="material-icons text-lg">apartment</span>
              Professional High-Rise Maintenance
            </div>
            <h1 className="text-5xl font-bold tracking-tight leading-tight">
              Rope Access{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Management Platform
              </span>
            </h1>
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

        {/* Login Card */}
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
                testcom
              </Button>

              <Button 
                variant="secondary" 
                className="h-10 text-xs" 
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
                tester
              </Button>

              <Button 
                className="h-10 text-xs bg-yellow-500 hover:bg-yellow-600 text-black" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "emptester@test.com", password: "emp123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      const user = result.user;
                      if (user.role === "resident") {
                        window.location.href = "/resident";
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
                employee
              </Button>

              <Button 
                className="h-10 text-xs bg-yellow-500 hover:bg-yellow-600 text-black" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "restester@test.com", password: "res123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      const user = result.user;
                      if (user.role === "resident") {
                        window.location.href = "/resident";
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
                data-testid="button-quick-login-resident-tester"
              >
                <span className="material-icons mr-1 text-base">flash_on</span>
                resident
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

            <Button 
              variant="outline" 
              className="w-full h-12 text-base font-medium" 
              onClick={() => window.location.href = "/register"}
              data-testid="link-register"
            >
              <span className="material-icons mr-2">person_add</span>
              Create Company or Resident/Owner Account
            </Button>

            <Button 
              variant="ghost" 
              className="w-full h-10 text-sm" 
              onClick={() => window.location.reload()}
              data-testid="button-refresh"
            >
              <span className="material-icons mr-2 text-base">refresh</span>
              Refresh To Get Latest Update
            </Button>

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

            {/* Powered by Overhaul Labs */}
            <a 
              href="https://overhaullabs.replit.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="pt-6 mt-6 border-t flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              data-testid="link-overhaul-labs"
            >
              <img 
                src={overhaulLabsLogo} 
                alt="Overhaul Labs" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-xs text-muted-foreground font-medium">
                Powered by <span className="text-foreground">Overhaul Labs</span>
              </span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
