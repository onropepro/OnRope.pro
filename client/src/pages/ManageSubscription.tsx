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
  extraSeats?: number;
  extraProjects?: number;
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

export default function ManageSubscription() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [cancelTarget, setCancelTarget] = useState<'subscription' | 'whitelabel' | null>(null);

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: subscriptionData, isLoading } = useQuery<SubscriptionDetails>({
    queryKey: ["/api/subscription/details"],
    enabled: !!user,
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/stripe/cancel-subscription", "POST");
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
      return await apiRequest("/api/stripe/cancel-whitelabel", "POST");
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
                  {tierName} Plan
                </CardTitle>
                <CardDescription>
                  {currencySymbol}{tierPrice}/month
                </CardDescription>
              </div>
              <Badge variant={subscriptionData.cancelAtPeriodEnd ? "secondary" : "default"}>
                {subscriptionData.cancelAtPeriodEnd ? "Cancelling" : "Active"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                {subscriptionData.cancelAtPeriodEnd ? "Active until" : "Renews on"}: {renewalDate}
              </span>
            </div>

            <Separator />

            {!subscriptionData.cancelAtPeriodEnd && (
              <Button
                variant="destructive"
                onClick={() => setCancelTarget('subscription')}
                data-testid="button-cancel-main-subscription"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Subscription
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

            {/* Extra Seats - Coming Soon */}
            {subscriptionData.extraSeats && subscriptionData.extraSeats > 0 && (
              <>
                <div className="flex items-center justify-between p-4 border rounded-md opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-md">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Extra Team Seats</h3>
                      <p className="text-sm text-muted-foreground">
                        {subscriptionData.extraSeats} seats • {currencySymbol}19/month
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <Separator />
              </>
            )}

            {/* Extra Projects - Coming Soon */}
            {subscriptionData.extraProjects && subscriptionData.extraProjects > 0 && (
              <>
                <div className="flex items-center justify-between p-4 border rounded-md opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-md">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Extra Projects</h3>
                      <p className="text-sm text-muted-foreground">
                        {subscriptionData.extraProjects} projects • {currencySymbol}49/month each
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <Separator />
              </>
            )}

            {!subscriptionData.whitelabelBrandingActive && 
             (!subscriptionData.extraSeats || subscriptionData.extraSeats === 0) &&
             (!subscriptionData.extraProjects || subscriptionData.extraProjects === 0) && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active add-ons</p>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/profile")}
                  className="mt-4"
                  data-testid="button-browse-addons"
                >
                  Browse Add-ons
                </Button>
              </div>
            )}
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
    </div>
  );
}
