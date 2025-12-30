import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import { SoftwareReplaces, MODULE_SOFTWARE_MAPPING } from "@/components/SoftwareReplaces";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Briefcase,
  Home,
  HardHat,
  Building2,
  Users,
  Shield,
  Clock,
  PenTool,
  AlertTriangle,
  Search,
  FileCheck,
  FileClock,
  Lock,
  BarChart3,
  ShieldCheck,
  Layers,
  Calendar,
  UserCheck,
  ClipboardList,
  RefreshCw,
  Eye
} from "lucide-react";

export default function DocumentManagementLanding() {
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
              {t('modules.documents.hero.badge', 'Document Management Module')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.documents.hero.title', 'When the Auditor Shows Up,')}<br />
              <span className="text-blue-100">{t('modules.documents.hero.subtitle', 'Will You Be Scrambling or Ready?')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.documents.hero.description', 'Every document. Every signature. Every timestamp. Searchable in seconds, not scattered across filing cabinets.')}<br />
              <strong>{t('modules.documents.hero.descriptionStrong', 'Build compliance records that protect your business when it matters most.')}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-hero-trial">
                {t('modules.documents.hero.ctaTrial', 'Start Your Free 60-Day Trial')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-hero-signin">
                {t('login.header.signIn', 'Sign In')}
              </Button>
            </div>
            
            <SoftwareReplaces 
              software={MODULE_SOFTWARE_MAPPING["document-management"]} 
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
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">&lt; 5 min</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.documents.stats.auditPrep', 'Audit prep, not hours')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">100%</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.documents.stats.acknowledgment', 'Acknowledgment visibility')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">{t('modules.documents.stats.neverValue', 'Never')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.documents.stats.insurance', 'Insurance lapses')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">{t('modules.documents.stats.permanentValue', 'Permanent')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('modules.documents.stats.tamperProof', 'Tamper-proof records')}</div>
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
            {t('modules.documents.problem.title', 'The Compliance Gap Nobody Talks About')}
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                {t('modules.documents.problem.intro', 'You handed your new hire the safety manual. He said "yep, I read it" and set it aside.')}
              </p>
              <p className="text-base">
                {t('modules.documents.problem.scenario', 'Two weeks later, he causes damage during a window cleaning job because he used a technique from his old company. Now you\'re facing a claim, and "he told me he read it" is your entire defense.')}
              </p>
              <p className="text-base">
                {t('modules.documents.problem.reality', 'Paper systems don\'t fail during normal operations. They fail during audits, lawsuits, and insurance investigations. The moment you need to prove compliance, you discover scattered files, missing signatures, and no way to verify who actually reviewed what.')}
              </p>
              <p className="text-base font-medium text-foreground">
                {t('modules.documents.problem.solution', 'OnRopePro treats document management as the foundation of your liability protection. Every acknowledgment is timestamped. Every signature is permanent. When WorkSafeBC asks for proof, you don\'t search. You generate a report.')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* What This Module Does */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.documents.features.title', 'What This Module Does')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.documents.features.subtitle', 'Your complete document compliance infrastructure. Centralizes every safety manual, policy, procedure, and certificate with digital signatures that create defensible compliance records.')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <PenTool className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.documents.features.signature.title', 'Digital Signature Capture')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  {t('modules.documents.features.signature.description', 'When employees review documents, they sign digitally with a captured timestamp. No more "I didn\'t know" excuses. The signature proves they saw the exact version you uploaded, on the exact date and time.')}
                </p>
                <div className="space-y-2 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">{t('modules.documents.features.signature.capturedLabel', 'What gets captured:')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t('modules.documents.features.signature.item1', 'Employee identity')}</li>
                    <li>{t('modules.documents.features.signature.item2', 'Document version reviewed')}</li>
                    <li>{t('modules.documents.features.signature.item3', 'Timestamp of acknowledgment')}</li>
                    <li>{t('modules.documents.features.signature.item4', 'Permanent audit record')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.documents.features.compliance.title', 'Compliance Status Tracking')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  {t('modules.documents.features.compliance.description', 'See exactly who has signed which documents, who has gaps, and who needs reminders. Dashboards show missing acknowledgments before they become audit findings.')}
                </p>
                <div className="space-y-2 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">{t('modules.documents.features.compliance.trackedLabel', 'What gets tracked:')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t('modules.documents.features.compliance.item1', 'Employee acknowledgment status per document')}</li>
                    <li>{t('modules.documents.features.compliance.item2', 'Missing signature alerts')}</li>
                    <li>{t('modules.documents.features.compliance.item3', 'New version notification requirements')}</li>
                    <li>{t('modules.documents.features.compliance.item4', 'Onboarding completion progress')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.documents.features.audit.title', 'Instant Audit Response')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  {t('modules.documents.features.audit.description', 'Generate compliance reports in seconds. When regulators, insurers, or attorneys ask for documentation, you provide professional reports instead of paper shuffling.')}
                </p>
                <div className="space-y-2 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">{t('modules.documents.features.audit.reportedLabel', 'What gets reported:')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t('modules.documents.features.audit.item1', 'Complete signature history by employee')}</li>
                    <li>{t('modules.documents.features.audit.item2', 'Document version control')}</li>
                    <li>{t('modules.documents.features.audit.item3', 'Acknowledgment timestamps')}</li>
                    <li>{t('modules.documents.features.audit.item4', 'Exportable PDF and CSV formats')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Stakeholder Benefits */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.documents.stakeholders.title', 'Who Benefits From This Module')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.documents.stakeholders.subtitle', 'Every stakeholder gets the document access and compliance visibility they need.')}
          </p>
          
          <div className="space-y-8">
            {/* For Employers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.documents.stakeholders.employers.title', 'For Employers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.documents.stakeholders.employers.liability.title', 'Liability protection that stands up in court.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.documents.stakeholders.employers.liability.description', 'Every signed document creates a permanent record with employee name, timestamp, and version. When accidents happen, you prove due diligence instead of scrambling for evidence.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.documents.stakeholders.employers.insurance.title', 'Insurance compliance without the panic.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.documents.stakeholders.employers.insurance.description', 'Upload your Certificate of Insurance with expiration tracking. The system warns you before renewal deadlines so you never lose work from lapsed coverage.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.documents.stakeholders.employers.history.title', 'Complete business history, accessible anywhere.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.documents.stakeholders.employers.history.description', 'Your safety procedures, policy changes, and training records become searchable institutional memory. Even when employees leave, compliance history stays.')}</p>
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
                  <CardTitle className="text-xl">{t('modules.documents.stakeholders.technicians.title', 'For Technicians')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.documents.stakeholders.technicians.procedures.title', 'Know exactly what procedures apply to you.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.documents.stakeholders.technicians.procedures.description', 'No more guessing whether you\'re following the right version. Your document list shows what requires your signature and what you\'ve already acknowledged.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.documents.stakeholders.technicians.record.title', 'Your compliance record travels with you.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.documents.stakeholders.technicians.record.description', 'Every document you sign becomes part of your professional history. When you move between employers within OnRopePro, your acknowledgments demonstrate your commitment to safety culture.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.documents.stakeholders.technicians.simple.title', 'Simple, clear process.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.documents.stakeholders.technicians.simple.description', 'Review the document, sign digitally, and you\'re done. No paper forms, no chasing supervisors for signature sheets.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Building Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-sky-50 dark:bg-sky-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-sky-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.documents.stakeholders.buildingManagers.title', 'For Building Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.documents.stakeholders.buildingManagers.confidence.title', 'Confidence in contractor safety culture.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.documents.stakeholders.buildingManagers.confidence.description', 'You can see a contractor\'s Company Safety Rating (CSR), which reflects document acknowledgment rates among their employees. High CSR means consistent safety engagement.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.documents.stakeholders.buildingManagers.protection.title', 'Protection for your property.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.documents.stakeholders.buildingManagers.protection.description', 'When contractors have verified training records and policy acknowledgments, you reduce your liability exposure from work performed at your building.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Property Managers */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.documents.stakeholders.propertyManagers.title', 'For Property Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.documents.stakeholders.propertyManagers.vendor.title', 'Vendor qualification at a glance.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.documents.stakeholders.propertyManagers.vendor.description', 'CSR scores tell you which rope access contractors maintain active safety cultures versus those running on paper and assumptions.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.documents.stakeholders.propertyManagers.diligence.title', 'Simplified due diligence.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.documents.stakeholders.propertyManagers.diligence.description', 'Instead of requesting individual documents, you can verify safety compliance through a single rating that aggregates employee acknowledgment data.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Residents */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Home className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.documents.stakeholders.residents.title', 'For Residents')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">{t('modules.documents.stakeholders.residents.safety.title', 'Work happens safely at your building.')}</h4>
                  <p className="text-base text-muted-foreground">{t('modules.documents.stakeholders.residents.safety.description', 'The contractors working outside your window have verified training records and acknowledged safety procedures. That\'s how professional operations work.')}</p>
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
            {t('modules.documents.keyFeatures.title', 'Key Features')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.documents.keyFeatures.subtitle', 'Every feature is built to create defensible compliance records that protect your business.')}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.documents.keyFeatures.immutableAudit.title', 'Immutable Audit Trail')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.documents.keyFeatures.immutableAudit.description', 'Once signed, signature records cannot be deleted or modified. This creates permanent, tamper-proof compliance documentation for regulators, insurers, and legal defense.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.documents.keyFeatures.swpTemplates.title', '15 Pre-Built SWP Templates')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.documents.keyFeatures.swpTemplates.description', 'Industry-standard Safe Work Procedure templates covering fall protection, anchor systems, rope techniques, and rescue procedures. Customize for your operations and generate professional PDFs.')}
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
                    <h3 className="font-semibold">{t('modules.documents.keyFeatures.safetyTopics.title', '10 Daily Safety Practice Topics')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.documents.keyFeatures.safetyTopics.description', 'Rotating safety discussion topics with employee acknowledgment tracking. Regular engagement demonstrates active safety culture and contributes to your CSR score.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.documents.keyFeatures.expirationTracking.title', 'Expiration Tracking')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.documents.keyFeatures.expirationTracking.description', 'Upload insurance certificates with expiration dates. The system provides advance warnings so you never get caught with lapsed coverage during a client request.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.documents.keyFeatures.roleBasedAccess.title', 'Role-Based Access')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.documents.keyFeatures.roleBasedAccess.description', 'Sensitive documents like Certificate of Insurance are restricted to Company Owner and Ops Manager roles. Technicians and supervisors see only what they need.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.documents.keyFeatures.csrIntegration.title', 'CSR Integration')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.documents.keyFeatures.csrIntegration.description', 'Employee document acknowledgment rates feed directly into your Company Safety Rating. Building managers can see your CSR, demonstrating your commitment to safety culture without exposing proprietary procedures.')}
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
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.documents.problemsSolved.title', 'Problems Solved')}
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            {t('modules.documents.problemsSolved.subtitle', 'Real problems. Real solutions. Organized by who you are.')}
          </p>

          <Accordion type="multiple" className="space-y-4">
            {/* For Employers */}
            <AccordionItem value="employers" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-lg font-semibold">{t('modules.documents.problemsSolved.employers.title', 'For Employers')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.documents.problemsSolved.employers.problem1.title', '"Employees Don\'t Actually Read Safety Documents"')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.documents.problemsSolved.employers.problem1.description', 'You hand an employee your company safety manual and tell them to read it. They take it, set it aside, and say "yep, I read it" without ever opening it. They just want to get on the ropes and start working. Now you have zero proof they understood your procedures, and if something goes wrong, their ignorance becomes your liability.')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.documents.problemsSolved.solutionLabel', 'Solution:')}</strong> {t('modules.documents.problemsSolved.employers.problem1.solution', 'Digital signature capture requires employees to actively acknowledge each document. The system records who signed, when they signed, and which specific document version they reviewed. Employees cannot claim ignorance when their signature is timestamped in the system.')}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.documents.problemsSolved.employers.problem2.title', '"Scrambling for Documents During WorkSafeBC Audits"')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.documents.problemsSolved.employers.problem2.description', 'WorkSafeBC shows up for an audit and you\'re scrambling. Paper files are scattered across filing cabinets, desk drawers, and maybe a folder on someone\'s computer. You have no idea who signed what, who saw what, when they saw it, or whether they saw it at all. The auditor is waiting while your operations manager digs through boxes.')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.documents.problemsSolved.solutionLabel', 'Solution:')}</strong> {t('modules.documents.problemsSolved.employers.problem2.solution', 'Centralized document storage with instant compliance reports. Every document, signature, and acknowledgment is searchable. Generate a complete compliance report showing all employee signatures in seconds, not hours.')}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.documents.problemsSolved.employers.problem3.title', '"Nobody Knows If Insurance Is Current"')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.documents.problemsSolved.employers.problem3.description', 'Your Certificate of Insurance is filed somewhere, but nobody remembers when it expires. You find out it lapsed when a building manager asks for current documentation, forcing you to scramble for a renewal that may take days. Meanwhile, you cannot legally work on that property.')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.documents.problemsSolved.solutionLabel', 'Solution:')}</strong> {t('modules.documents.problemsSolved.employers.problem3.solution', 'Upload insurance certificates with expiration date tracking. The system provides advance warnings before expiry so you can renew proactively. Restricted visibility ensures only authorized personnel access sensitive financial documents.')}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Operations Managers & Supervisors */}
            <AccordionItem value="operations" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-lg font-semibold">{t('modules.documents.problemsSolved.operations.title', 'For Operations Managers & Supervisors')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.documents.problemsSolved.operations.problem1.title', '"Some Employees Know Procedures, Some Don\'t, Some Think They Know"')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.documents.problemsSolved.operations.problem1.description', 'You have 15 technicians on payroll. Some have worked with you for years and know every procedure. New hires brought habits from previous companies that may contradict your standards. When you ask if everyone knows the fall protection procedure, you get nods, but you have no way to verify who actually reviewed the current version.')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.documents.problemsSolved.solutionLabel', 'Solution:')}</strong> {t('modules.documents.problemsSolved.operations.problem1.solution', 'Track acknowledgment status for every employee against every document. Instantly see who has signed which procedures and who has gaps. New hires cannot start work until they acknowledge all required documents.')}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.documents.problemsSolved.operations.problem2.title', '"Updated Procedures Go Unacknowledged"')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.documents.problemsSolved.operations.problem2.description', 'You updated the toolbox meeting procedure last month. Some employees signed the new version, some haven\'t seen it yet, and you have no visibility into the gap. When the next audit happens, you discover 5 employees never acknowledged the updated procedure.')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.documents.problemsSolved.solutionLabel', 'Solution:')}</strong> {t('modules.documents.problemsSolved.operations.problem2.solution', 'Compliance status reporting shows exactly which employees have missing acknowledgments. Dashboard alerts highlight gaps before they become audit findings.')}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Building Managers & Property Managers */}
            <AccordionItem value="building-managers" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <span className="text-lg font-semibold">{t('modules.documents.problemsSolved.buildingManagers.title', 'For Building Managers & Property Managers')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.documents.problemsSolved.buildingManagers.problem1.title', '"How Do I Know This Contractor Actually Trains Their People?"')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.documents.problemsSolved.buildingManagers.problem1.description', 'Any contractor can claim they have safety procedures. You have no way to verify whether employees actually review those procedures, or whether the contractor just has a dusty binder on a shelf somewhere. You\'re approving work based on promises, not evidence.')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.documents.problemsSolved.solutionLabel', 'Solution:')}</strong> {t('modules.documents.problemsSolved.buildingManagers.problem1.solution', 'Company Safety Rating (CSR) aggregates employee document acknowledgment rates into a visible score. You see ongoing engagement, not just claimed policies. High CSR means employees consistently acknowledge and review safety documentation.')}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Technicians */}
            <AccordionItem value="technicians" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-rose-600" />
                  </div>
                  <span className="text-lg font-semibold">{t('modules.documents.problemsSolved.technicians.title', 'For Technicians')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">{t('modules.documents.problemsSolved.technicians.problem1.title', '"I Don\'t Know What Procedures Apply Here"')}</p>
                  <p className="text-muted-foreground text-base">
                    {t('modules.documents.problemsSolved.technicians.problem1.description', 'Every company has different procedures. Your previous employer did anchoring differently. You want to follow the rules, but you\'re not sure which version is current or whether you\'ve seen everything you\'re supposed to see.')}
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <strong>{t('modules.documents.problemsSolved.solutionLabel', 'Solution:')}</strong> {t('modules.documents.problemsSolved.technicians.problem1.solution', 'Your document list clearly shows what requires your acknowledgment. Previously signed documents display the acknowledgment date. New versions trigger re-acknowledgment requirements. You always know where you stand.')}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Measurable Results */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.documents.measurableResults.title', 'Measurable Results')}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t('modules.documents.measurableResults.subtitle', 'Concrete improvements you can measure from day one.')}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.documents.measurableResults.auditPrep.title', 'Audit Preparation Time')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.documents.measurableResults.auditPrep.description', 'Audit preparation time reduced from hours to minutes. Generate complete employee signature reports instantly instead of searching through filing cabinets and scattered paper forms.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.documents.measurableResults.visibility.title', 'Compliance Visibility')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.documents.measurableResults.visibility.description', '100% visibility into employee acknowledgment status. Dashboard shows exactly who has signed which documents and who has gaps, eliminating audit surprises and enabling proactive gap closure.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <FileClock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.documents.measurableResults.insurance.title', 'Insurance Protection')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.documents.measurableResults.insurance.description', 'Never get caught with expired insurance coverage. Advance expiration warnings ensure proactive renewal so you never lose work from lapsed documentation.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('modules.documents.measurableResults.liability.title', 'Liability Defense')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('modules.documents.measurableResults.liability.description', 'Immutable signature records with timestamps create defensible compliance documentation. When incidents occur, you prove due diligence with permanent audit trail, not verbal assurances.')}
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
            {t('modules.documents.moduleIntegration.title', 'Other Modules This Module Communicates With')}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            {t('modules.documents.moduleIntegration.subtitle', 'Document Management integrates with other OnRopePro modules to create connected compliance infrastructure.')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.documents.moduleIntegration.userAccess.title', 'User Access & Authentication')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.documents.moduleIntegration.userAccess.description', 'Permissions control who can upload, view, and manage documents. Company owners have full access while technicians see only documents relevant to their role.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.documents.moduleIntegration.safety.title', 'Safety & Compliance')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.documents.moduleIntegration.safety.description', 'Safe Work Procedures integrate with harness inspections and toolbox meetings. Employee acknowledgment of safety documents feeds into the broader compliance picture.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.documents.moduleIntegration.csr.title', 'Company Safety Rating (CSR)')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.documents.moduleIntegration.csr.description', 'Document acknowledgment rates contribute directly to your CSR score. Building managers see your CSR without accessing your actual documents.')}
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
                    <h3 className="font-semibold">{t('modules.documents.moduleIntegration.employees.title', 'Employee Management')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.documents.moduleIntegration.employees.description', 'Employee records link to document acknowledgment history. When you review an employee\'s profile, you see their complete compliance status.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.documents.moduleIntegration.buildingManager.title', 'Building Manager Portal')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.documents.moduleIntegration.buildingManager.description', 'Building managers can view your CSR score, which reflects document acknowledgment engagement. They cannot see your actual documents or procedures.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Business Impact Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('modules.documents.businessImpact.title', 'Stop Chasing Signatures. Start Building Defensible Compliance.')}
          </h2>
          
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-base">
                {t('modules.documents.businessImpact.paragraph1', 'Right now, your compliance exists in filing cabinets, desk drawers, and employee memories. You hope your technicians read the safety manual. You assume your Certificate of Insurance is current. You trust that everyone follows the same procedures they learned whenever they were last trained.')}
              </p>
              <p className="text-base">
                {t('modules.documents.businessImpact.paragraph2', 'When nothing goes wrong, this works fine. When something goes wrong, it doesn\'t.')}
              </p>
              <p className="text-base">
                {t('modules.documents.businessImpact.paragraph3', 'A WorkSafeBC auditor asks for proof that all employees reviewed your fall protection procedures. You spend an hour searching while technicians wait on standby. An insurance investigator requests documentation after an incident. You realize your COI expired three weeks ago. A lawsuit demands evidence that an employee was trained on the procedure they violated. You have nothing timestamped.')}
              </p>
              <p className="font-medium text-foreground text-base">
                {t('modules.documents.businessImpact.paragraph4', 'Document Management turns scattered compliance into professional infrastructure. Every document is centralized. Every signature is timestamped. Every acknowledgment is permanent. When you need proof, you generate a report.')}
              </p>
              <Separator className="my-6" />
              <p className="text-base">
                {t('modules.documents.businessImpact.paragraph5', 'Your technicians know which procedures apply to them. Your operations manager sees exactly who has gaps. Your auditors get instant answers. Your liability defense has documented evidence.')}
              </p>
              <p className="font-medium text-foreground text-lg">
                {t('modules.documents.businessImpact.paragraph6', 'You\'re not just storing files. You\'re building a compliance history that protects your business.')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.documents.faqs.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            {t('modules.documents.faqs.subtitle', 'Common questions about document management and compliance.')}
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.documents.faqs.faq1.question', 'Can I edit or delete a signed document acknowledgment?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.documents.faqs.faq1.answer', 'No. Once a document acknowledgment is signed, the signature record is permanent and cannot be modified or deleted. This creates an immutable audit trail that protects both employers and employees. Regulators require tamper-proof documentation to verify compliance.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.documents.faqs.faq2.question', 'What happens when I update a document?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.documents.faqs.faq2.answer', 'When you upload a new version, the system creates a new document that requires fresh acknowledgments from all employees. Previous signatures remain associated with the previous version. This ensures employees always acknowledge the current procedure, not an outdated version.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.documents.faqs.faq3.question', 'Who can see my Certificate of Insurance?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.documents.faqs.faq3.answer', 'Only Company Owner and Ops Manager roles can view COI documents. Supervisors and Technicians cannot access these restricted financial documents. Insurance certificates contain sensitive financial information that should be limited to authorized personnel.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.documents.faqs.faq4.question', 'How do Safe Work Practices affect my CSR?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.documents.faqs.faq4.answer', 'Employee acknowledgment of daily safety practice topics contributes positively to your Company Safety Rating. Consistent engagement demonstrates an active safety culture. CSR rewards companies that don\'t just have safety documents but actively engage employees with safety topics.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.documents.faqs.faq5.question', 'Can building managers see my documents?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.documents.faqs.faq5.answer', 'Building managers cannot see your actual documents. They can see your CSR score, which reflects your overall safety compliance including document acknowledgment rates. This protects your proprietary procedures while giving building managers confidence in your safety practices.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.documents.faqs.faq6.question', 'What file types are supported?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.documents.faqs.faq6.answer', 'PDF, DOC, and DOCX files are supported for document uploads. File type validation ensures only appropriate formats are accepted.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.documents.faqs.faq7.question', 'What happens if an employee leaves?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.documents.faqs.faq7.answer', 'Their signature history remains in the system permanently. This maintains your audit trail even after employment ends. You can still prove that a former employee acknowledged specific procedures during their tenure.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.documents.faqs.faq8.question', 'How does this integrate with onboarding?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.documents.faqs.faq8.answer', 'New employees see all required documents highlighted for acknowledgment. Onboarding checklists can include document acknowledgment milestones. New hires cannot claim they missed required procedures because the system tracks completion status.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.documents.faqs.faq9.question', 'Can employees sign from mobile devices?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.documents.faqs.faq9.answer', 'Yes. Document review and digital signature capture work from any device. Technicians can acknowledge procedures from the field without returning to the office.')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-10" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                {t('modules.documents.faqs.faq10.question', 'What\'s included in compliance reports?')}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground text-base">
                {t('modules.documents.faqs.faq10.answer', 'Reports show employee signature status by document, acknowledgment timestamps, missing signature alerts, and complete version history. Export as PDF for professional audit presentation or CSV for data analysis.')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 text-white" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('modules.documents.cta.title', 'Ready to Build Defensible Compliance?')}
          </h2>
          <p className="text-lg text-blue-100">
            {t('modules.documents.cta.subtitle', 'Upload your first document and capture employee signatures in under 5 minutes.')}<br />
            {t('modules.documents.cta.subtitleLine2', 'Full access. No credit card. Permanent audit trail from day one.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-cta-trial">
              {t('modules.documents.cta.trialButton', 'Start Your Free 60-Day Trial')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-cta-faqs">
              <Link href="#faqs">
                {t('modules.documents.cta.faqButton', 'Find Answers')}
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
            <img src={onRopeProLogo} alt={t('modules.documents.footer.logoAlt', 'OnRopePro')} className="h-8 object-contain" />
            <span className="text-sm text-muted-foreground">{t('modules.documents.footer.tagline', 'Management Software for Rope Access')}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">
              {t('modules.documents.footer.privacy', 'Privacy Policy')}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">
              {t('modules.documents.footer.terms', 'Terms of Service')}
            </Link>
          </div>
        </div>
      </footer>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}
