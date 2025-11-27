import { useState } from "react";
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

interface GiftAddonsForm {
  extraSeats: number;
  extraProjects: number;
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
    extraProjects: 0,
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
      setAddonsForm({ extraSeats: 0, extraProjects: 0, whiteLabel: false });
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

  // ProtectedRoute handles auth - but we still need to prevent render before data loads
  if (userData?.user?.role !== 'superuser') {
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
                {company.subscriptionStatus === 'active' || company.subscriptionStatus === 'trialing' ? (
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
          <Button 
            onClick={() => setGiftAddonsDialogOpen(true)}
            data-testid="button-gift-addons"
          >
            <span className="material-icons mr-2">card_giftcard</span>
            Gift Add-ons
          </Button>
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
                <p className="text-sm">{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}</p>
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
                  <p className="text-sm font-medium capitalize">{company.subscriptionTier || 'None'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <p className="text-sm capitalize">{company.subscriptionStatus || 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Next Payment / Trial End</p>
                  <p className="text-sm">{company.subscriptionEndDate ? new Date(company.subscriptionEndDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Add-ons</p>
                  <div className="flex flex-wrap gap-1">
                    {(company.additionalSeatsCount > 0 || company.additionalProjectsCount > 0 || company.whitelabelBrandingActive) ? (
                      <>
                        {company.additionalSeatsCount > 0 && (
                          <Badge variant="secondary" className="text-xs">+{company.additionalSeatsCount} Seats</Badge>
                        )}
                        {company.additionalProjectsCount > 0 && (
                          <Badge variant="secondary" className="text-xs">+{company.additionalProjectsCount} Projects</Badge>
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
                <span className="material-icons text-6xl text-muted-foreground mb-4">dashboard</span>
                <h3 className="text-xl font-semibold mb-2">Company Dashboard</h3>
                <p className="text-muted-foreground">
                  View the company's dashboard as they see it
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardContent className="p-12 text-center">
                <span className="material-icons text-6xl text-muted-foreground mb-4">analytics</span>
                <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                <p className="text-muted-foreground">
                  Company analytics and metrics will be displayed here
                </p>
              </CardContent>
            </Card>
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
                {company.additionalProjectsCount > 0 && (
                  <Badge variant="secondary">+{company.additionalProjectsCount} Projects</Badge>
                )}
                {company.whitelabelBrandingActive && (
                  <Badge variant="secondary">White Label Active</Badge>
                )}
                {!company.additionalSeatsCount && !company.additionalProjectsCount && !company.whitelabelBrandingActive && (
                  <p className="text-sm text-muted-foreground">No add-ons</p>
                )}
              </div>
            </div>

            {/* Extra Seats */}
            <div className="space-y-2">
              <Label htmlFor="extraSeats">Extra Seat Packs (2 seats each)</Label>
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
                {addonsForm.extraSeats > 0 ? `Will add ${addonsForm.extraSeats * 2} seats` : 'Enter number of seat packs to gift'}
              </p>
            </div>

            {/* Extra Projects */}
            <div className="space-y-2">
              <Label htmlFor="extraProjects">Extra Projects</Label>
              <Input
                id="extraProjects"
                type="number"
                min={0}
                max={100}
                value={addonsForm.extraProjects}
                onChange={(e) => setAddonsForm(prev => ({ ...prev, extraProjects: parseInt(e.target.value) || 0 }))}
                data-testid="input-extra-projects"
              />
              <p className="text-xs text-muted-foreground">
                {addonsForm.extraProjects > 0 ? `Will add ${addonsForm.extraProjects} project slots` : 'Enter number of extra projects to gift'}
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
                setAddonsForm({ extraSeats: 0, extraProjects: 0, whiteLabel: false });
                setGiftAddonsDialogOpen(false);
              }}
              data-testid="button-cancel-gift"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => giftAddonsMutation.mutate(addonsForm)}
              disabled={giftAddonsMutation.isPending || (!addonsForm.extraSeats && !addonsForm.extraProjects && !addonsForm.whiteLabel)}
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
