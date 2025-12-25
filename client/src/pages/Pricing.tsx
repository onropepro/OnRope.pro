import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PublicHeader } from "@/components/PublicHeader";
import { trackPricingPageView } from "@/lib/analytics";
import {
  ArrowRight,
  Calendar,
  ClipboardCheck,
  Clock,
  DollarSign,
  FileText,
  HardHat,
  Briefcase,
  Building2,
  Shield,
  Users,
  Package,
  BarChart3,
  MessageSquare,
  Palette,
  TrendingUp,
  CheckCircle2,
  Calculator,
  Wrench,
  AlertTriangle,
  Target
} from "lucide-react";

export default function Pricing() {
  const [techCount, setTechCount] = useState(10);

  useEffect(() => {
    trackPricingPageView({ source: 'pricing_page' });
  }, []);

  const baseCost = 99;
  const perTechCost = 34.95;
  const monthlyCost = baseCost + (perTechCost * techCount);
  const annualCost = monthlyCost * 12;

  const quickReferenceData = [
    { techs: 3, monthly: 204, annual: 2448 },
    { techs: 6, monthly: 309, annual: 3708 },
    { techs: 10, monthly: 449, annual: 5388 },
    { techs: 15, monthly: 624, annual: 7488 },
    { techs: 25, monthly: 973, annual: 11676 },
    { techs: 50, monthly: 1847, annual: 22164 },
  ];

  const timeSavingsData = [
    { without: "6-10 hrs/week on payroll", with: "30-45 minutes", savings: "87-93%" },
    { without: "2-3 hrs per quote", with: "30 minutes", savings: "75%" },
    { without: "45 min finding documents", with: "4 minutes", savings: "91%" },
    { without: "2-3 days scrambling for audits", with: "4 minutes", savings: "98%+" },
    { without: "15-20 min/employee verifying hours", with: "30 seconds", savings: "97%" },
  ];

  const moneyLeaksData = [
    { leak: "Payroll calculation errors", annualLoss: "$1,200-3,600", fix: "Automatic overtime, zero manual math" },
    { leak: "Unbilled hours (forgot to log)", annualLoss: "$12,600+", fix: "GPS-verified time tracking" },
    { leak: "Underbid quotes (no historical data)", annualLoss: "$5,000-15,000", fix: "Historical job costing per building" },
    { leak: "Lost/untracked equipment", annualLoss: "$2,000-4,000", fix: "Full gear inventory with service life alerts" },
    { leak: "Insurance premium overpay", annualLoss: "10-20%", fix: "Documented safety program" },
    { leak: "Emergency equipment purchases", annualLoss: "$1,500-3,000", fix: "Proactive replacement planning" },
  ];

  const operationsModules = [
    { 
      name: "Project Management", 
      description: "Create, track, and close jobs. Assign crews. Monitor progress. Every building, every drop, every hour logged automatically.",
      icon: ClipboardCheck 
    },
    { 
      name: "Scheduling & Calendar", 
      description: "Drag-and-drop crew assignments. Conflict detection. Time-off management. See your entire operation at a glance.",
      icon: Calendar 
    },
    { 
      name: "Time & Work Sessions", 
      description: "Clock in/out from any device. GPS verification. Automatic overtime calculation. No more disputed hours.",
      icon: Clock 
    },
    { 
      name: "Payroll Processing", 
      description: "One-click payroll prep. 87-93% faster than manual. Export to QuickBooks or download CSVs. Zero calculation errors.",
      icon: DollarSign 
    },
  ];

  const safetyModules = [
    { 
      name: "Safety Compliance", 
      description: "SWMS, Toolbox Meetings, Anchor Inspection Certificates, Job Hazard Analyses. Everything auditors and building managers need.",
      icon: Shield 
    },
    { 
      name: "Equipment Inventory", 
      description: "Track every harness, rope, and descender. Serial numbers. Inspection schedules. Service life monitoring.",
      icon: Package 
    },
    { 
      name: "IRATA/SPRAT Task Logging", 
      description: "Technicians log hours toward certification upgrades. Exportable for IRATA/SPRAT audits. Career progression tracked.",
      icon: HardHat 
    },
    { 
      name: "Document Management", 
      description: "Insurance certificates, rope access plans, training records. Upload once, access anywhere, share in seconds.",
      icon: FileText 
    },
  ];

  const clientModules = [
    { 
      name: "Quoting System", 
      description: "Professional multi-service quotes. Historical pricing data. Pipeline tracking. Stop underbidding jobs.",
      icon: Target 
    },
    { 
      name: "Client Management", 
      description: "Building database with service history. Access instructions. Contact management. Know every building's quirks.",
      icon: Building2 
    },
    { 
      name: "Resident Portal", 
      description: "Building residents submit complaints with photos. Your team responds. Building managers see resolution metrics.",
      icon: MessageSquare 
    },
    { 
      name: "Complaint Management", 
      description: "Track, assign, resolve, document. Turn reactive chaos into systematic service. Win contract renewals.",
      icon: AlertTriangle 
    },
  ];

  const workforceModules = [
    { 
      name: "Employee Management", 
      description: "Profiles, certifications, hourly rates, permissions. Onboard new techs in minutes. Expiry alerts for certifications.",
      icon: Users 
    },
    { 
      name: "Company Safety Rating (CSR)", 
      description: "Aggregate safety performance score. Differentiate your company in bids. Insurance documentation simplified.",
      icon: Shield 
    },
    { 
      name: "Performance Analytics", 
      description: "Which techs are fastest? Which buildings take longest? Data-driven decisions replace gut feelings.",
      icon: BarChart3 
    },
    { 
      name: "White-Label Branding", 
      description: "Your logo, your colors. Professional client-facing portal. Look like an enterprise, run like a startup.",
      icon: Palette 
    },
  ];

  const faqData = [
    {
      question: "What if my techs won't use it?",
      answer: "They will. The mobile interface is built for gloved hands and bright sunlight. Clock in with two taps. Log hours in 30 seconds. Techs who've used it say it's faster than texting their hours."
    },
    {
      question: "What about my existing data?",
      answer: "We help you import employees, buildings, and equipment. Most companies are fully operational within a week."
    },
    {
      question: "What if I need to cancel?",
      answer: "Monthly billing. Cancel anytime. No contracts. No cancellation fees. We'd rather earn your business every month than trap you in a contract."
    },
    {
      question: "Is my data secure?",
      answer: "Bank-level encryption. SOC 2 compliant. Your data is backed up daily. You can export everything you've ever entered at any time."
    },
    {
      question: "What about support?",
      answer: "Email support with same-day response. Extensive documentation. Live onboarding call if you want it."
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="employer" />
      
      {/* Hero Section - Employer Blue */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-pricing-label">
              Simple Pricing
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              One Hour. One Tech. One Month.<br />
              <span className="text-blue-100">That's what $34.95 covers.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Stop juggling spreadsheets, text threads, and paper forms. OnRopePro consolidates everything into one platform—so you can run your company instead of chasing it.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild data-testid="button-hero-trial">
                <Link href="/get-license">
                  Start 30-Day Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-hero-demo">
                <Link href="#calculator">
                  See Your Cost
                  <Calculator className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-white dark:fill-slate-950"/>
          </svg>
        </div>
      </section>

      {/* Stats Panel */}
      <section className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
          <Card className="shadow-xl border-0 relative z-20 -mt-20">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-700">10:1</div>
                  <div className="text-sm text-muted-foreground mt-1">Return on Investment</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">22+ hrs</div>
                  <div className="text-sm text-muted-foreground mt-1">Saved per Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600">60 days</div>
                  <div className="text-sm text-muted-foreground mt-1">Pays for Itself</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-violet-600">16</div>
                  <div className="text-sm text-muted-foreground mt-1">Integrated Modules</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <section id="calculator" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            The Formula
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            That's it. No hidden fees. No project limits. No surprises.
          </p>

          {/* Formula Display */}
          <Card className="mb-12 bg-slate-50 dark:bg-slate-900">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-block bg-white dark:bg-slate-800 rounded-lg px-8 py-6 shadow-md mb-6">
                  <code className="text-xl md:text-2xl font-mono font-semibold text-foreground">
                    Monthly Cost = $99 + ($34.95 × technicians)
                  </code>
                </div>
                
                {/* Interactive Calculator */}
                <div className="mt-8 max-w-md mx-auto">
                  <label className="block text-base font-medium mb-3">
                    Your Team Size: <span className="text-blue-600 font-bold">{techCount} technicians</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={techCount}
                    onChange={(e) => setTechCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    data-testid="slider-tech-count"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>1</span>
                    <span>100</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600">${monthlyCost.toFixed(0)}</div>
                      <div className="text-sm text-muted-foreground">per month</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-emerald-600">${annualCost.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">per year</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference Table */}
          <h3 className="text-xl font-semibold text-center mb-6">Quick Reference</h3>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-quick-reference">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Your Team Size</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Monthly</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickReferenceData.map((row, index) => (
                      <tr key={index} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-6 py-4 text-base">{row.techs} technicians</td>
                        <td className="px-6 py-4 text-right font-semibold">${row.monthly}</td>
                        <td className="px-6 py-4 text-right font-semibold text-muted-foreground">${row.annual.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Value Proposition Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why $34.95 Per Tech Makes Sense
          </h2>
          
          <Card className="mb-12 bg-white dark:bg-slate-800">
            <CardContent className="p-8 space-y-4">
              <p className="text-lg">
                <strong>Here's the reality:</strong>
              </p>
              <p className="text-lg text-muted-foreground">
                $34.95 is what you pay a technician for <strong className="text-foreground">one hour of work</strong>.
              </p>
              <p className="text-lg text-muted-foreground">
                OnRopePro saves your average tech <strong className="text-foreground">10+ hours per month</strong> in eliminated paperwork, duplicate onboarding, and manual time tracking.
              </p>
              <p className="text-lg">
                That's a <span className="text-emerald-600 font-bold">10:1 return</span> before you count the bigger wins: eliminated payroll errors, recovered unbilled hours, and contracts you won because building managers saw your professional documentation.
              </p>
            </CardContent>
          </Card>

          {/* Time Savings Table */}
          <h3 className="text-xl font-semibold text-center mb-6">The Hours You're Burning Right Now</h3>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-time-savings">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Without OnRopePro</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">With OnRopePro</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">You Save</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSavingsData.map((row, index) => (
                      <tr key={index} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-6 py-4 text-base text-muted-foreground">{row.without}</td>
                        <td className="px-6 py-4 text-center text-base font-medium">{row.with}</td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-600">{row.savings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-lg font-semibold">Total: 22+ hours recovered per week.</p>
            <p className="text-muted-foreground">At $75/hour owner time, that's <strong className="text-foreground">$85,800/year</strong> in reclaimed productivity.</p>
          </div>
        </div>
      </section>

      {/* Money Leaks Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            The Leaks You Can't See
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Every rope access company bleeds money in ways that don't show up on invoices
          </p>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-money-leaks">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900">
                      <th className="px-6 py-4 text-left text-sm font-semibold">What's Leaking</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Annual Loss</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">OnRopePro Fix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moneyLeaksData.map((row, index) => (
                      <tr key={index} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-6 py-4 text-base">{row.leak}</td>
                        <td className="px-6 py-4 text-center font-semibold text-rose-600">{row.annualLoss}</td>
                        <td className="px-6 py-4 text-right text-base text-muted-foreground">{row.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <p className="text-lg mb-2">
                <strong>Total annual leakage: $22,000-45,000+</strong>
              </p>
              <p className="text-muted-foreground mb-4">
                OnRopePro costs $3,700-12,000/year depending on team size.
              </p>
              <p className="text-xl font-bold text-blue-600">
                The platform pays for itself in the first 60 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-0" />

      {/* What You Get Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything. In One Place.
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            <strong>16 integrated modules.</strong> No add-ons. No "premium tiers" hiding the features you actually need.
          </p>

          <div className="space-y-8">
            {/* Operations Core */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Operations Core</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {operationsModules.map((module, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <module.icon className="w-5 h-5 text-blue-600" />
                        <h4 className="text-lg font-semibold text-foreground">{module.name}</h4>
                      </div>
                      <p className="text-base text-muted-foreground">{module.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Safety & Compliance */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">Safety & Compliance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {safetyModules.map((module, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <module.icon className="w-5 h-5 text-emerald-600" />
                        <h4 className="text-lg font-semibold text-foreground">{module.name}</h4>
                      </div>
                      <p className="text-base text-muted-foreground">{module.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Client & Revenue */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">Client & Revenue</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {clientModules.map((module, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <module.icon className="w-5 h-5 text-violet-600" />
                        <h4 className="text-lg font-semibold text-foreground">{module.name}</h4>
                      </div>
                      <p className="text-base text-muted-foreground">{module.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Workforce */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-orange-50 dark:bg-orange-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">Workforce</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {workforceModules.map((module, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <module.icon className="w-5 h-5 text-orange-600" />
                        <h4 className="text-lg font-semibold text-foreground">{module.name}</h4>
                      </div>
                      <p className="text-base text-muted-foreground">{module.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Your Return on Investment
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12">
            Example: 10-technician company
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ROI Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Annual Platform Cost</span>
                  <span className="font-semibold">$5,388</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Time savings value</span>
                  <span className="font-semibold text-emerald-600">$79,200</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Payroll errors eliminated</span>
                  <span className="font-semibold text-emerald-600">$2,400</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Unbilled hours recovered</span>
                  <span className="font-semibold text-emerald-600">$12,600</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Quote accuracy improvement</span>
                  <span className="font-semibold text-emerald-600">$7,500</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Total Annual Value</span>
                  <span className="font-bold text-xl text-emerald-600">$101,700</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Net Benefit</span>
                  <span className="font-bold text-xl">$96,312</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="p-8 flex flex-col justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-4">1,788%</div>
                  <div className="text-xl font-semibold mb-6">Return on Investment</div>
                  <Separator className="my-6" />
                  <div className="space-y-4 text-left">
                    <p className="text-base">
                      <strong>The Simple Version:</strong>
                    </p>
                    <p className="text-muted-foreground">
                      You're currently losing <strong className="text-rose-600">$22,000-45,000/year</strong> to administrative chaos, payroll errors, and unbilled work.
                    </p>
                    <p className="text-muted-foreground">
                      OnRopePro costs <strong className="text-foreground">$3,700-12,000/year</strong> depending on your team size.
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      The gap is your profit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Social Proof Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Built by Rope Access. For Rope Access.
          </h2>
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-8 space-y-4 text-lg text-muted-foreground">
              <p>
                OnRopePro was built by a Level 3 technician who got tired of watching good companies drown in paperwork.
              </p>
              <p>
                Every feature exists because rope access operators asked for it. Every workflow was tested on actual job sites.
              </p>
              <p>
                This isn't adapted HR software. It's not a generic "field service" platform with rope access sprinkled on top.
              </p>
              <p className="font-semibold text-foreground text-xl">
                It's the system we wished existed when we were running crews.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Questions You're Probably Asking
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12">
            Real answers to real concerns
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left text-base font-medium py-4" data-testid={`accordion-faq-${index}`}>
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 px-4" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Stop the Leaks?
          </h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-xl text-blue-100 mb-2">30-Day Free Trial</p>
              <p className="text-blue-200">Full access to every feature. Cancel anytime. You won't be charged until the trial ends.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild data-testid="button-cta-trial">
                <Link href="/get-license">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-cta-demo">
                <Link href="/contact">
                  Schedule a Demo
                  <Calendar className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <p className="text-blue-200 text-sm pt-4">
              Or: Talk to someone who's been on the ropes. Book a 15-minute call with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Reassurance */}
      <section className="py-8 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-semibold mb-2">
            No contracts. No setup fees. No per-project charges.
          </p>
          <p className="text-slate-400">
            $99/month + $34.95/technician. Everything included.
          </p>
        </div>
      </section>
    </div>
  );
}
