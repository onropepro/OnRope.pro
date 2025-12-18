import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { trackPricingPageView } from "@/lib/analytics";
import ChangelogLayout from "@/components/ChangelogLayout";

export default function Pricing() {
  const { t } = useTranslation();
  // Track pricing page view on mount
  useEffect(() => {
    trackPricingPageView({ source: 'pricing_page' });
  }, []);
  const subscriptionPlan = {
    name: "OnRopePro",
    price: "$99",
    period: t('pricing.period', '/month (USD/CAD)'),
    description: t('pricing.description', 'Complete rope access management platform for your entire operation'),
    features: [
      { text: t('pricing.features.unlimitedProjects', 'Unlimited Projects'), included: true },
      { text: t('pricing.features.employeeManagement', 'Employee Management'), included: true },
      { text: t('pricing.features.advancedScheduling', 'Advanced Scheduling'), included: true },
      { text: t('pricing.features.prioritySupport', 'Priority Support'), included: true },
      { text: t('pricing.features.inventoryTracking', 'Inventory Tracking'), included: true },
      { text: t('pricing.features.safetyForms', 'Safety Forms & Compliance'), included: true },
      { text: t('pricing.features.crmQuotes', 'CRM & Quotes Suite'), included: true },
      { text: t('pricing.features.analytics', 'Advanced Analytics & Reports'), included: true },
      { text: t('pricing.features.gpsTracking', 'GPS Time Tracking'), included: true },
      { text: t('pricing.features.residentPortal', 'Resident Portal'), included: true },
    ],
    highlighted: true
  };

  const addOns = [
    {
      name: t('pricing.addOns.additionalSeats.name', 'Additional Seats'),
      price: "$34.95",
      period: t('pricing.addOns.additionalSeats.period', '/month per seat'),
      description: t('pricing.addOns.additionalSeats.description', 'Add team members to your account. First seat included free during trial.'),
    },
    {
      name: t('pricing.addOns.whiteLabel.name', 'White Label Branding'),
      price: "$49",
      period: t('pricing.addOns.whiteLabel.period', '/month add-on'),
      description: t('pricing.addOns.whiteLabel.description', 'Customize the platform with your company branding and colors'),
    }
  ];

  return (
    <ChangelogLayout title="Pricing">
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton to="/changelog" />
            <h1 className="text-lg font-semibold">Pricing & Subscriptions</h1>
          </div>
          <MainMenuButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Choose the perfect plan for your rope access company. All prices in USD or CAD (same pricing).
          </p>
          <p className="text-sm text-muted-foreground">
            Need something custom? Contact our sales team for enterprise solutions.
          </p>
        </div>

        {/* Main Subscription Plan */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Subscription Plan</h3>
          <div className="max-w-lg mx-auto">
            <Card className="flex flex-col ring-2 ring-primary shadow-lg">
              <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-semibold">
                All-Inclusive Platform
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">{subscriptionPlan.name}</CardTitle>
                <CardDescription className="text-sm">{subscriptionPlan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{subscriptionPlan.price}</span>
                    <span className="text-sm text-muted-foreground">{subscriptionPlan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">+ $34.95/month per additional seat</p>
                </div>

                <ul className="space-y-3 flex-1 mb-6">
                  {subscriptionPlan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  data-testid="button-select-onropepro"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Add-ons */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Add-ons & Extras</h3>
          <p className="text-muted-foreground mb-6">
            Enhance your subscription with additional capacity and features
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {addOns.map((addon, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                  <CardDescription className="text-xs">{addon.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="mb-4 flex-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{addon.price}</span>
                      {addon.period && (
                        <span className="text-sm text-muted-foreground">{addon.period}</span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    data-testid={`button-add-${addon.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    Add to Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* FAQ Section */}
        <div className="max-w-3xl">
          <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Can I upgrade or downgrade my plan?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Yes! Upgrade or downgrade at any time. Changes take effect immediately with prorated billing adjustments.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Is there a setup fee?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                No setup fees. You only pay for your chosen plan and any add-ons you select.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Do you offer annual billing discounts?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Contact our sales team to discuss volume discounts and custom annual billing options.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American Express) and process payments through Stripe.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Can I change my plan mid-month?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Absolutely! When you upgrade, you'll only pay the prorated difference. When you downgrade, credit is applied to your account.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Contact our sales team to discuss trial options and custom enterprise arrangements.
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer CTA */}
        <Card className="mt-8 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Ready to get started?</h3>
              <p className="text-muted-foreground mb-4">
                Join rope access companies using OnRopePro to manage their operations efficiently.
              </p>
              <Button className="gap-2" data-testid="button-start-free-trial">
                Start Your Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      </div>
    </ChangelogLayout>
  );
}
