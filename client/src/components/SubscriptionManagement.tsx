import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatTimestampDate } from "@/lib/dateUtils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { trackCheckoutStart, trackAddOnPurchase } from "@/lib/analytics";
import { PurchaseSeatsDialog } from "@/components/PurchaseSeatsDialog";
import { 
  CreditCard, 
  Check, 
  AlertCircle, 
  Crown,
  Users,
  Briefcase,
  Palette,
  DollarSign,
  Calendar
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TierName = 'basic';

interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  subscriptionId?: string;
  currentTier?: TierName;
  status?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

const TIER_INFO = {
  basic: {
    name: 'OnRopePro',
    price: 99,
    projects: -1,
    seats: 0,
    color: 'bg-primary',
    icon: Briefcase,
    features: [
      'Unlimited projects',
      'Add seats at $34.95/month each',
      'Employee management',
      'Advanced scheduling',
      'GPS time tracking',
      'Safety forms & compliance',
      'CRM & quotes suite',
      'Advanced analytics & reports',
      'Resident portal',
      'Inventory tracking',
      'Priority support',
    ]
  },
};

export function SubscriptionManagement() {
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<TierName | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [pendingUpgradeTier, setPendingUpgradeTier] = useState<TierName | null>(null);
  const [showAddSeatsDialog, setShowAddSeatsDialog] = useState(false);
  const [showAddBrandingDialog, setShowAddBrandingDialog] = useState(false);

  // Fetch current subscription status
  const { data: subStatus, isLoading } = useQuery<SubscriptionStatus>({
    queryKey: ['/api/stripe/subscription-status'],
  });

  // Fetch subscription details including add-ons
  const { data: subDetails } = useQuery<{
    tier: string;
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    whitelabelBrandingActive: boolean;
    additionalSeatsCount: number;
    giftedSeatsCount: number;
        currency: string;
  }>({
    queryKey: ['/api/subscription/details'],
    enabled: subStatus?.hasActiveSubscription || false,
  });

  // Create checkout session mutation
  const createCheckoutMutation = useMutation({
    mutationFn: async (tier: TierName) => {
      const response = await apiRequest('POST', '/api/stripe/create-checkout-session', { tier });
      const data = await response.json();
      // Return both the response data and the tier for tracking
      return { ...data, requestedTier: tier };
    },
    onSuccess: (data) => {
      // Track checkout after successful session creation using the confirmed tier
      if (data.requestedTier && data.url) {
        const tier = data.requestedTier as TierName;
        const tierInfo = TIER_INFO[tier];
        trackCheckoutStart({
          planTier: tier,
          planPrice: tierInfo.price,
          currency: subDetails?.currency || 'USD',
          billingPeriod: 'monthly',
        });
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
    },
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/stripe/cancel-subscription');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stripe/subscription-status'] });
      toast({
        title: "Subscription Canceled",
        description: "Your subscription will end at the end of the current billing period.",
      });
      setShowCancelDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    },
  });

  // Reactivate subscription mutation
  const reactivateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/stripe/reactivate-subscription');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stripe/subscription-status'] });
      toast({
        title: "Subscription Reactivated",
        description: "Your subscription will continue at the end of the current period.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reactivate subscription",
        variant: "destructive",
      });
    },
  });

  // Upgrade/downgrade subscription mutation (prorated)
  const upgradeMutation = useMutation({
    mutationFn: async (tier: TierName) => {
      const response = await apiRequest('POST', '/api/stripe/upgrade-subscription', { tier });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/stripe/subscription-status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setShowUpgradeDialog(false);
      setPendingUpgradeTier(null);
      toast({
        title: "Subscription Updated!",
        description: `Your subscription has been upgraded to ${data.newTier}. Changes are effective immediately.`,
      });
    },
    onError: (error: any) => {
      setShowUpgradeDialog(false);
      setPendingUpgradeTier(null);
      toast({
        title: "Upgrade Failed",
        description: error.message || "Failed to upgrade subscription",
        variant: "destructive",
      });
    },
  });

  // Add white label branding mutation
  const addBrandingMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/stripe/add-branding', {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/stripe/subscription-status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setShowAddBrandingDialog(false);
      
      // Show different message based on whether it was a free trial activation
      if (data.freeTrialBenefit) {
        toast({
          title: "White Label Branding Activated!",
          description: "Free during your trial period. Billing starts when your trial ends.",
        });
      } else {
        toast({
          title: "White Label Branding Unlocked!",
          description: "Refreshing page to apply changes...",
        });
      }
      
      // Reload page after 1 second to ensure fresh data from server
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error: any) => {
      setShowAddBrandingDialog(false);
      toast({
        title: "Failed to Add Branding",
        description: error.message || "Failed to add white label branding",
        variant: "destructive",
      });
    },
  });

  const handleUpgrade = (tier: TierName) => {
    setSelectedTier(tier);
    setPendingUpgradeTier(tier);
    
    // If user has active subscription, show confirmation dialog for upgrade/downgrade
    if (subStatus?.hasActiveSubscription) {
      setShowUpgradeDialog(true);
    } else {
      // For new subscriptions, use checkout flow (Stripe handles confirmation)
      createCheckoutMutation.mutate(tier);
    }
  };

  const confirmUpgrade = () => {
    if (pendingUpgradeTier) {
      upgradeMutation.mutate(pendingUpgradeTier);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      {subStatus?.hasActiveSubscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Current Plan
                </CardTitle>
                <CardDescription>Your active subscription</CardDescription>
              </div>
              <Badge variant={subStatus.status === 'active' ? 'default' : 'secondary'} className="text-sm">
                {subStatus.status === 'active' ? 'Active' : subStatus.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {subStatus.currentTier && TIER_INFO[subStatus.currentTier] && (() => {
              const tierInfo = TIER_INFO[subStatus.currentTier];
              const TierIcon = tierInfo.icon;
              
              // Calculate total limits including add-ons (paid + gifted)
                            const paidSeats = subDetails?.additionalSeatsCount || 0;
              const giftedSeats = subDetails?.giftedSeatsCount || 0;
              const totalAdditionalSeats = paidSeats + giftedSeats;
              
              const totalProjects = tierInfo.projects === -1 ? -1 : tierInfo.projects + additionalProjects;
              const totalSeats = tierInfo.seats === -1 ? -1 : tierInfo.seats + totalAdditionalSeats;
              
              return (
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${tierInfo.color}`}>
                    <TierIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{tierInfo.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {totalProjects === -1 ? 'Unlimited' : totalProjects} projects, 
                      {totalSeats === -1 ? ' Unlimited' : ` ${totalSeats}`} seats
                    </p>
                  </div>
                </div>
              );
            })()}

            {subStatus.currentPeriodEnd && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {subStatus.cancelAtPeriodEnd ? (
                  <span>Ends on {formatTimestampDate(subStatus.currentPeriodEnd)}</span>
                ) : (
                  <span>Renews on {formatTimestampDate(subStatus.currentPeriodEnd)}</span>
                )}
              </div>
            )}

            {subStatus.cancelAtPeriodEnd && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Your subscription is scheduled to cancel at the end of the billing period.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            {subStatus.cancelAtPeriodEnd ? (
              <Button
                onClick={() => reactivateMutation.mutate()}
                disabled={reactivateMutation.isPending}
                data-testid="button-reactivate-subscription"
              >
                {reactivateMutation.isPending ? 'Reactivating...' : 'Reactivate Subscription'}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => window.location.href = '/manage-subscription'}
                data-testid="button-manage-subscription"
              >
                Manage Subscription
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Subscription Plan */}
      <div className="max-w-md mx-auto">
        {(() => {
          const tier = 'basic';
          const info = TIER_INFO.basic;
          const isCurrent = subStatus?.currentTier === tier || subStatus?.hasActiveSubscription;
          const TierIcon = info.icon;

          return (
            <Card
              className={`relative ${isCurrent ? 'ring-2 ring-primary' : ''}`}
              data-testid={`card-tier-${tier}`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="px-3">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${info.color} flex items-center justify-center mb-3`}>
                  <TierIcon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{info.name}</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold text-foreground">
                    ${info.price}
                  </span>
                  <span className="text-muted-foreground">/month (USD or CAD)</span>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Separator className="mb-4" />
                <ul className="space-y-2">
                  {info.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={isCurrent ? 'outline' : 'default'}
                  onClick={() => handleUpgrade(tier as TierName)}
                  disabled={isCurrent || createCheckoutMutation.isPending}
                  data-testid={`button-subscribe-${tier}`}
                >
                  {createCheckoutMutation.isPending && selectedTier === tier ? (
                    'Processing...'
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : (
                    'Subscribe to OnRopePro'
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })()}
      </div>

      {/* Add-ons Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Add-ons
          </CardTitle>
          <CardDescription>Enhance your subscription with optional features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            onClick={() => setShowAddSeatsDialog(true)}
            disabled={!subStatus?.hasActiveSubscription}
            className="w-full flex items-center justify-between p-4 border rounded-lg hover-elevate active-elevate-2 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-add-seats"
          >
            <div>
              <h4 className="font-medium">Additional Seat</h4>
              <p className="text-sm text-muted-foreground">Add 1 team member to your plan</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">$34.95/month</p>
              <p className="text-xs text-muted-foreground">per seat</p>
            </div>
          </button>

          <button
            onClick={() => setShowAddBrandingDialog(true)}
            disabled={!subStatus?.hasActiveSubscription}
            className="w-full flex items-center justify-between p-4 border rounded-lg hover-elevate active-elevate-2 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-add-branding"
          >
            <div>
              <h4 className="font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" />
                White Label Branding
              </h4>
              <p className="text-sm text-muted-foreground">Custom logo and brand colors</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">$49/month</p>
            </div>
          </button>

          <p className="text-sm text-muted-foreground italic">
            Add-ons can be purchased during checkout or added to your existing subscription.
          </p>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent data-testid="dialog-cancel-subscription">
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll retain access until the end of your current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              data-testid="button-cancel-dialog-close"
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              data-testid="button-confirm-cancel"
            >
              {cancelMutation.isPending ? 'Canceling...' : 'Confirm Cancellation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent data-testid="dialog-upgrade-subscription" className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {pendingUpgradeTier && subStatus?.currentTier && 
                TIER_INFO[pendingUpgradeTier].price > TIER_INFO[subStatus.currentTier].price
                ? 'Upgrade Subscription'
                : 'Change Subscription'
              }
            </DialogTitle>
            <DialogDescription asChild>
              {pendingUpgradeTier && subStatus?.currentTier && (
                <div className="space-y-4 pt-2">
                  <div className="text-sm text-muted-foreground">
                    You're about to change your plan from <strong className="text-foreground">{TIER_INFO[subStatus.currentTier]?.name}</strong> to <strong className="text-foreground">{TIER_INFO[pendingUpgradeTier]?.name}</strong>.
                  </div>

                  {/* Pricing Comparison */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Price:</span>
                      <span className="font-medium line-through">
                        ${TIER_INFO[subStatus.currentTier].price}/mo
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">New Price:</span>
                      <span className="text-lg font-bold text-primary">
                        ${TIER_INFO[pendingUpgradeTier].price}/mo
                      </span>
                    </div>
                  </div>

                  {/* Feature Upgrades */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">What you'll get:</h4>
                    <div className="space-y-1.5 text-sm">
                      {TIER_INFO[subStatus.currentTier].projects !== TIER_INFO[pendingUpgradeTier].projects && (
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>
                            <strong>
                              {TIER_INFO[pendingUpgradeTier].projects === -1 ? 'Unlimited' : TIER_INFO[pendingUpgradeTier].projects}
                            </strong> active projects 
                            <span className="text-muted-foreground ml-1">
                              (from {TIER_INFO[subStatus.currentTier].projects})
                            </span>
                          </span>
                        </div>
                      )}
                      {TIER_INFO[subStatus.currentTier].seats !== TIER_INFO[pendingUpgradeTier].seats && (
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>
                            <strong>
                              {TIER_INFO[pendingUpgradeTier].seats === -1 ? 'Unlimited' : TIER_INFO[pendingUpgradeTier].seats}
                            </strong> team seats
                            <span className="text-muted-foreground ml-1">
                              (from {TIER_INFO[subStatus.currentTier].seats})
                            </span>
                          </span>
                        </div>
                      )}
                      {TIER_INFO[pendingUpgradeTier].features.slice(2).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t space-y-1">
                    <p><strong>Prorated Billing:</strong> You'll only be charged for the price difference, adjusted for the time remaining in your current billing period.</p>
                    <p>Changes take effect immediately. Your next invoice will reflect the new pricing.</p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowUpgradeDialog(false);
                setPendingUpgradeTier(null);
              }}
              data-testid="button-upgrade-dialog-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={confirmUpgrade}
              disabled={upgradeMutation.isPending}
              data-testid="button-confirm-upgrade"
            >
              {upgradeMutation.isPending ? 'Processing...' : 'Confirm Upgrade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Extra Seats Dialog - using shared PurchaseSeatsDialog component */}
      <PurchaseSeatsDialog
        open={showAddSeatsDialog}
        onOpenChange={setShowAddSeatsDialog}
        currentSeats={subDetails?.additionalSeatsCount || 0}
        onPurchaseSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['/api/stripe/subscription-status'] });
          queryClient.invalidateQueries({ queryKey: ['/api/user'] });
          queryClient.invalidateQueries({ queryKey: ['/api/subscription/details'] });
        }}
      />

      {/* Add White Label Branding Dialog */}
      <Dialog open={showAddBrandingDialog} onOpenChange={setShowAddBrandingDialog}>
        <DialogContent data-testid="dialog-add-branding">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Add White Label Branding
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-4 pt-4">
                {subStatus?.status === 'trialing' ? (
                  <div className="bg-success/10 border border-success/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-success">Free During Trial!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Activate white label branding for free during your trial period. 
                      It will be added to your subscription ($49/month) when billing starts.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Price:</span>
                    <span className="font-semibold text-base">$49/month</span>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Upload custom logo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Customize brand colors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Apply branding across entire platform</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t space-y-1">
                  {subStatus?.status === 'trialing' ? (
                    <p>Changes take effect immediately. Configure your branding in Settings.</p>
                  ) : (
                    <>
                      <p><strong>Prorated Billing:</strong> You'll only be charged for the time remaining in your current billing period.</p>
                      <p>Changes take effect immediately. Configure your branding in Settings.</p>
                    </>
                  )}
                </div>
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
              variant="default"
              onClick={() => addBrandingMutation.mutate()}
              disabled={addBrandingMutation.isPending}
              data-testid="button-confirm-add-branding"
            >
              {addBrandingMutation.isPending ? 'Processing...' : (subStatus?.status === 'trialing' ? 'Activate Free' : 'Confirm Purchase')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
