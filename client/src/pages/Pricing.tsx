import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

export default function Pricing() {
  const subscriptionTiers = [
    {
      name: "Basic",
      price: "$79",
      period: "/month (USD/CAD)",
      description: "Perfect for small teams getting started",
      features: [
        { text: "2 Projects", included: true },
        { text: "4 Seats", included: true },
        { text: "Employee Management", included: true },
        { text: "Basic Scheduling", included: true },
        { text: "Standard Support", included: true },
        { text: "Inventory Tracking", included: true },
        { text: "Safety Forms", included: true },
        { text: "White Label Branding", included: false },
        { text: "CRM & Quotes", included: false },
        { text: "Advanced Analytics", included: false }
      ],
      highlighted: false
    },
    {
      name: "Starter",
      price: "$299",
      period: "/month (USD/CAD)",
      description: "Great for growing rope access companies",
      features: [
        { text: "5 Projects", included: true },
        { text: "10 Seats", included: true },
        { text: "Employee Management", included: true },
        { text: "Advanced Scheduling", included: true },
        { text: "Priority Support", included: true },
        { text: "Inventory Tracking", included: true },
        { text: "Safety Forms & Compliance", included: true },
        { text: "White Label Branding", included: false },
        { text: "CRM & Quotes", included: true },
        { text: "Basic Analytics", included: true }
      ],
      highlighted: false
    },
    {
      name: "Premium",
      price: "$499",
      period: "/month (USD/CAD)",
      description: "For established operations with multiple sites",
      features: [
        { text: "9 Projects", included: true },
        { text: "18 Seats", included: true },
        { text: "Employee Management", included: true },
        { text: "Advanced Scheduling", included: true },
        { text: "24/7 Priority Support", included: true },
        { text: "Inventory Tracking", included: true },
        { text: "Safety Forms & Compliance", included: true },
        { text: "White Label Branding", included: true },
        { text: "Full CRM & Quotes Suite", included: true },
        { text: "Advanced Analytics & Reports", included: true }
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "$899",
      period: "/month (USD/CAD)",
      description: "Unlimited scale for large enterprises",
      features: [
        { text: "Unlimited Projects", included: true },
        { text: "Unlimited Seats", included: true },
        { text: "Employee Management", included: true },
        { text: "Enterprise Scheduling", included: true },
        { text: "Dedicated Support", included: true },
        { text: "Inventory Tracking", included: true },
        { text: "Safety Forms & Compliance", included: true },
        { text: "White Label Branding", included: true },
        { text: "Enterprise CRM Suite", included: true },
        { text: "Custom Analytics & Reporting", included: true }
      ],
      highlighted: false
    }
  ];

  const addOns = [
    {
      name: "Additional Seats",
      price: "$19",
      description: "Add 2 more team member seats to your account",
      icon: "👥"
    },
    {
      name: "Extra Projects",
      price: "$49",
      description: "Add one additional project slot to your plan",
      icon: "📋"
    },
    {
      name: "White Label Branding",
      price: "$49",
      period: "/month add-on",
      description: "Customize the platform with your company branding and colors",
      icon: "🎨"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton />
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

        {/* Subscription Tiers */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Subscription Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`flex flex-col ${tier.highlighted ? 'ring-2 ring-primary shadow-lg' : ''}`}
              >
                {tier.highlighted && (
                  <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription className="text-xs">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{tier.price}</span>
                      <span className="text-sm text-muted-foreground">{tier.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 flex-1 mb-6">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-sm">
                        <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          feature.included 
                            ? 'text-emerald-500' 
                            : 'text-muted-foreground/30'
                        }`} />
                        <span className={feature.included ? '' : 'text-muted-foreground/50'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full" 
                    variant={tier.highlighted ? "default" : "outline"}
                    data-testid={`button-select-${tier.name.toLowerCase()}`}
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Add-ons */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Add-ons & Extras</h3>
          <p className="text-muted-foreground mb-6">
            Enhance your subscription with additional capacity and features
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="text-2xl mb-2">{addon.icon}</div>
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
  );
}
