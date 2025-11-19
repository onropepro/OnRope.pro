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
import { useState, useEffect } from "react";
import { format } from "date-fns";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional(),
  unitNumber: z.string().optional(),
  parkingStallNumber: z.string().optional(),
  companyName: z.string().optional(),
  residentCode: z.string().optional(),
  residentLinkCode: z.string().optional(),
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

  // Auto-refresh data when user returns from external pages (e.g., cancellation page, upgrade, purchases)
  useEffect(() => {
    if (!user?.licenseKey) return;

    // Check if returning from marketplace
    const urlParams = new URLSearchParams(window.location.search);
    const fromCancellation = urlParams.has('canceled');
    const fromUpgrade = urlParams.has('upgraded');
    const fromPurchase = urlParams.has('purchased');
    const fromMarketplace = fromCancellation || fromUpgrade || fromPurchase || document.referrer.includes('ram-website');
    
    if (fromMarketplace) {
      // For tier upgrades, we CANNOT auto-verify because marketplace returns a NEW license key
      // The old key is no longer valid, so we must prompt user to enter their new key
      if (fromUpgrade) {
        toast({ 
          title: "Tier Upgraded!", 
          description: "Please scroll down and click 'Update License Key' to enter your new license key from the marketplace.",
          duration: 10000,
        });
        setShowLicenseDialog(true); // Auto-open the dialog
      } else if (fromPurchase) {
        // Seat/project purchases don't change the license key, so auto-verify works
        toast({ 
          title: "Purchase complete!", 
          description: "Refreshing your subscription data..."
        });
        setTimeout(() => {
          reverifyLicenseMutation.mutate();
        }, 500);
      } else if (fromCancellation) {
        toast({ 
          title: "Cancellation processed", 
          description: "Refreshing your subscription data..."
        });
        setTimeout(() => {
          reverifyLicenseMutation.mutate();
        }, 500);
      }
      
      // Clean up URL
      window.history.replaceState({}, '', '/profile');
    }

    const handleFocus = () => {
      // Refresh all relevant data when window gains focus
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user?.licenseKey]);

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
    },
  });

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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
              <TabsTrigger value="subscription" data-testid="tab-subscription">Subscription</TabsTrigger>
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
              {/* License Information */}
              <Card>
                <CardHeader>
                  <CardTitle>License & Subscription</CardTitle>
                  <CardDescription>
                    View your subscription details and usage limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* License Key */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">License Key</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={user?.licenseKey || "Not configured"}
                        readOnly
                        className="h-12 font-mono text-sm"
                        data-testid="input-license-key"
                      />
                      {user?.licenseVerified ? (
                        <Badge variant="default" className="shrink-0" data-testid="badge-license-verified">
                          <span className="material-icons text-xs mr-1">verified</span>
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="shrink-0" data-testid="badge-license-unverified">
                          <span className="material-icons text-xs mr-1">error</span>
                          Unverified
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Tier Information */}
                  {employeesData?.seatInfo && (
                    <div className="space-y-4">
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Subscription Tier</Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Your current plan and features
                          </p>
                        </div>
                        <Badge 
                          variant={employeesData.seatInfo.tier === 3 ? "default" : "secondary"}
                          className="text-base px-3 py-1"
                          data-testid="badge-subscription-tier"
                        >
                          Tier {employeesData.seatInfo.tier}
                          {employeesData.seatInfo.tier === 1 && " - Basic"}
                          {employeesData.seatInfo.tier === 2 && " - Starter"}
                          {employeesData.seatInfo.tier === 3 && " - Professional"}
                          {employeesData.seatInfo.tier === 4 && " - Premium"}
                        </Badge>
                      </div>

                      {/* Subscription Renewal Date */}
                      {user?.subscriptionRenewalDate && (
                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <Label className="text-sm font-medium">Renewal Date</Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Next billing cycle (30-day subscription)
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold" data-testid="text-renewal-date">
                              {format(new Date(user.subscriptionRenewalDate), "MMM d, yyyy")}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {(() => {
                                const renewalDate = new Date(user.subscriptionRenewalDate);
                                const today = new Date();
                                const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                
                                if (daysUntilRenewal < 0) {
                                  return `Expired ${Math.abs(daysUntilRenewal)} day${Math.abs(daysUntilRenewal) === 1 ? '' : 's'} ago`;
                                } else if (daysUntilRenewal === 0) {
                                  return 'Renews today';
                                } else if (daysUntilRenewal === 1) {
                                  return 'Renews tomorrow';
                                } else {
                                  return `${daysUntilRenewal} days until renewal`;
                                }
                              })()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Employee Seats */}
                  {employeesData?.seatInfo && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-primary">groups</span>
                            <Label className="text-sm font-medium">Employee Seats</Label>
                          </div>
                          <Badge 
                            variant={employeesData.seatInfo.atSeatLimit ? "destructive" : "outline"}
                            data-testid="badge-seat-status"
                          >
                            {employeesData.seatInfo.seatsUsed} / {employeesData.seatInfo.seatLimit === -1 ? '∞' : employeesData.seatInfo.seatLimit}
                          </Badge>
                        </div>
                        <div className="pl-8 space-y-2">
                          <div className="text-sm font-semibold" data-testid="text-seats-used">
                            {employeesData.seatInfo.seatsUsed} of {employeesData.seatInfo.seatLimit === -1 ? 'unlimited' : employeesData.seatInfo.seatLimit} seats used
                          </div>
                          {employeesData.seatInfo.seatLimit !== -1 && (
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              <div>Base seats (Tier {employeesData.seatInfo.tier}): {employeesData.seatInfo.baseSeatLimit}</div>
                              {employeesData.seatInfo.additionalSeats > 0 && (
                                <div>Additional purchased: +{employeesData.seatInfo.additionalSeats}</div>
                              )}
                              <div className="font-medium">Total: {employeesData.seatInfo.seatLimit}</div>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {employeesData.seatInfo.seatLimit === -1 
                              ? 'Your plan includes unlimited employee seats'
                              : employeesData.seatInfo.seatsAvailable > 0 
                                ? `${employeesData.seatInfo.seatsAvailable} seat${employeesData.seatInfo.seatsAvailable === 1 ? '' : 's'} remaining`
                                : 'No seats available - upgrade to add more employees'
                            }
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Active Projects */}
                  {projectsData?.projectInfo && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-primary">folder_open</span>
                            <Label className="text-sm font-medium">Active Projects</Label>
                          </div>
                          <Badge 
                            variant={projectsData.projectInfo.atProjectLimit ? "destructive" : "outline"}
                            data-testid="badge-project-status"
                          >
                            {projectsData.projectInfo.projectsUsed} / {projectsData.projectInfo.projectLimit === -1 ? '∞' : projectsData.projectInfo.projectLimit}
                          </Badge>
                        </div>
                        <div className="pl-8 space-y-2">
                          <div className="text-sm font-semibold" data-testid="text-projects-used">
                            {projectsData.projectInfo.projectsUsed} of {projectsData.projectInfo.projectLimit === -1 ? 'unlimited' : projectsData.projectInfo.projectLimit} projects active
                          </div>
                          {projectsData.projectInfo.projectLimit !== -1 && (
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              <div>Base projects (Tier {projectsData.projectInfo.tier}): {projectsData.projectInfo.baseProjectLimit}</div>
                              {projectsData.projectInfo.additionalProjects > 0 && (
                                <div>Additional purchased: +{projectsData.projectInfo.additionalProjects}</div>
                              )}
                              <div className="font-medium">Total: {projectsData.projectInfo.projectLimit}</div>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {projectsData.projectInfo.projectLimit === -1 
                              ? 'Your plan includes unlimited active projects'
                              : projectsData.projectInfo.projectsAvailable > 0 
                                ? `${projectsData.projectInfo.projectsAvailable} project${projectsData.projectInfo.projectsAvailable === 1 ? '' : 's'} remaining`
                                : 'No project slots available - upgrade to create more projects'
                            }
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Upgrade Options */}
                  {employeesData?.seatInfo && employeesData.seatInfo.tier < 4 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Need more capacity?</Label>
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="default"
                            className="w-full h-12"
                            data-testid="button-upgrade-tier"
                            onClick={() => {
                              if (!employeesData?.seatInfo) {
                                alert('Tier info not loaded. Please refresh the page.');
                                return;
                              }
                              
                              const email = encodeURIComponent(user?.email || '');
                              const licenseKey = encodeURIComponent(user?.licenseKey || '');
                              const currentTier = employeesData.seatInfo.tier.toString();
                              const returnUrl = encodeURIComponent(`${window.location.origin}/profile?upgraded=true`);
                              const url = `https://ram-website-paquettetom.replit.app/upgrade-tier?email=${email}&licenseKey=${licenseKey}&currentTier=${currentTier}&returnUrl=${returnUrl}`;
                              
                              console.log('[Tier Upgrade] Opening:', url);
                              window.location.href = url;
                            }}
                          >
                            <span className="material-icons mr-2">upgrade</span>
                            Upgrade Tier
                          </Button>
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              variant="outline"
                              className="h-12"
                              data-testid="button-buy-seats"
                              onClick={() => {
                                if (!employeesData?.seatInfo) {
                                  alert('Seat info not loaded. Please refresh the page.');
                                  return;
                                }
                                
                                const email = encodeURIComponent(user?.email || '');
                                const licenseKey = encodeURIComponent(user?.licenseKey || '');
                                const tier = employeesData.seatInfo.tier.toString();
                                const currentSeats = employeesData.seatInfo.seatLimit.toString();
                                const seatsUsed = employeesData.seatInfo.seatsUsed.toString();
                                const returnUrl = encodeURIComponent(`${window.location.origin}/profile?purchased=true`);
                                const url = `https://ram-website-paquettetom.replit.app/purchase-seats?email=${email}&licenseKey=${licenseKey}&tier=${tier}&currentSeats=${currentSeats}&seatsUsed=${seatsUsed}&returnUrl=${returnUrl}`;
                                
                                console.log('[Seat Purchase] Opening:', url);
                                window.location.href = url;
                              }}
                            >
                              <span className="material-icons mr-2">add_shopping_cart</span>
                              Add more seats
                            </Button>
                            <Button 
                              variant="outline"
                              className="h-12"
                              data-testid="button-buy-projects"
                              onClick={() => {
                                if (!projectsData?.projectInfo) {
                                  alert('Project info not loaded. Please refresh the page.');
                                  return;
                                }
                                
                                const email = encodeURIComponent(user?.email || '');
                                const licenseKey = encodeURIComponent(user?.licenseKey || '');
                                const tier = projectsData.projectInfo.tier.toString();
                                const currentProjects = projectsData.projectInfo.projectLimit.toString();
                                const projectsUsed = projectsData.projectInfo.projectsUsed.toString();
                                const returnUrl = encodeURIComponent(`${window.location.origin}/profile?purchased=true`);
                                const url = `https://ram-website-paquettetom.replit.app/purchase-projects?email=${email}&licenseKey=${licenseKey}&tier=${tier}&currentProjects=${currentProjects}&projectsUsed=${projectsUsed}&returnUrl=${returnUrl}`;
                                
                                console.log('[Project Purchase] Opening:', url);
                                window.location.href = url;
                              }}
                            >
                              <span className="material-icons mr-2">add_shopping_cart</span>
                              Add more projects
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Update License Key Button */}
                  {user?.licenseVerified && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Update License Key</Label>
                        <p className="text-xs text-muted-foreground">
                          After upgrading your tier on the marketplace, enter your new license key here to update your subscription.
                        </p>
                        <Button 
                          variant="outline"
                          className="w-full h-12"
                          data-testid="button-update-license"
                          onClick={() => setShowLicenseDialog(true)}
                        >
                          <span className="material-icons mr-2">vpn_key</span>
                          Update License Key
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Cancel Subscription */}
                  {user?.licenseVerified && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-destructive">Cancel Subscription and/or Add-ons</Label>
                        <p className="text-xs text-muted-foreground">
                          Cancel your subscription and stop future billing cycles. Your access will remain active until the end of your current billing period.
                        </p>
                        <Button 
                          variant="destructive"
                          className="w-full h-12"
                          data-testid="button-cancel-subscription"
                          onClick={() => {
                            const email = encodeURIComponent(user?.email || '');
                            const licenseKey = encodeURIComponent(user?.licenseKey || '');
                            const returnUrl = encodeURIComponent(`${window.location.origin}/profile?canceled=true`);
                            const url = `https://ram-website-paquettetom.replit.app/cancel-subscription?email=${email}&licenseKey=${licenseKey}&returnUrl=${returnUrl}`;
                            window.location.href = url;
                          }}
                        >
                          <span className="material-icons mr-2">cancel</span>
                          Cancel Subscription and/or Add-ons
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* License Key Update Dialog */}
          <AlertDialog open={showLicenseDialog} onOpenChange={setShowLicenseDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Update License Key</AlertDialogTitle>
                <AlertDialogDescription>
                  Enter your new license key from the marketplace. This is required after upgrading your tier.
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
    </div>
  );
}
