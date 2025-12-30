import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { PropertyManagerRegistration } from "@/components/PropertyManagerRegistration";
import { useTranslation } from "react-i18next";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  Users,
  Eye,
  AlertTriangle,
  FileText,
  Gauge,
  ClipboardCheck,
  FileCheck,
  Download,
  TrendingUp,
  Clock,
  Award,
  Target,
  ShieldCheck,
  ClipboardList,
  BarChart3,
  Bell,
  FileBarChart,
  Presentation,
  Calculator,
  Link2,
  MessagesSquare,
  HelpCircle,
  Globe,
  Scale
} from "lucide-react";

const SAGE_GREEN = "#6E9075";
const SAGE_GREEN_DARK = "#5A7A60";

export default function CSRPropertyManagerLanding() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="property-manager" />
      
      {/* Hero Section - Sage Green Theme */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: `linear-gradient(135deg, ${SAGE_GREEN} 0%, ${SAGE_GREEN_DARK} 100%)`}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              {t('modules.pmCSR.hero.badge', 'Company Safety Rating is Viewable by Property Managers')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.pmCSR.hero.titleLine1', 'Prove Your Vendors Are Safe')}<br />
              {t('modules.pmCSR.hero.titleLine2', 'Before The Incident,')}<br />
              <span className="text-green-100">{t('modules.pmCSR.hero.titleLine3', 'Not After The Lawsuit')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.pmCSR.hero.description', 'One real-time safety rating for every vendor across your entire portfolio. Automated compliance tracking, instant audit trails, and the documentation that protects you when incidents happen.')}<br />
              <strong>{t('modules.pmCSR.hero.descriptionStrong', 'Built for property managers who need systematic vendor safety verification across multiple properties.')}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#6E9075] hover:bg-green-50" onClick={() => setShowRegistration(true)} data-testid="button-hero-trial">
                {t('modules.pmCSR.hero.ctaTrial', 'Start 60-Day Free Trial')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-hero-signin">
                {t('modules.pmCSR.hero.signIn', 'Sign In')}
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
                  <div className="text-2xl md:text-3xl font-bold text-blue-700">{t('modules.pmCSR.stats.portfolioValue', '5-70+')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.pmCSR.stats.portfolioLabel', 'Buildings Managed')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">{t('modules.pmCSR.stats.complianceValue', '20-50%')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.pmCSR.stats.complianceLabel', 'Typical Compliance Rates')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600">{t('modules.pmCSR.stats.liabilityValue', '$10-29M')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.pmCSR.stats.liabilityLabel', 'Liability Exposure')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-violet-600">{t('modules.pmCSR.stats.auditValue', 'Real-Time')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.pmCSR.stats.auditLabel', 'Audit Trail Access')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* CSR Rating Tiers Visual */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.pmCSR.tiers.title', 'Vendor Safety at a Glance')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.pmCSR.tiers.subtitle', 'Every rope access vendor on OnRopePro has a Company Safety Rating (CSR) visible in your vendor dashboard. Use it to compare vendors, verify compliance, and document your due diligence in vendor selection.')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Green - Excellent */}
            <div className="rounded-xl p-6 text-center bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4 ring-4 ring-green-200 dark:ring-green-800">
                <span className="text-white font-bold text-lg">90+</span>
              </div>
              <p className="font-semibold text-green-700 dark:text-green-300">{t('modules.csr.tiers.green.name', 'Green')}</p>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">{t('modules.csr.tiers.green.label', 'Excellent')}</p>
              <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-2">{t('modules.pmCSR.tiers.green.description', 'Vendor maintains strong safety culture with consistent compliance. Low-risk choice for your properties.')}</p>
            </div>

            {/* Yellow - Good */}
            <div className="rounded-xl p-6 text-center bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mb-4 ring-4 ring-yellow-200 dark:ring-yellow-800">
                <span className="text-white font-bold text-lg">70+</span>
              </div>
              <p className="font-semibold text-yellow-700 dark:text-yellow-300">{t('modules.csr.tiers.yellow.name', 'Yellow')}</p>
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{t('modules.csr.tiers.yellow.label', 'Good')}</p>
              <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80 mt-2">{t('modules.pmCSR.tiers.yellow.description', 'Vendor has solid foundation with minor gaps. Review specifics before contracting.')}</p>
            </div>

            {/* Orange - Warning */}
            <div className="rounded-xl p-6 text-center bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-4 ring-4 ring-orange-200 dark:ring-orange-800">
                <span className="text-white font-bold text-lg">50+</span>
              </div>
              <p className="font-semibold text-orange-700 dark:text-orange-300">{t('modules.csr.tiers.orange.name', 'Orange')}</p>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t('modules.csr.tiers.orange.label', 'Warning')}</p>
              <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-2">{t('modules.pmCSR.tiers.orange.description', 'Vendor has significant compliance gaps. Request remediation plan before engagement.')}</p>
            </div>

            {/* Red - Critical */}
            <div className="rounded-xl p-6 text-center bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4 ring-4 ring-red-200 dark:ring-red-800">
                <span className="text-white font-bold text-lg">&lt;50</span>
              </div>
              <p className="font-semibold text-red-700 dark:text-red-300">{t('modules.csr.tiers.red.name', 'Red')}</p>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">{t('modules.csr.tiers.red.label', 'Critical')}</p>
              <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-2">{t('modules.pmCSR.tiers.red.description', 'Vendor has serious compliance issues. Consider alternative vendors for liability protection.')}</p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problem Statement Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('modules.pmCSR.problem.title', 'Manual Vendor Safety Tracking Fails at Portfolio Scale')}
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                {t('modules.pmCSR.problem.intro', 'You manage 5 to 70 buildings across one or multiple cities.')}
              </p>
              <p className="text-base">
                {t('modules.pmCSR.problem.paragraph1', "Each property manager relationship involves 5-15 rope access vendors across your portfolio. That's 5-15 critical vendor relationships where you're liable for safety compliance but may have limited visibility into actual practices. Manual processes achieve 20-50% compliance rates because tracking vendor safety across properties at scale is nearly impossible without automated systems.")}
              </p>
              <p className="text-base font-medium text-foreground">
                {t('modules.pmCSR.problem.highlight', 'When a vendor incident happens, the question is always: "Did you verify they followed safety procedures?" Without documentation, you have no defense.')}
              </p>
              <Separator className="my-6" />
              <p className="text-base">
                {t('modules.pmCSR.problem.judgment', 'One property management firm faced a $29 million judgment for vendor negligence. Their documentation? Scattered emails and Excel files that could not prove safety compliance.')}
              </p>
              <p className="text-base">
                {t('modules.pmCSR.problem.solution', "OnRopePro's Company Safety Rating changes that. CSR provides automated, portfolio-wide vendor safety compliance tracking with real-time scoring, instant gap identification, and audit-ready documentation that transforms vendor management from administrative task into defensible risk infrastructure.")}
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
            {t('modules.pmCSR.features.title', 'Portfolio-Wide Vendor Safety Compliance Infrastructure')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.pmCSR.features.subtitle', 'Automated safety scoring for every vendor across every property, calculated in real-time from actual compliance data.')}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Real-Time Safety Scoring */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{background: `linear-gradient(to right, ${SAGE_GREEN}, ${SAGE_GREEN_DARK})`}}></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                  <Gauge className="w-6 h-6" style={{color: SAGE_GREEN}} />
                </div>
                <CardTitle className="text-xl">{t('modules.pmCSR.features.scoring.title', 'Real-Time Safety Scoring')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.pmCSR.features.scoring.intro', 'Every vendor company receives an automated CSR score calculated from four categories.')}</p>
                <p>{t('modules.pmCSR.features.scoring.description', 'Core documentation (COI, safety manuals), daily harness inspections, project-specific requirements, and employee safety document acknowledgments. Scores update in real-time as compliance activities complete.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.pmCSR.features.scoring.tracked', 'What gets tracked across portfolio:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{color: SAGE_GREEN}} />
                    <span>{t('modules.pmCSR.features.scoring.item1', 'Certificate of Insurance, Health & Safety Manual, Company Policy for each vendor')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{color: SAGE_GREEN}} />
                    <span>{t('modules.pmCSR.features.scoring.item2', 'Harness inspection completion rates across all work sessions portfolio-wide')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{color: SAGE_GREEN}} />
                    <span>{t('modules.pmCSR.features.scoring.item3', 'Project documentation (Rope Access Plans, FLHAs, Toolbox Meetings, Anchor Inspections)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{color: SAGE_GREEN}} />
                    <span>{t('modules.pmCSR.features.scoring.item4', 'Employee signature status on safety procedures for every technician')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: Portfolio Compliance Dashboard */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{background: `linear-gradient(to right, ${SAGE_GREEN}, ${SAGE_GREEN_DARK})`}}></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                  <BarChart3 className="w-6 h-6" style={{color: SAGE_GREEN}} />
                </div>
                <CardTitle className="text-xl">{t('modules.pmCSR.features.dashboard.title', 'Portfolio Compliance Dashboard')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.pmCSR.features.dashboard.intro', 'View safety compliance across your entire portfolio.')}</p>
                <p>{t('modules.pmCSR.features.dashboard.description', 'Filter by property, vendor, score range, or compliance category. Identify which vendors pose risk before contract renewal. Track compliance trends over time. Compare vendor safety performance across properties.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.pmCSR.features.dashboard.sees', 'What portfolio managers see:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{color: SAGE_GREEN}} />
                    <span>{t('modules.pmCSR.features.dashboard.item1', 'All vendors ranked by CSR with color-coded badges (green 90-100%, yellow 70-89%, orange 50-69%, red below 50%)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{color: SAGE_GREEN}} />
                    <span>{t('modules.pmCSR.features.dashboard.item2', 'Properties with highest vendor risk concentration')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{color: SAGE_GREEN}} />
                    <span>{t('modules.pmCSR.features.dashboard.item3', 'Compliance gap trends requiring immediate attention')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{color: SAGE_GREEN}} />
                    <span>{t('modules.pmCSR.features.dashboard.item4', 'Vendor-by-vendor drill-down showing specific deficiencies')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Audit-Ready Documentation */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{background: `linear-gradient(to right, ${SAGE_GREEN}, ${SAGE_GREEN_DARK})`}}></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                  <FileCheck className="w-6 h-6" style={{color: SAGE_GREEN}} />
                </div>
                <CardTitle className="text-xl">{t('modules.pmCSR.features.audit.title', 'Audit-Ready Documentation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.pmCSR.features.audit.intro', 'Export comprehensive safety compliance reports in minutes.')}</p>
                <p>{t('modules.pmCSR.features.audit.description', 'Transform weeks of manual compilation into instant report generation. Reports include vendor CSR scores, supporting documentation with timestamps, employee acknowledgment records, and compliance trend analysis.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.pmCSR.features.audit.documented', 'What gets documented for legal defense:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{color: SAGE_GREEN}} />
                    <span>{t('modules.pmCSR.features.audit.item1', 'When you verified vendor safety compliance and at what percentage')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{color: SAGE_GREEN}} />
                    <span>{t('modules.pmCSR.features.audit.item2', 'Which specific employees signed which safety procedures (dates, timestamps)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{color: SAGE_GREEN}} />
                    <span>{t('modules.pmCSR.features.audit.item3', 'Project-by-project safety documentation completion records')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{color: SAGE_GREEN}} />
                    <span>{t('modules.pmCSR.features.audit.item4', 'Historical compliance trends showing proactive monitoring')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Stakeholder Benefits Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.pmCSR.benefits.title', 'Who Benefits From This Module')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.pmCSR.benefits.subtitle', 'From portfolio managers to property owners, CSR provides defensible vendor safety infrastructure.')}
          </p>

          <div className="space-y-8">
            {/* Portfolio Property Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b" style={{backgroundColor: `${SAGE_GREEN}10`}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                    <Globe className="w-5 h-5" style={{color: SAGE_GREEN}} />
                  </div>
                  <CardTitle className="text-xl">{t('modules.pmCSR.benefits.pm.title', 'For Portfolio Property Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.pmCSR.benefits.pm.liability.title', 'Eliminate Career-Ending Liability')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.pmCSR.benefits.pm.liability.description', 'One $29 million judgment costs more than a lifetime of platform fees. CSR provides the documented proof that you verified vendor safety compliance before incidents occurred.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.pmCSR.benefits.pm.standardize.title', 'Standardize Across Properties')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.pmCSR.benefits.pm.standardize.description', 'You cannot personally verify safety practices for 5-15 rope access vendors across your entire portfolio. CSR automates compliance monitoring across all properties.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.pmCSR.benefits.pm.enterprise.title', 'Win Enterprise Contracts')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.pmCSR.benefits.pm.enterprise.description', 'When competing for large management opportunities, export real-time compliance dashboards showing systematic vendor safety monitoring across your portfolio.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Building-Level Operations Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.pmCSR.benefits.building.title', 'For Building-Level Operations Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.pmCSR.benefits.building.data.title', 'Data-Driven Vendor Selection')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.pmCSR.benefits.building.data.description', 'When choosing between vendors, see their actual safety compliance rates. A vendor with 87% CSR versus 35% CSR gives you defensible criteria for vendor selection.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.pmCSR.benefits.building.reduce.title', 'Reduce Your Liability Exposure')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.pmCSR.benefits.building.reduce.description', 'When vendor incidents occur at your building, investigators ask if you verified safety compliance. CSR documentation shows exactly which vendors were compliant.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Owners and Boards */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.pmCSR.benefits.owners.title', 'For Property Owners and Boards')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.pmCSR.benefits.owners.verify.title', 'Verify Systematic Management')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.pmCSR.benefits.owners.verify.description', 'Request CSR compliance reports showing vendor safety trends across your properties. Know exactly which vendors pose risk before incidents happen.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.pmCSR.benefits.owners.protect.title', 'Protect Property Values')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.pmCSR.benefits.owners.protect.description', 'Major vendor incidents reduce property values and increase insurance premiums. CSR enables proactive vendor safety management that prevents incidents.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Key Features Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.pmCSR.keyFeatures.title', 'Key Features')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.pmCSR.keyFeatures.subtitle', 'Every feature designed to solve the specific vendor safety tracking failures that create liability exposure at portfolio scale.')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                  <TrendingUp className="w-5 h-5" style={{color: SAGE_GREEN}} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('modules.pmCSR.keyFeatures.ranking.title', 'Portfolio-Wide Vendor Ranking')}</h3>
                <p className="text-base text-muted-foreground">{t('modules.pmCSR.keyFeatures.ranking.description', 'View all vendors across your entire portfolio ranked by safety compliance score. Filter by property, work type, or compliance category.')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                  <Bell className="w-5 h-5" style={{color: SAGE_GREEN}} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('modules.pmCSR.keyFeatures.alerts.title', 'Compliance Gap Alerts')}</h3>
                <p className="text-base text-muted-foreground">{t('modules.pmCSR.keyFeatures.alerts.description', 'Automated notifications when vendor safety scores drop below acceptable thresholds. Alerts show specific deficiencies and recommended corrective actions.')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                  <FileBarChart className="w-5 h-5" style={{color: SAGE_GREEN}} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('modules.pmCSR.keyFeatures.selection.title', 'Vendor Selection Documentation')}</h3>
                <p className="text-base text-muted-foreground">{t('modules.pmCSR.keyFeatures.selection.description', 'Export comparison reports showing CSR scores with supporting compliance data. Document why you selected Vendor A (87% CSR) over Vendor B (42% CSR).')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                  <Shield className="w-5 h-5" style={{color: SAGE_GREEN}} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('modules.pmCSR.keyFeatures.insurance.title', 'Insurance Audit Preparation')}</h3>
                <p className="text-base text-muted-foreground">{t('modules.pmCSR.keyFeatures.insurance.description', 'Generate comprehensive vendor safety compliance reports in minutes. Transform multi-day audit preparation into instant report generation.')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                  <Presentation className="w-5 h-5" style={{color: SAGE_GREEN}} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('modules.pmCSR.keyFeatures.presentations.title', 'Board-Ready Presentations')}</h3>
                <p className="text-base text-muted-foreground">{t('modules.pmCSR.keyFeatures.presentations.description', 'Export executive summaries showing portfolio-wide vendor safety performance. Color-coded dashboards and benchmark comparisons.')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: `${SAGE_GREEN}20`}}>
                  <Calculator className="w-5 h-5" style={{color: SAGE_GREEN}} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('modules.pmCSR.keyFeatures.proportional.title', 'Proportional Impact Calculation')}</h3>
                <p className="text-base text-muted-foreground">{t('modules.pmCSR.keyFeatures.proportional.description', 'CSR scores reflect long-term compliance patterns, not isolated incidents. The math rewards consistent compliance over time.')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Measurable Results Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.pmCSR.results.title', 'Measurable Results')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.pmCSR.results.subtitle', 'From liability protection to administrative efficiency, CSR delivers quantifiable portfolio-scale value.')}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-l-4" style={{borderLeftColor: SAGE_GREEN}}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{t('modules.pmCSR.results.risk.title', 'Risk Reduction')}</h3>
                <p className="text-base text-muted-foreground">{t('modules.pmCSR.results.risk.description', 'CSR documentation reduces investigation time to minutes with instant audit trail access. Estimated risk reduction value: $15,000-$100,000 annually for 5-70 building portfolios.')}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{borderLeftColor: SAGE_GREEN}}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{t('modules.pmCSR.results.efficiency.title', 'Administrative Efficiency')}</h3>
                <p className="text-base text-muted-foreground">{t('modules.pmCSR.results.efficiency.description', 'CSR automates compliance monitoring, reducing administrative burden by 65-87%. For a 20-building portfolio: Annual value at $35/hour: $82K in reclaimed building manager capacity.')}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{borderLeftColor: SAGE_GREEN}}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{t('modules.pmCSR.results.contracts.title', 'Competitive Contract Wins')}</h3>
                <p className="text-base text-muted-foreground">{t('modules.pmCSR.results.contracts.description', 'CSR differentiates your firm as systematically managing risk versus competitors using manual processes. Estimated impact: 10-15% improvement in enterprise contract win rates.')}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{borderLeftColor: SAGE_GREEN}}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{t('modules.pmCSR.results.premiums.title', 'Insurance Premium Optimization')}</h3>
                <p className="text-base text-muted-foreground">{t('modules.pmCSR.results.premiums.description', 'Properties with documented vendor compliance programs negotiate better insurance rates. Estimated premium reduction: 5-10% on liability coverage.')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.pmCSR.faqs.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.pmCSR.faqs.subtitle', 'Common questions about CSR for portfolio property managers.')}
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white dark:bg-slate-900 rounded-lg border px-6">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="faq-trigger-1">
                {t('modules.pmCSR.faqs.q1.question', 'How does CSR help me manage vendor safety across 5-70+ properties?')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {t('modules.pmCSR.faqs.q1.answer', 'CSR provides one portfolio-wide dashboard showing all vendor safety scores across all properties. Filter by property, vendor, compliance category, or score threshold. No more depending on multiple building managers to manually report vendor compliance you cannot verify.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white dark:bg-slate-900 rounded-lg border px-6">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="faq-trigger-2">
                {t('modules.pmCSR.faqs.q2.question', 'What happens when vendor safety scores drop?')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {t('modules.pmCSR.faqs.q2.answer', 'Automated alerts notify portfolio managers when vendors fall below acceptable thresholds. Alerts specify which compliance category is deficient (missing inspections, unsigned documents, incomplete project requirements) and recommend corrective actions.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white dark:bg-slate-900 rounded-lg border px-6">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="faq-trigger-3">
                {t('modules.pmCSR.faqs.q3.question', 'Can I require minimum CSR scores for vendor contracts?')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {t('modules.pmCSR.faqs.q3.answer', 'Yes. Set portfolio-wide safety score requirements for vendor eligibility. Filter available vendors by minimum CSR threshold when selecting contractors. Document vendor selection criteria showing you chose vendors based on objective safety compliance data.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white dark:bg-slate-900 rounded-lg border px-6">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="faq-trigger-4">
                {t('modules.pmCSR.faqs.q4.question', 'How does CSR documentation protect against vendor negligence liability?')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {t('modules.pmCSR.faqs.q4.answer', 'CSR creates timestamped audit trails showing when you verified each vendor\'s safety compliance and at what score. If vendor incidents occur, export reports proving systematic safety monitoring. Courts give significant weight to documentary evidence showing proactive risk management.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white dark:bg-slate-900 rounded-lg border px-6">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="faq-trigger-5">
                {t('modules.pmCSR.faqs.q5.question', 'How quickly do CSR scores update?')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {t('modules.pmCSR.faqs.q5.answer', 'Real-time. When vendors complete harness inspections, sign safety documents, or finish project requirements, scores update immediately. Portfolio managers see current compliance status, not weekly batch updates.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white dark:bg-slate-900 rounded-lg border px-6">
              <AccordionTrigger className="text-left font-medium py-4" data-testid="faq-trigger-6">
                {t('modules.pmCSR.faqs.q6.question', 'Can I export CSR data for board presentations?')}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {t('modules.pmCSR.faqs.q6.answer', 'Yes. Generate executive summaries showing portfolio-wide vendor safety performance with color-coded dashboards, trend charts, and benchmark comparisons. Export detailed vendor-by-vendor reports for board audit committees.')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 text-white" style={{backgroundImage: `linear-gradient(135deg, ${SAGE_GREEN} 0%, #5A7A60 100%)`}}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('modules.pmCSR.cta.title', 'From Liability Exposure to Documented Risk Management')}
          </h2>
          <p className="text-lg text-white/90">
            {t('modules.pmCSR.cta.description', 'With CSR, you check one dashboard and know exactly which vendors pose risk across your entire portfolio. Compliance gaps get flagged before insurance audits discover them.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white hover:bg-gray-50" style={{color: SAGE_GREEN}} onClick={() => setShowRegistration(true)} data-testid="button-cta-trial">
              {t('modules.pmCSR.cta.trial', 'Start Your 60-Day Trial')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={() => document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-cta-faqs">
              {t('modules.pmCSR.cta.faqs', 'Read FAQs')}
            </Button>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <PropertyManagerRegistration open={showRegistration} onOpenChange={setShowRegistration} />

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-8 object-contain" />
            <span className="text-sm text-muted-foreground">{t('modules.pmCSR.footer.tagline', 'Management Software for Rope Access')}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-privacy">
              {t('modules.pmCSR.footer.privacy', 'Privacy Policy')}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-terms">
              {t('modules.pmCSR.footer.terms', 'Terms of Service')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
