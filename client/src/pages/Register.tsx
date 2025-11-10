import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const residentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  strataPlanNumber: z.string().min(1, "Strata plan number is required"),
  unitNumber: z.string().min(1, "Unit number is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const companySchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResidentFormData = z.infer<typeof residentSchema>;
type CompanyFormData = z.infer<typeof companySchema>;

export default function Register() {
  const [activeTab, setActiveTab] = useState<"resident" | "company">("resident");

  const residentForm = useForm<ResidentFormData>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      strataPlanNumber: "",
      unitNumber: "",
    },
  });

  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onResidentSubmit = async (data: ResidentFormData) => {
    try {
      const { confirmPassword, ...registrationData } = data;
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...registrationData,
          role: "resident",
          passwordHash: data.password,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        residentForm.setError("email", { message: result.message || "Registration failed" });
        return;
      }

      // Redirect to resident dashboard
      window.location.href = "/resident";
    } catch (error) {
      residentForm.setError("email", { message: "An error occurred. Please try again." });
    }
  };

  const onCompanySubmit = async (data: CompanyFormData) => {
    try {
      const { confirmPassword, ...registrationData } = data;
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...registrationData,
          role: "company",
          email: null,
          passwordHash: data.password,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        companyForm.setError("companyName", { message: result.message || "Registration failed" });
        return;
      }

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      companyForm.setError("companyName", { message: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Choose your account type to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "resident" | "company")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="resident" data-testid="tab-resident">Resident</TabsTrigger>
              <TabsTrigger value="company" data-testid="tab-company">Company</TabsTrigger>
            </TabsList>

            <TabsContent value="resident">
              <Form {...residentForm}>
                <form onSubmit={residentForm.handleSubmit(onResidentSubmit)} className="space-y-4">
                  <FormField
                    control={residentForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} data-testid="input-name" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={residentForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} data-testid="input-email" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={residentForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="604-123-4567" {...field} data-testid="input-phone-number" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={residentForm.control}
                    name="strataPlanNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Strata Plan Number</FormLabel>
                        <FormControl>
                          <Input placeholder="LMS2345" {...field} data-testid="input-strata-plan" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={residentForm.control}
                    name="unitNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1205" {...field} data-testid="input-unit-number" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={residentForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} data-testid="input-password" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={residentForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} data-testid="input-confirm-password" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-12" data-testid="button-register-resident">
                    Create Resident Account
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="company">
              <Form {...companyForm}>
                <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
                  <FormField
                    control={companyForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Rope Access Ltd" {...field} data-testid="input-company-name" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={companyForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} data-testid="input-company-password" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={companyForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} data-testid="input-company-confirm-password" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-12" data-testid="button-register-company">
                    Create Company Account
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary font-medium hover:underline" data-testid="link-login">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
