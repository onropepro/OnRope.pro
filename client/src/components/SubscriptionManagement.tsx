import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TierName = 'basic' | 'starter' | 'premium' | 'enterprise';
type Currency = 'usd' | 'cad';

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
    name: 'Basic',
    price: { usd: 79, cad: 99 },
    projects: 2,
    seats: 4,
    color: 'bg-blue-500',
    icon: Briefcase,
    features: [
      '2 active projects',
      '4 team seats',
      'GPS tracking',
      'Basic reporting',
      'Safety compliance',
    ]
  },
  starter: {
    name: 'Starter',
    price: { usd: 299, cad: 399 },
    projects: 5,
    seats: 10,
    color: 'bg-purple-500',
    icon: Users,
    features: [
      '5 active projects',
      '10 team seats',
      'Advanced analytics',
      'Priority support',
    ]
  },
  premium: {
    name: 'Premium',
    price: { usd: 499, cad: 649 },
    projects: 9,
    seats: 18,
    color: 'bg-orange-500',
    icon: Crown,
    features: [
      '9 active projects',
      '18 team seats',
      'Premium analytics',
      'API access',
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: { usd: 899, cad: 1199 },
    projects: -1,
    seats: -1,
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    icon: Crown,
    features: [
      'Unlimited projects',
      'Unlimited team seats',
      'Enterprise analytics',
      'Dedicated support',
      'Custom integrations',
    ]
  }
};

export function SubscriptionManagement() {
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<TierName | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('usd');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [pendingUpgradeTier, setPendingUpgradeTier] = useState<TierName | null>(null);

  // Fetch current subscription status
  const { data: subStatus, isLoading } = useQuery<SubscriptionStatus>({
    queryKey: ['/api/stripe/subscription-status'],
  });

  // Create checkout session mutation
  const createCheckoutMutation = useMutation({
    mutationFn: async ({ tier, currency }: { tier: TierName, currency: Currency }) => {
      const response = await apiRequest('POST', '/api/stripe/create-checkout-session', { tier, currency });
      return response.json();
    },
    onSuccess: (data) => {
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

  const handleUpgrade = (tier: TierName) => {
    setSelectedTier(tier);
    setPendingUpgradeTier(tier);
    
    // If user has active subscription, show confirmation dialog for upgrade/downgrade
    if (subStatus?.hasActiveSubscription) {
      setShowUpgradeDialog(true);
    } else {
      // For new subscriptions, use checkout flow (Stripe handles confirmation)
      createCheckoutMutation.mutate({ tier, currency: selectedCurrency });
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
              
              return (
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${tierInfo.color}`}>
                    <TierIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{tierInfo.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tierInfo.projects === -1 ? 'Unlimited' : tierInfo.projects} projects, 
                      {tierInfo.seats === -1 ? ' Unlimited' : ` ${tierInfo.seats}`} seats
                    </p>
                  </div>
                </div>
              );
            })()}

            {subStatus.currentPeriodEnd && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {subStatus.cancelAtPeriodEnd ? (
                  <span>Ends on {new Date(subStatus.currentPeriodEnd).toLocaleDateString()}</span>
                ) : (
                  <span>Renews on {new Date(subStatus.currentPeriodEnd).toLocaleDateString()}</span>
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
                onClick={() => setShowCancelDialog(true)}
                data-testid="button-cancel-subscription"
              >
                Cancel Subscription
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Currency Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Currency:</label>
        <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as Currency)}>
          <SelectTrigger className="w-32" data-testid="select-currency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">USD ($)</SelectItem>
            <SelectItem value="cad">CAD ($)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(TIER_INFO).map(([tier, info]) => {
          const isCurrent = subStatus?.currentTier === tier;
          const TierIcon = info.icon;

          return (
            <Card
              key={tier}
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
                    {selectedCurrency === 'usd' ? '$' : 'C$'}
                    {info.price[selectedCurrency]}
                  </span>
                  <span className="text-muted-foreground">/month</span>
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
                    `Subscribe to ${info.name}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
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
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Extra Team Seats</h4>
              <p className="text-sm text-muted-foreground">Add 2 additional seats to your plan</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{selectedCurrency === 'usd' ? '$19' : 'C$24'}/month</p>
              <p className="text-xs text-muted-foreground">per pack</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Extra Project</h4>
              <p className="text-sm text-muted-foreground">Add 1 additional active project</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{selectedCurrency === 'usd' ? '$49' : 'C$64'}/month</p>
              <p className="text-xs text-muted-foreground">per project</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" />
                White Label Branding
              </h4>
              <p className="text-sm text-muted-foreground">Custom logo and brand colors</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">$0.49/month</p>
              <p className="text-xs text-muted-foreground">Available for Starter+</p>
            </div>
          </div>

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
                TIER_INFO[pendingUpgradeTier].price[selectedCurrency] > TIER_INFO[subStatus.currentTier].price[selectedCurrency]
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
                        {selectedCurrency === 'usd' ? '$' : 'C$'}{TIER_INFO[subStatus.currentTier].price[selectedCurrency]}/mo
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">New Price:</span>
                      <span className="text-lg font-bold text-primary">
                        {selectedCurrency === 'usd' ? '$' : 'C$'}{TIER_INFO[pendingUpgradeTier].price[selectedCurrency]}/mo
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

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Your billing will be prorated automatically. Changes take effect immediately.
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
    </div>
  );
}
