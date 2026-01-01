import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { Link } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import { FreeTrialButton } from "@/components/FreeTrialButton";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import { SoftwareReplaces, MODULE_SOFTWARE_MAPPING } from "@/components/SoftwareReplaces";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Briefcase,
  HardHat,
  ClipboardList,
  Clock,
  FileText,
  Database,
  ShieldCheck,
  Award,
  Scan,
  Download,
  Users,
  Calendar,
  BarChart3,
  AlertTriangle,
  Zap,
  UserCheck,
  RefreshCw,
  Layers,
  Target,
  TrendingUp,
  Building2
} from "lucide-react";

export default function IRATATaskLoggingLanding() {
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
              {t('modules.irataLogging.hero.badge', 'IRATA / SPRAT Task Logging Module')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.irataLogging.hero.title', 'Your Logbook Is Lying')}<br />
              <span className="text-blue-100">{t('modules.irataLogging.hero.subtitle', "(Because You Haven't Updated It in Six Months)")}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.irataLogging.hero.description', 'OnRopePro captures your rope access hours the same day you work them. Building names, task types, duration. All logged automatically when you end your shift.')}<br />
              <strong>{t('modules.irataLogging.hero.descriptionBold', 'Filling out your paper logbook stops being a homework assignment.')}</strong>
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
              software={MODULE_SOFTWARE_MAPPING["irata-sprat-task-logging"]} 
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
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{t('modules.irataLogging.stats.yours.title', 'Yours')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.irataLogging.stats.yours.description', "Hours that don't disappear when you quit")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{t('modules.irataLogging.stats.accurate.title', 'Accurate')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.irataLogging.stats.accurate.description', 'Logged while you still remember')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{t('modules.irataLogging.stats.ready.title', 'Ready')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.irataLogging.stats.ready.description', 'Level 3 proof on demand')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{t('modules.irataLogging.stats.portable.title', 'Portable')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.irataLogging.stats.portable.description', 'One profile, every employer')}</div>
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
            {t('modules.irataLogging.problem.title', 'The Logging Problem Nobody Talks About')}
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                {t('modules.irataLogging.problem.intro', 'Your physical logbook is a mess.')}
              </p>
              <p className="text-base">
                {t('modules.irataLogging.problem.paragraph1', "The last entry was months ago. You can't remember which buildings you worked at, what tasks you performed, or how many hours you actually spent on rope. When you finally try to catch up, you end up guessing. Was that rope transfer on Tuesday or Wednesday? Did you do any rigging at Tower B, or just descending?")}
              </p>
              <p className="text-base">
                {t('modules.irataLogging.problem.paragraph2', "Here's the uncomfortable truth: when you bring six months of entries to your Level 3 for signing, they just sign. They weren't on every job with you. They have no idea if you actually did rope transfers on March 15th. But they sign anyway because that's how it's always been done.")}
              </p>
              <p className="text-base italic">
                {t('modules.irataLogging.problem.quote', 'One technician put it this way: "My last entry is December 29th, 2023. Two years. Where did I work in the past year? I don\'t even have access to my hours anymore because I don\'t work there. I don\'t have an account. It\'s all gone now."')}
              </p>
              <Separator className="my-6" />
              <p className="font-medium text-foreground text-lg">
                {t('modules.irataLogging.problem.solution', 'OnRopePro changes this. Your hours log the same day you work them. Building names, task types, duration, all captured when you end your shift. And because your hours belong to your technician profile (not your employer), your career history follows you when you change jobs.')}
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
            {t('modules.irataLogging.features.title', 'What This Module Does')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('modules.irataLogging.features.subtitle', 'The IRATA / SPRAT Task Logging module builds your certification portfolio automatically as you work.')}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Capture Hours */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.irataLogging.features.captureHours.title', 'Capture Hours Without the Homework')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.irataLogging.features.captureHours.description1', 'When you end a work session, the system prompts you to categorize your rope access hours by task type.')}</p>
                <p>{t('modules.irataLogging.features.captureHours.description2', 'No reconstructing what you did three months ago. No guessing which building had the rope transfers.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.irataLogging.features.captureHours.listTitle', 'What gets captured:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.irataLogging.features.captureHours.item1', 'Session date and duration')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.irataLogging.features.captureHours.item2', 'Building and project context')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.irataLogging.features.captureHours.item3', 'Task types performed (20+ categories)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.irataLogging.features.captureHours.item4', 'Cumulative totals by task type')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: Import History */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <Scan className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.irataLogging.features.importHistory.title', 'Import Your Existing History')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.irataLogging.features.importHistory.description1', 'Photograph your paper logbook pages. Our OCR system extracts dates, hours, and task data automatically.')}</p>
                <p>{t('modules.irataLogging.features.importHistory.description2', 'Or enter your baseline total manually if you prefer.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.irataLogging.features.importHistory.listTitle', 'What gets tracked:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.irataLogging.features.importHistory.item1', 'Baseline hours from previous employment')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.irataLogging.features.importHistory.item2', 'Training hours from external courses')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.irataLogging.features.importHistory.item3', 'Independent work (for techs not connected to an employer)')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.irataLogging.features.importHistory.item4', 'Historical data from scanned logbook pages')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Track Progress */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.irataLogging.features.trackProgress.title', 'Track Progress Toward Certification')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-base text-muted-foreground">
                <p className="font-medium text-foreground">{t('modules.irataLogging.features.trackProgress.description1', 'Your hours accumulate against your IRATA or SPRAT certification number.')}</p>
                <p>{t('modules.irataLogging.features.trackProgress.description2', 'See exactly where you stand for your next level assessment.')}</p>
                <p className="font-medium text-foreground mt-4">{t('modules.irataLogging.features.trackProgress.listTitle', 'What you see:')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.irataLogging.features.trackProgress.item1', 'Total accumulated career hours')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.irataLogging.features.trackProgress.item2', 'Hours breakdown by task type')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.irataLogging.features.trackProgress.item3', 'Hours breakdown by week, month, year')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.irataLogging.features.trackProgress.item4', 'PDF export for any date range')}</span>
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
            {t('modules.irataLogging.stakeholders.title', 'Who Benefits From This Module')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.irataLogging.stakeholders.subtitle', 'Three stakeholder types. Three different perspectives. One unified logging system.')}
          </p>

          <div className="space-y-8">
            {/* For Technicians */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.irataLogging.stakeholders.technicians.title', 'For Rope Access Technicians')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.irataLogging.stakeholders.technicians.benefit1.title', 'Your career history belongs to you.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.irataLogging.stakeholders.technicians.benefit1.description', 'When you switch employers, your complete hour history comes with you. No more losing access to years of documented experience when you leave a company.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.irataLogging.stakeholders.technicians.benefit2.title', 'No more backlog homework.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.irataLogging.stakeholders.technicians.benefit2.description', 'Hours log the same day while details are fresh. Building names, task types, duration. You never have to reconstruct what you did three months ago.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.irataLogging.stakeholders.technicians.benefit3.title', 'Build diverse experience that matters.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.irataLogging.stakeholders.technicians.benefit3.description', "Track not just total hours, but task diversity. When it's time for your Level 3 assessment, you have documented proof that you've done more than just descending for a thousand hours.")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Company Owners */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.irataLogging.stakeholders.owners.title', 'For Company Owners')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.irataLogging.stakeholders.owners.benefit1.title', 'Know what your techs can actually do.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.irataLogging.stakeholders.owners.benefit1.description', "When technicians use OnRopePro, you see verified hour history with task breakdowns. You know exactly how much rigging, rescue, and specialized work they've actually performed before assigning them to jobs.")}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.irataLogging.stakeholders.owners.benefit2.title', 'Make verification meaningful.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.irataLogging.stakeholders.owners.benefit2.description', "Digital approval flow means supervisors can review and approve hours daily while details are fresh. Your company's signature on a tech's hours actually represents verification, not just rubber-stamping.")}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.irataLogging.stakeholders.owners.benefit3.title', 'Plan workforce development with real data.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.irataLogging.stakeholders.owners.benefit3.description', 'Hours logged flow into company-wide analytics. See skill distribution across your workforce. Identify gaps in team capabilities and plan training investments based on actual logged experience.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Level 3s / Supervisors */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-cyan-50 dark:bg-cyan-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                    <Award className="w-5 h-5 text-cyan-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.irataLogging.stakeholders.supervisors.title', 'For Level 3 Technicians & Supervisors')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.irataLogging.stakeholders.supervisors.benefit1.title', 'Sign with integrity.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.irataLogging.stakeholders.supervisors.benefit1.description', 'When entries are logged same-day and linked to specific projects, you can cross-reference against job records. "This tech logged rope transfers at Building X on Tuesday. I know that building has transfer points on the north elevation. Approve."')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.irataLogging.stakeholders.supervisors.benefit2.title', 'Real-time verification beats rubber-stamping.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.irataLogging.stakeholders.supervisors.benefit2.description', 'No more techs bringing six months of backlogged entries for mass signing. Review and approve while details are fresh and verifiable.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.irataLogging.keyFeatures.title', 'Key Features')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.irataLogging.keyFeatures.subtitle', 'Everything you need to maintain accurate, portable certification records.')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Scan className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.irataLogging.keyFeatures.ocrScanning.title', 'OCR Logbook Scanning')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.irataLogging.keyFeatures.ocrScanning.description', 'Photograph your existing paper logbook pages. AI extracts hours and task data automatically. No manual entry required. Import years of history in minutes, not hours.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.irataLogging.keyFeatures.autoCapture.title', 'Automatic Session Capture')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.irataLogging.keyFeatures.autoCapture.description', 'When connected to an employer, work hours capture automatically from clock in/out. End your session, select your tasks, done. Zero timesheets.')}
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
                    <Layers className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.irataLogging.keyFeatures.taskCategories.title', '20+ Task Categories')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.irataLogging.keyFeatures.taskCategories.description', 'Industry-standard IRATA/SPRAT task types: ascending, descending, rope transfer, deviation, re-anchor, aid climbing, rigging, hauling, rescue technique, and more.')}
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
                    <Database className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.irataLogging.keyFeatures.portableIdentity.title', 'Portable Professional Identity')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.irataLogging.keyFeatures.portableIdentity.description', 'Your certification hours belong to your technician profile, not your employer. Switch jobs and your complete history comes with you. No re-entry. No lost records.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <Download className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.irataLogging.keyFeatures.pdfExport.title', 'PDF Export')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.irataLogging.keyFeatures.pdfExport.description', 'Export your complete hour history for any date range. Perfect for certification renewals, job applications, and assessment preparation.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-rose-500 to-pink-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.irataLogging.keyFeatures.independent.title', 'Works Connected or Independent')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.irataLogging.keyFeatures.independent.description', 'Log hours whether employed through the platform or working independently. Training nights at the local school? Log them. Contract work for a non-platform company? Log it manually.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problems Solved Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.irataLogging.problemsSolved.title', 'Problems Solved')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.irataLogging.problemsSolved.subtitle', 'Real frustrations. Real solutions.')}
          </p>

          <Accordion type="multiple" className="space-y-4" data-testid="accordion-problems-solved">
            {/* For Rope Access Technicians */}
            <AccordionItem value="technicians" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="hover:no-underline px-4 py-4 bg-amber-50 dark:bg-amber-950" data-testid="accordion-trigger-technicians">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <HardHat className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="font-semibold text-lg">{t('modules.irataLogging.problemsSolved.technicians.title', 'For Rope Access Technicians')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-6 pt-4 space-y-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">{t('modules.irataLogging.problemsSolved.technicians.problem1.title', '"I haven\'t updated my logbook in months."')}</h4>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.technicians.problem1.description1', "Opening your physical logbook every day is tedious. You put it off for a week, then two weeks, then months. When you finally try to catch up, you can't remember which buildings you worked at, what tasks you performed, or how many hours you actually spent on rope.")}
                  </p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.technicians.problem1.description2', 'OnRopePro logs your hours the same day, while details are fresh. Building names, task types, duration, all captured when you end your work session. Your career history builds automatically instead of becoming homework you keep avoiding.')}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">{t('modules.irataLogging.problemsSolved.technicians.problem2.title', '"I lost access to my hours when I left my last employer."')}</h4>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.technicians.problem2.description1', "Traditional timekeeping systems lock your data inside the company that employs you. When you leave, your documented experience disappears. You're back to paper logbooks and trying to reconstruct years of work history.")}
                  </p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.technicians.problem2.description2', 'Your IRATA/SPRAT hours belong to YOUR technician profile, not your employer. When you move to a new company, your complete hour history comes with you automatically.')}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">{t('modules.irataLogging.problemsSolved.technicians.problem3.title', '"6 months without logged rope time could invalidate my cert."')}</h4>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.technicians.problem3.description1', 'IRATA requires continuous evidence of rope access work. A six-month gap in your logbook raises questions during assessment. Without documented proof, your certification status becomes uncertain.')}
                  </p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.technicians.problem3.description2', 'OnRopePro tracks every session automatically when connected to an employer. Independent techs log manually. Either way, you never have unexplained gaps that could jeopardize your credentials.')}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">{t('modules.irataLogging.problemsSolved.technicians.problem4.title', '"Nobody actually verifies what I write in my logbook."')}</h4>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.technicians.problem4.description1', "You're supposed to get your logbook signed regularly by a Level 3 or supervisor. But realistically, you bring six months of entries to your boss and they just sign everything without looking. There's no actual verification that you did what you claim.")}
                  </p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.technicians.problem4.description2', 'When hours are logged same-day and linked to actual project locations, supervisors can verify entries against known work. "Tommy was at Marina Side today, I know there\'s rope transfers on that building. Approve." More credible records. More meaningful verification.')}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">{t('modules.irataLogging.problemsSolved.technicians.problem5.title', '"I switch between employers constantly."')}</h4>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.technicians.problem5.description1', 'Contract rope access work means moving between companies regularly. Each new employer has different systems. Some track hours digitally, some use paper, some track nothing at all. Building a coherent career record across multiple employers is nearly impossible.')}
                  </p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.technicians.problem5.description2', 'One profile. All employers. Every job you work through OnRopePro contributes to the same certification record, regardless of which company employed you that week.')}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Company Owners */}
            <AccordionItem value="owners" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="hover:no-underline px-4 py-4 bg-blue-50 dark:bg-blue-950" data-testid="accordion-trigger-owners">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-lg">{t('modules.irataLogging.problemsSolved.owners.title', 'For Company Owners')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-6 pt-4 space-y-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">{t('modules.irataLogging.problemsSolved.owners.problem1.title', '"I don\'t know if my techs are actually qualified."')}</h4>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.owners.problem1.description1', 'You hire a Level 2 tech who claims 2,000 hours of experience. But their logbook is a mess, with gaps everywhere, vague entries, and signatures from months ago. Are they actually experienced, or did they just accumulate time without developing real skills?')}
                  </p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.owners.problem1.description2', "When techs use OnRopePro, you can see their verified hour history with task breakdowns. You know exactly how much rigging, rescue, and specialized work they've actually performed. Hire with confidence. Assign techs to jobs that match their actual documented experience level.")}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">{t('modules.irataLogging.problemsSolved.owners.problem2.title', '"Signing logbooks is a rubber-stamp exercise."')}</h4>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.owners.problem2.description1', "Your Level 3s are supposed to verify and sign tech logbooks. In reality, techs show up with months of backlogged entries and your supervisors just sign everything. There's no meaningful quality control.")}
                  </p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.owners.problem2.description2', "Digital approval flow means supervisors can review and approve hours daily or weekly while details are fresh. They can see which projects the tech worked on and verify the task types make sense. Your company's signature on a tech's hours actually means something.")}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Level 3 Technicians & Supervisors */}
            <AccordionItem value="supervisors" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="hover:no-underline px-4 py-4 bg-sky-50 dark:bg-sky-950" data-testid="accordion-trigger-supervisors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <Award className="w-4 h-4 text-sky-600" />
                  </div>
                  <span className="font-semibold text-lg">{t('modules.irataLogging.problemsSolved.supervisors.title', 'For Level 3 Technicians & Supervisors')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-6 pt-4 space-y-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">{t('modules.irataLogging.problemsSolved.supervisors.problem1.title', '"I\'m signing off on hours I can\'t actually verify."')}</h4>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.supervisors.problem1.description1', "A tech brings you six months of logbook entries to sign. You weren't on every job with them. You have no idea if they actually did rope transfers on March 15th or if they're padding their book. But you sign anyway because that's how it's always been done.")}
                  </p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.irataLogging.problemsSolved.supervisors.problem1.description2', 'When entries are logged same-day and linked to specific projects, you can cross-reference against job records. "This tech logged rope transfers at Building X on Tuesday. I know that building has transfer points on the north elevation. Approve." Your IRATA/SPRAT number on an approval actually represents verification, not just rubber-stamping.')}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Measurable Results Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.irataLogging.results.title', 'Measurable Results')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.irataLogging.results.subtitle', 'Concrete improvements from day one.')}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.irataLogging.results.zeroDataLoss.title', 'Zero Data Loss')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.irataLogging.results.zeroDataLoss.description', 'Your hour history lives in your technician profile. Change employers, your records come with you. No more losing years of documented experience when you leave a company.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.irataLogging.results.sameDayAccuracy.title', 'Same-Day Accuracy')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.irataLogging.results.sameDayAccuracy.description', 'Hours logged the day you work them. No more reconstructing what happened three months ago from memory.')}
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
                    <Layers className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.irataLogging.results.taskDiversity.title', 'Complete Task Diversity')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.irataLogging.results.taskDiversity.description', "20+ task categories ensure your logged hours reflect the full range of work you perform. When it's time for Level 3 assessment, you have documented proof of diverse experience.")}
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
                    <Download className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.irataLogging.results.instantExport.title', 'Instant Export')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.irataLogging.results.instantExport.description', 'PDF export for any date range. Certification renewals, job applications, assessment preparation. Complete hour history available in seconds, not days of reconstructing paper records.')}
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
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.irataLogging.integration.title', 'Module Integration Points')}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            {t('modules.irataLogging.integration.subtitle', 'IRATA/SPRAT task logging connects directly with other OnRopePro modules for complete operational visibility.')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.irataLogging.integration.workSessions.title', 'Work Sessions & Time Tracking')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.irataLogging.integration.workSessions.description', 'Task logging triggers automatically when ending a work session. Hours from the session become the starting point for IRATA hour allocation. Zero duplicate data entry.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.irataLogging.integration.payroll.title', 'Payroll & Compensation')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.irataLogging.integration.payroll.description', 'Work session hours feed payroll calculations while task hours track certification progress separately. Same shift, different purposes. Owners see billable time, technicians see career advancement.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.irataLogging.integration.safety.title', 'Safety & Compliance')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.irataLogging.integration.safety.description', 'Harness inspections link to work sessions. IRATA logged hours include safety context. During audits, assessors can see that your logged rope hours occurred with proper safety protocols.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.irataLogging.integration.projects.title', 'Project Management')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.irataLogging.integration.projects.description', 'Each logged task links to the project where work was performed. Your logbook shows not just hours and tasks, but building names and project types for complete work history context.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.irataLogging.integration.profiles.title', 'Employee Profiles')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.irataLogging.integration.profiles.description', 'IRATA certification level displays on technician profiles. Logged hours accumulate toward next level requirements. Owners see crew qualification levels when assigning teams.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.irataLogging.integration.analytics.title', 'Analytics & Reporting')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.irataLogging.integration.analytics.description', 'Hours logged flow into company-wide analytics. Owners see skill distribution across their workforce. Identify gaps in team capabilities and plan training investments.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.irataLogging.faqs.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            {t('modules.irataLogging.faqs.subtitle', 'Common questions about IRATA/SPRAT task logging.')}
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.irataLogging.faqs.faq1.question', 'Does this replace my physical IRATA/SPRAT logbook?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.irataLogging.faqs.faq1.answer', 'No. IRATA and SPRAT still require physical logbooks. WorkSafeBC and other regulatory bodies may request to see your written records on-site. OnRopePro is a digital supplement that helps you maintain accurate records, never lose your hour history, and have a reliable backup for your paper logbook.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.irataLogging.faqs.faq2.question', 'What happens to my hours if I change employers?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.irataLogging.faqs.faq2.answer', 'Your IRATA/SPRAT hours belong to your technician profile, not your employer. When you move to a new company, your complete hour history comes with you automatically. No re-entry required.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.irataLogging.faqs.faq3.question', "Can I log hours if I'm not connected to an employer on the platform?")}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.irataLogging.faqs.faq3.answer', 'Yes. Independent technicians can manually log their hours and tasks. You can also scan your existing paper logbook to import historical data.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.irataLogging.faqs.faq4.question', 'How do I log training hours from external courses?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.irataLogging.faqs.faq4.answer', 'Training at IRATA/SPRAT schools counts as rope time. Use the manual entry feature to add training hours, specifying the training provider and skills practiced.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.irataLogging.faqs.faq5.question', "What's the difference between shift hours and task hours?")}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.irataLogging.faqs.faq5.answer', 'Shift hours are your total time at work. Task hours are the actual time performing rope access activities. An 8-hour shift might only include 6-7 hours of actual rope work after breaks, travel, and ground prep. The system prompts you to specify how many of your shift hours were actual task hours.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.irataLogging.faqs.faq6.question', "What if my employer doesn't use OnRopePro?")}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.irataLogging.faqs.faq6.answer', 'You can still create a technician account and log hours manually. When your employer eventually joins the platform (or you move to an employer who uses it), your existing hour history integrates automatically.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.irataLogging.faqs.faq7.question', 'Can Level 3s approve hours digitally?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.irataLogging.faqs.faq7.answer', 'Digital signature and approval flow is planned for future release (pending us contacting IRATA and SPRAT). Currently, hours log to your profile without supervisor sign-off. Once IRATA formally approves digital logging, the approval workflow will activate.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.irataLogging.faqs.faq8.question', 'What if I have no logged rope time for 6 months?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.irataLogging.faqs.faq8.answer', 'IRATA may consider your certification invalid until recertification if you have no logged rope time for 6 months. Consistent logging through OnRopePro ensures you never have unexplained gaps that could jeopardize your credentials.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.irataLogging.faqs.faq9.question', 'Is this a Plus feature or standard?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.irataLogging.faqs.faq9.answer', 'Logbook scanning and basic hour logging are available to all technician accounts. Certification progress tracking (hours remaining to next level) requires Plus.')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Important Disclaimer */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-rose-500 bg-rose-50 dark:bg-rose-950">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <CardTitle className="text-xl text-rose-900 dark:text-rose-100">{t('modules.irataLogging.disclaimer.title', 'Important Disclaimer')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-rose-900 dark:text-rose-100">
              <p className="font-semibold text-lg">
                {t('modules.irataLogging.disclaimer.heading', 'This Does NOT Replace Your Physical Logbook')}
              </p>
              <p className="text-base">
                {t('modules.irataLogging.disclaimer.paragraph1', "IRATA and SPRAT still require you to maintain a physical logbook. WorkSafeBC and other regulatory bodies may request to see your written logbook on-site. OnRopePro's digital logging is a supplement that helps you maintain accurate records, not a replacement for your official certification documentation.")}
              </p>
              <p className="text-base font-medium">
                {t('modules.irataLogging.disclaimer.paragraph2', "If you have no rope access work logged for 6 months, you must complete a refresher before returning to work, though your certification itself isn't considered invalid. Consistent logging ensures you're ready for your next job.")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="relative py-16 md:py-24 px-4 text-white" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('modules.irataLogging.footerCta.title', 'Stop Managing Logbook Compliance Through Guilt')}
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('modules.irataLogging.footerCta.subtitle', 'Start building verifiable certification records that actually mean something. Your career history deserves better than a messy paper logbook.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <FreeTrialButton 
              className="bg-white text-[#0B64A3]" 
              onClick={() => setShowRegistration(true)} 
              testId="button-footer-trial"
            />
            <Button size="lg" variant="outline" className="border-white/40 text-white" asChild data-testid="button-footer-faqs">
              <Link href="#faqs">
                {t('modules.irataLogging.footerCta.faqButton', 'Find Answers')}
                <BookOpen className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}
