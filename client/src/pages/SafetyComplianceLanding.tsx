import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useSafetyAuthority } from "@/hooks/useSafetyAuthority";
import { PublicHeader } from "@/components/PublicHeader";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import { SoftwareReplaces, MODULE_SOFTWARE_MAPPING } from "@/components/SoftwareReplaces";
import {
  Shield,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  ArrowRight,
  AlertTriangle,
  Package,
  ClipboardCheck,
  Building2,
  Gauge,
  Download,
  HardHat,
  Search,
  Camera,
  XCircle,
  Timer,
  ChevronRight,
  Briefcase,
  Scale,
  TrendingDown,
  BookOpen,
  Signature,
  Calendar,
  Quote,
  UserX,
  Globe,
  Lock,
  Sparkles,
  Smartphone,
  RefreshCw
} from "lucide-react";

export default function SafetyComplianceLanding() {
  const { t } = useTranslation();
  const [expandedProblems, setExpandedProblems] = useState<string[]>([]);
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);
  const [, setLocation] = useLocation();
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [allZero, setAllZero] = useState(false);
  const authorityName = useSafetyAuthority();

  // Initialize countdown numbers
  useEffect(() => {
    const start1 = Math.floor(Math.random() * 100) + 50;
    const start2 = Math.floor(Math.random() * 80) + 40;
    const start3 = Math.floor(Math.random() * 100) + 50;

    let current1 = start1, current2 = start2, current3 = start3;
    setCount1(current1);
    setCount2(current2);
    setCount3(current3);
    
    const interval = setInterval(() => {
      if (current1 > 0) { current1--; setCount1(current1); }
      if (current2 > 0) { current2--; setCount2(current2); }
      if (current3 > 0) { current3--; setCount3(current3); }
      
      // Check if all counters have reached zero
      if (current1 === 0 && current2 === 0 && current3 === 0) {
        setAllZero(true);
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" />

      {/* Hero Section - Following Module Hero Template from design_guidelines.md */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              {t('modules.safety.hero.badge', 'Safety & Compliance Module')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.safety.hero.titleLine1', '{{authority}} just pulled', { authority: authorityName })}<br />
              {t('modules.safety.hero.titleLine2', 'into the parking lot.')}<br />
              <span className="text-blue-100">{t('modules.safety.hero.titleLine3', 'Are you ready?')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.safety.hero.descriptionLine1', 'Daily harness inspections. Toolbox meetings.')}<br />
              {t('modules.safety.hero.descriptionLine2', 'Equipment tracking. Digital signatures.')}<br />
              <strong>{t('modules.safety.hero.descriptionLine3', 'All searchable. All exportable. All defensible.')}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-hero-trial">
                {t('modules.safety.hero.ctaTrial', 'Start Your Free 60-Day Trial')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-hero-signin">
                {t('login.header.signIn', 'Sign In')}
              </Button>
            </div>
            
            <SoftwareReplaces 
              software={MODULE_SOFTWARE_MAPPING["safety-compliance"]} 
              className="mt-8 bg-white/5 rounded-lg mx-auto max-w-2xl [&_span]:text-blue-100 [&_svg]:text-blue-200"
            />
          </div>
        </div>
        
        {/* Wave separator - positioned to overlap with white section below */}
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
                  <div className="text-3xl md:text-4xl font-bold text-sky-600">{count1}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.safety.stats.missingForms', 'Missing forms')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">{count2}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.safety.stats.failedAudits', 'Failed audits')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">{count3}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.safety.stats.sleeplessNights', 'Sleepless nights')}</div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-3xl md:text-4xl font-bold text-amber-600 transition-opacity duration-300"
                    style={{ display: 'inline-block' }}
                  >
                    {allZero ? '∞' : '8'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.safety.stats.searchableHistory', 'Searchable history')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('modules.safety.problem.title', 'The Scramble You Know Too Well')}
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                {t('modules.safety.problem.paragraph1', 'Most rope access operators know exactly what happens when the auditor asks for six months of harness inspections.')}
              </p>
              <p>
                {t('modules.safety.problem.paragraph2', 'The truck gets searched. The binder gets dug out. Someone says "I think Dave had that folder." Half the forms are missing. The ones you find have coffee stains and illegible handwriting.')}
              </p>
              <p>
                {t('modules.safety.problem.paragraph3', "You pass the audit. Barely. And you promise yourself you'll get organized.")}
              </p>
              <p className="font-medium text-foreground">
                {t('modules.safety.problem.paragraph4', 'Until next time, when the exact same scramble happens again.')}
              </p>
              <Separator className="my-6" />
              <p>
                {t('modules.safety.problem.paragraph5', 'Meanwhile, your insurance carrier wants proof of your safety culture. Your property manager wants documentation before every job. And if someone gets hurt, the first question a lawyer asks is:')}
              </p>
              <blockquote className="border-l-4 border-rose-500 pl-4 py-2 bg-rose-50 dark:bg-rose-950 rounded-r text-rose-900 dark:text-rose-100 font-medium">
                {t('modules.safety.problem.quote', '"Can you prove you conducted the required inspections?"')}
              </blockquote>
              <p className="text-foreground font-medium">
                {t('modules.safety.problem.paragraph6', "Paper forms can't protect you. Filing cabinets can't protect you. The best technicians in the world can't protect you if there's no record of what they did.")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.safety.features.title', 'What This Module Does')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.safety.features.subtitle', 'Complete safety documentation that creates itself through daily use.')}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Harness Inspections */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center mb-3">
                  <HardHat className="w-6 h-6 text-sky-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.safety.solutionCards.harness.title', 'Every Harness Inspection. Every Day. No Exceptions.')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{t('modules.safety.solutionCards.harness.description', 'Before any technician starts a work session, they complete a digital inspection on their phone.')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.safety.solutionCards.harness.bullet1', 'Webbing, buckles, stitching, D-rings, labels checked')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.safety.solutionCards.harness.bullet2', 'Pass/fail recorded for each item')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.safety.solutionCards.harness.bullet3', 'Photos attached for wear or damage')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.safety.solutionCards.harness.bullet4', 'Failed equipment auto-flagged for retirement')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Toolbox Meetings */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.safety.solutionCards.toolbox.title', 'Toolbox Meetings That Actually Happened')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{t('modules.safety.solutionCards.toolbox.description', 'Choose from 20+ rope access safety topics and document who attended.')}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.safety.solutionCards.toolbox.bullet1', 'Fall protection, rescue, anchors, weather')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.safety.solutionCards.toolbox.bullet2', 'Digital signatures or checkbox confirmation')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.safety.solutionCards.toolbox.bullet3', 'Daily coverage tracked automatically')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.safety.solutionCards.toolbox.bullet4', "Never wonder if you're compliant")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Audit PDFs */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center mb-3">
                  <Download className="w-6 h-6 text-violet-600" />
                </div>
                <CardTitle className="text-xl">{t('modules.safety.solutionCards.audit.title', 'Audit-Ready PDFs in Four Clicks')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{t('modules.safety.solutionCards.audit.description', "When the IRATA auditor calls, you don't panic. You search and export.")}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.safety.solutionCards.audit.bullet1', 'Search by date, technician, or serial number')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.safety.solutionCards.audit.bullet2', 'Professional PDFs with embedded signatures')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.safety.solutionCards.audit.bullet3', 'Same PDFs for insurance and property managers')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <span>{t('modules.safety.solutionCards.audit.bullet4', 'Legal protection if anything goes to court')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Not For Everyone Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-slate-300 dark:border-slate-700">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                  <UserX className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">{t('modules.safety.notForEveryone.title', 'Not For Everyone')}</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg font-medium text-foreground">
                  {t('modules.safety.notForEveryone.subtitle', "This software isn't for every rope access company.")}
                </p>
                <p>
                  {t('modules.safety.notForEveryone.paragraph1', "If you're running crews without proper inspections, OnRopePro will expose that. If your toolbox meetings are fiction, the system will make that obvious. If equipment stays in rotation after it should have been retired, there will be a record.")}
                </p>
                <p className="font-medium text-foreground">
                  {t('modules.safety.notForEveryone.paragraph2', 'The transparency is the point.')}
                </p>
                <p>
                  {t('modules.safety.notForEveryone.paragraph3', "OnRopePro is built for operators who actually care about keeping their technicians safe. Companies that want to prove they're doing things right. Companies that welcome audits because they know what the auditor will find.")}
                </p>
                <p className="text-foreground font-medium">
                  {t('modules.safety.notForEveryone.paragraph4', "If you'd rather not have visibility into your own safety compliance, keep using paper forms. They're much easier to lose.")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Problems Solved Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.safety.problemsSolved.title', 'Who This Is For')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            {t('modules.safety.problemsSolved.subtitle', 'Real problems from operators just like you.')}
          </p>

          <Accordion type="multiple" value={expandedProblems} onValueChange={setExpandedProblems} className="space-y-4">
            <AccordionItem value="organized" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left" data-testid="accordion-organized">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  <span className="font-semibold">{t('modules.safety.problemsSolved.organized.title', 'For the operator who\'s "been meaning to get organized"')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground pb-4">
                <p>{t('modules.safety.problemsSolved.organized.p1', "You've said it for years. You'll fix the filing system. You'll buy better binders. You'll make everyone fill out the forms properly.")}</p>
                <p>{t('modules.safety.problemsSolved.organized.p2', 'But the season starts, you\'re short-staffed, jobs stack up, and safety paperwork becomes "something we\'ll catch up on later."')}</p>
                <p className="text-foreground font-medium">{t('modules.safety.problemsSolved.organized.p3', "The problem isn't discipline. The problem is that paper systems require constant effort to maintain. Digital systems require one-time setup and then they just work.")}</p>
                <p>{t('modules.safety.problemsSolved.organized.p4', "Your techs complete inspections on their phones while waiting for the elevator. The records exist whether you're paying attention or not.")}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="audit" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left" data-testid="accordion-audit">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="w-5 h-5 text-sky-600 shrink-0" />
                  <span className="font-semibold">{t('modules.safety.problemsSolved.audit.title', "For the operator who's been through an audit")}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground pb-4">
                <p>{t('modules.safety.problemsSolved.audit.p1', "You know the sick feeling when someone asks for documentation you're not 100% sure you have.")}</p>
                <p>{t('modules.safety.problemsSolved.audit.p2', "You've made promises to yourself about how next time will be different.")}</p>
                <p className="text-foreground font-medium">{t('modules.safety.problemsSolved.audit.p3', "Here's how next time actually becomes different: the records create themselves. Daily. Automatically. With timestamps and signatures that can't be disputed.")}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="liability" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left" data-testid="accordion-liability">
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="font-semibold">{t('modules.safety.problemsSolved.liability.title', 'For the operator worried about liability')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground pb-4">
                <p>{t('modules.safety.problemsSolved.liability.p1', "Rope access work is dangerous. Everyone knows it. That's why IRATA and SPRAT exist. That's why inspections are mandatory.")}</p>
                <p>{t('modules.safety.problemsSolved.liability.p2', 'But mandatory and documented are not the same thing.')}</p>
                <p className="text-foreground font-medium">{t('modules.safety.problemsSolved.liability.p3', "If a harness fails and someone gets hurt, the investigation starts with one question: can you prove you inspected it? Can you prove you trained your people? Can you prove you discussed the specific hazards of this specific job?")}</p>
                <p>{t('modules.safety.problemsSolved.liability.p4', "With paper forms, you're hoping the right pieces of paper exist and can be found. With digital records, you know exactly what exists because you can search for it.")}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 md:py-20 px-4 max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            {t('modules.safety.keyFeatures.title', 'Key Features')}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base mb-8">
            {t('modules.safety.keyFeatures.subtitle', 'Digital safety documentation that keeps your team safer and your business protected. From equipment tracking to compliance audits, everything in one integrated system.')}
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.safety.keyFeatures.mobileInspections.title', 'Mobile-First Inspections')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('modules.safety.keyFeatures.mobileInspections.description', 'Technicians complete harness and equipment inspections on their phones. Guided checklists with photos and notes. Takes 2 minutes.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.safety.keyFeatures.toolboxTracking.title', 'Toolbox Meeting Tracking')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('modules.safety.keyFeatures.toolboxTracking.description', 'Run daily or weekly toolbox meetings. Topics from 20+ safety subjects. Technicians sign attendance digitally.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.safety.keyFeatures.equipmentLifecycle.title', 'Equipment Lifecycle Management')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('modules.safety.keyFeatures.equipmentLifecycle.description', 'Track purchase dates, service life, retirement dates. Failed equipment automatically flagged and removed from availability.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.safety.keyFeatures.auditPdfs.title', 'Audit-Ready PDFs')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('modules.safety.keyFeatures.auditPdfs.description', 'Search by equipment, technician, date, or project. Export comprehensive reports instantly. Ready for insurance or IRATA audits.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.safety.keyFeatures.automaticFlagging.title', 'Automatic Flagging')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('modules.safety.keyFeatures.automaticFlagging.description', 'Equipment that fails inspection gets flagged immediately. Retirement workflows trigger automatically.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                    <Signature className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.safety.keyFeatures.digitalSignatures.title', 'Digital Signatures')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('modules.safety.keyFeatures.digitalSignatures.description', 'Every inspection and meeting includes timestamped digital signatures. Complete audit trail for compliance.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Features Grid */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.safety.everythingYouNeed.title', 'Everything You Need')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.safety.everythingYouNeed.subtitle', 'Complete safety documentation in one integrated system.')}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Package}
              title={t('modules.safety.everythingYouNeed.equipmentInventory.title', 'Equipment Inventory')}
              description={t('modules.safety.everythingYouNeed.equipmentInventory.description', 'Track every harness, lanyard, descender, ascender, and rope. Serial numbers, manufacturers, purchase dates, service life remaining.')}
            />
            <FeatureCard
              icon={ClipboardCheck}
              title={t('modules.safety.everythingYouNeed.dailyChecklists.title', 'Daily Inspection Checklists')}
              description={t('modules.safety.everythingYouNeed.dailyChecklists.description', 'Digital forms guide technicians through every required check. Binary pass/fail for each item with notes and photos.')}
            />
            <FeatureCard
              icon={AlertTriangle}
              title={t('modules.safety.everythingYouNeed.automaticFlagging.title', 'Automatic Flagging')}
              description={t('modules.safety.everythingYouNeed.automaticFlagging.description', 'Equipment that fails inspection gets flagged immediately. Retirement workflows trigger automatically.')}
            />
            <FeatureCard
              icon={BookOpen}
              title={t('modules.safety.everythingYouNeed.safetyTopics.title', '20+ Safety Topics')}
              description={t('modules.safety.everythingYouNeed.safetyTopics.description', 'Fall protection, weather assessment, rescue procedures, anchor inspection, load calculations, and more.')}
            />
            <FeatureCard
              icon={Signature}
              title={t('modules.safety.everythingYouNeed.digitalSignatures.title', 'Digital Signatures')}
              description={t('modules.safety.everythingYouNeed.digitalSignatures.description', 'Attendance at toolbox meetings verified with legally binding signatures. Timestamps captured automatically.')}
            />
            <FeatureCard
              icon={Search}
              title={t('modules.safety.everythingYouNeed.searchableHistory.title', 'Searchable History')}
              description={t('modules.safety.everythingYouNeed.searchableHistory.description', 'Find any inspection by date, technician, equipment serial number, or project. No more digging through boxes.')}
            />
          </div>
        </div>
      </section>

      {/* Quantified Benefits */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('modules.safety.measurableResults.title', 'Measurable Results')}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/50">
              <CardContent className="p-6 flex gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                  <TrendingDown className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-100">{t('modules.safety.measurableResults.insurance.title', 'Insurance Carriers Want Documentation')}</h3>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                    {t('modules.safety.measurableResults.insurance.description', "When your insurance carrier audits your safety program, they're looking for evidence of systematic risk management. Complete records demonstrate exactly that.")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-sky-200 dark:border-sky-900 bg-sky-50/50 dark:bg-sky-950/50">
              <CardContent className="p-6 flex gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                  <Timer className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-sky-900 dark:text-sky-100">{t('modules.safety.measurableResults.auditPrep.title', 'Audit Preparation: Days to Minutes')}</h3>
                  <p className="text-sm text-sky-800 dark:text-sky-200 mt-1">
                    {t('modules.safety.measurableResults.auditPrep.description', 'The scramble before an IRATA audit used to take days. Now it takes minutes. Search. Export. Done.')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-900 bg-violet-50/50 dark:bg-violet-950/50">
              <CardContent className="p-6 flex gap-4">
                <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-violet-900 dark:text-violet-100">{t('modules.safety.measurableResults.liability.title', 'Liability Protection')}</h3>
                  <p className="text-sm text-violet-800 dark:text-violet-200 mt-1">
                    {t('modules.safety.measurableResults.liability.description', 'In accident investigations, documented proof of due diligence changes everything. Demonstrate exactly what happened.')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/50">
              <CardContent className="p-6 flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                  <Gauge className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100">{t('modules.safety.measurableResults.equipmentRoi.title', 'Equipment ROI Tracking')}</h3>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                    {t('modules.safety.measurableResults.equipmentRoi.description', 'Know exactly how long each piece of equipment lasts in service. Predict replacement needs. Budget accurately.')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.safety.testimonials.title', 'What Operators Are Saying')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.safety.testimonials.subtitle', 'Real feedback from rope access companies using the Safety & Compliance module.')}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote={t('modules.safety.testimonials.quote1', "The first time an insurance auditor asked for our inspection records and I exported six months of documentation in thirty seconds, I knew we'd never go back to paper.")}
            />
            <TestimonialCard
              quote={t('modules.safety.testimonials.quote2', "I used to spend Sunday nights worrying about whether we'd covered our bases. Now I just check the dashboard. Everything's there or it isn't, and there's no ambiguity.")}
            />
            <TestimonialCard
              quote={t('modules.safety.testimonials.quote3', "A property manager called asking for proof we'd done a toolbox meeting before working on their building. I sent the PDF while we were still on the phone. That's the kind of professionalism that keeps contracts.")}
            />
          </div>
        </div>
      </section>

      {/* Objection Handling */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('modules.safety.commonQuestions.title', 'Common Questions')}
          </h2>

          <div className="space-y-6">
            <ObjectionCard
              question={t('modules.safety.commonQuestions.q1.question', 'My techs hate paperwork.')}
              answer={t('modules.safety.commonQuestions.q1.answer', "So do everyone's techs. That's why this works. Completing an inspection on a phone takes less than two minutes. It's faster than filling out a paper form, and they don't have to remember to bring the forms back to the office.")}
            />
            <ObjectionCard
              question={t('modules.safety.commonQuestions.q2.question', "We're too small to need software.")}
              answer={t('modules.safety.commonQuestions.q2.answer', "The smaller you are, the more every audit matters. One failed IRATA audit. One insurance coverage gap. One lawsuit where you can't prove due diligence. The cost of any of those is more than years of software.")}
            />
            <ObjectionCard
              question={t('modules.safety.commonQuestions.q3.question', 'Paper has worked fine so far.')}
              answer={t('modules.safety.commonQuestions.q3.answer', "Has it? Or have you just been lucky? Every operator who lost their certification or lost a lawsuit thought paper was working fine right up until it wasn't.")}
            />
            <ObjectionCard
              question={t('modules.safety.commonQuestions.q4.question', "I don't have time to set this up.")}
              answer={t('modules.safety.commonQuestions.q4.answer', 'Initial setup takes an afternoon. Add your equipment. Add your techs. After that, the system maintains itself through daily use. The time you save over the next month pays back the setup time ten times over.')}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-sky-600 via-sky-700 to-blue-900 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('modules.safety.finalCta.title', "Stop wondering if you're compliant.")}<br />
            <span className="text-sky-200">{t('modules.safety.finalCta.titleHighlight', 'Start knowing.')}</span>
          </h2>
          <p className="text-xl text-sky-100">
            {t('modules.safety.finalCta.subtitle', 'Every harness inspection. Every toolbox meeting. Every signature.')}
            <br />
            {t('modules.safety.finalCta.subtitle2', 'Searchable, exportable, and ready for whatever audit comes next.')}
          </p>
          <div className="pt-4">
            <Button size="lg" className="bg-white text-sky-700 hover:bg-sky-50" onClick={() => setShowRegistration(true)} data-testid="button-final-cta">
              {t('modules.safety.finalCta.button', 'Start Your Free 60-Day Trial')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-sm text-sky-200 mt-4">
              {t('modules.safety.finalCta.disclaimer', 'Free 90-day trial for Founding Members. No credit card required.')}
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4 border-t">
        <div className="max-w-4xl mx-auto">
          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
            <CardContent className="p-4 text-sm text-amber-900 dark:text-amber-100">
              <p className="flex items-center gap-2 font-semibold mb-2">
                <AlertTriangle className="w-4 h-4" />
                {t('modules.safety.disclaimer.title', 'Important: Safety Compliance Responsibility')}
              </p>
              <p>
                {t('modules.safety.disclaimer.text', 'OnRopePro helps document safety procedures, but you remain fully responsible for workplace safety and regulatory compliance. This software does not replace qualified safety professionals, irata/SPRAT training, equipment inspections by certified inspectors, or adherence to all applicable OSHA/WorkSafeBC regulations.')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 text-sky-600" />
        </div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ObjectionCard({ question, answer }: { question: string; answer: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-sky-600" />
          "{question}"
        </h3>
        <p className="text-muted-foreground text-sm pl-6">{answer}</p>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ quote }: { quote: string }) {
  return (
    <Card className="bg-white dark:bg-slate-800">
      <CardContent className="p-6">
        <Quote className="w-8 h-8 text-sky-200 dark:text-sky-800 mb-3" />
        <p className="text-muted-foreground text-sm leading-relaxed italic">
          "{quote}"
        </p>
      </CardContent>
    </Card>
  );
}
