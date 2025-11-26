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
import { Rocket, Play } from "lucide-react";
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
  const { data: userData, isLoading: isCheckingAuth, error: authError } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
    retry: false,
  });

  useEffect(() => {
    // Don't redirect while loading or if there's an auth error
    if (isCheckingAuth || authError) {
      return;
    }
    
    // Only redirect if we have confirmed user data from a successful API call
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
  }, [userData, isCheckingAuth, authError, setLocation]);

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
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={ropeAccessProLogo} alt="OnRopePro" className="w-7 h-7 object-contain" />
          <span className="font-bold text-lg">OnRopePro</span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost"
            onClick={() => setShowLoginForm(true)}
            data-testid="button-sign-in-header"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => setLocation("/register")}
            data-testid="button-get-started-header"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <p className="text-xs md:text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-6">
          Building Maintenance Management Software<br />
          Built by a Level 3 IRATA Tech
        </p>
        
        <h1 className="text-2xl md:text-4xl font-medium text-primary mb-2">
          Your competitors think they're organized.
        </h1>
        
        <div className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
          THEY'RE NOT
        </div>
        
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-8">
          You track every <span className="font-semibold text-primary">hour worked</span>, from a single platform that actually speaks rope access.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button 
            size="lg"
            onClick={() => setLocation("/register")}
            className="gap-2 px-6"
            data-testid="button-get-started-free"
          >
            <Rocket className="w-4 h-4" />
            Get Started Free
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="gap-2 px-6"
            data-testid="button-watch-demo"
          >
            <Play className="w-4 h-4" />
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Pain Points Section - Below the Fold */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-12">
            Your competitors think they're organized.<br />
            <span className="font-normal">But in reality:</span>
          </h2>
          
          <div className="space-y-4 md:space-y-5 text-base md:text-lg text-muted-foreground">
            <p>
              They're losing <span className="font-semibold text-destructive">$40K/year</span> to payroll errors they don't see.
            </p>
            <p>
              They're spending <span className="font-semibold text-[#e84a6c]">80 hours monthly</span> on admin that should take 10.
            </p>
            <p>
              They're underbidding <span className="font-semibold text-[#e84a6c]">25% of jobs</span> because they're guessing.
            </p>
            <p>
              They're <span className="font-semibold text-destructive">juggling resident complaints</span> between memory, emails, texts, phone calls, notes in a glovebox.
            </p>
            <p>
              They're <span className="font-semibold text-destructive">one accident away</span> from a lawsuit they can't defend because their safety documentation is (maybe) under the driver's front seat.
            </p>
            <p>
              They're losing contracts because they look like amateurs next to you.
            </p>
          </div>
          
          <p className="text-xl md:text-2xl font-bold mt-12">
            Let them keep thinking they're organized.
          </p>
        </div>
      </section>

      {/* Login Modal - Overlay when shown */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl border-2 relative">
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
                className="h-10 text-xs bg-primary hover:bg-primary/90 text-white" 
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
                      body: JSON.stringify({ identifier: "resident@resident.com", password: "resident123" }),
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
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => setShowLoginForm(false)}
            data-testid="button-close-login"
          >
            <span className="material-icons">close</span>
          </Button>
        </Card>
        </div>
      )}
    </div>
  );
}
