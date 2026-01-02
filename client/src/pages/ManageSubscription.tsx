import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSetHeaderConfig } from "@/components/DashboardLayout";
import { 
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
import { formatTimestampDate } from "@/lib/dateUtils";
import { RemoveSeatsDialog } from "@/components/RemoveSeatsDialog";
import { PRICING, VOLUME_DISCOUNT_THRESHOLD } from "@shared/stripe-config";

type TierName = 'basic' | 'starter' | 'premium' | 'enterprise';

interface SubscriptionDetails {
  tier: TierName;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  whitelabelBrandingActive?: boolean;
  additionalSeatsCount: number;
  giftedSeatsCount: number;
    currency: 'usd' | 'cad';
}

const TIER_NAMES: Record<string, string> = {
  basic: 'OnRopePro',
  starter: 'OnRopePro',
  premium: 'OnRopePro',
  enterprise: 'OnRopePro',
};

const TIER_PRICES: Record<string, { usd: number; cad: number }> = {
  basic: { usd: 99, cad: 99 },
  starter: { usd: 99, cad: 99 },
  premium: { usd: 99, cad: 99 },
  enterprise: { usd: 99, cad: 99 },
};

const TIER_LIMITS: Record<string, { projects: number; seats: number }> = {
  basic: { projects: Infinity, seats: 0 },
  starter: { projects: Infinity, seats: 0 },
  premium: { projects: Infinity, seats: 0 },
  enterprise: { projects: Infinity, seats: 0 },
};

export default function ManageSubscription() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [cancelTarget, setCancelTarget] = useState<'subscription' | 'whitelabel' | 'seats' | null>(null);
  const [cancelSeatPackNumber, setCancelSeatPackNumber] = useState<number>(0);
    const [showAddSeatsDialog, setShowAddSeatsDialog] = useState(false);
  const [showRemoveSeatsDialog, setShowRemoveSeatsDialog] = useState(false);
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
        title: t("common.error"),
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
        title: t("common.error"),
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
        title: t("common.error"),
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
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addBrandingMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/stripe/add-branding");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/details"] });
      setShowAddBrandingDialog(false);
      
      // Show different message based on whether it was a free trial activation
      if (data.freeTrialBenefit) {
        toast({
          title: "White Label Branding Activated!",
          description: "Free during your trial period. Billing starts when your trial ends.",
        });
      } else {
        toast({
          title: "White Label Branding Added",
          description: "White label branding has been added to your subscription.",
        });
      }
      
      // Reload page after 1 second to ensure fresh data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error: Error) => {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Set header config for unified dashboard header
  useSetHeaderConfig({
    pageTitle: t('subscription.manageSubscription', 'Manage Subscription'),
    pageDescription: t('subscription.manageDescription', 'View and manage your subscription and add-ons'),
  }, [t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="text-lg font-medium">Loading subscription details...</div>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
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
    );
  }

  const tierName = TIER_NAMES[subscriptionData.tier];
  const tierPrice = TIER_PRICES[subscriptionData.tier][subscriptionData.currency];
  const currencySymbol = subscriptionData.currency === 'usd' ? '$' : 'CA$';
  const renewalDate = formatTimestampDate(subscriptionData.currentPeriodEnd);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
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
                    Unlimited projects, add seats at ${PRICING.seat.monthly}/month each
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Volume discount: ${PRICING.volumeSeat.monthly}/month for {VOLUME_DISCOUNT_THRESHOLD}+ employees
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
              (subscriptionData.giftedSeatsCount || 0) > 0) && (
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

                {/* Extra Seats Summary - Show paid and gifted separately */}
                {(subscriptionData.additionalSeatsCount > 0 || (subscriptionData.giftedSeatsCount || 0) > 0) && (
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Extra Team Seats</h3>
                        <p className="text-sm text-muted-foreground">
                          {subscriptionData.additionalSeatsCount + (subscriptionData.giftedSeatsCount || 0)} total seat{(subscriptionData.additionalSeatsCount + (subscriptionData.giftedSeatsCount || 0)) !== 1 ? 's' : ''}
                          {subscriptionData.additionalSeatsCount > 0 && (subscriptionData.giftedSeatsCount || 0) > 0 && (
                            <span className="block text-xs">
                              ({subscriptionData.additionalSeatsCount} paid + {subscriptionData.giftedSeatsCount} gifted)
                            </span>
                          )}
                          {subscriptionData.additionalSeatsCount === 0 && (subscriptionData.giftedSeatsCount || 0) > 0 && (
                            <span className="block text-xs text-green-600 dark:text-green-400">
                              ({subscriptionData.giftedSeatsCount} gifted - free forever)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {subscriptionData.additionalSeatsCount > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowRemoveSeatsDialog(true)}
                          data-testid="button-remove-seats"
                        >
                          <span className="material-icons text-sm mr-1">person_remove</span>
                          Remove Seats
                        </Button>
                      )}
                      <div className="text-right">
                        {subscriptionData.additionalSeatsCount > 0 ? (
                          <p className="font-medium">{currencySymbol}{(subscriptionData.additionalSeatsCount * 34.95).toFixed(2)}/month</p>
                        ) : (
                          <p className="font-medium text-green-600 dark:text-green-400">Free</p>
                        )}
                      </div>
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

            {/* Extra Seats - Display each seat individually */}
            {subscriptionData.additionalSeatsCount > 0 && (
              <>
                {Array.from({ length: subscriptionData.additionalSeatsCount }).map((_, index) => (
                  <div key={`seat-${index}`}>
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Extra Team Seat {index + 1}</h3>
                          <p className="text-sm text-muted-foreground">
                            {currencySymbol}34.95/month
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



            {!subscriptionData.whitelabelBrandingActive && 
             subscriptionData.additionalSeatsCount === 0 &&
             (subscriptionData.giftedSeatsCount || 0) === 0 &&
              (
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
                  <h4 className="font-medium">Extra Team Seat</h4>
                  <p className="text-sm text-muted-foreground">Add 1 additional seat to your plan</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{currencySymbol}34.95/month</p>
                <p className="text-xs text-muted-foreground">per seat</p>
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
            <DialogTitle>Cancel Extra Team Seat {cancelSeatPackNumber}</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this seat? Seat {cancelSeatPackNumber} will remain active until {renewalDate}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelTarget(null)}
              data-testid="button-cancel-seats-no"
            >
              Keep Seat
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



      {/* Add Extra Seats Dialog */}
      <Dialog open={showAddSeatsDialog} onOpenChange={setShowAddSeatsDialog}>
        <DialogContent data-testid="dialog-add-seats">
          <DialogHeader>
            <DialogTitle>Add Team Seat</DialogTitle>
            <DialogDescription>
              Add 1 additional team seat to your subscription for {currencySymbol}34.95/month.
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



      {/* Add White Label Branding Dialog */}
      <Dialog open={showAddBrandingDialog} onOpenChange={setShowAddBrandingDialog}>
        <DialogContent data-testid="dialog-add-branding">
          <DialogHeader>
            <DialogTitle>Add White Label Branding</DialogTitle>
            <DialogDescription>
              <div className="space-y-3 pt-2">
                <p>Add custom logo and brand colors to your platform for {currencySymbol}49/month.</p>
                <p className="text-xs text-muted-foreground">
                  If you're in your trial period, white label branding is free until your trial ends.
                </p>
              </div>
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
              {addBrandingMutation.isPending ? "Adding..." : "Activate Branding"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Seats Dialog */}
      {subscriptionData && (
        <RemoveSeatsDialog
          open={showRemoveSeatsDialog}
          onOpenChange={setShowRemoveSeatsDialog}
          paidSeats={subscriptionData.additionalSeatsCount}
          giftedSeats={subscriptionData.giftedSeatsCount || 0}
          onRemoveSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
            queryClient.invalidateQueries({ queryKey: ["/api/subscription/details"] });
          }}
        />
      )}
    </div>
  );
}
