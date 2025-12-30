import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatTimestampDate } from "@/lib/dateUtils";

interface GiftAddonsForm {
  extraSeats: number;
  whiteLabel: boolean;
}

export default function CompanyDetail() {
  const [, params] = useRoute("/superuser/companies/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const companyId = params?.id;
  
  const [giftAddonsDialogOpen, setGiftAddonsDialogOpen] = useState(false);
  const [addonsForm, setAddonsForm] = useState<GiftAddonsForm>({
    extraSeats: 0,
        whiteLabel: false,
  });

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: companyData, isLoading } = useQuery<{ company: any }>({
    queryKey: ["/api/superuser/companies", companyId],
    enabled: !!companyId,
  });

  // Fetch employee data to show seat usage
  const { data: employeesData } = useQuery({
    queryKey: ["/api/superuser/companies", companyId, "employees"],
    enabled: !!companyId,
  });

  // Fetch company analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery<{ analytics: any }>({
    queryKey: ["/api/superuser/companies", companyId, "analytics"],
    enabled: !!companyId,
  });

  const giftAddonsMutation = useMutation({
    mutationFn: async (data: GiftAddonsForm) => {
      const response = await apiRequest('POST', `/api/superuser/companies/${companyId}/gift-addons`, data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Add-ons Gifted",
        description: data.message,
      });
      // Reset form and close dialog
      setAddonsForm({ extraSeats: 0, whiteLabel: false });
      setGiftAddonsDialogOpen(false);
      // Refresh company data
      queryClient.invalidateQueries({ queryKey: ['/api/superuser/companies', companyId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to gift add-ons",
        variant: "destructive",
      });
    },
  });

  const toggleVerificationMutation = useMutation({
    mutationFn: async (verified: boolean) => {
      const response = await apiRequest('POST', `/api/superuser/companies/${companyId}/toggle-verification`, { verified });
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: data.company?.isPlatformVerified ? "Company Verified" : "Verification Removed",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/superuser/companies', companyId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle verification",
        variant: "destructive",
      });
    },
  });

  // Check if user is superuser or staff with view_companies permission
  const isSuperuser = userData?.user?.role === 'superuser';
  const isStaffWithPermission = userData?.user?.role === 'staff' && 
    userData?.user?.permissions?.includes('view_companies');
  const hasAccess = isSuperuser || isStaffWithPermission;

  // Only redirect after user data has loaded and we know they don't have access
  const isLoadingUser = userData === undefined;
  if (!isLoadingUser && !hasAccess) {
    setLocation('/');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen page-gradient p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Loading company details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const company = companyData?.company;

  if (!company) {
    return (
      <div className="min-h-screen page-gradient p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <span className="material-icons text-6xl text-muted-foreground mb-4">business</span>
              <p className="text-muted-foreground">Company not found</p>
              <Link href="/superuser/companies">
                <Button variant="outline" className="mt-4" data-testid="button-back">
                  <span className="material-icons mr-2">arrow_back</span>
                  Back to Companies
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/superuser/companies">
              <Button variant="outline" data-testid="button-back">
                <span className="material-icons mr-2">arrow_back</span>
                Back
              </Button>
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold gradient-text">{company.companyName || "Unnamed Company"}</h1>
                {company.isPlatformVerified ? (
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20" data-testid="badge-platform-verified">
                    <span className="material-icons text-sm mr-1">verified</span>
                    Platform Verified
                  </Badge>
                ) : company.subscriptionStatus === 'active' || company.subscriptionStatus === 'trialing' ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20" data-testid="badge-verified">
                    <span className="material-icons text-sm mr-1">verified</span>
                    {company.subscriptionStatus === 'trialing' ? 'Trial' : 'Verified'}
                  </Badge>
                ) : (
                  <Badge variant="destructive" data-testid="badge-unverified">
                    <span className="material-icons text-sm mr-1">warning</span>
                    {company.subscriptionStatus === 'canceled' ? 'Canceled' : 'Not Verified'}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-2">
                {company.email || 'No email on file'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isSuperuser && (
              <Button 
                variant={company.isPlatformVerified ? "outline" : "default"}
                onClick={() => toggleVerificationMutation.mutate(!company.isPlatformVerified)}
                disabled={toggleVerificationMutation.isPending}
                data-testid="button-toggle-verification"
              >
                {toggleVerificationMutation.isPending ? (
                  <span className="material-icons animate-spin mr-2">autorenew</span>
                ) : (
                  <span className="material-icons mr-2">{company.isPlatformVerified ? 'remove_done' : 'verified'}</span>
                )}
                {company.isPlatformVerified ? 'Remove Verification' : 'Verify & Grant Free Access'}
              </Button>
            )}
            <Button 
              onClick={() => setGiftAddonsDialogOpen(true)}
              data-testid="button-gift-addons"
            >
              <span className="material-icons mr-2">card_giftcard</span>
              Gift Add-ons
            </Button>
          </div>
        </div>

        {/* Company Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Company ID</p>
                <p className="font-mono text-xs">{company.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Registration Date</p>
                <p className="text-sm">{company.createdAt ? formatTimestampDate(company.createdAt) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">License Key</p>
                <p className="font-mono text-xs">{company.licenseKey || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="text-sm">{company.streetAddress || 'N/A'}{company.province ? `, ${company.province}` : ''}</p>
              </div>
            </div>
            
            {/* Subscription Details */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold mb-4">Subscription Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Subscription Tier</p>
                  <p className="text-sm font-medium capitalize">OnRopePro</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <p className="text-sm capitalize">{company.subscriptionStatus || 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Next Payment / Trial End</p>
                  <p className="text-sm">{company.subscriptionEndDate ? formatTimestampDate(company.subscriptionEndDate) : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Add-ons</p>
                  <div className="flex flex-wrap gap-1">
                    {(company.additionalSeatsCount > 0 || company.whitelabelBrandingActive) ? (
                      <>
                        {company.additionalSeatsCount > 0 && (
                          <Badge variant="secondary" className="text-xs">+{company.additionalSeatsCount} Seats</Badge>
                        )}
                        {company.whitelabelBrandingActive && (
                          <Badge variant="secondary" className="text-xs">White Label</Badge>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">None</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Seat Usage Information */}
            {employeesData?.seatInfo && employeesData.seatInfo.tier > 0 && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Employee Seats</p>
                    <p className="text-lg font-semibold" data-testid="text-seat-usage">
                      {employeesData.seatInfo.seatsUsed} of {employeesData.seatInfo.seatLimit === -1 ? '∞' : employeesData.seatInfo.seatLimit} seats used
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {employeesData.seatInfo.seatLimit === -1 
                        ? 'Unlimited employee seats'
                        : employeesData.seatInfo.seatsAvailable > 0 
                          ? `${employeesData.seatInfo.seatsAvailable} seat${employeesData.seatInfo.seatsAvailable === 1 ? '' : 's'} remaining`
                          : 'At seat limit'
                      }
                    </p>
                  </div>
                  <Badge 
                    variant={employeesData.seatInfo.atSeatLimit ? "destructive" : "secondary"}
                    data-testid="badge-tier"
                  >
                    Tier {employeesData.seatInfo.tier}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" data-testid="tab-company-dashboard">
              <span className="material-icons text-sm mr-2">dashboard</span>
              View Company Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              <span className="material-icons text-sm mr-2">analytics</span>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="overall" data-testid="tab-overall">
              <span className="material-icons text-sm mr-2">assessment</span>
              Overall
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card>
              <CardContent className="p-12 text-center">
                <span className="material-icons text-6xl text-primary/60 mb-4">visibility</span>
                <h3 className="text-xl font-semibold mb-2">View as Company</h3>
                <p className="text-muted-foreground mb-6">
                  See exactly what {company.companyName || 'this company'} sees on their dashboard in read-only mode
                </p>
                <Button 
                  onClick={() => setLocation(`/superuser/view-as/${company.id}`)}
                  size="lg"
                  data-testid="button-view-as-company"
                >
                  <span className="material-icons mr-2">visibility</span>
                  Enter View Mode
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            {analyticsLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <span className="material-icons animate-spin text-4xl text-muted-foreground">autorenew</span>
                  <p className="text-muted-foreground mt-4">Loading analytics...</p>
                </CardContent>
              </Card>
            ) : analyticsData?.analytics ? (
              <div className="space-y-6">
                {/* Projects Analytics */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-icons text-primary">folder</span>
                      <h3 className="font-semibold">Projects</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold">{analyticsData.analytics.projects.total}</p>
                        <p className="text-xs text-muted-foreground">Total Projects</p>
                      </div>
                      <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{analyticsData.analytics.projects.active}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                      <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analyticsData.analytics.projects.completed}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{analyticsData.analytics.projects.pending}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Employees & Clients */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="material-icons text-primary">group</span>
                        <h3 className="font-semibold">Employees</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold">{analyticsData.analytics.employees.total}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{analyticsData.analytics.employees.active}</p>
                          <p className="text-xs text-muted-foreground">Active</p>
                        </div>
                        <div className="text-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{analyticsData.analytics.employees.terminated}</p>
                          <p className="text-xs text-muted-foreground">Terminated</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="material-icons text-primary">business</span>
                        <h3 className="font-semibold">Clients</h3>
                      </div>
                      <div className="text-center p-6 bg-muted/50 rounded-lg">
                        <p className="text-4xl font-bold">{analyticsData.analytics.clients.total}</p>
                        <p className="text-sm text-muted-foreground">Total Clients</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quotes Analytics */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-icons text-primary">request_quote</span>
                      <h3 className="font-semibold">Quotes</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold">{analyticsData.analytics.quotes.total}</p>
                        <p className="text-xs text-muted-foreground">Total Quotes</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold">${analyticsData.analytics.quotes.totalValue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Value</p>
                      </div>
                      <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{analyticsData.analytics.quotes.accepted}</p>
                        <p className="text-xs text-muted-foreground">Accepted</p>
                      </div>
                      <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">${analyticsData.analytics.quotes.acceptedValue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Accepted Value</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{analyticsData.analytics.quotes.pending}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Work Sessions */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-icons text-primary">schedule</span>
                      <h3 className="font-semibold">Work Sessions</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold">{analyticsData.analytics.workSessions.total}</p>
                        <p className="text-xs text-muted-foreground">Total Sessions</p>
                      </div>
                      <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analyticsData.analytics.workSessions.completed}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                      <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{analyticsData.analytics.workSessions.billableHours.toFixed(1)}h</p>
                        <p className="text-xs text-muted-foreground">Billable Hours</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold">{analyticsData.analytics.workSessions.nonBillableHours.toFixed(1)}h</p>
                        <p className="text-xs text-muted-foreground">Non-Billable Hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Safety Stats */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-icons text-primary">health_and_safety</span>
                      <h3 className="font-semibold">Safety Compliance</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold">{analyticsData.analytics.safety.harnessInspections}</p>
                        <p className="text-xs text-muted-foreground">Harness Inspections</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold">{analyticsData.analytics.safety.toolboxMeetings}</p>
                        <p className="text-xs text-muted-foreground">Toolbox Meetings</p>
                      </div>
                      <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analyticsData.analytics.safety.recentInspections}</p>
                        <p className="text-xs text-muted-foreground">Inspections (30 days)</p>
                      </div>
                      <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analyticsData.analytics.safety.recentMeetings}</p>
                        <p className="text-xs text-muted-foreground">Meetings (30 days)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <span className="material-icons text-6xl text-muted-foreground mb-4">analytics</span>
                  <h3 className="text-xl font-semibold mb-2">No Analytics Data</h3>
                  <p className="text-muted-foreground">
                    Unable to load analytics for this company
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="overall">
            <Card>
              <CardContent className="p-12 text-center">
                <span className="material-icons text-6xl text-muted-foreground mb-4">assessment</span>
                <h3 className="text-xl font-semibold mb-2">Overall</h3>
                <p className="text-muted-foreground">
                  Overall company information and statistics will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Gift Add-ons Dialog */}
      <Dialog open={giftAddonsDialogOpen} onOpenChange={setGiftAddonsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-xl">card_giftcard</span>
              Gift Add-ons
            </DialogTitle>
            <DialogDescription>
              Gift free add-ons to {company.companyName || "this company"}. These add-ons will be added to their existing add-ons.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Current Add-ons Display */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <p className="text-sm font-medium">Current Add-ons</p>
              <div className="flex flex-wrap gap-2">
                {company.additionalSeatsCount > 0 && (
                  <Badge variant="secondary">+{company.additionalSeatsCount} Seats</Badge>
                )}
                {company.whitelabelBrandingActive && (
                  <Badge variant="secondary">White Label Active</Badge>
                )}
                {!company.additionalSeatsCount && !company.whitelabelBrandingActive && (
                  <p className="text-sm text-muted-foreground">No add-ons</p>
                )}
              </div>
            </div>

            {/* Extra Seats */}
            <div className="space-y-2">
              <Label htmlFor="extraSeats">Extra Seats</Label>
              <Input
                id="extraSeats"
                type="number"
                min={0}
                max={50}
                value={addonsForm.extraSeats}
                onChange={(e) => setAddonsForm(prev => ({ ...prev, extraSeats: parseInt(e.target.value) || 0 }))}
                data-testid="input-extra-seats"
              />
              <p className="text-xs text-muted-foreground">
                {addonsForm.extraSeats > 0 ? `Will add ${addonsForm.extraSeats} seat${addonsForm.extraSeats > 1 ? 's' : ''}` : 'Enter number of seats to gift'}
              </p>
            </div>

            {/* White Label Branding */}
            <div className="flex items-center space-x-3 p-3 rounded-lg border">
              <Checkbox
                id="whiteLabel"
                checked={addonsForm.whiteLabel}
                onCheckedChange={(checked) => setAddonsForm(prev => ({ ...prev, whiteLabel: checked === true }))}
                disabled={company.whitelabelBrandingActive}
                data-testid="checkbox-white-label"
              />
              <div className="flex-1">
                <Label htmlFor="whiteLabel" className="cursor-pointer">
                  White Label Branding
                </Label>
                <p className="text-xs text-muted-foreground">
                  {company.whitelabelBrandingActive 
                    ? 'Already active for this company' 
                    : 'Enable custom branding for this company'}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setAddonsForm({ extraSeats: 0, whiteLabel: false });
                setGiftAddonsDialogOpen(false);
              }}
              data-testid="button-cancel-gift"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => giftAddonsMutation.mutate(addonsForm)}
              disabled={giftAddonsMutation.isPending || (!addonsForm.extraSeats && !addonsForm.whiteLabel)}
              data-testid="button-confirm-gift"
            >
              {giftAddonsMutation.isPending ? (
                <>
                  <span className="material-icons animate-spin mr-2 text-sm">refresh</span>
                  Gifting...
                </>
              ) : (
                <>
                  <span className="material-icons mr-2 text-sm">card_giftcard</span>
                  Gift Add-ons
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
