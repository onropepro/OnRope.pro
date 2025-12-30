import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { useAuthPortal } from "@/hooks/use-auth-portal";

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
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
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
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<"resident" | "employer" | "property_manager">("resident");
  const [, setLocation] = useLocation();
  const { openLogin } = useAuthPortal();
  // Unit conflict dialog state
  const [showUnitConflictDialog, setShowUnitConflictDialog] = useState(false);
  const [pendingRegistrationData, setPendingRegistrationData] = useState<ResidentFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setLocation("/resident-dashboard");
      } else if (userData.user.role === "property_manager") {
        setLocation("/property-manager");
      } else if (userData.user.role === "superuser") {
        setLocation("/superuser");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [userData, isCheckingAuth, authError, setLocation]);

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
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Internal registration function that handles unit conflict
  const registerResident = async (data: ResidentFormData, confirmUnitTakeover: boolean = false) => {
    try {
      setIsSubmitting(true);
      const { confirmPassword, ...registrationData } = data;
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...registrationData,
          role: "resident",
          passwordHash: data.password,
          confirmUnitTakeover,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        // Check if this is a unit conflict that requires confirmation
        if (response.status === 409 && result.unitConflict && result.requiresConfirmation) {
          // Store the data and show confirmation dialog
          setPendingRegistrationData(data);
          setShowUnitConflictDialog(true);
          setIsSubmitting(false);
          return;
        }
        
        // Set error on the appropriate field based on backend response
        const errorField = result.field === "unitNumber" ? "unitNumber" : "email";
        residentForm.setError(errorField, { message: result.message || "Registration failed" });
        setIsSubmitting(false);
        return;
      }

      // Redirect to resident dashboard
      window.location.href = "/resident-dashboard";
    } catch (error) {
      residentForm.setError("email", { message: "An error occurred. Please try again." });
      setIsSubmitting(false);
    }
  };

  // Form submit handler - wrapper for react-hook-form
  const onResidentSubmit = async (data: ResidentFormData) => {
    await registerResident(data, false);
  };

  // Handle unit conflict confirmation - user confirms this is their unit
  const handleConfirmUnitTakeover = async () => {
    if (!pendingRegistrationData) return;
    
    setShowUnitConflictDialog(false);
    await registerResident(pendingRegistrationData, true);
    setPendingRegistrationData(null);
  };

  // Handle unit conflict cancellation - user wants to re-enter unit number
  const handleCancelUnitTakeover = () => {
    setShowUnitConflictDialog(false);
    setPendingRegistrationData(null);
    setIsSubmitting(false);
    // Focus on the unit number field for re-entry
    residentForm.setFocus("unitNumber");
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
      const { confirmPassword, firstName, lastName, phoneNumber, ...registrationData } = data;
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...registrationData,
          name: `${firstName} ${lastName}`.trim(), // Combine first and last name
          firstName,
          lastName,
          propertyManagerPhoneNumber: phoneNumber || undefined,
          role: "property_manager",
          passwordHash: data.password,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        propertyManagerForm.setError("email", { message: result.message || "Registration failed" });
        return;
      }

      // Redirect to property manager dashboard
      window.location.href = "/property-manager";
    } catch (error) {
      propertyManagerForm.setError("email", { message: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="icon" onClick={openLogin} data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <LanguageDropdown />
          </div>
          <CardTitle className="text-2xl font-bold text-center">{t('register.title', 'Create Account')}</CardTitle>
          <CardDescription className="text-center">{t('register.subtitle', 'Choose your account type to get started')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "resident" | "employer" | "property_manager")}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="resident" data-testid="tab-resident">{t('register.tabs.resident', 'Resident')}</TabsTrigger>
              <TabsTrigger value="employer" data-testid="tab-employer">{t('register.tabs.employer', 'Employer')}</TabsTrigger>
              <TabsTrigger value="property_manager" data-testid="tab-property-manager">{t('register.tabs.propertyManager', 'Property Manager')}</TabsTrigger>
            </TabsList>

            <TabsContent value="resident">
              <Form {...residentForm}>
                <form onSubmit={residentForm.handleSubmit(onResidentSubmit)} className="space-y-4">
                  <FormField
                    control={residentForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.resident.fullName', 'Full Name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.resident.fullNamePlaceholder', 'John Doe')} {...field} data-testid="input-name" className="h-12" />
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
                        <FormLabel>{t('register.resident.email', 'Email')}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t('register.resident.emailPlaceholder', 'you@example.com')} {...field} data-testid="input-email" className="h-12" />
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
                        <FormLabel>{t('register.resident.phoneNumber', 'Phone Number')}</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder={t('register.resident.phoneNumberPlaceholder', '604-123-4567')} {...field} data-testid="input-phone-number" className="h-12" />
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
                        <FormLabel>{t('register.resident.strataPlan', 'Strata Plan Number')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.resident.strataPlanPlaceholder', 'LMS1234')} {...field} data-testid="input-strata-plan" className="h-12" />
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
                        <FormLabel>{t('register.resident.unitNumber', 'Unit Number')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.resident.unitNumberPlaceholder', '101')} {...field} data-testid="input-unit-number" className="h-12" />
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
                        <FormLabel>{t('register.resident.parkingStall', 'Parking Stall Number (Optional)')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.resident.parkingStallPlaceholder', 'P1-25')} {...field} data-testid="input-parking-stall" className="h-12" />
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
                        <FormLabel>{t('register.resident.password', 'Password')}</FormLabel>
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
                        <FormLabel>{t('register.resident.confirmPassword', 'Confirm Password')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} data-testid="input-confirm-password" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-12" data-testid="button-register-resident">
                    {t('register.resident.submit', 'Create Resident Account')}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="employer">
              <Form {...companyForm}>
                <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
                  <FormField
                    control={companyForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.employer.companyName', 'Company Name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.employer.companyNamePlaceholder', 'ABC Rope Access Ltd.')} {...field} data-testid="input-company-name" className="h-12" />
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
                        <FormLabel>{t('register.employer.ownerName', 'Owner Name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.employer.ownerNamePlaceholder', 'John Smith')} {...field} data-testid="input-owner-name" className="h-12" />
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
                        <FormLabel>{t('register.employer.email', 'Email')}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t('register.employer.emailPlaceholder', 'you@company.com')} {...field} data-testid="input-employer-email" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={companyForm.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.employer.streetAddress', 'Street Address')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.employer.streetAddressPlaceholder', '123 Main Street')} {...field} data-testid="input-street-address" className="h-12" />
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
                          <FormLabel>{t('register.employer.province', 'Province/State')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('register.employer.provincePlaceholder', 'BC')} {...field} data-testid="input-province" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('register.employer.country', 'Country')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('register.employer.countryPlaceholder', 'Canada')} {...field} data-testid="input-country" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={companyForm.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.employer.zipCode', 'Postal/Zip Code')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.employer.zipCodePlaceholder', 'V6B 1A1')} {...field} data-testid="input-zip-code" className="h-12" />
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
                        <FormLabel>{t('register.employer.licenseKey', 'License Key (Optional)')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.employer.licenseKeyPlaceholder', 'Enter license key if you have one')} {...field} data-testid="input-license-key" className="h-12" />
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
                        <FormLabel>{t('register.employer.password', 'Password')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} data-testid="input-employer-password" className="h-12" />
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
                        <FormLabel>{t('register.employer.confirmPassword', 'Confirm Password')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} data-testid="input-employer-confirm-password" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-12" data-testid="button-register-employer">
                    {t('register.employer.submit', 'Create Employer Account')}
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
                          <FormLabel>{t('register.propertyManager.firstName', 'First Name')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('register.propertyManager.firstNamePlaceholder', 'Jane')} {...field} data-testid="input-first-name" className="h-12" />
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
                          <FormLabel>{t('register.propertyManager.lastName', 'Last Name')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('register.propertyManager.lastNamePlaceholder', 'Smith')} {...field} data-testid="input-last-name" className="h-12" />
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
                        <FormLabel>{t('register.propertyManager.company', 'Property Management Company')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('register.propertyManager.companyPlaceholder', 'ABC Property Management')} {...field} data-testid="input-property-management-company" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={propertyManagerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.propertyManager.email', 'Email')}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t('register.propertyManager.emailPlaceholder', 'you@example.com')} {...field} data-testid="input-property-manager-email" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={propertyManagerForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.propertyManager.phoneNumber', 'Phone Number (Optional)')}</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder={t('register.propertyManager.phoneNumberPlaceholder', '604-123-4567')} {...field} data-testid="input-property-manager-phone" className="h-12" />
                        </FormControl>
                        <FormDescription className="text-xs">
                          {t('register.propertyManager.phoneDescription', 'Used for SMS notifications when you receive quotes')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={propertyManagerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.propertyManager.password', 'Password')}</FormLabel>
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
                        <FormLabel>{t('register.propertyManager.confirmPassword', 'Confirm Password')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} data-testid="input-property-manager-confirm-password" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-12" data-testid="button-register-property-manager">
                    {t('register.propertyManager.submit', 'Create Property Manager Account')}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t('register.haveAccount', 'Already have an account?')}{" "}
            <button onClick={openLogin} className="text-primary font-medium hover:underline" data-testid="link-login">
              {t('register.signIn', 'Sign in')}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Unit Conflict Confirmation Dialog */}
      <Dialog open={showUnitConflictDialog} onOpenChange={setShowUnitConflictDialog}>
        <DialogContent 
          className="sm:max-w-lg w-[calc(100%-2rem)] mx-4" 
          data-testid="dialog-unit-conflict"
          aria-labelledby="unit-conflict-title"
          aria-describedby="unit-conflict-description"
        >
          <DialogHeader>
            <DialogTitle id="unit-conflict-title" className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" aria-hidden="true" />
              {t('register.unitConflict.title', 'Unit Already Linked')}
            </DialogTitle>
            <DialogDescription id="unit-conflict-description" className="pt-2 space-y-3">
              <p>
                {t('register.unitConflict.message', 'Unit {{unitNumber}} at building {{strataPlan}} is already linked to another resident account.', {
                  unitNumber: pendingRegistrationData?.unitNumber,
                  strataPlan: pendingRegistrationData?.strataPlanNumber
                })}
              </p>
              <p className="text-muted-foreground">
                {t('register.unitConflict.explanation', 'This can happen when a previous resident moves out and a new resident moves in. If you are the new resident of this unit, you can claim it and the previous link will be removed.')}
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-2">
            <Button
              variant="outline"
              onClick={handleCancelUnitTakeover}
              disabled={isSubmitting}
              data-testid="button-unit-conflict-cancel"
              aria-label={t('register.unitConflict.reenterAria', 'Cancel and re-enter unit number')}
            >
              {t('register.unitConflict.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleConfirmUnitTakeover}
              disabled={isSubmitting}
              data-testid="button-unit-conflict-confirm"
              aria-label={t('register.unitConflict.confirmAria', 'Confirm this is my unit and link it to my account')}
            >
              {isSubmitting 
                ? t('register.unitConflict.linking', 'Linking...') 
                : t('register.unitConflict.confirm', 'Yes, link this unit to me')
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
