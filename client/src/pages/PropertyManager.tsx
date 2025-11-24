import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, Mail, Phone, LogOut, Settings, FileText, Download, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePropertyManagerAccountSchema, type UpdatePropertyManagerAccount } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type VendorSummary = {
  linkId: string;
  id: string;
  companyName: string;
  email: string;
  phone: string | null;
  logo: string | null;
  activeProjectsCount: number;
  residentCode: string | null;
  propertyManagerCode: string | null;
  strataNumber: string | null;
};

export default function PropertyManager() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [addCodeOpen, setAddCodeOpen] = useState(false);
  const [companyCode, setCompanyCode] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<VendorSummary | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [strataNumber, setStrataNumber] = useState("");
  
  const accountForm = useForm<UpdatePropertyManagerAccount>({
    resolver: zodResolver(updatePropertyManagerAccountSchema),
    defaultValues: {
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const { data: vendorsData, isLoading } = useQuery<{ vendors: VendorSummary[] }>({
    queryKey: ["/api/property-managers/me/vendors"],
  });

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      
      // Clear ALL query cache to prevent stale data from causing redirect issues
      queryClient.clear();
      
      // Navigate to login page
      setLocation("/login");
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addVendorMutation = useMutation({
    mutationFn: async (code: string) => {
      return await apiRequest("POST", "/api/property-managers/vendors", { companyCode: code });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/property-managers/me/vendors"] });
      toast({
        title: "Vendor Added",
        description: "The company has been successfully added to your vendors list.",
      });
      setCompanyCode("");
      setAddCodeOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Vendor",
        description: error.message || "Invalid company code. Please check with the rope access company.",
        variant: "destructive",
      });
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: async (data: UpdatePropertyManagerAccount) => {
      return await apiRequest("PATCH", "/api/property-managers/me/account", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Account Updated",
        description: "Your account settings have been successfully updated.",
      });
      accountForm.reset();
      setSettingsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update account settings.",
        variant: "destructive",
      });
    },
  });

  const updateStrataMutation = useMutation({
    mutationFn: async ({ linkId, strataNumber }: { linkId: string; strataNumber: string }) => {
      return await apiRequest("PATCH", `/api/property-managers/vendors/${linkId}`, { strataNumber });
    },
    onSuccess: async (data: any) => {
      // Invalidate and refetch vendors list
      await queryClient.invalidateQueries({ queryKey: ["/api/property-managers/me/vendors"] });
      
      // Update selectedVendor with the new strata number from the response
      if (selectedVendor && data?.link) {
        setSelectedVendor({
          ...selectedVendor,
          strataNumber: data.link.strataNumber,
        });
      }
      
      toast({
        title: "Strata Number Updated",
        description: "The strata number has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update strata number.",
        variant: "destructive",
      });
    },
  });

  const { data: projectsData, isLoading: isLoadingProjects, error: projectsError } = useQuery({
    queryKey: ["/api/property-managers/vendors", selectedVendor?.linkId, "projects"],
    queryFn: async () => {
      const response = await fetch(`/api/property-managers/vendors/${selectedVendor!.linkId}/projects`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch projects');
      }
      return data;
    },
    enabled: !!selectedVendor?.linkId && !!selectedVendor?.strataNumber,
    retry: false,
  });

  const { data: projectDetailsData, isLoading: isLoadingProjectDetails, error: projectDetailsError } = useQuery({
    queryKey: ["/api/property-managers/vendors", selectedVendor?.linkId, "projects", selectedProject?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/property-managers/vendors/${selectedVendor!.linkId}/projects/${selectedProject!.id}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch project details');
      }
      return data;
    },
    enabled: !!selectedVendor?.linkId && !!selectedProject?.id,
    retry: false,
  });

  // SECURITY: Clear selectedProject if details fetch fails to prevent showing stale data
  useEffect(() => {
    if (projectDetailsError) {
      toast({
        title: "Unable to Load Project Details",
        description: (projectDetailsError as Error).message || "Please try again.",
        variant: "destructive",
      });
      // Close dialog and clear selection to prevent stale data display
      setSelectedProject(null);
    }
  }, [projectDetailsError, toast]);

  useEffect(() => {
    // Only show toast once when error first appears
    if (projectsError) {
      const errorMessage = (projectsError as Error).message;
      // Don't show toast for "strata required" errors - those are handled in UI
      if (!errorMessage?.includes('Strata number required')) {
        toast({
          title: "Failed to Load Projects",
          description: errorMessage || "Unable to load projects. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [projectsError]);

  useEffect(() => {
    if (selectedVendor) {
      setStrataNumber(selectedVendor.strataNumber || "");
    }
  }, [selectedVendor]);

  const handleSaveStrata = () => {
    if (!selectedVendor) return;
    updateStrataMutation.mutate({ 
      linkId: selectedVendor.linkId, 
      strataNumber: strataNumber.trim() 
    });
  };

  const handleAddVendor = () => {
    if (companyCode.trim().length !== 10) {
      toast({
        title: "Invalid Code",
        description: "Company code must be exactly 10 characters.",
        variant: "destructive",
      });
      return;
    }
    addVendorMutation.mutate(companyCode.trim());
  };

  const onSubmitAccountSettings = (data: UpdatePropertyManagerAccount) => {
    // Filter out empty values
    const updateData: Partial<UpdatePropertyManagerAccount> = {};
    if (data.name && data.name !== userData?.user?.name) {
      updateData.name = data.name;
    }
    if (data.email && data.email !== userData?.user?.email) {
      updateData.email = data.email;
    }
    if (data.newPassword) {
      updateData.currentPassword = data.currentPassword;
      updateData.newPassword = data.newPassword;
    }

    if (Object.keys(updateData).length === 0) {
      toast({
        title: "No Changes",
        description: "No changes were made to your account.",
      });
      return;
    }

    updateAccountMutation.mutate(updateData as UpdatePropertyManagerAccount);
  };

  const vendors = vendorsData?.vendors || [];

  return (
    <div className="h-screen overflow-y-auto bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">My Vendors</h1>
            <p className="text-muted-foreground" data-testid="text-page-description">
              Manage your connected rope access companies and view their information
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                accountForm.reset({
                  name: userData?.user?.name || "",
                  email: userData?.user?.email || "",
                  currentPassword: "",
                  newPassword: "",
                });
                setSettingsOpen(true);
              }}
              data-testid="button-account-settings"
            >
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>

        <Card className="mb-6" data-testid="card-my-vendors">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-4">
            <div>
              <CardTitle data-testid="text-vendors-title">Connected Vendors</CardTitle>
              <CardDescription data-testid="text-vendors-description">
                {vendors.length === 0 
                  ? "No vendors connected yet. Add a company code to get started." 
                  : `You have access to ${vendors.length} rope access ${vendors.length === 1 ? 'company' : 'companies'}`}
              </CardDescription>
            </div>
            <Button 
              onClick={() => setAddCodeOpen(true)}
              data-testid="button-add-vendor"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="text-loading">
                Loading vendors...
              </div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2" data-testid="text-no-vendors">No Vendors Yet</p>
                <p className="text-sm text-muted-foreground mb-4" data-testid="text-no-vendors-description">
                  Request a company code from your rope access company and add it above
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendors.map((vendor) => (
                  <Card 
                    key={vendor.id} 
                    className="hover-elevate cursor-pointer"
                    onClick={() => setSelectedVendor(vendor)}
                    data-testid={`card-vendor-${vendor.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={vendor.logo || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {vendor.companyName ? vendor.companyName.substring(0, 2).toUpperCase() : "RA"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1 truncate" data-testid={`text-vendor-name-${vendor.id}`}>
                            {vendor.companyName}
                          </h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate" data-testid={`text-vendor-email-${vendor.id}`}>
                                {vendor.email}
                              </span>
                            </div>
                            {vendor.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                <span data-testid={`text-vendor-phone-${vendor.id}`}>{vendor.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={addCodeOpen} onOpenChange={setAddCodeOpen}>
          <DialogContent data-testid="dialog-add-vendor">
            <DialogHeader>
              <DialogTitle data-testid="text-dialog-title">Add Vendor Company</DialogTitle>
              <DialogDescription data-testid="text-dialog-description">
                Enter the 10-character company code provided by your rope access company
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="companyCode">Company Code</Label>
                <Input
                  id="companyCode"
                  placeholder="Enter 10-character code"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                  maxLength={10}
                  data-testid="input-company-code"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAddCodeOpen(false);
                    setCompanyCode("");
                  }}
                  data-testid="button-cancel-add-vendor"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddVendor}
                  disabled={companyCode.trim().length !== 10 || addVendorMutation.isPending}
                  data-testid="button-submit-add-vendor"
                >
                  {addVendorMutation.isPending ? "Adding..." : "Add Vendor"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={selectedVendor !== null} onOpenChange={(open) => {
          if (!open) {
            // Clear projects query cache when closing dialog to prevent stale errors
            if (selectedVendor?.linkId) {
              queryClient.removeQueries({ 
                queryKey: ["/api/property-managers/vendors", selectedVendor.linkId, "projects"] 
              });
            }
            setSelectedVendor(null);
          }
        }}>
          <DialogContent className="max-w-2xl" data-testid="dialog-vendor-details">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3" data-testid="text-vendor-details-title">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedVendor?.logo || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {selectedVendor?.companyName ? selectedVendor.companyName.substring(0, 2).toUpperCase() : "RA"}
                  </AvatarFallback>
                </Avatar>
                {selectedVendor?.companyName}
              </DialogTitle>
              <DialogDescription data-testid="text-vendor-details-description">
                Vendor company information
              </DialogDescription>
            </DialogHeader>
            {selectedVendor && (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Company Email</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span data-testid="text-vendor-detail-email">{selectedVendor.email}</span>
                    </div>
                  </div>
                  {selectedVendor.phone && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone Number</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span data-testid="text-vendor-detail-phone">{selectedVendor.phone}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedVendor.residentCode && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Resident Access Code</Label>
                      <div className="font-mono text-sm bg-muted px-3 py-2 rounded-md mt-1" data-testid="text-vendor-detail-resident-code">
                        {selectedVendor.residentCode}
                      </div>
                    </div>
                  )}
                  {selectedVendor.propertyManagerCode && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Property Manager Code</Label>
                      <div className="font-mono text-sm bg-muted px-3 py-2 rounded-md mt-1" data-testid="text-vendor-detail-pm-code">
                        {selectedVendor.propertyManagerCode}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <Label className="text-sm font-medium">Strata/Building Number (Required)</Label>
                  <p className="text-xs text-muted-foreground">
                    Enter your strata/building number to access projects for your building. This field is required.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., LMS1234 or EPS 1234"
                      value={strataNumber}
                      onChange={(e) => setStrataNumber(e.target.value)}
                      maxLength={100}
                      data-testid="input-strata-number"
                    />
                    <Button
                      onClick={handleSaveStrata}
                      disabled={updateStrataMutation.isPending || !strataNumber.trim()}
                      data-testid="button-save-strata"
                    >
                      {updateStrataMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                  {!strataNumber.trim() && (
                    <p className="text-xs text-destructive">
                      Strata number cannot be empty
                    </p>
                  )}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <Label className="text-sm font-medium">Projects for Your Building</Label>
                  {!selectedVendor.strataNumber ? (
                    <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md" data-testid="text-strata-required">
                      <strong>Strata number required:</strong> Please enter and save your strata/building number above to view projects for your building.
                    </div>
                  ) : projectsError ? (
                    <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md" data-testid="text-projects-error">
                      <strong>Unable to load projects:</strong> {(projectsError as Error).message || "Please try again or contact support."}
                    </div>
                  ) : isLoadingProjects ? (
                    <div className="text-sm text-muted-foreground" data-testid="text-loading-projects">
                      Loading projects...
                    </div>
                  ) : projectsData?.projects && projectsData.projects.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {(() => {
                        const activeProjects = projectsData.projects.filter((p: any) => p.status === 'active');
                        const completedProjects = projectsData.projects.filter((p: any) => p.status === 'completed');
                        
                        return (
                          <>
                            {activeProjects.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-blue-500" />
                                  <h4 className="text-sm font-medium">Active Projects ({activeProjects.length})</h4>
                                </div>
                                <div className="space-y-2">
                                  {activeProjects.map((project: any) => (
                                    <Card 
                                      key={project.id} 
                                      className="hover-elevate cursor-pointer active-elevate-2" 
                                      onClick={() => setSelectedProject(project)}
                                      data-testid={`card-project-${project.id}`}
                                    >
                                      <CardContent className="p-3">
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="space-y-1 flex-1">
                                            <div className="font-medium" data-testid={`text-project-name-${project.id}`}>
                                              {project.buildingName || project.projectName || 'Unnamed Project'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {project.jobType?.replace(/_/g, ' ')}
                                            </div>
                                          </div>
                                          <Badge variant="default" className="text-xs">
                                            Active
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {completedProjects.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  <h4 className="text-sm font-medium">Completed Projects ({completedProjects.length})</h4>
                                </div>
                                <div className="space-y-2">
                                  {completedProjects.map((project: any) => (
                                    <Card 
                                      key={project.id} 
                                      className="hover-elevate cursor-pointer active-elevate-2" 
                                      onClick={() => setSelectedProject(project)}
                                      data-testid={`card-project-${project.id}`}
                                    >
                                      <CardContent className="p-3">
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="space-y-1 flex-1">
                                            <div className="font-medium" data-testid={`text-project-name-${project.id}`}>
                                              {project.buildingName || project.projectName || 'Unnamed Project'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {project.jobType?.replace(/_/g, ' ')}
                                            </div>
                                          </div>
                                          <Badge variant="secondary" className="text-xs">
                                            Completed
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground" data-testid="text-no-projects">
                      No projects found for strata number "{selectedVendor.strataNumber}". Please verify your strata number is correct.
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVendor(null)}
                    data-testid="button-close-vendor-details"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className="max-w-2xl" data-testid="dialog-account-settings">
            <DialogHeader>
              <DialogTitle data-testid="text-settings-title">Account Settings</DialogTitle>
              <DialogDescription data-testid="text-settings-description">
                Update your account information and password
              </DialogDescription>
            </DialogHeader>
            <Form {...accountForm}>
              <form onSubmit={accountForm.handleSubmit(onSubmitAccountSettings)} className="space-y-4 pt-4">
                <FormField
                  control={accountForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your full name"
                          {...field}
                          data-testid="input-account-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                          data-testid="input-account-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-4">Change Password (Optional)</h4>
                  <div className="space-y-4">
                    <FormField
                      control={accountForm.control}
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
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={accountForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter new password (min 6 characters)"
                              {...field}
                              data-testid="input-new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSettingsOpen(false);
                      accountForm.reset();
                    }}
                    data-testid="button-cancel-settings"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateAccountMutation.isPending}
                    data-testid="button-save-settings"
                  >
                    {updateAccountMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={selectedProject !== null} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-project-details">
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2" data-testid="text-project-details-title">
                    <Building2 className="w-5 h-5" />
                    {selectedProject.buildingName || selectedProject.projectName || 'Project Details'}
                  </DialogTitle>
                  <DialogDescription data-testid="text-project-details-description">
                    View project information, progress, and complaint history
                  </DialogDescription>
                </DialogHeader>

                {isLoadingProjectDetails ? (
                  <div className="text-sm text-muted-foreground text-center py-8" data-testid="text-loading-details">
                    Loading project details...
                  </div>
                ) : projectDetailsData ? (
                  <div className="space-y-4 pt-4">
                    {/* Project Info */}
                    <Card data-testid="card-project-info">
                      <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-lg">Project Information</CardTitle>
                          <Badge variant={projectDetailsData.project.status === 'active' ? 'default' : 'secondary'}>
                            {projectDetailsData.project.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <Label className="text-xs text-muted-foreground">Job Type</Label>
                            <p className="font-medium capitalize">{projectDetailsData.project.jobType?.replace(/_/g, ' ')}</p>
                          </div>
                          {projectDetailsData.project.startDate && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Start Date</Label>
                              <p className="font-medium">{new Date(projectDetailsData.project.startDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {projectDetailsData.project.endDate && (
                            <div>
                              <Label className="text-xs text-muted-foreground">End Date</Label>
                              <p className="font-medium">{new Date(projectDetailsData.project.endDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {projectDetailsData.project.buildingAddress && (
                            <div className="col-span-2">
                              <Label className="text-xs text-muted-foreground">Address</Label>
                              <p className="font-medium">{projectDetailsData.project.buildingAddress}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Rope Access Plan */}
                    {projectDetailsData.project.ropeAccessPlanUrl && (
                      <Card data-testid="card-rope-access-plan">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Rope Access Plan
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(projectDetailsData.project.ropeAccessPlanUrl, '_blank')}
                            data-testid="button-download-rope-access-plan"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            View/Download Rope Access Plan
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {/* Complaints History */}
                    <Card data-testid="card-complaints-history">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Complaints History
                          {projectDetailsData.complaints.length > 0 && (
                            <Badge variant="secondary">{projectDetailsData.complaints.length}</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {projectDetailsData.complaints.length === 0 ? (
                          <div className="text-sm text-muted-foreground text-center py-4" data-testid="text-no-complaints">
                            No complaints recorded for this project
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {projectDetailsData.complaints.map((complaint: any) => (
                              <Card key={complaint.id} className="bg-muted/50" data-testid={`card-complaint-${complaint.id}`}>
                                <CardContent className="p-3">
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">{complaint.subject || 'No Subject'}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {new Date(complaint.createdAt).toLocaleDateString()} at{' '}
                                          {new Date(complaint.createdAt).toLocaleTimeString()}
                                        </p>
                                      </div>
                                      <Badge variant={complaint.status === 'resolved' ? 'default' : 'secondary'} className="text-xs">
                                        {complaint.status}
                                      </Badge>
                                    </div>
                                    {complaint.description && (
                                      <div className="text-sm text-muted-foreground">
                                        {complaint.description}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedProject(null)}
                        data-testid="button-close-project-details"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-8" data-testid="text-error-loading-details">
                    Failed to load project details
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
