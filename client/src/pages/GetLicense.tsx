import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TIER_CONFIG } from "@shared/stripe-config";

export default function GetLicense() {
  const [processingTier, setProcessingTier] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelectTier = async (tierName: keyof typeof TIER_CONFIG) => {
    try {
      setProcessingTier(tierName);
      
      // Create checkout session for new customer (always USD)
      const response = await fetch('/api/stripe/create-license-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          tier: tierName,
          currency: 'usd',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { sessionUrl } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = sessionUrl;
    } catch (error: any) {
      console.error('[GetLicense] Failed to start checkout:', error);
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
      setProcessingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-icons text-2xl text-primary">apartment</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Rope Access Pro</h1>
                <p className="text-sm text-muted-foreground">Professional High-Rise Maintenance</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = "/"}
              data-testid="button-back-to-login"
            >
              <span className="material-icons mr-2">arrow_back</span>
              Back to Login
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your License Tier</h2>
          <p className="text-xl text-muted-foreground">
            Start your 30-day free trial today
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.keys(TIER_CONFIG) as Array<keyof typeof TIER_CONFIG>).map((tierKey) => {
            const tier = TIER_CONFIG[tierKey];
            const price = tier.priceUSD;
            const isProcessing = processingTier === tierKey;
            const isEnterprise = tierKey === 'enterprise';
            const isPremium = tierKey === 'premium';

            return (
              <Card 
                key={tierKey} 
                className={`relative ${isPremium ? 'border-primary border-2 shadow-lg' : ''}`}
                data-testid={`card-tier-${tierKey}`}
              >
                {isPremium && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="px-4 py-1 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">
                        ${price}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        USD/month
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <Badge variant="secondary" className="text-xs">
                        30-Day Free Trial
                      </Badge>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                      <span className="text-sm">
                        <strong>{tier.maxProjects === -1 ? 'Unlimited' : tier.maxProjects}</strong> Projects
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                      <span className="text-sm">
                        <strong>{tier.maxSeats === -1 ? 'Unlimited' : tier.maxSeats}</strong> Employee Seats
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                      <span className="text-sm">GPS Tracking & Time Clock</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                      <span className="text-sm">Safety Compliance Tools</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                      <span className="text-sm">Resident Portal</span>
                    </div>
                    {isEnterprise && (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                          <span className="text-sm">Priority Support</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                          <span className="text-sm">Custom Integrations</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full h-12 text-base"
                    variant={isPremium ? "default" : "outline"}
                    onClick={() => handleSelectTier(tierKey)}
                    disabled={isProcessing}
                    data-testid={`button-select-${tierKey}`}
                  >
                    {isProcessing ? (
                      <>
                        <span className="material-icons mr-2 animate-spin">sync</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="material-icons mr-2">shopping_cart</span>
                        Select {tier.name}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Trial Details */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-primary text-2xl">info</span>
                </div>
                <div className="text-left space-y-2">
                  <h3 className="font-semibold text-lg">What happens next?</h3>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Complete secure payment via Stripe (30-day free trial)</li>
                    <li>Receive your unique license key instantly</li>
                    <li>Create your company account with full access</li>
                    <li>Start managing your rope access operations immediately</li>
                  </ol>
                  <p className="text-xs text-muted-foreground pt-2">
                    <strong>Note:</strong> Your card will not be charged during the 30-day trial period. Cancel anytime before the trial ends to avoid charges.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
