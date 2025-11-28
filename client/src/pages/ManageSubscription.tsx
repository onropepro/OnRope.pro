import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  CreditCard, 
  AlertCircle, 
  Crown,
  Palette,
  Calendar,
  XCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TierName = 'basic' | 'starter' | 'premium' | 'enterprise';

interface SubscriptionDetails {
  tier: TierName;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  whitelabelBrandingActive?: boolean;
  additionalSeatsCount: number;
  additionalProjectsCount: number;
  currency: 'usd' | 'cad';
}

const TIER_NAMES = {
  basic: 'Basic',
  starter: 'Starter',
  premium: 'Premium',
  enterprise: 'Enterprise',
};

const TIER_PRICES = {
  basic: { usd: 79, cad: 99 },
  starter: { usd: 299, cad: 399 },
  premium: { usd: 499, cad: 649 },
  enterprise: { usd: 899, cad: 1199 },
};

const TIER_LIMITS = {
  basic: { projects: 2, seats: 4 },
  starter: { projects: 5, seats: 10 },
  premium: { projects: 9, seats: 18 },
  enterprise: { projects: Infinity, seats: Infinity },
};

export default function ManageSubscription() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [cancelTarget, setCancelTarget] = useState<'subscription' | 'whitelabel' | 'seats' | 'projects' | null>(null);
  const [cancelSeatPackNumber, setCancelSeatPackNumber] = useState<number>(0);
  const [cancelProjectNumber, setCancelProjectNumber] = useState<number>(0);
  const [showAddSeatsDialog, setShowAddSeatsDialog] = useState(false);
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [showAddBrandingDialog, setShowAddBrandingDialog] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: subscriptionData, isLoading } = useQuery<SubscriptionDetails>({
    queryKey: ["/api/subscription/details"],
    enabled: !!user,
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/stripe/cancel-subscription");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/details"] });
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will remain active until the end of your current billing period.",
      });
      setCancelTarget(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const cancelWhitelabelMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/stripe/cancel-whitelabel");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/details"] });
      toast({
        title: "White Label Branding Cancelled",
        description: "Your white label branding will remain active until the end of your current billing period.",
      });
      setCancelTarget(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const cancelSeatsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/stripe/remove-addon-seats");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/details"] });
      toast({
        title: "Extra Seats Cancelled",
        description: "Your extra seats have been cancelled and will be removed at the end of your billing period.",
      });
      setCancelTarget(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const cancelProjectsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/stripe/remove-addon-projects");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/details"] });
      toast({
        title: "Extra Projects Cancelled",
        description: "Your extra projects have been cancelled and will be removed at the end of your billing period.",
      });
      setCancelTarget(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addSeatsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/stripe/add-addon-seats");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/details"] });
      toast({
        title: "Extra Seats Added",
        description: "2 additional team seats have been added to your subscription.",
      });
      setShowAddSeatsDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addProjectMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/stripe/add-addon-projects");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/details"] });
      toast({
        title: "Extra Project Added",
        description: "1 additional project has been added to your subscription.",
      });
      setShowAddProjectDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addBrandingMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/stripe/add-whitelabel");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/details"] });
      toast({
        title: "White Label Branding Added",
        description: "White label branding has been added to your subscription.",
      });
      setShowAddBrandingDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading subscription details...</div>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setLocation("/profile")}
            className="mb-6"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">No Active Subscription</h2>
                <p className="text-muted-foreground">You don't have an active subscription.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const tierName = TIER_NAMES[subscriptionData.tier];
  const tierPrice = TIER_PRICES[subscriptionData.tier][subscriptionData.currency];
  const currencySymbol = subscriptionData.currency === 'usd' ? '$' : 'CA$';
  const renewalDate = new Date(subscriptionData.currentPeriodEnd).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/profile")}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-bold">Manage Subscription</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your subscription and add-ons
          </p>
        </div>

        {/* Main Subscription */}
        <Card className="mb-6" data-testid="card-main-subscription">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Current Plan
                </CardTitle>
                <CardDescription>
                  Your active subscription
                </CardDescription>
              </div>
              <Badge variant={subscriptionData.cancelAtPeriodEnd ? "secondary" : "default"}>
                {subscriptionData.cancelAtPeriodEnd ? "Cancelling" : "Active"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Base Subscription */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{tierName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {TIER_LIMITS[subscriptionData.tier].projects === Infinity 
                      ? 'Unlimited projects' 
                      : `${TIER_LIMITS[subscriptionData.tier].projects} projects`}, {TIER_LIMITS[subscriptionData.tier].seats === Infinity 
                      ? 'unlimited seats' 
                      : `${TIER_LIMITS[subscriptionData.tier].seats} seats`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{currencySymbol}{tierPrice}/month</p>
              </div>
            </div>

            {/* Active Add-ons in Current Plan */}
            {(subscriptionData.whitelabelBrandingActive || 
              subscriptionData.additionalSeatsCount > 0 || 
              subscriptionData.additionalProjectsCount > 0) && (
              <>
                <div className="text-sm font-medium text-muted-foreground">Active Add-ons:</div>
                
                {/* White Label Branding */}
                {subscriptionData.whitelabelBrandingActive && (
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Palette className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">White Label Branding</h3>
                        <p className="text-sm text-muted-foreground">
                          Custom logo & brand colors
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{currencySymbol}49/month</p>
                    </div>
                  </div>
                )}

                {/* Extra Seats Summary */}
                {subscriptionData.additionalSeatsCount > 0 && (
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Extra Team Seats</h3>
                        <p className="text-sm text-muted-foreground">
                          {subscriptionData.additionalSeatsCount} pack{subscriptionData.additionalSeatsCount > 1 ? 's' : ''} ({subscriptionData.additionalSeatsCount * 2} seats)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{currencySymbol}{subscriptionData.additionalSeatsCount * 19}/month</p>
                    </div>
                  </div>
                )}

                {/* Extra Projects Summary */}
                {subscriptionData.additionalProjectsCount > 0 && (
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Extra Projects</h3>
                        <p className="text-sm text-muted-foreground">
                          {subscriptionData.additionalProjectsCount} additional project{subscriptionData.additionalProjectsCount > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{currencySymbol}{subscriptionData.additionalProjectsCount * 49}/month</p>
                    </div>
                  </div>
                )}
              </>
            )}

            <Separator />

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                {subscriptionData.cancelAtPeriodEnd ? "Active until" : "Renews on"}: {renewalDate}
              </span>
            </div>

            <Separator />

            {!subscriptionData.cancelAtPeriodEnd && (
              <Button
                variant="outline"
                onClick={() => setCancelTarget('subscription')}
                data-testid="button-cancel-main-subscription"
              >
                Manage Subscription
              </Button>
            )}

            {subscriptionData.cancelAtPeriodEnd && (
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm text-muted-foreground">
                  Your subscription is set to cancel at the end of the current billing period.
                  You can still use all features until {renewalDate}.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Add-ons */}
        <Card data-testid="card-active-addons">
          <CardHeader>
            <CardTitle>Active Add-ons</CardTitle>
            <CardDescription>
              Manage your subscription add-ons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* White Label Branding */}
            {subscriptionData.whitelabelBrandingActive && (
              <>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Palette className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">White Label Branding</h3>
                      <p className="text-sm text-muted-foreground">
                        {currencySymbol}49/month
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCancelTarget('whitelabel')}
                    data-testid="button-cancel-whitelabel"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
                <Separator />
              </>
            )}

            {/* Extra Seats - Display each pack individually */}
            {subscriptionData.additionalSeatsCount > 0 && (
              <>
                {Array.from({ length: subscriptionData.additionalSeatsCount }).map((_, index) => (
                  <div key={`seat-pack-${index}`}>
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Extra Team Seats - Pack {index + 1}</h3>
                          <p className="text-sm text-muted-foreground">
                            2 seats • {currencySymbol}19/month
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCancelSeatPackNumber(index + 1);
                          setCancelTarget('seats');
                        }}
                        data-testid={`button-cancel-seats-${index + 1}`}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                    {index < subscriptionData.additionalSeatsCount - 1 && <Separator />}
                  </div>
                ))}
                <Separator />
              </>
            )}

            {/* Extra Projects - Display each project individually */}
            {subscriptionData.additionalProjectsCount > 0 && (
              <>
                {Array.from({ length: subscriptionData.additionalProjectsCount }).map((_, index) => (
                  <div key={`project-${index}`}>
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Extra Project {index + 1}</h3>
                          <p className="text-sm text-muted-foreground">
                            {currencySymbol}49/month
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCancelProjectNumber(index + 1);
                          setCancelTarget('projects');
                        }}
                        data-testid={`button-cancel-projects-${index + 1}`}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                    {index < subscriptionData.additionalProjectsCount - 1 && <Separator />}
                  </div>
                ))}
                <Separator />
              </>
            )}

            {!subscriptionData.whitelabelBrandingActive && 
             subscriptionData.additionalSeatsCount === 0 &&
             subscriptionData.additionalProjectsCount === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active add-ons</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Add-ons Section */}
        <Card data-testid="card-available-addons">
          <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Available Add-ons
              </CardTitle>
              <CardDescription>Enhance your subscription with optional features</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Extra Team Seats */}
            <button
              onClick={() => setShowAddSeatsDialog(true)}
              className="w-full flex items-center justify-between p-4 border rounded-md hover-elevate active-elevate-2 text-left"
              data-testid="button-add-seats"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Extra Team Seats</h4>
                  <p className="text-sm text-muted-foreground">Add 2 additional seats to your plan</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{currencySymbol}19/month</p>
                <p className="text-xs text-muted-foreground">per pack</p>
              </div>
            </button>

            {/* Extra Project */}
            <button
              onClick={() => setShowAddProjectDialog(true)}
              className="w-full flex items-center justify-between p-4 border rounded-md hover-elevate active-elevate-2 text-left"
              data-testid="button-add-project"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Extra Project</h4>
                  <p className="text-sm text-muted-foreground">Add 1 additional active project</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{currencySymbol}49/month</p>
                <p className="text-xs text-muted-foreground">per project</p>
              </div>
            </button>

            {/* White Label Branding */}
            {!subscriptionData.whitelabelBrandingActive && (
              <button
                onClick={() => setShowAddBrandingDialog(true)}
                className="w-full flex items-center justify-between p-4 border rounded-md hover-elevate active-elevate-2 text-left"
                data-testid="button-add-branding"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Palette className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">White Label Branding</h4>
                    <p className="text-sm text-muted-foreground">Custom logo and brand colors</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{currencySymbol}49/month</p>
                </div>
              </button>
            )}

            <p className="text-sm text-muted-foreground italic">
              Add-ons are billed immediately and prorated for the current billing cycle.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelTarget === 'subscription'} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent data-testid="dialog-cancel-subscription">
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your {tierName} subscription? You'll retain access until {renewalDate}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelTarget(null)}
              data-testid="button-cancel-no"
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelSubscriptionMutation.mutate()}
              disabled={cancelSubscriptionMutation.isPending}
              data-testid="button-cancel-yes"
            >
              {cancelSubscriptionMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel White Label Dialog */}
      <Dialog open={cancelTarget === 'whitelabel'} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent data-testid="dialog-cancel-whitelabel">
          <DialogHeader>
            <DialogTitle>Cancel White Label Branding</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel White Label Branding? Your custom branding will remain active until {renewalDate}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelTarget(null)}
              data-testid="button-cancel-whitelabel-no"
            >
              Keep Add-on
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelWhitelabelMutation.mutate()}
              disabled={cancelWhitelabelMutation.isPending}
              data-testid="button-cancel-whitelabel-yes"
            >
              {cancelWhitelabelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Extra Seats Dialog */}
      <Dialog open={cancelTarget === 'seats'} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent data-testid="dialog-cancel-seats">
          <DialogHeader>
            <DialogTitle>Cancel Extra Team Seats - Pack {cancelSeatPackNumber}</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this seat pack? The 2 seats from Pack {cancelSeatPackNumber} will remain active until {renewalDate}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelTarget(null)}
              data-testid="button-cancel-seats-no"
            >
              Keep Add-on
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelSeatsMutation.mutate()}
              disabled={cancelSeatsMutation.isPending}
              data-testid="button-cancel-seats-yes"
            >
              {cancelSeatsMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Extra Projects Dialog */}
      <Dialog open={cancelTarget === 'projects'} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent data-testid="dialog-cancel-projects">
          <DialogHeader>
            <DialogTitle>Cancel Extra Project {cancelProjectNumber}</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this extra project? Extra Project {cancelProjectNumber} will remain active until {renewalDate}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelTarget(null)}
              data-testid="button-cancel-projects-no"
            >
              Keep Add-on
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelProjectsMutation.mutate()}
              disabled={cancelProjectsMutation.isPending}
              data-testid="button-cancel-projects-yes"
            >
              {cancelProjectsMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Extra Seats Dialog */}
      <Dialog open={showAddSeatsDialog} onOpenChange={setShowAddSeatsDialog}>
        <DialogContent data-testid="dialog-add-seats">
          <DialogHeader>
            <DialogTitle>Add Extra Team Seats</DialogTitle>
            <DialogDescription>
              Add 2 additional team seats to your subscription for {currencySymbol}19/month.
              This will be prorated for your current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddSeatsDialog(false)}
              data-testid="button-add-seats-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={() => addSeatsMutation.mutate()}
              disabled={addSeatsMutation.isPending}
              data-testid="button-add-seats-confirm"
            >
              {addSeatsMutation.isPending ? "Adding..." : "Add Seats"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Extra Project Dialog */}
      <Dialog open={showAddProjectDialog} onOpenChange={setShowAddProjectDialog}>
        <DialogContent data-testid="dialog-add-project">
          <DialogHeader>
            <DialogTitle>Add Extra Project</DialogTitle>
            <DialogDescription>
              Add 1 additional active project to your subscription for {currencySymbol}49/month.
              This will be prorated for your current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddProjectDialog(false)}
              data-testid="button-add-project-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={() => addProjectMutation.mutate()}
              disabled={addProjectMutation.isPending}
              data-testid="button-add-project-confirm"
            >
              {addProjectMutation.isPending ? "Adding..." : "Add Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add White Label Branding Dialog */}
      <Dialog open={showAddBrandingDialog} onOpenChange={setShowAddBrandingDialog}>
        <DialogContent data-testid="dialog-add-branding">
          <DialogHeader>
            <DialogTitle>Add White Label Branding</DialogTitle>
            <DialogDescription>
              Add custom logo and brand colors to your platform for {currencySymbol}49/month.
              This will be prorated for your current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddBrandingDialog(false)}
              data-testid="button-add-branding-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={() => addBrandingMutation.mutate()}
              disabled={addBrandingMutation.isPending}
              data-testid="button-add-branding-confirm"
            >
              {addBrandingMutation.isPending ? "Adding..." : "Add Branding"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
