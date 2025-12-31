import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatTimestampDate } from "@/lib/dateUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { trackCheckoutStart } from "@/lib/analytics";
import { PRICING, VOLUME_DISCOUNT_THRESHOLD } from "@shared/stripe-config";
import { PurchaseSeatsDialog } from "@/components/PurchaseSeatsDialog";
import { Link } from "wouter";
import { 
  CreditCard, 
  Check, 
  AlertCircle, 
  Users,
  Briefcase,
  Palette,
  Calendar,
  ExternalLink,
  Settings,
  Gift,
  Plus,
  ChevronRight
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
  },
};

export function SubscriptionManagement() {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
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

  // Fetch team count for usage display
  const { data: teamData } = useQuery<{ employees: any[] }>({
    queryKey: ['/api/employees'],
    enabled: subStatus?.hasActiveSubscription || false,
  });

  // Create checkout session mutation
  const createCheckoutMutation = useMutation({
    mutationFn: async (tier: TierName) => {
      const response = await apiRequest('POST', '/api/stripe/create-checkout-session', { tier });
      const data = await response.json();
      return { ...data, requestedTier: tier };
    },
    onSuccess: (data) => {
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

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/stripe/cancel-subscription');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stripe/subscription-status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription/details'] });
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

  const handleSubscribe = () => {
    createCheckoutMutation.mutate('basic');
  };

  // Calculate usage stats
  const paidSeats = subDetails?.additionalSeatsCount || 0;
  const giftedSeats = subDetails?.giftedSeatsCount || 0;
  const totalSeats = paidSeats + giftedSeats;
  const usedSeats = teamData?.employees?.length || 0;

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

  // No active subscription - show subscribe prompt
  if (!subStatus?.hasActiveSubscription) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              No Active Subscription
            </CardTitle>
            <CardDescription>
              Subscribe to OnRopePro to unlock all features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="p-3 rounded-lg bg-primary">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">OnRopePro</h3>
                <p className="text-2xl font-bold">
                  $99<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
              </div>
            </div>
            
            <Button
              className="w-full"
              onClick={handleSubscribe}
              disabled={createCheckoutMutation.isPending}
              data-testid="button-subscribe"
            >
              {createCheckoutMutation.isPending ? 'Processing...' : 'Subscribe Now'}
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              <Link href="/pricing" className="text-primary hover:underline">
                View full plan details
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active subscription - show account management
  return (
    <div className="space-y-6">
      {/* Plan Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">OnRopePro</CardTitle>
                <CardDescription>Your active subscription</CardDescription>
              </div>
            </div>
            <Badge 
              variant={subStatus.status === 'trialing' ? 'secondary' : 'default'} 
              className="text-sm"
              data-testid="badge-subscription-status"
            >
              {subStatus.status === 'active' ? 'Active' : 
               subStatus.status === 'trialing' ? 'Trial' : 
               subStatus.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Billing Info */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {subStatus.cancelAtPeriodEnd ? 'Ends:' : 'Renews:'}
              </span>
              <span className="font-medium">
                {subStatus.currentPeriodEnd ? formatTimestampDate(subStatus.currentPeriodEnd) : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Monthly:</span>
              <span className="font-medium">$99/month</span>
            </div>
          </div>

          {/* Cancellation Warning */}
          {subStatus.cancelAtPeriodEnd && (
            <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Your subscription is scheduled to cancel at the end of the billing period.
                </p>
                <Button
                  size="sm"
                  onClick={() => reactivateMutation.mutate()}
                  disabled={reactivateMutation.isPending}
                  data-testid="button-reactivate-subscription"
                >
                  {reactivateMutation.isPending ? 'Reactivating...' : 'Reactivate Subscription'}
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/manage-subscription'}
              data-testid="button-manage-subscription"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
            <Link href="/pricing">
              <Button variant="ghost" size="sm" data-testid="button-view-plan-details">
                View Plan Details
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
            {!subStatus.cancelAtPeriodEnd && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => setShowCancelDialog(true)}
                data-testid="button-cancel-subscription"
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage & Add-ons Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Usage & Add-ons
          </CardTitle>
          <CardDescription>Your current usage and active add-ons</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seat Usage */}
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium">Team Seats</h4>
                  <p className="text-sm text-muted-foreground">
                    {usedSeats} of {totalSeats} seats used
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddSeatsDialog(true)}
                data-testid="button-add-seats"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Seats
              </Button>
            </div>
            
            {/* Seat breakdown */}
            <div className="flex flex-wrap gap-4 text-sm pl-11">
              {paidSeats > 0 && (
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{paidSeats} paid</span>
                </div>
              )}
              {giftedSeats > 0 && (
                <div className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{giftedSeats} gifted</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span>$34.95/seat/month</span>
                {totalSeats >= VOLUME_DISCOUNT_THRESHOLD && (
                  <Badge variant="secondary" className="text-xs">Volume discount active</Badge>
                )}
              </div>
            </div>
          </div>

          {/* White Label Branding Add-on */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${subDetails?.whitelabelBrandingActive ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-muted'}`}>
                  <Palette className={`w-4 h-4 ${subDetails?.whitelabelBrandingActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    White Label Branding
                    {subDetails?.whitelabelBrandingActive && (
                      <Badge variant="default" className="text-xs">Active</Badge>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {subDetails?.whitelabelBrandingActive 
                      ? 'Custom logo and brand colors enabled'
                      : 'Add your logo and brand colors - $49/month'
                    }
                  </p>
                </div>
              </div>
              {!subDetails?.whitelabelBrandingActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddBrandingDialog(true)}
                  data-testid="button-add-branding"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              )}
              {subDetails?.whitelabelBrandingActive && (
                <Link href="/profile?tab=branding">
                  <Button variant="ghost" size="sm" data-testid="button-configure-branding">
                    Configure
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Portal Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Billing & Invoices
          </CardTitle>
          <CardDescription>
            View invoices, update payment method, and manage billing details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/manage-subscription'}
            className="w-full sm:w-auto"
            data-testid="button-billing-portal"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Billing Portal
          </Button>
        </CardContent>
      </Card>

      {/* Purchase Seats Dialog */}
      <PurchaseSeatsDialog
        open={showAddSeatsDialog}
        onOpenChange={setShowAddSeatsDialog}
        currentSeats={totalSeats}
        paidSeats={paidSeats}
        giftedSeats={giftedSeats}
        seatsUsed={usedSeats}
        isTrialing={subStatus?.status === 'trialing'}
        hasWhitelabelBranding={subDetails?.whitelabelBrandingActive}
      />

      {/* Add Branding Confirmation Dialog */}
      <Dialog open={showAddBrandingDialog} onOpenChange={setShowAddBrandingDialog}>
        <DialogContent data-testid="dialog-add-branding">
          <DialogHeader>
            <DialogTitle>Add White Label Branding</DialogTitle>
            <DialogDescription>
              Customize the resident portal with your company's logo and brand colors.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Palette className="w-8 h-8 text-primary" />
              <div>
                <h4 className="font-medium">White Label Branding</h4>
                <p className="text-sm text-muted-foreground">$49/month added to your subscription</p>
              </div>
            </div>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Custom company logo on resident portal
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Brand color customization
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Professional branded experience for clients
              </li>
            </ul>
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddBrandingDialog(false)}
              data-testid="button-cancel-branding"
            >
              Cancel
            </Button>
            <Button
              onClick={() => addBrandingMutation.mutate()}
              disabled={addBrandingMutation.isPending}
              data-testid="button-confirm-branding"
            >
              {addBrandingMutation.isPending ? 'Adding...' : 'Add Branding - $49/mo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Confirmation Dialog */}
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
    </div>
  );
}
