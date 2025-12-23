import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { UserType } from "@/hooks/use-auth-portal";
import { Loader2, Mail, User, KeyRound, CreditCard, Building2, Phone } from "lucide-react";

interface RegisterFormProps {
  userType: UserType;
  onSuccess: (user: any) => void;
}

const baseFields = {
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
};

const passwordMatch = (data: { password: string; confirmPassword: string }) => 
  data.password === data.confirmPassword;

const technicianSchema = z.object({
  ...baseFields,
  licenseNumber: z.string().optional(),
  phone: z.string().optional(),
}).refine(passwordMatch, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const buildingManagerSchema = z.object({
  ...baseFields,
  strataPlanNumber: z.string().min(1, "Strata plan number is required"),
  buildingName: z.string().min(1, "Building name is required"),
}).refine(passwordMatch, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const propertyManagerSchema = z.object({
  ...baseFields,
  companyName: z.string().min(1, "Company name is required"),
  phone: z.string().optional(),
}).refine(passwordMatch, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const residentSchema = z.object({
  ...baseFields,
  unitNumber: z.string().optional(),
}).refine(passwordMatch, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const companySchema = z.object({
  ...baseFields,
  companyName: z.string().min(1, "Company name is required"),
  phone: z.string().optional(),
}).refine(passwordMatch, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const schemaByUserType: Record<UserType, z.ZodSchema> = {
  technician: technicianSchema,
  property_manager: propertyManagerSchema,
  building_manager: buildingManagerSchema,
  resident: residentSchema,
  company: companySchema,
};

const roleByUserType: Record<UserType, string> = {
  technician: "rope_access_tech",
  property_manager: "property_manager",
  building_manager: "building_manager",
  resident: "resident",
  company: "company",
};

export function RegisterForm({ userType, onSuccess }: RegisterFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = schemaByUserType[userType];

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      licenseNumber: "",
      phone: "",
      strataPlanNumber: "",
      buildingName: "",
      companyName: "",
      unitNumber: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: roleByUserType[userType],
        ...(data.licenseNumber && { irataLicenseNumber: data.licenseNumber }),
        ...(data.phone && { phone: data.phone }),
        ...(data.strataPlanNumber && { strataPlanNumber: data.strataPlanNumber }),
        ...(data.buildingName && { buildingName: data.buildingName }),
        ...(data.companyName && { companyName: data.companyName }),
        ...(data.unitNumber && { unitNumber: data.unitNumber }),
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.message?.toLowerCase().includes("email")) {
          form.setError("email", { message: "This email is already registered." });
        } else if (result.message?.toLowerCase().includes("license")) {
          form.setError("licenseNumber", { message: result.message });
        } else if (result.message?.toLowerCase().includes("strata")) {
          form.setError("strataPlanNumber", { message: result.message });
        } else {
          toast({
            title: "Registration failed",
            description: result.message || "Please try again.",
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      const userResponse = await fetch("/api/user", { credentials: "include" });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        toast({
          title: t("auth.accountCreated", "Account created!"),
          description: t("auth.welcomeToOnRopePro", "Welcome to OnRopePro"),
        });
        onSuccess(userData.user);
      } else {
        toast({
          title: t("auth.accountCreated", "Account created!"),
          description: t("auth.pleaseSignIn", "Please sign in with your new account."),
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t("auth.firstName", "First Name")}
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John" data-testid="input-firstName" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.lastName", "Last Name")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Doe" data-testid="input-lastName" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t("auth.email", "Email")}
              </FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="john@example.com" data-testid="input-email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {userType === "technician" && (
          <>
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {t("auth.licenseNumber", "IRATA/SPRAT License")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Optional - add later" data-testid="input-licenseNumber" />
                  </FormControl>
                  <FormDescription className="text-xs">
                    You can add this later in your profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t("auth.phone", "Phone")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="Optional" data-testid="input-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {userType === "building_manager" && (
          <>
            <FormField
              control={form.control}
              name="strataPlanNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {t("auth.strataPlanNumber", "Strata Plan Number")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., VR1234" data-testid="input-strataPlanNumber" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buildingName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.buildingName", "Building Name")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Sunrise Towers" data-testid="input-buildingName" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {(userType === "property_manager" || userType === "company") && (
          <>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {t("auth.companyName", "Company Name")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your company name" data-testid="input-companyName" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t("auth.phone", "Phone")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="Optional" data-testid="input-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {userType === "resident" && (
          <FormField
            control={form.control}
            name="unitNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.unitNumber", "Unit Number")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Optional - e.g., 1205" data-testid="input-unitNumber" />
                </FormControl>
                <FormDescription className="text-xs">
                  Your unit number in the building
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
                <Input {...field} type="password" placeholder="At least 6 characters" data-testid="input-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.confirmPassword", "Confirm Password")}</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Re-enter password" data-testid="input-confirmPassword" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-register-submit">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("auth.creatingAccount", "Creating account...")}
            </>
          ) : (
            t("auth.createAccount", "Create Account")
          )}
        </Button>
      </form>
    </Form>
  );
}
