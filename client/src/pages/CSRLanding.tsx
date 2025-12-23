import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import { SoftwareReplaces, MODULE_SOFTWARE_MAPPING } from "@/components/SoftwareReplaces";
import { useTranslation } from "react-i18next";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Briefcase,
  HardHat,
  Users,
  Eye,
  AlertTriangle,
  FileText,
  Gauge,
  ClipboardCheck,
  FileCheck,
  Palette,
  Download,
  TrendingUp,
  Clock,
  Award,
  Target,
  ShieldCheck,
  ClipboardList,
  Wrench,
  Building2,
  UserCheck,
  Zap,
  Link2,
  MessagesSquare,
  HelpCircle
} from "lucide-react";

export default function CSRLanding() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              {t('modules.csr.hero.badge', 'Company Safety Rating Module')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.csr.hero.titleLine1', 'Know exactly how safe')}<br />
              {t('modules.csr.hero.titleLine2', 'your company is.')}<br />
              <span className="text-blue-100">{t('modules.csr.hero.titleLine3', 'Prove it to anyone who asks.')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.csr.hero.description', 'The Company Safety Rating transforms scattered paperwork and good intentions into a single, auditable number. Property managers see it when comparing vendors. Technicians see it when evaluating job offers.')}<br />
              <strong>{t('modules.csr.hero.descriptionStrong', 'You see it when building a culture that protects your people and your business.')}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-hero-trial">
                {t('modules.csr.hero.ctaTrial', 'Start Your Free 60-Day Trial')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-hero-signin">
                {t('modules.csr.hero.signIn', 'Sign In')}
              </Button>
            </div>
            
            <SoftwareReplaces 
              software={MODULE_SOFTWARE_MAPPING["company-safety-rating"]} 
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
      <section className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
          <Card className="shadow-xl border-0 relative z-20 -mt-20">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">{t('modules.csr.stats.auditTimeValue', '5 min')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.csr.stats.auditPreparation', 'Safety Audit prep')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-sky-600">{t('modules.csr.stats.signaturesValue', '100%')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.csr.stats.signaturesTracked', 'Employee signatures tracked')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">{t('modules.csr.stats.realTimeValue', 'Real-Time')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.csr.stats.scoreUpdates', 'Score updates')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">{t('modules.csr.stats.pdfExportValue', '1-Click')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.csr.stats.pdfExportDesc', 'PDF export with timestamps')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problem Statement Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('modules.csr.problem.title', 'The Safety Problem Nobody Talks About')}
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                {t('modules.csr.problem.intro', "Every rope access company says they're safe. Every one of them.")}
              </p>
              <p className="text-base">
                {t('modules.csr.problem.paragraph1', "But when WorkSafe shows up and asks for proof, most operators scramble through filing cabinets, truck glove boxes, and text message threads looking for documentation that may or may not exist. When a property manager asks which vendor is safer, they're comparing marketing claims, not evidence. When a technician decides whether to accept a job, they're gambling their life on an employer's word.")}
              </p>
              <p className="text-base font-medium text-foreground">
                {t('modules.csr.problem.highlight', "Safety without measurement is just hope. And hope is not a strategy when someone's hanging 40 stories up.")}
              </p>
              <Separator className="my-6" />
              <p className="text-base">
                {t('modules.csr.problem.solution', 'OnRopePro\'s Company Safety Rating changes the conversation. Instead of "we\'re safe," you get a number: 87%. Instead of scattered forms, you get a single dashboard showing exactly where you stand and what needs attention. Instead of guessing, you know.')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-0" />

      {/* What This Module Does Section */}
      <section id="features" className="pt-8 md:pt-12 pb-16 md:pb-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.csr.features.title', 'What the CSR Module Does')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.csr.features.subtitle', 'A penalty-based compliance scoring system that measures safety posture in real time.')}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Automatic Score Calculation */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <Gauge className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.csr.features.autoScore.title', 'Automatic Score Calculation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.csr.features.autoScore.intro', 'The system tracks every safety document, every harness inspection, every toolbox meeting.')}</p>
                <p>{t('modules.csr.features.autoScore.description', 'Your score updates automatically as compliance events occur across your operation. No manual entry. No spreadsheets. No remembering to update anything.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.csr.features.autoScore.tracked', 'What gets tracked:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.csr.features.autoScore.item1', 'Core company documents (COI, Health & Safety Manual, Company Policy)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.csr.features.autoScore.item2', 'Project-level safety documentation (FLHA, RAP, Toolbox Meeting, Anchor Inspection)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.csr.features.autoScore.item3', 'Daily harness inspection completion rates')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.csr.features.autoScore.item4', 'Employee acknowledgment status on all safety documents')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: Transparent Visibility */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.csr.features.visibility.title', 'Transparent Visibility')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.csr.features.visibility.intro', 'Different stakeholders see appropriate levels of detail.')}</p>
                <p>{t('modules.csr.features.visibility.description', 'Property managers see your overall score and color-coded compliance badge. Company owners see full breakdowns with improvement recommendations. Technicians see enough to make informed decisions about employers.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.csr.features.visibility.roles', 'What each role sees:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Users className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span><strong>{t('modules.csr.features.visibility.pmLabel', 'Property Managers:')}</strong> {t('modules.csr.features.visibility.pmValue', 'Overall %, color badge, category breakdown')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                    <span><strong>{t('modules.csr.features.visibility.ownerLabel', 'Company Owners:')}</strong> {t('modules.csr.features.visibility.ownerValue', 'Full dashboard, action items, improvement tips')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <HardHat className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                    <span><strong>{t('modules.csr.features.visibility.techLabel', 'Technicians:')}</strong> {t('modules.csr.features.visibility.techValue', 'Company CSR when evaluating job offers')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Penalty-Based Accountability */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.csr.features.penalty.title', 'Penalty-Based Accountability')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.csr.features.penalty.intro', 'Start at 75%. Reach 100% by uploading three core documents.')}</p>
                <p>{t('modules.csr.features.penalty.description', "From there, every compliance gap triggers a proportional penalty. Miss a harness inspection? Penalty. Toolbox meeting not completed? Penalty. Employee hasn't signed updated safety procedures? Penalty.")}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.csr.features.penalty.creates', 'What creates penalties:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                    <span>{t('modules.csr.features.penalty.item1', 'Missing or expired company documentation (up to 25%)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                    <span>{t('modules.csr.features.penalty.item2', 'Incomplete project documentation (up to 25%)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                    <span>{t('modules.csr.features.penalty.item3', 'Harness inspections not completed before work (up to 25%)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                    <span>{t('modules.csr.features.penalty.item4', 'Unsigned employee acknowledgments (up to 5%)')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* CSR Rating Tiers Visual */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.csr.tiers.title', 'Rating Tiers')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.csr.tiers.subtitle', 'Your CSR score determines your rating tier, displayed as a color-coded badge visible to property managers.')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Green - Excellent */}
            <div className="rounded-xl p-6 text-center bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4 ring-4 ring-green-200 dark:ring-green-800">
                <span className="text-white font-bold text-lg">90+</span>
              </div>
              <p className="font-semibold text-green-700 dark:text-green-300">{t('modules.csr.tiers.green.name', 'Green')}</p>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">{t('modules.csr.tiers.green.label', 'Excellent')}</p>
              <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-2">{t('modules.csr.tiers.green.description', 'Strong safety culture, highly compliant')}</p>
            </div>

            {/* Yellow - Good */}
            <div className="rounded-xl p-6 text-center bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mb-4 ring-4 ring-yellow-200 dark:ring-yellow-800">
                <span className="text-white font-bold text-lg">70+</span>
              </div>
              <p className="font-semibold text-yellow-700 dark:text-yellow-300">{t('modules.csr.tiers.yellow.name', 'Yellow')}</p>
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{t('modules.csr.tiers.yellow.label', 'Good')}</p>
              <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80 mt-2">{t('modules.csr.tiers.yellow.description', 'Solid foundation, minor gaps to address')}</p>
            </div>

            {/* Orange - Warning */}
            <div className="rounded-xl p-6 text-center bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-4 ring-4 ring-orange-200 dark:ring-orange-800">
                <span className="text-white font-bold text-lg">50+</span>
              </div>
              <p className="font-semibold text-orange-700 dark:text-orange-300">{t('modules.csr.tiers.orange.name', 'Orange')}</p>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t('modules.csr.tiers.orange.label', 'Warning')}</p>
              <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-2">{t('modules.csr.tiers.orange.description', 'Significant gaps requiring attention')}</p>
            </div>

            {/* Red - Critical */}
            <div className="rounded-xl p-6 text-center bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4 ring-4 ring-red-200 dark:ring-red-800">
                <span className="text-white font-bold text-lg">&lt;50</span>
              </div>
              <p className="font-semibold text-red-700 dark:text-red-300">{t('modules.csr.tiers.red.name', 'Red')}</p>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">{t('modules.csr.tiers.red.label', 'Critical')}</p>
              <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-2">{t('modules.csr.tiers.red.description', 'Serious compliance issues')}</p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Stakeholder Benefits Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.csr.stakeholders.title', 'Who Benefits From This Module')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.csr.stakeholders.subtitle', 'Safety visibility for everyone who needs it. Privacy for everyone who doesn\'t.')}
          </p>

          <div className="space-y-8">
            {/* For Employers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.csr.stakeholders.employers.title', 'For Employers (Company Owners)')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.csr.stakeholders.employers.benefit1Title', 'Replace guesswork with certainty.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.csr.stakeholders.employers.benefit1Desc', 'You know your crews are safe. You believe in your training. But until now, you had no objective proof. The CSR gives you a single number that reflects your actual compliance posture, updated in real time.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.csr.stakeholders.employers.benefit2Title', 'Turn safety into competitive advantage.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.csr.stakeholders.employers.benefit2Desc', "When a property manager compares your 91% rating against a competitor's 47%, they're not comparing marketing materials. They're comparing documented evidence of safety culture.")}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.csr.stakeholders.employers.benefit3Title', 'Protect yourself from regulatory nightmares.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.csr.stakeholders.employers.benefit3Desc', 'When WorkSafe arrives, pull up a dashboard showing every harness inspection, every signed document, with timestamps and signatures. Multi-day scrambles become five-minute conversations.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Technicians */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.csr.stakeholders.technicians.title', 'For Technicians')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.csr.stakeholders.technicians.benefit1Title', 'Evaluate employers before accepting jobs.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.csr.stakeholders.technicians.benefit1Desc', 'Your life is on the line every time you clip in. The CSR lets you see how seriously a potential employer takes safety before you commit. A 95% rating operates differently than a 35%.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.csr.stakeholders.technicians.benefit2Title', 'Access safety documents anywhere.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.csr.stakeholders.technicians.benefit2Desc', "Every policy you've signed, every procedure you've acknowledged, stays accessible in the app. Suspended 40 stories up and need to check company protocol? It's right there.")}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.csr.stakeholders.technicians.benefit3Title', 'Build your own safety reputation.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.csr.stakeholders.technicians.benefit3Desc', 'Your compliance behaviors contribute to company scores. Daily harness inspections, document sign-offs, and toolbox meeting participation create a record that follows you.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Property Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.csr.stakeholders.propertyManagers.title', 'For Property Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.csr.stakeholders.propertyManagers.benefit1Title', 'Compare vendors on facts, not claims.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.csr.stakeholders.propertyManagers.benefit1Desc', "Every rope access company promises they're safe. The CSR gives you objective data to back up or contradict those promises. Color-coded badges show at a glance which contractors maintain their programs.")}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.csr.stakeholders.propertyManagers.benefit2Title', 'Reduce your liability exposure.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.csr.stakeholders.propertyManagers.benefit2Desc', 'Selecting a vendor with documented poor safety practices exposes your management company to liability. The CSR provides due diligence documentation for data-driven vendor decisions.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.csr.stakeholders.propertyManagers.benefit3Title', 'Justify decisions to owners and boards.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.csr.stakeholders.propertyManagers.benefit3Desc', 'When building ownership asks why you chose one contractor over another, "they had a 94% safety rating versus 61%" is a defensible answer.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features Grid */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.csr.keyFeatures.title', 'Key Features')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.csr.keyFeatures.subtitle', 'The CSR module integrates with every safety-related system in OnRopePro to calculate accurate, real-time compliance scores.')}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.csr.keyFeatures.baseline.title', 'Three-Document Baseline')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.csr.keyFeatures.baseline.description', 'Upload your Certificate of Insurance, Health & Safety Manual, and Company Policy to reach 100% baseline. The system tracks expiration dates and renewal status.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.csr.keyFeatures.projectDocs.title', 'Project Document Tracking')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.csr.keyFeatures.projectDocs.description', 'Each project requires four safety documents: Anchor Inspection, Rope Access Plan, Toolbox Meeting, and FLHA. Missing documents trigger proportional penalties.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.csr.keyFeatures.harness.title', 'Harness Inspection Integration')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.csr.keyFeatures.harness.description', 'Daily harness inspections before work sessions contribute directly to your CSR. Consistent compliance over thousands of sessions builds a strong, resilient score.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.csr.keyFeatures.acknowledgments.title', 'Employee Document Acknowledgments')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.csr.keyFeatures.acknowledgments.description', 'When you add Safe Work Procedures, your score temporarily decreases until employees review and sign. Ensures every team member has actually read your policies.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Palette className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.csr.keyFeatures.badge.title', 'Color-Coded Compliance Badge')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.csr.keyFeatures.badge.description', 'Your CSR displays as a visual badge: green (90-100%), yellow (70-89%), orange (50-69%), or red (below 50%). Property managers see this instantly.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.csr.keyFeatures.export.title', 'Exportable Compliance Reports')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.csr.keyFeatures.export.description', 'Generate PDF reports showing all employee signatures with timestamps. When WorkSafe asks "how do you know your employees saw this policy?", you have instant proof.')}
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
      <section id="faqs" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.csr.problemsSolved.title', 'Problems Solved')}
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            {t('modules.csr.problemsSolved.subtitle', 'Real problems. Real solutions. Organized by who you are.')}
          </p>

          <Accordion type="multiple" className="space-y-4">
            {/* For Employers */}
            <AccordionItem value="employers" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-lg font-semibold">{t('modules.csr.problemsSolved.employers.label', 'For Employers')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.csr.problemsSolved.employers.problem1', '"I know I should be safer, but I don\'t have time to create all the paperwork."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.csr.problemsSolved.employers.problem1Desc', 'Creating comprehensive safety documentation from scratch takes days of administrative work. Hiring someone to build PDF templates, researching regulatory requirements, getting legal sign-off. Most small operators never get around to it.')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.csr.problemsSolved.solution', 'Solution:')}</strong> {t('modules.csr.problemsSolved.employers.solution1', 'OnRopePro provides pre-made templates for Safe Work Procedures and Practices specific to rope access. Add a document in two minutes, send notifications, track sign-offs automatically.')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.csr.problemsSolved.employers.problem2', '"When WorkSafe shows up, I can\'t prove my employees know the procedures."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.csr.problemsSolved.employers.problem2Desc', "You've told your crew a hundred times about the rules. They know. But when the regulator asks for documentation proving employees reviewed specific procedures, paper trails are incomplete or missing.")}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.csr.problemsSolved.solution', 'Solution:')}</strong> {t('modules.csr.problemsSolved.employers.solution2', 'Export a PDF report showing all employee signatures with timestamps. Transform a multi-day compliance scramble into instant verification.')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.csr.problemsSolved.employers.problem3', '"I don\'t know how safe my company actually is."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.csr.problemsSolved.employers.problem3Desc', "Without measurable metrics, safety becomes an emotional assessment. You think you're safe because nothing bad has happened yet. That's survivorship bias, not evidence.")}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.csr.problemsSolved.solution', 'Solution:')}</strong> {t('modules.csr.problemsSolved.employers.solution3', 'CSR provides a single number showing your safety posture instantly. Score drops from 87% to 72%? You know immediately something needs attention.')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.csr.problemsSolved.employers.problem4', '"Property managers are choosing competitors over me."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.csr.problemsSolved.employers.problem4Desc', 'You invest in safety, train your people properly, maintain your equipment. But when bidding against competitors, you have no way to demonstrate that investment.')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.csr.problemsSolved.solution', 'Solution:')}</strong> {t('modules.csr.problemsSolved.employers.solution4', "Your 91% CSR rating versus a competitor's 47% becomes a decisive factor in vendor selection. Convert your safety investment into competitive advantage.")}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Technicians */}
            <AccordionItem value="technicians" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-lg font-semibold">{t('modules.csr.problemsSolved.technicians.label', 'For Technicians')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.csr.problemsSolved.technicians.problem1', '"I don\'t know if this company is actually safe to work for."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.csr.problemsSolved.technicians.problem1Desc', "Your life depends on your employer's commitment to safety. Not their marketing. Not their promises during the interview. Their actual day-to-day practices around equipment inspection and compliance.")}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.csr.problemsSolved.solution', 'Solution:')}</strong> {t('modules.csr.problemsSolved.technicians.solution1', 'CSR is visible when you evaluate job offers. Would you rather work for a company with a 40% rating or a 95% rating? Now you can make informed decisions.')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.csr.problemsSolved.technicians.problem2', '"I need access to safety documents on the job site."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.csr.problemsSolved.technicians.problem2Desc', "Company policies and procedures live in an office filing cabinet while you're suspended from a building. When you need to check protocol for an unusual situation, you're out of luck.")}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.csr.problemsSolved.solution', 'Solution:')}</strong> {t('modules.csr.problemsSolved.technicians.solution2', "All signed safety documents are accessible in the app. Need to check company policy on working alone, confined space entry, or emergency procedures? It's right there.")}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Property Managers */}
            <AccordionItem value="property-managers" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-lg font-semibold">{t('modules.csr.problemsSolved.propertyManagers.label', 'For Property Managers')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.csr.problemsSolved.propertyManagers.problem1', '"I can\'t objectively compare vendor safety."')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.csr.problemsSolved.propertyManagers.problem1Desc', 'Every rope access contractor promises excellent safety practices. You have no way to verify those claims or compare them objectively. Current due diligence consists of checking insurance and maybe calling a reference.')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.csr.problemsSolved.solution', 'Solution:')}</strong> {t('modules.csr.problemsSolved.propertyManagers.solution1', 'View each vendor\'s CSR through your "My Vendors" dashboard. Color-coded badges provide instant assessment. Make data-driven decisions based on documented compliance.')}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Measurable Results Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.csr.results.title', 'Measurable Results')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.csr.results.subtitle', 'Concrete improvements you\'ll see from day one.')}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.csr.results.visibility.title', 'Safety Visibility')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.csr.results.visibility.description', 'Transform "I think we\'re safe" into "I know we\'re 87% compliant." Real-time, objective measurement of your safety posture. Score changes alert you to gaps before they become problems.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.csr.results.documentation.title', 'Documentation Time: Days to Minutes')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.csr.results.documentation.description', 'Pre-built templates for Safe Work Procedures and Practices specific to rope access. Add a document, notify employees, track sign-offs automatically.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.csr.results.regulatory.title', 'Regulatory Readiness: Scramble to Export')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.csr.results.regulatory.description', 'WorkSafe inspections typically require producing documentation across multiple categories. The CSR dashboard consolidates everything into exportable reports with timestamps and signatures.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.csr.results.competitive.title', 'Competitive Differentiation')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.csr.results.competitive.description', 'Property managers selecting between vendors with visible CSR ratings make objectively different decisions. Your safety investment finally translates into business results.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Module Integration Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.csr.integration.title', 'Other Modules This Module Communicates With')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.csr.integration.subtitle', 'The CSR pulls compliance data from across your OnRopePro system, integrating safety behaviors into a unified score.')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.csr.integration.safety.title', 'Safety & Compliance')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.csr.integration.safety.description', 'Core source of documentation status. The CSR reads which company documents are uploaded, current, and signed by employees. Safe Work Procedures and Practices feed directly into score calculations.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.csr.integration.inventory.title', 'Inventory & Inspections')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.csr.integration.inventory.description', 'Daily harness inspection completion rates from the equipment management system contribute to CSR. Inspection records with pass/fail status, inspector ID, and timestamps all factor into scoring.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <MessagesSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.csr.integration.toolbox.title', 'Toolbox Meetings')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.csr.integration.toolbox.description', 'Project-level toolbox meeting completion feeds the project documents penalty. The system tracks which projects have associated safety meetings and which are missing required documentation.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.csr.integration.project.title', 'Project Management')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.csr.integration.project.description', 'Project creation triggers documentation requirements (Anchor Inspection, Rope Access Plan, Toolbox Meeting, FLHA). The CSR tracks completion status across all active and historical projects.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.csr.integration.employee.title', 'Employee Management')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.csr.integration.employee.description', 'Employee acknowledgment status on safety documents comes from the employee record system. When new employees join or documents are updated, the CSR reflects pending signatures.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.csr.integration.buildingManager.title', 'Building Manager Portal')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.csr.integration.buildingManager.description', 'Property managers accessing the vendor dashboard see CSR badges pulled from this module. The integration provides appropriate visibility without exposing detailed operational data.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* How Will This Improve Your Business Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('modules.csr.improve.title', 'Stop Hoping You\'re Safe. Start Knowing.')}
          </h2>
          
          <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-base">
                {t('modules.csr.improve.paragraph1', "Right now, you're spending hours every month on safety documentation that may or may not be organized, may or may not be complete, and may or may not survive a WorkSafe inspection. Your crew knows the rules because you've told them, but you can't prove they've read and acknowledged specific policies. Property managers choose between you and competitors based on who has the better sales pitch, not who actually runs safer operations.")}
              </p>
              <p className="text-lg font-medium text-foreground">
                {t('modules.csr.improve.highlight1', 'The CSR changes the foundation of how safety works in your business.')}
              </p>
              <p className="text-base">
                {t('modules.csr.improve.paragraph2', "Every harness inspection, every signed document, every toolbox meeting becomes part of a living compliance score that updates automatically. When a tech forgets to do their morning inspection, you see your score dip and address it immediately instead of discovering the gap during an audit six months later. When you add new safety procedures, the system tracks exactly who has and hasn't reviewed them, so you can follow up with specific people instead of broadcasting reminders to everyone.")}
              </p>
              <p className="text-base">
                {t('modules.csr.improve.paragraph3', "Property managers comparing vendors see your 92% rating next to a competitor's 58%. That's not marketing. That's documented evidence of how you actually run your operation.")}
              </p>
              <p className="text-base">
                {t('modules.csr.improve.paragraph4', 'When WorkSafe arrives, you pull up a dashboard instead of rummaging through filing cabinets. Everything is timestamped, signed, and exportable to PDF. The regulator leaves satisfied in minutes instead of camping out for days.')}
              </p>
              <p className="text-lg font-medium text-foreground">
                {t('modules.csr.improve.highlight2', "Your technicians can evaluate employers before accepting jobs. Your competitors can't hide behind promises anymore. Your safety investment finally translates into business results.")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQs Section */}
      <section id="faqs-section" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.csr.faqs.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.csr.faqs.subtitle', 'Everything you need to know about the Company Safety Rating.')}
          </p>

          <Accordion type="multiple" className="space-y-3">
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left font-medium">{t('modules.csr.faqs.q1', 'How is the starting score calculated?')}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.csr.faqs.a1', 'New companies start at 75%. Upload your Certificate of Insurance, Health & Safety Manual, and Company Policy to reach 100%. From there, penalties are applied based on ongoing compliance gaps.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left font-medium">{t('modules.csr.faqs.q2', 'What if I add Safe Work Procedures and my score drops?')}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.csr.faqs.a2', "This is intentional. When you add new safety documents, your score temporarily decreases until employees review and sign them. This ensures documents aren't just uploaded and forgotten. Once all employees acknowledge the new procedures, your score returns to full compliance.")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left font-medium">{t('modules.csr.faqs.q3', 'How do harness inspection penalties work?')}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.csr.faqs.a3', "The penalty is calculated as a percentage of missed inspections against total work sessions. If you have 1,000 work sessions and miss 10 inspections, that's a 1% penalty. If you're just starting and have 10 sessions with 5 missed inspections, that's a 50% penalty in this category. Consistent compliance over time builds a resilient score.")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left font-medium">{t('modules.csr.faqs.q4', 'Can technicians see my CSR before accepting job offers?')}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.csr.faqs.a4', 'Yes. Technicians evaluating potential employers can see company CSR ratings. This allows them to make informed decisions about safety before committing to a position.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left font-medium">{t('modules.csr.faqs.q5', 'What do property managers see?')}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.csr.faqs.a5', 'Property managers see your overall CSR percentage and a color-coded badge (green, yellow, orange, or red) through their vendor dashboard. They can also see category breakdowns but not your internal operational details.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left font-medium">{t('modules.csr.faqs.q6', 'Who cannot see my CSR?')}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.csr.faqs.a6', "Building managers and residents. Building managers handle on-site logistics (keys, water, parking) and don't make vendor selection decisions. Residents seeing safety scores would generate unnecessary concerns without appropriate context.")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left font-medium">{t('modules.csr.faqs.q7', 'What documents are required for each project?')}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.csr.faqs.a7', 'Four documents: Anchor Inspection (waived for non-rope jobs like parkade pressure washing), Rope Access Plan, Toolbox Meeting, and FLHA. Missing any of these for a project contributes to your project documents penalty.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left font-medium">{t('modules.csr.faqs.q8', 'Can my score ever reach 100% again after adding employees or documents?')}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.csr.faqs.a8', 'Yes. 100% is achievable when all company documents are current, all projects have complete documentation, all work sessions have associated harness inspections, and all employees have signed all required documents. The system is designed so perfect scores are difficult to maintain long-term, reflecting that nobody is 100% safe forever.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left font-medium">{t('modules.csr.faqs.q9', 'How quickly does the score update?')}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.csr.faqs.a9', 'Real-time. When a technician completes a harness inspection, when an employee signs a document, when a toolbox meeting is logged, the score recalculates immediately.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-10" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left font-medium">{t('modules.csr.faqs.q10', "What if a new employee joins and hasn't signed anything yet?")}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.csr.faqs.a10', 'Your score will decrease proportionally until they complete onboarding documentation. This incentivizes prompt completion of new employee safety training and document acknowledgments.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-11" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left font-medium">{t('modules.csr.faqs.q11', 'Can I export CSR data for insurance or regulatory purposes?')}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.csr.faqs.a11', 'Yes. Generate PDF reports showing employee signatures with timestamps for all safety documents, harness inspection completion records, and toolbox meeting logs. These exports satisfy insurance auditors, WorkSafe inspectors, and IRATA/SPRAT compliance requirements.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-12" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left font-medium">{t('modules.csr.faqs.q12', 'Is the CSR visible to competitors?')}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {t('modules.csr.faqs.a12', 'No. Only your own company owners, your technicians (when evaluating job offers), and property managers (when viewing their vendor list) can see your score. Competitors cannot access your CSR.')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-8" />

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 text-center" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="max-w-3xl mx-auto text-white space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('modules.csr.cta.title', 'Stop Hoping You\'re Safe. Start Knowing.')}
          </h2>
          <p className="text-lg text-blue-100">
            {t('modules.csr.cta.description', 'Upload three documents and see your starting score in minutes.')}<br />
            {t('modules.csr.cta.descriptionLine2', 'Full access. No credit card. Real compliance data from day one.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-cta-trial">
              {t('modules.csr.cta.startTrial', 'Start Your Free 60-Day Trial')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-cta-guide">
              <Link href="/guides/csr">
                {t('modules.csr.cta.readGuide', 'Read the Full Guide')}
                <BookOpen className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-8 object-contain" />
          </div>
          <p className="text-sm text-muted-foreground">
            {t('modules.csr.footer.copyright', '© 2025 OnRopePro. All rights reserved.')}
          </p>
        </div>
      </footer>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}
