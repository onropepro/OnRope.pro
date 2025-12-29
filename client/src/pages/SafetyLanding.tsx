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
import { useTranslation } from "react-i18next";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  Users,
  Building2,
  HardHat,
  TrendingUp,
  Award,
  Target,
  ShieldCheck,
  ClipboardCheck,
  FileCheck,
  Gauge,
  RefreshCw,
  Briefcase,
  Eye,
  BarChart3,
  ChevronRight,
  CircleDot,
  UserCheck
} from "lucide-react";

export default function SafetyLanding() {
  const [, setLocation] = useLocation();
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" stakeholderColor="#193a63" />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #193a63 0%, #112a4d 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-safety-label">
              {t('safetyManifesto.hero.badge')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('safetyManifesto.hero.title')}<br />
              <span className="text-blue-100">{t('safetyManifesto.hero.titleHighlight')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('safetyManifesto.hero.description1')}<br />
              {t('safetyManifesto.hero.description2')}<br />
              <strong className="text-white">{t('safetyManifesto.hero.description3')}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#193a63] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-hero-trial">
                {t('safetyManifesto.hero.ctaButton')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-hero-signin">
                {t('safetyManifesto.hero.signInButton')}
              </Button>
            </div>
            
            <p className="text-sm text-blue-200 pt-2">
              {t('safetyManifesto.hero.freeNote')}
            </p>
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
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-12">
          <Card className="shadow-xl border-0 relative z-20 -mt-20">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#95ADB6]">{t('safetyManifesto.stats.measured')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('safetyManifesto.stats.measuredDesc')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#0B64A3]">{t('safetyManifesto.stats.portable')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('safetyManifesto.stats.portableDesc')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">{t('safetyManifesto.stats.visible')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('safetyManifesto.stats.visibleDesc')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-violet-600">{t('safetyManifesto.stats.permanent')}</div>
                  <div className="text-base text-muted-foreground mt-1">{t('safetyManifesto.stats.permanentDesc')}</div>
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
            {t('safetyManifesto.problem.title')}
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                {t('safetyManifesto.problem.intro')}
              </p>
              <p className="text-base">
                {t('safetyManifesto.problem.p1')}
              </p>
              <p className="text-base">
                {t('safetyManifesto.problem.p2')}
              </p>
              <p className="text-base font-medium text-foreground">
                {t('safetyManifesto.problem.p3')}
              </p>
              <Separator className="my-6" />
              <p className="text-base">
                {t('safetyManifesto.problem.solution')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Two Scores Section */}
      <section id="scores" className="pt-8 md:pt-12 pb-16 md:pb-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('safetyManifesto.scores.title')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('safetyManifesto.scores.subtitle')}<br />
            {t('safetyManifesto.scores.subtitle2')}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PSR Card */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{backgroundColor: '#95ADB6'}}></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{backgroundColor: 'rgba(171, 69, 33, 0.1)'}}>
                  <UserCheck className="w-6 h-6" style={{color: '#95ADB6'}} />
                </div>
                <CardTitle className="text-xl">{t('safetyManifesto.scores.psr.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base text-muted-foreground">
                  {t('safetyManifesto.scores.psr.description')}
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-600" />
                    <span className="text-base">{t('safetyManifesto.scores.psr.item1')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-600" />
                    <span className="text-base">{t('safetyManifesto.scores.psr.item2')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-600" />
                    <span className="text-base">{t('safetyManifesto.scores.psr.item3')}</span>
                  </div>
                </div>
                <Separator />
                <p className="text-base font-medium">
                  {t('safetyManifesto.scores.psr.footer')}
                </p>
              </CardContent>
            </Card>

            {/* CSR Card */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B64A3]"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-[#0B64A3]" />
                </div>
                <CardTitle className="text-xl">{t('safetyManifesto.scores.csr.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base text-muted-foreground">
                  {t('safetyManifesto.scores.csr.description')}
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <FileCheck className="w-5 h-5 mt-0.5 text-[#0B64A3]" />
                    <span className="text-base">{t('safetyManifesto.scores.csr.item1')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ClipboardCheck className="w-5 h-5 mt-0.5 text-[#0B64A3]" />
                    <span className="text-base">{t('safetyManifesto.scores.csr.item2')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <HardHat className="w-5 h-5 mt-0.5 text-[#0B64A3]" />
                    <span className="text-base">{t('safetyManifesto.scores.csr.item3')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-5 h-5 mt-0.5 text-[#0B64A3]" />
                    <span className="text-base">{t('safetyManifesto.scores.csr.item4')}</span>
                  </div>
                </div>
                <Separator />
                <p className="text-base font-medium">
                  {t('safetyManifesto.scores.csr.footer')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* The Flywheel Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('safetyManifesto.flywheel.title')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('safetyManifesto.flywheel.subtitle')}
          </p>

          <div className="max-w-3xl mx-auto mb-16 space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('safetyManifesto.flywheel.intro1')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('safetyManifesto.flywheel.intro2')}
            </p>
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {t('safetyManifesto.flywheel.intro3')}
            </p>
          </div>

          <div className="space-y-6">
            {/* Stage 1 */}
            <Card className="border-l-4 border-l-[#95ADB6] border-t-0 border-r-0 border-b-0 rounded-none bg-slate-50 dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{backgroundColor: '#95ADB6'}}>1</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('safetyManifesto.flywheel.stage1.title')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('safetyManifesto.flywheel.stage1.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 2 */}
            <Card className="border-l-4 border-l-[#0B64A3] border-t-0 border-r-0 border-b-0 rounded-none bg-slate-50 dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0B64A3] flex items-center justify-center font-bold text-white shrink-0">2</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('safetyManifesto.flywheel.stage2.title')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('safetyManifesto.flywheel.stage2.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 3 */}
            <Card className="border-l-4 border-l-emerald-500 border-t-0 border-r-0 border-b-0 rounded-none bg-slate-50 dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white shrink-0">3</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('safetyManifesto.flywheel.stage3.title')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('safetyManifesto.flywheel.stage3.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 4 */}
            <Card className="border-l-4 border-l-[#6E9075] border-t-0 border-r-0 border-b-0 rounded-none bg-slate-50 dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{backgroundColor: '#6E9075'}}>4</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('safetyManifesto.flywheel.stage4.title')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('safetyManifesto.flywheel.stage4.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 5 */}
            <Card className="border-l-4 border-l-violet-500 border-t-0 border-r-0 border-b-0 rounded-none bg-slate-50 dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center font-bold text-white shrink-0">5</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('safetyManifesto.flywheel.stage5.title')}</h3>
                    <p className="text-base text-muted-foreground">
                      {t('safetyManifesto.flywheel.stage5.description')}
                    </p>
                    <p className="text-base text-muted-foreground">
                      <strong className="text-foreground">{t('safetyManifesto.flywheel.stage5.conclusion')}</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* For Stakeholders Section */}
      <section className="pt-8 md:pt-12 pb-16 md:pb-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('safetyManifesto.stakeholders.title')}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* For Technicians */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{backgroundColor: '#95ADB6'}}></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{backgroundColor: 'rgba(171, 69, 33, 0.1)'}}>
                  <HardHat className="w-6 h-6" style={{color: '#95ADB6'}} />
                </div>
                <CardTitle className="text-lg">{t('safetyManifesto.stakeholders.technicians.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">{t('safetyManifesto.stakeholders.technicians.item1')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">{t('safetyManifesto.stakeholders.technicians.item2')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">{t('safetyManifesto.stakeholders.technicians.item3')}</span>
                </div>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground italic">
                  {t('safetyManifesto.stakeholders.technicians.quote')}
                </p>
                <Link href="/technician">
                  <Button variant="outline" size="sm" className="w-full mt-2" data-testid="button-learn-technician">
                    {t('safetyManifesto.stakeholders.technicians.learnMore')} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* For Company Owners */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B64A3]"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Briefcase className="w-6 h-6 text-[#0B64A3]" />
                </div>
                <CardTitle className="text-lg">{t('safetyManifesto.stakeholders.employers.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">{t('safetyManifesto.stakeholders.employers.item1')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">{t('safetyManifesto.stakeholders.employers.item2')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">{t('safetyManifesto.stakeholders.employers.item3')}</span>
                </div>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground italic">
                  {t('safetyManifesto.stakeholders.employers.quote')}
                </p>
                <Link href="/employer">
                  <Button variant="outline" size="sm" className="w-full mt-2" data-testid="button-learn-employer">
                    {t('safetyManifesto.stakeholders.employers.learnMore')} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* For Property Managers */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{backgroundColor: '#6E9075'}}></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{backgroundColor: 'rgba(110, 144, 117, 0.1)'}}>
                  <Building2 className="w-6 h-6" style={{color: '#6E9075'}} />
                </div>
                <CardTitle className="text-lg">{t('safetyManifesto.stakeholders.propertyManagers.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">{t('safetyManifesto.stakeholders.propertyManagers.item1')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">{t('safetyManifesto.stakeholders.propertyManagers.item2')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-600" />
                  <span className="text-base">{t('safetyManifesto.stakeholders.propertyManagers.item3')}</span>
                </div>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground italic">
                  {t('safetyManifesto.stakeholders.propertyManagers.quote')}
                </p>
                <Link href="/property-manager">
                  <Button variant="outline" size="sm" className="w-full mt-2" data-testid="button-learn-pm">
                    {t('safetyManifesto.stakeholders.propertyManagers.learnMore')} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Why Scores Work Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('safetyManifesto.whyMatters.title')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            {t('safetyManifesto.whyMatters.subtitle')}
          </p>
          
          <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4">
              <p className="text-base text-muted-foreground">
                {t('safetyManifesto.whyMatters.p1')}
              </p>
              <p className="text-base text-muted-foreground">
                {t('safetyManifesto.whyMatters.p2')}
              </p>
              <div className="space-y-3 py-4">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-0.5 text-[#95ADB6]" />
                  <p className="text-base"><strong>{t('safetyManifesto.whyMatters.psrPoint')}</strong> {t('safetyManifesto.whyMatters.psrPointDesc')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-0.5 text-[#0B64A3]" />
                  <p className="text-base"><strong>{t('safetyManifesto.whyMatters.csrPoint')}</strong> {t('safetyManifesto.whyMatters.csrPointDesc')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-0.5 text-[#6E9075]" />
                  <p className="text-base"><strong>{t('safetyManifesto.whyMatters.pmPoint')}</strong> {t('safetyManifesto.whyMatters.pmPointDesc')}</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-foreground text-center pt-4">
                {t('safetyManifesto.whyMatters.conclusion1')} <br />
                {t('safetyManifesto.whyMatters.conclusion2')}<br />
                {t('safetyManifesto.whyMatters.conclusion3')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-0" />

      {/* FAQ Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('safetyManifesto.faqs.title')}
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="new-psr" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-new-psr">
                {t('safetyManifesto.faqs.newPsr.question')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('safetyManifesto.faqs.newPsr.answer')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="fake-inspection" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-fake-inspection">
                {t('safetyManifesto.faqs.fakeInspection.question')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('safetyManifesto.faqs.fakeInspection.answer')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="psr-employer" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-psr-employer">
                {t('safetyManifesto.faqs.psrEmployer.question')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('safetyManifesto.faqs.psrEmployer.answer')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="new-company" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-new-company">
                {t('safetyManifesto.faqs.newCompany.question')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('safetyManifesto.faqs.newCompany.answer')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pm-see-psr" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-pm-see-psr">
                {t('safetyManifesto.faqs.pmSeePsr.question')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('safetyManifesto.faqs.pmSeePsr.answer')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="disagree-csr" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-disagree-csr">
                {t('safetyManifesto.faqs.disagreeCsr.question')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('safetyManifesto.faqs.disagreeCsr.answer')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="surveillance" className="bg-white dark:bg-slate-950 rounded-lg border px-6">
              <AccordionTrigger className="text-left text-base font-medium" data-testid="accordion-surveillance">
                {t('safetyManifesto.faqs.surveillance.question')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                {t('safetyManifesto.faqs.surveillance.answer')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 text-center" style={{backgroundColor: '#193a63'}}>
        <div className="max-w-3xl mx-auto text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('safetyManifesto.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('safetyManifesto.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#193a63] hover:bg-blue-50" onClick={() => setShowRegistration(true)} data-testid="button-cta-start">
              {t('safetyManifesto.cta.getStarted')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link href="/modules/company-safety-rating">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" data-testid="button-cta-csr">
                {t('safetyManifesto.cta.learnCsr')}
              </Button>
            </Link>
            <Link href="/changelog/psr">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" data-testid="button-cta-psr">
                {t('safetyManifesto.cta.learnPsr')}
              </Button>
            </Link>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            {t('safetyManifesto.cta.freeNote')}
          </p>
        </div>
      </section>

      {/* Registration Modal */}
      <EmployerRegistration 
        open={showRegistration} 
        onOpenChange={setShowRegistration}
      />
    </div>
  );
}
