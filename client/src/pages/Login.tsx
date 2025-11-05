import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or company name is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
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
      } else if (user.role === "rope_access_tech") {
        window.location.href = "/tech";
      } else {
        window.location.href = "/management";
      }
    } catch (error) {
      form.setError("identifier", { message: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Hero Section - Hidden on mobile */}
        <div className="hidden md:flex flex-col justify-center space-y-6 pr-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
              <span className="material-icons text-lg">domain</span>
              Professional Building Maintenance
            </div>
            <h1 className="text-5xl font-bold tracking-tight leading-tight">
              Rope Access{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Comprehensive platform for high-rise building maintenance operations. Track progress, manage teams, and deliver excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-icons text-2xl">speed</span>
                <div className="text-2xl font-bold">Real-time</div>
              </div>
              <div className="text-sm text-muted-foreground">Progress Tracking</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-icons text-2xl">groups</span>
                <div className="text-2xl font-bold">Team</div>
              </div>
              <div className="text-sm text-muted-foreground">Management</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-icons text-2xl">verified</span>
                <div className="text-2xl font-bold">Safety</div>
              </div>
              <div className="text-sm text-muted-foreground">First Priority</div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full shadow-2xl border-2">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-3 md:hidden mb-2">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-icons text-2xl text-primary">domain</span>
              </div>
              <div>
                <CardTitle className="text-2xl">Rope Access</CardTitle>
                <CardDescription className="text-xs">Management Platform</CardDescription>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
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
                      <FormLabel className="text-sm font-medium">Email or Company Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
                            person
                          </span>
                          <Input 
                            placeholder="you@example.com or Company Name" 
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
              Create an Account
            </Button>

            <div className="pt-4 text-center text-xs text-muted-foreground">
              <p>Secure access for companies, managers, technicians, and residents</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
