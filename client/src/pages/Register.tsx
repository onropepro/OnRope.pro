import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const residentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  strataPlanNumber: z.string().min(1, "Strata plan number is required"),
  unitNumber: z.string().min(1, "Unit number is required"),
  parkingStallNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const companySchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  name: z.string().min(2, "Owner name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  hourlyRate: z.string().optional().refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
    message: "Hourly rate must be a valid number",
  }),
  streetAddress: z.string().min(1, "Street address is required"),
  province: z.string().min(1, "Province is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().min(1, "Zip/postal code is required"),
  licenseKey: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const propertyManagerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  propertyManagementCompany: z.string().min(2, "Property management company name is required"),
  companyCode: z.string().length(10, "Company code must be exactly 10 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResidentFormData = z.infer<typeof residentSchema>;
type CompanyFormData = z.infer<typeof companySchema>;
type PropertyManagerFormData = z.infer<typeof propertyManagerSchema>;

export default function Register() {
  const [activeTab, setActiveTab] = useState<"resident" | "company" | "property_manager">("resident");

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
      parkingStallNumber: "",
    },
  });

  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "",
      name: "",
      email: "",
      hourlyRate: "",
      streetAddress: "",
      province: "",
      country: "",
      zipCode: "",
      licenseKey: "",
      password: "",
      confirmPassword: "",
    },
  });

  const propertyManagerForm = useForm<PropertyManagerFormData>({
    resolver: zodResolver(propertyManagerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      propertyManagementCompany: "",
      companyCode: "",
      email: "",
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
          passwordHash: data.password,
          licenseKey: data.licenseKey || undefined,
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

  const onPropertyManagerSubmit = async (data: PropertyManagerFormData) => {
    try {
      const { confirmPassword, ...registrationData } = data;
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...registrationData,
          role: "property_manager",
          passwordHash: data.password,
          companyCode: data.companyCode,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        propertyManagerForm.setError("email", { message: result.message || "Registration failed" });
        return;
      }

      // Redirect to property manager dashboard (you may create a dedicated page later)
      window.location.href = "/buildings";
    } catch (error) {
      propertyManagerForm.setError("email", { message: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/login">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Choose your account type to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "resident" | "company" | "property_manager")}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="resident" data-testid="tab-resident">Resident</TabsTrigger>
              <TabsTrigger value="company" data-testid="tab-company">Company</TabsTrigger>
              <TabsTrigger value="property_manager" data-testid="tab-property-manager">Property Manager</TabsTrigger>
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
                    name="parkingStallNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parking Stall Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="P-42" {...field} data-testid="input-parking-stall" className="h-12" />
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
                    Create Resident/Property Manager Account
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} data-testid="input-owner-name" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={companyForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@company.com" {...field} data-testid="input-company-email" className="h-12" />
                        </FormControl>
                        <FormDescription className="text-muted-foreground text-sm">
                          Use this email to log in to your account
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={companyForm.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Hourly Rate (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="45.00" {...field} data-testid="input-hourly-rate" className="h-12" />
                        </FormControl>
                        <FormDescription className="text-muted-foreground text-sm">
                          Used for financial analytics if you work on jobs alongside your team
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={companyForm.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} data-testid="input-street-address" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={companyForm.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <FormControl>
                            <Input placeholder="BC" {...field} data-testid="input-province" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="V6B 4Y8" {...field} data-testid="input-zip-code" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={companyForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Canada" {...field} data-testid="input-country" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={companyForm.control}
                    name="licenseKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Key (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC123-X" {...field} data-testid="input-license-key" className="h-12" />
                        </FormControl>
                        <FormDescription className="text-muted-foreground text-sm">
                          Enter your license key now to get immediate access, or add it later from your profile
                        </FormDescription>
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

            <TabsContent value="property_manager">
              <Form {...propertyManagerForm}>
                <form onSubmit={propertyManagerForm.handleSubmit(onPropertyManagerSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={propertyManagerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} data-testid="input-first-name" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={propertyManagerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} data-testid="input-last-name" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={propertyManagerForm.control}
                    name="propertyManagementCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Management Company</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC Property Management Inc." {...field} data-testid="input-property-management-company" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={propertyManagerForm.control}
                    name="companyCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Code</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC1234567" {...field} data-testid="input-company-code" className="h-12" maxLength={10} />
                        </FormControl>
                        <FormDescription className="text-muted-foreground text-sm">
                          Enter the 10-character code provided by the rope access company
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={propertyManagerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@propertymanagement.com" {...field} data-testid="input-property-manager-email" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={propertyManagerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} data-testid="input-property-manager-password" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={propertyManagerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} data-testid="input-property-manager-confirm-password" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-12" data-testid="button-register-property-manager">
                    Create Property Manager Account
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
