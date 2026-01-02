import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { PublicHeader } from "@/components/PublicHeader";
import { FreeTrialButton } from "@/components/FreeTrialButton";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import { SoftwareReplaces, MODULE_SOFTWARE_MAPPING } from "@/components/SoftwareReplaces";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  Calculator,
  Camera,
  ChevronsUpDown,
  FileText,
  Globe,
  HardHat,
  Home,
  Kanban,
  Layers,
  Lock,
  Shield,
  Users,
  Zap,
  BarChart3,
  Clock,
  FolderKanban,
  ArrowRightLeft
} from "lucide-react";

const ALL_PROBLEM_ITEMS = [
  "employer-1", "employer-2", "employer-3", "employer-4", "employer-5",
  "tech-1", "tech-2",
  "bm-1", "bm-2",
  "pm-1"
];

const ALL_FAQ_ITEMS = [
  "faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "faq-6", "faq-7", "faq-8",
  "faq-9", "faq-10", "faq-11", "faq-12", "faq-13", "faq-14", "faq-15"
];

export default function QuotingSalesLanding() {
  const { t } = useTranslation();
  const [quoteSpeed, setQuoteSpeed] = useState(0);
  const [errorReduction, setErrorReduction] = useState(0);
  const [winRateImprovement, setWinRateImprovement] = useState(0);
  const [pipelineStages, setPipelineStages] = useState(0);

  const [openProblemItems, setOpenProblemItems] = useState<string[]>([]);
  const [openFaqItems, setOpenFaqItems] = useState<string[]>([]);
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);

  const allProblemsExpanded = openProblemItems.length === ALL_PROBLEM_ITEMS.length;
  const allFaqsExpanded = openFaqItems.length === ALL_FAQ_ITEMS.length;

  const toggleAllProblems = () => {
    setOpenProblemItems(allProblemsExpanded ? [] : [...ALL_PROBLEM_ITEMS]);
  };

  const toggleAllFaqs = () => {
    setOpenFaqItems(allFaqsExpanded ? [] : [...ALL_FAQ_ITEMS]);
  };

  useEffect(() => {
    let currentQuoteSpeed = 0;
    let currentErrorReduction = 0;
    let currentWinRateImprovement = 0;
    let currentPipelineStages = 0;

    const interval = setInterval(() => {
      if (currentQuoteSpeed < 85) { currentQuoteSpeed += 2; setQuoteSpeed(Math.min(currentQuoteSpeed, 85)); }
      if (currentErrorReduction < 100) { currentErrorReduction += 3; setErrorReduction(Math.min(currentErrorReduction, 100)); }
      if (currentWinRateImprovement < 40) { currentWinRateImprovement += 1; setWinRateImprovement(Math.min(currentWinRateImprovement, 40)); }
      if (currentPipelineStages < 6) { currentPipelineStages += 1; setPipelineStages(Math.min(currentPipelineStages, 6)); }

      if (currentQuoteSpeed >= 85 && currentErrorReduction >= 100 && currentWinRateImprovement >= 40 && currentPipelineStages >= 6) {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" />

      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}} data-testid="section-hero">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>

        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              {t('modules.quoting.hero.badge', 'Quoting & Sales Pipeline Module')}
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.quoting.hero.title', 'Stop Losing Quotes.')}<br />
              <span className="text-blue-100">{t('modules.quoting.hero.titleHighlight', 'Start Closing Deals.')}</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.quoting.hero.description', 'Your technicians capture site details without seeing your pricing. You turn their data into accurate, professional quotes with automatic labor calculations.')}<br />
              <strong>{t('modules.quoting.hero.descriptionBold', 'No spreadsheets. No calculator errors. No pricing exposure.')}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <FreeTrialButton 
                className="bg-white text-[#0B64A3]" 
                onClick={() => setShowRegistration(true)} 
                testId="button-hero-trial"
              />
              <Button size="lg" variant="outline" className="border-white/40 text-white" onClick={openLogin} data-testid="button-hero-signin">
                Sign In
              </Button>
            </div>
            
            <SoftwareReplaces 
              software={MODULE_SOFTWARE_MAPPING["quoting-sales-pipeline"]} 
              className="mt-8 bg-white/5 rounded-lg mx-auto max-w-2xl [&_span]:text-blue-100 [&_svg]:text-blue-200"
            />
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
      <section className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible" data-testid="section-stats">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
          <Card className="shadow-xl border-0 relative z-20 -mt-20" data-testid="card-stats-panel">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600" data-testid="stat-quote-speed">{quoteSpeed}%</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.quoting.stats.quoteSpeed', 'Faster quote creation')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600" data-testid="stat-error-reduction">{errorReduction}%</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.quoting.stats.errorReduction', 'Calculation errors eliminated')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600" data-testid="stat-win-rate">+{winRateImprovement}%</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.quoting.stats.winRate', 'Win rate improvement')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600" data-testid="stat-pipeline-stages">{pipelineStages}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.quoting.stats.pipelineStages', 'Pipeline stages tracked')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problem Statement Section */}
      <section className="py-16 md:py-20 px-4" data-testid="section-problem-statement">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('modules.quoting.problem.title', "The Quoting Problem That's Bleeding You Dry")}
          </h2>

          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                {t('modules.quoting.problem.scenario', 'You send your tech to assess a complex. Four towers, different elevations, mixed services.')}
              </p>
              <p className="text-base">
                {t('modules.quoting.problem.notes', 'He comes back with hand-scribbled notes on drop counts. You pull out your calculator, multiply hours by rates, add service fees, double-check the math.')}
              </p>
              <p className="text-base">
                {t('modules.quoting.problem.mistake', 'An hour later, you realize you forgot Tower C. Your quote is low by $2,400. You either eat the loss or look incompetent renegotiating.')}
              </p>
              <p className="text-base">
                {t('modules.quoting.problem.competitor', 'Meanwhile, your competitor sent their quote three hours ago. From their phone. With professional formatting. Your property manager already replied to them.')}
              </p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground text-lg">
                {t('modules.quoting.problem.solution', 'OnRopePro eliminates quote calculation errors, protects your pricing strategy from employee exposure, and turns site assessments into professional proposals while your tech is still on-site. Your pricing stays private. Your quotes stay accurate. Your closing rate stops hemorrhaging to faster competitors.')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-0" />

      {/* What This Module Does Section */}
      <section id="features" className="pt-8 md:pt-12 pb-16 md:pb-20 px-4 bg-slate-50 dark:bg-slate-900" data-testid="section-what-module-does">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.quoting.features.title', 'Quote Creation That Protects Your Numbers While Accelerating Your Sales')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.quoting.features.subtitle', 'The Quoting & Sales Pipeline module creates service-specific quotes with automatic labor calculations while maintaining complete financial privacy through granular permission controls.')}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Service-Specific Pricing Models */}
            <Card className="relative overflow-hidden" data-testid="card-service-pricing">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.quoting.features.pricing.title', 'Service-Specific Pricing Models')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.quoting.features.pricing.headline', 'Automatic calculations matched to how you actually price jobs.')}</p>
                <p>{t('modules.quoting.features.pricing.description', 'Window cleaning quotes calculate from drops per elevation and daily targets. Parkade quotes multiply stall counts by your per-stall rate.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.quoting.features.pricing.listTitle', 'What gets calculated automatically:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.quoting.features.pricing.list1', 'Window/building wash: hours from drops and targets')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.quoting.features.pricing.list2', 'Parkade: stalls multiplied by per-stall rate')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.quoting.features.pricing.list3', 'Dryer vent: unit count or hourly pricing')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.quoting.features.pricing.list4', 'Painting: drop count by per-drop rate')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: Financial Privacy Controls */}
            <Card className="relative overflow-hidden" data-testid="card-financial-privacy">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.quoting.features.privacy.title', 'Financial Privacy Controls')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.quoting.features.privacy.headline', 'Your technicians gather site data without seeing what you charge.')}</p>
                <p>{t('modules.quoting.features.privacy.description', 'Financial Access permission determines who sees pricing information. Tech creates the quote, enters building details. You add rates later.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.quoting.features.privacy.listTitle', 'What stays protected:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.quoting.features.privacy.list1', 'Hourly rates by service type')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.quoting.features.privacy.list2', 'Per-drop and per-stall pricing')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.quoting.features.privacy.list3', 'Total quote values and margins')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.quoting.features.privacy.list4', 'Historical pricing data')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Visual Sales Pipeline */}
            <Card className="relative overflow-hidden" data-testid="card-sales-pipeline">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <Kanban className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.quoting.features.pipeline.title', 'Visual Sales Pipeline')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.quoting.features.pipeline.headline', 'Kanban board that shows exactly where every opportunity stands.')}</p>
                <p>{t('modules.quoting.features.pipeline.description', 'Drag quotes from Draft to Submitted to Under Review to Negotiation to Won or Lost. Never lose track of potential contracts.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.quoting.features.pipeline.listTitle', 'What gets tracked:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.quoting.features.pipeline.list1', 'Current stage for every quote')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.quoting.features.pipeline.list2', 'Total opportunity value per stage')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.quoting.features.pipeline.list3', 'Win rates and conversion metrics')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.quoting.features.pipeline.list4', 'Revenue forecasts from pipeline')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Who Benefits Section */}
      <section className="py-16 md:py-20 px-4" data-testid="section-who-benefits">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.quotingSales.benefits.title', 'Who Benefits From This Module')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.quotingSales.benefits.subtitle', 'Quoting clarity for everyone in your operation.')}
          </p>

          <div className="space-y-8">
            {/* For Employers */}
            <Card className="overflow-hidden" data-testid="card-benefits-employers">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.quotingSales.benefits.employers.title', 'For Employers (Company Owners)')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.employers.item1.title', 'Your techs cannot see your pricing.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.employers.item1.description', 'Send anyone to assess a building. They capture drop counts, take photos, enter floor details. Financial Access permission hides all pricing fields from their view.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.employers.item2.title', 'Calculator errors cost you thousands per year.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.employers.item2.description', 'You quote 120 drops at 30 drops per day, calculate 4 days times 8 hours, multiply by $75 per hour. Service-specific formulas eliminate manual calculation errors that lose contracts.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.employers.item3.title', 'Professional quotes close faster.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.employers.item3.description', 'Property managers compare you to competitors. Your PDF quote shows itemized services, building-specific details, professional formatting. You win contracts looking like the professional operation you are.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.employers.item4.title', 'One-click conversion to active project.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.employers.item4.description', 'Quote gets accepted. Click Convert to Project. All data transfers automatically. Budget hours, building location, service specifications, client contact information. Zero double-entry.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.employers.item5.title', 'Pipeline visibility stops lost opportunities.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.employers.item5.description', 'How many quotes did you send last month? Which ones are still pending? Visual Kanban board answers these instantly. Never forget to follow up. Win rates increase when nothing slips through.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Technicians */}
            <Card className="overflow-hidden" data-testid="card-benefits-technicians">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.quotingSales.benefits.technicians.title', 'For Rope Access Technicians')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.technicians.item1.title', 'Capture details without financial pressure.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.technicians.item1.description', 'You assess the site, count drops per elevation, photograph each building face. Pricing fields do not even appear in your interface. No awkward conversations with property managers about costs.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.technicians.item2.title', 'Your phone becomes your assessment tool.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.technicians.item2.description', 'Building data entry works perfectly on mobile. Take photos directly from the quote form. GPS auto-fills building address. Submit the complete assessment before you leave the parking lot.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.technicians.item3.title', 'Build your professional identity.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.technicians.item3.description', 'Creating accurate, detailed quotes demonstrates competence. Property managers remember technicians who show up prepared and document thoroughly. Your reputation builds with every thorough assessment.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Building Managers */}
            <Card className="overflow-hidden" data-testid="card-benefits-building-managers">
              <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.quotingSales.benefits.buildingManagers.title', 'For Building Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.buildingManagers.item1.title', 'Receive itemized quotes that justify decisions.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.buildingManagers.item1.description', 'Quote PDF shows exactly what you are paying for. Window cleaning breaks down by elevation, drop count, and estimated days. When your board asks why you chose this vendor, you show professional documentation.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.buildingManagers.item2.title', 'Compare vendors on specifics, not just price.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.buildingManagers.item2.description', 'Three companies quote your complex. Company A sends a lump sum. OnRopePro vendor sends itemized PDF showing drops per elevation, service breakdown, timeline estimate. Make informed decisions.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.buildingManagers.item3.title', 'Archived quotes become maintenance history.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.buildingManagers.item3.description', 'That window cleaning quote from 2023 shows how many drops were on each elevation before the renovation. Reference actual historical data instead of digging through email archives.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Property Managers */}
            <Card className="overflow-hidden" data-testid="card-benefits-property-managers">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.quotingSales.benefits.propertyManagers.title', 'For Property Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.propertyManagers.item1.title', 'Professional vendors use professional systems.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.propertyManagers.item1.description', 'Portfolio with twenty buildings. You forward quote requests to five companies. Four respond with handwritten notes. One sends OnRopePro quote with building-specific details and professional formatting. You short-list them automatically.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.propertyManagers.item2.title', 'Audit trail for every contracted service.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.propertyManagers.item2.description', 'Your compliance framework requires documented vendor selection rationale. OnRopePro quotes provide itemized scope and professional formatting that satisfy audit requirements.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Residents */}
            <Card className="overflow-hidden" data-testid="card-benefits-residents">
              <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Home className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.quotingSales.benefits.residents.title', 'For Residents')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.quotingSales.benefits.residents.item1.title', 'Transparency about what work is happening.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.quotingSales.benefits.residents.item1.description', 'Your building posts notice: "Window cleaning scheduled for March 15-18." Quote details show your tower\'s drop count, which elevations are being cleaned, and estimated timeline. You understand the scope instead of vague "maintenance work" announcements.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900" data-testid="section-key-features">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.quotingSales.keyFeatures.title', 'Key Features')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.quotingSales.keyFeatures.subtitle', 'Every feature serves a single purpose: eliminate quote errors, protect financial data, and accelerate your sales process.')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card data-testid="card-feature-pricing-formulas">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Calculator className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.quotingSales.keyFeatures.pricingFormulas.title', 'Service-Specific Pricing Formulas')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.quotingSales.keyFeatures.pricingFormulas.description', 'Automatic labor calculations matched to how you price each service type. Window cleaning calculates hours from drops and daily targets. Parkade multiplies stalls by rate. Each service uses its own formula.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-multi-building">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.quotingSales.keyFeatures.multiBuilding.title', 'Multi-Building Tower Support')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.quotingSales.keyFeatures.multiBuilding.description', 'Quote complexes with Tower A, Tower B, Tower C configurations. Each tower has separate floor counts, drop counts, and pricing. Work sessions let technicians select which tower they are working on.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-permissions">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.quotingSales.keyFeatures.permissions.title', 'Granular Financial Permissions')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.quotingSales.keyFeatures.permissions.description', 'Control exactly who sees pricing information. Technicians create quotes without pricing fields appearing. Only users with Financial Access view rates, totals, and profit margins.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-visual-pipeline">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <FolderKanban className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.quotingSales.keyFeatures.visualPipeline.title', 'Visual Sales Pipeline')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.quotingSales.keyFeatures.visualPipeline.description', 'Kanban board showing Draft, Submitted, Under Review, Negotiation, Won, and Lost stages. Track how long quotes spend in each stage. Monitor win rates and forecast revenue.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-photos">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.quotingSales.keyFeatures.photos.title', 'Building Photo Attachments')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.quotingSales.keyFeatures.photos.description', 'Technicians photograph each elevation during site assessment. Photos attach directly to the quote. Verify access points and complications before finalizing pricing.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-conversion">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <ArrowRightLeft className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.quotingSales.keyFeatures.conversion.title', 'One-Click Project Conversion')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.quotingSales.keyFeatures.conversion.description', 'Won quote becomes active project with single button press. Building address, service details, budget hours, client contacts transfer automatically. Zero double-entry errors.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problems Solved Section */}
      <section className="py-16 md:py-20 px-4" data-testid="section-problems-solved">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">{t('modules.quotingSales.problemsSolved.title', 'Problems Solved')}</h2>
            <Button onClick={toggleAllProblems} variant="outline" data-testid="button-toggle-problems">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allProblemsExpanded ? t('modules.quotingSales.problemsSolved.collapseAll', 'Collapse All') : t('modules.quotingSales.problemsSolved.expandAll', 'Expand All')}
            </Button>
          </div>

          <div className="space-y-8">
            {/* For Employers */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <h3 className="text-xl md:text-2xl font-semibold">{t('modules.quotingSales.problemsSolved.forEmployers', 'For Employers')}</h3>
              </div>

              <Accordion type="multiple" value={openProblemItems} onValueChange={setOpenProblemItems} className="space-y-3">
                <AccordionItem value="employer-1" className="border rounded-lg px-4" data-testid="accordion-employer-1">
                  <AccordionTrigger className="text-left font-medium py-4">
                    {t('modules.quotingSales.problemsSolved.employer1.trigger', '"I sent my new tech to quote a building. He came back with the client\'s budget expectations and quoted below our minimum margin."')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.thePain', 'The Pain:')}</span> {t('modules.quotingSales.problemsSolved.employer1.pain', 'You need people gathering site data. The moment they have quoting access, they see your pricing strategy. Your tech tells the property manager "usually runs about $X per drop" based on what he saw in the system.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.realExample', 'Real Example:')}</span> {t('modules.quotingSales.problemsSolved.employer1.example', 'Your tech mentions pricing to the property manager. Property manager uses that to negotiate you down. Your margin compresses before you even submit the official quote.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.solution', 'Solution:')}</span> {t('modules.quotingSales.problemsSolved.employer1.solution', 'Financial Access permission separates site assessment from pricing visibility. Technician enters drops, elevations, building details, photos. Pricing fields do not exist in his interface.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.benefit', 'Benefit:')}</span> {t('modules.quotingSales.problemsSolved.employer1.benefit', 'Your pricing strategy stays private until you are ready to present the formal quote. No accidental disclosure, no margin compression from employee conversations.')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="employer-2" className="border rounded-lg px-4" data-testid="accordion-employer-2">
                  <AccordionTrigger className="text-left font-medium py-4">
                    {t('modules.quotingSales.problemsSolved.employer2.trigger', '"I quoted a complex at $4,800. After we started, I realized I forgot Tower C in my calculations. We did $6,200 of work for $4,800."')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.thePain', 'The Pain:')}</span> {t('modules.quotingSales.problemsSolved.employer2.pain', 'Four towers, different elevations, varying drop counts per elevation. You are calculating on your phone between site visits. Your notes say "Tower C: same as Tower A" but Tower C actually has 40% more drops.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.realExample', 'Real Example:')}</span> {t('modules.quotingSales.problemsSolved.employer2.example', 'You discover the error after the contract is signed. You either eat a $1,400 loss or look incompetent asking to renegotiate.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.solution', 'Solution:')}</span> {t('modules.quotingSales.problemsSolved.employer2.solution', 'Service-specific formulas eliminate manual calculation errors. Enter drops per elevation for each tower. System calculates total hours from drops and your daily productivity target automatically.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.benefit', 'Benefit:')}</span> {t('modules.quotingSales.problemsSolved.employer2.benefit', 'No calculator errors, no forgotten buildings, no surprise losses when you realize your math was wrong. Quote total updates automatically as you enter data.')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="employer-3" className="border rounded-lg px-4" data-testid="accordion-employer-3">
                  <AccordionTrigger className="text-left font-medium py-4">
                    {t('modules.quotingSales.problemsSolved.employer3.trigger', '"Property manager chose my competitor because they sent their quote three hours after the site visit. Mine took two days."')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.thePain', 'The Pain:')}</span> {t('modules.quotingSales.problemsSolved.employer3.pain', 'Your tech assesses the building Tuesday morning. Takes notes on paper. Texts you drop counts. You enter data into spreadsheet that night. Create PDF Wednesday afternoon. Email it Thursday morning.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.realExample', 'Real Example:')}</span> {t('modules.quotingSales.problemsSolved.employer3.example', 'Property manager already signed with the company that sent their quote Tuesday at 2pm. They beat you by 48 hours.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.solution', 'Solution:')}</span> {t('modules.quotingSales.problemsSolved.employer3.solution', 'Mobile quote creation eliminates the assessment-to-quote delay. Technician completes site assessment on phone. You open the quote later, add pricing, generate PDF, send.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.benefit', 'Benefit:')}</span> {t('modules.quotingSales.problemsSolved.employer3.benefit', 'Same-day quote delivery becomes standard instead of exceptional. You stop losing opportunities to competitors who quote faster.')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="employer-4" className="border rounded-lg px-4" data-testid="accordion-employer-4">
                  <AccordionTrigger className="text-left font-medium py-4">
                    {t('modules.quotingSales.problemsSolved.employer4.trigger', '"I have twelve quotes in various stages but no idea which ones are actually moving forward."')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.thePain', 'The Pain:')}</span> {t('modules.quotingSales.problemsSolved.employer4.pain', 'Draft folder has quotes from three months ago you never finished. Sent folder has quotes you are waiting to hear back on, but you forgot which ones. Email searches try to find conversations, buried in 400 unread messages.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.realExample', 'Real Example:')}</span> {t('modules.quotingSales.problemsSolved.employer4.example', 'You lose track of real opportunities while busy creating new quotes. That $8,000 job slipped through because you forgot to follow up.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.solution', 'Solution:')}</span> {t('modules.quotingSales.problemsSolved.employer4.solution', 'Visual pipeline shows exactly where every quote stands. Submitted stage shows quotes waiting for client response. Under Review stage shows active negotiations. Dashboard shows quotes that have been in one stage too long.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.benefit', 'Benefit:')}</span> {t('modules.quotingSales.problemsSolved.employer4.benefit', 'Pipeline visibility prevents lost opportunities and forgotten follow-ups. Track total opportunity value per stage. Set reminders for follow-ups.')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="employer-5" className="border rounded-lg px-4" data-testid="accordion-employer-5">
                  <AccordionTrigger className="text-left font-medium py-4">
                    {t('modules.quotingSales.problemsSolved.employer5.trigger', '"My competitor\'s quotes look professional with company branding. Mine look like everyone else\'s basic PDF."')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.thePain', 'The Pain:')}</span> {t('modules.quotingSales.problemsSolved.employer5.pain', 'Generic quote template with standard fonts. No logo. No company colors. Property managers receive five quotes for their building. Four look identical.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.realExample', 'Real Example:')}</span> {t('modules.quotingSales.problemsSolved.employer5.example', 'One vendor has professional branding, clean layout, itemized services with clear explanations. That vendor gets remembered. That vendor gets callbacks.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.solution', 'Solution:')}</span> {t('modules.quotingSales.problemsSolved.employer5.solution', 'White-label branding customizes your quote PDFs with your logo, company colors, and professional formatting. Property managers see your brand identity on every document.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.benefit', 'Benefit:')}</span> {t('modules.quotingSales.problemsSolved.employer5.benefit', 'Professional presentation reinforces premium positioning. Your quotes stand out in the pile of generic submissions from competitors still using default templates.')}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* For Technicians */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b">
                <HardHat className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl md:text-2xl font-semibold">{t('modules.quotingSales.problemsSolved.forTechnicians', 'For Technicians')}</h3>
              </div>

              <Accordion type="multiple" value={openProblemItems} onValueChange={setOpenProblemItems} className="space-y-3">
                <AccordionItem value="tech-1" className="border rounded-lg px-4" data-testid="accordion-tech-1">
                  <AccordionTrigger className="text-left font-medium py-4">
                    {t('modules.quotingSales.problemsSolved.tech1.trigger', '"Boss asks me to quote buildings but gets mad when I mention pricing to property managers."')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.thePain', 'The Pain:')}</span> {t('modules.quotingSales.problemsSolved.tech1.pain', 'You assess the building. Property manager asks "about how much for window cleaning?" You saw the rate in the system last week. You say "probably around $X per drop." Boss finds out you discussed pricing.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.realExample', 'Real Example:')}</span> {t('modules.quotingSales.problemsSolved.tech1.example', 'You get lectured about "letting him handle that part." Except you are the one talking to the client and trying to be helpful.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.solution', 'Solution:')}</span> {t('modules.quotingSales.problemsSolved.tech1.solution', 'Financial Access permission removes pricing visibility from technician interface. You cannot accidentally quote rates because you have never seen them.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.benefit', 'Benefit:')}</span> {t('modules.quotingSales.problemsSolved.tech1.benefit', 'Property manager asks about pricing. You confidently say "my manager will send detailed pricing today" because that is your actual workflow. No awkward trying-to-remember-if-you-are-allowed-to-say conversations.')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tech-2" className="border rounded-lg px-4" data-testid="accordion-tech-2">
                  <AccordionTrigger className="text-left font-medium py-4">
                    {t('modules.quotingSales.problemsSolved.tech2.trigger', '"I photograph buildings on my phone but then forget to send them when I\'m back in the truck."')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.thePain', 'The Pain:')}</span> {t('modules.quotingSales.problemsSolved.tech2.pain', 'Elevation photos on camera roll. Drop count notes in phone notepad. Building address in text message to yourself. Information scattered across multiple apps, multiple messages, multiple headaches.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.realExample', 'Real Example:')}</span> {t('modules.quotingSales.problemsSolved.tech2.example', 'Get back to shop. Boss asks for the assessment. You text him the photos. He asks for drop counts. You send that separately. He asks for building address. You look it up again.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.solution', 'Solution:')}</span> {t('modules.quotingSales.problemsSolved.tech2.solution', 'Quote form accepts photos directly from phone camera. Building address auto-fills from GPS. Drop counts enter in structured fields with elevation labels. Everything lives in one quote record.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.benefit', 'Benefit:')}</span> {t('modules.quotingSales.problemsSolved.tech2.benefit', 'Submit from parking lot before leaving site. Complete assessment delivered to manager while building details are fresh in your memory.')}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* For Building Managers */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b">
                <Building2 className="w-5 h-5 text-violet-500" />
                <h3 className="text-xl md:text-2xl font-semibold">{t('modules.quotingSales.problemsSolved.forBuildingManagers', 'For Building Managers')}</h3>
              </div>

              <Accordion type="multiple" value={openProblemItems} onValueChange={setOpenProblemItems} className="space-y-3">
                <AccordionItem value="bm-1" className="border rounded-lg px-4" data-testid="accordion-bm-1">
                  <AccordionTrigger className="text-left font-medium py-4">
                    {t('modules.quotingSales.problemsSolved.bm1.trigger', '"I approved a window cleaning quote, then discovered they only quoted two towers out of four."')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.thePain', 'The Pain:')}</span> {t('modules.quotingSales.problemsSolved.bm1.pain', 'Vendor submitted lump sum quote: "Window cleaning service - $3,200." You approved it. Work started. Crew only brought enough supplies for half the complex.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.realExample', 'Real Example:')}</span> {t('modules.quotingSales.problemsSolved.bm1.example', 'Vendor explains "the quote only covered the north towers." Nothing in the quote specified which buildings. Your fault for not asking. Their fault for not clarifying. Everyone frustrated.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.solution', 'Solution:')}</span> {t('modules.quotingSales.problemsSolved.bm1.solution', 'OnRopePro quotes break down work by specific towers. Quote shows Tower A: 80 drops, Tower B: 95 drops, Tower C: 75 drops, Tower D: 90 drops. Total drop count listed. Each elevation itemized.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.benefit', 'Benefit:')}</span> {t('modules.quotingSales.problemsSolved.bm1.benefit', 'Before approving, you verify all buildings are included in scope. No surprises on work day about what is covered versus what costs extra.')}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="bm-2" className="border rounded-lg px-4" data-testid="accordion-bm-2">
                  <AccordionTrigger className="text-left font-medium py-4">
                    {t('modules.quotingSales.problemsSolved.bm2.trigger', '"Vendor quoted my building last year but I can\'t find the email to reference the scope."')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.thePain', 'The Pain:')}</span> {t('modules.quotingSales.problemsSolved.bm2.pain', 'Planning this year\'s window cleaning. Last year\'s vendor did good work. You want the same scope and service. Email search for last year\'s quote returns seventeen unrelated messages.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.realExample', 'Real Example:')}</span> {t('modules.quotingSales.problemsSolved.bm2.example', 'Eventually find it attached to a forwarded message in a thread about a different building. Quote shows a single price. No breakdown of what was actually included.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.solution', 'Solution:')}</span> {t('modules.quotingSales.problemsSolved.bm2.solution', 'OnRopePro vendors\' historical quotes stay in the system with building association. Next year, vendor references last year\'s quote. Sees same drop counts, same elevations, same service breakdown.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.benefit', 'Benefit:')}</span> {t('modules.quotingSales.problemsSolved.bm2.benefit', 'Compare quotes year-over-year to verify scope consistency. Historical data accessible without email archaeology.')}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* For Property Managers */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b">
                <Globe className="w-5 h-5 text-emerald-500" />
                <h3 className="text-xl md:text-2xl font-semibold">{t('modules.quotingSales.problemsSolved.forPropertyManagers', 'For Property Managers')}</h3>
              </div>

              <Accordion type="multiple" value={openProblemItems} onValueChange={setOpenProblemItems} className="space-y-3">
                <AccordionItem value="pm-1" className="border rounded-lg px-4" data-testid="accordion-pm-1">
                  <AccordionTrigger className="text-left font-medium py-4">
                    {t('modules.quotingSales.problemsSolved.pm1.trigger', '"I can\'t justify vendor selection to the board because quotes don\'t show enough detail."')}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base text-muted-foreground pb-4">
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.thePain', 'The Pain:')}</span> {t('modules.quotingSales.problemsSolved.pm1.pain', 'Board meeting agenda: approve window cleaning contract. You selected Vendor B at $8,400 over Vendor A at $7,200. Board member asks "why are we paying $1,200 more?"')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.realExample', 'Real Example:')}</span> {t('modules.quotingSales.problemsSolved.pm1.example', 'Vendor B\'s quote says "Window cleaning - $8,400." Vendor A\'s quote says "Window cleaning - $7,200." You explain "Vendor B is more professional" but have zero documentation supporting that statement.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.solution', 'Solution:')}</span> {t('modules.quotingSales.problemsSolved.pm1.solution', 'OnRopePro quotes provide itemized scope justifying price differences. Vendor B quote shows 340 total drops across four elevations, 8-day timeline, includes parkade pressure washing.')}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t('modules.quotingSales.problemsSolved.benefit', 'Benefit:')}</span> {t('modules.quotingSales.problemsSolved.pm1.benefit', 'Board member reviews detailed breakdown. Vendor B approval becomes defensible decision based on documented scope rather than "they seemed good."')}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Module Integrations Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900" data-testid="section-integrations">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.quotingSales.integrations.title', 'Module Integration Points')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.quotingSales.integrations.subtitle', 'Quoting integrates with four other modules to create seamless workflow from first site assessment through project completion.')}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card data-testid="card-integration-project-management">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-base font-medium">{t('modules.quotingSales.integrations.projectManagement.title', 'Project Management')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">{t('modules.quotingSales.integrations.projectManagement.description', 'Won quotes convert to active projects with single click. Building address, service specifications, budget hours transfer automatically.')}</p>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('modules.quotingSales.integrations.projectManagement.benefit', 'Budget tracking compares actual vs quoted hours')}</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-work-sessions">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-base font-medium">{t('modules.quotingSales.integrations.workSessions.title', 'Work Sessions & Time Tracking')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">{t('modules.quotingSales.integrations.workSessions.description', 'Multi-building quotes with tower configurations enable tower-specific time tracking. Technicians clock in and select which tower they are working on.')}</p>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('modules.quotingSales.integrations.workSessions.benefit', 'Quote scope matches work session structure')}</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-resident-portal">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Home className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-base font-medium">{t('modules.quotingSales.integrations.residentPortal.title', 'Resident Portal')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">{t('modules.quotingSales.integrations.residentPortal.description', 'Building associations from quotes enable tower-specific resident notifications. Residents see updates about work happening on their specific tower.')}</p>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('modules.quotingSales.integrations.residentPortal.benefit', 'Quote scope informs accurate work notices')}</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-employee-management">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-base font-medium">{t('modules.quotingSales.integrations.employeeManagement.title', 'Employee Management')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">{t('modules.quotingSales.integrations.employeeManagement.description', 'Financial Access permission controls quote pricing visibility. Permission inheritance means operational managers can create quotes without seeing company-wide financial data.')}</p>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('modules.quotingSales.integrations.employeeManagement.benefit', 'Granular controls protect sensitive information')}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2" data-testid="card-integration-analytics">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-base font-medium">{t('modules.quotingSales.integrations.analytics.title', 'Analytics Dashboard')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">{t('modules.quotingSales.integrations.analytics.description', 'Pipeline metrics track total opportunity value per stage, win rates, conversion percentages, and revenue forecasting. Win/loss analysis reveals which service types close at higher rates.')}</p>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('modules.quotingSales.integrations.analytics.benefit', 'Historical data informs pricing strategy and sales optimization')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-20 px-4" data-testid="section-faqs">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">{t('modules.quotingSales.faqs.title', 'Frequently Asked Questions')}</h2>
            <Button onClick={toggleAllFaqs} variant="outline" data-testid="button-toggle-faqs">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allFaqsExpanded ? t('modules.quotingSales.faqs.collapseAll', 'Collapse All') : t('modules.quotingSales.faqs.expandAll', 'Expand All')}
            </Button>
          </div>

          <Accordion type="multiple" value={openFaqItems} onValueChange={setOpenFaqItems} className="space-y-3">
            <AccordionItem value="faq-1" className="border rounded-lg px-4" data-testid="accordion-faq-1">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq1.question', 'Can technicians create quotes without seeing pricing?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq1.answer', 'Yes. Financial Access permission controls pricing visibility completely separately from quote creation access. Technicians see fields for drops per elevation, building details, service types, and photos. Pricing fields do not appear in their interface at all. You enter rates after they submit the site assessment.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4" data-testid="accordion-faq-2">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq2.question', 'What happens to quotes when technicians leave?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq2.answer', 'Quote ownership transfers to their supervisor or you can reassign to another employee. Historical quotes remain in the system with building association intact. Employee departure does not delete quote history or building data. Permission changes instantly revoke access to active quotes.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4" data-testid="accordion-faq-3">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq3.question', 'How do service-specific formulas work?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq3.answer', 'Each service type has its own calculation model. Window cleaning calculates hours from drops per elevation divided by your daily productivity target. Parkade multiplies total stalls by per-stall rate. Dryer vent switches between per-unit and hourly models. You configure your rates and productivity targets once, then the system calculates labor automatically for every quote.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4" data-testid="accordion-faq-4">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq4.question', 'Can I quote multiple buildings in one quote?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq4.answer', 'Yes. Multi-building support handles complexes with Tower A, Tower B, Tower C configurations. Each tower has separate floor counts, drop counts, and calculations. Total quote combines all towers. When converted to project, work sessions let technicians select which tower they are working on. Resident portal shows tower-specific updates.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4" data-testid="accordion-faq-5">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq5.question', 'Do quotes automatically email to clients?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq5.answer', 'Currently no. Quote PDFs download to your device, then you email from your own email address. Future update will enable direct sending from vendor@yourcompany.com with proper DNS configuration. Download approach ensures quotes come from your recognized email address.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4" data-testid="accordion-faq-6">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq6.question', 'What if my pricing model does not match the built-in formulas?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq6.answer', 'Custom service type allows completely configurable pricing. Define your own calculation variables, labor multipliers, and service fee structures. If you need a specific formula added as a standard service type, contact support. Formula requests from multiple vendors get prioritized for system-wide implementation.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4" data-testid="accordion-faq-7">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq7.question', 'How does tax calculation work?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq7.answer', 'Tax configuration will be based on building address (province/state determines rate). System calculates applicable taxes automatically. Currently being implemented. You can enter taxes manually in the interim. Future update will support dual-tax jurisdictions (GST + PST scenarios) with override capabilities for edge cases.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4" data-testid="accordion-faq-8">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq8.question', 'Can I edit quotes after they are in "Submitted" or "Under Review"?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq8.answer', 'Yes. Drag quote back to Draft stage, make edits, then move forward again. Edit history tracks changes for internal audit trail. Property manager only sees current version. You cannot edit quotes in Won stage (convert to project instead). Lost quotes archive for historical reference.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4" data-testid="accordion-faq-9">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq9.question', 'What permissions do operations managers need to create quotes?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq9.answer', 'Create Quotes permission enables quote creation. Financial Access permission determines if they see pricing fields. You can grant quote creation without financial visibility. They assess buildings, create scopes, move quotes through pipeline. You review and add final pricing before client delivery.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-10" className="border rounded-lg px-4" data-testid="accordion-faq-10">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq10.question', 'How do quotes convert to projects?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq10.answer', 'Won quote stage includes "Convert to Project" button. Click button. System creates new project with building address, service details, budget hours, client contacts, tower configurations, pricing data. Quote remains in Won stage for reference. Project links back to original quote for historical context.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-11" className="border rounded-lg px-4" data-testid="accordion-faq-11">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq11.question', 'Can I track win/loss reasons for pipeline analytics?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq11.answer', 'Yes. When marking quote as Lost, you categorize reason (price too high, chose competitor, timeline did not work, etc.). Analytics track loss reasons over time. Identify patterns like "losing 60% of quotes to faster competitors" or "price objections on parkade services." Data informs pricing strategy and process improvements.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-12" className="border rounded-lg px-4" data-testid="accordion-faq-12">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq12.question', 'Do building photos increase quote file size?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq12.answer', 'Photos compress automatically for system storage. Original quality preserved for reference viewing. Quote PDFs include photos at print-appropriate resolution without creating massive file sizes. Download speeds stay fast even with multiple elevation photos attached.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-13" className="border rounded-lg px-4" data-testid="accordion-faq-13">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq13.question', 'What happens if property manager requests changes to accepted quote?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq13.answer', 'Depends on change scope. Minor adjustments (different dates, tower sequence) you can note in project details. Significant changes (added buildings, different services) create new quote version as change order. Original quote stays in Won stage. New quote references original for audit trail.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-14" className="border rounded-lg px-4" data-testid="accordion-faq-14">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq14.question', 'Can I duplicate quotes for similar buildings?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq14.answer', 'Yes. "Duplicate Quote" function copies building template with service selections and configurations. You update building-specific details (address, drop counts, elevations). Pricing models stay identical. Useful for annual renewals or similar complexes in same area. Saves 80% of quote setup time.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-15" className="border rounded-lg px-4" data-testid="accordion-faq-15">
              <AccordionTrigger className="text-left font-medium py-4">{t('modules.quotingSales.faqs.faq15.question', 'How long does pipeline data persist?')}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('modules.quotingSales.faqs.faq15.answer', 'Forever. Won and Lost quotes archive with full historical data. Reference last year\'s pricing when client requests renewal. Track win rates over multi-year periods. Building associations preserve maintenance history across ownership changes. Data belongs to your company permanently.')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white" data-testid="section-final-cta">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('modules.quotingSales.finalCta.title', 'Stop Calculating. Start Closing.')}
          </h2>
          <p className="text-xl text-blue-100 mb-4 max-w-2xl mx-auto leading-relaxed">
            {t('modules.quotingSales.finalCta.description1', 'You waste 6-8 hours per week on quote calculations. Multiply drop counts by rates, add elevation factors, cross-reference service fees, double-check the math. Your property manager asks about that complex you assessed Thursday. You say "I will get you pricing by tomorrow" because tonight you are calculating quotes instead of doing literally anything else.')}
          </p>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('modules.quotingSales.finalCta.description2', 'OnRopePro eliminates quote calculation time completely. Same-day quote delivery becomes your standard. Calculator apps get deleted from your phone. You reclaim eight hours per week.')}
          </p>
          <FreeTrialButton 
            className="bg-white text-blue-700" 
            onClick={() => setShowRegistration(true)} 
            testId="button-final-cta"
          />
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-16"></div>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}
