import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TIER_CONFIG } from "@shared/stripe-config";

export default function GetLicense() {
  const { t } = useTranslation();
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
        title: t('getLicense.errors.checkoutError', 'Checkout Error'),
        description: error.message || t('getLicense.errors.checkoutFailed', 'Failed to start checkout process. Please try again.'),
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
                <h1 className="text-2xl font-bold">{t('getLicense.header.title', 'Rope Access Pro')}</h1>
                <p className="text-sm text-muted-foreground">{t('getLicense.header.subtitle', 'Professional High-Rise Maintenance')}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = "/"}
              data-testid="button-back-to-login"
            >
              <span className="material-icons mr-2">arrow_back</span>
              {t('getLicense.header.backToLogin', 'Back to Login')}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t('getLicense.main.title', 'Choose Your License Tier')}</h2>
          <p className="text-xl text-muted-foreground">
            {t('getLicense.main.subtitle', 'Start your 30-day free trial today')}
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
                      {t('getLicense.tier.mostPopular', 'Most Popular')}
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
                        {t('getLicense.tier.perMonth', 'USD/month')}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <Badge variant="secondary" className="text-xs">
                        {t('getLicense.tier.freeTrial', '30-Day Free Trial')}
                      </Badge>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                      <span className="text-sm">
                        <strong>{tier.maxProjects === -1 ? t('getLicense.tier.unlimited', 'Unlimited') : tier.maxProjects}</strong> {t('getLicense.tier.projects', 'Projects')}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                      <span className="text-sm">
                        <strong>{tier.maxSeats === -1 ? t('getLicense.tier.unlimited', 'Unlimited') : tier.maxSeats}</strong> {t('getLicense.tier.employeeSeats', 'Employee Seats')}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                      <span className="text-sm">{t('getLicense.tier.gpsTracking', 'GPS Tracking & Time Clock')}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                      <span className="text-sm">{t('getLicense.tier.safetyCompliance', 'Safety Compliance Tools')}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                      <span className="text-sm">{t('getLicense.tier.residentPortal', 'Resident Portal')}</span>
                    </div>
                    {isEnterprise && (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                          <span className="text-sm">{t('getLicense.tier.prioritySupport', 'Priority Support')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                          <span className="text-sm">{t('getLicense.tier.customIntegrations', 'Custom Integrations')}</span>
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
                        {t('getLicense.tier.processing', 'Processing...')}
                      </>
                    ) : (
                      <>
                        <span className="material-icons mr-2">shopping_cart</span>
                        {t('getLicense.tier.select', 'Select {{name}}', { name: tier.name })}
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
                  <h3 className="font-semibold text-lg">{t('getLicense.nextSteps.title', 'What happens next?')}</h3>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>{t('getLicense.nextSteps.step1', 'Complete secure payment via Stripe (30-day free trial)')}</li>
                    <li>{t('getLicense.nextSteps.step2', 'Receive your unique license key instantly')}</li>
                    <li>{t('getLicense.nextSteps.step3', 'Create your company account with full access')}</li>
                    <li>{t('getLicense.nextSteps.step4', 'Start managing your rope access operations immediately')}</li>
                  </ol>
                  <p className="text-xs text-muted-foreground pt-2">
                    <strong>{t('getLicense.nextSteps.note', 'Note:')}</strong> {t('getLicense.nextSteps.noteText', 'Your card will not be charged during the 30-day trial period. Cancel anytime before the trial ends to avoid charges.')}
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
