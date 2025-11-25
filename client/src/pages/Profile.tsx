import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RefreshButton } from "@/components/RefreshButton";
import { SubscriptionManagement } from "@/components/SubscriptionManagement";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { QRCodeSVG } from 'qrcode.react';

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional(),
  unitNumber: z.string().optional(),
  parkingStallNumber: z.string().optional(),
  companyName: z.string().optional(),
  residentCode: z.string().optional(),
  residentLinkCode: z.string().optional(),
  // Company owner fields
  hourlyRate: z.string().optional(),
  streetAddress: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  employeePhoneNumber: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

function BrandColorsSection({ user }: { user: any }) {
  const { toast } = useToast();
  const [colors, setColors] = useState<string[]>(user?.brandingColors || ['#3b82f6']);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when user data changes
  useEffect(() => {
    if (user?.brandingColors && user.brandingColors.length > 0) {
      setColors(user.brandingColors);
    }
  }, [user?.brandingColors]);

  const addColor = () => {
    setColors([...colors, '#3b82f6']);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Cannot remove",
        description: "You must have at least one color",
        variant: "destructive"
      });
    }
  };

  const updateColor = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  const saveColors = async () => {
    try {
      setIsSaving(true);
      await apiRequest('PATCH', '/api/company/branding', {
        colors: colors,
      });
      toast({ title: "Brand colors updated successfully" });
      // Invalidate BOTH user cache AND branding cache to trigger re-fetch
      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/company"] });
      // Force a page reload to apply new colors immediately
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update colors",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Brand Colors</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Choose colors that match your brand identity. These colors will be applied to the resident portal.
        </p>
      </div>

      <div className="space-y-3">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Input
                type="color"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                data-testid={`input-color-${index}`}
                className="h-12 w-20"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="h-12 font-mono text-sm flex-1"
                data-testid={`text-color-value-${index}`}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => removeColor(index)}
              disabled={colors.length === 1}
              data-testid={`button-remove-color-${index}`}
              className="h-12"
            >
              <span className="material-icons text-lg">delete</span>
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={addColor}
          data-testid="button-add-color"
          className="h-12"
        >
          <span className="material-icons mr-2">add</span>
          Add Color
        </Button>
        <Button
          onClick={saveColors}
          disabled={isSaving}
          data-testid="button-update-colors"
          className="h-12 !bg-primary hover:!bg-primary/90 !text-white"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const { data: userData, isLoading } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const user = userData?.user;

  // Fetch employee data for seat usage (company users only)
  const { data: employeesData } = useQuery({
    queryKey: ["/api/employees/all"],
    enabled: user?.role === "company",
  });

  // Fetch projects for company users (for subscription tab) and residents
  const { data: projectsData } = useQuery<{ projects: any[]; projectInfo?: any }>({
    queryKey: ["/api/projects"],
    enabled: user?.role === "resident" || user?.role === "company",
  });

  const allProjects = projectsData?.projects || [];
  const activeProjects = allProjects.filter((p: any) => p.status === 'active');
  const activeProject = activeProjects[0];
  const isParkadeProject = activeProject?.jobType === 'parkade_pressure_cleaning';

  // Fetch company data if resident has linked account
  const { data: companyData } = useQuery({
    queryKey: ["/api/companies", user?.companyId],
    enabled: !!user?.companyId && user?.role === "resident",
  });

  // Re-verify license mutation (with new license key input)
  const [newLicenseKey, setNewLicenseKey] = useState("");
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  
  const reverifyLicenseMutation = useMutation({
    mutationFn: async (licenseKeyToVerify?: string) => {
      return apiRequest("POST", "/api/verify-license", {
        licenseKey: licenseKeyToVerify || user?.licenseKey,
        email: user?.email,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "License verified successfully" });
      setShowLicenseDialog(false);
      setNewLicenseKey("");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Auto-refresh data when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || "",
      email: user?.email || "",
      unitNumber: user?.unitNumber || "",
      parkingStallNumber: user?.parkingStallNumber || "",
      companyName: user?.companyName || "",
      residentCode: user?.residentCode || "",
      residentLinkCode: "",
      // Company owner fields
      hourlyRate: user?.hourlyRate?.toString() || "",
      streetAddress: user?.streetAddress || "",
      province: user?.province || "",
      country: user?.country || "",
      zipCode: user?.zipCode || "",
      employeePhoneNumber: user?.employeePhoneNumber || "",
    },
  });

  // Check for pending resident code from QR code scan
  useEffect(() => {
    if (user?.role === 'resident') {
      const pendingCode = sessionStorage.getItem('pendingResidentCode');
      if (pendingCode) {
        profileForm.setValue('residentLinkCode', pendingCode);
        sessionStorage.removeItem('pendingResidentCode');
        toast({
          title: "Company code detected",
          description: "Code has been auto-filled. Click 'Update Profile' to link your account.",
        });
      }
    }
  }, [user?.role]);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return apiRequest("PATCH", "/api/user/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Profile updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      return apiRequest("PATCH", "/api/user/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      passwordForm.reset();
      toast({ title: "Password changed successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (password: string) => {
      return apiRequest("DELETE", "/api/user/account", { password });
    },
    onSuccess: () => {
      toast({ title: "Account deleted successfully" });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      toast({ title: "Error", description: "Please enter your password", variant: "destructive" });
      return;
    }
    deleteAccountMutation.mutate(deletePassword);
    setShowDeleteDialog(false);
    setDeletePassword("");
  };

  const confirmLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setLocation("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: "Error", description: "Failed to logout", variant: "destructive" });
    }
  };

  const handleBack = () => {
    if (user?.role === "resident") {
      setLocation("/resident");
    } else if (user?.role === "rope_access_tech") {
      setLocation("/tech");
    } else {
      setLocation("/dashboard");
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    // Handle resident company code linking separately
    if (user?.role === "resident" && data.residentLinkCode && data.residentLinkCode.length === 10) {
      try {
        const response = await fetch("/api/link-resident-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ residentCode: data.residentLinkCode }),
          credentials: "include",
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to link account");
        }
        
        const result = await response.json();
        toast({ 
          title: "Success!", 
          description: `Linked to ${result.companyName}. Reloading...` 
        });
        
        // Force full page reload to clear all caches
        setTimeout(() => {
          window.location.href = "/resident";
        }, 1500);
        return; // Prevent regular profile update from running
      } catch (error) {
        toast({ 
          title: "Link Failed", 
          description: error instanceof Error ? error.message : "Invalid code", 
          variant: "destructive" 
        });
        return;
      }
    }
    
    // Update regular profile fields
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // Determine company ID to fetch branding for logo display
  const companyIdForBranding = user?.role === 'company' ? user.id : user?.companyId;

  // Fetch company branding for logo  
  const { data: brandingData } = useQuery({
    queryKey: ["/api/company", companyIdForBranding, "branding"],
    queryFn: async () => {
      if (!companyIdForBranding) return null;
      const response = await fetch(`/api/company/${companyIdForBranding}/branding`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`Failed to fetch branding: ${response.status}`);
      return response.json();
    },
    enabled: !!companyIdForBranding && user?.role !== 'resident' && user?.role !== 'superuser',
    retry: 1,
  });

  const branding = brandingData || {};
  const hasLogo = !!(branding.subscriptionActive && branding.logoUrl);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b border-card-border shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              data-testid="button-back"
            >
              <span className="material-icons text-xl">arrow_back</span>
            </Button>
            {hasLogo && (
              <img 
                src={branding.logoUrl} 
                alt="Company Logo" 
                className="h-10 w-auto object-contain"
                data-testid="img-company-logo"
              />
            )}
            <h1 className="text-lg font-bold">Profile</h1>
          </div>
          <div className="flex items-center gap-2">
            <RefreshButton />
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-logout"
              onClick={() => setShowLogoutDialog(true)}
            >
              <span className="material-icons text-xl">logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {user?.role === "company" ? (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
              <TabsTrigger value="subscription" data-testid="tab-subscription">Subscription</TabsTrigger>
              <TabsTrigger value="branding" data-testid="tab-branding">Branding</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 mt-4">
              {/* Profile Information */}
              <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          {...field}
                          data-testid="input-name"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {user?.role !== "company" && (
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            {...field}
                            data-testid="input-email"
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {user?.role === "resident" && (
                  <>
                    <FormField
                      control={profileForm.control}
                      name="unitNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 101, 1205"
                              {...field}
                              data-testid="input-unit-number"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="parkingStallNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parking Stall Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 42, A-5, P1-23"
                              {...field}
                              data-testid="input-parking-stall"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Company Code Linking */}
                    {user?.companyId && companyData?.company ? (
                      <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-icons text-success text-lg">check_circle</span>
                          <span className="text-sm font-medium">Linked to Company</span>
                        </div>
                        <p className="text-base font-semibold">{companyData.company.companyName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          To change, enter a new company code below
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/50 border border-border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-icons text-muted-foreground text-lg">info</span>
                          <span className="text-sm font-medium">Not Linked</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enter a company code below to link your account
                        </p>
                      </div>
                    )}
                    
                    <FormField
                      control={profileForm.control}
                      name="residentLinkCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Code {!user?.companyId && "(Required to view projects)"}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter 10-character code"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              maxLength={10}
                              className="h-12 font-mono"
                              data-testid="input-company-code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {user?.role === "company" && (
                  <>
                    <FormField
                      control={profileForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Company name"
                              {...field}
                              data-testid="input-company-name"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="residentCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resident Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="10-character code for residents"
                              {...field}
                              data-testid="input-resident-code"
                              className="h-12 font-mono"
                              maxLength={10}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Company Information</h3>
                      
                      <FormField
                        control={profileForm.control}
                        name="streetAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main St, Suite 100"
                                {...field}
                                data-testid="input-street-address"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="province"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Province/State</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="BC, ON, etc."
                                  {...field}
                                  data-testid="input-province"
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Canada, USA, etc."
                                  {...field}
                                  data-testid="input-country"
                                  className="h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal/Zip Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="V6B 1A1, 90210, etc."
                                {...field}
                                data-testid="input-zip-code"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="employeePhoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(604) 555-1234"
                                {...field}
                                data-testid="input-phone-number"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="hourlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate (for yourself)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="25.00"
                                {...field}
                                data-testid="input-hourly-rate"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="my-4" />
                    
                    {/* Employee Seat Usage */}
                    {employeesData?.seatInfo && employeesData.seatInfo.tier > 0 && (
                      <div className="p-4 bg-muted/50 border border-border rounded-lg" data-testid="card-seat-usage">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-primary text-lg">groups</span>
                            <span className="text-sm font-medium">Employee Seats</span>
                          </div>
                          <Badge 
                            variant={employeesData.seatInfo.atSeatLimit ? "destructive" : "secondary"}
                            data-testid="badge-tier"
                          >
                            Tier {employeesData.seatInfo.tier}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="text-base font-semibold" data-testid="text-seat-usage">
                            {employeesData.seatInfo.seatsUsed} of {employeesData.seatInfo.seatLimit === -1 ? '∞' : employeesData.seatInfo.seatLimit} seats used
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {employeesData.seatInfo.seatLimit === -1 
                              ? 'Unlimited employee seats'
                              : employeesData.seatInfo.seatsAvailable > 0 
                                ? `${employeesData.seatInfo.seatsAvailable} seat${employeesData.seatInfo.seatsAvailable === 1 ? '' : 's'} remaining`
                                : 'No seats available - upgrade to add more employees'
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="pt-2">
                  <div className="text-sm text-muted-foreground mb-2">Role</div>
                  <div className="text-sm font-medium capitalize">
                    {user?.role.replace(/_/g, " ")}
                  </div>
                </div>

                {user?.techLevel && (
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">IRATA Level</div>
                    <div className="text-sm font-medium">{user.techLevel}</div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12"
                  data-testid="button-update-profile"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Separator />

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter current password"
                          {...field}
                          data-testid="input-current-password"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          {...field}
                          data-testid="input-new-password"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          {...field}
                          data-testid="input-confirm-password"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12"
                  data-testid="button-change-password"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

              <Separator />
              
              {/* Delete Account */}
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Delete Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your company account and all associated data. This action cannot be undone.
                    </p>
                    <p className="text-sm text-destructive font-medium">
                      Warning: This will delete all employees, projects, work sessions, drop logs, and complaints.
                    </p>
                    <Button
                      variant="destructive"
                      className="w-full h-12"
                      onClick={() => setShowDeleteDialog(true)}
                      data-testid="button-delete-account"
                    >
                      <span className="material-icons mr-2">delete_forever</span>
                      Delete Company Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4 mt-4">
              <SubscriptionManagement />
            </TabsContent>

            <TabsContent value="branding" className="space-y-4 mt-4">
              {/* White Label Branding */}
              <Card>
                <CardHeader>
                  <CardTitle>White Label Branding</CardTitle>
                  <CardDescription>
                    Customize your company's branding in the resident portal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Subscription Gate */}
                  {!user.whitelabelBrandingActive && (
                    <div className="p-6 border-2 border-dashed rounded-lg bg-muted/30">
                      <div className="text-center space-y-4">
                        <span className="material-icons text-5xl text-muted-foreground">palette</span>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">White Label Branding Subscription</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Customize the resident portal with your company's logo and brand colors for just <strong className="text-foreground">$0.49/month</strong>
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-2 mb-6 text-left max-w-md mx-auto">
                            <li className="flex items-start gap-2">
                              <span className="material-icons text-sm mt-0.5 text-primary">check_circle</span>
                              <span>Upload custom company logo</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="material-icons text-sm mt-0.5 text-primary">check_circle</span>
                              <span>Choose unlimited brand colors</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="material-icons text-sm mt-0.5 text-primary">check_circle</span>
                              <span>Fully branded resident portal experience</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="material-icons text-sm mt-0.5 text-primary">check_circle</span>
                              <span>Professional appearance for your residents</span>
                            </li>
                          </ul>
                        </div>
                        
                        <p className="text-sm text-muted-foreground px-4">
                          Branding subscription is included in the SubscriptionManagement component. Visit the Subscription tab to enable white label branding.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Branding Controls - Only shown if subscribed */}
                  {user.whitelabelBrandingActive && (
                    <>
                  {/* Logo Upload */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Company Logo</Label>
                    <p className="text-xs text-muted-foreground">
                      Upload your company logo to display in the resident portal (recommended: square format, PNG with transparent background)
                    </p>
                    {user.brandingLogoUrl && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <img 
                          src={user.brandingLogoUrl} 
                          alt="Company logo" 
                          className="w-16 h-16 object-contain"
                          data-testid="img-current-logo"
                        />
                        <div className="flex-1 text-sm text-muted-foreground">
                          Current logo
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          const formData = new FormData();
                          formData.append('logo', file);
                          
                          try {
                            const response = await fetch('/api/company/branding/logo', {
                              method: 'POST',
                              body: formData,
                              credentials: 'include',
                            });
                            
                            if (!response.ok) {
                              throw new Error('Failed to upload logo');
                            }
                            
                            const data = await response.json();
                            toast({ title: "Logo uploaded successfully" });
                            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
                          } catch (error) {
                            toast({ 
                              title: "Error", 
                              description: error instanceof Error ? error.message : "Failed to upload logo",
                              variant: "destructive" 
                            });
                          }
                        }}
                        data-testid="input-logo-upload"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Color Customization */}
                  <BrandColorsSection user={user} />

                  <Separator />

                  {/* Preview */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Preview</Label>
                    <p className="text-xs text-muted-foreground">
                      This is how your branding will appear in the resident portal
                    </p>
                    <div 
                      className="p-6 rounded-lg border-2"
                      style={{
                        backgroundColor: `${user.brandingColors?.[0] || '#3b82f6'}15`,
                        borderColor: user.brandingColors?.[0] || '#3b82f6'
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        {user.brandingLogoUrl && (
                          <img 
                            src={user.brandingLogoUrl} 
                            alt="Logo preview" 
                            className="w-12 h-12 object-contain"
                            data-testid="img-logo-preview"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg" style={{ color: user.brandingColors?.[0] || '#3b82f6' }}>
                            {user.companyName || 'Your Company Name'}
                          </h3>
                          <p className="text-sm text-muted-foreground">Resident Portal</p>
                        </div>
                      </div>
                      {user.brandingColors && user.brandingColors.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {user.brandingColors.map((color: string, index: number) => (
                            <div 
                              key={index}
                              className="w-12 h-12 rounded-lg border-2 border-border"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        {user.brandingColors?.slice(0, 3).map((color: string, index: number) => (
                          <Button 
                            key={index}
                            style={{ 
                              backgroundColor: color,
                              color: '#ffffff'
                            }}
                            className="h-12"
                            data-testid={`button-preview-${index}`}
                          >
                            Button {index + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {/* Non-company users - regular layout without tabs */}
            <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          {...field}
                          data-testid="input-name"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                          data-testid="input-email"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {user?.role === "resident" && (
                  <>
                    <FormField
                      control={profileForm.control}
                      name="unitNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 101, 1205"
                              {...field}
                              data-testid="input-unit-number"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="parkingStallNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parking Stall Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 42, A-5, P1-23"
                              {...field}
                              data-testid="input-parking-stall"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Company Code Linking */}
                    {user?.companyId && companyData?.company ? (
                      <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-icons text-success text-lg">check_circle</span>
                          <span className="text-sm font-medium">Linked to Company</span>
                        </div>
                        <p className="text-base font-semibold">{companyData.company.companyName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          To change, enter a new company code below
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/50 border border-border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-icons text-muted-foreground text-lg">info</span>
                          <span className="text-sm font-medium">Not Linked</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enter a company code below to link your account
                        </p>
                      </div>
                    )}
                    
                    <FormField
                      control={profileForm.control}
                      name="residentLinkCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Code {!user?.companyId && "(Required to view projects)"}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter 10-character code"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              maxLength={10}
                              className="h-12 font-mono"
                              data-testid="input-company-code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div className="pt-2">
                  <div className="text-sm text-muted-foreground mb-2">Role</div>
                  <div className="text-sm font-medium capitalize">
                    {user?.role.replace(/_/g, " ")}
                  </div>
                </div>

                {user?.techLevel && (
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">IRATA Level</div>
                    <div className="text-sm font-medium">{user.techLevel}</div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12"
                  data-testid="button-update-profile"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Separator />

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter current password"
                          {...field}
                          data-testid="input-current-password"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          {...field}
                          data-testid="input-new-password"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          {...field}
                          data-testid="input-confirm-password"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12"
                  data-testid="button-change-password"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
          </>
        )}
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company Account</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your company account, all employees, projects, work sessions, drop logs, and complaints. This action cannot be undone.
              
              Please enter your password to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Enter your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="h-12"
              data-testid="input-delete-password"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletePassword("");
              }}
              data-testid="button-cancel-delete-account"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-account"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-logout">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} data-testid="button-confirm-logout">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* License Key Update Dialog */}
      <AlertDialog open={showLicenseDialog} onOpenChange={setShowLicenseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update License Key</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your new license key. This is required after upgrading your tier.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="new-license-key">New License Key</Label>
            <Input
              id="new-license-key"
              placeholder="Enter your new license key"
              value={newLicenseKey}
              onChange={(e) => setNewLicenseKey(e.target.value)}
              data-testid="input-new-license-key"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowLicenseDialog(false);
              setNewLicenseKey("");
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!newLicenseKey.trim()) {
                  toast({ 
                    title: "Error", 
                    description: "Please enter a license key",
                    variant: "destructive" 
                  });
                  return;
                }
                reverifyLicenseMutation.mutate(newLicenseKey.trim());
              }}
              disabled={reverifyLicenseMutation.isPending}
              data-testid="button-confirm-license-update"
            >
              {reverifyLicenseMutation.isPending ? "Verifying..." : "Update License"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
