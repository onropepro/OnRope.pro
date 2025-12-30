import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TIER_CONFIG, PRICING, ANNUAL_DISCOUNT_PERCENT, type BillingFrequency, type Currency } from "@shared/stripe-config";
import { EmbeddedCheckoutDialog } from "@/components/EmbeddedCheckout";

export default function GetLicense() {
  const { t } = useTranslation();
  const [processingTier, setProcessingTier] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>('usd');
  const [billingFrequency, setBillingFrequency] = useState<BillingFrequency>('monthly');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('basic');
  const { toast } = useToast();

  // Auto-detect Canadian users based on timezone or browser locale
  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locale = navigator.language || (navigator as any).userLanguage || '';
      
      // Check for Canadian timezone or locale
      const isCanadian = timezone.startsWith('America/Toronto') ||
                         timezone.startsWith('America/Vancouver') ||
                         timezone.startsWith('America/Edmonton') ||
                         timezone.startsWith('America/Winnipeg') ||
                         timezone.startsWith('America/Halifax') ||
                         timezone.startsWith('America/St_Johns') ||
                         timezone.startsWith('America/Regina') ||
                         timezone.startsWith('America/Montreal') ||
                         timezone.startsWith('Canada/') ||
                         locale.toLowerCase().includes('ca') ||
                         locale === 'en-CA' ||
                         locale === 'fr-CA';
      
      if (isCanadian) {
        setCurrency('cad');
      }
    } catch (e) {
      // Default to USD if detection fails
      console.log('Currency detection failed, defaulting to USD');
    }
  }, []);

  const handleSelectTier = (tierName: keyof typeof TIER_CONFIG) => {
    setSelectedTier(tierName);
    setProcessingTier(tierName);
    setCheckoutOpen(true);
  };

  const handleCheckoutClose = (open: boolean) => {
    setCheckoutOpen(open);
    if (!open) {
      setProcessingTier(null);
    }
  };

  const currencySymbol = currency === 'cad' ? 'CAD' : 'USD';

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
            <div className="flex items-center gap-4">
              {/* Billing Frequency Toggle */}
              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                <Button
                  variant={billingFrequency === 'monthly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBillingFrequency('monthly')}
                  className="text-sm"
                  data-testid="button-billing-monthly"
                >
                  Monthly
                </Button>
                <Button
                  variant={billingFrequency === 'annual' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBillingFrequency('annual')}
                  className="text-sm"
                  data-testid="button-billing-annual"
                >
                  Annual
                  <Badge variant="secondary" className="ml-1 text-xs">
                    Save {ANNUAL_DISCOUNT_PERCENT}%
                  </Badge>
                </Button>
              </div>
              {/* Currency Toggle */}
              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                <Button
                  variant={currency === 'usd' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrency('usd')}
                  className="text-sm"
                  data-testid="button-currency-usd"
                >
                  USD $
                </Button>
                <Button
                  variant={currency === 'cad' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrency('cad')}
                  className="text-sm"
                  data-testid="button-currency-cad"
                >
                  CAD $
                </Button>
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
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t('getLicense.main.title', 'Simple, Transparent Pricing')}</h2>
          <p className="text-xl text-muted-foreground">
            {t('getLicense.main.subtitle', 'Start your 30-day free trial today')}
          </p>
          {currency === 'cad' && (
            <p className="text-sm text-muted-foreground mt-2">
              Prices shown in Canadian Dollars (CAD)
            </p>
          )}
        </div>

        {/* Single Plan Card - Centered */}
        <div className="flex justify-center">
          <Card 
            className="relative border-primary border-2 shadow-lg max-w-md w-full"
            data-testid="card-tier-onropepro"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">OnRopePro</CardTitle>
              <CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-foreground">
                    ${billingFrequency === 'monthly' ? PRICING.base.monthly : PRICING.base.annual}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {currencySymbol}/{billingFrequency === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {billingFrequency === 'annual' && (
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    Save ${(PRICING.base.monthly * 12) - PRICING.base.annual}/year ({ANNUAL_DISCOUNT_PERCENT}% off)
                  </div>
                )}
                <div className="mt-3 space-y-1">
                  <Badge variant="secondary" className="text-xs">
                    {t('getLicense.tier.freeTrial', '30-Day Free Trial')}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    + ${billingFrequency === 'monthly' ? PRICING.seat.monthly : PRICING.seat.annual}/{billingFrequency === 'monthly' ? 'month' : 'year'} per additional employee seat
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Volume discount: ${billingFrequency === 'monthly' ? PRICING.volumeSeat.monthly : PRICING.volumeSeat.annual}/{billingFrequency === 'monthly' ? 'month' : 'year'} per seat for 30+ employees
                  </p>
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                  <span className="text-sm">
                    <strong>{t('getLicense.tier.unlimited', 'Unlimited')}</strong> {t('getLicense.tier.projects', 'Projects')}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                  <span className="text-sm">
                    {t('getLicense.tier.gpsTracking', 'GPS Tracking & Time Clock')}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                  <span className="text-sm">{t('getLicense.tier.safetyCompliance', 'Safety Compliance Tools')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                  <span className="text-sm">{t('getLicense.tier.residentPortal', 'Resident Portal')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                  <span className="text-sm">Full Project Management Suite</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-icons text-primary text-sm mt-0.5">check_circle</span>
                  <span className="text-sm">Client & Building Management</span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full h-12 text-base"
                variant="default"
                onClick={() => handleSelectTier('basic')}
                disabled={processingTier === 'basic'}
                data-testid="button-select-onropepro"
              >
                {processingTier === 'basic' ? (
                  <>
                    <span className="material-icons mr-2 animate-spin">sync</span>
                    {t('getLicense.tier.processing', 'Processing...')}
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-2">shopping_cart</span>
                    {t('getLicense.tier.startTrial', 'Start Free Trial')}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
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
                    <li>{t('getLicense.nextSteps.step2', 'Your company account is created automatically')}</li>
                    <li>{t('getLicense.nextSteps.step3', 'Log in with your email and password')}</li>
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

      <EmbeddedCheckoutDialog
        open={checkoutOpen}
        onOpenChange={handleCheckoutClose}
        tier={selectedTier}
        currency={currency}
        billingFrequency={billingFrequency}
        isNewCustomer={true}
      />
    </div>
  );
}
